'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronUp } from 'lucide-react';

/**
 * Persistent global crisis support bar — pinned to the BOTTOM of the viewport.
 *
 * Project z-index convention (source of truth — keep this comment in sync):
 *   z-60  CrisisBar — global bottom bar, always on top (this component, via z-[60])
 *   z-50  ChatWidget FAB/panel (lifted above the CrisisBar via inline bottom calc)
 *         + primary navs (homepage / client / privacy inline navs at top-0)
 *   z-40  SupportShell sub-bars (Find-page crisis sub-bar)
 *   z-30  modals/overlays
 *   z-20  sticky page headers (SupportShell + ClientShell <header>)
 *
 * The bar's height is published as the CSS variable `--crisis-bar-height`
 * (defined in src/app/globals.css). globals.css adds bottom padding to <body>
 * equal to that variable so normal page content never sits under the bar.
 * ChatWidget reads the same variable to lift its FAB and panel above the bar.
 *
 * The bar does not render on /calm — that route is for de-escalation and a
 * persistent phone-number strip would be intrusive.
 */
export default function CrisisBar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  if (pathname === '/calm') return null;

  return (
    <aside
      role="complementary"
      aria-label="Crisis support resources"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-surface-border bg-surface-muted text-brand-muted-700"
    >
      {/* ≥ sm: full strip with all three numbers */}
      <div className="mx-auto hidden w-full max-w-[1600px] items-center justify-center gap-x-5 px-4 py-2 text-[12px] sm:flex sm:px-6 lg:px-8">
        <span className="font-semibold text-brand-muted-800">Need help right now?</span>
        <a
          href="tel:988"
          className="rounded-md px-1.5 py-0.5 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Call or text <span className="font-semibold">988</span>
        </a>
        <span aria-hidden className="text-brand-muted-300">·</span>
        <a
          href="tel:7139707000"
          className="rounded-md px-1.5 py-0.5 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Harris Center <span className="font-semibold">(713) 970-7000</span>
        </a>
        <span aria-hidden className="text-brand-muted-300">·</span>
        <a
          href="tel:911"
          className="rounded-md px-1.5 py-0.5 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Emergency: <span className="font-semibold">911</span>
        </a>
      </div>

      {/* < sm: expanded panel renders ABOVE the collapsed strip in DOM order
          so visually it sits above the always-visible row at the bottom. */}
      {expanded && (
        <div
          id="crisis-bar-more"
          className="flex flex-col gap-1 border-b border-surface-border/70 bg-surface-muted px-3 py-2 text-[12px] sm:hidden"
        >
          <a
            href="tel:7139707000"
            className="rounded-md px-1.5 py-1 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Harris Center <span className="font-semibold">(713) 970-7000</span>
          </a>
          <a
            href="tel:911"
            className="rounded-md px-1.5 py-1 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Emergency: <span className="font-semibold">911</span>
          </a>
        </div>
      )}

      {/* < sm: collapsed strip — 988 always tappable, More toggles the rest */}
      <div className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-[12px] sm:hidden">
        <span className="flex items-center gap-2">
          <span className="font-semibold text-brand-muted-800">Need help?</span>
          <a
            href="tel:988"
            className="rounded-md px-1.5 py-0.5 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="font-semibold">988</span>
          </a>
        </span>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="crisis-bar-more"
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-brand-muted-600 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          More
          <ChevronUp
            aria-hidden
            className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </aside>
  );
}
