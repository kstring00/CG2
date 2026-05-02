import type { Prompt } from './types';

/**
 * Seeded prompt library. Edit this file to add or revise prompts.
 * Voice rules live in the build spec — short sentences, sixth-grade reading
 * level, no inspirational poster language, no "you've got this."
 */
export const PROMPTS: Prompt[] = [
  // ── Naming the day ────────────────────────────────────────────────
  {
    id: 'ntd-01',
    text: 'Walk me through the first hour of today, in order.',
    family: 'naming_the_day',
    eligible_moods: ['frayed', 'heavy', 'numb', 'steady', 'hopeful'],
    intensity: 1,
  },
  {
    id: 'ntd-02',
    text: 'What is one thing that happened today that you have not had time to think about yet?',
    family: 'naming_the_day',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 2,
  },
  {
    id: 'ntd-03',
    text: 'Name three concrete things you did today. Not how you felt about them. Just what you did.',
    family: 'naming_the_day',
    eligible_moods: ['frayed', 'numb', 'heavy', 'steady'],
    intensity: 1,
  },
  {
    id: 'ntd-04',
    text: 'What was the loudest moment of the day?',
    family: 'naming_the_day',
    eligible_moods: ['frayed', 'heavy', 'steady'],
    intensity: 2,
  },
  {
    id: 'ntd-05',
    text: 'What was the quietest moment?',
    family: 'naming_the_day',
    eligible_moods: ['steady', 'hopeful', 'heavy', 'numb'],
    intensity: 1,
  },
  {
    id: 'ntd-06',
    text: 'What did you eat today? Did you sit down for any of it?',
    family: 'naming_the_day',
    eligible_moods: ['frayed', 'numb', 'heavy', 'steady'],
    intensity: 1,
  },
  {
    id: 'ntd-07',
    text: 'Who did you talk to today, and what did they need from you?',
    family: 'naming_the_day',
    eligible_moods: ['frayed', 'steady', 'heavy'],
    intensity: 2,
  },
  {
    id: 'ntd-08',
    text: 'What is the first thing you want to forget about today?',
    family: 'naming_the_day',
    eligible_moods: ['frayed', 'heavy'],
    intensity: 3,
  },
  {
    id: 'ntd-09',
    text: 'Describe one room in your house right now. The actual mess and the actual light.',
    family: 'naming_the_day',
    eligible_moods: ['frayed', 'numb', 'heavy', 'steady', 'hopeful'],
    intensity: 1,
  },

  // ── The unsaid ────────────────────────────────────────────────────
  {
    id: 'uns-01',
    text: 'What part of today have you not told anyone yet?',
    family: 'unsaid',
    eligible_moods: ['heavy', 'numb', 'steady', 'frayed'],
    intensity: 3,
  },
  {
    id: 'uns-02',
    text: 'What is the truest sentence you could write right now, even if no one would understand it?',
    family: 'unsaid',
    eligible_moods: ['heavy', 'steady', 'numb'],
    intensity: 4,
  },
  {
    id: 'uns-03',
    text: 'Is there something you wish someone would ask you about?',
    family: 'unsaid',
    eligible_moods: ['heavy', 'numb', 'steady', 'hopeful'],
    intensity: 3,
  },
  {
    id: 'uns-04',
    text: 'What do you pretend not to feel when other people are watching?',
    family: 'unsaid',
    eligible_moods: ['heavy', 'numb', 'frayed'],
    intensity: 4,
  },
  {
    id: 'uns-05',
    text: 'Who do you wear a brave face for? What does that face cost you?',
    family: 'unsaid',
    eligible_moods: ['heavy', 'frayed', 'steady'],
    intensity: 4,
  },
  {
    id: 'uns-06',
    text: 'Is there something you would say if you were sure it would not be repeated?',
    family: 'unsaid',
    eligible_moods: ['heavy', 'frayed', 'numb', 'steady'],
    intensity: 4,
  },
  {
    id: 'uns-07',
    text: 'What thought do you keep pushing away?',
    family: 'unsaid',
    eligible_moods: ['heavy', 'numb', 'frayed'],
    intensity: 4,
  },
  {
    id: 'uns-08',
    text: 'When was the last time someone really listened? What did they hear?',
    family: 'unsaid',
    eligible_moods: ['heavy', 'numb', 'steady', 'hopeful'],
    intensity: 3,
  },

  // ── Small wins ────────────────────────────────────────────────────
  {
    id: 'win-01',
    text: 'What did your child do today that no one else would have noticed?',
    family: 'small_wins',
    eligible_moods: ['steady', 'hopeful', 'heavy', 'numb'],
    intensity: 2,
  },
  {
    id: 'win-02',
    text: 'A small thing went right today. What was it?',
    family: 'small_wins',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 1,
  },
  {
    id: 'win-03',
    text: 'When did your child try? Not succeed. Just try.',
    family: 'small_wins',
    eligible_moods: ['steady', 'hopeful', 'heavy', 'numb'],
    intensity: 2,
  },
  {
    id: 'win-04',
    text: 'What is something you would only celebrate with someone who actually gets it?',
    family: 'small_wins',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 2,
  },
  {
    id: 'win-05',
    text: 'What did you do today that took more effort than it looked like?',
    family: 'small_wins',
    eligible_moods: ['frayed', 'heavy', 'steady', 'numb'],
    intensity: 2,
  },
  {
    id: 'win-06',
    text: 'A moment of connection happened today, even briefly. Describe it.',
    family: 'small_wins',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 2,
  },
  {
    id: 'win-07',
    text: 'What got easier this week, even by a little?',
    family: 'small_wins',
    eligible_moods: ['steady', 'hopeful'],
    intensity: 2,
  },
  {
    id: 'win-08',
    text: 'Name one thing your child did six months ago that they can do without thinking now.',
    family: 'small_wins',
    eligible_moods: ['steady', 'hopeful', 'heavy', 'numb'],
    intensity: 2,
  },

  // ── The grief layer ───────────────────────────────────────────────
  {
    id: 'grf-01',
    text: 'Is there a version of parenting you thought you would have? Where does it still ache?',
    family: 'grief',
    eligible_moods: ['heavy', 'numb', 'steady'],
    intensity: 4,
  },
  {
    id: 'grf-02',
    text: 'Write about a milestone that did not arrive the way you expected.',
    family: 'grief',
    eligible_moods: ['heavy', 'steady', 'numb'],
    intensity: 4,
  },
  {
    id: 'grf-03',
    text: 'What is something you used to imagine, that you are still learning to put down?',
    family: 'grief',
    eligible_moods: ['heavy', 'steady', 'numb'],
    intensity: 4,
  },
  {
    id: 'grf-04',
    text: 'When did you last let yourself feel the sadness without trying to fix it?',
    family: 'grief',
    eligible_moods: ['heavy', 'numb'],
    intensity: 5,
  },
  {
    id: 'grf-05',
    text: 'What do other people not understand about what you are carrying?',
    family: 'grief',
    eligible_moods: ['heavy', 'frayed', 'numb'],
    intensity: 4,
  },
  {
    id: 'grf-06',
    text: 'Who in your life did you assume would be more present than they are?',
    family: 'grief',
    eligible_moods: ['heavy', 'frayed', 'numb'],
    intensity: 4,
  },
  {
    id: 'grf-07',
    text: 'What is a sentence other people say about your child that does not feel true to you?',
    family: 'grief',
    eligible_moods: ['heavy', 'frayed', 'steady'],
    intensity: 4,
  },
  {
    id: 'grf-08',
    text: 'What do you mourn quietly, that you do not name out loud?',
    family: 'grief',
    eligible_moods: ['heavy', 'numb'],
    intensity: 5,
  },
  {
    id: 'grf-09',
    text: 'Describe a moment you have been holding without crying. You can leave it on the page.',
    family: 'grief',
    eligible_moods: ['heavy', 'numb', 'frayed'],
    intensity: 5,
  },

  // ── Self-recognition ──────────────────────────────────────────────
  {
    id: 'srn-01',
    text: 'What kind of person are you becoming, that you did not used to be?',
    family: 'self_recognition',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 3,
  },
  {
    id: 'srn-02',
    text: 'What are you carrying well, even when it does not feel that way from inside?',
    family: 'self_recognition',
    eligible_moods: ['heavy', 'steady', 'hopeful', 'numb'],
    intensity: 3,
  },
  {
    id: 'srn-03',
    text: 'Where in your life have you grown, slowly, without anyone noticing?',
    family: 'self_recognition',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 3,
  },
  {
    id: 'srn-04',
    text: 'What would the version of you from three years ago be surprised you can do now?',
    family: 'self_recognition',
    eligible_moods: ['steady', 'hopeful', 'heavy', 'numb'],
    intensity: 3,
  },
  {
    id: 'srn-05',
    text: 'Who depends on you that you are showing up for, even today?',
    family: 'self_recognition',
    eligible_moods: ['frayed', 'heavy', 'numb', 'steady'],
    intensity: 2,
  },
  {
    id: 'srn-06',
    text: 'Name something you know about your child that no one else does.',
    family: 'self_recognition',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 2,
  },
  {
    id: 'srn-07',
    text: 'What part of yourself have you protected, even through the hardest months?',
    family: 'self_recognition',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 3,
  },
  {
    id: 'srn-08',
    text: 'What is a quiet skill you have built that nobody trained you for?',
    family: 'self_recognition',
    eligible_moods: ['steady', 'hopeful', 'heavy', 'numb'],
    intensity: 3,
  },

  // ── The body ──────────────────────────────────────────────────────
  {
    id: 'bdy-01',
    text: 'Where in your body are you holding today?',
    family: 'body',
    eligible_moods: ['frayed', 'heavy', 'numb', 'steady'],
    intensity: 2,
    source: 'somatic / Levine',
  },
  {
    id: 'bdy-02',
    text: 'Take one slow breath. What changed, if anything?',
    family: 'body',
    eligible_moods: ['frayed', 'heavy', 'numb', 'steady', 'hopeful'],
    intensity: 1,
  },
  {
    id: 'bdy-03',
    text: 'What does your shoulders feel like right now? Your jaw? Your stomach?',
    family: 'body',
    eligible_moods: ['frayed', 'heavy', 'numb', 'steady'],
    intensity: 2,
  },
  {
    id: 'bdy-04',
    text: 'When did you last feel rested? Not rested-enough — actually rested.',
    family: 'body',
    eligible_moods: ['frayed', 'heavy', 'numb'],
    intensity: 3,
  },
  {
    id: 'bdy-05',
    text: 'What is your body asking for that you have been ignoring?',
    family: 'body',
    eligible_moods: ['frayed', 'heavy', 'numb'],
    intensity: 3,
  },
  {
    id: 'bdy-06',
    text: 'Describe the temperature of the room. The light. The sound under the silence.',
    family: 'body',
    eligible_moods: ['steady', 'hopeful', 'numb', 'heavy'],
    intensity: 1,
  },
  {
    id: 'bdy-07',
    text: 'When did you last move your body in a way that felt good, not productive?',
    family: 'body',
    eligible_moods: ['steady', 'hopeful', 'heavy', 'numb'],
    intensity: 2,
  },
  {
    id: 'bdy-08',
    text: 'Place a hand somewhere that hurts or feels tight. What does it want you to know?',
    family: 'body',
    eligible_moods: ['heavy', 'frayed', 'numb'],
    intensity: 3,
  },

  // ── Gratitude / three things ──────────────────────────────────────
  {
    id: 'gra-01',
    text: 'Three things that went right today, however small.',
    family: 'gratitude',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 1,
    source: 'Seligman, three good things',
  },
  {
    id: 'gra-02',
    text: 'Who showed up today, in any way, that you want to remember?',
    family: 'gratitude',
    eligible_moods: ['steady', 'hopeful', 'heavy', 'numb'],
    intensity: 2,
  },
  {
    id: 'gra-03',
    text: 'Name something ordinary that worked. The car started. The coffee was hot.',
    family: 'gratitude',
    eligible_moods: ['frayed', 'heavy', 'numb', 'steady', 'hopeful'],
    intensity: 1,
  },
  {
    id: 'gra-04',
    text: 'What is a small thing about your home that you do not take for granted?',
    family: 'gratitude',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 1,
  },
  {
    id: 'gra-05',
    text: 'Who would you thank, if you had the energy to write the message?',
    family: 'gratitude',
    eligible_moods: ['steady', 'hopeful', 'heavy', 'numb'],
    intensity: 2,
  },
  {
    id: 'gra-06',
    text: 'What in your life today would your past self have called a luxury?',
    family: 'gratitude',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 2,
  },
  {
    id: 'gra-07',
    text: 'Three things you saw today that were beautiful, even for a second.',
    family: 'gratitude',
    eligible_moods: ['steady', 'hopeful', 'heavy', 'numb'],
    intensity: 1,
  },
  {
    id: 'gra-08',
    text: 'What is one part of your child you would not trade for an easier version?',
    family: 'gratitude',
    eligible_moods: ['steady', 'hopeful', 'heavy'],
    intensity: 3,
  },

  // ── Extra gentle openers (intensity 1, all moods) ─────────────────
  {
    id: 'opn-01',
    text: 'Start with a sentence about right now. The room. Your hands. What time it is.',
    family: 'naming_the_day',
    eligible_moods: ['frayed', 'heavy', 'numb', 'steady', 'hopeful'],
    intensity: 1,
  },
  {
    id: 'opn-02',
    text: 'What word would you put on today, if you could only pick one?',
    family: 'naming_the_day',
    eligible_moods: ['frayed', 'heavy', 'numb', 'steady', 'hopeful'],
    intensity: 1,
  },
  {
    id: 'opn-03',
    text: 'Write the first sentence that comes. Do not edit it.',
    family: 'naming_the_day',
    eligible_moods: ['frayed', 'heavy', 'numb', 'steady', 'hopeful'],
    intensity: 1,
  },
  {
    id: 'opn-04',
    text: 'What do you need this page to hold for you, just for tonight?',
    family: 'unsaid',
    eligible_moods: ['frayed', 'heavy', 'numb', 'steady', 'hopeful'],
    intensity: 2,
  },
  {
    id: 'opn-05',
    text: 'You can write nothing. You can write one line. You can write everything. What feels right?',
    family: 'self_recognition',
    eligible_moods: ['frayed', 'heavy', 'numb', 'steady', 'hopeful'],
    intensity: 1,
  },
];

export function pickPromptForMood(
  mood: import('./types').Mood | null,
  excludeIds: string[] = [],
): Prompt {
  const pool = PROMPTS.filter((p) => !excludeIds.includes(p.id));
  const eligible = mood
    ? pool.filter((p) => p.eligible_moods.includes(mood))
    : pool;
  const list = eligible.length > 0 ? eligible : pool.length > 0 ? pool : PROMPTS;
  return list[Math.floor(Math.random() * list.length)];
}

export function getPromptById(id: string): Prompt | undefined {
  return PROMPTS.find((p) => p.id === id);
}
