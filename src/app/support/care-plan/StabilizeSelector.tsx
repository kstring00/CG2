'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CopyEntry, StandardRowId } from '@/content/carePlan';

function resolveSelected(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 2 ? parsed : 0;
}

export default function StabilizeSelector({
  row,
  options,
}: {
  row: StandardRowId;
  options: [CopyEntry, CopyEntry, CopyEntry];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = resolveSelected(searchParams.get('a'));

  function choose(index: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('a', String(index));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <fieldset className="overflow-hidden rounded-xl border border-surface-border bg-white">
      <legend className="sr-only">Pick one thing for today</legend>
      {options.map((option, index) => {
        const checked = selected === index;
        return (
          <label
            key={option.id}
            className={`flex min-h-16 cursor-pointer items-center gap-4 border-t border-surface-border px-5 py-4 first:border-t-0 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-navy-500 sm:px-6 ${
              checked ? 'bg-brand-warm-50' : 'bg-white hover:bg-brand-warm-50/60'
            }`}
          >
            <input
              type="radio"
              name={`care-plan-action-${row}`}
              value={index}
              checked={checked}
              onChange={() => choose(index)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 rounded-full border ${
                checked
                  ? 'border-brand-navy-700 bg-brand-navy-700 ring-4 ring-brand-warm-100'
                  : 'border-brand-muted-400 bg-white'
              }`}
            />
            <span className="text-[15px] font-medium leading-relaxed text-brand-navy-700">
              {option.text}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
