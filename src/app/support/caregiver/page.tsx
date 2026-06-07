'use client';

/**
 * /support/caregiver — Mental Health Toolbox
 *
 * Compact, link-based layout (May 2026). Parents scan short rows and open
 * one tool at a time — no wall of expanded accordions. Full tool instructions
 * live in a single detail panel opened on demand.
 */

import Link from 'next/link';
import { useCallback, useState } from 'react';
import BreathingOrb from '@/components/BreathingOrb';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Compass,
  Heart,
  HeartHandshake,
  Leaf,
  MapPin,
  Phone,
  Sparkles,
  Sun,
  Users,
  Wind,
  Brain,
  Hand,
  HeartPulse,
  Droplets,
  Hourglass,
  Zap,
} from 'lucide-react';

/* ─── tool data ──────────────────────────────────────────────── */

type ToolCategory = 'calm-body' | 'ground-mind' | 'soften-self-talk' | 'reset-energy';

type Tool = {
  id: string;
  title: string;
  tag: string;
  category: ToolCategory;
  icon: typeof Leaf;
  blurb: string;
  isOrb?: boolean;
  steps: string[];
  intro?: string;
  why: string;
};

const TOOLS: Tool[] = [
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
      'That second small inhale pops open collapsed air sacs in your lungs, and the long exhale offloads carbon dioxide quickly — which is the actual chemistry behind feeling calmer.',
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
      'Cold on the face below the eyes triggers the mammalian dive reflex — your heart rate drops, your nervous system shifts, and the adrenaline wave breaks.',
  },
  {
    id: 'five-four-three-two-one',
    title: '5-4-3-2-1 Grounding',
    tag: '3 min',
    category: 'ground-mind',
    icon: Hand,
    blurb: 'Name what is around you, sense by sense, until your brain rejoins your body.',
    intro:
      'Use this when your thoughts are racing, looping, or running ahead of you — about therapy schedules, school, money, the future.',
    steps: [
      'Name 5 things you can see right now.',
      'Name 4 things you can physically feel.',
      'Name 3 things you can hear.',
      'Name 2 things you can smell.',
      'Name 1 thing you can taste.',
    ],
    why:
      'Anxiety lives in the future. This exercise drags your attention into the present, which is the one place anxiety cannot follow you.',
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
      'Move your attention from head to feet, pausing where it feels tight.',
      'Take one slow breath in. On the exhale, picture that spot getting a little softer.',
      'Move on. You don’t have to fix it. You just had to find it.',
    ],
    why:
      'Caregiver stress is often somatic before it’s cognitive. Naming where it lives is the first step to discharging it.',
  },
  {
    id: 'permission-phrase',
    title: 'Permission Phrase',
    tag: '30 sec',
    category: 'soften-self-talk',
    icon: HeartHandshake,
    blurb: 'Four sentences to interrupt the shame spiral that says you should be doing more.',
    intro:
      'Say them out loud if you can. Whisper them in the car. Your brain believes what you repeat.',
    steps: [
      '“I am allowed to be tired.”',
      '“I am allowed to need help.”',
      '“That does not make me a bad parent.”',
      '“I am doing the best I can with what I have right now.”',
    ],
    why:
      'Parents who speak to themselves the way they would speak to a struggling friend recover from hard moments measurably faster.',
  },
  {
    id: 'self-compassion-break',
    title: 'Self-Compassion Break',
    tag: '2 min',
    category: 'soften-self-talk',
    icon: HeartHandshake,
    blurb: 'A three-line script researchers use to short-circuit caregiver self-criticism.',
    intro:
      'This is the move you make right after you snap at your kid, your partner, or yourself.',
    steps: [
      'Put a hand over your heart, or on your stomach.',
      'Say: “This is a moment of difficulty.”',
      'Then: “Difficulty is part of being a parent. I am not the only one feeling this.”',
      'Then: “May I be kind to myself right now. May I give myself what I need.”',
      'Take one breath. Then go do the next small thing.',
    ],
    why:
      'These three lines map to mindfulness, common humanity, and kindness — and measurably reduce cortisol in clinical studies.',
  },
  {
    id: 'one-thing-rule',
    title: 'The One-Thing Rule',
    tag: '5 min',
    category: 'reset-energy',
    icon: Sparkles,
    blurb: 'Pick one small thing for you today. Not a list. Not a plan. One thing.',
    intro:
      'On heavy days, “self-care” turns into another item on the to-do list. Strip it down. One thing. Today.',
    steps: [
      'Pick one small thing you can actually do for yourself in the next few hours.',
      'Examples: a shower with the door locked. A walk around the block. Five minutes outside.',
      'Decide on the one thing. Out loud, if you can.',
      'Do that one thing. That is enough.',
    ],
    why:
      'Pre-committing to one tiny act of restoration removes the “what should I do for myself today” loop.',
  },
  {
    id: 'three-minute-stop',
    title: 'The 3-Minute Stop',
    tag: '3 min',
    category: 'reset-energy',
    icon: Hourglass,
    blurb: 'A short, structured pause for parents who genuinely don’t have time for self-care.',
    intro:
      'If the only quiet you’re getting is the time it takes to microwave leftovers, that is enough time for this.',
    steps: [
      'Minute 1 — Stop. Notice what you are feeling. Name it: tired, wired, angry, numb.',
      'Minute 2 — Breathe. Slow breaths through the nose. Lengthen the exhale.',
      'Minute 3 — Choose one. One sip of water. One stretch. One sentence written down.',
      'Then go back. That was real rest, even though it was small.',
    ],
    why:
      'Short, structured pauses repeated through the day outperform a single long break that never comes.',
  },
];

