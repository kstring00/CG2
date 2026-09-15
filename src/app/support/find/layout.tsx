import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Find local resources",
  description:
    "Search verified providers and support services near you, filtered by insurance and waitlist.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
