import type {
  ActionDefinition,
  CopyEntry,
  RowCategory,
  StandardRowId,
} from '@/content/carePlan';

export type DraftResponseGuide = {
  substantive: CopyEntry;
  incomplete: CopyEntry;
  followUp: CopyEntry;
};

export type DraftSixBeatRow = {
  category: RowCategory;
  explanation: CopyEntry[];
  actionOverride?: ActionDefinition;
  responseGuide: DraftResponseGuide;
};

const d = (id: string, text: string): CopyEntry => ({
  id,
  text,
  approval: 'draft',
});

export const SIX_BEAT_UI = {
  explanationHeading: d('six-beat.ui.explanation-heading', 'Why this can happen'),
  responseGuideHeading: d('six-beat.ui.response-guide-heading', 'What a real answer sounds like'),
  substantiveLabel: d('six-beat.ui.substantive-label', 'A substantive answer'),
  incompleteLabel: d('six-beat.ui.incomplete-label', 'A brush-off'),
  followUpLabel: d('six-beat.ui.follow-up-label', 'You can say'),
} as const;

export const CARE_PLAN_SIX_BEAT_DRAFTS: Record<StandardRowId, DraftSixBeatRow> = {
  'big-moments': {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.big-moments.explanation-1', "Clinical decisions are built from observed patterns, and much of the team's data may come from sessions."),
      d('six-beat.row.big-moments.explanation-2', 'Sessions are different from a crowded evening at home: the setting, demands, people, and available support can all change what happens. Concrete home incidents help close that blind spot without asking you to decide why the behavior occurred.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.big-moments.response-substantive', 'A substantive answer refers to your actual incidents, names what the team will review, identifies who is responsible, and gives a date for the next update.'),
      incomplete: d('six-beat.row.big-moments.response-incomplete', 'A brush-off offers reassurance or says the behavior is common without explaining what will be reviewed or changed.'),
      followUp: d('six-beat.row.big-moments.response-follow-up', '“I understand this may be common. What will the team review because it is happening in our home, and when will we hear the next step?”'),
    },
  },
  outings: {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.outings.explanation-1', 'A program can show progress inside a clinic while missing whether the family can use ordinary places such as stores, parks, appointments, or restaurants.'),
      d('six-beat.row.outings.explanation-2', 'Community access usually has to be named clearly before the team can decide whether it belongs in goals, caregiver training, or another support discussion.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.outings.response-substantive', 'A substantive answer identifies whether community access belongs in the program, what information is needed, and how progress outside the clinic would be measured.'),
      incomplete: d('six-beat.row.outings.response-incomplete', 'A brush-off says to keep trying outings without connecting the problem to goals, training, or a review.'),
      followUp: d('six-beat.row.outings.response-follow-up', '“Staying home is affecting family life. What part of the program can address community access, and what happens next?”'),
    },
  },
  'daily-routines': {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.daily-routines.explanation-1', 'A routine can look minor on a report and still consume an hour of the family’s day, disrupt work or school, and leave everyone depleted.'),
      d('six-beat.row.daily-routines.explanation-2', 'The clinical team may not see that cumulative cost unless the parent names one routine, its duration, and what it prevents the family from doing afterward.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.daily-routines.response-substantive', 'A substantive answer translates the routine into a measurable concern, says what the team will assess, and names what can be simplified while that review happens.'),
      incomplete: d('six-beat.row.daily-routines.response-incomplete', 'A brush-off says the routine takes time or tells the family to stay consistent without addressing the daily cost.'),
      followUp: d('six-beat.row.daily-routines.response-follow-up', '“I need this routine treated as a family-impact issue. What will be assessed, and what can be simplified now?”'),
    },
  },
  'communication-wall': {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.communication-wall.explanation-1', 'A child may be learning a communication system in sessions while the adults at home have not been taught how to recognize, prompt, or respond to that same system.'),
      d('six-beat.row.communication-wall.explanation-2', 'When the system does not travel across people and settings, the problem can look like refusal or confusion even though the missing piece is shared fluency.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.communication-wall.response-substantive', 'A substantive answer explains the current communication system in plain language, shows the caregiver what to notice, and schedules a way to practice or review it.'),
      incomplete: d('six-beat.row.communication-wall.response-incomplete', 'A brush-off says the child is still learning without checking whether the adults were taught the same system.'),
      followUp: d('six-beat.row.communication-wall.response-follow-up', '“What exactly should we recognize and understand at home, and when can someone show us?”'),
    },
  },
  'why-behavior': {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.why-behavior.explanation-1', 'A clinical explanation of behavior is a working hypothesis built from patterns: what tends to happen before, what follows, where it occurs, and where it does not.'),
      d('six-beat.row.why-behavior.explanation-2', 'It is not mind-reading and it can change when new information appears. The parent can ask what evidence supports the current explanation and what remains uncertain.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.why-behavior.response-substantive', 'A substantive answer distinguishes observation from hypothesis, explains the evidence, and names what the team is still testing.'),
      incomplete: d('six-beat.row.why-behavior.response-incomplete', 'A brush-off gives a one-word function or a confident explanation without showing how the team reached it.'),
      followUp: d('six-beat.row.why-behavior.response-follow-up', '“What evidence supports that explanation, and what would tell us it is wrong?”'),
    },
  },
  alone: {
    category: 'parent-load',
    explanation: [
      d('six-beat.row.alone.explanation-1', 'Home recommendations can quietly assume that adults trade off: one covers a session, one handles the evening, or one gets a break while the other steps in.'),
      d('six-beat.row.alone.explanation-2', 'When there is only one available adult, the same program can become mathematically impossible. Unless the team knows the real staffing of the home, missed follow-through may be mistaken for unwillingness instead of lack of capacity.'),
    ],
    actionOverride: {
      heading: d('six-beat.row.alone.action-heading', 'Say one sentence at your next session.'),
      body: [
        d('six-beat.row.alone.action-body-1', '“I’m the only adult doing this. The home program needs to be built for one person, not two.”'),
        d('six-beat.row.alone.action-body-2', 'That sentence is enough to start a review. You do not need to prepare a log first.'),
      ],
    },
    responseGuide: {
      substantive: d('six-beat.row.alone.response-substantive', 'A substantive answer names specific expectations that will be removed, reduced, moved into sessions, or reviewed—and gives a date for the change.'),
      incomplete: d('six-beat.row.alone.response-incomplete', 'A brush-off says “do what you can” or delays the conversation without changing the program.'),
      followUp: d('six-beat.row.alone.response-follow-up', '“I need something concrete to change this week. What can come off the list now?”'),
    },
  },
  'marriage-strain': {
    category: 'parent-load',
    explanation: [
      d('six-beat.row.marriage-strain.explanation-1', 'Caregiving can create separate information streams, unequal responsibilities, and almost no protected time to repair ordinary conflict.'),
      d('six-beat.row.marriage-strain.explanation-2', 'Two partners may be reacting to different versions of the same week. Bringing both adults into the same clinical explanation or training conversation can make the load visible without asking the BCBA to become a couples counselor.'),
    ],
    actionOverride: {
      heading: d('six-beat.row.marriage-strain.action-heading', 'Say one sentence to the care team.'),
      body: [
        d('six-beat.row.marriage-strain.action-body-1', '“The caregiving load is affecting our marriage. We need support that includes both of us.”'),
        d('six-beat.row.marriage-strain.action-body-2', 'You do not need to explain the whole relationship before asking what joint training, scheduling, or referral options may exist.'),
      ],
    },
    responseGuide: {
      substantive: d('six-beat.row.marriage-strain.response-substantive', 'A substantive answer stays within the team’s role, identifies a joint training or communication option, and provides any available referral process.'),
      incomplete: d('six-beat.row.marriage-strain.response-incomplete', 'A brush-off tells the couple to communicate better without addressing how the care program, schedule, or information flow is contributing.'),
      followUp: d('six-beat.row.marriage-strain.response-follow-up', '“I’m not asking the BCBA to counsel our marriage. I’m asking what the care team can change so both caregivers are included.”'),
    },
  },
  'partner-load': {
    category: 'parent-load',
    explanation: [
      d('six-beat.row.partner-load.explanation-1', 'Caregiving work is often split across appointments, messages, paperwork, routines, and the emotional labor of remembering what happens next.'),
      d('six-beat.row.partner-load.explanation-2', 'A partner may see isolated tasks while the other person carries the whole system. The team cannot solve the relationship, but it may be able to remove scheduling barriers and include both caregivers in training.'),
    ],
    actionOverride: {
      heading: d('six-beat.row.partner-load.action-heading', 'Use one sentence to make the gap visible.'),
      body: [
        d('six-beat.row.partner-load.action-body-1', '“My partner is not currently included in the training or scheduling, and I cannot carry the home program alone.”'),
        d('six-beat.row.partner-load.action-body-2', 'That is enough to ask for one concrete participation option without building a scorecard between partners.'),
      ],
    },
    responseGuide: {
      substantive: d('six-beat.row.partner-load.response-substantive', 'A substantive answer names one realistic way the second caregiver can participate and identifies what will change if they cannot.'),
      incomplete: d('six-beat.row.partner-load.response-incomplete', 'A brush-off says both parents should be consistent without addressing access, scheduling, or divided responsibilities.'),
      followUp: d('six-beat.row.partner-load.response-follow-up', '“Consistency is not possible with the current setup. What participation option can we schedule, or what should be removed?”'),
    },
  },
  judged: {
    category: 'parent-load',
    explanation: [
      d('six-beat.row.judged.explanation-1', 'Relatives may see only the visible moment and not the demands, communication barriers, or clinical goals surrounding it.'),
      d('six-beat.row.judged.explanation-2', 'General explanations rarely change behavior from adults. A short, team-reviewed description of what the family is managing and one concrete way to help is more useful than defending every decision.'),
    ],
    actionOverride: {
      heading: d('six-beat.row.judged.action-heading', 'Choose one person and make one clear request.'),
      body: [
        d('six-beat.row.judged.action-body-1', 'Say: “I need help, not advice. Can you take one specific task this week?”'),
        d('six-beat.row.judged.action-body-2', 'The task can be ordinary—bring dinner, sit with a sibling, or drive to an appointment. You do not need to educate everyone before asking for practical help.'),
      ],
    },
    responseGuide: {
      substantive: d('six-beat.row.judged.response-substantive', 'A substantive answer helps define what can be shared, what relatives can be taught, and how the team can review the information.'),
      incomplete: d('six-beat.row.judged.response-incomplete', 'A brush-off says family members simply need to be more supportive without giving them a role or accurate explanation.'),
      followUp: d('six-beat.row.judged.response-follow-up', '“What can we give relatives that is accurate, private, and specific about how they can help?”'),
    },
  },
  'cannot-keep-doing': {
    category: 'parent-load',
    explanation: [
      d('six-beat.row.cannot-keep-doing.explanation-1', 'Sustained caregiving without reliable relief can keep a person in a constant state of alert while everyone’s attention remains on the child.'),
      d('six-beat.row.cannot-keep-doing.explanation-2', 'Parents can become skilled at appearing functional even when their capacity is gone. Looking composed may be exactly why other people do not understand how urgent the need for support has become.'),
    ],
    actionOverride: {
      heading: d('six-beat.row.cannot-keep-doing.action-heading', 'Pick one person and send one sentence now.'),
      body: [
        d('six-beat.row.cannot-keep-doing.action-body-1', 'Send: “I’m at my limit and I need you to check on me this week.”'),
        d('six-beat.row.cannot-keep-doing.action-body-2', 'Sending it is the whole task. Choose a trusted person, healthcare professional, faith leader, therapist, or crisis counselor.'),
      ],
    },
    responseGuide: {
      substantive: d('six-beat.row.cannot-keep-doing.response-substantive', 'A substantive answer treats the statement as urgent, gives a specific referral or contact route, and identifies something concrete that can be reduced now.'),
      incomplete: d('six-beat.row.cannot-keep-doing.response-incomplete', 'A brush-off says to practice self-care or rest without connecting the parent to a person or changing the load.'),
      followUp: d('six-beat.row.cannot-keep-doing.response-follow-up', '“I’m telling you I’m not okay. I need a referral or a concrete reduction, not general encouragement.”'),
    },
  },
  'nothing-left': {
    category: 'parent-load',
    explanation: [
      d('six-beat.row.nothing-left.explanation-1', 'A home program can become unworkable when it assumes time, attention, or emotional energy the parent no longer has.'),
      d('six-beat.row.nothing-left.explanation-2', 'When capacity changes, the plan has to be reviewed. Continuing to add reminders to an overloaded person can make follow-through worse while hiding the real issue from the team.'),
    ],
    actionOverride: {
      heading: d('six-beat.row.nothing-left.action-heading', 'Say one sentence at the next session.'),
      body: [
        d('six-beat.row.nothing-left.action-body-1', '“I have nothing left to give. What can be removed or simplified this week?”'),
        d('six-beat.row.nothing-left.action-body-2', 'You do not need to prove exhaustion with a log. The sentence itself is the capacity information.'),
      ],
    },
    responseGuide: {
      substantive: d('six-beat.row.nothing-left.response-substantive', 'A substantive answer names something that will pause, shrink, move into sessions, or be reviewed and gives a time for follow-up.'),
      incomplete: d('six-beat.row.nothing-left.response-incomplete', 'A brush-off praises the parent’s strength or says to do their best without changing any expectation.'),
      followUp: d('six-beat.row.nothing-left.response-follow-up', '“Thank you, but I need the program adjusted to the capacity I actually have. What changes now?”'),
    },
  },
  grieving: {
    category: 'parent-load',
    explanation: [
      d('six-beat.row.grieving.explanation-1', 'Parents can love the child in front of them while grieving expectations about independence, ease, family routines, or the future.'),
      d('six-beat.row.grieving.explanation-2', 'The grief often stays hidden because parents fear it will be heard as rejection. Hidden grief does not disappear; it becomes another burden carried without support.'),
    ],
    actionOverride: {
      heading: d('six-beat.row.grieving.action-heading', 'Choose one safe person and say one sentence.'),
      body: [
        d('six-beat.row.grieving.action-body-1', '“I love my child, and I am grieving too. I need you to hear that without correcting me.”'),
        d('six-beat.row.grieving.action-body-2', 'You do not need to explain or defend the feeling before asking someone to listen.'),
      ],
    },
    responseGuide: {
      substantive: d('six-beat.row.grieving.response-substantive', 'A substantive answer acknowledges both love and grief and offers a specific referral, resource, or support route.'),
      incomplete: d('six-beat.row.grieving.response-incomplete', 'A brush-off tells the parent to focus on the positive or be grateful without making room for the loss.'),
      followUp: d('six-beat.row.grieving.response-follow-up', '“I am not questioning my love for my child. I am asking for support with the grief that exists alongside it.”'),
    },
  },
  disappeared: {
    category: 'parent-load',
    explanation: [
      d('six-beat.row.disappeared.explanation-1', 'Caregiving can consume the calendar first and identity second. Work, friendships, faith, health, and ordinary preferences get treated as optional because the child’s needs always appear more urgent.'),
      d('six-beat.row.disappeared.explanation-2', 'A parent does not need a perfect day off to begin reversing that pattern. The first useful question is whether one recurring piece of time can be protected by scheduling, shared responsibility, or outside support.'),
    ],
    actionOverride: {
      heading: d('six-beat.row.disappeared.action-heading', 'Name one recurring hour that should belong to you.'),
      body: [
        d('six-beat.row.disappeared.action-body-1', 'Say: “I need one recurring hour each week that is not caregiving time. What support or scheduling option could make that possible?”'),
        d('six-beat.row.disappeared.action-body-2', 'Naming the hour and the barrier is enough. You do not need to build the solution alone.'),
      ],
    },
    responseGuide: {
      substantive: d('six-beat.row.disappeared.response-substantive', 'A substantive answer identifies the barrier, names an available scheduling or support path, and assigns a next step to a real person.'),
      incomplete: d('six-beat.row.disappeared.response-incomplete', 'A brush-off tells the parent to make time for themselves without addressing who covers the caregiving.'),
      followUp: d('six-beat.row.disappeared.response-follow-up', '“The issue is not choosing self-care. The issue is coverage. What option can help create it?”'),
    },
  },
  'thinking-stopping': {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.thinking-stopping.explanation-1', 'A program can show improvement on selected goals while the family remains unsure whether those gains matter enough to justify the time, cost, disruption, or stress.'),
      d('six-beat.row.thinking-stopping.explanation-2', 'A responsible decision requires more than a summary score. The parent needs the current data, the meaning of that data in daily life, the likely next phase, and the alternatives if care changes or stops.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.thinking-stopping.response-substantive', 'A substantive answer presents the data, explains options and tradeoffs without pressure, and gives the parent time to decide.'),
      incomplete: d('six-beat.row.thinking-stopping.response-incomplete', 'A brush-off becomes defensive, focuses on retention, or says stopping would be a mistake without showing the evidence.'),
      followUp: d('six-beat.row.thinking-stopping.response-follow-up', '“I need the options and tradeoffs, not persuasion. What does the data support, and what remains uncertain?”'),
    },
  },
  'no-progress': {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.no-progress.explanation-1', 'A skill can appear during a structured session and still fail to show up with different people, materials, routines, or levels of stress.'),
      d('six-beat.row.no-progress.explanation-2', 'That gap is called generalization. It does not automatically mean the skill was never learned, but it does mean session success alone may not answer whether family life is changing.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.no-progress.response-substantive', 'A substantive answer compares session and home data, identifies the generalization gap, and names a specific review or adjustment with a timeline.'),
      incomplete: d('six-beat.row.no-progress.response-incomplete', 'A brush-off points to graphs or says progress takes time without explaining why the family is not seeing it.'),
      followUp: d('six-beat.row.no-progress.response-follow-up', '“I see the session data. What explains the difference at home, and what will the team do to evaluate that gap?”'),
    },
  },
  'sessions-concern': {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.sessions-concern.explanation-1', 'Parents often see only fragments of clinical care: a handoff, a short note, a change in the child afterward, or a recommendation without the reasoning behind it.'),
      d('six-beat.row.sessions-concern.explanation-2', 'A concern does not need to be proven before it can be reviewed. Specific observations help the team investigate, but the organization should also have a clear path for observation, explanation, and escalation.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.sessions-concern.response-substantive', 'A substantive answer explains the review process, identifies who will examine the concern, and gives a date for response.'),
      incomplete: d('six-beat.row.sessions-concern.response-incomplete', 'A brush-off reassures the parent that everything was fine without reviewing the specific observation or explaining escalation options.'),
      followUp: d('six-beat.row.sessions-concern.response-follow-up', '“I’m asking for the concern to be reviewed. Who owns that review, and when will I receive an answer?”'),
    },
  },
  'unclear-care': {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.unclear-care.explanation-1', 'Every clinical goal should connect four things: the skill or concern, why it matters in daily life, how change will be measured, and when the team will review the result.'),
      d('six-beat.row.unclear-care.explanation-2', 'Jargon can hide that chain. A parent does not need technical vocabulary, but they do need enough clarity to understand what the team is doing and why.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.unclear-care.response-substantive', 'A substantive answer connects the goal to daily life, explains the measure, and names the next review point.'),
      incomplete: d('six-beat.row.unclear-care.response-incomplete', 'A brush-off repeats technical wording, hands the parent a report, or says the goal is clinically necessary without translating it.'),
      followUp: d('six-beat.row.unclear-care.response-follow-up', '“I still cannot explain this goal in my own words. Please connect it to daily life, the measure, and the review date.”'),
    },
  },
  deciding: {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.deciding.explanation-1', 'No provider can responsibly promise an outcome before assessment. A credible provider can explain what it would evaluate, how goals would be chosen with the family, and how both progress and lack of progress would be measured.'),
      d('six-beat.row.deciding.explanation-2', 'The quality of the decision depends less on a guarantee and more on whether the provider can describe a transparent process for learning what the child needs.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.deciding.response-substantive', 'A substantive answer describes the assessment process, family role, measurement, limits of ABA, and what happens if the fit is poor.'),
      incomplete: d('six-beat.row.deciding.response-incomplete', 'A brush-off promises improvement, relies on testimonials, or avoids explaining how the provider decides whether ABA is appropriate.'),
      followUp: d('six-beat.row.deciding.response-follow-up', '“Please explain the assessment and decision process, including what would make you say ABA is not the right fit.”'),
    },
  },
  'first-months': {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.first-months.explanation-1', 'Early care often includes assessment, relationship-building, baseline measurement, staffing, and learning which goals are meaningful before visible change is expected.'),
      d('six-beat.row.first-months.explanation-2', 'The exact timeline varies, but a provider should still be able to explain what happens first, who is involved, when parents meet the BCBA, and when the first data review occurs.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.first-months.response-substantive', 'A substantive answer gives a sequence, identifies who does what, and distinguishes expected early work from promises of rapid change.'),
      incomplete: d('six-beat.row.first-months.response-incomplete', 'A brush-off gives a broad start date or says every child is different without explaining the provider’s process.'),
      followUp: d('six-beat.row.first-months.response-follow-up', '“I understand timelines vary. What is your actual sequence from intake through the first data review?”'),
    },
  },
  'judging-provider': {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.judging-provider.explanation-1', 'Families often feel they have no leverage because waitlists are long and the provider knows the system better.'),
      d('six-beat.row.judging-provider.explanation-2', 'A provider’s response to ordinary questions reveals how it handles parent involvement, supervision, staff changes, data access, concerns, and disagreement after services begin.'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.judging-provider.response-substantive', 'A substantive answer explains policies, names responsible roles, and provides concrete frequency or process information.'),
      incomplete: d('six-beat.row.judging-provider.response-incomplete', 'A brush-off relies on reputation, says the team is like family, or promises excellent communication without explaining how it works.'),
      followUp: d('six-beat.row.judging-provider.response-follow-up', '“That sounds reassuring. What is the actual policy, who is responsible, and how often does it happen?”'),
    },
  },
  'what-is-aba': {
    category: 'child-treatment',
    explanation: [
      d('six-beat.row.what-is-aba.explanation-1', 'ABA uses direct observation and measurement to understand patterns, teach skills, and evaluate whether the approach is producing meaningful change.'),
      d('six-beat.row.what-is-aba.explanation-2', 'The method is broad, so the important question is not only “Do you use ABA?” but “What would you work on, how would you involve us, how would you measure it, and what are the limits?”'),
    ],
    responseGuide: {
      substantive: d('six-beat.row.what-is-aba.response-substantive', 'A substantive answer explains observation, goals, measurement, family involvement, limits, and how the child’s needs and communication are respected.'),
      incomplete: d('six-beat.row.what-is-aba.response-incomplete', 'A brush-off defines ABA with jargon or promises that it can fix every concern.'),
      followUp: d('six-beat.row.what-is-aba.response-follow-up', '“Please explain the process using my example, including what ABA can and cannot address.”'),
    },
  },
};

export const CRISIS_SIX_BEAT_DRAFT = {
  explanation: [
    d('six-beat.crisis.explanation-1', 'This page does not give behavior advice. Its job is to help you bring an urgent safety concern to the people responsible for clinical care.'),
    d('six-beat.crisis.explanation-2', 'Ask the team whether the situation calls for an earlier meeting, a revised clinical plan, caregiver training, a written safety plan, or a review of service hours. The team must decide what is clinically appropriate.'),
  ],
  responseGuide: {
    substantive: d('six-beat.crisis.response-substantive', 'A substantive response treats the concern as urgent, identifies who will review it, gives the family an interim contact, and sets a time for the next clinical decision.'),
    incomplete: d('six-beat.crisis.response-incomplete', 'A brush-off tells the family to wait until the next routine session or offers general reassurance without a safety review.'),
    followUp: d('six-beat.crisis.response-follow-up', '“Someone is being hurt. Who is reviewing this today, and what do we do to reach the team before the meeting?”'),
  },
} as const;
