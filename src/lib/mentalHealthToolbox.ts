/**
 * Mental Health Toolbox — shared tool definitions for /support/caregiver and Home Base.
 */

import type { LucideIcon } from 'lucide-react';
import {
  Brain,
  Droplets,
  Hand,
  HeartHandshake,
  HeartPulse,
  Hourglass,
  Leaf,
  Sparkles,
  Wind,
} from 'lucide-react';

export type ToolCategory = 'calm-body' | 'ground-mind' | 'soften-self-talk' | 'reset-energy';

export type MentalHealthTool = {
  id: string;
  title: string;
  tag: string;
  category: ToolCategory;
  icon: LucideIcon;
  blurb: string;
  isOrb?: boolean;
  steps: string[];
  intro?: string;
  why: string;
};

export const MENTAL_HEALTH_TOOLBOX_HREF = '/support/caregiver';

/** Grounding tools surfaced on Home Base “rough day” — must exist in TOOLS. */
export const HOME_BASE_BAD_DAY_TOOL_IDS = [
  'five-four-three-two-one',
  'body-scan',
  'box-breathing',
] as const;

/** One steadying tool for Home Base “in between” — must exist in TOOLS. */
export const HOME_BASE_OKAY_DAY_TOOL_ID = 'three-minute-stop';

