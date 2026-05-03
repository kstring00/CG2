/**
 * Care plan generator — produces the 3 ordered next steps and a small
 * curated resource set from the parent's intake answers.
 *
 * Step 8 of the review brief. The logic is intentionally explicit (a small
 * decision table) rather than a model, so reviewers can read it and adjust.
 *
 * Tone rule: every step is framed as a next move, never a deficiency.
 */

import type {
  CarePlanAnswers,
  CarePlanResource,
  CarePlanStep,
  Hardest,
  WeekMood,
} from './carePlanStorage';

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

type StepBuilder = (a: CarePlanAnswers) => CarePlanStep[] | null;

/**
 * Decision table — first builder to return a result wins. Entries are
 * ordered most-specific to least-specific so financial+newly-diagnosed
 * matches before just financial.
 */
const BUILDERS: StepBuilder[] = [
  // financial + newly diagnosed
  (a) =>
    has(a.hardest, 'financial-insurance') && a.stage === 'newly-diagnosed'
      ? [
          step(
            'Get on the Medicaid Waiver waitlist',
            'The list is long — getting on it is the single most consequential first move.',
            '/support/financial',
          ),
          step(
            'Check your private insurance ABA coverage',
            'Call the number on the back of your card and ask about ABA + outpatient behavioral health.',
            '/support/financial',
          ),
          step(
            'Apply to Hope For Three for short-term help',
            'Quick Assist can move funds to your provider in 3–5 business days.',
            '/support/find',
          ),
        ]
      : null,

  // overwhelmed + frayed/heavy
  (a) =>
    has(a.hardest, 'overwhelmed') && (a.weekMood === 'frayed' || a.weekMood === 'heavy')
      ? [
          step(
            'Take 4 minutes for yourself',
            'Before anything else. The rest of the plan can wait that long.',
            '/support/hard-days',
          ),
          step(
            'One small home routine to try this week',
            'Pick one — not three. Something that fits today.',
            '/support/help',
          ),
          step(
            'Find a parent therapist',
            'You spend every day advocating for your child. This is how you advocate for yourself.',
            '/support/caregiver',
          ),
        ]
      : null,

  // connecting with other parents
  (a) =>
    has(a.hardest, 'connecting-parents')
      ? [
          step(
            'Build a parent match',
            'Common Ground is building its matching pool. Joining now puts you in the next round.',
            '/support/connect',
          ),
          step(
            'Browse small groups',
            'Some weeks a group is easier than a 1:1 conversation.',
            '/support/connect',
          ),
          step(
            'Try one Still Waters entry',
            'Sometimes writing helps before talking.',
            '/support/still-waters',
          ),
        ]
      : null,

  // financial only (any stage)
  (a) =>
    has(a.hardest, 'financial-insurance')
      ? [
          step(
            'Review the financial help guide',
            'Insurance, Medicaid waiver, and short-term grant options in one place.',
            '/support/financial',
          ),
          step(
            'Check your insurance ABA coverage',
            'Most plans cover something — call the number on the back of your card.',
            '/support/financial',
          ),
          step(
            'See local providers who accept your plan',
            'Filter by insurance so the list is realistic, not aspirational.',
            '/support/find',
          ),
        ]
      : null,

  // school / IEP
  (a) =>
    has(a.hardest, 'school-iep')
      ? [
          step(
            'Open the IEP / ARD prep guide',
            'A short, plain-language walkthrough so you walk in prepared.',
            '/support/resources',
          ),
          step(
            'Bring a parent advocate to your next meeting',
            'You don&rsquo;t have to do this alone.',
            '/support/help',
          ),
          step(
            'Document what is hard right now',
            'Three specific examples beat a long story every time.',
            '/support/still-waters',
          ),
        ]
      : null,

  // newly diagnosed (general)
  (a) =>
    a.stage === 'newly-diagnosed'
      ? [
          step(
            'Read the What Is ABA? quick guide',
            'A plain-language foundation so the next conversations land easier.',
            '/support/what-is-aba',
          ),
          step(
            'Get on the Medicaid Waiver waitlist',
            'The list is long. Getting on it is the most consequential first move.',
            '/support/financial',
          ),
          step(
            'Pick one local provider to call this week',
            'You don&rsquo;t have to call all of them. One.',
            '/support/find',
          ),
        ]
      : null,

  // looking for ABA
  (a) =>
    a.stage === 'looking-for-aba'
      ? [
          step(
            'Compare 3 local ABA providers',
            'Filter by insurance and waitlist so the list is realistic.',
            '/support/find',
          ),
          step(
            'Prepare what to ask on the first call',
            'Five specific questions that protect your time.',
            '/support/resources',
          ),
          step(
            'Open your care plan with notes',
            'Track what you hear from each provider so they don&rsquo;t blur together.',
            '/support/care-plan',
          ),
        ]
      : null,

  // waiting for diagnosis
  (a) =>
    a.stage === 'waiting-diagnosis'
      ? [
          step(
            'Ask your pediatrician for an M-CHAT screening',
            'Bring written examples of what you&rsquo;ve seen — specific beats general.',
            '/support/what-is-aba',
          ),
          step(
            'Find a local developmental pediatrician',
            'Many have wait times — call now even if you&rsquo;re not sure yet.',
            '/support/find',
          ),
          step(
            'Open Still Waters',
            'A quiet place to write what this week has been like.',
            '/support/still-waters',
          ),
        ]
      : null,

  // siblings
  (a) =>
    has(a.hardest, 'siblings')
      ? [
          step(
            'Read the sibling support guide',
            'Practical, written by parents who have been there.',
            '/support/siblings',
          ),
          step(
            'Pick one sibling thing to try this week',
            'Pick one. Small.',
            '/support/siblings',
          ),
          step(
            'Connect with a parent who has been here',
            'Sibling dynamics are easier to talk about with someone who gets it.',
            '/support/connect',
          ),
        ]
      : null,

  // behavior at home
  (a) =>
    has(a.hardest, 'behavior-home')
      ? [
          step(
            'Try one short home strategy today',
            'One. Not all of them. Something that fits today&rsquo;s capacity.',
            '/support/help',
          ),
          step(
            'Open the practical guides library',
            'Filtered by what families actually use, not what sounds good on paper.',
            '/support/resources',
          ),
          step(
            'If a meltdown is happening now',
            'A 2-minute calming page for the moment, not the strategy.',
            '/support/hard-days',
          ),
        ]
      : null,

  // finding resources
  (a) =>
    has(a.hardest, 'finding-resources')
      ? [
          step(
            'Use Find Local Help',
            'Pick two nearby support options that match your insurance.',
            '/support/find',
          ),
          step(
            'Save the ones that look promising',
            'A short list now beats a long search later.',
            '/support/resources',
          ),
          step(
            'Open your care plan to track what you tried',
            'Notes belong somewhere they won&rsquo;t get lost.',
            '/support/care-plan',
          ),
        ]
      : null,

  // understanding ABA
  (a) =>
    has(a.hardest, 'understanding-aba')
      ? [
          step(
            'Read the What Is ABA? quick guide',
            'A clear, plain-language foundation in 10 minutes.',
            '/support/what-is-aba',
          ),
          step(
            'Browse parent-friendly home strategies',
            'See what ABA actually looks like in real homes.',
            '/support/resources',
          ),
          step(
            'Connect with a parent already in ABA',
            'A 15-minute call beats a 4-hour internet rabbit hole.',
            '/support/connect',
          ),
        ]
      : null,
];

