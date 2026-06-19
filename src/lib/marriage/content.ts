export type MarriageTruth = {
  statement: string;
  body: string;
  tryThis: string;
};

export type MarriageResource = {
  title: string;
  body: string;
  cta: string;
  href: string;
};

export const truths: MarriageTruth[] = [
  {
    statement: "You've turned into a team of managers, not a couple.",
    body: 'Therapy schedules, IEP meetings, who\'s covering pickup, which approach to try next. The logistics are endless, and somewhere in there the only conversations you have left are about handoffs and to-do lists.',
    tryThis:
      'Once a week, take ten minutes where the kids are completely off the table. No planning, no problem-solving. Just each other. Guard it like an appointment, because it is one.',
  },
  {
    statement: "You don't always agree on the path forward.",
    body: "One of you researches every option at 2 a.m.; one of you just needs to breathe. You grieve differently, hope differently, and process differently — and it can start to feel like you're not even on the same side.",
    tryThis:
      "Before you discuss the disagreement, say the shared goal out loud: your child thriving, your family intact. You're standing on the same ground. Argue the how from there, not from opposite corners.",
  },
  {
    statement: "There's no time that belongs to just the two of you.",
    body: "A real date feels impossible. A sitter your child trusts is hard to find. And by the time the house finally goes quiet, you're both running on fumes with nothing left to give.",
    tryThis:
      "Stop waiting for the perfect window — it isn't coming. A shared cup of coffee after bedtime counts. Protect ten honest minutes more fiercely than you'd protect a two-hour night out you'll never actually get.",
  },
  {
    statement: "One of you is carrying more — and it's growing quietly.",
    body: 'Usually one parent becomes the expert, the default, the one the school calls. The other can feel shut out. The one carrying it can feel completely alone. Either way, resentment builds in the silence.',
    tryThis:
      'Say the quiet part. "I feel alone in this" and "I don\'t know how to help you" are not attacks — they\'re the first honest step toward sharing the weight again. You can\'t split a load you won\'t name.',
  },
];

export const prompts = [
  'Tell me one good thing from today that had nothing to do with the kids.',
  "What's something I did this week that you noticed, but I never got thanked for?",
  'When did we last feel like a team? Let\'s name it out loud.',
  "What's one thing you're carrying right now that you haven't said yet?",
  'If we had a free Saturday — just us — what would you actually want to do?',
  "What's one small way I could make your mornings easier?",
  'Tell me about who you were before all of this. I want to remember them too.',
  "What are you secretly proud of in how we're handling this?",
  "What's one thing you need from me that you stopped asking for?",
  'Where do you want us to be a year from now?',
  'What made you laugh recently? Make me laugh too.',
  'Put your phone down for a second. Just look at me. Hi.',
];

export const resources: MarriageResource[] = [
  {
    title: 'Counseling that actually gets it',
    body: 'Find a couples therapist who understands raising a child with a disability. Ask them directly — experience here changes everything.',
    cta: 'Find a counselor',
    href: '/support/find',
  },
  {
    title: 'A group for both of you',
    body: 'Support groups exist for partners, not just for the parent who became the full-time caregiver. Going together changes the dynamic at home.',
    cta: 'Find a group',
    href: '/support/connect',
  },
  {
    title: "A date that doesn't require leaving",
    body: "No sitter, no budget, no problem. A set of small, doable ways to connect at home, after bedtime, when leaving the house just isn't going to happen.",
    cta: 'See the ideas',
    href: '/support/at-home',
  },
  {
    title: "When it's bigger than a rough patch",
    body: "If you're past tired and into crisis — drained, hopeless, or barely speaking — please don't wait it out alone. Reaching out early is strength, not failure.",
    cta: 'Talk to someone today',
    href: 'tel:988',
  },
];

export const headerNav = [
  { label: 'For Couples', href: '#intro' },
  { label: 'Reconnect', href: '#tool' },
  { label: 'Resources', href: '#resources' },
  { label: 'For Families', href: '/support' },
] as const;
