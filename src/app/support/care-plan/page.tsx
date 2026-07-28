'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Heart,
  HeartHandshake,
  LifeBuoy,
  ListChecks,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type StepNumber = 1 | 2 | 3;
type ParentFocus =
  | 'overwhelmed'
  | 'exhausted'
  | 'relationship'
  | 'isolated'
  | 'aba'
  | 'child-concern';
type SupportNeed = 'steady' | 'clarity' | 'connection' | 'practical' | 'conversation';

type FocusOption = {
  id: ParentFocus;
  label: string;
  shortLabel: string;
  description: string;
};

type SupportAction = {
  id: string;
  title: string;
  description: string;
  detail: string;
};

type ConnectionOption = {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: typeof Heart;
  accent: string;
};

const FOCUS_OPTIONS: FocusOption[] = [
  {
    id: 'overwhelmed',
    label: 'I feel overwhelmed',
    shortLabel: 'Overwhelmed',
    description: 'There is too much to hold at once, and I need the load to feel smaller.',
  },
  {
    id: 'exhausted',
    label: 'I feel exhausted',
    shortLabel: 'Exhausted',
    description: 'My energy is low, and I need support that does not create another demand.',
  },
  {
    id: 'relationship',
    label: 'A relationship feels strained',
    shortLabel: 'Relationship strain',
    description: 'Stress at home is affecting communication, connection, or shared responsibilities.',
  },
  {
    id: 'isolated',
    label: 'I feel alone in this',
    shortLabel: 'Feeling isolated',
    description: 'I need connection with someone who can listen, understand, or help.',
  },
  {
    id: 'aba',
    label: 'I do not understand part of ABA',
    shortLabel: 'Understanding ABA',
    description: 'I need clearer information before I can feel confident about what comes next.',
  },
  {
    id: 'child-concern',
    label: 'I have a concern about my child',
    shortLabel: 'Child-related concern',
    description: 'I need help preparing to bring a concern to my child\'s BCBA or clinical team.',
  },
];

const SUPPORT_NEEDS: Array<{ id: SupportNeed; label: string; description: string }> = [
  {
    id: 'steady',
    label: 'Feel steadier',
    description: 'Reduce the immediate emotional pressure before deciding what to do next.',
  },
  {
    id: 'clarity',
    label: 'Get clearer information',
    description: 'Understand one issue, process, or expectation more clearly.',
  },
  {
    id: 'connection',
    label: 'Feel less alone',
    description: 'Connect with a trusted person, another parent, or professional support.',
  },
  {
    id: 'practical',
    label: 'Get practical help',
    description: 'Identify one form of relief or assistance that would make today more manageable.',
  },
  {
    id: 'conversation',
    label: 'Prepare a conversation',
    description: 'Organize what matters before speaking with a partner, BCBA, or support person.',
  },
];

