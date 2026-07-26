import type {
  CoverageStatus,
  Hardest,
  HelpKind,
  Stage,
} from './carePlanStorage';

export type IntakeInterpretationRequest = {
  stage: Stage;
  hardest: Hardest[];
  parentContext: string;
};

export type IntakeInterpretation = {
  summary: string;
  whatAlreadyTried: string | null;
  currentBarrier: string | null;
  desiredOutcome: string | null;
  coverageStatus: CoverageStatus | null;
  hasOtherChildren: boolean | null;
  hasPartner: boolean | null;
  helpKinds: HelpKind[];
  requiresHumanSupport: boolean;
  humanSupportReason: string | null;
  source: 'ai' | 'bounded-fallback';
};

export type MissingIntakeField =
  | 'coverageStatus'
  | 'hasOtherChildren'
  | 'hasPartner'
  | 'helpKinds';

export const COVERAGE_VALUES: CoverageStatus[] = [
  'private-insurance',
  'medicaid-waiver',
  'uninsured-self-pay',
  'not-sure',
];

export const HELP_KIND_VALUES: HelpKind[] = [
  'practical-info',
  'local-providers',
  'someone-to-talk-to',
  'time-for-me',
  'not-sure',
];

export const INTAKE_INTERPRETATION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: { type: 'string', minLength: 1, maxLength: 500 },
    whatAlreadyTried: { type: ['string', 'null'], maxLength: 350 },
    currentBarrier: { type: ['string', 'null'], maxLength: 350 },
    desiredOutcome: { type: ['string', 'null'], maxLength: 350 },
    coverageStatus: {
      type: ['string', 'null'],
      enum: [...COVERAGE_VALUES, null],
    },
    hasOtherChildren: { type: ['boolean', 'null'] },
    hasPartner: { type: ['boolean', 'null'] },
    helpKinds: {
      type: 'array',
      maxItems: 5,
      uniqueItems: true,
      items: { type: 'string', enum: HELP_KIND_VALUES },
    },
    requiresHumanSupport: { type: 'boolean' },
    humanSupportReason: { type: ['string', 'null'], maxLength: 250 },
  },
  required: [
    'summary',
    'whatAlreadyTried',
    'currentBarrier',
    'desiredOutcome',
    'coverageStatus',
    'hasOtherChildren',
    'hasPartner',
    'helpKinds',
    'requiresHumanSupport',
    'humanSupportReason',
  ],
} as const;

const HUMAN_SUPPORT_PATTERN =
  /\b(immediate danger|not safe|cannot keep (him|her|them|my child|us|myself) safe|suicid|kill myself|kill him|kill her|kill them|homicid|medical emergency|serious injury|abuse|neglect)\b/i;

function firstSentence(text: string): string {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (!compact) return '';
  const match = compact.match(/^(.{1,360}?[.!?])(?:\s|$)/);
  return (match?.[1] ?? compact.slice(0, 360)).trim();
}

