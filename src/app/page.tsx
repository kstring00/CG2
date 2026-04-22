import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Heart,
  HeartHandshake,
  Lock,
  MapPin,
  Phone,
  Shield,
  Users,
  Wind,
} from 'lucide-react';
import { TexasAbaLogo } from '@/components/brand/TexasAbaLogo';

const checkInOptions = [
  {
    emoji: '😔',
    label: "I'm overwhelmed",
    sub: 'Start with support for you',
    href: '/support/caregiver',
    bg: 'bg-brand-plum-50 hover:bg-brand-plum-100 border-brand-plum-200 hover:border-brand-plum-300',
    label_color: 'text-brand-plum-800',
    sub_color: 'text-brand-plum-600',
  },
  {
    emoji: '🤷',
    label: "I don't know where to start",
    sub: 'We\'ll walk you through it',
    href: '/support/next-steps',
    bg: 'bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/35',
    label_color: 'text-brand-navy-700',
    sub_color: 'text-primary',
  },
  {
    emoji: '🔍',
    label: 'I need specific help',
    sub: 'Resources, providers & guides',
    href: '/support/resources',
    bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200 hover:border-amber-300',
    label_color: 'text-amber-900',
    sub_color: 'text-amber-700',
  },
];

const companionPaths = [
  {
    feeling: 'I need real-world help near me',
    title: 'Local sensory-friendly guide',
    description:
      'Haircuts, dentists, parks, and grocery runs — real places near you that are good with kids on the spectrum. Vetted, not just Googled.',
    href: '/support/sensory-friendly',
    cta: 'See places near you',
    icon: MapPin,
    ring: 'border-emerald-200 hover:border-emerald-300',
    bg: 'bg-gradient-to-br from-emerald-50 via-white to-white',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    eyebrow: 'text-emerald-800',
    cta_color: 'text-emerald-800',
  },
  {
    feeling: 'I want to understand more',
    title: 'Resource library',
    description:
      'Short, curated guides for the stage you are in. Not the first 10 things Google returns — the ones we have actually read and recommend.',
    href: '/support/resources',
    cta: 'Browse the library',
    icon: BookOpen,
    ring: 'border-amber-200 hover:border-amber-300',
    bg: 'bg-gradient-to-br from-amber-50 via-white to-white',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    eyebrow: 'text-amber-800',
    cta_color: 'text-amber-800',
  },
  {
    feeling: 'I feel alone',
    title: 'Community & connection',
    description:
      'Other parents who have been where you are. Local meetups, online spaces, and events — so the load feels a little lighter.',
    href: '/support/connect',
    cta: 'Find your people',
    icon: Users,
    ring: 'border-brand-plum-200 hover:border-brand-plum-300',
    bg: 'bg-gradient-to-br from-brand-plum-50 via-white to-white',
    iconBg: 'bg-brand-plum-100',
    iconColor: 'text-brand-plum-700',
    eyebrow: 'text-brand-plum-700',
    cta_color: 'text-brand-plum-700',
  },
];

