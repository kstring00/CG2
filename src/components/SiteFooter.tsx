'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import IndependenceNotice from '@/components/IndependenceNotice';
import { SITE_NAME } from '@/lib/siteMeta';

/**
 * Persistent site footer. Carries the independence notice so every page states
 * who publishes this site, and points urgent need at 988 rather than at any
 * clinic's intake line.
 */
export default function SiteFooter() {
  const pathname = usePathname();
  const sitsBesideSupportSidebar = pathname?.startsWith('/support') ?? false;

  return (
    <footer
      className={cn(
        'mt-auto border-t border-surface-border/70 bg-white/60',
        sitsBesideSupportSidebar && 'lg:ml-64',
      )}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 py-4 text-[11px] text-brand-muted-500 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-brand-muted-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
          <p className="text-[12px] text-brand-muted-600">
            Need help right now?{' '}
            <a
              href="tel:988"
              className="font-semibold text-primary underline-offset-2 transition hover:underline"
            >
              Call or text 988
            </a>
          </p>
          <IndependenceNotice className="max-w-xl" />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/privacy" className="hover:text-brand-muted-700">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
