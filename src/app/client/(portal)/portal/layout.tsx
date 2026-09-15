import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Client portal",
  description:
    "This week with your child \u2014 goals, sessions, and what your care team needs from you.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
