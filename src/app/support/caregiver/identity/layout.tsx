import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Who you are outside caregiving",
  description:
    "Caregiving can take over everything. A quiet space to find the parts of yourself that are still there.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
