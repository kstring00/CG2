'use client';

import Link from 'next/link';
import { useState } from 'react';
import BreathingOrb from '@/components/BreathingOrb';
import { PageTabs } from '@/components/ui/PageTabs';
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  Heart,
  HeartHandshake,
  Leaf,
  Moon,
  Phone,
  Shield,
  Smile,
  Sparkles,
  Sun,
  Wind,
  Users,
  BookOpen,
  Zap,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/* ─── data ─────────────────────────────────────────────────── */

const affirmations = [
  "You are not failing. You are carrying something most people will never understand.",
  "The fact that you're here, looking for help, is proof of how hard you're trying.",
  "Your exhaustion is not weakness — it is evidence of how much you love your child.",
  "You are allowed to grieve the hard moments and still be grateful. Both are true.",
  "Asking for support is not giving up. It is how you keep going.",
];

const burnoutSigns = [
  { label: 'Skipping meals or sleep regularly', icon: Moon },
  { label: 'Feeling short-tempered or emotionally flat', icon: Zap },
  { label: 'Dreading each new day or therapy appointment', icon: Wind },
  { label: 'Feeling like no one understands what this is like', icon: Heart },
  { label: 'Putting your own health off for weeks', icon: Shield },
  { label: 'Feeling guilty for feeling any of the above', icon: Leaf },
  { label: 'Crying without knowing exactly why', icon: Moon },
  { label: 'Feeling disconnected from who you used to be', icon: Brain },
];

const quickTools = [
  {
    title: '4-7-8 Breathing',
    tag: '2 min',
    color: 'emerald',
    isOrb: true,
    steps: [],
    note: '',
  },
  {
    title: '5-4-3-2-1 Grounding',
    tag: '3 min',
    color: 'sky',
    steps: [
      'Name 5 things you can see right now.',
      'Name 4 things you can physically feel (your feet on the floor, your clothes, the air).',
      'Name 3 things you can hear.',
      'Name 2 things you can smell.',
      'Name 1 thing you can taste.',
    ],
    note: 'This interrupts an anxiety spiral by pulling your brain into the present moment. It works even when nothing else does.',
  },
  {
    title: 'Permission Phrase',
    tag: '30 sec',
    color: 'violet',
    steps: [
      'Say this out loud, or write it down:',
      '"I am allowed to be tired."',
      '"I am allowed to need help."',
      '"That does not make me a bad parent."',
      '"I am doing the best I can with what I have."',
    ],
    note: 'Your brain believes what you repeat. This is not a platitude — it is a pattern interrupt for shame spirals.',
  },
  {
    title: 'The One-Thing Rule',
    tag: '5 min',
    color: 'amber',
    steps: [
      'Right now, pick one small thing you can do for yourself today.',
      'Not a list. Not a plan. Just one thing.',
      'A shower. A walk around the block. Five minutes outside.',
      'A cup of coffee while it\'s still hot. One song you love.',
      'Do that one thing. That\'s enough.',
    ],
    note: 'Small acts of self-care are not selfish — they are how you refill so you can keep pouring.',
  },
];

const deepResources = [
  {
    category: 'Find a therapist',
    icon: Brain,
    color: 'plum',
    items: [
      {
        title: 'Psychology Today — Therapist Directory',
        description: 'Filter by your insurance, location, and specialty. Search "autism families," "caregiver stress," or "family therapy." Thousands of listings, most with same-week appointments.',
        url: 'https://www.psychologytoday.com/us/therapists',
        source: 'Psychology Today',
      },
      {
        title: 'Open Path Collective',
        description: 'Sliding-scale therapy for individuals and families. Sessions start at $30–$80 for people who cannot afford standard rates.',
        url: 'https://openpathcollective.org',
        source: 'Open Path',
      },
      {
        title: 'BetterHelp — Online Therapy',
        description: 'Start therapy within 48 hours from anywhere. Financial aid available. Look for therapists who list experience with caregiver burnout or special needs families.',
        url: 'https://www.betterhelp.com',
        source: 'BetterHelp',
      },
    ],
  },
  {
    category: 'Support groups',
    icon: Users,
    color: 'sky',
    items: [
      {
        title: 'NAMI Texas — Family Support Groups',
        description: 'Free peer-led support groups for family members and caregivers. No clinical background required — just shared experience. Available in person and online.',
        url: 'https://namitexas.org',
        source: 'NAMI Texas',
      },
      {
        title: 'Autism Society of America — Family Support',
        description: 'Connect with other families navigating similar journeys. Local chapters across Texas host regular meetings and events.',
        url: 'https://autismsociety.org',
        source: 'Autism Society',
      },
      {
        title: 'Autism Speaks — Caregiver Stress Resources',
        description: 'Practical guides on managing stress, burnout prevention, and building your personal support network. Free and downloadable.',
        url: 'https://www.autismspeaks.org/caregiver-stress',
        source: 'Autism Speaks',
      },
    ],
  },
  {
    category: 'Free reading & guides',
    icon: BookOpen,
    color: 'amber',
    items: [
      {
        title: 'OAR — Parent & Caregiver Guides',
        description: 'Free downloadable guides on routines, transitions, sibling support, and daily caregiver strategies. Written for real families, not clinicians.',
        url: 'https://researchautism.org',
        source: 'Organization for Autism Research',
      },
      {
        title: 'SPARK — Autism Family Community',
        description: 'Expert webinars, research updates, and peer community access. Especially good for parents who want to stay informed on the latest in ABA and autism research.',
        url: 'https://sparkforautism.org',
        source: 'Simons Foundation',
      },
    ],
  },
];

