'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Heart,
  HeartHandshake,
  Leaf,
  Phone,
  Shield,
  Sun,
  Users,
  Wind,
} from 'lucide-react';
import BreathingOrb from '@/components/BreathingOrb';

/* ─── data ─────────────────────────────────────────────────── */

const hardFeelings = [
  {
    id: 'screamed',
    title: 'I screamed at my child today.',
    color: 'rose',
    meaning:
      'This is the feeling that sends most parents into a shame spiral — and it is one of the most common experiences caregivers describe when they finally talk honestly. The scream is not about your child. It is the sound of a person who has been carrying more than they can hold, alone, for too long.',
    steps: [
      {
        label: 'Give yourself 20 minutes before you do anything.',
        detail:
          'Do not rush the repair conversation while you are still flooded. A regulated parent is a more effective one.',
      },
      {
        label: 'Say something simple and true.',
        detail:
          'You do not need a speech. "I got really upset and I raised my voice. That wasn\'t okay. I love you." That is enough.',
      },
      {
        label: 'Do not over-apologize.',
        detail:
          'Long, dramatic apologies shift the emotional weight onto your child. They do not need to manage your guilt. A brief, warm repair is more healing.',
      },
      {
        label: 'Then turn toward yourself with the same compassion.',
        detail:
          'The standard you would hold a friend to — that is the standard you deserve right now.',
      },
    ],
    notDoing: 'Spiraling into shame, replaying it for hours, deciding this makes you a bad parent.',
  },
  {
    id: 'leaving',
    title: 'I thought about leaving.',
    color: 'amber',
    meaning:
      'The fantasy of escape — of getting in your car and just driving, of a life without appointments and meltdowns and IEPs — is not a sign that you want to abandon your child. It is a sign that you are depleted. It is your nervous system asking for relief. That is human, and it is okay.',
    steps: [
      {
        label: 'Name the feeling out loud.',
        detail:
          '"I am so depleted I can barely think straight." Naming it takes away some of its power.',
      },
      {
        label: 'Ask what you actually need.',
        detail:
          'Usually the fantasy is about rest, silence, or feeling like yourself again — not about your child. What small version of that can you get today?',
      },
      {
        label: 'Tell someone.',
        detail:
          'A therapist, a trusted friend, your partner. Carrying this alone makes it heavier. Speaking it out loud, even once, helps.',
      },
    ],
    notDoing: 'Treating this thought as evidence you are a terrible person. You are not. You are exhausted.',
  },
  {
    id: 'identity',
    title: "I don't recognize myself anymore.",
    color: 'violet',
    meaning:
      'Caregiving at this intensity reshapes your life — your schedule, your social world, your sense of who you are outside of this role. Feeling like a stranger to yourself is not a personal failure. It is what prolonged, high-demand caregiving does to the self over time.',
    steps: [
      {
        label: 'Name one thing that used to be yours.',
        detail:
          'A hobby, a friendship, a food you loved, a way you used to spend a Saturday. Write it down. It still belongs to you.',
      },
      {
        label: 'Protect one small piece of that, this week.',
        detail:
          'Not a full reclamation. Not a plan. Just one hour, one call, one walk. Identity is rebuilt in small acts.',
      },
      {
        label: 'Consider talking to a therapist — for you.',
        detail:
          'Identity loss in caregivers is well-documented and treatable. This is not self-indulgence. It is maintenance.',
      },
    ],
    notDoing: 'Convincing yourself you have to wait until things are "better" to deserve your own life back.',
  },
  {
    id: 'resentment',
    title: 'I resent my child sometimes.',
    color: 'sky',
    meaning:
      'This is the feeling almost no one admits. And it is one of the most important things to name honestly. Resentment is not hatred. It is not a wish that your child were different. It is the feeling of a person whose needs have been invisible for so long that they have started to turn inward. You can love your child profoundly and still feel the weight of what this has cost you. Both are true.',
    steps: [
      {
        label: 'Stop treating this feeling as evidence of something.',
        detail:
          'The fact that you feel resentment sometimes does not mean you are a bad parent. It means you are human and depleted.',
      },
      {
        label: 'Ask who is seeing your needs.',
        detail:
          'Resentment grows in the gap between how much you give and how much you receive. That gap is the actual problem.',
      },
      {
        label: 'Find a therapist who works with caregivers.',
        detail:
          'This is not a conversation to have alone inside your own head. A professional can help you hold it without it breaking you.',
      },
    ],
    notDoing: 'Treating this feeling as shameful or secret. It is far more common than anyone says.',
  },
  {
    id: 'alone',
    title: 'I feel completely alone.',
    color: 'emerald',
    meaning:
      'There is a particular loneliness to this journey — the wall between you and people who have not lived it. Your friends try. Your family tries. And still you are in a room where no one quite speaks your language. That isolation is real, and it compounds everything else.',
    steps: [
      {
        label: 'Find one person who gets it.',
        detail:
          'A parent support group, an online community, another family in the waiting room at therapy — one person who has been there changes everything.',
      },
      {
        label: 'Let the people who love you try again.',
        detail:
          'Not to understand everything — but to show up. Sometimes telling someone "I don\'t need you to fix it. I just need you to sit with me." is enough.',
      },
      {
        label: 'Consider the NAMI helpline or a caregiver-specific therapist.',
        detail:
          'Trained listeners who understand caregiver experiences, available now. You do not have to explain from the beginning.',
      },
    ],
    notDoing: 'Waiting until you are less tired, less busy, or less behind before reaching out to anyone.',
  },
];

