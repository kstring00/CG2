'use client';

/**
 * Homepage support-hub sections, rendered beneath the existing hero:
 *   1. "What do you need today?" — six quick tiles
 *   2. Two feature cards (Next Step / At-Home) — the Mental Health Toolbox
 *      tile was removed pending clinical review; its pages remain reachable
 *      from the Parent Support section only.
 *   3. Find Local Help — stylized map + reviewed listing cards
 *   4. Bottom support tiles (Financial / Siblings / Connect)
 *   5. "Already a Texas ABA family?" portal banner (demo preview)
 *
 * Every CTA links to an existing route. Provider cards reuse the real
 * vetted directory data that powers /support/find — no placeholder data.
 */

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Compass,
  ExternalLink,
  Heart,
  Home,
  Info,
  Laptop,
  Link2,
  MapPin,
  MessagesSquare,
  PiggyBank,
  Users,
  Wind,
  Wrench,
} from 'lucide-react';
import { AT_HOME_STRATEGIES_LABEL } from '@/lib/supportNavLabels';
import { cn } from '@/lib/utils';
import { sensoryFriendlyPlaces } from '@/lib/data';
import { verifiedProviders } from '@/lib/providers';

/* ─── palette ────────────────────────────────────────────────
   Deep navy (primary token) + cream (#f4efe8, matches the hero
   canvas) + gentle gold (amber) accents. */

const CREAM = '#f4efe8';

/* ─── shared building blocks ─────────────────────────────── */

function SectionHeading({
  title,
  text,
  center,
  className,
}: {
  title: string;
  text?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('mb-10', center && 'text-center', className)}>
      <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-[2.1rem]">
        {title}
      </h2>
      {text && (
        <p className={cn('mt-3 text-base leading-relaxed text-stone-600', center && 'mx-auto max-w-xl')}>
          {text}
        </p>
      )}
    </div>
  );
}

