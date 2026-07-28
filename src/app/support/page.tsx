'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Brain,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Clock,
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

type SupportAction = {
  id: string;
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
};

type UnderstandingPrompt = {
  id: string;
  title: string;
  description: string;
};

type SupportDestination = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type ConcernProgress = {
  activeStep: GuideStep;
  savedActionIds: string[];
  understandingIds: string[];
  destinationIds: string[];
  helpful: boolean;
  needsClarity: boolean;
  lastTouched: string | null;
  updatedAt: string;
};

type ProgressByConcern = Record<string, ConcernProgress>;

const STACK_KEY = 'cg.parentSupport.concerns.v1';
const PROGRESS_KEY = 'cg.parentSupport.progress.v1';

const EMPTY_PROGRESS: ConcernProgress = {
  activeStep: 'stabilize',
  savedActionIds: [],
  understandingIds: [],
  destinationIds: [],
  helpful: false,
  needsClarity: false,
  lastTouched: null,
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
  const allowedStatuses: ConcernStatus[] = ['focus', 'connected', 'later'];
  const allowedCategories: ConcernCategory[] = [
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
        typeof item.status === 'string' && allowedStatuses.includes(item.status as ConcernStatus)
          ? (item.status as ConcernStatus)
          : 'later';
      const category =
        typeof item.category === 'string' &&
        allowedCategories.includes(item.category as ConcernCategory)
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

function readStoredProgress(): ProgressByConcern {
  if (typeof window === 'undefined') return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? (parsed as ProgressByConcern) : {};
  } catch {
    return {};
  }
}

function uniqueById<T extends { id: string }>(values: T[]) {
  return values.filter((value, index) => values.findIndex((item) => item.id === value.id) === index);
}

function getSupportModel(current: Concern, connected: Concern[]) {
  const connectedCategories = new Set(connected.map((concern) => concern.category));
  let actions: SupportAction[];
  let prompts: UnderstandingPrompt[];
  let destinations: SupportDestination[];

  switch (current.category) {
    case 'relationship':
      actions = [
        {
          id: 'relationship-reduce-pressure',
          title: 'Reduce immediate pressure',
          description: 'Choose one part of the issue instead of solving the whole relationship today.',
          detail: 'Write one sentence naming the specific moment, responsibility, or need that feels hardest right now.',
          icon: Target,
        },
        {
          id: 'relationship-calm-conversation',
          title: 'Prepare for a calmer conversation',
          description: 'Choose a time when both people are regulated and able to listen.',
          detail: 'Begin with what you are experiencing and what support would help, rather than trying to prove who is right.',
          icon: MessageCircle,
        },
        {
          id: 'relationship-protect-capacity',
          title: 'Care for your own capacity',
          description: 'Name what is draining you before deciding what conversation comes next.',
          detail: 'Consider whether you first need rest, practical relief, emotional support, or clearer information from the care team.',
          icon: Heart,
        },
        {
          id: 'relationship-shared-load',
          title: 'Clarify the shared load',
          description: 'Identify where responsibilities or expectations may feel uneven.',
          detail: 'Focus on one routine, task, or decision that could be made clearer this week.',
          icon: Users,
        },
      ];
      prompts = [
        {
          id: 'relationship-strain',
          title: 'What feels strained?',
          description: 'Communication, emotional connection, responsibilities, intimacy, finances, or decisions about care.',
        },
        {
          id: 'relationship-timing',
          title: 'When is it hardest?',
          description: 'Notice whether tension rises around transitions, difficult behavior, appointments, or exhaustion.',
        },
        {
          id: 'relationship-need',
          title: 'What do you need most?',
          description: 'Understanding, practical change, shared responsibility, reassurance, or outside support.',
        },
        {
          id: 'relationship-care-link',
          title: 'How is caregiving involved?',
          description: 'Consider whether unclear plans or unequal care responsibilities are adding pressure.',
        },
      ];
      destinations = [
        {
          id: 'talk-partner',
          title: 'Prepare a conversation with my partner',
          description: 'Use a calmer, one-topic conversation guide.',
          href: '/support/couples',
          icon: Users,
        },
        {
          id: 'relationship-bcba',
          title: 'Prepare questions for my BCBA',
          description: 'Clarify the home plan when care decisions are creating conflict.',
          href: '/support/care-plan',
          icon: ListChecks,
        },
        {
          id: 'relationship-caregiver',
          title: 'Explore caregiver support',
          description: 'Find support for anxiety, burnout, and personal capacity.',
          href: '/support/caregiver',
          icon: Heart,
        },
        {
          id: 'relationship-connect',
          title: 'Connect with support resources',
          description: 'Find people and services that fit what you need.',
          href: '/support/connect',
          icon: Link2,
        },
      ];
      break;
    case 'behavior':
      actions = [
        {
          id: 'behavior-safety',
          title: 'Start with immediate safety',
          description: 'Use the safety guidance already provided by the clinical team.',
          detail: 'If you cannot maintain safety, contact the appropriate clinical, medical, or emergency support instead of waiting.',
          icon: ShieldCheck,
        },
        {
          id: 'behavior-current-plan',
          title: 'Use the current plan',
          description: 'Do not invent a new consequence or strategy in the difficult moment.',
          detail: 'Keep the written guidance accessible and ask the BCBA to clarify the first one or two steps.',
          icon: ListChecks,
        },
        {
          id: 'behavior-short-language',
          title: 'Lower the response load',
          description: 'Use brief language and focus on the next safe action.',
          detail: 'Fewer words can make the response easier for both the parent and child to follow during a stressful moment.',
          icon: MessageCircle,
        },
        {
          id: 'behavior-recover',
          title: 'Plan for recovery afterward',
          description: 'Give yourself a brief pause before trying to solve the whole problem.',
          detail: 'Once everyone is safe, record what happened and identify what felt unclear or difficult to carry out.',
          icon: Heart,
        },
      ];
      prompts = [
        {
          id: 'behavior-before',
          title: 'What happened immediately before?',
          description: 'Describe the routine, request, transition, or change without guessing why it happened.',
        },
        {
          id: 'behavior-visible',
          title: 'What could you see or hear?',
          description: 'Use specific observable actions rather than broad labels.',
        },
        {
          id: 'behavior-response',
          title: 'How did the adults respond?',
          description: 'Note what was attempted and what felt difficult to use consistently.',
        },
        {
          id: 'behavior-change',
          title: 'What is changing over time?',
          description: 'Notice whether the concern is new, increasing, or becoming harder to manage safely.',
        },
      ];
      destinations = [
        {
          id: 'behavior-bcba',
          title: 'Prepare questions for my BCBA',
          description: 'Ask for modeling, written steps, and safety clarification.',
          href: '/support/care-plan',
          icon: ListChecks,
        },
        {
          id: 'behavior-home',
          title: 'Open at-home guides',
          description: 'Review approved practical guidance for home routines.',
          href: '/support/at-home',
          icon: BookOpen,
        },
        {
          id: 'behavior-caregiver',
          title: 'Support my own capacity',
          description: 'Address the emotional and physical cost of repeated difficult moments.',
          href: '/support/caregiver',
          icon: Heart,
        },
        {
          id: 'behavior-team',
          title: 'Connect with my support team',
          description: 'Reach the appropriate support when the current plan is unclear or unsafe.',
          href: '/support/connect',
          icon: Users,
        },
      ];
      break;
    case 'burnout':
      actions = [
        {
          id: 'burnout-one-demand',
          title: 'Remove one nonessential demand',
          description: 'A lower-capacity day should create a smaller plan, not more pressure.',
          detail: 'Choose one task that can wait, be simplified, or be shared with someone else.',
          icon: Target,
        },
        {
          id: 'burnout-specific-help',
          title: 'Ask for specific help',
          description: 'Name the kind of relief that would actually change today.',
          detail: 'Examples include listening, childcare relief, transportation, a meal, paperwork help, or quiet time.',
          icon: Users,
        },
        {
          id: 'burnout-recovery',
          title: 'Create a recovery window',
          description: 'Protect a short period that is not used to solve another problem.',
          detail: 'Choose something realistic enough to happen today, even if it is only a few uninterrupted minutes.',
          icon: Heart,
        },
        {
          id: 'burnout-one-question',
          title: 'Carry one question',
          description: 'Write down the one thing you most need clarified by the team.',
          detail: 'You do not need to remember every detail or solve every concern before asking for support.',
          icon: CircleHelp,
        },
      ];
      prompts = [
        {
          id: 'burnout-drain',
          title: 'What is draining the most energy?',
          description: 'Emotional strain, sleep, difficult behavior, appointments, work, isolation, or decision fatigue.',
        },
        {
          id: 'burnout-functioning',
          title: 'What is becoming harder to do?',
          description: 'Notice whether overwhelm is affecting sleep, work, relationships, health, or use of the home plan.',
        },
        {
          id: 'burnout-relief',
          title: 'What kind of relief would matter?',
          description: 'Clarify whether you need emotional support, practical help, clinical clarity, or professional care.',
        },
        {
          id: 'burnout-duration',
          title: 'How long has this felt unsustainable?',
          description: 'Persistent or worsening overwhelm may need support beyond a self-guided resource.',
        },
      ];
      destinations = [
        {
          id: 'burnout-caregiver',
          title: 'Explore caregiver support',
          description: 'Find tools for capacity, identity, and emotional well-being.',
          href: '/support/caregiver',
          icon: Heart,
        },
        {
          id: 'burnout-mental-health',
          title: 'Open the Mental Health Toolbox',
          description: 'Review approved support and professional-care options.',
          href: '/support/mental-health',
          icon: Brain,
        },
        {
          id: 'burnout-connect',
          title: 'Find human support',
          description: 'Connect with people, community resources, or practical help.',
          href: '/support/connect',
          icon: Users,
        },
        {
          id: 'burnout-bcba',
          title: 'Make the home plan more realistic',
          description: 'Prepare questions about implementation barriers and parent training.',
          href: '/support/care-plan',
          icon: ListChecks,
        },
      ];
      break;
    default:
      actions = [
        {
          id: 'general-one-part',
          title: 'Choose one part to carry',
          description: 'Focus on the part that would make the biggest difference today.',
          detail: 'The other concerns remain in your stack, so choosing one focus does not mean forgetting the rest.',
          icon: Target,
        },
        {
          id: 'general-name-need',
          title: 'Name the support you need',
          description: 'Decide whether you need information, relief, a conversation, or professional support.',
          detail: 'A specific support request is easier for another person or team to respond to.',
          icon: CircleHelp,
        },
        {
          id: 'general-one-question',
          title: 'Write one important question',
          description: 'Capture it now so you do not have to hold it in your head.',
          detail: 'Your saved question can travel with you into the next conversation or resource.',
          icon: MessageCircle,
        },
        {
          id: 'general-protect-capacity',
          title: 'Protect your capacity',
          description: 'Make the next action small enough to be realistic today.',
          detail: 'Support should lower the burden of the concern, not create another assignment.',
          icon: Heart,
        },
      ];
      prompts = [
        {
          id: 'general-hardest',
          title: 'What feels hardest?',
          description: 'Identify the specific part of the situation that is creating the most pressure.',
        },
        {
          id: 'general-pattern',
          title: 'When does it affect you most?',
          description: 'Notice the times, routines, people, or decisions connected to the concern.',
        },
        {
          id: 'general-tried',
          title: 'What have you already tried?',
          description: 'Record what helped, what did not, and what was too difficult to sustain.',
        },
        {
          id: 'general-support',
          title: 'What support would change the situation?',
          description: 'Clarify the next conversation, resource, or person that may be appropriate.',
        },
      ];
      destinations = [
        {
          id: 'general-resources',
          title: 'Explore the resource library',
          description: 'Find approved support organized around common parent needs.',
          href: '/support/resources',
          icon: BookOpen,
        },
        {
          id: 'general-caregiver',
          title: 'Support my well-being',
          description: 'Choose support that addresses the impact on you.',
          href: '/support/caregiver',
          icon: Heart,
        },
        {
          id: 'general-bcba',
          title: 'Prepare for my BCBA',
          description: 'Turn the concern into useful questions when clinical support is relevant.',
          href: '/support/care-plan',
          icon: ListChecks,
        },
        {
          id: 'general-connect',
          title: 'Connect to the right support',
          description: 'Find people, services, and next-step guidance.',
          href: '/support/connect',
          icon: Users,
        },
      ];
  }

  if (connectedCategories.has('burnout') && current.category !== 'burnout') {
    actions = uniqueById([
      ...actions.slice(0, 3),
      {
        id: 'merged-protect-capacity',
        title: 'Protect your capacity too',
        description: 'The connected burnout concern deserves support alongside the current focus.',
        detail: 'Choose a next action that is realistic for your current energy instead of adding another burden.',
        icon: Heart,
      },
    ]).slice(0, 4);
  }

  if (connectedCategories.has('behavior') && current.category === 'relationship') {
    actions = uniqueById([
      actions[0],
      {
        id: 'merged-separate-crisis',
        title: 'Separate the crisis from the disagreement',
        description: 'Handle immediate safety first, then discuss caregiver differences later.',
        detail: 'A difficult moment is usually not the best time to settle disagreements about the home response.',
        icon: ShieldCheck,
      },
      ...actions.slice(1),
    ]).slice(0, 4);
  }

  return { actions, prompts, destinations };
}

function buildInsight(current: Concern, connected: Concern[]) {
  const categories = new Set([current.category, ...connected.map((concern) => concern.category)]);
  if (categories.has('relationship') && categories.has('behavior') && categories.has('burnout')) {
    return {
      title: 'These concerns may be reinforcing one another.',
      body: 'Difficult moments at home can drain your capacity, and exhaustion can make communication with your partner harder. We will focus on one pressure point while keeping the others visible.',
    };
  }
  if (categories.has('behavior') && categories.has('burnout')) {
    return {
      title: 'The home concern and caregiver exhaustion appear connected.',
      body: 'Preparing for difficult moments and protecting your capacity may need to happen together. The guide will keep both needs in view without asking you to solve everything at once.',
    };
  }
  if (categories.has('aba') && categories.has('relationship')) {
    return {
      title: 'Unclear care expectations may be adding relationship pressure.',
      body: 'The guide can help you prepare a partner conversation while also identifying what should be clarified with the BCBA.',
    };
  }
  if (connected.length) {
    return {
      title: 'Your concerns appear connected.',
      body: `We will focus on “${current.title}” while keeping ${connected.length === 1 ? 'the connected concern' : `${connected.length} connected concerns`} in the background so important context is not lost.`,
    };
  }
  return {
    title: 'One focus can create a clearer next step.',
    body: 'You can add other concerns at any time. Common Ground will keep them saved and help you decide which one needs attention first.',
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
  const [progressByConcern, setProgressByConcern] = useState<ProgressByConcern>({});
  const [showComposer, setShowComposer] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftConcern, setDraftConcern] = useState('');
  const [draftStatus, setDraftStatus] = useState<ConcernStatus>('connected');
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);

  useEffect(() => {
    const loadedPlan = loadCarePlan();
    const stored = readStoredStack();
    setPlan(loadedPlan);
    setConcerns(stored.length ? stored : deriveConcerns(loadedPlan));
    setProgressByConcern(readStoredProgress());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STACK_KEY, JSON.stringify(concerns));
    } catch {
      // The page still works if device storage is unavailable.
    }
  }, [concerns, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressByConcern));
    } catch {
      // The page still works if device storage is unavailable.
    }
  }, [hydrated, progressByConcern]);

  const currentConcern = concerns.find((concern) => concern.status === 'focus') ?? null;
  const connectedConcerns = concerns.filter((concern) => concern.status === 'connected');
  const savedConcerns = concerns.filter((concern) => concern.status === 'later');
  const currentProgress = currentConcern
    ? progressByConcern[currentConcern.id] ?? EMPTY_PROGRESS
    : EMPTY_PROGRESS;
  const model = useMemo(
    () => (currentConcern ? getSupportModel(currentConcern, connectedConcerns) : null),
    [connectedConcerns, currentConcern],
  );
  const insight = useMemo(
    () => (currentConcern ? buildInsight(currentConcern, connectedConcerns) : null),
    [connectedConcerns, currentConcern],
  );

  const updateCurrentProgress = useCallback(
    (updater: (current: ConcernProgress) => ConcernProgress) => {
      if (!currentConcern) return;
      setProgressByConcern((current) => {
        const previous = current[currentConcern.id] ?? EMPTY_PROGRESS;
        return {
          ...current,
          [currentConcern.id]: updater(previous),
        };
      });
    },
    [currentConcern],
  );

  const setActiveStep = (step: GuideStep) => {
    updateCurrentProgress((current) => ({
      ...current,
      activeStep: step,
      updatedAt: new Date().toISOString(),
    }));
    setExpandedActionId(null);
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
    setExpandedActionId(null);
  };

  const setConcernStatus = (id: string, status: ConcernStatus) => {
    if (status === 'focus') {
      setFocus(id);
      return;
    }
    setConcerns((current) =>
      current.map((concern) =>
        concern.id === id
          ? { ...concern, status, updatedAt: new Date().toISOString() }
          : concern,
      ),
    );
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
            ? {
                ...concern,
                title: title.slice(0, 240),
                category: inferCategory(title),
                updatedAt: now,
              }
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

  const toggleSavedAction = (action: SupportAction) => {
    updateCurrentProgress((current) => {
      const selected = current.savedActionIds.includes(action.id);
      return {
        ...current,
        savedActionIds: selected
          ? current.savedActionIds.filter((id) => id !== action.id)
          : [...current.savedActionIds, action.id],
        lastTouched: action.title,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const toggleUnderstanding = (prompt: UnderstandingPrompt) => {
    updateCurrentProgress((current) => {
      const selected = current.understandingIds.includes(prompt.id);
      return {
        ...current,
        understandingIds: selected
          ? current.understandingIds.filter((id) => id !== prompt.id)
          : [...current.understandingIds, prompt.id],
        lastTouched: prompt.title,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const toggleDestination = (destination: SupportDestination) => {
    updateCurrentProgress((current) => {
      const selected = current.destinationIds.includes(destination.id);
      return {
        ...current,
        destinationIds: selected
          ? current.destinationIds.filter((id) => id !== destination.id)
          : [...current.destinationIds, destination.id],
        lastTouched: destination.title,
        updatedAt: new Date().toISOString(),
      };
    });
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

  const stepProgress = [
    currentProgress.savedActionIds.length > 0,
    currentProgress.understandingIds.length > 0,
    currentProgress.destinationIds.length > 0,
  ];
  const startedCount = stepProgress.filter(Boolean).length;
  const selectedDestinations = model?.destinations.filter((destination) =>
    currentProgress.destinationIds.includes(destination.id),
  ) ?? [];

  return (
    <div className="page-shell gap-6 sm:gap-8">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Parent support
          </p>
          <h1 className="mt-2 text-balance text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
            You&rsquo;re not alone. We&rsquo;ll help you take the next right step.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-brand-muted-600">
            You may have several concerns at once. Common Ground helps you focus on one while
            keeping the others connected, saved, and supported.
          </p>
        </div>
        {currentConcern && (
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-brand-muted-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Last updated {new Date(currentConcern.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <a
              href="#concern-stack"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-3 py-2 font-semibold text-primary hover:bg-brand-navy-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Return to concern stack
            </a>
          </div>
        )}
      </section>

      <section id="concern-stack" className="scroll-mt-24">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-brand-navy-700">Your Concern Stack</h2>
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-surface-border text-[11px] text-brand-muted-500"
                title="All concerns stay available. One remains the current focus."
              >
                i
              </span>
            </div>
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
                        <Bookmark className="h-3.5 w-3.5" />
                      )}
                      {concern.status === 'focus'
                        ? 'Working on this now'
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
              Add your first concern in your own words. Common Ground will organize it into a
              calm, structured support path.
            </p>
            <button type="button" onClick={openAddConcern} className="btn-primary mt-5">
              <Plus className="h-4 w-4" /> Add my first concern
            </button>
            {!plan && (
              <p className="mt-4 text-[12px] text-brand-muted-500">
                You can also{' '}
                <Link href="/support/intake" className="font-semibold text-primary hover:underline">
                  build a full Parent Care Guide
                </Link>
                .
              </p>
            )}
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
              <button
                type="button"
                onClick={() => setDraftStatus('connected')}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold',
                  draftStatus === 'connected'
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                    : 'border-surface-border bg-white text-brand-muted-600',
                )}
              >
                Connect to current focus
              </button>
              <button
                type="button"
                onClick={() => setDraftStatus('later')}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold',
                  draftStatus === 'later'
                    ? 'border-brand-muted-300 bg-brand-muted-100 text-brand-muted-800'
                    : 'border-surface-border bg-white text-brand-muted-600',
                )}
              >
                Save for later
              </button>
              <button
                type="button"
                onClick={() => setDraftStatus('focus')}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold',
                  draftStatus === 'focus'
                    ? 'border-teal-300 bg-teal-50 text-teal-800'
                    : 'border-surface-border bg-white text-brand-muted-600',
                )}
              >
                Make this my focus
              </button>
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
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-teal-950">Smart Insight: {insight.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-teal-950/75">{insight.body}</p>
                </div>
              </div>
              <div className="border-teal-200 text-[12px] leading-relaxed text-teal-950/75 lg:border-l lg:pl-5">
                We will work on your current focus while the connected concerns remain visible in
                the background.
                <button
                  type="button"
                  onClick={() => setActiveStep('understand')}
                  className="mt-2 block font-semibold text-teal-800 hover:underline"
                >
                  See how they connect
                </button>
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-3">
              <GuideAccordion
                activeStep={currentProgress.activeStep}
                model={model}
                progress={currentProgress}
                expandedActionId={expandedActionId}
                onExpandedActionChange={setExpandedActionId}
                onStepChange={setActiveStep}
                onToggleAction={toggleSavedAction}
                onToggleUnderstanding={toggleUnderstanding}
                onToggleDestination={toggleDestination}
                onHelpful={() =>
                  updateCurrentProgress((current) => ({
                    ...current,
                    helpful: !current.helpful,
                    needsClarity: false,
                    updatedAt: new Date().toISOString(),
                  }))
                }
                onNeedsClarity={() =>
                  updateCurrentProgress((current) => ({
                    ...current,
                    needsClarity: !current.needsClarity,
                    helpful: false,
                    updatedAt: new Date().toISOString(),
                  }))
                }
              />

              <section className="rounded-3xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Where this can lead
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-brand-navy-700">
                      Next support options based on your connected concerns
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveStep('connect')}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Open Connect
                  </button>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {model.destinations.map((destination) => {
                    const Icon = destination.icon;
                    return (
                      <Link
                        key={destination.id}
                        href={destination.href}
                        className="group flex items-center gap-3 rounded-2xl border border-surface-border bg-brand-warm-50/60 p-4 transition hover:border-primary/30 hover:bg-white"
                      >
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-brand-navy-700">
                            {destination.title}
                          </span>
                          <span className="mt-0.5 block text-[12px] leading-relaxed text-brand-muted-500">
                            {destination.description}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 text-brand-muted-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
              <section className="rounded-3xl border border-surface-border bg-white p-5 shadow-soft">
                <p className="text-sm font-semibold text-brand-navy-700">Your progress</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-warm-100">
                    <div
                      className="absolute inset-1 rounded-full"
                      style={{
                        background: `conic-gradient(#0f766e ${(startedCount / 3) * 360}deg, #e8e6ef 0deg)`,
                      }}
                    />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-navy-700">
                      {startedCount}/3
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-brand-navy-700">
                      {startedCount === 0
                        ? 'Start with one small action'
                        : startedCount === 3
                          ? 'All three areas started'
                          : `${startedCount} of 3 areas started`}
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-500">
                      Progress reflects support you saved, not homework you must finish.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-surface-border bg-white p-5 shadow-soft">
                <p className="text-sm font-semibold text-brand-navy-700">Resume where you left off</p>
                <div className="mt-3 rounded-2xl border border-surface-border bg-brand-warm-50 p-4">
                  <p className="text-[13px] font-semibold text-brand-navy-700">
                    {currentProgress.lastTouched ?? 'Begin with Stabilize'}
                  </p>
                  <p className="mt-1 text-[11px] text-brand-muted-500">
                    {currentProgress.updatedAt
                      ? `Updated ${new Date(currentProgress.updatedAt).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}`
                      : 'Your place will be saved on this device.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveStep(currentProgress.activeStep)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-white px-3 py-2 text-xs font-semibold text-primary hover:bg-brand-navy-50"
                  >
                    Continue <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </section>

              <section className="rounded-3xl border border-surface-border bg-white p-5 shadow-soft">
                <p className="text-sm font-semibold text-brand-navy-700">Your support plan</p>
                <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-500">
                  Items you chose to keep for this concern.
                </p>
                <div className="mt-4 space-y-2.5">
                  {currentProgress.savedActionIds.length || selectedDestinations.length ? (
                    <>
                      {model.actions
                        .filter((action) => currentProgress.savedActionIds.includes(action.id))
                        .slice(0, 3)
                        .map((action) => (
                          <p key={action.id} className="flex items-start gap-2 text-[12px] text-brand-muted-700">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-700" />
                            {action.title}
                          </p>
                        ))}
                      {selectedDestinations.slice(0, 2).map((destination) => (
                        <p key={destination.id} className="flex items-start gap-2 text-[12px] text-brand-muted-700">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-700" />
                          {destination.title}
                        </p>
                      ))}
                    </>
                  ) : (
                    <p className="rounded-2xl bg-brand-warm-50 px-3 py-3 text-[12px] leading-relaxed text-brand-muted-500">
                      Save an action or support option when something feels useful.
                    </p>
                  )}
                </div>
                <Link
                  href="/support/care-plan"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                >
                  Open my Parent Care Guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
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
  progress,
  expandedActionId,
  onExpandedActionChange,
  onStepChange,
  onToggleAction,
  onToggleUnderstanding,
  onToggleDestination,
  onHelpful,
  onNeedsClarity,
}: {
  activeStep: GuideStep;
  model: ReturnType<typeof getSupportModel>;
  progress: ConcernProgress;
  expandedActionId: string | null;
  onExpandedActionChange: (id: string | null) => void;
  onStepChange: (step: GuideStep) => void;
  onToggleAction: (action: SupportAction) => void;
  onToggleUnderstanding: (prompt: UnderstandingPrompt) => void;
  onToggleDestination: (destination: SupportDestination) => void;
  onHelpful: () => void;
  onNeedsClarity: () => void;
}) {
  return (
    <section className="space-y-3" aria-label="Parent support guide steps">
      <AccordionStep
        number="1"
        title="Stabilize"
        label="What may help now"
        description="Reduce immediate pressure and create enough space to choose the next action."
        accent="teal"
        open={activeStep === 'stabilize'}
        status={progress.savedActionIds.length ? 'In progress' : 'Start here'}
        onToggle={() => onStepChange('stabilize')}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {model.actions.map((action) => {
            const Icon = action.icon;
            const saved = progress.savedActionIds.includes(action.id);
            const expanded = expandedActionId === action.id;
            return (
              <article key={action.id} className="rounded-2xl border border-teal-100 bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-brand-navy-700">{action.title}</h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">
                      {action.description}
                    </p>
                  </div>
                </div>
                {expanded && (
                  <p className="mt-3 rounded-xl bg-teal-50 px-3 py-2.5 text-[12px] leading-relaxed text-teal-950">
                    {action.detail}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onExpandedActionChange(expanded ? null : action.id)}
                    className="text-xs font-semibold text-teal-800 hover:underline"
                  >
                    {expanded ? 'Show less' : 'Open step'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleAction(action)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold',
                      saved
                        ? 'border-teal-300 bg-teal-50 text-teal-800'
                        : 'border-surface-border bg-white text-brand-muted-600 hover:border-teal-300',
                    )}
                  >
                    {saved ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {saved ? 'Saved' : 'Add to my plan'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-teal-100 pt-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onHelpful}
              className={cn(
                'rounded-xl border px-3 py-2 text-xs font-semibold',
                progress.helpful
                  ? 'border-teal-300 bg-teal-50 text-teal-800'
                  : 'border-surface-border bg-white text-brand-muted-600',
              )}
            >
              This helps
            </button>
            <button
              type="button"
              onClick={onNeedsClarity}
              className={cn(
                'rounded-xl border px-3 py-2 text-xs font-semibold',
                progress.needsClarity
                  ? 'border-amber-300 bg-amber-50 text-amber-900'
                  : 'border-surface-border bg-white text-brand-muted-600',
              )}
            >
              I need clearer steps
            </button>
          </div>
          <button
            type="button"
            onClick={() => onStepChange('understand')}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Continue to Understand <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {progress.needsClarity && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[12px] leading-relaxed text-amber-950">
            Keep the guide focused on one action. Save the item that feels closest, then use
            Connect to request modeling, written steps, or professional support.
          </div>
        )}
      </AccordionStep>

      <AccordionStep
        number="2"
        title="Understand"
        label="Understand the concern"
        description="Clarify what feels hardest, what is connected, and what kind of support may help."
        accent="blue"
        open={activeStep === 'understand'}
        status={progress.understandingIds.length ? 'In progress' : 'Not started'}
        onToggle={() => onStepChange('understand')}
      >
        <p className="mb-4 text-[13px] leading-relaxed text-brand-muted-600">
          Choose the prompts that would help you organize the concern. You are not diagnosing the
          situation; you are identifying what deserves attention.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {model.prompts.map((prompt) => {
            const selected = progress.understandingIds.includes(prompt.id);
            return (
              <button
                key={prompt.id}
                type="button"
                onClick={() => onToggleUnderstanding(prompt)}
                aria-pressed={selected}
                className={cn(
                  'flex items-start gap-3 rounded-2xl border p-4 text-left transition',
                  selected
                    ? 'border-blue-300 bg-blue-50/70'
                    : 'border-surface-border bg-white hover:border-blue-200',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                    selected
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-surface-border text-transparent',
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-brand-navy-700">{prompt.title}</span>
                  <span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-600">
                    {prompt.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end border-t border-blue-100 pt-4">
          <button
            type="button"
            onClick={() => onStepChange('connect')}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Continue to Connect <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </AccordionStep>

      <AccordionStep
        number="3"
        title="Connect"
        label="Choose the right support"
        description="Move toward the right person, resource, or conversation for this concern."
        accent="violet"
        open={activeStep === 'connect'}
        status={progress.destinationIds.length ? 'Support selected' : 'Not started'}
        onToggle={() => onStepChange('connect')}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {model.destinations.map((destination) => {
            const Icon = destination.icon;
            const selected = progress.destinationIds.includes(destination.id);
            return (
              <article
                key={destination.id}
                className={cn(
                  'rounded-2xl border p-4 transition',
                  selected
                    ? 'border-violet-300 bg-violet-50/70'
                    : 'border-surface-border bg-white',
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-brand-navy-700">{destination.title}</h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">
                      {destination.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleDestination(destination)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold',
                      selected
                        ? 'border-violet-300 bg-violet-50 text-violet-800'
                        : 'border-surface-border bg-white text-brand-muted-600',
                    )}
                  >
                    {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    {selected ? 'Added to plan' : 'Add to plan'}
                  </button>
                  <Link
                    href={destination.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-800 hover:underline"
                  >
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-violet-100 pt-4">
          <a href="#concern-stack" className="text-xs font-semibold text-brand-muted-600 hover:underline">
            Return to concern stack
          </a>
          <Link
            href="/support/care-plan"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"
          >
            Open my Parent Care Guide <ArrowRight className="h-4 w-4" />
          </Link>
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
  status,
  onToggle,
  children,
}: {
  number: string;
  title: string;
  label: string;
  description: string;
  accent: 'teal' | 'blue' | 'violet';
  open: boolean;
  status: string;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const theme = {
    teal: {
      border: 'border-teal-200',
      header: 'bg-teal-50/65',
      number: 'bg-teal-700 text-white',
      badge: 'border-teal-200 bg-white text-teal-800',
    },
    blue: {
      border: 'border-blue-200',
      header: 'bg-blue-50/60',
      number: 'bg-blue-700 text-white',
      badge: 'border-blue-200 bg-white text-blue-800',
    },
    violet: {
      border: 'border-violet-200',
      header: 'bg-violet-50/60',
      number: 'bg-violet-700 text-white',
      badge: 'border-violet-200 bg-white text-violet-800',
    },
  }[accent];

  return (
    <article className={cn('overflow-hidden rounded-3xl border bg-white shadow-soft', theme.border)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5',
          open ? theme.header : 'bg-white',
        )}
      >
        <span
          className={cn(
            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold',
            theme.number,
          )}
        >
          {number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-brand-navy-700">{title}</span>
            <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-semibold', theme.badge)}>
              {status}
            </span>
          </span>
          <span className="mt-0.5 block text-[12px] leading-relaxed text-brand-muted-500">
            <span className="font-semibold text-brand-muted-700">{label}.</span> {description}
          </span>
        </span>
        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-brand-muted-500" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-brand-muted-500" />
        )}
      </button>
      {open && <div className="border-t border-inherit p-4 sm:p-5">{children}</div>}
    </article>
  );
}