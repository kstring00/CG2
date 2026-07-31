'use client';

import { useCallback, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

const OPEN_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const CLOSE_EASE = 'cubic-bezier(0.4, 0, 1, 1)';

function closestSummary(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>('summary');
}

function accordionContent(summary: HTMLElement): HTMLElement | null {
  const content = summary.nextElementSibling;
  return content instanceof HTMLElement ? content : null;
}

function clearInlineStyles(content: HTMLElement) {
  content.style.removeProperty('height');
  content.style.removeProperty('opacity');
  content.style.removeProperty('overflow');
  content.style.removeProperty('transform');
  content.style.removeProperty('will-change');
}

function finishAccordion(details: HTMLDetailsElement, content: HTMLElement, open: boolean) {
  details.open = open;
  details.dataset.accordionAnimating = 'false';
  details.dataset.accordionState = open ? 'open' : 'closed';
  clearInlineStyles(content);
}

export default function CarePlanTemplate({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const summary = closestSummary(event.target);
      if (!summary) return;

      const details = summary.parentElement;
      if (!(details instanceof HTMLDetailsElement)) return;
      if (details.dataset.accordionAnimating === 'true') {
        event.preventDefault();
        return;
      }

      const content = accordionContent(summary);
      if (!content) return;

      event.preventDefault();
      const opening = !details.open;

      if (reduceMotion) {
        details.open = opening;
        details.dataset.accordionState = opening ? 'open' : 'closed';
        return;
      }

      details.dataset.accordionAnimating = 'true';
      details.dataset.accordionState = opening ? 'opening' : 'closing';
      content.getAnimations().forEach((animation) => animation.cancel());

      if (opening) {
        details.open = true;
        content.style.overflow = 'hidden';
        content.style.willChange = 'height, opacity, transform';
        const targetHeight = content.scrollHeight;

        const animation = content.animate(
          [
            { height: '0px', opacity: 0, transform: 'translateY(-8px)' },
            { height: `${targetHeight}px`, opacity: 1, transform: 'translateY(0)' },
          ],
          {
            duration: 360,
            easing: OPEN_EASE,
            fill: 'forwards',
          },
        );

        animation.finished
          .then(() => finishAccordion(details, content, true))
          .catch(() => finishAccordion(details, content, true));
        return;
      }

      content.style.overflow = 'hidden';
      content.style.willChange = 'height, opacity, transform';
      const startHeight = content.getBoundingClientRect().height;

      const animation = content.animate(
        [
          { height: `${startHeight}px`, opacity: 1, transform: 'translateY(0)' },
          { height: '0px', opacity: 0, transform: 'translateY(-6px)' },
        ],
        {
          duration: 280,
          easing: CLOSE_EASE,
          fill: 'forwards',
        },
      );

      animation.finished
        .then(() => finishAccordion(details, content, false))
        .catch(() => finishAccordion(details, content, false));
    },
    [reduceMotion],
  );

  return (
    <div data-care-plan-motion="true" onClickCapture={handleClick}>
      {children}

      <style>{`
        [data-care-plan-motion] details > summary {
          position: relative;
          isolation: isolate;
          transition:
            background-color 220ms ease,
            color 220ms ease;
        }

        [data-care-plan-motion] details > summary::before {
          content: '';
          position: absolute;
          inset: 7px 10px;
          z-index: -1;
          border-radius: 12px;
          background: linear-gradient(105deg, rgb(239 249 247 / 82%), rgb(248 246 252 / 76%));
          opacity: 0;
          transform: scale(0.985);
          transition:
            opacity 260ms ease,
            transform 320ms ${OPEN_EASE};
        }

        [data-care-plan-motion] details[open] > summary::before,
        [data-care-plan-motion] details[data-accordion-state='opening'] > summary::before {
          opacity: 1;
          transform: scale(1);
        }

        [data-care-plan-motion] details[data-accordion-state='closing'] > summary > span:last-child {
          transform: rotate(0deg) !important;
        }

        [data-care-plan-motion] details[open] > summary > span:last-child,
        [data-care-plan-motion] details[data-accordion-state='opening'] > summary > span:last-child {
          color: #1a2e52;
        }

        [data-care-plan-motion] details > summary:active {
          transform: scale(0.995);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-care-plan-motion] details > summary,
          [data-care-plan-motion] details > summary::before,
          [data-care-plan-motion] details > summary > span:last-child {
            transition: none !important;
            transform: none !important;
          }
        }

        @media print {
          [data-care-plan-motion] details > summary::before {
            display: none !important;
          }

          [data-care-plan-motion] details > * {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
