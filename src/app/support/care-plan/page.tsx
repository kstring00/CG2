import Link from 'next/link';
import { ArrowRight, Compass, FileText, ShieldCheck } from 'lucide-react';

export default function FamilyCarePlanPage() {
  return (
    <div className="page-shell gap-6 sm:gap-8">
      <section className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          My Family Care Plan
        </p>
        <h1 className="mt-2 text-balance text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
          Your care plan has its own space.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-brand-muted-600">
          We are refining this experience so it gives parents clear, useful support without asking
          you to share sensitive client information or turning support into another assignment.
        </p>
      </section>

      <section className="rounded-3xl border border-primary/15 bg-gradient-to-br from-brand-plum-50/70 via-white to-brand-warm-50 p-6 shadow-soft sm:p-8">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-brand-navy-700">
              This section is being carefully updated
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted-600">
              The Family Care Plan will remain separate from Home Base. Until the revised version is
              approved, you can use the options below to continue with existing Common Ground support.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/support"
          className="group rounded-2xl border border-surface-border bg-white p-5 shadow-soft transition hover:border-primary/30"
        >
          <Compass className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-base font-semibold text-brand-navy-700">Return to Home Base</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-brand-muted-600">
            See your weekly overview, quick links, and current support options.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary">
            Open Home Base <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/support/intake"
          className="group rounded-2xl border border-surface-border bg-white p-5 shadow-soft transition hover:border-primary/30"
        >
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-base font-semibold text-brand-navy-700">Update My Next Step</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-brand-muted-600">
            Use the existing structured check-in to update what kind of support would help.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary">
            Update my next step <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          href="/support/resources"
          className="group rounded-2xl border border-surface-border bg-white p-5 shadow-soft transition hover:border-primary/30"
        >
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="mt-4 text-base font-semibold text-brand-navy-700">Browse Approved Resources</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-brand-muted-600">
            Explore existing Common Ground resources while the revised care plan is being reviewed.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary">
            Open Resource Hub <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>

      <section className="rounded-2xl border border-surface-border bg-white px-5 py-4 text-[12px] leading-relaxed text-brand-muted-500">
        Common Ground provides parent support and approved educational resources. It does not replace
        your child&apos;s clinical team, emergency services, medical care, or mental-health treatment.
      </section>
    </div>
  );
}
