import Link from 'next/link';

export default function MarriageClosing() {
  return (
    <section
      aria-labelledby="marriage-closing-heading"
      className="bg-marriage-ink px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="marriage-closing-heading"
          className="font-marriage-serif text-[clamp(1.75rem,4.5vw,2.6rem)] font-medium leading-snug text-white"
        >
          You learned to show up for your child. You can learn to show up for{' '}
          <em className="font-normal italic text-marriage-amber">each other</em> again.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed text-white/70">
          It doesn&apos;t start with a grand gesture or a free weekend you&apos;ll never get. It
          starts tonight. Ten minutes is enough to begin.
        </p>
        <Link
          href="#tool"
          className="mt-8 inline-flex rounded-full bg-marriage-amber px-6 py-3 text-[14px] font-semibold text-marriage-ink transition hover:bg-marriage-amber-deep"
        >
          Start with ten minutes
        </Link>
      </div>
    </section>
  );
}
