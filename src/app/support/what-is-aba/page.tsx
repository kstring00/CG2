'use client';

import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Brain,
  ArrowRight,
  ChevronDown,
  Compass,
  Lightbulb,
  Users,
} from 'lucide-react';
import { StickyToc, type TocItem } from '@/components/ui/StickyToc';
import { cn } from '@/lib/utils';
import {
  BadgePill,
  GuideCard,
  GuideSectionHeading,
  QuickIntroCard,
  SupportActionCard,
  SupportCalloutBand,
  TagPill,
} from '@/components/support/GuideCards';

/* ─── data ─────────────────────────────────────────────────── */

const ABA_TOC: TocItem[] = [
  { num: '01', id: 'study',       label: 'What BCBAs actually study' },
  { num: '02', id: 'experience',  label: 'What your child is experiencing' },
  { num: '03', id: 'myths',       label: 'Myths vs reality' },
  { num: '04', id: 'green-flags', label: 'How to know therapy is going well' },
  { num: '05', id: 'questions',   label: 'Questions you can ask' },
  { num: '06', id: 'outcomes',    label: 'Parent involvement and outcomes' },
  { num: '07', id: 'glossary',    label: '10 ABA terms in plain English' },
];

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

/** Badge-pill + icon tints per accent color (same palette as resource pills). */
const ACCENT: Record<string, { badge: string; icon: string }> = {
  rose:    { badge: 'border-rose-200 bg-rose-50 text-rose-700',          icon: 'text-rose-500' },
  amber:   { badge: 'border-amber-200 bg-amber-50 text-amber-700',       icon: 'text-amber-500' },
  violet:  { badge: 'border-violet-200 bg-violet-50 text-violet-700',    icon: 'text-violet-500' },
  sky:     { badge: 'border-sky-200 bg-sky-50 text-sky-700',             icon: 'text-sky-500' },
  emerald: { badge: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: 'text-emerald-500' },
};

const sessionPhases = [
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
];

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

