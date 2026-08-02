import { AT_HOME_STRATEGIES, type AtHomeStrategy } from '@/lib/atHomeStrategies';

export type FunctionId = 'tangible' | 'escape' | 'attention' | 'automatic';
export type BeforeId =
  | 'demand'
  | 'transition'
  | 'denied'
  | 'attention-away'
  | 'waiting'
  | 'alone'
  | 'sensory'
  | 'unclear';
export type BehaviorId =
  | 'crying'
  | 'yelling'
  | 'hitting'
  | 'throwing'
  | 'leaving'
  | 'dropping'
  | 'repeating'
  | 'refusal'
  | 'self-stim'
  | 'other';
export type AfterId =
  | 'task-ended'
  | 'item-given'
  | 'attention-given'
  | 'left-alone'
  | 'environment-changed'
  | 'task-continued'
  | 'sensory-result'
  | 'nothing-changed';

export type MatchInput = {
  before: BeforeId | null;
  behavior: BehaviorId | null;
  after: AfterId | null;
};

export type FunctionInsight = {
  id: FunctionId;
  label: string;
  status: 'stronger-clue' | 'possible' | 'unclear';
  score: number;
  explanation: string;
};

export type MatchedStrategy = {
  strategy: AtHomeStrategy;
  why: string;
  when: string;
  askYourBcba: string;
};

export type MatchResult = {
  insights: FunctionInsight[];
  strategies: MatchedStrategy[];
  summary: string;
};

const LABELS: Record<FunctionId, string> = {
  tangible: 'Tangible',
  escape: 'Escape',
  attention: 'Attention',
  automatic: 'Automatic',
};

const AFTER_EXPLANATIONS: Record<AfterId, string> = {
  'task-ended': 'The task stopped, became smaller, or was delayed afterward.',
  'item-given': 'Access to an item or activity followed the behavior.',
  'attention-given': 'Talking, comforting, correcting, or another response followed the behavior.',
  'left-alone': 'The child was left alone or interaction decreased afterward.',
  'environment-changed': 'The setting or sensory conditions changed afterward.',
  'task-continued': 'The task continued, so this one moment gives less evidence about escape.',
  'sensory-result': 'The behavior itself may have produced sensory input or relief.',
  'nothing-changed': 'Nothing obvious changed afterward, so more observation may be needed.',
};

const STRATEGY_IDS: Record<FunctionId, string[]> = {
  tangible: ['first-then', 'timer-transitions', 'two-good-choices', 'catch-them-being-good'],
  escape: ['smaller-step', 'first-then', 'ask-for-break', 'reduce-demand'],
  attention: ['catch-them-being-good', 'replacement-behavior', 'practice-when-calm', 'visuals-not-words'],
  automatic: ['reduce-demand', 'visuals-not-words', 'practice-when-calm', 'ask-for-break'],
};

const FUNCTION_QUESTIONS: Record<FunctionId, string> = {
  tangible: 'What waiting, requesting, or transition skill should we teach and reinforce?',
  escape: 'How small should the first step be, and how should breaks be taught and returned from?',
  attention: 'What appropriate way of asking for connection should we teach and reinforce?',
  automatic: 'Could sensory, medical, sleep, or environmental variables be affecting this pattern?',
};

function add(score: Record<FunctionId, number>, id: FunctionId, amount: number) {
  score[id] += amount;
}

function scoreFunctions(input: MatchInput): Record<FunctionId, number> {
  const score: Record<FunctionId, number> = {
    tangible: 0,
    escape: 0,
    attention: 0,
    automatic: 0,
  };

  switch (input.before) {
    case 'demand':
      add(score, 'escape', 3);
      break;
    case 'transition':
      add(score, 'escape', 2);
      add(score, 'tangible', 2);
      break;
    case 'denied':
      add(score, 'tangible', 3);
      break;
    case 'attention-away':
      add(score, 'attention', 3);
      break;
    case 'waiting':
      add(score, 'tangible', 2);
      add(score, 'escape', 1);
      break;
    case 'alone':
      add(score, 'automatic', 3);
      break;
    case 'sensory':
      add(score, 'automatic', 3);
      add(score, 'escape', 1);
      break;
    default:
      break;
  }

  switch (input.after) {
    case 'task-ended':
      add(score, 'escape', 5);
      break;
    case 'item-given':
      add(score, 'tangible', 5);
      break;
    case 'attention-given':
      add(score, 'attention', 5);
      break;
    case 'left-alone':
      add(score, 'escape', 2);
      add(score, 'automatic', 2);
      break;
    case 'environment-changed':
      add(score, 'escape', 2);
      add(score, 'automatic', 2);
      break;
    case 'task-continued':
      add(score, 'attention', 1);
      break;
    case 'sensory-result':
      add(score, 'automatic', 5);
      break;
    default:
      break;
  }

  if (input.behavior === 'repeating') add(score, 'attention', 1);
  if (input.behavior === 'refusal' || input.behavior === 'leaving') add(score, 'escape', 1);
  if (input.behavior === 'self-stim') add(score, 'automatic', 2);

  return score;
}

