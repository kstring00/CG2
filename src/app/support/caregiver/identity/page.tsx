'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Sparkles,
  Heart,
  User,
  Star,
  Music,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sun,
  Compass,
} from 'lucide-react';
import { PageTabs } from '@/components/ui/PageTabs';

/* ─── data ─────────────────────────────────────────────────── */

const identityItems = [
  { label: 'Having a hobby that had nothing to do with anyone else\'s needs', checked: false },
  { label: 'Making spontaneous plans — a last-minute dinner, a drive, a weekend trip', checked: false },
  { label: 'Laughing at yourself without it feeling like a distraction from something important', checked: false },
  { label: 'Resting without calculating what you\'re not doing instead', checked: false },
  { label: 'Having opinions about things that don\'t involve therapy, insurance, or schedules', checked: false },
  { label: 'Finishing a sentence in a conversation that wasn\'t about your child', checked: false },
  { label: 'Feeling curious about something — a book, a show, a new place', checked: false },
  { label: 'Being someone a friend called when they needed help', checked: false },
  { label: 'Feeling proud of something you made, did, or said — not something you managed', checked: false },
];

const shrinkingSignals = [
  {
    icon: User,
    title: 'You introduce yourself as a parent first — always',
    desc: 'Your name has been replaced by your role. \"I\'m Maya\'s mom\" has become your entire identity in rooms where no one would know the difference.',
  },
  {
    icon: Star,
    title: 'You feel guilty when you enjoy something',
    desc: 'Pleasure has a tax on it now. Every good moment has a shadow: the therapy cost, the session you missed, the diagnosis you\'re still processing.',
  },
  {
    icon: Music,
    title: 'You can\'t remember the last thing you did just for yourself',
    desc: 'Not \"for your health\" or \"to be a better parent.\" Just because you wanted to. Because you felt like it. Because it was yours.',
  },
  {
    icon: BookOpen,
    title: 'Your needs feel like requests you have to justify',
    desc: 'Somewhere along the way, your wants became things you have to earn — or explain — before anyone (including yourself) takes them seriously.',
  },
];

const microIdentityTools = [
  {
    color: 'emerald',
    icon: Music,
    title: 'One song that is yours',
    prompt: 'Not a lullaby. Not something your child likes. A song that existed before all of this — that makes you feel like yourself.',
    practice: 'Put it on tonight. Just once. Let it play all the way through without multitasking.',
  },
  {
    color: 'sky',
    icon: Star,
    title: 'One memory of yourself — before',
    prompt: 'Not a sad memory. A moment when you were fully yourself: confident, funny, capable, free. A trip. A conversation. A night with friends.',
    practice: 'Close your eyes and spend two minutes there. You don\'t have to leave it behind forever just because your life looks different now.',
  },
  {
    color: 'violet',
    icon: Sparkles,
    title: 'One thing you\'re proud of outside of caregiving',
    prompt: 'A skill. A quality. Something you\'ve built or made or figured out. Something that has nothing to do with your child\'s progress.',
    practice: 'Write it down. Say it out loud: "I am good at ___." Your value is not conditional on your child\'s outcomes.',
  },
  {
    color: 'amber',
    icon: Compass,
    title: 'One want — right now',
    prompt: 'Not a need. Not a responsibility. Something you actually want. A meal. A walk. A conversation that has nothing to do with ABA.',
    practice: 'Write it down. Then, if you can, do it this week — without asking permission from your guilt.',
  },
];

