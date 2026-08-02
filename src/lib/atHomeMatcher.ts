import { AT_HOME_STRATEGIES, type AtHomeStrategy } from '@/lib/atHomeStrategies';

export type FunctionId = 'tangible' | 'escape' | 'attention' | 'automatic';
export type BeforeId = 'demand' | 'transition' | 'denied' | 'attention-away' | 'waiting' | 'alone' | 'sensory' | 'unclear';
export type BehaviorId = 'crying' | 'yelling' | 'hitting' | 'throwing' | 'leaving' | 'self-injury' | 'dropping' | 'repeating' | 'refusal' | 'self-stim' | 'other';
export type AfterId = 'task-ended' | 'item-given' | 'attention-given' | 'left-alone' | 'environment-changed' | 'task-continued' | 'sensory-result' | 'nothing-changed';
export type SettingEventId = 'poor-sleep' | 'illness-pain' | 'hunger-thirst' | 'medication-change' | 'schedule-disruption';
export type MechanismId = 'antecedent-structure' | 'choice-control' | 'reinforcement' | 'replacement-teaching' | 'skill-building' | 'environmental-support' | 'communication-support';

export type MatchInput = {
  settingEvents: SettingEventId[];
  before: BeforeId | null;
  behavior: BehaviorId | null;
  after: AfterId | null;
};

export type FunctionInsight = {
  id: FunctionId;
  label: string;
  status: 'possible' | 'unclear';
  explanation: string;
};

export type MatchedStrategy = {
  strategy: AtHomeStrategy;
  mechanism: MechanismId;
  mechanismLabel: string;
  why: string;
  when: string;
  askYourBcba: string;
};

export type MatchResult = {
  insights: FunctionInsight[];
  strategies: MatchedStrategy[];
  summary: string;
  sensorySupport: boolean;
};

export const TIER_ONE_BEHAVIORS: BehaviorId[] = ['hitting', 'leaving', 'throwing', 'self-injury'];
export function isTierOneBehavior(behavior: BehaviorId | null): boolean {
  return Boolean(behavior && TIER_ONE_BEHAVIORS.includes(behavior));
}

const LABELS: Record<FunctionId, string> = {
  tangible: 'Tangible',
  escape: 'Escape',
  attention: 'Attention',
  automatic: 'Automatic',
};

export const BEFORE_LABELS: Record<BeforeId, string> = {
  demand: 'Asked to do something', transition: 'A transition or activity ending', denied: 'Something was unavailable',
  'attention-away': 'Attention moved away', waiting: 'Waiting or delay', alone: 'They were alone',
  sensory: 'Noise, discomfort, or sensory conditions', unclear: 'Nothing obvious changed',
};
export const BEHAVIOR_LABELS: Record<BehaviorId, string> = {
  crying: 'Crying or whining', yelling: 'Yelling or loud voice', hitting: 'Hitting or kicking',
  throwing: 'Throwing or breaking things', leaving: 'Leaving or running', 'self-injury': 'Hurting themselves',
  dropping: 'Dropping to the floor', repeating: 'Repeating a request', refusal: 'Not beginning or refusing',
  'self-stim': 'Repetitive or self-stimulatory behavior', other: 'Another observable behavior',
};
export const AFTER_LABELS: Record<AfterId, string> = {
  'task-ended': 'The task stopped or was delayed', 'item-given': 'They received an item or activity',
  'attention-given': 'Someone responded, corrected, or comforted', 'left-alone': 'They were left alone',
  'environment-changed': 'The environment changed', 'task-continued': 'The task continued',
  'sensory-result': 'The behavior appeared to provide sensory input or relief', 'nothing-changed': 'Nothing obvious changed',
};
export const SETTING_EVENT_LABELS: Record<SettingEventId, string> = {
  'poor-sleep': 'Poor sleep', 'illness-pain': 'Illness or pain', 'hunger-thirst': 'Hunger or thirst',
  'medication-change': 'Medication change', 'schedule-disruption': 'Schedule disruption',
};

const MECHANISM: Record<string, { id: MechanismId; label: string }> = {
  'first-then': { id: 'antecedent-structure', label: 'Antecedent structure' },
  'timer-transitions': { id: 'antecedent-structure', label: 'Antecedent structure' },
  'smaller-step': { id: 'antecedent-structure', label: 'Antecedent structure' },
  'reduce-demand': { id: 'environmental-support', label: 'Environmental adjustment' },
  'two-good-choices': { id: 'choice-control', label: 'Choice and control' },
  'catch-them-being-good': { id: 'reinforcement', label: 'Reinforcement' },
  'replacement-behavior': { id: 'replacement-teaching', label: 'Replacement teaching' },
  'practice-when-calm': { id: 'skill-building', label: 'Skill building' },
  'visuals-not-words': { id: 'environmental-support', label: 'Environmental support' },
  'ask-for-break': { id: 'communication-support', label: 'Communication support' },
};