export const MENTAL_HEALTH_TOOLS: MentalHealthTool[] = [
  {
    id: 'four-seven-eight',
    title: '4-7-8 Breathing',
    tag: '2 min',
    category: 'calm-body',
    icon: Leaf,
    isOrb: true,
    blurb: 'A breath pattern that switches your body out of fight-or-flight in under two minutes.',
    intro:
      'Use this when your chest feels tight, your jaw is clenched, or you can feel a meltdown coming — yours or your child’s. The orb below paces it for you.',
    steps: [
      'Sit or stand comfortably. Let your shoulders drop. Tongue rests just behind your top teeth.',
      'Exhale fully through your mouth — empty everything out.',
      'Inhale quietly through your nose for 4 counts.',
      'Hold the breath for 7 counts.',
      'Exhale through your mouth for 8 counts, making a soft “whoosh.”',
      'That’s one cycle. Repeat for four cycles.',
    ],
    why:
      'The long exhale activates the vagus nerve, which signals your nervous system that the threat is over. This is a body-level reset — it works even when you can’t think your way out.',
  },
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    tag: '2 min',
    category: 'calm-body',
    icon: Wind,
    blurb: 'The breath pattern Navy SEALs and ER nurses use to stay steady under pressure.',
    intro:
      'Use this before a hard conversation, a phone call you’ve been avoiding, or a meeting at school. It’s simple enough to do at a red light.',
    steps: [
      'Exhale fully. Empty your lungs.',
      'Inhale through your nose for 4 counts.',
      'Hold the breath for 4 counts.',
      'Exhale through your nose or mouth for 4 counts.',
      'Hold empty for 4 counts.',
      'Repeat four to six rounds. That’s the box — four equal sides.',
    ],
    why:
      'Equal-ratio breathing brings your heart rate variability up, which is the physiology of calm focus. It’s the opposite of a panic spiral.',
  },
  {
    id: 'physiological-sigh',
    title: 'Physiological Sigh',
    tag: '30 sec',
    category: 'calm-body',
    icon: HeartPulse,
    blurb: 'The fastest evidence-based way to drop stress — two inhales, one long exhale.',
    intro:
      'When you only have thirty seconds — in the car, before opening a door, between bites of dinner — this is the shortest tool that actually does something.',
    steps: [
      'Inhale through your nose, deeply.',
      'On top of that, sneak in a second short inhale — also through your nose, filling whatever bit of lung is left.',
      'Then a slow, long exhale through your mouth. Make it longer than the inhales combined.',
      'Repeat one to three times. Stop when your shoulders drop.',
    ],
    why:
      'That second small inhale pops open collapsed air sacs in your lungs, and the long exhale offloads carbon dioxide quickly — which is the actual chemistry behind feeling calmer.',
  },
  {
    id: 'cold-water-reset',
    title: 'Cold Water Reset',
    tag: '1 min',
    category: 'calm-body',
    icon: Droplets,
    blurb: 'A 60-second tactic to interrupt a wave of panic or rage when nothing else is working.',
    intro:
      'Use this when you are about to say or do something you’ll regret. It is not punishment; it is a circuit breaker. Walk to the sink.',
    steps: [
      'Run the water as cold as it gets.',
      'Splash it on your face — eyes, forehead, cheeks — or hold a cold compress to the area below your eyes for 15 to 30 seconds.',
      'Or: hold the inside of your wrists under the cold stream for 30 seconds.',
      'Take three slow breaths before you walk back.',
    ],
    why:
      'Cold on the face below the eyes triggers the mammalian dive reflex — your heart rate drops, your nervous system shifts, and the adrenaline wave breaks.',
  },
  {
    id: 'five-four-three-two-one',
    title: '5-4-3-2-1 Grounding',
    tag: '3 min',
    category: 'ground-mind',
    icon: Hand,
    blurb: 'Name what is around you, sense by sense, until your brain rejoins your body.',
    intro:
      'Use this when your thoughts are racing, looping, or running ahead of you — about therapy schedules, school, money, the future.',
    steps: [
      'Name 5 things you can see right now.',
      'Name 4 things you can physically feel.',
      'Name 3 things you can hear.',
      'Name 2 things you can smell.',
      'Name 1 thing you can taste.',
    ],
    why:
      'Anxiety lives in the future. This exercise drags your attention into the present, which is the one place anxiety cannot follow you.',
  },
  {
    id: 'body-scan',
    title: '90-Second Body Scan',
    tag: '90 sec',
    category: 'ground-mind',
    icon: Brain,
    blurb: 'Find where the day is sitting in your body, and let that one spot soften.',
    intro:
      'Stress hides in specific places — jaw, shoulders, stomach, hips. You don’t have to fix all of it. Just find one place and exhale into it.',
    steps: [
      'Sit or lie down. Eyes closed if that feels okay.',
      'Move your attention from head to feet, pausing where it feels tight.',
      'Take one slow breath in. On the exhale, picture that spot getting a little softer.',
      'Move on. You don’t have to fix it. You just had to find it.',
    ],
    why:
      'Caregiver stress is often somatic before it’s cognitive. Naming where it lives is the first step to discharging it.',
  },
  {
    id: 'permission-phrase',
    title: 'Permission Phrase',
    tag: '30 sec',
    category: 'soften-self-talk',
    icon: HeartHandshake,
    blurb: 'Four sentences to interrupt the shame spiral that says you should be doing more.',
    intro:
      'Say them out loud if you can. Whisper them in the car. Your brain believes what you repeat.',
    steps: [
      '“I am allowed to be tired.”',
      '“I am allowed to need help.”',
      '“That does not make me a bad parent.”',
      '“I am doing the best I can with what I have right now.”',
    ],
    why:
      'Parents who speak to themselves the way they would speak to a struggling friend recover from hard moments measurably faster.',
  },
  {
    id: 'self-compassion-break',
    title: 'Self-Compassion Break',
    tag: '2 min',
    category: 'soften-self-talk',
    icon: HeartHandshake,
    blurb: 'A three-line script researchers use to short-circuit caregiver self-criticism.',
    intro:
      'This is the move you make right after you snap at your kid, your partner, or yourself.',
    steps: [
      'Put a hand over your heart, or on your stomach.',
      'Say: “This is a moment of difficulty.”',
      'Then: “Difficulty is part of being a parent. I am not the only one feeling this.”',
      'Then: “May I be kind to myself right now. May I give myself what I need.”',
      'Take one breath. Then go do the next small thing.',
    ],
    why:
      'These three lines map to mindfulness, common humanity, and kindness — and measurably reduce cortisol in clinical studies.',
  },
  {
    id: 'one-thing-rule',
    title: 'The One-Thing Rule',
    tag: '5 min',
    category: 'reset-energy',
    icon: Sparkles,
    blurb: 'Pick one small thing for you today. Not a list. Not a plan. One thing.',
    intro:
      'On heavy days, “self-care” turns into another item on the to-do list. Strip it down. One thing. Today.',
    steps: [
      'Pick one small thing you can actually do for yourself in the next few hours.',
      'Examples: a shower with the door locked. A walk around the block. Five minutes outside.',
      'Decide on the one thing. Out loud, if you can.',
      'Do that one thing. That is enough.',
    ],
    why:
      'Pre-committing to one tiny act of restoration removes the “what should I do for myself today” loop.',
  },
  {
    id: 'three-minute-stop',
    title: 'The 3-Minute Stop',
    tag: '3 min',
    category: 'reset-energy',
    icon: Hourglass,
    blurb: 'A short, structured pause for parents who genuinely don’t have time for self-care.',
    intro:
      'If the only quiet you’re getting is the time it takes to microwave leftovers, that is enough time for this.',
    steps: [
      'Minute 1 — Stop. Notice what you are feeling. Name it: tired, wired, angry, numb.',
      'Minute 2 — Breathe. Slow breaths through the nose. Lengthen the exhale.',
      'Minute 3 — Choose one. One sip of water. One stretch. One sentence written down.',
      'Then go back. That was real rest, even though it was small.',
    ],
    why:
      'Short, structured pauses repeated through the day outperform a single long break that never comes.',
  },
];

export const MENTAL_HEALTH_TOOL_BY_ID = Object.fromEntries(
  MENTAL_HEALTH_TOOLS.map((t) => [t.id, t]),
) as Record<string, MentalHealthTool>;

export function getToolboxToolsByIds(ids: readonly string[]): MentalHealthTool[] {
  return ids
    .map((id) => MENTAL_HEALTH_TOOL_BY_ID[id])
    .filter((t): t is MentalHealthTool => t != null);
}

export function getToolboxTool(id: string): MentalHealthTool | undefined {
  return MENTAL_HEALTH_TOOL_BY_ID[id];
}

/** @deprecated Use MENTAL_HEALTH_TOOLS — alias for caregiver page migration. */
export const TOOLS = MENTAL_HEALTH_TOOLS;

/** @deprecated Use MentalHealthTool */
export type Tool = MentalHealthTool;

/** @deprecated Use MENTAL_HEALTH_TOOL_BY_ID */
export const TOOL_BY_ID = MENTAL_HEALTH_TOOL_BY_ID;
