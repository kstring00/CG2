import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import './marriage.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
});

export const metadata: Metadata = {
  title: { absolute: 'For the Two of You — Common Ground' },
  description:
    'Honest support for couples raising a child on the autism spectrum — one small step toward reconnecting tonight.',
};

export default function CouplesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${fraunces.variable} ${hanken.variable} marriage-page min-h-screen bg-marriage-paper font-marriage-sans text-marriage-body antialiased`}
    >
      {children}
    </div>
  );
}
