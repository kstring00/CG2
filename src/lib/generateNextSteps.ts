/**
 * Care plan generator — weighted, multi-input.
 *
 * Every selected hardship, the stage, the help-kind, the mood, and any
 * keywords in the free-text notes contribute weight to a pool of candidate
 * steps. Higher-weighted steps surface first, and each one carries a
 * plain-language "because you said …" reason so the input → output link
 * is visible to parents on the care plan page.
 *
 * Tone rule: every step is framed as a next move, never a deficiency.
 */

import type {
  CarePlanAnswers,
  CarePlanResource,
  CarePlanStep,
  Hardest,
  NoteEcho,
  StepBucket,
  WeekMood,
} from './carePlanStorage';
import { TIER_STEP_LIMIT, type BandwidthTier } from './bandwidth';

// ---------------------------------------------------------------------------
// Labels (single source of truth for human-readable copy)
// ---------------------------------------------------------------------------

const HARDEST_LABEL: Record<Hardest, string> = {
  'understanding-aba': 'Understanding ABA',
  'behavior-home': 'Managing behavior at home',
  'overwhelmed': 'Feeling overwhelmed',
  'finding-resources': 'Finding resources',
  'financial-insurance': 'Financial or insurance stress',
  'siblings': 'Supporting siblings',
  'connecting-parents': 'Connecting with other parents',
  'school-iep': 'School / IEP',
};

/** Short, lowercase fragment for inline use in sentences. */
const HARDEST_FRAGMENT: Record<Hardest, string> = {
  'understanding-aba': 'understanding ABA',
  'behavior-home': 'managing behavior at home',
  'overwhelmed': 'feeling overwhelmed',
  'finding-resources': 'finding resources',
  'financial-insurance': 'financial and insurance pressure',
  'siblings': 'supporting siblings',
  'connecting-parents': 'connecting with other parents',
  'school-iep': 'school and IEP stress',
};

export const HARDEST_OPTIONS: { value: Hardest; label: string }[] = (Object.keys(HARDEST_LABEL) as Hardest[]).map(
  (value) => ({ value, label: HARDEST_LABEL[value] }),
);

// ---------------------------------------------------------------------------
// Candidate steps — every possible plan item lives here once. Each is keyed
// by an internal id so multiple inputs can stack weight onto the same step.
// ---------------------------------------------------------------------------

type Candidate = {
  id: string;
  title: string;
  why: string;
  href: string;
  /** Primary CCO-review bucket. Some candidates are valid in multiple buckets;
   *  the secondary list is used as fallback during bucket assignment. */
  bucket: StepBucket;
  altBuckets?: StepBucket[];
};

