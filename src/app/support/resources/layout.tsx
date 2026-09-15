import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Resource library",
  description:
    "Curated, parent-tested guides, worksheets, and explainers for every stage of the journey.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
