import { useMemo } from 'react';
import styles from './GamesDay.module.css';
import { useCycleStore } from '../../store/cycleStore';
import { findEventInCycle, findSportInCycle } from '../../engine/lookup';
import { formatValue } from '../../engine/results';
import type { Cycle, EventResult, Ratings, Qualifiers } from '../../engine/types';
import SportIcon from '../../components/SportIcon/SportIcon';
import Flag from '../../components/Flag/Flag';

export default function GamesDay() {
  const cycle = useCycleStore((s) => s.currentCycle);
  const simulateNextDay = useCycleStore((s) => s.simulateNextDay);
  const goToDay = useCycleStore((s) => s.goToDay);

  if (!cycle) {
    return (
      <div>
        <h2>The <em>Games</em></h2>
        <p className="subtitle">No cycle in progress.</p>
      </div>
    );
  }

  const { currentDay, schedule, daysSimulated, results, ratings, qualifiers } = cycle;
  const currentPlan = schedule.find((d) => d.day === currentDay);
  const dayDone = daysSimulated.includes(currentDay);
  const totalDays = schedule.length;

  // The next pending day determines what "Simulate" runs against.
  const simulatedSet = useMemo(() => new Set(daysSimulated), [daysSimulated]);
  const nextPendingDay = schedule.find((d) => !simulatedSet.has(d.day))?.day ?? null;

  const isViewingFuture = !dayDone && nextPendingDay !== null && currentDay > nextPendingDay;
  const isViewingNextPending = currentDay === nextPendingDay;
  const allDone = nextPendingDay === null;

  // Demo events for this cycle — used for UI tagging
  const demoEventIds = useMemo(() => {
    const ids = new Set<string>();
    for (const s of cycle.hostCity?.demonstrationSports ?? []) {
      for (const e of s.events) ids.add(e.id);
    }
    return ids;
  }, [cycle.hostCity]);

  if (!currentPlan) {
    return (
      <div>
        <h2>The <em>Games</em></h2>
        <p className="subtitle">No schedule available. Select a host city first.</p>
      </div>
    );
  }

  const subtitle = (() => {
    if (allDone) return 'The Games have closed';
    if (currentDay === totalDays && dayDone) return 'Closing — the finale complete';
    if (currentDay === totalDays) return 'Closing — the finale';
    if (dayDone) return `Day ${currentDay} of ${totalDays} · complete`;
    if (isViewingFuture) return `Day ${currentDay} of ${totalDays} · upcoming`;
    if (isViewingNextPending) return `Day ${currentDay} of ${totalDays} · ready to simulate`;
    return `Day ${currentDay} of ${totalDays}`;
  })();

  return (
    <div>
      <h2>Day <em>{currentDay}</em></h2>
      <p className="subtitle">{subtitle}</p>

      {/* Day slicer — 15 buttons */}
      <div className={styles.dayStrip}>
        {schedule.map((d) => {
          const done = simulatedSet.has(d.day);
          const isCurrent = d.day === currentDay;
          const isNextPending = d.day === nextPendingDay;
          return (
            <button
              key={d.day}
              className={[
                styles.dayBtn,
                done ? styles.done : '',
                isNextPending && !done ? styles.next : '',
                isCurrent ? styles.current : '',
              ].filter(Boolean).join(' ')}
              onClick={() => goToDay(d.day)}
              title={`Day ${d.day} · ${d.eventIds.length} events`}
            >
              <span className={styles.dayNum}>{d.day}</span>
              <span className={styles.dayCount}>{d.eventIds.length}</span>
            </button>
          );
        })}
      </div>

      {/* Body: preview (any unsimulated day) or results (simulated days) */}
      {dayDone ? (
        <DayResults eventIds={currentPlan.eventIds} results={results} cycle={cycle} demoEventIds={demoEventIds} />
      ) : (
        <DayPreview eventIds={currentPlan.eventIds} ratings={ratings} qualifiers={qualifiers} cycle={cycle} demoEventIds={demoEventIds} />
      )}

      {/* Controls */}
      <div className={styles.controls}>
        {!allDone && (
          <button className={styles.btn} onClick={simulateNextDay}>
            {isViewingNextPending ? `Simulate Day ${currentDay}` : `Simulate Day ${nextPendingDay}`}
          </button>
        )}
        {allDone && <div className={styles.allDoneNote}>All 15 days complete. Visit the Cycle tab to archive these Games.</div>}
      </div>
    </div>
  );
}

