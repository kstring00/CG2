import type { Metadata } from 'next';
import CalmMode from '@/components/CalmMode';

export const metadata: Metadata = {
  title: 'Calm — Common Ground',
  description: 'A quiet minute. One sentence, one breath, nothing else.',
};

export default function CalmPage() {
  return <CalmMode />;
}
