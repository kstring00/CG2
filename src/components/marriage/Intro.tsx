export default function MarriageIntro() {
  return (
    <section id="intro" aria-labelledby="marriage-intro-heading" className="bg-marriage-paper px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-marriage-pine-soft">
          You&apos;re not failing. You&apos;re tired.
        </p>
        <h2
          id="marriage-intro-heading"
          className="mt-4 font-marriage-serif text-[clamp(1.65rem,4vw,2.35rem)] font-medium leading-snug text-marriage-body"
        >
          When raising your child becomes everything, the marriage is usually the first thing to go
          quiet — not because the love left, but because there was no room left for it.
        </h2>
        <p className="mt-5 text-[16px] leading-relaxed text-marriage-muted sm:text-[17px]">
          That&apos;s not a character flaw. It&apos;s what carrying a heavy, beautiful, relentless
          load does to two people. Here are the things that actually happen, and a small, real way
          back to each other for each one.
        </p>
      </div>
    </section>
  );
}
