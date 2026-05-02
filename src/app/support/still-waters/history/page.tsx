'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { firstLine, formatShortDate, getLookBack, loadAll } from '../_lib/storage';
import type { LookBackBucket } from '../_lib/storage';
import type { Entry } from '../_lib/types';

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [lookBack, setLookBack] = useState<LookBackBucket[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(loadAll());
    setLookBack(getLookBack());
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div className="pt-12" />;
  }

  if (entries.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="animate-fade-in pt-6 sm:pt-10">
      <header className="mb-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-slate-500">
          Look back
        </p>
        <h1
          className="mt-2 text-3xl text-slate-800"
          style={{ fontFamily: 'var(--font-still-waters-serif), Georgia, serif' }}
        >
          What you have written
        </h1>
      </header>

      {lookBack.length > 0 && (
        <section className="mb-10 rounded-3xl border border-slate-300/50 bg-white/60 p-5 sm:p-7">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-500">
            On this day
          </p>
          <div className="mt-5 space-y-6">
            {lookBack.map((bucket) => (
              <div key={bucket.label}>
                <p className="text-[13px] font-medium text-slate-700">
                  {bucket.label}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {bucket.entries.map((entry) => (
                    <li key={entry.id}>
                      <EntryRow entry={entry} compact />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <ul className="space-y-1.5">
        {entries.map((entry) => (
          <li key={entry.id}>
            <EntryRow entry={entry} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function EntryRow({ entry, compact = false }: { entry: Entry; compact?: boolean }) {
  const summary = firstLine(entry.body) || entry.promptText || 'Untitled entry';
  return (
    <Link
      href={`/support/still-waters/history/${entry.id}`}
      className="group flex items-baseline gap-4 rounded-xl px-3 py-2.5 transition hover:bg-white/70"
    >
      <span
        className={
          'shrink-0 text-[12px] tabular-nums text-slate-500 ' +
          (compact ? 'w-24' : 'w-28')
        }
      >
        {formatShortDate(entry.createdAt)}
      </span>
      <span
        className="flex-1 truncate text-[15px] text-slate-700 group-hover:text-slate-900"
        style={{ fontFamily: 'var(--font-still-waters-serif), Georgia, serif' }}
      >
        {summary}
      </span>
      {entry.meaningful && (
        <span className="shrink-0 text-[11px] text-slate-500">★</span>
      )}
    </Link>
  );
}

function EmptyState() {
  return (
    <section className="animate-fade-in pt-20 text-center sm:pt-32">
      <p
        className="mx-auto max-w-md text-2xl leading-relaxed text-slate-700"
        style={{ fontFamily: 'var(--font-still-waters-serif), Georgia, serif' }}
      >
        Nothing to look back on yet.
      </p>
      <p className="mt-4 text-sm text-slate-500">
        Your entries will appear here, in your own words.
      </p>
      <div className="mt-10">
        <Link
          href="/support/still-waters"
          className="rounded-full bg-slate-800 px-5 py-2 text-[13px] text-white transition hover:bg-slate-900"
        >
          Start somewhere
        </Link>
      </div>
    </section>
  );
}
