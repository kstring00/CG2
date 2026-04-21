import { ArrowRight, CheckCircle2, GraduationCap, Play } from 'lucide-react';
import { ClientDemoBanner } from '@/components/ui/ClientDemoBanner';

const modules = [
  {
    title: 'Using picture cards at home',
    minutes: 8,
    tiedTo: 'Goal: Requesting a break independently',
    status: 'assigned',
  },
  {
    title: 'Giving a visual prompt without hovering',
    minutes: 6,
    tiedTo: 'Goal: Transitioning to mealtime',
    status: 'assigned',
  },
  {
    title: 'What to do when he ignores his name',
    minutes: 10,
    tiedTo: 'Goal: Name response',
    status: 'upcoming',
  },
  {
    title: 'Pairing and why we do it',
    minutes: 5,
    tiedTo: 'Foundational',
    status: 'completed',
  },
];

export default function CoachingPage() {
  return (
    <div className="page-shell space-y-6">
      <header className="page-header">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Parent coaching
        </p>
        <h1 className="page-title">Short modules, tied to real goals</h1>
        <p className="page-description">
          Your BCBA picks these for you based on what Mateo is working on right
          now. Nothing generic, nothing longer than it needs to be.
        </p>
      </header>

      <ClientDemoBanner />

      <section className="rounded-3xl border border-accent/20 bg-accent/5 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-muted-900">
          <GraduationCap className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">This week&apos;s module</h2>
        </div>
        <h3 className="mt-3 text-xl font-semibold text-brand-muted-900">
          Using picture cards at home
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
          8 minutes. Assigned by Dr. Ortiz because Mateo is ready to generalize
          his break-card from session to mealtime.
        </p>
        <button className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-accent/90">
          <Play className="h-4 w-4" /> Start module <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-brand-muted-900">Your coaching library</h2>
        <ul className="mt-4 space-y-2">
          {modules.map((m) => (
            <li
              key={m.title}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-border bg-surface-muted p-4"
            >
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">{m.title}</p>
                <p className="mt-0.5 text-xs text-brand-muted-500">
                  {m.minutes} min · {m.tiedTo}
                </p>
              </div>
              {m.status === 'completed' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Done
                </span>
              ) : m.status === 'assigned' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                  Assigned
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-white px-2.5 py-0.5 text-[11px] font-semibold text-brand-muted-600">
                  Upcoming
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
