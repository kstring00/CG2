import Link from 'next/link';
import { Heart, ShieldAlert } from 'lucide-react';
import { EXTRA_SUPPORT_SIGNS } from '@/lib/marriage/content';

export default function ExtraSupportSection() {
  return (
    <section
      id="extra-support"
      aria-labelledby="extra-support-heading"
      className="scroll-mt-6 rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50/80 via-brand-warm-50 to-white p-6 shadow-soft sm:p-8"
    >
      <div className="max-w-3xl">
        <h2 id="extra-support-heading" className="text-xl font-bold text-brand-navy-700 sm:text-2xl">
          When it&apos;s more than a rough patch
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-brand-muted-700">
          Some struggles need more support. You&apos;re not alone — and help works.
        </p>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2" role="list">
        {EXTRA_SUPPORT_SIGNS.map((sign) => (
          <li
            key={sign}
            className="flex items-start gap-3 rounded-2xl border border-surface-border bg-white/90 px-4 py-3.5 shadow-soft"
          >
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <ShieldAlert className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-[13px] leading-relaxed text-brand-muted-700">{sign}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-start gap-2 text-[14px] leading-relaxed text-brand-navy-700">
          <Heart className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum-600" aria-hidden />
          You deserve support that meets the depth of what you&apos;re carrying.
        </p>
        <Link href="/support/find" className="btn-accent shrink-0 px-5 py-2.5 text-sm">
          Find Counseling Support
        </Link>
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-brand-muted-500">
        Common Ground offers education and support resources, not emergency or clinical care. If you
        are in danger or experiencing abuse, seek immediate help from local emergency services or a
        trusted crisis resource.
      </p>
    </section>
  );
}
