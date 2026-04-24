'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  HeartHandshake,
  Compass,
  Search,
  Link2,
  BookOpen,
  Menu,
  X,
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
  Compass as CompassIcon,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/* ─── Nav data ───────────────────────────────────────────────────────────── */

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Care Navigation',
    icon: Compass,
    items: [
      { href: '/support/next-steps',  label: 'Guided Next Steps', icon: Compass      },
      { href: '/support/what-is-aba', label: 'What Is ABA?',       icon: HelpCircle   },
      { href: '/support/resources',   label: 'Resource Library',   icon: BookOpen     },
      { href: '/support/find',        label: 'Find Support',        icon: Search       },
      { href: '/support/connect',     label: 'Connect',             icon: Link2        },
    ],
  },
  {
    label: 'Support for You',
    icon: HeartHandshake,
    items: [
      { href: '/support/caregiver',          label: 'Your Mental Health',   icon: HeartHandshake },
      { href: '/support/caregiver/identity', label: 'Caregiver Identity',   icon: User           },
      { href: '/support/sleep',              label: 'Sleep & Rest',          icon: Moon           },
      { href: '/support/couples',            label: 'Couples Support',       icon: Heart          },
      { href: '/support/financial',          label: 'Financial Resources',   icon: DollarSign     },
      { href: '/support/hard-days',          label: 'Hard Days & Crisis',    icon: AlertTriangle  },
    ],
  },
  {
    label: 'Your Family',
    icon: Users,
    items: [
      { href: '/support/siblings', label: 'Sibling Support', icon: Users },
    ],
  },
];

/* ─── Accordion group component ─────────────────────────────────────────── */

