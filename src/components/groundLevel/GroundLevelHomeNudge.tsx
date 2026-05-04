'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { daysSinceLastEntry } from '@/lib/groundLevel/storage';

/**
 * Tiny single-line nudge under the Wellness Mirror on Home Base.
 *
 * If no Ground Level entry exists: invite a first read.
 * If the most recent entry is older than 4 days: gently invite a re-read.
 * If a recent entry exists: render nothing.
 */
export default function GroundLevelHomeNudge() {
  const [days, setDays] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDays(daysSinceLastEntry());
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  if (days === null) {
    return (
      <p className="mt-3 text-[13px] text-brand-muted-600">
        haven&rsquo;t checked ground level yet —{' '}
        <Link href="/support/ground-level" className="font-semibold text-primary hover:underline">
          open it →
        </Link>
      </p>
    );
  }

  if (days >= 4) {
    return (
      <p className="mt-3 text-[13px] text-brand-muted-600">
        your last ground level read was {days} {days === 1 ? 'day' : 'days'} ago. things shift —{' '}
        <Link href="/support/ground-level" className="font-semibold text-primary hover:underline">
          read again? →
        </Link>
      </p>
    );
  }

  return null;
}
