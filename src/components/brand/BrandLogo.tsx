import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SITE } from '@/config/site';

const WIDTH = 200;
const HEIGHT = 77;

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  /** Use next to visible “Common Ground” text so alt text never runs into the title if the image fails. */
  decorative?: boolean;
};

export function BrandLogo({
  className,
  priority,
  decorative = false,
}: BrandLogoProps) {
  return (
    <span className="block leading-none shrink-0">
      <Image
        src={SITE.logoSrc}
        alt={decorative ? '' : SITE.orgName}
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
