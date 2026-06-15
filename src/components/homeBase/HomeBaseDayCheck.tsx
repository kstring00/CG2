'use client';

import { cn } from '@/lib/utils';
import type { HomeBaseDayMood } from '@/lib/homeBaseDayCheck';

const OPTIONS: {
  value: HomeBaseDayMood;
  label: string;
  selectedClass: string;
  idleClass: string;
}[] = [
  {
    value: 'good',
    label: 'Good day',
    selectedClass: 'border-emerald-300 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200/60',
    idleClass: 'border-emerald-100 bg-emerald-50/50 text-emerald-700 hover:border-emerald-200',
  },
  {
    value: 'in-between',
    label: 'In between',
    selectedClass: 'border-amber-300 bg-amber-50 text-amber-900 ring-2 ring-amber-200/60',
    idleClass: 'border-amber-100 bg-amber-50/40 text-amber-800 hover:border-amber-200',
  },
  {
    value: 'rough',
    label: 'Rough day',
    selectedClass: 'border-rose-300 bg-rose-50 text-rose-800 ring-2 ring-rose-200/60',
    idleClass: 'border-rose-100 bg-rose-50/40 text-rose-700 hover:border-rose-200',
  },
];

type Props = {
  value: HomeBaseDayMood | null;
  onChange: (value: HomeBaseDayMood | null) => void;
  className?: string;
};

/** Single-tap mood check — flexes Home Base layout only. */
export default function HomeBaseDayCheck({ value, onChange, className }: Props) {
  return (
    <section
      aria-label="How are you feeling today?"
      className={cn(
        'rounded-2xl border border-surface-border/70 bg-white p-5 shadow-soft sm:p-6',
        className,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-500">
        How are you feeling today?
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-brand-muted-500">
        No wrong answer — this just helps us meet you where you are today.
      </p>
      <div
        role="group"
        aria-label="Today's mood"
        className="mt-4 flex flex-wrap gap-2"
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
                'rounded-full border px-4 py-2 text-[13px] font-semibold transition',
                selected ? opt.selectedClass : opt.idleClass,
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
