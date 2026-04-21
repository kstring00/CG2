import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  HeartHandshake,
  Leaf,
  Moon,
  Phone,
  Shield,
  Wind,
  Zap,
} from 'lucide-react';

const stressChecks = [
  { label: 'Skipping meals or sleep regularly', icon: Moon },
  { label: 'Feeling short-tempered or emotionally flat', icon: Zap },
  { label: 'Dreading each new day or therapy appointment', icon: Wind },
  { label: 'Feeling like no one understands what this is like', icon: Heart },
  { label: 'Putting your own health off for weeks', icon: Shield },
  { label: 'Feeling guilty for feeling any of the above', icon: Leaf },
];

const groundingTools = [
  {
    title: '4-7-8 breathing',
    description: 'Inhale for 4 counts. Hold for 7. Exhale for 8. Repeat 3 times. Reduces cortisol within 90 seconds.',
    time: '2 min',
  },
  {
    title: '5-4-3-2-1 grounding',
    description: 'Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste. Interrupts anxiety spirals.',
    time: '3 min',
  },
  {
    title: 'One-sentence permission',
    description: 'Say out loud: "I am allowed to be tired. I am allowed to need help. That does not make me a bad parent."',
    time: '30 sec',
  },
  {
    title: 'The one-thing rule',
    description: 'Pick one small thing you can do for yourself today. Not a list. Just one. A shower. A walk. Five minutes outside.',
    time: '5 min',
  },
];

const supportResources = [
  {
    title: 'Autism Speaks Caregiver Stress Resources',
    description: 'Practical guides on managing stress, burnout prevention, and building your personal support network.',
    url: 'https://www.autismspeaks.org/caregiver-stress',
    source: 'Autism Speaks',
  },
  {
    title: 'Organization for Autism Research — Parent Guides',
    description: 'Free downloadable guides on routines, transitions, sibling support, and day-to-day caregiver strategies.',
    url: 'https://researchautism.org',
    source: 'OAR',
  },
  {
    title: 'SPARK for Autism — Family Community',
    description: 'Connect with other autism families, access expert webinars, and stay informed on the latest research.',
    url: 'https://sparkforautism.org',
    source: 'Simons Foundation',
  },
];

export default function CaregiverSupportPage() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1 text-xs font-semibold text-brand-plum-700">
          <HeartHandshake className="h-3.5 w-3.5" /> Support for you
        </div>
        <h1 className="page-title">You need support too.</h1>
        <p className="page-description">
          This section is not about your child — it is about you. Caregivers who are supported
          give better care. That is not an opinion, it is what the research shows. You deserve
          to be on this list.
        </p>
      </header>

      {/* Stress check-in */}
      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-muted-900">
          <Zap className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold">Signs you might be running low</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
          If any of these feel familiar, you are not broken — you are depleted. That is different,
          and it is fixable with the right support.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {stressChecks.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 rounded-2xl border border-surface-border bg-surface-muted px-4 py-3"
            >
              <item.icon className="h-4 w-4 shrink-0 text-brand-plum-500" />
              <span className="text-sm text-brand-muted-700">{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-2xl border border-brand-plum-100 bg-brand-plum-50 p-4">
          <p className="text-sm font-semibold text-brand-plum-800">
            If you said yes to 3 or more, please reach out for support this week.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-brand-plum-700">
            Talk to your child&apos;s care coordinator, your own doctor, or a counselor. You do not
            have to wait until things are critical.
          </p>
        </div>
      </section>

      {/* Grounding tools */}
      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-muted-900">
          <Leaf className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold">Right now — grounding tools</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
          These work in the middle of a hard day. No app, no equipment, no therapist required.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {groundingTools.map((tool) => (
            <article
              key={tool.title}
              className="rounded-2xl border border-surface-border bg-surface-muted p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-brand-muted-900">{tool.title}</h3>
                <span className="rounded-full border border-surface-border bg-white px-2.5 py-0.5 text-[11px] text-brand-muted-500">
                  {tool.time}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{tool.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Support for the long haul */}
      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 text-brand-muted-900">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Support for the long haul</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
          Caregiver burnout is real and it builds slowly. These resources are for the bigger picture — not just today.
        </p>
        <ul className="mt-4 space-y-3">
          {supportResources.map((r) => (
            <li key={r.title} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-muted-400">{r.source}</p>
                  <h3 className="mt-1 text-sm font-semibold text-brand-muted-900">{r.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{r.description}</p>
                </div>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  Visit <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Crisis / get help now */}
      <section className="rounded-3xl border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10">
            <Phone className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-brand-muted-900">
              If things feel unmanageable
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
              You are allowed to ask for help for yourself — not just for your child. If you are in
              crisis or just need to talk, these are always available.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm font-semibold text-brand-muted-900">
                988 Suicide &amp; Crisis Lifeline —{' '}
                <a href="tel:988" className="text-accent hover:underline">call or text 988</a>
              </li>
              <li className="text-sm text-brand-muted-700">
                Crisis Text Line — text HOME to{' '}
                <span className="font-semibold">741741</span>
              </li>
              <li className="text-sm text-brand-muted-700">
                NAMI Helpline —{' '}
                <a href="tel:1-800-950-6264" className="font-semibold hover:underline">1-800-950-NAMI</a>
                {' '}· Mon–Fri 10am–10pm ET
              </li>
            </ul>
            <Link
              href="/support/help"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
            >
              See all help lines <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Closing affirmation */}
      <div className="rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 to-white p-6 text-center">
        <Heart className="mx-auto h-8 w-8 text-accent" />
        <h2 className="mt-4 text-xl font-semibold text-brand-muted-900">
          Taking care of yourself is part of taking care of your child.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-brand-muted-600">
          Research is clear: caregiver wellbeing directly affects child outcomes. This is not
          a luxury. You matter in this plan.
        </p>
      </div>
    </div>
  );
}
