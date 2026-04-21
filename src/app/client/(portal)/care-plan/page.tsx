import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Heart,
  MessageSquare,
  Target,
  Users,
} from 'lucide-react';
import { ClientDemoBanner } from '@/components/ui/ClientDemoBanner';

const goals = [
  {
    area: 'Communication',
    whatWeAreDoing: 'Helping Mateo ask for a break using his picture card on his own',
    howWeKnowItIsWorking: 'He does it by himself three sessions in a row',
    status: 'In progress',
    practiceAtHome: 'Keep the card visible at meals. Let him hand it to you — no prompting.',
  },
  {
    area: 'Daily routines',
    whatWeAreDoing: 'Making the switch from play to mealtime smoother with one visual cue',
    howWeKnowItIsWorking: '4 out of 5 mealtimes go smoothly each week',
    status: 'In progress',
    practiceAtHome: 'Use the visual timer 2 minutes before every meal.',
  },
  {
    area: 'Social awareness',
    whatWeAreDoing: 'Helping Mateo notice when someone is talking to him',
    howWeKnowItIsWorking: 'He turns or responds within 3 seconds, 80% of the time',
    status: 'Just added',
    practiceAtHome: 'Say his name softly from 3 feet away before giving instructions.',
  },
];

export default function CarePlanPage() {
  return (
    <div className="page-shell space-y-6">
      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-semibold text-accent">
          <ClipboardList className="h-3.5 w-3.5" /> Current care plan
        </div>
        <h1 className="page-title">What we are working on with Mateo</h1>
        <p className="page-description">
          This plan was built by Dr. Ortiz based on what matters most for Mateo right now.
          Everything here is written for you — no clinical shorthand, no guesswork.
        </p>
      </header>

      <ClientDemoBanner />

      {/* Care team */}
      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-muted-900">
          <Users className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Your support team</h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-400">
              Behavior specialist (BCBA)
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-muted-900">Dr. Rachel Ortiz</p>
            <p className="mt-1 text-xs text-brand-muted-500">
              Designs the plan and adjusts it as Mateo grows
            </p>
          </div>
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-400">
              Therapy provider (RBT)
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-muted-900">Jasmine Patel</p>
            <p className="mt-1 text-xs text-brand-muted-500">
              Runs every session and practices each goal with Mateo
            </p>
          </div>
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-400">
              Parent coaching
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-muted-900">Dr. Ortiz</p>
            <p className="mt-1 text-xs text-brand-muted-500">
              Guides you on practicing at home between sessions
            </p>
          </div>
        </div>
      </section>

      {/* Goals in parent language */}
      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-muted-900">
          <Target className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">What we are focusing on</h2>
        </div>
        <p className="mt-1 text-sm text-brand-muted-500">
          These are Mateo&apos;s current goals, explained in plain language.
        </p>

        <ul className="mt-4 space-y-4">
          {goals.map((goal) => (
            <li
              key={goal.area}
              className="rounded-2xl border border-surface-border bg-surface-muted p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                  {goal.area}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    goal.status === 'Just added'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {goal.status}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-semibold text-brand-muted-900">
                {goal.whatWeAreDoing}
              </h3>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-surface-border bg-white p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-muted-400">
                    How we know it&apos;s working
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-brand-muted-700">
                    {goal.howWeKnowItIsWorking}
                  </p>
                </div>
                <div className="rounded-xl border border-accent/15 bg-accent/5 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                    Practice at home
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-brand-muted-700">
                    {goal.practiceAtHome}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Plan review */}
      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-muted-900">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold">When does this get updated?</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted-600">
          Dr. Ortiz reviews and updates this plan every 90 days — or sooner if Mateo hits a goal
          early or you notice something that needs attention. Next scheduled review:{' '}
          <span className="font-semibold text-brand-muted-900">June 12.</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted-600">
          If something changes at home or school before then, you can always share it with the team.
        </p>
        <Link
          href="/client/concerns"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <MessageSquare className="h-4 w-4" /> Share a concern or update{' '}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Reassurance */}
      <div className="rounded-3xl border border-primary/10 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <Heart className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p className="text-sm leading-relaxed text-brand-muted-700">
            You do not need to memorize any of this. The team tracks it so you can focus on the one
            thing at the top of each goal card. That is the only thing you need to do at home.
          </p>
        </div>
      </div>
    </div>
  );
}
