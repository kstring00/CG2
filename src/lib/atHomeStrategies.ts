/**
 * At-Home Strategies — 10 ABA-grounded tools for parents in the middle of a hard
 * moment with their kid.
 *
 * Why this exists
 * ---------------
 * The previous "I need help at home" action on Home Base routed parents to a
 * triage page of external referrals (therapists, hotlines, respite). That's
 * useful, but it isn't what a parent needs at 5:47 PM when shoes-and-iPad has
 * become a meltdown. They need an actual technique they can try in the next
 * 60 seconds.
 *
 * These 10 are Kyle + CCO-approved starting content. A BCBA can add more
 * later — the data shape is stable and forward-compatible.
 *
 * Editorial rules (locked):
 *   • Parent-friendly language first. ABA term shown but never required reading.
 *   • Every strategy has at least 2 concrete example scripts a parent can copy.
 *   • Every strategy names its most common failure mode so parents stop blaming
 *     themselves when it doesn't work the first time.
 *   • Nothing here claims to replace a BCBA. Disclaimers live on the page.
 */

export type StrategySituation =
  | 'transitions'
  | 'meltdowns'
  | 'refusal'
  | 'communication'
  | 'routines'
  | 'unsafe-behavior'
  | 'overwhelm';

export type AtHomeStrategy = {
  id: string;
  /** Short, plain-language title parents will recognize. */
  title: string;
  /** The ABA concept name — shown as a small chip, never as the main label. */
  abaConcept: string;
  /** One-line tagline used in the list view. */
  tagline: string;
  /** Situations where this is the right move. Drives the filter. */
  bestFor: StrategySituation[];
  /** Calm, parent-readable explanation of why this works. 1–2 sentences. */
  explanation: string;
  /** Direct scripts the parent can copy and use today. */
  examples: string[];
  /** Step-by-step "how to try it". Kept short on purpose. */
  howTo: string[];
  /** The most common way parents accidentally undercut this strategy. */
  commonMistake: string;
};

export const SITUATION_LABELS: Record<StrategySituation, string> = {
  transitions: 'Transitions',
  meltdowns: 'Meltdowns',
  refusal: 'Refusal & power struggles',
  communication: 'Communication',
  routines: 'Daily routines',
  'unsafe-behavior': 'Unsafe behavior',
  overwhelm: 'Overwhelm & shutdown',
};

