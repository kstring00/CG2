'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Moon,
  Sun,
  Wind,
  Brain,
  Clock,
  CheckCircle2,
  AlertCircle,
  Heart,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/* ─── data ─────────────────────────────────────────────────── */

const sleepCheckQuestions = [
  'Do you fall asleep thinking through tomorrow\'s therapy schedule, appointments, or what you need to prepare?',
  'Do you wake up between 2–4am and find yourself unable to stop problem-solving?',
  'Do you sleep with one ear open — even when nothing is happening — because you\'ve learned not to fully relax?',
  'Has it been more than a week since you woke up feeling genuinely rested?',
  'Do you need caffeine within 30 minutes of waking up just to function?',
  'Do you feel more anxious or emotionally fragile in the evenings, even when the day went okay?',
  'Has anyone commented that you seem exhausted, or have you been startled by your own reflection?',
  'Do you feel dread at bedtime — not sleepiness, but a tight, wound-up alertness that won\'t let you land?',
];

function getSleepScore(count: number) {
  if (count === 0) {
    return {
      label: 'Your sleep health looks more intact than most caregivers.',
      message:
        'That is genuinely encouraging. Keep protecting whatever you\'re doing — and revisit this if things change. Sleep is often the first thing to go when stress escalates.',
      color: 'emerald',
    };
  }
  if (count <= 2) {
    return {
      label: 'You\'re showing some early signs of sleep disruption.',
      message:
        'This is the moment to intervene — before patterns calcify. The wind-down routine below is worth trying this week, not someday. Disrupted sleep compounds quickly in caregiving situations.',
      color: 'sky',
    };
  }
  if (count <= 5) {
    return {
      label: 'Your sleep is significantly disrupted.',
      message:
        'This is not a minor inconvenience — this is affecting your brain, your emotional regulation, and your capacity to cope. Please use the resources on this page and consider talking to your doctor. You are not supposed to function like this.',
      color: 'amber',
    };
  }
  return {
    label: 'You are experiencing clinically significant sleep deprivation.',
    message:
      'Six or more of these is a medical situation, not a life-hack problem. Please bring this list to your next doctor\'s appointment and say exactly what you told us. Chronic sleep deprivation at this level requires real intervention — not more discipline or better habits alone.',
    color: 'rose',
  };
}

const windDownSteps = [
  {
    time: 'T–30 min',
    icon: Moon,
    title: 'Phone down, screen off',
    desc: 'Not on silent — down. On the charger, across the room if possible. Every scroll extends your cortisol response by minutes. You cannot wind down a nervous system while feeding it stimulation.',
  },
  {
    time: 'T–25 min',
    icon: Wind,
    title: 'Physical transition',
    desc: 'Warm shower, a cup of non-caffeinated tea, or simply changing into clothes you only sleep in. Your brain responds to physical cues. The ritual of transition signals: the day is over. You are allowed to stop.',
  },
  {
    time: 'T–15 min',
    icon: Brain,
    title: 'Body scan — top to bottom',
    desc: 'Lying down, close your eyes. Start at the crown of your head. Move slowly down — forehead, jaw, shoulders, chest, belly, hips, legs, feet. At each point, notice where you\'re holding tension and consciously release it. You don\'t have to fix it. Just notice and let go.',
  },
  {
    time: 'T–8 min',
    icon: Heart,
    title: 'One thing to release tonight',
    desc: 'Mentally pick one worry that does not need to be solved before morning. Name it — "the IEP meeting," "the behavior at dinner," "the insurance call." Then say, out loud or in your head: "I am putting this down for tonight. It will be there in the morning if it needs me." You are not abandoning the problem. You are protecting your capacity to face it.',
  },
  {
    time: 'T–3 min',
    icon: Sun,
    title: 'One thing you did well today',
    desc: 'Not a big thing. Not a perfect thing. Something small and real — "I stayed regulated during the meltdown," "I remembered to eat lunch," "I made her laugh once." Your brain will look for threats as you fall asleep unless you give it something else to hold. This is that something else.',
  },
];

