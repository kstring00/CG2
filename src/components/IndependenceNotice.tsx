import { cn } from '@/lib/utils';
import { INDEPENDENCE_DISCLAIMER } from '@/lib/siteMeta';

type Props = {
  className?: string;
};

/**
 * The one sentence that keeps Common Ground from reading as a clinic product.
 * Quiet by design — it belongs on the page, not in the way of it.
 */
export default function IndependenceNotice({ className }: Props) {
  return (
    <p className={cn('text-[11px] leading-relaxed text-brand-muted-400', className)}>
      {INDEPENDENCE_DISCLAIMER}
    </p>
  );
}
