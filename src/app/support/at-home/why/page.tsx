import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  ClipboardList,
  Eye,
  Hand,
  Home as HomeIcon,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { AT_HOME_STRATEGIES_LABEL } from '@/lib/supportNavLabels';

const FUNCTIONS = [
  {
    number: '1',
    title: 'Getting out of something — Escape',
    looksLike: "It starts when you ask, when it's time to stop something fun, when the task is hard, when there's a transition. It stops the second the demand goes away.",
    tell: "If you drop the ask and the behavior ends immediately, that's escape.",
    backfires: 'Removing the task to calm things down. Understandable, and it teaches that the behavior works.',
    helps: 'Make the ask smaller (#4). Give a heads-up (#8). Change the setup so the demand is easier (#10). Teach them to ask for a break (#9).',
  },
  {
    number: '2',
    title: 'Getting you — Attention',
    looksLike: "It happens most when you're busy, on the phone, with a sibling, in another room. It stops when you engage — even if you're engaging to correct.",
    tell: 'Any attention works, including frustrated attention. If a sharp “stop that!” ends it as reliably as a hug, that’s a strong sign.',
    backfires: 'Big reactions. Long explanations. The correction is the payoff.',
    helps: 'Catch them being good (#2), especially before they need to escalate. Teach them a way to ask for you (#9).',
  },
  {
    number: '3',
    title: 'Getting something — Access',
    looksLike: 'It shows up around a specific thing. The iPad. A snack. A toy a sibling has. It ends the moment they get it.',
    tell: 'Very predictable trigger, very specific object or activity.',
    backfires: "Giving in at minute eight. That doesn't teach them not to escalate — it teaches them how long to escalate.",
    helps: 'First/Then (#1). Two good choices (#3). Timers so endings aren’t surprises (#8).',
  },
  {
    number: '4',
    title: 'Because of how it feels — Sensory / automatic',
    looksLike: "It happens whether or not anyone's around. It doesn't seem tied to what's going on. It might increase when they're bored, tired, overstimulated, or under-stimulated.",
    tell: "It happens when they're alone.",
    backfires: "Consequences. There's nothing to take away — the behavior is its own payoff.",
    helps: 'This is the one where the page can help least and your BCBA can help most. Environmental changes and sensory alternatives, chosen for your specific child.',
  },
];

export default function WhyBehaviorHappensPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/support" className="hover:text-brand-navy-700">Home</Link></li>
          <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
          <li><Link href="/support/at-home" className="hover:text-brand-navy-700">{AT_HOME_STRATEGIES_LABEL}</Link></li>
          <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
          <li className="font-medium text-brand-muted-700">Why behavior happens</li>
        </ol>
      </nav>

      <header className="mt-5 rounded-3xl border border-surface-border bg-white p-6 shadow-soft sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1 text-[11px] font-semibold text-brand-plum-800">
          <Sparkles className="h-4 w-4" aria-hidden /> Step zero
        </span>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-navy-800 sm:text-4xl">Behavior isn&apos;t random. It&apos;s doing a job.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-brand-muted-800">Before you try anything on this page, it helps to ask one question:</p>
        <p className="mt-3 text-xl font-bold leading-relaxed text-brand-navy-800">What is my child getting — or getting out of — when they do this?</p>
        <p className="mt-4 text-[15px] leading-relaxed text-brand-muted-800">
          Almost every behavior is doing one of four jobs. Same behavior, different job, different answer. That&apos;s why “what worked for that family” often doesn&apos;t work for yours — not because you did it wrong, but because your child&apos;s behavior was doing a different job.
        </p>
        <p className="mt-3 text-[15px] font-semibold text-brand-navy-800">Here&apos;s how to tell.</p>
      </header>

      <div className="mt-6 space-y-4">
        {FUNCTIONS.map((item) => (
          <section key={item.number} className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-plum-100 text-sm font-bold text-brand-plum-900">{item.number}</span>
              <h2 className="pt-1 text-xl font-bold text-brand-navy-800">{item.title}</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-surface-subtle/60 p-4">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-muted-600">Looks like</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-800">{item.looksLike}</p>
              </div>
              <div className="rounded-xl bg-brand-plum-50/70 p-4">
                <h3 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-brand-plum-800"><Eye className="h-4 w-4" aria-hidden /> The tell</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-800">{item.tell}</p>
              </div>
              <div className="rounded-xl bg-rose-50/70 p-4">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-rose-800">What backfires</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-800">{item.backfires}</p>
              </div>
              <div className="rounded-xl bg-emerald-50/70 p-4">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.12em] text-emerald-800">What tends to help</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-800">{item.helps}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/50 p-5 sm:p-6" aria-labelledby="not-sure">
        <h2 id="not-sure" className="text-xl font-bold text-brand-navy-800">If you&apos;re not sure</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-brand-muted-800">That&apos;s normal — and it&apos;s often more than one thing. Try this for three days:</p>
        <blockquote className="mt-4 rounded-xl border border-brand-plum-200 bg-white p-4 text-[15px] font-semibold leading-relaxed text-brand-navy-800">
          Jot down <strong>what happened right before</strong>, <strong>what your child did</strong>, and <strong>what happened right after.</strong>
        </blockquote>
        <p className="mt-3 text-[14px] leading-relaxed text-brand-muted-800">Three lines. That&apos;s it. Patterns show up fast, and it&apos;s the single most useful thing you can bring to your BCBA.</p>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden />
          <p className="text-[14px] leading-relaxed text-amber-950">
            <strong>This is a starting point, not an assessment.</strong> Your BCBA can do a functional assessment that&apos;s far more precise than anything you can do from a page. If a behavior is unsafe, frequent, or getting worse, that&apos;s the move.
          </p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/support/at-home/guide" className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:bg-primary/90">
          Take the 4-question guide <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link href="/support/at-home/unsafe" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-rose-300 bg-white px-5 py-2.5 text-[13px] font-semibold text-rose-800 transition hover:bg-rose-50">
          <ShieldAlert className="h-4 w-4" aria-hidden /> Unsafe behavior
        </Link>
        <Link href="/support/at-home" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-5 py-2.5 text-[13px] font-semibold text-brand-plum-800 transition hover:bg-brand-plum-50">
          <HomeIcon className="h-4 w-4" aria-hidden /> See all strategies
        </Link>
      </div>
    </main>
  );
}