const C: Record<string, Candidate> = {
  // Financial track
  medicaidWaiver: {
    id: 'medicaidWaiver',
    title: 'Get on the Medicaid Waiver waitlist',
    why: 'The list is long — getting on it is the single most consequential first move.',
    href: '/support/financial',
    bucket: 'do-today',
    altBuckets: ['save-resource'],
  },
  insuranceCall: {
    id: 'insuranceCall',
    title: 'Check your private insurance ABA coverage',
    why: 'Call the number on the back of your card and ask about ABA + outpatient behavioral health.',
    href: '/support/financial',
    bucket: 'do-today',
    altBuckets: ['ask-bcba'],
  },
  hopeForThree: {
    id: 'hopeForThree',
    title: 'Apply to Hope For Three for short-term help',
    why: 'Quick Assist can move funds to your provider in 3–5 business days.',
    href: '/support/find',
    bucket: 'do-today',
  },
  financialGuide: {
    id: 'financialGuide',
    title: 'Review the financial help guide',
    why: 'Insurance, Medicaid waiver, and short-term grant options in one place.',
    href: '/support/financial',
    bucket: 'save-resource',
  },

  // Hard-days / parent care
  fourMinutes: {
    id: 'fourMinutes',
    title: 'Take four minutes for yourself',
    why: 'Before anything else. The rest of the plan can wait that long.',
    href: '/support/hard-days',
    bucket: 'do-today',
    altBuckets: ['try-home'],
  },
  parentTherapist: {
    id: 'parentTherapist',
    title: 'Find a parent therapist',
    why: 'You spend every day advocating for your child. This is how you advocate for yourself.',
    href: '/support/caregiver',
    bucket: 'save-resource',
    altBuckets: ['ask-bcba'],
  },
  meltdownNow: {
    id: 'meltdownNow',
    title: 'If a meltdown is happening now',
    why: 'A two-minute calming page for the moment, not the strategy.',
    href: '/support/hard-days',
    bucket: 'save-resource',
    altBuckets: ['try-home'],
  },

  // Connection
  parentMatch: {
    id: 'parentMatch',
    title: 'Build a parent match',
    why: 'A real person who has walked a similar road. Low-pressure, on your timing.',
    href: '/support/connect',
    bucket: 'next-week',
    altBuckets: ['save-resource'],
  },
  smallGroups: {
    id: 'smallGroups',
    title: 'Browse small groups',
    why: 'Some weeks a group is easier than a 1:1 conversation.',
    href: '/support/connect',
    bucket: 'next-week',
  },

  // School / IEP
  iepPrep: {
    id: 'iepPrep',
    title: 'Open the IEP / ARD prep guide',
    why: 'A short, plain-language walkthrough so you walk in prepared.',
    href: '/support/resources',
    bucket: 'save-resource',
    altBuckets: ['ask-bcba'],
  },
  parentAdvocate: {
    id: 'parentAdvocate',
    title: 'Bring a parent advocate to your next meeting',
    why: 'You don’t have to do this alone.',
    href: '/support/help',
    bucket: 'next-week',
  },
  documentHard: {
    id: 'documentHard',
    title: 'Document what is hard right now',
    why: 'Three specific examples beat a long story every time.',
    href: '/support/caregiver',
    bucket: 'ask-bcba',
    altBuckets: ['try-home'],
  },

  // ABA understanding / newly diagnosed
  whatIsAba: {
    id: 'whatIsAba',
    title: 'Read the “What is ABA?” quick guide',
    why: 'A plain-language foundation so the next conversations land easier.',
    href: '/support/what-is-aba',
    bucket: 'save-resource',
  },
  callOneProvider: {
    id: 'callOneProvider',
    title: 'Pick one local provider to call this week',
    why: 'You don’t have to call all of them. One.',
    href: '/support/find',
    bucket: 'next-week',
    altBuckets: ['do-today'],
  },
  mchat: {
    id: 'mchat',
    title: 'Ask your pediatrician for an M-CHAT screening',
    why: 'Bring written examples of what you’ve seen — specific beats general.',
    href: '/support/what-is-aba',
    bucket: 'ask-bcba',
    altBuckets: ['do-today'],
  },
  devPed: {
    id: 'devPed',
    title: 'Find a local developmental pediatrician',
    why: 'Many have long wait times — call now even if you’re not sure yet.',
    href: '/support/find',
    bucket: 'do-today',
  },

  // Looking-for / comparing providers
  compareThree: {
    id: 'compareThree',
    title: 'Compare three local ABA providers',
    why: 'Filter by insurance and waitlist so the list is realistic.',
    href: '/support/find',
    bucket: 'next-week',
    altBuckets: ['save-resource'],
  },
  firstCallQuestions: {
    id: 'firstCallQuestions',
    title: 'Prepare what to ask on the first call',
    why: 'Five specific questions that protect your time.',
    href: '/support/resources',
    bucket: 'ask-bcba',
    altBuckets: ['save-resource'],
  },
  trackNotes: {
    id: 'trackNotes',
    title: 'Open your care plan with notes',
    why: 'Track what you hear from each provider so they don’t blur together.',
    href: '/support/care-plan',
    bucket: 'try-home',
  },

  // Siblings
  siblingGuide: {
    id: 'siblingGuide',
    title: 'Read the sibling support guide',
    why: 'Practical, written by parents who have been there.',
    href: '/support/siblings',
    bucket: 'save-resource',
  },
  siblingOneThing: {
    id: 'siblingOneThing',
    title: 'Pick one sibling thing to try this week',
    why: 'Pick one. Small.',
    href: '/support/siblings',
    bucket: 'try-home',
    altBuckets: ['next-week'],
  },

  // Behavior at home
  homeStrategy: {
    id: 'homeStrategy',
    title: 'Try one short home strategy today',
    why: 'One. Not all of them. Something that fits today’s capacity.',
    href: '/support/help',
    bucket: 'try-home',
    altBuckets: ['do-today'],
  },
  practicalGuides: {
    id: 'practicalGuides',
    title: 'Open the practical guides library',
    why: 'Filtered by what families actually use, not what sounds good on paper.',
    href: '/support/resources',
    bucket: 'save-resource',
  },

  // Finding resources
  findLocal: {
    id: 'findLocal',
    title: 'Use Find Local Help',
    why: 'Pick two nearby support options that match your insurance.',
    href: '/support/find',
    bucket: 'next-week',
    altBuckets: ['save-resource'],
  },
  saveShortlist: {
    id: 'saveShortlist',
    title: 'Save the ones that look promising',
    why: 'A short list now beats a long search later.',
    href: '/support/resources',
    bucket: 'save-resource',
  },

  // Sleep (notes-driven)
  sleepGuide: {
    id: 'sleepGuide',
    title: 'Read the sleep & bedtime guide',
    why: 'Small, layered changes work better than a single overhaul.',
    href: '/support/resources',
    bucket: 'try-home',
    altBuckets: ['ask-bcba'],
  },

  // Marriage / partner (notes-driven)
  partnerTalk: {
    id: 'partnerTalk',
    title: 'Set up one short partner check-in',
    why: 'Fifteen minutes, same time each week. That’s the whole bar.',
    href: '/support/caregiver',
    bucket: 'next-week',
    altBuckets: ['try-home'],
  },
};