const TOOL_BY_ID = Object.fromEntries(TOOLS.map((t) => [t.id, t])) as Record<string, Tool>;

const CATEGORY_LABEL: Record<ToolCategory, string> = {
  'calm-body': 'Calm your body fast',
  'ground-mind': 'Ground anxious thinking',
  'soften-self-talk': 'Soften the voice in your head',
  'reset-energy': 'Reset depleted energy',
};

const CATEGORY_PILL: Record<ToolCategory, string> = {
  'calm-body': 'Calm your body',
  'ground-mind': 'Ground anxious thinking',
  'soften-self-talk': 'Soften self-talk',
  'reset-energy': 'Reset depleted energy',
};

const CATEGORY_BLURB: Record<ToolCategory, string> = {
  'calm-body': 'Breathing patterns and physical resets',
  'ground-mind': 'Tools to bring your attention back to now',
  'soften-self-talk': 'Kind self-talk and thought reframing',
  'reset-energy': 'Short strategies to restore and recharge',
};

const CATEGORY_ORDER: ToolCategory[] = [
  'calm-body',
  'ground-mind',
  'soften-self-talk',
  'reset-energy',
];

const START_HERE_IDS = [
  'four-seven-eight',
  'box-breathing',
  'physiological-sigh',
  'five-four-three-two-one',
  'self-compassion-break',
];

const QUICK_RESET_IDS = ['cold-water-reset', 'permission-phrase', 'one-thing-rule'];

const CATEGORY_ICON: Record<ToolCategory, typeof Leaf> = {
  'calm-body': HeartPulse,
  'ground-mind': Compass,
  'soften-self-talk': HeartHandshake,
  'reset-energy': Zap,
};

/* ─── page ───────────────────────────────────────────────────── */

