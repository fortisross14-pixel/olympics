import { useUIStore } from '../../store/uiStore';
import Flag from '../Flag/Flag';
import styles from './NationChip.module.css';

interface Props {
  code: string;
  /** Flag size in px */
  flagSize?: number;
  /** Show the country code text after the flag */
  showCode?: boolean;
  /** Optional extra label after the code (e.g. full name) */
  label?: string;
  className?: string;
}

/**
 * A clickable country reference — flag (+ optional code/label).
 * Clicking opens the shared NationModal for that country.
 */
export default function NationChip({
  code,
  flagSize = 20,
  showCode = true,
  label,
  className,
}: Props) {
  const openNation = useUIStore((s) => s.openNation);
  return (
    <button
      className={`${styles.chip} ${className ?? ''}`}
      onClick={(e) => {
        e.stopPropagation();
        openNation(code);
      }}
      title={`View ${code} details`}
    >
      <Flag code={code} size={flagSize} />
      {showCode && <strong className={styles.code}>{code}</strong>}
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
}
