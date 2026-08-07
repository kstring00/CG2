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
    <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-card">
      <p className="text-[10.5px] font-bold uppercase tracking-wide text-amber-700">{category}</p>
      <p className="mt-1 text-[14px] font-semibold leading-snug text-primary">{name}</p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
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

const MAP_PINS: { label: string; top: string; left: string; major?: boolean }[] = [
  { label: 'Houston', top: '42%', left: '57%', major: true },
  { label: 'Katy', top: '30%', left: '18%' },
  { label: 'Sugar Land', top: '66%', left: '31%' },
  { label: 'Pearland', top: '72%', left: '61%' },
];

function HoustonMap() {
  return (
    <Link
      href="/support/find"
      aria-label="Explore the greater Houston local help directory"
      className="group relative block min-h-[390px] w-full overflow-hidden rounded-[2rem] border border-slate-200/90 bg-[#f8faf9] shadow-[0_24px_70px_rgba(20,42,73,0.13)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_85px_rgba(20,42,73,0.17)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
    >
      <svg viewBox="0 0 620 430" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
        <defs>
          <linearGradient id="mapBase" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbfaf5" />
            <stop offset="100%" stopColor="#f1f6f5" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d7eef5" />
            <stop offset="100%" stopColor="#b9dce8" />
          </linearGradient>
          <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10284a" floodOpacity="0.25" />
          </filter>
        </defs>
        <rect width="620" height="430" fill="url(#mapBase)" />

        <path d="M-30 282 C 90 220, 185 340, 300 282 S 500 184, 665 224" fill="none" stroke="url(#water)" strokeWidth="22" strokeLinecap="round" opacity="0.95" />
        <path d="M-10 292 C 110 238, 192 350, 305 292 S 500 200, 650 238" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.55" />

        <path d="M30 102 C 154 93, 280 100, 590 93" fill="none" stroke="#d9dee3" strokeWidth="7" strokeLinecap="round" />
        <path d="M35 102 C 160 95, 286 101, 585 95" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <path d="M126 -30 C 210 72, 310 170, 430 458" fill="none" stroke="#d9dee3" strokeWidth="7" strokeLinecap="round" />
        <path d="M128 -25 C 212 75, 310 171, 428 450" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <path d="M485 -20 C 424 90, 420 225, 388 455" fill="none" stroke="#d9dee3" strokeWidth="7" strokeLinecap="round" />
        <path d="M485 -15 C 428 92, 423 228, 391 448" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <path d="M-15 365 C 180 330, 385 362, 650 312" fill="none" stroke="#e1e5e8" strokeWidth="6" strokeLinecap="round" />
        <path d="M-10 365 C 190 333, 392 363, 645 314" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

        <ellipse cx="352" cy="185" rx="135" ry="105" fill="none" stroke="#b9c7d2" strokeWidth="4" strokeDasharray="11 10" opacity="0.8" />
        <ellipse cx="352" cy="185" rx="94" ry="74" fill="none" stroke="#d3dbe2" strokeWidth="3" opacity="0.7" />
        <circle cx="352" cy="185" r="49" fill="#f9dca3" opacity="0.43" />

        <g fill="#9aa7b2" fontFamily="sans-serif" fontSize="12" fontWeight="600" opacity="0.8">
          <text x="65" y="88">I-10</text>
          <text x="214" y="204">US-59</text>
          <text x="438" y="147">I-45</text>
          <text x="458" y="336">Beltway 8</text>
          <text x="272" y="76">Spring Branch</text>
          <text x="466" y="245">East End</text>
          <text x="286" y="320">Missouri City</text>
        </g>
      </svg>

      <div className="absolute left-5 top-5 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">Greater Houston</p>
        <p className="mt-1 text-sm font-semibold text-primary">Local support directory</p>
        <p className="mt-0.5 text-[11px] text-stone-500">Verified resources across the metro area</p>
      </div>

      <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white/95 text-primary shadow-md" aria-hidden>
        <span className="flex h-9 w-9 items-center justify-center border-b border-stone-200 text-lg font-semibold">+</span>
        <span className="flex h-9 w-9 items-center justify-center text-lg font-semibold">−</span>
      </div>

      {MAP_PINS.map((pin) => (
        <span key={pin.label} className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center" style={{ top: pin.top, left: pin.left }} aria-hidden>
          <span className={cn('inline-flex items-center justify-center rounded-full border-4 border-white shadow-lg', pin.major ? 'h-12 w-12 bg-amber-500 text-white' : 'h-9 w-9 bg-primary text-white')}>
            <MapPin className={pin.major ? 'h-6 w-6' : 'h-4 w-4'} fill="currentColor" />
          </span>
          <span className={cn('mt-1 whitespace-nowrap rounded-full border bg-white/95 px-2.5 py-1 font-semibold text-primary shadow-md backdrop-blur-sm', pin.major ? 'border-amber-200 text-[11px]' : 'border-stone-200 text-[10px]')}>
            {pin.label}
          </span>
        </span>
      ))}

      <div className="absolute bottom-5 left-5 rounded-xl border border-white/80 bg-white/90 px-3.5 py-2 shadow-md backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-500">Coverage</p>
        <p className="mt-0.5 text-xs font-semibold text-primary">Houston • Katy • Sugar Land • Pearland</p>
      </div>

      <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[12px] font-semibold text-white shadow-lg transition group-hover:bg-primary/90">
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

      <section aria-label="Find Local Help" className="bg-white px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-[0.72fr_1.35fr_0.93fr]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">Support near home</p>
              <SectionHeading className="mb-3 mt-4" title="Find Local Help" text="Local support you can trust, right where you are." />
              <p className="text-sm leading-relaxed text-stone-500">Browse local providers and support resources across the greater Houston area.</p>
              <div className="mt-5 flex items-center gap-6">
                <div><p className="text-2xl font-bold text-primary">4</p><p className="text-[11px] text-stone-500">Featured categories</p></div>
                <div className="h-9 w-px bg-stone-200" aria-hidden />
                <div><p className="text-2xl font-bold text-primary">1</p><p className="text-[11px] text-stone-500">Simple directory</p></div>
              </div>
              <Link href="/support/find" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
                See all local providers <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <HoustonMap />
            <div className="space-y-3">
              {PROVIDER_CARDS.map((card) => <ProviderCard key={card.name} {...card} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
