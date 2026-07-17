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
  CoverageStatus,
  Hardest,
  HelpKind,
  NoteEcho,
  Stage,
  StepBucket,
  StepEvidence,
  WeekMood,
} from './carePlanStorage';
import { RESOURCE_HUB_LABEL } from './supportNavLabels';
import { TIER_STEP_LIMIT, type BandwidthTier } from './bandwidth';
import type { ArcWeek } from './arcs';
import { getArcWeek, isResolvableCandidateId } from './arcs';
import {
  ADMISSIONS_CTA_LABEL,
  getSupportNudgeCandidateId,
  getSupportNudgeCopy,
  pickSupportNudgeThread,
  type SupportThreadId,
} from './carePlanSupport';

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
  /** Compact research note — shown on the care plan when present. */
  evidence?: StepEvidence;
};

// Caregiver mental-health candidates (four-minute reset, find-a-parent-
// therapist, partner check-in) were removed from the generator ahead of
// clinical director review: that content lives only under Parent Support and
// never appears inside a generated care plan.
const C: Record<string, Candidate> = {
  // Financial track
  medicaidWaiver: {
    id: 'medicaidWaiver',
    title: 'Get on the Medicaid Waiver waitlist',
    why: 'Start here if cost is your worry. This page walks you through enrolling on the Texas Medicaid Waiver list, which can take years — so adding your child today protects future funding for ABA even before you need it.',
    href: '/support/financial',
    bucket: 'do-today',
    altBuckets: ['save-resource'],
  },
  insuranceCall: {
    id: 'insuranceCall',
    title: 'Check your private insurance ABA coverage',
    why: 'Use this when you have private insurance. It tells you exactly what to ask when you call the number on your card — the words "ABA" and "outpatient behavioral health" — so you learn what is covered before a bill surprises you.',
    href: '/support/financial',
    bucket: 'do-today',
    altBuckets: ['ask-bcba'],
  },
  hopeForThree: {
    id: 'hopeForThree',
    title: 'Apply to Hope For Three for short-term help',
    why: 'Go here if you need money sooner than insurance moves. Hope For Three’s Quick Assist can send funds straight to your provider in 3–5 business days — this page shows who qualifies and how to apply.',
    href: '/support/find',
    bucket: 'do-today',
  },
  financialGuide: {
    id: 'financialGuide',
    title: 'Review the financial help guide',
    why: 'Read this when you want the full picture of what pays for ABA. It lays out private insurance, the Medicaid waiver, and short-term grants side by side, so you can see every option in one place instead of hunting.',
    href: '/support/financial',
    bucket: 'save-resource',
  },

  // Behavior support for hard moments
  meltdownNow: {
    id: 'meltdownNow',
    title: 'If a meltdown is happening now',
    why: 'Bookmark this for the hard moments. It’s a two-minute, in-the-moment calming guide for when a meltdown is happening — fast steps to get through it, not a long strategy to study later.',
    href: '/support/at-home',
    bucket: 'save-resource',
    altBuckets: ['try-home'],
    evidence: {
      text: 'Brief grounding and breath techniques taught in distress-tolerance protocols can interrupt an acute stress spike in under two minutes — useful when you need to stay regulated in the moment.',
      source: 'Linehan, DBT Skills Training Manual — distress tolerance module',
    },
  },

  // Connection
  parentMatch: {
    id: 'parentMatch',
    title: 'Build a parent match',
    why: 'Start here if you feel alone in this. It pairs you with another Texas parent who has raised a child through ABA — a real person to message on your own timing, so the next hard week has someone in it who gets it.',
    href: '/support/connect',
    bucket: 'next-week',
    altBuckets: ['save-resource'],
    evidence: {
      text: 'Peer support and connection with other parents consistently links to lower caregiver stress and loneliness in research on autism families — even when the support is online or asynchronous.',
      source: 'DaWalt et al., Journal of Autism & Developmental Disorders (2019) — caregiver social support review',
    },
  },
  smallGroups: {
    id: 'smallGroups',
    title: 'Browse small groups',
    why: 'Look here if one-on-one feels like too much right now. These are small parent groups you can join to listen or share — an easier first step into connection than a solo conversation.',
    href: '/support/connect',
    bucket: 'next-week',
    evidence: {
      text: 'Parent support groups are associated with reduced isolation and improved coping in caregivers of children with developmental disabilities — a low-pressure way to feel less alone.',
      source: 'Singer, Journal of Policy & Practice in Intellectual Disabilities (2006) — parent support group outcomes',
    },
  },

  // School / IEP
  iepPrep: {
    id: 'iepPrep',
    title: 'Open the IEP / ARD prep guide',
    why: 'Read this before your next school meeting. It’s a plain-language walkthrough of the IEP / ARD process — what the terms mean, what to ask for, and what to bring — so you walk in knowing your rights instead of guessing.',
    href: '/support/resources',
    bucket: 'save-resource',
    altBuckets: ['ask-bcba'],
  },
  parentAdvocate: {
    id: 'parentAdvocate',
    title: 'Bring a parent advocate to your next meeting',
    why: 'Use this if school meetings feel one-sided. It explains how to bring an experienced parent advocate with you to an IEP/ARD meeting, so you have someone in your corner who knows the system.',
    href: '/support/connect',
    bucket: 'next-week',
  },
  documentHard: {
    id: 'documentHard',
    title: 'Document what is hard right now',
    why: 'Do this before any clinical or school meeting. It shows you how to write down three specific recent examples of what’s hard — concrete notes that help a BCBA or school team act faster than a general description would.',
    href: '/support/resources',
    bucket: 'ask-bcba',
    altBuckets: ['try-home'],
  },

  // ABA understanding / newly diagnosed
  whatIsAba: {
    id: 'whatIsAba',
    title: 'Read the “What is ABA?” quick guide',
    why: 'Start here if ABA is still a confusing term. It explains in plain language what ABA therapy actually is, what a typical week looks like, and what to expect — so the conversations ahead with providers make sense.',
    href: '/support/what-is-aba',
    bucket: 'save-resource',
  },
  callOneProvider: {
    id: 'callOneProvider',
    title: 'Pick one local provider to call this week',
    why: 'Use this to take the first real step. It’s a list of local ABA providers with a simple goal — call just one this week, not all of them — so getting started feels doable instead of overwhelming.',
    href: '/support/find',
    bucket: 'next-week',
    altBuckets: ['do-today'],
  },
  mchat: {
    id: 'mchat',
    title: 'Ask your pediatrician for an M-CHAT screening',
    why: 'Do this while you’re waiting on a diagnosis. The page explains the M-CHAT autism screening and how to ask your pediatrician for it, with examples to bring — a concrete way to move the evaluation forward.',
    href: '/support/what-is-aba',
    bucket: 'ask-bcba',
    altBuckets: ['do-today'],
  },
  devPed: {
    id: 'devPed',
    title: 'Find a local developmental pediatrician',
    why: 'Go here if you’re seeking an official diagnosis. It helps you find a developmental pediatrician near you — and because their waitlists are often months long, it’s worth calling now even before you feel ready.',
    href: '/support/find',
    bucket: 'do-today',
  },

  // Looking-for / comparing providers
  compareThree: {
    id: 'compareThree',
    title: 'Compare three local ABA providers',
    why: 'Use this when you’re choosing a provider. It lets you filter local ABA centers by insurance accepted and waitlist length, so the three you compare are ones that could realistically take your child.',
    href: '/support/find',
    bucket: 'next-week',
    altBuckets: ['save-resource'],
  },
  firstCallQuestions: {
    id: 'firstCallQuestions',
    title: 'Prepare what to ask on the first call',
    why: 'Read this right before you call a provider. It gives you five specific questions to ask on a first call — about waitlists, insurance, and approach — so you get real answers fast and don’t waste a callback.',
    href: '/support/resources',
    bucket: 'ask-bcba',
    altBuckets: ['save-resource'],
  },
  trackNotes: {
    id: 'trackNotes',
    title: 'Open your care plan with notes',
    why: 'Use this while you’re shopping around. It’s a simple place to jot what each provider told you, so when you’re comparing several at once their details don’t blur together.',
    href: '/support/care-plan',
    bucket: 'try-home',
  },

  /** Week-2 ABA path — surfaced after week-one bucket work is done. */
  questionsForBCBA: {
    id: 'questionsForBCBA',
    title: 'Use these questions on your first BCBA call',
    why: 'Six plain-English questions to ask any provider before you commit — the ones parents wish they had asked on the first call.',
    href: '/support/what-is-aba#questions',
    bucket: 'ask-bcba',
  },
  shortlistProviders: {
    id: 'shortlistProviders',
    title: 'Build a shortlist of two providers to call',
    why: 'Filter local ABA centers by your insurance, pick two that look promising, and call both — comparing answers beats calling every listing in town.',
    href: '/support/find',
    bucket: 'do-today',
  },
  verifyCoverage: {
    id: 'verifyCoverage',
    title: 'Verify ABA coverage before you schedule',
    why: 'Know exactly what to ask your insurance about ABA so you are not surprised by a denial after you have found a provider you like.',
    href: '/support/financial#insurance',
    bucket: 'do-today',
  },
  checkCoverageStatus: {
    id: 'checkCoverageStatus',
    title: 'Not sure what you have? Find out what your plan covers',
    why: 'A short how-to: call the number on your card, ask about ABA and outpatient behavioral health, or check whether your child already qualifies for Medicaid — so you know what is possible before you pick a provider.',
    href: '/support/financial#insurance',
    bucket: 'do-today',
    altBuckets: ['save-resource'],
  },
  slidingScaleFind: {
    id: 'slidingScaleFind',
    title: 'Find sliding-scale or grant-friendly ABA options',
    why: 'Not every path requires private insurance. Filter local providers and nonprofits that offer sliding-scale fees, self-pay plans, or grant partnerships.',
    href: '/support/find',
    bucket: 'do-today',
  },
  admissionsConsult: {
    id: 'admissionsConsult',
    title: ADMISSIONS_CTA_LABEL,
    why: 'One universal door: a free consultation with our admissions team. They walk through coverage and next steps with you — no eligibility decision on this site.',
    href: 'tel:+18777715725',
    bucket: 'do-today',
    altBuckets: ['ask-bcba'],
  },
  schoolServicesPath: {
    id: 'schoolServicesPath',
    title: 'Explore school-based services (no insurance required)',
    why: 'School districts can provide evaluations and services through an IEP or 504 — a real route to support while you figure out clinic-based ABA.',
    href: '/support/resources',
    bucket: 'save-resource',
    altBuckets: ['ask-bcba'],
  },

  // Siblings
  siblingGuide: {
    id: 'siblingGuide',
    title: 'Read the sibling support guide',
    why: 'Read this if a brother or sister is feeling the strain too. It’s a practical guide, written by parents, on how to support siblings of a child in ABA — what they often feel and concrete ways to help them feel seen.',
    href: '/support/siblings',
    bucket: 'save-resource',
  },
  siblingOneThing: {
    id: 'siblingOneThing',
    title: 'Pick one sibling thing to try this week',
    why: 'Start here if the guide feels like a lot. It suggests one small thing to try with a sibling this week — a single, low-effort step instead of a whole plan to take on.',
    href: '/support/siblings',
    bucket: 'try-home',
    altBuckets: ['next-week'],
  },

  // Behavior at home
  homeStrategy: {
    id: 'homeStrategy',
    title: 'Try one short home strategy today',
    why: 'Use this when behavior at home is the hard part. It’s a set of short, at-home strategies for things like transitions and meltdowns — pick just one to try today rather than overhauling your whole routine.',
    href: '/support/at-home',
    bucket: 'try-home',
    altBuckets: ['do-today'],
  },
  practicalGuides: {
    id: 'practicalGuides',
    title: 'Open the practical guides library',
    why: 'Browse this when you want how-to help you can use now. It’s a library of practical guides chosen for what families actually use day to day — routines, communication, behavior — not theory.',
    href: '/support/resources',
    bucket: 'save-resource',
  },

  // Finding resources
  findLocal: {
    id: 'findLocal',
    title: 'Use Find Local Help',
    why: 'Start here when you don’t know what’s near you. It searches local ABA centers and support services and filters them by your insurance, so you can pick two real, nearby options to look into.',
    href: '/support/find',
    bucket: 'next-week',
    altBuckets: ['save-resource'],
  },
  saveShortlist: {
    id: 'saveShortlist',
    title: 'Save the ones that look promising',
    why: 'Use this once you’ve found a few options. It lets you save a short list of the providers or resources worth a second look, so you don’t have to start the search over next time.',
    href: '/support/resources',
    bucket: 'save-resource',
  },

  // Sleep (notes-driven)
  sleepGuide: {
    id: 'sleepGuide',
    title: 'Read the sleep & bedtime guide',
    why: 'Open this if bedtime or night waking is wearing you down. It’s a guide to building a calmer bedtime routine through small, layered changes — picked because better sleep often makes everything else more manageable.',
    href: '/support/resources',
    bucket: 'try-home',
    altBuckets: ['ask-bcba'],
  },

  // New-to-ABA path (stage-gated plan for families without a provider yet)
  gatherPaperwork: {
    id: 'gatherPaperwork',
    title: 'Gather your diagnosis paperwork',
    why: 'Pull together the evaluation report, any referral letters, and your child’s records in one folder. Intake teams and insurers will ask for these, and having them ready keeps everything moving.',
    href: '/support/resources',
    bucket: 'do-today',
  },
  confirmCoveragePlan: {
    id: 'confirmCoveragePlan',
    title: 'Confirm your insurance or Medicaid plan (which MCO)',
    why: 'Call the number on your card and confirm exactly which plan your child is on — for Texas Medicaid, that means which managed care organization (MCO), such as a STAR Kids plan. Intake will need this to verify coverage.',
    href: '/support/financial',
    bucket: 'do-today',
  },
  contactIntake: {
    id: 'contactIntake',
    title: 'Contact intake at Texas ABA Centers',
    why: 'One call starts the process. The intake team verifies coverage, answers your questions, and schedules the first evaluation — no referral needed.',
    href: 'tel:+18777715725',
    bucket: 'do-today',
  },
  firstBcbaCall: {
    id: 'firstBcbaCall',
    title: 'What to expect on your first BCBA call',
    why: 'A plain-language look at what the first conversation with a BCBA covers and the questions worth asking, so nothing on that call is a surprise.',
    href: '/support/what-is-aba#questions',
    bucket: 'ask-bcba',
  },
  waitlistAtHome: {
    id: 'waitlistAtHome',
    title: 'Waitlist-friendly at-home strategies',
    why: 'Practical routines, first–then language, and transition tools you can start using at home right away — useful while you wait for services to begin.',
    href: '/support/at-home',
    bucket: 'try-home',
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

/** Private-insurance-only financial resources — never surfaced unless coverage is private. */
const PRIVATE_INSURANCE_ONLY = new Set(['verifyCoverage', 'insuranceCall']);

/** Financial-resource ids — coverage may only filter these (never gates arc, support, or admissions). */
export const FINANCIAL_CANDIDATE_IDS = new Set([
  'verifyCoverage',
  'insuranceCall',
  'medicaidWaiver',
  'hopeForThree',
  'financialGuide',
  'checkCoverageStatus',
  'slidingScaleFind',
]);

export function isFinancialCandidate(id: string): boolean {
  return FINANCIAL_CANDIDATE_IDS.has(id);
}

/** Coverage personalizes financial resources only — all other steps always allowed. */
export function isCandidateAllowed(id: string, coverage: CoverageStatus): boolean {
  if (!isFinancialCandidate(id)) return true;
  if (!PRIVATE_INSURANCE_ONLY.has(id)) return true;
  return coverage === 'private-insurance';
}

/** @deprecated Use isCandidateAllowed — kept for callers during migration. */
export function isAllowedForCoverage(candidateId: string, coverage: CoverageStatus): boolean {
  return isCandidateAllowed(candidateId, coverage);
}

/** Resolve coverage — legacy plans without `coverageStatus` never assume private insurance. */
export function resolveCoverageStatus(answers: CarePlanAnswers): CoverageStatus {
  return answers.coverageStatus ?? 'not-sure';
}

/** Financial / access steps by coverage — resources only, not eligibility. */
export function coverageFinancialStepIds(coverage: CoverageStatus): string[] {
  switch (coverage) {
    case 'private-insurance':
      return ['verifyCoverage', 'insuranceCall', 'financialGuide'];
    case 'medicaid-waiver':
      return ['medicaidWaiver', 'financialGuide', 'hopeForThree'];
    case 'uninsured-self-pay':
      return [
        'hopeForThree',
        'financialGuide',
        'slidingScaleFind',
        'schoolServicesPath',
        'medicaidWaiver',
      ];
    case 'not-sure':
    default:
      return [
        'checkCoverageStatus',
        'financialGuide',
        'hopeForThree',
        'slidingScaleFind',
        'schoolServicesPath',
        'medicaidWaiver',
      ];
  }
}

// Map a hardest pick to one or two candidate steps + a reason fragment.
function applyFinancialHardest(
  scores: Map<string, Score>,
  weight: number,
  because: string,
  coverage: CoverageStatus,
) {
  switch (coverage) {
    case 'private-insurance':
      add(scores, C.insuranceCall, weight, because);
      add(scores, C.medicaidWaiver, weight - 1, because);
      add(scores, C.financialGuide, weight - 2, because);
      break;
    case 'medicaid-waiver':
      add(scores, C.medicaidWaiver, weight, because);
      add(scores, C.financialGuide, weight - 1, because);
      add(scores, C.hopeForThree, weight - 2, because);
      break;
    case 'not-sure':
      add(scores, C.checkCoverageStatus, weight, because);
      add(scores, C.financialGuide, weight - 1, because);
      add(scores, C.hopeForThree, weight - 2, because);
      break;
    case 'uninsured-self-pay':
    default:
      add(scores, C.hopeForThree, weight, because);
      add(scores, C.financialGuide, weight - 1, because);
      add(scores, C.medicaidWaiver, weight - 2, because);
      break;
  }
}

function applyHardest(
  scores: Map<string, Score>,
  hardest: Hardest,
  weight: number,
  coverage: CoverageStatus,
) {
  const because = `Because you said ${HARDEST_FRAGMENT[hardest]} is hard right now.`;
  switch (hardest) {
    case 'financial-insurance':
      applyFinancialHardest(scores, weight, because, coverage);
      break;
    case 'overwhelmed':
      // Caregiver mental-health steps no longer appear in generated plans —
      // point overwhelmed parents toward peer connection and small wins.
      add(scores, C.parentMatch, weight, because);
      add(scores, C.practicalGuides, weight - 2, because);
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
    pattern: /\b(tired|exhausted|burn(ed|t)? out|drained|can'?t do this|overwhelmed)\b/i,
    candidate: C.parentMatch,
    matchedPhrase: 'exhaustion',
    reflection: 'You said you’re running on empty — another parent who gets it can help carry this.',
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
  const coverage = resolveCoverageStatus(answers);
  const picks = (answers.hardest ?? []) as Hardest[];

  picks.forEach((h, idx) => {
    const weight = idx === 0 ? W.hardestPrimary : W.hardestSecondary;
    applyHardest(scores, h, weight, coverage);
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

  // Help-kind track — now multi-select. Falls back to the legacy single
  // value so older saved plans still score correctly.
  const helpKinds: HelpKind[] =
    answers.helpKinds && answers.helpKinds.length
      ? answers.helpKinds
      : answers.helpKind
        ? [answers.helpKind]
        : [];
  for (const help of helpKinds) {
    switch (help) {
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
        // Caregiver mental-health content lives under Parent Support only —
        // the plan points to peer connection instead.
        add(scores, C.parentMatch, W.helpKind, 'Because you said you need time for yourself.');
        break;
      case 'not-sure':
        add(scores, C.whatIsAba, W.helpKind - 2, 'A gentle starting point while you figure out what helps.');
        break;
    }
  }

  // Notes-driven — swap insurance-only candidates when coverage is not private.
  const { matches } = parseNotes(answers.notes ?? '');
  for (const m of matches) {
    let candidate = m.candidate;
    if (
      candidate.id === 'insuranceCall' &&
      coverage !== 'private-insurance'
    ) {
      candidate =
        coverage === 'not-sure' ? C.checkCoverageStatus : C.financialGuide;
    }
    add(scores, candidate, W.notesKeyword, m.because);
  }

  // Drop any private-insurance-only candidates that slipped in from legacy paths.
  for (const id of PRIVATE_INSURANCE_ONLY) {
    if (!isAllowedForCoverage(id, coverage)) scores.delete(id);
  }

  return scores;
}

// ---------------------------------------------------------------------------
// Stage gate — new to ABA, no provider yet
// ---------------------------------------------------------------------------

/**
 * Families who are new to ABA and do not yet have a provider (including
 * Medicaid families — coverage never changes this gate) get a fixed,
 * ordered plan: (1) gather diagnosis paperwork, (2) confirm insurance or
 * Medicaid plan (which MCO), (3) contact intake at Texas ABA Centers,
 * (4) what to expect on the first BCBA call, plus waitlist-friendly at-home
 * strategies. No caregiver mental-health module appears in this output.
 * Families already in services see collaboration and at-home content via the
 * regular scoring engine instead.
 */
export const NEW_TO_ABA_STAGES: ReadonlySet<Stage> = new Set<Stage>([
  'newly-diagnosed',
  'looking-for-aba',
]);

export function isNewToAbaWithoutProvider(answers: CarePlanAnswers): boolean {
  return answers.stage != null && NEW_TO_ABA_STAGES.has(answers.stage);
}

const NEW_TO_ABA_STEP_IDS = [
  'gatherPaperwork',
  'confirmCoveragePlan',
  'contactIntake',
  'firstBcbaCall',
  'waitlistAtHome',
] as const;

export function generateNewToAbaSteps(): CarePlanStep[] {
  return NEW_TO_ABA_STEP_IDS.map((id, idx) => {
    const candidate = C[id];
    return {
      id: candidate.id,
      title: candidate.title,
      why: candidate.why,
      href: candidate.href,
      because: 'Because you’re new to ABA and don’t have a provider yet.',
      weight: NEW_TO_ABA_STEP_IDS.length - idx,
      bucket: candidate.bucket,
    };
  });
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
  // Stage gate: new-to-ABA families get the fixed intake-first plan, in
  // order, regardless of bandwidth tier or coverage.
  if (isNewToAbaWithoutProvider(answers)) return generateNewToAbaSteps();

  const scores = buildScores(answers);
  const limit = TIER_STEP_LIMIT[bandwidthTier ?? 'doing-well'];
  if (scores.size === 0) return FALLBACK_STEPS.slice(0, limit);

  const ranked = filterRankedForCoverage(
    Array.from(scores.values()).sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.candidate.title.localeCompare(b.candidate.title);
    }),
    answers,
  );

  return ranked.slice(0, limit).map(({ candidate, weight, reasons }) => ({
    id: candidate.id,
    title: candidate.title,
    why: candidate.why,
    href: candidate.href,
    because: reasons[0], // surface the strongest reason
    weight,
    bucket: candidate.bucket,
    evidence: candidate.evidence,
  }));
}

function filterRankedForCoverage(
  ranked: Score[],
  answers: CarePlanAnswers,
): Score[] {
  const coverage = resolveCoverageStatus(answers);
  return ranked.filter(({ candidate }) => isCandidateAllowed(candidate.id, coverage));
}

function boostArcPool(scores: Map<string, Score>, arcWeek: ArcWeek): void {
  arcWeek.candidateStepIds.forEach((id, idx) => {
    if (!isResolvableCandidateId(id) || !C[id]) return;
    const existing = scores.get(id);
    if (existing) {
      existing.weight += 12 - idx;
    } else {
      add(
        scores,
        C[id],
        12 - idx,
        `Because this week focuses on ${arcWeek.theme.toLowerCase()}.`,
      );
    }
  });
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
  arcWeek?: ArcWeek,
): { bucket: StepBucket; step: CarePlanStep | null }[] {
  const weekArc = arcWeek ?? getArcWeek(answers.stage, 1);
  const scores = buildScores(answers);
  boostArcPool(scores, weekArc);

  const pool = new Set(
    weekArc.candidateStepIds.filter((id) => isResolvableCandidateId(id) && C[id]),
  );

  const ranked = Array.from(scores.values())
    .filter(({ candidate }) => pool.has(candidate.id))
    .sort((a, b) => {
      const ai = weekArc.candidateStepIds.indexOf(a.candidate.id);
      const bi = weekArc.candidateStepIds.indexOf(b.candidate.id);
      if (ai !== bi) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.candidate.title.localeCompare(b.candidate.title);
    });

  const filled = new Map<StepBucket, CarePlanStep>();

  for (const { candidate, weight, reasons } of ranked) {
    if (!isCandidateAllowed(candidate.id, resolveCoverageStatus(answers))) continue;
    const buckets: StepBucket[] = [candidate.bucket, ...(candidate.altBuckets ?? [])];
    for (const b of buckets) {
      if (filled.has(b)) continue;
      filled.set(b, {
        id: candidate.id,
        title: candidate.title,
        why: candidate.why,
        href: candidate.href,
        because: reasons[0],
        weight,
        bucket: b,
        evidence: candidate.evidence,
      });
      break; // each candidate fills at most one bucket
    }
    if (filled.size === BUCKET_ORDER.length) break;
  }

  return BUCKET_ORDER.map((bucket) => ({ bucket, step: filled.get(bucket) ?? null }));
}

// ---------------------------------------------------------------------------
// Week 2 guide — continuation of week 1 (not a fresh path)
// ---------------------------------------------------------------------------

export type ArcWeekGenerationInput = {
  answers: CarePlanAnswers;
  /** Current arc week — supplies theme and candidate pool for sparse fallback. */
  arcWeek: ArcWeek;
  /** Prior week's active steps (week 1 bucket view, or prior generated week). */
  priorWeekSteps: CarePlanStep[];
  /** Candidate ids marked done in the prior week. */
  completedPriorWeekIds: string[];
  /** Rotate support-panel nudge away from last week's thread when possible. */
  lastSupportNudgeThread?: SupportThreadId | null;
};

export type ArcWeekGenerationResult = {
  steps: CarePlanStep[];
  supportNudgeThread: SupportThreadId | null;
};

/** @deprecated Use ArcWeekGenerationInput — week-one field names kept for scripts. */
export type WeekTwoInput = {
  answers: CarePlanAnswers;
  weekOneSteps: CarePlanStep[];
  completedWeekOneIds: string[];
  arcWeek?: ArcWeek;
  lastSupportNudgeThread?: SupportThreadId | null;
};

const WEEK2_TARGET = 5;

type ContinuationRule = { next: string | string[]; tail: string };

/** Unlocked next step after each week-one candidate id. */
const WEEK1_CONTINUATION: Record<string, ContinuationRule> = {
  whatIsAba: {
    next: 'questionsForBCBA',
    tail: 'you understand the basics — these questions help you evaluate any provider.',
  },
  insuranceCall: {
    next: ['shortlistProviders', 'callOneProvider'],
    tail: 'you checked coverage — narrow to providers that fit what you learned.',
  },
  verifyCoverage: {
    next: 'shortlistProviders',
    tail: 'you verified coverage — find providers that match.',
  },
  medicaidWaiver: {
    next: ['hopeForThree', 'findLocal', 'slidingScaleFind'],
    tail: 'you started the waiver process — line up near-term options while you wait.',
  },
  hopeForThree: {
    next: ['slidingScaleFind', 'shortlistProviders'],
    tail: 'you explored grant help — find providers who work with grants or sliding scale.',
  },
  financialGuide: {
    next: ['slidingScaleFind', 'shortlistProviders', 'schoolServicesPath'],
    tail: 'you reviewed what pays for care — pick one route to act on this week.',
  },
  checkCoverageStatus: {
    next: ['financialGuide', 'hopeForThree', 'shortlistProviders'],
    tail: 'you checked what might be covered — pick a next move based on what you learned.',
  },
  findLocal: {
    next: 'shortlistProviders',
    tail: 'you found what is nearby — pick two to call this week.',
  },
  slidingScaleFind: {
    next: 'callOneProvider',
    tail: 'you have affordable options in view — make one call.',
  },
  firstCallQuestions: {
    next: 'callOneProvider',
    tail: 'you prepped your questions — one call puts them to use.',
  },
  questionsForBCBA: {
    next: 'callOneProvider',
    tail: 'you have the questions — call one provider and ask them.',
  },
  shortlistProviders: {
    next: 'callOneProvider',
    tail: 'you have a shortlist — make the first call.',
  },
  callOneProvider: {
    next: 'trackNotes',
    tail: 'you made contact — jot what you learned before it fades.',
  },
  compareThree: {
    next: 'callOneProvider',
    tail: 'you compared options — call your top choice.',
  },
  documentHard: {
    next: 'questionsForBCBA',
    tail: 'you noted what is hard at home — bring those examples to a provider call.',
  },
  homeStrategy: {
    next: 'documentHard',
    tail: 'you tried something at home — write down what worked for your next conversation.',
  },
  fourMinutes: {
    next: 'homeStrategy',
    tail: 'you took a breath — one small home strategy builds on that.',
  },
  schoolServicesPath: {
    next: 'iepPrep',
    tail: 'you looked at school services — prep for the meeting that makes them real.',
  },
  iepPrep: {
    next: 'parentAdvocate',
    tail: 'you prepped for school — consider an advocate in the room with you.',
  },
  mchat: {
    next: 'devPed',
    tail: 'you asked about screening — a developmental pediatrician is the next evaluation step.',
  },
  devPed: {
    next: 'whatIsAba',
    tail: 'you lined up evaluation — understanding ABA helps you plan ahead.',
  },
  trackNotes: {
    next: 'compareThree',
    tail: 'you captured notes — compare your top options side by side.',
  },
  meltdownNow: {
    next: 'homeStrategy',
    tail: 'you got through a hard moment — one proactive home strategy helps next time.',
  },
  parentMatch: {
    next: 'smallGroups',
    tail: 'you reached toward connection — a small group can deepen it.',
  },
};

const WEEK2_BUCKETS: StepBucket[] = [
  'do-today',
  'ask-bcba',
  'try-home',
  'save-resource',
  'ask-bcba',
];

/** Sparse fallback — current arc week's pool (coverage filters financial ids only). */
function buildArcBackbone(arcWeek: ArcWeek, coverage: CoverageStatus): string[] {
  return arcWeek.candidateStepIds.filter(
    (id) =>
      isResolvableCandidateId(id) &&
      C[id] &&
      isCandidateAllowed(id, coverage),
  );
}

/** Completion ids that exist in this plan's week-one steps AND were marked done. */
export function verifiedCompletedWeekOneIds(
  weekOneSteps: CarePlanStep[],
  completedIds: string[],
): string[] {
  const weekOneIds = new Set(weekOneSteps.map(stepId));
  return completedIds.filter((id) => weekOneIds.has(id));
}

/** Layer-2 only: "Because you finished …" when the trigger step is in this plan and done. */
export function formatContinuationBecause(
  completedId: string,
  weekOneSteps: CarePlanStep[],
  completedIds: string[],
  tail: string,
): string | null {
  if (!verifiedCompletedWeekOneIds(weekOneSteps, completedIds).includes(completedId)) {
    return null;
  }
  const title = titleForId(completedId, weekOneSteps);
  return `Because you finished “${title}” — ${tail}`;
}

/** Matches layer-2 copy: Because you finished “{title}” — … (unicode outer quotes). */
const FINISHED_BECAUSE_RE = /Because you finished “(.+?)” — /;

/**
 * Guard: every "Because you finished …" line must cite a week-one step that
 * exists in this plan and was marked done. Returns error messages (empty = ok).
 */
export function validateWeekTwoBecauseCopy(
  steps: CarePlanStep[],
  weekOneSteps: CarePlanStep[],
  completedIds: string[],
): string[] {
  const verified = new Set(verifiedCompletedWeekOneIds(weekOneSteps, completedIds));
  const errors: string[] = [];

  for (const step of steps) {
    const because = step.because ?? '';
    if (!FINISHED_BECAUSE_RE.test(because)) continue;

    const matchesVerified = [...verified].some((completedId) => {
      const rule = WEEK1_CONTINUATION[completedId];
      if (!rule) return false;
      const expected = formatContinuationBecause(
        completedId,
        weekOneSteps,
        completedIds,
        rule.tail,
      );
      return expected === because;
    });

    if (!matchesVerified) {
      const cited = because.match(FINISHED_BECAUSE_RE)?.[1] ?? 'unknown';
      errors.push(
        `"${step.title}" cites finished step "${cited}" but it is not a verified week-1 completion in this plan`,
      );
    }
  }
  return errors;
}

function stepId(step: CarePlanStep): string {
  return step.id ?? step.title;
}

function titleForId(id: string, weekOneSteps: CarePlanStep[]): string {
  const fromWeek = weekOneSteps.find((s) => stepId(s) === id);
  return fromWeek?.title ?? C[id]?.title ?? id;
}

function pickNextId(rule: ContinuationRule, completed: Set<string>, seen: Set<string>): string | null {
  const options = Array.isArray(rule.next) ? rule.next : [rule.next];
  for (const id of options) {
    if (completed.has(id) || seen.has(id)) continue;
    if (!C[id]) continue;
    return id;
  }
  return null;
}

function candidateToWeekTwoStep(
  candidate: Candidate,
  because: string,
  bucket: StepBucket,
): CarePlanStep {
  return {
    id: candidate.id,
    title: candidate.title,
    why: candidate.why,
    href: candidate.href,
    because,
    bucket,
    evidence: candidate.evidence,
  };
}

function adaptCarryForwardStep(step: CarePlanStep, coverage: CoverageStatus): CarePlanStep | null {
  const id = stepId(step);
  const defaultBecause =
    step.because ?? 'Still on your list from last week — finish when you have bandwidth.';

  if (isAllowedForCoverage(id, coverage)) {
    return { ...step, because: defaultBecause };
  }

  // Uninsured / not-sure families should not see private-insurance carry-forwards.
  const swapId =
    id === 'insuranceCall' || id === 'verifyCoverage'
      ? coverage === 'medicaid-waiver'
        ? 'medicaidWaiver'
        : 'hopeForThree'
      : null;
  if (!swapId || !C[swapId]) return null;

  return candidateToWeekTwoStep(
    C[swapId],
    'Because paying for care is still on your list — this path does not require private insurance.',
    step.bucket ?? 'do-today',
  );
}

/**
 * Arc week assembly (week 2+):
 *   Layer 1 — carry forward incomplete prior-week steps (swap insurance-only when needed)
 *   Layer 2 — unlocked continuations (verified completions only; "Because you finished…")
 *   Layer 3 — rotating support-panel nudge (non-completion copy; eligible threads only)
 *   Layer 4 — sparse-fallback from current arc week's candidate pool
 *
 * 5-step cap retention priority (what survives when space runs out):
 *   (a) ≥1 continuation when any verified prior-week completion exists
 *   (b) carry-forward incomplete steps
 *   (c) support nudge
 *   (d) remaining continuations
 *   (e) sparse-fallback from arc pool
 *
 * Display order after merge: carry → continuations → nudge → fallback.
 */
function mergeWeekTwoWithCap(
  carry: CarePlanStep[],
  continuations: CarePlanStep[],
  nudge: CarePlanStep | null,
  fallback: CarePlanStep[],
  hasVerifiedCompletions: boolean,
): CarePlanStep[] {
  const selected: CarePlanStep[] = [];
  const seen = new Set<string>();

  const addSteps = (steps: CarePlanStep[]) => {
    for (const step of steps) {
      if (selected.length >= WEEK2_TARGET) return;
      const id = stepId(step);
      if (seen.has(id)) continue;
      seen.add(id);
      selected.push(step);
    }
  };

  if (hasVerifiedCompletions && continuations.length > 0) {
    addSteps([continuations[0]]);
  }
  addSteps(carry);
  if (nudge) addSteps([nudge]);
  addSteps(hasVerifiedCompletions ? continuations.slice(1) : continuations);
  addSteps(fallback);

  const carryIds = new Set(carry.map(stepId));
  const contIds = new Set(continuations.map(stepId));
  const nudgeId = nudge ? stepId(nudge) : null;
  const fallbackIds = new Set(fallback.map(stepId));

  const displayRank = (step: CarePlanStep): number => {
    const id = stepId(step);
    if (carryIds.has(id)) return 0;
    if (contIds.has(id)) return 1;
    if (nudgeId === id) return 2;
    if (fallbackIds.has(id)) return 3;
    return 4;
  };

  return selected.sort((a, b) => displayRank(a) - displayRank(b));
}

export function generateArcWeekSteps(
  input: ArcWeekGenerationInput,
): ArcWeekGenerationResult {
  const completed = new Set(input.completedPriorWeekIds);
  const verifiedIds = verifiedCompletedWeekOneIds(
    input.priorWeekSteps,
    input.completedPriorWeekIds,
  );
  const coverage = resolveCoverageStatus(input.answers);
  const buildSeen = new Set<string>();

  const carry: CarePlanStep[] = [];
  for (const step of input.priorWeekSteps) {
    const id = stepId(step);
    if (completed.has(id)) continue;
    const adapted = adaptCarryForwardStep(step, coverage);
    if (!adapted) continue;
    const adaptedId = stepId(adapted);
    if (buildSeen.has(adaptedId) || completed.has(adaptedId)) continue;
    buildSeen.add(adaptedId);
    carry.push(adapted);
  }

  const continuations: CarePlanStep[] = [];
  for (const completedId of verifiedIds) {
    const rule = WEEK1_CONTINUATION[completedId];
    if (!rule) continue;
    const nextId = pickNextId(rule, completed, buildSeen);
    if (!nextId || !isAllowedForCoverage(nextId, coverage)) continue;
    const because = formatContinuationBecause(
      completedId,
      input.priorWeekSteps,
      input.completedPriorWeekIds,
      rule.tail,
    );
    if (!because) continue;
    const candidate = C[nextId];
    if (!candidate) continue;
    buildSeen.add(nextId);
    continuations.push(
      candidateToWeekTwoStep(
        candidate,
        because,
        WEEK2_BUCKETS[continuations.length % WEEK2_BUCKETS.length],
      ),
    );
  }

  let supportNudgeThread: SupportThreadId | null = null;
  let nudge: CarePlanStep | null = null;
  const previewIds = new Set([...carry, ...continuations].map(stepId));
  const nudgeThread = pickSupportNudgeThread(
    input.answers,
    input.lastSupportNudgeThread,
  );
  if (nudgeThread) {
    const nudgeCandidateId = getSupportNudgeCandidateId(nudgeThread);
    if (
      !previewIds.has(nudgeCandidateId) &&
      !completed.has(nudgeCandidateId) &&
      !buildSeen.has(nudgeCandidateId) &&
      C[nudgeCandidateId]
    ) {
      supportNudgeThread = nudgeThread;
      nudge = candidateToWeekTwoStep(
        C[nudgeCandidateId],
        getSupportNudgeCopy(nudgeThread),
        'try-home',
      );
      buildSeen.add(nudgeCandidateId);
    }
  }

  const sparse =
    verifiedIds.length < 2 ||
    continuations.length < 2 ||
    carry.length + continuations.length + (nudge ? 1 : 0) < 3;

  const fallback: CarePlanStep[] = [];
  if (sparse) {
    for (const candidateId of buildArcBackbone(input.arcWeek, coverage)) {
      if (completed.has(candidateId) || buildSeen.has(candidateId)) continue;
      if (!isAllowedForCoverage(candidateId, coverage)) continue;
      const candidate = C[candidateId];
      if (!candidate) continue;
      buildSeen.add(candidateId);
      fallback.push(
        candidateToWeekTwoStep(
          candidate,
          `Because this week focuses on ${input.arcWeek.theme.toLowerCase()}.`,
          WEEK2_BUCKETS[fallback.length % WEEK2_BUCKETS.length],
        ),
      );
    }
  }

  const merged = mergeWeekTwoWithCap(
    carry,
    continuations,
    nudge,
    fallback,
    verifiedIds.length > 0,
  );

  // Dev-only regression guard: every "Because you finished …" line on real
  // generated output must cite a verified prior-week completion. Stripped in
  // production (process.env.NODE_ENV) so it can never throw for a parent.
  if (process.env.NODE_ENV !== 'production') {
    const errors = validateWeekTwoBecauseCopy(
      merged,
      input.priorWeekSteps,
      input.completedPriorWeekIds,
    );
    if (errors.length) {
      throw new Error(
        `generateArcWeekSteps emitted false "Because you finished …" copy:\n  - ${errors.join('\n  - ')}`,
      );
    }
  }

  return { steps: merged, supportNudgeThread };
}

/** Week 2+ steps — continuation engine on the current arc week's pool. */
export function generateWeekTwoSteps(input: WeekTwoInput): CarePlanStep[] {
  const arcWeek =
    input.arcWeek ?? getArcWeek(input.answers.stage, 2);
  return generateArcWeekSteps({
    answers: input.answers,
    arcWeek,
    priorWeekSteps: input.weekOneSteps,
    completedPriorWeekIds: input.completedWeekOneIds,
    lastSupportNudgeThread: input.lastSupportNudgeThread,
  }).steps;
}

/** Intro copy for the week-two unlock banner on the care plan page. */
export function getWeekTwoGuideIntro(answers: CarePlanAnswers): {
  title: string;
  body: string;
} {
  const coverage = resolveCoverageStatus(answers);

  switch (answers.stage) {
    case 'waiting-diagnosis':
      return {
        title: 'Week 2: While you wait for a diagnosis',
        body: 'You handled the grounding work. This week continues what you started — evaluation steps, understanding ABA, and lining up options for when you are ready.',
      };
    case 'looking-for-aba':
      return {
        title: 'Week 2: Choosing the right provider',
        body: 'Week one is done. This week builds on that — comparing providers, preparing for calls, and tracking what you learn until you have a fit.',
      };
    case 'in-aba':
      return {
        title: 'Week 2: Making therapy work for your family',
        body: 'You are already in services. This week continues with partnering with your BCBA, home examples, and what is working.',
      };
    case 'past-aba':
      return {
        title: 'Week 2: Parenting onward',
        body: 'Week one is done. This week continues with connection, practical tools, and support that fits life after intensive therapy.',
      };
    case 'newly-diagnosed':
    default:
      if (coverage === 'uninsured-self-pay' || coverage === 'not-sure') {
        return {
          title: 'Week 2: Getting into ABA',
          body: 'Last week was grounding. This week continues your path — grants, sliding-scale options, school services, and your first provider calls, without assuming you have insurance.',
        };
      }
      if (coverage === 'medicaid-waiver') {
        return {
          title: 'Week 2: Getting into ABA',
          body: 'Last week was grounding. This week continues with Medicaid and waiver steps, provider calls, and questions to ask — building on what you already finished.',
        };
      }
      return {
        title: 'Week 2: Getting into ABA',
        body: 'Last week was grounding and understanding. This week continues with coverage checks, picking a provider, and making your first call.',
      };
  }
}

// ---------------------------------------------------------------------------
// Resources, mood message, summary
// ---------------------------------------------------------------------------

const FALLBACK_STEPS: CarePlanStep[] = [
  {
    id: 'parentMatch',
    title: 'Build a parent match',
    why: 'A good place to start: it pairs you with another Texas parent who has been through ABA, someone to message on your own timing so you’re not navigating this alone.',
    href: '/support/connect',
    evidence: C.parentMatch.evidence,
  },
  {
    id: 'practicalGuides',
    title: 'Pick one small thing to try at home',
    why: 'Browse practical, at-home guides and choose just one thing to try this week — a single small step rather than a long list to tackle.',
    href: '/support/resources',
  },
  {
    id: 'findLocal',
    title: 'Find local help in your area',
    why: 'Search local ABA centers and support services filtered by your insurance, so you can see what’s actually available near you.',
    href: '/support/find',
  },
];

const FALLBACK_RESOURCES: CarePlanResource[] = [
  { label: RESOURCE_HUB_LABEL, href: '/support/resources' },
  { label: 'Find Local Help', href: '/support/find' },
  { label: 'Connect with parents', href: '/support/connect' },
  { label: 'What is ABA?', href: '/support/what-is-aba' },
];

export function generateResources(answers: CarePlanAnswers): CarePlanResource[] {
  const picks: CarePlanResource[] = [];
  const add = (r: CarePlanResource) => {
    if (!picks.find((p) => p.href === r.href)) picks.push(r);
  };

  const hardest = answers.hardest ?? [];
  if (hardest.includes('financial-insurance')) add({ label: 'Financial help', href: '/support/financial', because: 'Picked because financial pressure is on your list.' });
  if (hardest.includes('overwhelmed')) add({ label: 'Connect with parents', href: '/support/connect', because: 'Picked because you said you’re overwhelmed.' });
  if (hardest.includes('connecting-parents')) add({ label: 'Connect with parents', href: '/support/connect', because: 'Picked because connection is on your list.' });
  if (hardest.includes('siblings')) add({ label: 'Sibling support', href: '/support/siblings', because: 'Picked because siblings are on your list.' });
  if (hardest.includes('school-iep')) add({ label: 'IEP / school guides', href: '/support/resources', because: 'Picked because school is on your list.' });
  if (hardest.includes('understanding-aba')) add({ label: 'What is ABA?', href: '/support/what-is-aba', because: 'Picked because understanding ABA is on your list.' });
  if (answers.stage === 'looking-for-aba' || answers.stage === 'newly-diagnosed') {
    add({ label: 'Find local help', href: '/support/find', because: 'Picked because of where you are right now.' });
  }
  const helpKinds = answers.helpKinds && answers.helpKinds.length
    ? answers.helpKinds
    : answers.helpKind
      ? [answers.helpKind]
      : [];
  if (helpKinds.includes('someone-to-talk-to')) add({ label: 'Connect with parents', href: '/support/connect', because: 'Picked because you said you want someone to talk to.' });

  const { matches } = parseNotes(answers.notes ?? '');
  for (const m of matches) {
    add({ label: m.candidate.title, href: m.candidate.href, because: m.because });
  }

  // Surface parent connection so the relationship layer stays visible.
  add({ label: 'Connect with other parents', href: '/support/connect' });

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
      return 'This week sounds heavy. One small step is enough — the rest of the plan can wait.';
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

/** Fill in generator fields missing from older saved plans (evidence, therapist URL). */
export function enrichCarePlanStep(step: CarePlanStep): CarePlanStep {
  const candidate = Object.values(C).find(
    (c) => c.id === step.id || c.title === step.title,
  );
  if (!candidate) return step;
  return {
    ...step,
    id: step.id ?? candidate.id,
    href: candidate.id === 'parentTherapist' ? candidate.href : step.href,
    evidence: step.evidence ?? candidate.evidence,
  };
}
