'use client';

type Props = {
  signs: string[];
};

/**
 * Renders the curated nervous-system lines. The selection logic lives in
 * lib/groundLevel/nervousSystemSigns.ts so this component stays presentational.
 *
 * The list is preceded by a one-line preamble. No bullets — just stanzas.
 */
export default function NervousSystemSigns({ signs }: Props) {
  if (signs.length === 0) return null;

  return (
    <section
      aria-label="what this might be doing to you"
      className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft sm:p-6"
    >
      <p className="text-[13.5px] leading-relaxed text-brand-muted-600">
        these are common when the load gets this high. they don&rsquo;t mean something is wrong with you. they mean you&rsquo;re paying attention.
      </p>
      <div className="mt-4 space-y-4">
        {signs.map((line, i) => (
          <p
            key={i}
            className="text-[15px] leading-relaxed text-brand-navy-800"
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
