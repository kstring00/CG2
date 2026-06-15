import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ROUGH_DAY_SELF_CARE } from '@/lib/homeBaseDayCheck';

export default function HomeBaseRoughDayLead() {
  return (
    <section
      aria-label="Support for a rough day"
      className="rounded-[1.75rem] border border-brand-plum-200/80 bg-gradient-to-br from-brand-plum-50/95 to-white p-6 shadow-soft sm:p-8"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-plum-700">
        For you, first
      </p>
      <Link href={ROUGH_DAY_SELF_CARE.href} className="group mt-3 block max-w-2xl">
        <h2 className="text-2xl font-semibold leading-snug text-brand-navy-700 group-hover:text-brand-plum-800">
          {ROUGH_DAY_SELF_CARE.title}
          <ArrowRight className="ml-2 inline-block h-5 w-5 opacity-70 transition group-hover:translate-x-0.5" />
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-muted-700">
          {ROUGH_DAY_SELF_CARE.body}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-plum-700 px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-brand-plum-800">
          Open reset guide
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </section>
  );
}
