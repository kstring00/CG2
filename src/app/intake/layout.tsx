import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Get started",
  description:
    "Tell us where you are, and we will build a starting point around it.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
