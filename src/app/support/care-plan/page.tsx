'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Compass,
  Eye,
  Flag,
  Heart,
  HeartHandshake,
  Home,
  Mail,
  MessageCircle,
  Pencil,
  Printer,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import {
  loadCarePlan,
  type CarePlanStep,
  type Hardest,
  type SavedCarePlan,
} from '@/lib/carePlanStorage';
import { HARDEST_OPTIONS } from '@/lib/generateNextSteps';
import EmailPlanDialog from '@/components/EmailPlanDialog';
import {
  buildFallbackParentSupportPlan,
  getPrimaryNeedLabel,
  materializeParentSupportPlan,
  normalizeParentSupportPlan,
  type MaterializedParentSupportPlan,
  type ParentSupportPlanSelection,
} from '@/lib/parentSupportPlan';

const INTAKE_HREF = '/support/intake';
const CHECK_IN_HREF = '/support/check-in?from=/support/care-plan';

const HARDEST_ICONS: Record<Hardest, React.ComponentType<{ className?: string }>> = {
  'understanding-aba': Brain,
  'behavior-home': Home,
  overwhelmed: Heart,
  'finding-resources': Search,
  'financial-insurance': Flag,
  siblings: Users,
  'connecting-parents': HeartHandshake,
  'school-iep': BookOpen,
};

const HARDEST_LABEL_BY_VALUE: Record<string, string> = Object.fromEntries(
  HARDEST_OPTIONS.map((option) => [option.value, option.label]),
);

const REFINEMENT_OPTIONS = [
  {
    value: 'clearer-steps',
    label: 'I need clearer steps',
    description: 'Make the actions easier to understand and use.',
  },
  {
    value: 'misunderstood',
    label: 'This missed my concern',
    description: 'Correct what Common Ground understood.',
  },
  {
    value: 'support-for-me',
    label: 'I need more support for me',
    description: 'Focus more directly on your capacity and well-being.',
  },
  {
    value: 'bcba-questions',
    label: 'I need better BCBA questions',
    description: 'Prepare a more useful clinical conversation.',
  },
  {
    value: 'situation-changed',
    label: 'The situation changed',
    description: 'Update the guide with what is happening now.',
  },
  {
    value: 'safety',
    label: 'I am worried about safety',
    description: 'Clarify when to contact the team or seek urgent help.',
  },
] as const;

export default function CarePlanPage() {
  const [hydrated, setHydrated] = useState(false);
  const [plan, setPlan] = useState<SavedCarePlan | null>(null);

  useEffect(() => {
    setHydrated(true);
    setPlan(loadCarePlan());
  }, []);

  if (!hydrated) {
    return (
      <Shell>
        <div className="h-48 animate-pulse rounded-3xl bg-surface-subtle" />
      </Shell>
    );
  }

  if (!plan) return <EmptyState />;
  return <ParentCareGuide plan={plan} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>;
}

function EmptyState() {
  return (
    <Shell>
      <section className="rounded-3xl border border-surface-border bg-white p-8 text-center shadow-soft sm:p-12">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Compass className="h-7 w-7" />
        </div>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-plum-700">
          For Texas ABA Centers parents and caregivers
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-brand-navy-700 sm:text-3xl">
          Build support around what is hardest for you.
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-brand-muted-700">
          Tell Common Ground what is happening at home. Your Parent Care Guide will help you
          prepare for difficult moments, protect your own capacity, and know what to ask your
          BCBA.
        </p>
        <Link
          href={INTAKE_HREF}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4" /> Build my Parent Care Guide
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-4 text-[12px] leading-relaxed text-brand-muted-500">
          This is parent support. It does not diagnose, create a behavior plan, or replace your
          clinical team.
        </p>
      </section>
    </Shell>
  );
}

