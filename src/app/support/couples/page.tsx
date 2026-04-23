'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Heart,
  HeartHandshake,
  Users,
  MessageCircle,
  Calendar,
  Shield,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

/* ─── data ─────────────────────────────────────────────────── */

const breakingPoints = [
  {
    n: '01',
    title: 'One partner more involved than the other',
    body:
      'When one parent becomes the primary case manager — tracking goals, attending all sessions, fielding every call from the BCBA — the other can feel excluded or guilty for not doing enough. Both feelings are valid. The imbalance is real, and it builds resentment in both directions.',
    color: 'rose',
  },
  {
    n: '02',
    title: 'Disagreements about therapy goals',
    body:
      'One parent wants to push harder. The other wants to protect their child from stress. These are not incompatible values — they are the same love expressed differently. But without space to talk about it openly, these disagreements can harden into opposing camps.',
    color: 'amber',
  },
  {
    n: '03',
    title: 'No time or energy left for intimacy',
    body:
      'After a full day of therapy logistics, meltdowns, IEP meetings, and insurance calls, there is nothing left. Not for sex, not for closeness, not even for a real conversation. Many couples describe this period as "roommates who co-parent." It is more common than you think, and it is not permanent.',
    color: 'violet',
  },
  {
    n: '04',
    title: 'Grief that is out of sync',
    body:
      'One partner reaches acceptance before the other does. One is still angry at the diagnosis while the other has moved into problem-solving mode. When partners are in different grief stages, they cannot fully reach each other — and each person can feel profoundly alone inside the same marriage.',
    color: 'sky',
  },
];

const colorMap: Record<string, { card: string; badge: string; num: string }> = {
  rose:   { card: 'border-rose-200 bg-rose-50',     badge: 'bg-rose-100 text-rose-700',     num: 'text-rose-400' },
  amber:  { card: 'border-amber-200 bg-amber-50',   badge: 'bg-amber-100 text-amber-700',   num: 'text-amber-400' },
  violet: { card: 'border-violet-200 bg-violet-50', badge: 'bg-violet-100 text-violet-700', num: 'text-violet-400' },
  sky:    { card: 'border-sky-200 bg-sky-50',        badge: 'bg-sky-100 text-sky-700',       num: 'text-sky-400' },
};

const whyItIsHard = [
  { label: 'Divided attention — your child\'s needs consume what used to flow to each other' },
  { label: 'Grief processed differently — at different speeds, in different ways' },
  { label: 'Financial strain — ABA therapy costs can reshape every financial decision' },
  { label: 'Loss of couple identity — "parents of an autistic child" can become your entire story' },
  { label: 'Disagreements about therapy approach — small gaps that widen under stress' },
  { label: 'Exhaustion leaving nothing for each other — the tank is genuinely empty' },
];

const checkInSteps = [
  {
    prompt: '"What do YOU need tonight?"',
    note: 'Not about the kids. Not about the schedule. What does this person — your partner — need right now.',
  },
  {
    prompt: '"What was the hardest moment of your day?"',
    note: 'One sentence. No solutions offered unless asked. Just witnessing.',
  },
  {
    prompt: '"Is there anything you need from me before we sleep?"',
    note: 'Keep it small. A hug. Five minutes without phones. The words "I see how hard you\'re working."',
  },
];

const microConnections = [
  'A 6-second hug — research shows it\'s the minimum to trigger oxytocin',
  'Eye contact and one real smile across a room',
  'A text that says "I was thinking about you" with no agenda',
  'Five minutes sitting side by side — not talking, just present',
  'Saying "thank you for doing that" about something specific and small',
  'One inside joke from before all of this — kept alive on purpose',
];

const therapySigns = [
  'You\'ve had the same argument more than five times with no resolution',
  'One or both of you has stopped trying to explain what you\'re feeling',
  'Physical or emotional distance has become the default, not a temporary phase',
  'You feel more like co-workers than partners',
  'One of you is carrying resentment that has calcified',
  'The thought of a hard conversation feels more exhausting than the alternative',
];

