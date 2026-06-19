import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeftRight,
  Baby,
  Clock,
  Heart,
  HeartHandshake,
  MessageCircle,
  RefreshCw,
  Repeat,
  ShieldAlert,
  Users,
  VolumeX,
} from 'lucide-react';

export type SituationId =
  | 'same-fight'
  | 'co-parents'
  | 'parent-differently'
  | 'no-time'
  | 'communication'
  | 'reconnect';

export type SituationCard = {
  id: SituationId;
  title: string;
  description: string;
  icon: LucideIcon;
  reassurance: string;
};

export const SITUATIONS: SituationCard[] = [
  {
    id: 'same-fight',
    title: 'We keep having the same fight',
    description: 'Same topics, same pain, different day.',
    icon: Repeat,
    reassurance:
      'Repeating fights usually mean an unmet need is still unnamed — not that you’re failing.',
  },
  {
    id: 'co-parents',
    title: 'We feel more like co-parents than partners',
    description: 'The “us” has taken a backseat.',
    icon: Users,
    reassurance:
      'When parenting takes center stage, connection can feel distant — and that is recoverable.',
  },
  {
    id: 'parent-differently',
    title: 'We parent differently',
    description: 'Different styles are causing tension.',
    icon: ArrowLeftRight,
    reassurance:
      'Different styles are common; alignment on values matters more than matching every tactic.',
  },
  {
    id: 'no-time',
    title: 'We barely have time for us',
    description: 'Busy, exhausted, and running on empty.',
    icon: Clock,
    reassurance:
      'Small moments count. You don’t need a date night to start rebuilding closeness.',
  },
  {
    id: 'communication',
    title: 'Stress is hurting our communication',
    description: 'Short tempers, shutdowns, or distance.',
    icon: VolumeX,
    reassurance:
      'Stress shrinks our capacity to listen. Pausing is a skill — not avoidance.',
  },
  {
    id: 'reconnect',
    title: 'We need help rebuilding connection',
    description: 'We want closeness again.',
    icon: HeartHandshake,
    reassurance:
      'Wanting closeness again is already a step toward it. You’re not starting from zero.',
  },
];

export const FOUR_STEPS = [
  {
    step: 1,
    title: 'Pause the pattern',
    body: 'Take a breath. Notice escalation. Hit pause.',
    icon: RefreshCw,
  },
  {
    step: 2,
    title: 'Name what’s underneath',
    body: 'Identify the need, fear, hurt, or stress driving it.',
    icon: MessageCircle,
  },
  {
    step: 3,
    title: 'Use a short repair',
    body: 'A few caring words can change the tone.',
    icon: Heart,
  },
  {
    step: 4,
    title: 'Decide if you need outside support',
    body: 'There’s strength in getting help.',
    icon: HeartHandshake,
  },
] as const;

export const QUICK_CHECKLIST = [
  'We’re both willing to pause.',
  'We will listen without interrupting.',
  'We’ll speak using “I” statements.',
  'We’ll take one small action for connection.',
] as const;

export type ResourceId =
  | 'conflict-repair'
  | 'communication-scripts'
  | 'division-of-labor'
  | 'reconnecting'
  | 'parenting-team'
  | 'after-argument'
  | 'weekly-checkin'
  | 'counseling';

