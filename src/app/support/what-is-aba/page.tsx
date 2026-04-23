'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Brain,
  Heart,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Users,
} from 'lucide-react';

/* ─── data ─────────────────────────────────────────────────── */

const myths = [
  {
    myth: '"ABA is just compliance training"',
    reality:
      'Modern ABA is built around understanding why behaviors occur, not forcing compliance. A BCBA studies the function of every behavior — what is motivating it, what is making it more or less likely — and teaches skills that serve your child\'s actual needs. Compliance is not a goal. Communication, independence, and quality of life are.',
    color: 'rose',
  },
  {
    myth: '"ABA tries to make autistic kids \'normal\'"',
    reality:
      'Ethical, modern ABA explicitly rejects this framing. Goals are set based on what will improve your child\'s ability to communicate, connect with others, navigate their environment safely, and live more independently — not on making them appear neurotypical. If a BCBA ever describes "appearing normal" as a goal, that is a red flag.',
    color: 'amber',
  },
  {
    myth: '"ABA is punishment-based"',
    reality:
      'Historical ABA (particularly from the 1960s–1980s) included aversive techniques that are now considered unethical and are not practiced in reputable ABA. Modern ABA is almost entirely built on positive reinforcement — the systematic identification and delivery of things your child actually finds motivating, used to build new skills.',
    color: 'violet',
  },
  {
    myth: '"My child will hate their therapist"',
    reality:
      'The first phase of ABA therapy is called "pairing," and it is specifically designed to build the relationship between your child and their RBT. Before any formal teaching begins, the RBT spends sessions doing whatever your child enjoys — playing their preferred games, offering preferred snacks, following their lead. The relationship comes first. This is not incidental — it is the foundation everything else is built on.',
    color: 'sky',
  },
  {
    myth: '"ABA doesn\'t work for my child\'s level"',
    reality:
      'ABA is individualized by design. The same behavioral science is applied very differently to a minimally verbal 3-year-old than to a conversational 10-year-old. Goals, methods, intensity, and the mix of discrete trial training vs. natural environment teaching all adapt to where your child is. There is no one ABA template — there is only your child\'s program.',
    color: 'emerald',
  },
];

const mythColorMap: Record<string, { card: string; badge: string; icon: string }> = {
  rose:    { card: 'border-rose-200 bg-rose-50',     badge: 'text-rose-600',    icon: 'text-rose-500' },
  amber:   { card: 'border-amber-200 bg-amber-50',   badge: 'text-amber-600',   icon: 'text-amber-500' },
  violet:  { card: 'border-violet-200 bg-violet-50', badge: 'text-violet-600',  icon: 'text-violet-500' },
  sky:     { card: 'border-sky-200 bg-sky-50',        badge: 'text-sky-600',     icon: 'text-sky-500' },
  emerald: { card: 'border-emerald-200 bg-emerald-50',badge: 'text-emerald-600', icon: 'text-emerald-500' },
};

const greenFlags = [
  'Your child seems genuinely happy to see their RBT — not just tolerating them',
  'You are receiving regular, understandable updates on your child\'s goals and data',
  'Your child is making measurable progress on at least some goals',
  'Staff treat your child with warmth, flexibility, and humor — not rigidity',
  'You feel welcome to ask questions and receive real answers',
];

const thingsToBringToBCBA = [
  'A behavior that is new or getting worse at home',
  'Any change in your child\'s sleep, diet, or medical situation',
  'A goal that feels stuck or that you don\'t understand why it\'s on the program',
  'Something your child is doing at home that isn\'t being addressed in therapy',
  'Any concern — big or small — about how therapy sessions are going',
];

const questionsYouCanAsk = [
  { q: '"What is the function of this behavior?"', note: 'Your BCBA should have a clear answer based on data — not a guess.' },
  { q: '"Can I watch a session?"', note: 'You have every right to observe. If you\'re discouraged from doing so, that is a serious red flag.' },
  { q: '"Why is this on the goal sheet?"', note: 'Every goal should be there for a reason tied to your child\'s quality of life. Ask.' },
  { q: '"What does generalization mean for this skill?"', note: 'Skills learned in the clinic should transfer to home and school. Ask how that happens.' },
  { q: '"What can I do at home to support this?"', note: 'Parent involvement improves outcomes. Your BCBA should have an answer.' },
  { q: '"What does success look like for my child in 6 months?"', note: 'Ask for a specific, measurable answer — not a vague positive statement.' },
];

