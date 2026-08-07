'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Compass,
  ExternalLink,
  Heart,
  Home,
  Lock,
  MapPin,
  MessagesSquare,
  ShieldCheck,
  Signpost,
  UsersRound,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sensoryFriendlyPlaces } from '@/lib/data';
import { verifiedProviders } from '@/lib/providers';

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
      <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-[2.1rem]">{title}</h2>
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

function BenefitCard({
  icon: Icon,
  title,
  description,
  iconClassName,
  iconWrapClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  iconClassName: string;
  iconWrapClassName: string;
}) {
  return (
    <article className="flex items-start gap-5 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-soft backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover sm:p-7">
      <span className={cn('inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border', iconWrapClassName)}>
        <Icon className={cn('h-7 w-7', iconClassName)} aria-hidden />
      </span>
      <div className="pt-1">
        <h3 className="text-lg font-bold text-primary">{title}</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-stone-600">{description}</p>
      </div>
    </article>
  );
}

const NEED_TILES = [
  { href: '/support/intake', icon: Compass, label: 'I need a next step', description: 'A short guided path to what matters now.' },
  { href: '/support/at-home', icon: Home, label: 'I need help at home', description: 'Routines, transitions, and behavior tools.' },
  { href: '/support/hard-days', icon: Heart, label: 'I feel overwhelmed', description: 'Grounding and relief for hard days.' },
  { href: '/support/what-is-aba', icon: BookOpen, label: 'I want to understand ABA', description: 'Plain-English answers, no jargon.' },
  { href: '/support/connect', icon: MessagesSquare, label: 'I want to connect', description: 'Parents and groups who get it.' },
  { href: '/support/resources', icon: Wrench, label: 'I need practical resources', description: 'Guides matched to your needs.' },
] as const;

const BENEFITS = [
  {
    icon: UsersRound,
    title: 'Built for parents',
    description: 'Parent-friendly guidance designed for the people carrying care into daily life.',
    iconClassName: 'text-teal-600',
    iconWrapClassName: 'border-teal-100 bg-teal-50',
  },
  {
    icon: Signpost,
    title: 'Clear next steps',
    description: 'Turn uncertainty into practical direction with support matched to your family’s needs.',
    iconClassName: 'text-violet-600',
    iconWrapClassName: 'border-violet-100 bg-violet-50',
  },
  {
    icon: Wrench,
    title: 'Helpful tools at home',
    description: 'Explore routines, communication tools, caregiver support, and printable resources when needed.',
    iconClassName: 'text-amber-600',
    iconWrapClassName: 'border-amber-100 bg-amber-50',
  },
  {
    icon: ShieldCheck,
    title: 'Confidence for families',
    description: 'Leave with more clarity, better questions, and a stronger sense of what to do next.',
    iconClassName: 'text-rose-500',
    iconWrapClassName: 'border-rose-100 bg-rose-50',
  },
] as const;

function shortLocation(location: string): string {
  return location.split('(')[0].replace(/,?\s*TX.*$/i, '').trim();
}

interface ProviderCardData {
  category: string;
  name: string;
  location: string;
  href?: string;
}

function buildProviderCards(): ProviderCardData[] {
  const dentist = sensoryFriendlyPlaces.find((place) => place.category === 'dentist' && !place.isDemo);
  const speechOt = verifiedProviders.find(
    (provider) => provider.category === 'speech-therapy' || provider.category === 'occupational-therapy',
  );
  const respite = verifiedProviders.find((provider) => provider.category === 'respite-care');
  const group = verifiedProviders.find((provider) => provider.category === 'support-groups');
  const cards: ProviderCardData[] = [];

  if (dentist) cards.push({ category: 'Sensory-friendly dentists', name: dentist.name, location: dentist.city, href: dentist.website || undefined });
  if (speechOt) cards.push({ category: 'Speech & OT clinics', name: speechOt.provider_name, location: shortLocation(speechOt.location), href: speechOt.website || undefined });
  if (respite) cards.push({ category: 'Respite care', name: respite.provider_name, location: shortLocation(respite.location), href: respite.website || undefined });
  if (group) cards.push({ category: 'Parent support groups', name: group.provider_name, location: shortLocation(group.location), href: group.website || undefined });

  return cards;
}

const PROVIDER_CARDS = buildProviderCards();

