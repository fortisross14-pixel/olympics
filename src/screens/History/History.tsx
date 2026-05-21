import { useState, useMemo } from 'react';
import styles from './History.module.css';
import { useCycleStore } from '../../store/cycleStore';
import { useUIStore } from '../../store/uiStore';
import { findCountry } from '../../data/countries';
import { allEvents, SPORTS } from '../../data/sports';
import {
  allTimeMedals,
  recordForEvent,
  pastCycleSummaries,
} from '../../engine/history';
import Flag from '../../components/Flag/Flag';

type SubTab = 'medals' | 'records' | 'cycles' | 'legends';

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

  const tabLabel: Record<SubTab, string> = {
    medals: 'All-Time Medals',
    records: 'Records',
    cycles: 'Past Cycles',
    legends: 'Legends',
  };

  return (
    <div>
      <h2>The <em>Archive</em></h2>
      <p className="subtitle">
        {history.length} {history.length === 1 ? 'cycle' : 'cycles'} on record
      </p>

      <div className={styles.subTabs}>
        {(['medals', 'records', 'cycles', 'legends'] as SubTab[]).map((id) => (
          <button
            key={id}
            className={`${styles.subTab} ${sub === id ? styles.active : ''}`}
            onClick={() => setSub(id)}
          >
            {tabLabel[id]}
          </button>
        ))}
      </div>

      {sub === 'medals' && <AllTimeMedals />}
      {sub === 'records' && <Records />}
      {sub === 'cycles' && <PastCycles />}
      {sub === 'legends' && <LegendArchive />}
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
                <strong className={styles.code}>{r.code}</strong> &middot; {country?.name}
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
  const [sportFilter, setSportFilter] = useState('all');

  const records = useMemo(() => {
    const events = allEvents();
    return events
      .map((event) => ({ event, record: recordForEvent(event, history) }))
      .filter((r) => r.record !== null);
  }, [history]);

  const sportOfEvent = useMemo(() => {
    const m = new Map();
    for (const s of SPORTS) for (const e of s.events) m.set(e.id, s.id);
    return m;
  }, []);

  const filtered = useMemo(() => {
    if (sportFilter === 'all') return records;
    return records.filter((r) => sportOfEvent.get(r.event.id) === sportFilter);
  }, [records, sportFilter, sportOfEvent]);

  const sportsWithRecords = useMemo(() => {
    const ids = new Set();
    for (const r of records) {
      const sid = sportOfEvent.get(r.event.id);
      if (sid) ids.add(sid);
    }
    return SPORTS.filter((s) => ids.has(s.id));
  }, [records, sportOfEvent]);

  if (records.length === 0) {
    return (
      <p className={styles.note}>
        No records yet. Records are tracked for events with timed, measured, or scored results.
      </p>
    );
  }

  return (
    <>
      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Sport</span>
        <select
          className={styles.select}
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
        >
          <option value="all">All Sports</option>
          {sportsWithRecords.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

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
          {filtered.map(({ event, record }) => (
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
    </>
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
            <td>{s.host} <span className={styles.muted}>&middot; {s.hostCountry}</span></td>
            <td>
              {s.leader ? (
                <>
                  <Flag code={s.leader} size={22} className={styles.flag} />
                  <strong className={styles.code}>{s.leader}</strong>
                </>
              ) : '\u2014'}
            </td>
            <td className={styles.num}>{s.leaderGold}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LegendArchive() {
  const legends = useCycleStore((s) => s.legends);
  const openLegend = useUIStore((s) => s.openLegend);

  const rows = useMemo(() => {
    return legends
      .map((l) => ({
        legend: l,
        total: l.medals.gold + l.medals.silver + l.medals.bronze,
      }))
      .filter((r) => r.legend.gamesPlayed > 0)
      .sort(
        (a, b) =>
          b.legend.medals.gold - a.legend.medals.gold ||
          b.total - a.total ||
          a.legend.name.localeCompare(b.legend.name),
      );
  }, [legends]);

  if (rows.length === 0) {
    return (
      <p className={styles.note}>
        No legend careers on record yet. Legend medals accumulate as cycles are completed.
      </p>
    );
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th style={{ width: 50 }}>#</th>
          <th>Legend</th>
          <th>Nation</th>
          <th className={styles.num}>Games</th>
          <th className={styles.num}>Gold</th>
          <th className={styles.num}>Silver</th>
          <th className={styles.num}>Bronze</th>
          <th className={styles.num}>Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ legend, total }, i) => {
          const country = findCountry(legend.country);
          return (
            <tr key={legend.id} className={i === 0 ? styles.leader : ''}>
              <td className={styles.num}>{i + 1}</td>
              <td>
                <button className={styles.legendBtn} onClick={() => openLegend(legend.id)}>
                  <span className={`${styles.rarityDot} ${styles[legend.rarity]}`} />
                  {legend.name}
                  {legend.retired && <span className={styles.retiredBadge}>retired</span>}
                </button>
              </td>
              <td>
                <Flag code={legend.country} size={20} className={styles.flag} />
                <strong className={styles.code}>{legend.country}</strong>
                <span className={styles.muted}> &middot; {country?.name}</span>
              </td>
              <td className={styles.num}>{legend.gamesPlayed}</td>
              <td className={styles.num}>{legend.medals.gold}</td>
              <td className={styles.num}>{legend.medals.silver}</td>
              <td className={styles.num}>{legend.medals.bronze}</td>
              <td className={styles.num}><strong>{total}</strong></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
