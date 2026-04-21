import Link from 'next/link';
import { ArrowRight, Heart, MessageSquare, Star, TrendingUp } from 'lucide-react';
import { ClientDemoBanner } from '@/components/ui/ClientDemoBanner';

const wins = [
  {
    date: 'Apr 15 · Tuesday',
    headline: 'Used his break card without being asked',
    detail: 'During snack — Mateo handed it over before getting up. First time completely unprompted.',
    isNew: true,
  },
  {
    date: 'Apr 13 · Sunday',
    headline: 'Transitioned to mealtime with one visual cue',
    detail: '3 of 4 tries went smoothly this week. Getting more consistent.',
    isNew: false,
  },
  {
    date: 'Apr 10 · Thursday',
    headline: 'Starting to notice his name in quieter settings',
    detail: '2 of 5 trials — this one is new and will take time. The fact that it happened at all matters.',
    isNew: false,
  },
];

const currentFocus = [
  {
    label: 'Asking for a break on his own',
    direction: 'Getting stronger',
    positive: true,
    note: 'Keep the picture card visible at meals and let him use it without prompting.',
  },
  {
    label: 'Moving from play to mealtime',
    direction: 'Steady and improving',
    positive: true,
    note: 'Use the visual timer — 2 minutes before every meal.',
  },
  {
    label: 'Noticing when someone says his name',
    direction: 'Brand new — just started',
    positive: false,
    note: 'Say his name softly from nearby before giving any instruction.',
  },
];

export default function ProgressPage() {
  return (
    <div className="page-shell space-y-6">
      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          <Star className="h-3.5 w-3.5" /> Growth &amp; wins
        </div>
        <h1 className="page-title">How Mateo is growing</h1>
        <p className="page-description">
          Progress is not always a straight line. These are the real moments — big and small — that
          show what is building. If a number ever doesn&apos;t make sense, message your team.
        </p>
      </header>

      <ClientDemoBanner />

      {/* The one thing to notice */}
      <section className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">
            The moment to celebrate this week
          </h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted-700">
          Mateo used his picture card to ask for a break all on his own — no one prompted him. That
          is the goal. He is starting to own it. Keep the card where he can reach it.
        </p>
        <p className="mt-3 text-sm font-semibold text-emerald-700">
          You helped make this happen by practicing at home.
        </p>
      </section>

      {/* Recent wins */}
      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Recent highlights</h2>
        </div>
        <ul className="mt-4 space-y-3">
          {wins.map((win) => (
            <li
              key={win.date}
              className="rounded-2xl border border-surface-border bg-surface-muted p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <Star className="h-3.5 w-3.5 text-emerald-600" />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-400">
                      {win.date}
                    </p>
                    {win.isNew && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        New milestone
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-brand-muted-900">{win.headline}</p>
                  <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{win.detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Where things stand */}
      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Where things stand</h2>
        </div>
        <p className="mt-1 text-sm text-brand-muted-500">
          Plain-language summary of each current focus area.
        </p>
        <ul className="mt-4 space-y-3">
          {currentFocus.map((item) => (
            <li
              key={item.label}
              className="rounded-2xl border border-surface-border bg-surface-muted p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-brand-muted-900">{item.label}</p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    item.positive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'border border-surface-border bg-white text-brand-muted-500'
                  }`}
                >
                  {item.direction}
                </span>
              </div>
              <div className="mt-2 rounded-xl border border-accent/15 bg-accent/5 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  Practice at home
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-brand-muted-700">{item.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Questions prompt */}
      <div className="rounded-3xl border border-primary/10 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-brand-muted-900">
              Something not adding up? Something you want to understand better?
            </p>
            <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">
              You should never feel like you are reading data alone. Message your team — they want to
              explain it to you.
            </p>
            <Link
              href="/client/concerns"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Ask your care team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
