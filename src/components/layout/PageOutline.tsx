'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeadingEntry {
  id: string;
  text: string;
  level: number;
}

/**
 * PageOutline — a Google Docs-style "On this page" panel.
 *
 * Scans the main content area for h2/h3 elements that have an id (or auto-assigns one),
 * then renders a sticky jump-link list. Highlights the currently-visible heading
 * using an IntersectionObserver. Hides itself when there are fewer than 2 headings.
 */
export function PageOutline() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<HeadingEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Give the page a tick to fully render before scanning
    const timer = setTimeout(() => {
      const mainEl = document.querySelector('main');
      if (!mainEl) return;

      const nodes = Array.from(mainEl.querySelectorAll('h2, h3'));
      if (nodes.length < 2) {
        setHeadings([]);
        return;
      }

      const entries: HeadingEntry[] = nodes.map((el, i) => {
        if (!el.id) {
          el.id = `outline-heading-${i}`;
        }
        return {
          id: el.id,
          text: el.textContent?.trim() ?? '',
          level: Number(el.tagName[1]),
        };
      });

      setHeadings(entries);

      // Set up intersection observer to track active heading
      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(
        (obs) => {
          const visible = obs.filter((e) => e.isIntersecting);
          if (visible.length > 0) {
            setActiveId(visible[0].target.id);
          }
        },
        { rootMargin: '-10% 0px -75% 0px', threshold: 0 }
      );

      nodes.forEach((node) => observerRef.current!.observe(node));
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, [pathname]);

  if (headings.length < 2) return null;

  return (
    <div className="mt-5 border-t border-surface-border/60 pt-4 px-3">
      <p className="flex items-center gap-1.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
        <AlignLeft className="h-3 w-3" />
        On this page
      </p>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setActiveId(h.id);
                }
              }}
              className={cn(
                'block rounded-lg py-1.5 text-[12px] font-medium transition-colors leading-snug',
                h.level === 3 ? 'pl-5' : 'pl-2',
                activeId === h.id
                  ? 'text-primary font-semibold'
                  : 'text-brand-muted-500 hover:text-brand-muted-800'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