const CANDIDATES: Record<FunctionId, string[]> = {
  tangible: ['timer-transitions', 'replacement-behavior', 'catch-them-being-good', 'two-good-choices', 'first-then', 'visuals-not-words'],
  escape: ['smaller-step', 'ask-for-break', 'two-good-choices', 'practice-when-calm', 'reduce-demand', 'catch-them-being-good'],
  attention: ['catch-them-being-good', 'replacement-behavior', 'practice-when-calm', 'visuals-not-words', 'two-good-choices'],
  automatic: ['visuals-not-words', 'ask-for-break', 'practice-when-calm', 'reduce-demand', 'two-good-choices'],
};

const FUNCTION_QUESTIONS: Record<FunctionId, string> = {
  tangible: 'What waiting, requesting, or transition skill should we teach and reinforce?',
  escape: 'How small should the first step be, and how should breaks be taught and returned from?',
  attention: 'What appropriate way of asking for connection should we teach and reinforce?',
  automatic: 'Could sensory, medical, sleep, or environmental variables be affecting this pattern?',
};

function addEvidence(evidence: Record<FunctionId, string[]>, id: FunctionId, cue: string) {
  if (!evidence[id].includes(cue)) evidence[id].push(cue);
}

function collectEvidence(input: MatchInput): Record<FunctionId, string[]> {
  const evidence: Record<FunctionId, string[]> = { tangible: [], escape: [], attention: [], automatic: [] };
  switch (input.before) {
    case 'demand': addEvidence(evidence, 'escape', 'a demand happened before'); break;
    case 'transition': addEvidence(evidence, 'escape', 'a transition happened before'); addEvidence(evidence, 'tangible', 'a preferred activity may have ended'); break;
    case 'denied': addEvidence(evidence, 'tangible', 'something was unavailable before'); break;
    case 'attention-away': addEvidence(evidence, 'attention', 'attention moved away before'); break;
    case 'waiting': addEvidence(evidence, 'tangible', 'access was delayed'); addEvidence(evidence, 'escape', 'waiting was present'); break;
    case 'alone': addEvidence(evidence, 'automatic', 'it occurred while alone'); break;
    case 'sensory': addEvidence(evidence, 'automatic', 'sensory conditions were present'); addEvidence(evidence, 'escape', 'discomfort may have been present'); break;
  }
  switch (input.after) {
    case 'task-ended': addEvidence(evidence, 'escape', 'the task stopped afterward'); break;
    case 'item-given': addEvidence(evidence, 'tangible', 'access followed afterward'); break;
    case 'attention-given': addEvidence(evidence, 'attention', 'interaction followed afterward'); break;
    case 'left-alone': addEvidence(evidence, 'escape', 'interaction decreased afterward'); addEvidence(evidence, 'automatic', 'the behavior continued without social input'); break;
    case 'environment-changed': addEvidence(evidence, 'escape', 'the setting changed afterward'); addEvidence(evidence, 'automatic', 'sensory conditions changed afterward'); break;
    case 'sensory-result': addEvidence(evidence, 'automatic', 'the behavior itself appeared regulating'); break;
  }
  if (input.behavior === 'repeating') addEvidence(evidence, 'attention', 'repeated bids for a response were observed');
  if (input.behavior === 'refusal') addEvidence(evidence, 'escape', 'non-starting occurred around an expectation');
  if (input.behavior === 'self-stim') addEvidence(evidence, 'automatic', 'repetitive or self-stimulatory behavior was observed');
  return evidence;
}

function unclearExplanation(id: FunctionId, input: MatchInput): string {
  const copy: Record<FunctionId, string> = {
    tangible: 'It is unclear whether access to an item or activity changed. Next time, notice whether something was denied before and provided afterward.',
    escape: 'It is unclear whether a task, transition, wait, or uncomfortable situation was reduced. Next time, notice whether the expectation changed afterward.',
    attention: 'It is unclear whether another person’s response changed. Next time, notice whether talking, comforting, correcting, or proximity reliably follows.',
    automatic: 'It is unclear whether the behavior itself provided sensory input or relief. Notice whether it also occurs when alone or across different social situations.',
  };
  if (input.after === 'nothing-changed') return `${copy[id]} Nothing obvious changed in this observation.`;
  return copy[id];
}

function buildInsights(input: MatchInput, evidence: Record<FunctionId, string[]>): FunctionInsight[] {
  return (Object.keys(LABELS) as FunctionId[]).map((id) => {
    const cues = evidence[id];
    const possible = cues.length >= 2;
    return {
      id,
      label: LABELS[id],
      status: possible ? 'possible' : 'unclear',
      explanation: possible
        ? `Two or more details point in this direction: ${cues.slice(0, 2).join(' and ')}. This is still a possibility to discuss, not a confirmed function.`
        : unclearExplanation(id, input),
    };
  });
}

