import {
  AT_HOME_STRATEGIES_LABEL,
  RESOURCE_HUB_LABEL,
} from '@/lib/supportNavLabels';

export const HOME_BASE_TAGLINE = "You're showing up for your child — that matters.";

export const HERO_REASSURANCE = "You're not behind — here's your next best step.";

/** Quick at-home ideas — links only, not completion tracking. */
export const QUICK_WIN_LINKS = [
  {
    label: 'Use a 1-minute reset',
    href: '/support/caregiver',
  },
  {
    label: 'Try a visual schedule',
    href: '/support/at-home',
  },
  {
    label: 'Offer two choices',
    href: '/support/at-home',
  },
] as const;

/** First-call questions — deep-link to the guide section. */
export const FIRST_CALL_QUESTIONS = [
  {
    label: 'How do you measure progress?',
    href: '/support/what-is-aba#questions',
  },
  {
    label: 'Can I watch a session?',
    href: '/support/what-is-aba#questions',
  },
  {
    label: 'What can I do at home?',
    href: '/support/what-is-aba#questions',
  },
] as const;

export type HomeBaseQuickLink = {
  label: string;
  href: string;
  cardClass: string;
  iconClass: string;
};

export function getHomeBaseQuickLinks(hasOtherChildren: boolean): HomeBaseQuickLink[] {
  const links: HomeBaseQuickLink[] = [
    {
      label: 'Mental health for you',
      href: '/support/caregiver',
      cardClass: 'border-brand-plum-200/80 bg-gradient-to-br from-brand-plum-50 to-white',
      iconClass: 'text-brand-plum-700',
    },
    {
      label: AT_HOME_STRATEGIES_LABEL,
      href: '/support/at-home',
      cardClass: 'border-surface-border bg-gradient-to-br from-surface-muted/40 to-white',
      iconClass: 'text-brand-muted-600',
    },
    {
      label: 'Paying for care',
      href: '/support/financial',
      cardClass: 'border-amber-200/70 bg-gradient-to-br from-amber-50/80 to-white',
      iconClass: 'text-amber-800',
    },
  ];
  if (hasOtherChildren) {
    links.push({
      label: 'Sibling support',
      href: '/support/siblings',
      cardClass: 'border-sky-200/70 bg-gradient-to-br from-sky-50/80 to-white',
      iconClass: 'text-sky-800',
    });
  }
  links.push({
    label: RESOURCE_HUB_LABEL,
    href: '/support/resources',
    cardClass: 'border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-white',
    iconClass: 'text-emerald-800',
  });
  return links;
}
