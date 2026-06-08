'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  HeartHandshake,
  Lock,
  MessageCircle,
  MessageSquare,
  Phone,
  Shield,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import {
  mockParentMatches,
  peerGroups,
  type ConnectionPreference,
  type DiagnosisStage,
  type Struggle,
  type SupportStyle,
} from '@/lib/data';
import { cn } from '@/lib/utils';

type AgeRange = '0-2' | '2-5' | '6-12' | '13-17';

const connectCopy = {
  eyebrow: 'Parent Connection',
    headline: "You don't have to explain it. They already get it.",
    subhead:
      "Common Ground connects you with parents who live the same moments, ask the same questions, and know what you're going through.",
    ctaPrimary: 'Find my match',
    ctaSecondary: 'Browse small groups',
    comingSoonTitle: 'Parent matching is coming soon.',
    comingSoonText:
      "We're building the right matches so you can connect with parents who truly understand.",
    comingSoonCta: 'Learn more',
    trustModerationTitle: 'Real moderators in every space',
    trustModerationText:
      'Conversations are guided by trained moderators who keep spaces safe, kind, and on-topic.',
    trustPrivacyTitle: 'Your privacy, always',
    trustPrivacyText:
      'Your child stays private. We never share names, schools, or personal information.',
    trustSupportTitle: 'Support when you need more',
    trustSupportText:
      'If you need extra help, resources and crisis support are just a click away.',
    trustLearnMore: 'Learn more',
    trustViewSupport: 'View support options',
    formSectionTitle: "Let's find your people",
    formSectionSub:
      'A few quick questions help us connect you with parents who truly get your journey.',
    stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
    backBtn: 'Back',
    continueBtn: 'Continue',
    skipReassurance: 'You can skip any question and change your answers anytime.',
    intakeStep1Title: 'Child age',
    intakeStep1Hint: 'Pick one or more — helps us match you with parents at the same stage.',
    intakeStep2Title: 'Journey stage',
    intakeStep2Hint: 'Pick one. There is no wrong answer.',
    intakeStep3Title: 'What is hardest right now?',
    intakeStep3Hint: 'Choose up to two.',
    intakeStep4Title: 'How to connect',
    intakeStep4Hint: 'Pick one or more — text, calls, small groups, or any combination.',
    intakeStep5Title: 'Support style',
    intakeStep5Hint: 'Pick one. We use this to surface compatible parents and groups.',
    intakeInlineRequired: 'Pick at least one answer on each step to join the waitlist.',
    intakeSubmit: 'Join the waitlist',
    intakeSubmitHint:
      "When enough parents with a similar stage and need have joined, we'll reach out with matches.",
    intakeSubmittedHeading: "You're on the list.",
    intakeSubmittedBody:
      "We'll let you know when we have parents matched to your stage. In the meantime, here's what's nearby.",
    intakeSubmittedSeeMatches: 'See parent matches',
    intakeSubmittedSeeGroups: 'Browse small groups',
    intakeOptionAge02: '0–2 years',
    intakeOptionAge25: '2–5 years',
    intakeOptionAge612: '6–12 years',
    intakeOptionAge1317: '13–17 years',
    intakeOptionStageNew: 'Newly diagnosed',
    intakeOptionStageOngoing: 'Ongoing journey',
    intakeOptionStageAdvanced: 'Experienced parent',
    intakeOptionStruggleBehavior: 'Behavior challenges',
    intakeOptionStruggleCommunication: 'Communication',
    intakeOptionStruggleSchool: 'School / IEP',
    intakeOptionStruggleBurnout: 'Caregiver burnout',
    intakeOptionStruggleIsolation: 'Feeling isolated',
    intakeOptionStruggleInsurance: 'Insurance / access',
    intakeOptionConnectText: 'Text',
    intakeOptionConnectCall: 'Call / video',
    intakeOptionConnectGroup: 'Small group',
    intakeOptionStyleFaith: 'Faith-based',
    intakeOptionStyleGeneral: 'General',
    previewTitle: 'See who you might connect with',
    previewSub: 'Examples of parent matches and groups based on families like yours.',
    previewViewAll: 'View all matches and groups',
    previewMatchesHeading: 'Example parent matches',
    previewMatchBlurb: 'Parents navigating similar stages and challenges.',
    previewGroupsHeading: 'Example small groups',
    findMyMatchBtn: 'Find my match',
    browseGroupsBtn: 'Browse all groups',
    bottomSupportTitle: 'Need support right now?',
    bottomSupportText:
      "You're not alone. Get help from trusted providers and resources.",
    offrampFindTitle: 'Find a provider',
    offrampMentalTitle: 'Mental health for caregivers',
    offrampCrisisTitle: 'Crisis support',
} as const;

