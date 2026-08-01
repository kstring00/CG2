export type Policy = 'allowed' | 'never';

export type ItemPrivacy = {
  activity: Policy;
  homeBase: Policy;
  sync: Policy;
};

export const NEVER_PRIVACY: ItemPrivacy = {
  activity: 'never',
  homeBase: 'never',
  sync: 'never',
};

export type ToolkitSectionId =
  | 'build-capacity'
  | 'catch-it-early'
  | 'get-through-it'
  | 'come-down'
  | 'long-haul';

export type ToolkitItem = {
  id: string;
  title: string;
  duration?: string;
  section: ToolkitSectionId | 'playbooks';
  descriptor?: string;
  body: string;
  privacy: ItemPrivacy;
};

const allowed: ItemPrivacy = { activity: 'allowed', homeBase: 'allowed', sync: 'allowed' };
const localOnly: ItemPrivacy = { activity: 'allowed', homeBase: 'allowed', sync: 'never' };
const sensitive: ItemPrivacy = { activity: 'never', homeBase: 'never', sync: 'never' };

export const TOOLKIT_SECTIONS: Array<{
  id: ToolkitSectionId;
  title: string;
  summary: string;
}> = [
  { id: 'build-capacity', title: 'Build capacity', summary: 'Small practices for calmer days and a stronger bench.' },
  { id: 'catch-it-early', title: 'Catch it early', summary: 'Notice the first signs before the pressure peaks.' },
  { id: 'get-through-it', title: 'Get through it', summary: 'Simple instructions for the next five minutes.' },
  { id: 'come-down', title: 'Come down', summary: 'Help your body settle after the hard moment passes.' },
  { id: 'long-haul', title: 'The long haul', summary: 'Support for grief, resentment, comparison, and isolation.' },
];

