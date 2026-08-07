'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Compass,
  ExternalLink,
  Heart,
  Home,
  Laptop,
  Lock,
  MapPin,
  MessagesSquare,
  ShieldCheck,
  Signpost,
  Toolbox,
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
      <span
        className={cn(
          'inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border',
          iconWrapClassName,
        )}
      >
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
    icon: Toolbox,
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

  if (dentist) {
    cards.push({ category: 'Sensory-friendly dentists', name: dentist.name, location: dentist.city, href: dentist.website || undefined });
  }
  if (speechOt) {
    cards.push({ category: 'Speech & OT clinics', name: speechOt.provider_name, location: shortLocation(speechOt.location), href: speechOt.website || undefined });
  }
  if (respite) {
    cards.push({ category: 'Respite care', name: respite.provider_name, location: shortLocation(respite.location), href: respite.website || undefined });
  }
  if (group) {
    cards.push({ category: 'Parent support groups', name: group.provider_name, location: shortLocation(group.location), href: group.website || undefined });
  }

  return cards;
}

const PROVIDER_CARDS = buildProviderCards();

function ProviderCard({ category, name, location, href }: ProviderCardData) {
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
            className="inline-flex items-center gap-1 rounded-sm text-[12px] font-semibold text-primary underline-offset-2 transition hover:text-primary/70 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Website <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        ) : null}
      </div>
    </div>
  );
}

const MAP_PINS: { label: string; top: string; left: string; major?: boolean }[] = [
  { label: 'Houston', top: '34%', left: '56%', major: true },
  { label: 'Katy', top: '30%', left: '16%' },
  { label: 'Sugar Land', top: '62%', left: '28%' },
  { label: 'Pearland', top: '72%', left: '58%' },
];

function HoustonMap() {
  return (
    <Link
      href="/support/find"
      aria-label="Open the Find Local Help directory for the greater Houston area"
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-3xl border border-stone-200/80 shadow-soft transition duration-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
      style={{ backgroundColor: '#fbf9f4' }}
    >
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
        <path d="M-10 150 C 60 120, 120 180, 200 150 S 340 100, 410 130" fill="none" stroke="#bcd3e6" strokeWidth="10" strokeLinecap="round" opacity="0.55" />
        <path d="M40 -10 C 120 80, 200 140, 230 310" fill="none" stroke="#1a2e52" strokeWidth="3" opacity="0.12" />
        <path d="M-10 230 C 100 200, 260 220, 410 180" fill="none" stroke="#1a2e52" strokeWidth="3" opacity="0.12" />
        <path d="M300 -10 C 270 90, 290 200, 250 310" fill="none" stroke="#1a2e52" strokeWidth="3" opacity="0.12" />
        <ellipse cx="225" cy="120" rx="95" ry="70" fill="none" stroke="#1a2e52" strokeWidth="2.5" strokeDasharray="7 7" opacity="0.22" />
        <circle cx="225" cy="115" r="34" fill="#e9b94922" />
      </svg>
      {MAP_PINS.map((pin) => (
        <span key={pin.label} className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center" style={{ top: pin.top, left: pin.left }} aria-hidden>
          <MapPin className={cn('drop-shadow-sm', pin.major ? 'h-7 w-7 text-amber-600' : 'h-5 w-5 text-primary/70')} fill={pin.major ? '#fef3c7' : '#eef1f8'} />
          <span className="mt-0.5 whitespace-nowrap rounded-full border border-stone-200 bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-primary shadow-sm">{pin.label}</span>
        </span>
      ))}
      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-primary shadow-sm transition group-hover:border-amber-300">
        Explore the directory <ArrowRight className="h-3 w-3" aria-hidden />
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

      <section
        aria-labelledby="common-ground-benefits"
        className="relative overflow-hidden px-6 py-16 sm:px-8 sm:py-20"
        style={{
          background:
            'radial-gradient(circle at 0% 15%, rgba(153, 246, 228, 0.34), transparent 35%), radial-gradient(circle at 100% 85%, rgba(233, 213, 255, 0.5), transparent 37%), linear-gradient(110deg, #effcf9 0%, #f3f8fb 52%, #f7f2ff 100%)',
        }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-teal-100 bg-teal-50/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700 shadow-sm">
              For parents &amp; families
            </span>
            <h2 id="common-ground-benefits" className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-[2.25rem]">
              Support that reaches beyond the clinic
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600 sm:text-base">
              Common Ground is built for parents and caregivers—helping families feel informed, supported, and more prepared for everyday life at home.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <BenefitCard key={benefit.title} {...benefit} />
            ))}
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 rounded-full border border-violet-200/70 bg-white/55 px-5 py-3 text-center text-[12.5px] font-medium text-primary/80 shadow-sm backdrop-blur-sm sm:text-sm">
            <Lock className="h-4 w-4 shrink-0" aria-hidden />
            <span>Private by design <span className="mx-2 text-primary/35">•</span> Built to support caregivers with practical, easy-to-use guidance</span>
          </div>
        </div>
      </section>

      <section aria-label="Find Local Help" className="bg-white px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr_1fr]">
            <div>
              <SectionHeading className="mb-3" title="Find Local Help" text="Local support you can trust, right where you are." />
              <p className="text-sm leading-relaxed text-stone-500">Browse local providers and support resources in the greater Houston area.</p>
              <Link href="/support/find" className="mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-primary underline-offset-4 transition hover:text-primary/70 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
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

      <section aria-labelledby="client-portal" className="bg-white px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start gap-8 overflow-hidden rounded-3xl p-8 shadow-card sm:p-10 lg:flex-row lg:items-center" style={{ background: 'linear-gradient(125deg, #111d39 0%, #1a2e52 55%, #25406e 100%)' }}>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">For enrolled families</p>
              <h2 id="client-portal" className="mt-2 text-2xl font-bold text-white sm:text-3xl">Already a Texas ABA family?</h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">Sign in for session notes, goals, and messaging with your BCBA &amp; RBT.</p>
              <Link href="/client" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow-md transition hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
                Go to Client Portal <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="hidden shrink-0 sm:block" aria-hidden>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <Laptop className="h-14 w-14 text-amber-200/90" strokeWidth={1.25} />
                <div className="mt-3 space-y-1.5"><div className="h-1.5 w-24 rounded-full bg-white/25" /><div className="h-1.5 w-16 rounded-full bg-white/15" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