export const AT_HOME_STRATEGIES: AtHomeStrategy[] = [
  {
    id: 'first-then',
    title: 'First / Then',
    abaConcept: 'Premack Principle',
    tagline: 'Use something they want to help them do something they need.',
    bestFor: ['transitions', 'refusal', 'routines'],
    explanation:
      'Pairing a non-preferred task with a preferred one makes the hard task much more likely to get started. The order matters — the "first" task always comes before the reward.',
    examples: [
      '"First shoes, then iPad."',
      '"First brush teeth, then story."',
      '"First clean up blocks, then outside."',
    ],
    howTo: [
      'Say it before the hard task starts.',
      'Keep it short — just two words on each side.',
      'Show a visual if possible (picture, written words, or two fingers).',
      'Follow through calmly. The reward has to actually come.',
      'Praise the first step, not just the full task.',
    ],
    commonMistake: 'Saying "First / Then" after the child is already escalated. By then it sounds like a threat, not a plan.',
  },
  {
    id: 'catch-them-being-good',
    title: 'Catch Them Being Good',
    abaConcept: 'Reinforcement',
    tagline: 'The behaviors you notice are the behaviors that grow.',
    bestFor: ['routines', 'communication', 'refusal'],
    explanation:
      'Behaviors that get attention, praise, access, or success are more likely to happen again. Most parents catch the bad stuff fast and let the good stuff pass without comment — flipping that ratio is one of the single highest-leverage changes you can make.',
    examples: [
      '"I love how you came to the table the first time."',
      '"Nice job using your words."',
      '"You waited so calmly. Let\'s play."',
    ],
    howTo: [
      'Look for small wins — not perfection.',
      'Praise the exact behavior, not the child as a whole ("you cleaned up your plate" beats "good boy").',
      'Give attention quickly. Within seconds is best.',
      'Praise effort, not just outcomes.',
    ],
    commonMistake: 'Only giving attention when something goes wrong. Kids will take negative attention over no attention every time.',
  },
  {
    id: 'two-good-choices',
    title: 'Give Two Good Choices',
    abaConcept: 'Choice-making / Antecedent strategy',
    tagline: 'A little control prevents a lot of resistance.',
    bestFor: ['refusal', 'transitions', 'routines'],
    explanation:
      'Giving choices reduces resistance because the child still feels some control over what is happening. The trick is offering two options you can actually accept either way.',
    examples: [
      '"Do you want the blue shirt or the red shirt?"',
      '"Walk to the car or hop to the car?"',
      '"Brush teeth before pajamas or after pajamas?"',
    ],
    howTo: [
      'Offer two choices you can actually accept.',
      'Keep your voice calm and even.',
      'Avoid fake choices — both options need to be real.',
      'Praise cooperation when they pick one.',
    ],
    commonMistake: 'Offering choices when there is no real choice, like "Do you want to go to school?" Kids hear through that fast.',
  },
  {
    id: 'smaller-step',
    title: 'Make the Next Step Smaller',
    abaConcept: 'Task analysis / Shaping',
    tagline: 'When everything stalls, shrink the ask.',
    bestFor: ['overwhelm', 'refusal', 'routines'],
    explanation:
      'Sometimes the task is too big and your child shuts down before they even start. Breaking it into the smallest possible first step gets momentum going. You can build the rest from there.',
    examples: [
      'Instead of "Clean your room," try "Put three toys in the bin."',
      'Instead of "Get ready for bed," try "First, get pajamas."',
      'Instead of "Do your homework," try "Open the folder."',
    ],
    howTo: [
      'Pick the smallest possible first step.',
      'Help physically if needed — that is not cheating.',
      'Praise the attempt.',
      'Build up slowly across days, not in one sitting.',
    ],
    commonMistake: 'Expecting the whole routine when the child only has the bandwidth for one step.',
  },
  {
    id: 'visuals-not-words',
    title: 'Use Visuals, Not Just Words',
    abaConcept: 'Visual supports / Prompting',
    tagline: 'Many kids do better when they can see what is happening.',
    bestFor: ['transitions', 'routines', 'communication'],
    explanation:
      'For many kids — especially when they\'re tired, overstimulated, or stressed — a picture lands better than a sentence. Visuals also stay still while words evaporate.',
    examples: [
      'A First / Then board.',
      'A morning routine chart with pictures.',
      'A bedtime checklist they can check off.',
      'A visual timer.',
      'Picture choices for snack or clothes.',
      'A "finished" box for completed tasks.',
    ],
    howTo: [
      'Use simple pictures or single words.',
      'Point to the visual while speaking — let the picture carry half the message.',
      'Keep it visible where the routine happens.',
      'Use the same visual consistently for at least a week.',
    ],
    commonMistake: 'Using too many words when the child is already overwhelmed. More language is rarely the answer in that moment.',
  },
  {
    id: 'replacement-behavior',
    title: 'Tell Them What To Do, Not Just What To Stop',
    abaConcept: 'Replacement behavior',
    tagline: '"Stop" tells them what not to do. Teach what to do instead.',
    bestFor: ['unsafe-behavior', 'communication', 'refusal'],
    explanation:
      'Telling a child to "stop" only names the unwanted behavior — it doesn\'t teach the one you want. Naming the replacement gives them something to actually do with their body and their voice.',
    examples: [
      'Instead of "Stop yelling," try "Use quiet voice."',
      'Instead of "Don\'t grab," try "Ask for a turn."',
      'Instead of "Stop running," try "Walking feet."',
    ],
    howTo: [
      'Name the replacement behavior in plain words.',
      'Model it briefly — show what walking feet looks like.',
      'Prompt it in the moment before the unwanted behavior reappears.',
      'Reinforce it immediately when you see it.',
    ],
    commonMistake: 'Correcting the behavior without teaching what should replace it. The child knows what not to do — they don\'t yet know what to do.',
  },
  {
    id: 'practice-when-calm',
    title: 'Practice When Calm',
    abaConcept: 'Skill-building outside the crisis',
    tagline: 'The best time to teach a hard skill is not during the hardest moment.',
    bestFor: ['meltdowns', 'communication', 'overwhelm'],
    explanation:
      'A child can\'t learn a new skill while their nervous system is on fire. The work happens in the quiet stretches — short, easy practice runs that build the muscle memory you\'ll need later.',
    examples: [
      'Practice asking for a break during playtime, not during a full meltdown.',
      'Practice deep breaths during story time, not in the middle of a tantrum.',
      'Practice walking to the car when there\'s no rush, not on a hard morning.',
    ],
    howTo: [
      'Pick one skill at a time.',
      'Practice for 2–3 minutes when everyone is calm.',
      'Keep it easy — set them up to succeed.',
      'Reinforce immediately ("you did it — that was perfect").',
      'Reach for the skill in real moments only after several calm reps.',
    ],
    commonMistake: 'Trying to teach a new skill during escalation. The window for learning closes when stress is high.',
  },
  {
    id: 'timer-transitions',
    title: 'Use a Timer for Transitions',
    abaConcept: 'Antecedent support',
    tagline: 'Predictable endings are easier than surprise endings.',
    bestFor: ['transitions', 'refusal'],
    explanation:
      'A timer makes the end of a preferred activity feel external — the iPad isn\'t taken away by you, the timer ended. That shifts the resistance off you and onto something neutral.',
    examples: [
      '"Five more minutes, then bath."',
      '"When the timer rings, first bath, then story."',
      '"Two minutes until we leave."',
    ],
    howTo: [
      'Give a warning before the timer starts.',
      'Show the timer so they can see it counting down.',
      'Pair it with First / Then ("when this rings, first X, then Y").',
      'Follow through gently but clearly — don\'t restart the timer.',
    ],
    commonMistake: 'Using the timer inconsistently or adding "just one more minute" repeatedly. That teaches the timer is negotiable.',
  },
  {
    id: 'ask-for-break',
    title: 'Help Them Ask for a Break',
    abaConcept: 'Functional Communication Training (FCT)',
    tagline: 'Give them a word for the thing they\'re already trying to say.',
    bestFor: ['meltdowns', 'overwhelm', 'communication', 'unsafe-behavior'],
    explanation:
      'Some challenging behavior is the child\'s only available way to say "this is too much." Teaching them an easier way to ask gives that message a path that doesn\'t require a meltdown.',
    examples: [
      '"Break please."',
      '"Help."',
      '"All done."',
      '"One more minute."',
      'A break card they can hand to you.',
      'Pointing to a picture of a break spot.',
    ],
    howTo: [
      'Teach the break request when calm, not during escalation.',
      'Prompt it before they reach overwhelm ("you look tired — say break please").',
      'Honor short breaks when possible. A 2-minute break is not a victory for the child, it\'s a reset.',
      'Return to the task gently after the break.',
    ],
    commonMistake: 'Making the child reach meltdown before they\'re allowed to escape the task. That teaches meltdown is the only thing that works.',
  },
  {
    id: 'reduce-demand',
    title: 'Reduce the Demand Before It Becomes a Battle',
    abaConcept: 'Antecedent modification',
    tagline: 'Sometimes the fix is upstream of the behavior.',
    bestFor: ['refusal', 'overwhelm', 'routines'],
    explanation:
      'Behavior happens in a context. If the same routine blows up at the same time every day, the answer is usually not "try harder in the moment" — it\'s "change something before the moment."',
    examples: [
      'Fewer instructions at once.',
      'A shorter version of the task.',
      'A visual schedule so they know what\'s coming.',
      'More warning before a transition.',
      'Less background noise.',
      'A choice of where to sit.',
      'Help starting the first step.',
    ],
    howTo: [
      'Notice the hardest part of the routine — when does it usually break down?',
      'Change one thing before the problem starts.',
      'Track for a few days whether it helps.',
      'Bring the pattern to your BCBA if it keeps happening.',
    ],
    commonMistake: 'Waiting until the child is already overwhelmed before changing the setup. By then the only options left are bad ones.',
  },
];

/**
 * Returns the subset of strategies that apply to a given situation. Used by
 * the page filter. Returns all strategies for 'all'.
 */
export function strategiesForSituation(situation: StrategySituation | 'all'): AtHomeStrategy[] {
  if (situation === 'all') return AT_HOME_STRATEGIES;
  return AT_HOME_STRATEGIES.filter((s) => s.bestFor.includes(situation));
}
