'use client';

import { BookOpen, Download, Lightbulb } from 'lucide-react';
import { CONVERSATION_GUIDE_TEXT, RESET_PROMPTS } from '@/lib/marriage/content';

function downloadGuide() {
  const blob = new Blob([CONVERSATION_GUIDE_TEXT], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'common-ground-relationship-reset.txt';
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function RelationshipReset() {
  return (
    <section id="reset" aria-labelledby="reset-heading" className="scroll-mt-6">
      <div className="overflow-hidden rounded-3xl border border-surface-border bg-white shadow-soft">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[280px] border-b border-surface-border bg-gradient-to-br from-amber-50 via-brand-warm-50 to-white p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div
              className="absolute inset-4 rounded-2xl border border-amber-100/80 bg-white/70 shadow-soft sm:inset-6"
              aria-hidden
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800">
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                Better Conversations Tonight
              </span>
              <h2 id="reset-heading" className="mt-4 text-xl font-bold text-brand-navy-700 sm:text-2xl">
                10-Minute Relationship Reset
              </h2>
              <p className="mt-2 text-[14px] text-brand-muted-600">
                Five prompts for when you have a sliver of time and want to reconnect without fixing
                everything at once.
              </p>
              <ol className="mt-6 space-y-3">
                {RESET_PROMPTS.map((prompt, index) => (
                  <li
                    key={prompt}
                    className="flex gap-3 rounded-xl border border-surface-border/80 bg-white/90 px-4 py-3 text-[13px] leading-relaxed text-brand-muted-700 shadow-soft"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-navy-100 text-[11px] font-bold text-brand-navy-700">
                      {index + 1}
                    </span>
                    {prompt}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8">
            <aside
              aria-labelledby="reset-tip-heading"
              className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5"
            >
              <h3
                id="reset-tip-heading"
                className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-navy-700"
              >
                <Lightbulb className="h-4 w-4 text-emerald-600" aria-hidden />
                Tip
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-brand-muted-700">
                Put phones away. Look at each other. Listen like it matters — because it does.
              </p>
            </aside>
            <button
              type="button"
              onClick={downloadGuide}
              className="btn-accent mt-6 inline-flex w-full items-center justify-center gap-2 px-5 py-2.5 text-sm sm:w-auto"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download the Conversation Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
