import type { CopyEntry, StandardRowId } from '@/content/carePlan';

const draft = (id: string, text: string): CopyEntry => ({ id, text, approval: 'draft' });

export const PARENT_FIRST_QUESTION_OVERRIDES: Partial<
  Record<StandardRowId, readonly [CopyEntry, CopyEntry, CopyEntry, CopyEntry, ...CopyEntry[]]>
> = {
  outings: [
    draft('parent-first.questions.outings.question-1', 'Can community participation become a family-priority goal?'),
    draft('parent-first.questions.outings.question-2', 'What details from a difficult outing would help you assess the concern?'),
    draft('parent-first.questions.outings.question-3', 'Can caregiver training include a real community setting or a realistic practice setting?'),
    draft('parent-first.questions.outings.question-4', 'Which type of outing should we address first, and when will we review whether it is improving?'),
  ],
  'daily-routines': [
    draft('parent-first.questions.daily-routines.question-1', 'Can this specific routine become a family-priority goal?'),
    draft('parent-first.questions.daily-routines.question-2', 'What information do you need to understand where this routine breaks down?'),
    draft('parent-first.questions.daily-routines.question-3', 'Which home expectations can be paused or simplified while this routine is reviewed?'),
    draft('parent-first.questions.daily-routines.question-4', 'When will we decide whether the current approach to this routine needs to change?'),
  ],
  'communication-wall': [
    draft('parent-first.questions.communication-wall.question-1', 'Can you show us how my child currently communicates requests, refusal, help, pain, and a break?'),
    draft('parent-first.questions.communication-wall.question-2', 'Can caregiver training cover the communication system being used in sessions?'),
    draft('parent-first.questions.communication-wall.question-3', 'Does the communication plan need coordination with speech, school, or another provider?'),
    draft('parent-first.questions.communication-wall.question-4', 'What home examples would help you judge whether communication is carrying across settings?'),
  ],
  'why-behavior': [
    draft('parent-first.questions.why-behavior.question-1', 'What is your current explanation for this pattern in plain language?'),
    draft('parent-first.questions.why-behavior.question-2', 'What observations or assessment results support that explanation?'),
    draft('parent-first.questions.why-behavior.question-3', 'What information is still uncertain or missing?'),
    draft('parent-first.questions.why-behavior.question-4', 'What new evidence would lead the team to revise its current understanding?'),
  ],
  'marriage-strain': [
    draft('parent-first.questions.marriage-strain.question-1', 'Can caregiver training include both of us in the same conversation?'),
    draft('parent-first.questions.marriage-strain.question-2', 'Can the care-related responsibilities be made clearer so the same conflict does not repeat at home?'),
    draft('parent-first.questions.marriage-strain.question-3', 'Are there counseling referrals for couples carrying disability-related caregiving strain?'),
    draft('parent-first.questions.marriage-strain.question-4', 'What part of the current home expectations could be simplified while we seek relationship support?'),
  ],
  judged: [
    draft('parent-first.questions.judged.question-1', 'Can a relative, grandparent, or sitter attend caregiver training when appropriate?'),
    draft('parent-first.questions.judged.question-2', 'What can we accurately share without disclosing private clinical information?'),
    draft('parent-first.questions.judged.question-3', 'Can you review the relatives one-pager before we use it?'),
    draft('parent-first.questions.judged.question-4', 'What is one practical support role another adult could learn through training?'),
  ],
  'cannot-keep-doing': [
    draft('parent-first.questions.cannot-keep-doing.question-1', 'Can you give me a specific referral to a therapist who understands caregiver strain?'),
    draft('parent-first.questions.cannot-keep-doing.question-2', 'What can be removed from the home expectations this week?'),
    draft('parent-first.questions.cannot-keep-doing.question-3', 'Who can I contact between sessions when I am at my limit?'),
    draft('parent-first.questions.cannot-keep-doing.question-4', 'What parent-support or crisis-navigation resources can you connect me with today?'),
  ],
  'nothing-left': [
    draft('parent-first.questions.nothing-left.question-1', 'Which home expectation can be paused or simplified first?'),
    draft('parent-first.questions.nothing-left.question-2', 'What respite resources might fit our situation, and what is the first contact step?'),
    draft('parent-first.questions.nothing-left.question-3', 'Are there parent-support or counseling referrals that focus on caregiver capacity?'),
    draft('parent-first.questions.nothing-left.question-4', 'When will we review whether the reduced expectations are actually making the week more sustainable?'),
  ],
  grieving: [
    draft('parent-first.questions.grieving.question-1', 'Do you know a counselor or group experienced with caregiver grief?'),
    draft('parent-first.questions.grieving.question-2', 'Where can I find trustworthy long-term-planning resources for our family?'),
    draft('parent-first.questions.grieving.question-3', 'Is there a parent-support referral where this grief can be discussed without turning it into a judgment about my child?'),
    draft('parent-first.questions.grieving.question-4', 'Who can help us separate immediate planning needs from fears about the distant future?'),
  ],
  disappeared: [
    draft('parent-first.questions.disappeared.question-1', 'Could scheduling make one recurring personal hour possible each week?'),
    draft('parent-first.questions.disappeared.question-2', 'Is caregiver training available for another adult who could reliably cover that hour?'),
    draft('parent-first.questions.disappeared.question-3', 'What respite or parent-support referrals may help me protect time outside caregiving?'),
    draft('parent-first.questions.disappeared.question-4', 'Which current expectation could move so this hour does not depend on finishing everything first?'),
  ],
  'thinking-stopping': [
    draft('parent-first.questions.thinking-stopping.question-1', 'Can we review the progress data in plain language before I decide?'),
    draft('parent-first.questions.thinking-stopping.question-2', 'What are the realistic options between continuing unchanged and stopping immediately?'),
    draft('parent-first.questions.thinking-stopping.question-3', 'What would the next three months look like if we continue?'),
    draft('parent-first.questions.thinking-stopping.question-4', 'If we stop or transition, what information and coordination would the family need?'),
  ],
  'no-progress': [
    draft('parent-first.questions.no-progress.question-1', 'Can you walk me through the data for the goal I am questioning?'),
    draft('parent-first.questions.no-progress.question-2', 'Where should this progress be visible outside sessions?'),
    draft('parent-first.questions.no-progress.question-3', 'How are you checking whether the skill carries across people and settings?'),
    draft('parent-first.questions.no-progress.question-4', 'At what decision point would the goal or approach be revised?'),
  ],
  'sessions-concern': [
    draft('parent-first.questions.sessions-concern.question-1', 'Can I observe a session, and what is the process for arranging it?'),
    draft('parent-first.questions.sessions-concern.question-2', 'Who will review the specific session concern I am raising?'),
    draft('parent-first.questions.sessions-concern.question-3', 'When should I expect an explanation or follow-up?'),
    draft('parent-first.questions.sessions-concern.question-4', 'Who oversees clinical care if I need to raise the concern beyond the assigned BCBA?'),
  ],
  'unclear-care': [
    draft('parent-first.questions.unclear-care.question-1', 'Can you explain each current goal in plain language?'),
    draft('parent-first.questions.unclear-care.question-2', 'Why was this goal chosen, and what family priority does it address?'),
    draft('parent-first.questions.unclear-care.question-3', 'What change should we notice outside sessions if the goal is working?'),
    draft('parent-first.questions.unclear-care.question-4', 'When and how are goals reviewed, changed, or removed with parent input?'),
  ],
  'first-months': [
    draft('parent-first.questions.first-months.question-1', 'Can you walk me through a realistic first month from evaluation through initial goals?'),
    draft('parent-first.questions.first-months.question-2', 'When will the first data and goal-review meeting happen with the family?'),
    draft('parent-first.questions.first-months.question-3', 'How often will the BCBA be directly involved, not only the direct therapist?'),
    draft('parent-first.questions.first-months.question-4', 'What early changes are reasonable to expect, and what would be premature to promise?'),
  ],
  'what-is-aba': [
    draft('parent-first.questions.what-is-aba.question-1', 'Can you explain how assessment, goals, teaching, and measurement connect in plain language?'),
    draft('parent-first.questions.what-is-aba.question-2', 'What would the family be expected to do each week?'),
    draft('parent-first.questions.what-is-aba.question-3', 'What concerns can ABA address, and when would another professional be needed?'),
    draft('parent-first.questions.what-is-aba.question-4', 'How are child dignity and family priorities included when goals are chosen?'),
  ],
};
