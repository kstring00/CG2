import type { CarePlanAnswers, Hardest } from '@/lib/carePlanStorage';

export const NOW_ACTIONS = {
  'protect-safety':
    'Start with immediate safety. Use any safety or crisis procedures already provided by your Texas ABA Centers team.',
  'use-current-plan':
    'Follow the response your BCBA has already taught you. Do not create a new consequence or behavior plan during a hard moment.',
  'slow-your-response':
    'Use the shortest clear language you can remember, then pause long enough to slow your own response before adding more.',
  'ask-for-backup':
    'If another prepared caregiver is available, decide in advance how you will ask them to step in.',
  'record-afterward':
    'Once everyone is safe, write down what happened while the details are still fresh.',
  'choose-one-goal':
    'Choose one manageable goal for today instead of trying to solve every part of the problem at once.',
  'write-one-question':
    'Write down the one question you most need answered before your next BCBA conversation.',
  'open-one-guide':
    'Open one relevant Common Ground guide and focus on one practical takeaway.',
} as const;

export const PREPARE_ACTIONS = {
  'keep-plan-visible':
    'Keep the current written guidance or safety plan somewhere easy to access.',
  'define-first-steps':
    'Ask your BCBA to identify the first one or two steps to use when the situation begins.',
  'practice-with-bcba':
    'Practice the response with your BCBA before you need it during a difficult moment.',
  'prepare-environment':
    'Ask your BCBA whether any safe environmental preparation would be appropriate for your home.',
  'align-caregivers':
    'Make sure the adults who respond understand the same approved plan.',
  'prepare-meeting':
    'Prepare your questions before the meeting so the most important concern is addressed first.',
  'make-steps-simple':
    'Ask for the plan in a short, plain-language sequence that is realistic to follow at home.',
} as const;

export const OBSERVATION_PROMPTS = {
  'what-happened-before': 'What was happening immediately before the concern began?',
  'what-you-saw': 'What could you see or hear, using specific actions instead of labels?',
  'where-and-when': 'Where and when does it usually happen?',
  'how-long': 'About how long did it last?',
  'adult-response': 'How did the adults respond?',
  'what-changed-after': 'What changed immediately after the situation?',
  'what-helped': 'What appeared to help the situation become more manageable?',
  'safety-impact': 'Was anyone at risk of being hurt or leaving a safe area?',
  'change-over-time': 'Is this new, increasing, or meaningfully different from before?',
} as const;

export const CAREGIVER_SUPPORT = {
  'brief-recovery':
    'After the situation is safe, take a brief recovery period before trying to solve the entire problem.',
  'reduce-own-load':
    'Identify one nonessential demand you can remove from your own day when your capacity is low.',
  'ask-specific-help':
    'Tell a trusted person exactly what kind of help would be useful: listening, relief, transportation, or another practical task.',
  'use-meeting-guide':
    'Use the meeting guide so you do not have to hold every detail in your head.',
  'mental-health-support':
    'If overwhelm is persistent or affecting your ability to function, consider speaking with a licensed mental-health professional.',
  'notice-progress':
    'Record one thing that became clearer or more manageable, even if the larger concern is not solved yet.',
  'name-the-hardest-part':
    'Name the single part that is costing you the most energy so your support request can be specific.',
} as const;

export const BCBA_QUESTIONS = {
  'patterns-to-watch': 'What patterns would be most useful for me to watch for at home?',
  'first-signs': 'What should I do when I first notice this situation beginning?',
  'written-sequence': 'Can you give me the response in a short written sequence I can follow at home?',
  'model-and-practice': 'Can you model the strategy and then watch me practice it?',
  'home-fit': 'How should the clinic strategy be applied within our home routine?',
  'what-to-avoid': 'Is there anything I may be doing that could unintentionally make the situation harder?',
  'how-to-measure': 'How will we know whether the home strategy is helping?',
  'when-to-contact': 'What changes or safety concerns should lead me to contact you before our next meeting?',
  'other-caregivers': 'How should other caregivers respond so we are consistent?',
  'expected-or-review': 'Is what I am describing expected at this point, or does the plan need to be reviewed?',
  'implementation-support':
    'What support can the team provide if I understand the plan but cannot use it consistently at home?',
  'first-priority': 'What is the single most important thing for me to focus on first?',
  'explain-simply': 'Can you explain why this strategy is being used in plain language?',
} as const;

