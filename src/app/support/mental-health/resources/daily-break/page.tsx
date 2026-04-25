import Link from 'next/link';

// STUB — real content for this needs editorial input (real family stories,
// scheduling research). Renders an honest placeholder.

export default function DailyBreakPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--cream, #F5EFE6)', fontFamily: 'var(--font-body, sans-serif)' }}
    >
      <div className="mx-auto max-w-lg px-5 py-10">
        <Link
          href="/support/mental-health"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-muted-500 hover:text-brand-muted-800 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Command Center
        </Link>

        <header className="mb-8">
          <h1
            className="text-2xl font-semibold leading-snug text-brand-muted-900 mb-2"
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            Protecting one 15-minute window
          </h1>
          <p className="text-sm leading-relaxed text-brand-muted-600">
            A short, predictable break each day raises your floor more than any single big self-care moment. Same time, same place if possible.
          </p>
        </header>

        <div
          className="rounded-2xl border-2 p-6 mb-6"
          style={{ borderColor: 'var(--gold-soft, #E8D9B0)', background: 'var(--gold-tint, #F4ECD5)' }}
        >
          <p className="text-sm font-semibold text-brand-muted-900 mb-2">
            We&apos;re building this.
          </p>
          <p className="text-sm leading-relaxed text-brand-muted-700">
            This page will have real stories from ABA families about when and how they protect a daily window —
            what works, what failed, and what actually stuck. That content is in development.
          </p>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: 'var(--line, #E5DBC9)', background: 'var(--paper, #FBF7EF)' }}
        >
          <p className="text-sm font-semibold text-brand-muted-900 mb-4">In the meantime, here&apos;s the idea:</p>
          <div className="space-y-4">
            {[
              {
                heading: 'Pick a time that already exists.',
                body: 'Not a new slot — an existing seam in the day. The 10 minutes in the car before you go inside. The first cup of coffee before anyone else is up. The parking lot after drop-off.',
              },
              {
                heading: 'Make it non-negotiable, not aspirational.',
                body: 'Aspirational breaks get cancelled. Non-negotiable ones are in the calendar like therapy appointments — they move only for genuine emergencies.',
              },
              {
                heading: 'It doesn\'t have to feel like self-care.',
                body: 'Sitting in silence counts. Staring out a window counts. You don\'t have to meditate or journal or do anything. You just have to stop doing the other thing for 15 minutes.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white mt-0.5"
                  style={{ background: 'var(--sage-deep, #4F6249)' }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-brand-muted-900">{item.heading}</p>
                  <p className="text-sm text-brand-muted-600 mt-0.5">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-brand-muted-400">
          The research is clear: consistency beats duration. 15 minutes every day beats 2 hours once a month.
        </p>
      </div>
    </div>
  );
}
