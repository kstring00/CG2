'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MentalHealthTool } from '@/lib/mentalHealthToolbox';

type Props = {
  tool: MentalHealthTool;
  className?: string;
};

/** Expandable toolbox tool — read-only steps from Mental Health Toolbox content. */
export default function HomeBaseToolboxToolInline({ tool, className }: Props) {
  const [open, setOpen] = useState(false);
  const Icon = tool.icon;

  return (
    <div
      className={cn(
        'rounded-xl border border-surface-border/80 bg-surface-subtle/30',
        className,
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-white/60"
      >
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-plum-50 text-brand-plum-700">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold text-brand-navy-700">{tool.title}</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-brand-muted-500">
              {tool.tag}
            </span>
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-brand-muted-600">
            {tool.blurb}
          </span>
        </span>
        <ChevronDown
          className={cn(
            'mt-1 h-4 w-4 shrink-0 text-brand-muted-400 transition',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-surface-border/60 px-4 pb-4 pt-3">
          {tool.intro && (
            <p className="text-[13px] leading-relaxed text-brand-muted-700">{tool.intro}</p>
          )}
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[13px] leading-relaxed text-brand-muted-700">
            {tool.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
