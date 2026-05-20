import { useState, useMemo } from 'react';
import styles from './History.module.css';
import { useCycleStore } from '../../store/cycleStore';
import { findCountry } from '../../data/countries';
import { allEvents } from '../../data/sports';
import {
  allTimeMedals,
  recordForEvent,
  pastCycleSummaries,
} from '../../engine/history';
import Flag from '../../components/Flag/Flag';

type SubTab = 'medals' | 'records' | 'cycles';

export default function History() {
  const history = useCycleStore((s) => s.history);
  const [sub, setSub] = useState<SubTab>('medals');

  if (history.length === 0) {
    return (
      <div>
        <h2>The <em>Archive</em></h2>
        <p className="subtitle">No archived cycles yet</p>
      </div>
    );
  }

  return (
    <div>
      <h2>The <em>Archive</em></h2>
      <p className="subtitle">
        {history.length} {history.length === 1 ? 'cycle' : 'cycles'} on record
      </p>

      <div className={styles.subTabs}>
        {(['medals', 'records', 'cycles'] as SubTab[]).map((id) => (
          <button
            key={id}
            className={`${styles.subTab} ${sub === id ? styles.active : ''}`}
            onClick={() => setSub(id)}
          >
            {id === 'medals' ? 'All-Time Medals' : id === 'records' ? 'Records' : 'Past Cycles'}
          </button>
        ))}
      </div>

      {sub === 'medals' && <AllTimeMedals />}
      {sub === 'records' && <Records />}
      {sub === 'cycles' && <PastCycles />}
    </div>
  );
}

function AllTimeMedals() {
  const history = useCycleStore((s) => s.history);
  const rows = useMemo(() => allTimeMedals(history), [history]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th style={{ width: 50 }}>#</th>
          <th>Country</th>
          <th className={styles.num}>Gold</th>
          <th className={styles.num}>Silver</th>
          <th className={styles.num}>Bronze</th>
          <th className={styles.num}>Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const country = findCountry(r.code);
          return (
            <tr key={r.code} className={i === 0 ? styles.leader : ''}>
              <td className={styles.num}>{i + 1}</td>
              <td>
                <Flag code={r.code} size={22} className={styles.flag} />
                <strong className={styles.code}>{r.code}</strong> · {country?.name}
              </td>
              <td className={styles.num}>{r.gold}</td>
              <td className={styles.num}>{r.silver}</td>
              <td className={styles.num}>{r.bronze}</td>
              <td className={styles.num}><strong>{r.total}</strong></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function Records() {
  const history = useCycleStore((s) => s.history);
  const records = useMemo(() => {
    const events = allEvents();
    return events
      .map((event) => ({ event, record: recordForEvent(event, history) }))
      .filter((r) => r.record !== null);
  }, [history]);

  if (records.length === 0) {
    return (
      <p className={styles.note}>
        No records yet. Records are tracked for events with timed, measured, or scored results.
      </p>
    );
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Event</th>
          <th>Record</th>
          <th>Holder</th>
          <th className={styles.num}>Set</th>
        </tr>
      </thead>
      <tbody>
        {records.map(({ event, record }) => (
          <tr key={event.id}>
            <td>{event.name}</td>
            <td className={styles.mono}>{record!.display}</td>
            <td>
              <Flag code={record!.country} size={22} className={styles.flag} />
              <strong className={styles.code}>{record!.country}</strong>
            </td>
            <td className={styles.num}>{record!.year}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PastCycles() {
  const history = useCycleStore((s) => s.history);
  const summaries = useMemo(() => pastCycleSummaries(history), [history]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.num}>Year</th>
          <th>Host</th>
          <th>Leader</th>
          <th className={styles.num}>Golds</th>
        </tr>
      </thead>
      <tbody>
        {summaries.map((s) => (
          <tr key={s.year}>
            <td className={styles.num}><strong>{s.year}</strong></td>
            <td>{s.host} <span className={styles.muted}>· {s.hostCountry}</span></td>
            <td>
              {s.leader ? (
                <>
                  <Flag code={s.leader} size={22} className={styles.flag} />
                  <strong className={styles.code}>{s.leader}</strong>
                </>
              ) : '—'}
            </td>
            <td className={styles.num}>{s.leaderGold}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