export const TOOLKIT_TOOLS: ToolkitItem[] = [
  {
    id: 'tool.doorway-reset', title: 'Doorway reset', duration: '45 sec', section: 'build-capacity', privacy: allowed,
    body: 'Before entering the next room, stop at the doorway. Drop your shoulders. Take one slow breath. Name the one thing you are walking in to do.',
  },
  {
    id: 'tool.name-your-three', title: 'Name your three', duration: '1 min', section: 'build-capacity', privacy: allowed,
    body: 'Name three things that can carry part of today: one person, one routine, and one task that can wait.',
  },
  {
    id: 'tool.recovery-bank', title: 'Recovery bank', duration: '2 min', section: 'build-capacity', privacy: allowed,
    body: 'Choose one small action that gives something back: water, sunlight, food, quiet, movement, or a text to someone safe. Do only that action.',
  },
  {
    id: 'tool.lower-the-bar', title: 'Lower the bar on purpose', duration: '1 min', section: 'build-capacity', privacy: allowed,
    body: 'Choose what “good enough” means for today. Remove one nonessential expectation before the day removes it for you.',
  },
  {
    id: 'tool.handoff-script', title: 'Handoff script', duration: '30 sec', section: 'build-capacity', privacy: allowed,
    body: 'Say: “I need ten minutes completely off. Please take over this one task until I come back.” Make the handoff specific and time-limited.',
  },
  {
    id: 'tool.brief-the-bench', title: 'Brief the bench', duration: '2 min', section: 'build-capacity', privacy: allowed,
    body: 'Tell one trusted person what helps during a difficult moment, what makes it harder, and the exact job they can take. Bring child-specific questions to your BCBA.',
  },
  {
    id: 'tool.jaw-shoulders-breath', title: 'Jaw, shoulders, breath', duration: '20 sec', section: 'catch-it-early', privacy: allowed,
    body: 'Unclench your jaw. Lower your shoulders. Breathe out longer than you breathe in. Repeat once before you speak.',
  },
  {
    id: 'tool.volume-check', title: 'Volume check', duration: '10 sec', section: 'catch-it-early', privacy: allowed,
    body: 'Notice your volume before your words. Lower it one level. Shorten the next sentence.',
  },
  {
    id: 'tool.two-minute-exit', title: 'Two-minute exit', duration: '2 min', section: 'catch-it-early', privacy: allowed,
    body: 'When another safe adult is available, step away for two minutes. Drink water, breathe, and return with one job instead of five.',
  },
  {
    id: 'tool.one-job', title: 'One job', duration: 'Right now', section: 'get-through-it', privacy: allowed,
    body: 'Choose one job for this moment: keep everyone safe, lower stimulation, or wait. Let every other problem remain unsolved for five minutes.',
  },
  {
    id: 'tool.long-exhale', title: 'The long exhale', duration: '30 sec', section: 'get-through-it', privacy: allowed,
    body: 'Take two inhales through your nose, one full and one short sip on top. Then make one long, slow exhale through your mouth. Repeat twice.',
  },
  {
    id: 'tool.feet-floor', title: 'Feet on the floor', duration: '30 sec', section: 'get-through-it', privacy: allowed,
    body: 'Press both feet into the floor. Name what they feel. Keep pressing while you make your next decision.',
  },
  {
    id: 'tool.flat-even', title: 'Flat and even', duration: 'Right now', section: 'get-through-it', privacy: allowed,
    body: 'Use fewer words, a level voice, and a slower pace. Do not add a lecture. Bring questions about your child’s plan to the BCBA.',
  },
  {
    id: 'tool.silent-sentence', title: 'The silent sentence', duration: '10 sec', section: 'get-through-it', privacy: allowed,
    body: 'Say silently: “I do not have to solve the whole day in this minute.” Then return to the one job in front of you.',
  },
  {
    id: 'tool.shake-it-out', title: 'Shake it out', duration: '45 sec', section: 'come-down', privacy: allowed,
    body: 'Shake out your hands and arms. Roll your shoulders. Let your body finish the stress response before you start analyzing it.',
  },
  {
    id: 'tool.three-line-debrief', title: 'The three-line debrief', duration: '2 min', section: 'come-down', privacy: allowed,
    body: 'Write only three lines: what happened, what helped, and what needs to be brought to the care team. Stop there.',
  },
  {
    id: 'tool.reconnect-no-speech', title: 'Reconnect without a speech', duration: '1 min', section: 'come-down', privacy: allowed,
    body: 'Reconnect with one ordinary action: sit nearby, offer water, start the next familiar routine, or say one calm sentence. Skip the speech.',
  },
  {
    id: 'tool.permission-not-analyze', title: 'Permission to not analyze', duration: 'For now', section: 'come-down', privacy: allowed,
    body: 'Give yourself twenty minutes before reviewing the moment. Eat, sit, shower, or breathe first. Reflection works better after your body settles.',
  },
  {
    id: 'tool.handled-it-badly', title: 'When you handled it badly', duration: 'Private', section: 'come-down', privacy: sensitive,
    body: 'Make the next safe choice. Step away if another safe adult can take over. Repair with a short, honest sentence. If anyone may be unsafe, contact immediate support.',
  },
  {
    id: 'tool.grief-no-schedule', title: 'Grief has no schedule', duration: '3 min', section: 'long-haul', privacy: localOnly,
    body: 'Name what you miss without arguing with yourself about whether you are allowed to miss it. Grief and love can exist together.',
  },
  {
    id: 'tool.resentment-information', title: 'Resentment is information', duration: '3 min', section: 'long-haul', privacy: localOnly,
    body: 'Ask what load has gone unnamed. Choose one concrete request, boundary, or handoff instead of turning the feeling into a verdict about yourself.',
  },
  {
    id: 'tool.comparison-blackout', title: 'The comparison blackout', duration: 'Today', section: 'long-haul', privacy: localOnly,
    body: 'Mute one account, group, or conversation that turns another family’s life into a measurement of yours. Revisit it only when comparison has less power.',
  },
  {
    id: 'tool.twenty-minutes', title: "Twenty minutes that aren't about him", duration: '20 min', section: 'long-haul', privacy: localOnly,
    body: 'Choose twenty minutes with no therapy research, scheduling, documentation, or problem-solving. Do one thing that belongs to you.',
  },
  {
    id: 'tool.one-text-rule', title: 'The one-text rule', duration: '1 min', section: 'long-haul', privacy: localOnly,
    body: 'Send one honest text to one safe person: “Today is heavy. I do not need advice. I just need someone to know.”',
  },
  {
    id: 'tool.need-own-support', title: 'Signs you need your own support', duration: 'Private', section: 'long-haul', privacy: sensitive,
    body: 'Consider reaching out to a licensed mental-health professional when distress keeps returning, daily functioning is changing, or you feel unable to stay safe. Immediate danger requires emergency help.',
  },
];

