'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Link2,
  Search,
  Menu,
  X,
  Compass as CompassIcon,
  Home,
  Lock,
  ArrowRight,
  Users,
  HelpCircle,
  HeartPulse,
  Wallet,
  Feather,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import CrisisPill from '@/components/CrisisPill';

/**
 * SupportShell — the layout for the public-facing Care Navigation experience.
 *
 * Visual language: warm palette (cream/navy), a primary-navy "Care Navigation"
 * chip, and a persistent rail reminder that this layer is open to every family
 * in Texas. Nothing here should imply clinical, personalized, or enrolled-client
 * content. If a link needs to go there, send users to /client to sign in first.
 */
const navGroups = [
  {
    label: 'Start Here',
    items: [
      { href: '/support', label: 'Home Base', icon: Home },
      { href: '/support/care-plan', label: 'My Care Plan', icon: CompassIcon, highlight: true },
      { href: '/support/caregiver', label: 'Parent Support', icon: HeartPulse, highlight: true },
      { href: '/support/still-waters', label: 'Still Waters', icon: Feather, highlight: true },
    ],
  },
  {
    label: 'Learn & Find Help',
    items: [
      { href: '/support/what-is-aba', label: 'What Is ABA?', icon: HelpCircle },
      { href: '/support/resources', label: 'Guides & Strategies', icon: BookOpen },
      { href: '/support/find', label: 'Find Local Help', icon: Search },
      { href: '/support/connect', label: 'Connect With Parents', icon: Link2 },
    ],
  },
  {
    label: 'Family Needs',
    items: [
      { href: '/support/financial', label: 'Financial Help', icon: Wallet },
      { href: '/support/siblings', label: 'Sibling Support', icon: Users },
    ],
  },
];

export function SupportShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isFindPage = pathname?.startsWith('/support/find') ?? false;

  const SidebarContent = () => (
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
        <Link
          href="/support/intake"
          onClick={() => setSidebarOpen(false)}
          aria-label="Help me find my next step — start the guided care plan"
          className="group flex w-full items-center justify-between gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          <span className="inline-flex items-center gap-2">
            <CompassIcon className="h-4 w-4" />
            Help Me Find My Next Step
          </span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Common Ground parent support navigation">
        {navGroups.map((group, gi) => (
          <div key={group.label} className={gi > 0 ? 'mt-5' : ''}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
              {group.label}
            </p>
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/support' && pathname.startsWith(item.href));
                const isHighlight = (item as { highlight?: boolean }).highlight;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary text-white shadow-soft'
                          : isHighlight
                          ? 'border border-brand-plum-200 bg-brand-plum-50 text-brand-plum-700 hover:bg-brand-plum-100'
                          : 'text-brand-muted-600 hover:bg-surface-subtle hover:text-brand-muted-900',
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-[13px]">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

      </nav>

      {/* Cross-layer handoff — visually separate so parents understand it is for current Texas ABA clients only */}
      <div className="border-t-2 border-accent/20 bg-accent/5 px-4 py-4">
        <p className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent/80">
          Texas ABA Families
        </p>
        <Link
          href="/client"
          aria-label="Go to client portal — for current Texas ABA clients"
          className="group flex items-center justify-between gap-3 rounded-xl border border-accent/30 bg-white px-3 py-2.5 text-sm font-semibold text-accent shadow-soft transition-all hover:bg-accent/10"
        >
          <span className="inline-flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Go to Client Portal
          </span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f2f4f8' }}>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-surface-border bg-white lg:flex">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex min-h-0 w-64 flex-col bg-white transition-transform duration-300 lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-surface-subtle"
        >
          <X className="h-5 w-5 text-brand-muted-500" />
        </button>
        <SidebarContent />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-64">
        {isFindPage && (
          <div
            className="sticky top-0 z-40 border-b border-red-700/40 bg-gradient-to-r from-red-700 via-red-600 to-orange-600 text-white shadow-md"
            role="region"
            aria-label="Crisis support"
          >
            <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 text-[12px] font-semibold sm:px-6 lg:px-8">
              <p className="inline-flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] uppercase tracking-wider">
                  Need help now?
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <a href="tel:988" className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 underline-offset-2 hover:bg-white/15 hover:underline">
                  <span aria-hidden>📞</span> Call 988
                </a>
                <a href="sms:988" className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 underline-offset-2 hover:bg-white/15 hover:underline">
                  <span aria-hidden>💬</span> Text 988
                </a>
                <a href="tel:+17139707000" className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 underline-offset-2 hover:bg-white/15 hover:underline">
                  <span aria-hidden>📞</span> Harris Center (713) 970-7000
                </a>
                <a href="tel:911" className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 underline-offset-2 hover:bg-white/15 hover:underline">
                  <span aria-hidden>🚨</span> Emergency 911
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Persistent mode banner — makes the layer unmistakable at all times */}
        <div className="border-b border-primary/15 bg-primary/5">
          <div className={cn('mx-auto flex w-full items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8', isFindPage ? 'max-w-[1600px]' : 'max-w-6xl')}>
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold text-primary">
              <CompassIcon className="h-3.5 w-3.5" />
              Parent Support · open to every family
            </p>
            <div className="flex items-center gap-3">
              <CrisisPill />
              <Link
                href="/client"
                className="hidden text-[11px] font-semibold text-accent hover:underline sm:inline"
              >
                Current client? Sign in →
              </Link>
            </div>
          </div>
        </div>

        {!isFindPage && (
          <header className="sticky top-0 z-20 border-b border-surface-border/70 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
                className="rounded-xl p-2 hover:bg-surface-subtle lg:hidden"
              >
                <Menu className="h-5 w-5 text-brand-muted-600" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-400">
                  Common Ground · Parent Support
                </p>
                <p className="truncate text-sm text-brand-muted-700">
                  For every family
                </p>
              </div>
            </div>
          </header>
        )}

        {isFindPage && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-3 top-[88px] z-30 rounded-xl bg-white p-2 shadow-soft hover:bg-surface-subtle lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-brand-muted-600" />
          </button>
        )}

        {isFindPage ? (
          <main className="flex-1">{children}</main>
        ) : (
          <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
        )}
      </div>
    </div>
  );
}
