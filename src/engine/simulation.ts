import type {
  CountryCode,
  CycleYear,
  EventResult,
  PodiumPlace,
  Qualifiers,
  Ratings,
  SportEvent,
} from './types';

/**
 * Per-finalist performance score = (rating * 20) + variance.
 *
 * Tuned for ~60% favorite-win rate in real 8-finalist scenarios:
 *   With a single favorite rated 5 and 7 underdogs rated 4,
 *   the favorite wins ~65% of the time (each underdog has many tries
 *   to roll high, so total variance matters more than 1v1).
 *
 * With 8 finalists:
 *   - rating 5 → 80-120 baseline
 *   - rating 4 → 60-100
 *   - rating 3 → 40-80
 *   - rating 1 → 0-40
 * Overlap zones between adjacent ratings keep upsets common-but-uncommon.
 */
const VARIANCE = 40; // total range, applied as (random - 0.5) * VARIANCE

interface ScoredFinalist {
  country: CountryCode;
  score: number;
}

function scoreFinalists(
  qualifiers: readonly CountryCode[],
  ratings: Ratings,
  sportId: string,
): ScoredFinalist[] {
  return qualifiers
    .map((code) => {
      const rating = ratings[code][sportId];
      const skill = rating * 20;
      const noise = (Math.random() - 0.5) * VARIANCE;
      return { country: code, score: skill + noise };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Convert a finalist's raw score into a realistic display value
 * for the event's unit. Gold-medal performance corresponds to a
 * score of ~100; lower scores produce worse times/marks.
 */
function scoreToValue(
  event: SportEvent,
  score: number,
  rank: 1 | 2 | 3,
): number | string | null {
  if (event.baseline === null) return null; // rank-only event

  const gap = 100 - score; // how far below "gold-rating" performance
  const rankPenalty = (rank - 1) * 0.04; // tiny separation per place

  switch (event.unit) {
    case 's': {
      // Lower = better. Higher gap → slower time.
      const val = event.baseline + gap * 0.012 + rankPenalty;
      return Math.round(val * 100) / 100;
    }
    case 'm': {
      // Higher = better. Higher gap → shorter mark.
      const val = event.baseline - gap * 0.008 - rank * 0.02;
      return Math.round(val * 100) / 100;
    }
    case 'pts': {
      // Higher = better.
      const val = event.baseline - gap * 0.05 - rank * 0.3;
      return Math.round(val * 100) / 100;
    }
    case 'time': {
      // Marathon-style: baseline is in seconds, format hh:mm:ss
      const secs = event.baseline + gap * 1.5 + rank * 6;
      const hh = Math.floor(secs / 3600);
      const mm = Math.floor((secs % 3600) / 60);
      const ss = Math.floor(secs % 60);
      return `${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    }
    case 'rank':
      return null;
  }
}

/**
 * Simulate one event final. Returns the full EventResult so the
 * caller can store it directly. Caller provides sportId since the
 * engine doesn't know about the sport catalog (which may include
 * cycle-specific demonstration sports).
 */
export function simulateEvent(
  event: SportEvent,
  sportId: string,
  qualifiers: readonly CountryCode[],
  ratings: Ratings,
  cycleYear: CycleYear,
): EventResult {
  const scored = scoreFinalists(qualifiers, ratings, sportId);
  const top3 = scored.slice(0, 3);

  const podium = top3.map((p, i) => {
    const rank = (i + 1) as 1 | 2 | 3;
    return {
      country: p.country,
      rank,
      value: scoreToValue(event, p.score, rank),
    } satisfies PodiumPlace;
  });

  return {
    eventId: event.id,
    cycleYear,
    podium: podium as [PodiumPlace, PodiumPlace, PodiumPlace],
  };
}

/**
 * Simulate every event scheduled on a given day. Caller provides a
 * sportIdByEvent map so demo events can be simulated too.
 */
export function simulateDay(
  eventIds: readonly string[],
  events: ReadonlyMap<string, SportEvent>,
  sportIdByEvent: ReadonlyMap<string, string>,
  qualifiers: Qualifiers,
  ratings: Ratings,
  cycleYear: CycleYear,
): Record<string, EventResult> {
  const out: Record<string, EventResult> = {};
  for (const id of eventIds) {
    const event = events.get(id);
    const sportId = sportIdByEvent.get(id);
    if (!event || !sportId) continue;
    out[id] = simulateEvent(event, sportId, qualifiers[id], ratings, cycleYear);
  }
  return out;
}
