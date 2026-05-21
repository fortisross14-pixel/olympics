import styles from './LegendModal.module.css';
import { useUIStore } from '../../store/uiStore';
import { useCycleStore } from '../../store/cycleStore';
import { findCountry } from '../../data/countries';
import { SPORTS } from '../../data/sports';
import { RARITY_BOOST } from '../../engine/legends';
import Flag from '../Flag/Flag';
import SportIcon from '../SportIcon/SportIcon';

const RARITY_LABEL: Record<string, string> = {
  rare: 'Rare',
  epic: 'Epic',
  legend: 'Legend',
};

export default function LegendModal() {
  const id = useUIStore((s) => s.legendModalId);
  const close = useUIStore((s) => s.closeLegend);
  const legends = useCycleStore((s) => s.legends);

  if (!id) return null;
  const legend = legends.find((l) => l.id === id);
  if (!legend) return null;

  const country = findCountry(legend.country);
  const sport = SPORTS.find((s) => s.id === legend.sportId);
  const totalMedals = legend.medals.gold + legend.medals.silver + legend.medals.bronze;

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={close}>×</button>

        <div className={`${styles.rarityBar} ${styles[legend.rarity]}`}>
          {RARITY_LABEL[legend.rarity]} · +{RARITY_BOOST[legend.rarity]} boost
        </div>

        <div className={styles.header}>
          {sport && <SportIcon id={sport.id} size={40} className={styles.sportIcon} />}
          <div>
            <div className={styles.name}>{legend.name}</div>
            <div className={styles.sub}>
              <Flag code={legend.country} size={18} />
              {country?.name} · {sport?.name} · {legend.gender === 'M' ? "Men's" : "Women's"}
            </div>
          </div>
        </div>

        <div className={styles.statRow}>
          <Stat label="Status" value={legend.retired ? 'Retired' : 'Active'} />
          <Stat label="Games" value={`${legend.gamesPlayed} / ${legend.careerLength}`} />
          <Stat label="Total Medals" value={String(totalMedals)} />
        </div>

        <div className={styles.medalsBox}>
          <div className={styles.medalsLabel}>Career Medals</div>
          <div className={styles.medals}>
            <div className={styles.medal}>
              <span className={`${styles.dot} ${styles.gold}`} />
              <span className={styles.medalN}>{legend.medals.gold}</span>
            </div>
            <div className={styles.medal}>
              <span className={`${styles.dot} ${styles.silver}`} />
              <span className={styles.medalN}>{legend.medals.silver}</span>
            </div>
            <div className={styles.medal}>
              <span className={`${styles.dot} ${styles.bronze}`} />
              <span className={styles.medalN}>{legend.medals.bronze}</span>
            </div>
          </div>
        </div>

        {!legend.retired && legend.currentEventIds.length > 0 && (
          <div className={styles.eventsBox}>
            <div className={styles.eventsLabel}>
              Competing this cycle · {legend.currentEventIds.length} event
              {legend.currentEventIds.length === 1 ? '' : 's'}
            </div>
            <div className={styles.eventList}>
              {legend.currentEventIds.map((eid) => {
                const ev = sport?.events.find((e) => e.id === eid);
                return (
                  <span key={eid} className={styles.eventPill}>
                    {ev?.name ?? eid}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
