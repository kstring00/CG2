'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Heart,
  Home,
  Lock,
  MessagesSquare,
  ShieldCheck,
  Signpost,
  UsersRound,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    </>
  );
}
