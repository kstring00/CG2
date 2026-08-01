'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  HeartHandshake,
  LifeBuoy,
  Lock,
  MessageCircleOff,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';

const plannedGroups = [
  {
    title: 'New Diagnosis Circle',
    description: 'A moderated space for parents learning a new language, making early decisions, and carrying a lot at once.',
    tag: 'Planned pilot group',
  },
  {
    title: 'Working Parents Circle',
    description: 'For parents balancing work, appointments, school communication, household responsibilities, and recovery.',
    tag: 'Planned pilot group',
  },
];

const trainingSlots = [
  {
    title: 'Upcoming live caregiver training',
    description: 'A dedicated space for the next clinician-led online session, including the topic, date, time, and registration link.',
    icon: CalendarDays,
    action: 'Schedule to be added',
  },
  {
    title: 'Ask a Clinician',
    description: 'A separate clinician-led session for questions that peer groups and moderators cannot safely answer.',
    icon: CircleHelp,
    action: 'Program in planning',
  },
  {
    title: 'Training library',
    description: 'A future home for recordings, short summaries, and the specific questions each session answers.',
    icon: Video,
    action: 'Recordings coming later',
  },
];

const communityRules = [
  'Share support and lived experience without telling another parent what treatment to try.',
  'Do not recommend supplements, diets, protocols, medications, therapies, dosing, or “what worked for us” treatments.',
  'Protect children and other members: no full names, schools, clinics, photos, medical records, screenshots, or reposting.',
  'Criticism of ABA, providers, and Texas ABA Centers is allowed. Civility toward other members is still required.',
  'Peer support is not clinical care, emergency intervention, or a crisis line.',
];

