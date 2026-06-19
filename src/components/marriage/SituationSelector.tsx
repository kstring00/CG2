'use client';

import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITUATIONS, type SituationId } from '@/lib/marriage/content';

type Props = {
  selectedId: SituationId | null;
  onSelect: (id: SituationId) => void;
};

export default function SituationSelector({ selectedId, onSelect }: Props) {
  return (
    <section id="situations" aria-labelledby="situations-heading" className="scroll-mt-6">
      <div className="text-center">
        <h2 id="situations-heading" className="text-2xl font-bold text-brand-navy-700 sm:text-[1.65rem]">
          What are you dealing with right now?
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-[15px] leading-relaxed text-brand-muted-600">
          Choose what feels most true. We&apos;ll show you practical support that fits your situation.
        </p>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {SITUATIONS.map((item) => {
          const Icon = item.icon;
          const active = selectedId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-pressed={active}
                className={cn(
                  'group flex h-full w-full flex-col rounded-2xl border bg-white p-5 text-left shadow-soft transition duration-200',
                  'hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-card',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
                  active
                    ? 'border-emerald-300 ring-2 ring-emerald-100'
                    : 'border-surface-border',
                )}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-3 text-[15px] font-semibold text-brand-navy-700">{item.title}</span>
                <span className="mt-1 flex-1 text-[13px] leading-relaxed text-brand-muted-600">
                  {item.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700">
                  Choose this
                  <ArrowRight
                    className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {selectedId && (
        <p
          className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-[14px] leading-relaxed text-brand-navy-700"
          role="status"
        >
          {SITUATIONS.find((s) => s.id === selectedId)?.reassurance}
        </p>
      )}
    </section>
  );
}
