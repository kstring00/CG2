import type { CopyEntry, StandardRowId } from '@/content/carePlan';

export type ParentFirstCategory = 'parent-load' | 'child-treatment';

export type WorksheetId =
  | 'incident-log'
  | 'one-sentence-card'
  | 'outing-log'
  | 'routine-log'
  | 'load-map'
  | 'provider-interview'
  | 'relatives-onepager';

export type ReflectItem = {
  title: CopyEntry;
  detail: CopyEntry;
};

export type SiteLink = {
  label: CopyEntry;
  detail: CopyEntry;
  href: string;
};

export type ParentFirstPlanContent = {
  category: ParentFirstCategory;
  reflect: {
    headline: CopyEntry;
    items: [ReflectItem, ReflectItem, ReflectItem];
  };
  stabilize: {
    options: [CopyEntry, CopyEntry, CopyEntry];
  };
  pathForward: {
    whatToBringUp: CopyEntry[];
    whatHelpToAskFor: CopyEntry[];
    whatChangesAndHowFast: CopyEntry[];
    whereToGoNext: CopyEntry[];
    siteLinks: SiteLink[];
  };
  worksheet: {
    id: WorksheetId;
    label: CopyEntry;
  };
};

const draft = (id: string, text: string): CopyEntry => ({
  id,
  text,
  approval: 'draft',
});

export const PARENT_FIRST_UI = {
  reflectLabel: draft('parent-first.ui.reflect-label', "What we're hearing"),
  stabilizeHeading: draft('parent-first.ui.stabilize-heading', 'Pick one thing for today'),
  stabilizeHelper: draft('parent-first.ui.stabilize-helper', 'One. Not a list.'),
  pathForwardHeading: draft('parent-first.ui.path-forward-heading', 'Your path forward'),
  whatToBringUpHeading: draft('parent-first.ui.what-to-bring-up-heading', 'What to bring up'),
  whatHelpToAskForHeading: draft(
    'parent-first.ui.what-help-to-ask-for-heading',
    'What kind of help to ask for',
  ),
  whatChangesHeading: draft(
    'parent-first.ui.what-changes-heading',
    'What usually changes, and how fast',
  ),
  whereNextHeading: draft(
    'parent-first.ui.where-next-heading',
    'Where to go next on this site',
  ),
  questionsHeadingYes: draft('parent-first.ui.questions-heading-yes', 'Questions for your BCBA'),
  questionsHeadingNo: draft(
    'parent-first.ui.questions-heading-no',
    'Questions for the provider you are evaluating',
  ),
  questionsInstruction: draft(
    'parent-first.ui.questions-instruction',
    'Pick two. Five questions asked is none asked.',
  ),
  takeItHeading: draft('parent-first.ui.take-it-heading', 'Take it with you'),
  downloadQuestions: draft(
    'parent-first.ui.download-questions',
    'Download my selected questions',
  ),
  takeItNote: draft(
    'parent-first.ui.take-it-note',
    'Type into it on your phone or computer and save it there, or print it. It stays on your device — this site never sees it.',
  ),
  behaviorsReviewNotice: draft(
    'parent-first.ui.behaviors-review-notice',
    'This parent-first layout is currently drafted for the behaviors branch. The other branches remain in their existing review format until their row-specific content is approved.',
  ),
} as const;

