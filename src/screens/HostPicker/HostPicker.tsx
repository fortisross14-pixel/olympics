import styles from './HostPicker.module.css';
import { useCycleStore } from '../../store/cycleStore';
import type { City } from '../../engine/types';
import Flag from '../../components/Flag/Flag';

export default function HostPicker() {
  const candidates = useCycleStore((s) => s.hostCandidates);
  const selectHost = useCycleStore((s) => s.selectHost);
  const hostCity = useCycleStore((s) => s.currentCycle?.hostCity ?? null);

  if (hostCity) {
    return (
      <div>
        <h2>Host <em>Confirmed</em></h2>
        <p className="subtitle">{hostCity.name} · {hostCity.country}</p>
        <div className={styles.confirmed}>
          <div className={styles.confirmedCard} style={{
            background: `linear-gradient(135deg, ${hostCity.themePrimary}, ${hostCity.themeSecondary})`,
          }}>
            <div className={styles.confirmedInner}>
              <div className={styles.num}>Host City</div>
              <div className={styles.name}>
                {hostCity.countryCode && <Flag code={hostCity.countryCode} size={36} className={styles.confirmedFlag} />}
                {hostCity.name}
              </div>
              <div className={styles.country}>{hostCity.country}</div>
              <div className={styles.bonus}>+ {hostCity.bonus}</div>
              {hostCity.countryCode && (
                <div className={styles.boost}>Home boost applied · +0.7 across sports</div>
              )}
              {hostCity.demonstrationSports && hostCity.demonstrationSports.length > 0 && (
                <div className={styles.demoList}>
                  <div className={styles.demoLabel}>Demonstration sports</div>
                  <div className={styles.demoNames}>
                    {hostCity.demonstrationSports.map((s) => s.name).join(' · ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Select the <em>Host</em></h2>
      <p className="subtitle">Three candidates. The chosen city colors will theme these Games.</p>
      <div className={styles.cities}>
        {candidates.map((city, i) => (
          <CityCard key={city.name} city={city} index={i} onSelect={() => selectHost(city)} />
        ))}
      </div>
    </div>
  );
}

interface CityCardProps {
  city: City;
  index: number;
  onSelect: () => void;
}

function CityCard({ city, index, onSelect }: CityCardProps) {
  const demos = city.demonstrationSports ?? [];
  return (
    <button className={styles.city} onClick={onSelect}>
      <div className={styles.num}>Candidate {String(index + 1).padStart(2, '0')}</div>
      <div className={styles.name}>
        {city.countryCode && <Flag code={city.countryCode} size={28} className={styles.cardFlag} />}
        {city.name}
      </div>
      <div className={styles.country}>{city.country}</div>
      <div className={styles.themeChips}>
        <span className={styles.chip} style={{ background: city.themePrimary }} />
        <span className={styles.chip} style={{ background: city.themeSecondary }} />
      </div>
      <div className={styles.bonus}>+ {city.bonus}</div>
      {demos.length > 0 && (
        <div className={styles.cardDemos}>
          <span className={styles.demoTag}>DEMO</span>
          {demos.map((s) => s.name).join(' · ')}
        </div>
      )}
    </button>
  );
}
