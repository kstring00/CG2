'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordSupportVisit } from '@/lib/homeBaseActivity';

export default function HomeBaseActivityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordSupportVisit(pathname);
  }, [pathname]);

  return null;
}
