import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NextStepButton({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/support/intake"
      onClick={onNavigate}
      aria-label="Find my next step"
      className="group flex w-full items-center justify-between gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
    >
      <span>Find my next step</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}
