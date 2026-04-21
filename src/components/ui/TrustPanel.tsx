import type { LucideIcon } from 'lucide-react';
import { ShieldCheck } from 'lucide-react';

interface TrustPanelProps {
  title: string;
  description: string;
  eyebrow?: string;
  meta?: string[];
  icon?: LucideIcon;
  tone?: 'default' | 'muted' | 'navy';
}

export function TrustPanel({
  title,
  description,
  eyebrow,
  meta = [],
  icon: Icon = ShieldCheck,
  tone = 'default',
}: TrustPanelProps) {
  const toneClass =
    tone === 'navy'
      ? 'border-white/10 bg-white/5 text-white'
      : tone === 'muted'
        ? 'border-surface-border bg-surface-muted text-brand-muted-900'
        : 'border-primary/10 bg-white text-brand-muted-900';

  const metaTone = tone === 'navy' ? 'border-white/10 bg-white/5 text-white/75' : 'border-surface-border bg-white text-brand-muted-500';
  const bodyTone = tone === 'navy' ? 'text-white/75' : 'text-brand-muted-600';
  const eyebrowTone = tone === 'navy' ? 'text-white/60' : 'text-primary';
  const iconTone = tone === 'navy' ? 'bg-white/10 text-white' : 'bg-primary/10 text-primary';

  return (
    <section className={`rounded-3xl border p-5 ${toneClass}`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconTone}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 space-y-2">
          {eyebrow && <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${eyebrowTone}`}>{eyebrow}</p>}
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className={`text-sm leading-relaxed ${bodyTone}`}>{description}</p>
          {meta.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {meta.map((item) => (
                <span key={item} className={`rounded-full border px-3 py-1 text-[11px] font-medium ${metaTone}`}>
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
