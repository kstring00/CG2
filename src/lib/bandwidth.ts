/**
 * Bandwidth — the single, canonical check-in across the site.
 *
 * Why this exists
 * ---------------
 * The site previously had check-in / mental-health / wellness measurement in
 * multiple places (Home Base PulseCard, WellnessMirror tile, the 8-slider
 * dashboard at /support/mental-health, a separate weekly qualitative form at
 * /support/check-in). Per the CCO direction, that scatter does more harm than
 * good: a measurement that doesn't change anything just adds shame.
 *
 * This module replaces all of that with one concept:
 *
 *   "We ask this so we don't give you a plan that's too heavy for the day
 *    you're actually having."
 *
 * Three sliders. Four result tiers. The tier directly gates how big the care
 * plan is. That is the entire contract.
 *
 * What this is NOT
 * ----------------
 *   • Not a diagnosis.
 *   • Not a mental health score.
 *   • Not a streak. Not a benchmark. Not a number to chase.
 *   • Not a crisis tool — crisis copy + 988 are surfaced separately.
 */

export type BandwidthTier = 'doing-well' | 'some-strain' | 'high-risk' | 'severe';

/**
 * Three short, parent-readable sliders. Each is 0–100.
 *
 *   • stress      — adverse (higher = more strain). "How heavy does today feel?"
 *   • sleep       — protective (higher = more rested). "How rested are you?"
 *   • support     — protective (higher = more held). "How supported do you feel?"
 *
 * We deliberately do not ask 8 things. Three is enough to differentiate the
 * four tiers and short enough that a tired parent won't abandon.
 */
export type BandwidthInputs = {
  stress: number;
  sleep: number;
  support: number;
};

export const BANDWIDTH_INPUT_KEYS = ['stress', 'sleep', 'support'] as const satisfies readonly (keyof BandwidthInputs)[];

export const BANDWIDTH_DEFAULTS: BandwidthInputs = {
  stress: 50,
  sleep: 50,
  support: 50,
};

export type BandwidthSliderDef = {
  key: keyof BandwidthInputs;
  /** Short, parent-friendly label shown above the slider. */
  label: string;
  /** One-line question the slider answers. */
  question: string;
  /** Description at the low end (value = 0). */
  lowLabel: string;
  /** Description at the high end (value = 100). */
  highLabel: string;
  /** If true, higher values are worse (counted against bandwidth). */
  adverse: boolean;
};

export const BANDWIDTH_SLIDERS: BandwidthSliderDef[] = [
  {
    key: 'stress',
    label: 'Stress today',
    question: 'How heavy does today feel?',
    lowLabel: 'Quiet inside',
    highLabel: 'Running hot',
    adverse: true,
  },
  {
    key: 'sleep',
    label: 'Rest',
    question: 'How rested are you?',
    lowLabel: 'Wiped out',
    highLabel: 'Pretty rested',
    adverse: false,
  },
  {
    key: 'support',
    label: 'Support',
    question: 'How supported do you feel right now?',
    lowLabel: 'Alone in it',
    highLabel: 'Held',
    adverse: false,
  },
];

export type BandwidthResult = {
  tier: BandwidthTier;
  /** 0–100 composite — higher = more bandwidth. Shown only as a soft bar. */
  bandwidth: number;
  /** Raw inputs at time of check. */
  inputs: BandwidthInputs;
  /** ISO timestamp of when this was recorded. */
  recordedAt: string;
};

/**
 * Compute the tier from raw inputs. The composite is a simple weighted
 * average where stress counts against bandwidth and the protective factors
 * count for it. Weights chosen so that any single slider at an extreme can
 * push the tier by one band — no slider can single-handedly trigger
 * "severe" without at least two contributors agreeing.
 */
export function scoreBandwidth(inputs: BandwidthInputs): BandwidthResult {
  // Map stress to "calm" (its protective complement).
  const calm = 100 - clamp(inputs.stress);
  const sleep = clamp(inputs.sleep);
  const support = clamp(inputs.support);

  // Weighted average. Stress (via calm) is heaviest because it most
  // directly tracks today's capacity to act on a plan.
  const bandwidth = Math.round(0.5 * calm + 0.3 * sleep + 0.2 * support);

  let tier: BandwidthTier;
  if (bandwidth >= 70) tier = 'doing-well';
  else if (bandwidth >= 50) tier = 'some-strain';
  else if (bandwidth >= 30) tier = 'high-risk';
  else tier = 'severe';

  return {
    tier,
    bandwidth,
    inputs: { stress: clamp(inputs.stress), sleep, support },
    recordedAt: new Date().toISOString(),
  };
}

