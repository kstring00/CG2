import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Provider directory",
  description:
    "Verified ABA, speech, OT, feeding, diagnostic, and support providers \u2014 with questions to ask each one.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