const selfishVsSelfPreserving = [
  {
    label: 'Selfish',
    example: 'Taking something your child needs in order to satisfy yourself.',
    color: 'rose',
  },
  {
    label: 'Self-preserving',
    example: 'Taking one hour to decompress so you can return as a regulated, present parent.',
    color: 'emerald',
  },
  {
    label: 'Selfish',
    example: 'Refusing to get help so your child suffers so you can rest.',
    color: 'rose',
  },
  {
    label: 'Self-preserving',
    example: 'Asking your partner to cover bedtime so you can sleep before you break down.',
    color: 'emerald',
  },
  {
    label: 'Selfish',
    example: 'Consistently prioritizing your comfort over your child\'s safety.',
    color: 'rose',
  },
  {
    label: 'Self-preserving',
    example: 'Telling your BCBA you\'re struggling so they can adjust expectations and support you.',
    color: 'emerald',
  },
];

const partnerScripts = [
  {
    need: 'You need 30 minutes alone',
    script: '"I need 30 minutes with the door closed. Not a nap — just quiet. Can you take over until I come out?"',
  },
  {
    need: 'You need to talk about something other than your child',
    script: '"I need us to talk about something else tonight. Not the schedule, not the therapy. Something that reminds me we exist outside of this."',
  },
  {
    need: 'You\'re running on empty',
    script: '"I\'m not okay right now in the way that needs to be named. I\'m not asking you to fix it — I just need you to know so you can carry more this week."',
  },
  {
    need: 'You need support, not solutions',
    script: '"Can you just listen without trying to help? I need someone to hear how hard this is before I try to figure out what to do about it."',
  },
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

/* ─── tabs ──────────────────────────────────────────────────── */

const TABS = [
  { key: 'what-happened',    label: 'What happened',    lazy: true },
  { key: 'reclaim-yourself', label: 'Reclaim yourself'             },
  { key: 'ask-for-support',  label: 'Ask for support'              },
];

/* ─── component ────────────────────────────────────────────── */

export default function CaregiverIdentityPage() {
  const [checked, setChecked] = useState<boolean[]>(identityItems.map(() => false));
  const [openTool, setOpenTool] = useState<number | null>(null);

  const checkedCount = checked.filter(Boolean).length;

  function toggle(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="page-shell">

      {/* Page header — always visible above the tabs */}
      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1.5 text-xs font-semibold text-brand-plum-700">
          <User className="h-3.5 w-3.5" /> Your identity — not just your role
        </div>
        <h1 className="page-title text-3xl font-bold sm:text-4xl">
          You were a person before you were a caregiver. You still are.
        </h1>
        <p className="page-description text-base leading-relaxed">
          Identity erosion doesn&apos;t happen all at once. It happens in the hundred small moments
          where you chose your child&apos;s need over your own — until one day you realized
          you couldn&apos;t quite remember what your own needs were.
        </p>
      </header>

      <PageTabs tabs={TABS}>

        {/* ── Tab 1: What happened (lazy — interactive checklist) ──────── */}
        <>
          {/* Opening honest card */}
          <div className="rounded-3xl border-2 border-brand-plum-200 bg-gradient-to-br from-brand-plum-50 to-white p-6 sm:p-8">
            <div className="flex gap-4">
              <Heart className="mt-1 h-6 w-6 shrink-0 text-brand-plum-400" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-plum-400 mb-2">
                  The thing nobody says out loud
                </p>
                <p className="text-base leading-relaxed text-brand-plum-900">
                  Caregiving for a child with complex needs is an act of profound love. It is also, over
                  time, one of the most quietly identity-eroding experiences a person can go through.
                  You didn&apos;t lose yourself because you failed. You lost yourself because you
                  showed up — fully, relentlessly — for someone else. That distinction matters.
                </p>
              </div>
            </div>
          </div>

          {/* Things you used to do — interactive checklist */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-brand-plum-600" />
              <h2 className="text-lg font-semibold text-brand-muted-900">Things you used to do — or be</h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
              Check the ones that feel like they belong to a different version of you. This is not a
              grief exercise — it&apos;s a recognition exercise. These things still exist inside you.
              They just got quiet.
            </p>
            <ul className="space-y-2">
              {identityItems.map((item, i) => (
                <li key={item.label}>
                  <button
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                      checked[i]
                        ? 'border-brand-plum-200 bg-brand-plum-50'
                        : 'border-surface-border bg-surface-muted hover:border-brand-plum-200'
                    }`}
                    onClick={() => toggle(i)}
                  >
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      checked[i]
                        ? 'border-brand-plum-500 bg-brand-plum-500'
                        : 'border-brand-muted-300 bg-white'
                    }`}>
                      {checked[i] && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <span className={`text-sm leading-relaxed transition-colors ${
                      checked[i] ? 'text-brand-plum-800 font-medium' : 'text-brand-muted-700'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {checkedCount > 0 && (
              <div className="mt-5 rounded-2xl border border-brand-plum-200 bg-brand-plum-50 p-4">
                <p className="text-sm font-semibold text-brand-plum-800">
                  You checked {checkedCount}. That&apos;s not loss — that&apos;s information.
                </p>
                <p className="mt-1 text-sm leading-relaxed text-brand-plum-700">
                  Every item you recognized is a thread that still connects you to who you are.
                  This page is about pulling on those threads — gently, without guilt.
                </p>
              </div>
            )}
          </section>

          {/* The shrinking self */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="h-5 w-5 text-brand-plum-600" />
              <h2 className="text-lg font-semibold text-brand-muted-900">The shrinking self — how it happens</h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
              No one wakes up one day and decides to stop being a person. It happens incrementally —
              in the slow accumulation of choosing someone else&apos;s needs first, every day, for years.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {shrinkingSignals.map(({ icon: Icon, title, desc }) => (
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
            <div className="mt-5 rounded-2xl border border-brand-plum-200 bg-brand-plum-50 p-4">
              <p className="text-sm leading-relaxed text-brand-plum-800">
                <span className="font-semibold">None of this makes you a bad parent.</span>{' '}
                It makes you a human being who gave everything they had and forgot to keep a little
                for themselves. That is fixable — but only if you first recognize what happened.
              </p>
            </div>
          </section>
        </>

        {/* ── Tab 2: Reclaim yourself ──────────────────────────────────── */}
        <>
          {/* Explicit permission */}
          <section className="rounded-3xl border-2 border-primary/20 bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-brand-muted-900">
                Explicit permission — for things you shouldn&apos;t need permission for
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
              Shame has a way of making ordinary human needs feel like requests that require approval.
              Consider this your approval — even though you never needed it.
            </p>
            <div className="space-y-3">
              {[
                'You are allowed to want things. Not just need things — want them. Preferences are not indulgences.',
                'You are allowed to have a life that is not entirely organized around your child\'s therapy schedule.',
                'You are allowed to be interesting to yourself — to pursue something because it fascinates you, not because it makes you a better parent.',
                'You are allowed to grieve the version of your life you expected without being ungrateful for the one you have.',
                'You are allowed to be bored, restless, frustrated, or unfulfilled — and to take those feelings seriously.',
                'You are allowed to rest without earning it first.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl border border-surface-border bg-surface-muted px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p className="text-sm leading-relaxed text-brand-muted-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Selfish vs self-preserving */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold text-brand-muted-900">
                &ldquo;Selfish&rdquo; vs. &ldquo;self-preserving&rdquo; — with actual examples
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
              These words have been collapsed into the same meaning in caregiving culture. They are not
              the same thing. The distinction is not semantic — it changes how you treat yourself
              every day.
            </p>
            <div className="space-y-3">
              {selfishVsSelfPreserving.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                    item.color === 'rose'
                      ? 'border-rose-200 bg-rose-50'
                      : 'border-emerald-200 bg-emerald-50'
                  }`}
                >
                  <span className={`mt-0.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold shrink-0 ${
                    item.color === 'rose'
                      ? 'bg-rose-200 text-rose-800'
                      : 'bg-emerald-200 text-emerald-800'
                  }`}>
                    {item.label}
                  </span>
                  <p className={`text-sm leading-relaxed ${
                    item.color === 'rose' ? 'text-rose-800' : 'text-emerald-800'
                  }`}>
                    {item.example}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-brand-muted-600 italic border-t border-surface-border pt-4">
              Notice that none of the &ldquo;self-preserving&rdquo; examples hurt your child.
              They protect your capacity to keep showing up for them. That is not a loophole —
              that is how sustainable caregiving works.
            </p>
          </section>

          {/* Micro-identity tools accordion */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-brand-plum-600" />
              <h2 className="text-lg font-semibold text-brand-muted-900">Micro-identity tools — 5 minutes each</h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
              You don&apos;t need a retreat or a breakthrough. You need small, consistent moments of
              contact with yourself. These practices take five minutes and ask nothing of anyone else.
            </p>
            <div className="space-y-3">
              {microIdentityTools.map((tool, i) => (
                <div
                  key={tool.title}
                  className={`rounded-2xl border transition-all ${
                    openTool === i ? colorMap[tool.color] : 'border-surface-border bg-surface-muted'
                  }`}
                >
                  <button
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                    onClick={() => setOpenTool(openTool === i ? null : i)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tagColorMap[tool.color]}`}>
                        5 min
                      </span>
                      <div className="flex items-center gap-2">
                        <tool.icon className="h-4 w-4 text-brand-muted-500" />
                        <span className="text-sm font-semibold text-brand-muted-900">{tool.title}</span>
                      </div>
                    </div>
                    <ArrowRight className={`h-4 w-4 shrink-0 text-brand-muted-400 transition-transform ${openTool === i ? 'rotate-90' : ''}`} />
                  </button>
                  {openTool === i && (
                    <div className="px-5 pb-5">
                      <p className="text-sm leading-relaxed text-brand-muted-700 mb-3 italic">
                        {tool.prompt}
                      </p>
                      <div className="rounded-xl border border-surface-border bg-white p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-muted-400 mb-1">Try this</p>
                        <p className="text-sm leading-relaxed text-brand-muted-700">{tool.practice}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>

        {/* ── Tab 3: Ask for support ───────────────────────────────────── */}
        <>
          {/* Partner scripts */}
          <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-brand-muted-900">How to tell your partner what you need</h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
              The hardest part of reclaiming your identity is often not finding the time — it&apos;s
              asking for it. Here are specific scripts for specific situations. You don&apos;t have to
              construct them from scratch when you&apos;re already depleted.
            </p>
            <div className="space-y-4">
              {partnerScripts.map((item, i) => (
                <div key={i} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-muted-400 mb-2">
                    When: {item.need}
                  </p>
                  <p className="text-sm leading-relaxed text-brand-muted-800 italic">
                    {item.script}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-brand-muted-600 border-t border-surface-border pt-4">
              These scripts are not manipulation. They are communication. A partner who understands
              what you need can actually give it to you — which benefits everyone, including your child.
            </p>
          </section>

          {/* Closing */}
          <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-brand-plum-50/40 to-white border border-primary/10 p-8 text-center shadow-soft">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-surface-border shadow-soft mb-5">
              <Sun className="h-6 w-6 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-brand-muted-900">
              Your child needs a parent who exists — not just a parent who serves.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-brand-muted-600">
              The most sustainable thing you can do for your child&apos;s long-term wellbeing is to
              remain a whole person. Not a perfected parent. Not a depleted martyr. A real person,
              with a name and preferences and a life — who also happens to show up for their child
              with everything they have.
            </p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-brand-muted-600">
              You are not done becoming. Neither is your child. That&apos;s actually the same story.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/support/caregiver"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
              >
                Caregiver support hub <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/support/connect"
                className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition hover:bg-surface-muted"
              >
                <Heart className="h-4 w-4" /> Connect with other caregivers
              </Link>
            </div>
          </div>
        </>

      </PageTabs>

    </div>
  );
}
