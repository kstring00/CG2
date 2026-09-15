import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Raise a concern",
  description:
    "Tell your care team what is not working. Someone will respond within one business day.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