const TOTAL_STEPS = 5;

const ageRangeValues: AgeRange[] = ['0-2', '2-5', '6-12', '13-17'];
const stageValues: DiagnosisStage[] = ['new', 'ongoing', 'advanced'];
const struggleValues: Struggle[] = [
  'behavior',
  'communication',
  'school',
  'burnout',
  'isolation',
  'insurance',
];
const connectionValues: { value: ConnectionPreference; icon: typeof MessageSquare }[] = [
  { value: 'text', icon: MessageSquare },
  { value: 'call', icon: Video },
  { value: 'group', icon: Users },
];
const styleValues: SupportStyle[] = ['faith-based', 'general'];

function scrollTo(id: string) {
  if (typeof window === 'undefined') return;
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function OptionPill({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-[44px] items-center gap-2 rounded-2xl border px-4 py-2.5 text-[13px] font-semibold transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
        active
          ? 'border-brand-plum-300 bg-brand-plum-50 text-brand-plum-900'
          : 'border-surface-border bg-white text-brand-muted-700 hover:border-brand-plum-200 hover:bg-brand-plum-50/40',
        className,
      )}
    >
      {active && <Check className="h-3.5 w-3.5 shrink-0 text-brand-plum-700" aria-hidden />}
      {children}
    </button>
  );
}

