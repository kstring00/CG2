import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import { StillWatersNav } from './_components/StillWatersNav';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-still-waters-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-still-waters-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Still Waters · Common Ground',
  description: 'A quiet place to write. One prompt at a time.',
};

export default function StillWatersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${lora.variable} ${inter.variable} -mx-4 -my-6 sm:-mx-6 sm:-my-8 lg:-mx-8`}
      style={{
        fontFamily: 'var(--font-still-waters-sans), system-ui, sans-serif',
      }}
    >
      <div
        className="min-h-[calc(100vh-7rem)]"
        style={{
          background:
            'linear-gradient(180deg, #f4f1ea 0%, #eef0f4 32%, #e3e8f0 70%, #d6dde9 100%)',
        }}
      >
        <StillWatersNav />
        <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-4 sm:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
