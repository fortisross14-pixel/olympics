interface Props {
  className?: string;
  size?: number;
}

/**
 * Stylized flame mark — original silhouette evoking the Olympic torch
 * tradition. The shape is two interlocking curves (rising, returning),
 * suggesting both flame and cycle. Filled with current theme primary.
 */
export default function Flame({ className, size = 36 }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer flame shape — fills with theme primary */}
      <path
        d="M18 4 C 14 9, 11 12, 11 17 C 11 21, 14 24, 18 24 C 22 24, 25 21, 25 17 C 25 13, 22 11, 20 8 C 19 7, 18.5 5.5, 18 4 Z"
        fill="var(--theme-primary, #c1272d)"
      />
      {/* Inner negative-space curl — creates depth */}
      <path
        d="M18 11 C 16 13, 15 15, 15 17.5 C 15 19.5, 16.5 21, 18.5 21 C 17 20, 16 18.5, 16.5 17 C 17 15, 18 13.5, 18 11 Z"
        fill="var(--paper, #fafaf7)"
      />
      {/* Base mark — small fixed-color anchor */}
      <rect x="13" y="26" width="10" height="2" rx="1" fill="var(--ink, #1a1a1a)" />
      <rect x="14.5" y="29" width="7" height="2" rx="1" fill="var(--ink, #1a1a1a)" opacity="0.5" />
    </svg>
  );
}
