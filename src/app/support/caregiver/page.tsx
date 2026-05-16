'use client';

/**
 * /support/caregiver — Parent Support
 *
 * Per Kyle's direction (May 2026), this page has been rebuilt as a focused
 * mental-health toolbox for the parent. Earlier versions tried to do too
 * many jobs at once — Still Waters preview, a check-in dashboard pointer,
 * a four-button "Start here" grid, and a four-tab PageTabs structure on
 * top of all of that. Those surfaces are now reachable elsewhere:
 *
 *   • Still Waters       → /support/still-waters (own nav tab + Home Base)
 *   • Bandwidth check-in → /support/check-in (own canonical flow)
 *   • Local help & care team → /support/find, /support/connect (nav)
 *
 * What lives here now is the thing the page name promises: a toolbox of
 * short, well-explained techniques a parent can actually try in the next
 * few minutes to lower their nervous-system load. Each tool has:
 *
 *   • A clear time tag so a parent can pick by available bandwidth
 *   • Step-by-step instructions written for a tired person to read once
 *   • A short "why this works" so it doesn't feel like a platitude
 *
 * Tools are grouped by what the parent needs in the moment — calm the
 * body, ground anxious thinking, soften shame, reset depleted energy.
 *
 * Design rules (locked):
 *   • Calm, soft, parent-friendly — no clinical jargon, no scary visuals.
 *   • Not a diagnosis or replacement for clinical care; gentle disclaimer.
 *   • No backend; nothing here is recorded or sent.
 */

import Link from 'next/link';
import { useState } from 'react';
import BreathingOrb from '@/components/BreathingOrb';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  Leaf,
  Phone,
  Sparkles,
  Sun,
  Wind,
  Brain,
  Hand,
  HeartPulse,
  Droplets,
  Hourglass,
} from 'lucide-react';

/* ─── tool data ──────────────────────────────────────────────── */

type ToolCategory = 'calm-body' | 'ground-mind' | 'soften-self-talk' | 'reset-energy';

type Tool = {
  id: string;
  title: string;
  tag: string; // e.g. "2 min"
  category: ToolCategory;
  icon: typeof Leaf;
  /** One-liner shown on the card before it's opened. */
  blurb: string;
  /** If true, render the interactive BreathingOrb in place of step list. */
  isOrb?: boolean;
  /** Ordered, plain-language steps. */
  steps: string[];
  /** Optional pre-step framing (one short paragraph). */
  intro?: string;
  /** Why this works — short, non-clinical, non-fluffy. */
  why: string;
};