function contextSentence(input: MatchInput): string {
  const before = input.before ? BEFORE_LABELS[input.before].toLowerCase() : 'the selected situation';
  const behavior = input.behavior ? BEHAVIOR_LABELS[input.behavior].toLowerCase() : 'the behavior';
  const after = input.after ? AFTER_LABELS[input.after].toLowerCase() : 'what followed';
  return `${before}; ${behavior}; then ${after}`;
}

function rationaleFor(strategy: AtHomeStrategy, input: MatchInput): string {
  const context = contextSentence(input);
  const rationales: Record<string, string> = {
    'first-then': `First / Then organizes the order of a hard step and a preferred next step. It was surfaced because the observation was: ${context}.`,
    'timer-transitions': `A visible timer makes an ending predictable instead of sudden. It was surfaced because the observation was: ${context}.`,
    'smaller-step': `Making the next step smaller reduces the response effort needed to begin. It was surfaced because the observation was: ${context}.`,
    'reduce-demand': `An environmental adjustment changes the setup before stress builds. It was surfaced because the observation was: ${context}.`,
    'two-good-choices': `Two acceptable choices preserve the expectation while adding appropriate control. It was surfaced because the observation was: ${context}.`,
    'catch-them-being-good': `Specific reinforcement strengthens the alternative response you want to see again. It was surfaced because the observation was: ${context}.`,
    'replacement-behavior': `Replacement teaching gives the child a clearer action or request that can serve the same need. It was surfaced because the observation was: ${context}.`,
    'practice-when-calm': `Calm practice builds the skill before the difficult moment, when learning is more available. It was surfaced because the observation was: ${context}.`,
    'visuals-not-words': `A visual support lowers language load and makes expectations or choices easier to process. It was surfaced because the observation was: ${context}.`,
    'ask-for-break': `A break request provides a safer, clearer communication response before overwhelm rises. It was surfaced because the observation was: ${context}.`,
  };
  return rationales[strategy.id] ?? `This tool addresses a distinct support mechanism connected to the observation: ${context}.`;
}

function whenFor(strategy: AtHomeStrategy): string {
  if (strategy.id === 'practice-when-calm' || strategy.id === 'ask-for-break' || strategy.id === 'replacement-behavior') return 'Teach and practice this while calm, then prompt it early.';
  if (['first-then', 'timer-transitions', 'smaller-step', 'reduce-demand', 'visuals-not-words', 'two-good-choices'].includes(strategy.id)) return 'Use this before escalation, while the plan can still be processed.';
  return 'Use it immediately when you notice a small version of the response you want to strengthen.';
}

function chooseStrategies(primary: FunctionId, secondary: FunctionId | null, input: MatchInput): MatchedStrategy[] {
  const ids = input.behavior === 'self-stim'
    ? ['visuals-not-words', 'ask-for-break', 'practice-when-calm', 'two-good-choices']
    : [...CANDIDATES[primary], ...(secondary ? CANDIDATES[secondary] : [])];
  const seenMechanisms = new Set<MechanismId>();
  const selected: AtHomeStrategy[] = [];
  for (const id of ids) {
    const strategy = AT_HOME_STRATEGIES.find((item) => item.id === id);
    const mechanism = MECHANISM[id];
    if (!strategy || !mechanism || seenMechanisms.has(mechanism.id)) continue;
    seenMechanisms.add(mechanism.id);
    selected.push(strategy);
    if (selected.length === 4) break;
  }
  return selected.map((strategy) => {
    const mechanism = MECHANISM[strategy.id];
    return {
      strategy,
      mechanism: mechanism.id,
      mechanismLabel: mechanism.label,
      why: rationaleFor(strategy, input),
      when: whenFor(strategy),
      askYourBcba: FUNCTION_QUESTIONS[primary],
    };
  });
}

export function matchAtHomeStrategies(input: MatchInput): MatchResult {
  const evidence = collectEvidence(input);
  const insights = buildInsights(input, evidence);
  const possible = insights.filter((item) => item.status === 'possible');
  const primary = possible[0]?.id ?? (input.behavior === 'self-stim' ? 'automatic' : 'escape');
  const secondary = possible[1]?.id ?? null;
  const sensorySupport = input.behavior === 'self-stim';
  const strategies = chooseStrategies(primary, secondary, input);
  const summary = sensorySupport
    ? 'Repetitive or self-stimulatory behavior is often adaptive and is not automatically a target for reduction. Focus on comfort, access, regulation, communication, and whether the behavior is safe.'
    : possible.length === 0
      ? 'There is not enough information yet to label any function as possible. The cards below are low-risk supports matched to the situation, not a function-based treatment plan.'
      : `${possible.map((item) => item.label).join(' and ')} ${possible.length === 1 ? 'has' : 'have'} at least two supporting details in this observation. Treat this as a discussion prompt, not an assessment result.`;
  return { insights, strategies, summary, sensorySupport };
}