export default function CaregiverSupportPage() {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<ToolCategory | null>(null);

  const toggleTool = useCallback((id: string) => {
    setActiveToolId((prev) => (prev === id ? null : id));
  }, []);

  const openToolInBrowse = useCallback((id: string) => {
    const tool = TOOL_BY_ID[id];
    if (tool) setExpandedCategory(tool.category);
    setActiveToolId((prev) => (prev === id ? null : id));
  }, []);

  const expandCategory = (cat: ToolCategory) => {
    setExpandedCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Breadcrumb + intro */}
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
          <li className="font-medium text-brand-muted-700">Mental Health Toolbox</li>
        </ol>
      </nav>

      <header className="mt-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1 text-[11px] font-semibold text-brand-plum-700">
          <HeartHandshake className="h-3.5 w-3.5" /> Parent Support
        </span>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-brand-navy-700 sm:text-4xl">
          Your mental health toolbox
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-brand-muted-700">
          A small set of tools to help you lower the load right now.
        </p>
      </header>

      <section
        aria-label="How to use this page"
        className="mt-5 rounded-2xl border border-brand-plum-100 bg-brand-plum-50/50 px-4 py-3 sm:px-5"
      >
        <p className="text-[12px] leading-relaxed text-brand-muted-700">
          <span className="font-semibold text-brand-plum-800">How to use this: </span>
          Pick one tool that matches what you need most in this moment. Try it once.
          That&rsquo;s the whole assignment.
        </p>
      </section>

      {/* Start here right now */}
      <section aria-label="Start here right now" className="mt-8">
        <SectionHeader
          icon={Sparkles}
          title="Start here right now"
          subtitle="Use these tools when the load feels heavy."
        />
        <div className="mt-1 rounded-2xl border border-surface-border bg-white shadow-soft">
          <ol className="divide-y divide-surface-border">
            {START_HERE_IDS.map((id) => {
              const tool = TOOL_BY_ID[id];
              if (!tool) return null;
              return (
                <ToolListItem
                  key={id}
                  tool={tool}
                  isActive={activeToolId === id}
                  onToggle={() => toggleTool(id)}
                />
              );
            })}
          </ol>
        </div>
      </section>

      {/* Quick resets + Helpful supports */}
      <section aria-label="Quick resets and supports" className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft">
          <SectionHeader
            icon={Zap}
            title="Quick resets"
            subtitle="Fast tools for in-the-moment relief."
          />
          <ul className="mt-1 divide-y divide-surface-border">
            {QUICK_RESET_IDS.map((id) => {
              const tool = TOOL_BY_ID[id];
              if (!tool) return null;
              return (
                <ToolListItem
                  key={id}
                  tool={tool}
                  isActive={activeToolId === id}
                  onToggle={() => toggleTool(id)}
                  compact
                />
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => {
              expandCategory('calm-body');
              document.getElementById('browse-by-need')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-plum-700 hover:text-brand-plum-800"
          >
            View all quick resets <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft">
          <SectionHeader
            icon={Users}
            title="Helpful supports"
            subtitle="You don&rsquo;t have to do this alone."
          />
          <ul className="mt-1 divide-y divide-surface-border">
            <SupportRow
              label="Connect with parents"
              detail="Find peer support"
              href="/support/connect"
            />
            <SupportRow
              label="Find local help"
              detail="Therapists, groups, resources"
              href="/support/find"
            />
            <SupportRow
              label="Crisis support: 988"
              detail="24/7, free and confidential"
              href="tel:988"
              isCrisis
            />
          </ul>
          <Link
            href="/support/help"
            className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-plum-700 hover:text-brand-plum-800"
          >
            See all supports <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Browse by need */}
      <section id="browse-by-need" aria-label="Browse by need" className="mt-9 scroll-mt-6">
        <SectionHeader
          icon={Compass}
          title="Browse by need"
          subtitle="Find tools grouped by what you need most."
        />
        <div className="mt-1 rounded-2xl border border-surface-border bg-white shadow-soft">
          {CATEGORY_ORDER.map((cat) => {
            const tools = TOOLS.filter((t) => t.category === cat);
            const expanded = expandedCategory === cat;
            const CatIcon = CATEGORY_ICON[cat];
            return (
              <div key={cat} className="border-b border-surface-border last:border-b-0">
                <button
                  type="button"
                  onClick={() => expandCategory(cat)}
                  aria-expanded={expanded}
                  className={
                    'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-200 ease-out sm:px-5 ' +
                    (expanded
                      ? 'bg-brand-plum-50/60'
                      : 'hover:bg-surface-subtle/50')
                  }
                >
                  <span
                    className={
                      'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ' +
                      (expanded
                        ? 'bg-brand-plum-100 text-brand-plum-700'
                        : 'bg-primary/10 text-primary')
                    }
                  >
                    <CatIcon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-brand-navy-700">
                      {CATEGORY_LABEL[cat]}
                    </p>
                    <p className="text-[12px] text-brand-muted-600">{CATEGORY_BLURB[cat]}</p>
                  </div>
                  <span className="hidden shrink-0 text-[12px] font-medium text-brand-muted-500 sm:inline">
                    {tools.length} tools
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-primary">
                    View tools
                    <ChevronDown
                      className="toolbox-chevron h-3.5 w-3.5"
                      data-open={expanded ? 'true' : 'false'}
                    />
                  </span>
                </button>
                <CollapsibleReveal open={expanded}>
                  <ol className="border-t border-surface-border bg-surface-subtle/30 divide-y divide-surface-border">
                    {tools.map((tool) => (
                      <ToolListItem
                        key={tool.id}
                        tool={tool}
                        isActive={activeToolId === tool.id}
                        onToggle={() => openToolInBrowse(tool.id)}
                        compact
                      />
                    ))}
                  </ol>
                </CollapsibleReveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why these tools help */}
      <section aria-label="Why these tools help" className="mt-9">
        <SectionHeader
          icon={Sun}
          title="Why these tools help"
          subtitle="Short context — not a lecture."
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: 'Small tools compound.',
              body: 'Two minutes of practice, a few times per week, can shift your baseline.',
            },
            {
              title: 'A calmer parent can help regulate a child.',
              body: 'Your calm becomes a cue for safety.',
            },
            {
              title: 'Support is a real strategy, not a luxury.',
              body: 'Asking for help is a strength.',
            },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-surface-border bg-white px-4 py-3.5 shadow-soft"
            >
              <p className="text-[13px] font-semibold text-brand-navy-700">{title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom callout */}
      <section
        aria-label="If a tool is not enough"
        className="mt-9 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/40 px-5 py-5 sm:px-6"
      >
        <div className="flex items-start gap-2">
          <Heart className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum-600" />
          <div>
            <h2 className="text-lg font-bold text-brand-navy-700">If a tool isn&rsquo;t enough today</h2>
            <p className="mt-1 text-[14px] leading-relaxed text-brand-muted-700">
              These options can help in the moment and connect you with the right support.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            href="/support/connect"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90"
          >
            <Users className="h-4 w-4" /> Connect with parents
          </Link>
          <Link
            href="/support/find"
            className="inline-flex items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-plum-700 transition hover:bg-brand-plum-100"
          >
            <MapPin className="h-4 w-4" /> Find local help
          </Link>
          <a
            href="tel:988"
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] font-semibold text-rose-800 transition hover:bg-rose-100"
          >
            <Phone className="h-4 w-4" /> Crisis support: 988
          </a>
        </div>
      </section>

      <p className="mt-6 text-[11.5px] leading-relaxed text-brand-muted-500">
        Common Ground is parent support, not clinical care. These tools are general
        mental-health techniques drawn from public, evidence-based practice. They do not
        diagnose, treat, or replace care from a licensed clinician. If you are in crisis,
        call or text{' '}
        <a href="tel:988" className="font-semibold underline">
          988
        </a>
        .
      </p>
    </main>
  );
}

/* ─── shared UI pieces ───────────────────────────────────────── */

function CollapsibleReveal({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="toolbox-reveal" data-open={open ? 'true' : 'false'}>
      <div className="toolbox-reveal-inner">
        <div className="toolbox-reveal-content">{children}</div>
      </div>
    </div>
  );
}

function ToolListItem({
  tool,
  isActive,
  onToggle,
  compact = false,
}: {
  tool: Tool;
  isActive: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <li
      className={
        'transition-colors duration-200 ease-out ' +
        (isActive ? 'bg-brand-plum-50/70' : '')
      }
    >
      <CompactToolRow
        tool={tool}
        isActive={isActive}
        onToggle={onToggle}
        compact={compact}
      />
      <CollapsibleReveal open={isActive}>
        <ToolDetailPanel tool={tool} onClose={onToggle} />
      </CollapsibleReveal>
    </li>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-brand-plum-100 pb-2.5">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <h2 className="text-lg font-bold leading-tight text-brand-navy-700 sm:text-xl">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-1 pl-9 text-[13px] leading-relaxed text-brand-muted-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function CompactToolRow({
  tool,
  isActive,
  onToggle,
  compact = false,
}: {
  tool: Tool;
  isActive: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  const Icon = tool.icon;
  return (
    <div
      className={
        'flex flex-wrap items-center gap-x-3 gap-y-2 transition-colors duration-200 ease-out ' +
        (compact ? 'px-4 py-3 sm:px-5' : 'px-4 py-4 sm:px-5') +
        (isActive ? ' border-l-2 border-brand-plum-400 pl-[14px] sm:pl-[18px]' : ' border-l-2 border-transparent')
      }
    >
      <span
        className={
          'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ' +
          (isActive
            ? 'bg-brand-plum-100 text-brand-plum-800'
            : 'bg-brand-plum-50 text-brand-plum-700')
        }
      >
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={
            'text-[14px] font-semibold ' +
            (isActive ? 'text-brand-plum-900' : 'text-brand-navy-700')
          }
        >
          {tool.title}
        </p>
        {!compact && (
          <p className="mt-0.5 text-[12px] leading-relaxed text-brand-muted-600">
            {tool.blurb}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-brand-warm-100 px-2 py-0.5 text-[10px] font-semibold text-brand-muted-700">
            {tool.tag}
          </span>
          <span
            className={
              'rounded-full px-2 py-0.5 text-[10px] font-semibold ' +
              (isActive
                ? 'bg-brand-plum-100 text-brand-plum-800'
                : 'bg-brand-plum-50 text-brand-plum-700')
            }
          >
            {CATEGORY_PILL[tool.category]}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        className={
          'inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold transition-colors duration-200 ' +
          (isActive
            ? 'text-brand-plum-800 hover:text-brand-plum-900'
            : 'text-primary hover:text-primary/80')
        }
      >
        {isActive ? 'Close' : 'Open tool'}
        <ArrowRight
          className={
            'h-3.5 w-3.5 transition-transform duration-200 ' +
            (isActive ? 'rotate-90' : '')
          }
        />
      </button>
    </div>
  );
}

function SupportRow({
  label,
  detail,
  href,
  isCrisis,
}: {
  label: string;
  detail: string;
  href: string;
  isCrisis?: boolean;
}) {
  const inner = (
    <>
      <div className="min-w-0">
        <p
          className={
            'text-[14px] font-medium ' +
            (isCrisis ? 'text-rose-800' : 'text-brand-navy-700')
          }
        >
          {label}
        </p>
        <p className="text-[12px] text-brand-muted-500">{detail}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
    </>
  );
  const className = 'flex w-full items-center justify-between gap-3 py-3 text-left hover:text-primary';
  if (href.startsWith('tel:')) {
    return (
      <li>
        <a href={href} className={className}>
          {inner}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className={className}>
        {inner}
      </Link>
    </li>
  );
}

function ToolDetailPanel({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  return (
    <article className="mx-4 mb-4 rounded-xl border border-brand-plum-200/80 bg-white px-4 py-4 shadow-sm sm:mx-5 sm:px-5">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-[12px] font-semibold text-brand-muted-500 transition-colors duration-200 hover:text-brand-navy-700"
        >
          Close
        </button>
      </div>

      {tool.intro && (
        <p className="mt-1 text-[14px] leading-relaxed text-brand-muted-700">{tool.intro}</p>
      )}

      {tool.isOrb && (
        <div className="mb-4 mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
          <BreathingOrb />
          <p className="mt-3 text-center text-[11.5px] text-brand-muted-500">
            Inhale 4 · Hold 7 · Exhale 8 · Repeat 4 times
          </p>
        </div>
      )}

      <ol className="mt-3 space-y-2.5">
        {tool.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-brand-muted-800">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-surface-border bg-surface-subtle text-[11px] font-bold text-brand-muted-500">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-xl border border-surface-border bg-surface-subtle/60 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted-500">
          Why this works
        </p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-muted-700">{tool.why}</p>
      </div>
    </article>
  );
}