function ProviderCard({ category, name, location, href }: ProviderCardData) {
  return (
    <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-[0_14px_36px_rgba(25,48,82,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_18px_44px_rgba(25,48,82,0.12)]">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-amber-700">{category}</p>
      <p className="mt-1.5 text-[15px] font-semibold leading-snug text-primary">{name}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1 text-[12px] text-stone-500">
          <MapPin className="h-3 w-3" aria-hidden /> {location}
        </span>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${name} website (opens in a new tab)`} className="inline-flex items-center gap-1 rounded-sm text-[12px] font-semibold text-primary underline-offset-2 transition hover:text-primary/70 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            Website <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        ) : null}
      </div>
    </div>
  );
}

const TEXAS_LOCATIONS = [
  { label: 'Plano', top: '20%', left: '72%', tone: 'navy' },
  { label: 'Cedar Hill', top: '31%', left: '68%', tone: 'violet' },
  { label: 'Austin', top: '53%', left: '53%', tone: 'teal' },
  { label: 'Katy', top: '58%', left: '79%', tone: 'amber' },
  { label: 'Pearland', top: '69%', left: '72%', tone: 'navy' },
  { label: 'Sugar Land', top: '76%', left: '63%', tone: 'violet' },
] as const;

function TexasMap() {
  return (
    <Link
      href="/support/find"
      aria-label="Explore Texas ABA Centers support locations across Texas"
      className="group relative block min-h-[470px] w-full overflow-hidden rounded-[2rem] border border-slate-200/90 bg-[#f8faf7] shadow-[0_26px_75px_rgba(20,42,73,0.14)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_34px_90px_rgba(20,42,73,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
    >
      <svg viewBox="0 0 760 520" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
        <defs>
          <linearGradient id="texasMapBase" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbfaf5" />
            <stop offset="100%" stopColor="#eef6f2" />
          </linearGradient>
          <linearGradient id="texasWater" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#dff2f7" />
            <stop offset="100%" stopColor="#b9deea" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <rect width="760" height="520" fill="url(#texasMapBase)" />
        <circle cx="620" cy="390" r="180" fill="#d8eef5" opacity="0.55" filter="url(#softGlow)" />
        <path d="M548 518 C 585 453 600 399 592 351 C 640 346 692 366 760 414 L760 520 Z" fill="url(#texasWater)" opacity="0.95" />
        <path d="M188 68 L522 68 L524 103 L625 120 L642 225 L694 282 L664 359 L617 385 L587 469 L516 484 L482 446 L393 438 L348 375 L273 353 L230 290 L166 263 L132 188 L160 125 Z" fill="#fbfaf3" stroke="#cbd7d2" strokeWidth="4" />
        <path d="M167 128 C 266 156, 366 153, 533 118" fill="none" stroke="#e7cfab" strokeWidth="2" opacity="0.75" />
        <path d="M204 220 C 312 194, 430 216, 626 291" fill="none" stroke="#e7cfab" strokeWidth="2" opacity="0.72" />
        <path d="M308 350 C 392 324, 486 332, 620 385" fill="none" stroke="#e7cfab" strokeWidth="2" opacity="0.7" />
        <path d="M438 76 C 420 173, 441 276, 500 458" fill="none" stroke="#d9e2de" strokeWidth="5" opacity="0.85" />
        <path d="M322 142 C 365 235, 418 314, 505 435" fill="none" stroke="#d9e2de" strokeWidth="5" opacity="0.8" />
        <path d="M545 128 C 519 232, 537 326, 589 429" fill="none" stroke="#d9e2de" strokeWidth="5" opacity="0.8" />
        <path d="M181 278 C 302 286, 437 281, 638 257" fill="none" stroke="#e4e9e6" strokeWidth="4" />
        <g fill="#a4b1ad" opacity="0.55">
          <circle cx="246" cy="118" r="4" /><circle cx="295" cy="163" r="4" /><circle cx="369" cy="128" r="4" />
          <circle cx="462" cy="164" r="4" /><circle cx="552" cy="185" r="4" /><circle cx="584" cy="247" r="4" />
          <circle cx="257" cy="305" r="4" /><circle cx="349" cy="291" r="4" /><circle cx="440" cy="367" r="4" />
        </g>
      </svg>

      <div className="absolute left-5 top-5 rounded-2xl border border-white/80 bg-white/92 px-5 py-4 shadow-xl backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">Statewide Texas</p>
        <p className="mt-1 text-base font-semibold text-primary">Local support directory</p>
        <p className="mt-1 text-[11px] text-stone-500">Verified resources across Texas</p>
      </div>

      <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white/95 text-primary shadow-md" aria-hidden>
        <span className="flex h-10 w-10 items-center justify-center border-b border-stone-200 text-lg font-semibold">+</span>
        <span className="flex h-10 w-10 items-center justify-center text-lg font-semibold">−</span>
      </div>

      {TEXAS_LOCATIONS.map((pin) => {
        const toneClass = pin.tone === 'amber'
          ? 'bg-amber-500'
          : pin.tone === 'teal'
            ? 'bg-teal-600'
            : pin.tone === 'violet'
              ? 'bg-violet-500'
              : 'bg-primary';
        return (
          <span key={pin.label} className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center" style={{ top: pin.top, left: pin.left }} aria-hidden>
            <span className={cn('inline-flex h-10 w-10 items-center justify-center rounded-full border-4 border-white text-white shadow-lg', toneClass)}>
              <MapPin className="h-5 w-5" fill="currentColor" />
            </span>
            <span className="mt-1 whitespace-nowrap rounded-full border border-stone-200 bg-white/95 px-3 py-1 text-[10px] font-semibold text-primary shadow-md backdrop-blur-sm">
              {pin.label}
            </span>
          </span>
        );
      })}

      <div className="absolute bottom-5 left-5 max-w-[70%] rounded-2xl border border-white/80 bg-white/92 px-4 py-3 shadow-md backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">Coverage</p>
        <p className="mt-1 text-[11px] font-semibold leading-relaxed text-primary">Cedar Hill • Plano • Austin • Katy • Pearland • Sugar Land</p>
      </div>

      <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[12px] font-semibold text-white shadow-lg transition group-hover:bg-primary/90">
        Explore the directory <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

export default function HomeSupportHub() {
  return (
    <>
      <section aria-label="What do you need today?" className="bg-white px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading center title="What do you need today?" text="Start wherever you are. Every path below is free and built for parents." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NEED_TILES.map((tile) => <SupportTile key={tile.href + tile.label} {...tile} />)}
          </div>
        </div>
      </section>

      <section aria-labelledby="common-ground-benefits" className="relative overflow-hidden px-6 py-16 sm:px-8 sm:py-20" style={{ background: 'radial-gradient(circle at 0% 15%, rgba(153, 246, 228, 0.34), transparent 35%), radial-gradient(circle at 100% 85%, rgba(233, 213, 255, 0.5), transparent 37%), linear-gradient(110deg, #effcf9 0%, #f3f8fb 52%, #f7f2ff 100%)' }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-teal-100 bg-teal-50/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700 shadow-sm">For parents &amp; families</span>
            <h2 id="common-ground-benefits" className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-[2.25rem]">Support that reaches beyond the clinic</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600 sm:text-base">Common Ground is built for parents and caregivers—helping families feel informed, supported, and more prepared for everyday life at home.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {BENEFITS.map((benefit) => <BenefitCard key={benefit.title} {...benefit} />)}
          </div>
          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 rounded-full border border-violet-200/70 bg-white/55 px-5 py-3 text-center text-[12.5px] font-medium text-primary/80 shadow-sm backdrop-blur-sm sm:text-sm">
            <Lock className="h-4 w-4 shrink-0" aria-hidden />
            <span>Private by design <span className="mx-2 text-primary/35">•</span> Built to support caregivers with practical, easy-to-use guidance</span>
          </div>
        </div>
      </section>

      <section aria-label="Find Local Help" className="bg-[linear-gradient(180deg,#fff_0%,#fdfcf9_100%)] px-6 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="grid items-center gap-10 xl:grid-cols-[0.72fr_1.45fr_0.95fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">Support across Texas</p>
              <SectionHeading className="mb-3 mt-4" title="Find Local Help" text="Local support you can trust, right where you are in Texas." />
              <p className="text-sm leading-relaxed text-stone-500">Browse local providers and support resources across the entire state.</p>
              <div className="mt-6 flex items-center gap-7">
                <div><p className="text-3xl font-bold text-primary">4</p><p className="text-[11px] text-stone-500">Featured categories</p></div>
                <div className="h-12 w-px bg-stone-200" aria-hidden />
                <div><p className="text-3xl font-bold text-primary">6</p><p className="text-[11px] text-stone-500">Texas locations</p></div>
              </div>
              <Link href="/support/find" className="mt-7 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(20,42,73,0.18)] transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
                <MapPin className="h-4 w-4" aria-hidden /> See all local providers <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <TexasMap />
            <div className="space-y-4">
              {PROVIDER_CARDS.map((card) => <ProviderCard key={card.name} {...card} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
