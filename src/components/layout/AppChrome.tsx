'use client';

import { usePathname } from 'next/navigation';
import ChatWidget from '@/components/ChatWidget';
import SiteFooter from '@/components/SiteFooter';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarriageLanding = pathname === '/support/couples';

  return (
    <>
      {children}
      {!isMarriageLanding && <SiteFooter />}
      {!isMarriageLanding && <ChatWidget />}
    </>
  );
}
