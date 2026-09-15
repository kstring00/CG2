import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sleep",
  description:
    "Sleep is often the first thing to break. What actually helps, and when to ask your team.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
