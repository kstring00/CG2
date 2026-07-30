export type ApprovalStatus = 'draft' | 'approved';

export type CopyEntry = {
  id: string;
  text: string;
  approval: ApprovalStatus;
};

export type TeamMode = 'yes' | 'no';

export type BranchId = 'behaviors' | 'load' | 'empty' | 'working' | 'crisis';

export type RowId =
  | 'big-moments'
  | 'outings'
  | 'daily-routines'
  | 'communication-wall'
  | 'why-behavior'
  | 'alone'
  | 'marriage-strain'
  | 'partner-load'
  | 'judged'
  | 'cannot-keep-doing'
  | 'nothing-left'
  | 'grieving'
  | 'disappeared'
  | 'thinking-stopping'
  | 'no-progress'
  | 'sessions-concern'
  | 'unclear-care'
  // Branch 4 in team=no mode — evaluation rows, not doubt rows.
  | 'deciding'
  | 'first-months'
  | 'judging-provider'
  | 'what-is-aba'
  | 'crisis';

export type StandardBranchId = Exclude<BranchId, 'crisis'>;
export type StandardRowId = Exclude<RowId, 'crisis'>;

export type ActionDefinition = {
  heading: CopyEntry;
  body: CopyEntry[];
};

export type CrossLinkDefinition = {
  label: CopyEntry;
  detail: CopyEntry;
  branch: StandardBranchId;
  row?: StandardRowId;
};

export type PlanRowDefinition = {
  id: StandardRowId;
  branch: StandardBranchId;
  choice: CopyEntry;
  acknowledgment: CopyEntry;
  truth: CopyEntry;
  body: CopyEntry[];
  action: ActionDefinition;
  questions: CopyEntry[];
  crossLink: CrossLinkDefinition;
  safetyLink?: CopyEntry;
  quietSupport?: CopyEntry;
  domesticViolence?: CopyEntry;
  education?: {
    heading: CopyEntry;
    body: CopyEntry[];
  };
  printableRelativeGuide?: {
    heading: CopyEntry;
    body: CopyEntry[];
  };
};

export type BranchDefinition = {
  id: StandardBranchId;
  entryChoice: CopyEntry;
  refineQuestion: CopyEntry;
  refineHelper: CopyEntry;
  rows: StandardRowId[];
};

const draft = (id: string, text: string): CopyEntry => ({
  id,
  text,
  approval: 'draft',
});

export const CARE_PLAN_UI = {
  productName: draft('ui.product-name', 'Common Ground'),
  intakeEyebrow: draft('intake.eyebrow', 'A private, two-tap guide'),
  intakeQuestion: draft('intake.question', 'Where is your family right now?'),
  intakeHelper: draft(
    'intake.helper',
    'Choose the closest answer. Nothing you tap is saved or sent anywhere.',
  ),
  intakeTeamYes: draft(
    'intake.team-yes',
    'We have a care team — my child is in ABA.',
  ),
  intakeTeamNo: draft(
    'intake.team-no',
    "We don't have a team yet — waiting, looking, or just diagnosed.",
  ),
  carePlanEyebrow: draft('care-plan.eyebrow', 'My Family Care Plan'),
  entryQuestion: draft('care-plan.entry-question', "What's hardest right now?"),
  entryHelper: draft(
    'care-plan.entry-helper',
    'Pick the closest one. You can change it anytime.',
  ),
  crisisEntryChoice: draft('care-plan.entry.crisis', 'Someone is getting hurt.'),
  selectedContextLabel: draft('care-plan.selected-context-label', 'You chose'),
  backToHardest: draft('care-plan.back-to-hardest', 'Choose a different concern'),
  planActionLabel: draft('care-plan.action-label', 'Until your next session'),
  questionsIntro: draft(
    'care-plan.questions-intro',
    'Use the questions that fit. You do not need to use every one.',
  ),
  printButton: draft('care-plan.print-button', 'Print this sheet'),
  crisisPrintButton: draft('care-plan.crisis-print-button', 'Print this page'),
  startOver: draft('care-plan.start-over', 'Start over'),
  startOverDetail: draft(
    'care-plan.start-over-detail',
    'Return to the first question without saving anything.',
  ),
  teamContactHeading: draft('care-plan.team-contact-heading', 'Talk with a person'),
  developmentDraft: draft('care-plan.development-draft', 'DRAFT — clinical review pending'),
  exactFooter: draft(
    'care-plan.exact-footer',
    'Common Ground supports the parent. It does not give behavior advice, diagnose, or replace clinical care — bring anything about your child to your BCBA. Nothing you tap here is seen, stored, or monitored by anyone. If anyone is in immediate danger, call 911.',
  ),
  noSelectionFallback: draft(
    'care-plan.no-selection-fallback',
    'That option is not available. Start again to choose another concern.',
  ),
  backToEntry: draft('care-plan.back-to-entry', 'Back to the first question'),
} as const;

export const TEAM_COPY: Record<
  TeamMode,
  {
    sessionHeading: CopyEntry;
    contactLabel: CopyEntry;
    phoneNumber: CopyEntry;
    providerEvaluationNote?: CopyEntry;
  }
> = {
  yes: {
    sessionHeading: draft('team.yes.session-heading', 'Bring this to your BCBA'),
    contactLabel: draft('team.yes.contact-label', 'Call your clinic'),
    phoneNumber: draft('team.yes.phone-number', 'CLINIC_PHONE_PLACEHOLDER'),
  },
  no: {
    sessionHeading: draft(
      'team.no.session-heading',
      "Bring this to the provider you're evaluating — these questions are also how you evaluate them",
    ),
    contactLabel: draft(
      'team.no.contact-label',
      "Talk to Admissions — they help families who don't have a team yet.",
    ),
    phoneNumber: draft('team.no.phone-number', '(877) 771-5725'),
    providerEvaluationNote: draft(
      'team.no.provider-evaluation-note',
      'These questions are also how you evaluate a provider — a good one welcomes all of them.',
    ),
  },
};

export const BRANCHES: Record<StandardBranchId, BranchDefinition> = {
  behaviors: {
    id: 'behaviors',
    entryChoice: draft(
      'branch.behaviors.entry-choice',
      'The behaviors are more than we can handle.',
    ),
    refineQuestion: draft(
      'branch.behaviors.refine-question',
      'What does it look like most?',
    ),
    refineHelper: draft(
      'branch.behaviors.refine-helper',
      "Choose the closest description. Anything about your child belongs with your care team.",
    ),
    rows: [
      'big-moments',
      'outings',
      'daily-routines',
      'communication-wall',
      'why-behavior',
    ],
  },
  load: {
    id: 'load',
    entryChoice: draft('branch.load.entry-choice', "I'm carrying this alone."),
    refineQuestion: draft('branch.load.refine-question', "Who's carrying this?"),
    refineHelper: draft(
      'branch.load.refine-helper',
      'Choose the situation that feels most true right now.',
    ),
    rows: ['alone', 'marriage-strain', 'partner-load', 'judged'],
  },
  empty: {
    id: 'empty',
    entryChoice: draft('branch.empty.entry-choice', "I'm running on empty."),
    refineQuestion: draft(
      'branch.empty.refine-question',
      "What's it like inside right now?",
    ),
    refineHelper: draft(
      'branch.empty.refine-helper',
      'Choose the closest sentence. This is not a diagnosis or assessment.',
    ),
    rows: ['cannot-keep-doing', 'nothing-left', 'grieving', 'disappeared'],
  },
  working: {
    id: 'working',
    entryChoice: draft('branch.working.entry-choice', "I don't know if this is working."),
    refineQuestion: draft('branch.working.refine-question', "What's the doubt?"),
    refineHelper: draft(
      'branch.working.refine-helper',
      'Choose what you most need to say out loud. This page will not argue with you.',
    ),
    rows: ['thinking-stopping', 'no-progress', 'sessions-concern', 'unclear-care'],
  },
};

