import Link from 'next/link';

/**
 * Persistent site footer — replaces the top-of-page ReviewBanner with a
 * tiny "in review" pill for returning visitors who already dismissed
 * the first-visit modal.
 */
export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-surface-border/70 bg-white/60">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 text-[11px] text-brand-muted-500 sm:px-6 lg:px-8">
        <p className="text-brand-muted-500">
          &copy; {new Date().getFullYear()} Texas ABA Centers &middot; Common Ground
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link
            href="/about/in-review"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-amber-800 transition hover:bg-amber-100"
          >
            in review &middot; learn more
          </Link>
          <Link href="/privacy" className="hover:text-brand-muted-700">
            privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
