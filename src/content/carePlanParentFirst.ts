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
        'The house is being asked to absorb incidents the clinic may never see.',
      ),
      items: [
        {
          title: draft(
            'parent-first.big-moments.reflect.item-1.title',
            'Home and session may look different',
          ),
          detail: draft(
            'parent-first.big-moments.reflect.item-1.detail',
            'A structured session with a trained adult may not show what happens during the most crowded, tired parts of home life.',
          ),
        },
        {
          title: draft(
            'parent-first.big-moments.reflect.item-2.title',
            'The uncertainty is wearing on everyone',
          ),
          detail: draft(
            'parent-first.big-moments.reflect.item-2.detail',
            'When the next incident feels unpredictable, the household can start organizing itself around preventing another one.',
          ),
        },
        {
          title: draft(
            'parent-first.big-moments.reflect.item-3.title',
            'Your team needs the home version',
          ),
          detail: draft(
            'parent-first.big-moments.reflect.item-3.detail',
            'Concrete incident records can show conditions, severity, and impact that ordinary session notes may not capture.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.big-moments.stabilize.option-1',
          'Choose the one recent incident you most need reviewed first.',
        ),
        draft(
          'parent-first.big-moments.stabilize.option-2',
          'Keep the safety-page link where you can reach it quickly.',
        ),
        draft(
          'parent-first.big-moments.stabilize.option-3',
          'Decide which adult in the home most needs caregiver training included.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.big-moments.path.bring-up.1',
          'Lead with the difference between session and home: “The incidents we are seeing at home are more intense than what appears in the session notes.” That tells the BCBA the current data set may not represent the environment where the family is struggling most.',
        ),
        draft(
          'parent-first.big-moments.path.bring-up.2',
          'Bring three to five factual examples, not a long explanation. For each one, include when it happened, what was happening in the two minutes before, how long it lasted, who was injured or affected, and what finally ended the incident. The worksheet gives those facts a consistent shape without asking you to interpret why the behavior occurred.',
        ),
        draft(
          'parent-first.big-moments.path.bring-up.3',
          'Say the impact plainly: missed work, siblings leaving the room, damaged property, injuries, or adults being unable to complete ordinary care. Impact is not exaggeration; it helps the team understand urgency and whether the current level of support should be reviewed.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.big-moments.path.help.1',
          'Ask whether the team can conduct a focused review of the home incidents rather than waiting for the next routine progress meeting. The useful question is who will review the records, what additional information is needed, and when the family will hear the clinical decision.',
        ),
        draft(
          'parent-first.big-moments.path.help.2',
          'Ask whether a written safety plan, caregiver training for every adult present during incidents, or a reassessment of support hours should be considered. These are questions for the clinical team, not promises that each service is available or appropriate.',
        ),
        draft(
          'parent-first.big-moments.path.help.3',
          'Ask for one clear between-session contact route. Families should know whether to call the clinic, use a designated clinical contact, or use emergency services when immediate danger is present; the answer should not depend on guessing during the next incident.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.big-moments.path.changes.1',
          'A safety conversation and review date can be requested immediately. A formal change to goals, hours, or clinical procedures may take longer because the team may need records, direct observation, updated assessment, authorization, or coordination with other providers.',
        ),
        draft(
          'parent-first.big-moments.path.changes.2',
          'The first useful change is often not a promise that incidents will stop. It is a named reviewer, a defined information request, an interim contact plan, and a date when the team will decide whether the current program needs revision.',
        ),
        draft(
          'parent-first.big-moments.path.changes.3',
          'Ask for the next decision point before leaving the conversation: “What will you review, and when will we decide what changes?” That gives the family a timeline without forcing the clinician toward a predetermined conclusion.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.big-moments.path.next.1',
          'Use the Safety page when injuries, dangerous property destruction, or immediate risk are part of the picture. It keeps urgent contact information separate from the ordinary Care Plan flow.',
        ),
        draft(
          'parent-first.big-moments.path.next.2',
          'Use the Mental Health Toolbox for the parent’s own nervous-system load after difficult incidents. That section is about supporting the caregiver, not interpreting or managing the child’s behavior.',
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
            'Find parent-centered tools for the stress that remains after a difficult incident.',
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
        'Your family is paying for every outing before it even starts.',
      ),
      items: [
        {
          title: draft(
            'parent-first.outings.reflect.item-1.title',
            'Leaving home has become a calculation',
          ),
          detail: draft(
            'parent-first.outings.reflect.item-1.detail',
            'A simple errand can require planning around exits, waiting, noise, transitions, other people, and the trip back home.',
          ),
        },
        {
          title: draft(
            'parent-first.outings.reflect.item-2.title',
            'The clinic may not see this problem',
          ),
          detail: draft(
            'parent-first.outings.reflect.item-2.detail',
            'Community settings contain demands and unpredictability that may never appear inside a familiar treatment room.',
          ),
        },
        {
          title: draft(
            'parent-first.outings.reflect.item-3.title',
            'Staying home costs the whole family',
          ),
          detail: draft(
            'parent-first.outings.reflect.item-3.detail',
            'Appointments, family events, errands, siblings’ activities, and ordinary freedom can all shrink when every trip feels unsafe or impossible.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.outings.stabilize.option-1',
          'Choose the one outing your family most needs to regain.',
        ),
        draft(
          'parent-first.outings.stabilize.option-2',
          'Name the exact point where the outing usually becomes impossible.',
        ),
        draft(
          'parent-first.outings.stabilize.option-3',
          'Select one recent outing you can describe without filling in the blanks.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.outings.path.bring-up.1',
          'Bring one outing, not the entire history. Name the destination, why the family needed to go, the point where it broke down, how the outing ended, and what the family had to give up afterward. That turns “we cannot go anywhere” into a community-access concern the team can evaluate.',
        ),
        draft(
          'parent-first.outings.path.bring-up.2',
          'Say which outings matter most to family life: medical appointments, grocery shopping, worship, school events, restaurants, or visiting relatives. A clinically measurable goal still needs to begin with a socially meaningful reason, and the parent is the person who can define that reason.',
        ),
        draft(
          'parent-first.outings.path.bring-up.3',
          'Describe what is different outside the clinic without guessing at function: longer waits, unfamiliar adults, crowded spaces, travel time, transitions, or no quiet place to reset. Those environmental facts help the BCBA decide what must be assessed.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.outings.path.help.1',
          'Ask whether community participation can be treated as a family priority and whether the current assessment includes the settings where outings fail. The team can then explain whether direct observation, caregiver interview, or additional baseline information is needed.',
        ),
        draft(
          'parent-first.outings.path.help.2',
          'Ask whether caregiver training can include community settings or realistic practice conditions if clinically appropriate. Do not accept a general promise to “work on outings”; ask what setting will be observed, who will be involved, and how the team will measure change.',
        ),
        draft(
          'parent-first.outings.path.help.3',
          'Ask whether the family should prioritize one type of outing first rather than trying to solve every public setting at once. That is a clinical prioritization question, not a request for the website to choose a strategy.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.outings.path.changes.1',
          'The team may be able to choose a priority outing and decide what information is missing during the next clinical conversation. Direct community observation, staffing, authorization, or coordination with the family’s schedule may take longer.',
        ),
        draft(
          'parent-first.outings.path.changes.2',
          'Progress in one setting may not automatically appear in another. A grocery store, church lobby, and medical waiting room can function like three different environments, so ask which setting is being addressed first and when transfer to another setting will be reviewed.',
        ),
        draft(
          'parent-first.outings.path.changes.3',
          'A realistic first milestone may be better information and a defined target, not a successful full outing. Ask what early change the team expects to see and what date will trigger a review if the family is still staying home.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.outings.path.next.1',
          'Use Sensory-Friendly Support to locate lower-demand community options while the family and clinical team decide what to assess. The directory does not replace individualized clinical guidance.',
        ),
        draft(
          'parent-first.outings.path.next.2',
          'Use Parent Connection when isolation is becoming part of the cost. Other parents can offer belonging and practical community knowledge without being asked to interpret your child’s behavior.',
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
            'Find parent community when repeated canceled outings have made life smaller.',
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
        'The day is being lost in the same small transitions.',
      ),
      items: [
        {
          title: draft(
            'parent-first.daily-routines.reflect.item-1.title',
            'One routine can drain the whole household',
          ),
          detail: draft(
            'parent-first.daily-routines.reflect.item-1.detail',
            'Sleep, meals, dressing, hygiene, or leaving the house can consume the energy needed for everything that follows.',
          ),
        },
        {
          title: draft(
            'parent-first.daily-routines.reflect.item-2.title',
            'Ordinary routines disappear in broad reports',
          ),
          detail: draft(
            'parent-first.daily-routines.reflect.item-2.detail',
            'A program can show progress while the family still loses an hour every morning to the same unresolved routine.',
          ),
        },
        {
          title: draft(
            'parent-first.daily-routines.reflect.item-3.title',
            'Too many priorities can hide the real one',
          ),
          detail: draft(
            'parent-first.daily-routines.reflect.item-3.detail',
            'When every routine is discussed at once, the team may never see which single part of the day is doing the most damage.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.daily-routines.stabilize.option-1',
          'Pick the single routine that costs the family the most.',
        ),
        draft(
          'parent-first.daily-routines.stabilize.option-2',
          'Choose the exact beginning and ending of that routine.',
        ),
        draft(
          'parent-first.daily-routines.stabilize.option-3',
          'Bring one recent example instead of trying to summarize the whole week.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.daily-routines.path.bring-up.1',
          'Name one routine in plain family language: “Getting from wake-up to the car is the part of the day we cannot sustain.” A narrow boundary matters because “mornings are hard” can contain waking, dressing, eating, medication, hygiene, packing, and leaving — too many separate events for one useful review.',
        ),
        draft(
          'parent-first.daily-routines.path.bring-up.2',
          'Bring one recent example with the start time, the steps that did and did not happen, how long the routine took, which adults were involved, and what the family missed or delayed because of it. The goal is not to prove poor behavior; it is to show the practical cost of the routine.',
        ),
        draft(
          'parent-first.daily-routines.path.bring-up.3',
          'Ask the BCBA to connect the routine to the current program. A routine can be central to family functioning and still remain outside the active goals unless the parent names it as a priority.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.daily-routines.path.help.1',
          'Ask whether this routine can become the next family-priority target and what assessment would be needed before changing the program. The clinician should be able to explain whether the issue is already represented in goals or is currently outside the plan.',
        ),
        draft(
          'parent-first.daily-routines.path.help.2',
          'Ask whether caregiver training can focus on the exact routine, with the adults who actually carry it out. Training scheduled around a generic clinic example may not reveal the constraints present at 6:30 in the morning or at bedtime.',
        ),
        draft(
          'parent-first.daily-routines.path.help.3',
          'Ask which current home expectations can be paused or simplified while the routine is being reviewed. That decision belongs to the care team and family together; the website should not decide what to remove.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.daily-routines.path.changes.1',
          'Choosing one routine and defining its boundaries can happen in the next meeting. Collecting baseline information, observing the routine, revising goals, or training multiple caregivers may require additional sessions and scheduling.',
        ),
        draft(
          'parent-first.daily-routines.path.changes.2',
          'The first measurable improvement may be a shorter routine, fewer missed steps, less adult time, or greater consistency across caregivers. The team should name which outcome it is measuring rather than using “better mornings” as the only standard.',
        ),
        draft(
          'parent-first.daily-routines.path.changes.3',
          'Ask when the routine will be reviewed if the family’s day is not improving. A defined review date protects the concern from remaining a standing discussion item with no clinical decision.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.daily-routines.path.next.1',
          'Use the Sleep page when the routine begins or ends with sleep disruption, because sleep concerns may require coordination beyond a single ABA goal.',
        ),
        draft(
          'parent-first.daily-routines.path.next.2',
          'Use At Home Strategies only for material already aligned with the family’s clinical team. The page should support consistency, not invite parents to improvise a behavior procedure.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.daily-routines.link.sleep.label', 'Open Sleep Support'),
          detail: draft(
            'parent-first.daily-routines.link.sleep.detail',
            'Use this when bedtime, overnight waking, or morning sleep is part of the routine concern.',
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
            'Review approved family materials that can be discussed with the care team.',
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
        'Both sides are working hard and still missing each other.',
      ),
      items: [
        {
          title: draft(
            'parent-first.communication-wall.reflect.item-1.title',
            'Need and response are not lining up',
          ),
          detail: draft(
            'parent-first.communication-wall.reflect.item-1.detail',
            'Your child may be communicating something, while the adults around them are receiving different or incomplete information.',
          ),
        },
        {
          title: draft(
            'parent-first.communication-wall.reflect.item-2.title',
            'Different adults may read the same signal differently',
          ),
          detail: draft(
            'parent-first.communication-wall.reflect.item-2.detail',
            'A gesture, word, device response, or change in behavior can mean one thing to a therapist and something else to a parent or grandparent.',
          ),
        },
        {
          title: draft(
            'parent-first.communication-wall.reflect.item-3.title',
            'The communication system may live only in session',
          ),
          detail: draft(
            'parent-first.communication-wall.reflect.item-3.detail',
            'If caregivers were not taught how the current system works, home becomes the place where everyone is expected to guess.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.communication-wall.stabilize.option-1',
          'Choose one recent moment when nobody understood what was needed.',
        ),
        draft(
          'parent-first.communication-wall.stabilize.option-2',
          'Name the caregiver who most needs the communication system explained.',
        ),
        draft(
          'parent-first.communication-wall.stabilize.option-3',
          'Bring the exact word, gesture, or device response you observed without interpreting it.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.communication-wall.path.bring-up.1',
          'Bring one communication breakdown from beginning to end: what your child did or said, what the adult thought it meant, what the adult did next, and whether the need was eventually understood. The important gap may be between the child’s system and the caregiver’s training, not a lack of effort on either side.',
        ),
        draft(
          'parent-first.communication-wall.path.bring-up.2',
          'Ask the team to show how your child currently communicates requests, refusal, help, pain, a break, and “I do not understand.” Those functions may use different forms, and parents should not be expected to infer the system from session summaries.',
        ),
        draft(
          'parent-first.communication-wall.path.bring-up.3',
          'Name where consistency breaks: one caregiver recognizes the signal, school uses a different device page, or the response works in session but not at home. That is coordination information the BCBA can evaluate with the rest of the team.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.communication-wall.path.help.1',
          'Ask for caregiver training on the communication system currently in use, including how adults know when the response is independent, prompted, unavailable, or not yet understood. The clinician should explain the system without requiring the family to learn through trial and error.',
        ),
        draft(
          'parent-first.communication-wall.path.help.2',
          'Ask whether the BCBA needs to coordinate with speech-language, school, or other providers so the same communication response is recognized across settings. Coordination may require consent, scheduling, and agreement about roles.',
        ),
        draft(
          'parent-first.communication-wall.path.help.3',
          'Ask what home examples would help the team evaluate whether the current communication goals are transferring outside sessions. The answer should identify observable information, not ask the parent to decide the function of behavior.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.communication-wall.path.changes.1',
          'A plain-language explanation or caregiver demonstration can often be scheduled before a full program revision. Changes to communication goals, devices, or interdisciplinary responsibilities may require more assessment and coordination.',
        ),
        draft(
          'parent-first.communication-wall.path.changes.2',
          'Early progress may look like more adults recognizing the same signal or fewer situations where the need remains unknown. Fluency across people and settings usually takes repeated practice and review rather than one explanation.',
        ),
        draft(
          'parent-first.communication-wall.path.changes.3',
          'Ask when the team will check whether home communication is becoming clearer. Session performance alone cannot answer whether the family is understanding one another outside the clinic.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.communication-wall.path.next.1',
          'Use What Is ABA for a plain-language explanation of how goals and data are supposed to connect. It can help the parent prepare questions without interpreting the child’s communication independently.',
        ),
        draft(
          'parent-first.communication-wall.path.next.2',
          'Use the Resource Hub to locate communication and caregiver-training materials that can be reviewed with the BCBA or another qualified provider.',
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
            'Find approved communication resources to bring into the clinical conversation.',
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
        'You are being asked to respond to something nobody has explained.',
      ),
      items: [
        {
          title: draft(
            'parent-first.why-behavior.reflect.item-1.title',
            'A label is not an explanation',
          ),
          detail: draft(
            'parent-first.why-behavior.reflect.item-1.detail',
            'Words like avoidance, attention, sensory, or noncompliance do not tell a parent what evidence supports the team’s current understanding.',
          ),
        },
        {
          title: draft(
            'parent-first.why-behavior.reflect.item-2.title',
            'Home context may change the pattern',
          ),
          detail: draft(
            'parent-first.why-behavior.reflect.item-2.detail',
            'People, timing, demands, access, fatigue, and setting can differ enough that a session explanation may not fit every home example.',
          ),
        },
        {
          title: draft(
            'parent-first.why-behavior.reflect.item-3.title',
            'You should not have to guess the function',
          ),
          detail: draft(
            'parent-first.why-behavior.reflect.item-3.detail',
            'Determining why behavior persists is a clinical task based on assessment and data, not a conclusion the website should hand to a parent.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.why-behavior.stabilize.option-1',
          'Pick the one behavior you most need explained in plain language.',
        ),
        draft(
          'parent-first.why-behavior.stabilize.option-2',
          'Choose one recent example that does not fit the explanation you were given.',
        ),
        draft(
          'parent-first.why-behavior.stabilize.option-3',
          'Select the one clinical word or phrase you need translated first.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.why-behavior.path.bring-up.1',
          'Ask for the team’s current hypothesis in plain language, then ask what observations or assessment results support it. A clinical hypothesis should be connected to patterns in what happens before and after behavior; it should not be presented as a fixed trait inside the child.',
        ),
        draft(
          'parent-first.why-behavior.path.bring-up.2',
          'Bring one home example that seems inconsistent with the explanation. Do not interpret it. State what happened before, what the behavior looked like, what happened after, and why the example left you confused. A mismatch can tell the team where more assessment is needed.',
        ),
        draft(
          'parent-first.why-behavior.path.bring-up.3',
          'Ask what would make the team revise its current understanding. Good clinical reasoning is testable: the BCBA should be able to name what evidence would strengthen, weaken, or replace the present hypothesis.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.why-behavior.path.help.1',
          'Ask for a plain-language review of the assessment process, including which information came from direct observation, caregiver report, record review, or formal analysis. Different sources answer different questions, and the parent should know what the conclusion is built on.',
        ),
        draft(
          'parent-first.why-behavior.path.help.2',
          'Ask whether additional home examples, direct observation, or coordination with another provider would be useful before the family is asked to follow a clinical recommendation. Phrase this as a request for assessment clarity, not a request for the website to select an intervention.',
        ),
        draft(
          'parent-first.why-behavior.path.help.3',
          'Ask for caregiver education on what to observe and report without assigning meaning. The distinction matters: parents can provide strong descriptive information while the clinician remains responsible for interpretation.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.why-behavior.path.changes.1',
          'The BCBA can usually explain the current reasoning during a clinical meeting. Increasing confidence in that reasoning may take additional examples, direct observation, or updated assessment over a longer period.',
        ),
        draft(
          'parent-first.why-behavior.path.changes.2',
          'A changed explanation does not automatically produce an immediate program revision. The team may need to decide whether the new information is strong enough, whether goals are affected, and whether authorization or coordination is required.',
        ),
        draft(
          'parent-first.why-behavior.path.changes.3',
          'Ask for two dates: when the team will explain the current hypothesis, and when it will decide whether new information changes the program. Separating explanation from decision keeps the family from waiting indefinitely for both.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.why-behavior.path.next.1',
          'Use What Is ABA to review the difference between observing behavior, measuring patterns, and choosing goals. The page should prepare the parent to ask better questions, not determine the function of a specific behavior.',
        ),
        draft(
          'parent-first.why-behavior.path.next.2',
          'Use the Resource Hub for approved educational material that can be brought back to the BCBA for clarification and application to the child’s actual program.',
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