export const TOOLKIT_PLAYBOOKS: ToolkitItem[] = [
  { id: 'playbook.public-meltdown', title: 'The meltdown in public', descriptor: 'Reduce the audience and choose one job.', section: 'playbooks', privacy: allowed, body: 'Move toward the safest lower-stimulation option available. Use fewer words. Let unfinished errands stay unfinished. Review child-specific safety planning with the BCBA later.' },
  { id: 'playbook.sibling-saw-it', title: 'The sibling who saw it', descriptor: 'Reconnect without making them carry the moment.', section: 'playbooks', privacy: allowed, body: 'Check safety first. Later, give a short truthful explanation, make room for their feeling, and offer ordinary connection. Do not ask them to become the helper.' },
  { id: 'playbook.family-too-soft', title: "Family who think you're too soft", descriptor: 'Hold the boundary without defending the whole plan.', section: 'playbooks', privacy: allowed, body: 'Say: “We are following a plan with his care team. I am not debating it during a hard moment.” Redirect child-specific questions to the parents and clinicians.' },
  { id: 'playbook.regression', title: 'After a regression', descriptor: 'Separate the hard week from the whole trajectory.', section: 'playbooks', privacy: allowed, body: 'Write down observable changes, dates, and context without guessing the cause. Bring the pattern to the BCBA or appropriate provider. Do not redesign the plan alone.' },
  { id: 'playbook.hard-clinic-day', title: 'After a hard day at clinic', descriptor: 'Decompress before reviewing the details.', section: 'playbooks', privacy: allowed, body: 'Meet basic needs first. Then write the one question you need answered by the care team. A hard session is information, not a verdict on the child or parent.' },
  { id: 'playbook.not-for-me', title: 'Works for them, not for me', descriptor: 'Keep the principle, release the comparison.', section: 'playbooks', privacy: allowed, body: 'Name what part did not fit: timing, access, support, energy, or family context. Choose a smaller version or ask the provider for another option.' },
  { id: 'playbook.dismissed-meeting', title: 'The meeting where you felt dismissed', descriptor: 'Leave with one documented next step.', section: 'playbooks', privacy: allowed, body: 'Write the concern in observable terms. Ask who owns the next step and when you should expect a response. Follow up in writing without adding a confrontation script.' },
  { id: 'playbook.hurt-you', title: 'When they hurt you', descriptor: 'Safety first, then support for everyone involved.', section: 'playbooks', privacy: sensitive, body: 'Move toward immediate safety and get another adult when available. Seek medical help when needed. Bring the event to the clinical team; do not infer function or change the behavior plan here.' },
  { id: 'playbook.2am', title: '2am', descriptor: 'Make the night smaller.', section: 'playbooks', privacy: sensitive, body: 'Choose the next ten minutes only. Lower light and demands where safely possible. Drink water. Delay nonurgent decisions until morning. Reach immediate support if anyone may be unsafe.' },
];

export const TOOLKIT_ITEMS: ToolkitItem[] = [...TOOLKIT_TOOLS, ...TOOLKIT_PLAYBOOKS];
export const TOOLKIT_ITEM_BY_ID: Record<string, ToolkitItem> = Object.fromEntries(TOOLKIT_ITEMS.map((item) => [item.id, item]));

for (const item of TOOLKIT_ITEMS) {
  if (!item.privacy) throw new Error(`Unclassified toolkit item: ${item.id}`);
  for (const key of ['activity', 'homeBase', 'sync'] as const) {
    if (item.privacy[key] !== 'allowed' && item.privacy[key] !== 'never') {
      throw new Error(`Invalid ${key} privacy policy for toolkit item: ${item.id}`);
    }
  }
}
