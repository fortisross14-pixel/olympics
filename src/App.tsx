import { useState, useEffect } from 'react';
import styles from './App.module.css';
import { useCycleStore } from './store/cycleStore';
import Start from './screens/Start/Start';
import HostPicker from './screens/HostPicker/HostPicker';
import Rankings from './screens/Rankings/Rankings';
import Qualifiers from './screens/Qualifiers/Qualifiers';
import GamesDay from './screens/GamesDay/GamesDay';
import MedalTable from './screens/MedalTable/MedalTable';
import History from './screens/History/History';
import Flame from './components/Flame/Flame';
import NationModal from './components/NationModal/NationModal';
import LegendModal from './components/LegendModal/LegendModal';

export type TabId = 'start' | 'host' | 'rankings' | 'qualify' | 'sim' | 'table' | 'history';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'start', label: 'Cycle' },
  { id: 'host', label: 'Host City' },
  { id: 'rankings', label: 'Rankings' },
  { id: 'qualify', label: 'Qualifiers' },
  { id: 'sim', label: 'The Games' },
  { id: 'table', label: 'Medal Table' },
  { id: 'history', label: 'History' },
];

function hexToRgbTuple(hex: string): string {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) return '0,0,0';
  return m.map((h) => parseInt(h, 16)).join(', ');
}

export default function App() {
  const [active, setActive] = useState<TabId>('start');
  const currentCycle = useCycleStore((s) => s.currentCycle);
  const history = useCycleStore((s) => s.history);

  const stage = currentCycle?.stage;
  const inCycle = !!currentCycle;
  const hasHistory = history.length > 0;
  const hostCity = currentCycle?.hostCity;
  const qualified = stage === 'qualified' || stage === 'racing' || stage === 'complete';

  useEffect(() => {
    const root = document.documentElement;
    if (hostCity) {
      root.style.setProperty('--theme-primary', hostCity.themePrimary);
      root.style.setProperty('--theme-secondary', hostCity.themeSecondary);
      const rgb = hexToRgbTuple(hostCity.themePrimary);
      root.style.setProperty('--theme-primary-soft', `rgba(${rgb}, 0.08)`);
      root.style.setProperty('--theme-primary-rgb', rgb);
    } else {
      root.style.removeProperty('--theme-primary');
      root.style.removeProperty('--theme-secondary');
      root.style.removeProperty('--theme-primary-soft');
      root.style.removeProperty('--theme-primary-rgb');
    }
  }, [hostCity]);

  const enabled: Record<TabId, boolean> = {
    start: true,
    host: inCycle,
    rankings: inCycle && qualified,
    qualify: inCycle && qualified,
    sim: inCycle && qualified,
    table: inCycle && qualified,
    history: hasHistory,
  };

  useEffect(() => {
    if (stage === 'host' && active === 'start') setActive('host');
    if (stage === 'qualified' && active === 'host') setActive('rankings');
  }, [stage, active]);

  useEffect(() => {
    if (!enabled[active]) setActive('start');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled[active]]);

  const headerYear = currentCycle
    ? `${currentCycle.year} Cycle`
    : hasHistory
      ? `${history.length} ${history.length === 1 ? 'cycle' : 'cycles'} archived`
      : '— — —';

  const headerHost = currentCycle?.hostCity
    ? `Host: ${currentCycle.hostCity.name}`
    : currentCycle
      ? 'Host: pending'
      : 'Host: —';

  return (
    <div className={styles.frame}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Flame className={styles.flame} />
          <span className={styles.brandText}>The <em>Cycle</em></span>
        </div>
        <div className={styles.meta}>
          <div>{headerYear}</div>
          <div>{headerHost}</div>
        </div>
      </header>

      <nav className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${active === t.id ? styles.active : ''}`}
            disabled={!enabled[t.id]}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main>
        {active === 'start' && <Start />}
        {active === 'host' && <HostPicker />}
        {active === 'rankings' && <Rankings />}
        {active === 'qualify' && <Qualifiers />}
        {active === 'sim' && <GamesDay />}
        {active === 'table' && <MedalTable />}
        {active === 'history' && <History />}
      </main>

      <NationModal />
      <LegendModal />
    </div>
  );
}
