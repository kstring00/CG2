import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import {
  CARE_PLAN_UI,
  PLAN_ROWS,
  TEAM_COPY,
  resolveBranch,
  resolveBranchList,
  type BranchDefinition,
  type CopyEntry,
  type StandardBranchId,
  type StandardRowId,
  type TeamMode,
} from '@/content/carePlan';
import {
  PARENT_FIRST_UI,
  type ParentFirstPlanContent,
} from '@/content/carePlanParentFirst';
import {
  branchHref,
  buildPlan,
  isRowInBranch,
  isStandardBranchId,
  isStandardRowId,
  rowHref,
  type StandardPlanPage,
} from '@/lib/buildPlan';
import LegacyStoredDataCleanup from './LegacyStoredDataCleanup';
import PrintButton from './PrintButton';
import QuestionsAndDownloads from './QuestionsAndDownloads';
import StabilizeSelector from './StabilizeSelector';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function resolveTeam(value: string | undefined): TeamMode {
  return value === 'no' ? 'no' : 'yes';
}

function contactHref(team: TeamMode): string | null {
  if (team === 'yes') return null;
  const digits = TEAM_COPY.no.phoneNumber.text.replace(/\D/g, '');
  return digits ? `tel:+${digits}` : null;
}

function DraftMark() {
  if (process.env.NODE_ENV === 'production') return null;
  return (
    <p className="print:hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
      {CARE_PLAN_UI.developmentDraft.text}
    </p>
  );
}

function ExactFooter() {
  return (
    <footer className="border-t border-surface-border pt-5 text-xs leading-relaxed text-brand-muted-500">
      {CARE_PLAN_UI.exactFooter.text}
    </footer>
  );
}

function TeamContact({ team }: { team: TeamMode }) {
  const copy = TEAM_COPY[team];
  const href = contactHref(team);

  return (
    <section className="border-t border-surface-border pt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-muted-500">
        {CARE_PLAN_UI.teamContactHeading.text}
      </p>
      <p className="mt-2 text-sm text-brand-muted-600">{copy.contactLabel.text}</p>
      {href ? (
        <a
          href={href}
          className="mt-1 inline-block text-lg font-semibold text-brand-navy-700 underline decoration-brand-muted-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-500 focus-visible:ring-offset-2"
        >
          {copy.phoneNumber.text}
        </a>
      ) : (
        <p className="mt-1 text-lg font-semibold text-brand-navy-700">{copy.phoneNumber.text}</p>
      )}
    </section>
  );
}

function ChoiceRow({ href, copy }: { href: string; copy: CopyEntry }) {
  return (
    <Link
      href={href}
      className="group flex min-h-16 w-full items-center gap-4 border-t border-surface-border px-5 py-4 text-left transition first:border-t-0 hover:bg-brand-warm-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-navy-500 sm:px-6"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 rounded-full border border-brand-muted-400 bg-white group-hover:border-brand-navy-500"
      />
      <span className="flex-1 text-[15px] font-medium leading-relaxed text-brand-navy-700">
        {copy.text}
      </span>
    </Link>
  );
}

function SelectionContext({ branch }: { branch: BranchDefinition }) {
  return (
    <div className="flex items-start gap-3 border-b border-surface-border pb-5">
      <span aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 rounded-full bg-brand-navy-700" />
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted-500">
          {CARE_PLAN_UI.selectedContextLabel.text}
        </p>
        <p className="mt-1 text-sm font-medium text-brand-navy-700">{branch.entryChoice.text}</p>
      </div>
    </div>
  );
}

