'use client';

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const ENTER_EASE = [0.22, 1, 0.36, 1] as const;
const EXIT_EASE = [0.4, 0, 1, 1] as const;

function isGuidedPath(pathname: string): boolean {
  return pathname === '/support/intake' || pathname.startsWith('/support/care-plan');
}

function isForwardChoice(
  pathname: string,
  currentSearch: Pick<URLSearchParams, 'get'>,
  destination: URL,
): boolean {
  if (pathname === '/support/intake') {
    return (
      destination.pathname === '/support/care-plan' &&
      destination.searchParams.has('team')
    );
  }

  if (pathname !== '/support/care-plan') return false;

  const branch = currentSearch.get('b');
  const row = currentSearch.get('r');
  if (row) return false;

  if (!branch) {
    return (
      (destination.pathname === '/support/care-plan' &&
        destination.searchParams.has('b')) ||
      destination.pathname === '/support/care-plan/crisis'
    );
  }

  return (
    destination.pathname === '/support/care-plan' &&
    destination.searchParams.has('r')
  );
}

function closestAnchor(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLAnchorElement>('a[href]');
}

function GuidedSupportTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const routeKey = `${pathname}?${searchParams.toString()}`;
  const guided = isGuidedPath(pathname);
  const [leavingRouteKey, setLeavingRouteKey] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState('');

  const navigationLockedRef = useRef(false);
  const selectedAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const dimmedAnchorsRef = useRef<HTMLAnchorElement[]>([]);
  const timersRef = useRef<number[]>([]);
  const previousRouteKeyRef = useRef(routeKey);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const clearChoiceState = useCallback(() => {
    const selected = selectedAnchorRef.current;
    if (selected) {
      selected.classList.remove('guided-flow-choice-confirming');
      selected.removeAttribute('aria-disabled');
      selected.removeAttribute('data-guided-selected');
    }

    dimmedAnchorsRef.current.forEach((anchor) => {
      anchor.classList.remove('guided-flow-choice-dimmed');
    });

    selectedAnchorRef.current = null;
    dimmedAnchorsRef.current = [];
  }, []);

  const applyChoiceState = useCallback(
    (selected: HTMLAnchorElement) => {
      clearChoiceState();

      selected.classList.add('guided-flow-choice-confirming');
      selected.setAttribute('aria-disabled', 'true');
      selected.setAttribute('data-guided-selected', 'true');
      selectedAnchorRef.current = selected;

      const group = selected.closest('section');
      if (!group) return;

      const siblings = Array.from(group.children).filter(
        (child): child is HTMLAnchorElement =>
          child instanceof HTMLAnchorElement && child !== selected,
      );

      siblings.forEach((anchor) => {
        anchor.classList.add('guided-flow-choice-dimmed');
      });
      dimmedAnchorsRef.current = siblings;
    },
    [clearChoiceState],
  );

  const destinationForAnchor = useCallback(
    (anchor: HTMLAnchorElement): URL | null => {
      try {
        const destination = new URL(anchor.href, window.location.href);
        if (destination.origin !== window.location.origin) return null;
        if (!isForwardChoice(pathname, searchParams, destination)) return null;
        return destination;
      } catch {
        return null;
      }
    },
    [pathname, searchParams],
  );

  const handlePointerOver = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!guided) return;
      const anchor = closestAnchor(event.target);
      if (!anchor) return;
      const destination = destinationForAnchor(anchor);
      if (!destination) return;
      router.prefetch(`${destination.pathname}${destination.search}`);
    },
    [destinationForAnchor, guided, router],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!guided || navigationLockedRef.current) return;
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = closestAnchor(event.target);
      if (!anchor || anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;

      const destination = destinationForAnchor(anchor);
      if (!destination) return;

      event.preventDefault();
      navigationLockedRef.current = true;
      router.prefetch(`${destination.pathname}${destination.search}`);

      const href = `${destination.pathname}${destination.search}${destination.hash}`;

      if (reduceMotion) {
        router.push(href);
        return;
      }

      applyChoiceState(anchor);
      setLiveMessage('Selection confirmed. Loading the next question.');
      clearTimers();

      timersRef.current.push(
        window.setTimeout(() => {
          setLeavingRouteKey(routeKey);
        }, 190),
      );
      timersRef.current.push(
        window.setTimeout(() => {
          router.push(href);
        }, 510),
      );
    },
    [
      applyChoiceState,
      clearTimers,
      destinationForAnchor,
      guided,
      reduceMotion,
      routeKey,
      router,
    ],
  );

  useEffect(() => {
    const routeChanged = previousRouteKeyRef.current !== routeKey;

    setLeavingRouteKey(null);
    setLiveMessage('');
    navigationLockedRef.current = false;
    clearTimers();
    clearChoiceState();

    if (routeChanged && guided && !reduceMotion) {
      const focusTimer = window.setTimeout(() => {
        const heading = document.querySelector<HTMLElement>(
          '[data-guided-flow-shell] main h1, [data-guided-flow-shell] h1',
        );
        if (!heading) return;
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }, 430);
      timersRef.current.push(focusTimer);
    }

    previousRouteKeyRef.current = routeKey;

    return () => {
      clearTimers();
    };
  }, [clearChoiceState, clearTimers, guided, reduceMotion, routeKey]);

  const leaving = leavingRouteKey === routeKey;

  const motionState = useMemo(() => {
    if (!guided || reduceMotion) {
      return {
        initial: false as const,
        animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
        transition: { duration: 0 },
      };
    }

    return {
      initial: { opacity: 0, x: 28, filter: 'blur(2px)' },
      animate: leaving
        ? { opacity: 0, x: -26, filter: 'blur(2px)' }
        : { opacity: 1, x: 0, filter: 'blur(0px)' },
      transition: leaving
        ? { duration: 0.28, ease: EXIT_EASE }
        : { duration: 0.42, ease: ENTER_EASE },
    };
  }, [guided, leaving, reduceMotion]);

  return (
    <>
      <motion.div
        key={routeKey}
        data-guided-flow-shell="true"
        initial={motionState.initial}
        animate={motionState.animate}
        transition={motionState.transition}
        aria-busy={leaving || undefined}
        onClickCapture={handleClick}
        onPointerOverCapture={handlePointerOver}
        style={{
          willChange: guided && !reduceMotion ? 'transform, opacity, filter' : undefined,
        }}
      >
        {children}
      </motion.div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>

      <style>{`
        .guided-flow-choice-confirming {
          position: relative;
          z-index: 2;
          transform: translateY(-7px) scale(0.985) !important;
          border-color: rgb(69 130 128 / 32%) !important;
          background: linear-gradient(110deg, rgb(239 249 247 / 98%), rgb(248 246 252 / 98%)) !important;
          box-shadow: 0 18px 42px rgb(26 46 82 / 14%) !important;
          transition:
            transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 180ms ease,
            border-color 180ms ease,
            box-shadow 260ms ease !important;
        }

        .guided-flow-choice-dimmed {
          opacity: 0.34 !important;
          transform: translateX(-5px) !important;
          transition:
            opacity 180ms ease,
            transform 240ms cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        .guided-flow-choice-confirming > span:first-child {
          position: relative;
          border-color: #1a2e52 !important;
          background: #1a2e52 !important;
          box-shadow: 0 0 0 5px rgb(69 130 128 / 12%);
          transform: scale(1.06);
          transition:
            transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 160ms ease,
            border-color 160ms ease,
            box-shadow 220ms ease !important;
        }

        .guided-flow-choice-confirming > span:first-child::after {
          content: '✓';
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          color: white;
          font-size: 12px;
          font-weight: 800;
          line-height: 1;
          animation: guided-choice-check 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes guided-choice-check {
          from {
            opacity: 0;
            transform: scale(0.4) rotate(-18deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .guided-flow-choice-confirming,
          .guided-flow-choice-dimmed,
          .guided-flow-choice-confirming > span:first-child,
          .guided-flow-choice-confirming > span:first-child::after {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }

        @media print {
          [data-guided-flow-shell] {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default function SupportTemplate({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={children}>
      <GuidedSupportTransition>{children}</GuidedSupportTransition>
    </Suspense>
  );
}
