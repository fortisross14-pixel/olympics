import type { Country, Qualifiers, Ratings, Sport } from './types';

const QUALIFIERS_PER_EVENT = 8;

/**
 * For each event, pick 8 qualifying countries.
 *
 * Weight = rating^2 + small random noise. Squaring the rating sharpens
 * the field (top-rated countries reliably qualify) while noise allows
 * the occasional underdog. This is qualifying, not the final — upsets
 * here are common.
 */
export function generateQualifiers(
  countries: readonly Country[],
  sports: readonly Sport[],
  ratings: Ratings,
): Qualifiers {
  const qualifiers: Qualifiers = {};

  for (const sport of sports) {
    for (const event of sport.events) {
      const weighted = countries.map((c) => ({
        code: c.code,
        weight: Math.pow(ratings[c.code][sport.id], 2) + Math.random() * 3,
      }));
      weighted.sort((a, b) => b.weight - a.weight);
      qualifiers[event.id] = weighted
        .slice(0, QUALIFIERS_PER_EVENT)
        .map((w) => w.code);
    }
  }

  return qualifiers;
}
