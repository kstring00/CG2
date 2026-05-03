/**
 * Support Readiness — a gentle, non-clinical signal of how supported a parent
 * may feel today. This is NOT a score, grade, or evaluation. It exists so we
 * can quietly point parents toward a smaller, kinder next step when their
 * support tank is low.
 *
 * Avoid: "score", "points", "failure", "diagnosis", "treatment", "compliance".
 * Prefer: "support readiness", "support tank", "capacity", "support signals".
 */

export type SupportRating = 1 | 2 | 3 | 4 | 5;

export type ParentCheckIn = {
  id: string;
  date: string; // YYYY-MM-DD
  rating: SupportRating;
  label: string;
  createdAt: string; // ISO
};

export type SupportSignalType =
  | 'check_in_completed'
  | 'care_plan_viewed'
  | 'resource_saved'
  | 'intake_completed'
  | 'resource_marked_helpful'
  | 'guide_opened'
  | 'event_viewed'
  | 'support_requested'
  | 'low_support_check_in'
  | 'resource_not_helpful'
  | 'intake_abandoned'
  | 'no_current_next_step';

export type SupportSignal = {
  id: string;
  type: SupportSignalType;
  weight: number;
  createdAt: string;
};

export type SupportReadinessTone = 'low' | 'building' | 'steady';

export type SupportReadinessState = {
  /** 1–5 readiness, derived from latest check-in plus signals. */
  level: SupportRating;
  /** 0–100 visual fill, smoothed by recent supportive signals. */
  fill: number;
  tone: SupportReadinessTone;
  /** Short, parent-friendly framing — no shame, no clinical claims. */
  message: string;
};

export const RATING_LABELS: Record<SupportRating, string> = {
  1: 'Running on Empty',
  2: 'Stretched Thin',
  3: 'Finding Footing',
  4: 'Steady Support',
  5: 'Set Up for Success',
};

export type RatingResponse = {
  headline: string;
  body: string;
  actionLabel: string;
  actionHref: string;
};

/**
 * Compassionate, non-evaluative responses for each rating.
 * Each suggests ONE small next step — never a list, never pressure.
 */
export const RATING_RESPONSES: Record<SupportRating, RatingResponse> = {
  1: {
    headline: 'You may need more support today.',
    body: 'Let’s keep this simple. One small thing is enough.',
    actionLabel: 'Try a 2-minute calming moment',
    actionHref: '/support/hard-days',
  },
  2: {
    headline: 'You’re carrying a lot.',
    body: 'Let’s lower the load and choose what feels hardest right now.',
    actionLabel: 'Open my care plan',
    actionHref: '/support/intake',
  },
  3: {
    headline: 'You’re finding footing.',
    body: 'Let’s pick one clear next step together.',
    actionLabel: 'See recommended resources',
    actionHref: '/support/resources',
  },
  4: {
    headline: 'You have steady support today.',
    body: 'A good moment to plan one small thing for this week.',
    actionLabel: 'Save a resource for later',
    actionHref: '/support/resources',
  },
  5: {
    headline: 'You’re feeling more set up today.',
    body: 'A great time to strengthen the support around your family.',
    actionLabel: 'Explore parent connection',
    actionHref: '/support/connect',
  },
};

const CHECK_IN_KEY = 'cg.parentCheckIns.v1';
const SIGNALS_KEY = 'cg.supportSignals.v1';

/** Default supportive weight per signal — never call these "points". */
const SIGNAL_WEIGHTS: Record<SupportSignalType, number> = {
  check_in_completed: 1,
  care_plan_viewed: 1,
  resource_saved: 1,
  intake_completed: 2,
  resource_marked_helpful: 1,
  guide_opened: 1,
  event_viewed: 1,
  support_requested: 2,
  // "Needs more support" signals — used to soften the gauge and
  // surface gentler messaging, not to penalize.
  low_support_check_in: -1,
  resource_not_helpful: -1,
  intake_abandoned: -1,
  no_current_next_step: -1,
};

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeRead<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWrite<T>(key: string, value: T[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be unavailable (private mode, quota) — fail quietly.
  }
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getCheckIns(): ParentCheckIn[] {
  return safeRead<ParentCheckIn>(CHECK_IN_KEY);
}

export function getLatestCheckIn(): ParentCheckIn | null {
  const all = getCheckIns();
  if (all.length === 0) return null;
  return all[all.length - 1];
}

export function getTodaysCheckIn(): ParentCheckIn | null {
  const today = todayIso();
  const all = getCheckIns();
  for (let i = all.length - 1; i >= 0; i--) {
    if (all[i].date === today) return all[i];
  }
  return null;
}

export function recordCheckIn(rating: SupportRating): ParentCheckIn {
  const entry: ParentCheckIn = {
    id: makeId(),
    date: todayIso(),
    rating,
    label: RATING_LABELS[rating],
    createdAt: new Date().toISOString(),
  };
  const all = getCheckIns();
  all.push(entry);
  safeWrite(CHECK_IN_KEY, all);
  recordSignal('check_in_completed');
  if (rating <= 2) recordSignal('low_support_check_in');
  return entry;
}

export function getSignals(): SupportSignal[] {
  return safeRead<SupportSignal>(SIGNALS_KEY);
}

export function recordSignal(type: SupportSignalType): SupportSignal {
  const entry: SupportSignal = {
    id: makeId(),
    type,
    weight: SIGNAL_WEIGHTS[type] ?? 0,
    createdAt: new Date().toISOString(),
  };
  const all = getSignals();
  all.push(entry);
  safeWrite(SIGNALS_KEY, all);
  return entry;
}

function clampRating(n: number): SupportRating {
  if (n <= 1) return 1;
  if (n >= 5) return 5;
  return Math.round(n) as SupportRating;
}

/**
 * Translate the most recent check-in plus recent supportive signals into a
 * gentle "support readiness" state. Recency-weighted; older check-ins fade.
 *
 * Intentionally simple — we want predictable, calm copy, not a model.
 */
export function computeSupportReadiness(
  checkIns: ParentCheckIn[] = getCheckIns(),
  signals: SupportSignal[] = getSignals(),
): SupportReadinessState {
  const latest = checkIns[checkIns.length - 1];
  const base = latest ? latest.rating : 3;

  // Days since last check-in softly lowers the gauge — never below 1.
  const daysSince = latest
    ? Math.max(0, Math.floor((Date.now() - new Date(latest.createdAt).getTime()) / 86_400_000))
    : 0;
  const stalenessNudge = daysSince >= 7 ? -0.6 : daysSince >= 3 ? -0.3 : 0;

  // Recent signals (last 14 days) gently shift the fill, not the level.
  const cutoff = Date.now() - 14 * 86_400_000;
  const recent = signals.filter((s) => new Date(s.createdAt).getTime() >= cutoff);
  const signalSum = recent.reduce((sum, s) => sum + s.weight, 0);
  const signalNudge = Math.max(-1, Math.min(1, signalSum / 8));

  const blended = base + stalenessNudge + signalNudge;
  const level = clampRating(blended);

  // Fill: map blended (1..5) to (10..100), so even an empty tank shows a sliver.
  const fill = Math.round(Math.max(10, Math.min(100, ((blended - 1) / 4) * 90 + 10)));

  let tone: SupportReadinessTone = 'building';
  let message = 'You’re building support around your family.';
  if (level <= 2) {
    tone = 'low';
    message = 'Your support tank may be low today. Let’s make your next step smaller.';
  } else if (level >= 4) {
    tone = 'steady';
    message = 'You have steady support around you today.';
  }

  return { level, fill, tone, message };
}
