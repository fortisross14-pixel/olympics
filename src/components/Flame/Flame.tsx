interface Props {
  className?: string;
  size?: number;
}

/**
 * Stylized flame mark — sits inside the gradient brand tile, so it
 * renders as a simple white glyph with a tinted inner curl. The shape
 * evokes both a flame and a cycle (rising curve returning on itself).
 */
export default function Flame({ className, size = 22 }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer flame — white against the gradient tile */}
      <path
        d="M12 2C9 6 7 9 7 13a5 5 0 0010 0c0-3-2-5-3.5-7.5C13 4 12.5 3 12 2z"
        fill="#fff"
      />
      {/* Inner curl — tinted with theme primary for depth */}
      <path
        d="M12 9c-1.5 2-2.5 3.5-2.5 5.5a2.5 2.5 0 003 2.4c-1-.8-1.5-2-1-3.4.4-1.3 1.3-2.5 1.5-4.5z"
        fill="var(--theme-primary, #c1272d)"
      />
    </svg>
  );
}
