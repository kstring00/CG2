import Link from 'next/link';

// STUB — "Add them once and we'll surface them on hard days" requires
// app-level persistence that doesn't exist yet.

export default function SupportListPage() {
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
            Your two-person support list
          </h1>
          <p className="text-sm leading-relaxed text-brand-muted-600">
            When support drops, you don&apos;t need a village — just two people you can reach without explaining the backstory.
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
            The full version will let you save your two people once and surface them automatically on hard days.
            That feature is in development and needs your CG account to store it securely.
          </p>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{ borderColor: 'var(--line, #E5DBC9)', background: 'var(--paper, #FBF7EF)' }}
        >
          <p className="text-sm font-semibold text-brand-muted-900 mb-4">In the meantime:</p>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: 'var(--sage-deep, #4F6249)' }}
              >1</span>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">Name your two people right now.</p>
                <p className="text-sm text-brand-muted-600 mt-0.5">
                  Who picks up at odd hours? Who asks how you&apos;re doing and actually waits for the answer?
                  Write the names somewhere you can find them — a note on your phone, a sticky on your mirror.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: 'var(--sage-deep, #4F6249)' }}
              >2</span>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">Tell them.</p>
                <p className="text-sm text-brand-muted-600 mt-0.5">
                  Even a quick &ldquo;hey, I might reach out when things get hard — hope that&apos;s okay&rdquo; lowers
                  the bar dramatically when you actually need to.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <p className="mt-6 text-center text-xs text-brand-muted-400">
          Two people is enough. You don&apos;t need the village — just the two.
        </p>
      </div>
    </div>
  );
}
