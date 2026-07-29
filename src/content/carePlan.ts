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
      'Choose the closest description. Anything about your child goes to the care team.',
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
        'You should not have to improvise your way through repeated incidents.',
      ),
      draft(
        'row.big-moments.body-2',
        'The most useful next move is to bring clear incident information and direct safety questions to the care team.',
      ),
    ],
    action: {
      heading: draft('row.big-moments.action-heading', 'Document the incident after everyone is safe.'),
      body: [
        draft(
          'row.big-moments.action-body-1',
          'Record the date, what happened immediately before it, how long it lasted, who was hurt, and how it ended.',
        ),
        draft(
          'row.big-moments.action-body-2',
          'This is information for the care team, not a score and not a request for you to determine why it happened.',
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
        'Losing access to ordinary family life is important information for the care team.',
      ),
      draft(
        'row.outings.body-2',
        'You can bring concrete examples without trying to create a child-specific strategy yourself.',
      ),
    ],
    action: {
      heading: draft('row.outings.action-heading', 'Document what happens on one outing.'),
      body: [
        draft(
          'row.outings.action-body-1',
          'After the outing, note the setting, what part became difficult, how long the outing lasted, and why the family had to change or end the plan.',
        ),
        draft(
          'row.outings.action-body-2',
          'Bring that description to the care team so community access can be discussed directly.',
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
        'A routine does not need to look dramatic to have a serious effect on the household.',
      ),
      draft(
        'row.daily-routines.body-2',
        'Choose the one routine creating the greatest daily cost and bring it to the care team.',
      ),
    ],
    action: {
      heading: draft('row.daily-routines.action-heading', 'Document the one routine that hurts most.'),
      body: [
        draft(
          'row.daily-routines.action-body-1',
          'Note when the routine begins, how long it takes, where the family gets stuck, and what the routine prevents afterward.',
        ),
        draft(
          'row.daily-routines.action-body-2',
          'Keep the description concrete so the team can decide what belongs in the program.',
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
        'You do not need to determine the communication solution on your own.',
      ),
      draft(
        'row.communication-wall.body-2',
        'Bring examples of where communication fails so the care team can explain the current system and what support is available.',
      ),
    ],
    action: {
      heading: draft('row.communication-wall.action-heading', 'Note when communication breaks down.'),
      body: [
        draft(
          'row.communication-wall.action-body-1',
          'After the moment, note what the child appeared to be trying to communicate and what the adults could not understand.',
        ),
        draft(
          'row.communication-wall.action-body-2',
          'Do not interpret the cause. Bring the observable example to the care team.',
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
        'Common Ground will not decide why a behavior happens for your child.',
      ),
      draft(
        'row.why-behavior.body-2',
        'The care team should explain its assessment, the evidence behind it, and what that means for your family.',
      ),
    ],
    education: {
      heading: draft(
        'row.why-behavior.education-heading',
        'Plain-language explainer — Clinical Director authorship required',
      ),
      body: [
        draft(
          'row.why-behavior.education-body-1',
          'DRAFT PLACEHOLDER: Behavior can communicate a need, difficulty, or response to the environment.',
        ),
        draft(
          'row.why-behavior.education-body-2',
          'Your BCBA should explain what the behavior may mean for your child and what evidence supports that interpretation.',
        ),
      ],
    },
    action: {
      heading: draft('row.why-behavior.action-heading', 'Choose one example to bring to the care team.'),
      body: [
        draft(
          'row.why-behavior.action-body-1',
          'Choose one recent moment that represents the concern clearly.',
        ),
        draft(
          'row.why-behavior.action-body-2',
          'Bring what happened, when it happened, and what you want explained. Do not try to diagnose the reason yourself.',
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
        'Support has to be sized for the number of adults and hours actually available.',
      ),
      draft(
        'row.alone.body-2',
        'Bring the points where the day breaks so the team can see what the current expectations cost.',
      ),
    ],
    action: {
      heading: draft('row.alone.action-heading', 'Note where the day breaks.'),
      body: [
        draft(
          'row.alone.action-body-1',
          'Identify the hours, routines, or tasks that become impossible when one adult is carrying everything.',
        ),
        draft(
          'row.alone.action-body-2',
          'This is capacity information for the team, not proof that you should be doing more.',
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
        'A relationship can be affected by unequal information, unequal responsibilities, and too little recovery time.',
      ),
      draft(
        'row.marriage-strain.body-2',
        'You can ask for support without assigning blame or minimizing what is happening.',
      ),
    ],
    action: {
      heading: draft('row.marriage-strain.action-heading', 'Choose one pressure point to name.'),
      body: [
        draft(
          'row.marriage-strain.action-body-1',
          'Choose the routine, responsibility, or care decision creating the most strain right now.',
        ),
        draft(
          'row.marriage-strain.action-body-2',
          'Bring that one point to the appropriate conversation instead of trying to solve the whole relationship at once.',
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
        'Visibility can make the conversation more concrete without turning family life into a competition.',
      ),
      draft(
        'row.partner-load.body-2',
        'The goal is to show capacity and scheduling barriers that the team may be able to address.',
      ),
    ],
    action: {
      heading: draft('row.partner-load.action-heading', 'Notice who carries what for one week.'),
      body: [
        draft(
          'row.partner-load.action-body-1',
          'Notice appointments, routines, communication, paperwork, and difficult hours.',
        ),
        draft(
          'row.partner-load.action-body-2',
          'Use it as capacity data for the team, not a scorecard between partners.',
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
        'Relatives and trusted adults may need plain language, clear expectations, and a concrete way to help.',
      ),
      draft(
        'row.judged.body-2',
        'The care team can help determine what education is accurate and appropriate to share.',
      ),
    ],
    printableRelativeGuide: {
      heading: draft(
        'row.judged.relative-guide-heading',
        'Family one-pager — Clinical Director authorship required',
      ),
      body: [
        draft(
          'row.judged.relative-guide-body-1',
          'DRAFT PLACEHOLDER: Behavior is not evidence of bad parenting.',
        ),
        draft(
          'row.judged.relative-guide-body-2',
          'DRAFT PLACEHOLDER: Explain what the family is managing without diagnosing the child or sharing private details.',
        ),
        draft(
          'row.judged.relative-guide-body-3',
          'DRAFT PLACEHOLDER: Offer specific ways relatives can reduce the load and follow the care team’s guidance.',
        ),
      ],
    },
    action: {
      heading: draft('row.judged.action-heading', 'Ask the care team to review the family one-pager.'),
      body: [
        draft(
          'row.judged.action-body-1',
          'Use the draft only as a starting point for Clinical Director-approved family education.',
        ),
        draft(
          'row.judged.action-body-2',
          'Do not include the child’s name, diagnosis details, or private clinical information.',
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
        'This page cannot measure how serious the moment is, and you should not have to decide alone.',
      ),
      draft(
        'row.cannot-keep-doing.body-2',
        'Tell a real person today and use immediate support if the situation becomes unsafe.',
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
          'Choose the person before you leave this page: a trusted person, therapist, faith leader, healthcare professional, or crisis counselor.',
        ),
        draft(
          'row.cannot-keep-doing.action-body-2',
          'Say plainly that you are at your limit and need them to stay connected with you today.',
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
        'A plan that assumes energy you do not have is not a workable plan for the family.',
      ),
      draft(
        'row.nothing-left.body-2',
        'Bring the capacity problem into the next conversation so expectations can be reviewed.',
      ),
    ],
    quietSupport: draft(
      'row.nothing-left.quiet-988',
      'If it gets darker than this page can help with, call or text 988 — any hour.',
    ),
    action: {
      heading: draft('row.nothing-left.action-heading', 'Protect one small window today.'),
      body: [
        draft(
          'row.nothing-left.action-body-1',
          'Choose a brief, real window that is not spent solving a problem, completing a task, or catching up.',
        ),
        draft(
          'row.nothing-left.action-body-2',
          'The window is not a reward. It is evidence of the capacity the current plan must protect.',
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
        'Love and grief can exist in the same parent without canceling each other out.',
      ),
      draft(
        'row.grieving.body-2',
        'This deserves support that can hold the parent’s experience without turning it into a judgment about the child.',
      ),
    ],
    quietSupport: draft(
      'row.grieving.quiet-988',
      'If it gets darker than this page can help with, call or text 988 — any hour.',
    ),
    action: {
      heading: draft('row.grieving.action-heading', 'Choose one person who can hear the grief without correcting it.'),
      body: [
        draft(
          'row.grieving.action-body-1',
          'Choose a trusted person or professional who can listen without telling you what you should feel.',
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
        'Parent support should make room for a whole person, not only a caregiving role.',
      ),
      draft(
        'row.disappeared.body-2',
        'Choose one recurring part of life that needs to belong to you again and make the support request concrete.',
      ),
    ],
    quietSupport: draft(
      'row.disappeared.quiet-988',
      'If it gets darker than this page can help with, call or text 988 — any hour.',
    ),
    action: {
      heading: draft('row.disappeared.action-heading', 'Pick the one recurring hour that will be yours.'),
      body: [
        draft(
          'row.disappeared.action-body-1',
          'Choose an hour that can recur, not a perfect day that may never arrive.',
        ),
        draft(
          'row.disappeared.action-body-2',
          'Bring the scheduling or respite barrier into the next conversation so the hour can become realistic.',
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
        'You do not need to defend the question before the team answers it clearly.',
      ),
      draft(
        'row.thinking-stopping.body-2',
        'Ask for an honest review of the data, the options, and what each path would mean for the family.',
      ),
    ],
    action: {
      heading: draft('row.thinking-stopping.action-heading', 'Bring the decision questions together.'),
      body: [
        draft(
          'row.thinking-stopping.action-body-1',
          'Use the questions below as the agenda for a dedicated progress conversation.',
        ),
        draft(
          'row.thinking-stopping.action-body-2',
          'You can ask for the answers in plain language and request time to consider them.',
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
        'Progress should be explainable in terms the family understands and connected to life outside sessions.',
      ),
      draft(
        'row.no-progress.body-2',
        'Bring the difference between the reported data and the home experience into the review.',
      ),
    ],
    action: {
      heading: draft('row.no-progress.action-heading', 'Note what home actually looks like.'),
      body: [
        draft(
          'row.no-progress.action-body-1',
          'Choose two or three concrete examples of what is unchanged, harder, or not showing up at home.',
        ),
        draft(
          'row.no-progress.action-body-2',
          'Do not interpret the data yourself. Ask the team to reconcile what they see with what the family sees.',
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
        'A concern deserves a clear route for observation, explanation, and escalation.',
      ),
      draft(
        'row.sessions-concern.body-2',
        'Specific moments are easier to review than a general feeling, but you do not need perfect evidence before asking.',
      ),
    ],
    action: {
      heading: draft('row.sessions-concern.action-heading', 'Note the specific moments that concern you.'),
      body: [
        draft(
          'row.sessions-concern.action-body-1',
          'Record the date, setting, what you observed or were told, and the question it raised for you.',
        ),
        draft(
          'row.sessions-concern.action-body-2',
          'Keep the note factual and use it to request explanation or escalation.',
        ),
      ],
    },
    questions: [
      draft('row.sessions-concern.question-1', 'Can I observe a session?'),
      draft(
        'row.sessions-concern.question-2',
        'Who do I talk to above the BCBA if I need to?',
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
        'You should be able to understand what each goal is for and how the team will know whether it is helping.',
      ),
      draft(
        'row.unclear-care.body-2',
        'Ask for the next month to be described in concrete, parent-friendly terms.',
      ),
    ],
    action: {
      heading: draft('row.unclear-care.action-heading', 'Choose the goals you most need explained.'),
      body: [
        draft(
          'row.unclear-care.action-body-1',
          'Bring the names of the goals or recommendations you do not understand.',
        ),
        draft(
          'row.unclear-care.action-body-2',
          'Ask the team to explain purpose, evidence, expected change, and timeline without jargon.',
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
      'This page does not give behavior advice. It helps you bring an urgent safety concern to the people responsible for clinical care.',
    ),
    draft(
      'crisis.body-2',
      'Escalation options may include a revised plan, caregiver training, or more hours. DRAFT PLACEHOLDER: Clinical Director confirmation required before publication.',
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
