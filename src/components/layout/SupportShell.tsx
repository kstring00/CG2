'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Menu,
  X,
  Compass as CompassIcon,
  Home,
  Users,
  HelpCircle,
  HeartHandshake,
  HeartPulse,
  Wallet,
  Lightbulb,
} from 'lucide-react';
import Image from 'next/image';
import {
  AT_HOME_STRATEGIES_LABEL,
  MARRIAGE_RELATIONSHIPS_LABEL,
  RESOURCE_HUB_LABEL,
} from '@/lib/supportNavLabels';
import { cn } from '@/lib/utils';
import CrisisPill from '@/components/CrisisPill';
import NextStepButton from '@/components/layout/NextStepButton';

/**
 * SupportShell — the layout for the parent-facing Common Ground experience.
 * The full site is designed for Texas ABA Centers parents and caregivers.
 */
const navGroups = [
  {
    label: 'Start Here',
    items: [
      { href: '/support', label: 'Home Base', icon: Home },
      { href: '/support/care-plan', label: 'My Support Guide', icon: CompassIcon },
      { href: '/support/connect', label: 'Parent Connection', icon: Users },
    ],
  },
  {
    label: 'Support',
    items: [
      { href: '/support/caregiver', label: 'Mental Health Toolbox', icon: HeartPulse },
      { href: '/support/couples', label: MARRIAGE_RELATIONSHIPS_LABEL, icon: HeartHandshake },
    ],
  },
  {
    label: 'Learn',
    items: [
      { href: '/support/what-is-aba', label: 'What Is ABA?', icon: HelpCircle },
      { href: '/support/at-home', label: AT_HOME_STRATEGIES_LABEL, icon: Lightbulb },
      { href: '/support/resources', label: RESOURCE_HUB_LABEL, icon: BookOpen },
      { href: '/support/siblings', label: 'Sibling Support', icon: Users },
      { href: '/support/find', label: 'Find Local Help', icon: Search },
      { href: '/support/financial', label: 'Paying for Care', icon: Wallet },
    ],
  },
];

type SidebarInstance = 'desktop' | 'mobile';

type SidebarContentProps = {
  pathname: string;
  instance: SidebarInstance;
  reduceMotion: boolean;
  onNavigate: () => void;
};

