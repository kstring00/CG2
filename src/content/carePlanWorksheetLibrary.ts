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

const WORKSHEET_OVERRIDES: WorksheetOverride[] = [
  CARE_CLARITY_WORKSHEET,
  PARENT_SUPPORT_WORKSHEET,
];

export function resolveWorksheetOverride(row: StandardRowId): WorksheetOverride | undefined {
  return WORKSHEET_OVERRIDES.find((worksheet) => worksheet.rows.has(row));
}
