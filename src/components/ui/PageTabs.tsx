'use client';

import { Children, KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface TabDef {
  key: string;
  label: string;
  /**
   * When true, the panel is only mounted while active.
   * Use for tabs containing heavy interactive elements
   * (BreathingOrb, live quizzes, animated charts).
   * When false (default), the panel stays in the DOM and is CSS-hidden
   * when inactive — preserving accordion/checkbox state across tab switches.
   */
  lazy?: boolean;
}

interface Props {
  tabs: TabDef[];
  children: ReactNode | ReactNode[];
}

export function PageTabs({ tabs, children }: Props) {
  const router = useRouter();
  const panels = Children.toArray(children);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Stable ref so the popstate listener never needs to be re-registered
  const tabsRef = useRef(tabs);

  // Default to first tab — safe to render on the server / during hydration
  const [activeKey, setActiveKey] = useState<string>(tabs[0].key);

  // Sync from URL on mount and on browser back/forward
  useEffect(() => {
    function sync() {
      const t = new URLSearchParams(window.location.search).get('tab');
      setActiveKey(tabsRef.current.find(({ key }) => key === t)?.key ?? tabsRef.current[0].key);
    }
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  function activate(key: string) {
    setActiveKey(key);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', key);
    router.replace(url.pathname + url.search, { scroll: false });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    const last = tabs.length - 1;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = idx === last ? 0 : idx + 1;
      btnRefs.current[next]?.focus();
      activate(tabs[next].key);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = idx === 0 ? last : idx - 1;
      btnRefs.current[prev]?.focus();
      activate(tabs[prev].key);
    } else if (e.key === 'Home') {
      e.preventDefault();
      btnRefs.current[0]?.focus();
      activate(tabs[0].key);
    } else if (e.key === 'End') {
      e.preventDefault();
      btnRefs.current[last]?.focus();
      activate(tabs[last].key);
    }
  }

  return (
    <div>
      {/* ── Tab bar ─────────────────────────────────────────────────────���─ */}
      {/* overflow-x-auto + scrollbar hiding = horizontal scroll on mobile  */}
      <div
        role="tablist"
        aria-label="Page sections"
        className="flex overflow-x-auto border-b border-surface-border mb-8"
        style={{ scrollbarWidth: 'none' }}
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              ref={(el) => { btnRefs.current[idx] = el; }}
              onClick={() => activate(tab.key)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={[
                'shrink-0 px-4 py-2.5 text-sm font-medium whitespace-nowrap',
                'border-b-2 -mb-px transition-colors',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-primary focus-visible:ring-offset-1',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-brand-muted-500 hover:text-brand-muted-700 hover:border-brand-muted-300',
              ].join(' ')}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab panels ──────────────────────────────────────────────────── */}
      {tabs.map((tab, idx) => {
        const isActive = tab.key === activeKey;
        const panel = panels[idx];

        if (tab.lazy) {
          // Only mount while active — prevents background animation / timer leaks
          return isActive ? (
            <div
              key={tab.key}
              role="tabpanel"
              id={`panel-${tab.key}`}
              aria-labelledby={`tab-${tab.key}`}
              className="space-y-8 md:space-y-10"
            >
              {panel}
            </div>
          ) : null;
        }

        // Text/accordion tabs: always in DOM, toggled with the HTML `hidden` attribute.
        // This preserves expanded-accordion state when the user switches away and returns.
        return (
          <div
            key={tab.key}
            role="tabpanel"
            id={`panel-${tab.key}`}
            aria-labelledby={`tab-${tab.key}`}
            className="space-y-8 md:space-y-10"
            hidden={!isActive}
          >
            {panel}
          </div>
        );
      })}
    </div>
  );
}
