import Link from 'next/link';
import { ArrowRight, Check, Circle, Leaf, MessageCircleQuestion, Users } from 'lucide-react';
import {
  FIRST_CALL_QUESTIONS,
  QUICK_WIN_LINKS,
} from '@/lib/homeBaseContent';
import {
  getStepCompletionKey,
  type CarePlanStep,
} from '@/lib/carePlanStorage';
import { isStepComplete } from '@/lib/weeklyProgress';

function InsightCard({
  title,
  icon: Icon,
  children,
  footer,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-surface-border/70 bg-white p-4 shadow-soft sm:p-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-surface-muted/50 text-brand-muted-600">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <h3 className="text-[14px] font-semibold text-brand-navy-700">{title}</h3>
      </div>
      <div className="mt-3 flex-1">{children}</div>
      {footer && <div className="mt-3 border-t border-surface-border/60 pt-3">{footer}</div>}
    </article>
  );
}

type Props = {
  steps: CarePlanStep[];
  completedKeys: string[];
  legacyHrefs: string[];
  heroStepKey?: string;
};

export default function HomeBaseInsightGrid({
  steps,
  completedKeys,
  legacyHrefs,
  heroStepKey,
}: Props) {
  const glanceSteps = steps.slice(0, 3);

  return (
    <section
      aria-label="Helpful this week"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <InsightCard
        title="This week at a glance"
        icon={Check}
        footer={
          <Link
            href="/support/care-plan"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary/80"
          >
            See full plan <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <ul className="space-y-2.5">
          {glanceSteps.length === 0 ? (
            <li className="text-[13px] text-brand-muted-600">Your plan steps will show here.</li>
          ) : (
            glanceSteps.map((step) => {
              const done = isStepComplete(step, completedKeys, legacyHrefs, steps);
              const isHero = getStepCompletionKey(step) === heroStepKey;
              return (
                <li key={getStepCompletionKey(step)} className="flex items-start gap-2">
                  {done ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted-300" aria-hidden />
                  )}
                  <span
                    className={[
                      'text-[13px] leading-snug',
                      done
                        ? 'text-brand-muted-500 line-through decoration-brand-muted-300'
                        : isHero
                          ? 'font-medium text-brand-navy-700'
                          : 'text-brand-muted-700',
                    ].join(' ')}
                  >
                    {step.title}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </InsightCard>

      <InsightCard title="Find parents near you" icon={Users}>
        <p className="text-[13px] leading-relaxed text-brand-muted-600">
          Connect with other Texas families who get it — groups, meetups, and parent match.
        </p>
        <Link
          href="/support/connect"
          className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary/80"
        >
          Connect with parents <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </InsightCard>

      <InsightCard
        title="Quick wins for today"
        icon={Leaf}
        footer={
          <Link
            href="/support/at-home"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary/80"
          >
            See more strategies <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <ul className="space-y-2">
          {QUICK_WIN_LINKS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-[13px] font-medium text-brand-navy-700 underline-offset-2 hover:text-primary hover:underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </InsightCard>

      <InsightCard
        title="Questions for your first call"
        icon={MessageCircleQuestion}
        footer={
          <Link
            href="/support/what-is-aba#questions"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary/80"
          >
            See all questions <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <ul className="space-y-2">
          {FIRST_CALL_QUESTIONS.map((q) => (
            <li key={q.label}>
              <Link
                href={q.href}
                className="text-[13px] leading-snug text-brand-navy-700 underline-offset-2 hover:text-primary hover:underline"
              >
                {q.label}
              </Link>
            </li>
          ))}
        </ul>
      </InsightCard>
    </section>
  );
}