/**
 * Branch 4 overrides for team=no. A family without services cannot doubt services
 * they don't have, so the branch becomes an evaluation branch: same four pages,
 * same anatomy, different rows. These replace their team=yes counterparts whenever
 * team=no — they are never additive.
 */
export const TEAM_NO_BRANCHES: Partial<Record<StandardBranchId, BranchDefinition>> = {
  working: {
    id: 'working',
    entryChoice: draft(
      'branch.working.teamNo.entry-choice',
      "I don't know if this is right for us.",
    ),
    refineQuestion: draft('branch.working.teamNo.refine-question', 'What do you need to know?'),
    refineHelper: draft(
      'branch.working.teamNo.refine-helper',
      'Choose the question closest to yours. A good provider welcomes every one of these.',
    ),
    rows: ['deciding', 'first-months', 'judging-provider', 'what-is-aba'],
  },
};

/** The branch definition for a given team mode — team=no overrides win. */
export function resolveBranch(team: TeamMode, branch: StandardBranchId): BranchDefinition {
  return (team === 'no' ? TEAM_NO_BRANCHES[branch] : undefined) ?? BRANCHES[branch];
}

/** Entry-screen branches in order, with team=no overrides applied. */
export function resolveBranchList(team: TeamMode): BranchDefinition[] {
  return (Object.keys(BRANCHES) as StandardBranchId[]).map((id) => resolveBranch(team, id));
}

