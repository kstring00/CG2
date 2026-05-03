/**
 * Lightweight client-side care plan persistence.
 * Temporary — replace with backend storage when available.
 *
 * Shape is intentionally permissive: the intake flow may grow new fields
 * (Step 8 expands the intake from 5 to 7 questions) without breaking
 * older saved plans.
 */

export type CarePlanAnswers = {
  hardest?: string[] | null;
  stage?: string | null;
  childAge?: string | null;
  helpKind?: string | null;
  weekMood?: string | null;
  notes?: string | null;
  // Legacy fields — kept readable so existing plans still load.
  support?: string | null;
  confidence?: string | null;
  easier?: string | null;
  connected?: string | null;
};

export type CarePlanStep = {
  title: string;
  why: string;
  href: string;
};

export type CarePlanResource = {
  label: string;
  href: string;
};

export type SavedCarePlan = {
  version: 1;
  createdAt: string;
  updatedAt: string;
  answers: CarePlanAnswers;
  summary: string;
  steps: CarePlanStep[];
  resources: CarePlanResource[];
  weekMessage?: string;
};

const KEY = 'cg.carePlan.v1';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadCarePlan(): SavedCarePlan | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.steps)) {
      return parsed as SavedCarePlan;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCarePlan(plan: Omit<SavedCarePlan, 'version' | 'createdAt' | 'updatedAt'>): SavedCarePlan {
  const now = new Date().toISOString();
  const existing = loadCarePlan();
  const saved: SavedCarePlan = {
    version: 1,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    ...plan,
  };
  if (isBrowser()) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(saved));
    } catch {
      // ignore quota / private mode
    }
  }
  return saved;
}

export function clearCarePlan() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