const involvementFindings = [
  { title: 'Generalization happens at home', body: 'Skills learned in therapy don\'t automatically transfer to other settings. Your involvement — practicing at home, narrating in the same language, reinforcing the same behaviors — is what makes generalization happen.' },
  { title: 'You are the expert on your child', body: 'Your BCBA has data. You have context. Knowing that your child was up at 3am, has a new sensory sensitivity, or is anxious about a school transition changes how that session should go. Share it.' },
  { title: 'Caregiver training is part of the program', body: 'Most ABA programs include formal parent training (CPT code 97156). This is not remediation — it is skill-building for you, so you can be a more effective partner in your child\'s therapy.' },
  { title: 'Your questions improve the program', body: 'When parents ask why a goal is on the program, BCBAs refine their thinking. When parents report a new behavior at home, BCBAs update their approach. Your engagement makes the program better.' },
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
    <div className="page-shell pb-10">

      {/* Header — same treatment as Guides & Strategies */}
      <header className="page-header max-w-3xl">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Understanding ABA
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
          <BookOpen className="h-3.5 w-3.5" /> Plain English. No jargon.
        </div>
        <h1 className="page-title text-brand-navy-700">
          What ABA actually is — and what it isn&apos;t.
        </h1>
        <p className="page-description text-[15px] text-brand-muted-700">
          You heard the term. You may have heard things that worried you.
          Here is the honest guide: what ABA looks like in a real session, what you are allowed to ask your BCBA, and what modern therapy is not.
        </p>
      </header>

      {/* 3-up intro row — anchors to the page's key sections */}
      <section aria-label="Jump to a section" className="grid gap-3 sm:grid-cols-3">
        <QuickIntroCard
          label="A real session"
          description="Walk through what your child actually experiences, phase by phase."
          href="#experience"
          cardClass="border-sky-200/80 bg-gradient-to-br from-sky-50 to-white"
          accentClass="text-sky-700"
        />
        <QuickIntroCard
          label="Myths vs reality"
          description="What you may have heard — and what is actually true."
          href="#myths"
          cardClass="border-rose-200/80 bg-gradient-to-br from-rose-50 to-white"
          accentClass="text-rose-700"
        />
        <QuickIntroCard
          label="Questions to ask"
          description="What you are allowed — and encouraged — to ask your BCBA."
          href="#questions"
          cardClass="border-brand-plum-200/80 bg-gradient-to-br from-brand-plum-50 to-white"
          accentClass="text-brand-plum-700"
        />
      </section>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
        <StickyToc items={ABA_TOC} />
        <div className="space-y-8 md:space-y-10">

      {/* 01 — The honest definition */}
      <section id="study" className="scroll-mt-24">
        <GuideSectionHeading icon={Brain} title="What behavior analysts actually study" />
        <GuideCard as="div">
          <div className="mb-3">
            <BadgePill className={ACCENT.sky.badge}>The honest definition</BadgePill>
          </div>
          <div className="space-y-3">
            <p className="text-[14px] leading-relaxed text-brand-muted-700">
              Applied Behavior Analysis is the scientific study of how behavior works — specifically, how the
              environment (everything around a person: people, settings, events, consequences) shapes what a person
              does. Behavior analysts study the relationship between a behavior and its causes and consequences,
              and use that understanding to help people build skills they need.
            </p>
            <p className="text-[14px] leading-relaxed text-brand-muted-700">
              For children with autism, this means: figuring out <em>why</em> your child does what they do — what need
              is being communicated, what is reinforcing the behavior, what is making learning hard — and then
              systematically teaching skills that help them communicate, connect, and navigate the world more effectively.
            </p>
            <p className="text-[14px] leading-relaxed text-brand-muted-700">
              The &ldquo;applied&rdquo; part is important. This is not laboratory science. It is science in real rooms with real
              children, adapting constantly to what is actually working for this specific person.
            </p>
          </div>
        </GuideCard>
      </section>

      {/* 02 — A real session */}
      <section id="experience" className="scroll-mt-24">
        <GuideSectionHeading
          icon={Lightbulb}
          title="What your child is actually experiencing"
          meta="5 phases"
        />
        <p className="-mt-2 mb-4 text-[13px] italic text-brand-muted-500">
          Walk through a typical session — not as a checklist, but as it actually feels.
        </p>
        <div className="space-y-4">
          {sessionPhases.map((phase) => (
            <GuideCard as="div" key={phase.phase}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <BadgePill className={ACCENT[phase.color].badge}>{phase.phase}</BadgePill>
                <TagPill>{phase.time}</TagPill>
              </div>
              <p className="text-[13px] leading-relaxed text-brand-muted-700">{phase.story}</p>
            </GuideCard>
          ))}
        </div>
      </section>

      {/* 03 — Myths vs reality (accordion cards) */}
      <section id="myths" className="scroll-mt-24">
        <GuideSectionHeading
          icon={HelpCircle}
          title="What you may have heard — and what is actually true"
          meta="5 myths"
        />
        <p className="-mt-2 mb-4 text-[13px] leading-relaxed text-brand-muted-600">
          Every one of these concerns is valid to bring. Click each one to see the reality.
        </p>
        <div className="space-y-3">
          {myths.map((item, i) => {
            const accent = ACCENT[item.color];
            const isOpen = openMyth === i;
            return (
              <GuideCard as="div" key={i} className="overflow-hidden p-0 sm:p-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMyth(isOpen ? null : i)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-4 text-left transition duration-200 sm:px-5',
                    isOpen ? 'bg-surface-subtle/50' : 'hover:bg-surface-subtle/40',
                  )}
                >
                  <XCircle
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isOpen ? accent.icon : 'text-brand-muted-300',
                    )}
                  />
                  <span className="min-w-0 flex-1 text-[14px] font-semibold text-brand-navy-700">
                    {item.myth}
                  </span>
                  <BadgePill className={cn('hidden sm:inline-flex', accent.badge)}>
                    Myth
                  </BadgePill>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-brand-muted-400 transition duration-200',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                <div className="toolbox-reveal grid" data-open={isOpen ? 'true' : 'false'}>
                  <div className="toolbox-reveal-inner min-h-0">
                    <div className="toolbox-reveal-content border-t border-surface-border bg-surface-subtle/30 px-4 py-4 sm:px-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className={cn('mt-0.5 h-4 w-4 shrink-0', accent.icon)} />
                        <div>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-brand-muted-500">
                            The reality
                          </p>
                          <p className="text-[13px] leading-relaxed text-brand-muted-700">
                            {item.reality}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GuideCard>
            );
          })}
        </div>
      </section>

      {/* 04 — Green flags + things to bring to BCBA */}
      <section id="green-flags" className="scroll-mt-24">
        <GuideSectionHeading
          icon={CheckCircle2}
          title="How to know if therapy is going well"
          meta="5 + 5 signs"
        />
        <p className="-mt-2 mb-4 text-[13px] leading-relaxed text-brand-muted-600">
          Progress isn&apos;t always visible in the way parents expect. Here are the real signs — and what to
          bring to your BCBA if something doesn&apos;t feel right.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <GuideCard as="div">
            <div className="mb-3">
              <BadgePill className={ACCENT.emerald.badge}>5 green flags</BadgePill>
            </div>
            <ul className="divide-y divide-surface-border">
              {greenFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span className="text-[13px] leading-relaxed text-brand-muted-700">{flag}</span>
                </li>
              ))}
            </ul>
          </GuideCard>
          <GuideCard as="div">
            <div className="mb-3">
              <BadgePill className={ACCENT.amber.badge}>5 things to bring to your BCBA</BadgePill>
            </div>
            <ul className="divide-y divide-surface-border">
              {thingsToBringToBCBA.map((item, i) => (
                <li key={i} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <span className="text-[13px] leading-relaxed text-brand-muted-700">{item}</span>
                </li>
              ))}
            </ul>
          </GuideCard>
        </div>
      </section>

      {/* 05 — Questions you can ask (collapsible) */}
      <section id="questions" className="scroll-mt-24">
        <GuideCard as="div" className="overflow-hidden p-0 sm:p-0">
          <button
            type="button"
            aria-expanded={openQuestions}
            onClick={() => setOpenQuestions(!openQuestions)}
            className={cn(
              'flex w-full items-center gap-3 px-4 py-4 text-left transition duration-200 sm:px-5',
              openQuestions ? 'bg-brand-plum-50/50' : 'hover:bg-surface-subtle/40',
            )}
          >
            <span
              className={cn(
                'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition',
                openQuestions
                  ? 'border-brand-plum-200 bg-brand-plum-100 text-brand-plum-700'
                  : 'border-surface-border bg-primary/5 text-primary',
              )}
            >
              <HelpCircle className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold text-brand-navy-700">
                Questions you are allowed — and encouraged — to ask
              </h2>
              <span className="mt-0.5 block text-[13px] text-brand-muted-600">
                You are not bothering your BCBA. This is your child&apos;s program. You deserve to understand it.
              </span>
            </span>
            <span className="hidden shrink-0 text-[12px] font-medium text-brand-muted-500 sm:block">
              6 questions
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 text-brand-muted-400 transition duration-200',
                openQuestions && 'rotate-180',
              )}
            />
          </button>
          <div className="toolbox-reveal grid" data-open={openQuestions ? 'true' : 'false'}>
            <div className="toolbox-reveal-inner min-h-0">
              <div className="toolbox-reveal-content border-t border-surface-border bg-surface-subtle/30 px-4 py-4 sm:px-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {questionsYouCanAsk.map((item, i) => (
                    <div key={i} className="rounded-xl border border-surface-border bg-white p-4">
                      <p className="text-[14px] font-semibold italic text-brand-navy-700">{item.q}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GuideCard>
      </section>

      {/* 06 — Parent involvement and outcomes */}
      <section id="outcomes" className="scroll-mt-24">
        <GuideSectionHeading
          icon={Users}
          title="Parent involvement and outcomes — what the research shows"
          meta="4 findings"
        />
        <p className="-mt-2 mb-4 text-[13px] leading-relaxed text-brand-muted-600">
          The research on this is consistent and significant: children whose parents are actively involved
          in ABA therapy make faster progress, generalize skills more effectively, and maintain gains over time.
          This is not about pressure on you — it is about explaining why your BCBA keeps inviting you into sessions
          and asking about what happens at home.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {involvementFindings.map((item, i) => (
            <GuideCard as="div" key={i}>
              <h3 className="text-[15px] font-bold leading-snug text-brand-navy-700">{item.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-brand-muted-600">{item.body}</p>
            </GuideCard>
          ))}
        </div>
      </section>

      {/* 07 — Glossary (collapsible) */}
      <section id="glossary" className="scroll-mt-24">
        <GuideCard as="div" className="overflow-hidden p-0 sm:p-0">
          <button
            type="button"
            aria-expanded={openGlossary}
            onClick={() => setOpenGlossary(!openGlossary)}
            className={cn(
              'flex w-full items-center gap-3 px-4 py-4 text-left transition duration-200 sm:px-5',
              openGlossary ? 'bg-brand-plum-50/50' : 'hover:bg-surface-subtle/40',
            )}
          >
            <span
              className={cn(
                'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition',
                openGlossary
                  ? 'border-brand-plum-200 bg-brand-plum-100 text-brand-plum-700'
                  : 'border-surface-border bg-primary/5 text-primary',
              )}
            >
              <BookOpen className="h-4 w-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold text-brand-navy-700">
                10 ABA terms you will hear — in plain English
              </h2>
              <span className="mt-0.5 block text-[13px] text-brand-muted-600">
                You should not need a degree to understand your child&apos;s therapy. These are the words you will
                hear most often, and what they actually mean.
              </span>
            </span>
            <span className="hidden shrink-0 text-[12px] font-medium text-brand-muted-500 sm:block">
              10 terms
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 shrink-0 text-brand-muted-400 transition duration-200',
                openGlossary && 'rotate-180',
              )}
            />
          </button>
          <div className="toolbox-reveal grid" data-open={openGlossary ? 'true' : 'false'}>
            <div className="toolbox-reveal-inner min-h-0">
              <div className="toolbox-reveal-content border-t border-surface-border bg-surface-subtle/30 px-4 py-4 sm:px-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {glossary.map((entry, i) => (
                    <div key={i} className="rounded-xl border border-surface-border bg-white p-4">
                      <p className="text-[14px] font-bold text-primary">{entry.term}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">{entry.def}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GuideCard>
      </section>

      {/* Closing — styled like the resources closing band */}
      <SupportCalloutBand
        eyebrow="You're more than the driver."
        title="You are part of your child's therapy."
        text="Understanding what happens in those sessions makes everything work better — for your child, and for you. Ask hard questions. Show up. That is not overstepping. It is part of how this works."
        columns={2}
      >
        <SupportActionCard
          href="/"
          icon={Compass}
          title="See your next steps"
          detail="Your personalized plan"
        />
        <SupportActionCard
          href="/support/caregiver"
          icon={Lightbulb}
          title="Support for you"
          detail="Mental health toolbox"
        />
      </SupportCalloutBand>

        </div>
      </div>

    </div>
  );
}
