import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  ClipboardList,
  HeartHandshake,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import { AT_HOME_STRATEGIES_LABEL } from '@/lib/supportNavLabels';

export default function UnsafeBehaviorPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/support" className="hover:text-brand-navy-700">Home</Link></li>
          <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
          <li><Link href="/support/at-home" className="hover:text-brand-navy-700">{AT_HOME_STRATEGIES_LABEL}</Link></li>
          <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
          <li className="font-medium text-brand-muted-700">Unsafe behavior</li>
        </ol>
      </nav>

      <header className="mt-5 rounded-3xl border border-rose-300 bg-rose-50/80 p-6 shadow-soft sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-rose-800">
          <ShieldAlert className="h-4 w-4" aria-hidden /> If the behavior is unsafe
        </span>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-rose-950 sm:text-4xl">Start here instead.</h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-rose-950">
          If your child is hurting themselves, hurting someone else, running from you, or doing something that could cause real injury — this page isn&apos;t the right tool, and picking a strategy on your own could make it worse.
        </p>
        <p className="mt-3 max-w-3xl text-[15px] font-semibold leading-relaxed text-rose-950">
          Not because you can&apos;t handle it. Because unsafe behavior is exactly the situation where the strategy has to match what the behavior is doing, and getting that wrong can strengthen it.
        </p>
      </header>

      <section aria-labelledby="right-now" className="mt-6 rounded-2xl border border-rose-200 bg-white p-5 shadow-soft sm:p-6">
        <h2 id="right-now" className="flex items-center gap-2 text-xl font-bold text-brand-navy-800">
          <AlertTriangle className="h-5 w-5 text-rose-700" aria-hidden /> Right now
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-muted-800">
          <strong>If someone is in danger:</strong> call <strong>911</strong>.
        </p>
        <p className="mt-4 text-[14px] font-semibold text-brand-navy-800">Otherwise, in the moment, your only jobs are:</p>
        <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-brand-muted-800">
          <li>• Keep everyone safe. Move objects, not the child, when you can.</li>
          <li>• Say less. Fewer words, calm voice, low tone.</li>
          <li>• Reduce input. Lights, noise, people.</li>
          <li>• Don&apos;t teach. Don&apos;t reason. Don&apos;t negotiate. Wait.</li>
        </ul>
      </section>

      <section aria-labelledby="today" className="mt-4 rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
        <h2 id="today" className="text-xl font-bold text-brand-navy-800">Today</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-muted-800">
          <strong>Call your BCBA.</strong> Not at the next scheduled meeting — today. Unsafe behavior warrants a same-week response, and any care team worth having wants that call.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {/* TODO: Replace /client with the confirmed direct care-team contact route when available. */}
          <Link href="/client" className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90">
            Contact my care team <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/support/find" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-plum-800 transition hover:bg-brand-plum-50">
            Find local help <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      <section aria-labelledby="bring-this" className="mt-4 rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
        <h2 id="bring-this" className="flex items-center gap-2 text-xl font-bold text-brand-navy-800">
          <ClipboardList className="h-5 w-5 text-brand-plum-700" aria-hidden /> Bring this with you
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed text-brand-muted-800">Write down three things for each incident, for as long as you can:</p>
        <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-brand-muted-800">
          <li>• What happened right before</li>
          <li>• What your child did, and for how long</li>
          <li>• What happened right after</li>
        </ul>
        <p className="mt-3 text-[14px] leading-relaxed text-brand-muted-800">Three lines per incident. This is the single most useful thing you can hand a BCBA.</p>
      </section>

      <section aria-labelledby="one-thing" className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6">
        <h2 id="one-thing" className="text-xl font-bold text-amber-950">One thing to know</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-amber-950">
          If a strategy is starting to work, unsafe behavior sometimes <strong>gets bigger before it gets smaller</strong>. This is expected and it is also exactly the moment where a plan needs professional eyes on it. Don&apos;t ride it out alone.
        </p>
      </section>

      <section aria-label="Get support" className="mt-6 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/50 p-5 sm:p-6">
        <div className="flex flex-wrap gap-3">
          <Link href="/client" className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90">
            <HeartHandshake className="h-4 w-4" aria-hidden /> Contact my care team
          </Link>
          <Link href="/support/find" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-plum-800 transition hover:bg-brand-plum-100">
            Find local help <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a href="tel:988" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-navy-800 transition hover:bg-slate-50">
            <Phone className="h-4 w-4" aria-hidden /> 988 for caregiver crisis support
          </a>
        </div>
      </section>
    </main>
  );
}
