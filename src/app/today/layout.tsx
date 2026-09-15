import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Today",
  description:
    "One small thing for today. That is enough.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
