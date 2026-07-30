import type { CopyEntry } from '@/content/carePlan';
import type { ParentFirstPlanContent } from '@/content/carePlanParentFirst';

const draft = (id: string, text: string): CopyEntry => ({ id, text, approval: 'draft' });

export const PARENT_FIRST_WORKING_ROWS = {
  'thinking-stopping': {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.thinking-stopping.reflect.headline',
        'You are weighing whether the cost of continuing still makes sense for your family.',
      ),
      items: [
        {
          title: draft('parent-first.thinking-stopping.reflect.item-1.title', 'The decision may feel disloyal'),
          detail: draft(
            'parent-first.thinking-stopping.reflect.item-1.detail',
            'You may worry that asking whether to stop sounds like giving up on your child or criticizing people who have tried to help.',
          ),
        },
        {
          title: draft('parent-first.thinking-stopping.reflect.item-2.title', 'The family is paying real costs now'),
          detail: draft(
            'parent-first.thinking-stopping.reflect.item-2.detail',
            'Time, transportation, missed work, emotional energy, siblings’ schedules, and life at home all belong in the decision.',
          ),
        },
        {
          title: draft('parent-first.thinking-stopping.reflect.item-3.title', 'Reassurance is not enough information'),
          detail: draft(
            'parent-first.thinking-stopping.reflect.item-3.detail',
            'You need to understand what has changed, what has not, and what each available path would realistically require next.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.thinking-stopping.stabilize.option-1',
          'Send: “I need a dedicated meeting to discuss whether continuing still makes sense.”',
        ),
        draft(
          'parent-first.thinking-stopping.stabilize.option-2',
          'Write one sentence naming the biggest cost of continuing right now.',
        ),
        draft(
          'parent-first.thinking-stopping.stabilize.option-3',
          'Choose one decision date so the question does not stay open forever.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.thinking-stopping.path.bring-up.1',
          'Say the question directly: “I am considering stopping, and I need a full-information conversation rather than reassurance.” A dedicated meeting gives the team time to prepare data and prevents the decision from being squeezed into a session handoff.',
        ),
        draft(
          'parent-first.thinking-stopping.path.bring-up.2',
          'Bring the family cost alongside the clinical picture. If services are helping one area while making work, sleep, transportation, or family life unsustainable, both sides of that equation belong in the conversation.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.thinking-stopping.path.help.1',
          'Ask for a plain-language progress review that separates meaningful gains, unchanged goals, new concerns, and skills that have not carried into home life. Ask what evidence supports continuing the current approach rather than simply continuing services in general.',
        ),
        draft(
          'parent-first.thinking-stopping.path.help.2',
          'Ask what options exist between “continue exactly as-is” and “stop immediately.” That may include a revised schedule, different priorities, a transition plan, or another referral, but the team should explain what is actually available for your situation.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.thinking-stopping.path.changes.1',
          'The data review and options conversation can be scheduled promptly. A responsible transition, major program revision, or coordination with another provider may take longer than the decision itself.',
        ),
        draft(
          'parent-first.thinking-stopping.path.changes.2',
          'You do not have to decide during the meeting. Leave with the information, the available options, and a date when you will answer. A decision made after reflection is still a timely decision.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.thinking-stopping.path.next.1',
          'Open the “I do not see progress” outcome when the central question is whether the reported gains match what your family actually experiences.',
        ),
        draft(
          'parent-first.thinking-stopping.path.next.2',
          'Open What Is ABA when the decision is difficult because nobody has clearly explained what the current goals are supposed to accomplish.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.thinking-stopping.link.aba.label', 'Open What Is ABA?'),
          detail: draft(
            'parent-first.thinking-stopping.link.aba.detail',
            'Review what goals, measurement, and family involvement should look like before making the decision.',
          ),
          href: '/support/what-is-aba',
        },
        {
          label: draft('parent-first.thinking-stopping.link.resources.label', 'Open the Resource Hub'),
          detail: draft(
            'parent-first.thinking-stopping.link.resources.detail',
            'Find approved information to support a careful services decision.',
          ),
          href: '/support/resources',
        },
      ],
    },
    worksheet: {
      id: 'provider-interview',
      label: draft('parent-first.thinking-stopping.worksheet.label', 'Download the continue-or-stop meeting sheet'),
    },
  },

  'no-progress': {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.no-progress.reflect.headline',
        'The progress being described does not match the life your family is living at home.',
      ),
      items: [
        {
          title: draft('parent-first.no-progress.reflect.item-1.title', 'Reports and real life feel disconnected'),
          detail: draft(
            'parent-first.no-progress.reflect.item-1.detail',
            'A graph may move while dinner, mornings, communication, safety, or community life still feels unchanged.',
          ),
        },
        {
          title: draft('parent-first.no-progress.reflect.item-2.title', 'You may doubt your own observations'),
          detail: draft(
            'parent-first.no-progress.reflect.item-2.detail',
            'Clinical language and numbers can make a parent wonder whether the home picture counts when it does not match the report.',
          ),
        },
        {
          title: draft('parent-first.no-progress.reflect.item-3.title', 'The gap itself is useful information'),
          detail: draft(
            'parent-first.no-progress.reflect.item-3.detail',
            'A skill can improve in session without appearing at home, or the measurement may not be capturing the change your family actually needs.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.no-progress.stabilize.option-1',
          'Write one line that is unchanged at home and one line that has genuinely improved.',
        ),
        draft(
          'parent-first.no-progress.stabilize.option-2',
          'Send: “Please show me where the reported progress appears outside sessions.”',
        ),
        draft(
          'parent-first.no-progress.stabilize.option-3',
          'Choose the single goal whose data you most need explained first.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.no-progress.path.bring-up.1',
          'Bring both pictures: what the report says and one concrete example from home. “The report says independent meals improved; at home we still leave the table every night” gives the team a precise gap to explain.',
        ),
        draft(
          'parent-first.no-progress.path.bring-up.2',
          'Include real improvement too. A fair home picture may contain gains, unchanged problems, and new concerns at the same time. You are not building a complaint; you are showing whether progress has reached the settings that matter.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.no-progress.path.help.1',
          'Ask the BCBA to walk through the graph, the definition of the skill, where it was measured, and what independence means in that data. A percentage without those details cannot tell you what the family should see at home.',
        ),
        draft(
          'parent-first.no-progress.path.help.2',
          'Ask how the team checks whether a skill carries across people and settings, and what decision point would lead to a revised goal or approach if the home picture remains unchanged.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.no-progress.path.changes.1',
          'The existing data can be explained in the next clinical meeting. Gathering home examples, observing another setting, or changing a goal may require additional sessions and review.',
        ),
        draft(
          'parent-first.no-progress.path.changes.2',
          'Ask for a date when the home gap will be reviewed again. The useful timeline is not “keep watching”; it is “we will compare these measures again after this amount of information.”',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.no-progress.path.next.1',
          'Open the Big Moments outcome if the most important home difference involves injuries, dangerous incidents, or severe disruption not reflected in session data.',
        ),
        draft(
          'parent-first.no-progress.path.next.2',
          'Open What Is ABA for a plain-language review of how goals, data, and change are supposed to connect.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.no-progress.link.aba.label', 'Open What Is ABA?'),
          detail: draft(
            'parent-first.no-progress.link.aba.detail',
            'Review the basic relationship between a goal, its measurement, and real-life change.',
          ),
          href: '/support/what-is-aba',
        },
        {
          label: draft('parent-first.no-progress.link.resources.label', 'Open the Resource Hub'),
          detail: draft(
            'parent-first.no-progress.link.resources.detail',
            'Find approved materials for understanding progress reports and caregiver participation.',
          ),
          href: '/support/resources',
        },
      ],
    },
    worksheet: {
      id: 'routine-log',
      label: draft('parent-first.no-progress.worksheet.label', 'Download the home-versus-report comparison sheet'),
    },
  },

  'sessions-concern': {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.sessions-concern.reflect.headline',
        'Something you saw, heard, or felt after sessions has made it harder to trust the care.',
      ),
      items: [
        {
          title: draft('parent-first.sessions-concern.reflect.item-1.title', 'You may not have the full picture'),
          detail: draft(
            'parent-first.sessions-concern.reflect.item-1.detail',
            'A brief handoff or general session note can leave important moments unexplained when your child comes out distressed or different.',
          ),
        },
        {
          title: draft('parent-first.sessions-concern.reflect.item-2.title', 'You may fear being labeled difficult'),
          detail: draft(
            'parent-first.sessions-concern.reflect.item-2.detail',
            'Parents often soften a concern because they depend on the service and do not want honest questions to affect the relationship.',
          ),
        },
        {
          title: draft('parent-first.sessions-concern.reflect.item-3.title', 'Uncertainty grows when there is no clear route'),
          detail: draft(
            'parent-first.sessions-concern.reflect.item-3.detail',
            'A concern becomes heavier when you do not know whether to ask the therapist, the BCBA, the clinical director, or someone else.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.sessions-concern.stabilize.option-1',
          'Write one factual sentence about the specific moment that concerned you.',
        ),
        draft(
          'parent-first.sessions-concern.stabilize.option-2',
          'Send: “I need an explanation of what happened during Tuesday’s session.”',
        ),
        draft(
          'parent-first.sessions-concern.stabilize.option-3',
          'Ask for the name and role of the person who reviews clinical concerns at the clinic.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.sessions-concern.path.bring-up.1',
          'Begin with what you directly observed or were told: the date, the exact moment, what your child looked like afterward, and what the note or handoff did not explain. You do not need to prove wrongdoing before asking for clarity.',
        ),
        draft(
          'parent-first.sessions-concern.path.bring-up.2',
          'Separate the event from the question it created. “She cried in the car for twenty minutes after session; what happened before dismissal?” invites a factual review without requiring you to guess what occurred.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.sessions-concern.path.help.1',
          'Ask whether you can observe a session and how observation is arranged. Ask who reviews the concern, what records or staff accounts will be considered, and when you should expect a response.',
        ),
        draft(
          'parent-first.sessions-concern.path.help.2',
          'Ask for the escalation route if the first explanation does not resolve the concern. You should leave knowing the role—not merely the name—of the person who oversees clinical care at that location.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.sessions-concern.path.changes.1',
          'A factual explanation or scheduled conversation may happen quickly. Observation, staff review, record review, or a formal response may take longer depending on the concern.',
        ),
        draft(
          'parent-first.sessions-concern.path.changes.2',
          'Ask when you will hear back and what happens while the concern is being reviewed. A timeline prevents the question from disappearing into ordinary session communication.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.sessions-concern.path.next.1',
          'Open the “thinking about stopping” outcome if this concern has changed whether you want services to continue.',
        ),
        draft(
          'parent-first.sessions-concern.path.next.2',
          'Open the Client Portal Preview if you need to understand what records, messages, or updates may be available through the current-family system.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.sessions-concern.link.client.label', 'Open the Client Portal Preview'),
          detail: draft(
            'parent-first.sessions-concern.link.client.detail',
            'Review the current-family access point for records and communication.',
          ),
          href: '/client',
        },
        {
          label: draft('parent-first.sessions-concern.link.resources.label', 'Open the Resource Hub'),
          detail: draft(
            'parent-first.sessions-concern.link.resources.detail',
            'Find approved information about caregiver participation and questions to raise.',
          ),
          href: '/support/resources',
        },
      ],
    },
    worksheet: {
      id: 'provider-interview',
      label: draft('parent-first.sessions-concern.worksheet.label', 'Download the session-concern record'),
    },
  },

  'unclear-care': {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.unclear-care.reflect.headline',
        'You are being asked to support goals that nobody has translated into your family’s language.',
      ),
      items: [
        {
          title: draft('parent-first.unclear-care.reflect.item-1.title', 'The reports may be full of words without meaning'),
          detail: draft(
            'parent-first.unclear-care.reflect.item-1.detail',
            'A goal name, percentage, or clinical phrase does not automatically explain what is being taught or why it matters at home.',
          ),
        },
        {
          title: draft('parent-first.unclear-care.reflect.item-2.title', 'You may be agreeing without understanding'),
          detail: draft(
            'parent-first.unclear-care.reflect.item-2.detail',
            'Fast meetings and unfamiliar language can leave parents nodding through decisions they cannot explain afterward.',
          ),
        },
        {
          title: draft('parent-first.unclear-care.reflect.item-3.title', 'Unclear goals make home support harder'),
          detail: draft(
            'parent-first.unclear-care.reflect.item-3.detail',
            'It is difficult to notice meaningful change or support consistency when you do not know what the team is trying to build.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.unclear-care.stabilize.option-1',
          'Circle the one goal title you cannot explain in plain words.',
        ),
        draft(
          'parent-first.unclear-care.stabilize.option-2',
          'Send: “Please explain this goal without clinical terms and tell me why it matters.”',
        ),
        draft(
          'parent-first.unclear-care.stabilize.option-3',
          'Ask for ten minutes of the next meeting to be used only for goal translation.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.unclear-care.path.bring-up.1',
          'Bring the exact goal name, sentence, or graph you do not understand. Ask four things: what skill is being taught, why it was chosen, what change you should notice outside sessions, and how the team decides whether to keep or change it.',
        ),
        draft(
          'parent-first.unclear-care.path.bring-up.2',
          'Ask the person explaining it to use one real-life example from your child’s day. A goal is clearer when you can picture what success would look like at breakfast, school, play, or a community outing.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.unclear-care.path.help.1',
          'Ask for a plain-language goal summary you can take home and share with the other adults involved in care. Ask how caregiver training connects to those goals rather than receiving unrelated tips.',
        ),
        draft(
          'parent-first.unclear-care.path.help.2',
          'Ask how often goals are formally reviewed with the family and how parent priorities are added, reordered, or removed. Understanding the decision process matters as much as understanding the current list.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.unclear-care.path.changes.1',
          'The current goals should be explainable in the next clinical conversation. Rewriting documentation, changing goals, or completing new assessment may take additional review.',
        ),
        draft(
          'parent-first.unclear-care.path.changes.2',
          'Do not try to understand the entire program at once. One goal fully translated is more useful than a rushed explanation of ten. Schedule the remaining questions rather than letting them disappear.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.unclear-care.path.next.1',
          'Open What Is ABA for a plain-language foundation on goals, observation, teaching, and measurement.',
        ),
        draft(
          'parent-first.unclear-care.path.next.2',
          'Open the “why my child does this” outcome when the missing explanation is specifically about what the team believes a behavior is communicating.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.unclear-care.link.aba.label', 'Open What Is ABA?'),
          detail: draft(
            'parent-first.unclear-care.link.aba.detail',
            'Build enough background to ask clear questions without becoming the clinician.',
          ),
          href: '/support/what-is-aba',
        },
        {
          label: draft('parent-first.unclear-care.link.resources.label', 'Open the Resource Hub'),
          detail: draft(
            'parent-first.unclear-care.link.resources.detail',
            'Find approved materials that can be reviewed alongside your current goals.',
          ),
          href: '/support/resources',
        },
      ],
    },
    worksheet: {
      id: 'provider-interview',
      label: draft('parent-first.unclear-care.worksheet.label', 'Download the plain-language goal review'),
    },
  },
} satisfies Record<
  'thinking-stopping' | 'no-progress' | 'sessions-concern' | 'unclear-care',
  ParentFirstPlanContent
>;
