'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COUNSELOR_INSIGHTS, type InsightId } from '@/lib/marriage/content';

type Props = {
  openId: InsightId | null;
  onToggle: (id: InsightId) => void;
};

export default function CounselorAccordion({ openId, onToggle }: Props) {
  return (
    <section id="insights" aria-labelledby="insights-heading" className="scroll-mt-6">
      <div className="text-center">
        <h2 id="insights-heading" className="text-2xl font-bold text-brand-navy-700">
          Insights from Our Counselors
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-[15px] leading-relaxed text-brand-muted-600">
          Practical wisdom to strengthen your relationship.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {COUNSELOR_INSIGHTS.map((insight) => {
          const open = openId === insight.id;
          const panelId = `insight-panel-${insight.id}`;
          const buttonId = `insight-button-${insight.id}`;
          return (
            <article
              key={insight.id}
              id={`insight-${insight.id}`}
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-surface-border bg-white shadow-soft transition hover:border-emerald-100"
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => onToggle(insight.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-brand-warm-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[13px] font-bold text-emerald-700">
                    {COUNSELOR_INSIGHTS.indexOf(insight) + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-brand-navy-700">
                      {insight.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-brand-muted-500">
                      {insight.summary}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-brand-muted-400 transition duration-200',
                      open && 'rotate-180',
                    )}
                    aria-hidden
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cn(
                  'grid transition-[grid-template-rows] duration-300 ease-out',
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 border-t border-surface-border px-5 pb-5 pt-4 sm:pl-[4.75rem]">
                    {insight.body.map((paragraph) => (
                      <p key={paragraph} className="text-[14px] leading-relaxed text-brand-muted-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
