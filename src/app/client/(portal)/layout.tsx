import { ClientShell } from '@/components/layout/ClientShell';

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientShell>{children}</ClientShell>;
}
