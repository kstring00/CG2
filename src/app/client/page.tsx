import Link from 'next/link';
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

/**
 * The client portal sign-in gate. In production this would be an actual
 * authentication screen. For the prototype, it opens the door to a demo
 * family profile so execs and clinicians can walk through the experience.
 */
export default function ClientSignInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-surface-muted to-surface-muted">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-surface-border/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Common Ground home">
            <TexasAbaLogo priority decorative className="h-7 w-auto sm:h-9" />
            <span className="border-l border-surface-border pl-3 font-display text-base font-bold text-brand-muted-900 sm:text-lg">
              Common<span className="text-primary"> Ground</span>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-2xl px-6 pb-20 pt-36">
        {/* Layer badge up top — the FIRST thing the eye reads */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
            <Lock className="h-3.5 w-3.5" /> Client portal · sign-in required
          </span>
        </div>

        <div className="rounded-3xl border-2 border-accent/25 bg-white p-8 shadow-card sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
              <ShieldCheck className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Current client area
              </p>
              <h1 className="mt-1 text-2xl font-bold text-brand-muted-900 sm:text-3xl">
                Sign in to your care account
              </h1>
            </div>
          </div>

          <p className="mt-5 text-base leading-relaxed text-brand-muted-600">
            This portal is only for families already receiving care with Texas
            ABA Centers. Everything inside is personal to your child —
            BCBA-written goals, RBT session data, and parent coaching tied to
            your actual plan.
          </p>

          <ul className="mt-5 space-y-2 text-sm text-brand-muted-700">
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              HIPAA-protected — only you and your care team see it
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Goals, progress, and coaching come directly from your BCBA
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Message your BCBA or RBT without leaving the portal
            </li>
          </ul>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">
              Prototype preview
            </p>
            <p className="mt-1 text-sm leading-relaxed text-amber-800">
              In production, this screen will connect to the existing Texas ABA
              Centers client sign-in. For demo purposes, you can walk through
              the portal as an example family below.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <button
              disabled
              className="w-full cursor-not-allowed rounded-2xl bg-accent/30 px-6 py-3 text-center text-sm font-semibold text-white"
            >
              Sign in with your client email (production only)
            </button>
            <Link
              href="/client/portal"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-white px-6 py-3 text-sm font-semibold text-accent transition hover:bg-accent/5"
            >
              <Sparkles className="h-4 w-4" />
              Preview the portal as a demo family
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Reassurance for non-clients who landed here by accident */}
        <div className="mt-6 rounded-3xl border-2 border-primary/20 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/5">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                <Compass className="h-3 w-3" /> Care Navigation
              </span>
              <h2 className="mt-3 text-lg font-semibold text-brand-muted-900">
                Not a client? You are still welcome.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
                Care Navigation is open to every family in Texas — any
                insurance, any stage. Resources, guided steps, the
                sensory-friendly guide, community, and help lines.
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
