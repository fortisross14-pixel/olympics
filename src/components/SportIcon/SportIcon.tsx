/**
 * Sport icon component — single-color silhouettes in the Olympic
 * pictogram tradition. Icons inherit color from the CSS `color`
 * property via `fill="currentColor"`, so they can be themed:
 *
 *   <SportIcon id="athletics" style={{ color: 'var(--theme-primary)' }} />
 *
 * Paths are hand-drawn abstractions, not detailed athletes — same
 * visual weight across all sports so they read as a set.
 */

interface Props {
  id: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const PATHS: Record<string, string> = {
  // Athletics — runner mid-stride
  athletics: 'M14 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-3 4 1 3-3 4h2l3-4-1-2 2-2 1 4 3 1v-2l-2-1-1-3-1-2zm-5 4l-2 1v2l3-1 1-2z',

  // Swimming — swimmer doing front crawl
  swimming: 'M5 9a2 2 0 110 4 2 2 0 010-4zm3 5l3-1 3 1 3-2 3 1v2l-3-1-3 2-3-1-3 1-3-1v-2zm0 4l3-1 3 1 3-1 3 1v2l-3-1-3 1-3-1-3 1v-2z',

  // Gymnastics — figure on bar
  gymnastics: 'M4 6h16v1H4zM12 6v3a2 2 0 002 2 2 2 0 002-2v-2h1v3a3 3 0 01-3 3 3 3 0 01-3-3V6zm-2 8l-2 5h2l1-3 2 1 1 4h2l-1-5-3-2z',

  // Cycling — cyclist on bike (wheels + rider)
  cycling: 'M6 16a3 3 0 110 6 3 3 0 010-6zm12 0a3 3 0 110 6 3 3 0 010-6zM6 19h12M14 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 3 3 2-1 4h2l1-4-2-2 1-2 2 3h3v-2h-2l-2-3z',

  // Judo — two figures gripping
  judo: 'M8 4a2 2 0 110 4 2 2 0 010-4zm8 0a2 2 0 110 4 2 2 0 010-4zM7 9l-1 5 2 1v5h2v-5l1-1 2 1v5h2v-5l2-1-1-5h-2l-1 2-2 1-2-1-1-2z',

  // Boxing — gloved fist
  boxing: 'M9 5a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 4 2 2v5h2v-4l3-1 3 2 2-1v-3l-3 1-2-1-1-2v-2z',

  // Wrestling — two figures locked
  wrestling: 'M7 5a2 2 0 110 4 2 2 0 010-4zm10 0a2 2 0 110 4 2 2 0 010-4zM5 10l3 1 2-1 2 1 2-1 3 1v3l-2 1-1 4h-2l1-4-2-1-2 1 1 4H8l-1-4-2-1z',

  // Fencing — fencer lunging with sabre
  fencing: 'M5 6a2 2 0 110 4 2 2 0 010-4zm-1 5l1 3 2 1v6h2v-5l2-1 8-2v-2l-7 2-2-1-1-2zm10 0l7-1v1l-7 1z',

  // Tennis — figure with racquet
  tennis: 'M13 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-3 3 2 2-1 6h2l1-5 2-1 3 3 2-1-3-4-2-1zm5-3l2 1 1 2-1 2-1 1-2-1-1-2 1-2z',

  // Table Tennis — paddle + ball
  tabletennis: 'M9 4a2 2 0 110 4 2 2 0 010-4zm-2 5l3 2 2 4-1 6h2l1-5 4-2 2-3-2-1-2 2-3-1-2-1zm10-3a2 2 0 110 4 2 2 0 010-4z',

  // Basketball — figure shooting
  basketball: 'M12 3a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 2 1 3-2 5h2l2-4 2 2-1 4h2l1-5-2-3 2-2 2 2 1 3 2-1-2-4-3-2z',

  // Football — figure kicking ball
  football: 'M11 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 3 2 3-1 6h2l1-5 2 2-1 3 2 1 1-3-2-3 2-2 2 1 1-2-4-3zm6 8a2 2 0 110 4 2 2 0 010-4z',

  // Volleyball — figure spiking
  volleyball: 'M10 3a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 3 1 3 2 1-1 6h2l1-5 1 1 1-2-2-3 2-1 2-2-2-1-2 2zm9 1a2 2 0 110 3 2 2 0 010-3z',

  // Handball — figure throwing
  handball: 'M11 4a2 2 0 110 4 2 2 0 010-4zm-2 5l-2 3 2 2-1 6h2l1-5 2 1 1-2 3 1 2-2-3-2-2-1-2 1-1-2zm6-1a2 2 0 110 3 2 2 0 010-3z',

  // Field Hockey — figure with stick
  hockey: 'M9 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 3 2 2-1 6h2l1-5 3 1 6-4-1-1-5 3-2-1-1-2zm9 9a1 1 0 110 2 1 1 0 010-2z',

  // Water Polo — figure in water with ball
  waterpolo: 'M11 7a2 2 0 110 4 2 2 0 010-4zm-2 5l3 1 2-1 1 2 2-1v3l-2 1-2-1-2 1-2-1zM4 18l3-1 3 1 3-1 3 1 3-1v2l-3 1-3-1-3 1-3-1-3 1z',

  // Rugby Sevens — figure carrying ball
  rugby: 'M10 4a2 2 0 110 4 2 2 0 010-4zm-2 5l-2 3 3 2-1 6h2l1-5 3 1 2-2 3 1v-2l-3-1-2-1-1 1-2-2-1-2zm6 1l3-2 1 1-3 3z',

  // Rowing — rower with oars
  rowing: 'M12 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 2 1 3-2 4-3 1v2l4-1 2-3 1 2 4 2v-2l-3-1-1-3 1-3 2-2-2-1z',

  // Archery — archer drawing bow
  archery: 'M8 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 2 2 2v7h2v-6l2-1 1 3 8 1v-2l-7-1-1-3-1-1-2-1zm-1 4l-2 2 1 2 2-2zm10-2h6v1h-6z',

  // Weightlifting — lifter with barbell overhead
  weightlifting: 'M11 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 2 1 2 2 1v7h2v-7l2-1 1-2-2-2zM4 11h2v3H4zm14 0h2v3h-2zM3 9h1v7H3zm17 0h1v7h-1z',

  // ====== Demonstration sport icons (less detailed, generic) ======

  // Padel / Squash — racquet with smaller frame
  demo_padel: 'M12 3a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 2 2 3-1 6h2l1-5 2 1 3-2 2-2-2-1-2 1-2-1zm5-3a2 2 0 110 3 2 2 0 010-3z',
  demo_squash: 'M12 3a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 2 2 3-1 6h2l1-5 2 1 3-2 2-2-2-1-2 1-2-1zm5-3a2 2 0 110 3 2 2 0 010-3z',

  // Futsal — small ball with foot
  demo_futsal: 'M11 5a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 2 2 3-1 6h2l1-5 3 2 3-2 1 1 1-1-3-3-3 1-2-1-1-2zm6 7a1 1 0 110 2 1 1 0 010-2z',

  // Beach Football — football with waves below
  demo_beach_football: 'M11 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 3 2 3-1 5h2l2-4 2 1 1-2-2-3 2-2-2-1zM3 18l3-1 3 1 3-1 3 1 3-1 3 1v2l-3-1-3 1-3-1-3 1-3-1-3 1z',

  // Karate — figure with high kick
  demo_karate: 'M10 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 2 2 4 4-1 3 1v-2l-2-1-2-2-1-1zm-1 7l-2 3h2l1-1 2 2 1 4h2l-1-5z',

  // Cricket — bat + ball
  demo_cricket: 'M9 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 2 2 2 4-3 5 7 2-1-6-7 1-2zm-2 7l-2 3h2l3-3z',

  // Sumo — large rounded figure
  demo_sumo: 'M12 4a2 2 0 110 4 2 2 0 010-4zm-3 5h6l1 3-1 4 1 4h-2l-1-3h-2l-1 3H8l1-4-1-4z',

  // Taekwondo — high kick variant
  demo_taekwondo: 'M11 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 2 2 3 5-1 2 2 2-1-3-3-3 1-3-1zm-1 7l-2 4h2l1-2 2 2 1 3h2l-1-5z',

  // Pétanque — small balls
  demo_petanque: 'M9 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 3 2 3-1 6h2l1-5 3 1 2 1 1-3-3-1-2 1-2-3zm-2 11a2 2 0 110 2 2 2 0 010-2zm5-1a2 2 0 110 2 2 2 0 010-2zm5 1a2 2 0 110 2 2 2 0 010-2z',

  // Netball — figure with raised arms
  demo_netball: 'M12 3a2 2 0 110 4 2 2 0 010-4zm-2 5l-1 3 1 2v6h2v-4l1 2 2 3h2l-2-4-1-3 1-1 2-2-2-2zm6 1a1 1 0 110 2 1 1 0 010-2z',

  // Polo — horse rider
  demo_polo: 'M14 4a2 2 0 110 4 2 2 0 010-4zM4 14l3-1 4 1 3-2 6 1 2 4h-3l-1-2-3-1-2 2-3-1 1 4h-2l-1-4-2 1-2 1z',

  // Kabaddi — running figure with team
  demo_kabaddi: 'M10 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-3 3 2 4 5-1 1-2-3-1-1-2zm-1 7l-2 4h2l2-2 2 2 1 2h2l-2-4-3-1z',

  // Bandy / Floor Curling — generic team game
  demo_bandy: 'M4 8h16v1H4zm0 5h16v1H4zm0 5h16v1H4zM10 4a2 2 0 110 4 2 2 0 010-4z',
  demo_floor_curling: 'M12 8a4 4 0 110 8 4 4 0 010-8zm0 2a2 2 0 100 4 2 2 0 000-4zM4 12h4v1H4zm12 0h4v1h-4z',

  // Foot Tennis
  demo_foottennis: 'M11 4a2 2 0 110 4 2 2 0 010-4zm-1 5l-2 2 2 3 3 1-1 5h2l1-4 3 2 3-1v-2l-3 1-2-2 1-2-2-2-1 2-2-2zM2 14h20v1H2z',
};

const DEFAULT_PATH = 'M12 4a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z';

export default function SportIcon({ id, size = 20, className, style }: Props) {
  const path = PATHS[id] ?? DEFAULT_PATH;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d={path} />
    </svg>
  );
}
