import { Phone } from 'lucide-react';
import { ADMISSIONS_PHONE } from '@/lib/carePlanSupport';

type Props = {
  className?: string;
  compact?: boolean;
};

/** Universal admissions door — identical for every family; never coverage-gated. */
export default function AdmissionsHandoff({ className, compact }: Props) {
  return (
    <a
      href={`tel:${ADMISSIONS_PHONE}`}
      className={[
        'inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 text-primary transition hover:bg-primary/10',
        compact ? 'px-3 py-2 text-[12.5px] font-semibold' : 'px-4 py-2.5 text-sm font-semibold',
        className ?? '',
      ].join(' ')}
    >
      <Phone className="h-4 w-4 shrink-0" aria-hidden />
      <span>
        Talk to admissions — free consultation
        {!compact && (
          <span className="mt-0.5 block text-[11px] font-normal text-brand-muted-600">
            Our team handles coverage with you — not a yes/no on services here.
          </span>
        )}
      </span>
    </a>
  );
}
