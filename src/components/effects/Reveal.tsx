'use client';

import { useEffect } from 'react';

/**
 * Restrained scroll reveal: a 14px rise and fade, once, as elements enter view.
 *
 * Mount this once per page. Any element marked `data-reveal` below it animates
 * in. The hidden starting state is applied only after this component mounts
 * (via the `data-reveal-ready` flag on <html>), so content is never invisible
 * for a visitor without JS or where hydration fails.
 *
 * Honours prefers-reduced-motion in two ways: the CSS collapses the animation,
 * and we skip the observer entirely so nothing is ever left hidden.
 */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    if (nodes.length === 0) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => node.setAttribute('data-reveal', 'visible'));
      return;
    }

    root.setAttribute('data-reveal-ready', '');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-reveal', 'visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    nodes.forEach((node) => {
      // Anything already on screen at load reveals immediately — no flash.
      if (node.getBoundingClientRect().top < window.innerHeight) {
        node.setAttribute('data-reveal', 'visible');
      } else {
        observer.observe(node);
      }
    });

    return () => {
      observer.disconnect();
      root.removeAttribute('data-reveal-ready');
    };
  }, []);

  return null;
}
