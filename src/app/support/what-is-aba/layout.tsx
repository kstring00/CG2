import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "What is ABA?",
  description:
    "A plain-language explanation of ABA therapy, what to expect, and how to be a real partner in it.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
