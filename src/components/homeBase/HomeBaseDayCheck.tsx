'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import HomeBaseToolboxToolInline from '@/components/homeBase/HomeBaseToolboxToolInline';
import {
  DAY_CHECK_REFLECTIONS,
  type HomeBaseDayMood,
} from '@/lib/homeBaseDayCheck';
import {
  getToolboxTool,
  getToolboxToolsByIds,
  HOME_BASE_BAD_DAY_TOOL_IDS,
  HOME_BASE_OKAY_DAY_TOOL_ID,
  MENTAL_HEALTH_TOOLBOX_HREF,
} from '@/lib/mentalHealthToolbox';

const MOOD_OPTIONS: { value: HomeBaseDayMood; label: string }[] = [
  { value: 'good', label: 'Good day' },
  { value: 'in-between', label: 'In between' },
  { value: 'rough', label: 'Rough day' },
];

const PILL_IDLE =
  'border-surface-border bg-white text-brand-navy-700 hover:border-brand-plum-200 hover:bg-brand-plum-50/40';
const PILL_SELECTED =
  'border-brand-plum-300 bg-brand-plum-50 text-brand-navy-800 ring-2 ring-brand-plum-200/50';

type Props = {
  value: HomeBaseDayMood | null;
  onChange: (value: HomeBaseDayMood) => void;
  className?: string;
};

function ReadOnlyReflection({
  items,
}: {
  items: readonly { heading: string; body: string }[];
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.heading}>
          <p className="text-[13px] font-semibold text-brand-navy-700">{item.heading}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-brand-muted-600">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function ToolboxMoreLink({ label = 'Show me more' }: { label?: string }) {
  return (
    <Link
      href={MENTAL_HEALTH_TOOLBOX_HREF}
      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-plum-800 transition hover:text-brand-plum-900"
    >
      {label}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </Link>
  );
}

function BadDayBranch() {
  const tools = getToolboxToolsByIds(HOME_BASE_BAD_DAY_TOOL_IDS);

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-brand-muted-700">
        Ground first — pick one technique below. Tap to expand the steps.
      </p>
      {tools.length > 0 ? (
        <div className="space-y-2">
          {tools.map((tool) => (
            <HomeBaseToolboxToolInline key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        /* TODO: wire HOME_BASE_BAD_DAY_TOOL_IDS when toolbox content is available */
        <p className="rounded-xl border border-dashed border-surface-border bg-surface-subtle/40 px-4 py-3 text-[13px] text-brand-muted-600">
          Grounding tools will appear here once they are available in the Mental Health Toolbox.
        </p>
      )}
      <ToolboxMoreLink label="Show me more in the toolbox" />
    </div>
  );
}

function OkayDayBranch() {
  const tool = getToolboxTool(HOME_BASE_OKAY_DAY_TOOL_ID);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[13px] font-medium text-brand-navy-700">One steadying tool for today</p>
        {tool ? (
          <div className="mt-3">
            <HomeBaseToolboxToolInline tool={tool} />
          </div>
        ) : (
          /* TODO: wire HOME_BASE_OKAY_DAY_TOOL_ID when toolbox content is available */
          <p className="mt-3 rounded-xl border border-dashed border-surface-border bg-surface-subtle/40 px-4 py-3 text-[13px] text-brand-muted-600">
            Steadying tools will appear here once they are available in the Mental Health Toolbox.{' '}
            <ToolboxMoreLink />
          </p>
        )}
      </div>
      <ReadOnlyReflection items={DAY_CHECK_REFLECTIONS.okay} />
    </div>
  );
}

function GoodDayBranch() {
  return <ReadOnlyReflection items={DAY_CHECK_REFLECTIONS.good} />;
}

/**
 * Mood check + inline branch panel — single entry point to the week (presentation only).
 */
export default function HomeBaseDayCheck({ value, onChange, className }: Props) {
  return (
    <section
      aria-label="How are you feeling today?"
      className={cn(
        'rounded-2xl border border-surface-border/70 bg-white p-5 shadow-soft sm:p-6',
        className,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-500">
        How are you feeling today?
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-brand-muted-500">
        No wrong answer — this just helps us meet you where you are today.
      </p>
      <div role="group" aria-label="Today's mood" className="mt-4 flex flex-wrap gap-2">
        {MOOD_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                'rounded-full border px-4 py-2 text-[13px] font-semibold transition',
                selected ? PILL_SELECTED : PILL_IDLE,
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {value && (
        <div
          className="mt-5 border-t border-surface-border/60 pt-5"
          aria-live="polite"
          aria-label={
            value === 'rough'
              ? 'Support for a rough day'
              : value === 'in-between'
                ? 'Support for an in-between day'
                : 'Support for a good day'
          }
        >
          {value === 'rough' && <BadDayBranch />}
          {value === 'in-between' && <OkayDayBranch />}
          {value === 'good' && <GoodDayBranch />}
        </div>
      )}

      {!value && (
        <p className="mt-4 text-[12px] text-brand-muted-500">
          Choose how today feels to open your week.
        </p>
      )}
    </section>
  );
}