function SupportTile({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${label} — ${description}`}
      className="group flex items-center gap-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
    >
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-200/70 bg-amber-50/70 text-amber-600 transition group-hover:bg-amber-100/80">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-primary">{label}</span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-stone-500">{description}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-amber-600" aria-hidden />
    </Link>
  );
}

function FeatureCard({
  title,
  purpose,
  ctaLabel,
  ctaHref,
  children,
}: {
  title: string;
  purpose: string;
  ctaLabel: string;
  ctaHref: string;
  children: React.ReactNode;
}) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-stone-200/80 bg-white p-6 shadow-soft transition duration-200 hover:shadow-card-hover sm:p-7">
      <h3 className="text-xl font-bold text-primary">{title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-stone-500">{purpose}</p>
      <div className="mt-5 flex-1">{children}</div>
      <Link
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
      >
        {ctaLabel} <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </article>
  );
}

function ChipRow({ chips }: { chips: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-hidden>
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-stone-600"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

/* ─── Section 1 data — six quick tiles ───────────────────── */

const NEED_TILES = [
  { href: '/support/intake',      icon: Compass,        label: 'I need a next step',          description: 'A short guided path to what matters now.' },
  { href: '/support/at-home',     icon: Home,           label: 'I need help at home',         description: 'Routines, transitions, and behavior tools.' },
  { href: '/support/hard-days',   icon: Heart,          label: 'I feel overwhelmed',          description: 'Grounding and relief for hard days.' },
  { href: '/support/what-is-aba', icon: BookOpen,       label: 'I want to understand ABA',    description: 'Plain-English answers, no jargon.' },
  { href: '/support/connect',     icon: MessagesSquare, label: 'I want to connect',           description: 'Parents and groups who get it.' },
  { href: '/support/resources',   icon: Wrench,         label: 'I need practical resources',  description: 'Vetted guides matched to your needs.' },
] as const;

/* ─── Section 2 data — feature card internals ────────────── */

const NEXT_STEPS = [
  'Understand where you are',
  'Find local providers',
  'Build your next step',
  'Get connected with support',
] as const;

const AT_HOME_ROWS = [
  { icon: Home,   title: 'Visual morning routines',  tag: 'Routines' },
  { icon: MessagesSquare, title: 'First–then language', tag: 'Communication' },
  { icon: Wind,   title: '5-minute sensory resets',  tag: 'Sensory Breaks' },
] as const;

/* ─── Section 3 data — verified providers (reused, not invented) ──
   Picks one representative entry per category from the same vetted
   directory that powers /support/find. Entries without a real URL
   render "Being verified" instead of a link. */

function shortLocation(location: string): string {
  return location.split('(')[0].replace(/,?\s*TX.*$/i, '').trim();
}

interface VerifiedCardData {
  category: string;
  name: string;
  location: string;
  href?: string;
}

function buildVerifiedCards(): VerifiedCardData[] {
  const dentist = sensoryFriendlyPlaces.find((p) => p.category === 'dentist' && !p.isDemo);
  const speechOt = verifiedProviders.find(
    (p) => p.category === 'speech-therapy' || p.category === 'occupational-therapy',
  );
  const respite = verifiedProviders.find((p) => p.category === 'respite-care');
  const group = verifiedProviders.find((p) => p.category === 'support-groups');

  const cards: VerifiedCardData[] = [];
  if (dentist) {
    cards.push({
      category: 'Sensory-friendly dentists',
      name: dentist.name,
      location: dentist.city,
      href: dentist.website || undefined,
    });
  }
  if (speechOt) {
    cards.push({
      category: 'Speech & OT clinics',
      name: speechOt.provider_name,
      location: shortLocation(speechOt.location),
      href: speechOt.website || undefined,
    });
  }
  if (respite) {
    cards.push({
      category: 'Respite care',
      name: respite.provider_name,
      location: shortLocation(respite.location),
      href: respite.website || undefined,
    });
  }
  if (group) {
    cards.push({
      category: 'Parent support groups',
      name: group.provider_name,
      location: shortLocation(group.location),
      href: group.website || undefined,
    });
  }
  return cards;
}

const VERIFIED_CARDS = buildVerifiedCards();

function ProviderCard({ category, name, location, href }: VerifiedCardData) {
  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-soft transition duration-200 hover:border-amber-200 hover:shadow-card">
      <p className="text-[10.5px] font-bold uppercase tracking-wide text-amber-700">{category}</p>
      <p className="mt-1 text-[14px] font-semibold leading-snug text-primary">{name}</p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[12px] text-stone-500">
          <MapPin className="h-3 w-3" aria-hidden /> {location}
        </span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${name} website (opens in a new tab)`}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary underline-offset-2 transition hover:text-primary/70 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm"
          >
            Website <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        ) : (
          <span className="text-[11px] font-medium italic text-stone-400">Being verified</span>
        )}
      </div>
    </div>
  );
}

/* ─── Section 3 — decorative Houston map ─────────────────── */

// Location chips match the service footprint: Sugar Land, Katy, Pearland,
// Missouri City, Austin, Plano.
const MAP_PINS: { label: string; top: string; left: string; major?: boolean }[] = [
  { label: 'Plano',         top: '18%', left: '62%' },
  { label: 'Austin',        top: '38%', left: '22%' },
  { label: 'Katy',          top: '42%', left: '52%' },
  { label: 'Sugar Land',    top: '62%', left: '38%', major: true },
  { label: 'Missouri City', top: '78%', left: '54%' },
  { label: 'Pearland',      top: '58%', left: '74%' },
];

