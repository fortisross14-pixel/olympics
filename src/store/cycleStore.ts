import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  City,
  CompletedCycle,
  Cycle,
  CycleYear,
  Legend,
  Sport,
  SportEvent,
} from '../engine/types';
import { COUNTRIES } from '../data/countries';
import { SPORTS } from '../data/sports';
import { CITY_POOL } from '../data/cities';
import { generateRatings } from '../engine/ratings';
import { generateQualifiers } from '../engine/qualifying';
import { generateSchedule } from '../engine/scheduling';
import { simulateDay as engineSimulateDay } from '../engine/simulation';
import {
  refreshLegendsForCycle,
  ageLegends,
  legendBoostMap,
  legendsInEvent,
} from '../engine/legends';
import { pickRandom } from '../engine/random';

/** Bump this if the persisted shape ever changes incompatibly. */
const STORAGE_VERSION = 5;
const STORAGE_KEY = 'the-cycle:v5';

const FIRST_CYCLE_YEAR = 2028;
const YEARS_BETWEEN_CYCLES = 4;

interface CycleStore {
  currentCycle: Cycle | null;
  hostCandidates: City[];
  history: CompletedCycle[];
  /** All legends, active and retired — persists across cycles. */
  legends: Legend[];

  startCycle: () => void;
  selectHost: (city: City) => void;
  simulateNextDay: () => void;
  goToDay: (day: number) => void;
  nextDay: () => void;
  archiveAndStartNext: () => void;
  resetCurrentCycle: () => void;
  wipeAllData: () => void;
}

function emptyMedalTable(): Cycle['medals'] {
  const m: Cycle['medals'] = {};
  COUNTRIES.forEach((c) => {
    m[c.code] = { gold: 0, silver: 0, bronze: 0 };
  });
  return m;
}

function emptyCycle(year: CycleYear): Cycle {
  return {
    year,
    stage: 'host',
    hostCity: null,
    ratings: {},
    qualifiers: {},
    schedule: [],
    results: {},
    daysSimulated: [],
    currentDay: 1,
    medals: emptyMedalTable(),
    demoMedals: emptyMedalTable(),
    demoSportIds: [],
  };
}

function eventMap(events: SportEvent[]): ReadonlyMap<string, SportEvent> {
  const m = new Map<string, SportEvent>();
  for (const e of events) m.set(e.id, e);
  return m;
}

function nextCycleYear(history: readonly CompletedCycle[]): CycleYear {
  if (history.length === 0) return FIRST_CYCLE_YEAR;
  return history[history.length - 1].year + YEARS_BETWEEN_CYCLES;
}

function buildSportsForCycle(city: City): {
  sports: Sport[];
  events: SportEvent[];
  demoSportIds: Set<string>;
} {
  const demos = city.demonstrationSports ?? [];
  const sports = [...SPORTS, ...demos];
  const events = sports.flatMap((s) => s.events);
  const demoSportIds = new Set(demos.map((s) => s.id));
  return { sports, events, demoSportIds };
}

