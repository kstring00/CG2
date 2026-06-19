import Link from 'next/link';

export default function MarriageHero() {
  return (
    <section
      aria-labelledby="marriage-hero-heading"
      className="relative overflow-hidden bg-marriage-ink text-white"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 85% 15%, rgba(226,168,94,0.28) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 70% 0%, rgba(197,99,74,0.12) 0%, transparent 50%), linear-gradient(165deg, #1f1a26 0%, #2a2330 45%, #1f1a26 100%)',
        }}
      />
      <div
        aria-hidden
        className="marriage-lamp pointer-events-none absolute -right-8 top-6 h-48 w-48 rounded-full bg-marriage-amber/30 blur-3xl sm:right-12 sm:top-10 sm:h-64 sm:w-64"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-marriage-amber">
          <span className="h-px w-8 bg-marriage-amber/70" aria-hidden />
          For couples raising a child on the spectrum
        </p>

        <h1
          id="marriage-hero-heading"
          className="mt-6 max-w-4xl font-marriage-serif text-[clamp(2.45rem,6vw,4.1rem)] font-light leading-[1.08] tracking-tight text-white/95"
        >
          Some nights, the hardest part isn&apos;t the diagnosis. It&apos;s the{' '}
          <em className="font-normal italic text-marriage-amber">quiet</em> that grows between you.
        </h1>

        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/70 sm:text-lg">
          You learned to show up for your child with everything you have. This is the place to
          remember how to show up for each other — even when there&apos;s barely any time left.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="#tool"
            className="inline-flex rounded-full bg-marriage-amber px-6 py-3 text-[14px] font-semibold text-marriage-ink transition hover:bg-marriage-amber-deep"
          >
            Reconnect tonight
          </Link>
          <Link
            href="#truths"
            className="inline-flex text-[14px] font-semibold text-white/85 underline-offset-4 transition hover:text-white hover:underline"
          >
            Read what no one says out loud
          </Link>
        </div>
      </div>
    </section>
  );
}
