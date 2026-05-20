/**
 * Flag component — renders a country flag as Unicode emoji.
 * Uses regional indicator symbols built from the country's 2-letter
 * ISO code (mapped from our 3-letter codes).
 *
 * Renders natively in modern browsers/OS — no images, no deps.
 * Some platforms (Windows) don't render flag emojis as flags, falling
 * back to text like "US". That's acceptable degradation.
 */

interface Props {
  /** Country code (3-letter, e.g. 'USA', 'GBR') */
  code: string;
  className?: string;
  /** CSS font-size for the flag */
  size?: number | string;
}

/** Map our 3-letter country codes to ISO 3166-1 alpha-2 codes. */
const CODE_MAP: Record<string, string> = {
  USA: 'US',
  CHN: 'CN',
  RUS: 'RU',
  GBR: 'GB',
  GER: 'DE',
  JPN: 'JP',
  FRA: 'FR',
  AUS: 'AU',
  ITA: 'IT',
  KOR: 'KR',
  NED: 'NL',
  ESP: 'ES',
  CAN: 'CA',
  BRA: 'BR',
  KEN: 'KE',
  JAM: 'JM',
  HUN: 'HU',
  POL: 'PL',
  NOR: 'NO',
  NZL: 'NZ',
};

/** Convert a 2-letter code into its flag emoji string. */
function codeToFlag(twoLetterCode: string): string {
  if (twoLetterCode.length !== 2) return '';
  const codePoints = twoLetterCode
    .toUpperCase()
    .split('')
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function Flag({ code, className, size }: Props) {
  const iso2 = CODE_MAP[code];
  if (!iso2) return null;
  return (
    <span
      className={className}
      style={size ? { fontSize: size, lineHeight: 1 } : undefined}
      aria-label={`Flag of ${code}`}
    >
      {codeToFlag(iso2)}
    </span>
  );
}
