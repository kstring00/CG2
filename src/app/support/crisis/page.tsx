import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, HeartHandshake, Phone, ShieldAlert, TriangleAlert } from 'lucide-react';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: "Crisis help",
  description:
    "If today is an emergency, start here. Crisis lines, urgent options, and what to do first.",
};


export default function CrisisSupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/support/at-home"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to at-home support
      </Link>

      <section className="mt-5 rounded-[1.75rem] border-2 border-rose-300 bg-rose-50 p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-8 w-8 shrink-0 text-rose-700" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rose-700">Crisis support</p>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-rose-950 sm:text-3xl">
              Focus on immediate safety.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-rose-900">
              This page does not generate a new behavior plan or crisis intervention. Use the child’s established safety or crisis plan and contact the appropriate support person when needed.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <SafetyCard
            number="1"
            title="Create space and reduce hazards"
            text="Move other people or nearby hazards away when you can do so safely. Prioritize distance and a safer environment over trying a new strategy in the moment."
          />
          <SafetyCard
            number="2"
            title="Use the established plan"
            text="Follow the safety, crisis, or behavior plan already provided by the child’s clinical team. Avoid introducing unfamiliar procedures during an active event."
          />
          <SafetyCard
            number="3"
            title="Get the right person involved"
            text="Contact the child’s parent, caregiver, BCBA, clinical team, or other designated support person according to the existing plan."
          />
          <SafetyCard
            number="4"
            title="Document after everyone is safe"
            text="Once the situation is stable, record the observable before-behavior-after details so the care team can review what happened."
          />
        </div>

        <div className="mt-6 rounded-2xl border border-rose-300 bg-white p-5">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
            <div>
              <h2 className="text-base font-bold text-rose-950">If there is immediate danger</h2>
              <p className="mt-1 text-sm leading-relaxed text-rose-900">
                If someone is in immediate danger or there is a medical emergency, contact local emergency services or follow your organization’s emergency procedure.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={`tel:${SITE.phone}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-navy-700 px-4 text-sm font-bold text-white hover:bg-brand-navy-800"
          >
            <Phone className="h-4 w-4" /> Talk to someone now
          </a>
          <Link
            href="/support/connect"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand-plum-200 bg-white px-4 text-sm font-bold text-brand-plum-800 hover:bg-brand-plum-50"
          >
            <HeartHandshake className="h-4 w-4" /> Find support
          </Link>
        </div>
      </section>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-brand-muted-600">
        Common Ground is a caregiver-support tool. It does not replace individualized clinical guidance, an existing behavior or safety plan, or emergency services.
      </p>
    </div>
  );
}

function SafetyCard({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-rose-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-800">
          {number}
        </span>
        <div>
          <h2 className="text-sm font-bold text-brand-navy-700">{title}</h2>
          <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-700">{text}</p>
        </div>
      </div>
    </article>
  );
}