// ---------------------------------------------------------------------------
// Scoring engine
// ---------------------------------------------------------------------------

type Score = {
  candidate: Candidate;
  weight: number;
  reasons: string[]; // human "because you said …" fragments
};

function add(scores: Map<string, Score>, c: Candidate, weight: number, reason: string) {
  const existing = scores.get(c.id);
  if (existing) {
    existing.weight += weight;
    if (!existing.reasons.includes(reason)) existing.reasons.push(reason);
  } else {
    scores.set(c.id, { candidate: c, weight, reasons: [reason] });
  }
}

function has<T>(arr: T[] | null | undefined, val: T): boolean {
  return Array.isArray(arr) && arr.includes(val);
}

/** Tier weights — higher number = surfaced first. */
const W = {
  hardestPrimary: 10,
  hardestSecondary: 7, // each additional pick still matters
  stage: 6,
  helpKind: 5,
  mood: 4,
  notesKeyword: 8, // a typed-in keyword is a strong signal
  ageBand: 3,
};

// Map a hardest pick to one or two candidate steps + a reason fragment.
function applyHardest(scores: Map<string, Score>, hardest: Hardest, weight: number) {
  const because = `Because you said ${HARDEST_FRAGMENT[hardest]} is hard right now.`;
  switch (hardest) {
    case 'financial-insurance':
      add(scores, C.medicaidWaiver, weight, because);
      add(scores, C.insuranceCall, weight - 1, because);
      add(scores, C.financialGuide, weight - 2, because);
      break;
    case 'overwhelmed':
      add(scores, C.fourMinutes, weight, because);
      add(scores, C.parentTherapist, weight - 2, because);
      break;
    case 'connecting-parents':
      add(scores, C.parentMatch, weight, because);
      add(scores, C.smallGroups, weight - 2, because);
      break;
    case 'school-iep':
      add(scores, C.iepPrep, weight, because);
      add(scores, C.parentAdvocate, weight - 2, because);
      add(scores, C.documentHard, weight - 3, because);
      break;
    case 'understanding-aba':
      add(scores, C.whatIsAba, weight, because);
      add(scores, C.practicalGuides, weight - 3, because);
      break;
    case 'behavior-home':
      add(scores, C.homeStrategy, weight, because);
      add(scores, C.meltdownNow, weight - 1, because);
      add(scores, C.practicalGuides, weight - 3, because);
      break;
    case 'finding-resources':
      add(scores, C.findLocal, weight, because);
      add(scores, C.saveShortlist, weight - 2, because);
      break;
    case 'siblings':
      add(scores, C.siblingGuide, weight, because);
      add(scores, C.siblingOneThing, weight - 2, because);
      break;
  }
}

// Notes keyword → candidate. Patterns are intentionally simple and additive.
type NotesRule = {
  pattern: RegExp;
  candidate: Candidate;
  matchedPhrase: string;
  reflection: string; // shown back to parent as a NoteEcho
  because: string; // short reason for the step's "because you said"
};

