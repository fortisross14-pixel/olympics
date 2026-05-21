import { useMemo, useState } from 'react';
import styles from './MedalTable.module.css';
import { useCycleStore } from '../../store/cycleStore';
import { COUNTRIES } from '../../data/countries';
import { SPORTS } from '../../data/sports';
import { eventsForCycle, findSportInCycle, findEventInCycle } from '../../engine/lookup';
import { eventGender } from '../../engine/gender';
import NationChip from '../../components/NationChip/NationChip';
import type { EventGender } from '../../engine/types';

type GenderFilter = 'all' | 'M' | 'W';

interface Row {
  code: string;
  name: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export default function MedalTable() {
  const cycle = useCycleStore((s) => s.currentCycle);
  const results = cycle?.results ?? {};

  const [gender, setGender] = useState<GenderFilter>('all');
  const [sport, setSport] = useState<string>('all');

  const rows: Row[] = useMemo(() => {
    const counts: Record<string, { gold: number; silver: number; bronze: number }> = {};
    COUNTRIES.forEach((c) => {
      counts[c.code] = { gold: 0, silver: 0, bronze: 0 };
    });

    for (const eventId of Object.keys(results)) {
      const result = results[eventId];
      const sp = findSportInCycle(eventId, cycle);
      const ev = findEventInCycle(eventId, cycle);
      if (!sp || !ev || sp.demonstration) continue;

      if (sport !== 'all') {
        if (sport === '__team') {
          if (!sp.team) continue;
        } else if (sp.id !== sport) {
          continue;
        }
      }
      if (gender !== 'all') {
        const g: EventGender = eventGender(ev);
        if (g !== gender) continue;
      }

      const [g, s, b] = result.podium;
      if (counts[g.country]) counts[g.country].gold++;
      if (counts[s.country]) counts[s.country].silver++;
      if (counts[b.country]) counts[b.country].bronze++;
    }

    const list: Row[] = COUNTRIES.map((c) => {
      const m = counts[c.code];
      return {
        code: c.code,
        name: c.name,
        gold: m.gold,
        silver: m.silver,
        bronze: m.bronze,
        total: m.gold + m.silver + m.bronze,
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
  }, [results, cycle, sport, gender]);

  const allEvents = eventsForCycle(cycle);
  const totalEvents = allEvents.length;
  const done = Object.keys(results).length;
  const leaderHasMedals = rows[0]?.gold > 0;

  const subtitle =
    done === 0
      ? 'No events completed yet'
      : done === totalEvents
        ? 'Games complete — final standings'
        : `${done} of ${totalEvents} events complete`;

  return (
    <div>
      <h2>
        Medal <em>Table</em>
      </h2>
      <p className="subtitle">{subtitle}</p>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Gender</span>
          <div className={styles.segmented}>
            {(['all', 'M', 'W'] as GenderFilter[]).map((g) => (
              <button
                key={g}
                className={`${styles.segBtn} ${gender === g ? styles.segActive : ''}`}
                onClick={() => setGender(g)}
              >
                {g === 'all' ? 'Total' : g === 'M' ? 'Men' : 'Women'}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Sport</span>
          <select
            className={styles.select}
            value={sport}
            onChange={(e) => setSport(e.target.value)}
          >
            <option value="all">All Sports</option>
            <option value="__team">Team Sports</option>
            {SPORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.rank}>#</th>
            <th>Country</th>
            <th className={styles.medalHead}>
              <span className={`${styles.badge} ${styles.dGold}`} />
              <span>Gold</span>
            </th>
            <th className={styles.medalHead}>
              <span className={`${styles.badge} ${styles.dSilver}`} />
              <span>Silver</span>
            </th>
            <th className={styles.medalHead}>
              <span className={`${styles.badge} ${styles.dBronze}`} />
              <span>Bronze</span>
            </th>
            <th className={styles.medalHead}>
              <span>Total</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.code} className={i === 0 && leaderHasMedals ? styles.leader : ''}>
              <td className={styles.rank}>{i + 1}</td>
              <td className={styles.countryCell}>
                <NationChip code={r.code} label={r.name} flagSize={24} />
              </td>
              <td className={styles.medalCell}>{r.gold}</td>
              <td className={styles.medalCell}>{r.silver}</td>
              <td className={styles.medalCell}>{r.bronze}</td>
              <td className={styles.medalCell}>
                <strong>{r.total}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
