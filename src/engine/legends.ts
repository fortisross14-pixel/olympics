import type {
  CountryCode,
  Legend,
  LegendGender,
  LegendRarity,
  Sport,
  SportEvent,
} from './types';
import { COUNTRIES } from '../data/countries';
import { SPORTS } from '../data/sports';
import { NAME_BANKS, COUNTRY_LANGUAGE } from '../data/names';
import { eventGender } from './gender';

const MIN_ACTIVE = 8;
const MAX_ACTIVE = 12;

/** Boost to the nation's sport rating, by rarity. */
export const RARITY_BOOST: Record<LegendRarity, number> = {
  rare: 2,
  epic: 3,
  legend: 4,
};

/** Max events a legend competes in, by rarity. */
const RARITY_EVENT_COUNT: Record<LegendRarity, number> = {
  rare: 2, // 1-2 — we roll 1 or 2
  epic: 3,
  legend: 4,
};

/** Rating cap after a legend's boost is applied. */
export const RARITY_CAP: Record<LegendRarity, number> = {
  rare: 5,
  epic: 5,
  legend: 6,
};

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Roll a rarity — legends are rarest, rares most common. */
function rollRarity(): LegendRarity {
  const r = Math.random();
  if (r < 0.12) return 'legend'; // ~12%
  if (r < 0.42) return 'epic'; // ~30%
  return 'rare'; // ~58%
}

/** Generate a culturally-appropriate name for a country + gender. */
function generateName(country: CountryCode, gender: LegendGender): string {
  const lang = COUNTRY_LANGUAGE[country] ?? 'english';
  const bank = NAME_BANKS[lang];
  const first = gender === 'M' ? pick(bank.maleFirst) : pick(bank.femaleFirst);
  const surname = pick(bank.surnames);
  return `${first} ${surname}`;
}

let legendCounter = 0;
function nextLegendId(): string {
  legendCounter++;
  return `lgd-${Date.now().toString(36)}-${legendCounter}`;
}

/**
 * Create one brand-new legend with random country, sport, gender,
 * rarity, and career length. Not yet assigned to events.
 */
export function createLegend(): Legend {
  const country = pick(COUNTRIES).code;
  const sport = pick(SPORTS);
  const gender: LegendGender = Math.random() < 0.5 ? 'M' : 'W';
  const rarity = rollRarity();
  return {
    id: nextLegendId(),
    name: generateName(country, gender),
    country,
    sportId: sport.id,
    gender,
    rarity,
    careerLength: randInt(2, 5),
    gamesPlayed: 0,
    retired: false,
    medals: { gold: 0, silver: 0, bronze: 0 },
    currentEventIds: [],
  };
}

/**
 * Assign a legend to events for the current cycle. They compete in
 * events of their sport matching their gender, up to the rarity cap.
 * If fewer events exist than the cap, they get all available.
 */
export function assignLegendEvents(
  legend: Legend,
  sports: readonly Sport[],
): string[] {
  const sport = sports.find((s) => s.id === legend.sportId);
  if (!sport) return [];

  // Eligible events: matching gender, OR mixed events (anyone can do those)
  const eligible: SportEvent[] = sport.events.filter((e) => {
    const g = eventGender(e);
    return g === legend.gender || g === 'mixed';
  });

  // How many events this legend wants
  let want = RARITY_EVENT_COUNT[legend.rarity];
  if (legend.rarity === 'rare') want = randInt(1, 2); // rare: 1-2

  // Shuffle eligible and take up to `want`
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, want).map((e) => e.id);
}

/**
 * Refresh the legend roster at cycle start:
 *  1. Retire any legend who has hit their career length.
 *  2. Spawn new legends until active count is within 8-12.
 *  3. Assign event slots to all active legends for this cycle.
 *
 * Returns the full updated legend list (active + retired).
 */
export function refreshLegendsForCycle(
  existing: readonly Legend[],
  sports: readonly Sport[],
): Legend[] {
  // Mark retirements
  const updated: Legend[] = existing.map((l) => {
    if (!l.retired && l.gamesPlayed >= l.careerLength) {
      return { ...l, retired: true, currentEventIds: [] };
    }
    return { ...l };
  });

  // Count active
  let activeCount = updated.filter((l) => !l.retired).length;

  // Spawn new legends to reach a target within [MIN, MAX]
  const target = randInt(MIN_ACTIVE, MAX_ACTIVE);
  while (activeCount < target) {
    updated.push(createLegend());
    activeCount++;
  }

  // Assign events to every active legend
  for (const l of updated) {
    if (l.retired) {
      l.currentEventIds = [];
    } else {
      l.currentEventIds = assignLegendEvents(l, sports);
    }
  }

  return updated;
}

/**
 * After a cycle completes, increment gamesPlayed for active legends.
 * (Retirement itself is processed at the next cycle's refresh.)
 */
export function ageLegends(legends: readonly Legend[]): Legend[] {
  return legends.map((l) =>
    l.retired ? { ...l } : { ...l, gamesPlayed: l.gamesPlayed + 1 },
  );
}

/**
 * Build a lookup: sportId → total rating boost from active legends
 * for a given country. Multiple legends on the same country+sport
 * would stack, but the cap is applied later by the rating builder.
 */
export function legendBoostMap(
  legends: readonly Legend[],
): Map<string, { boost: number; cap: number }> {
  // key: `${country}:${sportId}`
  const map = new Map<string, { boost: number; cap: number }>();
  for (const l of legends) {
    if (l.retired) continue;
    const key = `${l.country}:${l.sportId}`;
    const existing = map.get(key);
    const boost = RARITY_BOOST[l.rarity];
    const cap = RARITY_CAP[l.rarity];
    if (existing) {
      // Stack boosts, take the highest cap
      map.set(key, {
        boost: existing.boost + boost,
        cap: Math.max(existing.cap, cap),
      });
    } else {
      map.set(key, { boost, cap });
    }
  }
  return map;
}

/** Active legends competing in a given event this cycle. */
export function legendsInEvent(
  eventId: string,
  legends: readonly Legend[],
): Legend[] {
  return legends.filter((l) => !l.retired && l.currentEventIds.includes(eventId));
}