const NOTES_RULES: NotesRule[] = [
  {
    pattern: /\b(sleep|bedtime|night ?wak(e|ing)|insomnia|won'?t sleep)\b/i,
    candidate: C.sleepGuide,
    matchedPhrase: 'sleep',
    reflection: 'Sleep is on this plan because you mentioned it — small changes here often unlock everything else.',
    because: 'Because you mentioned sleep.',
  },
  {
    pattern: /\b(iep|ard|504|school meeting|teacher)\b/i,
    candidate: C.iepPrep,
    matchedPhrase: 'school',
    reflection: 'You mentioned school — bringing the IEP / ARD prep guide forward.',
    because: 'Because you mentioned school.',
  },
  {
    pattern: /\b(insurance|deductible|copay|out[- ]of[- ]network|denied|claim)\b/i,
    candidate: C.insuranceCall,
    matchedPhrase: 'insurance',
    reflection: 'You mentioned insurance — that call is now your first step.',
    because: 'Because you mentioned insurance.',
  },
  {
    pattern: /\b(money|afford|cost|expensive|broke|budget|bills?)\b/i,
    candidate: C.financialGuide,
    matchedPhrase: 'money',
    reflection: 'You mentioned money pressure — the financial help guide is pulled in.',
    because: 'Because you mentioned money pressure.',
  },
  {
    pattern: /\b(meltdown|melt[- ]?down|tantrum|aggression|hitting|biting|screaming)\b/i,
    candidate: C.meltdownNow,
    matchedPhrase: 'meltdowns',
    reflection: 'You mentioned meltdowns — the in-the-moment page is one tap away.',
    because: 'Because you mentioned meltdowns.',
  },
  {
    pattern: /\b(sibling|brother|sister)\b/i,
    candidate: C.siblingGuide,
    matchedPhrase: 'siblings',
    reflection: 'You mentioned a sibling — adding the sibling support guide.',
    because: 'Because you mentioned a sibling.',
  },
  {
    pattern: /\b(marriage|partner|spouse|husband|wife|relationship)\b/i,
    candidate: C.partnerTalk,
    matchedPhrase: 'partner',
    reflection: 'You mentioned your partner — a short weekly check-in goes a long way.',
    because: 'Because you mentioned your partner.',
  },
  {
    pattern: /\b(tired|exhausted|burn(ed|t)? out|drained|can'?t do this|overwhelmed)\b/i,
    candidate: C.fourMinutes,
    matchedPhrase: 'exhaustion',
    reflection: 'You said you’re running on empty — four minutes for you comes first.',
    because: 'Because you said you’re running on empty.',
  },
  {
    pattern: /\b(diagnos|recent(ly)? diagnosed|just diagnosed)\b/i,
    candidate: C.whatIsAba,
    matchedPhrase: 'new diagnosis',
    reflection: 'You mentioned a recent diagnosis — starting with the “What is ABA?” guide.',
    because: 'Because you mentioned a recent diagnosis.',
  },
  {
    pattern: /\b(waitlist|wait list|waiting)\b/i,
    candidate: C.medicaidWaiver,
    matchedPhrase: 'waitlist',
    reflection: 'You mentioned a waitlist — getting on the Medicaid Waiver is the priority move.',
    because: 'Because you mentioned a waitlist.',
  },
  {
    pattern: /\b(lonely|alone|isolated|no one (gets|understands)|nobody understands)\b/i,
    candidate: C.parentMatch,
    matchedPhrase: 'feeling alone',
    reflection: 'You said you feel alone in this — a parent match is the most direct fix.',
    because: 'Because you said you feel alone.',
  },
  {
    pattern: /\b(provider|therapist|clinic|center|aba center)\b/i,
    candidate: C.compareThree,
    matchedPhrase: 'providers',
    reflection: 'You mentioned providers — pulled in the compare-three guide.',
    because: 'Because you mentioned providers.',
  },
];

/** Parse the notes textarea and return scoring + echo-back phrases. */
export function parseNotes(notes: string | null | undefined): {
  matches: NotesRule[];
  echoes: NoteEcho[];
} {
  if (!notes || notes.trim().length === 0) return { matches: [], echoes: [] };
  const seen = new Set<string>();
  const matches: NotesRule[] = [];
  const echoes: NoteEcho[] = [];
  for (const rule of NOTES_RULES) {
    if (rule.pattern.test(notes) && !seen.has(rule.candidate.id)) {
      seen.add(rule.candidate.id);
      matches.push(rule);
      echoes.push({ phrase: rule.matchedPhrase, reflection: rule.reflection });
    }
  }
  return { matches, echoes };
}

// ---------------------------------------------------------------------------
// Main entry: build the ordered list of steps + their reasons
// ---------------------------------------------------------------------------

function buildScores(answers: CarePlanAnswers): Map<string, Score> {
  const scores = new Map<string, Score>();
  const picks = (answers.hardest ?? []) as Hardest[];

  picks.forEach((h, idx) => {
    const weight = idx === 0 ? W.hardestPrimary : W.hardestSecondary;
    applyHardest(scores, h, weight);
  });

  // Stage track
  switch (answers.stage) {
    case 'newly-diagnosed':
      add(scores, C.whatIsAba, W.stage, 'Because you said you’re newly diagnosed.');
      add(scores, C.medicaidWaiver, W.stage - 1, 'Because you said you’re newly diagnosed.');
      add(scores, C.callOneProvider, W.stage - 2, 'Because you said you’re newly diagnosed.');
      break;
    case 'waiting-diagnosis':
      add(scores, C.mchat, W.stage, 'Because you said you’re waiting on a diagnosis.');
      add(scores, C.devPed, W.stage - 1, 'Because you said you’re waiting on a diagnosis.');
      break;
    case 'looking-for-aba':
      add(scores, C.compareThree, W.stage, 'Because you said you’re looking for ABA.');
      add(scores, C.firstCallQuestions, W.stage - 1, 'Because you said you’re looking for ABA.');
      add(scores, C.trackNotes, W.stage - 2, 'Because you said you’re looking for ABA.');
      break;
    case 'in-aba':
      add(scores, C.practicalGuides, W.stage, 'Because you said you’re already in ABA.');
      add(scores, C.parentMatch, W.stage - 2, 'Because you said you’re already in ABA.');
      break;
    case 'past-aba':
      add(scores, C.parentMatch, W.stage, 'Because you said you’re past ABA and parenting onward.');
      add(scores, C.practicalGuides, W.stage - 2, 'Because you said you’re past ABA and parenting onward.');
      break;
  }

  // Help-kind track
  switch (answers.helpKind) {
    case 'practical-info':
      add(scores, C.practicalGuides, W.helpKind, 'Because you said you want practical info.');
      break;
    case 'local-providers':
      add(scores, C.findLocal, W.helpKind, 'Because you said you want local providers.');
      break;
    case 'someone-to-talk-to':
      add(scores, C.parentMatch, W.helpKind, 'Because you said you want someone to talk to.');
      break;
    case 'time-for-me':
      add(scores, C.fourMinutes, W.helpKind, 'Because you said you need time for yourself.');
      add(scores, C.parentTherapist, W.helpKind - 1, 'Because you said you need time for yourself.');
      break;
    case 'not-sure':
      add(scores, C.whatIsAba, W.helpKind - 2, 'A gentle starting point while you figure out what helps.');
      break;
  }

  // Mood track
  if (answers.weekMood === 'frayed' || answers.weekMood === 'heavy') {
    add(scores, C.fourMinutes, W.mood, 'Because you said this week feels heavy.');
    add(scores, C.meltdownNow, W.mood - 2, 'Because you said this week feels heavy.');
  } else if (answers.weekMood === 'numb') {
    add(scores, C.fourMinutes, W.mood, 'Because you said you’re feeling numb.');
  } else if (answers.weekMood === 'steady') {
    add(scores, C.practicalGuides, W.mood - 1, 'Because you said you’re feeling steadier.');
  } else if (answers.weekMood === 'hopeful') {
    add(scores, C.parentMatch, W.mood - 1, 'Because you said you’re feeling more hopeful.');
  }

  // Age band — light influence
  if (answers.childAge === '0-2' || answers.childAge === '2-5') {
    add(scores, C.whatIsAba, W.ageBand, 'Because of your child’s age, foundations come first.');
  }
  if (answers.childAge === '6-12' || answers.childAge === '13-17') {
    add(scores, C.iepPrep, W.ageBand, 'Because of your child’s age, school support is often the lever.');
  }

  // Notes-driven
  const { matches } = parseNotes(answers.notes ?? '');
  for (const m of matches) {
    add(scores, m.candidate, W.notesKeyword, m.because);
  }

  return scores;
}

/**
 * Top N steps, ordered by weight, with stable tiebreak by title.
 *
 * The number of steps returned is gated by the parent's current bandwidth
 * tier — a heavy day yields a shorter plan so we don't pile work on top of
 * an already-strained parent. Defaults to the 'doing-well' plan size when
 * no tier is supplied (e.g. legacy calls without a check-in result).
 */
export function generateNextSteps(
  answers: CarePlanAnswers,
  bandwidthTier?: BandwidthTier,
): CarePlanStep[] {
  const scores = buildScores(answers);
  const limit = TIER_STEP_LIMIT[bandwidthTier ?? 'doing-well'];
  if (scores.size === 0) return FALLBACK_STEPS.slice(0, limit);

  const ranked = Array.from(scores.values()).sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    return a.candidate.title.localeCompare(b.candidate.title);
  });

  return ranked.slice(0, limit).map(({ candidate, weight, reasons }) => ({
    title: candidate.title,
    why: candidate.why,
    href: candidate.href,
    because: reasons[0], // surface the strongest reason
    weight,
    bucket: candidate.bucket,
  }));
}

