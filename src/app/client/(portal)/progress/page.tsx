import { ArrowUpRight, LineChart, Sparkles } from 'lucide-react';
import { ClientDemoBanner } from '@/components/ui/ClientDemoBanner';

const sessions = [
  { date: 'Apr 15 · Tue', rbt: 'Jasmine', note: 'Requested a break 2× with picture card during snack. First time unprompted.' },
  { date: 'Apr 13 · Sun', rbt: 'Jasmine', note: 'Transitioned to mealtime with one visual prompt, 3 of 4 tries.' },
  { date: 'Apr 10 · Thu', rbt: 'Jasmine', note: 'Worked on name response; responded in 2 of 5 quiet-room trials.' },
];

const weekly = [
  { label: 'Requests a break (independent)', trend: '+12% this week', good: true },
  { label: 'Transitions with one prompt', trend: 'Steady', good: true },
  { label: 'Name response (quiet)', trend: 'Too new to trend', good: false },
];

export default function ProgressPage() {
  return (
    <div className="page-shell space-y-6">
      <header className="page-header">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Progress · last 2 weeks
        </p>
        <h1 className="page-title">How Mateo is doing</h1>
        <p className="page-description">
          Session-level data in plain language. If a number does not make sense,
          message your BCBA — we will never leave you to interpret it alone.
        </p>
      </header>

      <ClientDemoBanner />

      <section className="rounded-3xl border border-accent/20 bg-accent/5 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-brand-muted-900">
            The one thing to notice
          </h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted-600">
          Mateo used his picture card to ask for a break without prompting for
          the first time this week. Small moment, big deal. Try to keep the card
          where he can see it during meals and transitions.
        </p>
      </section>

      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-muted-900">
          <LineChart className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">This week, at a glance</h2>
        </div>
        <ul className="mt-4 space-y-2">
          {weekly.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-surface-border bg-surface-muted px-4 py-3"
            >
              <span className="text-sm text-brand-muted-900">{item.label}</span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold ${
                  item.good ? 'text-emerald-700' : 'text-brand-muted-500'
                }`}
              >
                {item.good && <ArrowUpRight className="h-3.5 w-3.5" />} {item.trend}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-brand-muted-900">
          Recent session notes
        </h2>
        <ul className="mt-4 space-y-3">
          {sessions.map((session) => (
            <li
              key={session.date}
              className="rounded-2xl border border-surface-border bg-surface-muted p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-500">
                {session.date} · with {session.rbt}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-brand-muted-900">
                {session.note}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