function AccordionGroup({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate: () => void;
}) {
  const hasActiveChild = group.items.some(
    (item) =>
      pathname === item.href ||
      (item.href !== '/support' && pathname.startsWith(item.href))
  );

  const [open, setOpen] = useState(true);

  return (
    <div>
      {/* ── Group header ────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-surface-subtle"
      >
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-150',
            hasActiveChild ? 'bg-primary/10' : 'bg-surface-subtle group-hover:bg-white'
          )}
        >
          <group.icon
            className={cn(
              'h-[15px] w-[15px] transition-colors duration-150',
              hasActiveChild ? 'text-primary' : 'text-brand-muted-400 group-hover:text-brand-muted-600'
            )}
          />
        </span>

        <span
          className={cn(
            'flex-1 text-left text-[13px] font-bold leading-none tracking-[-0.01em]',
            hasActiveChild ? 'text-brand-muted-900' : 'text-brand-muted-600'
          )}
        >
          {group.label}
        </span>

        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-brand-muted-300 transition-transform duration-250',
            open ? 'rotate-180' : ''
          )}
        />
      </button>

      {/* ── Sub-items ───────────────────────────────────────────── */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <ul className="relative mb-2 ml-[38px] mt-0.5 list-none p-0 pr-2">
          {/* Continuous left rail line */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1 left-[-9px] top-1 w-px bg-surface-border"
          />

          {group.items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/support' && pathname.startsWith(item.href));

            return (
              <li key={item.href} className="relative">
                {/* Active rail highlight */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-[3px] left-[-9px] top-[3px] w-px rounded-full bg-primary"
                  />
                )}

                <a
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[12.5px] leading-snug transition-all duration-150',
                    isActive
                      ? 'bg-primary/[0.06] font-semibold text-primary'
                      : 'font-medium text-brand-muted-500 hover:bg-surface-subtle hover:text-brand-muted-800'
                  )}
                >
                  <span
                    className={cn(
                      'h-[5px] w-[5px] shrink-0 rounded-full transition-colors duration-150',
                      isActive ? 'bg-primary' : 'bg-brand-muted-300'
                    )}
                  />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ─── Shell ──────────────────────────────────────────────────────────────── */

export function SupportShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeDrawer = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-surface-border px-5 py-4">
        <Link href="/" aria-label="Common Ground home" className="block">
          <Image
            src="/logos/cg2-lockup-final.png"
            alt="Texas ABA Centers | Common Ground"
            width={280}
            height={42}
            className="h-auto w-full max-w-[180px]"
            style={{ objectFit: 'contain' }}
            priority
          />
        </Link>
      </div>

      {/* ── Section header ────────────────────────────────────────── */}
      <div className="shrink-0 px-5 pb-2 pt-4">
        <p className="text-[12px] font-bold text-brand-muted-900">Support</p>
        <p className="text-[11px] leading-snug text-brand-muted-400">
          Resources for your journey
        </p>
      </div>

      {/* ── Support Home ─────────────────────────────────────────── */}
      <div className="shrink-0 px-3 pb-1">
        <a
          href="/support"
          onClick={closeDrawer}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150',
            pathname === '/support'
              ? 'bg-primary/[0.06] text-primary'
              : 'text-brand-muted-600 hover:bg-surface-subtle hover:text-brand-muted-900'
          )}
        >
          <span
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
              pathname === '/support' ? 'bg-primary/10' : 'bg-surface-subtle'
            )}
          >
            <LayoutDashboard
              className={cn(
                'h-[15px] w-[15px]',
                pathname === '/support' ? 'text-primary' : 'text-brand-muted-400'
              )}
            />
          </span>
          <span className={cn(
            'text-[13px] font-bold leading-none tracking-[-0.01em]',
            pathname === '/support' ? 'text-primary' : 'text-brand-muted-600'
          )}>
            Support Home
          </span>
        </a>
      </div>

      {/* ── Thin divider ──────────────────────────────────────────── */}
      <div className="mx-4 mb-2 mt-1 shrink-0 border-t border-surface-border/70" />

      {/* ── Scrollable accordion nav ───────────────────────────────── */}
      <nav
        className="min-h-0 flex-1 overflow-y-auto px-3 pb-3"
        aria-label="Support navigation"
      >
        <div className="space-y-0.5">
          {NAV_GROUPS.map((group, i) => (
            <div key={group.label}>
              <AccordionGroup
                group={group}
                pathname={pathname}
                onNavigate={closeDrawer}
              />
              {i < NAV_GROUPS.length - 1 && (
                <div className="mx-3 border-t border-surface-border/50" />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="shrink-0 space-y-2 border-t border-surface-border px-4 py-4">

        {/* Client portal */}
        <Link
          href="/client"
          className="group flex w-full items-center justify-between gap-2 rounded-xl border border-accent/30 bg-accent/[0.04] px-3 py-2.5 transition-all duration-150 hover:bg-accent/[0.09]"
        >
          <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-accent">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            Go to client portal
          </span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>

        {/* Immediate support card */}
        <div className="flex items-start gap-3 rounded-xl border border-surface-border bg-surface-subtle/50 px-3 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-[15px] w-[15px] text-primary" />
          </span>
          <div>
            <p className="text-[12px] font-bold leading-tight text-brand-muted-900">
              Need immediate support?
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-brand-muted-400">
              We&apos;re here to help.
            </p>
            <Link
              href="/support/hard-days"
              className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-semibold text-primary hover:underline"
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
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[15.5rem] flex-col border-r border-surface-border bg-white shadow-[1px_0_0_0_#d4d8e3] lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[15.5rem] min-h-0 flex-col bg-white shadow-xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={closeDrawer}
          aria-label="Close navigation"
          className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-brand-muted-400 transition-colors hover:bg-surface-subtle hover:text-brand-muted-700"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Page content */}
      <div className="flex flex-1 flex-col lg:ml-[15.5rem]">

        {/* Care Navigation banner */}
        <div className="shrink-0 border-b border-primary/10 bg-primary/[0.04]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
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

        {/* Sticky topbar */}
        <header className="sticky top-0 z-20 shrink-0 border-b border-surface-border/70 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="rounded-xl p-2 text-brand-muted-500 transition-colors hover:bg-surface-subtle hover:text-brand-muted-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-muted-400">
                Common Ground · Care Navigation
              </p>
              <p className="truncate text-[13px] font-medium text-brand-muted-700">
                For every family
              </p>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>

      </div>
    </div>
  );
}
