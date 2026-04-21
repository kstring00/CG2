'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Star,
  GraduationCap,
  MessageSquare,
  HeartHandshake,
  HelpCircle,
  Menu,
  X,
  Lock,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { TexasAbaLogo } from '@/components/brand/TexasAbaLogo';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/client/portal', label: 'Home', icon: LayoutDashboard },
  { href: '/client/care-plan', label: 'Current care plan', icon: ClipboardList },
  { href: '/client/progress', label: 'Growth & wins', icon: Star },
  { href: '/client/coaching', label: 'Practice at home', icon: GraduationCap },
  { href: '/client/concerns', label: 'Questions & concerns', icon: HelpCircle },
  { href: '/client/messages', label: 'Messages', icon: MessageSquare },
];

export function ClientShell({
  children,
  clientName = 'Rivera family',
}: {
  children: React.ReactNode;
  clientName?: string;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="border-b border-accent/20 bg-gradient-to-b from-accent/5 to-transparent px-6 py-5">
        <Link href="/" aria-label="Common Ground home" className="block min-w-0 space-y-2">
          <TexasAbaLogo decorative className="h-8 w-auto" />
          <span className="block font-display text-sm font-bold leading-tight text-brand-muted-900">
            Common<span className="text-primary"> Ground</span>
          </span>
        </Link>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
          <Lock className="h-3 w-3" /> Client portal
        </span>
        <p className="mt-3 text-xs text-brand-muted-500">
          Signed in as <span className="font-semibold text-brand-muted-900">{clientName}</span>
        </p>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-label="Client portal">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
          Your care
        </p>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== '/client');
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-accent text-white shadow-soft'
                      : 'text-brand-muted-600 hover:bg-surface-subtle hover:text-brand-muted-900',
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Cross-layer links */}
        <div className="mt-6 border-t border-surface-border/60 pt-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
            Also here for you
          </p>
          <Link
            href="/support/caregiver"
            className="group mb-1 flex items-center justify-between gap-3 rounded-xl border border-brand-plum-100 bg-brand-plum-50/60 px-3 py-2.5 text-sm font-semibold text-brand-plum-700 transition-all hover:bg-brand-plum-100"
          >
            <span className="inline-flex items-center gap-2">
              <HeartHandshake className="h-4 w-4" /> Support for you
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/support"
            className="group flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/10"
          >
            <span>Care Navigation</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </nav>

      <div className="border-t border-surface-border px-4 py-4">
        <Link
          href="/client"
          className="inline-flex w-full items-center justify-center gap-2 text-[11px] font-semibold text-brand-muted-500 hover:text-brand-muted-900"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white via-surface-muted to-surface-muted">
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
        <div className="border-b border-accent/25 bg-accent/5">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold text-accent">
              <Lock className="h-3.5 w-3.5" />
              Client portal · personal to your family · HIPAA-protected
            </p>
            <Link
              href="/support"
              className="hidden text-[11px] font-semibold text-primary hover:underline sm:inline"
            >
              Care Navigation →
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
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                Client Portal · {clientName}
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
