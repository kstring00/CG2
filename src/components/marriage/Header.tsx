'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { headerNav } from '@/lib/marriage/content';
import { MarriageLogo, MarriageWordmark } from '@/components/marriage/Logo';

export default function MarriageHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-marriage-line bg-marriage-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/support/couples" className="inline-flex items-center gap-2.5">
          <MarriageLogo />
          <MarriageWordmark />
        </Link>

        <nav
          aria-label="Marriage section"
          className="hidden items-center gap-6 lg:flex"
        >
          {headerNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[13px] font-medium text-marriage-muted transition hover:text-marriage-body"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/support/caregiver"
            className="hidden rounded-full bg-marriage-pine px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-marriage-pine-soft sm:inline-flex"
          >
            Get Support
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="marriage-mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex rounded-lg p-2 text-marriage-body lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="marriage-mobile-nav"
          aria-label="Marriage section mobile"
          className="border-t border-marriage-line bg-marriage-paper px-4 py-4 lg:hidden"
        >
          <ul className="space-y-3">
            {headerNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block text-[15px] font-medium text-marriage-body"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/support/caregiver"
                className="inline-flex rounded-full bg-marriage-pine px-4 py-2 text-[13px] font-semibold text-white"
                onClick={() => setMenuOpen(false)}
              >
                Get Support
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
