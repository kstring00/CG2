import Link from 'next/link';
import { ArrowUpRight, BookOpen, Heart, Home, Users, Wallet } from 'lucide-react';
import { getHomeBaseQuickLinks } from '@/lib/homeBaseContent';
import { resolveHasOtherChildren } from '@/lib/carePlanSupport';
import type { CarePlanAnswers } from '@/lib/carePlanStorage';

const ICONS = {
  'Mental health for you': Heart,
  'At-home strategies': Home,
  'Paying for care': Wallet,
  'Sibling support': Users,
  'Guides & strategies': BookOpen,
} as const;

type Props = {
  answers: CarePlanAnswers;
};

export default function HomeBaseQuickLinks({ answers }: Props) {
  const links = getHomeBaseQuickLinks(resolveHasOtherChildren(answers));

  return (
    <section aria-label="Quick links" className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
        Explore on your own
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {links.map((link) => {
          const Icon = ICONS[link.label as keyof typeof ICONS] ?? BookOpen;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'group flex min-h-[5.5rem] flex-col justify-between rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-soft',
                link.cardClass,
              ].join(' ')}
            >
              <Icon className={['h-5 w-5', link.iconClass].join(' ')} aria-hidden />
              <span className="flex items-end justify-between gap-2">
                <span className="text-[13px] font-semibold leading-snug text-brand-navy-700 group-hover:text-primary">
                  {link.label}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-70" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
