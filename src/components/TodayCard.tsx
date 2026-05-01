'use client';

import { forwardRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ExternalLink, Phone, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RecommendedAction } from '@/lib/getRecommendedAction';

type Props = {
  action: RecommendedAction;
  fallback?: ReactNode;
  /**
   * Called when the no-context "Start with two quick questions" action is
   * clicked (action.value === '#start-intake').
   */
  onStartIntake?: () => void;
  /**
   * Called when the calm action has no route (value === null). The home
   * page uses this to scroll to and focus the existing overwhelm card.
   * TODO (Phase 4): replaced by an in-place Calm Mode card.
   */
  onCalmFallback?: () => void;
  /** Fired when the disclosure opens — used for analytics, if any. */
  onFallbackOpen?: () => void;
  /** Fired when the action button is clicked — used for analytics, if any. */
  onActionClick?: () => void;
  className?: string;
  headingId?: string;
};

const TodayCard = forwardRef<HTMLHeadingElement, Props>(function TodayCard(
  {
    action,
    fallback,
    onStartIntake,
    onCalmFallback,
    onFallbackOpen,
    onActionClick,
    className,
    headingId = 'today-card-heading',
  },
  ref,
) {
  const [showFallback, setShowFallback] = useState(false);

  function toggleFallback() {
    setShowFallback((v) => {
      const next = !v;
      if (next) onFallbackOpen?.();
      return next;
    });
  }

  return (
    <div className={cn('w-full', className)}>
      <article className="-mx-6 border-y border-stone-200 bg-white px-6 py-7 shadow-sm sm:mx-0 sm:rounded-3xl sm:border sm:px-10 sm:py-9 sm:shadow-md">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-plum-600">
          For you, today
        </p>
        <h2
          ref={ref}
          id={headingId}
          tabIndex={-1}
          className="mt-2 text-xl font-bold leading-snug text-stone-900 outline-none sm:text-2xl"
        >
          {action.framing}
        </h2>

        <div className="mt-6">
          <ActionLink
            action={action}
            onStartIntake={onStartIntake}
            onCalmFallback={onCalmFallback}
            onActionClick={onActionClick}
          />
        </div>

        <p className="mt-5 text-xs italic leading-relaxed text-stone-500">
          {action.permissionLine}
        </p>
      </article>

      {fallback ? (
        <>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              aria-expanded={showFallback}
              aria-controls="today-card-fallback"
              onClick={toggleFallback}
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
        </>
      ) : null}
    </div>
  );
});

export default TodayCard;

type ActionLinkProps = {
  action: RecommendedAction;
  onStartIntake?: () => void;
  onCalmFallback?: () => void;
  onActionClick?: () => void;
};

function ActionLink({
  action,
  onStartIntake,
  onCalmFallback,
  onActionClick,
}: ActionLinkProps) {
  const base =
    'group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

  if (action.kind === 'phone' && action.value) {
    return (
      <a href={`tel:${action.value}`} className={base} onClick={onActionClick}>
        <Phone className="h-4 w-4" />
        {action.label}
      </a>
    );
  }

  if (action.kind === 'link' && action.value) {
    return (
      <a
        href={action.value}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
        onClick={onActionClick}
      >
        {action.label}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }

  if (action.kind === 'route') {
    if (action.value === '#start-intake') {
      return (
        <button
          type="button"
          onClick={() => {
            onActionClick?.();
            onStartIntake?.();
          }}
          className={base}
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      );
    }
    if (!action.value || action.value === '#') {
      // Defensive: getRecommendedAction marks not-yet-built routes as '#'.
      return (
        <button
          type="button"
          disabled
          className={cn(base, 'cursor-not-allowed opacity-60')}
          aria-disabled="true"
          title="Coming soon"
        >
          {action.label}
        </button>
      );
    }
    return (
      <Link href={action.value} className={base} onClick={onActionClick}>
        {action.label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    );
  }

  if (action.kind === 'calm') {
    if (action.value) {
      return (
        <Link href={action.value} className={base} onClick={onActionClick}>
          <Wind className="h-4 w-4" />
          {action.label}
        </Link>
      );
    }
    return (
      <button
        type="button"
        onClick={() => {
          onActionClick?.();
          onCalmFallback?.();
        }}
        className={base}
      >
        <Wind className="h-4 w-4" />
        {action.label}
      </button>
    );
  }

  return null;
}
