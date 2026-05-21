import type { Schedule, SportEvent } from './types';
import { findSportOfEvent } from '../data/sports';

const DAYS_IN_CYCLE = 15;

/**
 * Schedule logic mirrors real Summer Olympics:
 *
 *   Week 1 (days 1-7):  Swimming runs daily (finals each night).
 *                       Judo, fencing, weightlifting, cycling, archery,
 *                       gymnastics, table tennis — early-Games sports.
 *                       Athletics events run only as heats (not in catalog).
 *
 *   Week 2 (days 8-15): Athletics is the centerpiece — all events here,
 *                       sprints first, marathons last.
 *                       Boxing/wrestling medal rounds.
 *                       Tennis finals, team sports finals clustered on
 *                       the closing weekend (days 13-15).
 *
 * Marquees within these windows still cluster toward the back.
 */

/** Sports that primarily run in week 1 (days 1-7). */
const WEEK_1_SPORTS = new Set([
  'swimming',     // 8 days of swimming finals
  'judo',
  'fencing',
  'weightlifting',
  'cycling',      // road races mostly week 1
  'archery',
  'gymnastics',
  'tabletennis',
  'rowing',
  'waterpolo',    // group stages week 1
  'diving',
  'shooting',
  'canoe',
  'equestrian',
  'badminton',
]);

/** Sports that primarily run in week 2 (days 8-15). */
const WEEK_2_SPORTS = new Set([
  'athletics',
  'boxing',
  'wrestling',
  'tennis',
  'basketball',
  'football',
  'volleyball',
  'handball',
  'hockey',
  'rugby',
  'triathlon',
  'sailing',
  'golf',
]);

/**
 * Marquee events get pushed toward the final weekend (days 13-15)
 * regardless of which week their sport runs in.
 */
const MARQUEE_EVENTS = new Set([
  // Athletics finales (last few days of week 2)
  'm100', 'w100', 'm200', 'mmar', 'wmar',
  // Gymnastics all-arounds (end of week 1)
  'maa', 'waa',
  // Team sports finals (final weekend)
  'mbb', 'wbb', 'mfb', 'wfb', 'mvb', 'wvb',
  'mhb', 'whb', 'mhk', 'whk', 'mwp', 'wwp',
  'mrugby', 'wrugby',
  // Tennis singles finals (final weekend)
  'm_tennis_s', 'w_tennis_s',
  // Boxing showpieces (end of week 2)
  'm_box_hw',
  // Swimming relays (end of week 1 — closing-night spectacle)
  'm4x100fr', 'mix4x100im',
  // Triathlon + golf finals (week 2 showcase)
  'm_tri', 'w_tri', 'm_golf', 'w_golf',
]);

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Find which sport an event belongs to and bucket into week 1 / week 2. */
function bucketByWeek(events: readonly SportEvent[]): {
  week1: SportEvent[];
  week2: SportEvent[];
} {
  const week1: SportEvent[] = [];
  const week2: SportEvent[] = [];
  for (const e of events) {
    const sport = findSportOfEvent(e.id);
    if (sport && WEEK_2_SPORTS.has(sport.id)) week2.push(e);
    else if (sport && WEEK_1_SPORTS.has(sport.id)) week1.push(e);
    else week1.push(e); // unknown sport defaults to week 1
  }
  return { week1, week2 };
}

/**
 * Distribute a list of events across a range of days [startDay, endDay].
 * Marquee events are biased toward the LAST days of the range.
 */
function distributeAcrossDays(
  events: SportEvent[],
  startDay: number,
  endDay: number,
  schedule: Schedule,
): void {
  const dayCount = endDay - startDay + 1;
  const marquees = shuffle(events.filter((e) => MARQUEE_EVENTS.has(e.id)));
  const regulars = shuffle(events.filter((e) => !MARQUEE_EVENTS.has(e.id)));

  // Spread regulars evenly across the range
  const perDay = Math.floor(regulars.length / dayCount);
  const remainder = regulars.length % dayCount;
  let regIdx = 0;
  for (let i = 0; i < dayCount; i++) {
    // Extras go to later days
    const extra = i >= dayCount - remainder ? 1 : 0;
    const count = perDay + extra;
    const dayNum = startDay + i;
    const dayObj = schedule.find((d) => d.day === dayNum)!;
    for (let n = 0; n < count && regIdx < regulars.length; n++) {
      dayObj.eventIds.push(regulars[regIdx++].id);
    }
  }

  // Marquees: concentrate on the last 3 days of the range (or all if range < 3)
  const finalDayCount = Math.min(3, dayCount);
  const finalStart = endDay - finalDayCount + 1;
  let marqIdx = 0;
  // Distribute weighted: last day gets most
  const weights = finalDayCount === 3 ? [0.2, 0.3, 0.5] :
                  finalDayCount === 2 ? [0.4, 0.6] : [1.0];
  for (let i = 0; i < finalDayCount; i++) {
    const dayNum = finalStart + i;
    const dayObj = schedule.find((d) => d.day === dayNum)!;
    const share = i === finalDayCount - 1
      ? marquees.length - marqIdx                          // last bucket: everything left
      : Math.ceil(marquees.length * weights[i]);
    for (let n = 0; n < share && marqIdx < marquees.length; n++) {
      dayObj.eventIds.push(marquees[marqIdx++].id);
    }
  }
}

/**
 * Build a 15-day schedule from a flat list of events.
 *
 * - Week 1 events go into days 1-7
 * - Week 2 events go into days 8-15
 * - Within each week, marquees cluster toward the end
 */
export function generateSchedule(events: readonly SportEvent[]): Schedule {
  const schedule: Schedule = [];
  for (let day = 1; day <= DAYS_IN_CYCLE; day++) {
    schedule.push({ day, eventIds: [] });
  }

  const { week1, week2 } = bucketByWeek(events);
  distributeAcrossDays(week1, 1, 7, schedule);
  distributeAcrossDays(week2, 8, 15, schedule);

  return schedule;
}