// ---------------------------------------------------------------------------
// 5-bucket plan (CCO review, May 2026)
// ---------------------------------------------------------------------------

/** The 5 buckets, in the display order Texas ABA Centers' CCO asked for. */
export const BUCKET_ORDER: StepBucket[] = [
  'do-today',
  'ask-bcba',
  'try-home',
  'save-resource',
  'next-week',
];

export const BUCKET_LABELS: Record<StepBucket, string> = {
  'do-today': 'Do this today',
  'ask-bcba': 'Ask your BCBA this',
  'try-home': 'Try this at home',
  'save-resource': 'Save this resource',
  'next-week': 'Come back next week for this',
};

/** One-line companion copy for each bucket, parent-facing. */
export const BUCKET_BLURBS: Record<StepBucket, string> = {
  'do-today': 'A small move you can make in the next 24 hours.',
  'ask-bcba': 'Something to bring up at your next session or coaching call.',
  'try-home': 'A low-stakes thing to try in your normal routine.',
  'save-resource': 'Worth bookmarking — not urgent, just useful.',
  'next-week': 'Park this for the next check-in, not now.',
};

/**
 * Build a single recommended step per bucket. Reuses the same scoring engine
 * as `generateNextSteps`, then assigns each ranked candidate into its primary
 * bucket (falling back to altBuckets if the primary is already filled).
 * Buckets without a match are returned with `step: null` so the page can
 * render a gentle empty state instead of a missing section.
 */
