'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CopyEntry, StandardRowId, TeamMode } from '@/content/carePlan';
import {
  PARENT_FIRST_UI,
  worksheetHref,
  type ParentFirstPlanContent,
} from '@/content/carePlanParentFirst';

function resolveSelected(value: string | null, count: number): number[] {
  if (!value) return [0, 1].filter((index) => index < count);

  const values = value
    .split(',')
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item >= 0 && item < count);

  return [...new Set(values)].sort((a, b) => a - b);
}

export default function QuestionsAndDownloads({
  team,
  row,
  questions,
  worksheet,
}: {
  team: TeamMode;
  row: StandardRowId;
  questions: CopyEntry[];
  worksheet: ParentFirstPlanContent['worksheet'];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = resolveSelected(searchParams.get('q'), questions.length);

  function toggle(index: number) {
    const next = selected.includes(index)
      ? selected.filter((item) => item !== index)
      : [...selected, index].sort((a, b) => a - b);
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', next.join(','));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function downloadQuestions() {
    const chosen = selected.map((index) => questions[index]).filter(Boolean);
    const heading =
      team === 'yes'
        ? PARENT_FIRST_UI.questionsHeadingYes.text
        : PARENT_FIRST_UI.questionsHeadingNo.text;
    const body = [
      heading,
      '',
      ...(chosen.length
        ? chosen.map((question, index) => `${index + 1}. ${question.text}`)
        : ['No questions selected. Return to the Care Plan and choose the questions you want to bring.']),
      '',
      'Generated on your device. Nothing was sent to Common Ground.',
    ].join('\n');

    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `common-ground-${row}-questions.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section className="rounded-xl border border-surface-border bg-white p-5 sm:p-6" data-print-card>
        <h2 className="text-xl font-semibold leading-snug text-brand-navy-700">
          {team === 'yes'
            ? PARENT_FIRST_UI.questionsHeadingYes.text
            : PARENT_FIRST_UI.questionsHeadingNo.text}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
          {PARENT_FIRST_UI.questionsInstruction.text}
        </p>

        <fieldset className="mt-5">
          <legend className="sr-only">Choose questions to take with you</legend>
          {questions.map((question, index) => {
            const checked = selected.includes(index);
            return (
              <label
                key={question.id}
                className="flex cursor-pointer items-start gap-3 border-t border-surface-border py-4 first:border-t-0 focus-within:ring-2 focus-within:ring-brand-navy-500 focus-within:ring-offset-2"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(index)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs font-bold ${
                    checked
                      ? 'border-brand-navy-700 bg-brand-navy-700 text-white'
                      : 'border-brand-muted-400 bg-white text-transparent'
                  }`}
                >
                  ✓
                </span>
                <span className="text-[15px] leading-relaxed text-brand-navy-700">
                  {question.text}
                </span>
              </label>
            );
          })}
        </fieldset>
      </section>

      <section className="rounded-xl border border-surface-border bg-white p-5 sm:p-6" data-print-card>
        <h2 className="text-xl font-semibold leading-snug text-brand-navy-700">
          {PARENT_FIRST_UI.takeItHeading.text}
        </h2>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={worksheetHref(worksheet.id)}
            download
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-teal px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
          >
            {worksheet.label.text}
          </a>
          <button
            type="button"
            onClick={downloadQuestions}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-brand-muted-300 bg-white px-5 py-3 text-sm font-semibold text-brand-navy-700 transition hover:bg-brand-warm-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-500 focus-visible:ring-offset-2"
          >
            {PARENT_FIRST_UI.downloadQuestions.text}
          </button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-brand-muted-500">
          {PARENT_FIRST_UI.takeItNote.text}
        </p>
      </section>
    </>
  );
}
