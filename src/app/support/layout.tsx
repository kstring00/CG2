import type { Metadata } from 'next';
import HomeBaseActivityTracker from '@/components/homeBase/HomeBaseActivityTracker';
import { SupportShell } from '@/components/layout/SupportShell';

export const metadata: Metadata = {
  // `template` must be re-declared here, otherwise child segments under
  // /support lose the root layout's "%s · Common Ground" suffix.
  title: {
    default: 'Parent support · Common Ground',
    template: '%s · Common Ground',
  },
  description:
    "Free guides, tools, and local resources for families raising a child on the autism spectrum. No account needed.",
};


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
