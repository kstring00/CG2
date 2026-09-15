import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Parent mental health",
  description:
    "Your mental health is part of your child's care plan. Tools, topics, and places to get real help.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
