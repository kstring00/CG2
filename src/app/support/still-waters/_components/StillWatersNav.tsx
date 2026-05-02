'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function StillWatersNav() {
  const pathname = usePathname() ?? '';
  const isHistory = pathname.startsWith('/support/still-waters/history');
  const isCrisis = pathname.startsWith('/support/still-waters/crisis');

  return (
    <div className="border-b border-slate-300/40 bg-white/40 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link
          href="/support"
          className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Parent Support
        </Link>
        <p
          className="text-[13px] font-medium text-slate-700"
          style={{ fontFamily: 'var(--font-still-waters-serif), Georgia, serif' }}
        >
          Still Waters
        </p>
        <div className="flex items-center gap-4 text-[12px]">
          <Link
            href="/support/still-waters"
            className={
              !isHistory && !isCrisis
                ? 'font-medium text-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }
          >
            Write
          </Link>
          <Link
            href="/support/still-waters/history"
            className={
              isHistory
                ? 'font-medium text-slate-900'
                : 'text-slate-600 hover:text-slate-900'
            }
          >
            Look back
          </Link>
        </div>
      </div>
    </div>
  );
}
