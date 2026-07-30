import type { CopyEntry } from '@/content/carePlan';
import type { ParentFirstPlanContent } from '@/content/carePlanParentFirst';

const draft = (id: string, text: string): CopyEntry => ({ id, text, approval: 'draft' });

export const PARENT_FIRST_EMPTY_ROWS = {
  'cannot-keep-doing': {
    category: 'parent-load',
    reflect: {
      headline: draft(
        'parent-first.cannot-keep-doing.reflect.headline',
        'You have reached a point where getting through the next stretch feels uncertain.',
      ),
      items: [
        {
          title: draft('parent-first.cannot-keep-doing.reflect.item-1.title', 'You may have been hiding how serious it feels'),
          detail: draft(
            'parent-first.cannot-keep-doing.reflect.item-1.detail',
            'Other people may see you completing tasks while missing how close you feel to having nothing left.',
          ),
        },
        {
          title: draft('parent-first.cannot-keep-doing.reflect.item-2.title', 'The next need keeps arriving'),
          detail: draft(
            'parent-first.cannot-keep-doing.reflect.item-2.detail',
            'Even after a hard moment ends, meals, work, messages, appointments, and tomorrow still expect something from you.',
          ),
        },
        {
          title: draft('parent-first.cannot-keep-doing.reflect.item-3.title', 'Immediate human support is available'),
          detail: draft(
            'parent-first.cannot-keep-doing.reflect.item-3.detail',
            'Call or text 988 now if you may harm yourself, cannot stay safe, or need immediate crisis support—any hour.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.cannot-keep-doing.stabilize.option-1',
          'Call or text 988 now if staying safe feels uncertain.',
        ),
        draft(
          'parent-first.cannot-keep-doing.stabilize.option-2',
          'Send one person: “I am at my limit. I need you to check on me today.”',
        ),
        draft(
          'parent-first.cannot-keep-doing.stabilize.option-3',
          'Tell your clinic: “I am not okay, and I need help reducing the load this week.”',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.cannot-keep-doing.path.bring-up.1',
          'Use direct language. “I am at my limit” communicates more than “I am stressed.” You do not need a polished explanation, a timeline, or proof that the week has been hard enough.',
        ),
        draft(
          'parent-first.cannot-keep-doing.path.bring-up.2',
          'Say whether you need immediate crisis support, a mental-health referral, or a concrete reduction in what the home program expects this week. Those are different needs, and naming the one in front of you helps another person respond now.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.cannot-keep-doing.path.help.1',
          'Ask for a therapist referral that specifically includes caregiver strain, and ask for the actual contact information rather than a general suggestion to seek counseling.',
        ),
        draft(
          'parent-first.cannot-keep-doing.path.help.2',
          'Ask what can be removed, paused, or reassigned this week. The request is not for encouragement; it is for one concrete change that lowers what must come from you before the next session.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.cannot-keep-doing.path.changes.1',
          'Crisis support through 988 is available now. A trusted person can check on you today. A clinic may be able to clarify immediate expectations quickly, while referrals and longer-term service changes may take more time.',
        ),
        draft(
          'parent-first.cannot-keep-doing.path.changes.2',
          'For today, success is not solving the whole situation. It is making sure one real person knows how serious this is and that you are not carrying the next hours unseen.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.cannot-keep-doing.path.next.1',
          'Open the Mental Health Toolbox for immediate parent-centered support after you have connected with a real person.',
        ),
        draft(
          'parent-first.cannot-keep-doing.path.next.2',
          'Open Find Local Help when you are ready to look for ongoing counseling or community support outside the ABA program.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.cannot-keep-doing.link.mental-health.label', 'Open the Mental Health Toolbox'),
          detail: draft(
            'parent-first.cannot-keep-doing.link.mental-health.detail',
            'Use parent-focused support after immediate safety and human contact are in place.',
          ),
          href: '/support/caregiver',
        },
        {
          label: draft('parent-first.cannot-keep-doing.link.find.label', 'Open Find Local Help'),
          detail: draft(
            'parent-first.cannot-keep-doing.link.find.detail',
            'Look for ongoing counseling and local support when you have capacity for the next step.',
          ),
          href: '/support/find',
        },
      ],
    },
    worksheet: {
      id: 'one-sentence-card',
      label: draft('parent-first.cannot-keep-doing.worksheet.label', 'Download the “I need help now” card'),
    },
  },

  'nothing-left': {
    category: 'parent-load',
    reflect: {
      headline: draft(
        'parent-first.nothing-left.reflect.headline',
        'Every part of the week is asking from the same empty place.',
      ),
      items: [
        {
          title: draft('parent-first.nothing-left.reflect.item-1.title', 'Rest is being used to catch up'),
          detail: draft(
            'parent-first.nothing-left.reflect.item-1.detail',
            'Any quiet moment may immediately fill with paperwork, cleaning, messages, planning, or worry about what comes next.',
          ),
        },
        {
          title: draft('parent-first.nothing-left.reflect.item-2.title', 'Small requests feel physically expensive'),
          detail: draft(
            'parent-first.nothing-left.reflect.item-2.detail',
            'A routine task can feel impossible when it arrives after days or months without enough recovery.',
          ),
        },
        {
          title: draft('parent-first.nothing-left.reflect.item-3.title', 'You may be measuring yourself against old capacity'),
          detail: draft(
            'parent-first.nothing-left.reflect.item-3.detail',
            'The version of you with more sleep, fewer appointments, or more help is not the fair standard for this week.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.nothing-left.stabilize.option-1',
          'Say: “I am at capacity. Something has to come off this week.”',
        ),
        draft(
          'parent-first.nothing-left.stabilize.option-2',
          'Ask one person: “Can you give me twenty minutes with no responsibility today?”',
        ),
        draft(
          'parent-first.nothing-left.stabilize.option-3',
          'Cancel one optional task that would only make the week look more complete.',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.nothing-left.path.bring-up.1',
          'Tell the team what “empty” changes in practice: you cannot complete every home recommendation, recover after sessions, or keep adding appointments without something else failing. Capacity is part of the family context, not a private weakness to hide.',
        ),
        draft(
          'parent-first.nothing-left.path.bring-up.2',
          'Name the expectation that consumes the most energy for the least benefit at home. You are not deciding what the clinical program should remove; you are showing where the present load is no longer sustainable.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.nothing-left.path.help.1',
          'Ask which home expectations can be paused, simplified, or moved into session time while your capacity is low. Ask the team to identify the true priority instead of treating every recommendation as equally urgent.',
        ),
        draft(
          'parent-first.nothing-left.path.help.2',
          'Ask what respite, parent-support, or counseling referrals may be available and what the first contact step actually is. A name, number, or application path is more useful than “consider getting support.”',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.nothing-left.path.changes.1',
          'One home expectation may be clarified or reduced in the next conversation. Formal changes to services, schedules, or outside supports may require coordination and waiting.',
        ),
        draft(
          'parent-first.nothing-left.path.changes.2',
          'Look for a week that asks less before expecting you to feel better. Energy often returns after pressure changes; it does not have to appear first as proof that you deserve relief.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.nothing-left.path.next.1',
          'Open the Mental Health Toolbox for support that begins with the parent’s capacity rather than another task for the family.',
        ),
        draft(
          'parent-first.nothing-left.path.next.2',
          'Open Parent Connection when isolation is making exhaustion heavier and you need contact with people who already understand the context.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.nothing-left.link.mental-health.label', 'Open the Mental Health Toolbox'),
          detail: draft(
            'parent-first.nothing-left.link.mental-health.detail',
            'Find support for a parent whose capacity is already spent.',
          ),
          href: '/support/caregiver',
        },
        {
          label: draft('parent-first.nothing-left.link.connection.label', 'Open Parent Connection'),
          detail: draft(
            'parent-first.nothing-left.link.connection.detail',
            'Find people who understand why exhaustion does not disappear with encouragement.',
          ),
          href: '/support/connect',
        },
      ],
    },
    worksheet: {
      id: 'one-sentence-card',
      label: draft('parent-first.nothing-left.worksheet.label', 'Download the capacity conversation card'),
    },
  },

  grieving: {
    category: 'parent-load',
    reflect: {
      headline: draft(
        'parent-first.grieving.reflect.headline',
        'You can love your child completely and still ache for the future you once pictured.',
      ),
      items: [
        {
          title: draft('parent-first.grieving.reflect.item-1.title', 'The grief may arrive in ordinary moments'),
          detail: draft(
            'parent-first.grieving.reflect.item-1.detail',
            'A birthday, school event, family photo, or conversation about the future can reopen what you thought life would look like.',
          ),
        },
        {
          title: draft('parent-first.grieving.reflect.item-2.title', 'You may feel guilty for naming it'),
          detail: draft(
            'parent-first.grieving.reflect.item-2.detail',
            'Parents often silence grief because they fear it will sound like rejection of the child they deeply love.',
          ),
        },
        {
          title: draft('parent-first.grieving.reflect.item-3.title', 'Other people may rush you toward gratitude'),
          detail: draft(
            'parent-first.grieving.reflect.item-3.detail',
            'Encouragement can feel lonely when what you need first is one place where the loss can be spoken without correction.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.grieving.stabilize.option-1',
          'Say: “I love my child, and I am also grieving what I expected life to be.”',
        ),
        draft(
          'parent-first.grieving.stabilize.option-2',
          'Think of one person who can hear that sentence without correcting it.',
        ),
        draft(
          'parent-first.grieving.stabilize.option-3',
          'Send: “I do not need advice. I need somewhere to say this honestly.”',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.grieving.path.bring-up.1',
          'Name the grief without turning it into a question about whether you love your child. The need is support for you, not a clinical interpretation of your child or a demand that the team remove every uncertainty about the future.',
        ),
        draft(
          'parent-first.grieving.path.bring-up.2',
          'Say which part is hardest right now: the imagined milestones, uncertainty about adulthood, changes in family life, or the loss of ease and spontaneity. Specific grief is easier to connect with the right kind of referral or resource.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.grieving.path.help.1',
          'Ask whether the clinic knows counselors or groups experienced with caregiver grief and disability-related family transitions. Ask for the actual referral route and whether the resource serves parents individually.',
        ),
        draft(
          'parent-first.grieving.path.help.2',
          'Ask for trustworthy long-term-planning resources when uncertainty about adulthood, independence, finances, or future care is part of the grief. Information will not erase loss, but it can separate what is unknown from what can be prepared for.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.grieving.path.changes.1',
          'The first change may simply be having one place where the truth can be spoken without being turned into gratitude or advice. Finding a well-matched counselor or group may take several contacts.',
        ),
        draft(
          'parent-first.grieving.path.changes.2',
          'Grief may return around new stages even after a calmer period. That does not mean support failed; it means the family reached another moment that asks you to adjust what you imagined.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.grieving.path.next.1',
          'Open Find Local Help to look for counseling where caregiver grief can be discussed without making the child the problem.',
        ),
        draft(
          'parent-first.grieving.path.next.2',
          'Open the Resource Hub for long-term-planning and parent-education resources you can review at your own pace.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.grieving.link.find.label', 'Open Find Local Help'),
          detail: draft(
            'parent-first.grieving.link.find.detail',
            'Look for counseling or groups that can hold love and grief in the same conversation.',
          ),
          href: '/support/find',
        },
        {
          label: draft('parent-first.grieving.link.resources.label', 'Open the Resource Hub'),
          detail: draft(
            'parent-first.grieving.link.resources.detail',
            'Find long-term-planning information without having to solve the entire future today.',
          ),
          href: '/support/resources',
        },
      ],
    },
    worksheet: {
      id: 'one-sentence-card',
      label: draft('parent-first.grieving.worksheet.label', 'Download the grief conversation card'),
    },
  },

  disappeared: {
    category: 'parent-load',
    reflect: {
      headline: draft(
        'parent-first.disappeared.reflect.headline',
        'Caregiving has taken so much space that you can barely find yourself inside the week.',
      ),
      items: [
        {
          title: draft('parent-first.disappeared.reflect.item-1.title', 'Your identity has become a list of responsibilities'),
          detail: draft(
            'parent-first.disappeared.reflect.item-1.detail',
            'People may ask about appointments and progress while rarely asking what you enjoy, need, believe, or want for your own life.',
          ),
        },
        {
          title: draft('parent-first.disappeared.reflect.item-2.title', 'Anything personal feels optional'),
          detail: draft(
            'parent-first.disappeared.reflect.item-2.detail',
            'Friendships, faith, exercise, creativity, rest, and ordinary interests are often the first things removed when care expands.',
          ),
        },
        {
          title: draft('parent-first.disappeared.reflect.item-3.title', 'Wanting something for yourself can feel disloyal'),
          detail: draft(
            'parent-first.disappeared.reflect.item-3.detail',
            'You may feel guilty protecting an hour even though losing every part of yourself has not made the family more sustainable.',
          ),
        },
      ],
    },
    stabilize: {
      options: [
        draft(
          'parent-first.disappeared.stabilize.option-1',
          'Name one thing that still feels like you: church, fishing, the gym, music, a friend, or quiet.',
        ),
        draft(
          'parent-first.disappeared.stabilize.option-2',
          'Choose one recurring hour and say: “I need this hour to exist again.”',
        ),
        draft(
          'parent-first.disappeared.stabilize.option-3',
          'Text one person: “Can you help me protect one hour this week?”',
        ),
      ],
    },
    pathForward: {
      whatToBringUp: [
        draft(
          'parent-first.disappeared.path.bring-up.1',
          'Bring one concrete part of your life that disappeared and the exact barrier preventing it from returning. “I stopped going to church because Sunday morning care cannot be handed off” is more actionable than “I need better balance.”',
        ),
        draft(
          'parent-first.disappeared.path.bring-up.2',
          'Tell the team why the hour matters to your ability to keep going. You are not asking ABA to create a complete personal life; you are asking whether scheduling, expectations, or available supports are blocking one realistic piece of it.',
        ),
      ],
      whatHelpToAskFor: [
        draft(
          'parent-first.disappeared.path.help.1',
          'Ask whether session scheduling, caregiver training for another adult, or a respite referral could make one recurring hour possible. Keep the request narrow enough that another person can tell you what is and is not available.',
        ),
        draft(
          'parent-first.disappeared.path.help.2',
          'Ask for parent-support referrals that are not only educational. You may need a place where nobody expects a progress report and the conversation can remain about you.',
        ),
      ],
      whatChangesAndHowFast: [
        draft(
          'parent-first.disappeared.path.changes.1',
          'Naming the hour can happen today. Making it reliable may require another adult, a schedule change, paid help, or a support program, and those pieces may take time to arrange.',
        ),
        draft(
          'parent-first.disappeared.path.changes.2',
          'The first win is not a perfectly balanced life. It is one recurring part of you that appears on the calendar often enough to stop feeling accidental.',
        ),
      ],
      whereToGoNext: [
        draft(
          'parent-first.disappeared.path.next.1',
          'Open Parent Connection when you need relationships where you are known as a person, not only as the coordinator of care.',
        ),
        draft(
          'parent-first.disappeared.path.next.2',
          'Open the Mental Health Toolbox when guilt, exhaustion, or constant alertness makes it difficult to protect even a small part of your own life.',
        ),
      ],
      siteLinks: [
        {
          label: draft('parent-first.disappeared.link.connection.label', 'Open Parent Connection'),
          detail: draft(
            'parent-first.disappeared.link.connection.detail',
            'Find parent community without turning every conversation into a clinical update.',
          ),
          href: '/support/connect',
        },
        {
          label: draft('parent-first.disappeared.link.mental-health.label', 'Open the Mental Health Toolbox'),
          detail: draft(
            'parent-first.disappeared.link.mental-health.detail',
            'Find support for guilt and depletion when you try to reclaim personal space.',
          ),
          href: '/support/caregiver',
        },
      ],
    },
    worksheet: {
      id: 'one-sentence-card',
      label: draft('parent-first.disappeared.worksheet.label', 'Download the “one hour for me” card'),
    },
  },
} satisfies Record<
  'cannot-keep-doing' | 'nothing-left' | 'grieving' | 'disappeared',
  ParentFirstPlanContent
>;