function TrustCard({
  icon: Icon,
  title,
  text,
  cta,
  onClick,
}: {
  icon: typeof Shield;
  title: string;
  text: string;
  cta: string;
  onClick?: () => void;
}) {
  return (
    <article className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-plum-50 text-brand-plum-700">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <h3 className="mt-3 text-[15px] font-semibold text-brand-navy-700">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-brand-muted-600">{text}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary/80"
      >
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}

export default function ConnectPage() {
  const t = connectCopy;

  const [currentStep, setCurrentStep] = useState(1);
  const [ageRanges, setAgeRanges] = useState<AgeRange[]>([]);
  const [stage, setStage] = useState<DiagnosisStage | null>(null);
  const [struggles, setStruggles] = useState<Struggle[]>([]);
  const [connections, setConnections] = useState<ConnectionPreference[]>([]);
  const [style, setStyle] = useState<SupportStyle | null>(null);
  const [intakeSubmitted, setIntakeSubmitted] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const toggleArr = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const toggleStruggle = (val: Struggle) => {
    setStruggles((prev) => {
      if (prev.includes(val)) return prev.filter((v) => v !== val);
      if (prev.length >= 2) return prev;
      return [...prev, val];
    });
  };

  const sectionDone = {
    age: ageRanges.length > 0,
    stage: stage !== null,
    struggles: struggles.length > 0,
    connections: connections.length > 0,
    style: style !== null,
  };
  const intakeComplete = Object.values(sectionDone).every(Boolean);

  const ageLabel: Record<AgeRange, string> = {
    '0-2': t.intakeOptionAge02,
    '2-5': t.intakeOptionAge25,
    '6-12': t.intakeOptionAge612,
    '13-17': t.intakeOptionAge1317,
  };
  const stageLabelLocal: Record<DiagnosisStage, string> = {
    new: t.intakeOptionStageNew,
    ongoing: t.intakeOptionStageOngoing,
    advanced: t.intakeOptionStageAdvanced,
  };
  const struggleLabelLocal: Record<Struggle, string> = {
    behavior: t.intakeOptionStruggleBehavior,
    communication: t.intakeOptionStruggleCommunication,
    school: t.intakeOptionStruggleSchool,
    burnout: t.intakeOptionStruggleBurnout,
    isolation: t.intakeOptionStruggleIsolation,
    insurance: t.intakeOptionStruggleInsurance,
  };
  const connectionLabelLocal: Record<ConnectionPreference, string> = {
    text: t.intakeOptionConnectText,
    call: t.intakeOptionConnectCall,
    group: t.intakeOptionConnectGroup,
  };
  const styleLabelLocal: Record<SupportStyle, string> = {
    'faith-based': t.intakeOptionStyleFaith,
    general: t.intakeOptionStyleGeneral,
  };

  const submitWaitlist = () => {
    if (!intakeComplete) {
      setAttemptedSubmit(true);
      return;
    }
    setIntakeSubmitted(true);
    setAttemptedSubmit(false);
    try {
      const existing = JSON.parse(window.localStorage.getItem('cg.connectWaitlist.v1') || '[]');
      existing.push({
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          ageRanges,
        stage,
        struggles,
        connections,
        style,
        createdAt: new Date().toISOString(),
      });
      window.localStorage.setItem('cg.connectWaitlist.v1', JSON.stringify(existing));
    } catch {
      /* best-effort */
    }
    requestAnimationFrame(() => scrollTo('preview'));
  };

  const stepMeta = [
    { title: t.intakeStep1Title, hint: t.intakeStep1Hint },
    { title: t.intakeStep2Title, hint: t.intakeStep2Hint },
    { title: t.intakeStep3Title, hint: t.intakeStep3Hint },
    { title: t.intakeStep4Title, hint: t.intakeStep4Hint },
    { title: t.intakeStep5Title, hint: t.intakeStep5Hint },
  ][currentStep - 1];

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/support" className="hover:text-brand-navy-700">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3 w-3" />
          </li>
          <li className="font-medium text-brand-muted-700">Parent Connection</li>
        </ol>
      </nav>

      {/* Coming soon banner */}
      <div className="mt-4 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/60 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[13px] font-semibold text-brand-navy-700">{t.comingSoonTitle}</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-brand-muted-700">
              {t.comingSoonText}
            </p>
          </div>
          <button
            type="button"
            onClick={() => scrollTo('intake')}
            className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-brand-plum-700 hover:text-brand-plum-900"
          >
            {t.comingSoonCta} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-surface-border bg-white shadow-soft">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1 text-[11px] font-semibold text-brand-plum-700">
              <HeartHandshake className="h-3.5 w-3.5" /> {t.eyebrow}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-navy-700 sm:text-4xl">
              {t.headline}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-muted-700">{t.subhead}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => scrollTo('intake')}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90"
              >
                {t.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo('preview')}
                className="inline-flex items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-5 py-2.5 text-[13px] font-semibold text-brand-plum-700 transition hover:bg-brand-plum-50"
              >
                {t.ctaSecondary}
              </button>
            </div>
          </div>

          <div
            aria-hidden
            className="relative hidden min-h-[220px] bg-gradient-to-br from-brand-plum-50 via-brand-plum-100/40 to-brand-warm-100 lg:block"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-3 p-8">
                {[
                  { icon: Users, label: 'Parents' },
                  { icon: MessageCircle, label: 'Messages' },
                  { icon: Heart, label: 'Support' },
                  { icon: Shield, label: 'Safe space' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm"
                  >
                    <Icon className="h-6 w-6 text-brand-plum-700" />
                    <span className="text-[11px] font-semibold text-brand-plum-800">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust cards */}
      <section aria-label="Why this space is safe" className="mt-6 grid gap-4 sm:grid-cols-3">
        <TrustCard
          icon={Shield}
          title={t.trustModerationTitle}
          text={t.trustModerationText}
          cta={t.trustLearnMore}
          onClick={() => scrollTo('intake')}
        />
        <TrustCard
          icon={Lock}
          title={t.trustPrivacyTitle}
          text={t.trustPrivacyText}
          cta={t.trustLearnMore}
          onClick={() => scrollTo('intake')}
        />
        <TrustCard
          icon={Heart}
          title={t.trustSupportTitle}
          text={t.trustSupportText}
          cta={t.trustViewSupport}
          onClick={() => scrollTo('support')}
        />
      </section>

      {/* Guided matching form */}
      <section
        id="intake"
        aria-labelledby="intake-heading"
        className="mt-9 scroll-mt-6 rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6"
      >
        {intakeSubmitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
              <Heart className="h-7 w-7 text-emerald-600" aria-hidden />
            </div>
            <h2 id="intake-heading" className="mt-4 text-xl font-bold text-brand-navy-700">
              {t.intakeSubmittedHeading}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-brand-muted-600">
              {t.intakeSubmittedBody}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2.5">
              <button
                type="button"
                onClick={() => scrollTo('preview')}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white"
              >
                {t.intakeSubmittedSeeMatches} <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo('preview-groups')}
                className="inline-flex items-center gap-2 rounded-2xl border border-surface-border px-4 py-2.5 text-[13px] font-semibold text-brand-muted-700"
              >
                {t.intakeSubmittedSeeGroups}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 id="intake-heading" className="text-xl font-bold text-brand-navy-700 sm:text-2xl">
              {t.formSectionTitle}
            </h2>
            <p className="mt-1 text-[14px] leading-relaxed text-brand-muted-600">
              {t.formSectionSub}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold text-brand-muted-600" aria-live="polite">
                {t.stepOf(currentStep, TOTAL_STEPS)}
              </p>
              <div className="flex gap-1" aria-hidden>
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 w-8 rounded-full transition-colors duration-200',
                      i + 1 <= currentStep ? 'bg-primary' : 'bg-surface-muted',
                    )}
                  />
                ))}
              </div>
            </div>

            <div
              key={currentStep}
              className="mt-5 rounded-2xl border border-brand-plum-100 bg-brand-plum-50/30 p-5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
            >
              <h3 className="text-[16px] font-semibold text-brand-navy-700">{stepMeta.title}</h3>
              <p className="mt-1 text-[13px] text-brand-muted-600">{stepMeta.hint}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {currentStep === 1 &&
                  ageRangeValues.map((value) => (
                    <OptionPill
                      key={value}
                      active={ageRanges.includes(value)}
                      onClick={() => setAgeRanges(toggleArr(ageRanges, value))}
                    >
                      {ageLabel[value]}
                    </OptionPill>
                  ))}

                {currentStep === 2 &&
                  stageValues.map((value) => (
                    <OptionPill
                      key={value}
                      active={stage === value}
                      onClick={() => setStage(value)}
                      className="w-full sm:w-auto"
                    >
                      {stageLabelLocal[value]}
                    </OptionPill>
                  ))}

                {currentStep === 3 &&
                  struggleValues.map((value) => (
                    <OptionPill
                      key={value}
                      active={struggles.includes(value)}
                      onClick={() => toggleStruggle(value)}
                    >
                      {struggleLabelLocal[value]}
                    </OptionPill>
                  ))}

                {currentStep === 4 &&
                  connectionValues.map((opt) => (
                    <OptionPill
                      key={opt.value}
                      active={connections.includes(opt.value)}
                      onClick={() => setConnections(toggleArr(connections, opt.value))}
                    >
                      <opt.icon className="h-3.5 w-3.5" aria-hidden />
                      {connectionLabelLocal[opt.value]}
                    </OptionPill>
                  ))}

                {currentStep === 5 &&
                  styleValues.map((value) => (
                    <OptionPill
                      key={value}
                      active={style === value}
                      onClick={() => setStyle(value)}
                      className="w-full sm:w-auto"
                    >
                      {styleLabelLocal[value]}
                    </OptionPill>
                  ))}
              </div>

              {attemptedSubmit && currentStep === TOTAL_STEPS && !intakeComplete && (
                <p className="mt-3 text-[12px] font-semibold text-red-700" role="alert">
                  {t.intakeInlineRequired}
                </p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                className={cn(
                  'inline-flex items-center gap-1 rounded-2xl border px-4 py-2.5 text-[13px] font-semibold transition',
                  currentStep === 1
                    ? 'cursor-not-allowed border-surface-border text-brand-muted-400'
                    : 'border-surface-border text-brand-muted-700 hover:bg-surface-subtle',
                )}
              >
                <ChevronLeft className="h-4 w-4" /> {t.backBtn}
              </button>

              {currentStep < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1))}
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90"
                >
                  {t.continueBtn} <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitWaitlist}
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90"
                >
                  {t.intakeSubmit} <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            <p className="mt-4 text-center text-[12px] text-brand-muted-500">{t.skipReassurance}</p>
            {currentStep === TOTAL_STEPS && (
              <p className="mt-1 text-center text-[11.5px] text-brand-muted-500">
                {t.intakeSubmitHint}
              </p>
            )}
          </>
        )}
      </section>

      {/* Preview */}
      <section id="preview" aria-labelledby="preview-heading" className="mt-9 scroll-mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-brand-plum-100 pb-2.5">
          <div>
            <h2 id="preview-heading" className="text-lg font-bold text-brand-navy-700 sm:text-xl">
              {t.previewTitle}
            </h2>
            <p className="mt-1 text-[13px] text-brand-muted-600">{t.previewSub}</p>
          </div>
          <button
            type="button"
            onClick={() => scrollTo('preview-groups')}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-plum-700 hover:text-brand-plum-900"
          >
            {t.previewViewAll} <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft">
            <h3 className="text-[15px] font-semibold text-brand-navy-700">
              {t.previewMatchesHeading}
            </h3>
            <div className="mt-3 flex -space-x-2">
              {mockParentMatches.slice(0, 3).map((match) => (
                <span
                  key={match.id}
                  aria-hidden
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-brand-plum-100 text-[11px] font-bold text-brand-plum-800"
                >
                  {match.avatar}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-brand-muted-600">
              {t.previewMatchBlurb}
            </p>
            <button
              type="button"
              onClick={() => scrollTo('intake')}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90"
            >
              {t.findMyMatchBtn}
            </button>
          </article>

          <article
            id="preview-groups"
            className="scroll-mt-6 rounded-2xl border border-surface-border bg-white p-5 shadow-soft"
          >
            <h3 className="text-[15px] font-semibold text-brand-navy-700">
              {t.previewGroupsHeading}
            </h3>
            <ul className="mt-3 space-y-3">
              {peerGroups.slice(0, 2).map((group) => (
                <li
                  key={group.id}
                  className="rounded-xl border border-brand-plum-100 bg-brand-plum-50/40 px-3.5 py-2.5"
                >
                  <p className="text-[14px] font-semibold text-brand-navy-700">{group.name}</p>
                  <p className="mt-0.5 text-[12px] text-brand-muted-600">{group.description}</p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => scrollTo('preview-groups')}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-plum-700 transition hover:bg-brand-plum-50"
            >
              {t.browseGroupsBtn}
            </button>
          </article>
        </div>
      </section>

      {/* Bottom support callout */}
      <section
        id="support"
        aria-labelledby="support-heading"
        className="mt-9 scroll-mt-6 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/50 px-5 py-5 sm:px-6"
      >
        <h2 id="support-heading" className="text-lg font-bold text-brand-navy-700">
          {t.bottomSupportTitle}
        </h2>
        <p className="mt-1 text-[14px] leading-relaxed text-brand-muted-700">
          {t.bottomSupportText}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link
            href="/support/find"
            className="rounded-2xl border border-surface-border bg-white px-4 py-3 text-[13px] font-semibold text-brand-navy-700 shadow-sm transition hover:border-primary/30 hover:text-primary"
          >
            {t.offrampFindTitle}
          </Link>
          <Link
            href="/support/caregiver"
            className="rounded-2xl border border-surface-border bg-white px-4 py-3 text-[13px] font-semibold text-brand-navy-700 shadow-sm transition hover:border-brand-plum-300 hover:text-brand-plum-800"
          >
            {t.offrampMentalTitle}
          </Link>
          <a
            href="tel:988"
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-800 shadow-sm transition hover:bg-rose-100"
          >
            <Phone className="mr-1.5 inline h-4 w-4" aria-hidden />
            {t.offrampCrisisTitle}
          </a>
        </div>
      </section>
    </main>
  );
}