const behaviors = {
  'big-moments': {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.big-moments.reflect.headline',
        'You are trying to keep everyone safe without knowing when the next big moment will begin.',
      ),
      items: [
        {
          title: draft(
            'parent-first.big-moments.reflect.item-1.title',
            'Your body stays ready',
          ),
          detail: draft(
            'parent-first.big-moments.reflect.item-1.detail',
            'Even a quiet stretch can feel temporary when you are listening for the next crash, scream, hit, or call for help.',
          ),
        },
        {
          title: draft(
            'parent-first.big-moments.reflect.item-2.title',
            'The whole family adjusts around it',
          ),
          detail: draft(
            'parent-first.big-moments.reflect.item-2.detail',
            'Siblings leave rooms, plans get canceled, adults trade places, and ordinary evenings become safety decisions.',
          ),
        },
        {
          title: draft(
            'parent-first.big-moments.reflect.item-3.title',
            'It can be hard to make others understand',
          ),
          detail: draft(
            'parent-first.big-moments.reflect.item-3.detail',
            'A sentence like “it was bad again” cannot carry the fear, injury, exhaustion, and disruption you are living through.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.big-moments.stabilize.option-1',
          'Write one five-line incident note for the most recent big moment.',
        ),
        draft(
          'parent-first.big-moments.stabilize.option-2',
          'Send your clinic this sentence today: “Someone is being hurt at home. Can we review safety this week?”',
        ),
        draft(
          'parent-first.big-moments.stabilize.option-3',
          'Ask one trusted adult to join the next caregiver-training conversation.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.big-moments.path.bring-up.1',
          'Start with the sentence that carries the urgency: “The incidents at home are more intense than what you are seeing in session, and someone is being hurt.” Then hand over one concrete record instead of trying to retell the entire month from memory.',
        ),
        draft(
          'parent-first.big-moments.path.bring-up.2',
          'For each incident, include when it happened, what was happening in the two minutes before, how long it lasted, who was hurt and how, and what finally ended it. Add the family cost too: missed work, siblings hiding, damaged property, lost sleep, or an adult being unable to finish basic care.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.big-moments.path.help.1',
          'Ask for a safety review before the next routine progress meeting. Leave the conversation knowing who is reviewing the incidents, what else they need from you, and the date you will hear what changes are being considered.',
        ),
        draft(
          'parent-first.big-moments.path.help.2',
          'Ask whether a written safety plan, caregiver training for every adult present during incidents, or a review of support hours belongs in the next clinical discussion. Also ask for one clear number or contact route to use between sessions.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.big-moments.path.changes.1',
          'A safety conversation, a named contact, and a review date can happen quickly. Changes to goals, hours, or clinical procedures may take longer when new observation, assessment, staffing, or insurance approval is needed.',
        ),
        draft(
          'parent-first.big-moments.path.changes.2',
          'Do not leave with only “we will keep an eye on it.” Ask: “What will you review, what can change now, and when will we make the next decision?” Those three answers turn concern into a path.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.big-moments.path.next.1',
          'Open the Safety page when injuries, dangerous property destruction, or immediate risk are part of the picture. It puts the urgent contacts and the exact safety questions in one place.',
        ),
        draft(
          'parent-first.big-moments.path.next.2',
          'Open the Mental Health Toolbox for what remains in your body after the incident is over: the shaking, alertness, exhaustion, or dread of the next one.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.big-moments.link.safety.label', 'Open the safety page'),
          detail: draft(
            'parent-first.big-moments.link.safety.detail',
            'Use the one-tap safety route when someone is being injured or immediate danger may be present.',
          ),
          href: '/support/care-plan/crisis',
        },
        {
          label: draft(
            'parent-first.big-moments.link.mental-health.label',
            'Open the Mental Health Toolbox',
          ),
          detail: draft(
            'parent-first.big-moments.link.mental-health.detail',
            'Find parent-centered support for the strain that remains after a difficult incident.',
          ),
          href: '/support/mental-health',
        },
      ],
    },
    worksheet: {
      id: 'incident-log',
      label: draft(
        'parent-first.big-moments.worksheet.label',
        'Download the incident log',
      ),
    },
  },

  outings: {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.outings.reflect.headline',
        'Leaving home has started to cost more energy than your family has.',
      ),
      items: [
        {
          title: draft(
            'parent-first.outings.reflect.item-1.title',
            'Every trip feels like a risk calculation',
          ),
          detail: draft(
            'parent-first.outings.reflect.item-1.detail',
            'You may be scanning exits, timing waits, packing backups, and wondering whether you will have to leave before you arrive.',
          ),
        },
        {
          title: draft(
            'parent-first.outings.reflect.item-2.title',
            'Ordinary freedom keeps shrinking',
          ),
          detail: draft(
            'parent-first.outings.reflect.item-2.detail',
            'Groceries, appointments, worship, birthdays, restaurants, and siblings’ activities can all become things the family avoids.',
          ),
        },
        {
          title: draft(
            'parent-first.outings.reflect.item-3.title',
            'Canceled plans can become isolation',
          ),
          detail: draft(
            'parent-first.outings.reflect.item-3.detail',
            'After enough difficult trips, staying home can feel safer even while it makes your world smaller and lonelier.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.outings.stabilize.option-1',
          'Fill in one outing-log row for the last trip that ended early or never happened.',
        ),
        draft(
          'parent-first.outings.stabilize.option-2',
          'Send your team one sentence naming the outing your family most needs back.',
        ),
        draft(
          'parent-first.outings.stabilize.option-3',
          'Ask one trusted person to take a single errand off your plate this week.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.outings.path.bring-up.1',
          'Bring one real outing from beginning to end: where you needed to go, what made the trip matter, where it broke down, how it ended, and what the family lost afterward. One clear example is easier to act on than “we cannot go anywhere.”',
        ),
        draft(
          'parent-first.outings.path.bring-up.2',
          'Name the first piece of ordinary life you want back. It might be a medical appointment without leaving early, one grocery trip, a sibling’s game, church, or visiting grandparents. The destination tells the team what success would mean to your family.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.outings.path.help.1',
          'Ask whether community access can become a family priority in the program and what information is needed to evaluate it. Ask whether the team needs a caregiver interview, a direct observation, or a small set of outing records.',
        ),
        draft(
          'parent-first.outings.path.help.2',
          'Ask whether caregiver training can include the actual setting or a realistic version of it. Leave with one named setting, one person responsible for the next step, and a date for the first review.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.outings.path.changes.1',
          'Choosing the first outing and deciding what information is missing can happen in the next meeting. Arranging community observation, staffing, or schedule coordination may take longer.',
        ),
        draft(
          'parent-first.outings.path.changes.2',
          'One setting may improve before another because a grocery store, church lobby, and medical waiting room place different demands on the family. Ask which setting comes first and when the team will decide whether to expand.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.outings.path.next.1',
          'Use Sensory-Friendly Support to find lower-demand places and events that may give your family a more manageable way back into the community.',
        ),
        draft(
          'parent-first.outings.path.next.2',
          'Use Parent Connection when repeated cancellations have left you isolated. The purpose is belonging and practical local knowledge, not advice about your child’s behavior.',
        ),
      ],
      siteLinks: [
        {
          label: draft(
            'parent-first.outings.link.sensory.label',
            'Explore sensory-friendly options',
          ),
          detail: draft(
            'parent-first.outings.link.sensory.detail',
            'Find community places and events designed with lower-demand access in mind.',
          ),
          href: '/support/sensory-friendly',
        },
        {
          label: draft(
            'parent-first.outings.link.connection.label',
            'Open Parent Connection',
          ),
          detail: draft(
            'parent-first.outings.link.connection.detail',
            'Find parent community when canceled outings have made life smaller.',
          ),
          href: '/support/connect',
        },
      ],
    },
    worksheet: {
      id: 'outing-log',
      label: draft('parent-first.outings.worksheet.label', 'Download the outing log'),
    },
  },

  'daily-routines': {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.daily-routines.reflect.headline',
        'The same part of the day keeps taking everything you have.',
      ),
      items: [
        {
          title: draft(
            'parent-first.daily-routines.reflect.item-1.title',
            'One routine can drain the hours around it',
          ),
          detail: draft(
            'parent-first.daily-routines.reflect.item-1.detail',
            'Bedtime, meals, dressing, hygiene, or getting out the door can use the patience and time meant for the rest of the day.',
          ),
        },
        {
          title: draft(
            'parent-first.daily-routines.reflect.item-2.title',
            'You start the next thing already depleted',
          ),
          detail: draft(
            'parent-first.daily-routines.reflect.item-2.detail',
            'A difficult morning can follow you into work, school, appointments, and the evening before anyone has recovered.',
          ),
        },
        {
          title: draft(
            'parent-first.daily-routines.reflect.item-3.title',
            'Small routines carry big consequences',
          ),
          detail: draft(
            'parent-first.daily-routines.reflect.item-3.detail',
            'Being late, missing sleep, skipping meals, or avoiding hygiene can affect the whole family even when the concern sounds ordinary.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.daily-routines.stabilize.option-1',
          'Fill in one routine-log row the next time the hardest routine happens.',
        ),
        draft(
          'parent-first.daily-routines.stabilize.option-2',
          'Send your team this sentence: “This one routine is making the rest of our day unsustainable.”',
        ),
        draft(
          'parent-first.daily-routines.stabilize.option-3',
          'Move one nonessential household task out of that hour today.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.daily-routines.path.bring-up.1',
          'Name one routine with a clear beginning and end: “From wake-up to getting into the car is the part we cannot sustain.” That keeps the conversation from scattering across dressing, eating, hygiene, packing, medication, and leaving all at once.',
        ),
        draft(
          'parent-first.daily-routines.path.bring-up.2',
          'Bring one recent example with the start time, the steps that did and did not happen, how long it took, which adults were involved, and what the family missed or delayed. The point is to show the cost of the routine, not to prove that anyone failed.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.daily-routines.path.help.1',
          'Ask whether this routine can become the next family-priority goal and what the team needs before making that decision. Ask whether it is already represented in the program or has been sitting outside the active goals.',
        ),
        draft(
          'parent-first.daily-routines.path.help.2',
          'Ask whether caregiver training can focus on this exact hour with the adults who actually carry it. Also ask what can be paused or simplified while the routine is being reviewed.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.daily-routines.path.changes.1',
          'Defining the routine and choosing what to measure can happen in the next conversation. Observation, baseline collection, goal revision, and training across several caregivers may take additional sessions.',
        ),
        draft(
          'parent-first.daily-routines.path.changes.2',
          'Ask what improvement will look like: less time, fewer missed steps, less adult effort, or more consistency across days. Then ask for the date when the team will review whether family life is actually getting easier.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.daily-routines.path.next.1',
          'Open Sleep Support when bedtime, overnight waking, or morning exhaustion is feeding the routine problem.',
        ),
        draft(
          'parent-first.daily-routines.path.next.2',
          'Open At Home Strategies for materials you can review with your care team so the adults around your child receive the same approved information.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.daily-routines.link.sleep.label', 'Open Sleep Support'),
          detail: draft(
            'parent-first.daily-routines.link.sleep.detail',
            'Use this when bedtime, overnight waking, or morning sleep is part of the concern.',
          ),
          href: '/support/sleep',
        },
        {
          label: draft(
            'parent-first.daily-routines.link.home.label',
            'Open At Home Strategies',
          ),
          detail: draft(
            'parent-first.daily-routines.link.home.detail',
            'Review approved family materials to discuss with the care team.',
          ),
          href: '/support/at-home',
        },
      ],
    },
    worksheet: {
      id: 'routine-log',
      label: draft(
        'parent-first.daily-routines.worksheet.label',
        'Download the routine log',
      ),
    },
  },

  'communication-wall': {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.communication-wall.reflect.headline',
        'You keep trying to understand each other, and both sides keep leaving frustrated.',
      ),
      items: [
        {
          title: draft(
            'parent-first.communication-wall.reflect.item-1.title',
            'You are guessing when you want to connect',
          ),
          detail: draft(
            'parent-first.communication-wall.reflect.item-1.detail',
            'A sound, gesture, word, device response, or change in behavior can leave you unsure what your child needs from you.',
          ),
        },
        {
          title: draft(
            'parent-first.communication-wall.reflect.item-2.title',
            'Misunderstanding can escalate quickly',
          ),
          detail: draft(
            'parent-first.communication-wall.reflect.item-2.detail',
            'The longer a need stays unclear, the more helpless, urgent, and emotionally charged the moment can feel for everyone.',
          ),
        },
        {
          title: draft(
            'parent-first.communication-wall.reflect.item-3.title',
            'Different adults may be using different maps',
          ),
          detail: draft(
            'parent-first.communication-wall.reflect.item-3.detail',
            'A parent, grandparent, teacher, therapist, and sibling may each respond differently to the same signal.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.communication-wall.stabilize.option-1',
          'Write down one exact word, gesture, or device response from the last misunderstanding.',
        ),
        draft(
          'parent-first.communication-wall.stabilize.option-2',
          'Ask your BCBA for a ten-minute demonstration of the communication system at the next session.',
        ),
        draft(
          'parent-first.communication-wall.stabilize.option-3',
          'Send one other caregiver the same question so both of you ask for one clear explanation.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.communication-wall.path.bring-up.1',
          'Bring one breakdown from beginning to end: what your child did or said, what you thought it meant, what happened next, and whether the need was eventually understood. The gap may be in the system adults were taught, not in anyone’s effort.',
        ),
        draft(
          'parent-first.communication-wall.path.bring-up.2',
          'Ask the team to show how your child currently communicates a request, refusal, help, pain, a break, and “I do not understand.” You need to see the system, practice recognizing it, and know what parts are still being taught.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.communication-wall.path.help.1',
          'Ask for caregiver training that uses the communication system your child actually uses. Include every adult who regularly needs to recognize the signals at home.',
        ),
        draft(
          'parent-first.communication-wall.path.help.2',
          'Ask whether the BCBA, speech-language provider, and school need to align on the same responses across settings. Leave with a clear answer about who will coordinate and when the family will receive the shared explanation.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.communication-wall.path.changes.1',
          'A plain-language demonstration can often happen before a full program change. Aligning devices, goals, or expectations across several providers usually takes more coordination.',
        ),
        draft(
          'parent-first.communication-wall.path.changes.2',
          'Early improvement may look like more adults recognizing the same signal and fewer moments where the need remains unknown. Ask when the team will check whether communication is becoming clearer at home, not only in session.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.communication-wall.path.next.1',
          'Open What Is ABA? when goals, prompting, independence, or data language is making the communication program harder to understand.',
        ),
        draft(
          'parent-first.communication-wall.path.next.2',
          'Open the Resource Hub for communication materials you can bring into the next conversation with the BCBA or another qualified provider.',
        ),
      ],
      siteLinks: [
        {
          label: draft(
            'parent-first.communication-wall.link.aba.label',
            'Open What Is ABA?',
          ),
          detail: draft(
            'parent-first.communication-wall.link.aba.detail',
            'Review how goals, teaching, and measurement should be explained to families.',
          ),
          href: '/support/what-is-aba',
        },
        {
          label: draft(
            'parent-first.communication-wall.link.resources.label',
            'Open the Resource Hub',
          ),
          detail: draft(
            'parent-first.communication-wall.link.resources.detail',
            'Find approved communication resources to bring into the care-team conversation.',
          ),
          href: '/support/resources',
        },
      ],
    },
    worksheet: {
      id: 'one-sentence-card',
      label: draft(
        'parent-first.communication-wall.worksheet.label',
        'Download the communication conversation card',
      ),
    },
  },

  'why-behavior': {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.why-behavior.reflect.headline',
        'You are being asked to respond confidently to something that still does not make sense.',
      ),
      items: [
        {
          title: draft(
            'parent-first.why-behavior.reflect.item-1.title',
            'Not knowing makes every moment uncertain',
          ),
          detail: draft(
            'parent-first.why-behavior.reflect.item-1.detail',
            'When the explanation is unclear, you can second-guess what you noticed, what matters, and what you should tell the team.',
          ),
        },
        {
          title: draft(
            'parent-first.why-behavior.reflect.item-2.title',
            'Clinical words may leave you farther away',
          ),
          detail: draft(
            'parent-first.why-behavior.reflect.item-2.detail',
            'A label such as attention, escape, sensory, or noncompliance can sound final while still failing to explain your child’s actual pattern.',
          ),
        },
        {
          title: draft(
            'parent-first.why-behavior.reflect.item-3.title',
            'Conflicting examples can make you doubt yourself',
          ),
          detail: draft(
            'parent-first.why-behavior.reflect.item-3.detail',
            'What you see at home may not fit the explanation you heard, leaving you unsure whether you misunderstood or important information is missing.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.why-behavior.stabilize.option-1',
          'Write one before-behavior-after example without adding an explanation.',
        ),
        draft(
          'parent-first.why-behavior.stabilize.option-2',
          'Send your team this sentence: “I need the current explanation in plain language, with the evidence behind it.”',
        ),
        draft(
          'parent-first.why-behavior.stabilize.option-3',
          'Ask today: “What would make you change your current understanding?”',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.why-behavior.path.bring-up.1',
          'Ask for the current explanation in ordinary language, then ask what observations or assessment results support it. You are not asking for jargon translated word by word; you are asking how the team connected what it saw to the conclusion it reached.',
        ),
        draft(
          'parent-first.why-behavior.path.bring-up.2',
          'Bring one home example that does not fit. State what happened before, what the behavior looked like, what happened after, and why the example left you confused. Do not solve it for the team; the mismatch itself is useful information.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.why-behavior.path.help.1',
          'Ask which parts of the explanation came from direct observation, caregiver report, record review, or formal assessment. That tells you how much of the home pattern is actually represented.',
        ),
        draft(
          'parent-first.why-behavior.path.help.2',
          'Ask what additional examples or observation would help, and what evidence would make the team strengthen, weaken, or replace its current explanation. Also ask for caregiver education on what to notice without asking you to interpret it.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.why-behavior.path.changes.1',
          'The team can explain its current reasoning in the next clinical conversation. Building a stronger explanation may take more home examples, direct observation, or an updated assessment.',
        ),
        draft(
          'parent-first.why-behavior.path.changes.2',
          'Ask for two dates: when the current explanation will be reviewed with you, and when the team will decide whether new information changes the program. Those are separate steps, and you deserve clarity on both.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.why-behavior.path.next.1',
          'Open What Is ABA? to review the difference between observing a pattern, forming a clinical explanation, choosing goals, and measuring change.',
        ),
        draft(
          'parent-first.why-behavior.path.next.2',
          'Open the Resource Hub for approved educational material you can bring back to the BCBA when you need a term, assessment, or recommendation explained.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.why-behavior.link.aba.label', 'Review What Is ABA?'),
          detail: draft(
            'parent-first.why-behavior.link.aba.detail',
            'Learn how assessment, observable patterns, goals, and data fit together.',
          ),
          href: '/support/what-is-aba',
        },
        {
          label: draft(
            'parent-first.why-behavior.link.resources.label',
            'Browse the Resource Hub',
          ),
          detail: draft(
            'parent-first.why-behavior.link.resources.detail',
            'Open approved educational resources to discuss with a qualified provider.',
          ),
          href: '/support/resources',
        },
      ],
    },
    worksheet: {
      id: 'provider-interview',
      label: draft(
        'parent-first.why-behavior.worksheet.label',
        'Download the clinical explanation worksheet',
      ),
    },
  },
} satisfies Record<
  'big-moments' | 'outings' | 'daily-routines' | 'communication-wall' | 'why-behavior',
  ParentFirstPlanContent
>;

export const PARENT_FIRST_ROWS: Partial<Record<StandardRowId, ParentFirstPlanContent>> = behaviors;

export function worksheetHref(id: WorksheetId): string {
  return `/worksheets/${id}.pdf`;
}
