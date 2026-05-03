import type { Metadata } from 'next';
import './globals.css';
import ChatWidget from '@/components/ChatWidget';
import CrisisButton from '@/components/CrisisButton';
import FirstVisitReviewNotice from '@/components/FirstVisitReviewNotice';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Common Ground — Parent Navigation System',
  description:
    'A parent navigation system that guides families from diagnosis to independence through structured next steps, support, realistic timelines, and community.',
  keywords: ['autism', 'parent navigation system', 'caregiver support', 'next steps', 'family support'],
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
        <CrisisButton />
        <FirstVisitReviewNotice />
        <ChatWidget />
      </body>
    </html>
  );
}