function clamp(n: number): number {
  if (Number.isNaN(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/* ── Copy for each tier ──────────────────────────────────────────────── */

export const TIER_LABEL: Record<BandwidthTier, string> = {
  'doing-well': 'Doing well',
  'some-strain': 'Some strain',
  'high-risk': 'Stretched thin',
  severe: 'Today is heavy',
};

/**
 * Result copy the parent reads after submitting. Calm, non-clinical, no
 * shame. Each tier ends with a forward-looking "we will" statement so the
 * parent knows the plan will adjust.
 */
export const TIER_RESULT_COPY: Record<BandwidthTier, string> = {
  'doing-well':
    "You seem to have enough bandwidth for a few practical next steps today.",
  'some-strain':
    "You may benefit from a smaller plan and a little extra support. We'll keep things focused.",
  'high-risk':
    "Today may not be the day for a long list. We'll keep your plan focused on one clear next step.",
  severe:
    "This looks like a moment to simplify and reach out for human support. We'll keep this plan very small.",
};

/**
 * How many priority steps the care plan should show for each tier. This is
 * the entire mechanism by which the check-in "does something."
 */
export const TIER_STEP_LIMIT: Record<BandwidthTier, number> = {
  'doing-well': 3,
  'some-strain': 2,
  'high-risk': 1,
  severe: 1,
};

/** Whether the care plan should render the "reach out for support" card. */
export function shouldShowSupportCard(tier: BandwidthTier): boolean {
  return tier === 'high-risk' || tier === 'severe';
}

/** Whether the care plan should render the crisis disclaimer card. */
export function shouldShowCrisisCallout(tier: BandwidthTier): boolean {
  return tier === 'severe';
}

/* ── Visual tokens for each tier ─────────────────────────────────────── */

export type TierTheme = {
  bg: string;
  border: string;
  text: string;
  dot: string;
};

export const TIER_THEME: Record<BandwidthTier, TierTheme> = {
  'doing-well': {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  'some-strain': {
    bg: 'bg-sky-50/70',
    border: 'border-sky-200',
    text: 'text-sky-800',
    dot: 'bg-sky-500',
  },
  'high-risk': {
    bg: 'bg-amber-50/70',
    border: 'border-amber-300',
    text: 'text-amber-900',
    dot: 'bg-amber-500',
  },
  severe: {
    bg: 'bg-rose-50/70',
    border: 'border-rose-300',
    text: 'text-rose-900',
    dot: 'bg-rose-500',
  },
};

/* ── Persistence ─────────────────────────────────────────────────────── */

const STORAGE_KEY = 'cg.bandwidth.v1';

/** Load the latest stored bandwidth result, or null if none. SSR-safe. */
export function loadBandwidth(): BandwidthResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BandwidthResult;
    if (!parsed.tier || !parsed.inputs || !parsed.recordedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Write a new bandwidth result. Returns the value written. */
export function saveBandwidth(result: BandwidthResult): BandwidthResult {
  if (typeof window === 'undefined') return result;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    /* ignore quota errors — parent will be prompted again on next visit */
  }
  return result;
}

/** Clear stored bandwidth — only used for testing / "reset" affordances. */
export function clearBandwidth(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Convenience: score and persist in one call. */
export function recordBandwidth(inputs: BandwidthInputs): BandwidthResult {
  return saveBandwidth(scoreBandwidth(inputs));
}

/* ── Helpers for the care plan ───────────────────────────────────────── */

/**
 * Friendly age-of-result string. We surface this on the Bandwidth Summary
 * card so the parent can tell whether the result is stale.
 */
export function freshnessLabel(result: BandwidthResult, now: Date = new Date()): string {
  const ms = now.getTime() - new Date(result.recordedAt).getTime();
  const hours = Math.floor(ms / (60 * 60 * 1000));
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? 'last week' : `${weeks} weeks ago`;
}

/** Returns true if the stored bandwidth is over a week old. */
export function isStale(result: BandwidthResult, now: Date = new Date()): boolean {
  const ms = now.getTime() - new Date(result.recordedAt).getTime();
  return ms > 7 * 24 * 60 * 60 * 1000;
}
