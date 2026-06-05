/**
 * Lightweight client-side care plan persistence.
 * Temporary — replace with backend storage when available.
 *
 * Shape is intentionally permissive: the intake flow may grow new fields
 * (Step 8 expands the intake from 5 to 7 questions) without breaking
 * older saved plans.
 */

export type Hardest =
  | 'understanding-aba'
  | 'behavior-home'
  | 'overwhelmed'
  | 'finding-resources'
  | 'financial-insurance'
  | 'siblings'
  | 'connecting-parents'
  | 'school-iep';

export type Stage =
  | 'newly-diagnosed'
  | 'waiting-diagnosis'
  | 'in-aba'
  | 'looking-for-aba'
  | 'past-aba';

export type ChildAge = '0-2' | '2-5' | '6-12' | '13-17';

export type HelpKind =
  | 'practical-info'
  | 'local-providers'
  | 'someone-to-talk-to'
  | 'time-for-me'
  | 'not-sure';

/** Shared mood vocabulary for consistency across the app. */
export type WeekMood = 'frayed' | 'heavy' | 'numb' | 'steady' | 'hopeful';

export type CarePlanAnswers = {
  hardest?: Hardest[] | null;
  stage?: Stage | null;
  // What would help most — now multi-select (Week 1 intake).
  helpKinds?: HelpKind[] | null;
  // Legacy fields — kept readable so older plans still load.
  helpKind?: HelpKind | null; // pre-multiselect single value
  childAge?: ChildAge | null; // age question removed from intake
  weekMood?: WeekMood | null; // mood question removed from intake
  notes?: string | null; // freeform notes removed from intake
  support?: string | null;
  confidence?: string | null;
  easier?: string | null;
  connected?: string | null;
};

/**
 * 5-bucket framing requested by Texas ABA Centers' clinical director.
 * Each saved step belongs in one bucket. The care plan page renders one
 * suggested step per bucket so a parent can scan "what to do today vs. what
 * to bring to the BCBA" in a single glance.
 */
export type StepBucket =
  | 'do-today'
  | 'ask-bcba'
  | 'try-home'
  | 'save-resource'
  | 'next-week';

export type CarePlanStep = {
  title: string;
  why: string;
  href: string;
  /** Plain-language reason — e.g. "Because you said meltdowns are hardest right now." */
  because?: string;
  /** Internal score used for ordering. Higher = surfaced first. */
  weight?: number;
  /** Which CCO-review bucket this step belongs in (added in 2026-05 CCO pass). */
  bucket?: StepBucket;
};

export type CarePlanResource = {
  label: string;
  href: string;
  /** Optional tag explaining why this resource was picked. */
  because?: string;
};

/** Echoed phrase captured from the parent's free-text notes. */
export type NoteEcho = {
  /** The exact phrase or keyword we matched. */
  phrase: string;
  /** What we'll do with it on the plan page. */
  reflection: string;
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
  /** Reflected phrases from the notes field. */
  noteEchoes?: NoteEcho[];
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

// ---------------------------------------------------------------------------
// Intake draft autosave
//
// The intake answers only become a saved plan on the final "building" screen.
// If a parent leaves mid-flow (taps a link, closes the tab), their in-progress
// answers would be lost — which feels like the site "threw away" their work.
// We persist a lightweight draft on every answer change and restore it when
// they return, then clear it once the plan is committed.
// ---------------------------------------------------------------------------

const DRAFT_KEY = 'cg.carePlanDraft.v1';

export type CarePlanDraft = Partial<CarePlanAnswers>;

export function loadCarePlanDraft(): CarePlanDraft | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as CarePlanDraft;
    return null;
  } catch {
    return null;
  }
}

export function saveCarePlanDraft(draft: CarePlanDraft) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // ignore quota / private mode
  }
}

export function clearCarePlanDraft() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