function EntryView({ team }: { team: TeamMode }) {
  const branches = resolveBranchList(team);

  return (
    <main className="page-shell mx-auto w-full max-w-3xl">
      <LegacyStoredDataCleanup />
      <DraftMark />

      <section className="border-b border-surface-border pb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          {CARE_PLAN_UI.carePlanEyebrow.text}
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
          {CARE_PLAN_UI.entryQuestion.text}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted-600">
          {CARE_PLAN_UI.entryHelper.text}
        </p>
      </section>

      <section className="overflow-hidden rounded-xl border border-surface-border bg-white">
        {branches.map((branch) => (
          <ChoiceRow
            key={branch.id}
            href={branchHref(team, branch.id)}
            copy={branch.entryChoice}
          />
        ))}
        <ChoiceRow
          href={`/support/care-plan/crisis?team=${team}`}
          copy={CARE_PLAN_UI.crisisEntryChoice}
        />
      </section>

      <TeamContact team={team} />
      <ExactFooter />
    </main>
  );
}

function RefineView({ team, branch }: { team: TeamMode; branch: BranchDefinition }) {
  return (
    <main className="page-shell mx-auto w-full max-w-3xl">
      <LegacyStoredDataCleanup />
      <DraftMark />
      <SelectionContext branch={branch} />

      <section>
        <h1 className="text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
          {branch.refineQuestion.text}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted-600">
          {branch.refineHelper.text}
        </p>
      </section>

      <section className="overflow-hidden rounded-xl border border-surface-border bg-white">
        {branch.rows.map((rowId) => (
          <ChoiceRow
            key={rowId}
            href={rowHref(team, branch.id, rowId)}
            copy={PLAN_ROWS[rowId].choice}
          />
        ))}
      </section>

      <Link
        href={`/support/care-plan?team=${team}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted-600 underline decoration-brand-muted-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-500 focus-visible:ring-offset-2"
      >
        {CARE_PLAN_UI.backToHardest.text}
      </Link>

      <TeamContact team={team} />
      <ExactFooter />
    </main>
  );
}

function CopyBlock({ entries }: { entries: CopyEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <p key={entry.id} className="text-[15px] leading-relaxed text-brand-muted-600">
          {entry.text}
        </p>
      ))}
    </div>
  );
}

function PlanLinks({ plan }: { plan: StandardPlanPage }) {
  return (
    <section className="print:hidden overflow-hidden rounded-xl border border-surface-border bg-white">
      <Link
        href={plan.crossLink.href}
        className="flex items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-brand-warm-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-navy-500 sm:px-6"
      >
        <span>
          <span className="block text-sm font-medium text-brand-navy-700">{plan.crossLink.label.text}</span>
          <span className="mt-1 block text-xs leading-relaxed text-brand-muted-500">
            {plan.crossLink.detail.text}
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-brand-muted-400" aria-hidden="true" />
      </Link>
      <Link
        href={plan.startOverHref}
        className="flex items-center justify-between gap-4 border-t border-surface-border px-5 py-4 text-left transition hover:bg-brand-warm-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-navy-500 sm:px-6"
      >
        <span>
          <span className="block text-sm font-medium text-brand-navy-700">{CARE_PLAN_UI.startOver.text}</span>
          <span className="mt-1 block text-xs leading-relaxed text-brand-muted-500">
            {CARE_PLAN_UI.startOverDetail.text}
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-brand-muted-400" aria-hidden="true" />
      </Link>
    </section>
  );
}

function PathForwardSection({
  heading,
  entries,
  links,
}: {
  heading: CopyEntry;
  entries: CopyEntry[];
  links?: ParentFirstPlanContent['pathForward']['siteLinks'];
}) {
  return (
    <details className="group border-t border-surface-border first:border-t-0">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-navy-500 sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="text-[15px] font-semibold text-brand-navy-700">{heading.text}</span>
        <span
          aria-hidden="true"
          className="text-brand-muted-400 transition-transform group-open:rotate-90"
        >
          →
        </span>
      </summary>
      <div className="border-t border-surface-border bg-brand-warm-50/50 px-5 py-5 sm:px-6">
        <CopyBlock entries={entries} />
        {links && links.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-lg border border-surface-border bg-white">
            {links.map((link) => (
              <Link
                key={link.label.id}
                href={link.href}
                className="flex items-center justify-between gap-4 border-t border-surface-border px-4 py-4 first:border-t-0 hover:bg-brand-warm-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-navy-500"
              >
                <span>
                  <span className="block text-sm font-semibold text-brand-navy-700">
                    {link.label.text}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-brand-muted-500">
                    {link.detail.text}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-brand-muted-400" aria-hidden="true" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}

function ParentFirstPlanView({ plan }: { plan: StandardPlanPage & { parentFirst: ParentFirstPlanContent } }) {
  const content = plan.parentFirst;
  const safetyHref = plan.safetyLink
    ? `${plan.safetyLink.href}${plan.safetyLink.href.includes('?') ? '&' : '?'}team=${plan.team}`
    : null;

  return (
    <main className="care-plan-print-sheet page-shell mx-auto w-full max-w-5xl">
      <LegacyStoredDataCleanup />
      <DraftMark />

      <section className="rounded-2xl border border-brand-warm-200 bg-brand-warm-50 p-5 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          {PARENT_FIRST_UI.reflectLabel.text}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
          {content.reflect.headline.text}
        </h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {content.reflect.items.map((item) => (
            <div key={item.title.id} className="border-t border-brand-warm-200 pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
              <h2 className="text-sm font-semibold text-brand-navy-700">{item.title.text}</h2>
              <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{item.detail.text}</p>
            </div>
          ))}
        </div>
      </section>

      {plan.safetyLink && safetyHref && (
        <Link
          href={safetyHref}
          className="print:hidden flex items-center justify-between gap-4 border-y border-brand-red-200 py-4 text-sm font-semibold text-brand-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-500 focus-visible:ring-offset-2"
        >
          <span>{plan.safetyLink.copy.text}</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Link>
      )}

      <section>
        <h2 className="text-xl font-semibold text-brand-navy-700">
          {PARENT_FIRST_UI.stabilizeHeading.text}
        </h2>
        <p className="mt-1 text-sm text-brand-muted-500">{PARENT_FIRST_UI.stabilizeHelper.text}</p>
        <div className="mt-4">
          <StabilizeSelector row={plan.row} options={content.stabilize.options} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-brand-navy-700">
          {PARENT_FIRST_UI.pathForwardHeading.text}
        </h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-surface-border bg-white">
          <PathForwardSection
            heading={PARENT_FIRST_UI.whatToBringUpHeading}
            entries={content.pathForward.whatToBringUp}
          />
          <PathForwardSection
            heading={PARENT_FIRST_UI.whatHelpToAskForHeading}
            entries={content.pathForward.whatHelpToAskFor}
          />
          <PathForwardSection
            heading={PARENT_FIRST_UI.whatChangesHeading}
            entries={content.pathForward.whatChangesAndHowFast}
          />
          <PathForwardSection
            heading={PARENT_FIRST_UI.whereNextHeading}
            entries={content.pathForward.whereToGoNext}
            links={content.pathForward.siteLinks}
          />
        </div>
      </section>

      <QuestionsAndDownloads
        team={plan.team}
        row={plan.row}
        questions={plan.questions}
        worksheet={content.worksheet}
      />

      <PlanLinks plan={plan} />
      <ExactFooter />
    </main>
  );
}

function LegacyPlanView({ plan }: { plan: StandardPlanPage }) {
  return (
    <main className="care-plan-print-sheet page-shell mx-auto w-full max-w-3xl">
      <LegacyStoredDataCleanup />
      <DraftMark />

      <section>
        <p className="text-sm font-medium text-brand-muted-500">{plan.acknowledgment.text}</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
          {plan.truth.text}
        </h1>
        <div className="mt-4">
          <CopyBlock entries={plan.body} />
        </div>
      </section>

      {plan.quietSupport && (
        <section
          className={
            plan.row === 'cannot-keep-doing'
              ? 'border-y border-brand-red-200 bg-white py-5'
              : 'border-y border-surface-border py-4'
          }
        >
          <p
            className={
              plan.row === 'cannot-keep-doing'
                ? 'text-sm font-semibold leading-relaxed text-brand-red-700'
                : 'text-sm leading-relaxed text-brand-muted-600'
            }
          >
            {plan.quietSupport.text}
          </p>
        </section>
      )}

      {plan.safetyLink && (
        <Link
          href={`${plan.safetyLink.href}?team=${plan.team}`}
          className="print:hidden flex items-center justify-between gap-4 border-y border-brand-red-200 py-4 text-sm font-semibold text-brand-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-500 focus-visible:ring-offset-2"
        >
          <span>{plan.safetyLink.copy.text}</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Link>
      )}

      {plan.education && (
        <section className="rounded-xl border border-surface-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-brand-navy-700">{plan.education.heading.text}</h2>
          <div className="mt-3">
            <CopyBlock entries={plan.education.body} />
          </div>
        </section>
      )}

      {plan.printableRelativeGuide && (
        <section className="rounded-xl border border-surface-border bg-white p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-brand-navy-700">
            {plan.printableRelativeGuide.heading.text}
          </h2>
          <div className="mt-3">
            <CopyBlock entries={plan.printableRelativeGuide.body} />
          </div>
        </section>
      )}

      <section className="rounded-xl border border-surface-border bg-white p-5 sm:p-6" data-print-card>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted-500">
          {CARE_PLAN_UI.planActionLabel.text}
        </p>
        <h2 className="mt-2 text-xl font-semibold leading-snug text-brand-navy-700">
          {plan.action.heading.text}
        </h2>
        <div className="mt-3">
          <CopyBlock entries={plan.action.body} />
        </div>
        <div className="mt-5">
          <PrintButton label={CARE_PLAN_UI.printButton.text} />
        </div>
      </section>

      <section className="rounded-xl border border-surface-border bg-white p-5 sm:p-6" data-print-card>
        <h2 className="text-xl font-semibold leading-snug text-brand-navy-700">
          {plan.sessionHeading.text}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
          {CARE_PLAN_UI.questionsIntro.text}
        </p>
        {plan.providerEvaluationNote && (
          <p className="mt-4 border-l-2 border-brand-navy-200 pl-4 text-sm leading-relaxed text-brand-muted-600">
            {plan.providerEvaluationNote.text}
          </p>
        )}
        <ol className="mt-5 space-y-4">
          {plan.questions.map((question, index) => (
            <li key={question.id} className="flex items-start gap-3 text-[15px] leading-relaxed text-brand-navy-700">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-muted-300 text-xs font-semibold text-brand-muted-600">
                {index + 1}
              </span>
              <span>{question.text}</span>
            </li>
          ))}
        </ol>
      </section>

      {plan.domesticViolence && (
        <p className="border-y border-surface-border py-4 text-sm leading-relaxed text-brand-muted-600">
          {plan.domesticViolence.text}
        </p>
      )}

      <TeamContact team={plan.team} />
      <PlanLinks plan={plan} />
      <ExactFooter />
    </main>
  );
}

export default async function CarePlanPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const team = resolveTeam(first(params.team));
  const branchValue = first(params.b);
  const rowValue = first(params.r);

  if (!branchValue) return <EntryView team={team} />;
  if (!isStandardBranchId(branchValue)) redirect(`/support/care-plan?team=${team}`);

  const branch: StandardBranchId = branchValue;
  if (!rowValue) return <RefineView team={team} branch={resolveBranch(team, branch)} />;
  if (!isStandardRowId(rowValue)) redirect(branchHref(team, branch));

  const row: StandardRowId = rowValue;
  if (PLAN_ROWS[row].branch !== branch) redirect(branchHref(team, branch));
  if (!isRowInBranch(team, branch, row)) redirect(branchHref(team, branch));

  const plan = buildPlan(team, branch, row);
  if (plan.kind !== 'standard') redirect(`/support/care-plan/crisis?team=${team}`);

  if (plan.parentFirst) {
    return <ParentFirstPlanView plan={{ ...plan, parentFirst: plan.parentFirst }} />;
  }

  return <LegacyPlanView plan={plan} />;
}
