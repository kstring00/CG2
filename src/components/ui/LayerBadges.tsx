import { Compass, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Visual primitives that make the layer (public Care Navigation vs private
 * Client Portal) unmistakable. Used in page headers, nav rails, and cross-
 * layer links.
 *
 * Note: the component is still named FreeBadge for backwards-compatibility
 * with imports, but its visual language is now the public Care Navigation
 * layer — primary navy, compass icon.
 */

type Size = 'sm' | 'md';

export function FreeBadge({
  className,
  size = 'sm',
  label = 'Care Navigation',
}: {
  className?: string;
  size?: Size;
  label?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 font-semibold uppercase tracking-wide text-primary',
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]',
        className,
      )}
    >
      <Compass className={cn(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {label}
    </span>
  );
}

export function ClientOnlyBadge({
  className,
  size = 'sm',
  label = 'Client portal · sign-in required',
}: {
  className?: string;
  size?: Size;
  label?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 font-semibold uppercase tracking-wide text-accent',
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]',
        className,
      )}
    >
      <Lock className={cn(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {label}
    </span>
  );
}
