/**
 * Flag component — renders country flags as inline SVG.
 *
 * Why SVG and not Unicode emoji: Chrome on Windows does not render
 * regional-indicator emoji as flags (Windows ships no flag glyphs),
 * showing "ES", "PL" etc. instead. Inline SVG works on every platform.
 *
 * Flags are simplified but recognizable — correct colors and layout
 * for the 20 tracked countries. Drawn in a 3:2 aspect ratio.
 */

interface Props {
  /** Country code (3-letter, e.g. 'USA', 'GBR') */
  code: string;
  /** Rendered width in px (height is 2/3 of this) */
  size?: number;
  className?: string;
}

// Each flag is a function returning SVG inner content for a 30x20 viewBox.
const FLAGS: Record<string, () => React.ReactNode> = {
  USA: () => (
    <>
      <rect width="30" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * (20 / 13)} width="30" height={20 / 13} fill="#b22234" />
      ))}
      <rect width="12" height={20 * (7 / 13)} fill="#3c3b6e" />
    </>
  ),
  CHN: () => (
    <>
      <rect width="30" height="20" fill="#de2910" />
      <text x="6" y="8" fontSize="6" fill="#ffde00" textAnchor="middle">★</text>
      <text x="11" y="4" fontSize="2.5" fill="#ffde00">★</text>
      <text x="13" y="7" fontSize="2.5" fill="#ffde00">★</text>
      <text x="13" y="11" fontSize="2.5" fill="#ffde00">★</text>
      <text x="11" y="14" fontSize="2.5" fill="#ffde00">★</text>
    </>
  ),
  RUS: () => (
    <>
      <rect width="30" height="6.67" fill="#fff" />
      <rect y="6.67" width="30" height="6.67" fill="#0039a6" />
      <rect y="13.33" width="30" height="6.67" fill="#d52b1e" />
    </>
  ),
  GBR: () => (
    <>
      <rect width="30" height="20" fill="#012169" />
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" strokeWidth="4" />
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#c8102e" strokeWidth="2" />
      <path d="M15,0 V20 M0,10 H30" stroke="#fff" strokeWidth="6" />
      <path d="M15,0 V20 M0,10 H30" stroke="#c8102e" strokeWidth="3.5" />
    </>
  ),
  GER: () => (
    <>
      <rect width="30" height="6.67" fill="#000" />
      <rect y="6.67" width="30" height="6.67" fill="#dd0000" />
      <rect y="13.33" width="30" height="6.67" fill="#ffce00" />
    </>
  ),
  JPN: () => (
    <>
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="6" fill="#bc002d" />
    </>
  ),
  FRA: () => (
    <>
      <rect width="10" height="20" fill="#002395" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#ed2939" />
    </>
  ),
  AUS: () => (
    <>
      <rect width="30" height="20" fill="#012169" />
      <rect width="15" height="10" fill="#012169" />
      <path d="M0,0 L15,10 M15,0 L0,10" stroke="#fff" strokeWidth="2" />
      <path d="M7.5,0 V10 M0,5 H15" stroke="#fff" strokeWidth="3" />
      <path d="M7.5,0 V10 M0,5 H15" stroke="#c8102e" strokeWidth="1.5" />
      <text x="22" y="13" fontSize="5" fill="#fff" textAnchor="middle">★</text>
    </>
  ),
  ITA: () => (
    <>
      <rect width="10" height="20" fill="#009246" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#ce2b37" />
    </>
  ),
  KOR: () => (
    <>
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="4" fill="#cd2e3a" />
      <path d="M15,6 a4,4 0 0,1 0,8 a2,2 0 0,1 0,-4 a2,2 0 0,0 0,-4" fill="#0047a0" />
    </>
  ),
  NED: () => (
    <>
      <rect width="30" height="6.67" fill="#ae1c28" />
      <rect y="6.67" width="30" height="6.67" fill="#fff" />
      <rect y="13.33" width="30" height="6.67" fill="#21468b" />
    </>
  ),
  ESP: () => (
    <>
      <rect width="30" height="20" fill="#aa151b" />
      <rect y="5" width="30" height="10" fill="#f1bf00" />
    </>
  ),
  CAN: () => (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="7.5" height="20" fill="#ff0000" />
      <rect x="22.5" width="7.5" height="20" fill="#ff0000" />
      <text x="15" y="14" fontSize="9" fill="#ff0000" textAnchor="middle">🍁</text>
    </>
  ),
  BRA: () => (
    <>
      <rect width="30" height="20" fill="#009c3b" />
      <path d="M15,2 L28,10 L15,18 L2,10 Z" fill="#ffdf00" />
      <circle cx="15" cy="10" r="4.5" fill="#002776" />
    </>
  ),
  KEN: () => (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="5.5" fill="#000" />
      <rect y="6" width="30" height="8" fill="#bb0000" />
      <rect y="14.5" width="30" height="5.5" fill="#006600" />
    </>
  ),
  JAM: () => (
    <>
      <rect width="30" height="20" fill="#009b3a" />
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fed100" strokeWidth="4" />
      <path d="M0,0 L13,10 L0,20 Z" fill="#000" />
      <path d="M30,0 L17,10 L30,20 Z" fill="#000" />
    </>
  ),
  HUN: () => (
    <>
      <rect width="30" height="6.67" fill="#ce2939" />
      <rect y="6.67" width="30" height="6.67" fill="#fff" />
      <rect y="13.33" width="30" height="6.67" fill="#477050" />
    </>
  ),
  POL: () => (
    <>
      <rect width="30" height="10" fill="#fff" />
      <rect y="10" width="30" height="10" fill="#dc143c" />
    </>
  ),
  NOR: () => (
    <>
      <rect width="30" height="20" fill="#ef2b2d" />
      <path d="M9,0 V20 M0,10 H30" stroke="#fff" strokeWidth="5" />
      <path d="M9,0 V20 M0,10 H30" stroke="#002868" strokeWidth="2.5" />
    </>
  ),
  NZL: () => (
    <>
      <rect width="30" height="20" fill="#00247d" />
      <rect width="15" height="10" fill="#00247d" />
      <path d="M0,0 L15,10 M15,0 L0,10" stroke="#fff" strokeWidth="2" />
      <path d="M7.5,0 V10 M0,5 H15" stroke="#fff" strokeWidth="3" />
      <path d="M7.5,0 V10 M0,5 H15" stroke="#cc142b" strokeWidth="1.5" />
      <text x="22" y="8" fontSize="3.5" fill="#cc142b">★</text>
      <text x="25" y="13" fontSize="3.5" fill="#cc142b">★</text>
      <text x="20" y="15" fontSize="3.5" fill="#cc142b">★</text>
    </>
  ),
};

export default function Flag({ code, size = 20, className }: Props) {
  const draw = FLAGS[code];
  if (!draw) return null;
  return (
    <svg
      width={size}
      height={size * (2 / 3)}
      viewBox="0 0 30 20"
      className={className}
      style={{ display: 'inline-block', verticalAlign: '-2px', borderRadius: 1.5 }}
      aria-label={`Flag of ${code}`}
    >
      {draw()}
    </svg>
  );
}
