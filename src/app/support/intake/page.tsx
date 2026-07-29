import Link from 'next/link';
import { CARE_PLAN_UI } from '@/content/carePlan';

const CHOICES = [
  {
    copy: CARE_PLAN_UI.intakeTeamYes,
    href: '/support/care-plan?team=yes',
  },
  {
    copy: CARE_PLAN_UI.intakeTeamNo,
    href: '/support/care-plan?team=no',
  },
] as const;

export default function IntakePage() {
  return (
    <main className="page-shell mx-auto w-full max-w-3xl">
      {process.env.NODE_ENV !== 'production' && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
          {CARE_PLAN_UI.developmentDraft.text}
        </p>
      )}

      <section className="border-b border-surface-border pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          {CARE_PLAN_UI.intakeEyebrow.text}
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
          {CARE_PLAN_UI.intakeQuestion.text}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted-600 sm:text-base">
          {CARE_PLAN_UI.intakeHelper.text}
        </p>
      </section>

      <section className="overflow-hidden rounded-xl border border-surface-border bg-white">
        {CHOICES.map((choice, index) => (
          <Link
            key={choice.copy.id}
            href={choice.href}
            className="group flex min-h-20 w-full items-center gap-4 border-surface-border px-5 py-5 text-left transition hover:bg-brand-warm-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-navy-500 sm:px-6"
            style={{ borderTopWidth: index === 0 ? 0 : 1 }}
          >
            <span
              aria-hidden="true"
              className="h-5 w-5 shrink-0 rounded-full border border-brand-muted-400 bg-white group-hover:border-brand-navy-500"
            />
            <span className="text-base font-medium leading-relaxed text-brand-navy-700">
              {choice.copy.text}
            </span>
          </Link>
        ))}
      </section>

      <footer className="border-t border-surface-border pt-5 text-xs leading-relaxed text-brand-muted-500">
        {CARE_PLAN_UI.exactFooter.text}
      </footer>
    </main>
  );
}
