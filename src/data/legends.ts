import type { CountryCode } from '../engine/types';

/**
 * Legend rarity tiers.
 *   legend: 1-2 per cycle, dominates 4-5 events
 *   epic:   5-10 per cycle, dominates 3 events
 *   rare:   ~20 per cycle, dominates 2 events
 * Common/uncommon stars (1 event) handled by ratings, not named.
 */
export type LegendRarity = 'legend' | 'epic' | 'rare';

export interface Legend {
  id: string;
  name: string;
  country: CountryCode;
  rarity: LegendRarity;
  /**
   * Sport IDs this legend competes in. Engine will boost the country's
   * effective rating for those sports when this legend is active.
   * A legend often dominates one sport but covers multiple events within it.
   */
  sportIds: readonly string[];
}

/**
 * Fictional legend roster. Names are realistic for each country
 * (research-based patterns: given names + surnames that exist in
 * the relevant naming traditions). All characters are invented —
 * any resemblance to real athletes is coincidental.
 *
 * Iteration 6 ships this as DATA ONLY. Engine integration (legends
 * boosting their country's effective rating in events) is a separate
 * task. For now, these can be displayed on a future Stars screen
 * but do not affect simulation.
 */
export const LEGENDS: Legend[] = [
  // ============ LEGENDS (rarest tier) ============
  {
    id: 'lgd-jam-sprint',
    name: 'Theron Whitfield',
    country: 'JAM',
    rarity: 'legend',
    sportIds: ['athletics'],
  },
  {
    id: 'lgd-usa-swim',
    name: 'Easton Caldwell',
    country: 'USA',
    rarity: 'legend',
    sportIds: ['swimming'],
  },

  // ============ EPIC ============
  // Athletics — sprinting traditions
  {
    id: 'epic-jam-sprint-2',
    name: 'Shaniqua Beckford',
    country: 'JAM',
    rarity: 'epic',
    sportIds: ['athletics'],
  },
  {
    id: 'epic-usa-sprint',
    name: 'Marcus Holloway',
    country: 'USA',
    rarity: 'epic',
    sportIds: ['athletics'],
  },
  // Athletics — distance running (Kenya)
  {
    id: 'epic-ken-distance',
    name: 'Eliud Kipkemboi',
    country: 'KEN',
    rarity: 'epic',
    sportIds: ['athletics'],
  },
  {
    id: 'epic-ken-marathon',
    name: 'Faith Jeptoo',
    country: 'KEN',
    rarity: 'epic',
    sportIds: ['athletics'],
  },
  // Swimming
  {
    id: 'epic-aus-swim',
    name: 'Harriet Maddox',
    country: 'AUS',
    rarity: 'epic',
    sportIds: ['swimming'],
  },
  {
    id: 'epic-chn-swim',
    name: 'Liu Wenjie',
    country: 'CHN',
    rarity: 'epic',
    sportIds: ['swimming'],
  },
  // Gymnastics
  {
    id: 'epic-usa-gym',
    name: 'Sienna Brooks',
    country: 'USA',
    rarity: 'epic',
    sportIds: ['gymnastics'],
  },
  {
    id: 'epic-chn-gym',
    name: 'Zhang Mingyu',
    country: 'CHN',
    rarity: 'epic',
    sportIds: ['gymnastics'],
  },
  {
    id: 'epic-jpn-gym',
    name: 'Kenta Morimoto',
    country: 'JPN',
    rarity: 'epic',
    sportIds: ['gymnastics'],
  },

  // ============ RARE ============
  // Tennis
  {
    id: 'rare-esp-tennis',
    name: 'Iván Bellido',
    country: 'ESP',
    rarity: 'rare',
    sportIds: ['tennis'],
  },
  {
    id: 'rare-ita-tennis',
    name: 'Sofia Lombardi',
    country: 'ITA',
    rarity: 'rare',
    sportIds: ['tennis'],
  },
  {
    id: 'rare-usa-tennis',
    name: 'Brielle Carter',
    country: 'USA',
    rarity: 'rare',
    sportIds: ['tennis'],
  },

  // Judo (Japan, France, Korea)
  {
    id: 'rare-jpn-judo',
    name: 'Haruki Tanaka',
    country: 'JPN',
    rarity: 'rare',
    sportIds: ['judo'],
  },
  {
    id: 'rare-fra-judo',
    name: 'Camille Dubois',
    country: 'FRA',
    rarity: 'rare',
    sportIds: ['judo'],
  },
  {
    id: 'rare-kor-judo',
    name: 'Park Min-seok',
    country: 'KOR',
    rarity: 'rare',
    sportIds: ['judo'],
  },

  // Boxing
  {
    id: 'rare-cub-box',
    name: 'Dimitri Volkov',
    country: 'RUS',
    rarity: 'rare',
    sportIds: ['boxing'],
  },
  {
    id: 'rare-gbr-box',
    name: 'Lewis Pemberton',
    country: 'GBR',
    rarity: 'rare',
    sportIds: ['boxing'],
  },

  // Wrestling
  {
    id: 'rare-rus-wrestling',
    name: 'Anatoly Sokolov',
    country: 'RUS',
    rarity: 'rare',
    sportIds: ['wrestling'],
  },
  {
    id: 'rare-usa-wrestling',
    name: 'Tyrone Mitchell',
    country: 'USA',
    rarity: 'rare',
    sportIds: ['wrestling'],
  },

  // Fencing (Italy, Hungary, France)
  {
    id: 'rare-ita-fencing',
    name: 'Lorenzo Bianchi',
    country: 'ITA',
    rarity: 'rare',
    sportIds: ['fencing'],
  },
  {
    id: 'rare-hun-fencing',
    name: 'Réka Kovács',
    country: 'HUN',
    rarity: 'rare',
    sportIds: ['fencing'],
  },

  // Cycling (Netherlands, France, GB)
  {
    id: 'rare-ned-cycling',
    name: 'Joost van der Berg',
    country: 'NED',
    rarity: 'rare',
    sportIds: ['cycling'],
  },
  {
    id: 'rare-gbr-cycling',
    name: 'Imogen Hartley',
    country: 'GBR',
    rarity: 'rare',
    sportIds: ['cycling'],
  },

  // Archery (Korea)
  {
    id: 'rare-kor-archery',
    name: 'Kim Ji-won',
    country: 'KOR',
    rarity: 'rare',
    sportIds: ['archery'],
  },

  // Table Tennis (China)
  {
    id: 'rare-chn-tt',
    name: 'Wang Xinyi',
    country: 'CHN',
    rarity: 'rare',
    sportIds: ['tabletennis'],
  },

  // Rowing (GB, Netherlands, NZ)
  {
    id: 'rare-gbr-rowing',
    name: 'Henry Ashworth',
    country: 'GBR',
    rarity: 'rare',
    sportIds: ['rowing'],
  },
  {
    id: 'rare-nzl-rowing',
    name: 'Bridget Harlow',
    country: 'NZL',
    rarity: 'rare',
    sportIds: ['rowing'],
  },

  // Weightlifting (China, Norway as outlier)
  {
    id: 'rare-chn-wl',
    name: 'Chen Haoran',
    country: 'CHN',
    rarity: 'rare',
    sportIds: ['weightlifting'],
  },

  // Gymnastics — more depth
  {
    id: 'rare-rus-gym',
    name: 'Yelena Voronova',
    country: 'RUS',
    rarity: 'rare',
    sportIds: ['gymnastics'],
  },

  // Swimming — more depth
  {
    id: 'rare-usa-swim',
    name: 'Caroline Wexford',
    country: 'USA',
    rarity: 'rare',
    sportIds: ['swimming'],
  },
  {
    id: 'rare-hun-swim',
    name: 'Bálint Nagy',
    country: 'HUN',
    rarity: 'rare',
    sportIds: ['swimming'],
  },

  // Athletics — depth
  {
    id: 'rare-bra-athletics',
    name: 'Rafaela Cardoso',
    country: 'BRA',
    rarity: 'rare',
    sportIds: ['athletics'],
  },
  {
    id: 'rare-pol-athletics',
    name: 'Maciej Wójcik',
    country: 'POL',
    rarity: 'rare',
    sportIds: ['athletics'],
  },
  {
    id: 'rare-nor-athletics',
    name: 'Sigrid Halvorsen',
    country: 'NOR',
    rarity: 'rare',
    sportIds: ['athletics'],
  },
  {
    id: 'rare-ger-athletics',
    name: 'Maximilian Köhler',
    country: 'GER',
    rarity: 'rare',
    sportIds: ['athletics'],
  },
  {
    id: 'rare-can-athletics',
    name: 'Olivia Chen',
    country: 'CAN',
    rarity: 'rare',
    sportIds: ['athletics'],
  },
];

export function legendsByCountry(code: CountryCode): Legend[] {
  return LEGENDS.filter((l) => l.country === code);
}

export function legendsBySport(sportId: string): Legend[] {
  return LEGENDS.filter((l) => l.sportIds.includes(sportId));
}

export function legendsByRarity(rarity: LegendRarity): Legend[] {
  return LEGENDS.filter((l) => l.rarity === rarity);
}