const hopePillars = [
  {
    icon: Sparkles,
    title: 'Progress is not linear — but it is real.',
    body: 'There will be weeks that feel like you\'ve gone backward. Those weeks lie. Every child in ABA therapy shows growth over time. The research is overwhelming. Your child\'s story is not over.',
  },
  {
    icon: Sun,
    title: 'Parents grow through this too.',
    body: 'Families who go through the ABA journey consistently report that it changed them — their patience, their advocacy, their understanding of what really matters. That growth is yours.',
  },
  {
    icon: Smile,
    title: 'The hard seasons have a name — and an end.',
    body: 'Caregiver burnout, grief, isolation — these are documented, understood experiences. They are not permanent states. With support, most parents report finding equilibrium, even joy.',
  },
  // NOTE: 4th pillar ("You are building something that lasts.") removed —
  // duplicate of the closing headline below.
];

const colorMap: Record<string, string> = {
  emerald: 'border-emerald-200 bg-emerald-50',
  sky: 'border-sky-200 bg-sky-50',
  violet: 'border-violet-200 bg-violet-50',
  amber: 'border-amber-200 bg-amber-50',
};

const tagColorMap: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  sky: 'bg-sky-100 text-sky-700',
  violet: 'bg-violet-100 text-violet-700',
  amber: 'bg-amber-100 text-amber-700',
};

const resourceColorMap: Record<string, string> = {
  plum: 'text-brand-plum-600 bg-brand-plum-50 border-brand-plum-200',
  sky: 'text-sky-600 bg-sky-50 border-sky-200',
  amber: 'text-amber-600 bg-amber-50 border-amber-200',
};

/* ─── tabs ──────────────────────────────────────────────────── */

const TABS = [
  { key: 'right-now', label: 'Calm now', helperText: 'Settle your body fast', lazy: true },
  { key: 'burnout-check', label: 'Check my stress', helperText: 'Spot burnout signs early', lazy: true },
  { key: 'tools', label: 'Quick coping tools', helperText: 'Use a reset in under 5 minutes' },
  { key: 'get-help', label: 'Find real support', helperText: 'Connect with people who can help' },
];

/* ─── component ────────────────────────────────────────────── */

