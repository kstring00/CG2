import Link from 'next/link';
import { ArrowUpRight, BookOpen, Heart, Home, Users, Wallet } from 'lucide-react';
import BorderGlow from '@/components/effects/BorderGlow';
import { getHomeBaseQuickLinks } from '@/lib/homeBaseContent';
import {
  AT_HOME_STRATEGIES_LABEL,
  RESOURCE_HUB_LABEL,
} from '@/lib/supportNavLabels';
import { resolveHasOtherChildren } from '@/lib/carePlanSupport';
import type { CarePlanAnswers } from '@/lib/carePlanStorage';

const ICONS = {
  'Mental health for you': Heart,
  [AT_HOME_STRATEGIES_LABEL]: Home,
  'Paying for care': Wallet,
  'Sibling support': Users,
  [RESOURCE_HUB_LABEL]: BookOpen,
} as const;

const COMMON_GROUND_GLOW = ['#57bfae', '#9fc7db', '#c6b4d2'];

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
            <BorderGlow
              key={link.href}
              className="h-full transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none"
              edgeSensitivity={38}
              glowColor="168 55 55"
              backgroundColor="#ffffff"
              borderRadius={16}
              glowRadius={18}
              glowIntensity={0.5}
              coneSpread={18}
              animated={false}
              colors={COMMON_GROUND_GLOW}
              fillOpacity={0.08}
            >
              <Link
                href={link.href}
                className={[
                  'group flex h-full min-h-[5.5rem] flex-col justify-between rounded-2xl border p-4 transition-shadow duration-200 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
                  link.cardClass,
                ].join(' ')}
              >
                <Icon className={['h-5 w-5', link.iconClass].join(' ')} aria-hidden />
                <span className="flex items-end justify-between gap-2">
                  <span className="text-[13px] font-semibold leading-snug text-brand-navy-700 transition-colors group-hover:text-primary">
                    {link.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 opacity-40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-70" />
                </span>
              </Link>
            </BorderGlow>
          );
        })}
      </div>
    </section>
  );
}
