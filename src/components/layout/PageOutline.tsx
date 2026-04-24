'use client';

/**
 * PageOutline
 *
 * Renders a polished inline popdown beneath the active nav item in SupportShell.
 * When a nav link is active, a chevron button appears on the right. Clicking it
 * expands a smooth animated panel listing every h2/h3 on that page as jump-links.
 * An IntersectionObserver highlights the heading currently in the viewport.
 *
 * Usage (in SupportShell):
 *   <NavItem item={item} isActive={isActive} />
 *   — the component self-manages open/close and heading detection.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeadingEntry {
  id: string;
  text: string;
  level: number; // 2 or 3
}

interface PageOutlineDropdownProps {
  /** Whether the parent nav item is currently active */
  isActive: boolean;
}

export function PageOutlineDropdown({ isActive }: PageOutlineDropdownProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [headings, setHeadings] = useState<HeadingEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-close whenever the route changes
  useEffect(() => {
    setOpen(false);
    setHeadings([]);
    setActiveId(null);
  }, [pathname]);

  // Scan headings when the dropdown opens
  const scanHeadings = useCallback(() => {
    const main = document.querySelector('main');
    if (!main) return;

    const nodes = Array.from(main.querySelectorAll('h2, h3')) as HTMLElement[];
    if (nodes.length === 0) return;

    const entries: HeadingEntry[] = nodes.map((el, i) => {
      if (!el.id) el.id = `pg-outline-${i}`;
      return {
        id: el.id,
        text: el.textContent?.trim() ?? '',
        level: Number(el.tagName[1]),
      };
    });

    setHeadings(entries);

    // Set up scroll spy
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (obs) => {
        const visible = obs
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-8% 0px -72% 0px', threshold: [0, 0.25, 0.5] }
    );

    nodes.forEach((n) => observerRef.current!.observe(n));
  }, []);

  useEffect(() => {
    if (open) {
      // Small delay so the DOM is ready
      const t = setTimeout(scanHeadings, 80);
      return () => clearTimeout(t);
    } else {
      observerRef.current?.disconnect();
    }
  }, [open, scanHeadings]);

  // Don't render the toggle at all if not on this page
  if (!isActive) return null;

  const hasHeadings = headings.length > 0;

  return (
    <div className="mt-0.5">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Hide page sections' : 'Show page sections'}
        className={cn(
          'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-200',
          open
            ? 'bg-primary/8 text-primary'
            : 'text-brand-muted-400 hover:text-brand-muted-700 hover:bg-surface-subtle'
        )}
      >
        <span className="flex-1 text-left text-[11px] font-semibold uppercase tracking-[0.14em]">
          {open && hasHeadings ? 'On this page' : 'Sections'}
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-transform duration-300',
            open ? 'rotate-180 text-primary' : 'text-brand-muted-400'
          )}
        />
      </button>

      {/* Animated panel */}
      <div
        ref={panelRef}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {hasHeadings ? (
          <ul className="m-0 list-none p-0 pb-1 pt-0.5 pl-1">
            {headings.map((h) => {
              const isActiveHeading = activeId === h.id;
              return (
                <li key={h.id} className="relative">
                  {/* Left accent rail */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute left-[9px] top-0 bottom-0 w-px transition-colors duration-200',
                      isActiveHeading ? 'bg-primary' : 'bg-surface-border'
                    )}
                  />
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById(h.id)
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setActiveId(h.id);
                    }}
                    className={cn(
                      'relative flex items-start gap-2.5 rounded-md py-1.5 pr-2 text-[12px] leading-snug transition-all duration-150',
                      h.level === 3 ? 'pl-7' : 'pl-5',
                      isActiveHeading
                        ? 'font-semibold text-primary'
                        : 'font-medium text-brand-muted-500 hover:text-brand-muted-800'
                    )}
                  >
                    {/* Active dot */}
                    {isActiveHeading && (
                      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                    <span className={cn('flex-1', isActiveHeading && '-ml-[14px]')}>
                      {h.text}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-3 pb-2 pt-1 text-[11px] text-brand-muted-400 italic">
            Loading sections…
          </p>
        )}
      </div>
    </div>
  );
}
