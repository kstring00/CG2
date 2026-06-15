/**
 * Home Base day-check — presentation layer only.
 *
 * Mood selection lives in React state for the current page visit only.
 * No persistence, streaks, or care-plan side effects.
 */

export type HomeBaseDayMood = 'good' | 'in-between' | 'rough';

/** Read-only reflection prompts — parent reads; nothing is captured or stored. */
export const DAY_CHECK_REFLECTIONS = {
  okay: [
    {
      heading: 'What\u2019s working',
      body: 'Before you try to fix anything — what went even a little okay today? A moment of connection, a routine that held, or simply getting through.',
    },
    {
      heading: 'One small thing to ease',
      body: 'Not an overhaul — one small kindness for yourself or your child that might take the edge off. Read it. Let it sit. No list required.',
    },
  ],
  good: [
    {
      heading: 'What\u2019s working',
      body: 'What helped today — even in small ways? Name it quietly to yourself before you move on.',
    },
    {
      heading: 'What you could repeat',
      body: 'What worked today that you could do again tomorrow? Small patterns count.',
    },
  ],
} as const;

export const DAY_CHECK_BAD_DAY_PLAN_PERMISSION =
  'The plan will be here when you\u2019re ready — today, just breathe.';

export const DAY_CHECK_GOOD_DAY_PLAN_LEAD =
  'You\u2019ve got some room today — here\u2019s a good one to tackle.';