export const PLAN_ROWS: Record<StandardRowId, PlanRowDefinition> = {
  'big-moments': {
    id: 'big-moments',
    branch: 'behaviors',
    choice: draft(
      'row.big-moments.choice',
      'The big moments — meltdowns, hitting, things breaking.',
    ),
    acknowledgment: draft(
      'row.big-moments.acknowledgment',
      'You said the big moments at home are more than the family can carry.',
    ),
    truth: draft(
      'row.big-moments.truth',
      'When it reaches this point, the plan needs to change — not you.',
    ),
    body: [
      draft(
        'row.big-moments.body-1',
        "You should not have to improvise your way through the same incident again and again.",
      ),
      draft(
        'row.big-moments.body-2',
        "What changes it isn't more effort from you — it's better information reaching your team faster. That's what this page sets up.",
      ),
    ],
    action: {
      heading: draft('row.big-moments.action-heading', "Document the incident once everyone is safe."),
      body: [
        draft(
          'row.big-moments.action-body-1',
          "Five lines, right after: when it happened · what was happening in the two minutes before · how long it lasted · who was hurt and how · what finally ended it. Like this: \"Tue 5:15p — asked to turn off tablet — 20 min — bit grandma's forearm, bruised — stopped when she left the room.\"",
        ),
        draft(
          'row.big-moments.action-body-2',
          "Four or five of these logs is exactly the raw material a BCBA uses to change a plan. You're not explaining yourself — you're handing them evidence.",
        ),
      ],
    },
    questions: [
      draft(
        'row.big-moments.question-1',
        "Can we review whether the current plan addresses what we're seeing at home?",
      ),
      draft(
        'row.big-moments.question-2',
        'What should we document when incidents happen?',
      ),
      draft(
        'row.big-moments.question-3',
        'Is caregiver training available for us and other adults in the home?',
      ),
      draft(
        'row.big-moments.question-4',
        'Does this justify more hours, and what would that take?',
      ),
      draft(
        'row.big-moments.question-5',
        'Can a safety plan for incidents be built into the program?',
      ),
    ],
    safetyLink: draft(
      'row.big-moments.safety-link',
      'If anyone is being injured in these moments, open the safety page now.',
    ),
    crossLink: {
      label: draft('row.big-moments.cross-link-label', 'I also need to question whether care is working'),
      detail: draft(
        'row.big-moments.cross-link-detail',
        'Open the page for concerns about progress or the current approach.',
      ),
      branch: 'working',
      row: 'no-progress',
    },
  },
  outings: {
    id: 'outings',
    branch: 'behaviors',
    choice: draft('row.outings.choice', "We can't go anywhere — outings end in disaster."),
    acknowledgment: draft(
      'row.outings.acknowledgment',
      'You said leaving home has become so difficult that the family is staying in.',
    ),
    truth: draft(
      'row.outings.truth',
      "Staying home isn't a solution. It's a cost — and one your team can work on.",
    ),
    body: [
      draft(
        'row.outings.body-1',
        "A family that stops leaving the house has lost something real, and it happens so gradually nobody names it.",
      ),
      draft(
        'row.outings.body-2',
        "You don't need a strategy for outings — you need your team to know outings have become the cost. That's a program conversation.",
      ),
    ],
    action: {
      heading: draft('row.outings.action-heading', "Log one outing — even a failed one."),
      body: [
        draft(
          'row.outings.action-body-1',
          "Four lines after you're home: where you went · how long it held · the exact moment it turned · what you had to do. \"Sat 10am grocery store — fine for 10 min — checkout line — left the cart, carried him out.\"",
        ),
        draft(
          'row.outings.action-body-2',
          "Two or three of these makes 'we can't go anywhere' concrete enough to become program goals instead of a sad fact.",
        ),
      ],
    },
    questions: [
      draft('row.outings.question-1', 'Can community outings become program goals?'),
      draft('row.outings.question-2', 'What should we record when an outing goes wrong?'),
      draft('row.outings.question-3', 'Is there caregiver training for public settings?'),
    ],
    crossLink: {
      label: draft('row.outings.cross-link-label', 'The everyday routines are also wearing us down'),
      detail: draft(
        'row.outings.cross-link-detail',
        'Open the page for sleep, eating, and getting out the door.',
      ),
      branch: 'behaviors',
      row: 'daily-routines',
    },
  },
  'daily-routines': {
    id: 'daily-routines',
    branch: 'behaviors',
    choice: draft(
      'row.daily-routines.choice',
      'The everyday battles — sleep, eating, getting out the door.',
    ),
    acknowledgment: draft(
      'row.daily-routines.acknowledgment',
      'You said ordinary routines are taking more from the family than they should.',
    ),
    truth: draft(
      'row.daily-routines.truth',
      "The small battles are not too small to bring up — they're what erodes families.",
    ),
    body: [
      draft(
        'row.daily-routines.body-1',
        "A routine doesn't need to look dramatic to be the thing draining the whole house. Forty hard minutes every single morning outweighs one bad Saturday.",
      ),
      draft(
        'row.daily-routines.body-2',
        "Don't bring all of it — bring the one routine with the highest daily cost. One is actionable; everything is noise.",
      ),
    ],
    action: {
      heading: draft('row.daily-routines.action-heading', "Pick the one routine that hurts most, then log it for three days."),
      body: [
        draft(
          'row.daily-routines.action-body-1',
          "Three lines a day: when it started · how long it took · where exactly it stalled. \"Mon 7:05a — getting dressed — 35 min — stuck at socks, every day it's socks.\"",
        ),
        draft(
          'row.daily-routines.action-body-2',
          "Three days of that beats a month of \"mornings are just hard.\" It tells your team where the program goal belongs.",
        ),
      ],
    },
    questions: [
      draft('row.daily-routines.question-1', 'Can this routine become a program goal?'),
      draft(
        'row.daily-routines.question-2',
        'What can be paused or simplified for the family while we work on it?',
      ),
    ],
    crossLink: {
      label: draft('row.daily-routines.cross-link-label', "I have nothing left to give"),
      detail: draft(
        'row.daily-routines.cross-link-detail',
        'Open parent support for running on empty.',
      ),
      branch: 'empty',
      row: 'nothing-left',
    },
  },
  'communication-wall': {
    id: 'communication-wall',
    branch: 'behaviors',
    choice: draft('row.communication-wall.choice', "We can't understand each other."),
    acknowledgment: draft(
      'row.communication-wall.acknowledgment',
      'You said communication is breaking down and leaving everyone frustrated.',
    ),
    truth: draft(
      'row.communication-wall.truth',
      'The frustration on both sides comes from the same wall.',
    ),
    body: [
      draft(
        'row.communication-wall.body-1',
        "When a child can't get their message across and the adults can't read it, both sides end up frustrated by the same wall — it just looks like defiance from one side and confusion from the other.",
      ),
      draft(
        'row.communication-wall.body-2',
        "You don't have to solve the communication system. You have to show your team where it's failing — they own the rest.",
      ),
    ],
    action: {
      heading: draft('row.communication-wall.action-heading', "Note the breakdowns as they happen."),
      body: [
        draft(
          'row.communication-wall.action-body-1',
          "Three lines each: what he seemed to be trying to get across · what you tried · what happened. \"Wanted something in the kitchen — offered snack, drink, toy — screaming escalated, gave up after 15 min.\"",
        ),
        draft(
          'row.communication-wall.action-body-2',
          "Don't interpret why. The observable moment is the useful part — bring three of them.",
        ),
      ],
    },
    questions: [
      draft(
        'row.communication-wall.question-1',
        'Can we look at how my child currently tells us what they need?',
      ),
      draft(
        'row.communication-wall.question-2',
        'Is there caregiver training on the communication system in use?',
      ),
    ],
    crossLink: {
      label: draft('row.communication-wall.cross-link-label', "I don't understand why this happens"),
      detail: draft(
        'row.communication-wall.cross-link-detail',
        'Open the plain-language education and BCBA question page.',
      ),
      branch: 'behaviors',
      row: 'why-behavior',
    },
  },
  'why-behavior': {
    id: 'why-behavior',
    branch: 'behaviors',
    choice: draft(
      'row.why-behavior.choice',
      "I don't understand why my child does what they do.",
    ),
    acknowledgment: draft(
      'row.why-behavior.acknowledgment',
      'You said you need a clearer explanation of what the behavior may be communicating.',
    ),
    truth: draft(
      'row.why-behavior.truth',
      'You deserve an explanation in plain language, grounded in what the team actually knows.',
    ),
    body: [
      draft(
        'row.why-behavior.body-1',
        "This page will not tell you why your child does what they do — nobody who hasn't assessed your child honestly can.",
      ),
      draft(
        'row.why-behavior.body-2',
        "What you're owed is the plain-language version of what your team's assessment found, the evidence behind it, and what it means for daily life. That's not a bonus — it's part of the service.",
      ),
    ],
    education: {
      heading: draft(
        'row.why-behavior.education-heading',
        "Why behavior happens — the short version every parent deserves",
      ),
      body: [
        draft(
          'row.why-behavior.education-body-1',
          "Behavior is never random, even when it looks like it. Nearly all of it is doing a job for your child: getting something they want, escaping something hard, reaching connection or attention, or meeting a sensory need. A meltdown at homework time and a meltdown at bath time can look identical and be doing completely different jobs — which is why advice from relatives, forums, and strangers so often fails: they're guessing at the job.",
        ),
        draft(
          'row.why-behavior.education-body-2',
          "Finding the actual job is your BCBA's work — it's called an assessment, and it's built from exactly the kind of moments you've been living through. This is why what you observe at home matters so much, and why the right question isn't \"how do I stop it?\" but the one below.",
        ),
        draft(
          'row.why-behavior.education-body-3',
          "One thing this page will never do is tell you what YOUR child's behavior means. That answer has to come from the people who've assessed your child — anything else is a guess dressed up as help.",
        ),
      ],
    },
    action: {
      heading: draft('row.why-behavior.action-heading', "Pick one moment that captures the confusion."),
      body: [
        draft(
          'row.why-behavior.action-body-1',
          "One recent, specific moment — not the pattern, one instance. \"Thursday, threw his plate the second dinner started, out of nowhere.\"",
        ),
        draft(
          'row.why-behavior.action-body-2',
          "Bring it with one sentence: \"walk me through what you think was happening there, and how you know.\" Don't diagnose it yourself — make them show their work.",
        ),
      ],
    },
    questions: [
      draft(
        'row.why-behavior.question-1',
        "How do I ask you what my child's behavior is telling us?",
      ),
      draft(
        'row.why-behavior.question-2',
        'What information supports that explanation, and what is still uncertain?',
      ),
    ],
    crossLink: {
      label: draft('row.why-behavior.cross-link-label', "I don't understand what we're doing or why"),
      detail: draft(
        'row.why-behavior.cross-link-detail',
        'Open the page for a plain-language review of goals and expectations.',
      ),
      branch: 'working',
      row: 'unclear-care',
    },
  },
  alone: {
    id: 'alone',
    branch: 'load',
    choice: draft('row.alone.choice', "I'm the only one. There's no one else."),
    acknowledgment: draft(
      'row.alone.acknowledgment',
      'You said the daily load belongs almost entirely to you.',
    ),
    truth: draft(
      'row.alone.truth',
      "You're doing a two-person job alone — that's the situation, not a verdict on you.",
    ),
    body: [
      draft(
        'row.alone.body-1',
        "A program built for two adults, run by one, doesn't half-work — it breaks at specific points. Those points are what your team needs to see.",
      ),
      draft(
        'row.alone.body-2',
        "This isn't about proving you're trying hard enough. It's about sizing the program to the adults who actually exist.",
      ),
    ],
    action: {
      heading: draft('row.alone.action-heading', "Find where the day breaks."),
      body: [
        draft(
          'row.alone.action-body-1',
          "For three days, jot the moment the wheels come off — \"6:40pm, dinner + meltdown + homework, all at once\" is enough. Three timestamps like that show your team more than an hour of explaining.",
        ),
        draft(
          'row.alone.action-body-2',
          "This is capacity data. The conclusion it points to is a smaller, smarter home program — not a tougher parent.",
        ),
      ],
    },
    questions: [
      draft('row.alone.question-1', 'Can the home program be sized to one adult?'),
      draft(
        'row.alone.question-2',
        'Is caregiver training available for anyone in my circle — a grandparent, a sibling, or a sitter?',
      ),
      draft('row.alone.question-3', 'What respite options exist?'),
      draft(
        'row.alone.question-4',
        "Who do I call when I'm at my limit between sessions?",
      ),
    ],
    crossLink: {
      label: draft('row.alone.cross-link-label', "I'm also running on empty"),
      detail: draft(
        'row.alone.cross-link-detail',
        'Open parent support for having nothing left to give.',
      ),
      branch: 'empty',
      row: 'nothing-left',
    },
  },
  'marriage-strain': {
    id: 'marriage-strain',
    branch: 'load',
    choice: draft('row.marriage-strain.choice', "It's pulling my marriage apart."),
    acknowledgment: draft(
      'row.marriage-strain.acknowledgment',
      'You said the load around care is putting serious strain on your marriage.',
    ),
    truth: draft(
      'row.marriage-strain.truth',
      'Strain here is a care issue, not a character issue.',
    ),
    body: [
      draft(
        'row.marriage-strain.body-1',
        "Unequal information, unequal load, and zero recovery time will strain any two people — this isn't a referendum on your marriage.",
      ),
      draft(
        'row.marriage-strain.body-2',
        "You can raise it without blaming anyone: the ask is support, not a verdict.",
      ),
    ],
    action: {
      heading: draft('row.marriage-strain.action-heading', "Name one pressure point — just one."),
      body: [
        draft(
          'row.marriage-strain.action-body-1',
          "The single routine or responsibility generating the most friction right now. \"Tuesday therapy transport.\" \"Who handles the 3am wake-ups.\" Not \"everything.\"",
        ),
        draft(
          'row.marriage-strain.action-body-2',
          "One concrete point gives the counselor, the team, or your partner something to actually move. \"Everything\" gives them nowhere to start.",
        ),
      ],
    },
    questions: [
      draft(
        'row.marriage-strain.question-1',
        'Are there referrals to counselors who understand this kind of caregiving load?',
      ),
      draft(
        'row.marriage-strain.question-2',
        'Can caregiver training include both of us, together?',
      ),
    ],
    domesticViolence: draft(
      'row.marriage-strain.domestic-violence',
      "If home doesn't feel safe for you, the National Domestic Violence Hotline is 800-799-7233.",
    ),
    crossLink: {
      label: draft('row.marriage-strain.cross-link-label', "My partner isn't carrying this with me"),
      detail: draft(
        'row.marriage-strain.cross-link-detail',
        'Open the page for making the caregiving load visible.',
      ),
      branch: 'load',
      row: 'partner-load',
    },
  },
  'partner-load': {
    id: 'partner-load',
    branch: 'load',
    choice: draft('row.partner-load.choice', "My partner isn't carrying this with me."),
    acknowledgment: draft(
      'row.partner-load.acknowledgment',
      'You said the caregiving load does not feel visible or shared.',
    ),
    truth: draft(
      'row.partner-load.truth',
      'Two people can love the same child and carry it completely differently — the fix starts with making the load visible.',
    ),
    body: [
      draft(
        'row.partner-load.body-1',
        "Most invisible-load fights are two people arguing from two different maps of the same week. Making the load visible replaces the argument with a fact.",
      ),
      draft(
        'row.partner-load.body-2',
        "And some of the imbalance isn't character at all — it's that one of you got trained and one didn't. That part your team can fix directly.",
      ),
    ],
    action: {
      heading: draft('row.partner-load.action-heading', "For one week, note who does what."),
      body: [
        draft(
          'row.partner-load.action-body-1',
          "Categories: appointments · daily routines · communication with the team · paperwork · the hard hours (mornings, meltdowns, 3am). One line a day: \"Tue — me: morning routine, session handoff, bedtime. Him: pickup.\"",
        ),
        draft(
          'row.partner-load.action-body-2',
          "Then use it exactly once — as capacity data in a team or counseling conversation. The moment it becomes a scorecard at home, it stops working.",
        ),
      ],
    },
    questions: [
      draft(
        'row.partner-load.question-1',
        "Can caregiver training be scheduled around my partner's work?",
      ),
      draft(
        'row.partner-load.question-2',
        "Can session times rotate so they're coached too?",
      ),
      draft(
        'row.partner-load.question-3',
        'Can the home program divide caregiver tasks explicitly?',
      ),
      draft('row.partner-load.question-4', 'Can my partner attend one session?'),
    ],
    crossLink: {
      label: draft('row.partner-load.cross-link-label', "It's pulling my marriage apart"),
      detail: draft(
        'row.partner-load.cross-link-detail',
        'Open the page for relationship strain related to the caregiving load.',
      ),
      branch: 'load',
      row: 'marriage-strain',
    },
  },
  judged: {
    id: 'judged',
    branch: 'load',
    choice: draft('row.judged.choice', 'The people around us judge instead of helping.'),
    acknowledgment: draft(
      'row.judged.acknowledgment',
      'You said the people around the family are adding judgment instead of practical support.',
    ),
    truth: draft(
      'row.judged.truth',
      "They're judging what they don't understand — and understanding can be arranged.",
    ),
    body: [
      draft(
        'row.judged.body-1',
        "Most judging relatives aren't cruel — they're confident about something they've never lived. Confidence plus zero information produces exactly the comments you've been getting.",
      ),
      draft(
        'row.judged.body-2',
        "You have two tools: the letter below, and an invitation. The second one is stronger — a relative who attends one training session usually stops advising and starts helping.",
      ),
    ],
    printableRelativeGuide: {
      heading: draft(
        'row.judged.relative-guide-heading',
        "A one-page letter for the people who love this family — print it and hand it over",
      ),
      body: [
        draft(
          'row.judged.relative-guide-body-1',
          "To someone this family trusts: the behaviors you've seen — the meltdowns, the hitting, the moments in public — are not the result of soft parenting, and they will not be fixed by firmer discipline. They come from a neurological difference in how this child experiences the world. The parents you're watching are following a clinical program built by licensed specialists, and some of what they do — staying calm through an outburst, not giving in to a demand, keeping rigid routines — is that program, not weakness.",
        ),
        draft(
          'row.judged.relative-guide-body-2',
          "What makes it harder: advice (\"he just needs a firm hand\"), comparisons (\"her kids never acted like that\"), and judgment in the hard moments. Every one of those lands on a parent already running on empty — and it teaches them to stop bringing the child around you.",
        ),
        draft(
          'row.judged.relative-guide-body-3',
          "What actually helps: pick one and offer it plainly. Take a sibling for an afternoon. Learn one routine — bedtime, mealtime — and run it their way, exactly. Come to a caregiver training session and see the work firsthand. Or simply stay in the room during a hard moment without commentary. The family doesn't need you to understand everything. They need you on their side of the table.",
        ),
      ],
    },
    action: {
      heading: draft('row.judged.action-heading', "Ask the care team to review this page before sharing it."),
      body: [
        draft(
          'row.judged.action-body-1',
          "Your team can confirm it's accurate for your situation and may invite your relatives into a real training session — which does more than any letter.",
        ),
        draft(
          'row.judged.action-body-2',
          "Nothing on this page includes your child's name, diagnosis details, or anything private — keep it that way when you share it.",
        ),
      ],
    },
    questions: [
      draft(
        'row.judged.question-1',
        'Can family members join a session or caregiver training?',
      ),
      draft(
        'row.judged.question-2',
        'What can we safely and accurately share so relatives understand how to help?',
      ),
    ],
    crossLink: {
      label: draft('row.judged.cross-link-label', "I'm running on empty"),
      detail: draft(
        'row.judged.cross-link-detail',
        'Open the page for caregiver exhaustion and support.',
      ),
      branch: 'empty',
      row: 'nothing-left',
    },
  },
  'cannot-keep-doing': {
    id: 'cannot-keep-doing',
    branch: 'empty',
    choice: draft(
      'row.cannot-keep-doing.choice',
      "Some days I don't think I can keep doing this.",
    ),
    acknowledgment: draft(
      'row.cannot-keep-doing.acknowledgment',
      'You said some days feel beyond what you can keep carrying.',
    ),
    truth: draft(
      'row.cannot-keep-doing.truth',
      'Reaching this point is a signal to get real support — not a failure.',
    ),
    body: [
      draft(
        'row.cannot-keep-doing.body-1',
        "This page can't measure how serious this moment is — and you shouldn't have to measure it alone.",
      ),
      draft(
        'row.cannot-keep-doing.body-2',
        "The move that changes tonight is telling one real person. The move that changes this month is the two questions below.",
      ),
    ],
    quietSupport: draft(
      'row.cannot-keep-doing.visible-988',
      'Call or text 988 now if you may harm yourself, cannot stay safe, or need immediate crisis support — any hour.',
    ),
    action: {
      heading: draft('row.cannot-keep-doing.action-heading', 'Tell one person today.'),
      body: [
        draft(
          'row.cannot-keep-doing.action-body-1',
          "Choose the person before you leave this page — an actual name. Your sister. Your friend from church. Your doctor. A crisis counselor at 988 counts.",
        ),
        draft(
          'row.cannot-keep-doing.action-body-2',
          "The sentence can be this simple: \"I'm at my limit and I need you to check on me this week.\" Sending it is the whole task.",
        ),
      ],
    },
    questions: [
      draft(
        'row.cannot-keep-doing.question-1',
        'Can you refer me to a therapist who understands caregiver strain?',
      ),
      draft(
        'row.cannot-keep-doing.question-2',
        'What can come off my plate this week?',
      ),
    ],
    crossLink: {
      label: draft('row.cannot-keep-doing.cross-link-label', "I'm carrying this alone"),
      detail: draft(
        'row.cannot-keep-doing.cross-link-detail',
        'Open the page for support when one adult carries the whole load.',
      ),
      branch: 'load',
      row: 'alone',
    },
  },
  'nothing-left': {
    id: 'nothing-left',
    branch: 'empty',
    choice: draft('row.nothing-left.choice', 'I have nothing left to give.'),
    acknowledgment: draft(
      'row.nothing-left.acknowledgment',
      'You said your energy and emotional capacity feel used up.',
    ),
    truth: draft(
      'row.nothing-left.truth',
      'Running on empty is information, not weakness.',
    ),
    body: [
      draft(
        'row.nothing-left.body-1',
        "A plan that assumes energy you don't have isn't a plan — it's a schedule for failing. The fix isn't more effort; it's a plan resized to reality.",
      ),
      draft(
        'row.nothing-left.body-2',
        "\"I'm at capacity\" is a legitimate clinical input. Say it in exactly those words at the next session.",
      ),
    ],
    quietSupport: draft(
      'row.nothing-left.quiet-988',
      'If it gets darker than this page can help with, call or text 988 — any hour.',
    ),
    action: {
      heading: draft('row.nothing-left.action-heading', "Protect one small window today."),
      body: [
        draft(
          'row.nothing-left.action-body-1',
          "Small and specific beats big and imaginary: the fifteen minutes after drop-off, sitting in the car. The shower with the door locked. Coffee before anyone wakes. Chosen on purpose, spent on nothing.",
        ),
        draft(
          'row.nothing-left.action-body-2',
          "This isn't self-care homework. It's you finding out how much slack the week actually has — which is information your team needs when they resize the program.",
        ),
      ],
    },
    questions: [
      draft(
        'row.nothing-left.question-1',
        'What can the home program pause or simplify right now?',
      ),
      draft('row.nothing-left.question-2', 'What respite options exist?'),
      draft('row.nothing-left.question-3', 'Are there parent-support referrals?'),
    ],
    crossLink: {
      label: draft('row.nothing-left.cross-link-label', "I'm the only one carrying this"),
      detail: draft(
        'row.nothing-left.cross-link-detail',
        'Open the page for a home program sized to one adult.',
      ),
      branch: 'load',
      row: 'alone',
    },
  },
  grieving: {
    id: 'grieving',
    branch: 'empty',
    choice: draft('row.grieving.choice', "I'm grieving the life I thought we'd have."),
    acknowledgment: draft(
      'row.grieving.acknowledgment',
      'You said part of what you are carrying is grief for the life you expected.',
    ),
    truth: draft(
      'row.grieving.truth',
      'Grieving the imagined life is not failing to love the real child.',
    ),
    body: [
      draft(
        'row.grieving.body-1',
        "Love and grief can sit in the same parent at the same time without either one being fake. Most parents in your position carry both and tell no one.",
      ),
      draft(
        'row.grieving.body-2',
        "This deserves support built for it — not a pep talk, and not a conversation that turns your grief into a judgment about your child.",
      ),
    ],
    quietSupport: draft(
      'row.grieving.quiet-988',
      'If it gets darker than this page can help with, call or text 988 — any hour.',
    ),
    action: {
      heading: draft('row.grieving.action-heading', "Choose one person who can hear it without correcting it."),
      body: [
        draft(
          'row.grieving.action-body-1',
          "The test is simple: someone who won't say \"but you're so blessed\" or \"everything happens for a reason.\" If no one in your life passes that test, a therapist or the 988 line does.",
        ),
        draft(
          'row.grieving.action-body-2',
          'You can begin with one sentence: I love my child, and I am also grieving what I expected life to be.',
        ),
      ],
    },
    questions: [
      draft('row.grieving.question-1', 'Are there referrals for this kind of grief specifically?'),
      draft('row.grieving.question-2', 'Are there resources on long-term planning?'),
    ],
    crossLink: {
      label: draft('row.grieving.cross-link-label', "I've disappeared into this"),
      detail: draft(
        'row.grieving.cross-link-detail',
        'Open the page for reclaiming one recurring part of your own life.',
      ),
      branch: 'empty',
      row: 'disappeared',
    },
  },
  disappeared: {
    id: 'disappeared',
    branch: 'empty',
    choice: draft('row.disappeared.choice', "I've disappeared into this."),
    acknowledgment: draft(
      'row.disappeared.acknowledgment',
      'You said caregiving has taken over so much that you no longer feel visible in your own life.',
    ),
    truth: draft(
      'row.disappeared.truth',
      'Losing yourself is a real loss — not vanity.',
    ),
    body: [
      draft(
        'row.disappeared.body-1',
        "A person who has been entirely converted into a caregiver isn't more devoted — they're closer to the edge. The parents who last are the ones who kept one thing.",
      ),
      draft(
        'row.disappeared.body-2',
        "So this page asks for exactly one thing back. Not balance. Not a new life. One recurring hour.",
      ),
    ],
    quietSupport: draft(
      'row.disappeared.quiet-988',
      'If it gets darker than this page can help with, call or text 988 — any hour.',
    ),
    action: {
      heading: draft('row.disappeared.action-heading', "Pick the one recurring hour that will be yours."),
      body: [
        draft(
          'row.disappeared.action-body-1',
          "Recurring beats perfect: Thursday 7–8pm, the gym you quit. Sunday morning, the long walk. Same slot every week, so it defends itself.",
        ),
        draft(
          'row.disappeared.action-body-2',
          "Then make the barrier concrete at your next session: \"I need Thursday evenings possible — can scheduling or respite get me there?\" That's an answerable request.",
        ),
      ],
    },
    questions: [
      draft(
        'row.disappeared.question-1',
        'Can scheduling or respite make that recurring hour actually possible?',
      ),
    ],
    crossLink: {
      label: draft('row.disappeared.cross-link-label', "I'm carrying this alone"),
      detail: draft(
        'row.disappeared.cross-link-detail',
        'Open the page for support when the home load belongs to one adult.',
      ),
      branch: 'load',
      row: 'alone',
    },
  },
  'thinking-stopping': {
    id: 'thinking-stopping',
    branch: 'working',
    choice: draft('row.thinking-stopping.choice', "I'm thinking about stopping."),
    acknowledgment: draft(
      'row.thinking-stopping.acknowledgment',
      'You said you are seriously considering whether to continue.',
    ),
    truth: draft(
      'row.thinking-stopping.truth',
      'This decision deserves full information — and you can say the doubt out loud without penalty.',
    ),
    body: [
      draft(
        'row.thinking-stopping.body-1',
        "You don't owe anyone a defense of the question. Families are allowed to weigh whether this is working — that's stewardship, not disloyalty.",
      ),
      draft(
        'row.thinking-stopping.body-2',
        "What you're owed back is the honest version: the data, the options, and what each path costs and gains. Not reassurance — information.",
      ),
    ],
    action: {
      heading: draft('row.thinking-stopping.action-heading', "Turn the decision into an agenda."),
      body: [
        draft(
          'row.thinking-stopping.action-body-1',
          "The three questions below, sent ahead of a dedicated meeting: \"I want to use our next session to talk about whether this is working. Here's what I need to see.\" Sending it ahead means nobody improvises.",
        ),
        draft(
          'row.thinking-stopping.action-body-2',
          "Ask for the answers in plain language, and take time afterward. A decision this size is allowed to take two weeks.",
        ),
      ],
    },
    questions: [
      draft(
        'row.thinking-stopping.question-1',
        'Can we do an honest progress review and show me the data in plain terms?',
      ),
      draft(
        'row.thinking-stopping.question-2',
        'What changes if we continue versus stop?',
      ),
      draft(
        'row.thinking-stopping.question-3',
        'What do the next three months look like?',
      ),
    ],
    crossLink: {
      label: draft('row.thinking-stopping.cross-link-label', "I don't see progress"),
      detail: draft(
        'row.thinking-stopping.cross-link-detail',
        'Open the page for comparing home experience with the progress data.',
      ),
      branch: 'working',
      row: 'no-progress',
    },
  },
  'no-progress': {
    id: 'no-progress',
    branch: 'working',
    choice: draft('row.no-progress.choice', "I don't see progress."),
    acknowledgment: draft(
      'row.no-progress.acknowledgment',
      'You said the progress described by the program is not what you are seeing at home.',
    ),
    truth: draft(
      'row.no-progress.truth',
      'What you see at home is data your team needs — not a complaint.',
    ),
    body: [
      draft(
        'row.no-progress.body-1',
        "Progress that only exists in a report isn't progress yet. It should be explainable in your language and visible somewhere in your actual week.",
      ),
      draft(
        'row.no-progress.body-2',
        "The gap between their data and your kitchen isn't an accusation — it's the exact thing the meeting is for. Sometimes it's a measurement gap; sometimes it's a generalization problem; either way it's fixable and yours to raise.",
      ),
    ],
    action: {
      heading: draft('row.no-progress.action-heading', "Write down what home actually looks like."),
      body: [
        draft(
          'row.no-progress.action-body-1',
          "Two or three concrete lines: \"still can't get through dinner without leaving the table\" · \"new since March: hitting at grandma's\" · \"mornings genuinely better.\" Unchanged, worse, and better all count.",
        ),
        draft(
          'row.no-progress.action-body-2',
          "Don't reconcile it yourself — that's their job. Hand them both pictures and ask them to explain the gap.",
        ),
      ],
    },
    questions: [
      draft(
        'row.no-progress.question-1',
        'Can you walk me through the progress data in plain terms?',
      ),
      draft(
        'row.no-progress.question-2',
        'What should progress look like at this stage?',
      ),
      draft(
        'row.no-progress.question-3',
        "At what point does the plan change if it isn't working?",
      ),
    ],
    crossLink: {
      label: draft('row.no-progress.cross-link-label', 'The difficult moments at home are also escalating'),
      detail: draft(
        'row.no-progress.cross-link-detail',
        'Open the incident and safety-question page.',
      ),
      branch: 'behaviors',
      row: 'big-moments',
    },
  },
  'sessions-concern': {
    id: 'sessions-concern',
    branch: 'working',
    choice: draft(
      'row.sessions-concern.choice',
      "Something about the sessions doesn't sit right with me.",
    ),
    acknowledgment: draft(
      'row.sessions-concern.acknowledgment',
      'You said something about the sessions is creating concern or distrust.',
    ),
    truth: draft(
      'row.sessions-concern.truth',
      'Questioning the care is being a good parent, not a difficult one.',
    ),
    body: [
      draft(
        'row.sessions-concern.body-1',
        "A concern about sessions deserves a route: observe, get it explained, or escalate. You're entitled to all three.",
      ),
      draft(
        'row.sessions-concern.body-2',
        "Specific beats general, but don't wait for proof. \"Something felt off Tuesday\" is enough to start the conversation.",
      ),
    ],
    action: {
      heading: draft('row.sessions-concern.action-heading', "Write down the moments, not the feeling."),
      body: [
        draft(
          'row.sessions-concern.action-body-1',
          "Four lines per moment: date · what you saw or were told · what a session note said, if anything · the question it left you with. \"March 4 — she was in the car crying after session — note just said 'good session' — what happened?\"",
        ),
        draft(
          'row.sessions-concern.action-body-2',
          "Two or three of those, kept factual, and the conversation runs itself.",
        ),
      ],
    },
    questions: [
      draft('row.sessions-concern.question-1', 'Can I observe a session?'),
      draft(
        'row.sessions-concern.question-2',
        "Who oversees clinical care at this clinic, and how do I request a conversation with them? (Every clinic has someone above the BCBA — often called a clinical director. You can ask for that conversation by name.)",
      ),
      draft(
        'row.sessions-concern.question-3',
        'What is the process for reviewing a concern about what happens during sessions?',
      ),
    ],
    crossLink: {
      label: draft('row.sessions-concern.cross-link-label', "I'm thinking about stopping"),
      detail: draft(
        'row.sessions-concern.cross-link-detail',
        'Open the page for a full-information decision conversation.',
      ),
      branch: 'working',
      row: 'thinking-stopping',
    },
  },
  'unclear-care': {
    id: 'unclear-care',
    branch: 'working',
    choice: draft(
      'row.unclear-care.choice',
      "I don't understand what we're doing or why.",
    ),
    acknowledgment: draft(
      'row.unclear-care.acknowledgment',
      'You said the goals, methods, or expected path have not been explained clearly enough.',
    ),
    truth: draft(
      'row.unclear-care.truth',
      "If it can't be explained plainly, that's the explanation's fault — not yours.",
    ),
    body: [
      draft(
        'row.unclear-care.body-1',
        "Every goal in the plan should survive one question: \"what is this for, in plain words?\" If it can't, the goal isn't wrong — the explanation is missing.",
      ),
      draft(
        'row.unclear-care.body-2',
        "You're not asking for a favor. Understanding the program is part of the program — parents who get it run better home programs, and your team knows that.",
      ),
    ],
    action: {
      heading: draft('row.unclear-care.action-heading', "List the goals you can't explain."),
      body: [
        draft(
          'row.unclear-care.action-body-1',
          "Open the last report or plan you were given and write down every goal name you couldn't explain to a friend. That list is the meeting.",
        ),
        draft(
          'row.unclear-care.action-body-2',
          "For each one, the same four asks: what it's for · what evidence says it matters · what change we should see · by when. No jargon is a fair demand.",
        ),
      ],
    },
    questions: [
      draft(
        'row.unclear-care.question-1',
        'Can you walk me through each goal in plain terms?',
      ),
      draft(
        'row.unclear-care.question-2',
        'How will we know it is working, and on what timeline?',
      ),
      draft(
        'row.unclear-care.question-3',
        'What should the next month look like?',
      ),
    ],
    crossLink: {
      label: draft('row.unclear-care.cross-link-label', "I don't understand why my child does this"),
      detail: draft(
        'row.unclear-care.cross-link-detail',
        'Open the approved education and BCBA-question page.',
      ),
      branch: 'behaviors',
      row: 'why-behavior',
    },
  },
  deciding: {
    id: 'deciding',
    branch: 'working',
    choice: draft('row.deciding.choice', 'How do I know if ABA would actually help my child?'),
    acknowledgment: draft(
      'row.deciding.acknowledgment',
      "You said you're deciding whether ABA is the right move for your family.",
    ),
    truth: draft(
      'row.deciding.truth',
      'This decision deserves real information, not a sales pitch.',
    ),
    body: [
      draft(
        'row.deciding.body-1',
        "No one can promise outcomes for a child they haven't assessed — be cautious with anyone who does.",
      ),
      draft(
        'row.deciding.body-2',
        "What a good provider CAN do is explain exactly how they'd find out what your child needs, and how you'd both know if it's working.",
      ),
    ],
    action: {
      heading: draft(
        'row.deciding.action-heading',
        'Write down the three things you most want to change.',
      ),
      body: [
        draft(
          'row.deciding.action-body-1',
          'Not goals in clinical language — your language. "Get through a grocery store." "Sleep past 5am." "Stop the biting."',
        ),
        draft(
          'row.deciding.action-body-2',
          'Those three sentences are your yardstick for every provider conversation: ask each one how their program would address exactly those.',
        ),
      ],
    },
    questions: [
      draft(
        'row.deciding.question-1',
        "Based on what I've described, what would you assess first, and how?",
      ),
      draft(
        'row.deciding.question-2',
        "How would goals for my child be chosen, and what's my role in choosing them?",
      ),
      draft(
        'row.deciding.question-3',
        "How do you measure whether it's working, and how often would I see that data?",
      ),
      draft(
        'row.deciding.question-4',
        "What happens if it isn't helping — how does the plan change?",
      ),
    ],
    crossLink: {
      label: draft(
        'row.deciding.cross-link-label',
        'What should the first months actually look like?',
      ),
      detail: draft(
        'row.deciding.cross-link-detail',
        'Open the page on honest timelines and expectations.',
      ),
      branch: 'working',
      row: 'first-months',
    },
  },
  'first-months': {
    id: 'first-months',
    branch: 'working',
    choice: draft('row.first-months.choice', 'What should the first months actually look like?'),
    acknowledgment: draft(
      'row.first-months.acknowledgment',
      'You said you want honest expectations before you commit.',
    ),
    truth: draft(
      'row.first-months.truth',
      'Honest timelines beat big promises — ask for the boring version.',
    ),
    body: [
      draft(
        'row.first-months.body-1',
        'The first weeks are usually assessment and relationship-building, not visible change. A provider who says otherwise is selling.',
      ),
      draft(
        'row.first-months.body-2',
        "What you're entitled to is a clear picture: who comes to your home, how often, what they'll do, and when you'll first sit down over data.",
      ),
    ],
    action: {
      heading: draft('row.first-months.action-heading', "Sketch your family's real week."),
      body: [
        draft(
          'row.first-months.action-body-1',
          'Write the hours that could actually hold sessions — "weekdays 3:30–6, not Wednesdays" — and who\'s home during them.',
        ),
        draft(
          'row.first-months.action-body-2',
          'Bring it to every provider call. Their answer to "can you staff this?" tells you more than their brochure.',
        ),
      ],
    },
    questions: [
      draft(
        'row.first-months.question-1',
        'Walk me through a typical first month, week by week.',
      ),
      draft(
        'row.first-months.question-2',
        "What changes should we realistically see by month three — and what shouldn't we expect yet?",
      ),
      draft(
        'row.first-months.question-3',
        'How often do we meet with the BCBA, not just the therapist?',
      ),
    ],
    crossLink: {
      label: draft(
        'row.first-months.cross-link-label',
        'How do I judge whether a provider is good?',
      ),
      detail: draft(
        'row.first-months.cross-link-detail',
        'Open the provider-interview questions.',
      ),
      branch: 'working',
      row: 'judging-provider',
    },
  },
  'judging-provider': {
    id: 'judging-provider',
    branch: 'working',
    choice: draft('row.judging-provider.choice', 'How do I judge whether a provider is good?'),
    acknowledgment: draft(
      'row.judging-provider.acknowledgment',
      'You said you want to tell a good provider from a mediocre one.',
    ),
    truth: draft(
      'row.judging-provider.truth',
      'A good provider welcomes every one of these questions. Hesitation is an answer too.',
    ),
    body: [
      draft(
        'row.judging-provider.body-1',
        "You are interviewing them. Families forget this because they're exhausted and waitlists feel like leverage.",
      ),
      draft(
        'row.judging-provider.body-2',
        "The questions below are the ones providers hope you won't ask. Ask all of them and write the answers down.",
      ),
    ],
    action: {
      heading: draft(
        'row.judging-provider.action-heading',
        'Take notes during every provider call.',
      ),
      body: [
        draft(
          'row.judging-provider.action-body-1',
          'Same three lines each time: what I asked · what they said · how it felt to ask. "Asked about observing sessions — said anytime — felt easy" versus "asked — got a policy speech — felt defensive."',
        ),
        draft(
          'row.judging-provider.action-body-2',
          'After three calls, the notes decide for you.',
        ),
      ],
    },
    questions: [
      draft('row.judging-provider.question-1', 'Can parents observe sessions?'),
      draft(
        'row.judging-provider.question-2',
        'Who supervises the therapists, and how many hours a week is the BCBA actually involved with my child?',
      ),
      draft(
        'row.judging-provider.question-3',
        'How do you train and involve parents — is that scheduled or optional?',
      ),
      draft(
        'row.judging-provider.question-4',
        "What's your staff turnover like, and what happens when my child's therapist leaves?",
      ),
    ],
    crossLink: {
      label: draft(
        'row.judging-provider.cross-link-label',
        "I don't understand what ABA even does.",
      ),
      detail: draft(
        'row.judging-provider.cross-link-detail',
        'Open the plain-language explanation page.',
      ),
      branch: 'working',
      row: 'what-is-aba',
    },
  },
  'what-is-aba': {
    id: 'what-is-aba',
    branch: 'working',
    choice: draft('row.what-is-aba.choice', "I don't understand what ABA even does."),
    acknowledgment: draft(
      'row.what-is-aba.acknowledgment',
      'You said you need ABA explained before anything else makes sense.',
    ),
    truth: draft(
      'row.what-is-aba.truth',
      "If a provider can't explain it plainly, keep looking.",
    ),
    body: [
      draft(
        'row.what-is-aba.body-1',
        "In plain terms: ABA looks closely at what's happening around a behavior — what comes before it, what follows it — and uses that to teach skills and reduce what's getting in the child's way.",
      ),
      draft(
        'row.what-is-aba.body-2',
        'Everything is measured. That\'s the part that protects you: you never have to take "it\'s going well" on faith — you can ask to see it.',
      ),
    ],
    action: {
      heading: draft(
        'row.what-is-aba.action-heading',
        'Bring one real moment to the conversation.',
      ),
      body: [
        draft(
          'row.what-is-aba.action-body-1',
          'Pick one recent hard moment — the restaurant, the morning, the bite — and describe it to the provider.',
        ),
        draft(
          'row.what-is-aba.action-body-2',
          'Then ask: "walk me through how your team would approach exactly that." Their answer, in plain language or jargon, is your evaluation.',
        ),
      ],
    },
    questions: [
      draft(
        'row.what-is-aba.question-1',
        "Explain in plain terms what you'd likely work on first with my child, and why.",
      ),
      draft(
        'row.what-is-aba.question-2',
        'What is the family\'s role — what will we be asked to do?',
      ),
      draft(
        'row.what-is-aba.question-3',
        'What does ABA help with, and what does it not help with?',
      ),
    ],
    crossLink: {
      label: draft(
        'row.what-is-aba.cross-link-label',
        'How do I know if ABA would actually help my child?',
      ),
      detail: draft(
        'row.what-is-aba.cross-link-detail',
        'Open the page for making this decision with real information.',
      ),
      branch: 'working',
      row: 'deciding',
    },
  },
};