export const useCycleStore = create<CycleStore>()(
  persist(
    (set) => ({
      currentCycle: null,
      hostCandidates: [],
      history: [],
      legends: [],

      startCycle: () => {
        set((state) => {
          const year = nextCycleYear(state.history);
          return {
            currentCycle: emptyCycle(year),
            hostCandidates: pickRandom(CITY_POOL, 3),
          };
        });
      },

      selectHost: (city) => {
        set((state) => {
          if (!state.currentCycle) return state;

          const { sports, events, demoSportIds } = buildSportsForCycle(city);

          // Refresh legends for this cycle: retire the done, spawn new,
          // and assign event slots. Core sports only (no demo legends).
          const legends = refreshLegendsForCycle(state.legends, SPORTS);

          // Legend boosts feed into rating generation
          const boosts = legendBoostMap(legends);
          const ratings = generateRatings(
            COUNTRIES,
            sports,
            demoSportIds,
            city.countryCode,
            boosts,
          );
          const qualifiers = generateQualifiers(COUNTRIES, sports, ratings);
          const schedule = generateSchedule(events);

          return {
            legends,
            currentCycle: {
              ...state.currentCycle,
              stage: 'qualified',
              hostCity: city,
              ratings,
              qualifiers,
              schedule,
              demoSportIds: [...demoSportIds],
            },
          };
        });
      },

      simulateNextDay: () => {
        set((state) => {
          const cycle = state.currentCycle;
          if (!cycle || !cycle.hostCity) return state;

          const simulatedSet = new Set(cycle.daysSimulated);
          const pending = cycle.schedule.find((d) => !simulatedSet.has(d.day));
          if (!pending) return state;
          const day = pending.day;

          const { sports, events } = buildSportsForCycle(cycle.hostCity);
          const eventLookup = eventMap(events);
          const sportIdByEvent = new Map<string, string>();
          for (const s of sports) for (const e of s.events) sportIdByEvent.set(e.id, s.id);

          const newResults = engineSimulateDay(
            pending.eventIds,
            eventLookup,
            sportIdByEvent,
            cycle.qualifiers,
            cycle.ratings,
            cycle.year,
          );

          const demoEventIds = new Set<string>();
          for (const sport of cycle.hostCity.demonstrationSports ?? []) {
            for (const e of sport.events) demoEventIds.add(e.id);
          }

          const results = { ...cycle.results, ...newResults };
          const medals = { ...cycle.medals };
          const demoMedals = { ...cycle.demoMedals };

          // Clone legends so we can credit medals
          const legends = state.legends.map((l) => ({
            ...l,
            medals: { ...l.medals },
          }));

          for (const eventId of Object.keys(newResults)) {
            const podium = newResults[eventId].podium;
            const targetTable = demoEventIds.has(eventId) ? demoMedals : medals;
            targetTable[podium[0].country] = {
              ...targetTable[podium[0].country],
              gold: targetTable[podium[0].country].gold + 1,
            };
            targetTable[podium[1].country] = {
              ...targetTable[podium[1].country],
              silver: targetTable[podium[1].country].silver + 1,
            };
            targetTable[podium[2].country] = {
              ...targetTable[podium[2].country],
              bronze: targetTable[podium[2].country].bronze + 1,
            };

            // Credit legends competing in this event whose country medaled
            if (!demoEventIds.has(eventId)) {
              const competing = legendsInEvent(eventId, legends);
              for (const lg of competing) {
                if (lg.country === podium[0].country) lg.medals.gold++;
                else if (lg.country === podium[1].country) lg.medals.silver++;
                else if (lg.country === podium[2].country) lg.medals.bronze++;
              }
            }
          }

          const daysSimulated = [...cycle.daysSimulated, day];
          const totalDays = cycle.schedule.length;
          const stage = daysSimulated.length >= totalDays ? 'complete' : 'racing';

          return {
            legends,
            currentCycle: {
              ...cycle,
              stage,
              results,
              medals,
              demoMedals,
              daysSimulated,
              currentDay: day,
            },
          };
        });
      },

      goToDay: (day) => {
        set((state) => {
          const cycle = state.currentCycle;
          if (!cycle) return state;
          if (day < 1 || day > cycle.schedule.length) return state;
          return { currentCycle: { ...cycle, currentDay: day } };
        });
      },

      nextDay: () => {
        set((state) => {
          const cycle = state.currentCycle;
          if (!cycle) return state;
          const next = cycle.currentDay + 1;
          if (next > cycle.schedule.length) return state;
          return { currentCycle: { ...cycle, currentDay: next } };
        });
      },

      archiveAndStartNext: () => {
        set((state) => {
          const cycle = state.currentCycle;
          if (!cycle || cycle.stage !== 'complete' || !cycle.hostCity) {
            return state;
          }
          const archived: CompletedCycle = {
            year: cycle.year,
            hostCity: cycle.hostCity,
            medals: cycle.medals,
            demoMedals: cycle.demoMedals,
            demoSportIds: cycle.demoSportIds,
            results: cycle.results,
          };
          // Age legends — those who hit their career length retire
          // at the next cycle's refresh.
          const legends = ageLegends(state.legends);
          return {
            legends,
            history: [...state.history, archived],
            currentCycle: null,
            hostCandidates: [],
          };
        });
      },

      resetCurrentCycle: () => {
        set({ currentCycle: null, hostCandidates: [] });
      },

      wipeAllData: () => {
        set({
          currentCycle: null,
          hostCandidates: [],
          history: [],
          legends: [],
        });
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentCycle: state.currentCycle,
        history: state.history,
        legends: state.legends,
      }),
    },
  ),
);
