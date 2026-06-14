import { Phone } from 'lucide-react';
import {
  ADMISSIONS_CTA_LABEL,
  ADMISSIONS_PHONE,
  ADMISSIONS_PHONE_DISPLAY,
} from '@/lib/carePlanSupport';

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
        compact ? 'px-3 py-2 text-[12.5px]' : 'px-4 py-2.5 text-sm',
        className ?? '',
      ].join(' ')}
    >
      <Phone className="h-4 w-4 shrink-0" aria-hidden />
      <span className="flex flex-col leading-tight">
        <span className="font-semibold">{ADMISSIONS_CTA_LABEL}</span>
        <span className={compact ? 'text-[11px] font-medium text-primary/80' : 'text-xs font-medium text-primary/80'}>
          {ADMISSIONS_PHONE_DISPLAY}
        </span>
      </span>
    </a>
  );
}