// ---------- Preview ----------

interface PreviewProps {
  eventIds: string[];
  ratings: Ratings;
  qualifiers: Qualifiers;
  cycle: Cycle;
  demoEventIds: Set<string>;
}

function DayPreview({ eventIds, ratings, qualifiers, cycle, demoEventIds }: PreviewProps) {
  if (eventIds.length === 0) {
    return (
      <div className={styles.preview}>
        <div className={styles.previewLabel}>No finals scheduled</div>
      </div>
    );
  }
  return (
    <div className={styles.preview}>
      <div className={styles.previewLabel}>Scheduled Finals</div>
      <ul>
        {eventIds.map((id) => {
          const event = findEventInCycle(id, cycle);
          const sport = findSportInCycle(id, cycle);
          if (!event || !sport) return null;
          const quals = qualifiers[id] ?? [];
          const ranked = quals
            .map((code) => ({ code, r: ratings[code]?.[sport.id] ?? 0 }))
            .sort((a, b) => b.r - a.r);
          const fav = ranked[0];
          const isDemo = demoEventIds.has(id);
          return (
            <li key={id}>
              <span className={styles.evName}>
                <SportIcon id={sport.id} size={16} className={styles.evIcon} />
                {isDemo && <span className={styles.demoTag}>DEMO</span>}
                {event.name}
              </span>
              <span className={styles.fav}>
                Favorite: <Flag code={fav?.code ?? ''} className={styles.favFlag} />
                <strong>{fav?.code ?? '—'}</strong>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------- Results ----------

interface ResultsProps {
  eventIds: string[];
  results: Record<string, EventResult>;
  cycle: Cycle;
  demoEventIds: Set<string>;
}

function DayResults({ eventIds, results, cycle, demoEventIds }: ResultsProps) {
  return (
    <div>
      {eventIds.map((id) => {
        const result = results[id];
        const event = findEventInCycle(id, cycle);
        const sport = findSportInCycle(id, cycle);
        if (!result || !event || !sport) return null;
        const isDemo = demoEventIds.has(id);
        const [gold, silver, bronze] = result.podium;
        return (
          <div key={id} className={`${styles.eventCard} ${isDemo ? styles.demoCard : ''}`}>
            <div className={styles.eventHead}>
              <div className={styles.eventName}>
                <SportIcon id={sport.id} size={20} className={styles.eventHeadIcon} />
                {isDemo && <span className={styles.demoTag}>DEMO</span>}
                {event.name}
              </div>
              <div className={styles.eventSport}>{sport.name}</div>
            </div>
            <div className={styles.podium}>
              <div className={`${styles.medal} ${styles.gold}`}>
                <div className={styles.pos}>Gold</div>
                <div className={styles.country}>
                  <Flag code={gold.country} className={styles.podiumFlag} /> {gold.country}
                </div>
                <div className={styles.result}>{formatValue(event, gold.value)}</div>
              </div>
              <div className={`${styles.medal} ${styles.silver}`}>
                <div className={styles.pos}>Silver</div>
                <div className={styles.country}>
                  <Flag code={silver.country} className={styles.podiumFlag} /> {silver.country}
                </div>
                <div className={styles.result}>{formatValue(event, silver.value)}</div>
              </div>
              <div className={`${styles.medal} ${styles.bronze}`}>
                <div className={styles.pos}>Bronze</div>
                <div className={styles.country}>
                  <Flag code={bronze.country} className={styles.podiumFlag} /> {bronze.country}
                </div>
                <div className={styles.result}>{formatValue(event, bronze.value)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
