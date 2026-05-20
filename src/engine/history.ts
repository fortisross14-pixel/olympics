import type {
  CompletedCycle,
  CountryCode,
  MedalCount,
  SportEvent,
} from './types';

export interface AllTimeMedalRow {
  code: CountryCode;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

/**
 * Sum medals across all archived cycles. Returns one row per country
 * that appears in any cycle's medal table. Sorted gold > silver > bronze.
 */
export function allTimeMedals(history: readonly CompletedCycle[]): AllTimeMedalRow[] {
  const totals: Record<CountryCode, MedalCount> = {};

  for (const cycle of history) {
    for (const code of Object.keys(cycle.medals)) {
      if (!totals[code]) totals[code] = { gold: 0, silver: 0, bronze: 0 };
      totals[code].gold += cycle.medals[code].gold;
      totals[code].silver += cycle.medals[code].silver;
      totals[code].bronze += cycle.medals[code].bronze;
    }
  }

  const rows: AllTimeMedalRow[] = Object.entries(totals).map(([code, m]) => ({
    code,
    gold: m.gold,
    silver: m.silver,
    bronze: m.bronze,
    total: m.gold + m.silver + m.bronze,
  }));

  rows.sort(
    (a, b) =>
      b.gold - a.gold ||
      b.silver - a.silver ||
      b.bronze - a.bronze ||
      a.code.localeCompare(b.code),
  );

  return rows;
}

/**
 * For events with a numeric/timed unit, find the all-time best result.
 * Returns null if the event has no record-able unit (rank-only) or has
 * never been contested.
 *
 * Note: for 'time' unit (formatted hh:mm:ss strings), we compare based
 * on the raw seconds stored — but those aren't kept in the result, only
 * the formatted string. So for now we recompute by parsing.
 */
export interface EventRecord {
  eventId: string;
  /** Display value, e.g. "9.74s", "8:22:15", "2.39m", "89.40 pts" */
  display: string;
  /** Country that holds the record */
  country: CountryCode;
  /** Year (cycle) the record was set */
  year: number;
}

function parseTimeString(s: string): number {
  // "h:mm:ss" → seconds
  const parts = s.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(s);
}

/**
 * Compute the all-time record for one event.
 * "Best" means lowest for s/time units, highest for m/pts.
 */
export function recordForEvent(
  event: SportEvent,
  history: readonly CompletedCycle[],
): EventRecord | null {
  if (event.unit === 'rank') return null;

  let best: EventRecord | null = null;
  let bestNum: number | null = null;

  for (const cycle of history) {
    const res = cycle.results[event.id];
    if (!res) continue;
    const gold = res.podium[0];
    if (gold.value === null || gold.value === undefined) continue;

    const num = typeof gold.value === 'number' ? gold.value : parseTimeString(gold.value);

    const lowerIsBetter = event.unit === 's' || event.unit === 'time';
    const isBetter =
      bestNum === null ||
      (lowerIsBetter ? num < bestNum : num > bestNum);

    if (isBetter) {
      bestNum = num;
      best = {
        eventId: event.id,
        display: formatForRecord(event, gold.value),
        country: gold.country,
        year: cycle.year,
      };
    }
  }

  return best;
}

function formatForRecord(event: SportEvent, value: number | string): string {
  if (typeof value === 'string') return value; // time format already
  if (event.unit === 's') return `${value.toFixed(2)}s`;
  if (event.unit === 'm') return `${value.toFixed(2)}m`;
  if (event.unit === 'pts') return `${value.toFixed(2)} pts`;
  return String(value);
}

/**
 * For rank-only events, return the list of past gold medalists.
 */
export interface GoldMedalist {
  eventId: string;
  country: CountryCode;
  year: number;
}

export function goldMedalistsForEvent(
  eventId: string,
  history: readonly CompletedCycle[],
): GoldMedalist[] {
  const out: GoldMedalist[] = [];
  for (const cycle of history) {
    const res = cycle.results[eventId];
    if (!res) continue;
    out.push({ eventId, country: res.podium[0].country, year: cycle.year });
  }
  return out.sort((a, b) => a.year - b.year);
}

/**
 * Build the leader-by-cycle list shown on the History → Past Cycles tab.
 */
export interface PastCycleSummary {
  year: number;
  host: string;
  hostCountry: string;
  leader: CountryCode | null;
  leaderGold: number;
}

export function pastCycleSummaries(
  history: readonly CompletedCycle[],
): PastCycleSummary[] {
  return history.map((c) => {
    let leader: CountryCode | null = null;
    let leaderGold = 0;
    for (const [code, m] of Object.entries(c.medals)) {
      if (m.gold > leaderGold) {
        leaderGold = m.gold;
        leader = code;
      }
    }
    return {
      year: c.year,
      host: c.hostCity.name,
      hostCountry: c.hostCity.country,
      leader,
      leaderGold,
    };
  });
}
