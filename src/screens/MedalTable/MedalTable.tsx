import { useMemo } from 'react';
import styles from './MedalTable.module.css';
import { useCycleStore } from '../../store/cycleStore';
import { COUNTRIES } from '../../data/countries';
import { eventsForCycle } from '../../engine/lookup';
import Flag from '../../components/Flag/Flag';

interface Row {
  code: string;
  name: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
  demoGold: number;
}

export default function MedalTable() {
  const cycle = useCycleStore((s) => s.currentCycle);
  const medals = cycle?.medals ?? {};
  const demoMedals = cycle?.demoMedals ?? {};
  const results = cycle?.results ?? {};

  const rows: Row[] = useMemo(() => {
    const list: Row[] = COUNTRIES.map((c) => {
      const m = medals[c.code] ?? { gold: 0, silver: 0, bronze: 0 };
      const dm = demoMedals[c.code] ?? { gold: 0, silver: 0, bronze: 0 };
      return {
        code: c.code,
        name: c.name,
        gold: m.gold,
        silver: m.silver,
        bronze: m.bronze,
        total: m.gold + m.silver + m.bronze,
        demoGold: dm.gold,
      };
    });
    list.sort(
      (a, b) =>
        b.gold - a.gold ||
        b.silver - a.silver ||
        b.bronze - a.bronze ||
        a.code.localeCompare(b.code),
    );
    return list;
  }, [medals, demoMedals]);

  // Count progress including demo events (so user sees total events ran)
  const allEvents = eventsForCycle(cycle);
  const totalEvents = allEvents.length;
  const done = Object.keys(results).length;

  // Separate count of demo events for callout
  const demoEvents = (cycle?.hostCity?.demonstrationSports ?? []).flatMap((s) => s.events);
  const demoTotal = demoEvents.length;

  const subtitle =
    done === 0
      ? 'No events completed yet'
      : done === totalEvents
        ? 'Games complete — final standings'
        : `${done} of ${totalEvents} events complete`;

  const anyDemoMedals = rows.some((r) => r.demoGold > 0);
  const leaderHasMedals = rows[0]?.gold > 0;

  return (
    <div>
      <h2>
        Medal <em>Table</em>
      </h2>
      <p className="subtitle">{subtitle}</p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.rank}>#</th>
            <th>Country</th>
            <th className={styles.numCol}>
              <span className={`${styles.badge} ${styles.dGold}`} />G
            </th>
            <th className={styles.numCol}>
              <span className={`${styles.badge} ${styles.dSilver}`} />S
            </th>
            <th className={styles.numCol}>
              <span className={`${styles.badge} ${styles.dBronze}`} />B
            </th>
            <th className={styles.numCol}>Total</th>
            {anyDemoMedals && (
              <th className={styles.numCol} title="Demonstration sport golds — not in totals">
                Demo G
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.code} className={i === 0 && leaderHasMedals ? styles.leader : ''}>
              <td className={styles.numCol}>{i + 1}</td>
              <td className={styles.countryCell}>
                <Flag code={r.code} className={styles.flag} />
                <strong>{r.code}</strong> · {r.name}
              </td>
              <td className={styles.numCol}>{r.gold}</td>
              <td className={styles.numCol}>{r.silver}</td>
              <td className={styles.numCol}>{r.bronze}</td>
              <td className={styles.numCol}>
                <strong>{r.total}</strong>
              </td>
              {anyDemoMedals && (
                <td className={`${styles.numCol} ${styles.demoCol}`}>
                  {r.demoGold > 0 ? r.demoGold : '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {demoTotal > 0 && (
        <p className={styles.demoNote}>
          {demoTotal} demonstration event{demoTotal === 1 ? '' : 's'} this cycle — medals shown
          separately and do not count toward totals.
        </p>
      )}
    </div>
  );
}
