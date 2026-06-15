import { Heart } from 'lucide-react';
import { HOME_BASE_TAGLINE } from '@/lib/homeBaseContent';

export default function HomeBaseHeader() {
  return (
    <header className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-plum-50 text-brand-plum-700">
          <Heart className="h-4 w-4" aria-hidden />
        </span>
        <h1 className="text-2xl font-semibold text-brand-navy-700 sm:text-[1.65rem]">Home Base</h1>
      </div>
      <p className="max-w-xl text-[14px] leading-relaxed text-brand-muted-600 sm:pl-10">
        {HOME_BASE_TAGLINE}
      </p>
    </header>
  );
}