function SidebarContent({ pathname, instance, reduceMotion, onNavigate }: SidebarContentProps) {
  function finishMobileNavigation() {
    if (instance !== 'mobile') return;
    if (reduceMotion) {
      onNavigate();
      return;
    }
    window.setTimeout(onNavigate, 130);
  }

  return (
    <>
      <div className="border-b border-surface-border px-6 py-5">
        <Link href="/" aria-label="Common Ground home" className="block min-w-0">
          <Image
            src="/logos/cg2-lockup-final.png"
            alt="Texas ABA Centers | Common Ground"
            width={280}
            height={42}
            className="h-auto w-full max-w-[200px]"
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </div>

      <div className="px-4 pt-4">
        <NextStepButton onNavigate={finishMobileNavigation} />
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Common Ground parent support navigation">
        {navGroups.map((group, gi) => (
          <div key={group.label} className={gi > 0 ? 'mt-5' : ''}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">{group.label}</p>
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {group.items.map((item) => {
                const isCurrent = pathname === item.href || (item.href !== '/support' && pathname.startsWith(item.href + '/'));

                return (
                  <li key={item.href} className="relative">
                    <motion.div whileTap={reduceMotion ? undefined : { scale: 0.985, x: 1 }} transition={{ duration: 0.1 }}>
                      <Link
                        href={item.href}
                        onClick={finishMobileNavigation}
                        aria-current={isCurrent ? 'page' : undefined}
                        className={cn(
                          'group/nav relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2 text-sm font-medium outline-none transition-colors duration-150',
                          'focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-1',
                          isCurrent ? 'text-brand-navy-800' : 'text-brand-muted-600 hover:bg-primary/[0.045] hover:text-brand-navy-800',
                        )}
                      >
                        {isCurrent && (
                          <motion.span
                            layoutId={`support-nav-active-${instance}`}
                            aria-hidden="true"
                            className="absolute inset-0 rounded-xl border border-primary/10 bg-gradient-to-r from-primary/[0.105] via-brand-plum-50/65 to-primary/[0.045] shadow-[0_8px_22px_rgba(26,46,82,0.07)]"
                            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 430, damping: 38, mass: 0.8 }}
                          />
                        )}

                        <span
                          aria-hidden="true"
                          className={cn(
                            'absolute left-1 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-all duration-200',
                            isCurrent ? 'scale-y-100 opacity-100' : 'scale-y-50 opacity-0 group-hover/nav:scale-y-75 group-hover/nav:opacity-45',
                          )}
                        />

                        <item.icon
                          className={cn(
                            'relative z-10 h-4 w-4 shrink-0 transition-all duration-200 group-hover/nav:translate-x-0.5',
                            isCurrent ? 'translate-x-0.5 text-brand-plum-700' : 'text-brand-muted-500 group-hover/nav:text-primary',
                          )}
                        />
                        <span className={cn('relative z-10 flex-1 text-[13px] transition-all duration-200 group-hover/nav:translate-x-0.5', isCurrent && 'translate-x-0.5 font-semibold')}>
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-surface-border px-4 py-3">
        <p className="px-1 text-[11px] leading-relaxed text-brand-muted-500">
          Saved privately on this device. Common Ground is parent support, not clinical care.
        </p>
      </div>
    </>
  );
}

export function SupportShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = Boolean(useReducedMotion());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isFindPage = pathname.startsWith('/support/find');

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f2f4f8' }}>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-surface-border bg-white lg:flex">
        <SidebarContent pathname={pathname} instance="desktop" reduceMotion={reduceMotion} onNavigate={() => undefined} />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="support-mobile-backdrop"
            className="fixed inset-0 z-40 bg-black/35 lg:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%', opacity: sidebarOpen ? 1 : reduceMotion ? 1 : 0.96 }}
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 390, damping: 40, mass: 0.9 }}
        className={cn('fixed inset-y-0 left-0 z-50 flex min-h-0 w-64 flex-col bg-white shadow-2xl lg:hidden', !sidebarOpen && 'pointer-events-none')}
        aria-hidden={!sidebarOpen}
      >
        <button onClick={() => setSidebarOpen(false)} aria-label="Close navigation" className="absolute right-4 top-4 rounded-lg p-1 transition hover:bg-surface-subtle active:scale-95">
          <X className="h-5 w-5 text-brand-muted-500" />
        </button>
        <SidebarContent pathname={pathname} instance="mobile" reduceMotion={reduceMotion} onNavigate={() => setSidebarOpen(false)} />
      </motion.aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-64" style={{ ['--find-sticky-top' as string]: '2.75rem' }}>
        {isFindPage && (
          <div className="sticky top-0 z-40 border-b border-surface-border bg-white text-brand-muted-700 shadow-sm lg:flex lg:h-[var(--find-sticky-top)] lg:items-center" role="region" aria-label="Crisis support">
            <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 text-[12px] font-semibold sm:px-6 lg:px-8">
              <p className="inline-flex items-center gap-2">
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-rose-700">Need help now?</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <a href="tel:988" className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 underline-offset-2 hover:text-rose-700 hover:underline"><span aria-hidden>📞</span> Call 988</a>
                <a href="sms:988" className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 underline-offset-2 hover:text-rose-700 hover:underline"><span aria-hidden>💬</span> Text 988</a>
                <a href="tel:+17139707000" className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 underline-offset-2 hover:text-rose-700 hover:underline"><span aria-hidden>📞</span> Harris Center (713) 970-7000</a>
                <a href="tel:911" className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 underline-offset-2 hover:text-rose-700 hover:underline"><span aria-hidden>🚨</span> Emergency 911</a>
              </div>
            </div>
          </div>
        )}

        <div className="border-b border-primary/15 bg-primary/5">
          <div className={cn('mx-auto flex w-full items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8', isFindPage ? 'max-w-[1600px]' : 'max-w-6xl')}>
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold text-primary">
              <CompassIcon className="h-3.5 w-3.5" />
              Texas ABA Centers · Parent Support
            </p>
            <CrisisPill />
          </div>
        </div>

        {!isFindPage && (
          <header className="sticky top-0 z-20 border-b border-surface-border/70 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <button onClick={() => setSidebarOpen(true)} aria-label="Open navigation" className="rounded-xl p-2 transition hover:bg-surface-subtle active:scale-95 lg:hidden">
                <Menu className="h-5 w-5 text-brand-muted-600" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-400">Common Ground · Parent Support</p>
                <p className="truncate text-sm text-brand-muted-700">For Texas ABA Centers families</p>
              </div>
            </div>
          </header>
        )}

        {isFindPage && (
          <button onClick={() => setSidebarOpen(true)} className="absolute left-3 top-[88px] z-30 rounded-xl bg-white p-2 shadow-soft transition hover:bg-surface-subtle active:scale-95 lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5 text-brand-muted-600" />
          </button>
        )}

        {isFindPage ? <main className="flex-1">{children}</main> : <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>}
      </div>
    </div>
  );
}
