import type { Metadata } from 'next';
import './globals.css';
import ChatWidget from '@/components/ChatWidget';
import CrisisBar from '@/components/layout/CrisisBar';

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
      <body className="min-h-screen bg-surface font-body antialiased">
        <CrisisBar />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
