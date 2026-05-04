'use client';

import type { CategoryId, GroundLevelInputs } from '@/lib/groundLevel/types';
import { CATEGORIES } from '@/lib/groundLevel/types';

type Props = {
  values: GroundLevelInputs;
  onChange: (id: CategoryId, key: 'heaviness' | 'support', value: number) => void;
};

const HEAVINESS_PROMPT: Record<CategoryId, string> = {
  caregiving: 'how heavy is the caregiving load right now?',
  work: 'how heavy is work right now?',
  money: 'how heavy do money pressures feel right now?',
  partner: 'how heavy does the marriage / partner part of your life feel?',
  self: 'how heavy does the load feel on the part of you that isn’t a parent or partner — just you?',
};

const SUPPORT_PROMPT: Record<CategoryId, string> = {
  caregiving: 'how supported do you feel in the caregiving load?',
  work: 'how supported do you feel at work?',
  money: 'how supported do you feel around money?',
  partner: 'how supported do you feel by your partner?',
  self: 'how supported do you feel in being yourself?',
};

export default function CategorySliders({ values, onChange }: Props) {
  return (
    <div className="space-y-8">
      {CATEGORIES.map((cat) => {
        const reading = values[cat.id];
        return (
          <section
            key={cat.id}
            className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6"
            aria-label={cat.label}
          >
            <h3 className="text-base font-semibold text-brand-navy-700">
              {cat.label}
            </h3>

            <div className="mt-4 space-y-4">
              <Slider
                id={`${cat.id}-heaviness`}
                label={HEAVINESS_PROMPT[cat.id]}
                leftAnchor="light"
                rightAnchor="crushing"
                value={reading.heaviness}
                onChange={(v) => onChange(cat.id, 'heaviness', v)}
              />
              <Slider
                id={`${cat.id}-support`}
                label={SUPPORT_PROMPT[cat.id]}
                leftAnchor="alone in it"
                rightAnchor="held"
                value={reading.support}
                onChange={(v) => onChange(cat.id, 'support', v)}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Slider({
  id,
  label,
  leftAnchor,
  rightAnchor,
  value,
  onChange,
}: {
  id: string;
  label: string;
  leftAnchor: string;
  rightAnchor: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13.5px] leading-snug text-brand-muted-700">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={value}
        className="mt-2 w-full accent-brand-navy-500"
      />
      <div className="mt-1 flex items-center justify-between text-[10.5px] font-medium uppercase tracking-wide text-brand-muted-400">
        <span>{leftAnchor}</span>
        <span>{rightAnchor}</span>
      </div>
    </div>
  );
}
