import { CheckCircle2, ClipboardList, Target, Users } from 'lucide-react';
import { ClientDemoBanner } from '@/components/ui/ClientDemoBanner';

const goals = [
  {
    domain: 'Communication',
    goal: 'Request a break using his picture card independently',
    measure: 'Independent request across 3 consecutive sessions',
    status: 'In progress',
    authoredBy: 'Dr. Ortiz, BCBA-D',
  },
  {
    domain: 'Daily routines',
    goal: 'Transition from play to mealtime with one visual prompt',
    measure: '4 of 5 transitions per week',
    status: 'In progress',
    authoredBy: 'Dr. Ortiz, BCBA-D',
  },
  {
    domain: 'Social',
    goal: 'Respond to his name within 3 seconds in a quiet room',
    measure: '80% across 2 weeks',
    status: 'Newly added',
    authoredBy: 'Dr. Ortiz, BCBA-D',
  },
];

export default function CarePlanPage() {
  return (
    <div className="page-shell space-y-6">
      <header className="page-header">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Your child&apos;s care plan
        </p>
        <h1 className="page-title">Mateo&apos;s goals this quarter</h1>
        <p className="page-description">
          These goals were written and approved by your BCBA. Your RBT works on
          them in every session, and the parent coaching modules are built
          around them.
        </p>
      </header>

      <ClientDemoBanner />

      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-muted-900">
          <Users className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Your care team</h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-500">BCBA</p>
            <p className="mt-1 text-sm font-semibold text-brand-muted-900">Dr. Rachel Ortiz, BCBA-D</p>
            <p className="mt-1 text-xs text-brand-muted-500">Writes and updates goals</p>
          </div>
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-500">RBT</p>
            <p className="mt-1 text-sm font-semibold text-brand-muted-900">Jasmine Patel, RBT</p>
            <p className="mt-1 text-xs text-brand-muted-500">Runs sessions with Mateo</p>
          </div>
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-500">Parent coach</p>
            <p className="mt-1 text-sm font-semibold text-brand-muted-900">Dr. Ortiz</p>
            <p className="mt-1 text-xs text-brand-muted-500">Assigns coaching modules</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-muted-900">
          <Target className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Active goals</h2>
        </div>

        <ul className="mt-4 space-y-3">
          {goals.map((goal) => (
            <li
              key={goal.goal}
              className="rounded-2xl border border-surface-border bg-surface-muted p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                  {goal.domain}
                </span>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                  {goal.status}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-brand-muted-900">
                {goal.goal}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-brand-muted-600">
                Measured by: {goal.measure}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-brand-muted-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                Authored by {goal.authoredBy}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-muted-900">
          <ClipboardList className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Plan review</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted-600">
          Your BCBA reviews and updates goals every 90 days, or sooner if Mateo
          hits a goal or hits a wall. Next scheduled review:
          <span className="font-semibold text-brand-muted-900"> June 12</span>.
        </p>
      </section>
    </div>
  );
}
