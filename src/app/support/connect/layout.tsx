import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Connect with other parents",
  description:
    "Moderated spaces to talk with parents who have been where you are.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