function ParentCareGuide({ plan }: { plan: SavedCarePlan }) {
  const fallback = useMemo(() => buildFallbackParentSupportPlan(plan.answers), [plan.answers]);
  const [selection, setSelection] = useState<ParentSupportPlanSelection>(fallback);
  const [personalizing, setPersonalizing] = useState(true);
  const [emailOpen, setEmailOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setSelection(fallback);
    setPersonalizing(true);

    void fetch('/api/support/parent-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: plan.answers }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to personalize the guide.');
        const payload = (await response.json()) as unknown;
        setSelection(normalizeParentSupportPlan(payload, fallback));
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setSelection(fallback);
      })
      .finally(() => setPersonalizing(false));

    return () => controller.abort();
  }, [fallback, plan.answers]);

  const supportPlan = useMemo(() => materializeParentSupportPlan(selection), [selection]);
  const concerns = (plan.answers.hardest ?? []) as Hardest[];
  const parentWords = plan.answers.notes?.trim() || plan.summary;
  const updated = new Date(plan.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <Shell>
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500 print:hidden">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/support" className="hover:text-brand-navy-700">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3 w-3" />
          </li>
          <li className="font-medium text-brand-muted-700">My Parent Care Guide</li>
        </ol>
      </nav>

      <section className="mt-3 overflow-hidden rounded-3xl border border-brand-plum-100 bg-gradient-to-br from-brand-plum-50 via-white to-brand-warm-50 shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.17em] text-brand-plum-700 shadow-sm">
              <Heart className="h-3.5 w-3.5" /> Parent support from Common Ground
            </p>
            <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight text-brand-navy-700 sm:text-4xl">
              This guide is for <span className="text-primary">you</span>.
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-brand-muted-700 sm:text-base">
              Your child&rsquo;s clinical team supports treatment. Common Ground helps you feel more
              equipped for what happens at home, cared for in what it costs you, and prepared to
              work with your BCBA on what comes next.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 print:hidden">
              <Link
                href={CHECK_IN_HREF}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
              >
                <RefreshCw className="h-4 w-4" /> Update what&rsquo;s happening
              </Link>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-2xl border border-brand-plum-200 bg-white px-5 py-3 text-sm font-semibold text-brand-plum-700 transition hover:bg-brand-plum-50"
              >
                <Printer className="h-4 w-4" /> Print my guide
              </button>
            </div>
          </div>

          <aside className="border-t border-brand-plum-100 bg-white/75 p-6 lg:border-l lg:border-t-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
              What this guide helps you do
            </p>
            <p className="mt-3 text-lg font-semibold leading-snug text-brand-navy-700">
              {getPrimaryNeedLabel(supportPlan.primaryNeed)}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-brand-muted-600">
              {supportPlan.reflection}
            </p>
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-[12px] leading-relaxed text-emerald-900">
              <span className="font-semibold">The goal:</span> leave with clearer actions, useful
              observations, and questions you can bring to your BCBA.
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-brand-plum-700">
              What you told us
            </p>
            <h2 className="mt-1 text-xl font-bold text-brand-navy-700">This is the concern shaping your guide.</h2>
          </div>
          <Link
            href={INTAKE_HREF}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-plum-700 hover:text-brand-plum-800 print:hidden"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit my concern
          </Link>
        </div>
        <blockquote className="mt-4 whitespace-pre-wrap rounded-2xl border-l-4 border-primary bg-primary/5 px-4 py-4 text-[15px] font-medium leading-relaxed text-brand-navy-700 sm:px-5">
          “{parentWords}”
        </blockquote>
        {concerns.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {concerns.map((concern) => {
              const Icon = HARDEST_ICONS[concern];
              return (
                <li
                  key={concern}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-plum-50 px-3 py-1.5 text-[12px] font-semibold text-brand-plum-800"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {HARDEST_LABEL_BY_VALUE[concern] ?? concern}
                </li>
              );
            })}
          </ul>
        )}
        {plan.answers.support && (
          <p className="mt-3 text-[12.5px] leading-relaxed text-brand-muted-600">
            <span className="font-semibold text-brand-navy-700">What needs more support now:</span>{' '}
            {plan.answers.support}
          </p>
        )}
      </section>

      {supportPlan.safetyEscalation && <SafetyCallout />}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <GuideCard
          icon={Flag}
          eyebrow="Use in the moment"
          title="What you can do now"
          description="These are caregiver-support boundaries, not a new behavior plan. Follow your current clinical guidance first."
          items={supportPlan.nowActions}
          tone="warm"
        />
        <GuideCard
          icon={Target}
          eyebrow="Before the next hard moment"
          title="How to prepare"
          description="Preparation lowers the amount you have to remember when your own capacity is already stretched."
          items={supportPlan.prepareActions}
          tone="green"
        />
        <GuideCard
          icon={Eye}
          eyebrow="Help your BCBA understand"
          title="What to notice"
          description="You are not being asked to diagnose the behavior. These observations help you describe what is happening clearly."
          items={supportPlan.observationPrompts}
          tone="blue"
        />
        <GuideCard
          id="bcba-questions"
          icon={MessageCircle}
          eyebrow="Bring these with you"
          title="Questions for your BCBA"
          description="Choose the questions that would help you leave the meeting feeling clearer and more prepared."
          items={supportPlan.bcbaQuestions}
          tone="purple"
          numbered
        />
        <GuideCard
          icon={HeartHandshake}
          eyebrow="The parent matters too"
          title="Support for you"
          description="Caregiver well-being is not an extra. It affects your ability to understand, respond, and keep participating over time."
          items={supportPlan.caregiverSupport}
          tone="rose"
        />
        <GuideCard
          icon={ShieldCheck}
          eyebrow="Do not wait when"
          title="Contact your team"
          description="These signs mean the current support may need clarification, adjustment, or faster clinical attention."
          items={supportPlan.contactTeamReasons}
          tone="navy"
        />
      </div>

      {plan.steps.length > 0 && (
        <section className="mt-7 rounded-3xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
                From your approved Common Ground plan
              </p>
              <h2 className="mt-1 text-xl font-bold text-brand-navy-700">Your selected site actions</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">
                These links come from the existing Common Ground content and remain separate from the AI organizing layer.
              </p>
            </div>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {plan.steps.slice(0, 6).map((step) => (
              <ApprovedStep key={step.id ?? step.title} step={step} />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-7 rounded-3xl border border-brand-plum-100 bg-brand-plum-50/55 p-5 sm:p-6 print:hidden">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-plum-700 shadow-sm">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
              Refine this guide
            </p>
            <h2 className="mt-1 text-xl font-bold text-brand-navy-700">Did this give you what you needed?</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">
              Common Ground will not open an unrestricted chat. Choose what needs to change, add only the details that matter, and the guide will rebuild inside the same safe structure.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REFINEMENT_OPTIONS.map((option) => (
            <Link
              key={option.value}
              href={`/support/check-in?from=/support/care-plan&focus=${option.value}`}
              className="group rounded-2xl border border-brand-plum-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-plum-300 hover:shadow-soft"
            >
              <p className="flex items-center justify-between gap-2 text-[14px] font-semibold text-brand-navy-700">
                {option.label}
                <ArrowRight className="h-4 w-4 text-brand-plum-500 transition group-hover:translate-x-0.5" />
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-brand-muted-600">
                {option.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-surface-border bg-surface-muted/45 px-4 py-4 text-[12px] leading-relaxed text-brand-muted-600 sm:px-5">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum-700" />
          <div>
            <p className="font-semibold text-brand-navy-700">How AI is used here</p>
            <p className="mt-1">
              AI reflects what you wrote and selects from a fixed set of approved parent-support actions, observation prompts, and BCBA questions. It cannot diagnose, identify the function of behavior, create a BIP, or replace your BCBA.
            </p>
            <p className="mt-1">
              Do not enter names, birth dates, addresses, schools, therapist names, or other identifying information. Review and remove identifying details before printing or emailing this guide.
            </p>
            <p className="mt-1 text-[11px] text-brand-muted-500">
              Last updated {updated} · Saved privately on this device
              {personalizing ? ' · Organizing your guide…' : ''}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 rounded-2xl bg-brand-plum-50 px-4 py-3 text-[13px] font-semibold text-brand-plum-700 print:hidden sm:gap-x-4">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 hover:text-brand-plum-800"
        >
          <Printer className="h-4 w-4" /> Print my guide
        </button>
        <span aria-hidden className="text-brand-plum-200">|</span>
        <button
          type="button"
          onClick={() => setEmailOpen(true)}
          className="inline-flex items-center gap-1.5 hover:text-brand-plum-800"
        >
          <Mail className="h-4 w-4" /> Email current saved plan
        </button>
        <span aria-hidden className="text-brand-plum-200">|</span>
        <Link href={CHECK_IN_HREF} className="inline-flex items-center gap-1.5 hover:text-brand-plum-800">
          <RefreshCw className="h-4 w-4" /> Update what&rsquo;s happening
        </Link>
        <span aria-hidden className="text-brand-plum-200">|</span>
        <Link href={INTAKE_HREF} className="inline-flex items-center gap-1.5 hover:text-brand-plum-800">
          <Pencil className="h-4 w-4" /> Edit concern
        </Link>
      </section>

      <EmailPlanDialog open={emailOpen} onClose={() => setEmailOpen(false)} plan={plan} latestCheckIn={null} />
    </Shell>
  );
}

function GuideCard({
  id,
  icon: Icon,
  eyebrow,
  title,
  description,
  items,
  tone,
  numbered = false,
}: {
  id?: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  tone: 'warm' | 'green' | 'blue' | 'purple' | 'rose' | 'navy';
  numbered?: boolean;
}) {
  const toneClasses = {
    warm: 'border-amber-100 bg-amber-50/45 text-amber-800',
    green: 'border-emerald-100 bg-emerald-50/45 text-emerald-800',
    blue: 'border-sky-100 bg-sky-50/45 text-sky-800',
    purple: 'border-brand-purple-100 bg-brand-purple-50/50 text-brand-purple-600',
    rose: 'border-rose-100 bg-rose-50/45 text-rose-800',
    navy: 'border-slate-200 bg-slate-50 text-brand-navy-700',
  }[tone];

  return (
    <section id={id} className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${toneClasses}`}>
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.17em] opacity-80">{eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold leading-tight text-brand-navy-700">{title}</h2>
        </div>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-brand-muted-700">{description}</p>
      <ol className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item} className="flex items-start gap-3 rounded-2xl bg-white/75 px-3.5 py-3 text-[13.5px] leading-relaxed text-brand-navy-700">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold shadow-sm">
              {numbered ? index + 1 : <Check className="h-3 w-3" />}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ApprovedStep({ step }: { step: CarePlanStep }) {
  const external = step.href.startsWith('http') || step.href.startsWith('tel:');
  const classes =
    'group flex items-start justify-between gap-3 rounded-2xl border border-surface-border bg-surface-muted/35 px-4 py-3.5 transition hover:border-primary/30 hover:bg-primary/5';
  const content = (
    <>
      <span>
        <span className="block text-[14px] font-semibold text-brand-navy-700">{step.title}</span>
        <span className="mt-1 block text-[12.5px] leading-relaxed text-brand-muted-600">
          {step.because ?? step.why}
        </span>
      </span>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition group-hover:translate-x-0.5" />
    </>
  );

  if (external) {
    return (
      <li>
        <a
          href={step.href}
          target={step.href.startsWith('http') ? '_blank' : undefined}
          rel={step.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className={classes}
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={step.href} className={classes}>
        {content}
      </Link>
    </li>
  );
}

function SafetyCallout() {
  return (
    <section className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-700 shadow-sm">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">Safety comes first</p>
          <h2 className="mt-1 text-xl font-bold text-rose-950">Do not wait for the website to solve an urgent situation.</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-rose-900">
            Use the safety guidance already provided by your clinical team. Contact the appropriate clinical or medical support when you cannot maintain safety. If there is immediate danger, call emergency services. Common Ground is not an emergency or crisis service.
          </p>
        </div>
      </div>
    </section>
  );
}
