'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  ExternalLink,
  FileText,
  Heart,
  LifeBuoy,
  Link2,
  ListChecks,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { loadCarePlan, type Hardest, type SavedCarePlan } from '@/lib/carePlanStorage';
import { cn } from '@/lib/utils';

type ConcernStatus = 'focus' | 'connected' | 'later';
type ConcernCategory =
  | 'relationship'
  | 'behavior'
  | 'burnout'
  | 'aba'
  | 'financial'
  | 'school'
  | 'siblings'
  | 'isolation'
  | 'general';
type GuideStep = 'stabilize' | 'understand' | 'connect';

type Concern = {
  id: string;
  title: string;
  status: ConcernStatus;
  category: ConcernCategory;
  createdAt: string;
  updatedAt: string;
};

type GuidedTool = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  noteLabel: string;
  notePlaceholder: string;
  icon: LucideIcon;
  resource?: {
    label: string;
    href: string;
  };
};

type UnderstandingPrompt = {
  id: string;
  title: string;
  description: string;
  placeholder: string;
};

type ConnectionOption = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  kind: 'guide' | 'resource';
  href?: string;
  resourceLabel?: string;
  opener?: string;
  questions?: string[];
  noteLabel?: string;
  notePlaceholder?: string;
};

type ConcernWorkspace = {
  activeStep: GuideStep;
  toolNotes: Record<string, string>;
  understandingNotes: Record<string, string>;
  connectionNotes: Record<string, string>;
  updatedAt: string;
};

type WorkspaceByConcern = Record<string, ConcernWorkspace>;

const STACK_KEY = 'cg.parentSupport.concerns.v1';
const WORKSPACE_KEY = 'cg.parentSupport.workspace.v2';

const EMPTY_WORKSPACE: ConcernWorkspace = {
  activeStep: 'stabilize',
  toolNotes: {},
  understandingNotes: {},
  connectionNotes: {},
  updatedAt: '',
};

