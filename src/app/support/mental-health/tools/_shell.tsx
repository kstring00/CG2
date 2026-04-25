import Link from 'next/link';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

/** Shared chrome for Command Center micro-tool pages. */
export function ToolShell({ title, description, children }: Props) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'var(--cream, #F5EFE6)',
        fontFamily: 'var(--font-body, sans-serif)',
      }}
    >
      <div className="mx-auto max-w-lg px-5 py-10">

        {/* Back link */}
        <Link
          href="/support/mental-health"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-muted-500 hover:text-brand-muted-800 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to Command Center
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1
            className="text-2xl font-semibold leading-snug text-brand-muted-900 mb-2"
            style={{ fontFamily: 'var(--font-display, serif)' }}
          >
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-brand-muted-600">{description}</p>
        </header>

        {/* Tool content */}
        {children}

      </div>
    </div>
  );
}