const trustSignals = [
  { icon: Shield, text: 'Clinically reviewed by BCBAs' },
  { icon: Heart, text: 'Built for families, not just clients' },
  { icon: Users, text: 'Serving every stage of the journey' },
  { icon: Phone, text: 'Crisis support always visible' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen pb-20" style={{ backgroundColor: '#f2f4f8' }}>
      {/* ── NAV ── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-surface-border/80 bg-white/92 backdrop-blur-xl shadow-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Common Ground home">
            <TexasAbaLogo priority decorative className="h-7 w-auto sm:h-9" />
            <span className="border-l border-surface-border pl-3 font-display text-base font-bold text-brand-muted-900 sm:text-lg">
              Common<span className="text-primary"> Ground</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/client"
              className="hidden items-center gap-1.5 rounded-xl border border-accent/25 bg-accent/5 px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/10 sm:inline-flex"
            >
              <Lock className="h-3.5 w-3.5" /> Client sign-in
            </Link>
            <Link href="/support" className="btn-primary px-5 py-2.5">
              <Compass className="h-4 w-4" /> Care Navigation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:pt-36" style={{ background: 'linear-gradient(160deg, #1a2e52 0%, #32175a 55%, #703068 100%)' }}>
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="pill mb-6 border-white/20 bg-white/10 text-white/90 backdrop-blur-sm">
            <Heart className="h-3.5 w-3.5 text-accent" /> By Texas ABA Centers
          </span>
          <h1 className="text-balance text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            You don&apos;t have to figure<br />
            <span className="text-accent">this out alone.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Common Ground gives every family — whether you just got a diagnosis, are on a
            waitlist, or have been in therapy for years — real guidance, real resources,
            and real support.
          </p>

          {/* ── EMOTIONAL CHECK-IN ── */}
          <div className="mx-auto mt-10 max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/60">
              How are things feeling right now?
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {checkInOptions.map((opt) => (
                <Link
                  key={opt.label}
                  href={opt.href}
                  className={`group flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-card ${opt.bg}`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className={`text-sm font-semibold leading-snug ${opt.label_color}`}>
                    {opt.label}
                  </span>
                  <span className={`text-xs ${opt.sub_color}`}>{opt.sub}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="pointer-events-none absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,72 L0,72 Z" fill="#f2f4f8"/>
          </svg>
        </div>
      </section>

      {/* ── TWO DOORS ── */}
      <section className="relative px-6 pb-20 pt-12 sm:pb-24">
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="pill bg-white">
              <Compass className="h-3.5 w-3.5 text-primary" /> Two ways in
            </span>
            <h2 className="mt-4 text-balance text-3xl font-bold text-brand-muted-900 sm:text-4xl md:text-5xl">
              Choose the door that fits you.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-brand-muted-600 sm:text-lg">
              Start with Care Navigation if you are exploring. Sign in to the Client Portal if your
              family is already receiving services with Texas ABA Centers.
            </p>
          </div>

          <div className="relative grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* CARE NAVIGATION */}
            <article className="group relative overflow-hidden rounded-[2rem] border-2 border-primary/25 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover sm:p-10">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/8 blur-2xl" />
              <div className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Compass className="h-7 w-7 text-primary" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  <Compass className="h-3.5 w-3.5" /> For every family
                </span>
                <h3 className="mt-4 text-3xl font-bold text-brand-muted-900 sm:text-4xl">
                  Care Navigation
                </h3>
                <p className="mt-3 text-base font-semibold leading-relaxed text-primary">
                  Guidance, resources, and support for every family.
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-brand-muted-600">
                  You do not have to have all the answers. We will help you find direction,
                  community, and local resources — wherever you are in your journey.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-brand-muted-700">
                  {[
                    { icon: Compass, title: 'Guided next steps', sub: 'A short plan for where you are — not the whole journey at once.' },
                    { icon: HeartHandshake, title: 'Support for you', sub: 'Caregiver wellness, grounding tools, and mental health resources.' },
                    { icon: Heart, title: 'Local resources & community', sub: 'Sensory-friendly places, local groups, and help lines near you.' },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-3.5 w-3.5" />
                      </span>
                      <span>
                        <span className="font-semibold text-brand-muted-900">{item.title}</span>
                        <span className="block text-brand-muted-500">{item.sub}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/support"
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
                >
                  Explore Care Navigation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>

            {/* CLIENT PORTAL */}
            <article className="group relative overflow-hidden rounded-[2rem] border-2 border-accent/25 bg-white p-8 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover sm:p-10">
              <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-accent/8 blur-2xl" />
              <div className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                  <Lock className="h-7 w-7 text-accent" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
                  <Lock className="h-3.5 w-3.5" /> Client portal · sign-in required
                </span>
                <h3 className="mt-4 text-3xl font-bold text-brand-muted-900 sm:text-4xl">
                  Client Portal
                </h3>
                <p className="mt-3 text-base font-semibold leading-relaxed text-accent">
                  Personalized support for families actively receiving our services.
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-brand-muted-600">
                  Access your child&apos;s care plan, progress updates, and tools designed to help
                  you celebrate progress and work together with your care team.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-brand-muted-700">
                  {[
                    { icon: Shield, title: "Your child's plan & progress", sub: 'BCBA-authored goals, session updates, and parent coaching tied to real data.' },
                    { icon: Shield, title: 'Care team messaging', sub: 'Reach your BCBA or RBT directly. HIPAA-protected, only your team sees it.' },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <item.icon className="h-3.5 w-3.5" />
                      </span>
                      <span>
                        <span className="font-semibold text-brand-muted-900">{item.title}</span>
                        <span className="block text-brand-muted-500">{item.sub}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/client"
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-accent/90"
                >
                  Go to Client Portal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── DECISION ENGINE ── */}
      <section id="entry-points" className="relative px-6 py-16 sm:py-20" style={{ backgroundColor: '#1a2e52' }}>
        {/* Top wave */}
        <div className="pointer-events-none absolute -top-1 left-0 right-0">
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full rotate-180" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,72 L0,72 Z" fill="#f2f4f8"/>
          </svg>
        </div>
        {/* Bottom wave */}
        <div className="pointer-events-none absolute -bottom-1 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,72 L0,72 Z" fill="#f2f4f8"/>
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <span className="pill border-white/20 bg-white/10 text-white/80">
              <Compass className="h-3.5 w-3.5 text-white/60" /> Start here
            </span>
            <h2 className="mt-4 text-balance text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              What do you need right now?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
              Pick the one that sounds like your week. We will take it from there.
            </p>
          </div>

          {/* PRIMARY: Guided Next Steps */}
          <Link
            href="/support/next-steps"
            className="group relative block overflow-hidden rounded-[2rem] border-2 border-white/20 bg-white/10 backdrop-blur-sm p-8 transition-all hover:-translate-y-1 hover:border-white/35 hover:bg-white/15 hover:shadow-card-hover sm:p-10 lg:p-12"
          >
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                  <Compass className="h-8 w-8 text-white" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/80">
                  Most parents start here
                </span>
                <h3 className="mt-4 text-balance text-[28px] font-bold leading-tight text-white sm:text-4xl md:text-[44px]">
                  &ldquo;I don&apos;t know what to do next.&rdquo;
                </h3>
                <p className="mt-4 text-lg font-semibold leading-relaxed text-white/80 sm:text-xl">
                  We will walk you through it.
                </p>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-white/60">
                  A short plan for where you are today — not the whole journey at once. Clear
                  direction, nothing overwhelming, just the next right step.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-semibold text-primary shadow-soft transition group-hover:bg-white/95">
                  Start guided next steps
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-xs text-white/50">Takes about 2 minutes</span>
              </div>
            </div>
          </Link>

          {/* COMPANION PATHS */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {companionPaths.map((path) => (
              <Link
                key={path.title}
                href={path.href}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${path.ring}`}
              >
                <div>
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${path.iconBg}`}>
                    <path.icon className={`h-6 w-6 ${path.iconColor}`} />
                  </div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${path.eyebrow}`}>
                    &ldquo;{path.feeling}&rdquo;
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-brand-muted-900">
                    {path.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-muted-600">
                    {path.description}
                  </p>
                </div>
                <div className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${path.cta_color}`}>
                  {path.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARENT MENTAL HEALTH SPOTLIGHT ── */}
      <section className="relative px-6 pb-16 pt-20 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[2rem] border-2 border-brand-plum-200 bg-white shadow-card">
            <div className="grid lg:grid-cols-2">
              {/* Left — emotional copy */}
              <div className="p-8 sm:p-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1 text-xs font-semibold text-brand-plum-700">
                  <HeartHandshake className="h-3.5 w-3.5" /> Support for you — the parent
                </div>
                <h2 className="text-2xl font-bold text-brand-muted-900 sm:text-3xl">
                  You are part of the care plan too.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-brand-muted-600">
                  Caregiver burnout is real. Research shows that when parents are supported,
                  children make faster progress. Common Ground gives you grounding tools,
                  mental health resources, and a direct path to professional support —
                  because your wellbeing matters in this equation.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'Burnout signs checklist',
                    '4-7-8 breathing & grounding tools',
                    'Therapist referral pathway for caregivers',
                    'Crisis lines — always visible, always one tap away',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-brand-muted-700">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-plum-100 text-brand-plum-700">
                        <Heart className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/support/caregiver"
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-brand-plum-700 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-plum-800"
                >
                  <HeartHandshake className="h-4 w-4" /> Support for you <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {/* Right — immediate tools */}
              <div className="border-t border-brand-plum-100 bg-brand-plum-50/50 p-8 lg:border-l lg:border-t-0 sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-plum-600">
                  If today is hard — right now
                </p>
                <h3 className="mt-2 text-xl font-semibold text-brand-muted-900">
                  One breath. One step.
                </h3>
                <div className="mt-6 space-y-3">
                  {[
                    { label: '4-7-8 breathing', time: '2 min', desc: 'Inhale 4, hold 7, exhale 8. Repeat 3×.' },
                    { label: '5-4-3-2-1 grounding', time: '3 min', desc: 'Name what you see, hear, feel, smell, taste.' },
                    { label: 'One permission', time: '30 sec', desc: '"I am allowed to be tired. That doesn\'t make me a bad parent."' },
                  ].map((tool) => (
                    <div key={tool.label} className="rounded-2xl border border-brand-plum-100 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-brand-muted-900">{tool.label}</span>
                        <span className="rounded-full bg-brand-plum-100 px-2 py-0.5 text-[11px] font-medium text-brand-plum-700">{tool.time}</span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-brand-muted-600">{tool.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl border border-accent/20 bg-accent/5 p-4">
                  <p className="text-xs font-semibold text-accent">If things feel unmanageable</p>
                  <p className="mt-1 text-sm text-brand-muted-700">
                    Call or text <a href="tel:988" className="font-bold text-accent hover:underline">988</a> — someone will answer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS ── */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustSignals.map((sig) => (
              <div key={sig.text} className="flex items-center gap-3 rounded-2xl border border-surface-border bg-white px-4 py-3 shadow-soft">
                <sig.icon className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm font-medium text-brand-muted-700">{sig.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HONESTY SECTION ── */}
      <section className="px-6 pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="soft-panel border-primary/10">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-brand-muted-900 sm:text-3xl">
                  This is hard. That is not because you are doing it wrong.
                </h2>
                <div className="mt-4 space-y-3 text-base leading-relaxed text-brand-muted-600">
                  <p>
                    Parenting a child with support needs is one of the most demanding jobs there is.
                    It is normal to feel tired, scared, frustrated, or all three at once. None of
                    that means you are failing.
                  </p>
                  <p>
                    Common Ground is built to lighten the research load, not add to it. If a page
                    ever feels like it is asking too much of you, stop. Come back tomorrow. The
                    resources will wait.
                  </p>
                  <p className="text-sm text-brand-muted-500">— the team at Texas ABA Centers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NAVY CTA FOOTER ── */}
      <section className="relative px-6 pb-16 sm:pb-20">
        {/* Top wave */}
        <div className="pointer-events-none absolute -top-1 left-6 right-6">
        </div>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] shadow-glow" style={{ background: 'linear-gradient(140deg, #182b4e 0%, #2d1752 52%, #5c2e67 100%)' }}>
          {/* Wave top inside */}
          <div className="px-10 pb-12 pt-12 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              One step at a time. That is enough.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/75 sm:text-lg">
              You do not need a plan for the next ten years. Start where you are today.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3 font-semibold text-primary shadow-soft transition hover:bg-white/90"
              >
                Care Navigation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/support/caregiver"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white/15"
              >
                <HeartHandshake className="h-4 w-4" /> Support for you
              </Link>
            </div>
          </div>
        </div>
        {/* Powered by footer */}
        <p className="mt-8 text-center text-xs text-brand-muted-400">
          Powered by <span className="font-semibold text-brand-muted-600">Texas ABA Centers</span> · Common Ground is available to every family we serve.
        </p>
      </section>
    </main>
  );
}
