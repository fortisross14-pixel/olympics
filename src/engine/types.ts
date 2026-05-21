// ============================================================
// Domain types — shared across data, engine, store, UI
// Shaped for multi-cycle from the start: every result carries
// its cycle year so history queries (records, totals) work later.
// ============================================================

// --- Static reference data ---

export type CountryCode = string; // 'USA', 'CHN', etc.

export type CountryTier = 1 | 2 | 3 | 4;

export interface Country {
  code: CountryCode;
  name: string;
  tier: CountryTier;
  /**
   * Hard-coded specialty sports — country gets a fixed rating 5 in these.
   * Cost is subtracted from the budget before remaining points are distributed.
   * 0-3 specialties per country, by design.
   */
  specialties?: readonly string[];
}

export type EventUnit =
  | 's'      // seconds (lower better)
  | 'm'      // meters (higher better)
  | 'pts'    // points (higher better, e.g. gymnastics)
  | 'time'   // hh:mm:ss formatted string (lower better, e.g. marathon)
  | 'rank';  // no numeric result, just placement (judo, team sports)

export type EventGender = 'M' | 'W' | 'mixed';

export interface SportEvent {
  id: string;
  name: string;
  unit: EventUnit;
  /**
   * Reference performance for a "5-rating" gold medal result.
   * Used by the simulator to ground generated values in reality.
   * Null for rank-only events.
   */
  baseline: number | null;
}

export interface Sport {
  id: string;
  name: string;
  /** True for team sports — no stars/legends will ever attach (per design) */
  team?: boolean;
  /**
   * True for demonstration sports — host-exclusive, doesn't count toward
   * medal totals, only exists for that cycle. Defined per host city.
   */
  demonstration?: boolean;
  events: SportEvent[];
}

export interface City {
  name: string;
  country: string;
  /** Optional flavor text shown on the host pick card */
  bonus: string;
  /**
   * If the host country is one of our tracked Countries, include its code
   * to apply the in-game home rating boost. Null = flavor only.
   */
  countryCode: CountryCode | null;
  /** Primary theme color (CSS hex) — used for accents, tabs, headers */
  themePrimary: string;
  /** Secondary theme color (CSS hex) — used for subtle backgrounds, day strip */
  themeSecondary: string;
  /**
   * Demonstration sports this city brings to its Games. 0-2 sports
   * (each with 1+ events). Host country gets rating 3 in these, every
   * other country gets rating 1. Medals from demo events don't count
   * toward totals and disappear after the cycle is archived.
   */
  demonstrationSports?: readonly Sport[];
}

// --- Cycle state (one Olympic cycle) ---

export type CycleYear = number; // 2028, 2032, ...

/** Country rating per sport, 1.0-5.0 */
export type Ratings = Record<CountryCode, Record<string /* sportId */, number>>;

/** 8 qualified country codes per event */
export type Qualifiers = Record<string /* eventId */, CountryCode[]>;

export interface DayPlan {
  day: number; // 1..5 in MVP, 1..16 later
  eventIds: string[];
}

export type Schedule = DayPlan[];

export interface PodiumPlace {
  country: CountryCode;
  rank: 1 | 2 | 3;
  /**
   * Numeric value for timed/measured/scored events.
   * String for 'time' unit. Null for 'rank' events.
   */
  value: number | string | null;
}

export interface EventResult {
  eventId: string;
  cycleYear: CycleYear;
  podium: [PodiumPlace, PodiumPlace, PodiumPlace];
  /** Country that had the highest rating going in (the pre-race favorite) */
  favorite: CountryCode;
  /** True when the gold medalist was NOT the favorite */
  upset: boolean;
}

export interface MedalCount {
  gold: number;
  silver: number;
  bronze: number;
}

export type MedalTable = Record<CountryCode, MedalCount>;

export type CycleStage =
  | 'pregame'    // cycle not started
  | 'host'       // picking city
  | 'qualified'  // host picked, qualifiers generated, can browse
  | 'racing'     // mid-Games, simulating days
  | 'complete';  // all days done

export interface Cycle {
  year: CycleYear;
  stage: CycleStage;
  hostCity: City | null;
  ratings: Ratings;
  qualifiers: Qualifiers;
  schedule: Schedule;
  /** results[eventId] once that event has run */
  results: Record<string, EventResult>;
  /** Days that have been simulated (day numbers) */
  daysSimulated: number[];
  /** Current day the user is viewing in The Games tab */
  currentDay: number;
  /** Medal counts from non-demonstration events (the "official" count) */
  medals: MedalTable;
  /** Medal counts from demonstration events (shown separately, not in totals) */
  demoMedals: MedalTable;
  /** Sport IDs that are demonstration sports this cycle */
  demoSportIds: string[];
}

// --- Legends ---

export type LegendRarity = 'rare' | 'epic' | 'legend';

export type LegendGender = 'M' | 'W';

/** A legend's medal tally — accumulated across their career. */
export interface LegendMedals {
  gold: number;
  silver: number;
  bronze: number;
}

export interface Legend {
  id: string;
  name: string;
  country: CountryCode;
  sportId: string;
  gender: LegendGender;
  rarity: LegendRarity;
  /** Total Olympic cycles this legend will compete in (2-5) */
  careerLength: number;
  /** Cycles completed so far */
  gamesPlayed: number;
  /** True once gamesPlayed >= careerLength */
  retired: boolean;
  /** Career medal tally (accumulates across cycles) */
  medals: LegendMedals;
  /**
   * Event IDs this legend is assigned to in the CURRENT cycle.
   * Reassigned each cycle. Empty when between cycles or retired.
   */
  currentEventIds: string[];
}

// --- History (stub for iteration 7+, defined now to lock the shape) ---

export interface CompletedCycle {
  year: CycleYear;
  hostCity: City;
  medals: MedalTable;
  demoMedals: MedalTable;
  demoSportIds: string[];
  results: Record<string, EventResult>;
}

export interface History {
  cycles: CompletedCycle[];
}
