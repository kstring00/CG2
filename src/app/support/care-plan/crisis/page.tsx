import Link from 'next/link';
import { Phone } from 'lucide-react';
import { CARE_PLAN_UI, type TeamMode } from '@/content/carePlan';
import { buildPlan } from '@/lib/buildPlan';
import LegacyStoredDataCleanup from '../LegacyStoredDataCleanup';
import PrintButton from '../PrintButton';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function resolveTeam(value: string | undefined): TeamMode {
  return value === 'no' ? 'no' : 'yes';
}

export default async function CrisisCarePlanPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const team = resolveTeam(first(params.team));
  const plan = buildPlan(team, 'crisis', 'crisis');

  if (plan.kind !== 'crisis') return null;

  return (
    <main className="care-plan-print-sheet page-shell mx-auto w-full max-w-3xl">
      <LegacyStoredDataCleanup />

      {process.env.NODE_ENV !== 'production' && (
        <p className="print:hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
          {CARE_PLAN_UI.developmentDraft.text}
        </p>
      )}

      <section>
        <p className="text-sm font-medium text-brand-muted-500">{plan.acknowledgment.text}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
          {plan.truth.text}
        </h1>
        <div className="mt-4 space-y-2">
          {plan.body.map((entry) => (
            <p key={entry.id} className="text-[15px] leading-relaxed text-brand-muted-600">
              {entry.text}
            </p>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-surface-border bg-white p-5 sm:p-6" data-print-card>
        <h2 className="text-xl font-semibold text-brand-navy-700">
          {plan.documentationHeading.text}
        </h2>
        <ul className="mt-4 space-y-3">
          {plan.documentationItems.map((entry) => (
            <li key={entry.id} className="flex items-start gap-3 text-sm leading-relaxed text-brand-navy-700">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy-700" />
              <span>{entry.text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-l-2 border-brand-navy-200 pl-4 text-sm leading-relaxed text-brand-muted-600">
          {plan.documentationExample.text}
        </p>
      </section>

      <section className="rounded-xl border border-surface-border bg-white p-5 sm:p-6" data-print-card>
        <h2 className="text-xl font-semibold text-brand-navy-700">{plan.questionsHeading.text}</h2>
        <ol className="mt-4 space-y-4">
          {plan.questions.map((entry, index) => (
            <li key={entry.id} className="flex items-start gap-3 text-[15px] leading-relaxed text-brand-navy-700">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-muted-300 text-xs font-semibold text-brand-muted-600">
                {index + 1}
              </span>
              <span>{entry.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-brand-red-200 py-6" data-print-card>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-red-700">
          {plan.phoneHeading.text}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
          {plan.teamContact.label.text}
        </p>
        {plan.teamContact.href ? (
          <a
            href={plan.teamContact.href}
            className="mt-3 inline-flex items-center gap-3 text-2xl font-semibold text-brand-red-700 underline decoration-brand-red-200 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-500 focus-visible:ring-offset-2"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            {plan.teamContact.phoneNumber.text}
          </a>
        ) : (
          <p className="mt-3 flex items-center gap-3 text-2xl font-semibold text-brand-red-700">
            <Phone className="h-5 w-5" aria-hidden="true" />
            {plan.teamContact.phoneNumber.text}
          </p>
        )}
      </section>

      <section className="rounded-xl border-2 border-brand-red-300 bg-white p-5 sm:p-6" data-print-card>
        <h2 className="text-xl font-semibold text-brand-red-800">
          {plan.immediateDangerHeading.text}
        </h2>
        <p className="mt-3 text-[15px] font-medium leading-relaxed text-brand-red-800">
          {plan.immediateDangerBody.text}
        </p>
      </section>

      <div className="print:hidden flex flex-wrap items-center gap-4">
        <PrintButton label={CARE_PLAN_UI.crisisPrintButton.text} crisis />
        <Link
          href={plan.startOverHref}
          className="text-sm font-medium text-brand-muted-600 underline decoration-brand-muted-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-500 focus-visible:ring-offset-2"
        >
          {CARE_PLAN_UI.startOver.text}
        </Link>
      </div>

      <footer className="border-t border-surface-border pt-5 text-xs leading-relaxed text-brand-muted-500">
        {CARE_PLAN_UI.exactFooter.text}
      </footer>
    </main>
  );
}
