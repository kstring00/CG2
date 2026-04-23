import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  priority?: boolean;
};

export function CommonGroundLogo({ className, priority }: Props) {
  return (
    <Image
      src="/logos/common-ground-mark.png"
      alt="Common Ground"
      width={712}
      height={636}
      priority={priority}
      className={cn('block h-auto w-auto object-contain object-left', className)}
    />
  );
}