export const CONTACT_TEAM_REASONS = {
  'cannot-maintain-safety': 'You cannot safely manage the situation with the current plan.',
  'new-or-increasing': 'The behavior is new, more intense, more frequent, or meaningfully different.',
  'plan-is-unclear': 'You are unsure what the current plan asks you to do.',
  'hard-to-use-at-home': 'You have tried the approved strategy and cannot use it consistently at home.',
  'medical-concern':
    'There may be an injury, medical issue, or medication concern. Contact the appropriate medical professional.',
  'immediate-danger':
    'There is immediate danger or someone may be harmed. Use emergency or crisis resources rather than waiting for the next meeting.',
} as const;

export type NowActionId = keyof typeof NOW_ACTIONS;
export type PrepareActionId = keyof typeof PREPARE_ACTIONS;
export type ObservationPromptId = keyof typeof OBSERVATION_PROMPTS;
export type CaregiverSupportId = keyof typeof CAREGIVER_SUPPORT;
export type BCBAQuestionId = keyof typeof BCBA_QUESTIONS;
export type ContactTeamReasonId = keyof typeof CONTACT_TEAM_REASONS;

export type ParentSupportPrimaryNeed =
  | 'prepare-for-home'
  | 'understand-what-is-happening'
  | 'caregiver-wellbeing'
  | 'prepare-for-bcba'
  | 'safety-support';

export type ParentSupportPlanSelection = {
  reflection: string;
  primaryNeed: ParentSupportPrimaryNeed;
  nowActionIds: NowActionId[];
  prepareActionIds: PrepareActionId[];
  observationPromptIds: ObservationPromptId[];
  caregiverSupportIds: CaregiverSupportId[];
  bcbaQuestionIds: BCBAQuestionId[];
  contactTeamReasonIds: ContactTeamReasonId[];
  safetyEscalation: boolean;
};

export type MaterializedParentSupportPlan = {
  reflection: string;
  primaryNeed: ParentSupportPrimaryNeed;
  nowActions: string[];
  prepareActions: string[];
  observationPrompts: string[];
  caregiverSupport: string[];
  bcbaQuestions: string[];
  contactTeamReasons: string[];
  safetyEscalation: boolean;
};

const PRIMARY_NEED_LABELS: Record<ParentSupportPrimaryNeed, string> = {
  'prepare-for-home': 'Feel more prepared for difficult moments at home',
  'understand-what-is-happening': 'Understand what to notice and bring to the clinical team',
  'caregiver-wellbeing': 'Protect your own capacity and well-being',
  'prepare-for-bcba': 'Prepare for a clearer, more useful BCBA conversation',
  'safety-support': 'Clarify safety needs and when to contact the team',
};

export function getPrimaryNeedLabel(need: ParentSupportPrimaryNeed): string {
  return PRIMARY_NEED_LABELS[need];
}

function hasConcern(answers: CarePlanAnswers, concern: Hardest): boolean {
  return Array.isArray(answers.hardest) && answers.hardest.includes(concern);
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function takeValid<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T[],
  max: number,
): T[] {
  if (!Array.isArray(value)) return fallback.slice(0, max);
  const allowedSet = new Set<string>(allowed);
  const valid = unique(
    value.filter((item): item is T => typeof item === 'string' && allowedSet.has(item)),
  );
  return valid.length ? valid.slice(0, max) : fallback.slice(0, max);
}

