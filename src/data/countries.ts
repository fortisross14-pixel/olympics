import type { Country } from '../engine/types';

/**
 * 20-country roster across 4 tiers, with real-world specialty sports.
 *
 * Specialties: hard-coded sports where the country gets a fixed rating 5
 * regardless of budget. Cost is deducted from total budget before the
 * remaining points are distributed across other sports.
 *
 * Budget per tier (set in engine/ratings.ts):
 *   Tier 1: 90-100 points (3 countries: USA, CHN, RUS)
 *   Tier 2: 55-70 points (6 countries)
 *   Tier 3: 35-50 points (7 countries)
 *   Tier 4: 22-32 points (4 countries)
 */
export const COUNTRIES: Country[] = [
  // Tier 1 — superpowers, broad strength + multiple specialties
  { code: 'USA', name: 'United States', tier: 1, specialties: ['athletics', 'swimming', 'basketball'] },
  { code: 'CHN', name: 'China', tier: 1, specialties: ['gymnastics', 'tabletennis', 'weightlifting'] },
  { code: 'RUS', name: 'Russia', tier: 1, specialties: ['gymnastics', 'wrestling'] },

  // Tier 2 — top tier, 1-2 specialties
  { code: 'GBR', name: 'Great Britain', tier: 2, specialties: ['cycling', 'rowing'] },
  { code: 'GER', name: 'Germany', tier: 2, specialties: ['hockey'] },
  { code: 'JPN', name: 'Japan', tier: 2, specialties: ['judo', 'gymnastics'] },
  { code: 'FRA', name: 'France', tier: 2, specialties: ['fencing', 'judo'] },
  { code: 'AUS', name: 'Australia', tier: 2, specialties: ['swimming'] },
  { code: 'ITA', name: 'Italy', tier: 2, specialties: ['fencing', 'volleyball'] },

  // Tier 3 — focused programs, 1 specialty
  { code: 'KOR', name: 'South Korea', tier: 3, specialties: ['archery', 'tabletennis'] },
  { code: 'NED', name: 'Netherlands', tier: 3, specialties: ['hockey', 'cycling'] },
  { code: 'ESP', name: 'Spain', tier: 3, specialties: ['football', 'basketball'] },
  { code: 'CAN', name: 'Canada', tier: 3 },
  { code: 'BRA', name: 'Brazil', tier: 3, specialties: ['football', 'volleyball'] },
  { code: 'KEN', name: 'Kenya', tier: 3, specialties: ['athletics'] },
  { code: 'JAM', name: 'Jamaica', tier: 3, specialties: ['athletics'] },

  // Tier 4 — narrow programs, often 1 strong specialty
  { code: 'HUN', name: 'Hungary', tier: 4, specialties: ['waterpolo', 'fencing'] },
  { code: 'POL', name: 'Poland', tier: 4, specialties: ['volleyball'] },
  { code: 'NOR', name: 'Norway', tier: 4, specialties: ['handball'] },
  { code: 'NZL', name: 'New Zealand', tier: 4, specialties: ['rowing', 'rugby'] },
];

export function findCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