const glossary = [
  { term: 'ABA', def: 'Applied Behavior Analysis. The scientific study of behavior and how the environment affects it — applied to help people learn meaningful skills.' },
  { term: 'BCBA', def: 'Board Certified Behavior Analyst. A licensed clinician who designs and oversees your child\'s ABA program. They typically hold a master\'s degree and passed a national certification exam.' },
  { term: 'RBT', def: 'Registered Behavior Technician. The therapist who works directly with your child session to session, under BCBA supervision. Most of your child\'s therapy time is with their RBT.' },
  { term: 'Discrete Trial Training (DTT)', def: 'A structured teaching method where a skill is broken into small steps, practiced repeatedly, and reinforced. Used for building foundational skills.' },
  { term: 'Natural Environment Teaching (NET)', def: 'Teaching that happens during play and everyday activities rather than at a desk. Used to make skills generalizable to real life.' },
  { term: 'Pairing', def: 'The first phase of ABA therapy — building a positive relationship between the child and therapist by associating the therapist with things the child loves.' },
  { term: 'Reinforcement', def: 'Anything that makes a behavior more likely to happen again. Modern ABA uses positive reinforcement (adding something the child wants) almost exclusively.' },
  { term: 'Function', def: 'The reason a behavior occurs — what it is getting the child (attention, escape, sensory input, a preferred item). Understanding function is central to everything in ABA.' },
  { term: 'Generalization', def: 'When a skill learned in therapy carries over to new places, people, and situations. This is the goal — skills should transfer to home and school.' },
  { term: 'Mastery criterion', def: 'The data threshold that means a skill has been learned. For example, "80% accuracy across 3 sessions with 2 different therapists."' },
];

/* ─── component ────────────────────────────────────────────── */

