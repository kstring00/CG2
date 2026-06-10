'use client';

/**
 * Shared visual primitives for the Guides & Strategies page and other
 * long-form guide pages (e.g. What Is ABA?). Extracted from
 * /support/resources so the card language stays in one place.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Hero 3-up intro card ──────────────────────────────────────
   On /support/resources these toggle need filters (onClick);
   on guide pages they can anchor to sections (href). */
export function QuickIntroCard({
  label,
  description,
  cardClass,
  accentClass,
  href,
  onClick,
  active,
}: {
  label: string;
  description: string;
  /** Border + gradient background classes */
  cardClass: string;
  /** Text color class for the label + arrow */
  accentClass: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const className = cn(
    'group rounded-2xl border p-4 text-left shadow-soft transition duration-200',
    cardClass,
    active && 'ring-2 ring-primary/20',
  );
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className={cn('text-sm font-bold', accentClass)}>{label}</p>
        <ArrowRight
          className={cn(
            'h-4 w-4 shrink-0 transition group-hover:translate-x-0.5',
            accentClass,
          )}
        />
      </div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-brand-muted-600">
        {description}
      </p>
    </>
  );

  if (href) {
    return (
      <a href={href} className={cn(className, 'block')}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

/* ── Section heading: title + optional icon chip + meta line ── */
export function GuideSectionHeading({
  icon: Icon,
  title,
  meta,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  meta?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-primary/5 text-primary">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
        <h2 className="text-xl font-bold text-brand-navy-700">{title}</h2>
      </div>
      {meta && (
        <span className="shrink-0 text-[12px] font-medium text-brand-muted-500">
          {meta}
        </span>
      )}
    </div>
  );
}

/* ── Base guide card (featured-resource skin) ────────────────── */
export function GuideCard({
  as: Tag = 'article',
  className,
  children,
}: {
  as?: 'article' | 'div' | 'li';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag
      className={cn(
        'flex h-full flex-col rounded-2xl border border-surface-border bg-white p-4 shadow-soft transition duration-200 hover:border-brand-plum-100 hover:shadow-card sm:p-5',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ── Category/badge pill (top of card badge row) ─────────────── */
export function BadgePill({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Small metadata tag pill ─────────────────────────────────── */
export function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-brand-muted-500">
      {children}
    </span>
  );
}

/* ── Bottom callout band + action cards ──────────────────────── */
export function SupportCalloutBand({
  eyebrow,
  title,
  text,
  columns = 3,
  children,
}: {
  eyebrow?: string;
  title: string;
  text: string;
  columns?: 2 | 3;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 rounded-3xl border border-brand-plum-200 bg-gradient-to-br from-brand-plum-50 via-rose-50/40 to-white p-6 shadow-soft sm:p-8">
      {eyebrow && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-plum-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-bold text-brand-navy-700">{title}</h2>
      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-brand-muted-700">
        {text}
      </p>
      <div
        className={cn(
          'mt-5 grid gap-3',
          columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function SupportActionCard({
  href,
  icon: Icon,
  title,
  detail,
  crisis,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
  crisis?: boolean;
}) {
  const className = cn(
    'group flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-soft transition hover:shadow-card',
    crisis
      ? 'border-rose-200 hover:border-rose-300'
      : 'border-surface-border hover:border-brand-plum-200',
  );
  const inner = (
    <>
      <span
        className={cn(
          'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          crisis ? 'bg-rose-50 text-rose-600' : 'bg-brand-plum-50 text-brand-plum-600',
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-brand-navy-700">{title}</p>
        <p className="text-[12px] text-brand-muted-600">{detail}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-brand-muted-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </>
  );

  if (href.startsWith('tel:')) {
    return (
      <a href={href} className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
