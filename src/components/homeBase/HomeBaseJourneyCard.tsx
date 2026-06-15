'use client';

import type { WeeklyProgressSummary } from '@/lib/weeklyProgress';

function JourneyTrack({ summary }: { summary: WeeklyProgressSummary }) {
  const { totalNotches, filledNotches } = summary;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={totalNotches}
      aria-valuenow={filledNotches}
      aria-label="Journey progress this week"
      className="mt-4 flex w-full gap-1"
    >
      {Array.from({ length: totalNotches }).map((_, i) => (
        <span
          key={i}
          className={[
            'h-2 flex-1 rounded-full transition-colors',
            i < filledNotches ? 'bg-brand-plum-500' : 'bg-brand-plum-100',
          ].join(' ')}
          aria-hidden
        />
      ))}
    </div>
  );
}

type Props = {
  summary: WeeklyProgressSummary;
  arcWeekNumber: number;
  arcTheme: string;
};

/** “Where you are in your journey” — bar without completion counts. */
export default function HomeBaseJourneyCard({ summary, arcWeekNumber, arcTheme }: Props) {
  const weekLabel = `Week ${arcWeekNumber} — ${arcTheme}`;

  return (
    <section
      aria-label={`Where you are in your journey: ${weekLabel}`}
      className="relative overflow-hidden rounded-2xl border border-brand-plum-100 bg-gradient-to-br from-brand-plum-50/90 via-white to-white p-5 sm:p-6"
    >
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-plum-100/60 blur-2xl" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-plum-700">
        Where you are in your journey
      </p>
      <p className="mt-2 text-lg font-semibold leading-snug text-brand-navy-700 sm:text-xl">
        {weekLabel}
      </p>
      <JourneyTrack summary={summary} />
    </section>
  );
}