const childSleepStrategies = [
  {
    icon: Moon,
    title: 'White noise as a shared solution',
    desc: 'A white noise machine in the hallway between your child\'s room and yours can mask sounds that trigger your hypervigilance without preventing you from hearing genuine emergencies. Your nervous system needs plausible deniability that quiet is safe.',
  },
  {
    icon: Clock,
    title: 'Taking turns — actually, not in theory',
    desc: 'If you have a partner, "taking turns" means committing to nights in writing — not negotiating at 2am. Assign Monday/Wednesday/Friday in advance. The parent who is "off" uses earplugs and genuinely sleeps. This only works if both people actually do it.',
  },
  {
    icon: Heart,
    title: 'Asking your ABA team for help',
    desc: 'Sleep disruption in children with autism is one of the most common and most under-addressed issues in ABA. Your BCBA can directly address sleep behaviors — irregular schedules, nighttime awakenings, early waking — as part of your child\'s goals. You do not have to solve this alone.',
  },
  {
    icon: Brain,
    title: 'Safe sleep transitions',
    desc: 'If your child has started coming to your bed and you\'re ready to change that, do it in coordination with your ABA team. Abrupt transitions without support often make sleep worse. A gradual plan with behavioral support is far more sustainable than white-knuckling it alone.',
  },
  {
    icon: Wind,
    title: 'Your child\'s sleep affects your sleep — name it',
    desc: 'If your child\'s sleep disruption is a chronic source of your own sleep deprivation, put it on the agenda at your next care meeting. "My child\'s sleep is disrupting mine, and I cannot function at this level" is a clinical statement that deserves a clinical response.',
  },
];

const mythDebunks = [
  {
    myth: '"I can catch up on sleep over the weekend."',
    truth: 'You cannot. Sleep debt is not a balance you can zero out with a single long Saturday. Chronic sleep deprivation changes your baseline cognitive function, immune response, and emotional regulation in ways that extra sleep on weekends does not fully reverse. Recovery requires consistent sleep, not occasional binges.',
    color: 'rose',
  },
  {
    myth: '"I just need to push through — it\'ll get better when things calm down."',
    truth: 'For caregivers, "when things calm down" is a mirage. There is always another transition, another crisis, another demand. Waiting for the right time to address sleep is how caregivers reach year three running on nothing. The time to address it is now, when you still have something left.',
    color: 'amber',
  },
  {
    myth: '"I sleep — it\'s just not good sleep. That\'s fine."',
    truth: 'Poor sleep quality has virtually identical neurological effects to insufficient sleep quantity. Fragmented sleep — even if you\'re technically in bed for 7 hours — does not allow the brain to complete the sleep cycles required for memory consolidation, emotional regulation, and immune function.',
    color: 'rose',
  },
  {
    myth: '"Melatonin will fix this."',
    truth: 'Melatonin can help with sleep onset but does not address the hypervigilance, anxiety spirals, and nervous-system dysregulation that drive most caregiver sleep disruption. It is a symptom management tool, not a root cause solution. If your sleep is chronically disrupted, the cause needs attention.',
    color: 'amber',
  },
];

const deprivationEffects = [
  {
    icon: Brain,
    title: 'Emotional dysregulation',
    desc: 'After 17–19 hours without sleep, the emotional regulation center of the brain (prefrontal cortex) begins to lose executive control over the threat-response system (amygdala). This is why chronically sleep-deprived caregivers feel like they\'re overreacting — their brain is literally less capable of modulating emotional response.',
  },
  {
    icon: AlertCircle,
    title: 'Memory and decision-making',
    desc: 'Chronic sleep deprivation impairs the hippocampus — the brain structure responsible for encoding new memories and supporting clear thinking. You are not becoming less intelligent. You are sleep deprived. Those are different problems with different solutions.',
  },
  {
    icon: Wind,
    title: 'Immune suppression',
    desc: 'People who sleep fewer than 6 hours per night are significantly more likely to get sick when exposed to a virus. For a caregiver whose own sick days create crisis — this matters.',
  },
  {
    icon: Heart,
    title: 'Erosion of empathy',
    desc: 'Sleep deprivation measurably reduces the brain\'s capacity for empathy and emotional attunement. Caregivers who are chronically sleep-deprived often describe feeling numb, disconnected, or short with their children — not because they\'re bad parents, but because their brain is running on fumes.',
  },
];

const colorMythMap: Record<string, string> = {
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
};

const scoreColorMap: Record<string, { card: string; label: string }> = {
  emerald: { card: 'border-emerald-200 bg-emerald-50', label: 'text-emerald-800' },
  sky: { card: 'border-sky-200 bg-sky-50', label: 'text-sky-800' },
  amber: { card: 'border-amber-200 bg-amber-50', label: 'text-amber-800' },
  rose: { card: 'border-rose-200 bg-rose-50', label: 'text-rose-800' },
};

