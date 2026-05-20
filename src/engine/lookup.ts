import type { Cycle, Sport, SportEvent } from './types';
import { SPORTS } from '../data/sports';

/**
 * Find an event by ID, searching core sports AND the demo sports of
 * the given cycle (if it has a host city with demonstration sports).
 */
export function findEventInCycle(eventId: string, cycle: Cycle | null): SportEvent | undefined {
  for (const s of SPORTS) {
    const e = s.events.find((ev) => ev.id === eventId);
    if (e) return e;
  }
  if (cycle?.hostCity?.demonstrationSports) {
    for (const s of cycle.hostCity.demonstrationSports) {
      const e = s.events.find((ev) => ev.id === eventId);
      if (e) return e;
    }
  }
  return undefined;
}

/**
 * Find the sport that owns the given event ID, searching core sports
 * AND the demo sports for the cycle.
 */
export function findSportInCycle(eventId: string, cycle: Cycle | null): Sport | undefined {
  const core = SPORTS.find((s) => s.events.some((e) => e.id === eventId));
  if (core) return core;
  if (cycle?.hostCity?.demonstrationSports) {
    return cycle.hostCity.demonstrationSports.find((s) =>
      s.events.some((e) => e.id === eventId),
    );
  }
  return undefined;
}

/** All sports active in this cycle (core + demos). */
export function sportsForCycle(cycle: Cycle | null): Sport[] {
  if (!cycle?.hostCity?.demonstrationSports) return [...SPORTS];
  return [...SPORTS, ...cycle.hostCity.demonstrationSports];
}

/** All events active in this cycle. */
export function eventsForCycle(cycle: Cycle | null): SportEvent[] {
  return sportsForCycle(cycle).flatMap((s) => s.events);
}
