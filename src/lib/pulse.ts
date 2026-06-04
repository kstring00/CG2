/**
 * Pulse — a soft, non-clinical wellness read computed from the parent's most
 * recent weekly check-in.
 *
 * Why this exists
 * ---------------
 * The /support/mental-health dashboard is rich but invisible to parents who
 * don't navigate to it. The CCO asked us to surface a parent's score on the
 * main journey so check-ins become a habit, not a hidden page.
 *
 * What this is NOT
 * ----------------
 *   • Not a clinical score.
 *   • Not a diagnosis.
 *   • Not benchmarked against other parents.
 *
 * It's a felt-sense readout — a number the parent gave themselves last week,
 * gently summarized. Always paired with disclaimer copy at the call site.
 */
import type { WeeklyCheckInEntry, WeeklyCheckInState } from './weeklyCheckIn';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type PulseBand = 'heavy' | 'mixed' | 'steady' | 'strong';

export type Pulse = {
  /** 1–10, friendly read of the parent's most recent week. */
  score: number;
  /** Bucketed band for color + copy. */
  band: PulseBand;
  /** Last 4 entries, oldest-first, for the sparkline. */
  trail: number[];
  /** ISO date of the most recent check-in, or null. */
  lastCheckInAt: string | null;
  /** Days since the last check-in, or null if never. */
  daysSince: number | null;
};

const STRESS_POINTS: Record<WeeklyCheckInEntry['answers']['parentStress'], number> = {
  low: 3,
  moderate: 2,
  high: 1,
  overwhelmed: 0,
};

const CONFIDENCE_POINTS: Record<WeeklyCheckInEntry['answers']['parentConfidence'], number> = {
  shaky: 0,
  mixed: 1,
  steady: 2,
  strong: 3,
};

const PROGRESS_POINTS: Record<WeeklyCheckInEntry['answers']['childProgress'], number> = {
  harder: 0,
  'about-same': 1,
  'small-wins': 2,
  'real-progress': 3,
};

const TRIED_POINTS: Record<WeeklyCheckInEntry['answers']['triedSteps'], number> = {
  none: 0,
  'not-sure': 0,
  some: 1,
  all: 1,
};

/**
 * Map the qualitative check-in to a friendly 1–10. Max raw = 10
 * (3 + 3 + 3 + 1). Min = 1 — we never show 0 because zero feels punishing.
 */
export function scoreFromEntry(entry: WeeklyCheckInEntry): number {
  const raw =
    STRESS_POINTS[entry.answers.parentStress] +
    CONFIDENCE_POINTS[entry.answers.parentConfidence] +
    PROGRESS_POINTS[entry.answers.childProgress] +
    TRIED_POINTS[entry.answers.triedSteps];
  return Math.max(1, Math.min(10, raw + 1));
}

export function bandFor(score: number): PulseBand {
  if (score <= 3) return 'heavy';
  if (score <= 5) return 'mixed';
  if (score <= 8) return 'steady';
  return 'strong';
}

export const PULSE_LABELS: Record<PulseBand, string> = {
  heavy: 'A heavy week',
  mixed: 'A mixed week',
  steady: 'A steady week',
  strong: 'A strong week',
};

export const PULSE_BLURBS: Record<PulseBand, string> = {
  heavy: 'That tracks. Heavy weeks are real. Be gentle.',
  mixed: 'Some good, some hard. That is most weeks.',
  steady: 'You held the line this week. That counts.',
  strong: 'A genuinely good week. Worth noticing.',
};

/**
 * Compute the parent's pulse from saved state. Returns null when there is no
 * history yet — the UI then shows a "take your first check-in" empty state.
 */
export function computePulse(state: WeeklyCheckInState, now: Date = new Date()): Pulse | null {
  if (!state.history.length) return null;
  const sorted = [...state.history].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
  );
  const latest = sorted[sorted.length - 1];
  const score = scoreFromEntry(latest);
  const trail = sorted.slice(-4).map(scoreFromEntry);
  const lastCheckInAt = state.lastCheckInAt ?? latest.completedAt;
  const daysSince = Math.max(
    0,
    Math.floor((now.getTime() - new Date(lastCheckInAt).getTime()) / MS_PER_DAY),
  );
  return {
    score,
    band: bandFor(score),
    trail,
    lastCheckInAt,
    daysSince,
  };
}

/**
 * Friendly "X days ago" string. Returns "today" / "yesterday" for small
 * deltas and "X days ago" otherwise. Used in the JourneyStepper pill.
 */
export function daysAgoLabel(daysSince: number): string {
  if (daysSince <= 0) return 'today';
  if (daysSince === 1) return 'yesterday';
  if (daysSince < 7) return `${daysSince} days ago`;
  if (daysSince < 14) return 'last week';
  const weeks = Math.floor(daysSince / 7);
  return `${weeks} weeks ago`;
}
