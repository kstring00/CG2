import HomeBaseActivityTracker from '@/components/homeBase/HomeBaseActivityTracker';
import { SupportShell } from '@/components/layout/SupportShell';

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupportShell>
      <HomeBaseActivityTracker />
      {children}
    </SupportShell>
  );
}
