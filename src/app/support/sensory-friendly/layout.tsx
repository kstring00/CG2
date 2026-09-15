import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sensory-friendly places",
  description:
    "Local places that actually work for sensory-sensitive kids \u2014 verified, with what to expect.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