export default function WhatIsABAPage() {
  const [openMyth, setOpenMyth] = useState<number | null>(null);
  const [openGlossary, setOpenGlossary] = useState(false);
  const [openQuestions, setOpenQuestions] = useState(false);

  return (
    <div className="page-shell">

      {/* ══════════════════════════════════════════
          SECTION 1 — SEEN
          "You've heard the term."
      ══════════════════════════════════════════ */}

      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
          <BookOpen className="h-3.5 w-3.5" /> What Is ABA Really?
        </div>
        <h1 className="page-title text-3xl font-bold sm:text-4xl">
          What ABA actually is — and what it isn&apos;t.
        </h1>
        <p className="page-description text-base leading-relaxed">
          You&apos;ve heard the term. You may have heard things that scared you. Here is the honest, plain-English
          guide to what Applied Behavior Analysis is, what a real session looks like, and what you are
          allowed — and encouraged — to ask.
        </p>
      </header>

      {/* The honest definition */}
      <section className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 sm:p-8">
        <div className="flex gap-4">
          <Brain className="mt-1 h-6 w-6 shrink-0 text-sky-500" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-sky-500 mb-2">The honest definition</p>
            <h2 className="text-lg font-bold text-brand-muted-900 mb-3">What behavior analysts actually study</h2>
            <p className="text-sm leading-relaxed text-brand-muted-700 mb-3">
              Applied Behavior Analysis is the scientific study of how behavior works — specifically, how the
              environment (everything around a person: people, settings, events, consequences) shapes what a person
              does. Behavior analysts study the relationship between a behavior and its causes and consequences,
              and use that understanding to help people build skills they need.
            </p>
            <p className="text-sm leading-relaxed text-brand-muted-700 mb-3">
              For children with autism, this means: figuring out <em>why</em> your child does what they do — what need
              is being communicated, what is reinforcing the behavior, what is making learning hard — and then
              systematically teaching skills that help them communicate, connect, and navigate the world more effectively.
            </p>
            <p className="text-sm leading-relaxed text-brand-muted-700">
              The &ldquo;applied&rdquo; part is important. This is not laboratory science. It is science in real rooms with real
              children, adapting constantly to what is actually working for this specific person.
            </p>
          </div>
        </div>
      </section>

      {/* What a real session looks like — written like a story */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          A real session
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-brand-muted-900">What your child is actually experiencing</h2>
        </div>
        <p className="text-sm text-brand-muted-500 italic mb-6">Walk through a typical session — not as a checklist, but as it actually feels.</p>

        <div className="space-y-4">
          {[
            {
              phase: 'Arrival',
              time: '0–5 min',
              color: 'emerald',
              story: 'The RBT arrives and your child either runs to greet them or doesn\'t — both are fine. A skilled RBT reads your child\'s current state before doing anything else. If your child is dysregulated, the session adapts before it starts. If they\'re excited, that energy gets channeled. The RBT might sit on the floor, follow your child to their current activity, or offer a preferred toy. The session hasn\'t formally started yet — the relationship is warming up.',
            },
            {
              phase: 'Pairing & rapport',
              time: '5–20 min',
              color: 'sky',
              story: 'Before any formal skill-building, the RBT does what\'s called pairing — associating themselves with things your child loves. This might look like play. It is play. The RBT follows your child\'s lead, offers preferred items, narrates what\'s happening, and asks for nothing yet. For a child new to therapy, this phase can last weeks. For an established client, it\'s a check-in that anchors the whole session.',
            },
            {
              phase: 'Discrete trial training',
              time: '20–45 min',
              color: 'violet',
              story: 'When your child is engaged and the relationship is warm, structured teaching begins. The RBT presents a clear instruction — sometimes at a table, sometimes during play — your child responds, and the RBT immediately delivers reinforcement for correct responses (or prompts another attempt). The trials are short. The pace is calibrated to your child\'s attention. The data is being recorded constantly — on a tablet or paper — tracking accuracy, prompting levels, and anything notable.',
            },
            {
              phase: 'Natural environment teaching',
              time: 'Woven throughout',
              color: 'amber',
              story: 'Not all ABA happens at a table. Natural environment teaching looks like the RBT creating opportunities to practice skills during everyday activities — during snack, during transitions, during play. If your child is learning to request items, the RBT sets up situations where requesting is natural and motivated. This is where skills start to generalize into real life.',
            },
            {
              phase: 'Wrapping up',
              time: 'Final 10 min',
              color: 'rose',
              story: 'Sessions end with something your child enjoys — a preferred activity, some free play, a preferred snack. The goal is to end on a high note so the next session starts with positive associations. The RBT will typically give you a brief update — what went well, what was hard, anything they noticed. Write it down if you can. These observations are often the most useful information you\'ll get about your child\'s day.',
            },
          ].map((phase, i) => {
            const colors: Record<string, string> = {
              emerald: 'border-emerald-200 bg-emerald-50',
              sky:     'border-sky-200 bg-sky-50',
              violet:  'border-violet-200 bg-violet-50',
              amber:   'border-amber-200 bg-amber-50',
              rose:    'border-rose-200 bg-rose-50',
            };
            const tags: Record<string, string> = {
              emerald: 'bg-emerald-100 text-emerald-700',
              sky:     'bg-sky-100 text-sky-700',
              violet:  'bg-violet-100 text-violet-700',
              amber:   'bg-amber-100 text-amber-700',
              rose:    'bg-rose-100 text-rose-700',
            };
            return (
              <div key={i} className={`rounded-2xl border-2 p-5 ${colors[phase.color]}`}>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${tags[phase.color]}`}>{phase.time}</span>
                  <h3 className="text-sm font-bold text-brand-muted-900">{phase.phase}</h3>
                </div>
                <p className="text-sm leading-relaxed text-brand-muted-700">{phase.story}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — GROUNDED
          "Here's what's actually true."
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          Myths &amp; reality
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* Myths accordion */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">What you may have heard — and what is actually true</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          Every one of these concerns is valid to bring. Click each one to see the reality.
        </p>
        <div className="space-y-3">
          {myths.map((item, i) => {
            const c = mythColorMap[item.color];
            const isOpen = openMyth === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border-2 transition-all ${isOpen ? c.card : 'border-surface-border bg-surface-muted'}`}
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenMyth(isOpen ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <XCircle className={`h-4 w-4 shrink-0 ${isOpen ? c.icon : 'text-brand-muted-300'}`} />
                    <span className="text-sm font-semibold text-brand-muted-900">{item.myth}</span>
                  </div>
                  {isOpen
                    ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
                    : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${c.icon}`} />
                      <div>
                        <p className={`text-[11px] font-bold uppercase tracking-wide mb-2 ${c.badge}`}>
                          The reality
                        </p>
                        <p className="text-sm leading-relaxed text-brand-muted-700">{item.reality}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Green flags + things to bring to BCBA */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">How to know if therapy is going well</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          Progress isn&apos;t always visible in the way parents expect. Here are the real signs — and what to
          bring to your BCBA if something doesn&apos;t feel right.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 mb-3">5 green flags</p>
            <ul className="space-y-2">
              {greenFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span className="text-sm text-brand-muted-700">{flag}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-3">5 things to bring to your BCBA</p>
            <ul className="space-y-2">
              {thingsToBringToBCBA.map((item, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <span className="text-sm text-brand-muted-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Questions parents are allowed to ask */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <button
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => setOpenQuestions(!openQuestions)}
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-brand-plum-600" />
            <h2 className="text-lg font-semibold text-brand-muted-900">
              Questions you are allowed — and encouraged — to ask
            </h2>
          </div>
          {openQuestions
            ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
            : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
        </button>
        <p className="mt-1 text-sm text-brand-muted-500">
          You are not bothering your BCBA. This is your child&apos;s program. You deserve to understand it.
        </p>
        {openQuestions && (
          <div className="mt-5 space-y-3">
            {questionsYouCanAsk.map((item, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-surface-muted p-4">
                <p className="text-sm font-semibold text-brand-muted-900 italic">{item.q}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{item.note}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Parent involvement research */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-sky-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Parent involvement and outcomes — what the research shows</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-4">
          The research on this is consistent and significant: children whose parents are actively involved
          in ABA therapy make faster progress, generalize skills more effectively, and maintain gains over time.
          This is not about pressure on you — it is about explaining why your BCBA keeps inviting you into sessions
          and asking about what happens at home.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Generalization happens at home', body: 'Skills learned in therapy don\'t automatically transfer to other settings. Your involvement — practicing at home, narrating in the same language, reinforcing the same behaviors — is what makes generalization happen.' },
            { title: 'You are the expert on your child', body: 'Your BCBA has data. You have context. Knowing that your child was up at 3am, has a new sensory sensitivity, or is anxious about a school transition changes how that session should go. Share it.' },
            { title: 'Caregiver training is part of the program', body: 'Most ABA programs include formal parent training (CPT code 97156). This is not remediation — it is skill-building for you, so you can be a more effective partner in your child\'s therapy.' },
            { title: 'Your questions improve the program', body: 'When parents ask why a goal is on the program, BCBAs refine their thinking. When parents report a new behavior at home, BCBAs update their approach. Your engagement makes the program better.' },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
              <p className="text-sm font-semibold text-brand-muted-900">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-muted-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — HOPEFUL
          Glossary + closing
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          Common terms
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* Glossary — inline, collapsible */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <button
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => setOpenGlossary(!openGlossary)}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-brand-muted-900">
              10 ABA terms you will hear — in plain English
            </h2>
          </div>
          {openGlossary
            ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
            : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
        </button>
        <p className="mt-1 text-sm text-brand-muted-500">
          You should not need a degree to understand your child&apos;s therapy. These are the words you will
          hear most often, and what they actually mean.
        </p>
        {openGlossary && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {glossary.map((entry, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-surface-muted p-4">
                <p className="text-sm font-bold text-primary">{entry.term}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{entry.def}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Closing — hopeful */}
      <div className="rounded-3xl bg-gradient-to-br from-sky-50/60 via-brand-plum-50/30 to-white border border-sky-100 p-8 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-surface-border shadow-soft mb-5">
          <Heart className="h-6 w-6 text-brand-plum-600" />
        </div>
        <h2 className="text-xl font-bold text-brand-muted-900">
          You made a brave choice getting your child into therapy.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-brand-muted-600">
          You are allowed to understand what&apos;s happening in those sessions. You are allowed to ask hard
          questions. You are allowed to be a full partner in your child&apos;s care — not just the person
          who drops them off. That involvement isn&apos;t an intrusion. It is part of how this works.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/support/caregiver"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
          >
            Support for you, the caregiver <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/support/next-steps"
            className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition hover:bg-surface-muted"
          >
            <Lightbulb className="h-4 w-4" /> Guided next steps
          </Link>
        </div>
      </div>

    </div>
  );
}
