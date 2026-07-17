import Link from 'next/link';

/**
 * Persistent site footer with a direct admissions handoff.
 */
export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-surface-border/70 bg-white/60">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 py-4 text-[11px] text-brand-muted-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-col gap-1.5">
          <p className="text-brand-muted-500">
            &copy; {new Date().getFullYear()} Texas ABA Centers &middot; Common Ground
          </p>
          <p className="text-[12px] text-brand-muted-600">
            Need help choosing your next step?{' '}
            <a
              href="tel:+18777715725"
              className="font-semibold text-primary underline-offset-2 transition hover:underline"
            >
              Talk to Admissions &mdash; (877) 771-5725
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link
            href="/about/in-review"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-amber-800 transition hover:bg-amber-100"
          >
            In Review &middot; Being built in the open
          </Link>
          <Link href="/privacy" className="hover:text-brand-muted-700">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