export function generateBucketSteps(
  answers: CarePlanAnswers,
): { bucket: StepBucket; step: CarePlanStep | null }[] {
  const scores = buildScores(answers);
  const ranked = Array.from(scores.values()).sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    return a.candidate.title.localeCompare(b.candidate.title);
  });

  const filled = new Map<StepBucket, CarePlanStep>();

  for (const { candidate, weight, reasons } of ranked) {
    const buckets: StepBucket[] = [candidate.bucket, ...(candidate.altBuckets ?? [])];
    for (const b of buckets) {
      if (filled.has(b)) continue;
      filled.set(b, {
        title: candidate.title,
        why: candidate.why,
        href: candidate.href,
        because: reasons[0],
        weight,
        bucket: b,
      });
      break; // each candidate fills at most one bucket
    }
    if (filled.size === BUCKET_ORDER.length) break;
  }

  return BUCKET_ORDER.map((bucket) => ({ bucket, step: filled.get(bucket) ?? null }));
}

// ---------------------------------------------------------------------------
// Resources, mood message, summary
// ---------------------------------------------------------------------------

const FALLBACK_STEPS: CarePlanStep[] = [
  {
    title: 'Build a parent match',
    why: 'A real person who has walked a similar road. Low-pressure, on your timing.',
    href: '/support/connect',
  },
  {
    title: 'Pick one small thing to try at home',
    why: 'Pick one — not a list. Something that fits today.',
    href: '/support/resources',
  },
  {
    title: 'Find local help in your area',
    why: 'Filtered for what your family actually needs.',
    href: '/support/find',
  },
];

