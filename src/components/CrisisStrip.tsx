'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

const STORAGE_KEY = 'cg.crisisStrip.dismissed';

/**
 * Slim, persistent crisis access at the very top of the document.
 * Calm presence, not flashing emergency — muted neutral, not red.
 *
 * Dismissable per session (sessionStorage). Always re-renders on a fresh tab.
 * Non-dismissable on /support/hard-days and any /crisis route.
 */
export default function CrisisStrip() {
  const pathname = usePathname() ?? '';
  const isCrisisRoute =
    pathname.startsWith('/support/hard-days') ||
    pathname.includes('/crisis');

  const [dismissed, setDismissed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (isCrisisRoute) {
      setDismissed(false);
      return;
    }
    try {
      setDismissed(window.sessionStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      // sessionStorage unavailable — leave visible.
    }
  }, [isCrisisRoute]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  if (!hydrated) {
    // SSR-safe placeholder so the strip's height is reserved.
    return <div aria-hidden className="h-8 w-full bg-stone-100" />;
  }
  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="crisis support"
      className="w-full border-b border-stone-200 bg-stone-100 text-stone-700"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-3 py-1.5 text-[12px] sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 leading-tight">
          <span className="font-semibold text-stone-800">need help right now?</span>
          <a
            href="tel:988"
            className="font-medium underline-offset-2 hover:underline focus:outline-none focus-visible:underline"
          >
            call or text 988
          </a>
          <span aria-hidden className="text-stone-400">·</span>
          <a
            href="tel:7139707000"
            className="font-medium underline-offset-2 hover:underline focus:outline-none focus-visible:underline"
          >
            harris center (713) 970-7000
          </a>
          <span aria-hidden className="text-stone-400">·</span>
          <a
            href="tel:911"
            className="font-medium underline-offset-2 hover:underline focus:outline-none focus-visible:underline"
          >
            emergency 911
          </a>
        </div>
        {!isCrisisRoute && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="dismiss crisis strip for this session"
            className="-mr-1 shrink-0 rounded-full p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