function insightFor(id: FunctionId, score: number, topScore: number, input: MatchInput): FunctionInsight {
  let status: FunctionInsight['status'] = 'unclear';
  if (score >= 6 && score === topScore) status = 'stronger-clue';
  else if (score >= 3) status = 'possible';

  const afterText = input.after ? AFTER_EXPLANATIONS[input.after] : 'Choose what happened afterward to see a clearer pattern.';
  const lead =
    status === 'stronger-clue'
      ? `${LABELS[id]} has the strongest clues in this one observation.`
      : status === 'possible'
        ? `${LABELS[id]} may be part of the pattern.`
        : `${LABELS[id]} is not clear from this one observation.`;

  return { id, label: LABELS[id], status, score, explanation: `${lead} ${afterText}` };
}

function whyFor(strategy: AtHomeStrategy, primary: FunctionId, input: MatchInput): string {
  const context =
    input.before === 'transition'
      ? 'a transition or ending'
      : input.before === 'demand'
        ? 'a demand or difficult step'
        : input.before === 'denied'
          ? 'something becoming unavailable'
          : input.before === 'attention-away'
            ? 'attention moving elsewhere'
            : input.before === 'sensory'
              ? 'an uncomfortable or overstimulating setting'
              : 'the pattern you selected';

  const functionText: Record<FunctionId, string> = {
    tangible: 'access to something wanted may be relevant',
    escape: 'getting away from or delaying something may be relevant',
    attention: 'connection or another person’s response may be relevant',
    automatic: 'sensory input, relief, or regulation may be relevant',
  };

  return `This appeared because ${context} came before the behavior and ${functionText[primary]}.`;
}

function whenFor(strategy: AtHomeStrategy): string {
  if (strategy.id === 'practice-when-calm' || strategy.id === 'ask-for-break') {
    return 'Teach and practice this while everyone is calm, then prompt it early.';
  }
  if (strategy.id === 'first-then' || strategy.id === 'timer-transitions' || strategy.id === 'reduce-demand') {
    return 'Use this before the behavior begins, while the child can still process the plan.';
  }
  if (strategy.id === 'catch-them-being-good') {
    return 'Use it immediately when you notice even a small version of the behavior you want to grow.';
  }
  return 'Use it early and calmly. Follow the child’s existing behavior or safety plan when one exists.';
}

export function matchAtHomeStrategies(input: MatchInput): MatchResult {
  const scores = scoreFunctions(input);
  const topScore = Math.max(...Object.values(scores));
  const insights = (Object.keys(scores) as FunctionId[])
    .map((id) => insightFor(id, scores[id], topScore, input))
    .sort((a, b) => b.score - a.score);

  const primary = insights[0]?.id ?? 'escape';
  const secondary = insights[1]?.id ?? 'attention';
  const rankedIds = [...STRATEGY_IDS[primary], ...STRATEGY_IDS[secondary]];
  const uniqueIds = [...new Set(rankedIds)].slice(0, 4);

  const strategies = uniqueIds
    .map((id) => AT_HOME_STRATEGIES.find((strategy) => strategy.id === id))
    .filter((strategy): strategy is AtHomeStrategy => Boolean(strategy))
    .map((strategy) => ({
      strategy,
      why: whyFor(strategy, primary, input),
      when: whenFor(strategy),
      askYourBcba: FUNCTION_QUESTIONS[primary],
    }));

  const primaryLabel = LABELS[primary];
  const summary =
    topScore === 0
      ? 'This one moment does not point clearly to one TEAA lens yet. That is useful information too.'
      : `${primaryLabel} has the strongest clues in this one moment. Treat this as a possibility to explore, not a confirmed function.`;

  return { insights, strategies, summary };
}