export type ResourceCard = {
  id: ResourceId;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

export const RESOURCES: ResourceCard[] = [
  {
    id: 'conflict-repair',
    title: 'Conflict Repair Guide',
    description: 'Step-by-step repair phrases that actually work.',
    icon: RefreshCw,
    href: '#insight-conflict',
  },
  {
    id: 'communication-scripts',
    title: 'Communication Scripts',
    description: 'What to say and what not to say when things get hard.',
    icon: MessageCircle,
    href: '#insight-conflict',
  },
  {
    id: 'division-of-labor',
    title: 'Division of Labor Reset',
    description: 'Fairer tasks, less resentment, more teamwork.',
    icon: Users,
    href: '#insight-decisions',
  },
  {
    id: 'reconnecting',
    title: 'Reconnecting After Hard Seasons',
    description: 'Gentle ways to rebuild closeness.',
    icon: HeartHandshake,
    href: '#reset',
  },
  {
    id: 'parenting-team',
    title: 'Parenting as a Team',
    description: 'Align on values, routines, and boundaries.',
    icon: Baby,
    href: '#insight-parenting-stress',
  },
  {
    id: 'after-argument',
    title: 'After-the-Argument Recovery',
    description: 'How to repair fast and learn without blaming.',
    icon: Repeat,
    href: '#insight-conflict',
  },
  {
    id: 'weekly-checkin',
    title: 'Weekly Marriage Check-In',
    description: 'A 30-minute rhythm that keeps you aligned.',
    icon: Clock,
    href: '#reset',
  },
  {
    id: 'counseling',
    title: 'When to Seek Counseling',
    description: 'Signs, benefits, and how to get started.',
    icon: ShieldAlert,
    href: '#extra-support',
  },
];

export const RESET_PROMPTS = [
  'What has felt heavy for you lately?',
  'What do you need more of from me this week?',
  'Where are we working well as a team?',
  'What is one small way we can reconnect this week?',
  'What would help you feel supported tonight?',
] as const;

export type InsightId =
  | 'conflict'
  | 'parenting-stress'
  | 'trust'
  | 'decisions'
  | 'burnout'
  | 'logistics';

export type CounselorInsight = {
  id: InsightId;
  title: string;
  summary: string;
  body: string[];
};

export const COUNSELOR_INSIGHTS: CounselorInsight[] = [
  {
    id: 'conflict',
    title: 'Managing conflict without attacking or withdrawing',
    summary: 'Stay in the conversation without flooding or shutting down.',
    body: [
      'When parenting stress is high, conflict often sounds like criticism but is really fear — fear of being alone in the load, fear of getting it wrong, fear of losing each other.',
      'Try a time-out signal you both agree on before voices rise. Return within 30 minutes with one sentence: “What I was really worried about was…”',
      'Repairs don’t require a perfect apology. “I didn’t like how I said that. I care about us” is often enough to reopen safety.',
    ],
  },
  {
    id: 'parenting-stress',
    title: 'Staying connected during parenting stress',
    summary: 'Protect small rituals when schedules feel impossible.',
    body: [
      'Connection doesn’t require long blocks of time. A two-minute check-in at the kitchen counter, a text that says “I see how hard today was,” or sitting together for five minutes after bedtime can hold the relationship steady.',
      'Name the season you’re in: diagnosis paperwork, therapy schedules, meltdowns, IEP meetings. Seasons pass, but unspoken resentment can linger.',
      'Ask: “What would help you feel like we’re on the same team this week?” — then pick one doable action together.',
    ],
  },
  {
    id: 'trust',
    title: 'Repairing trust and emotional safety',
    summary: 'Rebuild safety with consistency, not grand gestures.',
    body: [
      'Trust grows when words and follow-through match — especially in small things like who handles bedtime or who makes the next call.',
      'If one partner has felt dismissed, listen longer than feels comfortable before problem-solving.',
      'Share appreciations out loud. Parents under stress often notice what went wrong; naming what went right rebuilds warmth.',
    ],
  },
  {
    id: 'decisions',
    title: 'Making decisions together when you disagree',
    summary: 'Separate the decision from the relationship.',
    body: [
      'Therapy choices, school plans, and discipline approaches can feel high-stakes. Start by naming shared values: safety, dignity, progress, family peace.',
      'Use “What are we each afraid will happen?” before debating tactics. Fear is often the real disagreement.',
      'If you stall, agree on a small experiment for two weeks, then revisit — progress beats perfect agreement.',
    ],
  },
  {
    id: 'burnout',
    title: 'Protecting your marriage from burnout',
    summary: 'Treat exhaustion as a relationship issue, not a personal flaw.',
    body: [
      'Caregiver burnout shows up as irritability, numbness, and distance. It is not a sign you’ve stopped loving each other.',
      'Audit the invisible load: appointments, research, advocacy, emotional labor. Split by strength and capacity, not by default.',
      'Schedule recovery for both partners — even 20 minutes — and protect it like a therapy appointment.',
    ],
  },
  {
    id: 'logistics',
    title: 'Talking about money, schedules, and responsibilities',
    summary: 'Practical talks work best when they’re planned, not heated.',
    body: [
      'Pick a calm time for logistics conversations — not during a meltdown or right after a hard day.',
      'Use a simple agenda: what’s working, what’s unfair, one change to try this week.',
      'Money stress and schedule chaos are common in autism families. Getting help with planning is a strength, not a failure.',
    ],
  },
];

export const EXTRA_SUPPORT_SIGNS = [
  'Recurring contempt, name-calling, or put-downs',
  'Feeling emotionally alone or unseen',
  'Frequent shutdowns or walking on eggshells',
  'Previous infidelity or breaches of trust',
] as const;

export const CONVERSATION_GUIDE_TEXT = `Common Ground — 10-Minute Relationship Reset

Put phones away. Look at each other. Listen like it matters — because it does.

Prompts:
1. What has felt heavy for you lately?
2. What do you need more of from me this week?
3. Where are we working well as a team?
4. What is one small way we can reconnect this week?
5. What would help you feel supported tonight?

Small, consistent steps build safety and closeness over time.
`;
