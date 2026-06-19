'use client';

import { usePathname } from 'next/navigation';
import { SupportShell } from '@/components/layout/SupportShell';

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === '/support/couples') {
    return children;
  }
  return <SupportShell>{children}</SupportShell>;
}
