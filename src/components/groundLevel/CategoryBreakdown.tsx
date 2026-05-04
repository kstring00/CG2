'use client';

import type { GroundLevelInputs } from '@/lib/groundLevel/types';
import { CATEGORIES } from '@/lib/groundLevel/types';

type Props = {
  inputs: GroundLevelInputs;
};

function descriptionFor(heaviness: number, support: number): string {
  if (heaviness >= 7 && support <= 3) return 'this is the loudest thing in your week.';
  if (heaviness >= 7 && support >= 7) return 'heavy, but you’re held here.';
  if (heaviness <= 3) return 'manageable.';
  if (heaviness >= 7) return 'heavy. partial support.';
  return 'present but not roaring.';
}

function heavinessTone(heaviness: number) {
  // Soft amber for high, soft green for low, neutral for mid.
  if (heaviness >= 7) return { fill: 'bg-amber-400/80', track: 'bg-amber-100' };
  if (heaviness <= 3) return { fill: 'bg-emerald-400/70', track: 'bg-emerald-50' };
  return { fill: 'bg-brand-muted-400', track: 'bg-surface-subtle' };
}

function supportTone(support: number) {
  // Inverted: high support reads as "held" (good).
  if (support >= 7) return { fill: 'bg-emerald-400/70', track: 'bg-emerald-50' };
  if (support <= 3) return { fill: 'bg-amber-400/80', track: 'bg-amber-100' };
  return { fill: 'bg-brand-muted-400', track: 'bg-surface-subtle' };
}

export default function CategoryBreakdown({ inputs }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {CATEGORIES.map((cat) => {
        const r = inputs[cat.id];
        const desc = descriptionFor(r.heaviness, r.support);
        const heavTone = heavinessTone(r.heaviness);
        const supTone = supportTone(r.support);
        return (
          <article
            key={cat.id}
            className="rounded-2xl border border-surface-border bg-white p-4 shadow-soft sm:p-5"
          >
            <h3 className="text-[14px] font-semibold text-brand-navy-700">{cat.label}</h3>

            <Bar
              label="heaviness"
              value={r.heaviness}
              fillClass={heavTone.fill}
              trackClass={heavTone.track}
            />
            <Bar
              label="support"
              value={r.support}
              fillClass={supTone.fill}
              trackClass={supTone.track}
            />

            <p className="mt-3 text-[13px] leading-snug text-brand-muted-600">{desc}</p>
          </article>
        );
      })}
    </div>
  );
}

function Bar({
  label,
  value,
  fillClass,
  trackClass,
}: {
  label: string;
  value: number;
  fillClass: string;
  trackClass: string;
}) {
  const pct = Math.max(2, (value / 10) * 100);
  return (
    <div className="mt-3">
      <p className="text-[10.5px] font-medium uppercase tracking-wide text-brand-muted-400">
        {label}
      </p>
      <div className={`mt-1 h-1.5 w-full overflow-hidden rounded-full ${trackClass}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${fillClass}`}
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