function inferCoverage(text: string): CoverageStatus | null {
  if (/\b(private insurance|employer plan|commercial insurance|blue cross|bcbs|united healthcare|uhc|aetna|cigna|humana)\b/i.test(text)) {
    return 'private-insurance';
  }
  if (/\b(medicaid|chip|waiver|hcs|txhml)\b/i.test(text)) return 'medicaid-waiver';
  if (/\b(no insurance|uninsured|self[- ]pay|out of pocket)\b/i.test(text)) {
    return 'uninsured-self-pay';
  }
  if (/\b(not sure (what|which) insurance|don'?t know (what|which) insurance)\b/i.test(text)) {
    return 'not-sure';
  }
  return null;
}

function inferHelpKinds(text: string, hardest: Hardest[]): HelpKind[] {
  const kinds = new Set<HelpKind>();
  if (/\b(guide|information|understand|learn|what is|how do i|strategy|steps?)\b/i.test(text)) {
    kinds.add('practical-info');
  }
  if (/\b(provider|clinic|center|waitlist|near me|local|find aba|looking for aba)\b/i.test(text)) {
    kinds.add('local-providers');
  }
  if (/\b(talk to|someone to talk|other parent|parent support|alone|isolated|connection)\b/i.test(text)) {
    kinds.add('someone-to-talk-to');
  }
  if (/\b(overwhelmed|burned? out|exhausted|need a break|time for me|mental health|anxious)\b/i.test(text)) {
    kinds.add('time-for-me');
  }

  if (hardest.includes('finding-resources')) kinds.add('local-providers');
  if (hardest.includes('understanding-aba') || hardest.includes('behavior-home') || hardest.includes('school-iep')) {
    kinds.add('practical-info');
  }
  if (hardest.includes('connecting-parents')) kinds.add('someone-to-talk-to');
  if (hardest.includes('overwhelmed')) kinds.add('time-for-me');

  return [...kinds];
}

export function buildBoundedFallbackInterpretation(
  input: IntakeInterpretationRequest,
): IntakeInterpretation {
  const text = input.parentContext.trim();
  const requiresHumanSupport = HUMAN_SUPPORT_PATTERN.test(text);

  const whatAlreadyTriedMatch = text.match(
    /(?:i|we|we've|we have|i've|i have)\s+(?:already\s+)?(?:tried|called|contacted|asked|submitted|applied|started|completed)\b[^.!?]{0,220}/i,
  );
  const barrierMatch = text.match(
    /(?:but|however|stuck|waiting|can'?t|cannot|don'?t know|unsure|confused|hardest|problem is)\b[^.!?]{0,220}/i,
  );
  const outcomeMatch = text.match(
    /(?:i|we)\s+(?:want|need|hope|am trying|are trying|would like)\b[^.!?]{0,220}/i,
  );

  return {
    summary:
      firstSentence(text) ||
      'You shared a family concern and want Common Ground to organize the next step.',
    whatAlreadyTried: whatAlreadyTriedMatch?.[0]?.trim() ?? null,
    currentBarrier: barrierMatch?.[0]?.trim() ?? null,
    desiredOutcome: outcomeMatch?.[0]?.trim() ?? null,
    coverageStatus: inferCoverage(text),
    hasOtherChildren: /\b(other children|other kids|sibling|brother|sister)\b/i.test(text)
      ? true
      : null,
    hasPartner: /\b(my partner|my spouse|husband|wife|co-parent|coparent)\b/i.test(text)
      ? true
      : null,
    helpKinds: inferHelpKinds(text, input.hardest),
    requiresHumanSupport,
    humanSupportReason: requiresHumanSupport
      ? 'Your description may involve an immediate safety concern that should not be routed through a self-guided plan.'
      : null,
    source: 'bounded-fallback',
  };
}

function validCoverage(value: unknown): CoverageStatus | null {
  return typeof value === 'string' && COVERAGE_VALUES.includes(value as CoverageStatus)
    ? (value as CoverageStatus)
    : null;
}

function validHelpKinds(value: unknown): HelpKind[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(
    (item): item is HelpKind =>
      typeof item === 'string' && HELP_KIND_VALUES.includes(item as HelpKind),
  ))];
}

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
  return cleaned || null;
}

export function normalizeInterpretation(
  value: unknown,
  fallback: IntakeInterpretation,
): IntakeInterpretation {
  if (!value || typeof value !== 'object') return fallback;
  const raw = value as Record<string, unknown>;

  const summary = cleanText(raw.summary, 500) ?? fallback.summary;
  const requiresHumanSupport =
    raw.requiresHumanSupport === true || fallback.requiresHumanSupport;

  return {
    summary,
    whatAlreadyTried:
      cleanText(raw.whatAlreadyTried, 350) ?? fallback.whatAlreadyTried,
    currentBarrier: cleanText(raw.currentBarrier, 350) ?? fallback.currentBarrier,
    desiredOutcome: cleanText(raw.desiredOutcome, 350) ?? fallback.desiredOutcome,
    coverageStatus: validCoverage(raw.coverageStatus) ?? fallback.coverageStatus,
    hasOtherChildren:
      typeof raw.hasOtherChildren === 'boolean'
        ? raw.hasOtherChildren
        : fallback.hasOtherChildren,
    hasPartner:
      typeof raw.hasPartner === 'boolean' ? raw.hasPartner : fallback.hasPartner,
    helpKinds: validHelpKinds(raw.helpKinds).length
      ? validHelpKinds(raw.helpKinds)
      : fallback.helpKinds,
    requiresHumanSupport,
    humanSupportReason: requiresHumanSupport
      ? cleanText(raw.humanSupportReason, 250) ?? fallback.humanSupportReason
      : null,
    source: 'ai',
  };
}

export function getMissingIntakeFields(
  interpretation: IntakeInterpretation,
): MissingIntakeField[] {
  const missing: MissingIntakeField[] = [];
  if (!interpretation.coverageStatus) missing.push('coverageStatus');
  if (interpretation.hasOtherChildren === null) missing.push('hasOtherChildren');
  if (interpretation.hasPartner === null) missing.push('hasPartner');
  if (interpretation.helpKinds.length === 0) missing.push('helpKinds');
  return missing;
}
