import type { CopyEntry } from '@/content/carePlan';

const draft = (id: string, text: string): CopyEntry => ({
  id,
  text,
  approval: 'draft',
});

export const PARENT_FIRST_TEAM_NO_QUESTIONS = {
  'big-moments': [
    draft(
      'parent-first.team-no.big-moments.question-1',
      'How would your assessment capture incidents that happen at home but may not appear during clinic visits?',
    ),
    draft(
      'parent-first.team-no.big-moments.question-2',
      'What incident information should we bring so your clinical team can judge severity and urgency?',
    ),
    draft(
      'parent-first.team-no.big-moments.question-3',
      'How do you decide whether caregiver training, a written safety plan, or additional support hours should be considered?',
    ),
    draft(
      'parent-first.team-no.big-moments.question-4',
      'Who would the family contact between scheduled visits when an incident raises a safety concern?',
    ),
    draft(
      'parent-first.team-no.big-moments.question-5',
      'What would happen after we report several serious home incidents, and when would we receive a clinical decision?',
    ),
  ],
  outings: [
    draft(
      'parent-first.team-no.outings.question-1',
      'How would your assessment include the community settings our family is currently avoiding?',
    ),
    draft(
      'parent-first.team-no.outings.question-2',
      'Can family priorities such as medical visits, shopping, worship, or sibling events influence how goals are selected?',
    ),
    draft(
      'parent-first.team-no.outings.question-3',
      'When clinically appropriate, how does your program assess or provide caregiver training outside the clinic?',
    ),
    draft(
      'parent-first.team-no.outings.question-4',
      'How would you choose which type of outing to address first, and what information would you need from us?',
    ),
    draft(
      'parent-first.team-no.outings.question-5',
      'What early change would you measure before expecting a complete successful outing?',
    ),
  ],
  'daily-routines': [
    draft(
      'parent-first.team-no.daily-routines.question-1',
      'How would our hardest home routine be considered when goals are chosen?',
    ),
    draft(
      'parent-first.team-no.daily-routines.question-2',
      'What information would you need to define the beginning, ending, and practical cost of that routine?',
    ),
    draft(
      'parent-first.team-no.daily-routines.question-3',
      'How is caregiver training adapted to the adults and time of day when the routine actually occurs?',
    ),
    draft(
      'parent-first.team-no.daily-routines.question-4',
      'How would you measure whether the routine is becoming more workable for the family?',
    ),
    draft(
      'parent-first.team-no.daily-routines.question-5',
      'When would the team reconsider its approach if the routine continued disrupting the household?',
    ),
  ],
  'communication-wall': [
    draft(
      'parent-first.team-no.communication-wall.question-1',
      'How would you assess the ways my child currently communicates needs, refusal, help, pain, and confusion?',
    ),
    draft(
      'parent-first.team-no.communication-wall.question-2',
      'How are caregivers taught to understand and use the communication system selected for their child?',
    ),
    draft(
      'parent-first.team-no.communication-wall.question-3',
      'How do you coordinate communication goals with speech-language, school, or other providers when needed?',
    ),
    draft(
      'parent-first.team-no.communication-wall.question-4',
      'What home examples would help you evaluate whether communication skills are transferring outside sessions?',
    ),
    draft(
      'parent-first.team-no.communication-wall.question-5',
      'How often would we review whether the family is understanding one another more clearly at home?',
    ),
  ],
  'why-behavior': [
    draft(
      'parent-first.team-no.why-behavior.question-1',
      'How would you determine why a behavior persists without relying only on a label or caregiver guess?',
    ),
    draft(
      'parent-first.team-no.why-behavior.question-2',
      'Which parts of your assessment come from direct observation, caregiver report, records, or formal analysis?',
    ),
    draft(
      'parent-first.team-no.why-behavior.question-3',
      'How would you explain the current clinical hypothesis to us in plain language and show what evidence supports it?',
    ),
    draft(
      'parent-first.team-no.why-behavior.question-4',
      'What kind of new information would cause your team to revise its understanding?',
    ),
    draft(
      'parent-first.team-no.why-behavior.question-5',
      'How would caregivers be taught what to observe and report without being asked to interpret the function themselves?',
    ),
  ],
} as const;
