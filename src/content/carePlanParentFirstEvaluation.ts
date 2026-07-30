import type { CopyEntry } from '@/content/carePlan';
import type { ParentFirstPlanContent } from '@/content/carePlanParentFirst';

const draft = (id: string, text: string): CopyEntry => ({ id, text, approval: 'draft' });

export const PARENT_FIRST_EVALUATION_ROWS = {
  deciding: {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.deciding.reflect.headline',
        'You are being asked to make a major care decision before you can know exactly what it will change.',
      ),
      items: [
        {
          title: draft('parent-first.deciding.reflect.item-1.title', 'The information arrives all at once'),
          detail: draft(
            'parent-first.deciding.reflect.item-1.detail',
            'Waitlists, evaluations, insurance, schedules, unfamiliar terms, and strong opinions can make the decision feel urgent before it feels clear.',
          ),
        },
        {
          title: draft('parent-first.deciding.reflect.item-2.title', 'You are deciding for the whole family'),
          detail: draft(
            'parent-first.deciding.reflect.item-2.detail',
            'The right fit has to account for your child’s needs, family priorities, transportation, work, siblings, and the hours your household can actually sustain.',
          ),
        },
        {
          title: draft('parent-first.deciding.reflect.item-3.title', 'A promise cannot answer the real question'),
          detail: draft(
            'parent-first.deciding.reflect.item-3.detail',
            'What matters is how a provider would assess your child, choose goals with you, measure change, and respond if the approach is not helping.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.deciding.stabilize.option-1',
          'Write the one family change that would make care feel worth the time it requires.',
        ),
        draft(
          'parent-first.deciding.stabilize.option-2',
          'Send a provider: “How would you decide what to work on first with my child?”',
        ),
        draft(
          'parent-first.deciding.stabilize.option-3',
          'Choose one nonnegotiable: parent involvement, schedule fit, communication, safety, or observation access.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.deciding.path.bring-up.1',
          'Bring the outcome in family language: getting through a medical visit, communicating a need, sleeping enough for school, or reducing injuries. The provider should explain how assessment would determine whether that concern belongs in ABA and what other professionals may need to be involved.',
        ),
        draft(
          'parent-first.deciding.path.bring-up.2',
          'Bring the family constraints at the same time. A program that cannot fit work, transportation, siblings, or the adults available at home is not automatically the right program because the clinical description sounds strong.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.deciding.path.help.1',
          'Ask for the assessment process from first contact through the first set of goals. Ask when parent priorities enter the process, who makes the final recommendations, and how disagreements are handled.',
        ),
        draft(
          'parent-first.deciding.path.help.2',
          'Ask how the provider would show you whether care is helping and what happens if the data or home experience says it is not. You are evaluating the decision process, not asking for a guaranteed outcome.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.deciding.path.changes.1',
          'A provider can explain its process and schedule before you enroll. Answers specific to your child usually depend on evaluation, observation, and the information you bring.',
        ),
        draft(
          'parent-first.deciding.path.changes.2',
          'You may not leave with certainty, but you should leave knowing the next decision point: evaluation, results review, proposed schedule, goal discussion, or a reason this provider is not the fit.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.deciding.path.next.1',
          'Open What Is ABA when the service itself still feels too vague to evaluate.',
        ),
        draft(
          'parent-first.deciding.path.next.2',
          'Open Paying for Care when insurance, cost, authorization, or coverage is shaping the decision as much as the clinical questions.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.deciding.link.aba.label', 'Open What Is ABA?'),
          detail: draft(
            'parent-first.deciding.link.aba.detail',
            'Understand the basic service before comparing promises between providers.',
          ),
          href: '/support/what-is-aba',
        },
        {
          label: draft('parent-first.deciding.link.financial.label', 'Open Paying for Care'),
          detail: draft(
            'parent-first.deciding.link.financial.detail',
            'Review the practical questions that can determine whether a program is sustainable.',
          ),
          href: '/support/financial',
        },
      ],
    },
    worksheet: {
      id: 'provider-interview',
      label: draft('parent-first.deciding.worksheet.label', 'Download the ABA decision worksheet'),
    },
  },

  'first-months': {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.first-months.reflect.headline',
        'You want to know what your family is agreeing to before the calendar fills up.',
      ),
      items: [
        {
          title: draft('parent-first.first-months.reflect.item-1.title', 'The first weeks can feel like waiting'),
          detail: draft(
            'parent-first.first-months.reflect.item-1.detail',
            'Assessment, observation, relationship-building, staffing, and baseline data may happen before visible goals begin to change.',
          ),
        },
        {
          title: draft('parent-first.first-months.reflect.item-2.title', 'The schedule will reshape family life'),
          detail: draft(
            'parent-first.first-months.reflect.item-2.detail',
            'Session hours affect transportation, work, siblings, meals, bedtime, and who is available for caregiver participation.',
          ),
        },
        {
          title: draft('parent-first.first-months.reflect.item-3.title', 'You need milestones, not a vague timeline'),
          detail: draft(
            'parent-first.first-months.reflect.item-3.detail',
            'A useful start-up plan names when assessment ends, when goals are reviewed with you, and when the first progress conversation occurs.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.first-months.stabilize.option-1',
          'Ask for a sample first-month calendar before you agree to the schedule.',
        ),
        draft(
          'parent-first.first-months.stabilize.option-2',
          'Write the exact hours your family can reliably sustain each week.',
        ),
        draft(
          'parent-first.first-months.stabilize.option-3',
          'Ask: “On what date would we first sit down together and review data?”',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.first-months.path.bring-up.1',
          'Bring your real weekly availability, including the hours that look open but are not sustainable because of work, school transportation, sibling needs, meals, or bedtime. A schedule is only useful if the family can keep it after the first enthusiastic week.',
        ),
        draft(
          'parent-first.first-months.path.bring-up.2',
          'Ask what you should expect to receive and when: assessment results, proposed goals, a caregiver-training schedule, a contact person, and the first progress review. Those milestones make the beginning visible even before major change appears.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.first-months.path.help.1',
          'Ask who will work directly with your child, who supervises that person, how often the BCBA is involved, and how changes in staffing are communicated. Titles alone do not show how the team functions week to week.',
        ),
        draft(
          'parent-first.first-months.path.help.2',
          'Ask how parents are oriented and trained during the first months. Find out whether caregiver meetings are scheduled, what happens if you cannot attend a standard time, and how questions are handled between meetings.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.first-months.path.changes.1',
          'The first weeks may focus on learning, measurement, and relationship-building. The provider should still be able to name what is happening now and the date when initial findings become decisions.',
        ),
        draft(
          'parent-first.first-months.path.changes.2',
          'Ask what early change would be meaningful by the first review and what would be premature to expect. A realistic answer separates progress in participation, learning, or caregiver understanding from promises of rapid life-wide change.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.first-months.path.next.1',
          'Open Paying for Care for authorization, coverage, and cost questions that may affect the start date or weekly schedule.',
        ),
        draft(
          'parent-first.first-months.path.next.2',
          'Open the provider-evaluation outcome when you need to compare supervision, observation access, communication, and family involvement across organizations.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.first-months.link.financial.label', 'Open Paying for Care'),
          detail: draft(
            'parent-first.first-months.link.financial.detail',
            'Understand the coverage and authorization steps that can shape the first months.',
          ),
          href: '/support/financial',
        },
        {
          label: draft('parent-first.first-months.link.resources.label', 'Open the Resource Hub'),
          detail: draft(
            'parent-first.first-months.link.resources.detail',
            'Find preparation materials for evaluation, goal review, and caregiver participation.',
          ),
          href: '/support/resources',
        },
      ],
    },
    worksheet: {
      id: 'provider-interview',
      label: draft('parent-first.first-months.worksheet.label', 'Download the first-month expectations sheet'),
    },
  },

  'judging-provider': {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.judging-provider.reflect.headline',
        'You are trying to tell the difference between a polished introduction and care your family can actually trust.',
      ),
      items: [
        {
          title: draft('parent-first.judging-provider.reflect.item-1.title', 'Waitlists can make choice feel like a luxury'),
          detail: draft(
            'parent-first.judging-provider.reflect.item-1.detail',
            'When access is difficult, families may feel pressure to accept the first opening before asking how the provider works.',
          ),
        },
        {
          title: draft('parent-first.judging-provider.reflect.item-2.title', 'Most websites sound equally reassuring'),
          detail: draft(
            'parent-first.judging-provider.reflect.item-2.detail',
            'Words like individualized, compassionate, evidence-based, and family-centered matter only when the provider can show what they mean in practice.',
          ),
        },
        {
          title: draft('parent-first.judging-provider.reflect.item-3.title', 'The everyday systems reveal the fit'),
          detail: draft(
            'parent-first.judging-provider.reflect.item-3.detail',
            'Supervision, staff turnover, parent access, communication, observation, and response to concerns shape the family experience after enrollment.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.judging-provider.stabilize.option-1',
          'Ask one provider today: “Can parents observe sessions, and how does that work?”',
        ),
        draft(
          'parent-first.judging-provider.stabilize.option-2',
          'Write down who supervises direct staff and how often the BCBA is involved.',
        ),
        draft(
          'parent-first.judging-provider.stabilize.option-3',
          'Compare one answer across two providers instead of comparing every detail at once.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.judging-provider.path.bring-up.1',
          'Bring the same core questions to every provider so the comparison is fair. Ask about observation, BCBA involvement, caregiver training, communication between sessions, staff changes, and how a concern is escalated.',
        ),
        draft(
          'parent-first.judging-provider.path.bring-up.2',
          'Ask for examples of how the stated values appear in ordinary operations. “Family-centered” should translate into specific meeting access, goal participation, communication practices, and ways parents can raise disagreement.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.judging-provider.path.help.1',
          'Ask to see a sample schedule, a de-identified progress format, and the written process for parent concerns when available. Concrete materials show more than a verbal promise about transparency.',
        ),
        draft(
          'parent-first.judging-provider.path.help.2',
          'Ask who will answer clinical questions, who handles scheduling problems, and who is above the assigned BCBA. A family should not have to discover the communication structure during a crisis.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.judging-provider.path.changes.1',
          'Many operational questions can be answered before evaluation. Staffing details for your child and clinical recommendations may not be available until later.',
        ),
        draft(
          'parent-first.judging-provider.path.changes.2',
          'Do not wait for a perfect feeling. Look for consistency between what the provider says, what its written process shows, and how it responds when you ask a direct question.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.judging-provider.path.next.1',
          'Open What Is ABA so you can separate questions about the service itself from questions about how one organization delivers it.',
        ),
        draft(
          'parent-first.judging-provider.path.next.2',
          'Open Paying for Care to compare whether a provider can explain authorization, expected costs, and coverage responsibilities clearly.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.judging-provider.link.aba.label', 'Open What Is ABA?'),
          detail: draft(
            'parent-first.judging-provider.link.aba.detail',
            'Learn the service basics before judging how well a provider explains and delivers them.',
          ),
          href: '/support/what-is-aba',
        },
        {
          label: draft('parent-first.judging-provider.link.financial.label', 'Open Paying for Care'),
          detail: draft(
            'parent-first.judging-provider.link.financial.detail',
            'Add financial clarity and authorization support to the provider comparison.',
          ),
          href: '/support/financial',
        },
      ],
    },
    worksheet: {
      id: 'provider-interview',
      label: draft('parent-first.judging-provider.worksheet.label', 'Download the provider comparison worksheet'),
    },
  },

  'what-is-aba': {
    category: 'child-treatment',
    reflect: {
      headline: draft(
        'parent-first.what-is-aba.reflect.headline',
        'You are being asked to consider a service that may still sound like a collection of unfamiliar terms.',
      ),
      items: [
        {
          title: draft('parent-first.what-is-aba.reflect.item-1.title', 'The language can hide the basic idea'),
          detail: draft(
            'parent-first.what-is-aba.reflect.item-1.detail',
            'Assessment, goals, prompting, reinforcement, data, and generalization are difficult to evaluate when nobody connects them to ordinary family life.',
          ),
        },
        {
          title: draft('parent-first.what-is-aba.reflect.item-2.title', 'You may not know what parents are expected to do'),
          detail: draft(
            'parent-first.what-is-aba.reflect.item-2.detail',
            'Families need to understand whether they will attend training, practice agreed skills, share observations, or adjust schedules before they commit.',
          ),
        },
        {
          title: draft('parent-first.what-is-aba.reflect.item-3.title', 'One real example can reveal whether the explanation is clear'),
          detail: draft(
            'parent-first.what-is-aba.reflect.item-3.detail',
            'A provider should be able to describe how it would study a concern, choose a goal, teach a skill, and measure change without guessing about your child.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.what-is-aba.stabilize.option-1',
          'Ask: “Explain ABA using one ordinary moment from family life.”',
        ),
        draft(
          'parent-first.what-is-aba.stabilize.option-2',
          'Send: “What would the family be asked to do each week?”',
        ),
        draft(
          'parent-first.what-is-aba.stabilize.option-3',
          'Choose one term you need translated before discussing anything else.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.what-is-aba.path.bring-up.1',
          'Bring one concern from real life and ask the provider to explain the process without prescribing an answer before assessment. The explanation should cover what information would be gathered, how a goal might be chosen, and how progress would be measured.',
        ),
        draft(
          'parent-first.what-is-aba.path.bring-up.2',
          'Ask what ABA is not designed to replace. Communication, medical, feeding, mental-health, school, or occupational concerns may require coordination with other qualified professionals rather than one service being asked to do everything.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.what-is-aba.path.help.1',
          'Ask for a plain-language overview of assessment, goal selection, direct sessions, BCBA supervision, caregiver training, and progress review. Understanding those parts lets you see where your voice enters the work.',
        ),
        draft(
          'parent-first.what-is-aba.path.help.2',
          'Ask how the provider protects child dignity, includes family priorities, and decides when a goal should change. Those questions turn a definition of ABA into a picture of how care would actually be delivered.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.what-is-aba.path.changes.1',
          'The service model and family role should be explainable before enrollment. Recommendations about your child require assessment and should become more specific as the provider learns directly from your child and family.',
        ),
        draft(
          'parent-first.what-is-aba.path.changes.2',
          'Do not judge clarity by how many terms you learned. Judge it by whether you can explain what happens next, what the provider measures, and how you participate without becoming the clinician.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.what-is-aba.path.next.1',
          'Open the provider-evaluation outcome when you understand the basic service and need to compare how organizations deliver it.',
        ),
        draft(
          'parent-first.what-is-aba.path.next.2',
          'Open the Resource Hub for approved education you can revisit without needing to remember every term from one conversation.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.what-is-aba.link.learn.label', 'Open the full What Is ABA? guide'),
          detail: draft(
            'parent-first.what-is-aba.link.learn.detail',
            'Review assessment, goals, teaching, measurement, and caregiver participation in plain language.',
          ),
          href: '/support/what-is-aba',
        },
        {
          label: draft('parent-first.what-is-aba.link.resources.label', 'Open the Resource Hub'),
          detail: draft(
            'parent-first.what-is-aba.link.resources.detail',
            'Save approved education for the questions that arise after the first conversation.',
          ),
          href: '/support/resources',
        },
      ],
    },
    worksheet: {
      id: 'provider-interview',
      label: draft('parent-first.what-is-aba.worksheet.label', 'Download the plain-language ABA worksheet'),
    },
  },
} satisfies Record<'deciding' | 'first-months' | 'judging-provider' | 'what-is-aba', ParentFirstPlanContent>;
