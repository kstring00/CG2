import Image from 'next/image';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export default function MarriageHero() {
  return (
    <section
      aria-labelledby="marriage-hero-heading"
      className="relative overflow-hidden rounded-3xl border border-surface-border shadow-card"
    >
      <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
        <Image
          src="/images/supporting_your_relationship_journey.png"
          alt="A couple holding hands at a table, looking toward their child playing outside — a quiet moment of connection amid parenting life."
          fill
          priority
          className="object-cover object-[center_35%]"
          sizes="(max-width: 1024px) 100vw, 1152px"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-navy-800/95 via-brand-navy-700/80 to-brand-navy-600/20"
          aria-hidden
        />
        <div className="relative flex min-h-[420px] flex-col justify-center px-6 py-12 sm:min-h-[480px] sm:px-10 sm:py-14 lg:min-h-[520px] lg:max-w-xl lg:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200/90">
            Marriage &amp; Relationships
          </p>
          <h1
            id="marriage-hero-heading"
            className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-white"
          >
            Take care of your marriage, too.
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/85 sm:text-[16px]">
            Parenting stress, diagnosis journeys, and daily demands can pull you apart. You don&apos;t
            have to navigate it alone. Start with one small step toward connection.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="#situations" className="btn-accent px-5 py-2.5 text-sm">
              Find Our Next Step
            </Link>
            <Link
              href="#reset"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy-700"
            >
              Start with a Quick Check-In
            </Link>
          </div>
          <p className="mt-5 inline-flex items-center gap-2 text-[12px] text-white/75">
            <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Private, practical, judgment-free support.
          </p>
        </div>
      </div>
    </section>
  );
}