const TOOLS: Tool[] = [
  // ── Calm the body fast ─────────────────────────────────────────
  {
    id: 'four-seven-eight',
    title: '4-7-8 Breathing',
    tag: '2 min',
    category: 'calm-body',
    icon: Leaf,
    isOrb: true,
    blurb: 'A breath pattern that switches your body out of fight-or-flight in under two minutes.',
    intro:
      'Use this when your chest feels tight, your jaw is clenched, or you can feel a meltdown coming — yours or your child’s. The orb below paces it for you.',
    steps: [
      'Sit or stand comfortably. Let your shoulders drop. Tongue rests just behind your top teeth.',
      'Exhale fully through your mouth — empty everything out.',
      'Inhale quietly through your nose for 4 counts.',
      'Hold the breath for 7 counts.',
      'Exhale through your mouth for 8 counts, making a soft “whoosh.”',
      'That’s one cycle. Repeat for four cycles.',
    ],
    why:
      'The long exhale activates the vagus nerve, which signals your nervous system that the threat is over. This is a body-level reset — it works even when you can’t think your way out.',
  },
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    tag: '2 min',
    category: 'calm-body',
    icon: Wind,
    blurb: 'The breath pattern Navy SEALs and ER nurses use to stay steady under pressure.',
    intro:
      'Use this before a hard conversation, a phone call you’ve been avoiding, or a meeting at school. It’s simple enough to do at a red light.',
    steps: [
      'Exhale fully. Empty your lungs.',
      'Inhale through your nose for 4 counts.',
      'Hold the breath for 4 counts.',
      'Exhale through your nose or mouth for 4 counts.',
      'Hold empty for 4 counts.',
      'Repeat four to six rounds. That’s the box — four equal sides.',
    ],
    why:
      'Equal-ratio breathing brings your heart rate variability up, which is the physiology of calm focus. It’s the opposite of a panic spiral.',
  },
  {
    id: 'physiological-sigh',
    title: 'Physiological Sigh',
    tag: '30 sec',
    category: 'calm-body',
    icon: HeartPulse,
    blurb: 'The fastest evidence-based way to drop stress — two inhales, one long exhale.',
    intro:
      'When you only have thirty seconds — in the car, before opening a door, between bites of dinner — this is the shortest tool that actually does something.',
    steps: [
      'Inhale through your nose, deeply.',
      'On top of that, sneak in a second short inhale — also through your nose, filling whatever bit of lung is left.',
      'Then a slow, long exhale through your mouth. Make it longer than the inhales combined.',
      'Repeat one to three times. Stop when your shoulders drop.',
    ],
    why:
      'That second small inhale pops open collapsed air sacs in your lungs, and the long exhale offloads carbon dioxide quickly — which is the actual chemistry behind feeling calmer. Stanford’s Andrew Huberman’s lab found this is the single fastest breath pattern for lowering acute stress.',
  },
  {
    id: 'cold-water-reset',
    title: 'Cold Water Reset',
    tag: '1 min',
    category: 'calm-body',
    icon: Droplets,
    blurb: 'A 60-second tactic to interrupt a wave of panic or rage when nothing else is working.',
    intro:
      'Use this when you are about to say or do something you’ll regret. It is not punishment; it is a circuit breaker. Walk to the sink.',
    steps: [
      'Run the water as cold as it gets.',
      'Splash it on your face — eyes, forehead, cheeks — or hold a cold compress to the area below your eyes for 15 to 30 seconds.',
      'Or: hold the inside of your wrists under the cold stream for 30 seconds.',
      'Take three slow breaths before you walk back.',
    ],
    why:
      'Cold on the face below the eyes triggers the mammalian dive reflex — your heart rate drops, your nervous system shifts, and the adrenaline wave breaks. This is the same mechanism DBT therapists teach for acute emotional crises.',
  },

  // ── Ground anxious thinking ───────────────────────────────────
  {
    id: 'five-four-three-two-one',
    title: '5-4-3-2-1 Grounding',
    tag: '3 min',
    category: 'ground-mind',
    icon: Hand,
    blurb: 'Name what is around you, sense by sense, until your brain rejoins your body.',
    intro:
      'Use this when your thoughts are racing, looping, or running ahead of you — about therapy schedules, school, money, the future. It pulls your brain into right now.',
    steps: [
      'Name 5 things you can see right now. Say them out loud or in your head: “the lamp, the cup, my keys, the doorframe, that smudge on the window.”',
      'Name 4 things you can physically feel: feet on the floor, the chair under you, your shirt sleeve, the air on your skin.',
      'Name 3 things you can hear. Even quiet sounds count — the fridge, traffic, your own breath.',
      'Name 2 things you can smell. If you can’t smell anything, name two smells you like.',
      'Name 1 thing you can taste. Or one thing you would like to taste.',
    ],
    why:
      'Anxiety lives in the future. This exercise drags your attention into the present, which is the one place anxiety cannot follow you. It works even when nothing else does.',
  },
  {
    id: 'body-scan',
    title: '90-Second Body Scan',
    tag: '90 sec',
    category: 'ground-mind',
    icon: Brain,
    blurb: 'Find where the day is sitting in your body, and let that one spot soften.',
    intro:
      'Stress hides in specific places — jaw, shoulders, stomach, hips. You don’t have to fix all of it. Just find one place and exhale into it.',
    steps: [
      'Sit or lie down. Eyes closed if that feels okay.',
      'Start at the top of your head and slowly move your attention down: forehead, eyes, jaw, throat, shoulders, chest, stomach, hands, hips, legs, feet.',
      'When you hit a spot that feels tight or buzzy, pause there.',
      'Take one slow breath in. On the exhale, picture that spot getting a little softer — just one notch.',
      'Move on. You don’t have to fix it. You just had to find it.',
    ],
    why:
      'Caregiver stress is often somatic before it’s cognitive — your body knows you’re overloaded before your mind catches up. Naming where it lives is the first step to discharging it.',
  },

  // ── Soften self-talk ──────────────────────────────────────────
  {
    id: 'permission-phrase',
    title: 'Permission Phrase',
    tag: '30 sec',
    category: 'soften-self-talk',
    icon: HeartHandshake,
    blurb: 'Four sentences to interrupt the shame spiral that says you should be doing more.',
    intro:
      'Say them out loud if you can. Whisper them in the car. Write them on your wrist. Your brain believes what you repeat — this is a pattern interrupt, not a platitude.',
    steps: [
      '“I am allowed to be tired.”',
      '“I am allowed to need help.”',
      '“That does not make me a bad parent.”',
      '“I am doing the best I can with what I have right now.”',
    ],
    why:
      'Self-compassion research (Kristin Neff, UT Austin) finds that parents who speak to themselves the way they would speak to a struggling friend recover from hard parenting moments measurably faster — and shame their kids less in the process. The words feel small. The effect is not.',
  },
  {
    id: 'self-compassion-break',
    title: 'Self-Compassion Break',
    tag: '2 min',
    category: 'soften-self-talk',
    icon: HeartHandshake,
    blurb: 'A three-line script researchers use to short-circuit caregiver self-criticism.',
    intro:
      'This is the move you make right after you snap at your kid, your partner, or yourself. It is not a free pass — it is what lets you regulate enough to repair the moment.',
    steps: [
      'Put a hand over your heart, or on your stomach. The physical touch matters.',
      'Say to yourself: “This is a moment of difficulty.” (Not “I’m failing.” Just — this is hard.)',
      'Then: “Difficulty is part of being a parent. I am not the only one feeling this.”',
      'Then: “May I be kind to myself right now. May I give myself what I need.”',
      'Take one breath. Then go do the next small thing.',
    ],
    why:
      'These three lines map to the three components of self-compassion (mindfulness, common humanity, kindness). In clinical studies, repeating them takes about 90 seconds and measurably reduces cortisol. The hand-on-heart adds a soothing-touch signal that works even when you don’t fully believe the words yet.',
  },

  // ── Reset energy ──────────────────────────────────────────────
  {
    id: 'one-thing-rule',
    title: 'The One-Thing Rule',
    tag: '5 min',
    category: 'reset-energy',
    icon: Sparkles,
    blurb: 'Pick one small thing for you today. Not a list. Not a plan. One thing.',
    intro:
      'On heavy days, “self-care” turns into another item on the to-do list, which makes it worse. Strip it down. One thing. Today.',
    steps: [
      'Pick one small thing you can actually do for yourself in the next few hours.',
      'Examples: a shower with the door locked. A walk around the block. Five minutes outside before anyone else is up.',
      'A cup of coffee while it’s still hot. One song with the volume loud. Sitting in the car for two minutes after you park.',
      'Decide on the one thing. Out loud, if you can.',
      'Do that one thing. That is enough.',
    ],
    why:
      'Decision fatigue is one of the most underrated drivers of caregiver burnout. Pre-committing to one tiny act of restoration removes the “what should I do for myself today” loop, which is the loop that usually wins.',
  },
  {
    id: 'three-minute-stop',
    title: 'The 3-Minute Stop',
    tag: '3 min',
    category: 'reset-energy',
    icon: Hourglass,
    blurb: 'A short, structured pause for parents who genuinely don’t have time for self-care.',
    intro:
      'If the only quiet you’re getting is the time it takes to microwave leftovers, that is enough time for this. The structure protects it from being scrolled away.',
    steps: [
      'Minute 1 — Stop. Sit down or stand still. Notice what you are feeling. Name it: tired, wired, angry, numb. No fixing yet.',
      'Minute 2 — Breathe. Slow breaths through the nose. Don’t count, just lengthen the exhale.',
      'Minute 3 — Choose one. One sip of water. One stretch. One sentence written down. One person you’ll text back later.',
      'Then go back. That was real rest, even though it was small.',
    ],
    why:
      'Short, structured pauses repeated through the day outperform a single long break that never comes. The structure is what keeps the time from leaking — without it, the three minutes turn into doom-scrolling or guilt.',
  },
];