export function buildFallbackParentSupportPlan(
  answers: CarePlanAnswers,
): ParentSupportPlanSelection {
  const behaviorHome = hasConcern(answers, 'behavior-home');
  const overwhelmed = hasConcern(answers, 'overwhelmed');
  const understanding = hasConcern(answers, 'understanding-aba');
  const school = hasConcern(answers, 'school-iep');
  const refinement = (answers.support ?? '').toLowerCase();
  const safetyLanguage = /unsafe|danger|hurt|injur|elop|run away|climb|jump from|crisis/.test(
    `${answers.notes ?? ''} ${answers.support ?? ''}`.toLowerCase(),
  );

  let primaryNeed: ParentSupportPrimaryNeed = 'prepare-for-home';
  if (safetyLanguage) primaryNeed = 'safety-support';
  else if (overwhelmed || refinement.includes('support for me')) primaryNeed = 'caregiver-wellbeing';
  else if (understanding) primaryNeed = 'understand-what-is-happening';
  else if (refinement.includes('bcba')) primaryNeed = 'prepare-for-bcba';

  const nowActionIds: NowActionId[] = behaviorHome
    ? ['protect-safety', 'use-current-plan', 'slow-your-response', 'record-afterward']
    : overwhelmed
      ? ['choose-one-goal', 'write-one-question', 'ask-for-backup', 'open-one-guide']
      : ['choose-one-goal', 'write-one-question', 'open-one-guide'];

  const prepareActionIds: PrepareActionId[] = behaviorHome
    ? ['keep-plan-visible', 'define-first-steps', 'practice-with-bcba', 'align-caregivers']
    : understanding || school
      ? ['prepare-meeting', 'make-steps-simple', 'practice-with-bcba']
      : ['prepare-meeting', 'make-steps-simple', 'align-caregivers'];

  const observationPromptIds: ObservationPromptId[] = behaviorHome
    ? [
        'what-happened-before',
        'what-you-saw',
        'adult-response',
        'what-helped',
        'safety-impact',
      ]
    : ['where-and-when', 'what-happened-before', 'what-changed-after', 'change-over-time'];

  const caregiverSupportIds: CaregiverSupportId[] = overwhelmed
    ? ['brief-recovery', 'reduce-own-load', 'ask-specific-help', 'mental-health-support']
    : ['use-meeting-guide', 'name-the-hardest-part', 'brief-recovery', 'notice-progress'];

  const bcbaQuestionIds: BCBAQuestionId[] = behaviorHome
    ? [
        'patterns-to-watch',
        'first-signs',
        'written-sequence',
        'model-and-practice',
        'when-to-contact',
        'first-priority',
      ]
    : understanding
      ? [
          'explain-simply',
          'home-fit',
          'written-sequence',
          'model-and-practice',
          'how-to-measure',
          'first-priority',
        ]
      : [
          'first-priority',
          'written-sequence',
          'implementation-support',
          'how-to-measure',
          'when-to-contact',
        ];

  const contactTeamReasonIds: ContactTeamReasonId[] = safetyLanguage
    ? ['cannot-maintain-safety', 'new-or-increasing', 'immediate-danger']
    : ['plan-is-unclear', 'hard-to-use-at-home', 'new-or-increasing'];

  const reflection = answers.notes?.trim()
    ? 'You are looking for practical support that helps you respond with more clarity, protect your own capacity, and arrive at your next BCBA conversation prepared.'
    : 'This plan is designed to give you one clear place to prepare, notice what matters, care for yourself, and decide what to ask your BCBA.';

  return {
    reflection,
    primaryNeed,
    nowActionIds,
    prepareActionIds,
    observationPromptIds,
    caregiverSupportIds,
    bcbaQuestionIds,
    contactTeamReasonIds,
    safetyEscalation: safetyLanguage,
  };
}

