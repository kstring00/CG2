import Link from 'next/link';
import { MarriageLogo, MarriageWordmark } from '@/components/marriage/Logo';

export default function MarriageFooter() {
  return (
    <footer className="bg-[#16121c] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/support/couples" className="inline-flex items-center gap-2.5">
          <MarriageLogo />
          <MarriageWordmark light />
        </Link>
        <p className="max-w-md text-[13px] leading-relaxed text-white/55">
          Support for every season of parenting — and the marriage carrying it.
        </p>
      </div>
    </footer>
  );
}
