import { Sparkles } from 'lucide-react';
import { truths } from '@/lib/marriage/content';

export default function MarriageTruths() {
  return (
    <section id="truths" aria-labelledby="marriage-truths-heading" className="bg-marriage-paper px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
      <div className="mx-auto max-w-5xl">
        <h2 id="marriage-truths-heading" className="sr-only">
          What actually happens between you
        </h2>
        <div className="divide-y divide-marriage-line border-t border-marriage-line">
          {truths.map((truth) => (
            <article
              key={truth.statement}
              className="grid gap-6 py-10 min-[820px]:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] min-[820px]:gap-10 min-[820px]:py-12"
            >
              <blockquote className="border-l-[3px] border-marriage-clay pl-5">
                <p className="font-marriage-serif text-[clamp(1.35rem,3vw,1.75rem)] italic leading-snug text-marriage-body">
                  {truth.statement}
                </p>
              </blockquote>
              <div>
                <p className="text-[15px] leading-relaxed text-marriage-muted sm:text-[16px]">
                  {truth.body}
                </p>
                <div className="mt-5 rounded-2xl border border-marriage-line bg-marriage-surface p-5 sm:p-6">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-marriage-pine">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Try this
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-marriage-body sm:text-[15px]">
                    {truth.tryThis}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