const colorMap: Record<string, { border: string; bg: string; iconText: string; badgeBg: string; badgeText: string }> = {
  rose:    { border: 'border-rose-200',    bg: 'bg-rose-50',    iconText: 'text-rose-500',    badgeBg: 'bg-rose-100',    badgeText: 'text-rose-700'    },
  amber:   { border: 'border-amber-200',   bg: 'bg-amber-50',   iconText: 'text-amber-500',   badgeBg: 'bg-amber-100',   badgeText: 'text-amber-700'   },
  violet:  { border: 'border-violet-200',  bg: 'bg-violet-50',  iconText: 'text-violet-500',  badgeBg: 'bg-violet-100',  badgeText: 'text-violet-700'  },
  sky:     { border: 'border-sky-200',     bg: 'bg-sky-50',     iconText: 'text-sky-500',     badgeBg: 'bg-sky-100',     badgeText: 'text-sky-700'     },
  emerald: { border: 'border-emerald-200', bg: 'bg-emerald-50', iconText: 'text-emerald-500', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700' },
};

const warningSigns = [
  'You\'ve been short-tempered with your child more than once today.',
  'You feel like you\'re going through the motions but not really present.',
  'You\'re skipping meals or forgetting to drink water.',
  'You dread waking up in the morning.',
  'You can\'t remember the last time you laughed.',
  'You\'ve been crying in private and not sure why.',
  'You feel angry at people who aren\'t doing anything wrong.',
  'You have a persistent sense that no one understands what this is like.',
];

const permissionSlips = [
  'You are allowed to order food instead of cooking.',
  'You are allowed to put on a movie and lie on the couch.',
  'You are allowed to cry in your car.',
  'You are allowed to ask for help.',
  'You are allowed to say no to one thing today.',
  'You are allowed to have had a terrible day and still be a good parent.',
];

const afterBreakdownSteps = [
  {
    label: 'Hydrate and sit down.',
    detail: 'A glass of water and a chair. Before anything else. Your nervous system needs to know the emergency is over.',
  },
  {
    label: 'Tell yourself what you would tell a friend.',
    detail: 'Say it out loud if you can: "You are not a bad parent. You are a person who ran out of capacity. Those are different."',
  },
  {
    label: 'Text one person.',
    detail: 'You do not have to explain everything. "Rough day. Just needed to tell someone." That is enough of a reach.',
  },
  {
    label: 'Do one thing in the next hour that is purely for you.',
    detail: 'A shower, a walk around the block, five minutes outside, a song you love. Not productive. Just yours.',
  },
  {
    label: 'Decide to repair, and then let it be tomorrow\'s job.',
    detail: 'You will reconnect with your child. You will say what needs to be said. But you are allowed to take tonight to refill first.',
  },
];

const repairConversation = [
  { q: 'What to say', a: '"I got really overwhelmed and I raised my voice / said something sharp / lost my patience. That wasn\'t okay. I\'m sorry. I love you."' },
  { q: 'When to say it', a: 'When you are regulated — not immediately after, not while you are still flooded. An hour later or the next morning is fine.' },
  { q: 'How long it needs to be', a: 'Short. Children do not need a long explanation. Warmth and repair matter more than eloquence.' },
  { q: 'What to know', a: 'Children are remarkably resilient. A parent who repairs is teaching something powerful: that relationships can survive hard moments. That lesson lasts.' },
];

const resources = [
  {
    name: '988 Suicide & Crisis Lifeline',
    detail: 'Call or text 988 — 24/7. For any emotional crisis, not only suicidal thoughts.',
    action: 'tel:988',
    actionLabel: 'Call or text 988',
    icon: Phone,
    color: 'rose',
  },
  {
    name: 'Crisis Text Line',
    detail: 'Text HOME to 741741. Free, confidential, 24/7.',
    action: null,
    actionLabel: 'Text HOME to 741741',
    icon: Phone,
    color: 'rose',
  },
  {
    name: 'NAMI Helpline',
    detail: 'Mon–Fri, 10am–10pm ET. Trained specialists for mental health support.',
    action: 'tel:18009506264',
    actionLabel: '1-800-950-NAMI',
    icon: Users,
    color: 'sky',
  },
  {
    name: 'Harris Center (Houston)',
    detail: 'Local crisis support for Harris County families.',
    action: 'tel:7139707000',
    actionLabel: '(713) 970-7000',
    icon: Shield,
    color: 'sky',
  },
  {
    name: 'Psychology Today — Find a Therapist',
    detail: 'Filter by insurance, location, and specialty. Thousands of listings, many with same-week availability.',
    action: 'https://www.psychologytoday.com/us/therapists',
    actionLabel: 'Find a therapist',
    icon: ExternalLink,
    color: 'plum',
    external: true,
  },
  {
    name: 'Texas ABA Centers — Care Coordinator',
    detail: 'Your child\'s care coordinator can connect you to local therapist referrals and family support resources.',
    action: '/support/connect',
    actionLabel: 'Talk to your coordinator',
    icon: Heart,
    color: 'plum',
    internal: true,
  },
];

const resourceColorMap: Record<string, { border: string; bg: string; iconBg: string; iconText: string; text: string }> = {
  rose: { border: 'border-rose-200', bg: 'bg-rose-50', iconBg: 'bg-rose-100', iconText: 'text-rose-600', text: 'text-rose-800' },
  sky:  { border: 'border-sky-200',  bg: 'bg-sky-50',  iconBg: 'bg-sky-100',  iconText: 'text-sky-600',  text: 'text-sky-800'  },
  plum: { border: 'border-brand-plum-200', bg: 'bg-brand-plum-50', iconBg: 'bg-brand-plum-100', iconText: 'text-brand-plum-600', text: 'text-brand-plum-800' },
};

/* ─── warning sign score messages ────────────────────────────── */

function getWarningMessage(count: number) {
  if (count === 0) return null;
  if (count <= 2) return {
    text: 'You\'re noticing the early signals. That awareness matters. Take something small off your plate today if you can.',
    color: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  };
  if (count <= 4) return {
    text: 'Several of these are true for you right now. Please reach out to someone today — a friend, your partner, or your child\'s care coordinator. You don\'t have to wait until it\'s worse.',
    color: 'border-amber-200 bg-amber-50 text-amber-800',
  };
  if (count <= 6) return {
    text: 'You are carrying a lot right now. This is not sustainable alone, and you don\'t have to make it so. Please consider calling NAMI at 1-800-950-NAMI or reaching out to a therapist this week.',
    color: 'border-rose-200 bg-rose-50 text-rose-800',
  };
  return {
    text: 'You are in a very hard place right now. Please reach out today — to 988, to NAMI (1-800-950-NAMI), or to someone you trust. You matter. Your wellbeing is not optional.',
    color: 'border-rose-300 bg-rose-100 text-rose-900',
  };
}

/* ─── component ─────────────────────────────────────────────── */

export default function HardDaysPage() {
  const [openFeeling, setOpenFeeling] = useState<string | null>(null);
  const [checkedSigns, setCheckedSigns] = useState<Record<number, boolean>>({});

  const checkedCount = Object.values(checkedSigns).filter(Boolean).length;
  const warningMessage = getWarningMessage(checkedCount);

  function toggleSign(i: number) {
    setCheckedSigns((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div className="page-shell">

      {/* ══════════════════════════════════════════
          SECTION 1 — IMMEDIATE
      ══════════════════════════════════════════ */}

      {/* Hero header */}
      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1.5 text-xs font-semibold text-brand-plum-700">
          <Heart className="h-3.5 w-3.5" /> For your hardest moments
        </div>
        <h1 className="page-title text-3xl font-bold sm:text-4xl">
          You are not alone in this moment.
        </h1>
        <p className="page-description text-base leading-relaxed">
          This page is for the 2am moments, the days you feel like you&apos;re breaking, and the feelings
          you&apos;re afraid to say out loud. There is no judgment here. Only presence.
        </p>
      </header>

      {/* Anchor nav — parent at 10:47pm can jump directly to what they need */}
      <nav className="rounded-2xl border border-surface-border bg-white px-4 py-3 shadow-sm">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-brand-muted-400">Jump to</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Breathe', href: '#breathe' },
            { label: 'Crisis line', href: '#crisis' },
            { label: 'I feel...', href: '#feelings' },
            { label: 'First hour after a breakdown', href: '#breakdown' },
            { label: 'Repair conversation', href: '#repair' },
            { label: 'Get help today', href: '#support' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="rounded-xl border border-surface-border bg-surface-muted px-3 py-1.5 text-xs font-medium text-brand-muted-600 transition hover:border-primary/30 hover:text-primary"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* Breathing tool — first thing, for the parent who is flooded right now */}
      <section id="breathe" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Start here — breathe first</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          If you are flooded right now, your brain cannot process information until your nervous system calms down. This takes 2 minutes.
        </p>
        <BreathingOrb />
        <p className="mt-4 text-xs text-brand-muted-500 text-center">Inhale 4 counts · Hold 7 · Exhale 8 · Repeat 4 times</p>
      </section>

      {/* Crisis card */}
      <div id="crisis" className="rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100">
            <Phone className="h-5 w-5 text-rose-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-500 mb-1">
              If you need support right now
            </p>
            <p className="text-base font-semibold text-rose-900 leading-relaxed">
              Call or text{' '}
              <a href="tel:988" className="underline underline-offset-2 hover:text-rose-700">
                988
              </a>{' '}
              &nbsp;·&nbsp; Crisis Text Line: text{' '}
              <span className="font-bold">HOME</span> to{' '}
              <span className="font-bold">741741</span>
            </p>
            <p className="mt-1.5 text-sm text-rose-700 leading-relaxed">
              These lines are for anyone in emotional distress — not only people in immediate danger.
              You are allowed to call because you are having a hard night.
            </p>
          </div>
        </div>
      </div>

      {/* 3-step immediate reset */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Wind className="h-5 w-5 text-brand-plum-500" />
          <h2 className="text-lg font-semibold text-brand-muted-900">For right now — before anything else</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
          Three things. That is all. You do not have to fix anything else in the next five minutes.
        </p>
        <div className="space-y-4">
          {[
            {
              n: '1',
              label: 'Put your phone face-down.',
              detail: 'Just for a moment. Nothing needs a response right now.',
            },
            {
              n: '2',
              label: 'Put both feet flat on the floor.',
              detail: 'Feel the floor under you. Solid. Present. Still there.',
            },
            {
              n: '3',
              label: 'Say this out loud:',
              detail: '"This moment will pass. I have survived hard days before."',
              quote: true,
            },
          ].map((step) => (
            <div key={step.n} className="flex gap-4 rounded-2xl border border-surface-border bg-surface-muted p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-plum-600 text-sm font-bold text-white">
                {step.n}
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">{step.label}</p>
                <p className={`mt-1 text-sm leading-relaxed ${step.quote ? 'text-brand-plum-700 font-medium italic' : 'text-brand-muted-600'}`}>
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — THE HARD FEELINGS
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          The feelings no one names
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <HeartHandshake className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">If you&apos;ve felt this — you are not a bad parent.</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
          These are the things caregivers say when they finally feel safe enough to say them. Open the ones
          that feel true. You will find what this feeling actually means, and what to do with it.
        </p>
        <div className="space-y-3">
          {hardFeelings.map((feeling) => {
            const c = colorMap[feeling.color];
            const isOpen = openFeeling === feeling.id;
            return (
              <div
                key={feeling.id}
                className={`rounded-2xl border-2 transition-all ${isOpen ? `${c.border} ${c.bg}` : 'border-surface-border bg-surface-muted'}`}
              >
                <button
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  onClick={() => setOpenFeeling(isOpen ? null : feeling.id)}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-brand-muted-900 leading-snug">
                    {feeling.title}
                  </span>
                  {isOpen
                    ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
                    : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 space-y-5">
                    {/* What this actually means */}
                    <div className="rounded-xl border border-white/60 bg-white/70 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400 mb-2">
                        What this actually means
                      </p>
                      <p className="text-sm leading-relaxed text-brand-muted-700">{feeling.meaning}</p>
                    </div>

                    {/* What to do */}
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400 mb-3">
                        What to do with it
                      </p>
                      <div className="space-y-3">
                        {feeling.steps.map((step, i) => (
                          <div key={i} className="flex gap-3">
                            <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${c.iconText}`} />
                            <div>
                              <p className="text-sm font-semibold text-brand-muted-900">{step.label}</p>
                              <p className="mt-0.5 text-sm leading-relaxed text-brand-muted-600">{step.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* What NOT to do */}
                    <div className="rounded-xl border border-surface-border bg-white/50 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400 mb-1.5">
                        What not to do
                      </p>
                      <p className="text-sm leading-relaxed text-brand-muted-600 italic">{feeling.notDoing}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — THE NEXT 24 HOURS
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          The next 24 hours
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* First hour after a breakdown */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">The first hour after a breakdown</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
          Five specific things. Do them in order if you can. Skip any one that doesn&apos;t fit your situation.
        </p>
        <div className="space-y-4">
          {afterBreakdownSteps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-plum-50 border border-brand-plum-200 text-sm font-bold text-brand-plum-700">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">{step.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Repair conversation */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-rose-500" />
          <h2 className="text-lg font-semibold text-brand-muted-900">The repair conversation with your child</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
          Children are more resilient than we give them credit for. A parent who repairs teaches
          something that lasts: that love survives hard moments. Here is how to do it simply.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {repairConversation.map(({ q, a }) => (
            <div key={q} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-plum-500 mb-2">{q}</p>
              <p className="text-sm leading-relaxed text-brand-muted-700">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What NOT to do */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-brand-muted-900">What not to do after a hard day</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { label: 'Spiral into shame', detail: 'The shame loop does not protect your child from future hard days. Self-compassion does.' },
            { label: 'Make big decisions', detail: 'Hard days are not the right time to decide anything about your child\'s care, your relationship, or your life.' },
            { label: 'Isolate completely', detail: 'Closing every door makes tomorrow harder. Even a text counts as connection.' },
            { label: 'Stay up past midnight replaying it', detail: 'Sleep deprivation makes everything feel more permanent than it is. The replays will still be there tomorrow.' },
          ].map(({ label, detail }) => (
            <div key={label} className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-amber-900">{label}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-amber-800">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Permission slips */}
      <section className="rounded-3xl border-2 border-brand-plum-200 bg-gradient-to-br from-brand-plum-50 to-white p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="h-5 w-5 text-brand-plum-500" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Permission slips — for today</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          These are things you are explicitly, genuinely allowed to do. Not as a reward. As a right.
        </p>
        <ul className="space-y-3">
          {permissionSlips.map((slip) => (
            <li key={slip} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum-400" />
              <p className="text-sm leading-relaxed text-brand-plum-800">{slip}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — BUILDING RESILIENCE
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          Building resilience
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* What makes hard days easier */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Sun className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-brand-muted-900">What makes the next hard day less hard</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
          Hard days will come again. That is not pessimism — it is the reality of this kind of caregiving.
          What changes is how much capacity you have to meet them.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Shield,
              title: 'Predictability',
              body: 'Routines reduce the cognitive load of caregiving. When the structure holds, you spend less energy on decisions and more on being present.',
            },
            {
              icon: Users,
              title: 'A support system',
              body: 'Not just someone to call in an emergency — people who check in, who offer to help before you ask, who know what your life actually looks like.',
            },
            {
              icon: Heart,
              title: 'Regular, small self-care',
              body: 'Not spa days. A walk. A meal you made for yourself. One hour a week that is only yours. Small, consistent acts refill the well.',
            },
            {
              icon: Leaf,
              title: 'Knowing your warning signs',
              body: 'When you can feel a hard day coming, you have more options. The checklist below helps you develop that awareness.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-3 rounded-2xl border border-surface-border bg-surface-muted p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-surface-border">
                <Icon className="h-4 w-4 text-brand-plum-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Warning signs interactive checklist */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Signs you need support — not just rest</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
          Check anything that feels true. If even one of these resonates, that is enough reason to reach out today.
          You do not have to earn the right to ask for help.
        </p>
        <ul className="space-y-3 mb-6">
          {warningSigns.map((sign, i) => (
            <li key={i}>
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-surface-border bg-surface-muted px-4 py-3 transition-colors hover:bg-brand-plum-50 hover:border-brand-plum-200">
                <input
                  type="checkbox"
                  checked={!!checkedSigns[i]}
                  onChange={() => toggleSign(i)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-muted-400 accent-brand-plum-600 cursor-pointer"
                />
                <span className="text-sm leading-relaxed text-brand-muted-700">{sign}</span>
              </label>
            </li>
          ))}
        </ul>
        {warningMessage && (
          <div className={`rounded-2xl border-2 p-4 ${warningMessage.color}`}>
            <div className="flex items-start gap-3">
              <Heart className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-sm font-semibold mb-1">
                  {checkedCount} of 8 — {checkedCount <= 2 ? 'Early signals' : checkedCount <= 4 ? 'Moderate depletion' : checkedCount <= 6 ? 'High load' : 'Crisis zone'}
                </p>
                <p className="text-sm leading-relaxed">{warningMessage.text}</p>
              </div>
            </div>
          </div>
        )}
        {checkedCount === 0 && (
          <p className="text-xs text-brand-muted-400 italic text-center">
            Check anything that is true for you right now.
          </p>
        )}
      </section>

      {/* Hard day vs. crisis needing professional help */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-sky-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Hard day vs. crisis that needs professional help</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          There is a difference, and knowing it matters. Both deserve support. One is more urgent.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600 mb-3">A hard day looks like</p>
            <ul className="space-y-2">
              {[
                'Crying, feeling overwhelmed, or losing your temper',
                'Needing to be away from everything for a few hours',
                'Feeling resentful, empty, or hopeless about today',
                'Dreading tomorrow',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-emerald-800">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-emerald-700 italic">
              This is hard and real. Self-care, connection, and rest are the right tools here.
            </p>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-600 mb-3">Please get help today if</p>
            <ul className="space-y-2">
              {[
                'You are having thoughts of hurting yourself or your child',
                'You have not slept or eaten in more than 24 hours',
                'You feel like you cannot keep your child safe',
                'You feel like things will never, ever get better',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-rose-800">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-rose-700 italic">
              Call 988 or text HOME to 741741. You are not broken. You need support right now.
            </p>
          </div>
        </div>
      </section>

      {/* Support */}
      <div id="support" />
      <section className="rounded-3xl border-2 border-primary/20 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Build your support team — before you need it</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
          You should not be assembling your team at 1am in a crisis. Name them now, when you have a moment.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Three people you can call', detail: 'One who will pick up at any hour. One who is practical and can help you make a plan. One who just listens without fixing.' },
            { label: 'One professional resource', detail: 'A therapist, a counselor, a care coordinator, or a crisis line you\'ve already looked up. Have the number somewhere you can find it.' },
            { label: 'One self-care practice', detail: 'Something small and fast that you actually do. Not aspirational — real. A walk, a playlist, a shower, five minutes outside.' },
            { label: 'Your child\'s care coordinator', detail: 'They are one of your best resources for family support referrals. You do not have to navigate this alone — that is part of why they are there.' },
          ].map(({ label, detail }) => (
            <div key={label} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
              <p className="text-sm font-semibold text-brand-muted-900">{label}</p>
              <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — RESOURCES
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          Resources
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">If you need support today</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
          Every resource listed here is real, accessible, and appropriate for caregivers — not only people in
          acute crisis.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {resources.map((res) => {
            const c = resourceColorMap[res.color];
            const Icon = res.icon;
            return (
              <div key={res.name} className={`rounded-2xl border-2 ${c.border} ${c.bg} p-4`}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${c.iconBg}`}>
                    <Icon className={`h-4 w-4 ${c.iconText}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${c.text}`}>{res.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-brand-muted-600">{res.detail}</p>
                    {res.action && (
                      <div className="mt-3">
                        {res.internal ? (
                          <Link
                            href={res.action}
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${c.iconText} hover:underline`}
                          >
                            {res.actionLabel} <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : res.external ? (
                          <a
                            href={res.action}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${c.iconText} hover:underline`}
                          >
                            {res.actionLabel} <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <a
                            href={res.action}
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${c.iconText} hover:underline`}
                          >
                            {res.actionLabel} <ArrowRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    )}
                    {!res.action && res.name === 'Crisis Text Line' && (
                      <p className="mt-3 text-xs font-bold text-rose-700">Text HOME to 741741</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Closing — warm, not alarming */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-plum-50 via-white to-white border border-brand-plum-100 p-8 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-brand-plum-200 shadow-soft mb-5">
          <Heart className="h-6 w-6 text-brand-plum-400" />
        </div>
        <h2 className="text-xl font-bold text-brand-muted-900">
          You are still here. That matters.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-brand-muted-600">
          The fact that you found this page — that you are still looking for something to hold onto — says
          everything about the kind of parent you are. Hard days do not define you. What you do with them does.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/support/caregiver"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-plum-700 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-plum-800"
          >
            Caregiver support tools <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/support/community"
            className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition hover:bg-surface-muted"
          >
            <Users className="h-4 w-4" /> Find your community
          </Link>
        </div>
      </div>

    </div>
  );
}
