'use client';

import { Children, KeyboardEvent, ReactNode, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export interface TabDef {
  key: string;
  label: string;
  helperText?: string;
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

// Inner component reads useSearchParams.
// Next.js 15 requires a Suspense boundary around any component that calls
// useSearchParams in a statically-generated page. The boundary is satisfied
// here; useSearchParams does not actually suspend during SSR — it returns
// empty params at build time, so the static HTML always shows tab[0].
// Tab selection from the URL happens reactively after client hydration.
function PageTabsImpl({ tabs, children }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const panels = Children.toArray(children);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Derive active tab from URL — no useState needed, searchParams is reactive.
  // Falls back to the first tab for missing or unrecognised values.
  const rawTab = searchParams.get('tab');
  const activeKey = tabs.find(({ key }) => key === rawTab)?.key ?? tabs[0].key;

  function activate(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', key);
    router.replace(`?${params.toString()}`, { scroll: false });
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
      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
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
                'shrink-0 px-4 py-2 text-left',
                'border-b-2 -mb-px transition-colors',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-primary focus-visible:ring-offset-1',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-brand-muted-500 hover:text-brand-muted-700 hover:border-brand-muted-300',
              ].join(' ')}
            >
              <span className="block text-sm font-medium whitespace-nowrap">{tab.label}</span>
              {tab.helperText ? (
                <span className="block text-xs text-brand-muted-500 whitespace-nowrap">
                  {tab.helperText}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* ── Tab panels ───────────────────────────────────────────────────── */}
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
        // This preserves expanded-accordion and checkbox state across tab switches.
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

export function PageTabs(props: Props) {
  return (
    <Suspense>
      <PageTabsImpl {...props} />
    </Suspense>
  );
}
