import type { Metadata } from 'next';

/**
 * /welcome is an archive of the previous marketing homepage. It is intentionally
 * not linked from any nav and is excluded from indexing. Pieces of it are being
 * pulled into the new intake-first homepage and into individual support pages
 * over time. Once that migration is complete, this whole route can be deleted.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
