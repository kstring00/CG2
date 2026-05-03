'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'cg.reviewBanner.dismissed';

/**
 * Global "in review" framing. Tells reviewers and parents up-front that
 * Common Ground is being built in the open and that some sections show
 * example data. This replaces case-by-case "this is a demo" labeling.
 */
export default function ReviewBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      setDismissed(window.sessionStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      // ignore
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  if (!hydrated) {
    return <div aria-hidden className="h-9 w-full bg-brand-warm-100" />;
  }
  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="site is in active review"
      className="w-full border-b border-brand-warm-300 bg-brand-warm-100 text-brand-muted-700"
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-3 py-2 text-[12px] sm:px-6">
        <p className="leading-snug">
          <span className="font-semibold text-brand-navy-700">common ground is in active review.</span>{' '}
          some sections show example listings, demo profiles, and placeholder data while we partner with families and providers. look for{' '}
          <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">
            example
          </span>{' '}
          tags throughout the site.{' '}
          <Link
            href="/about/in-review"
            className="ml-1 inline-flex items-center gap-0.5 font-semibold text-primary underline-offset-2 hover:underline"
          >
            learn more <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="dismiss review banner for this session"
          className="-mr-1 shrink-0 rounded-full p-1 text-brand-muted-400 hover:bg-brand-warm-200 hover:text-brand-muted-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-muted-400"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
