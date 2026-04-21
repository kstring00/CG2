import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Heart,
  Lock,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { TexasAbaLogo } from '@/components/brand/TexasAbaLogo';

// The four decision paths — framed as parent feelings, not features.
// Guided Next Steps is the PRIMARY (rendered as the large card); the other
// three are companion paths that answer different emotional states.
const companionPaths = [
  {
    feeling: 'I need real-world help near me',
    title: 'Local sensory-friendly guide',
    description:
      'Haircuts, dentists, parks, and grocery runs — real places near you that are good with kids on the spectrum. Vetted, not just Googled.',
    href: '/support/sensory-friendly',
    cta: 'See places near you',
    icon: MapPin,
    // Emerald — trust / immediately useful
    ring: 'border-emerald-200 hover:border-emerald-300',
    bg: 'bg-gradient-to-br from-emerald-50/70 via-white to-white',
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
    // Amber — learning / curiosity
    ring: 'border-amber-200 hover:border-amber-300',
    bg: 'bg-gradient-to-br from-amber-50/70 via-white to-white',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    eyebrow: 'text-amber-800',
    cta_color: 'text-amber-800',
  },
  {
    feeling: 'I feel alone',
    title: 'Community support',
    description:
      'Other Texas parents who have been where you are. Local meetups, online spaces, and events — so the load feels lighter.',
    href: '/support/community',
    cta: 'Find your people',
    icon: Users,
    // Plum — emotional anchor
    ring: 'border-brand-plum-100 hover:border-brand-plum-200',
    bg: 'bg-gradient-to-br from-brand-plum-50/50 via-white to-white',
    iconBg: 'bg-brand-plum-100',
    iconColor: 'text-brand-plum-700',
    eyebrow: 'text-brand-plum-700',
    cta_color: 'text-brand-plum-700',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-surface-border/80 bg-white/90 backdrop-blur-xl">
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

      {/* Hero — warmer, less marketing-y, more "you are welcome here" */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 sm:pt-36">
        <div className="absolute inset-0 gradient-warm" />
        <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-16 bottom-4 h-80 w-80 rounded-full bg-brand-plum-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="pill mb-6 bg-white/90">
            <Heart className="h-3.5 w-3.5 text-accent" /> By Texas ABA Centers
          </span>
          <h1 className="text-balance text-4xl font-bold leading-tight text-brand-muted-900 sm:text-5xl md:text-6xl">
            Support for every step of
            <span className="text-primary"> your journey.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-muted-600 sm:text-lg">
            Whether you are just looking for answers or already part of our care, Common Ground is
            here to help your family thrive — at your pace, with sources you can trust.
          </p>
        </div>
      </section>

      {/* TWO DOORS — the hero moment. Choose your path. */}
      <section className="relative px-6 pb-20 pt-4 sm:pb-24">
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
            {/* CARE NAVIGATION door */}
            <article className="group relative overflow-hidden rounded-[2rem] border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-white p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card-hover sm:p-10">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
                  <Compass className="h-7 w-7 text-primary" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
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
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Compass className="h-3.5 w-3.5" />
                    </span>
                    <span>
                      <span className="font-semibold text-brand-muted-900">Guided next steps</span>
                      <span className="block text-brand-muted-500">
                        A short plan for where you are — not the whole journey at once.
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Heart className="h-3.5 w-3.5" />
                    </span>
                    <span>
                      <span className="font-semibold text-brand-muted-900">Local resources &amp; community</span>
                      <span className="block text-brand-muted-500">
                        Sensory-friendly places, local groups, and help lines near you.
                      </span>
                    </span>
                  </li>
                </ul>

                <Link
                  href="/support"
                  className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
                >
                  Explore Care Navigation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>

            {/* CLIENT door */}
            <article className="group relative overflow-hidden rounded-[2rem] border-2 border-accent/25 bg-gradient-to-br from-accent/5 via-white to-white p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card-hover sm:p-10">
              <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
              <div className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 shadow-inner">
                  <Lock className="h-7 w-7 text-accent" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
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
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </span>
                    <span>
                      <span className="font-semibold text-brand-muted-900">Your child&apos;s plan &amp; progress</span>
                      <span className="block text-brand-muted-500">
                        BCBA-authored goals, session updates, and parent coaching tied to real data.
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </span>
                    <span>
                      <span className="font-semibold text-brand-muted-900">Care team messaging</span>
                      <span className="block text-brand-muted-500">
                        Reach your BCBA or RBT directly. HIPAA-protected, only your team sees it.
                      </span>
                    </span>
                  </li>
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

      {/* Decision-first section — answer "what do I do next?" in 5 seconds.
          Guided Next Steps is the primary action; three companion paths
          cover the other parent-feelings (near me, understand more, alone). */}
      <section id="entry-points" className="bg-surface-muted px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <span className="pill bg-white">
              <Compass className="h-3.5 w-3.5 text-primary" /> Start here
            </span>
            <h2 className="mt-4 text-balance text-3xl font-bold text-brand-muted-900 sm:text-4xl md:text-5xl">
              What do you need right now?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-muted-600 sm:text-lg">
              Pick the one that sounds like your week. We will take it from there.
            </p>
          </div>

          {/* PRIMARY: Guided Next Steps — spans full width, visually dominant */}
          <Link
            href="/support/next-steps"
            className="group relative block overflow-hidden rounded-[2rem] border-2 border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-white p-8 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover sm:p-10 lg:p-12"
          >
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
                  <Compass className="h-8 w-8 text-primary" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  Most parents start here
                </span>
                <h3 className="mt-4 text-balance text-[28px] font-bold leading-tight text-brand-muted-900 sm:text-4xl md:text-[44px]">
                  &ldquo;I don&apos;t know what to do next.&rdquo;
                </h3>
                <p className="mt-4 text-lg font-semibold leading-relaxed text-primary sm:text-xl">
                  We will walk you through it.
                </p>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-brand-muted-600">
                  A short plan for where you are today — not the whole journey at once. Clear
                  direction, nothing overwhelming, just the next right step.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-semibold text-white shadow-soft transition group-hover:bg-primary/90">
                  Start guided next steps
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-xs text-brand-muted-500">Takes about 2 minutes</span>
              </div>
            </div>
          </Link>

          {/* COMPANION PATHS: three smaller cards for the other parent-feelings */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {companionPaths.map((path) => (
              <Link
                key={path.title}
                href={path.href}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 p-6 transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${path.ring} ${path.bg}`}
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

      {/* Honesty section — this is hard, and that is ok */}
      <section className="px-6 py-16 sm:py-20">
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

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl gradient-navy p-10 text-center text-white sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            One step at a time. That is enough.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80 sm:text-lg">
            You do not need to have a plan for the next ten years. Start where you are today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/support"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3 font-semibold text-primary shadow-soft transition hover:bg-white/90"
            >
              Care Navigation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/support/sensory-friendly"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-7 py-3 font-semibold text-white transition hover:bg-white/15"
            >
              See the local guide
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
