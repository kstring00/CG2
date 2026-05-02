'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Heart,
  Lock,
  Phone,
  Sparkles,
  Wind,
  X,
} from 'lucide-react';
import CrisisPill from '@/components/CrisisPill';
import IntakeFlow, { type IntakeAnswers } from '@/components/IntakeFlow';
import { useParentContext } from '@/lib/useParentContext';
import {
  getRecommendedAction,
  isCalmSignal,
  type TodayAction,
} from '@/lib/getRecommendedAction';

const CREDIBILITY_CHECKS = [
  'Parent mental health tools & therapist referrals',
  'Clinically reviewed by BCBAs at Texas ABA Centers',
  'Free for every family — no sign-up required',
] as const;

const PATH_STEPS = [
  { n: '1', title: 'Understand where you are', desc: 'Quick guidance based on your situation — no jargon.' },
  { n: '2', title: 'Get your next steps', desc: 'Clear, simple actions. No guessing. No overwhelm.' },
  { n: '3', title: 'Find real support', desc: 'Local providers, parent connections, and help for you.' },
] as const;

const GROUNDING_TOOLS = [
  { label: '4-7-8 breathing', time: '2 min', desc: 'Inhale 4, hold 7, exhale 8. Repeat 4×.' },
  { label: '5-4-3-2-1 grounding', time: '5 min', desc: 'Name 5 things you see, hear, feel, smell, taste.' },
  { label: 'One permission', time: '10 sec', desc: '"I am allowed to do this. This is hard and I\'m still a good parent."' },
] as const;

type View = 'hero' | 'intake' | 'recommend';

