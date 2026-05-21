import type { Country, CountryCode, Ratings, Sport } from './types';
import { randRange, round1, clamp } from './random';

/**
 * Budget-based rating system.
 *
 * Each country has a "total budget" of points to distribute across all
 * non-demonstration sports as ratings 1-5. Specialties are pre-allocated
 * at rating 5 and their cost is subtracted from the budget first.
 *
 * Tier ranges (per cycle, randomized ±10% to vary cycle-to-cycle):
 *   Tier 1: 90-100 (3 specialties allowed at avg 4 each elsewhere)
 *   Tier 2: 55-70
 *   Tier 3: 35-50
 *   Tier 4: 22-32
 *
 * Constants for downstream simulation:
 *   - HOST_BONUS: +0.7 added to every sport rating for the host country
 *   - DEMO_HOST_RATING: 3 (host gets this in their demo sports)
 *   - DEMO_OTHER_RATING: 1 (every other country gets this in demos)
 */

export const HOST_BONUS = 0.7;
export const DEMO_HOST_RATING = 3;
export const DEMO_OTHER_RATING = 1;

const TIER_BUDGETS: Record<number, [number, number]> = {
  1: [90, 100],
  2: [55, 70],
  3: [35, 50],
  4: [22, 32],
};

/** Minimum rating any country has in any sport. */
const RATING_FLOOR = 1;
/** Maximum rating before host bonus. */
const RATING_CEILING = 5;

/**
 * Distribute `remainingBudget` extra points across `slotCount` sport slots
 * as integer increments above the floor. Each slot starts at RATING_FLOOR
 * and can be boosted up to RATING_CEILING.
 *
 * The distribution is weighted-random: not even, not extreme — bell-ish.
 */
function distributeBudget(remainingBudget: number, slotCount: number): number[] {
  const ratings: number[] = new Array(slotCount).fill(RATING_FLOOR);
  let pointsToSpend = remainingBudget - slotCount * RATING_FLOOR;
  if (pointsToSpend <= 0) return ratings;

  const maxBoost = RATING_CEILING - RATING_FLOOR; // 4 extra per slot maximum

  // Spend points one at a time on a random slot that isn't capped.
  let safety = pointsToSpend * 4;
  while (pointsToSpend > 0 && safety-- > 0) {
    const idx = Math.floor(Math.random() * slotCount);
    if (ratings[idx] - RATING_FLOOR < maxBoost) {
      ratings[idx]++;
      pointsToSpend--;
    }
  }

  return ratings;
}

/**
 * Build a fresh Ratings table for one cycle, including demo sports.
 *
 * @param countries  All tracked countries
 * @param sports     All sports (core + demonstration for this cycle)
 * @param demoSportIds  IDs of sports that are demonstration sports this cycle
 * @param hostCountryCode  Host country (gets +0.7 across non-demo sports;
 *                          and rating 3 in demo sports). Null = no boost.
 * @param legendBoosts  Map of `${country}:${sportId}` → { boost, cap }.
 *                       Applied last; boosts a country's sport rating and
 *                       allows it to exceed 5 (up to the rarity cap of 6).
 */
export function generateRatings(
  countries: readonly Country[],
  sports: readonly Sport[],
  demoSportIds: ReadonlySet<string>,
  hostCountryCode: CountryCode | null = null,
  legendBoosts: ReadonlyMap<string, { boost: number; cap: number }> = new Map(),
): Ratings {
  const ratings: Ratings = {};
  const coreSports = sports.filter((s) => !demoSportIds.has(s.id));

  for (const c of countries) {
    ratings[c.code] = {};

    // Total budget for this country, this cycle
    const [bMin, bMax] = TIER_BUDGETS[c.tier];
    const budget = Math.round(randRange(bMin, bMax));

    // Specialties: rating 5, cost 5 each from budget
    const specialties = c.specialties ?? [];
    const specialtyCost = specialties.length * RATING_CEILING;
    let remainingBudget = budget - specialtyCost;

    // Apply specialty ratings
    for (const sportId of specialties) {
      if (coreSports.some((s) => s.id === sportId)) {
        ratings[c.code][sportId] = RATING_CEILING;
      }
    }

    // Non-specialty core sports — get budget-distributed ratings
    const nonSpecialty = coreSports.filter((s) => !specialties.includes(s.id));
    const minNeeded = nonSpecialty.length * RATING_FLOOR;
    if (remainingBudget < minNeeded) remainingBudget = minNeeded;
    const distributed = distributeBudget(remainingBudget, nonSpecialty.length);
    nonSpecialty.forEach((s, i) => {
      ratings[c.code][s.id] = distributed[i];
    });

    // Apply host bonus (after distribution, on top of everything)
    if (c.code === hostCountryCode) {
      for (const sportId of Object.keys(ratings[c.code])) {
        ratings[c.code][sportId] = round1(
          clamp(ratings[c.code][sportId] + HOST_BONUS, 1, 5),
        );
      }
    }

    // Demonstration sports: fixed rating regardless of budget
    for (const sportId of demoSportIds) {
      ratings[c.code][sportId] =
        c.code === hostCountryCode ? DEMO_HOST_RATING : DEMO_OTHER_RATING;
    }

    // Legend boosts — applied last. Can push a rating above 5 (cap 6).
    for (const sport of coreSports) {
      const key = `${c.code}:${sport.id}`;
      const lb = legendBoosts.get(key);
      if (lb) {
        const base = ratings[c.code][sport.id] ?? 1;
        ratings[c.code][sport.id] = round1(
          clamp(base + lb.boost, 1, lb.cap),
        );
      }
    }
  }

  return ratings;
}