export const CRISIS_PAGE = {
  acknowledgment: draft(
    'crisis.acknowledgment',
    'You said someone in the house is getting hurt.',
  ),
  truth: draft(
    'crisis.truth',
    'When someone in the house is getting hurt, this has gone past coping — and families do reach this point.',
  ),
  body: [
    draft(
      'crisis.body-1',
      "This page gives no behavior advice — in a safety situation, guessing is dangerous and you deserve better than guesses. Its job is to get the full truth of what's happening in front of the people responsible for clinical care, fast.",
    ),
    draft(
      'crisis.body-2',
      "Families in this situation are not out of options. Ask your team directly which of these apply to you: a revised plan that targets these incidents, hands-on caregiver training, a written safety plan for the moments themselves, or increased support hours. If you don't have a team yet, this is the first thing to tell admissions.",
    ),
  ],
  documentationHeading: draft(
    'crisis.documentation-heading',
    'Document this after each incident, once everyone is safe',
  ),
  documentationItems: [
    draft('crisis.documentation-1', 'The date and time.'),
    draft('crisis.documentation-2', 'What happened.'),
    draft('crisis.documentation-3', 'What happened immediately before it.'),
    draft('crisis.documentation-4', 'How long it lasted.'),
    draft('crisis.documentation-5', 'Who was hurt.'),
    draft('crisis.documentation-6', 'Photos of injuries, when appropriate and safe.'),
  ],
  documentationExample: draft(
    'crisis.documentation-example',
    'Like this: "Tue 5:15p — asked to turn off tablet — 20 min — bit grandma\'s forearm, bruised — ended when she left the room." One entry per incident. This log is what turns "it\'s bad" into a plan revision, more hours, or hands-on training.',
  ),
  questionsHeading: draft('crisis.questions-heading', 'Raise these questions now'),
  questions: [
    draft(
      'crisis.question-1',
      'We need to talk about safety this week — can we meet sooner than our next session?',
    ),
    draft('crisis.question-2', 'What can be escalated in the plan right now?'),
    draft(
      'crisis.question-3',
      "Who do we call between sessions when there's an incident?",
    ),
  ],
  phoneHeading: draft('crisis.phone-heading', 'Call the appropriate team now'),
  immediateDangerHeading: draft('crisis.immediate-danger-heading', 'Immediate danger'),
  immediateDangerBody: draft(
    'crisis.immediate-danger-body',
    "If anyone is in immediate danger, call 911. If you're having thoughts of harming yourself, call or text 988.",
  ),
  backLabel: draft('crisis.back-label', 'Return to the Care Plan'),
} as const;
