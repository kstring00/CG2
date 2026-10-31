import type { Metadata, Viewport } from 'next';
import '@/content/carePlanReleaseOverrides';
import './globals.css';
import SiteFooter from '@/components/SiteFooter';
import SiteStructuredData from '@/components/SiteStructuredData';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/siteMeta';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s · Common Ground',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'autism',
    'ABA therapy',
    'autism resources for parents',
    'parent navigation',
    'caregiver support',
    'free autism resources',
    'family support',
  ],
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-surface font-body antialiased">
        <SiteStructuredData />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
