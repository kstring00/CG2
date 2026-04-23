import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  /** If true, renders just the mark without the wordmark */
  markOnly?: boolean;
};

/**
 * Common Ground logo — SVG mark + wordmark.
 * Mark: two interlocking leaf-arcs sharing a common root line,
 * forming a subtle "ground" beneath them. Navy + plum brand colors.
 */
export function CommonGroundLogo({ className, markOnly = false }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={markOnly ? '0 0 36 36' : '0 0 168 36'}
      className={cn('block h-auto', className)}
      aria-label="Common Ground"
      role="img"
    >
      {/* ── MARK ─────────────────────────────────────────────── */}
      {/* Left leaf — navy, grows up-left from center root */}
      <path
        d="M18 28 C18 28 4 24 4 13 C4 6 10 3 15 5 C17 6 18 8 18 10 Z"
        fill="#1a2e52"
      />
      {/* Right leaf — plum, grows up-right from center root */}
      <path
        d="M18 28 C18 28 32 24 32 13 C32 6 26 3 21 5 C19 6 18 8 18 10 Z"
        fill="#703068"
      />
      {/* Shared ground line */}
      <rect x="6" y="30" width="24" height="2.5" rx="1.25" fill="#1a2e52" opacity="0.25" />
      {/* Small root dot at center */}
      <circle cx="18" cy="28" r="2" fill="#e2283a" />

      {/* ── WORDMARK ─────────────────────────────────────────── */}
      {!markOnly && (
        <>
          {/* "Common" */}
          <text
            x="44"
            y="16"
            fontFamily="'Trebuchet MS', 'Segoe UI', Arial, sans-serif"
            fontSize="13"
            fontWeight="700"
            fill="#1a2e52"
            letterSpacing="0.01"
          >
            Common
          </text>
          {/* "Ground" */}
          <text
            x="44"
            y="30"
            fontFamily="'Trebuchet MS', 'Segoe UI', Arial, sans-serif"
            fontSize="13"
            fontWeight="700"
            fill="#703068"
            letterSpacing="0.01"
          >
            Ground
          </text>
        </>
      )}
    </svg>
  );
}
