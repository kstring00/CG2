import type { CopyEntry } from '@/content/carePlan';
import type { ParentFirstPlanContent } from '@/content/carePlanParentFirst';

const draft = (id: string, text: string): CopyEntry => ({ id, text, approval: 'draft' });

export const PARENT_FIRST_LOAD_ROWS = {
  alone: {
    category: 'parent-load',
    reflect: {
      headline: draft(
        'parent-first.alone.reflect.headline',
        'You are carrying a family-sized load without another adult to trade places with.',
      ),
      items: [
        {
          title: draft('parent-first.alone.reflect.item-1.title', 'There is no off shift'),
          detail: draft(
            'parent-first.alone.reflect.item-1.detail',
            'Appointments, routines, messages, paperwork, hard moments, and recovery all return to the same person: you.',
          ),
        },
        {
          title: draft('parent-first.alone.reflect.item-2.title', 'One disruption can collapse the day'),
          detail: draft(
            'parent-first.alone.reflect.item-2.detail',
            'When nobody can cover the next task, a late session or difficult evening can push dinner, work, sleep, and tomorrow out of place.',
          ),
        },
        {
          title: draft('parent-first.alone.reflect.item-3.title', 'The guilt is built on impossible arithmetic'),
          detail: draft(
            'parent-first.alone.reflect.item-3.detail',
            'A week designed around two available adults will keep producing unfinished tasks when only one adult is actually there.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.alone.stabilize.option-1',
          'Say this once today: “I am the only adult doing this. The home plan has to fit one person.”',
        ),
        draft(
          'parent-first.alone.stabilize.option-2',
          'Text one trusted person one specific ask: “Can you cover pickup Thursday?”',
        ),
        draft(
          'parent-first.alone.stabilize.option-3',
          'Name the hour that breaks most often: “Six to seven is the hour I cannot carry alone.”',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.alone.path.bring-up.1',
          'Lead with the household fact, not an apology: “I am the only adult carrying the home program.” Then name the hour where the plan stops fitting real life. One sentence such as “bedtime and documentation land on me at the same time” gives the conversation a place to begin.',
        ),
        draft(
          'parent-first.alone.path.bring-up.2',
          'Say what is repeatedly left undone because there is no second adult—not because you forgot or refused, but because two tasks require one body at the same time. That distinction turns “follow-through is inconsistent” into a capacity problem the team can discuss with you.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.alone.path.help.1',
          'Ask which home expectations can be reduced, moved into session time, or reordered around one caregiver. The useful outcome is a shorter list that names what matters first, not another reminder to do what you can.',
        ),
        draft(
          'parent-first.alone.path.help.2',
          'Ask whether caregiver training can include a grandparent, adult sibling, sitter, or another person who is actually available. Also ask what respite or parent-support referrals may exist and exactly whom to contact between sessions when your capacity is gone.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.alone.path.changes.1',
          'The team can acknowledge the one-adult constraint and choose what to discuss first in the next meeting. Rescheduling training, changing written expectations, locating referrals, or revising clinical goals may require more time and coordination.',
        ),
        draft(
          'parent-first.alone.path.changes.2',
          'Ask for one immediate reduction and one follow-up date: “What comes off this week, and when will we review the rest?” That gives you relief now without pretending the entire load can be rebuilt in one conversation.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.alone.path.next.1',
          'Open the Mental Health Toolbox when the lack of backup has left you constantly alert, exhausted, or unable to recover after the day ends.',
        ),
        draft(
          'parent-first.alone.path.next.2',
          'Open Parent Connection when you need another parent who understands the logistics and loneliness of carrying care without a second adult.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.alone.link.mental-health.label', 'Open the Mental Health Toolbox'),
          detail: draft(
            'parent-first.alone.link.mental-health.detail',
            'Find parent-centered support for the strain of having no reliable off shift.',
          ),
          href: '/support/caregiver',
        },
        {
          label: draft('parent-first.alone.link.connection.label', 'Open Parent Connection'),
          detail: draft(
            'parent-first.alone.link.connection.detail',
            'Find community with parents who understand a household carried by one adult.',
          ),
          href: '/support/connect',
        },
      ],
    },
    worksheet: {
      id: 'load-map',
      label: draft('parent-first.alone.worksheet.label', 'Download the one-adult load map'),
    },
  },

  'marriage-strain': {
    category: 'parent-load',
    reflect: {
      headline: draft(
        'parent-first.marriage-strain.reflect.headline',
        'Caregiving pressure has started entering the space where your relationship used to be.',
      ),
      items: [
        {
          title: draft('parent-first.marriage-strain.reflect.item-1.title', 'Every conversation becomes logistics'),
          detail: draft(
            'parent-first.marriage-strain.reflect.item-1.detail',
            'The two of you may only talk about appointments, routines, money, behavior, and who failed to handle the next thing.',
          ),
        },
        {
          title: draft('parent-first.marriage-strain.reflect.item-2.title', 'There is no recovery between conflicts'),
          detail: draft(
            'parent-first.marriage-strain.reflect.item-2.detail',
            'A hard night ends, the next responsibility begins, and neither person gets enough distance to repair what was said.',
          ),
        },
        {
          title: draft('parent-first.marriage-strain.reflect.item-3.title', 'Love is not the same as shared capacity'),
          detail: draft(
            'parent-first.marriage-strain.reflect.item-3.detail',
            'Two people can care deeply about the same child and still be overwhelmed, unevenly informed, and unsure how to carry the week together.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.marriage-strain.stabilize.option-1',
          'Say: “We need help with the load, not a verdict on our marriage.”',
        ),
        draft(
          'parent-first.marriage-strain.stabilize.option-2',
          'Text your partner: “Can we bring one pressure point to the next session together?”',
        ),
        draft(
          'parent-first.marriage-strain.stabilize.option-3',
          'Name one recurring point of friction out loud: transport, bedtime, paperwork, or overnight care.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.marriage-strain.path.bring-up.1',
          'Bring one pressure point instead of the entire relationship. “Therapy transport is causing the same fight every Tuesday” is specific enough to discuss without asking the care team to become a marriage counselor.',
        ),
        draft(
          'parent-first.marriage-strain.path.bring-up.2',
          'Explain whether the strain comes from unequal information, incompatible schedules, one person receiving all training, or too many home expectations. Those are care-related conditions that can sometimes be changed even when the deeper relationship work belongs elsewhere.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.marriage-strain.path.help.1',
          'Ask whether both caregivers can attend the same training conversation so the family leaves with one explanation, one set of priorities, and clear roles. Ask what scheduling options would make joint participation realistic.',
        ),
        draft(
          'parent-first.marriage-strain.path.help.2',
          'Ask whether the clinic maintains referrals to counselors who understand disability-related caregiving strain. A referral is separate from ABA care, but it can give the relationship a place where the child’s program is not the only subject in the room.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.marriage-strain.path.changes.1',
          'A shared clinical conversation can clarify roles quickly. Changing schedules or arranging joint caregiver training may take longer, and relationship counseling follows its own timeline outside the ABA program.',
        ),
        draft(
          'parent-first.marriage-strain.path.changes.2',
          'Look for one concrete shift first: both adults receive the same update, one responsibility moves, or one recurring conflict gets a written plan for who handles what. Small clarity can lower pressure before the relationship feels fully repaired.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.marriage-strain.path.next.1',
          'Open Marriage & Relationships for parent-centered support that treats the relationship as worthy of care, not as a side note to services.',
        ),
        draft(
          'parent-first.marriage-strain.path.next.2',
          'If home does not feel safe for you, call the National Domestic Violence Hotline at 800-799-7233. Safety is different from ordinary relationship strain and deserves immediate human support.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.marriage-strain.link.couples.label', 'Open Marriage & Relationships'),
          detail: draft(
            'parent-first.marriage-strain.link.couples.detail',
            'Find support for protecting the relationship while caregiving pressure is high.',
          ),
          href: '/support/couples',
        },
        {
          label: draft('parent-first.marriage-strain.link.mental-health.label', 'Open the Mental Health Toolbox'),
          detail: draft(
            'parent-first.marriage-strain.link.mental-health.detail',
            'Use parent-focused tools when conflict has left you depleted or unable to settle.',
          ),
          href: '/support/caregiver',
        },
      ],
    },
    worksheet: {
      id: 'one-sentence-card',
      label: draft('parent-first.marriage-strain.worksheet.label', 'Download the shared-pressure conversation card'),
    },
  },

  'partner-load': {
    category: 'parent-load',
    reflect: {
      headline: draft(
        'parent-first.partner-load.reflect.headline',
        'The work may belong to the family, but too much of it is landing on you.',
      ),
      items: [
        {
          title: draft('parent-first.partner-load.reflect.item-1.title', 'The visible tasks are only half of it'),
          detail: draft(
            'parent-first.partner-load.reflect.item-1.detail',
            'You may carry the appointments, messages, preparation, remembering, anticipating, and recovery that nobody sees on a calendar.',
          ),
        },
        {
          title: draft('parent-first.partner-load.reflect.item-2.title', 'One person may hold all the clinical knowledge'),
          detail: draft(
            'parent-first.partner-load.reflect.item-2.detail',
            'When only one caregiver attends sessions or training, that person becomes the translator, coach, and default decision-maker at home.',
          ),
        },
        {
          title: draft('parent-first.partner-load.reflect.item-3.title', 'Resentment grows where roles stay vague'),
          detail: draft(
            'parent-first.partner-load.reflect.item-3.detail',
            '“Help more” is hard to act on. The same conflict returns when nobody has named which responsibility actually belongs to whom.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.partner-load.stabilize.option-1',
          'Say: “I need one responsibility to become fully yours, not something I still manage.”',
        ),
        draft(
          'parent-first.partner-load.stabilize.option-2',
          'Send the team: “Please include both caregivers in the next training update.”',
        ),
        draft(
          'parent-first.partner-load.stabilize.option-3',
          'Name one task to hand off today: pickup, bedtime, supplies, or the next clinic message.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.partner-load.path.bring-up.1',
          'Describe the information gap as clearly as the task gap. If one person receives every instruction and then has to teach it at home, the family is not receiving caregiver training as a shared unit.',
        ),
        draft(
          'parent-first.partner-load.path.bring-up.2',
          'Bring one responsibility that still requires you to remind, prepare, or rescue it. “My partner does bedtime only after I set everything up and prompt each step” shows why the task is not actually off your plate.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.partner-load.path.help.1',
          'Ask whether training can rotate across schedules, include your partner remotely, or reserve one session for both caregivers. Ask the team to send the same plain-language summary to both adults when possible.',
        ),
        draft(
          'parent-first.partner-load.path.help.2',
          'Ask whether home responsibilities can be written by role instead of left as general family expectations. The goal is not for the BCBA to referee the relationship; it is to make the care-related work visible enough to divide.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.partner-load.path.changes.1',
          'A partner can be invited into the next conversation immediately. Rotating session times, arranging remote participation, or changing a training schedule may depend on staffing and availability.',
        ),
        draft(
          'parent-first.partner-load.path.changes.2',
          'The earliest useful sign is not perfect equality. It is one task that no longer requires your reminders and one piece of clinical information that reaches both caregivers directly.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.partner-load.path.next.1',
          'Open Marriage & Relationships when the invisible load has become resentment, repeated conflict, or distance between partners.',
        ),
        draft(
          'parent-first.partner-load.path.next.2',
          'Open the “carrying this alone” outcome if the practical reality is that no reliable second adult is available, even if another adult lives in the home.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.partner-load.link.couples.label', 'Open Marriage & Relationships'),
          detail: draft(
            'parent-first.partner-load.link.couples.detail',
            'Find support for discussing invisible work without turning the page into a scorecard.',
          ),
          href: '/support/couples',
        },
        {
          label: draft('parent-first.partner-load.link.connection.label', 'Open Parent Connection'),
          detail: draft(
            'parent-first.partner-load.link.connection.detail',
            'Hear how other families make training and household roles more visible.',
          ),
          href: '/support/connect',
        },
      ],
    },
    worksheet: {
      id: 'load-map',
      label: draft('parent-first.partner-load.worksheet.label', 'Download the shared-load map'),
    },
  },

  judged: {
    category: 'parent-load',
    reflect: {
      headline: draft(
        'parent-first.judged.reflect.headline',
        'The people who could make life lighter are making you defend your parenting instead.',
      ),
      items: [
        {
          title: draft('parent-first.judged.reflect.item-1.title', 'You brace before family contact'),
          detail: draft(
            'parent-first.judged.reflect.item-1.detail',
            'A visit, phone call, or public moment can come with advice, comparisons, staring, or questions you do not have energy to answer.',
          ),
        },
        {
          title: draft('parent-first.judged.reflect.item-2.title', 'Judgment makes the family smaller'),
          detail: draft(
            'parent-first.judged.reflect.item-2.detail',
            'You may stop attending events or asking for help because managing other adults becomes harder than staying home.',
          ),
        },
        {
          title: draft('parent-first.judged.reflect.item-3.title', 'You need allies, not another audience'),
          detail: draft(
            'parent-first.judged.reflect.item-3.detail',
            'The useful people are the ones willing to learn one accurate thing and offer one practical form of support.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.judged.stabilize.option-1',
          'Use one boundary sentence: “I am not asking for parenting advice. I am asking whether you can help.”',
        ),
        draft(
          'parent-first.judged.stabilize.option-2',
          'Invite one relative: “Would you join one caregiver-training session with me?”',
        ),
        draft(
          'parent-first.judged.stabilize.option-3',
          'Choose the one person who feels safest and send: “I need support without commentary today.”',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.judged.path.bring-up.1',
          'Tell the team what judgment is costing the family: you stopped visiting relatives, lost a possible babysitter, or no longer attend events because other adults do not understand what they are seeing.',
        ),
        draft(
          'parent-first.judged.path.bring-up.2',
          'Ask what can be explained accurately without sharing private clinical details. The goal is a small, usable message about what relatives may see, what they should not assume, and one way they can be helpful.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.judged.path.help.1',
          'Ask whether a relative, sitter, or grandparent may attend caregiver training or part of a session when appropriate. One shared explanation can prevent you from becoming the only person teaching everyone else.',
        ),
        draft(
          'parent-first.judged.path.help.2',
          'Ask the care team to review the relatives one-pager before you distribute it. That lets you keep the message general, accurate, and free of information your child would not want shared.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.judged.path.changes.1',
          'A boundary sentence or invitation can happen today. Adding another adult to training depends on consent, scheduling, and the clinic’s process.',
        ),
        draft(
          'parent-first.judged.path.changes.2',
          'The first change may be modest: fewer comments, one person asking before advising, or one relative learning a useful support role. You do not have to win over the entire family for the situation to become lighter.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.judged.path.next.1',
          'Open Parent Connection when judgment has made you feel isolated from people who understand family life like yours.',
        ),
        draft(
          'parent-first.judged.path.next.2',
          'Open Sibling Support when brothers or sisters are also carrying questions, embarrassment, fear, or resentment that adults have not addressed.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.judged.link.connection.label', 'Open Parent Connection'),
          detail: draft(
            'parent-first.judged.link.connection.detail',
            'Find parent community where you do not have to explain the whole context first.',
          ),
          href: '/support/connect',
        },
        {
          label: draft('parent-first.judged.link.siblings.label', 'Open Sibling Support'),
          detail: draft(
            'parent-first.judged.link.siblings.detail',
            'Find support for siblings affected by comments, exclusion, or difficult family gatherings.',
          ),
          href: '/support/siblings',
        },
      ],
    },
    worksheet: {
      id: 'relatives-onepager',
      label: draft('parent-first.judged.worksheet.label', 'Download the relatives one-pager'),
    },
  },
} satisfies Record<'alone' | 'marriage-strain' | 'partner-load' | 'judged', ParentFirstPlanContent>;