const FALLBACK_RESOURCES: CarePlanResource[] = [
  { label: 'Guides & strategies', href: '/support/resources' },
  { label: 'Find local help', href: '/support/find' },
  { label: 'Connect with parents', href: '/support/connect' },
  { label: 'Parent support', href: '/support/caregiver' },
];

export function generateResources(answers: CarePlanAnswers): CarePlanResource[] {
  const picks: CarePlanResource[] = [];
  const add = (r: CarePlanResource) => {
    if (!picks.find((p) => p.href === r.href)) picks.push(r);
  };

  const hardest = answers.hardest ?? [];
  if (hardest.includes('financial-insurance')) add({ label: 'Financial help', href: '/support/financial', because: 'Picked because financial pressure is on your list.' });
  if (hardest.includes('overwhelmed')) add({ label: 'Hard days — start here', href: '/support/hard-days', because: 'Picked because you said you’re overwhelmed.' });
  if (hardest.includes('connecting-parents')) add({ label: 'Connect with parents', href: '/support/connect', because: 'Picked because connection is on your list.' });
  if (hardest.includes('siblings')) add({ label: 'Sibling support', href: '/support/siblings', because: 'Picked because siblings are on your list.' });
  if (hardest.includes('school-iep')) add({ label: 'IEP / school guides', href: '/support/resources', because: 'Picked because school is on your list.' });
  if (hardest.includes('understanding-aba')) add({ label: 'What is ABA?', href: '/support/what-is-aba', because: 'Picked because understanding ABA is on your list.' });
  if (answers.stage === 'looking-for-aba' || answers.stage === 'newly-diagnosed') {
    add({ label: 'Find local help', href: '/support/find', because: 'Picked because of where you are right now.' });
  }
  if (answers.helpKind === 'someone-to-talk-to') add({ label: 'Connect with parents', href: '/support/connect', because: 'Picked because you said you want someone to talk to.' });
  if (answers.helpKind === 'time-for-me') add({ label: 'Parent support', href: '/support/caregiver', because: 'Picked because you said you need time for yourself.' });

  const { matches } = parseNotes(answers.notes ?? '');
  for (const m of matches) {
    add({ label: m.candidate.title, href: m.candidate.href, because: m.because });
  }

  // Always include Pathfinders so the relationship layer is visible.
  add({ label: 'Meet your Pathfinder', href: '/support/pathfinders' });

  // Pad with sensible fallbacks if the parent picked very little.
  for (const r of FALLBACK_RESOURCES) {
    if (picks.length >= 4) break;
    add(r);
  }
  return picks.slice(0, 4);
}

/** A short, mood-aware "for you, this week" message. */
export function generateWeekMessage(mood: WeekMood | null | undefined): string {
  switch (mood) {
    case 'frayed':
    case 'heavy':
      return 'This week sounds heavy. Before anything else: open the Hard Days page and take four minutes for yourself. The rest of the plan can wait.';
    case 'numb':
      return 'Numb is also a signal — not a flaw. One small thing today is enough.';
    case 'steady':
      return 'You said you’re feeling steadier. That’s worth marking. Keep doing whatever helped this week.';
    case 'hopeful':
      return 'You’re feeling a little more hopeful. Good time to plan one small thing for the week ahead.';
    default:
      return 'Pick one step. Small. You can always come back for the rest.';
  }
}

/** Two-sentence summary, gentle and parent-facing. */
export function generateSummary(answers: CarePlanAnswers): string {
  const picks = (answers.hardest ?? []) as Hardest[];
  const heavy = answers.weekMood === 'frayed' || answers.weekMood === 'heavy' || picks.includes('overwhelmed');
  const hopeful = answers.weekMood === 'hopeful' || answers.weekMood === 'steady';

  if (heavy) {
    return 'We kept this plan small on purpose. One step at a time is the plan — not a placeholder for a bigger one.';
  }
  if (hopeful) {
    return 'You have some momentum this week. These next steps build on what’s already working — they don’t replace it.';
  }
  return 'A simple plan built from what you told us. You can change it anytime — nothing here is set in stone.';
}

/** Echo-back phrases for the care plan page. */
export function generateNoteEchoes(notes: string | null | undefined): NoteEcho[] {
  return parseNotes(notes).echoes;
}
