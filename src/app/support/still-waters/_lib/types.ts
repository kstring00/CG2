export type Mood = 'frayed' | 'heavy' | 'numb' | 'steady' | 'hopeful';

export type PromptFamily =
  | 'naming_the_day'
  | 'unsaid'
  | 'small_wins'
  | 'grief'
  | 'self_recognition'
  | 'body'
  | 'gratitude';

export type Prompt = {
  id: string;
  text: string;
  family: PromptFamily;
  eligible_moods: Mood[];
  intensity: 1 | 2 | 3 | 4 | 5;
  source?: string;
};

export type Entry = {
  id: string;
  createdAt: string;
  updatedAt: string;
  mood: Mood | null;
  promptId: string | null;
  promptText: string | null;
  body: string;
  meaningful?: boolean;
};

export const MOOD_LABELS: Record<Mood, string> = {
  frayed: 'Frayed',
  heavy: 'Heavy',
  numb: 'Numb',
  steady: 'Steady',
  hopeful: 'Hopeful',
};

export const FAMILY_LABELS: Record<PromptFamily, string> = {
  naming_the_day: 'Naming the day',
  unsaid: 'The unsaid',
  small_wins: 'Small wins',
  grief: 'The grief layer',
  self_recognition: 'Self-recognition',
  body: 'The body',
  gratitude: 'Gratitude',
};
