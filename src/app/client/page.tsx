import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Heart,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { TexasAbaLogo } from '@/components/brand/TexasAbaLogo';
import { CommonGroundLogo } from '@/components/brand/CommonGroundLogo';

export default function ClientSignInPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#f4efe8' }}>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Common Ground home">
            <TexasAbaLogo priority decorative className="h-7 w-auto sm:h-8" />
            <span className="border-l border-stone-200 pl-3">
              <CommonGroundLogo className="h-7 w-auto sm:h-8" />
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </nav>

      {/* ── HERO — full bleed, same treatment as homepage ───────── */}
      <section className="relative overflow-hidden pt-16" style={{ minHeight: '520px' }}>

        {/* Photo */}
        <div className="absolute inset-0">
          <Image
            src="/portal-hero.png"
            alt="Mother and child working on a puzzle at home"
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: '55% 30%' }}
          />
          {/* Left gradient — dark tint for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(8,15,30,0.88) 0%, rgba(8,15,30,0.72) 30%, rgba(8,15,30,0.28) 58%, rgba(8,15,30,0.0) 78%)',
            }}
          />
          {/* Top nav edge fade */}
          <div
            className="absolute top-0 left-0 right-0 h-20"
            style={{ background: 'linear-gradient(to bottom, rgba(8,15,30,0.5) 0%, transparent 100%)' }}
          />
        </div>

        {/* Hero content — left aligned, over dark zone */}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex min-h-[468px] items-center py-16 sm:py-24">
            <div className="w-full max-w-[520px]">

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                <Lock className="h-3 w-3 text-rose-400" /> Texas ABA Centers · Client Portal
              </span>

              <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
                Welcome back.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-white/80 sm:text-lg">
                Your family&apos;s care plan, progress, and team — all in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  disabled
                  className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/30 px-6 py-3 text-sm font-semibold text-white/60"
                >
                  <Lock className="h-4 w-4" /> Sign in with email
                  <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wide">production only</span>
                </button>
                <Link
                  href="/client/portal"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <Sparkles className="h-4 w-4" /> Preview demo family
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT CARDS ───────────────────────────────────────── */}
      <section className="mx-auto max-w-2xl px-6 py-12 sm:py-16">

        {/* Sign-in card */}
        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
                Current client area
              </p>
              <h2 className="mt-0.5 text-xl font-bold text-stone-900">
                Sign in to your care account
              </h2>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-stone-600">
            This portal is for families already receiving care with Texas ABA Centers.
            Everything inside is personal to your child — BCBA-written goals, session notes,
            and parent coaching tied to your actual plan.
          </p>

          <ul className="mt-5 space-y-2.5">
            {[
              'HIPAA-protected — only you and your care team see it',
              'Goals, progress, and coaching come directly from your BCBA',
              'Message your BCBA or RBT without leaving the portal',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-stone-700">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Prototype preview</p>
            <p className="mt-1 text-sm leading-relaxed text-amber-800">
              In production this connects to the Texas ABA Centers client sign-in.
              For demo purposes, walk through as an example family below.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <button
              disabled
              className="w-full cursor-not-allowed rounded-2xl bg-primary/20 px-6 py-3 text-center text-sm font-semibold text-primary/50"
            >
              Sign in with your client email (production only)
            </button>
            <Link
              href="/client/portal"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4" />
              Preview the portal as a demo family
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Not a client — reassurance card */}
        <div className="mt-5 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/8">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                <Compass className="h-3 w-3" /> Care Navigation
              </span>
              <h2 className="mt-3 text-base font-bold text-stone-900">
                Not a client? You are still welcome.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                Care Navigation is open to every family in Texas — any insurance, any stage.
                Resources, guided steps, mental health tools, and help lines.
              </p>
              <Link
                href="/support"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Go to Care Navigation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
