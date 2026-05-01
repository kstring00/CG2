'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ExternalLink, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TodayAction } from '@/lib/getRecommendedAction';

type Props = {
  framing: string;
  action: TodayAction;
  permissionLine: string;
  fallback?: ReactNode;
  className?: string;
};

export default function TodayCard({
  framing,
  action,
  permissionLine,
  fallback,
  className,
}: Props) {
  const [showFallback, setShowFallback] = useState(false);

  return (
    <div className={cn('w-full', className)}>
      <article className="-mx-6 border-y border-stone-200 bg-white px-6 py-7 shadow-sm sm:mx-0 sm:rounded-3xl sm:border sm:px-10 sm:py-9 sm:shadow-md">

        <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-plum-600">
          For you, today
        </p>
        <h2 className="mt-2 text-xl font-bold leading-snug text-stone-900 sm:text-2xl">
          {framing}
        </h2>

        <div className="mt-6">
          <ActionLink action={action} />
        </div>

        <p className="mt-5 text-xs italic leading-relaxed text-stone-500">
          {permissionLine}
        </p>
      </article>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          aria-expanded={showFallback}
          aria-controls="today-card-fallback"
          onClick={() => setShowFallback((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-stone-500 transition hover:text-stone-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {showFallback ? 'Hide other options' : 'Not this? Show me other options'}
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              showFallback && 'rotate-180',
            )}
          />
        </button>
      </div>

      {showFallback ? (
        <div id="today-card-fallback" className="mt-3">
          {fallback}
        </div>
      ) : null}
    </div>
  );
}

function ActionLink({ action }: { action: TodayAction }) {
  const base =
    'group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

  if (action.type === 'phone') {
    return (
      <a href={action.value} className={base}>
        <Phone className="h-4 w-4" />
        {action.label}
      </a>
    );
  }

  if (action.type === 'link') {
    return (
      <a
        href={action.value}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
      >
        {action.label}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <Link href={action.value} className={base}>
      {action.label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