export default function CaregiverSupportPage() {
  const [openTool, setOpenTool] = useState<number | null>(0);
  const [openCategory, setOpenCategory] = useState<number | null>(0);
  const [affirmIdx] = useState(() => Math.floor(Math.random() * affirmations.length));
  const [quizChecked, setQuizChecked] = useState<Set<number>>(new Set());

  const toggleQuiz = (i: number) => {
    setQuizChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };
  const quizCount = quizChecked.size;
  const quizResult = quizCount === 0
    ? null
    : quizCount <= 2
    ? { level: 'low', label: 'Some strain', msg: 'You\'re managing, but these feelings are worth paying attention to. Small acts of self-care now prevent bigger depletion later.' }
    : quizCount <= 5
    ? { level: 'mid', label: 'Depletion — not weakness', msg: 'What you\'re feeling has a clinical name: caregiver burnout. It is not a character flaw. It is what happens when you give more than you receive for too long. You need and deserve support.' }
    : { level: 'high', label: 'You are running on empty', msg: 'This level of depletion is serious. Please reach out to someone today — a therapist, your care coordinator, or a crisis line. You cannot keep pouring from an empty cup, and you don\'t have to.' };

  return (
    <div className="page-shell">

      {/* Page header — always visible above the tabs */}
      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1.5 text-xs font-semibold text-brand-plum-700">
          <HeartHandshake className="h-3.5 w-3.5" /> Your mental health
        </div>
        <h1 className="page-title text-3xl font-bold sm:text-4xl">
          You matter in this too.
        </h1>
        <p className="page-description text-base leading-relaxed">
          This page is not about your child&apos;s progress. It is about you — the person holding everything together, often without anyone asking how you&apos;re doing. We&apos;re asking.
        </p>
      </header>

      <section
        aria-label="Start here actions"
        className="mb-8 rounded-3xl border border-surface-border bg-white p-4 shadow-card sm:p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-brand-plum-600" />
          <h2 className="text-base font-semibold text-brand-muted-900 sm:text-lg">Start here</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href="tel:988"
            aria-label="I need help now - call or text 988 crisis support"
            data-track-label="caregiver_start_here_urgent_help_now_988"
            className="inline-flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-left transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            <span className="text-sm font-semibold text-rose-800">I need help now</span>
            <Phone className="h-4 w-4 shrink-0 text-rose-700" />
          </a>
          <Link
            href="/support/connect"
            aria-label="Talk to my care team - open care team connection pathway"
            data-track-label="caregiver_start_here_talk_to_care_team_connect_path"
            className="inline-flex items-center justify-between gap-3 rounded-2xl border border-brand-plum-200 bg-brand-plum-50 px-4 py-3 text-left transition hover:bg-brand-plum-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-plum-500 focus-visible:ring-offset-2"
          >
            <span className="text-sm font-semibold text-brand-plum-800">Talk to my care team</span>
            <HeartHandshake className="h-4 w-4 shrink-0 text-brand-plum-700" />
          </Link>
          <Link
            href="?tab=get-help"
            aria-label="Find local caregiver support - open support directory resources"
            data-track-label="caregiver_start_here_find_local_support_directory_tab"
            className="inline-flex items-center justify-between gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-left transition hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            <span className="text-sm font-semibold text-sky-800">Find local caregiver support</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-sky-700" />
          </Link>
          <Link
            href="?tab=right-now#panel-right-now"
            aria-label="Take a 2-minute reset - open breathing reset tool"
            data-track-label="caregiver_start_here_two_minute_reset_breathing_tool"
            className="inline-flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <span className="text-sm font-semibold text-emerald-800">Take a 2-minute reset</span>
            <Leaf className="h-4 w-4 shrink-0 text-emerald-700" />
          </Link>
        </div>
      </section>

      <PageTabs tabs={TABS}>

        {/* ── Tab 1: Right now ─────────────────────────────────────────── */}
        <>
          {/* Affirmation card */}
          <div className="rounded-3xl border-2 border-brand-plum-200 bg-gradient-to-br from-brand-plum-50 to-white p-6 sm:p-8">
            <div className="flex gap-4">
              <Heart className="mt-1 h-6 w-6 shrink-0 text-brand-plum-400" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-plum-400 mb-2">For you, right now</p>
                <p className="text-lg font-medium leading-relaxed text-brand-plum-900 italic">
                  &ldquo;{affirmations[affirmIdx]}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Breathing tool */}
          <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-brand-muted-900">Need to breathe right now?</h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
              Before anything else — if today is hard, start here. 4-7-8 breathing calms your nervous system in under 2 minutes.
            </p>
            <BreathingOrb />
            <p className="mt-4 text-xs text-brand-muted-500 text-center">Inhale 4 counts · Hold 7 · Exhale 8 · Repeat 4 times</p>
          </section>

          {/* The honest truth block */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
            <h2 className="text-xl font-bold text-brand-muted-900">What nobody tells you about this journey</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Moon, text: 'Loving your child deeply and feeling completely depleted by caregiving are not contradictions. Both are true.' },
                { icon: Wind, text: 'Grief is a normal part of this — grief for the path you expected, and that doesn\'t mean you\'ve given up hope.' },
                { icon: Brain, text: 'Caregiver burnout is a clinical reality. It is not weakness. It is what happens when you give more than you receive for too long.' },
                { icon: Shield, text: 'You are allowed to have needs. You are allowed to ask for help. These are not signs you\'re failing — they\'re signs you\'re human.' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex gap-3 rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum-500" />
                  <p className="text-sm leading-relaxed text-brand-muted-700">{text}</p>
                </div>
              ))}
            </div>
          </section>
        </>

        {/* ── Tab 2: Burnout check ─────────────────────────────────────── */}
        <>
          {/* Framing one-liner — distinguishes chronic from acute check */}
          <p className="text-sm text-brand-muted-500 italic">
            This checks how you&apos;ve been doing over the past few weeks — chronic patterns, not just today.
          </p>

          {/* Burnout quiz */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-brand-plum-600" />
              <h2 className="text-lg font-semibold text-brand-muted-900">Are you running on empty?</h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
              Check everything that feels true right now. No right or wrong answers.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {burnoutSigns.map((item, i) => {
                const checked = quizChecked.has(i);
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => toggleQuiz(i)}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                        checked
                          ? 'border-brand-plum-300 bg-brand-plum-50'
                          : 'border-surface-border bg-surface-muted hover:border-brand-plum-200'
                      }`}
                    >
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                        checked ? 'border-brand-plum-500 bg-brand-plum-500' : 'border-brand-muted-300 bg-white'
                      }`}>
                        {checked && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <item.icon className="h-4 w-4 shrink-0 text-brand-plum-400" />
                      <span className="text-sm text-brand-muted-700">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {quizCount > 0 && (
              <div className={`mt-5 rounded-2xl border p-5 ${
                quizResult?.level === 'high' ? 'border-rose-200 bg-rose-50' :
                quizResult?.level === 'mid' ? 'border-amber-200 bg-amber-50' :
                'border-brand-plum-200 bg-brand-plum-50'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wide ${
                    quizResult?.level === 'high' ? 'text-rose-600' :
                    quizResult?.level === 'mid' ? 'text-amber-700' :
                    'text-brand-plum-700'
                  }`}>{quizCount} of 8 · {quizResult?.label}</span>
                </div>
                <p className={`text-sm leading-relaxed ${
                  quizResult?.level === 'high' ? 'text-rose-800' :
                  quizResult?.level === 'mid' ? 'text-amber-800' :
                  'text-brand-plum-800'
                }`}>{quizResult?.msg}</p>
                {quizResult?.level === 'high' && (
                  <a href="tel:988" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
                    <Phone className="h-3.5 w-3.5" /> Call or text 988
                  </a>
                )}
              </div>
            )}
          </section>
        </>

        {/* ── Tab 3: Tools ─────────────────────────────────────────────── */}
        <>
          {/* Grounding tools accordion */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-brand-muted-900">More tools for hard moments</h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
              Open one and try it before you keep scrolling.
            </p>
            <div className="space-y-3">
              {quickTools.filter(t => !t.isOrb).map((tool, i) => (
                <div
                  key={tool.title}
                  className={`rounded-2xl border transition-all ${openTool === i ? colorMap[tool.color] : 'border-surface-border bg-surface-muted'}`}
                >
                  <button
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                    onClick={() => setOpenTool(openTool === i ? null : i)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tagColorMap[tool.color]}`}>
                        {tool.tag}
                      </span>
                      <span className="text-sm font-semibold text-brand-muted-900">{tool.title}</span>
                    </div>
                    {openTool === i
                      ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
                      : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
                  </button>
                  {openTool === i && (
                    <div className="px-5 pb-5">
                      <ol className="space-y-2">
                        {tool.steps.map((step, j) => (
                          <li key={j} className="flex gap-3 text-sm text-brand-muted-700">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white border border-surface-border text-[11px] font-bold text-brand-muted-400">
                              {j + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                      {tool.note && (
                        <p className="mt-4 text-xs leading-relaxed text-brand-muted-500 italic border-t border-surface-border pt-3">
                          {tool.note}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Hope pillars — first 3 only; 4th ("You are building something that lasts.")
              removed because it duplicates the closing headline in the Get help tab. */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-brand-muted-900">What the other side of this looks like</h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
              This is hard right now. That is real. And it will not always feel this way. Here is what we know from families who have walked this path.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {hopePillars.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-surface-border bg-surface-muted p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-surface-border">
                      <Icon className="h-4 w-4 text-brand-plum-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-muted-900">{title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-brand-muted-600">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>

        {/* ── Tab 4: Get help ──────────────────────────────────────────── */}
        <>
          {/* Therapist finder steps */}
          <section className="rounded-3xl border-2 border-primary/20 bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-brand-muted-900">How to find a therapist — for you</h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
              You spend every day advocating for your child&apos;s care. This is how you advocate for your own. It does not have to be complicated.
            </p>
            <div className="space-y-5">
              {[
                {
                  n: '1',
                  title: 'Give yourself permission',
                  desc: 'You are not taking time away from your child by taking care of yourself. You are protecting your ability to show up for them. That distinction matters.',
                },
                {
                  n: '2',
                  title: 'Check your coverage',
                  desc: 'Private insurance: call the number on the back of your card and ask about "outpatient behavioral health" — most have $0–$30 copays. On Medicaid or CHIP? Search "behavioral health" on your Texas Medicaid portal (tmhp.com) or ask your care coordinator — they can help you find covered providers directly.',
                },
                {
                  n: '3',
                  title: 'Search with intention',
                  desc: 'On Psychology Today, filter by insurance, zip code, and specialty. Search "caregiver stress," "family therapy," or "parents of children with special needs."',
                },
                {
                  n: '4',
                  title: 'Ask your care coordinator',
                  desc: 'Texas ABA Centers care coordinators can help connect you to local therapist referrals. You do not have to search alone — that is part of why we are here.',
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {step.n}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-muted-900">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="https://www.psychologytoday.com/us/therapists"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
            >
              Find a therapist near you <ArrowUpRight className="h-4 w-4" />
            </a>
          </section>

          {/* Resource library */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-brand-muted-900">Full resource library</h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
              Vetted resources specifically for caregivers of children with autism — not generic wellness content. Real tools, real communities, real support.
            </p>
            <div className="space-y-3">
              {deepResources.map((cat, i) => (
                <div key={cat.category} className={`rounded-2xl border transition-all ${openCategory === i ? `border-2 ${resourceColorMap[cat.color].split(' ').slice(1).join(' ')}` : 'border-surface-border bg-surface-muted'}`}>
                  <button
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                    onClick={() => setOpenCategory(openCategory === i ? null : i)}
                  >
                    <div className="flex items-center gap-3">
                      <cat.icon className={`h-4 w-4 shrink-0 ${resourceColorMap[cat.color].split(' ')[0]}`} />
                      <span className="text-sm font-semibold text-brand-muted-900">{cat.category}</span>
                      <span className="rounded-full bg-surface-border px-2 py-0.5 text-[10px] font-semibold text-brand-muted-500">{cat.items.length}</span>
                    </div>
                    {openCategory === i
                      ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
                      : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />
                    }
                  </button>
                  {openCategory === i && (
                    <div className="px-5 pb-5 space-y-3">
                      {cat.items.map((item) => (
                        <div key={item.title} className="rounded-xl border border-surface-border bg-white p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-muted-400">{item.source}</p>
                          <h3 className="mt-1 text-sm font-semibold text-brand-muted-900">{item.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{item.description}</p>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                          >
                            Visit resource <ArrowUpRight className="h-3 w-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Closing */}
          <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-brand-plum-50/40 to-white border border-primary/10 p-8 text-center shadow-soft">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-surface-border shadow-soft mb-5">
              <Heart className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-brand-muted-900">
              You are building something that lasts.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-brand-muted-600">
              Every hard day you push through, every session you show up for, every moment you choose to keep going — it compounds. Your child&apos;s story is not written yet. Neither is yours.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
              >
                Get guided next steps <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/support/connect"
                className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition hover:bg-surface-muted"
              >
                <Users className="h-4 w-4" /> Connect with other families
              </Link>
            </div>
          </div>

          {/* Crisis line */}
          <div className="rounded-2xl border border-surface-border bg-surface-muted px-5 py-4">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted-400" />
              <div>
                <p className="text-xs font-semibold text-brand-muted-500 uppercase tracking-wide mb-1">If you need immediate support</p>
                <p className="text-sm text-brand-muted-600 leading-relaxed">
                  <a href="tel:988" className="font-semibold text-brand-muted-800 hover:underline">988</a> Suicide &amp; Crisis Lifeline — call or text, 24/7 &nbsp;·&nbsp;
                  Crisis Text Line: text <span className="font-semibold text-brand-muted-800">HOME</span> to <span className="font-semibold text-brand-muted-800">741741</span> &nbsp;·&nbsp;
                  <a href="tel:18009506264" className="font-semibold text-brand-muted-800 hover:underline">1-800-950-NAMI</a> (Mon–Fri 10am–10pm)
                </p>
              </div>
            </div>
          </div>
        </>

      </PageTabs>

    </div>
  );
}
