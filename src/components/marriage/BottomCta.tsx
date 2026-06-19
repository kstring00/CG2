import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BottomCta() {
  return (
    <section
      aria-labelledby="bottom-cta-heading"
      className="relative overflow-hidden rounded-3xl bg-brand-navy-700 px-6 py-12 text-center shadow-card sm:px-10 sm:py-14"
    >
      <div
        className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl"
        aria-hidden
      />
      <h2 id="bottom-cta-heading" className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-white">
        Strong relationships are built in small moments.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/80">
        You don&apos;t have to do it alone. We&apos;re here for every season of your marriage.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/support/care-plan" className="btn-accent px-5 py-2.5 text-sm">
          Get Support
        </Link>
        <Link
          href="#resources"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 transition hover:text-white"
        >
          Explore Marriage Resources
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