export function normalizeParentSupportPlan(
  value: unknown,
  fallback: ParentSupportPlanSelection,
): ParentSupportPlanSelection {
  if (!value || typeof value !== 'object') return fallback;
  const raw = value as Record<string, unknown>;
  const primaryNeeds: ParentSupportPrimaryNeed[] = [
    'prepare-for-home',
    'understand-what-is-happening',
    'caregiver-wellbeing',
    'prepare-for-bcba',
    'safety-support',
  ];
  const primaryNeed =
    typeof raw.primaryNeed === 'string' &&
    primaryNeeds.includes(raw.primaryNeed as ParentSupportPrimaryNeed)
      ? (raw.primaryNeed as ParentSupportPrimaryNeed)
      : fallback.primaryNeed;

  const reflection =
    typeof raw.reflection === 'string' && raw.reflection.trim().length >= 20
      ? raw.reflection.trim().slice(0, 360)
      : fallback.reflection;

  return {
    reflection,
    primaryNeed,
    nowActionIds: takeValid(
      raw.nowActionIds,
      Object.keys(NOW_ACTIONS) as NowActionId[],
      fallback.nowActionIds,
      4,
    ),
    prepareActionIds: takeValid(
      raw.prepareActionIds,
      Object.keys(PREPARE_ACTIONS) as PrepareActionId[],
      fallback.prepareActionIds,
      4,
    ),
    observationPromptIds: takeValid(
      raw.observationPromptIds,
      Object.keys(OBSERVATION_PROMPTS) as ObservationPromptId[],
      fallback.observationPromptIds,
      5,
    ),
    caregiverSupportIds: takeValid(
      raw.caregiverSupportIds,
      Object.keys(CAREGIVER_SUPPORT) as CaregiverSupportId[],
      fallback.caregiverSupportIds,
      4,
    ),
    bcbaQuestionIds: takeValid(
      raw.bcbaQuestionIds,
      Object.keys(BCBA_QUESTIONS) as BCBAQuestionId[],
      fallback.bcbaQuestionIds,
      6,
    ),
    contactTeamReasonIds: takeValid(
      raw.contactTeamReasonIds,
      Object.keys(CONTACT_TEAM_REASONS) as ContactTeamReasonId[],
      fallback.contactTeamReasonIds,
      4,
    ),
    safetyEscalation:
      typeof raw.safetyEscalation === 'boolean'
        ? raw.safetyEscalation
        : fallback.safetyEscalation,
  };
}

export function materializeParentSupportPlan(
  plan: ParentSupportPlanSelection,
): MaterializedParentSupportPlan {
  return {
    reflection: plan.reflection,
    primaryNeed: plan.primaryNeed,
    nowActions: plan.nowActionIds.map((id) => NOW_ACTIONS[id]),
    prepareActions: plan.prepareActionIds.map((id) => PREPARE_ACTIONS[id]),
    observationPrompts: plan.observationPromptIds.map((id) => OBSERVATION_PROMPTS[id]),
    caregiverSupport: plan.caregiverSupportIds.map((id) => CAREGIVER_SUPPORT[id]),
    bcbaQuestions: plan.bcbaQuestionIds.map((id) => BCBA_QUESTIONS[id]),
    contactTeamReasons: plan.contactTeamReasonIds.map((id) => CONTACT_TEAM_REASONS[id]),
    safetyEscalation: plan.safetyEscalation,
  };
}

const stringArraySchema = (values: string[], maxItems: number) => ({
  type: 'array',
  minItems: 1,
  maxItems,
  uniqueItems: true,
  items: { type: 'string', enum: values },
});

export const PARENT_SUPPORT_PLAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'reflection',
    'primaryNeed',
    'nowActionIds',
    'prepareActionIds',
    'observationPromptIds',
    'caregiverSupportIds',
    'bcbaQuestionIds',
    'contactTeamReasonIds',
    'safetyEscalation',
  ],
  properties: {
    reflection: { type: 'string', minLength: 20, maxLength: 360 },
    primaryNeed: {
      type: 'string',
      enum: [
        'prepare-for-home',
        'understand-what-is-happening',
        'caregiver-wellbeing',
        'prepare-for-bcba',
        'safety-support',
      ],
    },
    nowActionIds: stringArraySchema(Object.keys(NOW_ACTIONS), 4),
    prepareActionIds: stringArraySchema(Object.keys(PREPARE_ACTIONS), 4),
    observationPromptIds: stringArraySchema(Object.keys(OBSERVATION_PROMPTS), 5),
    caregiverSupportIds: stringArraySchema(Object.keys(CAREGIVER_SUPPORT), 4),
    bcbaQuestionIds: stringArraySchema(Object.keys(BCBA_QUESTIONS), 6),
    contactTeamReasonIds: stringArraySchema(Object.keys(CONTACT_TEAM_REASONS), 4),
    safetyEscalation: { type: 'boolean' },
  },
} as const;
