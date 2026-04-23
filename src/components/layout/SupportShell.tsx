'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  HeartHandshake,
  Link2,
  Compass,
  Search,
  Menu,
  X,
  Compass as CompassIcon,
  Lock,
  ArrowRight,
  Moon,
  Heart,
  DollarSign,
  Users,
  AlertTriangle,
  User,
  HelpCircle,
} from 'lucide-react';
import { TexasAbaLogo } from '@/components/brand/TexasAbaLogo';
import { cn } from '@/lib/utils';

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
    label: 'Care Navigation',
    items: [
      { href: '/support', label: 'Home', icon: LayoutDashboard },
      { href: '/support/next-steps', label: 'Guided Next Steps', icon: Compass },
      { href: '/support/what-is-aba', label: 'What Is ABA?', icon: HelpCircle },
      { href: '/support/resources', label: 'Resource Library', icon: BookOpen },
      { href: '/support/find', label: 'Find Support', icon: Search },
      { href: '/support/connect', label: 'Connect', icon: Link2 },
    ],
  },
  {
    label: 'Support for You',
    items: [
      { href: '/support/caregiver', label: 'Your Mental Health', icon: HeartHandshake, highlight: true },
      { href: '/support/caregiver/identity', label: 'Caregiver Identity', icon: User },
      { href: '/support/sleep', label: 'Sleep & Rest', icon: Moon },
      { href: '/support/couples', label: 'Couples Support', icon: Heart },
      { href: '/support/financial', label: 'Financial Resources', icon: DollarSign },
      { href: '/support/hard-days', label: 'Hard Days & Crisis', icon: AlertTriangle },
    ],
  },
  {
    label: 'Your Family',
    items: [
      { href: '/support/siblings', label: 'Sibling Support', icon: Users },
    ],
  },
];

export function SupportShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="border-b border-surface-border px-6 py-5">
        <Link href="/" aria-label="Common Ground home" className="block min-w-0 space-y-2">
          <TexasAbaLogo decorative className="h-8 w-auto" />
          <span className="block font-display text-sm font-bold leading-tight text-brand-muted-900">
            Common<span className="text-primary"> Ground</span>
          </span>
        </Link>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          <CompassIcon className="h-3 w-3" /> Care Navigation
        </span>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Care Navigation">
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
                      {isHighlight && !isActive && (
                        <span className="rounded-full bg-brand-plum-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-plum-700">You</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Cross-layer handoff — clearly labeled, visually distinct */}
        <div className="mt-6 border-t border-surface-border/60 pt-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
            Current Texas ABA client?
          </p>
          <Link
            href="/client"
            className="group flex items-center justify-between gap-3 rounded-xl border border-accent/25 bg-accent/5 px-3 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent/10"
          >
            <span className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Go to client portal
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </nav>

      <div className="border-t border-surface-border px-4 py-4">
        <div className="rounded-2xl border border-primary/15 bg-primary/5 px-3 py-3 text-center">
          <p className="text-xs font-semibold text-primary">
            Start with Guided Next Steps
          </p>
          <p className="mt-0.5 text-[11px] text-brand-muted-500">
            Keep the next move simple
          </p>
        </div>
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
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-surface-subtle"
        >
          <X className="h-5 w-5 text-brand-muted-500" />
        </button>
        <SidebarContent />
      </aside>

      <div className="flex-1 lg:ml-64">
        {/* Persistent mode banner — makes the layer unmistakable at all times */}
        <div className="border-b border-primary/15 bg-primary/5">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold text-primary">
              <CompassIcon className="h-3.5 w-3.5" />
              Care Navigation · open to every family
            </p>
            <Link
              href="/client"
              className="hidden text-[11px] font-semibold text-accent hover:underline sm:inline"
            >
              Current client? Sign in →
            </Link>
          </div>
        </div>

        <header className="sticky top-0 z-20 border-b border-surface-border/70 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 hover:bg-surface-subtle lg:hidden"
            >
              <Menu className="h-5 w-5 text-brand-muted-600" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-400">
                Common Ground · Care Navigation
              </p>
              <p className="truncate text-sm text-brand-muted-700">
                For every family
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