export default function HomePage() {
  const router = useRouter();
  const { context, clearContext, ready } = useParentContext();
  const [view, setView] = useState<View>('hero');
  const [recommendation, setRecommendation] = useState<TodayAction | null>(null);
  const [welcomeBackDismissed, setWelcomeBackDismissed] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const intakeContainerRef = useRef<HTMLDivElement>(null);
  const recommendCardRef = useRef<HTMLDivElement>(null);

  const hasPriorAnswers =
    ready && Boolean(context.childAge && context.currentSituation);
  const showWelcomeBack =
    view === 'hero' && hasPriorAnswers && !welcomeBackDismissed;

  const showRecommendation = useCallback(
    (situation: string | null) => {
      const action = getRecommendedAction({ currentSituation: situation });
      // /calm bypasses the recommendation card — the parent needs the
      // de-escalation page immediately, not another acknowledgement step.
      if (isCalmSignal(action)) {
        router.push('/calm');
        return;
      }
      setRecommendation(action);
      setView('recommend');
      setAnnouncement(`Recommendation ready: ${action.label}`);
    },
    [router],
  );

  function openIntake() {
    setRecommendation(null);
    setView('intake');
    setAnnouncement('Intake started. Question 1 of 2: How old is your child?');
  }

  function cancelIntake() {
    setView('hero');
    setRecommendation(null);
    setAnnouncement('Intake closed. Returned to homepage.');
  }

  function handleIntakeComplete(answers: IntakeAnswers) {
    showRecommendation(answers.currentSituation);
  }

  function handlePickUpWhereLeftOff() {
    setWelcomeBackDismissed(true);
    showRecommendation(context.currentSituation);
  }

  function handleStartFresh() {
    clearContext();
    setWelcomeBackDismissed(true);
    setRecommendation(null);
    setView('hero');
  }

  function confirmRecommendation() {
    if (!recommendation) return;
    // 'route' is rendered as a <button>, so the router has to do the nav.
    // 'phone' and 'link' are rendered as <a> with the right href/target,
    // so the browser handles them natively — this handler is a no-op there
    // (left as the click hook so analytics or focus management can attach
    // here later without changing the call sites).
    if (recommendation.type === 'route') {
      router.push(recommendation.value);
    }
  }

  function chooseSomethingDifferent() {
    setRecommendation(null);
    setView('intake');
    setAnnouncement('Returned to intake. Question 1 of 2: How old is your child?');
  }

  // Focus management: move focus into the new view after the transition starts.
  useEffect(() => {
    if (view === 'intake') {
      const id = window.requestAnimationFrame(() => {
        const firstButton = intakeContainerRef.current?.querySelector<HTMLButtonElement>(
          'button[aria-pressed]',
        );
        firstButton?.focus();
      });
      return () => window.cancelAnimationFrame(id);
    }
    if (view === 'recommend') {
      const id = window.requestAnimationFrame(() => recommendCardRef.current?.focus());
      return () => window.cancelAnimationFrame(id);
    }
  }, [view]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f4efe8' }}>
      {/* Screen-reader-only announcer for view transitions */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* NAV */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" aria-label="Common Ground home">
            <Image
              src="/logos/cg2-lockup-final.png"
              alt="Texas ABA Centers | Common Ground"
              width={320}
              height={48}
              priority
              className="h-8 w-auto sm:h-9"
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <CrisisPill />
            <Link
              href="/client"
              className="hidden items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent/80 sm:inline-flex"
            >
              <Lock className="h-3.5 w-3.5" /> Client sign in
            </Link>
            <Link
              href="/support/intake"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              Help Me Find My Next Step <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden pt-16" style={{ minHeight: '680px' }}>
        <div className="absolute inset-0">
          <Image
            src="/hero-selected.jpg"
            alt="Father and daughter doing a puzzle with Texas ABA Centers therapy kit"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: '62% 28%' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(8,15,30,0.82) 0%, rgba(8,15,30,0.70) 28%, rgba(8,15,30,0.30) 52%, rgba(8,15,30,0.0) 72%)',
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-20"
            style={{ background: 'linear-gradient(to bottom, rgba(8,15,30,0.55) 0%, transparent 100%)' }}
          />
        </div>

        {/* Welcome-back banner — sits over the photo, below the nav */}
        <AnimatePresence>
          {showWelcomeBack && (
            <motion.div
              key="welcome-back"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-x-0 top-2 z-20 px-4 sm:px-8"
            >
              <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-stone-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 shrink-0 text-brand-plum-600" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-stone-900">Welcome back.</p>
                  <p className="text-xs text-stone-500">
                    Last time you told us <span className="font-medium text-stone-700">{context.childAge}</span>
                    {' · '}
                    <span className="font-medium text-stone-700">{context.currentSituation}</span>.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePickUpWhereLeftOff}
                    className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                  >
                    Pick up where I left off
                  </button>
                  <button
                    type="button"
                    onClick={handleStartFresh}
                    className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                  >
                    Start fresh
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setWelcomeBackDismissed(true)}
                  aria-label="Dismiss welcome back"
                  className="rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex min-h-[620px] items-center py-20 sm:py-28">
            <div className="w-full max-w-[640px]">
              <AnimatePresence mode="wait">
                {view === 'hero' && (
                  <motion.div
                    key="hero-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="max-w-[560px]"
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                      <Heart className="h-3 w-3 text-rose-400" /> Texas ABA Centers · Common Ground
                    </span>
                    <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.07] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                      You don&apos;t have to figure this out alone.
                    </h1>
                    <p className="mt-5 text-xl font-semibold leading-snug text-white sm:text-2xl">
                      Get your next steps now.
                    </p>
                    <p className="mt-3 max-w-md text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                      Common Ground helps parents understand what to do next — with clear guidance, local support, and real help for you, not just your child.
                    </p>

                    <div className="mt-7 flex flex-col gap-2.5 text-sm text-white/80">
                      {CREDIBILITY_CHECKS.map((line) => (
                        <div key={line} className="flex items-center gap-2.5">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-9 flex flex-col items-start gap-3">
                      <Link
                        href="/support/intake"
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-md transition hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                      >
                        Get your next steps <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/support"
                        className="text-sm font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        Or browse support directly →
                      </Link>
                    </div>
                  </motion.div>
                )}

                {view === 'intake' && (
                  <motion.div
                    key="intake-content"
                    ref={intakeContainerRef}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="w-full max-w-2xl"
                  >
                    <button
                      type="button"
                      onClick={cancelIntake}
                      className="mb-3 inline-flex items-center gap-1.5 rounded-md text-xs font-semibold text-white/80 underline-offset-2 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Back to homepage
                    </button>
                    <IntakeFlow onComplete={handleIntakeComplete} />
                  </motion.div>
                )}

                {view === 'recommend' && recommendation && (
                  <motion.div
                    key="recommend-content"
                    ref={recommendCardRef}
                    tabIndex={-1}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="w-full max-w-2xl outline-none"
                  >
                    <RecommendationCard
                      action={recommendation}
                      onConfirm={confirmRecommendation}
                      onBack={chooseSomethingDifferent}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* PATH PREVIEW — what to expect after clicking the CTA */}
      <section className="border-y border-stone-100 bg-white px-6 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {PATH_STEPS.map((step) => (
              <div key={step.n} className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {step.n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{step.title}</p>
                  <p className="mt-0.5 text-sm text-stone-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIET WARMTH */}
      <section className="px-6 py-12 sm:px-8 sm:py-14" style={{ backgroundColor: '#f4efe8' }}>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-plum-600">
              You don&apos;t have to figure this out alone
            </p>
            <h2 className="mt-3 text-2xl font-bold text-stone-900 sm:text-3xl">
              You are part of the plan, too.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
              Common Ground was built by Texas ABA Centers to support whole families — not just clients. The intake adapts to where you are today, so the next step you see is actually yours.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-7">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
              <Wind className="h-3.5 w-3.5" /> If today is hard — right now
            </p>
            <h3 className="mt-2 text-lg font-bold text-stone-900">One breath. One step.</h3>
            <div className="mt-4 space-y-2.5">
              {GROUNDING_TOOLS.map((tool) => (
                <div key={tool.label} className="rounded-2xl border border-stone-200 bg-white p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-stone-900">{tool.label}</span>
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] text-stone-500">{tool.time}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 sm:px-8" style={{ backgroundColor: '#f4efe8' }}>
        <p className="mx-auto max-w-3xl text-center text-xs text-stone-400">
          Powered by <span className="font-semibold text-stone-600">Texas ABA Centers</span> · Common Ground is available to every family in Texas. {' · '}
          <Link href="/privacy" className="underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </main>
  );
}

function RecommendationCard({
  action,
  onConfirm,
  onBack,
}: {
  action: TodayAction;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const isPhone = action.type === 'phone';
  const isLink = action.type === 'link';
  // For 'phone', extract a human-readable form from the tel: URI for the
  // desktop display. e.g. "tel:+18777715725" -> "+1 (877) 771-5725".
  const phoneDisplay = isPhone ? formatPhoneFromTel(action.value) : null;

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-9">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-brand-plum-600">
        <Sparkles className="h-3.5 w-3.5" aria-hidden /> Here&apos;s what we recommend for you
      </p>
      <h2 className="mt-3 text-2xl font-bold leading-tight text-stone-900 sm:text-3xl">
        {action.label}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
        {isPhone
          ? 'Based on what you told us, your most useful next step is a phone call. They will verify your insurance, answer your questions, and schedule your evaluation — no referral needed.'
          : isLink
          ? 'Based on what you told us, this resource is the best place to start right now. It opens in a new tab so you can keep this page handy.'
          : 'Based on what you told us, this part of the site is built for where you are today. We will take you there next.'}
      </p>

      {isPhone && phoneDisplay && (
        <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">
            Texas ABA Centers
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-stone-900 sm:text-3xl">
            {phoneDisplay}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Free call · Mon–Fri · No referral needed
          </p>
        </div>
      )}

      <div className="mt-7 flex flex-col items-start gap-3">
        {isPhone || isLink ? (
          <a
            href={action.value}
            target={isLink ? '_blank' : undefined}
            rel={isLink ? 'noopener noreferrer' : undefined}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            {isPhone ? (
              <>
                <Phone className="h-4 w-4" /> Call now
              </>
            ) : (
              <>
                Open in new tab <ExternalLink className="h-4 w-4" />
              </>
            )}
          </a>
        ) : (
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            Take me there <ArrowRight className="h-4 w-4" />
          </button>
        )}
        {isPhone && (
          <p className="text-xs text-stone-500">
            <span className="sm:hidden">Tap above to open your dialer.</span>
            <span className="hidden sm:inline">
              On a desktop? Dial the number from your phone, or click above if your computer can place calls.
            </span>
          </p>
        )}
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-stone-500 underline-offset-4 transition hover:text-stone-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          Choose something different
        </button>
      </div>
    </div>
  );
}

function formatPhoneFromTel(tel: string): string | null {
  // Accepts forms like "tel:+18777715725", "tel:8777715725"; returns
  // "+1 (877) 771-5725" / "(877) 771-5725". Falls back to the raw string
  // after stripping the scheme if the digit count is unexpected.
  const digits = tel.replace(/^tel:/, '').replace(/[^\d]/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return tel.replace(/^tel:/, '') || null;
}