function HoustonMap() {
  return (
    <Link
      href="/support/find"
      aria-label="Open the Find Local Help directory for the communities we serve"
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-3xl border border-stone-200/80 shadow-soft transition duration-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
      style={{ backgroundColor: '#fbf9f4' }}
    >
      {/* Stylized, decorative map — no live map service */}
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        focusable="false"
      >
        {/* bayou */}
        <path
          d="M-10 150 C 60 120, 120 180, 200 150 S 340 100, 410 130"
          fill="none"
          stroke="#bcd3e6"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* highways */}
        <path d="M40 -10 C 120 80, 200 140, 230 310" fill="none" stroke="#1a2e52" strokeWidth="3" opacity="0.12" />
        <path d="M-10 230 C 100 200, 260 220, 410 180" fill="none" stroke="#1a2e52" strokeWidth="3" opacity="0.12" />
        <path d="M300 -10 C 270 90, 290 200, 250 310" fill="none" stroke="#1a2e52" strokeWidth="3" opacity="0.12" />
        {/* beltway loop */}
        <ellipse
          cx="225"
          cy="120"
          rx="95"
          ry="70"
          fill="none"
          stroke="#1a2e52"
          strokeWidth="2.5"
          strokeDasharray="7 7"
          opacity="0.22"
        />
        {/* soft city glow */}
        <circle cx="225" cy="115" r="34" fill="#e9b94922" />
      </svg>
      {MAP_PINS.map((pin) => (
        <span
          key={pin.label}
          className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
          style={{ top: pin.top, left: pin.left }}
          aria-hidden
        >
          <MapPin
            className={cn(
              'drop-shadow-sm',
              pin.major ? 'h-7 w-7 text-amber-600' : 'h-5 w-5 text-primary/70',
            )}
            fill={pin.major ? '#fef3c7' : '#eef1f8'}
          />
          <span className="mt-0.5 whitespace-nowrap rounded-full border border-stone-200 bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-primary shadow-sm">
            {pin.label}
          </span>
        </span>
      ))}
      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-primary shadow-sm transition group-hover:border-amber-300">
        Explore the directory <ArrowRight className="h-3 w-3" aria-hidden />
      </span>
    </Link>
  );
}

/* ─── Section 4 data — bottom support tiles ──────────────── */

const BOTTOM_TILES = [
  {
    href: '/support/financial',
    icon: PiggyBank,
    title: 'Financial Help',
    text: 'Explore insurance, Medicaid waivers, and grants to help make care possible.',
  },
  {
    href: '/support/siblings',
    icon: Users,
    title: 'Sibling Support',
    text: 'Resources and support for siblings on their own unique journey.',
  },
  {
    href: '/support/connect',
    icon: Link2,
    title: 'Connect With Parents',
    text: "Get matched with a parent who gets it. You don't have to do this alone.",
  },
] as const;

/* ─── the hub ────────────────────────────────────────────── */

