'use client';

type Props = {
  text: string;
};

/**
 * The mirror paragraph. Soft card, generous padding, no header.
 * Let the words be the design.
 */
export default function MirrorParagraph({ text }: Props) {
  return (
    <section
      aria-label="ground level mirror"
      className="rounded-2xl bg-brand-warm-100 p-6 sm:p-8"
    >
      <p
        className="text-brand-navy-800"
        style={{ fontSize: 18, lineHeight: 1.6 }}
      >
        {text}
      </p>
    </section>
  );
}
