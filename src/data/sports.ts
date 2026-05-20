import type { Sport, SportEvent } from '../engine/types';

/**
 * 20 sports, 106 events. Summer Olympics only.
 *
 * Distributed so no single sport dominates the medal count.
 * Athletics and swimming still lead (as in real Olympics) but the
 * gap to other sports is narrower than a pure-realism mapping.
 *
 * Baselines are tuned to give realistic gold-medal performances.
 */
export const SPORTS: Sport[] = [
  // ============ ATHLETICS (14) ============
  {
    id: 'athletics',
    name: 'Athletics',
    events: [
      // sprints
      { id: 'm100', name: "Men's 100m", unit: 's', baseline: 9.80 },
      { id: 'w100', name: "Women's 100m", unit: 's', baseline: 10.70 },
      { id: 'm200', name: "Men's 200m", unit: 's', baseline: 19.50 },
      { id: 'm400', name: "Men's 400m", unit: 's', baseline: 43.50 },
      { id: 'w400', name: "Women's 400m", unit: 's', baseline: 48.40 },
      // middle/long
      { id: 'm800', name: "Men's 800m", unit: 's', baseline: 102.80 },
      { id: 'm1500', name: "Men's 1500m", unit: 's', baseline: 208.50 },
      { id: 'm5000', name: "Men's 5000m", unit: 's', baseline: 770.00 },
      { id: 'wmar', name: "Women's Marathon", unit: 'time', baseline: 8100 },
      { id: 'mmar', name: "Men's Marathon", unit: 'time', baseline: 7350 },
      // hurdles
      { id: 'm110h', name: "Men's 110m Hurdles", unit: 's', baseline: 12.95 },
      // field
      { id: 'mhj', name: "Men's High Jump", unit: 'm', baseline: 2.38 },
      { id: 'wlj', name: "Women's Long Jump", unit: 'm', baseline: 7.10 },
      { id: 'mjav', name: "Men's Javelin", unit: 'm', baseline: 89.20 },
    ],
  },

  // ============ SWIMMING (18: 8M + 8W + 2 relays) ============
  {
    id: 'swimming',
    name: 'Swimming',
    events: [
      // Men's individual (8)
      { id: 'm50fr', name: "Men's 50m Freestyle", unit: 's', baseline: 21.00 },
      { id: 'm100fr', name: "Men's 100m Freestyle", unit: 's', baseline: 46.90 },
      { id: 'm200fr', name: "Men's 200m Freestyle", unit: 's', baseline: 104.50 },
      { id: 'm1500fr', name: "Men's 1500m Freestyle", unit: 's', baseline: 875.00 },
      { id: 'm100bk', name: "Men's 100m Backstroke", unit: 's', baseline: 51.80 },
      { id: 'm100br', name: "Men's 100m Breaststroke", unit: 's', baseline: 57.50 },
      { id: 'm100fl', name: "Men's 100m Butterfly", unit: 's', baseline: 50.10 },
      { id: 'm400im', name: "Men's 400m Medley", unit: 's', baseline: 245.20 },
      // Women's individual (8)
      { id: 'w50fr', name: "Women's 50m Freestyle", unit: 's', baseline: 23.65 },
      { id: 'w100fr', name: "Women's 100m Freestyle", unit: 's', baseline: 51.70 },
      { id: 'w200fr', name: "Women's 200m Freestyle", unit: 's', baseline: 114.50 },
      { id: 'w800fr', name: "Women's 800m Freestyle", unit: 's', baseline: 480.00 },
      { id: 'w100bk', name: "Women's 100m Backstroke", unit: 's', baseline: 57.40 },
      { id: 'w100br', name: "Women's 100m Breaststroke", unit: 's', baseline: 64.80 },
      { id: 'w100fl', name: "Women's 100m Butterfly", unit: 's', baseline: 55.20 },
      { id: 'w400im', name: "Women's 400m Medley", unit: 's', baseline: 256.50 },
      // Relays (2)
      { id: 'm4x100fr', name: "Men's 4×100m Freestyle Relay", unit: 's', baseline: 186.50 },
      { id: 'mix4x100im', name: "Mixed 4×100m Medley Relay", unit: 's', baseline: 218.50 },
    ],
  },

  // ============ GYMNASTICS (6) ============
  {
    id: 'gymnastics',
    name: 'Gymnastics',
    events: [
      { id: 'maa', name: "Men's All-Around", unit: 'pts', baseline: 88.50 },
      { id: 'waa', name: "Women's All-Around", unit: 'pts', baseline: 58.50 },
      { id: 'wbeam', name: "Women's Balance Beam", unit: 'pts', baseline: 15.20 },
      { id: 'mfloor', name: "Men's Floor Exercise", unit: 'pts', baseline: 15.10 },
      { id: 'mrings', name: "Men's Rings", unit: 'pts', baseline: 15.40 },
      { id: 'mph', name: "Men's Pommel Horse", unit: 'pts', baseline: 15.30 },
    ],
  },

  // ============ CYCLING (6) ============
  {
    id: 'cycling',
    name: 'Cycling',
    events: [
      { id: 'mrr', name: "Men's Road Race", unit: 'rank', baseline: null },
      { id: 'wrr', name: "Women's Road Race", unit: 'rank', baseline: null },
      { id: 'msprint', name: "Men's Track Sprint", unit: 'rank', baseline: null },
      { id: 'wsprint', name: "Women's Track Sprint", unit: 'rank', baseline: null },
      { id: 'mtt', name: "Men's Time Trial", unit: 'time', baseline: 3300 },
      { id: 'wtt', name: "Women's Time Trial", unit: 'time', baseline: 1800 },
    ],
  },

  // ============ COMBAT SPORTS ============
  // Judo (6)
  {
    id: 'judo',
    name: 'Judo',
    events: [
      { id: 'm60', name: "Men's -60kg", unit: 'rank', baseline: null },
      { id: 'm73', name: "Men's -73kg", unit: 'rank', baseline: null },
      { id: 'm90', name: "Men's -90kg", unit: 'rank', baseline: null },
      { id: 'w52', name: "Women's -52kg", unit: 'rank', baseline: null },
      { id: 'w63', name: "Women's -63kg", unit: 'rank', baseline: null },
      { id: 'w78', name: "Women's -78kg", unit: 'rank', baseline: null },
    ],
  },
  // Boxing (6)
  {
    id: 'boxing',
    name: 'Boxing',
    events: [
      { id: 'm_box_fw', name: "Men's Featherweight", unit: 'rank', baseline: null },
      { id: 'm_box_mw', name: "Men's Middleweight", unit: 'rank', baseline: null },
      { id: 'm_box_hw', name: "Men's Heavyweight", unit: 'rank', baseline: null },
      { id: 'w_box_fw', name: "Women's Flyweight", unit: 'rank', baseline: null },
      { id: 'w_box_lw', name: "Women's Lightweight", unit: 'rank', baseline: null },
      { id: 'w_box_mw', name: "Women's Middleweight", unit: 'rank', baseline: null },
    ],
  },
  // Wrestling (6)
  {
    id: 'wrestling',
    name: 'Wrestling',
    events: [
      { id: 'm_wr_57', name: "Men's Freestyle -57kg", unit: 'rank', baseline: null },
      { id: 'm_wr_74', name: "Men's Freestyle -74kg", unit: 'rank', baseline: null },
      { id: 'm_wr_97', name: "Men's Freestyle -97kg", unit: 'rank', baseline: null },
      { id: 'm_gr_77', name: "Men's Greco-Roman -77kg", unit: 'rank', baseline: null },
      { id: 'w_wr_57', name: "Women's Freestyle -57kg", unit: 'rank', baseline: null },
      { id: 'w_wr_68', name: "Women's Freestyle -68kg", unit: 'rank', baseline: null },
    ],
  },
  // Fencing (6)
  {
    id: 'fencing',
    name: 'Fencing',
    events: [
      { id: 'm_foil', name: "Men's Foil", unit: 'rank', baseline: null },
      { id: 'm_sabre', name: "Men's Sabre", unit: 'rank', baseline: null },
      { id: 'm_epee', name: "Men's Épée", unit: 'rank', baseline: null },
      { id: 'w_foil', name: "Women's Foil", unit: 'rank', baseline: null },
      { id: 'w_sabre', name: "Women's Sabre", unit: 'rank', baseline: null },
      { id: 'w_epee', name: "Women's Épée", unit: 'rank', baseline: null },
    ],
  },

  // ============ RACQUET ============
  // Tennis (4)
  {
    id: 'tennis',
    name: 'Tennis',
    events: [
      { id: 'm_tennis_s', name: "Men's Singles", unit: 'rank', baseline: null },
      { id: 'w_tennis_s', name: "Women's Singles", unit: 'rank', baseline: null },
      { id: 'w_tennis_d', name: "Women's Doubles", unit: 'rank', baseline: null },
      { id: 'mix_tennis_d', name: 'Mixed Doubles', unit: 'rank', baseline: null },
    ],
  },
  // Table Tennis (4)
  {
    id: 'tabletennis',
    name: 'Table Tennis',
    events: [
      { id: 'm_tt_s', name: "Men's Singles", unit: 'rank', baseline: null },
      { id: 'w_tt_s', name: "Women's Singles", unit: 'rank', baseline: null },
      { id: 'm_tt_d', name: "Men's Doubles", unit: 'rank', baseline: null },
      { id: 'w_tt_d', name: "Women's Doubles", unit: 'rank', baseline: null },
    ],
  },

  // ============ TEAM SPORTS (M+W) ============
  {
    id: 'basketball',
    name: 'Basketball',
    team: true,
    events: [
      { id: 'mbb', name: "Men's Basketball", unit: 'rank', baseline: null },
      { id: 'wbb', name: "Women's Basketball", unit: 'rank', baseline: null },
    ],
  },
  {
    id: 'football',
    name: 'Football',
    team: true,
    events: [
      { id: 'mfb', name: "Men's Football", unit: 'rank', baseline: null },
      { id: 'wfb', name: "Women's Football", unit: 'rank', baseline: null },
    ],
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    team: true,
    events: [
      { id: 'mvb', name: "Men's Volleyball", unit: 'rank', baseline: null },
      { id: 'wvb', name: "Women's Volleyball", unit: 'rank', baseline: null },
    ],
  },
  {
    id: 'handball',
    name: 'Handball',
    team: true,
    events: [
      { id: 'mhb', name: "Men's Handball", unit: 'rank', baseline: null },
      { id: 'whb', name: "Women's Handball", unit: 'rank', baseline: null },
    ],
  },
  {
    id: 'hockey',
    name: 'Field Hockey',
    team: true,
    events: [
      { id: 'mhk', name: "Men's Field Hockey", unit: 'rank', baseline: null },
      { id: 'whk', name: "Women's Field Hockey", unit: 'rank', baseline: null },
    ],
  },
  {
    id: 'waterpolo',
    name: 'Water Polo',
    team: true,
    events: [
      { id: 'mwp', name: "Men's Water Polo", unit: 'rank', baseline: null },
      { id: 'wwp', name: "Women's Water Polo", unit: 'rank', baseline: null },
    ],
  },
  {
    id: 'rugby',
    name: 'Rugby Sevens',
    team: true,
    events: [
      { id: 'mrugby', name: "Men's Rugby Sevens", unit: 'rank', baseline: null },
      { id: 'wrugby', name: "Women's Rugby Sevens", unit: 'rank', baseline: null },
    ],
  },

  // ============ OTHER ============
  {
    id: 'rowing',
    name: 'Rowing',
    events: [
      { id: 'm_single_sculls', name: "Men's Single Sculls", unit: 'time', baseline: 420 },
      { id: 'w_single_sculls', name: "Women's Single Sculls", unit: 'time', baseline: 460 },
      { id: 'w_double_sculls', name: "Women's Double Sculls", unit: 'time', baseline: 410 },
      { id: 'm_double_sculls', name: "Men's Double Sculls", unit: 'time', baseline: 380 },
      { id: 'm_eight', name: "Men's Eight", unit: 'time', baseline: 335 },
      { id: 'w_eight', name: "Women's Eight", unit: 'time', baseline: 360 },
    ],
  },
  {
    id: 'archery',
    name: 'Archery',
    events: [
      { id: 'm_archery_ind', name: "Men's Individual", unit: 'rank', baseline: null },
      { id: 'w_archery_ind', name: "Women's Individual", unit: 'rank', baseline: null },
      { id: 'm_archery_team', name: "Men's Team", unit: 'rank', baseline: null },
      { id: 'w_archery_team', name: "Women's Team", unit: 'rank', baseline: null },
    ],
  },
  {
    id: 'weightlifting',
    name: 'Weightlifting',
    events: [
      { id: 'm_wl_67', name: "Men's -67kg", unit: 'm', baseline: 340 }, // total kg
      { id: 'm_wl_81', name: "Men's -81kg", unit: 'm', baseline: 380 },
      { id: 'm_wl_109', name: "Men's -109kg", unit: 'm', baseline: 435 },
      { id: 'w_wl_55', name: "Women's -55kg", unit: 'm', baseline: 215 },
      { id: 'w_wl_64', name: "Women's -64kg", unit: 'm', baseline: 261 },
      { id: 'w_wl_87', name: "Women's -87kg", unit: 'm', baseline: 290 },
    ],
  },
];

export function findEvent(eventId: string): SportEvent | undefined {
  for (const s of SPORTS) {
    const e = s.events.find((ev) => ev.id === eventId);
    if (e) return e;
  }
  return undefined;
}

export function findSportOfEvent(eventId: string): Sport | undefined {
  return SPORTS.find((s) => s.events.some((e) => e.id === eventId));
}

export function allEvents(): SportEvent[] {
  return SPORTS.flatMap((s) => s.events);
}
