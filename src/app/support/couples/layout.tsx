import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marriage & Relationships',
  description:
    'Practical, warm support for parents carrying parenting stress, diagnosis pressure, and relationship strain — one small step toward connection.',
};

export default function CouplesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
