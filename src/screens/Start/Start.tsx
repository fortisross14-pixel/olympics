import styles from './Start.module.css';
import { useCycleStore } from '../../store/cycleStore';

export default function Start() {
  const currentCycle = useCycleStore((s) => s.currentCycle);
  const history = useCycleStore((s) => s.history);
  const startCycle = useCycleStore((s) => s.startCycle);
  const archiveAndStartNext = useCycleStore((s) => s.archiveAndStartNext);
  const resetCurrentCycle = useCycleStore((s) => s.resetCurrentCycle);
  const wipeAllData = useCycleStore((s) => s.wipeAllData);

  // The year displayed depends on whether there's a current cycle,
  // or what year the next one would start at.
  const nextYear =
    history.length > 0
      ? history[history.length - 1].year + 4
      : 2028;

  const displayYear = currentCycle?.year ?? nextYear;

  // Three primary states:
  // 1. No current cycle, no history → "Begin 2028"
  // 2. No current cycle, has history → "Begin 2032" (or next)
  // 3. Current cycle in progress → resume + reset

  // Sub-state of #3: cycle is complete but not archived
  const cycleComplete = currentCycle?.stage === 'complete';

  const headline = (() => {
    if (currentCycle) {
      return cycleComplete
        ? <>The <em>{displayYear}</em><br/>Games are Complete</>
        : <>{displayYear} <em>Cycle</em><br/>in Progress</>;
    }
    return history.length === 0
      ? <>Begin the <em>{displayYear}</em><br/>Olympic Cycle</>
      : <>The <em>{displayYear}</em><br/>Cycle Awaits</>;
  })();

  return (
    <div className={styles.block}>
      <h1>{headline}</h1>

      <div className={styles.tag}>· IOC Command ·</div>

      {!currentCycle && (
        <div className={styles.actions}>
          <button className={styles.btn} onClick={() => startCycle()}>
            {history.length === 0 ? 'Start Cycle' : 'Start Next Cycle'}
          </button>
        </div>
      )}

      {currentCycle && !cycleComplete && (
        <div className={styles.actions}>
          <p className={styles.note}>
            Use the tabs above to continue.
          </p>
          <button
            className={`${styles.btn} ${styles.ghost}`}
            onClick={() => {
              if (confirm('Abandon this cycle? All current-cycle progress will be lost. Archived history is preserved.')) {
                resetCurrentCycle();
              }
            }}
          >
            Abandon Current Cycle
          </button>
        </div>
      )}

      {currentCycle && cycleComplete && (
        <div className={styles.actions}>
          <p className={styles.note}>
            All events run. Archive the {displayYear} Games and start the next cycle when you're ready.
          </p>
          <button className={styles.btn} onClick={() => archiveAndStartNext()}>
            Archive & Continue
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className={styles.danger}>
          <button
            className={`${styles.btn} ${styles.ghost} ${styles.small}`}
            onClick={() => {
              if (confirm(`Wipe ALL data? This deletes ${history.length} archived ${history.length === 1 ? 'cycle' : 'cycles'} and any current cycle. Cannot be undone.`)) {
                wipeAllData();
              }
            }}
          >
            Wipe All Data
          </button>
        </div>
      )}
    </div>
  );
}
