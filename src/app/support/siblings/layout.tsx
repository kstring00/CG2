import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Siblings",
  description:
    "The brothers and sisters carry this too. How to support them without adding another job to your day.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