const HARDEST_TO_CONCERN: Record<Hardest, { title: string; category: ConcernCategory }> = {
  'understanding-aba': {
    title: 'I do not understand parts of the home plan.',
    category: 'aba',
  },
  'behavior-home': {
    title: 'Difficult moments at home are exhausting me.',
    category: 'behavior',
  },
  overwhelmed: {
    title: 'I feel burned out and need support for myself.',
    category: 'burnout',
  },
  'finding-resources': {
    title: 'I do not know which support or resource to use.',
    category: 'general',
  },
  'financial-insurance': {
    title: 'The financial side of care is weighing on me.',
    category: 'financial',
  },
  siblings: {
    title: 'I am worried about how this is affecting siblings.',
    category: 'siblings',
  },
  'connecting-parents': {
    title: 'I feel isolated and need people who understand.',
    category: 'isolation',
  },
  'school-iep': {
    title: 'I need help navigating school concerns.',
    category: 'school',
  },
};

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `concern-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function inferCategory(text: string): ConcernCategory {
  const value = text.toLowerCase();
  if (/partner|relationship|marriage|spouse|husband|wife|couple|communication/.test(value)) {
    return 'relationship';
  }
  if (/tantrum|meltdown|aggress|climb|jump|elope|behavior|unsafe|crisis/.test(value)) {
    return 'behavior';
  }
  if (/burned out|burnt out|exhaust|overwhelm|no energy|drained|capacity/.test(value)) {
    return 'burnout';
  }
  if (/aba|bcba|home plan|treatment|strategy|therapy|clinical/.test(value)) return 'aba';
  if (/money|financial|insurance|bill|coverage|cost/.test(value)) return 'financial';
  if (/school|iep|teacher|classroom|education/.test(value)) return 'school';
  if (/sibling|brother|sister|other child/.test(value)) return 'siblings';
  if (/alone|isolated|community|friend|connection/.test(value)) return 'isolation';
  return 'general';
}

function normalizeStack(value: unknown): Concern[] {
  if (!Array.isArray(value)) return [];
  const statuses: ConcernStatus[] = ['focus', 'connected', 'later'];
  const categories: ConcernCategory[] = [
    'relationship',
    'behavior',
    'burnout',
    'aba',
    'financial',
    'school',
    'siblings',
    'isolation',
    'general',
  ];
  const concerns = value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const title = typeof item.title === 'string' ? item.title.trim().slice(0, 240) : '';
      if (!title) return null;
      const status =
        typeof item.status === 'string' && statuses.includes(item.status as ConcernStatus)
          ? (item.status as ConcernStatus)
          : 'later';
      const category =
        typeof item.category === 'string' && categories.includes(item.category as ConcernCategory)
          ? (item.category as ConcernCategory)
          : inferCategory(title);
      const now = new Date().toISOString();
      return {
        id: typeof item.id === 'string' ? item.id : makeId(),
        title,
        status,
        category,
        createdAt: typeof item.createdAt === 'string' ? item.createdAt : now,
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : now,
      } satisfies Concern;
    })
    .filter((item): item is Concern => Boolean(item));

  if (!concerns.length) return [];
  const focusIndex = concerns.findIndex((concern) => concern.status === 'focus');
  return concerns.map((concern, index) => ({
    ...concern,
    status:
      focusIndex === -1
        ? index === 0
          ? 'focus'
          : concern.status
        : concern.status === 'focus' && index !== focusIndex
          ? 'connected'
          : concern.status,
  }));
}

function deriveConcerns(plan: SavedCarePlan | null): Concern[] {
  if (!plan) return [];
  const now = new Date().toISOString();
  const raw: Array<{ title: string; category: ConcernCategory }> = [];
  const primary = plan.answers.notes?.trim() || plan.summary?.trim();
  if (primary) raw.push({ title: primary.slice(0, 240), category: inferCategory(primary) });

  for (const hardest of plan.answers.hardest ?? []) {
    const mapped = HARDEST_TO_CONCERN[hardest];
    if (!raw.some((item) => item.title.toLowerCase() === mapped.title.toLowerCase())) {
      raw.push(mapped);
    }
  }

  return raw.slice(0, 5).map((item, index) => ({
    id: makeId(),
    title: item.title,
    category: item.category,
    status: index === 0 ? 'focus' : index < 3 ? 'connected' : 'later',
    createdAt: now,
    updatedAt: now,
  }));
}

function readStoredStack() {
  if (typeof window === 'undefined') return [];
  try {
    return normalizeStack(JSON.parse(window.localStorage.getItem(STACK_KEY) ?? '[]'));
  } catch {
    return [];
  }
}

function readStoredWorkspaces(): WorkspaceByConcern {
  if (typeof window === 'undefined') return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(WORKSPACE_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? (parsed as WorkspaceByConcern) : {};
  } catch {
    return {};
  }
}

function getSupportModel(current: Concern) {
  let tools: GuidedTool[];
  let prompts: UnderstandingPrompt[];
  let connections: ConnectionOption[];

  switch (current.category) {
    case 'relationship':
      tools = [
        {
          id: 'relationship-pressure-point',
          title: 'Narrow the pressure point',
          summary: 'Choose one part of the strain instead of trying to solve the whole relationship today.',
          steps: [
            'Name the specific moment, responsibility, or need that feels hardest.',
            'Choose the one part that would make this week feel more manageable.',
            'Leave the rest in your Concern Stack for another time.',
          ],
          noteLabel: 'The one part I want to address first',
          notePlaceholder: 'For example: I need us to agree on who handles the evening routine.',
          icon: Target,
        },
        {
          id: 'relationship-calm-conversation',
          title: 'Prepare for a calmer conversation',
          summary: 'Plan what you want to communicate before the conversation begins.',
          steps: [
            'Choose a time when both people are able to listen.',
            'Describe your experience without trying to prove who is right.',
            'Ask for one specific change, clarification, or kind of support.',
          ],
          noteLabel: 'A sentence I could use to begin',
          notePlaceholder: 'I have been feeling overwhelmed by ____. Could we talk about one change that would help?',
          icon: MessageCircle,
          resource: { label: 'Open Marriage & Relationships support', href: '/support/couples' },
        },
        {
          id: 'relationship-capacity',
          title: 'Name what you need before the conversation',
          summary: 'Sometimes rest, relief, or clearer information needs to come before problem-solving.',
          steps: [
            'Ask whether you need emotional support, practical relief, or clinical clarification.',
            'Choose the smallest form of support that would help today.',
            'Write the request plainly so another person can respond to it.',
          ],
          noteLabel: 'The support I need most right now',
          notePlaceholder: 'For example: I need thirty quiet minutes before we discuss the evening routine.',
          icon: Heart,
          resource: { label: 'Open caregiver support', href: '/support/caregiver' },
        },
      ];
      prompts = [
        {
          id: 'relationship-strain',
          title: 'What feels strained?',
          description: 'Communication, emotional connection, responsibilities, intimacy, finances, or decisions about care.',
          placeholder: 'The part that feels most strained is…',
        },
        {
          id: 'relationship-pattern',
          title: 'When does the strain show up most?',
          description: 'Consider routines, difficult moments, appointments, exhaustion, or disagreements about care.',
          placeholder: 'I notice it most when…',
        },
        {
          id: 'relationship-need',
          title: 'What would meaningful support look like?',
          description: 'Understanding, a practical change, shared responsibility, reassurance, or outside support.',
          placeholder: 'What would help me feel supported is…',
        },
      ];
      connections = [
        {
          id: 'relationship-partner-guide',
          title: 'Prepare the conversation here',
          description: 'Build a calm opening and choose questions before talking with your partner.',
          icon: Users,
          kind: 'guide',
          opener: 'I care about us, and I want to talk about one thing that has been weighing on me. I am not trying to solve everything tonight.',
          questions: [
            'What part of our current routine feels hardest for you?',
            'Where do responsibilities feel unclear or uneven?',
            'What is one change we could try this week?',
          ],
          noteLabel: 'What I want to remember during the conversation',
          notePlaceholder: 'Write the main point, request, or boundary you want to communicate.',
        },
        {
          id: 'relationship-bcba-guide',
          title: 'Prepare questions for the BCBA',
          description: 'Use this only when disagreement or stress is connected to the child’s care plan.',
          icon: ListChecks,
          kind: 'guide',
          opener: 'We want to respond consistently at home, but parts of the plan are unclear to us.',
          questions: [
            'Could you review the home response with both caregivers?',
            'Can you demonstrate the first steps and watch us practice?',
            'Can we have the plan in a short written format?',
          ],
          noteLabel: 'The care-plan question I do not want to forget',
          notePlaceholder: 'Write the exact point you want clarified by the BCBA.',
        },
        {
          id: 'relationship-resource',
          title: 'Marriage & Relationships',
          description: 'Open the existing Common Ground relationship-support section.',
          icon: Heart,
          kind: 'resource',
          href: '/support/couples',
          resourceLabel: 'Open support',
        },
        {
          id: 'relationship-mental-health',
          title: 'Mental Health Toolbox',
          description: 'Find support when anxiety or emotional strain needs more attention.',
          icon: CircleHelp,
          kind: 'resource',
          href: '/support/mental-health',
          resourceLabel: 'Open toolbox',
        },
      ];
      break;

    case 'behavior':
      tools = [
        {
          id: 'behavior-safety-reminder',
          title: 'Create a safety-first reminder',
          summary: 'Keep the first priority visible without creating a new behavior procedure.',
          steps: [
            'Use the safety guidance already provided by the clinical team.',
            'Identify the first one or two steps you have already been taught.',
            'Contact appropriate support when you cannot safely follow the current plan.',
          ],
          noteLabel: 'The approved safety reminder I need visible',
          notePlaceholder: 'Write only the guidance already provided by your clinical team.',
          icon: ShieldCheck,
        },
        {
          id: 'behavior-plan-reminder',
          title: 'Make the current plan easier to remember',
          summary: 'Turn existing guidance into a short reminder you can find during a hard moment.',
          steps: [
            'Do not invent a new consequence or strategy during the situation.',
            'Write the first approved action in plain language.',
            'Mark anything that still needs to be demonstrated or clarified by the BCBA.',
          ],
          noteLabel: 'The short reminder I want to keep',
          notePlaceholder: 'For example: First, check safety. Then follow the written response plan.',
          icon: ListChecks,
          resource: { label: 'Open At Home Strategies', href: '/support/at-home' },
        },
        {
          id: 'behavior-afterward',
          title: 'Record the moment after everyone is safe',
          summary: 'Capture useful details without trying to diagnose why the behavior occurred.',
          steps: [
            'Write what happened immediately before the concern.',
            'Describe only what you could see or hear.',
            'Note what adults tried and what felt difficult to carry out.',
          ],
          noteLabel: 'What happened this time',
          notePlaceholder: 'Before: ____. I saw/heard: ____. We responded by: ____.',
          icon: FileText,
        },
      ];
      prompts = [
        {
          id: 'behavior-before',
          title: 'What happened immediately before?',
          description: 'Describe the routine, request, transition, or change without guessing the function.',
          placeholder: 'Immediately before, we were…',
        },
        {
          id: 'behavior-visible',
          title: 'What could you see or hear?',
          description: 'Use observable actions instead of labels such as “being difficult.”',
          placeholder: 'I saw or heard…',
        },
        {
          id: 'behavior-response',
          title: 'What part of the response was hardest to use?',
          description: 'This can become a request for demonstration, practice, or clearer written steps.',
          placeholder: 'The part I could not use consistently was…',
        },
      ];
      connections = [
        {
          id: 'behavior-bcba-guide',
          title: 'Prepare questions for the BCBA',
          description: 'Turn what happened at home into a focused clinical conversation.',
          icon: ListChecks,
          kind: 'guide',
          opener: 'I want to make sure I understand how to respond safely and consistently at home.',
          questions: [
            'What should I do at the first sign that this is beginning?',
            'Can you demonstrate the response and watch me practice?',
            'What information would be most useful for me to record?',
            'When should I contact you before our next meeting?',
          ],
          noteLabel: 'The question I most need answered',
          notePlaceholder: 'Write the exact part of the response that feels unclear.',
        },
        {
          id: 'behavior-at-home',
          title: 'At Home Strategies',
          description: 'Open practical guidance that already exists inside Common Ground.',
          icon: BookOpen,
          kind: 'resource',
          href: '/support/at-home',
          resourceLabel: 'Open strategies',
        },
        {
          id: 'behavior-caregiver',
          title: 'Caregiver support',
          description: 'Address what repeated difficult moments are costing you.',
          icon: Heart,
          kind: 'resource',
          href: '/support/caregiver',
          resourceLabel: 'Open support',
        },
        {
          id: 'behavior-team',
          title: 'Connect with support',
          description: 'Find the right human support when the current plan feels unclear or unsafe.',
          icon: Users,
          kind: 'resource',
          href: '/support/connect',
          resourceLabel: 'Find support',
        },
      ];
      break;

    case 'burnout':
      tools = [
        {
          id: 'burnout-lower-load',
          title: 'Lower today’s load',
          summary: 'A lower-capacity day needs a smaller plan, not more expectations.',
          steps: [
            'Choose one nonessential task that can wait, be simplified, or be shared.',
            'Keep the essential responsibility and release the rest for today.',
            'Name the person who could help if support is available.',
          ],
          noteLabel: 'One thing I can release or simplify today',
          notePlaceholder: 'Today, I am allowing ____ to wait.',
          icon: Target,
        },
        {
          id: 'burnout-specific-help',
          title: 'Ask for one specific kind of help',
          summary: 'A concrete request is easier for another person to respond to.',
          steps: [
            'Choose emotional support, practical relief, information, or professional care.',
            'Make the request small and specific.',
            'Send it to one appropriate person instead of carrying it alone.',
          ],
          noteLabel: 'The request I could make',
          notePlaceholder: 'Could you help me with ____ today so I can ____?',
          icon: Users,
        },
        {
          id: 'burnout-recovery-window',
          title: 'Choose a realistic recovery window',
          summary: 'Protect a short period that is not used to solve another problem.',
          steps: [
            'Choose a length of time that can realistically happen.',
            'Decide what you will not do during that window.',
            'Choose one activity that helps your body or mind settle.',
          ],
          noteLabel: 'My recovery window',
          notePlaceholder: 'From ____ to ____, I will pause ____ and do ____ instead.',
          icon: Heart,
          resource: { label: 'Open caregiver support', href: '/support/caregiver' },
        },
      ];
      prompts = [
        {
          id: 'burnout-drain',
          title: 'What is draining the most energy?',
          description: 'Emotional strain, sleep, difficult behavior, appointments, work, isolation, or decisions.',
          placeholder: 'The biggest drain on my capacity is…',
        },
        {
          id: 'burnout-functioning',
          title: 'What is becoming harder to do?',
          description: 'Consider sleep, work, relationships, health, or following the home plan.',
          placeholder: 'I am noticing that it is harder to…',
        },
        {
          id: 'burnout-relief',
          title: 'What kind of relief would actually matter?',
          description: 'Emotional support, practical help, clinical clarity, respite, or professional care.',
          placeholder: 'The support that would make the biggest difference is…',
        },
      ];
      connections = [
        {
          id: 'burnout-help-guide',
          title: 'Prepare a request for help',
          description: 'Turn “I am overwhelmed” into a request another person can understand.',
          icon: MessageCircle,
          kind: 'guide',
          opener: 'I am carrying more than I can sustain right now. I need help with one specific part.',
          questions: [
            'Who is most likely to respond safely and practically?',
            'What exact task, time period, or kind of support am I requesting?',
            'What will I do if this person is unavailable?',
          ],
          noteLabel: 'The message I want to send',
          notePlaceholder: 'I need help with ____ by ____. Could you ____?',
        },
        {
          id: 'burnout-caregiver-resource',
          title: 'Caregiver support',
          description: 'Open Common Ground tools focused on your capacity and well-being.',
          icon: Heart,
          kind: 'resource',
          href: '/support/caregiver',
          resourceLabel: 'Open support',
        },
        {
          id: 'burnout-mental-health',
          title: 'Mental Health Toolbox',
          description: 'Explore coping tools and routes to professional mental-health support.',
          icon: CircleHelp,
          kind: 'resource',
          href: '/support/mental-health',
          resourceLabel: 'Open toolbox',
        },
        {
          id: 'burnout-connect',
          title: 'Find human support',
          description: 'Connect with people, services, and practical resources.',
          icon: Users,
          kind: 'resource',
          href: '/support/connect',
          resourceLabel: 'Find support',
        },
      ];
      break;

    case 'aba':
      tools = [
        {
          id: 'aba-one-confusion',
          title: 'Name the one unclear instruction',
          summary: 'Turn a broad feeling of confusion into one question that can be answered.',
          steps: [
            'Choose the routine or recommendation that feels least clear.',
            'Write what you believe you are supposed to do.',
            'Mark the exact point where you become unsure.',
          ],
          noteLabel: 'The part I need explained',
          notePlaceholder: 'I understand ____, but I am unsure what to do when ____ happens.',
          icon: CircleHelp,
        },
        {
          id: 'aba-teach-back',
          title: 'Prepare a teach-back request',
          summary: 'Ask the BCBA to demonstrate the strategy and watch you practice it.',
          steps: [
            'Ask for the strategy in simple written steps.',
            'Ask the BCBA to model the response.',
            'Practice it and ask for feedback before leaving the meeting.',
          ],
          noteLabel: 'What I want demonstrated',
          notePlaceholder: 'Please show me how to respond when…',
          icon: ListChecks,
        },
        {
          id: 'aba-home-barrier',
          title: 'Describe what makes it harder at home',
          summary: 'A strategy may be understood but still be difficult to use in real family life.',
          steps: [
            'Name the time, setting, or competing responsibility creating the barrier.',
            'Describe who else needs to understand the plan.',
            'Ask how the existing recommendation can be practiced in that context.',
          ],
          noteLabel: 'The barrier at home',
          notePlaceholder: 'The plan becomes difficult to use when…',
          icon: FileText,
          resource: { label: 'Read What is ABA?', href: '/support/what-is-aba' },
        },
      ];
      prompts = [
        {
          id: 'aba-confusing-part',
          title: 'Which part is confusing?',
          description: 'A term, the reason for a strategy, the exact steps, or how to use it at home.',
          placeholder: 'The part I do not understand is…',
        },
        {
          id: 'aba-home-difference',
          title: 'What is different at home?',
          description: 'Consider siblings, schedules, fatigue, space, other caregivers, and competing demands.',
          placeholder: 'At home, the main difference is…',
        },
        {
          id: 'aba-needed-format',
          title: 'How would you learn it best?',
          description: 'A demonstration, written steps, practice, video, example, or follow-up check-in.',
          placeholder: 'It would help me if the BCBA could…',
        },
      ];
      connections = [
        {
          id: 'aba-bcba-guide',
          title: 'Prepare the BCBA conversation',
          description: 'Create a focused request for explanation, modeling, and practice.',
          icon: ListChecks,
          kind: 'guide',
          opener: 'I want to use the plan correctly at home, but I need one part explained more clearly.',
          questions: [
            'Can you explain the purpose in plain language?',
            'Can you demonstrate it and then watch me practice?',
            'What should I do when the home situation looks different from the clinic?',
            'How will we know whether I am using it correctly?',
          ],
          noteLabel: 'My most important question for the BCBA',
          notePlaceholder: 'Write the one answer you need before the meeting ends.',
        },
        {
          id: 'aba-learn',
          title: 'What is ABA?',
          description: 'Open the existing plain-language ABA guide.',
          icon: BookOpen,
          kind: 'resource',
          href: '/support/what-is-aba',
          resourceLabel: 'Open guide',
        },
        {
          id: 'aba-home',
          title: 'At Home Strategies',
          description: 'Review practical guidance already available in Common Ground.',
          icon: BookOpen,
          kind: 'resource',
          href: '/support/at-home',
          resourceLabel: 'Open strategies',
        },
        {
          id: 'aba-connect',
          title: 'Connect with support',
          description: 'Find the appropriate person or support route for your question.',
          icon: Users,
          kind: 'resource',
          href: '/support/connect',
          resourceLabel: 'Find support',
        },
      ];
      break;

    case 'financial':
      tools = [
        {
          id: 'financial-urgent-question',
          title: 'Identify the urgent financial question',
          summary: 'Separate the issue that needs an answer now from everything else.',
          steps: [
            'Choose whether the concern is a bill, coverage, authorization, cost, or paperwork.',
            'Write the date, amount, or deadline only if it is safe and appropriate to store here.',
            'Name the answer you need from billing or insurance.',
          ],
          noteLabel: 'The financial question I need answered',
          notePlaceholder: 'I need to understand why ____ and what I should do next.',
          icon: CircleHelp,
          resource: { label: 'Open Paying for Care', href: '/support/financial' },
        },
        {
          id: 'financial-prepare-contact',
          title: 'Prepare before contacting support',
          summary: 'Gather only what is needed so the conversation is easier to manage.',
          steps: [
            'Write the name of the department you need to contact.',
            'List the document or information you may need available.',
            'Choose the one outcome you want from the conversation.',
          ],
          noteLabel: 'What I need ready',
          notePlaceholder: 'Contact: ____. Information needed: ____. Desired answer: ____.',
          icon: FileText,
        },
        {
          id: 'financial-lower-load',
          title: 'Keep the task contained',
          summary: 'Financial uncertainty can expand mentally; give this task a clear boundary.',
          steps: [
            'Choose one call, form, or question for this session.',
            'Set aside the remaining concerns in the stack.',
            'Record the next contact or follow-up before stopping.',
          ],
          noteLabel: 'The one financial task I am handling now',
          notePlaceholder: 'For this session, I am only going to…',
          icon: Target,
        },
      ];
      prompts = [
        {
          id: 'financial-type',
          title: 'What kind of issue is this?',
          description: 'Billing, insurance coverage, authorization, affordability, or paperwork.',
          placeholder: 'This concern is mainly about…',
        },
        {
          id: 'financial-unknown',
          title: 'What answer is missing?',
          description: 'Identify the specific information preventing you from moving forward.',
          placeholder: 'I cannot move forward until I know…',
        },
        {
          id: 'financial-next-contact',
          title: 'Who is the next appropriate contact?',
          description: 'The clinic, billing team, insurer, employer, or another support resource.',
          placeholder: 'The next person or department I need to contact is…',
        },
      ];
      connections = [
        {
          id: 'financial-call-guide',
          title: 'Prepare the billing or insurance conversation',
          description: 'Write a clear opening and the questions you need answered.',
          icon: MessageCircle,
          kind: 'guide',
          opener: 'I am calling because I need clarification about one part of the cost or coverage for care.',
          questions: [
            'What is the current status of this bill, claim, or authorization?',
            'What information or action is needed from me?',
            'Who should I contact if this is not resolved?',
            'Can you give me a reference number or written summary?',
          ],
          noteLabel: 'What I need to leave the conversation knowing',
          notePlaceholder: 'Before the call ends, I need a clear answer about…',
        },
        {
          id: 'financial-resource',
          title: 'Paying for Care',
          description: 'Open the Common Ground financial-support section.',
          icon: BookOpen,
          kind: 'resource',
          href: '/support/financial',
          resourceLabel: 'Open support',
        },
        {
          id: 'financial-connect',
          title: 'Find the right contact',
          description: 'Use Common Ground to identify the appropriate human support.',
          icon: Users,
          kind: 'resource',
          href: '/support/connect',
          resourceLabel: 'Find support',
        },
      ];
      break;

    default:
      tools = [
        {
          id: 'general-one-part',
          title: 'Choose one part to carry right now',
          summary: 'Focusing on one part does not mean the other concerns are forgotten.',
          steps: [
            'Name the part creating the most pressure today.',
            'Choose one action, answer, or conversation that would help.',
            'Leave the remaining concerns safely in your stack.',
          ],
          noteLabel: 'The part I want help with first',
          notePlaceholder: 'The first thing I want to make more manageable is…',
          icon: Target,
        },
        {
          id: 'general-name-support',
          title: 'Name the kind of support you need',
          summary: 'Choose between information, practical relief, a conversation, or professional support.',
          steps: [
            'Ask what would be different if you felt supported.',
            'Choose the person, resource, or kind of help that fits that need.',
            'Turn the need into one clear request.',
          ],
          noteLabel: 'The support I am looking for',
          notePlaceholder: 'I need help with ____ so that ____ becomes more manageable.',
          icon: CircleHelp,
        },
        {
          id: 'general-capture-question',
          title: 'Capture one question',
          summary: 'Write it now so you do not have to keep carrying it mentally.',
          steps: [
            'Write the question exactly as it appears in your mind.',
            'Choose who is most qualified to answer it.',
            'Keep it here until the next conversation.',
          ],
          noteLabel: 'The question I do not want to forget',
          notePlaceholder: 'My question is…',
          icon: MessageCircle,
        },
      ];
      prompts = [
        {
          id: 'general-hardest',
          title: 'What feels hardest?',
          description: 'Identify the specific part of the situation creating the most pressure.',
          placeholder: 'The hardest part is…',
        },
        {
          id: 'general-pattern',
          title: 'When does it affect you most?',
          description: 'Notice the times, routines, people, or decisions connected to the concern.',
          placeholder: 'This affects me most when…',
        },
        {
          id: 'general-support',
          title: 'What support would change the situation?',
          description: 'Clarify the next conversation, resource, or person that may be appropriate.',
          placeholder: 'The support that would make a difference is…',
        },
      ];
      connections = [
        {
          id: 'general-conversation-guide',
          title: 'Prepare the next conversation',
          description: 'Organize what is happening, what you need, and what you want to ask.',
          icon: MessageCircle,
          kind: 'guide',
          opener: 'I want to explain what has been weighing on me and ask for one kind of support.',
          questions: [
            'What is the main point I need this person to understand?',
            'What specific help or answer am I requesting?',
            'What will I do if this person is not the right source of support?',
          ],
          noteLabel: 'What I want to say or ask',
          notePlaceholder: 'Write the main point you want to carry into the conversation.',
        },
        {
          id: 'general-resources',
          title: 'Resource Hub',
          description: 'Explore support that already exists inside Common Ground.',
          icon: BookOpen,
          kind: 'resource',
          href: '/support/resources',
          resourceLabel: 'Open resources',
        },
        {
          id: 'general-caregiver',
          title: 'Caregiver support',
          description: 'Find support centered on what this is costing you.',
          icon: Heart,
          kind: 'resource',
          href: '/support/caregiver',
          resourceLabel: 'Open support',
        },
        {
          id: 'general-connect',
          title: 'Find human support',
          description: 'Connect with an appropriate person, service, or community resource.',
          icon: Users,
          kind: 'resource',
          href: '/support/connect',
          resourceLabel: 'Find support',
        },
      ];
  }

  if (current.category === 'school') {
    connections = [
      {
        id: 'school-conversation-guide',
        title: 'Prepare the school or care-team conversation',
        description: 'Organize what you have observed and what answer or support you need.',
        icon: MessageCircle,
        kind: 'guide',
        opener: 'I want to make sure we understand what is happening across settings and what support is appropriate.',
        questions: [
          'What are you observing in this setting?',
          'What information would help us compare home, clinic, and school?',
          'Who should be involved in the next conversation?',
        ],
        noteLabel: 'The school concern I want to explain clearly',
        notePlaceholder: 'I have noticed ____. I need help understanding ____.',
      },
      {
        id: 'school-resources',
        title: 'Resource Hub',
        description: 'Open existing educational and family resources.',
        icon: BookOpen,
        kind: 'resource',
        href: '/support/resources',
        resourceLabel: 'Open resources',
      },
      {
        id: 'school-connect',
        title: 'Find support',
        description: 'Identify the appropriate person or service for the next question.',
        icon: Users,
        kind: 'resource',
        href: '/support/connect',
        resourceLabel: 'Find support',
      },
    ];
  }

  if (current.category === 'siblings') {
    connections = [
      {
        id: 'siblings-conversation-guide',
        title: 'Prepare a family conversation',
        description: 'Choose simple language and identify what the sibling needs to hear or receive.',
        icon: MessageCircle,
        kind: 'guide',
        opener: 'I want to make space for how this has been affecting you too.',
        questions: [
          'What has felt hardest or confusing lately?',
          'What time or attention do you need from me?',
          'What would help home feel more predictable?',
        ],
        noteLabel: 'What I want to remember about the sibling’s needs',
        notePlaceholder: 'The sibling may need…',
      },
      {
        id: 'siblings-resource',
        title: 'Sibling Support',
        description: 'Open the existing Common Ground sibling-support section.',
        icon: Users,
        kind: 'resource',
        href: '/support/siblings',
        resourceLabel: 'Open support',
      },
      {
        id: 'siblings-connect',
        title: 'Find family support',
        description: 'Connect with relevant community or practical resources.',
        icon: Link2,
        kind: 'resource',
        href: '/support/connect',
        resourceLabel: 'Find support',
      },
    ];
  }

  if (current.category === 'isolation') {
    connections = [
      {
        id: 'isolation-reach-out-guide',
        title: 'Prepare a low-pressure reach-out',
        description: 'Write a simple message that asks for connection without explaining everything.',
        icon: MessageCircle,
        kind: 'guide',
        opener: 'I have been carrying a lot lately and could use someone to talk with.',
        questions: [
          'Who has felt safe or understanding in the past?',
          'Would I prefer listening, practical help, or shared experience?',
          'What is the smallest invitation I could make?',
        ],
        noteLabel: 'The message I could send',
        notePlaceholder: 'Would you have time to ____ this week?',
      },
      {
        id: 'isolation-connect',
        title: 'Parent and community connection',
        description: 'Use Common Ground to find people and resources that understand.',
        icon: Users,
        kind: 'resource',
        href: '/support/connect',
        resourceLabel: 'Find connection',
      },
      {
        id: 'isolation-resources',
        title: 'Resource Hub',
        description: 'Explore other available caregiver and family supports.',
        icon: BookOpen,
        kind: 'resource',
        href: '/support/resources',
        resourceLabel: 'Open resources',
      },
    ];
  }

  return { tools, prompts, connections };
}

function buildInsight(current: Concern, connected: Concern[]) {
  const categories = new Set([current.category, ...connected.map((concern) => concern.category)]);
  if (categories.has('relationship') && categories.has('behavior') && categories.has('burnout')) {
    return {
      title: 'These concerns may be influencing one another.',
      body: 'Difficult moments at home can drain your capacity, and exhaustion can make communication with your partner harder. The guide will focus on one pressure point while keeping the full picture visible.',
    };
  }
  if (categories.has('behavior') && categories.has('burnout')) {
    return {
      title: 'The home concern and caregiver exhaustion appear connected.',
      body: 'Preparing for difficult moments and protecting your capacity may need to happen together. You can work on one without losing the other.',
    };
  }
  if (categories.has('aba') && categories.has('relationship')) {
    return {
      title: 'Unclear care expectations may be adding relationship pressure.',
      body: 'A partner conversation and clearer questions for the BCBA may both be useful, but they do not have to happen at the same time.',
    };
  }
  if (connected.length) {
    return {
      title: 'Your concerns appear connected.',
      body: `The guide will focus on “${current.title}” while keeping ${connected.length === 1 ? 'the connected concern' : `${connected.length} connected concerns`} visible so important context is not lost.`,
    };
  }
  return {
    title: 'One focus can make the next decision clearer.',
    body: 'You can add other concerns at any time. Choosing one focus does not mean the others are forgotten.',
  };
}

function statusLabel(status: ConcernStatus) {
  if (status === 'focus') return 'Current focus';
  if (status === 'connected') return 'Connected concern';
  return 'Saved for later';
}

function concernStyles(status: ConcernStatus) {
  if (status === 'focus') {
    return {
      border: 'border-teal-300',
      background: 'bg-teal-50/60',
      badge: 'bg-teal-700 text-white',
      number: 'bg-teal-700 text-white',
    };
  }
  if (status === 'connected') {
    return {
      border: 'border-indigo-200',
      background: 'bg-indigo-50/35',
      badge: 'bg-indigo-100 text-indigo-800',
      number: 'bg-indigo-600 text-white',
    };
  }
  return {
    border: 'border-surface-border',
    background: 'bg-white',
    badge: 'bg-brand-muted-100 text-brand-muted-700',
    number: 'bg-brand-muted-200 text-brand-muted-700',
  };
}

export default function SupportHome() {
  const [hydrated, setHydrated] = useState(false);
  const [plan, setPlan] = useState<SavedCarePlan | null>(null);
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceByConcern>({});
  const [showComposer, setShowComposer] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftConcern, setDraftConcern] = useState('');
  const [draftStatus, setDraftStatus] = useState<ConcernStatus>('connected');
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);
  const [expandedConnectionId, setExpandedConnectionId] = useState<string | null>(null);

  useEffect(() => {
    const loadedPlan = loadCarePlan();
    const stored = readStoredStack();
    setPlan(loadedPlan);
    setConcerns(stored.length ? stored : deriveConcerns(loadedPlan));
    setWorkspaces(readStoredWorkspaces());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STACK_KEY, JSON.stringify(concerns));
    } catch {
      // The page remains usable if device storage is unavailable.
    }
  }, [concerns, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspaces));
    } catch {
      // The page remains usable if device storage is unavailable.
    }
  }, [hydrated, workspaces]);

  const currentConcern = concerns.find((concern) => concern.status === 'focus') ?? null;
  const connectedConcerns = concerns.filter((concern) => concern.status === 'connected');
  const currentWorkspace = currentConcern
    ? workspaces[currentConcern.id] ?? EMPTY_WORKSPACE
    : EMPTY_WORKSPACE;
  const model = useMemo(
    () => (currentConcern ? getSupportModel(currentConcern) : null),
    [currentConcern],
  );
  const insight = useMemo(
    () => (currentConcern ? buildInsight(currentConcern, connectedConcerns) : null),
    [connectedConcerns, currentConcern],
  );

  const updateWorkspace = useCallback(
    (updater: (workspace: ConcernWorkspace) => ConcernWorkspace) => {
      if (!currentConcern) return;
      setWorkspaces((current) => {
        const previous = current[currentConcern.id] ?? EMPTY_WORKSPACE;
        return { ...current, [currentConcern.id]: updater(previous) };
      });
    },
    [currentConcern],
  );

  const setActiveStep = (step: GuideStep) => {
    updateWorkspace((workspace) => ({
      ...workspace,
      activeStep: step,
      updatedAt: new Date().toISOString(),
    }));
    setExpandedToolId(null);
    setExpandedConnectionId(null);
  };

  const setFocus = (id: string) => {
    const now = new Date().toISOString();
    setConcerns((current) =>
      current.map((concern) => ({
        ...concern,
        status: concern.id === id ? 'focus' : concern.status === 'focus' ? 'connected' : concern.status,
        updatedAt: concern.id === id || concern.status === 'focus' ? now : concern.updatedAt,
      })),
    );
    setExpandedToolId(null);
    setExpandedConnectionId(null);
  };

  const openAddConcern = () => {
    setEditingId(null);
    setDraftConcern('');
    setDraftStatus(currentConcern ? 'connected' : 'focus');
    setShowComposer(true);
  };

  const openEditConcern = (concern: Concern) => {
    setEditingId(concern.id);
    setDraftConcern(concern.title);
    setDraftStatus(concern.status);
    setShowComposer(true);
  };

  const saveConcern = () => {
    const title = draftConcern.trim();
    if (title.length < 10) return;
    const now = new Date().toISOString();

    if (editingId) {
      setConcerns((current) =>
        current.map((concern) =>
          concern.id === editingId
            ? { ...concern, title: title.slice(0, 240), category: inferCategory(title), updatedAt: now }
            : concern,
        ),
      );
    } else {
      const status = currentConcern ? draftStatus : 'focus';
      const nextConcern: Concern = {
        id: makeId(),
        title: title.slice(0, 240),
        status,
        category: inferCategory(title),
        createdAt: now,
        updatedAt: now,
      };
      setConcerns((current) =>
        status === 'focus'
          ? [
              nextConcern,
              ...current.map((concern) => ({
                ...concern,
                status: concern.status === 'focus' ? ('connected' as const) : concern.status,
              })),
            ]
          : [...current, nextConcern],
      );
    }

    setShowComposer(false);
    setDraftConcern('');
    setEditingId(null);
  };

  const removeConcern = () => {
    if (!editingId) return;
    setConcerns((current) => {
      const remaining = current.filter((concern) => concern.id !== editingId);
      if (remaining.length && !remaining.some((concern) => concern.status === 'focus')) {
        return remaining.map((concern, index) =>
          index === 0 ? { ...concern, status: 'focus' as const } : concern,
        );
      }
      return remaining;
    });
    setShowComposer(false);
    setEditingId(null);
    setDraftConcern('');
  };

  const updateToolNote = (id: string, value: string) => {
    updateWorkspace((workspace) => ({
      ...workspace,
      toolNotes: { ...workspace.toolNotes, [id]: value.slice(0, 1200) },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateUnderstandingNote = (id: string, value: string) => {
    updateWorkspace((workspace) => ({
      ...workspace,
      understandingNotes: { ...workspace.understandingNotes, [id]: value.slice(0, 1200) },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateConnectionNote = (id: string, value: string) => {
    updateWorkspace((workspace) => ({
      ...workspace,
      connectionNotes: { ...workspace.connectionNotes, [id]: value.slice(0, 1200) },
      updatedAt: new Date().toISOString(),
    }));
  };

  if (!hydrated) {
    return (
      <div className="page-shell">
        <div className="h-28 animate-pulse rounded-3xl bg-surface-subtle" />
        <div className="grid gap-3 md:grid-cols-3">
          <div className="h-32 animate-pulse rounded-2xl bg-surface-subtle" />
          <div className="h-32 animate-pulse rounded-2xl bg-surface-subtle" />
          <div className="h-32 animate-pulse rounded-2xl bg-surface-subtle" />
        </div>
        <div className="h-80 animate-pulse rounded-3xl bg-surface-subtle" />
      </div>
    );
  }

  const savedEntries = model
    ? [
        ...model.tools
          .filter((tool) => Boolean(currentWorkspace.toolNotes[tool.id]?.trim()))
          .map((tool) => ({ id: `tool-${tool.id}`, label: tool.title, color: 'text-teal-700' })),
        ...model.prompts
          .filter((prompt) => Boolean(currentWorkspace.understandingNotes[prompt.id]?.trim()))
          .map((prompt) => ({ id: `prompt-${prompt.id}`, label: prompt.title, color: 'text-blue-700' })),
        ...model.connections
          .filter((option) => Boolean(currentWorkspace.connectionNotes[option.id]?.trim()))
          .map((option) => ({ id: `connection-${option.id}`, label: option.title, color: 'text-violet-700' })),
      ]
    : [];

  return (
    <div className="page-shell gap-6 sm:gap-8">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Parent support
          </p>
          <h1 className="mt-2 text-balance text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
            You&rsquo;re not alone. We&rsquo;ll help you make the next decision clearer.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-brand-muted-600">
            Keep every concern in view, work with one focus at a time, and use practical tools
            without turning support into another assignment.
          </p>
        </div>
        {currentConcern && (
          <a
            href="#concern-stack"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-primary/20 bg-white px-3 py-2 text-[12px] font-semibold text-primary hover:bg-brand-navy-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Return to concern stack
          </a>
        )}
      </section>

      <section id="concern-stack" className="scroll-mt-24">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-brand-navy-700">Your Concern Stack</h2>
            <p className="mt-1 text-[13px] text-brand-muted-500">
              Nothing is forgotten. Choose what needs your attention first.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddConcern}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-brand-navy-50"
          >
            <Plus className="h-4 w-4" /> Add another concern
          </button>
        </div>

        {concerns.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {concerns.map((concern, index) => {
              const styles = concernStyles(concern.status);
              return (
                <article
                  key={concern.id}
                  className={cn(
                    'flex min-h-40 flex-col rounded-2xl border-2 p-4 transition',
                    styles.border,
                    styles.background,
                    concern.status === 'focus' && 'shadow-soft',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em]',
                        styles.badge,
                      )}
                    >
                      {statusLabel(concern.status)}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditConcern(concern)}
                      className="rounded-lg p-1.5 text-brand-muted-400 hover:bg-white hover:text-primary"
                      aria-label={`Edit concern ${index + 1}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-start gap-3">
                    <span
                      className={cn(
                        'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        styles.number,
                      )}
                    >
                      {index + 1}
                    </span>
                    <p className="text-[14px] font-semibold leading-relaxed text-brand-navy-700">
                      {concern.title}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-brand-muted-500">
                      {concern.status === 'focus' ? (
                        <Target className="h-3.5 w-3.5 text-teal-700" />
                      ) : concern.status === 'connected' ? (
                        <Link2 className="h-3.5 w-3.5 text-indigo-600" />
                      ) : (
                        <BookOpen className="h-3.5 w-3.5" />
                      )}
                      {concern.status === 'focus'
                        ? 'Current focus'
                        : concern.status === 'connected'
                          ? 'Connected to the focus'
                          : 'Kept for later'}
                    </span>
                    {concern.status !== 'focus' && (
                      <button
                        type="button"
                        onClick={() => setFocus(concern.id)}
                        className="text-[11px] font-semibold text-primary hover:underline"
                      >
                        Focus here
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <section className="rounded-3xl border border-dashed border-primary/30 bg-white p-8 text-center shadow-soft">
            <Target className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-4 text-xl font-semibold text-brand-navy-700">
              What is weighing on you right now?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-brand-muted-600">
              Add your first concern in your own words. Common Ground will keep the experience
              structured and help you find something useful to do with it.
            </p>
            <button type="button" onClick={openAddConcern} className="btn-primary mt-5">
              <Plus className="h-4 w-4" /> Add my first concern
            </button>
          </section>
        )}
      </section>

      {showComposer && (
        <section className="rounded-3xl border border-primary/20 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {editingId ? 'Update concern' : 'Add concern'}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-brand-navy-700">
                What is weighing on you?
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowComposer(false)}
              className="rounded-xl p-2 text-brand-muted-500 hover:bg-surface-muted"
              aria-label="Close concern form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-950">
            Protect client confidentiality. Do not include names, birth dates, addresses, schools,
            therapist names, or other identifying details.
          </div>
          <textarea
            value={draftConcern}
            onChange={(event) => setDraftConcern(event.target.value.slice(0, 240))}
            rows={4}
            placeholder="For example: I am anxious about my relationship with my partner and I do not know how to talk about it."
            className="mt-4 w-full resize-none rounded-2xl border-2 border-surface-border bg-white px-4 py-3.5 text-[14px] leading-relaxed text-brand-navy-700 outline-none transition placeholder:text-brand-muted-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          {!editingId && currentConcern && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(['connected', 'later', 'focus'] as ConcernStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setDraftStatus(status)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-semibold',
                    draftStatus === status
                      ? status === 'focus'
                        ? 'border-teal-300 bg-teal-50 text-teal-800'
                        : status === 'connected'
                          ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                          : 'border-brand-muted-300 bg-brand-muted-100 text-brand-muted-800'
                      : 'border-surface-border bg-white text-brand-muted-600',
                  )}
                >
                  {status === 'focus'
                    ? 'Make this my focus'
                    : status === 'connected'
                      ? 'Connect to current focus'
                      : 'Save for later'}
                </button>
              ))}
            </div>
          )}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              {editingId && (
                <button
                  type="button"
                  onClick={removeConcern}
                  className="text-sm font-semibold text-rose-700 hover:underline"
                >
                  Remove concern
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-muted-600 hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={draftConcern.trim().length < 10}
                onClick={saveConcern}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white',
                  draftConcern.trim().length >= 10
                    ? 'bg-primary hover:bg-primary/90'
                    : 'cursor-not-allowed bg-stone-300',
                )}
              >
                <Check className="h-4 w-4" /> Save concern
              </button>
            </div>
          </div>
        </section>
      )}

      {currentConcern && model && insight && (
        <>
          <section className="rounded-3xl border border-teal-200 bg-teal-50/55 p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-teal-950">Connected picture: {insight.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-teal-950/75">{insight.body}</p>
                </div>
              </div>
              <div className="border-teal-200 text-[12px] leading-relaxed text-teal-950/75 lg:border-l lg:pl-5">
                Nothing here is a score or required sequence. Open the part that would be most useful
                today.
                <button
                  type="button"
                  onClick={() => setActiveStep('understand')}
                  className="mt-2 block font-semibold text-teal-800 hover:underline"
                >
                  Explore how these concerns connect
                </button>
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
            <GuideAccordion
              activeStep={currentWorkspace.activeStep}
              model={model}
              workspace={currentWorkspace}
              expandedToolId={expandedToolId}
              expandedConnectionId={expandedConnectionId}
              onExpandedToolChange={setExpandedToolId}
              onExpandedConnectionChange={setExpandedConnectionId}
              onStepChange={setActiveStep}
              onToolNoteChange={updateToolNote}
              onUnderstandingNoteChange={updateUnderstandingNote}
              onConnectionNoteChange={updateConnectionNote}
            />

            <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
              <section className="rounded-3xl border border-surface-border bg-white p-5 shadow-soft">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">
                  Current focus
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-brand-navy-700">
                  {currentConcern.title}
                </p>
                <a
                  href="#concern-stack"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                >
                  Change focus <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </section>

              <section className="rounded-3xl border border-surface-border bg-white p-5 shadow-soft">
                <p className="text-sm font-semibold text-brand-navy-700">Your notes stay here</p>
                <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-500">
                  Anything you write stays with this concern on this device. There is nothing to
                  complete.
                </p>
                <div className="mt-4 space-y-2.5">
                  {savedEntries.length ? (
                    savedEntries.slice(0, 6).map((entry) => (
                      <p key={entry.id} className="flex items-start gap-2 text-[12px] text-brand-muted-700">
                        <FileText className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', entry.color)} />
                        {entry.label}
                      </p>
                    ))
                  ) : (
                    <p className="rounded-2xl bg-brand-warm-50 px-3 py-3 text-[12px] leading-relaxed text-brand-muted-500">
                      Open a tool or reflection prompt when you are ready. Notes save automatically.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-rose-200 bg-rose-50/70 p-5">
                <div className="flex items-start gap-3">
                  <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
                  <div>
                    <p className="text-sm font-semibold text-rose-900">Need immediate help?</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-rose-800">
                      Common Ground is not an emergency service. If anyone is in immediate danger,
                      use emergency or crisis support now.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function GuideAccordion({
  activeStep,
  model,
  workspace,
  expandedToolId,
  expandedConnectionId,
  onExpandedToolChange,
  onExpandedConnectionChange,
  onStepChange,
  onToolNoteChange,
  onUnderstandingNoteChange,
  onConnectionNoteChange,
}: {
  activeStep: GuideStep;
  model: ReturnType<typeof getSupportModel>;
  workspace: ConcernWorkspace;
  expandedToolId: string | null;
  expandedConnectionId: string | null;
  onExpandedToolChange: (id: string | null) => void;
  onExpandedConnectionChange: (id: string | null) => void;
  onStepChange: (step: GuideStep) => void;
  onToolNoteChange: (id: string, value: string) => void;
  onUnderstandingNoteChange: (id: string, value: string) => void;
  onConnectionNoteChange: (id: string, value: string) => void;
}) {
  return (
    <section className="space-y-3" aria-label="Parent support guide">
      <AccordionStep
        number="1"
        title="Stabilize"
        label="What may help now"
        description="Use one practical tool to reduce immediate pressure. Nothing here is homework."
        accent="teal"
        open={activeStep === 'stabilize'}
        onToggle={() => onStepChange('stabilize')}
      >
        <div className="space-y-3">
          {model.tools.map((tool) => {
            const Icon = tool.icon;
            const open = expandedToolId === tool.id;
            return (
              <article key={tool.id} className="rounded-2xl border border-teal-100 bg-white">
                <button
                  type="button"
                  onClick={() => onExpandedToolChange(open ? null : tool.id)}
                  className="flex w-full items-start gap-3 p-4 text-left"
                  aria-expanded={open}
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-brand-navy-700">{tool.title}</span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-600">
                      {tool.summary}
                    </span>
                  </span>
                  {open ? (
                    <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-teal-700" />
                  ) : (
                    <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-brand-muted-400" />
                  )}
                </button>

                {open && (
                  <div className="border-t border-teal-100 px-4 pb-4 pt-4">
                    <ol className="space-y-2.5">
                      {tool.steps.map((step, index) => (
                        <li key={step} className="flex items-start gap-3 text-[12.5px] leading-relaxed text-brand-muted-700">
                          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-800">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <label className="mt-4 block">
                      <span className="text-xs font-semibold text-brand-navy-700">{tool.noteLabel}</span>
                      <textarea
                        value={workspace.toolNotes[tool.id] ?? ''}
                        onChange={(event) => onToolNoteChange(tool.id, event.target.value)}
                        rows={3}
                        placeholder={tool.notePlaceholder}
                        className="mt-2 w-full resize-none rounded-xl border border-surface-border bg-brand-warm-50/60 px-3 py-2.5 text-[13px] leading-relaxed text-brand-navy-700 outline-none placeholder:text-brand-muted-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                      />
                    </label>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[11px] text-brand-muted-500">Saved privately on this device.</p>
                      {tool.resource && (
                        <Link
                          href={tool.resource.href}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:underline"
                        >
                          {tool.resource.label} <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end border-t border-teal-100 pt-4">
          <button
            type="button"
            onClick={() => onStepChange('understand')}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Explore Understand <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </AccordionStep>

      <AccordionStep
        number="2"
        title="Understand"
        label="Understand the concern"
        description="Write only what helps you see the situation more clearly. Leave anything else blank."
        accent="blue"
        open={activeStep === 'understand'}
        onToggle={() => onStepChange('understand')}
      >
        <div className="space-y-3">
          {model.prompts.map((prompt) => (
            <label key={prompt.id} className="block rounded-2xl border border-blue-100 bg-white p-4">
              <span className="text-sm font-semibold text-brand-navy-700">{prompt.title}</span>
              <span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-600">
                {prompt.description}
              </span>
              <textarea
                value={workspace.understandingNotes[prompt.id] ?? ''}
                onChange={(event) => onUnderstandingNoteChange(prompt.id, event.target.value)}
                rows={3}
                placeholder={prompt.placeholder}
                className="mt-3 w-full resize-none rounded-xl border border-surface-border bg-blue-50/35 px-3 py-2.5 text-[13px] leading-relaxed text-brand-navy-700 outline-none placeholder:text-brand-muted-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-blue-100 pt-4">
          <p className="text-[11px] text-brand-muted-500">Notes save automatically. Skip any question that adds pressure.</p>
          <button
            type="button"
            onClick={() => onStepChange('connect')}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Explore Connect <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </AccordionStep>

      <AccordionStep
        number="3"
        title="Connect"
        label="Choose the right support"
        description="Use an inline conversation guide or open a resource that already exists in Common Ground."
        accent="violet"
        open={activeStep === 'connect'}
        onToggle={() => onStepChange('connect')}
      >
        <div className="space-y-3">
          {model.connections.map((option) => {
            const Icon = option.icon;
            const open = expandedConnectionId === option.id;

            if (option.kind === 'resource' && option.href) {
              return (
                <Link
                  key={option.id}
                  href={option.href}
                  className="group flex items-center gap-3 rounded-2xl border border-violet-100 bg-white p-4 transition hover:border-violet-300"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-brand-navy-700">{option.title}</span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-600">
                      {option.description}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-800">
                    {option.resourceLabel ?? 'Open'} <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            }

            return (
              <article key={option.id} className="rounded-2xl border border-violet-100 bg-white">
                <button
                  type="button"
                  onClick={() => onExpandedConnectionChange(open ? null : option.id)}
                  className="flex w-full items-start gap-3 p-4 text-left"
                  aria-expanded={open}
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-brand-navy-700">{option.title}</span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-600">
                      {option.description}
                    </span>
                  </span>
                  {open ? (
                    <ChevronUp className="mt-1 h-4 w-4 text-violet-700" />
                  ) : (
                    <ChevronDown className="mt-1 h-4 w-4 text-brand-muted-400" />
                  )}
                </button>

                {open && (
                  <div className="border-t border-violet-100 px-4 pb-4 pt-4">
                    {option.opener && (
                      <div className="rounded-xl bg-violet-50/70 px-3 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-700">
                          Possible opening
                        </p>
                        <p className="mt-1.5 text-[12.5px] leading-relaxed text-violet-950">
                          “{option.opener}”
                        </p>
                      </div>
                    )}
                    {option.questions?.length ? (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-brand-navy-700">Questions you may want to use</p>
                        <ul className="mt-2 space-y-2">
                          {option.questions.map((question) => (
                            <li key={question} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-brand-muted-700">
                              <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-600" />
                              {question}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {option.noteLabel && (
                      <label className="mt-4 block">
                        <span className="text-xs font-semibold text-brand-navy-700">{option.noteLabel}</span>
                        <textarea
                          value={workspace.connectionNotes[option.id] ?? ''}
                          onChange={(event) => onConnectionNoteChange(option.id, event.target.value)}
                          rows={3}
                          placeholder={option.notePlaceholder}
                          className="mt-2 w-full resize-none rounded-xl border border-surface-border bg-violet-50/35 px-3 py-2.5 text-[13px] leading-relaxed text-brand-navy-700 outline-none placeholder:text-brand-muted-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        />
                      </label>
                    )}
                    <p className="mt-3 text-[11px] text-brand-muted-500">Saved privately on this device.</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </AccordionStep>
    </section>
  );
}

function AccordionStep({
  number,
  title,
  label,
  description,
  accent,
  open,
  onToggle,
  children,
}: {
  number: string;
  title: string;
  label: string;
  description: string;
  accent: 'teal' | 'blue' | 'violet';
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const styles = {
    teal: {
      border: 'border-teal-200',
      header: 'bg-teal-50/65',
      circle: 'bg-teal-700 text-white',
      label: 'text-teal-800',
    },
    blue: {
      border: 'border-blue-200',
      header: 'bg-blue-50/55',
      circle: 'bg-blue-700 text-white',
      label: 'text-blue-800',
    },
    violet: {
      border: 'border-violet-200',
      header: 'bg-violet-50/55',
      circle: 'bg-violet-700 text-white',
      label: 'text-violet-800',
    },
  }[accent];

  return (
    <article className={cn('overflow-hidden rounded-3xl border bg-white shadow-soft', styles.border)}>
      <button
        type="button"
        onClick={onToggle}
        className={cn('flex w-full items-start gap-3 px-5 py-4 text-left sm:px-6', styles.header)}
        aria-expanded={open}
      >
        <span className={cn('inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold', styles.circle)}>
          {number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-brand-navy-700">{title}</span>
            <span className={cn('text-[11px] font-semibold', styles.label)}>{label}</span>
          </span>
          <span className="mt-1 block text-[12.5px] leading-relaxed text-brand-muted-600">
            {description}
          </span>
        </span>
        {open ? (
          <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-brand-muted-500" />
        ) : (
          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-brand-muted-500" />
        )}
      </button>
      {open && <div className="border-t border-inherit p-4 sm:p-5">{children}</div>}
    </article>
  );
}