function has<T>(arr: T[] | null | undefined, val: T): boolean {
  return Array.isArray(arr) && arr.includes(val);
}

function step(title: string, why: string, href: string): CarePlanStep {
  return { title, why, href };
}

/** Pick the first matching builder; otherwise fall back to the generic plan. */
export function generateNextSteps(answers: CarePlanAnswers): CarePlanStep[] {
  for (const build of BUILDERS) {
    const out = build(answers);
    if (out) return out;
  }
  return FALLBACK_STEPS;
}

/** Curate ~4 resource cards based on the intake. Always non-empty. */
export function generateResources(answers: CarePlanAnswers): CarePlanResource[] {
  const picks: CarePlanResource[] = [];
  const add = (r: CarePlanResource) => {
    if (!picks.find((p) => p.href === r.href)) picks.push(r);
  };

  if (has(answers.hardest, 'financial-insurance')) add({ label: 'Financial help', href: '/support/financial' });
  if (has(answers.hardest, 'overwhelmed')) add({ label: 'Hard days — start here', href: '/support/hard-days' });
  if (has(answers.hardest, 'connecting-parents')) add({ label: 'Connect with parents', href: '/support/connect' });
  if (has(answers.hardest, 'siblings')) add({ label: 'Sibling support', href: '/support/siblings' });
  if (has(answers.hardest, 'school-iep')) add({ label: 'Guides & strategies', href: '/support/resources' });
  if (has(answers.hardest, 'understanding-aba')) add({ label: 'What is ABA?', href: '/support/what-is-aba' });
  if (answers.stage === 'looking-for-aba' || answers.stage === 'newly-diagnosed') {
    add({ label: 'Find local help', href: '/support/find' });
  }
  if (answers.helpKind === 'someone-to-talk-to') add({ label: 'Connect with parents', href: '/support/connect' });
  if (answers.helpKind === 'time-for-me') add({ label: 'Parent support', href: '/support/caregiver' });

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
      return 'this week sounds heavy. before anything else: open the hard-days page and take 4 minutes for yourself. the rest of the plan can wait.';
    case 'numb':
      return 'numb is also a signal — not a flaw. one small thing today is enough.';
    case 'steady':
      return 'you said you&rsquo;re feeling steadier. that&rsquo;s worth marking. want to write it down? still waters is a quiet place to put it.';
    case 'hopeful':
      return 'you&rsquo;re feeling a little more hopeful. good time to plan one small thing for the week ahead.';
    default:
      return 'pick one step. small. you can always come back for the rest.';
  }
}

/** Two-sentence summary, gentle and parent-facing. */
export function generateSummary(answers: CarePlanAnswers): string {
  const heavy = answers.weekMood === 'frayed' || answers.weekMood === 'heavy' || has(answers.hardest, 'overwhelmed');
  const hopeful = answers.weekMood === 'hopeful' || answers.weekMood === 'steady';

  if (heavy) {
    return 'we kept this plan small on purpose. one step at a time is the plan — not a placeholder for a bigger one.';
  }
  if (hopeful) {
    return 'you have some momentum this week. these next steps build on what&rsquo;s already working — they don&rsquo;t replace it.';
  }
  return 'a simple plan built from what you told us. you can change it anytime — nothing here is set in stone.';
}

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

export const HARDEST_OPTIONS: { value: Hardest; label: string }[] = (Object.keys(HARDEST_LABEL) as Hardest[]).map(
  (value) => ({ value, label: HARDEST_LABEL[value] }),
);
