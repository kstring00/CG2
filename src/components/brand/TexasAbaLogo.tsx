import Image from 'next/image';
import { cn } from '@/lib/utils';

const SRC = '/logos/texas-aba-centers.png';
const WIDTH = 200;
const HEIGHT = 77;

type TexasAbaLogoProps = {
  className?: string;
  priority?: boolean;
  /** Use next to visible “Common Ground” text so alt text never runs into the title if the image fails. */
  decorative?: boolean;
};

export function TexasAbaLogo({
  className,
  priority,
  decorative = false,
}: TexasAbaLogoProps) {
  return (
    <span className="block leading-none shrink-0">
      <Image
        src={SRC}
        alt={decorative ? '' : 'Texas ABA Centers'}
        width={WIDTH}
        height={HEIGHT}
        sizes="(max-width: 640px) 160px, 220px"
        className={cn(
          'block h-auto w-auto max-w-full object-contain object-left',
          className,
        )}
        priority={priority}
        {...(decorative ? { 'aria-hidden': true } : {})}
      />
    </span>
  );
}
