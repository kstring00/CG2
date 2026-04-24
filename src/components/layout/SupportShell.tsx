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
  ChevronDown,
  Phone,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SupportDirectory } from '@/components/layout/SupportDirectory';

/**
 * SupportShell — redesigned sidebar.
 *
 * Groups are now accordion rows: icon + bold label + chevron toggle.
 * Each group expands to show bullet sub-items. The active sub-item
 * gets a primary left-rail accent, bold text, and a tinted background.
 * Matches the reference design (image.jpg) — minus the dark top header.
 */

interface NavItem {
  href: string;
  label: string;
  icon?: React.ElementType;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navGroups: NavGroup[] = [
  {
    label: 'Care Navigation',
    icon: Compass,
    defaultOpen: true,
    items: [
      { href: '/support/next-steps', label: 'Guided Next Steps' },
      { href: '/support/what-is-aba', label: 'What Is ABA?' },
      { href: '/support/resources', label: 'Resource Library' },
      { href: '/support/find', label: 'Find Support' },
      { href: '/support/connect', label: 'Connect' },
    ],
  },
  {
    label: 'Support for You',
    icon: HeartHandshake,
    defaultOpen: true,
    items: [
      { href: '/support/caregiver', label: 'Your Mental Health' },
      { href: '/support/caregiver/identity', label: 'Caregiver Identity' },
      { href: '/support/sleep', label: 'Sleep & Rest' },
      { href: '/support/couples', label: 'Couples Support' },
      { href: '/support/financial', label: 'Financial Resources' },
      { href: '/support/hard-days', label: 'Hard Days & Crisis' },
    ],
  },
  {
    label: 'Your Family',
    icon: Users,
    defaultOpen: true,
    items: [
      { href: '/support/siblings', label: 'Sibling Support' },
    ],
  },
];

/* ─── Accordion group ────────────────────────────────────────────────────── */

function NavGroup({
  group,
  pathname,
  closeSidebar,
}: {
  group: NavGroup;
  pathname: string;
  closeSidebar: () => void;
}) {
  const isAnyActive = group.items.some(
    (item) =>
      pathname === item.href ||
      (item.href !== '/support' && pathname.startsWith(item.href))
  );

  const [open, setOpen] = useState(group.defaultOpen ?? isAnyActive);

  return (
    <div className="mb-1">
      {/* Group header row — clickable to expand/collapse */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-subtle"
      >
        {/* Icon circle */}
        <span className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
          isAnyActive ? 'bg-primary/10' : 'bg-surface-subtle'
        )}>
          <group.icon className={cn('h-4 w-4', isAnyActive ? 'text-primary' : 'text-brand-muted-400')} />
        </span>
        <span className={cn(
          'flex-1 text-left text-[13.5px] font-bold',
          isAnyActive ? 'text-brand-muted-900' : 'text-brand-muted-700'
        )}>
          {group.label}
        </span>
        <ChevronDown className={cn(
          'h-4 w-4 shrink-0 text-brand-muted-300 transition-transform duration-200',
          open ? 'rotate-180' : ''
        )} />
      </button>

      {/* Sub-items */}
      <div className={cn(
        'overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <ul className="mb-1 ml-[42px] mt-0.5 flex list-none flex-col gap-0 p-0 pr-2">
          {group.items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/support' && pathname.startsWith(item.href));

            return (
              <li key={item.href} className="relative">
                {/* Active left rail */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -left-3 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary"
                  />
                )}
                <a
                  href={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-all',
                    isActive
                      ? 'bg-primary/[0.07] font-semibold text-primary'
                      : 'font-medium text-brand-muted-600 hover:bg-surface-subtle hover:text-brand-muted-900'
                  )}
                >
                  {/* Bullet dot */}
                  <span className={cn(
                    'h-1.5 w-1.5 shrink-0 rounded-full transition-colors',
                    isActive ? 'bg-primary' : 'bg-brand-muted-300'
                  )} />
                  {item.label}
                </a>

                {/* Section jump nav — only on active page */}
                {isActive && <SupportDirectory isActive={true} />}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Divider between groups */}
      <div className="mx-3 mt-1 border-t border-surface-border/60" />
    </div>
  );
}

/* ─── Shell ──────────────────────────────────────────────────────────────── */

export function SupportShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div className="border-b border-surface-border px-5 py-4">
        <Link href="/" aria-label="Common Ground home" className="block min-w-0">
          <Image
            src="/logos/cg2-lockup-final.png"
            alt="Texas ABA Centers | Common Ground"
            width={280}
            height={42}
            className="h-auto w-full max-w-[190px]"
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </div>

      {/* ── Section label + Home ───────────────────────────────────── */}
      <div className="px-5 pb-1 pt-4">
        <p className="text-[11px] font-bold text-brand-muted-900">Support</p>
        <p className="text-[11px] text-brand-muted-400">Resources for your journey</p>
      </div>

      {/* Home standalone link */}
      <div className="px-3 pb-2 pt-1">
        <a
          href="/support"
          onClick={() => setSidebarOpen(false)}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-bold transition-all',
            pathname === '/support'
              ? 'bg-primary/[0.07] text-primary'
              : 'text-brand-muted-700 hover:bg-surface-subtle hover:text-brand-muted-900'
          )}
        >
          <span className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            pathname === '/support' ? 'bg-primary/10' : 'bg-surface-subtle'
          )}>
            <LayoutDashboard className={cn('h-4 w-4', pathname === '/support' ? 'text-primary' : 'text-brand-muted-400')} />
          </span>
          Support Home
        </a>
        <div className="mx-3 mt-1 border-t border-surface-border/60" />
      </div>

      {/* ── Accordion nav groups ───────────────────────────────────── */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4" aria-label="Support navigation">
        {navGroups.map((group) => (
          <NavGroup
            key={group.label}
            group={group}
            pathname={pathname}
            closeSidebar={() => setSidebarOpen(false)}
          />
        ))}
      </nav>

      {/* ── Bottom: urgent help card ───────────────────────────────── */}
      <div className="border-t border-surface-border px-4 py-4 space-y-2">
        {/* Client portal */}
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

        {/* Need immediate support */}
        <div className="flex items-start gap-3 rounded-xl border border-surface-border bg-surface-subtle/60 px-3 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-4 w-4 text-primary" />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-brand-muted-900">Need immediate support?</p>
            <p className="text-[11px] text-brand-muted-500">We&apos;re here to help.</p>
            <Link
              href="/support/hard-days#sec-support-today"
              className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-primary hover:underline"
            >
              Contact Us <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f2f4f8' }}>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-surface-border bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
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

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top banner */}
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
