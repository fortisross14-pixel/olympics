import type {
  CompletedCycle,
  CountryCode,
  Cycle,
  MedalCount,
  Ratings,
} from './types';
import { SPORTS } from '../data/sports';

/**
 * Total "score" for a nation in a cycle = sum of its ratings across
 * all core (non-demonstration) sports. This is the headline number
 * shown on the rankings screen and nation popup (e.g. 88).
 */
export function nationScore(
  code: CountryCode,
  ratings: Ratings,
  demoSportIds: ReadonlySet<string>,
): number {
  const r = ratings[code];
  if (!r) return 0;
  let total = 0;
  for (const sport of SPORTS) {
    if (demoSportIds.has(sport.id)) continue;
    total += r[sport.id] ?? 0;
  }
  return Math.round(total * 10) / 10;
}

/** Per-sport rating breakdown for a nation, core sports only. */
export interface SportRating {
  sportId: string;
  sportName: string;
  rating: number;
}

export function nationSportRatings(
  code: CountryCode,
  ratings: Ratings,
): SportRating[] {
  const r = ratings[code] ?? {};
  return SPORTS.map((s) => ({
    sportId: s.id,
    sportName: s.name,
    rating: r[s.id] ?? 0,
  }));
}

/** Sum a nation's medals across all archived cycles (official only). */
export function nationAllTimeMedals(
  code: CountryCode,
  history: readonly CompletedCycle[],
): MedalCount {
  const total: MedalCount = { gold: 0, silver: 0, bronze: 0 };
  for (const cycle of history) {
    const m = cycle.medals[code];
    if (!m) continue;
    total.gold += m.gold;
    total.silver += m.silver;
    total.bronze += m.bronze;
  }
  return total;
}

/** A nation's medals in the current cycle (official only). */
export function nationCurrentMedals(
  code: CountryCode,
  cycle: Cycle | null,
): MedalCount {
  if (!cycle) return { gold: 0, silver: 0, bronze: 0 };
  return cycle.medals[code] ?? { gold: 0, silver: 0, bronze: 0 };
}
