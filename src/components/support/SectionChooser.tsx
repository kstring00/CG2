'use client';

/**
 * "What do you need?" section chooser, shared by the What Is ABA? and
 * Sibling Support guide pages.
 *
 * Desktop (md+): the cards behave as tabs — clicking one swaps the content
 * panel rendered below the grid (no page jump).
 * Mobile: the cards behave as an accordion — tapping a card expands that
 * section in place and collapses the others.
 *
 * Deep links are preserved: `#myths`, `#guilt`, etc. (including aliases for
 * merged sections) open the matching section on load and on hashchange, and
 * the URL hash is updated on every switch so links stay shareable.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { QuickIntroCard } from './GuideCards';

export interface ChooserSection {
  /** Anchor id — kept identical to the page's historical section ids. */
  id: string;
  /** Extra historical anchor ids that should resolve to this section. */
  aliases?: string[];
  label: string;
  description: string;
  /** Border + gradient background classes (QuickIntroCard). */
  cardClass: string;
  /** Label/arrow text color class (QuickIntroCard). */
  accentClass: string;
  content: React.ReactNode;
}

export function SectionChooser({
  ariaLabel,
  sections,
}: {
  ariaLabel: string;
  sections: ChooserSection[];
}) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);
  const [isMdUp, setIsMdUp] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isMdUpRef = useRef(true);

  const resolveHash = useCallback(
    (rawHash: string): string | null => {
      const hash = rawHash.replace(/^#/, '');
      if (!hash) return null;
      const match = sections.find(
        (s) => s.id === hash || s.aliases?.includes(hash),
      );
      return match?.id ?? null;
    },
    [sections],
  );

  /* Viewport mode + initial hash + hashchange listener (mount only). */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const syncViewport = () => {
      setIsMdUp(mq.matches);
      isMdUpRef.current = mq.matches;
    };
    syncViewport();
    mq.addEventListener('change', syncViewport);

    const fromHash = resolveHash(window.location.hash);
    if (fromHash) {
      setActiveId(fromHash);
      requestAnimationFrame(() => {
        containerRef.current?.scrollIntoView({ block: 'start' });
      });
    } else if (!mq.matches) {
      // Mobile starts fully collapsed so the page stays short.
      setActiveId(null);
    }

    const onHashChange = () => {
      const id = resolveHash(window.location.hash);
      if (id) setActiveId(id);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      mq.removeEventListener('change', syncViewport);
      window.removeEventListener('hashchange', onHashChange);
    };
    // Sections are static per page; run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (id: string, opts: { focusPanel?: boolean } = {}) => {
    const { focusPanel = true } = opts;
    const collapse = !isMdUpRef.current && activeId === id;
    const next = collapse ? null : id;
    setActiveId(next);
    const url = next
      ? `#${next}`
      : window.location.pathname + window.location.search;
    window.history.replaceState(null, '', url);
    if (next && focusPanel) {
      requestAnimationFrame(() => {
        panelRef.current?.focus({ preventScroll: true });
      });
    }
  };

  const onTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) => {
    let next: number;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (idx + 1) % sections.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (idx - 1 + sections.length) % sections.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = sections.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    tabRefs.current[next]?.focus();
    handleSelect(sections[next].id, { focusPanel: false });
  };

  /* ── Desktop: tabs ─────────────────────────────────────────── */
  if (isMdUp) {
    const desktopActiveId = activeId ?? sections[0]?.id ?? null;
    const desktopActive =
      sections.find((s) => s.id === desktopActiveId) ?? null;

    return (
      <div ref={containerRef} className="scroll-mt-24">
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {sections.map((s, i) => (
            <QuickIntroCard
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`tab-${s.id}`}
              role="tab"
              aria-selected={desktopActiveId === s.id}
              aria-controls={`panel-${s.id}`}
              tabIndex={desktopActiveId === s.id ? 0 : -1}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              onClick={() => handleSelect(s.id)}
              active={desktopActiveId === s.id}
              label={s.label}
              description={s.description}
              cardClass={s.cardClass}
              accentClass={s.accentClass}
            />
          ))}
        </div>
        {desktopActive && (
          <div
            ref={panelRef}
            key={desktopActive.id}
            role="tabpanel"
            id={`panel-${desktopActive.id}`}
            aria-labelledby={`tab-${desktopActive.id}`}
            tabIndex={-1}
            className="mt-6 focus:outline-none"
          >
            {desktopActive.content}
          </div>
        )}
      </div>
    );
  }

  /* ── Mobile: accordion ─────────────────────────────────────── */
  return (
    <div ref={containerRef} className="scroll-mt-24 space-y-3">
      {sections.map((s) => {
        const open = activeId === s.id;
        return (
          <div key={s.id}>
            <QuickIntroCard
              id={`tab-${s.id}`}
              aria-expanded={open}
              aria-controls={`panel-${s.id}`}
              onClick={() => handleSelect(s.id)}
              active={open}
              label={s.label}
              description={s.description}
              cardClass={s.cardClass}
              accentClass={s.accentClass}
              className="w-full"
            />
            <div className="toolbox-reveal grid" data-open={open ? 'true' : 'false'}>
              <div className="toolbox-reveal-inner min-h-0">
                <div
                  ref={open ? panelRef : undefined}
                  role="region"
                  id={`panel-${s.id}`}
                  aria-labelledby={`tab-${s.id}`}
                  tabIndex={-1}
                  className="toolbox-reveal-content px-0.5 pb-2 pt-4 focus:outline-none"
                >
                  {open && s.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
