import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { HERO_REASSURANCE } from '@/lib/homeBaseContent';
import {
  DAY_CHECK_BAD_DAY_PLAN_PERMISSION,
  DAY_CHECK_GOOD_DAY_PLAN_LEAD,
} from '@/lib/homeBaseDayCheck';

function StepLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (href.startsWith('http') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export type HomeBaseHeroVariant = 'prominent' | 'calm' | 'softened';

type Props = {
  step: { title: string; href: string; because?: string; why?: string };
  variant?: HomeBaseHeroVariant;
};

export default function HomeBaseHero({ step, variant = 'calm' }: Props) {
  const subtitle = step.because ?? step.why;
  const ctaLabel =
    step.href === '/support/care-plan' ? 'Open my plan' : 'Open guide';

  const isProminent = variant === 'prominent';
  const isSoftened = variant === 'softened';

  return (
    <section
      aria-label="Your next step"
      className={[
        'relative overflow-hidden rounded-[1.75rem] border transition',
        isSoftened
          ? 'border-surface-border/80 bg-white p-5 sm:p-6'
          : isProminent
            ? 'border-brand-plum-200/60 bg-gradient-to-br from-brand-plum-50 via-[#f7f2fb] to-white p-6 shadow-soft sm:p-8'
            : 'border-brand-plum-100/80 bg-gradient-to-br from-brand-plum-50/40 to-white p-5 shadow-soft sm:p-6',
      ].join(' ')}
    >
      {isProminent && (
        <div className="pointer-events-none absolute -bottom-6 -right-2 hidden opacity-90 sm:block">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-plum-100/80">
            <Phone className="h-12 w-12 text-brand-plum-400/90" strokeWidth={1.25} aria-hidden />
          </div>
        </div>
      )}

      {isSoftened && (
        <p className="mb-2 text-[12px] font-medium text-brand-muted-500">
          {DAY_CHECK_BAD_DAY_PLAN_PERMISSION}
        </p>
      )}

      <div className="relative max-w-2xl">
        {!isSoftened && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-plum-700">
            {isProminent ? DAY_CHECK_GOOD_DAY_PLAN_LEAD : 'Your plan'}
          </p>
        )}
        <h2
          className={[
            'mt-2 font-semibold leading-tight text-brand-navy-700',
            isSoftened ? 'text-xl' : isProminent ? 'text-2xl sm:text-[1.75rem]' : 'text-xl sm:text-2xl',
          ].join(' ')}
        >
          {step.title}
        </h2>
        {subtitle && (
          <p
            className={[
              'mt-3 leading-relaxed text-brand-muted-700',
              isSoftened ? 'text-[13px]' : 'text-[14px] sm:text-[15px]',
            ].join(' ')}
          >
            {subtitle}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <StepLink
            href={step.href}
            className={[
              'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-soft transition',
              isSoftened
                ? 'border border-surface-border bg-white text-brand-navy-700 hover:border-primary/30'
                : 'bg-primary text-white hover:bg-primary/90',
            ].join(' ')}
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </StepLink>
          <Link
            href="/support/care-plan"
            className="inline-flex items-center gap-1.5 rounded-xl border border-brand-plum-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-brand-plum-800 transition hover:bg-white"
          >
            View full plan
          </Link>
        </div>

        {!isSoftened && (
          <p className="mt-4 text-[13px] italic text-brand-plum-800/80">{HERO_REASSURANCE}</p>
        )}
      </div>
    </section>
  );
}
