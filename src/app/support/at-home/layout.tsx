import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Strategies at home",
  description:
    "Practical, BCBA-reviewed strategies for the moments that are hardest at home \u2014 plus what to do when safety comes first.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
