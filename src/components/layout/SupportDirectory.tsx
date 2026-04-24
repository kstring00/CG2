'use client';

/**
 * SupportDirectory
 *
 * A clean inline "On this page" jump list that drops down beneath the
 * active nav item. No observers, no complexity — parents see every section
 * on the page and can click to jump there instantly.
 *
 * Keyed by pathname. Each entry maps to real id="" anchors on page headings.
 */

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Section map ────────────────────────────────────────────────────────── */

interface Section {
  id: string;
  label: string;
}

const PAGE_SECTIONS: Record<string, Section[]> = {
  '/support/what-is-aba': [
    { id: 'sec-definition',     label: 'What behavior analysts study' },
    { id: 'sec-real-session',   label: 'A real therapy session' },
    { id: 'sec-myths',          label: 'Myths & what's actually true' },
    { id: 'sec-green-flags',    label: 'How to know it's working' },
    { id: 'sec-questions',      label: 'Questions you can ask' },
    { id: 'sec-parent-research',label: 'Parent involvement & outcomes' },
    { id: 'sec-glossary',       label: 'ABA terms in plain English' },
  ],
  '/support/caregiver': [
    { id: 'sec-breathe',        label: 'Breathe first' },
    { id: 'sec-truth',          label: 'What nobody tells you' },
    { id: 'sec-empty',          label: 'Running on empty?' },
    { id: 'sec-tools',          label: 'Tools for hard moments' },
    { id: 'sec-other-side',     label: 'The other side of this' },
    { id: 'sec-find-therapist', label: 'How to find a therapist' },
  ],
  '/support/sleep': [
    { id: 'sec-why-disrupted',  label: 'Why sleep gets disrupted' },
    { id: 'sec-self-check',     label: 'Sleep quality self-check' },
    { id: 'sec-wind-down',      label: '10-min wind-down routine' },
    { id: 'sec-child-sleep',    label: "When your child's sleep affects yours" },
    { id: 'sec-myths',          label: 'Sleep myths keeping you stuck' },
  ],
  '/support/couples': [
    { id: 'sec-strain',         label: 'Why ABA strains relationships' },
    { id: 'sec-checkin',        label: 'The 10-minute check-in' },
    { id: 'sec-labor',          label: 'The invisible labor problem' },
    { id: 'sec-protect',        label: 'Protecting the relationship' },
    { id: 'sec-when-therapy',   label: 'When to seek couples therapy' },
    { id: 'sec-resources',      label: 'Resources for couples' },
  ],
  '/support/hard-days': [
    { id: 'sec-breathe',        label: 'Start here — breathe first' },
    { id: 'sec-right-now',      label: 'For right now' },
    { id: 'sec-not-bad-parent', label: "You're not a bad parent" },
    { id: 'sec-first-hour',     label: 'First hour after a breakdown' },
    { id: 'sec-repair',         label: 'The repair conversation' },
    { id: 'sec-what-not-to-do', label: 'What not to do' },
    { id: 'sec-signs',          label: 'Signs you need support' },
    { id: 'sec-support-today',  label: 'Get support today' },
  ],
  '/support/siblings': [
    { id: 'sec-stages',         label: 'What siblings need (by age)' },
    { id: 'sec-signs',          label: 'Signs a sibling is struggling' },
    { id: 'sec-guilt',          label: 'The guilt siblings feel' },
    { id: 'sec-one-on-one',     label: 'Dedicated 1:1 time' },
    { id: 'sec-resources',      label: 'Books & resources' },
    { id: 'sec-school',         label: 'Talking to teachers' },
  ],
  '/support/financial': [
    { id: 'sec-insurance',      label: 'Insurance — where to start' },
    { id: 'sec-insurance-prep', label: 'Before your next insurance call' },
    { id: 'sec-texas-programs', label: 'Texas assistance programs' },
    { id: 'sec-fmla',           label: 'Lost income & FMLA rights' },
    { id: 'sec-tax',            label: 'Tax deductions' },
  ],
};

/* ─── Component ─────────────────────────────────────────────────────────── */

export function SupportDirectory({ isActive }: { isActive: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close when navigating away
  useEffect(() => { setOpen(false); }, [pathname]);

  const sections = PAGE_SECTIONS[pathname];
  if (!isActive || !sections) return null;

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="mx-1 mb-1.5">
      {/* ── Toggle button ─────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all duration-200',
          open
            ? 'border-primary/25 bg-primary/[0.06] text-primary'
            : 'border-surface-border bg-surface-subtle/60 text-brand-muted-500 hover:bg-surface-subtle hover:text-brand-muted-800 hover:border-surface-border'
        )}
      >
        <BookOpen className={cn('h-3.5 w-3.5 shrink-0', open ? 'text-primary' : 'text-brand-muted-400')} />
        <span className="flex-1 text-[11.5px] font-semibold tracking-wide">
          Jump to section
        </span>
        <span className={cn(
          'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums transition-colors',
          open ? 'bg-primary/10 text-primary' : 'bg-surface-border text-brand-muted-400'
        )}>
          {sections.length}
        </span>
        <ChevronDown className={cn(
          'h-3.5 w-3.5 shrink-0 transition-transform duration-300',
          open ? 'rotate-180 text-primary' : 'text-brand-muted-300'
        )} />
      </button>

      {/* ── Dropdown panel ────────────────────────────────────── */}
      <div className={cn(
        'overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      )}>
        <div className="relative mt-1.5 rounded-xl border border-surface-border bg-white shadow-soft overflow-hidden">
          {/* Top accent bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-primary via-brand-plum-400 to-brand-purple-400" />

          <ul className="m-0 list-none p-1.5">
            {sections.map((section, i) => (
              <li key={section.id}>
                <button
                  onClick={() => jumpTo(section.id)}
                  className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150 hover:bg-primary/[0.05]"
                >
                  {/* Index number */}
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-surface-subtle text-[10px] font-bold tabular-nums text-brand-muted-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-[12.5px] font-medium leading-snug text-brand-muted-700 group-hover:text-primary transition-colors">
                    {section.label}
                  </span>
                  {/* Arrow */}
                  <svg className="h-3 w-3 shrink-0 text-brand-muted-300 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
