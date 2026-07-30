'use client';

import { cn } from '@/lib/utils';

export default function PrintButton({
  label,
  crisis = false,
}: {
  label: string;
  crisis?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={cn(
        'print:hidden inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy-500 focus-visible:ring-offset-2',
        crisis
          ? 'border border-brand-navy-200 bg-white text-brand-navy-700 hover:bg-brand-warm-50'
          : 'bg-brand-teal text-white hover:bg-brand-teal/90',
      )}
    >
      {label}
    </button>
  );
}
