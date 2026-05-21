import styles from './NationModal.module.css';
import { useUIStore } from '../../store/uiStore';
import { useCycleStore } from '../../store/cycleStore';
import { findCountry } from '../../data/countries';
import {
  nationScore,
  nationSportRatings,
  nationAllTimeMedals,
  nationCurrentMedals,
} from '../../engine/nation';
import Flag from '../Flag/Flag';

export default function NationModal() {
  const code = useUIStore((s) => s.nationModalCode);
  const close = useUIStore((s) => s.closeNation);
  const cycle = useCycleStore((s) => s.currentCycle);
  const history = useCycleStore((s) => s.history);

  if (!code) return null;
  const country = findCountry(code);
  if (!country) return null;

  const ratings = cycle?.ratings ?? {};
  const demoSportIds = new Set(cycle?.demoSportIds ?? []);
  const hasRatings = Object.keys(ratings).length > 0;

  const score = hasRatings ? nationScore(code, ratings, demoSportIds) : null;
  const sportRatings = hasRatings ? nationSportRatings(code, ratings) : [];
  const allTime = nationAllTimeMedals(code, history);
  const current = nationCurrentMedals(code, cycle);

  const specialties = new Set(country.specialties ?? []);

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={close}>×</button>

        <div className={styles.header}>
          <Flag code={code} size={48} />
          <div>
            <div className={styles.name}>{country.name}</div>
            <div className={styles.tier}>
              {code} · Tier {country.tier}
            </div>
          </div>
          {score !== null && (
            <div className={styles.scoreBox}>
              <div className={styles.scoreNum}>{score}</div>
              <div className={styles.scoreLabel}>Score</div>
            </div>
          )}
        </div>

        {/* Medals */}
        <div className={styles.medalRow}>
          <div className={styles.medalGroup}>
            <div className={styles.medalGroupLabel}>This Cycle</div>
            <div className={styles.medals}>
              <Medal kind="gold" n={current.gold} />
              <Medal kind="silver" n={current.silver} />
              <Medal kind="bronze" n={current.bronze} />
            </div>
          </div>
          <div className={styles.medalGroup}>
            <div className={styles.medalGroupLabel}>All-Time</div>
            <div className={styles.medals}>
              <Medal kind="gold" n={allTime.gold} />
              <Medal kind="silver" n={allTime.silver} />
              <Medal kind="bronze" n={allTime.bronze} />
            </div>
          </div>
        </div>

        {/* Per-sport ratings */}
        {hasRatings ? (
          <div className={styles.sports}>
            <div className={styles.sportsLabel}>Rating by Sport</div>
            <div className={styles.sportGrid}>
              {sportRatings.map((sr) => (
                <div key={sr.sportId} className={styles.sportItem}>
                  <span className={styles.sportName}>
                    {specialties.has(sr.sportId) && <span className={styles.star}>★</span>}
                    {sr.sportName}
                  </span>
                  <span className={styles.sportRating}>{sr.rating}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.noRatings}>
            Ratings appear once a host city is selected.
          </div>
        )}
      </div>
    </div>
  );
}

function Medal({ kind, n }: { kind: 'gold' | 'silver' | 'bronze'; n: number }) {
  return (
    <div className={styles.medal}>
      <span className={`${styles.dot} ${styles[kind]}`} />
      <span className={styles.medalN}>{n}</span>
    </div>
  );
}