/* ─── component ────────────────────────────────────────────── */

export default function SleepPage() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(sleepCheckQuestions.map(() => null));
  const [openMythIdx, setOpenMythIdx] = useState<number | null>(null);
  const [openStepIdx, setOpenStepIdx] = useState<number | null>(null);

  const allAnswered = answers.every((a) => a !== null);
  const yesCount = answers.filter((a) => a === true).length;
  const score = allAnswered ? getSleepScore(yesCount) : null;

  function answer(i: number, val: boolean) {
    setAnswers((prev) => prev.map((v, idx) => (idx === i ? val : v)));
  }

  return (
    <div className="page-shell">

      {/* ══════════════════════════════════════════
          SECTION 1 — SEEN
          "We see how bad this actually is."
      ══════════════════════════════════════════ */}

      {/* Hero header */}
      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1.5 text-xs font-semibold text-brand-plum-700">
          <Moon className="h-3.5 w-3.5" /> Sleep for caregivers
        </div>
        <h1 className="page-title text-3xl font-bold sm:text-4xl">
          You are not just tired.
        </h1>
        <p className="page-description text-base leading-relaxed">
          You are running on fumes that ran out months ago — and you&apos;ve somehow kept going anyway.
          Caregiver sleep deprivation is not just about fewer hours. It is a neurologically distinct
          state of chronic dysregulation that is measurably different from normal tiredness.
          It deserves to be taken seriously — by you, and by the people around you.
        </p>
      </header>

      {/* Why caregiver sleep is different */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Why caregiver sleep is uniquely disrupted</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          Regular tiredness responds to rest. Caregiver sleep disruption often doesn&apos;t —
          because the causes are not just logistical. They are neurological.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: AlertCircle,
              color: 'rose',
              title: 'Hypervigilance that doesn\'t clock out',
              desc: 'Your nervous system has been trained — by real experience — that something can go wrong at any time. That threat-alertness doesn\'t switch off when you lie down. It keeps scanning, even in sleep. This is not anxiety disorder. This is an appropriate adaptation to a genuinely demanding situation — but it costs you.',
            },
            {
              icon: Brain,
              color: 'violet',
              title: 'The cognitive backlog of mental load',
              desc: 'ABA caregiving generates enormous cognitive labor: scheduling, data tracking, behavioral observation, insurance navigation, IEP preparation. That load doesn\'t empty at bedtime. It queues up and processes the moment you stop moving.',
            },
            {
              icon: Clock,
              color: 'amber',
              title: 'Your child\'s sleep issues become yours',
              desc: 'Children with autism have rates of sleep disturbance significantly higher than the neurotypical population. Early waking, nighttime wakings, and difficulty settling are common. Every disruption to their sleep is a disruption to yours.',
            },
            {
              icon: Wind,
              color: 'sky',
              title: 'Anxiety spirals at bedtime',
              desc: 'The moment you stop moving, the worry you\'ve been outrunning all day catches up. "Did I handle that right? What if tomorrow is worse? Am I doing enough?" Bedtime becomes an ambush from your own mind — and you lie awake until exhaustion finally wins.',
            },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="flex gap-3 rounded-2xl border border-surface-border bg-surface-muted p-4">
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border bg-white ${
                color === 'rose' ? 'border-rose-200' :
                color === 'violet' ? 'border-violet-200' :
                color === 'amber' ? 'border-amber-200' : 'border-sky-200'
              }`}>
                <Icon className={`h-4 w-4 ${
                  color === 'rose' ? 'text-rose-500' :
                  color === 'violet' ? 'text-violet-500' :
                  color === 'amber' ? 'text-amber-500' : 'text-sky-500'
                }`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — GROUNDED
          Interactive sleep quality check
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          Self-check
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* Interactive sleep quality check */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Sleep quality self-check</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
          Answer honestly — no one is keeping score except you. These are specific, caregiver-specific
          indicators, not generic sleep questions.
        </p>
        <div className="space-y-3">
          {sleepCheckQuestions.map((question, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-4 transition-all ${
                answers[i] === true
                  ? 'border-rose-200 bg-rose-50'
                  : answers[i] === false
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-surface-border bg-surface-muted'
              }`}
            >
              <p className={`text-sm leading-relaxed mb-3 ${
                answers[i] === true
                  ? 'text-rose-800 font-medium'
                  : answers[i] === false
                  ? 'text-emerald-800'
                  : 'text-brand-muted-700'
              }`}>
                {i + 1}. {question}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => answer(i, true)}
                  className={`rounded-xl border px-4 py-1.5 text-sm font-semibold transition-all ${
                    answers[i] === true
                      ? 'border-rose-400 bg-rose-500 text-white'
                      : 'border-surface-border bg-white text-brand-muted-700 hover:border-rose-300 hover:text-rose-700'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => answer(i, false)}
                  className={`rounded-xl border px-4 py-1.5 text-sm font-semibold transition-all ${
                    answers[i] === false
                      ? 'border-emerald-400 bg-emerald-500 text-white'
                      : 'border-surface-border bg-white text-brand-muted-700 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 rounded-full bg-surface-border h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-plum-500 transition-all duration-300"
              style={{ width: `${(answers.filter((a) => a !== null).length / sleepCheckQuestions.length) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-brand-muted-400">
            {answers.filter((a) => a !== null).length}/{sleepCheckQuestions.length}
          </span>
        </div>

        {/* Result */}
        {score && (
          <div className={`mt-5 rounded-2xl border p-5 transition-all ${scoreColorMap[score.color].card}`}>
            <div className="flex items-start gap-3">
              {score.color === 'emerald' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle className={`mt-0.5 h-5 w-5 shrink-0 ${
                  score.color === 'rose' ? 'text-rose-500' :
                  score.color === 'amber' ? 'text-amber-500' : 'text-sky-500'
                }`} />
              )}
              <div>
                <p className={`text-sm font-semibold mb-1 ${scoreColorMap[score.color].label}`}>
                  {yesCount} of 8 — {score.label}
                </p>
                <p className={`text-sm leading-relaxed ${scoreColorMap[score.color].label} opacity-90`}>
                  {score.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 10-minute wind-down routine */}
      <section className="rounded-3xl border-2 border-primary/20 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Moon className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-brand-muted-900">The 10-minute wind-down routine</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          This is specific and sequential. It is not about creating the perfect sleep environment.
          It is about giving your nervous system a structured off-ramp from a day that asked too much.
        </p>
        <div className="space-y-3">
          {windDownSteps.map((step, i) => (
            <div
              key={step.title}
              className={`rounded-2xl border transition-all ${
                openStepIdx === i
                  ? 'border-brand-plum-200 bg-brand-plum-50'
                  : 'border-surface-border bg-surface-muted'
              }`}
            >
              <button
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                onClick={() => setOpenStepIdx(openStepIdx === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-brand-plum-100 px-2.5 py-0.5 text-[11px] font-semibold text-brand-plum-700">
                    {step.time}
                  </span>
                  <div className="flex items-center gap-2">
                    <step.icon className="h-4 w-4 text-brand-muted-500" />
                    <span className="text-sm font-semibold text-brand-muted-900">{step.title}</span>
                  </div>
                </div>
                {openStepIdx === i
                  ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
                  : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
              </button>
              {openStepIdx === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm leading-relaxed text-brand-muted-700">{step.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-brand-muted-500 italic border-t border-surface-border pt-4">
          You will not do this perfectly every night. That is not the goal. The goal is to do it
          enough nights that your nervous system starts to recognize the pattern as a signal.
          Consistency over perfection.
        </p>
      </section>

      {/* When your child's sleep disrupts yours */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">When your child&apos;s sleep disrupts yours</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          Managing your sleep in isolation from your child&apos;s sleep issues is often impossible.
          These strategies address the problem at the source.
        </p>
        <div className="space-y-3">
          {childSleepStrategies.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 rounded-2xl border border-surface-border bg-surface-muted p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-surface-border">
                <Icon className="h-4 w-4 text-brand-plum-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Myths debunked */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-rose-500" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Sleep myths that are keeping you stuck</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          Some of what you believe about sleep was wrong before caregiving. In a caregiving context,
          it&apos;s actively dangerous. These are the four most common, with the actual research.
        </p>
        <div className="space-y-3">
          {mythDebunks.map((myth, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all ${
                openMythIdx === i ? colorMythMap[myth.color] : 'border-surface-border bg-surface-muted'
              }`}
            >
              <button
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                onClick={() => setOpenMythIdx(openMythIdx === i ? null : i)}
              >
                <span className="text-sm font-semibold text-brand-muted-900 italic">{myth.myth}</span>
                {openMythIdx === i
                  ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
                  : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
              </button>
              {openMythIdx === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm leading-relaxed">{myth.truth}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* What chronic deprivation does to your brain */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">What chronic sleep deprivation does to a caregiver&apos;s brain</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          This is not meant to alarm you. It is meant to help you understand that what you&apos;re
          experiencing is not a character flaw — it is a physiological consequence of an impossible
          situation.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {deprivationEffects.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3 rounded-2xl border border-surface-border bg-surface-muted p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-surface-border">
                <Icon className="h-4 w-4 text-brand-plum-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — HOPEFUL
          Medical note + resources
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          Please read this
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* Medical note */}
      <div className="rounded-3xl border-2 border-amber-300 bg-amber-50 p-6 sm:p-8">
        <div className="flex gap-4">
          <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold text-amber-900 mb-2">
              If you haven&apos;t slept properly in months — please bring this up with your doctor.
              It is a medical issue.
            </p>
            <p className="text-sm leading-relaxed text-amber-800">
              Chronic sleep deprivation is not a willpower problem or a time management problem.
              At clinical levels, it requires clinical attention — not just better habits. Your
              doctor can help with referrals to sleep specialists, short-term medication support
              if appropriate, and behavioral sleep interventions that actually work.
              You do not have to keep managing this alone.
            </p>
            <p className="mt-3 text-sm font-semibold text-amber-900">
              What to say at your appointment:{' '}
              <span className="font-normal italic">
                &ldquo;I haven&apos;t slept properly in [months]. My child&apos;s needs are
                disrupting my sleep and I cannot regulate emotionally. I need help with this.&rdquo;
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Resources */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Sun className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Resources — going deeper</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              source: 'Sleep Foundation',
              title: 'Caregiver Sleep Guides',
              desc: 'Evidence-based guides specifically covering caregiver sleep disruption, hypervigilance, and practical interventions.',
              url: 'https://www.sleepfoundation.org/sleep-hygiene/caregiver-sleep',
              color: 'sky',
            },
            {
              source: 'American Academy of Sleep Medicine',
              title: 'Find a Sleep Specialist',
              desc: 'Board-certified sleep medicine physicians who can diagnose and treat chronic sleep disorders. Searchable by zip code.',
              url: 'https://sleepeducation.org/find-a-sleep-center/',
              color: 'violet',
            },
            {
              source: 'Autism Speaks',
              title: 'Sleep Tool Kit for Families',
              desc: 'Free downloadable guide covering sleep strategies for children with autism — which directly impacts caregiver sleep.',
              url: 'https://www.autismspeaks.org/tool-kit/autism-and-sleep',
              color: 'emerald',
            },
            {
              source: 'Psychology Today',
              title: 'Sleep Therapist Directory',
              desc: 'Filter for therapists specializing in insomnia, sleep disorders, and caregiver stress. Many offer telehealth.',
              url: 'https://www.psychologytoday.com/us/therapists',
              color: 'amber',
            },
          ].map((res) => (
            <div key={res.title} className={`rounded-2xl border p-4 ${
              res.color === 'sky' ? 'border-sky-200 bg-sky-50' :
              res.color === 'violet' ? 'border-violet-200 bg-violet-50' :
              res.color === 'emerald' ? 'border-emerald-200 bg-emerald-50' :
              'border-amber-200 bg-amber-50'
            }`}>
              <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${
                res.color === 'sky' ? 'text-sky-600' :
                res.color === 'violet' ? 'text-violet-600' :
                res.color === 'emerald' ? 'text-emerald-600' :
                'text-amber-600'
              }`}>
                {res.source}
              </p>
              <p className="text-sm font-semibold text-brand-muted-900 mb-1">{res.title}</p>
              <p className="text-sm leading-relaxed text-brand-muted-600 mb-3">{res.desc}</p>
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                Visit resource <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-brand-plum-50/40 to-white border border-primary/10 p-8 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-surface-border shadow-soft mb-5">
          <Moon className="h-6 w-6 text-brand-plum-500" />
        </div>
        <h2 className="text-xl font-bold text-brand-muted-900">
          Rest is not a reward for finishing. It is a requirement for continuing.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-brand-muted-600">
          You cannot pour from a vessel that was empty months ago. Sleep is not self-indulgence.
          It is maintenance — the minimum viable condition for functioning as a parent, a person,
          and a caregiver. You are allowed to protect it.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/support/caregiver"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
          >
            Caregiver support hub <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/support/caregiver/identity"
            className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition hover:bg-surface-muted"
          >
            <Heart className="h-4 w-4" /> Caregiver identity
          </Link>
        </div>
      </div>

    </div>
  );
}