const CATEGORY_LABEL: Record<ToolCategory, string> = {
  'calm-body': 'Calm your body fast',
  'ground-mind': 'Ground anxious thinking',
  'soften-self-talk': 'Soften the voice in your head',
  'reset-energy': 'Reset depleted energy',
};

const CATEGORY_BLURB: Record<ToolCategory, string> = {
  'calm-body':
    'Breathing patterns and physical reset tactics that move your nervous system out of fight-or-flight. Use when your body is already lit up.',
  'ground-mind':
    'For racing thoughts, future-tripping, and the loops that won’t turn off. Pulls your attention back into the present moment.',
  'soften-self-talk':
    'For shame spirals and the parent voice that says you should be doing more. Short scripts that interrupt the loop without being saccharine.',
  'reset-energy':
    'For deep depletion. Not a fix, but small, structured restoration that fits inside a real caregiver’s day.',
};

const CATEGORY_ORDER: ToolCategory[] = ['calm-body', 'ground-mind', 'soften-self-talk', 'reset-energy'];

/* ─── component ──────────────────────────────────────────────── */

export default function CaregiverSupportPage() {
  // One tool open per category at a time keeps the page scrollable.
  const [openId, setOpenId] = useState<string | null>('four-seven-eight');

  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1.5 text-xs font-semibold text-brand-plum-700">
          <HeartHandshake className="h-3.5 w-3.5" /> Parent Support
        </div>
        <h1 className="page-title text-3xl font-bold sm:text-4xl">
          Your mental health toolbox.
        </h1>
        <p className="page-description text-base leading-relaxed">
          Short, real techniques you can try in the next few minutes to lower the load you’re
          carrying right now. Pick by how much time you have — every tool has a tag.
        </p>
      </header>

      {/* Quick orientation strip — sets expectations without being preachy. */}
      <section
        aria-label="How to use this page"
        className="mb-8 rounded-3xl border border-surface-border bg-surface-muted/40 px-5 py-4 sm:px-6"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          How to use this
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-brand-muted-700">
          You don’t need to read this whole page. Pick the section that matches what you need —
          calm your body, quiet your thoughts, soften how you’re talking to yourself, or refill
          your energy. Open one tool. Try it once. That’s the whole assignment.
        </p>
      </section>

      {/* Tools, grouped by need. */}
      {CATEGORY_ORDER.map((cat) => {
        const tools = TOOLS.filter((t) => t.category === cat);
        return (
          <section key={cat} className="mb-10" aria-label={CATEGORY_LABEL[cat]}>
            <header className="mb-3">
              <h2 className="text-lg font-semibold text-brand-muted-900 sm:text-xl">
                {CATEGORY_LABEL[cat]}
              </h2>
              <p className="mt-1 text-[13.5px] leading-relaxed text-brand-muted-600">
                {CATEGORY_BLURB[cat]}
              </p>
            </header>
            <div className="space-y-3">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  open={openId === tool.id}
                  onToggle={() => setOpenId(openId === tool.id ? null : tool.id)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Hope pillars — gentle close. */}
      <section className="mb-8 rounded-3xl border border-surface-border bg-white p-6 shadow-card sm:p-8">
        <div className="mb-2 flex items-center gap-2">
          <Sun className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-brand-muted-900">A few things worth remembering</h2>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-brand-muted-600">
          Tools work better when you know why you’re using them. Here is the bigger picture.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: 'Caregiver burnout has a name — and an end.',
              body:
                'What you’re feeling is a documented, studied experience. It is not a character flaw and it is not permanent. With support, most parents find equilibrium again, and often more.',
            },
            {
              title: 'Small tools compound.',
              body:
                'Two minutes of breathing six times a week changes your baseline. You do not have to find a free hour. You have to use the four minutes you already have.',
            },
            {
              title: 'Calm parent, regulated child.',
              body:
                'Co-regulation is real. When your nervous system steadies, your child’s nervous system has something to lean on. Taking care of yourself is part of taking care of them.',
            },
            {
              title: 'You are allowed to need this.',
              body:
                'Asking for tools, support, or rest is not giving up. It is the strategy. The parents who burn out hardest are the ones who waited the longest to ask.',
            },
          ].map(({ title, body }) => (
            <div key={title} className="rounded-2xl border border-surface-border bg-surface-muted/60 p-5">
              <p className="text-sm font-semibold text-brand-muted-900">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-muted-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Onward — soft pointers to live support, without making this a directory. */}
      <section className="mb-8 rounded-3xl border border-brand-plum-200 bg-brand-plum-50/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-brand-navy-700 sm:text-xl">
          If a tool isn’t enough today
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-700">
          These techniques help in the moment. They are not a substitute for live support when
          things feel heavier than a tool can hold.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/support/connect"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
          >
            Connect with parents who get it <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/support/find"
            className="inline-flex items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-plum-700 transition hover:bg-brand-plum-100"
          >
            Find local help
          </Link>
          <a
            href="tel:988"
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
          >
            <Phone className="h-4 w-4" /> Crisis support · 988
          </a>
        </div>
      </section>

      {/* Disclaimer — small, but present. */}
      <p className="text-[12px] leading-relaxed text-brand-muted-500">
        Common Ground is parent support, not clinical care. These tools are general
        mental-health techniques drawn from public, evidence-based practice. They do not
        diagnose, treat, or replace care from a licensed clinician. If you are in crisis, please
        call or text <a href="tel:988" className="font-semibold underline">988</a>.
      </p>
    </div>
  );
}

/* ─── tool card ──────────────────────────────────────────────── */

function ToolCard({
  tool,
  open,
  onToggle,
}: {
  tool: Tool;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = tool.icon;
  return (
    <article
      className={`rounded-3xl border bg-white shadow-soft transition-colors ${
        open ? 'border-brand-plum-200' : 'border-surface-border'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-brand-plum-50 text-brand-plum-700"
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-[15px] font-semibold text-brand-muted-900 sm:text-base">
                {tool.title}
              </h3>
              <span className="rounded-full bg-brand-plum-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-plum-700">
                {tool.tag}
              </span>
            </div>
            <p className="mt-1 text-[13.5px] leading-relaxed text-brand-muted-600">
              {tool.blurb}
            </p>
          </div>
        </div>
        <span aria-hidden className="mt-1 shrink-0 text-brand-muted-400">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {open && (
        <div className="border-t border-surface-border px-5 pb-6 pt-4 sm:px-6">
          {tool.intro && (
            <p className="mb-4 text-[14px] leading-relaxed text-brand-muted-700">
              {tool.intro}
            </p>
          )}

          {tool.isOrb && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
              <BreathingOrb />
              <p className="mt-3 text-center text-[11.5px] text-brand-muted-500">
                Inhale 4 · Hold 7 · Exhale 8 · Repeat 4 times
              </p>
            </div>
          )}

          <ol className="space-y-2.5">
            {tool.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-brand-muted-800">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface-subtle text-[11px] font-bold text-brand-muted-500">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 rounded-2xl border border-surface-border bg-surface-subtle/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted-500">
              Why this works
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-muted-700">
              {tool.why}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