export default function ConnectPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/support" className="hover:text-brand-navy-700">Home</Link></li>
          <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
          <li className="font-medium text-brand-muted-700">Parent Connection</li>
        </ol>
      </nav>

      <section className="overflow-hidden rounded-[1.8rem] border border-surface-border bg-gradient-to-br from-white via-white to-brand-plum-50/70 shadow-soft">
        <div className="p-6 sm:p-9">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-brand-plum-700">
            <HeartHandshake className="h-3.5 w-3.5" aria-hidden /> Parent Connection
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-brand-navy-800 sm:text-5xl">
            A place where you do not have to explain the whole story first.
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-brand-muted-700">
            Common Ground is building moderated peer spaces for parents of children on the autism spectrum. The community itself is not live yet. We are putting the safety, privacy, staffing, and escalation systems in place before inviting families in.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#trainings" className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-soft hover:bg-primary/90">
              See caregiver trainings <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="#planned-groups" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-brand-plum-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-brand-plum-800 hover:bg-brand-plum-50">
              Preview planned groups
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3" aria-label="Current launch boundaries">
        <article className="rounded-2xl border border-emerald-100 bg-emerald-50/65 p-5">
          <ShieldCheck className="h-5 w-5 text-emerald-700" aria-hidden />
          <h2 className="mt-3 text-[15px] font-semibold text-brand-navy-800">Safety before scale</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-brand-muted-700">No real groups open until escalation, privacy, and dual-role policies are approved.</p>
        </article>
        <article className="rounded-2xl border border-blue-100 bg-blue-50/65 p-5">
          <MessageCircleOff className="h-5 w-5 text-blue-700" aria-hidden />
          <h2 className="mt-3 text-[15px] font-semibold text-brand-navy-800">No private messaging</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-brand-muted-700">1:1 messaging and parent matching are not part of the first launch.</p>
        </article>
        <article className="rounded-2xl border border-violet-100 bg-violet-50/65 p-5">
          <Lock className="h-5 w-5 text-violet-700" aria-hidden />
          <h2 className="mt-3 text-[15px] font-semibold text-brand-navy-800">Honest privacy</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-brand-muted-700">Peer support is not clinician-level confidentiality. Final platform privacy language still requires compliance review.</p>
        </article>
      </section>

      <section id="trainings" className="scroll-mt-24 rounded-[1.6rem] border border-primary/15 bg-gradient-to-br from-teal-50/70 via-white to-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary"><Sparkles className="h-3.5 w-3.5" aria-hidden /> Clinician-backed learning</span>
            <h2 className="mt-2 text-2xl font-semibold text-brand-navy-800">Live caregiver trainings</h2>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-brand-muted-700">
              This is the main destination for questions moderators cannot answer inside peer groups. Trainings remain clearly separate from peer conversation so parents can learn from clinicians without feeling supervised in community spaces.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-primary/15 bg-white px-3 py-2 text-[11px] font-semibold text-primary"><Clock3 className="h-3.5 w-3.5" aria-hidden /> Schedule not connected yet</span>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {trainingSlots.map((slot) => (
            <article key={slot.title} className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-primary"><slot.icon className="h-5 w-5" aria-hidden /></span>
              <h3 className="mt-4 text-[15px] font-semibold text-brand-navy-800">{slot.title}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-brand-muted-700">{slot.description}</p>
              <p className="mt-4 text-[11px] font-semibold text-brand-muted-500">{slot.action}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50/65 px-4 py-3">
          <p className="text-[12.5px] leading-relaxed text-teal-950"><strong>How this will work:</strong> relevant trainings can appear beside a group, inside a moderator redirect, and in a standing calendar—without clinicians entering peer threads.</p>
        </div>
      </section>

      <section id="planned-groups" className="scroll-mt-24" aria-labelledby="groups-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="groups-heading" className="text-2xl font-semibold text-brand-navy-800">Planned moderated groups</h2>
            <p className="mt-1 text-[13px] text-brand-muted-600">Preview only. These are not accepting members yet.</p>
          </div>
          <Users className="h-7 w-7 text-brand-plum-500" aria-hidden />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {plannedGroups.map((group) => (
            <article key={group.title} className="rounded-[1.4rem] border border-surface-border bg-white p-5 shadow-soft sm:p-6">
              <span className="inline-flex rounded-full bg-brand-plum-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-brand-plum-700">{group.tag}</span>
              <h3 className="mt-4 text-xl font-semibold text-brand-navy-800">{group.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-brand-muted-700">{group.description}</p>
              <div className="mt-5 flex items-center gap-2 text-[11.5px] font-semibold text-brand-muted-500"><ShieldCheck className="h-4 w-4" aria-hidden /> Trained moderator required</div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-orange-100 bg-orange-50/55 p-5 sm:p-7" aria-labelledby="rules-heading">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-1 h-5 w-5 shrink-0 text-orange-700" aria-hidden />
          <div>
            <h2 id="rules-heading" className="text-xl font-semibold text-brand-navy-800">What will keep the community safe</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-700">These are working community rules, not approved policy yet.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-2.5 md:grid-cols-2">
          {communityRules.map((rule) => (
            <div key={rule} className="flex items-start gap-2.5 rounded-xl border border-orange-100 bg-white/80 px-4 py-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" aria-hidden />
              <p className="text-[12.5px] leading-relaxed text-brand-muted-700">{rule}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 sm:p-6" aria-labelledby="privacy-heading">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-brand-navy-700" aria-hidden />
          <div>
            <h2 id="privacy-heading" className="text-[17px] font-semibold text-brand-navy-800">Privacy, stated honestly</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-brand-muted-700">
              Community posts would stay inside Common Ground and would not be placed in a child’s clinical record or sent to admissions. Moderators would be able to read posts to keep the space safe. This would not carry the same confidentiality protections as therapy. If a child appears to be abused, neglected, or in immediate danger, staff may have a legal duty to act. Final wording, data handling, retention, and deletion rules require legal and HIPAA compliance approval before launch.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3" aria-label="Available support now">
        <Link href="/support/caregiver" className="group rounded-2xl border border-surface-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <HeartHandshake className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="mt-3 text-[15px] font-semibold text-brand-navy-800">Caregiver Toolkit</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-brand-muted-600">Private tools you can use now while Parent Connection is being prepared.</p>
          <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-primary">Open toolkit <ArrowRight className="h-3.5 w-3.5" /></span>
        </Link>
        <Link href="/support/resources" className="group rounded-2xl border border-surface-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <BookOpen className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="mt-3 text-[15px] font-semibold text-brand-navy-800">Resource Hub</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-brand-muted-600">Browse existing education and family-support resources.</p>
          <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-primary">Browse resources <ArrowRight className="h-3.5 w-3.5" /></span>
        </Link>
        <a href="tel:988" className="group rounded-2xl border border-rose-100 bg-rose-50/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <LifeBuoy className="h-5 w-5 text-rose-700" aria-hidden />
          <h2 className="mt-3 text-[15px] font-semibold text-rose-950">Crisis support</h2>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-rose-900/80">Parent Connection is not monitored as a crisis service. Call or text 988 for immediate crisis support.</p>
          <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-rose-700">Call 988 <ArrowRight className="h-3.5 w-3.5" /></span>
        </a>
      </section>

      <p className="text-[11.5px] leading-relaxed text-brand-muted-500">
        Parent Connection remains a preview. Real accounts, groups, matching, and messaging are not enabled. Governance language and workflows require Clinical Director, legal, and HIPAA compliance review before launch.
      </p>
    </main>
  );
}
