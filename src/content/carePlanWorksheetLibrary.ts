import type { CopyEntry, StandardRowId } from '@/content/carePlan';

const draft = (id: string, text: string): CopyEntry => ({
  id,
  text,
  approval: 'draft',
});

export const CARE_CLARITY_WORKSHEET = {
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
} as const;
