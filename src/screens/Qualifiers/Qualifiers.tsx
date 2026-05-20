import { useState } from 'react';
import styles from './Qualifiers.module.css';
import { useCycleStore } from '../../store/cycleStore';
import { findCountry } from '../../data/countries';
import { findEventInCycle, findSportInCycle, sportsForCycle } from '../../engine/lookup';
import SportIcon from '../../components/SportIcon/SportIcon';
import Flag from '../../components/Flag/Flag';

export default function Qualifiers() {
  const cycle = useCycleStore((s) => s.currentCycle);
  const qualifiers = cycle?.qualifiers ?? {};
  const ratings = cycle?.ratings ?? {};
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const selectedEvent = selectedEventId ? findEventInCycle(selectedEventId, cycle) : null;
  const selectedSport = selectedEventId ? findSportInCycle(selectedEventId, cycle) : null;
  const selectedQuals = selectedEventId ? qualifiers[selectedEventId] : null;

  const sports = sportsForCycle(cycle);

  return (
    <div>
      <h2>
        The <em>Qualified</em>
      </h2>
      <p className="subtitle">Eight nations per event. Brackets locked.</p>
      <div className={styles.split}>
        <div className={styles.col}>
          <h3 className={styles.colHeader}>By Event</h3>
          <div>
            {sports.map((sport) =>
              sport.events.map((event) => (
                <div
                  key={event.id}
                  className={`${styles.row} ${selectedEventId === event.id ? styles.rowActive : ''} ${sport.demonstration ? styles.demoRow : ''}`}
                  onClick={() => setSelectedEventId(event.id)}
                >
                  <span className={styles.evCell}>
                    <SportIcon id={sport.id} size={14} className={styles.rowIcon} />
                    {sport.demonstration && <span className={styles.demoTag}>DEMO</span>}
                    {event.name}
                  </span>
                  <span className={styles.rowLabel}>{sport.name}</span>
                </div>
              )),
            )}
          </div>
        </div>
        <div className={styles.col}>
          <h3 className={styles.colHeader}>Selected</h3>
          <div className={styles.detail}>
            {!selectedEvent ? (
              <>
                <div className={styles.detailTitle}>Select an event</div>
                <div className={styles.detailSub}>View qualified nations</div>
              </>
            ) : (
              <>
                <div className={styles.detailTitle}>
                  {selectedSport && <SportIcon id={selectedSport.id} size={20} className={styles.detailIcon} />}
                  {selectedSport?.demonstration && <span className={styles.demoTagDark}>DEMO</span>}
                  {selectedEvent.name}
                </div>
                <div className={styles.detailSub}>
                  {selectedSport?.name} · 8 qualified
                  {selectedSport?.demonstration && ' · medals not in totals'}
                </div>
                <div className={styles.qlist}>
                  {selectedQuals?.map((code) => {
                    const country = findCountry(code);
                    const rating = ratings[code]?.[selectedSport!.id] ?? 0;
                    return (
                      <div key={code} className={styles.qitem}>
                        <span>
                          <Flag code={code} size={18} className={styles.qFlag} /> {code} · {country?.name}
                        </span>
                        <span className={styles.ratingDots}>{'●'.repeat(Math.round(rating))}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
