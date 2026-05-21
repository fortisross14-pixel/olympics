import styles from './EventResultModal.module.css';
import { useUIStore } from '../../store/uiStore';
import { useCycleStore } from '../../store/cycleStore';
import { findEventInCycle, findSportInCycle } from '../../engine/lookup';
import { findCountry } from '../../data/countries';
import { formatValue } from '../../engine/results';
import { legendsInEvent } from '../../engine/legends';
import Flag from '../Flag/Flag';
import SportIcon from '../SportIcon/SportIcon';
import NationChip from '../NationChip/NationChip';

export default function EventResultModal() {
  const id = useUIStore((s) => s.eventModalId);
  const close = useUIStore((s) => s.closeEvent);
  const openLegend = useUIStore((s) => s.openLegend);
  const cycle = useCycleStore((s) => s.currentCycle);
  const legends = useCycleStore((s) => s.legends);

  if (!id || !cycle) return null;
  const result = cycle.results[id];
  const event = findEventInCycle(id, cycle);
  const sport = findSportInCycle(id, cycle);
  if (!result || !event || !sport) return null;

  // Legends competing in this event, indexed by country
  const evLegends = legendsInEvent(id, legends);
  const legendByCountry = new Map<string, typeof evLegends>();
  for (const lg of evLegends) {
    const arr = legendByCountry.get(lg.country) ?? [];
    arr.push(lg);
    legendByCountry.set(lg.country, arr);
  }

  return (
    <div className={styles.overlay} onClick={close}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={close}>×</button>

        <div className={styles.header}>
          <div className={styles.sportChip}>
            <SportIcon id={sport.id} size={22} />
          </div>
          <div>
            <div className={styles.name}>{event.name}</div>
            <div className={styles.sub}>
              {sport.name} · Final
              {result.upset && <span className={styles.upsetTag}>UPSET</span>}
            </div>
          </div>
        </div>

        {evLegends.length > 0 && (
          <div className={styles.legendStrip}>
            <span className={styles.legendStripLabel}>Legends in this event</span>
            <div className={styles.legendChips}>
              {evLegends.map((lg) => (
                <button
                  key={lg.id}
                  className={`${styles.legendChip} ${styles[lg.rarity]}`}
                  onClick={() => openLegend(lg.id)}
                >
                  ★ {lg.name} · {lg.country}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.standings}>
          <div className={styles.standHead}>
            <span className={styles.cRank}>#</span>
            <span className={styles.cNation}>Nation</span>
            <span className={styles.cValue}>Result</span>
          </div>
          {result.standings.map((place) => {
            const country = findCountry(place.country);
            const placeLegends = legendByCountry.get(place.country) ?? [];
            const medal =
              place.rank === 1 ? 'gold'
              : place.rank === 2 ? 'silver'
              : place.rank === 3 ? 'bronze'
              : '';
            return (
              <div
                key={place.country}
                className={`${styles.standRow} ${medal ? styles[medal] : ''}`}
              >
                <span className={`${styles.cRank} ${styles.rankChip} ${medal ? styles[`chip_${medal}`] : ''}`}>
                  {place.rank}
                </span>
                <span className={styles.cNation}>
                  <Flag code={place.country} size={24} />
                  <strong className={styles.code}>{place.country}</strong>
                  <span className={styles.cname}>{country?.name}</span>
                  {placeLegends.length > 0 && (
                    <span className={styles.starGroup}>
                      {placeLegends.map((lg) => (
                        <button
                          key={lg.id}
                          className={styles.star}
                          onClick={() => openLegend(lg.id)}
                          title={lg.name}
                        >
                          ★
                        </button>
                      ))}
                    </span>
                  )}
                </span>
                <span className={styles.cValue}>
                  {formatValue(event, place.value) || '—'}
                </span>
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          Click a ★ to see the legend · click a nation row’s flag area to inspect
        </div>
        <div className={styles.nationLinks}>
          {result.standings.slice(0, 3).map((p) => (
            <NationChip key={p.country} code={p.country} flagSize={18} />
          ))}
        </div>
      </div>
    </div>
  );
}
