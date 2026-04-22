'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass, Lock, MapPin, Phone, Users, BookOpen } from 'lucide-react';
import { TexasAbaLogo } from '@/components/brand/TexasAbaLogo';

function CrisisHelpModule() {
  return (
    <aside className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-700">Need immediate help?</p>
          <p className="mt-1 text-sm text-stone-600">You are not alone. Reach support right now.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="tel:988"
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            <Phone className="h-4 w-4" /> Call 988
          </a>
          <a
            href="sms:988"
            className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-5 py-2.5 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100"
          >
            <Phone className="h-4 w-4" /> Text 988
          </a>
        </div>
      </div>
    </aside>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f9f8f6' }}>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Common Ground home">
            <TexasAbaLogo priority decorative className="h-7 w-auto sm:h-8" />
            <span className="border-l border-stone-200 pl-3 font-display text-base font-bold text-stone-900 sm:text-lg">
              Common Ground
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/client"
              className="hidden items-center gap-1.5 text-sm font-semibold text-accent transition hover:text-accent/80 sm:inline-flex"
            >
              <Lock className="h-3.5 w-3.5" /> Client sign in
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              Care Navigation <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-16" style={{ backgroundColor: '#f7f2eb' }}>
        <div className="relative mx-auto min-h-[620px] max-w-6xl overflow-hidden rounded-none lg:rounded-[36px]">
          <Image
            src="/hero-mom-child.png"
            alt="Parent holding child in a calm, supportive moment"
            fill
            priority
            className="object-cover object-[62%_22%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 via-40% to-transparent" />

          <div className="relative z-10 flex min-h-[620px] items-center px-6 py-28 sm:px-10 lg:px-14">
            <div className="max-w-xl">
              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                You don&apos;t have to figure this out alone.
              </h1>
              <p className="mt-5 text-base text-slate-600">We&apos;ll guide you step by step.</p>
              <div className="mt-10">
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  Start Care Navigation <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-8" style={{ backgroundColor: '#f9f8f6' }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Choose the door that fits you.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-stone-500">Two clear paths, one calm place to begin.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <article className="group flex h-full flex-col rounded-3xl border border-primary/15 bg-white p-8 shadow-sm transition duration-200 hover:scale-[1.02] hover:shadow-md sm:p-10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-stone-900">Care Navigation</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">Gentle guidance for next steps, local resources, and family support.</p>
              <div className="mt-8">
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  Explore Care Navigation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>

            <article className="group flex h-full flex-col rounded-3xl border border-stone-300 bg-stone-100/80 p-8 shadow-sm transition duration-200 hover:scale-[1.02] hover:shadow-md sm:p-10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                <Lock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-stone-900">Client Portal</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">A structured space for care plans, progress updates, and secure messages.</p>
              <div className="mt-8">
                <Link
                  href="/client"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90"
                >
                  Go to Client Portal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-8" style={{ backgroundColor: '#f4efe8' }}>
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold text-stone-900 sm:text-4xl">What do you need right now?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-stone-500">Choose one next step and keep moving.</p>
          </div>

          <Link
            href="/support/next-steps"
            className="group mb-8 flex items-center justify-between gap-6 rounded-3xl border border-primary/20 bg-white p-8 shadow-sm transition hover:shadow-md sm:p-10"
          >
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-900 sm:text-2xl">I don&apos;t know what to do next.</h3>
                <p className="mt-2 text-sm text-stone-600">Get a short plan for your next step.</p>
              </div>
            </div>
            <span className="hidden items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white sm:inline-flex">
              Start <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Local sensory-friendly guide',
                desc: 'Find verified places near you.',
                href: '/support/find',
                icon: MapPin,
              },
              {
                title: 'Resource library',
                desc: 'Read quick, trusted guides.',
                href: '/support/resources',
                icon: BookOpen,
              },
              {
                title: 'Community & connection',
                desc: 'Connect with parents nearby.',
                href: '/support/connect',
                icon: Users,
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group flex flex-col rounded-3xl border border-stone-200 bg-white p-8 shadow-sm transition duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                <card.icon className="h-5 w-5 text-primary/80" />
                <h3 className="mt-4 text-base font-semibold text-stone-900">{card.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{card.desc}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <CrisisHelpModule />
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white px-6 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 text-sm font-medium text-stone-700 sm:flex-row sm:gap-8">
          <span>Clinically reviewed</span>
          <span className="hidden text-stone-300 sm:inline">•</span>
          <span>BCBA-led</span>
          <span className="hidden text-stone-300 sm:inline">•</span>
          <span>Built for families</span>
        </div>
      </section>
    </main>
  );
}
