import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Your check-in pattern",
  description:
    "A short weekly check-in that tracks how much you are carrying \u2014 no scores, no streaks, no shame.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
