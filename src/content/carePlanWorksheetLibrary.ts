import type { CopyEntry, StandardRowId } from '@/content/carePlan';

const draft = (id: string, text: string): CopyEntry => ({
  id,
  text,
  approval: 'draft',
});

type WorksheetOverride = {
  href: string;
  label: CopyEntry;
  rows: Set<StandardRowId>;
};

export const CARE_CLARITY_WORKSHEET: WorksheetOverride = {
  href: '/worksheets/care-clarity-review.pdf',
  label: draft(
    'worksheet-library.care-clarity-review.label',
    'Download the Care Clarity & Review Sheet',
  ),
  rows: new Set<StandardRowId>([
    'thinking-stopping',
    'no-progress',
    'sessions-concern',
    'unclear-care',
  ]),
};

export const PARENT_SUPPORT_WORKSHEET: WorksheetOverride = {
  href: '/worksheets/parent-support-card.pdf',
  label: draft(
    'worksheet-library.parent-support-card.label',
    'Download the Parent Support Card',
  ),
  rows: new Set<StandardRowId>([
    'cannot-keep-doing',
    'nothing-left',
    'grieving',
    'disappeared',
  ]),
};

export const HOME_SITUATION_WORKSHEET: WorksheetOverride = {
  href: '/worksheets/home-situation-snapshot.pdf',
  label: draft(
    'worksheet-library.home-situation-snapshot.label',
    'Download the Home Situation Snapshot',
  ),
  rows: new Set<StandardRowId>([
    'outings',
    'daily-routines',
    'communication-wall',
  ]),
};

export const PROVIDER_INTERVIEW_WORKSHEET: WorksheetOverride = {
  href: '/worksheets/provider-interview.pdf',
  label: draft(
    'worksheet-library.provider-interview-guide.label',
    'Download the Provider Interview Guide',
  ),
  rows: new Set<StandardRowId>([
    'deciding',
    'first-months',
    'judging-provider',
    'what-is-aba',
  ]),
};

export const ONE_SENTENCE_ADVOCACY_WORKSHEET: WorksheetOverride = {
  href: '/worksheets/one-sentence-advocacy-card.pdf',
  label: draft(
    'worksheet-library.one-sentence-advocacy-card.label',
    'Download the One-Sentence Advocacy Card',
  ),
  rows: new Set<StandardRowId>(['marriage-strain']),
};

const WORKSHEET_OVERRIDES: WorksheetOverride[] = [
  CARE_CLARITY_WORKSHEET,
  PARENT_SUPPORT_WORKSHEET,
  HOME_SITUATION_WORKSHEET,
  PROVIDER_INTERVIEW_WORKSHEET,
  ONE_SENTENCE_ADVOCACY_WORKSHEET,
];

export function resolveWorksheetOverride(row: StandardRowId): WorksheetOverride | undefined {
  return WORKSHEET_OVERRIDES.find((worksheet) => worksheet.rows.has(row));
}
