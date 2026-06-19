import Link from 'next/link';
import { Check, Lightbulb } from 'lucide-react';
import { FOUR_STEPS, QUICK_CHECKLIST } from '@/lib/marriage/content';

export default function FourStepPath() {
  return (
    <section id="four-step" aria-labelledby="four-step-heading" className="scroll-mt-6">
      <div className="overflow-hidden rounded-3xl border border-surface-border bg-white shadow-soft">
        <div className="border-b border-surface-border bg-gradient-to-br from-brand-navy-50/80 via-white to-emerald-50/40 px-5 py-6 sm:px-8 sm:py-8">
          <h2 id="four-step-heading" className="text-xl font-bold text-brand-navy-700 sm:text-2xl">
            A 4-Step Path to Get Unstuck — Tonight
          </h2>
          <p className="mt-2 text-[15px] text-brand-muted-600">
            Use this simple sequence to calm conflict and reconnect.
          </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-start">
          <div className="min-w-0">
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
              {FOUR_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <li key={step.step}>
                    <div className="flex flex-col items-start">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-[13px] font-bold text-emerald-800">
                        {step.step}
                      </span>
                      <span className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-soft">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <h3 className="mt-3 text-[15px] font-semibold text-brand-navy-700">{step.title}</h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <Link href="#reset" className="btn-primary mt-8 px-5 py-2.5 text-sm">
              Try the 4-Step Guide
            </Link>
          </div>

          <aside
            aria-labelledby="quick-checklist-heading"
            className="rounded-2xl border border-emerald-100 bg-brand-warm-50/50 px-5 py-6"
          >
            <h3 id="quick-checklist-heading" className="text-[15px] font-bold text-brand-navy-700">
              Quick Checklist
            </h3>
            <ul className="mt-4 space-y-3">
              {QUICK_CHECKLIST.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-brand-muted-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-2.5 text-[12px] leading-relaxed text-brand-muted-700">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
              Small, consistent steps build safety and closeness over time.
            </p>
          </aside>
        </div>
        </div>
      </div>
    </section>
  );
}