const ACTIONS_BY_FOCUS: Record<ParentFocus, SupportAction[]> = {
  overwhelmed: [
    {
      id: 'overwhelmed-one-thing',
      title: 'Choose only one thing to carry right now',
      description: 'The rest can stay here without being solved today.',
      detail: 'Choose the concern that would make the biggest difference if it felt even slightly lighter. You are not dismissing the other concerns; you are reducing the number of decisions in front of you.',
    },
    {
      id: 'overwhelmed-lower-demand',
      title: 'Lower one nonessential demand',
      description: 'A hard day can have a smaller plan.',
      detail: 'Identify one task that can wait, be simplified, or be shared. Support should lower the load rather than add another assignment.',
    },
    {
      id: 'overwhelmed-human-help',
      title: 'Choose one person or resource',
      description: 'You do not have to build the whole solution alone.',
      detail: 'Decide whether you need someone to listen, practical help, clearer information, or professional support. Connect will help you choose the right destination.',
    },
  ],
  exhausted: [
    {
      id: 'exhausted-protect-energy',
      title: 'Protect a small recovery window',
      description: 'Choose something realistic enough to happen today.',
      detail: 'A recovery window can be brief. The goal is not perfect self-care; it is a short period that is not used to complete another task or solve another problem.',
    },
    {
      id: 'exhausted-specific-relief',
      title: 'Identify the relief that would matter most',
      description: 'Different kinds of exhaustion need different support.',
      detail: 'Consider whether you need sleep, quiet, emotional support, childcare relief, food, transportation, help with paperwork, or clearer expectations from the care team.',
    },
    {
      id: 'exhausted-professional',
      title: 'Notice when self-guided support is not enough',
      description: 'Persistent exhaustion deserves real support.',
      detail: 'If exhaustion is worsening, lasting, or affecting your ability to function, Connect can take you to approved mental-health and human-support resources.',
    },
  ],
  relationship: [
    {
      id: 'relationship-pause',
      title: 'Separate the stressful moment from the conversation',
      description: 'The hardest moment may not be the best time to solve the disagreement.',
      detail: 'Handle immediate needs first. Choose a calmer time to discuss one specific pressure point rather than trying to resolve the entire relationship at once.',
    },
    {
      id: 'relationship-one-topic',
      title: 'Choose one topic',
      description: 'Narrow the conversation to something both people can understand.',
      detail: 'Focus on one routine, responsibility, communication issue, or decision. A focused conversation is easier to enter than a conversation about everything that feels wrong.',
    },
    {
      id: 'relationship-support',
      title: 'Decide what support belongs outside the relationship',
      description: 'Not every pressure should be solved only by the two of you.',
      detail: 'Some concerns may need clearer BCBA guidance, caregiver support, individual therapy, couples support, or practical help from another person.',
    },
  ],
  isolated: [
    {
      id: 'isolated-one-connection',
      title: 'Choose one safe connection',
      description: 'Connection can begin with one person, not a whole community.',
      detail: 'Think about the person most likely to listen without immediately judging, fixing, or minimizing what you are carrying.',
    },
    {
      id: 'isolated-name-support',
      title: 'Choose the kind of connection you need',
      description: 'Listening, shared experience, and practical help are different needs.',
      detail: 'You may need another parent who understands, a trusted friend, a faith community, a therapist, or practical help from someone close to you.',
    },
    {
      id: 'isolated-community',
      title: 'Use an existing support pathway',
      description: 'Common Ground can help you find a starting point.',
      detail: 'Connect will show parent connection, mental-health, and local-resource options without requiring you to explain everything again here.',
    },
  ],
  aba: [
    {
      id: 'aba-one-question',
      title: 'Reduce the confusion to one question',
      description: 'You do not need to understand every part of ABA at once.',
      detail: 'Choose the one term, recommendation, or expectation that is preventing you from feeling prepared. Connect will help you bring that question to the BCBA.',
    },
    {
      id: 'aba-approved-info',
      title: 'Start with approved plain-language information',
      description: 'Use existing Common Ground education before searching everywhere online.',
      detail: 'The Understanding ABA section explains core ideas in parent-friendly language and can help you decide what still needs clarification from the clinical team.',
    },
    {
      id: 'aba-demonstration',
      title: 'Ask for explanation, modeling, or written steps',
      description: 'Understanding often requires more than hearing something once.',
      detail: 'It is appropriate to ask the BCBA to explain the purpose, demonstrate what they mean, watch you practice, or provide a shorter written version.',
    },
  ],
  'child-concern': [
    {
      id: 'child-current-plan',
      title: 'Use the current clinical or safety plan',
      description: 'This page should not invent a new response for your child.',
      detail: 'Follow guidance already provided by the clinical team. If the current plan is unclear, difficult to use, or no longer fits what is happening, Connect will help you prepare questions for the BCBA.',
    },
    {
      id: 'child-observable',
      title: 'Keep the concern concrete',
      description: 'Describe what you can see or hear without diagnosing why it happens.',
      detail: 'Useful information may include what happened, when it tends to occur, what changed, what adults tried, and what felt difficult or unsafe.',
    },
    {
      id: 'child-bcba',
      title: 'Bring the concern to the BCBA',
      description: 'The clinical team should guide child-specific recommendations.',
      detail: 'Use the predefined questions in Connect to ask for clarification, demonstration, written steps, or an earlier conversation when the concern is changing or becoming harder to manage.',
    },
  ],
};

