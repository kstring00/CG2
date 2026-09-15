import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hard days",
  description:
    "For the days that are heavier than usual. Somewhere to land, and someone to call.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
