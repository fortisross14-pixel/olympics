import { useMemo, useState } from 'react';
import styles from './Stars.module.css';
import { useCycleStore } from '../../store/cycleStore';
import { useUIStore } from '../../store/uiStore';
import { SPORTS } from '../../data/sports';
import { RARITY_BOOST } from '../../engine/legends';
import NationChip from '../../components/NationChip/NationChip';
import SportIcon from '../../components/SportIcon/SportIcon';

type StatusFilter = 'active' | 'retired' | 'all';

const RARITY_ORDER: Record<string, number> = { legend: 0, epic: 1, rare: 2 };
const RARITY_LABEL: Record<string, string> = {
  rare: 'Rare',
  epic: 'Epic',
  legend: 'Legend',
};

export default function Stars() {
  const legends = useCycleStore((s) => s.legends);
  const openLegend = useUIStore((s) => s.openLegend);
  const [status, setStatus] = useState<StatusFilter>('active');

  const rows = useMemo(() => {
    const filtered = legends.filter((l) => {
      if (status === 'active') return !l.retired;
      if (status === 'retired') return l.retired;
      return true;
    });
    return filtered
      .map((l) => ({
        legend: l,
        total: l.medals.gold + l.medals.silver + l.medals.bronze,
      }))
      .sort(
        (a, b) =>
          b.legend.medals.gold - a.legend.medals.gold ||
          b.total - a.total ||
          RARITY_ORDER[a.legend.rarity] - RARITY_ORDER[b.legend.rarity] ||
          a.legend.name.localeCompare(b.legend.name),
      );
  }, [legends, status]);

  const counts = useMemo(() => {
    const active = legends.filter((l) => !l.retired).length;
    return { active, retired: legends.length - active, all: legends.length };
  }, [legends]);

  return (
    <div>
      <h2>
        The <em>Stars</em>
      </h2>
      <p className="subtitle">
        Every legend across the cycles — their sport, rarity, and career medals
      </p>

      <div className={styles.filters}>
        <div className={styles.segmented}>
          {(['active', 'retired', 'all'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              className={`${styles.segBtn} ${status === s ? styles.segActive : ''}`}
              onClick={() => setStatus(s)}
            >
              {s === 'active' ? 'Active' : s === 'retired' ? 'Retired' : 'All'}
              <span className={styles.segCount}>{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className={styles.empty}>
          {legends.length === 0
            ? 'Legends are generated once a host city is selected.'
            : `No ${status} legends.`}
        </p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Legend</th>
              <th>Nation</th>
              <th>Sport</th>
              <th className={styles.cRarity}>Rarity</th>
              <th className={styles.cGames}>Games</th>
              <th className={styles.cMedal}>
                <span className={`${styles.badge} ${styles.dGold}`} />
              </th>
              <th className={styles.cMedal}>
                <span className={`${styles.badge} ${styles.dSilver}`} />
              </th>
              <th className={styles.cMedal}>
                <span className={`${styles.badge} ${styles.dBronze}`} />
              </th>
              <th className={styles.cMedal}>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ legend, total }) => {
              const sport = SPORTS.find((s) => s.id === legend.sportId);
              return (
                <tr key={legend.id} className={legend.retired ? styles.retiredRow : ''}>
                  <td>
                    <button
                      className={styles.nameBtn}
                      onClick={() => openLegend(legend.id)}
                    >
                      <span className={`${styles.rarityDot} ${styles[legend.rarity]}`} />
                      {legend.name}
                      <span className={styles.gender}>
                        {legend.gender === 'M' ? '♂' : '♀'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <NationChip code={legend.country} flagSize={20} />
                  </td>
                  <td>
                    <span className={styles.sportCell}>
                      {sport && (
                        <SportIcon id={sport.id} size={15} className={styles.sportIcon} />
                      )}
                      {sport?.name}
                    </span>
                  </td>
                  <td className={styles.cRarity}>
                    <span className={`${styles.rarityTag} ${styles[legend.rarity]}`}>
                      {RARITY_LABEL[legend.rarity]} +{RARITY_BOOST[legend.rarity]}
                    </span>
                  </td>
                  <td className={styles.cGames}>
                    {legend.gamesPlayed} / {legend.careerLength}
                  </td>
                  <td className={styles.cMedal}>{legend.medals.gold}</td>
                  <td className={styles.cMedal}>{legend.medals.silver}</td>
                  <td className={styles.cMedal}>{legend.medals.bronze}</td>
                  <td className={styles.cMedal}>
                    <strong>{total}</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
