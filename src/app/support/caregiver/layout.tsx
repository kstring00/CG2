import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Caregiver support",
  description:
    "You are carrying something most people will never understand. Support for the parent, not just the child.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