const BCBA_QUESTIONS = [
  'What should I focus on first when this concern comes up at home?',
  'Can you explain the current recommendation in plain language?',
  'Can you demonstrate the response and watch me practice it?',
  'Can you give both caregivers the same short written steps?',
  'What information would be most useful for me to notice and bring back?',
  'What changes or safety concerns should lead me to contact you before our next meeting?',
];

function getConnections(focus: ParentFocus, need: SupportNeed | null): ConnectionOption[] {
  const options: ConnectionOption[] = [];

  if (focus === 'child-concern' || focus === 'aba' || need === 'conversation') {
    options.push({
      title: 'Prepare for my BCBA conversation',
      description: 'Choose from approved questions without entering identifying clinical details.',
      href: '#bcba-questions',
      label: 'Choose BCBA questions',
      icon: ListChecks,
      accent: 'text-violet-700 bg-violet-50',
    });
  }

  if (focus === 'relationship') {
    options.push({
      title: 'Marriage & Relationships',
      description: 'Open parent-centered relationship support and conversation guidance.',
      href: '/support/couples',
      label: 'Open relationship support',
      icon: HeartHandshake,
      accent: 'text-rose-700 bg-rose-50',
    });
  }

  if (focus === 'overwhelmed' || focus === 'exhausted' || need === 'steady') {
    options.push({
      title: 'Mental Health Toolbox',
      description: 'Find approved tools for overwhelm, stress, and emotional support.',
      href: '/support/mental-health',
      label: 'Open the toolbox',
      icon: Brain,
      accent: 'text-teal-700 bg-teal-50',
    });
  }

  if (focus === 'isolated' || need === 'connection') {
    options.push({
      title: 'Parent Connection',
      description: 'Explore ways to connect with other parents and supportive people.',
      href: '/support/connect',
      label: 'Find connection',
      icon: Users,
      accent: 'text-blue-700 bg-blue-50',
    });
  }

  if (focus === 'aba') {
    options.push({
      title: 'Understanding ABA',
      description: 'Review approved explanations written for parents and caregivers.',
      href: '/support/what-is-aba',
      label: 'Learn in plain language',
      icon: BookOpen,
      accent: 'text-indigo-700 bg-indigo-50',
    });
  }

  if (focus === 'child-concern') {
    options.push({
      title: 'At Home Strategies',
      description: 'Review existing approved home-support resources while your BCBA guides child-specific care.',
      href: '/support/at-home',
      label: 'Open approved guides',
      icon: ShieldCheck,
      accent: 'text-emerald-700 bg-emerald-50',
    });
  }

  if (need === 'practical') {
    options.push({
      title: 'Resource Hub',
      description: 'Find practical, financial, local, and family-support resources.',
      href: '/support/resources',
      label: 'Browse resources',
      icon: CircleHelp,
      accent: 'text-amber-700 bg-amber-50',
    });
  }

  if (options.length < 3) {
    options.push({
      title: 'Caregiver Support',
      description: 'Choose support that focuses on your capacity and well-being.',
      href: '/support/caregiver',
      label: 'Open caregiver support',
      icon: Heart,
      accent: 'text-pink-700 bg-pink-50',
    });
  }

  if (options.length < 3) {
    options.push({
      title: 'Resource Hub',
      description: 'Explore approved Common Ground support organized by parent need.',
      href: '/support/resources',
      label: 'Browse resources',
      icon: BookOpen,
      accent: 'text-amber-700 bg-amber-50',
    });
  }

  return options.slice(0, 4);
}

