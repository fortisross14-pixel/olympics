import { useMemo } from 'react';
import styles from './Rankings.module.css';
import { useCycleStore } from '../../store/cycleStore';
import { COUNTRIES } from '../../data/countries';
import { nationScore } from '../../engine/nation';
import NationChip from '../../components/NationChip/NationChip';

export default function Rankings() {
  const cycle = useCycleStore((s) => s.currentCycle);
  const ratings = cycle?.ratings ?? {};
  const hasRatings = Object.keys(ratings).length > 0;
  const demoSportIds = useMemo(
    () => new Set(cycle?.demoSportIds ?? []),
    [cycle?.demoSportIds],
  );

  const rows = useMemo(() => {
    const list = COUNTRIES.map((c) => ({
      code: c.code,
      name: c.name,
      tier: c.tier,
      score: hasRatings ? nationScore(c.code, ratings, demoSportIds) : 0,
    }));
    list.sort((a, b) => b.score - a.score || a.code.localeCompare(b.code));
    return list;
  }, [ratings, hasRatings, demoSportIds]);

  return (
    <div>
      <h2>
        Nation <em>Rankings</em>
      </h2>
      <p className="subtitle">
        {hasRatings
          ? 'Total strength across all sports — click any nation for the full breakdown'
          : 'Select a host city to generate this cycle’s ratings'}
      </p>

      {hasRatings && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.rankCol}>#</th>
              <th>Nation</th>
              <th className={styles.tierCol}>Tier</th>
              <th className={styles.scoreCol}>Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.code}>
                <td className={styles.rankCol}>{i + 1}</td>
                <td>
                  <NationChip code={r.code} label={r.name} flagSize={22} />
                </td>
                <td className={styles.tierCol}>T{r.tier}</td>
                <td className={styles.scoreCol}>
                  <span className={styles.scoreBar}>
                    <span
                      className={styles.scoreFill}
                      style={{ width: `${Math.min(100, (r.score / 100) * 100)}%` }}
                    />
                  </span>
                  <strong>{r.score}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
