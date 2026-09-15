import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import '@/content/carePlanReleaseOverrides';
import './globals.css';
import SiteFooter from '@/components/SiteFooter';
import Reveal from '@/components/effects/Reveal';
import { SITE } from '@/config/site';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: 'Common Ground — Parent Navigation for Autism Families',
    template: '%s · Common Ground',
  },
  description:
    'A free, parent-facing navigation system for families of children with autism. Clear next steps, local support, and real help on the autism journey — no sign-up required.',
  keywords: [
    'autism',
    'ABA therapy',
    'parent navigation',
    'caregiver support',
    'autism resources Texas',
    'family support',
  ],
  applicationName: 'Common Ground',
  openGraph: {
    type: 'website',
    siteName: 'Common Ground',
    title: 'Common Ground — Parent Navigation for Autism Families',
    description:
      'Clear next steps, local support, and real help for families on the autism journey. Free for every family.',
    url: SITE.domain,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Common Ground — Parent Navigation for Autism Families',
    description:
      'Clear next steps, local support, and real help for families on the autism journey.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a2e52',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-surface font-body antialiased">
        <a href="#main" className="skip-link">Skip to main content</a>
        <Reveal />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