export default function HomeSupportHub() {
  return (
    <>
      {/* ── Section 1: What do you need today? ─────────────── */}
      <section aria-label="What do you need today?" className="bg-white px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            center
            title="What do you need today?"
            text="Start wherever you are. Every path below is free and built for parents."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NEED_TILES.map((tile) => (
              <SupportTile key={tile.href + tile.label} {...tile} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Feature cards ─────────────────────────── */}
      <section aria-label="Main features" className="px-6 py-16 sm:px-8 sm:py-20" style={{ backgroundColor: CREAM }}>
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Card 1 — Find My Next Step */}
            <FeatureCard
              title="Find My Next Step"
              purpose="A guided roadmap that meets you exactly where you are."
              ctaLabel="Start My Next Step"
              ctaHref="/support/intake"
            >
              <ChipRow chips={['Newly Diagnosed', 'In Services', 'Exploring Options']} />
              <ol className="mt-5 space-y-0">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step} className="relative flex items-start gap-3 pb-4 last:pb-0">
                    {i < NEXT_STEPS.length - 1 && (
                      <span className="absolute left-[13px] top-7 h-[calc(100%-1.5rem)] w-px bg-stone-200" aria-hidden />
                    )}
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-amber-50 text-[11px] font-bold text-amber-700">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-[13.5px] font-medium text-stone-700">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                  <span>Your pathway</span>
                  <span>Step 1 of 4</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-200" role="presentation">
                  <div className="h-full w-1/4 rounded-full bg-amber-500" />
                </div>
              </div>
            </FeatureCard>

            {/* Card 2 — At-Home Strategies */}
            <FeatureCard
              title={AT_HOME_STRATEGIES_LABEL}
              purpose="A clean parent toolbox of practical, real-life tools."
              ctaLabel="Browse Strategies"
              ctaHref="/support/at-home"
            >
              <ChipRow chips={['Routines', 'Communication', 'Transitions', 'Sensory Breaks', 'Behavior Support']} />
              <ul className="mt-5 space-y-2.5">
                {AT_HOME_ROWS.map(({ icon: Icon, title, tag }) => (
                  <li
                    key={title}
                    className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50/70 px-3.5 py-3"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-200/70 bg-white text-amber-600">
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 text-[13.5px] font-medium text-stone-700">{title}</span>
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-stone-500 ring-1 ring-stone-200">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            </FeatureCard>

            {/* Mental Health Toolbox tile removed pending clinical review.
                The underlying pages (/support/caregiver, /support/hard-days,
                /calm, /support/check-in) remain live, reachable from the
                Parent Support section only. */}
          </div>
        </div>
      </section>

      {/* ── Section 3: Find Local Help ──────────────────────── */}
      <section aria-label="Find Local Help" className="bg-white px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr_1fr]">
            {/* Left — heading */}
            <div>
              <SectionHeading
                className="mb-3"
                title="Find Local Help"
                text="Local support you can trust, right where you are."
              />
              <p className="text-sm leading-relaxed text-stone-500">
                Local support you can trust — reviewed listings across the communities we serve.
              </p>
              <Link
                href="/support/find"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 transition hover:text-primary/70 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm"
              >
                See all verified providers <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            {/* Middle — decorative map */}
            <HoustonMap />

            {/* Right — verified provider cards */}
            <div>
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-800">
                <Heart className="h-3 w-3" aria-hidden /> Reviewed for Common Ground
              </p>
              <div className="space-y-3">
                {VERIFIED_CARDS.map((card) => (
                  <ProviderCard key={card.name} {...card} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Bottom support tiles ─────────────────── */}
      <section aria-label="More support" className="px-6 py-16 sm:px-8 sm:py-20" style={{ backgroundColor: CREAM }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {BOTTOM_TILES.map(({ href, icon: Icon, title, text }) => (
              <Link
                key={href + title}
                href={href}
                aria-label={`${title} — ${text}`}
                className="group rounded-3xl border border-stone-200/80 bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/70 bg-amber-50/70 text-amber-600 transition group-hover:bg-amber-100/80">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary">{title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-stone-600">{text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Portal banner ────────────────────────── */}
      <section aria-labelledby="client-portal" className="bg-white px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div
            className="flex flex-col items-start gap-8 overflow-hidden rounded-3xl p-8 shadow-card sm:p-10 lg:flex-row lg:items-center"
            style={{ background: 'linear-gradient(125deg, #111d39 0%, #1a2e52 55%, #25406e 100%)' }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                For enrolled families
              </p>
              <h2 id="client-portal" className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Already a Texas ABA family?
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
                Preview the client portal experience (demo).
              </p>
              <p className="mt-3 flex max-w-xl items-start gap-2 rounded-xl border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-[13px] leading-relaxed text-amber-100">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                Preview — this portal is a design demo and is not connected to any client
                records. Pending clinical review.
              </p>
              <Link
                href="/client"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-md transition hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Go to Client Portal <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            {/* Subtle portal visual */}
            <div className="hidden shrink-0 sm:block" aria-hidden>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <Laptop className="h-14 w-14 text-amber-200/90" strokeWidth={1.25} />
                <div className="mt-3 space-y-1.5">
                  <div className="h-1.5 w-24 rounded-full bg-white/25" />
                  <div className="h-1.5 w-16 rounded-full bg-white/15" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
