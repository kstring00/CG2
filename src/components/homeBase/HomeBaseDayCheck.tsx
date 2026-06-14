'use client';

import { cn } from '@/lib/utils';
import type { HomeBaseDayMood } from '@/lib/homeBaseDayCheck';

const OPTIONS: { value: HomeBaseDayMood; label: string }[] = [
  { value: 'good', label: 'Good day' },
  { value: 'in-between', label: 'In between' },
  { value: 'rough', label: 'Rough day' },
];

type Props = {
  value: HomeBaseDayMood | null;
  onChange: (value: HomeBaseDayMood | null) => void;
  className?: string;
};

/** Single-tap "how's today?" — flexes Home Base layout only. */
export default function HomeBaseDayCheck({ value, onChange, className }: Props) {
  return (
    <section
      aria-label="How is today?"
      className={cn('rounded-2xl border border-surface-border/70 bg-white px-4 py-4 sm:px-5', className)}
    >
      <p className="text-[13px] font-medium text-brand-muted-800">How&rsquo;s today?</p>
      <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-500">
        No wrong answer — this just helps us meet you where you are today.
      </p>
      <div
        role="group"
        aria-label="Today's mood"
        className="mt-3 flex flex-wrap gap-2"
      >
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : opt.value)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition',
                selected
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-surface-border bg-surface-muted/30 text-brand-muted-700 hover:border-primary/25 hover:bg-primary/[0.04]',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
