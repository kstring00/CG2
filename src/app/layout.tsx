import type { Metadata, Viewport } from 'next';
import './globals.css';
import ChatWidget from '@/components/ChatWidget';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  metadataBase: new URL('https://texasabacenterscg.com'),
  title: {
    default: 'Common Ground — Parent Navigation by Texas ABA Centers',
    template: '%s · Common Ground',
  },
  description:
    'A free, parent-facing navigation system from Texas ABA Centers. Clear next steps, local support, and real help for families on the autism journey — no sign-up required.',
  keywords: [
    'autism',
    'ABA therapy',
    'Texas ABA Centers',
    'parent navigation',
    'caregiver support',
    'autism resources Texas',
    'family support',
  ],
  applicationName: 'Common Ground',
  openGraph: {
    type: 'website',
    siteName: 'Common Ground',
    title: 'Common Ground — Parent Navigation by Texas ABA Centers',
    description:
      'Clear next steps, local support, and real help for Texas families on the autism journey. Free for every family.',
    url: 'https://texasabacenterscg.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Common Ground — Parent Navigation by Texas ABA Centers',
    description:
      'Clear next steps, local support, and real help for Texas families on the autism journey.',
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
        {children}
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
