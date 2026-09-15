import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Help & hotlines",
  description:
    "Crisis lines, respite, advocacy, and navigation support \u2014 with real, verified contacts.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
