import AdmissionsHandoff from '@/components/AdmissionsHandoff';
import CrisisPill from '@/components/CrisisPill';

export default function HomeBaseHumanFooter() {
  return (
    <section
      aria-label="Talk to a person"
      className="rounded-[1.75rem] border border-surface-border/70 bg-gradient-to-br from-white to-surface-muted/20 p-6 sm:p-8"
    >
      <h2 className="text-lg font-semibold text-brand-navy-700 sm:text-xl">
        We&rsquo;re here when you&rsquo;re ready
      </h2>
      <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-brand-muted-600">
        A free consultation with admissions — or crisis support if today feels unsafe.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
        <div className="flex flex-1 items-center rounded-2xl border border-surface-border bg-white px-4 py-3 shadow-soft sm:min-w-[280px]">
          <AdmissionsHandoff />
        </div>
        <div className="flex items-center sm:items-stretch">
          <CrisisPill className="[&>button]:px-4 [&>button]:py-3 [&>button]:text-sm" />
        </div>
      </div>
    </section>
  );
}
