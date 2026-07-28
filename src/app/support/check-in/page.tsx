'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Compass,
  HeartHandshake,
  LifeBuoy,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import BandwidthCheck from '@/components/BandwidthCheck';
import {
  loadBandwidth,
  TIER_LABEL,
  TIER_RESULT_COPY,
  TIER_STEP_LIMIT,
  TIER_THEME,
  shouldShowCrisisCallout,
  shouldShowSupportCard,
  type BandwidthResult,
} from '@/lib/bandwidth';
import { loadCarePlan, saveCarePlan, type SavedCarePlan } from '@/lib/carePlanStorage';
import {
  generateNextSteps,
  generateResources,
  generateSummary,
  generateWeekMessage,
} from '@/lib/generateNextSteps';
import { markWeeklyIntakeDone, resetWeeklyProgress } from '@/lib/weeklyProgress';
import { cn } from '@/lib/utils';

const UPDATE_OPTIONS = [
  {
    value: 'clearer-steps',
    label: 'I need clearer steps',
    description: 'The guide understood the concern, but the actions are not concrete enough.',
    prompt: 'What part needs to be clearer?',
    placeholder: 'For example: I need the steps broken down so I know what to do before, during, and after a tantrum.',
    requiresDetails: false,
    icon: Target,
  },
  {
    value: 'misunderstood',
    label: 'This missed my concern',
    description: 'Correct what Common Ground understood about what is hardest.',
    prompt: 'What did the guide misunderstand?',
    placeholder: 'Describe the concern again in your own words. Focus on what is hardest for you as the parent.',
    requiresDetails: true,
    icon: MessageCircle,
  },
  {
    value: 'support-for-me',
    label: 'I need more support for me',
    description: 'Place more emphasis on your capacity, stress, and well-being.',
    prompt: 'What is costing you the most right now?',
    placeholder: 'For example: I understand the plan, but I am exhausted and cannot stay calm enough to use it consistently.',
    requiresDetails: false,
    icon: HeartHandshake,
  },
  {
    value: 'bcba-questions',
    label: 'I need better BCBA questions',
    description: 'Prepare for a clearer and more productive parent meeting.',
    prompt: 'What do you need your BCBA to help you understand?',
    placeholder: 'For example: I need to know what to do at the first sign of the behavior and what I should be tracking.',
    requiresDetails: false,
    icon: Compass,
  },
  {
    value: 'situation-changed',
    label: 'The situation changed',
    description: 'Update the guide so it reflects what is happening now.',
    prompt: 'What is happening now?',
    placeholder: 'Describe what changed, when you noticed it, and what now feels hardest for you.',
    requiresDetails: true,
    icon: RefreshCw,
  },
  {
    value: 'safety',
    label: 'I am worried about safety',
    description: 'Clarify when to contact the team or seek urgent help.',
    prompt: 'What safety concern are you preparing to discuss?',
    placeholder: 'Do not include names. Briefly describe the safety concern and whether it is new or increasing.',
    requiresDetails: true,
    icon: AlertTriangle,
  },
] as const;

type UpdateValue = (typeof UPDATE_OPTIONS)[number]['value'];
type Step = 'reason' | 'details' | 'bandwidth' | 'complete';

export default function CheckInPage() {
  return (
    <Suspense fallback={null}>
      <CheckInPageInner />
    </Suspense>
  );
}

function CheckInPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const fromParam = params.get('from');
  const back = fromParam && fromParam.startsWith('/') ? fromParam : '/support/care-plan';
  const requestedFocus = params.get('focus') as UpdateValue | null;
  const validRequestedFocus = UPDATE_OPTIONS.some((option) => option.value === requestedFocus)
    ? requestedFocus
    : null;

  const [plan] = useState<SavedCarePlan | null>(() =>
    typeof window === 'undefined' ? null : loadCarePlan(),
  );
  const [step, setStep] = useState<Step>(validRequestedFocus ? 'details' : 'reason');
  const [selected, setSelected] = useState<UpdateValue | null>(validRequestedFocus);
  const [details, setDetails] = useState('');
  const [bandwidthResult, setBandwidthResult] = useState<BandwidthResult | null>(null);

  const existingBandwidth = typeof window === 'undefined' ? null : loadBandwidth();
  const selectedOption = useMemo(
    () => UPDATE_OPTIONS.find((option) => option.value === selected) ?? null,
    [selected],
  );

  if (!plan) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-3xl border border-surface-border bg-white p-8 text-center shadow-soft">
          <Compass className="mx-auto h-8 w-8 text-primary" />
          <h1 className="mt-4 text-2xl font-semibold text-brand-navy-700">Build your guide first.</h1>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
            Common Ground needs your first concern before it can update what is happening.
          </p>
          <Link href="/support/intake" className="btn-primary mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            Build my Parent Care Guide <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    );
  }

  const detailsRequired = selectedOption?.requiresDetails ?? false;
  const canContinueFromDetails = !detailsRequired || details.trim().length >= 20;

  const saveUpdate = () => {
    if (!selectedOption || !bandwidthResult) return;

    const shouldReplaceConcern =
      selectedOption.value === 'misunderstood' ||
      selectedOption.value === 'situation-changed' ||
      selectedOption.value === 'safety';
    const cleanDetails = details.trim();
    const updatedAnswers = {
      ...plan.answers,
      notes: shouldReplaceConcern && cleanDetails ? cleanDetails : plan.answers.notes,
      support:
        cleanDetails && !shouldReplaceConcern
          ? `${selectedOption.label}: ${cleanDetails}`
          : selectedOption.label,
    };

    saveCarePlan({
      answers: updatedAnswers,
      summary: generateSummary(updatedAnswers),
      steps: generateNextSteps(updatedAnswers),
      resources: generateResources(updatedAnswers),
      weekMessage: generateWeekMessage(null),
    });
    resetWeeklyProgress();
    markWeeklyIntakeDone();
    router.push('/support/care-plan');
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-brand-warm-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href={back}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted-600 transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to my guide
          </Link>
          <p className="hidden items-center gap-1.5 text-[11.5px] font-medium text-brand-muted-500 sm:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" /> Fixed update flow — not an open chatbot
          </p>
        </div>

        <section className="rounded-3xl border border-surface-border bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-plum-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
              <Sparkles className="h-3.5 w-3.5" /> Update my Parent Care Guide
            </p>
            <p className="text-[11px] font-medium text-brand-muted-500">
              {step === 'reason' ? '1 of 3' : step === 'details' ? '2 of 3' : step === 'bandwidth' ? '3 of 3' : 'Complete'}
            </p>
          </div>

          {step === 'reason' && (
            <section>
              <h1 className="text-2xl font-semibold leading-snug text-brand-navy-700 sm:text-3xl">
                What needs to change in your guide?
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-600">
                Choose the clearest reason. Common Ground will only rebuild the parts connected to that need.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {UPDATE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const active = selected === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelected(option.value)}
                      aria-pressed={active}
                      className={cn(
                        'flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition',
                        active
                          ? 'border-primary bg-primary/5'
                          : 'border-surface-border bg-white hover:border-primary/35 hover:bg-primary/5',
                      )}
                    >
                      <span className={cn(
                        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                        active ? 'bg-primary text-white' : 'bg-brand-warm-100 text-brand-muted-600',
                      )}>
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-[14px] font-semibold text-brand-navy-700">{option.label}</span>
                        <span className="mt-1 block text-[12.5px] leading-relaxed text-brand-muted-600">{option.description}</span>
                      </span>
                      <Check className={cn('mt-1 h-4 w-4 text-primary', active ? 'opacity-100' : 'opacity-0')} />
                    </button>
                  );
                })}
              </div>
              <div className="mt-7 flex justify-end">
                <button
                  type="button"
                  disabled={!selected}
                  onClick={() => setStep('details')}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white shadow-soft',
                    selected ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-stone-300',
                  )}
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          )}

          {step === 'details' && selectedOption && (
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-primary">{selectedOption.label}</p>
              <h1 className="mt-2 text-2xl font-semibold leading-snug text-brand-navy-700 sm:text-3xl">{selectedOption.prompt}</h1>
              <p className="mt-2 text-[13.5px] leading-relaxed text-brand-muted-600">
                {detailsRequired
                  ? 'Add enough detail for Common Ground to accurately rebuild the guide.'
                  : 'This is optional, but one concrete sentence can make the update more useful.'}
              </p>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-950">
                <p className="font-semibold">Protect client confidentiality</p>
                <p className="mt-1">
                  Do not include your child&rsquo;s name, birth date, address, school, therapist&rsquo;s name, or other identifying details. Describe the concern generally.
                </p>
              </div>

              <textarea
                value={details}
                onChange={(event) => setDetails(event.target.value.slice(0, 1200))}
                rows={7}
                placeholder={selectedOption.placeholder}
                className="mt-5 w-full resize-none rounded-2xl border-2 border-surface-border bg-white px-4 py-3.5 text-[14px] leading-relaxed text-brand-navy-700 outline-none transition placeholder:text-brand-muted-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-brand-muted-500">
                <span>{detailsRequired ? 'At least 20 characters required.' : 'Optional details.'}</span>
                <span className="tabular-nums">{details.length}/1200</span>
              </div>

              {selectedOption.value === 'safety' && (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12.5px] leading-relaxed text-rose-900">
                  Common Ground is not an emergency service. If there is immediate danger, call emergency services. Use the safety guidance already provided by your clinical team and contact the appropriate clinical or medical support when you cannot maintain safety.
                </div>
              )}

              <div className="mt-7 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('reason')}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-brand-muted-700 hover:bg-surface-subtle"
                >
                  <ArrowLeft className="h-4 w-4" /> Change reason
                </button>
                <button
                  type="button"
                  disabled={!canContinueFromDetails}
                  onClick={() => setStep('bandwidth')}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white shadow-soft',
                    canContinueFromDetails ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-stone-300',
                  )}
                >
                  Check my capacity <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          )}

          {step === 'bandwidth' && (
            <section>
              <div className="mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-primary">Your capacity matters</p>
                <h1 className="mt-2 text-2xl font-semibold leading-snug text-brand-navy-700 sm:text-3xl">How much can you realistically carry today?</h1>
                <p className="mt-2 text-[13.5px] leading-relaxed text-brand-muted-600">
                  This controls how many priority actions appear. A lower-capacity day should produce a smaller plan, not more pressure.
                </p>
              </div>
              <BandwidthCheck
                initialInputs={existingBandwidth?.inputs}
                onComplete={(result) => {
                  setBandwidthResult(result);
                  setStep('complete');
                }}
                submitLabel="Use this capacity"
              />
            </section>
          )}

          {step === 'complete' && bandwidthResult && selectedOption && (
            <ResultPanel
              result={bandwidthResult}
              selectedLabel={selectedOption.label}
              onAdjust={() => setStep('details')}
              onContinue={saveUpdate}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function ResultPanel({
  result,
  selectedLabel,
  onAdjust,
  onContinue,
}: {
  result: BandwidthResult;
  selectedLabel: string;
  onAdjust: () => void;
  onContinue: () => void;
}) {
  const theme = TIER_THEME[result.tier];
  const stepLimit = TIER_STEP_LIMIT[result.tier];
  const showSupport = shouldShowSupportCard(result.tier);
  const showCrisis = shouldShowCrisisCallout(result.tier);

  return (
    <div className="space-y-4">
      <section className={cn('rounded-3xl border p-6 shadow-card', theme.bg, theme.border)}>
        <p className={cn('inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]', theme.text)}>
          <CheckCircle2 className="h-4 w-4" /> Ready to rebuild
        </p>
        <h1 className={cn('mt-2 text-2xl font-semibold sm:text-3xl', theme.text)}>{TIER_LABEL[result.tier]}</h1>
        <p className={cn('mt-3 text-sm leading-relaxed', theme.text)}>{TIER_RESULT_COPY[result.tier]}</p>
        <div className="mt-4 rounded-2xl bg-white/65 px-4 py-3 text-[12.5px] leading-relaxed text-brand-navy-700">
          <p><span className="font-semibold">Update requested:</span> {selectedLabel}</p>
          <p className="mt-1">Your rebuilt guide will emphasize up to <span className="font-semibold">{stepLimit}</span> {stepLimit === 1 ? 'priority action' : 'priority actions'} at a time.</p>
        </div>
      </section>

      {showSupport && (
        <section className="rounded-3xl border border-brand-plum-200 bg-brand-plum-50/50 p-5">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
            <LifeBuoy className="h-3.5 w-3.5" /> Support for the parent
          </p>
          <p className="mt-2 text-sm leading-relaxed text-brand-muted-800">
            Your guide will reduce the number of actions and place more emphasis on your own capacity. You can also ask your BCBA for modeling, written steps, and help making the current plan realistic at home.
          </p>
        </section>
      )}

      {showCrisis && (
        <section className="rounded-3xl border border-rose-300 bg-rose-50/70 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-800">If you are in crisis</p>
          <p className="mt-2 text-sm leading-relaxed text-rose-900">
            If you feel unsafe—or you are worried someone else is unsafe—reach a person right now. Call or text 988 in the United States. Common Ground is not a crisis service.
          </p>
          <a href="tel:988" className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
            Call or text 988
          </a>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button type="button" onClick={onAdjust} className="text-sm font-semibold text-brand-muted-600 underline-offset-2 hover:underline">
          Adjust what I shared
        </button>
        <button type="button" onClick={onContinue} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
          <RefreshCw className="h-4 w-4" /> Rebuild my Parent Care Guide
        </button>
      </div>
    </div>
  );
}
