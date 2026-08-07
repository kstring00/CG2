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

function SectionHeading({ title, text, center, className }: { title: string; text?: string; center?: boolean; className?: string }) {
  return (
    <div className={cn('mb-10', center && 'text-center', className)}>
      <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-[2.1rem]">{title}</h2>
      {text && <p className={cn('mt-3 text-base leading-relaxed text-stone-600', center && 'mx-auto max-w-xl')}>{text}</p>}
    </div>
  );
}

function SupportTile({ href, icon: Icon, label, description }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; description: string }) {
  return (
    <Link href={href} aria-label={`${label} — ${description}`} className="group flex items-center gap-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-200/70 bg-amber-50/70 text-amber-600 transition group-hover:bg-amber-100/80"><Icon className="h-5 w-5" aria-hidden /></span>
      <span className="min-w-0 flex-1"><span className="block text-[15px] font-semibold text-primary">{label}</span><span className="mt-0.5 block text-[12.5px] leading-snug text-stone-500">{description}</span></span>
      <ArrowRight className="h-4 w-4 shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-amber-600" aria-hidden />
    </Link>
  );
}

function BenefitCard({ icon: Icon, title, description, iconClassName, iconWrapClassName }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; iconClassName: string; iconWrapClassName: string }) {
  return (
    <article className="flex items-start gap-5 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-soft backdrop-blur-sm sm:p-7">
      <span className={cn('inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border', iconWrapClassName)}><Icon className={cn('h-7 w-7', iconClassName)} aria-hidden /></span>
      <div className="pt-1"><h3 className="text-lg font-bold text-primary">{title}</h3><p className="mt-2 text-[14px] leading-relaxed text-stone-600">{description}</p></div>
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
  { icon: UsersRound, title: 'Built for parents', description: 'Parent-friendly guidance designed for the people carrying care into daily life.', iconClassName: 'text-teal-600', iconWrapClassName: 'border-teal-100 bg-teal-50' },
  { icon: Signpost, title: 'Clear next steps', description: 'Turn uncertainty into practical direction with support matched to your family’s needs.', iconClassName: 'text-violet-600', iconWrapClassName: 'border-violet-100 bg-violet-50' },
  { icon: Wrench, title: 'Helpful tools at home', description: 'Explore routines, communication tools, caregiver support, and printable resources when needed.', iconClassName: 'text-amber-600', iconWrapClassName: 'border-amber-100 bg-amber-50' },
  { icon: ShieldCheck, title: 'Confidence for families', description: 'Leave with more clarity, better questions, and a stronger sense of what to do next.', iconClassName: 'text-rose-500', iconWrapClassName: 'border-rose-100 bg-rose-50' },
] as const;

function shortLocation(location: string): string {
  return location.split('(')[0].replace(/,?\s*TX.*$/i, '').trim();
}

interface ProviderCardData { category: string; name: string; location: string; href?: string }

function buildProviderCards(): ProviderCardData[] {
  const dentist = sensoryFriendlyPlaces.find((place) => place.category === 'dentist' && !place.isDemo);
  const speechOt = verifiedProviders.find((provider) => provider.category === 'speech-therapy' || provider.category === 'occupational-therapy');
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
    <article className="rounded-[1.7rem] border border-slate-200/80 bg-white p-5 shadow-[0_16px_42px_rgba(25,48,82,0.08)]">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-orange-600">{category}</p>
      <h3 className="mt-2 text-[15px] font-semibold leading-snug text-primary">{name}</h3>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[12px] text-stone-500"><MapPin className="h-3.5 w-3.5" aria-hidden />{location}</span>
        {href && <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary">Website <ExternalLink className="h-3.5 w-3.5" aria-hidden /></a>}
      </div>
    </article>
  );
}

const STATIC_PINS = [
  { label: 'Plano', x: 520, y: 105, color: '#102a54' },
  { label: 'Cedar Hill', x: 488, y: 160, color: '#7c3aed' },
  { label: 'Austin', x: 430, y: 285, color: '#0f988d' },
  { label: 'Katy', x: 585, y: 298, color: '#f59e0b' },
  { label: 'Pearland', x: 555, y: 355, color: '#102a54' },
  { label: 'Sugar Land', x: 500, y: 405, color: '#7c3aed' },
] as const;

function StaticTexasMap() {
  return (
    <div className="relative min-h-[500px] overflow-hidden rounded-[2.2rem] border border-slate-200/90 bg-[#fbfaf7] shadow-[0_26px_75px_rgba(20,42,73,0.14)]">
      <svg viewBox="0 0 760 520" className="absolute inset-0 h-full w-full" role="img" aria-label="Texas map showing Austin, Cedar Hill, Katy, Pearland, Plano, and Sugar Land">
        <defs>
          <linearGradient id="staticMapBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fffdf9" /><stop offset="100%" stopColor="#eef7f6" /></linearGradient>
          <linearGradient id="staticGulf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#dff3f8" /><stop offset="100%" stopColor="#b8dfea" /></linearGradient>
          <filter id="staticShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#17365d" floodOpacity="0.18" /></filter>
        </defs>
        <rect width="760" height="520" fill="url(#staticMapBg)" />
        <path d="M548 520 C590 454 607 397 598 348 C650 344 704 367 760 414 L760 520 Z" fill="url(#staticGulf)" />
        <path d="M178 55 L523 55 L525 94 L626 112 L642 221 L697 280 L666 359 L621 385 L588 468 L513 485 L476 445 L393 438 L346 377 L271 355 L229 292 L163 263 L129 187 L157 124 Z" fill="#fffdf7" stroke="#d2ddd9" strokeWidth="5" filter="url(#staticShadow)" />
        <path d="M159 128 C278 155 391 149 563 110" fill="none" stroke="#ead5b4" strokeWidth="2.5" opacity="0.8" />
        <path d="M193 220 C320 187 454 215 640 292" fill="none" stroke="#ead5b4" strokeWidth="2.5" opacity="0.8" />
        <path d="M301 347 C398 318 503 335 620 385" fill="none" stroke="#ead5b4" strokeWidth="2.5" opacity="0.8" />
        <path d="M438 64 C416 172 441 287 505 462" fill="none" stroke="#dfe7e4" strokeWidth="5" />
        <path d="M319 137 C367 239 420 324 509 438" fill="none" stroke="#dfe7e4" strokeWidth="5" />
        <path d="M548 115 C518 226 539 327 592 433" fill="none" stroke="#dfe7e4" strokeWidth="5" />
        {STATIC_PINS.map((pin) => (
          <g key={pin.label} transform={`translate(${pin.x} ${pin.y})`}>
            <path d="M0 -22 C-15 -22 -26 -11 -26 3 C-26 22 0 47 0 47 C0 47 26 22 26 3 C26 -11 15 -22 0 -22Z" fill={pin.color} stroke="#ffffff" strokeWidth="7" filter="url(#staticShadow)" />
            <circle cx="0" cy="2" r="8" fill="#ffffff" />
            <rect x="-39" y="51" width="78" height="26" rx="13" fill="#ffffff" stroke="#e4e7eb" filter="url(#staticShadow)" />
            <text x="0" y="68" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill="#102a54">{pin.label}</text>
          </g>
        ))}
      </svg>

      <div className="absolute left-6 top-6 rounded-2xl border border-white/80 bg-white/95 px-5 py-4 shadow-xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700">Statewide Texas</p>
        <p className="mt-1 text-lg font-semibold text-primary">Local support directory</p>
        <p className="mt-1 text-[12px] text-stone-500">Verified resources across Texas</p>
      </div>

      <div className="absolute inset-x-6 bottom-6 flex flex-col gap-3 rounded-2xl border border-white/90 bg-white/95 p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-teal-700">Coverage</p><p className="mt-1 text-[12px] font-semibold text-primary">Cedar Hill • Plano • Austin • Katy • Pearland • Sugar Land</p></div>
        <Link href="/support/find" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[12px] font-semibold text-white shadow-lg">Explore the directory <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </div>
  );
}

export default function HomeSupportHub() {
  return (
    <>
      <section aria-label="What do you need today?" className="bg-white px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading center title="What do you need today?" text="Start wherever you are. Every path below is free and built for parents." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{NEED_TILES.map((tile) => <SupportTile key={tile.href + tile.label} {...tile} />)}</div>
        </div>
      </section>

      <section aria-labelledby="common-ground-benefits" className="relative overflow-hidden px-6 py-16 sm:px-8 sm:py-20" style={{ background: 'radial-gradient(circle at 0% 15%, rgba(153, 246, 228, 0.34), transparent 35%), radial-gradient(circle at 100% 85%, rgba(233, 213, 255, 0.5), transparent 37%), linear-gradient(110deg, #effcf9 0%, #f3f8fb 52%, #f7f2ff 100%)' }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center"><span className="inline-flex rounded-full border border-teal-100 bg-teal-50/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700 shadow-sm">For parents &amp; families</span><h2 id="common-ground-benefits" className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-[2.25rem]">Support that reaches beyond the clinic</h2><p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-600 sm:text-base">Common Ground is built for parents and caregivers—helping families feel informed, supported, and more prepared for everyday life at home.</p></div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">{BENEFITS.map((benefit) => <BenefitCard key={benefit.title} {...benefit} />)}</div>
          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 rounded-full border border-violet-200/70 bg-white/55 px-5 py-3 text-center text-[12.5px] font-medium text-primary/80 shadow-sm backdrop-blur-sm sm:text-sm"><Lock className="h-4 w-4 shrink-0" aria-hidden /><span>Private by design <span className="mx-2 text-primary/35">•</span> Built to support caregivers with practical, easy-to-use guidance</span></div>
        </div>
      </section>

      <section aria-label="Find Local Help" className="bg-[#fffdfa] px-6 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1380px]">
          <div className="grid items-center gap-10 xl:grid-cols-[0.72fr_1.45fr_0.98fr]">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-teal-700">Support across Texas</p>
              <h2 className="mt-5 font-serif text-5xl font-semibold tracking-[-0.04em] text-primary sm:text-6xl">Find Local Help</h2>
              <p className="mt-6 max-w-sm text-[17px] leading-8 text-stone-600">Browse trusted providers and support resources across Texas—so you can find the help your family needs, right where you are.</p>
              <div className="mt-8 flex items-center gap-8"><div><p className="text-4xl font-bold text-primary">4</p><p className="mt-1 text-[13px] text-stone-500">Featured categories</p></div><div className="h-16 w-px bg-stone-200" /><div><p className="text-4xl font-bold text-primary">6</p><p className="mt-1 text-[13px] text-stone-500">Texas locations</p></div></div>
              <Link href="/support/find" className="mt-9 inline-flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(16,42,84,0.22)]">See all local providers <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
            <StaticTexasMap />
            <div className="space-y-4">{PROVIDER_CARDS.map((card) => <ProviderCard key={card.name} {...card} />)}</div>
          </div>
        </div>
      </section>
    </>
  );
}