export default function FamilyCarePlanPage() {
  const [activeStep, setActiveStep] = useState<StepNumber>(1);
  const [focus, setFocus] = useState<ParentFocus>('overwhelmed');
  const [supportNeed, setSupportNeed] = useState<SupportNeed | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const focusOption = FOCUS_OPTIONS.find((option) => option.id === focus) ?? FOCUS_OPTIONS[0];
  const actions = ACTIONS_BY_FOCUS[focus];
  const connections = useMemo(() => getConnections(focus, supportNeed), [focus, supportNeed]);
  const selectedActionDetail = actions.find((action) => action.id === selectedAction) ?? null;

  function selectFocus(nextFocus: ParentFocus) {
    setFocus(nextFocus);
    setSelectedAction(null);
    setSupportNeed(null);
    setSelectedQuestions([]);
  }

  function toggleQuestion(question: string) {
    setSelectedQuestions((current) =>
      current.includes(question)
        ? current.filter((item) => item !== question)
        : [...current, question],
    );
  }

  return (
    <div className="page-shell gap-6 sm:gap-8">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-stretch">
        <div className="rounded-[1.75rem] border border-primary/15 bg-gradient-to-br from-brand-plum-50/80 via-white to-brand-warm-50 p-6 shadow-soft sm:p-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
              <Heart className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                My Family Care Plan
              </p>
              <h1 className="mt-2 text-balance text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
                This plan is for you.
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-brand-muted-600">
                Use three calm sections to feel steadier, understand what you need, and choose the
                right next support. Open only the part that is useful today.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold text-brand-muted-600">
                <span className="rounded-full border border-surface-border bg-white px-3 py-1.5">No scores</span>
                <span className="rounded-full border border-surface-border bg-white px-3 py-1.5">No deadlines</span>
                <span className="rounded-full border border-surface-border bg-white px-3 py-1.5">No child names</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[1.75rem] border border-surface-border bg-white p-5 shadow-soft sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">
            Your current focus
          </p>
          <p className="mt-3 text-lg font-semibold text-brand-navy-700">{focusOption.shortLabel}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-brand-muted-600">
            {focusOption.description}
          </p>
          <p className="mt-5 rounded-2xl bg-brand-warm-50 px-4 py-3 text-[12px] leading-relaxed text-brand-muted-600">
            Your selections shape this page. They are not a message to your care team.
          </p>
        </aside>
      </section>

      <section className="rounded-3xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              What feels closest today?
            </p>
            <h2 className="mt-1 text-xl font-semibold text-brand-navy-700">
              Choose one starting point
            </h2>
            <p className="mt-1 text-[13px] text-brand-muted-500">
              You can change this at any time. Choosing one does not erase anything else you are carrying.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {FOCUS_OPTIONS.map((option) => {
            const selected = option.id === focus;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectFocus(option.id)}
                aria-pressed={selected}
                className={cn(
                  'rounded-2xl border p-4 text-left transition',
                  selected
                    ? 'border-primary/35 bg-brand-plum-50/70 ring-2 ring-primary/10'
                    : 'border-surface-border bg-white hover:border-primary/25 hover:bg-brand-warm-50/40',
                )}
              >
                <span className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                      selected
                        ? 'border-primary bg-primary text-white'
                        : 'border-brand-muted-300 text-transparent',
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-brand-navy-700">{option.label}</span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-500">
                      {option.description}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3" aria-label="Parent support plan">
        <AccordionStep
          number={1}
          title="Stabilize"
          subtitle="What may help me right now"
          description="Reduce the immediate pressure enough to make the next decision clearer."
          accent="teal"
          open={activeStep === 1}
          onToggle={() => setActiveStep(1)}
        >
          <div className="grid gap-3 lg:grid-cols-3">
            {actions.map((action) => {
              const selected = selectedAction === action.id;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setSelectedAction(selected ? null : action.id)}
                  aria-pressed={selected}
                  className={cn(
                    'rounded-2xl border p-4 text-left transition',
                    selected
                      ? 'border-teal-300 bg-teal-50/75'
                      : 'border-teal-100 bg-white hover:border-teal-300',
                  )}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span>
                      <span className="block text-sm font-semibold text-brand-navy-700">{action.title}</span>
                      <span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-600">
                        {action.description}
                      </span>
                    </span>
                    <span
                      className={cn(
                        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                        selected
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-teal-200 text-transparent',
                      )}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {selectedActionDetail && (
            <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50/55 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                <div>
                  <p className="text-sm font-semibold text-teal-950">A calmer way to approach this</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-teal-950/75">
                    {selectedActionDetail.detail}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-teal-100 pt-4">
            <p className="text-[11px] leading-relaxed text-brand-muted-500">
              Nothing in this section is required. Use one idea or close it when you have enough.
            </p>
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Open Understand <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </AccordionStep>

        <AccordionStep
          number={2}
          title="Understand"
          subtitle="Help me make sense of what I need"
          description="Choose the kind of support that would make this concern feel more manageable."
          accent="blue"
          open={activeStep === 2}
          onToggle={() => setActiveStep(2)}
        >
          <p className="mb-4 text-[13px] leading-relaxed text-brand-muted-600">
            This is not an assessment. You are simply choosing the kind of support that feels most relevant.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {SUPPORT_NEEDS.map((need) => {
              const selected = supportNeed === need.id;
              return (
                <button
                  key={need.id}
                  type="button"
                  onClick={() => setSupportNeed(selected ? null : need.id)}
                  aria-pressed={selected}
                  className={cn(
                    'rounded-2xl border p-4 text-left transition',
                    selected
                      ? 'border-blue-300 bg-blue-50/70'
                      : 'border-blue-100 bg-white hover:border-blue-300',
                  )}
                >
                  <span className="flex items-start gap-3">
                    <span
                      className={cn(
                        'mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                        selected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-blue-200 text-transparent',
                      )}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-brand-navy-700">{need.label}</span>
                      <span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-600">
                        {need.description}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {supportNeed && (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/45 px-4 py-3 text-[13px] leading-relaxed text-blue-950">
              <strong>Your support direction:</strong>{' '}
              {SUPPORT_NEEDS.find((need) => need.id === supportNeed)?.description}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-blue-100 pt-4">
            <p className="text-[11px] leading-relaxed text-brand-muted-500">
              Skip this section when choosing a category feels like more work than help.
            </p>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Open Connect <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </AccordionStep>

        <AccordionStep
          number={3}
          title="Connect"
          subtitle="Help me choose the right support"
          description="Open an approved resource or prepare a useful conversation with the right person."
          accent="violet"
          open={activeStep === 3}
          onToggle={() => setActiveStep(3)}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {connections.map((option) => {
              const Icon = option.icon;
              return option.href.startsWith('#') ? (
                <button
                  key={option.title}
                  type="button"
                  onClick={() => {
                    document.getElementById('bcba-questions')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group flex items-start gap-3 rounded-2xl border border-violet-100 bg-white p-4 text-left transition hover:border-violet-300"
                >
                  <span className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', option.accent)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-brand-navy-700">{option.title}</span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-600">
                      {option.description}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-800">
                      {option.label} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </button>
              ) : (
                <Link
                  key={option.title}
                  href={option.href}
                  className="group flex items-start gap-3 rounded-2xl border border-violet-100 bg-white p-4 transition hover:border-violet-300"
                >
                  <span className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', option.accent)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-brand-navy-700">{option.title}</span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-600">
                      {option.description}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-800">
                      {option.label} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          {(focus === 'child-concern' || focus === 'aba' || supportNeed === 'conversation') && (
            <section id="bcba-questions" className="mt-5 scroll-mt-24 rounded-2xl border border-violet-200 bg-violet-50/45 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
                <div>
                  <h3 className="text-sm font-semibold text-violet-950">Questions I may bring to my BCBA</h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-violet-950/70">
                    Choose only the questions that fit. Do not enter your child\'s name or clinical details here.
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {BCBA_QUESTIONS.map((question) => {
                  const selected = selectedQuestions.includes(question);
                  return (
                    <button
                      key={question}
                      type="button"
                      onClick={() => toggleQuestion(question)}
                      aria-pressed={selected}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition',
                        selected
                          ? 'border-violet-300 bg-white'
                          : 'border-violet-100 bg-white/70 hover:border-violet-300',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                          selected
                            ? 'border-violet-600 bg-violet-600 text-white'
                            : 'border-violet-200 text-transparent',
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-[13px] leading-relaxed text-brand-navy-700">{question}</span>
                    </button>
                  );
                })}
              </div>

              {selectedQuestions.length > 0 && (
                <div className="mt-4 rounded-xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">
                    My conversation list
                  </p>
                  <ol className="mt-3 space-y-2">
                    {selectedQuestions.map((question, index) => (
                      <li key={question} className="flex items-start gap-2 text-[12px] leading-relaxed text-brand-muted-700">
                        <span className="font-semibold text-violet-700">{index + 1}.</span>
                        {question}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 text-[11px] leading-relaxed text-brand-muted-500">
                    This list stays on this page during your visit. It is not automatically sent to the BCBA.
                  </p>
                </div>
              )}
            </section>
          )}
        </AccordionStep>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-surface-border bg-white px-5 py-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-brand-navy-700">Important boundary</p>
              <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">
                Common Ground supports the parent. It does not diagnose behavior, create a behavior plan,
                replace mental-health treatment, or provide emergency care. Child-specific concerns should
                be brought to the BCBA or appropriate clinical professional.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-5 py-4">
          <div className="flex items-start gap-3">
            <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
            <div>
              <p className="text-sm font-semibold text-rose-900">Need immediate help?</p>
              <p className="mt-1 text-[12px] leading-relaxed text-rose-800">
                Common Ground is not an emergency service. Use the urgent support options provided by the
                site when anyone may be in immediate danger.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AccordionStep({
  number,
  title,
  subtitle,
  description,
  accent,
  open,
  onToggle,
  children,
}: {
  number: StepNumber;
  title: string;
  subtitle: string;
  description: string;
  accent: 'teal' | 'blue' | 'violet';
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const styles = {
    teal: {
      border: 'border-teal-200',
      background: open ? 'bg-teal-50/40' : 'bg-white',
      number: 'bg-teal-700 text-white',
      eyebrow: 'text-teal-700',
    },
    blue: {
      border: 'border-blue-200',
      background: open ? 'bg-blue-50/35' : 'bg-white',
      number: 'bg-blue-700 text-white',
      eyebrow: 'text-blue-700',
    },
    violet: {
      border: 'border-violet-200',
      background: open ? 'bg-violet-50/35' : 'bg-white',
      number: 'bg-violet-700 text-white',
      eyebrow: 'text-violet-700',
    },
  }[accent];

  return (
    <section className={cn('overflow-hidden rounded-3xl border shadow-soft transition', styles.border, styles.background)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
      >
        <span className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold', styles.number)}>
          {number}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn('block text-[10px] font-bold uppercase tracking-[0.16em]', styles.eyebrow)}>
            {subtitle}
          </span>
          <span className="mt-1 block text-xl font-semibold text-brand-navy-700">{title}</span>
          <span className="mt-1 block text-[13px] leading-relaxed text-brand-muted-500">{description}</span>
        </span>
        {open ? (
          <ChevronUp className={cn('h-5 w-5 shrink-0', styles.eyebrow)} />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-brand-muted-400" />
        )}
      </button>
      {open && <div className="border-t border-current/10 px-5 pb-5 pt-5 sm:px-6 sm:pb-6">{children}</div>}
    </section>
  );
}
