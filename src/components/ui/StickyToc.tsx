import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface TocItem {
  /** Anchor id on the destination section, without the leading '#'. */
  id: string;
  /** Two-character ordinal shown on the left ("01", "02", …). */
  num: string;
  /** Short label rendered next to the number. */
  label: string;
}

interface Props {
  items: TocItem[];
  className?: string;
  /** Override the heading shown above the list. Defaults to "On this page". */
  heading?: string;
}

/**
 * StickyToc — the editorial "On this page" rail used across long-form
 * /support pages (financial guide, what-is-aba, siblings, resources, etc.).
 *
 * Hidden below the lg breakpoint (matching the financial guide's behavior),
 * sticks to the viewport at top: 6rem so it sits below the SupportShell
 * banner + header, and keeps its own scroll if the list overflows.
 */
export function StickyToc({ items, className, heading = 'On this page' }: Props) {
  return (
    <aside
      aria-label={heading}
      className={cn(
        'hidden lg:block',
        'sticky top-24 self-start',
        'max-h-[calc(100vh-7rem)] overflow-y-auto',
        'pr-3 border-r border-surface-border',
        className,
      )}
    >
      <p className="mb-3.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-brand-muted-500">
        {heading}
      </p>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`#${item.id}`}
              className="flex items-baseline gap-2.5 rounded-lg border-l-2 border-transparent px-2 py-1.5 text-[13px] leading-snug text-brand-muted-700 transition-colors hover:border-brand-navy-200 hover:bg-brand-warm-100 hover:text-brand-muted-900"
            >
              <span className="shrink-0 font-display text-[11px] font-medium tabular-nums text-brand-muted-400">
                {item.num}
              </span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