const resources = [
  {
    title: 'Psychology Today — Couples Therapy Directory',
    desc: 'Filter by insurance, location, and specialty. Search "autism families," "special needs parents," or "family of origin."',
    url: 'https://www.psychologytoday.com/us/therapists',
    tag: 'Find a therapist',
    tagColor: 'bg-brand-plum-50 text-brand-plum-700 border-brand-plum-200',
  },
  {
    title: 'Gottman Referral Network',
    desc: 'The Gottman Institute trains therapists specifically in research-backed couples methods. All therapists in this network have completed intensive certification.',
    url: 'https://www.gottman.com/couples/private-therapy/find-a-therapist/',
    tag: 'Couples specialist',
    tagColor: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    title: '"The Autism Relationships Handbook" — Joe Biel & Dr. Faith Harper',
    desc: 'Practical and compassionate. Not just for autistic adults — also for parents of autistic children navigating what that means for the whole family system.',
    url: 'https://microcosmpublishing.com/catalog/books/8082',
    tag: 'Book',
    tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    title: '"Autism Spectrum Disorder in the Family" — Alan Rivett & Carol Burnett',
    desc: 'Specifically written for family members and the relational toll of navigating an autism diagnosis — including the impact on the couple relationship.',
    url: 'https://www.amazon.com/Autism-Spectrum-Disorder-Family-Burnett/dp/1476676844',
    tag: 'Book',
    tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    title: 'Open Path Collective — Sliding-Scale Couples Therapy',
    desc: 'Sessions from $30–$80. If cost has been a barrier to seeking couples therapy, this removes it.',
    url: 'https://openpathcollective.org',
    tag: 'Affordable care',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
];

const [ACCORDION_RESOURCES, ACCORDION_CHECKIN] = [0, 1];

/* ─── component ────────────────────────────────────────────── */

export default function CouplesPage() {
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [openSection, setOpenSection] = useState<number | null>(null);

  return (
    <div className="page-shell">

      {/* ══════════════════════════════════════════
          SECTION 1 — SEEN
          "We know what this is like."
      ══════════════════════════════════════════ */}

      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
          <HeartHandshake className="h-3.5 w-3.5" /> Couples &amp; Relationship Support
        </div>
        <h1 className="page-title text-3xl font-bold sm:text-4xl">
          Your relationship is worth fighting for. And so are you.
        </h1>
        <p className="page-description text-base leading-relaxed">
          ABA families have significantly higher rates of relationship strain. You are not failing your
          marriage — you are both surviving something enormous.
        </p>
      </header>

      {/* Opening truth card */}
      <div className="rounded-3xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white p-6 sm:p-8">
        <div className="flex gap-4">
          <Heart className="mt-1 h-6 w-6 shrink-0 text-rose-400" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-400 mb-2">
              Before we go further
            </p>
            <p className="text-lg font-medium leading-relaxed text-brand-muted-900 italic">
              &ldquo;You fell in love as two people. That is still who you are underneath all of this.&rdquo;
            </p>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted-600">
              The strain on your relationship is not evidence that your love wasn&apos;t strong enough. It is evidence
              that you are both carrying something that most relationships will never face. Research consistently shows
              that caregivers of children with autism experience higher rates of marital conflict, lower relationship
              satisfaction, and significantly elevated stress compared to other parents. This is not a character
              failure. It is a predictable consequence of an enormous weight.
            </p>
          </div>
        </div>
      </div>

      {/* Why this is hard */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-brand-muted-500" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Why ABA caregiving strains relationships</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          These are not excuses. They are the specific, named reasons your relationship is under pressure — and
          naming them is the first step to not letting them quietly win.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {whyItIsHard.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-surface-border bg-surface-muted px-4 py-3"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted-400" />
              <span className="text-sm leading-relaxed text-brand-muted-700">{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — GROUNDED
          "Here is what is actually happening."
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          The breaking points
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* 4 breaking points — styled cards */}
      <section>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          Most couples in ABA families hit one or more of these moments. Reading about them doesn&apos;t mean you
          are heading for crisis — it means you can see them coming and name them before they name you.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {breakingPoints.map((point, i) => {
            const c = colorMap[point.color];
            return (
              <div
                key={i}
                className={`rounded-2xl border-2 p-5 ${c.card}`}
              >
                <div className="flex items-start gap-3">
                  <span className={`text-3xl font-black leading-none ${c.num}`}>{point.n}</span>
                  <div>
                    <h3 className="text-sm font-bold text-brand-muted-900 leading-snug">{point.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-muted-700">{point.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Communication tools — 10-minute check-in */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">The 10-minute check-in</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-1">
          A structured nightly ritual — not about the kids, not about the schedule, not about what needs
          to happen tomorrow. This is the smallest unit of connection that still counts.
        </p>
        <p className="text-sm font-semibold text-brand-plum-700 mb-5">
          Rule: you cannot bring up a logistics problem during this check-in.
          If logistics come up, pause and say &ldquo;that&apos;s for the morning.&rdquo;
        </p>

        <div className="space-y-3">
          {checkInSteps.map((step, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-surface-border bg-surface-muted p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-plum-600 text-xs font-bold text-white">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900 italic">{step.prompt}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{step.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-brand-plum-200 bg-brand-plum-50 p-4">
          <p className="text-sm font-semibold text-brand-plum-800">How to ask for what you need without a fight</p>
          <p className="mt-2 text-sm leading-relaxed text-brand-plum-700">
            The formula that works: <span className="font-semibold">&ldquo;I feel [feeling] when [specific situation]. Tonight I need [specific, small thing].&rdquo;</span> Not
            &ldquo;you never&rdquo;, not &ldquo;you always&rdquo; — just this moment, this feeling, this one need.
            Your partner cannot read your mind across the noise of caregiving. This phrasing cuts through it.
          </p>
        </div>
      </section>

      {/* Invisible labor */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-sky-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">The invisible labor problem</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          In most ABA families, one partner carries significantly more of what researchers call &ldquo;invisible labor&rdquo; —
          the mental load of tracking therapy goals, scheduling, researching next steps, managing IEPs, and
          holding the emotional state of the whole family. It rarely gets acknowledged because no one can see it.
          It burns people out quietly.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Name it first', body: 'Make a list — together — of everything that has to happen to keep your child\'s therapy running. Include the mental work: remembering deadlines, interpreting data, planning transitions. See it all in one place.' },
            { title: 'Redistribute one thing', body: 'Not everything. One thing. The partner who carries less takes one task — not forever, just this month. A specific task with a specific owner makes the redistribution real.' },
            { title: 'Acknowledge what you can\'t redistribute', body: 'Some tasks genuinely can only be done by one person. Naming that — and thanking the person who carries it — matters more than most couples realize.' },
            { title: 'Check in monthly, not just when it breaks', body: 'Resentment builds when load imbalances go unacknowledged for months. A monthly five-minute conversation about who is carrying what prevents that slow build.' },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
              <p className="text-sm font-semibold text-brand-muted-900">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-muted-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — HOPEFUL
          "Here's what actually helps."
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          What actually works
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* Micro-moments — not date night */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Protecting the relationship — it&apos;s not date night</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-2">
          Date night advice assumes you have free time, a babysitter, money, and energy. Most ABA families
          have none of those on a reliable schedule. What actually sustains a relationship through this
          season is different: it&apos;s micro-moments of connection, repeated deliberately.
        </p>
        <p className="text-sm font-semibold text-brand-muted-800 mb-4">
          These take under 60 seconds. They compound.
        </p>
        <ul className="space-y-2">
          {microConnections.map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5">
              <Heart className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
              <span className="text-sm text-brand-muted-700">{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800">A note on shared language</p>
          <p className="mt-1.5 text-sm leading-relaxed text-emerald-700">
            Many couples in long ABA seasons develop private shorthand — a code word for &ldquo;I am at the edge of what I
            can handle right now,&rdquo; a signal that means &ldquo;I need you to take over for the next hour.&rdquo; Building this
            language is not a coping mechanism — it is how two people stay on the same team under pressure.
          </p>
        </div>
      </section>

      {/* When to seek couples therapy */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">When to seek couples therapy — specific signs</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          Not &ldquo;when things are bad.&rdquo; Things are already hard — that&apos;s not the signal. These are the
          specific patterns that mean the relationship needs outside support to stay intact.
        </p>
        <ul className="space-y-2 mb-6">
          {therapySigns.map((sign, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              <span className="text-sm text-brand-muted-700">{sign}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-brand-plum-200 bg-brand-plum-50 p-4">
          <p className="text-sm font-semibold text-brand-plum-800">How to find a therapist who understands this</p>
          <p className="mt-2 text-sm leading-relaxed text-brand-plum-700">
            On Psychology Today, search for therapists who list &ldquo;autism,&rdquo; &ldquo;special needs families,&rdquo;
            &ldquo;neurodiversity,&rdquo; or &ldquo;caregiver stress&rdquo; as specialties. During a first call, ask directly:
            &ldquo;Have you worked with families who have children in ABA therapy?&rdquo; A good therapist will not be
            put off by the question. They will be glad you asked.
          </p>
        </div>
      </section>

      {/* Resources accordion */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <button
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => setOpenSection(openSection === ACCORDION_RESOURCES ? null : ACCORDION_RESOURCES)}
        >
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg font-semibold text-brand-muted-900">Resources for couples</h2>
          </div>
          {openSection === ACCORDION_RESOURCES
            ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
            : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
        </button>
        {openSection === ACCORDION_RESOURCES && (
          <div className="mt-5 space-y-3">
            {resources.map((r, i) => (
              <div key={i} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${r.tagColor}`}>
                    {r.tag}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-brand-muted-900">{r.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{r.desc}</p>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Visit resource <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Closing */}
      <div className="rounded-3xl bg-gradient-to-br from-rose-50/60 via-brand-plum-50/30 to-white border border-rose-100 p-8 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-surface-border shadow-soft mb-5">
          <HeartHandshake className="h-6 w-6 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-brand-muted-900">
          You fell in love as two people. That is still who you are.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-brand-muted-600">
          Underneath the therapy schedules and the insurance calls and the grief and the exhaustion — there
          are two people who chose each other. That doesn&apos;t disappear. Sometimes it just needs to be
          found again, carefully.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/support/caregiver"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
          >
            Caregiver support for yourself <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/support/financial"
            className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition hover:bg-surface-muted"
          >
            Financial stress resources
          </Link>
        </div>
      </div>

    </div>
  );
}
