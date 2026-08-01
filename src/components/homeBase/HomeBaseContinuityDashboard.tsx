'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  BriefcaseMedical,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  FileText,
  Heart,
  HeartHandshake,
  HeartPulse,
  Home,
  Lightbulb,
  Lock,
  MapPin,
  Phone,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react';
import { findResources, type Resource } from '@/app/support/find/resources';
import { loadCarePlan, type SavedCarePlan } from '@/lib/carePlanStorage';
import {
  clearHomeBaseRecentActivity,
  HOME_BASE_ACTIVITY_EVENT,
  loadHomeBaseActivity,
  recordPrivateTool,
  setHomeBaseSuggestionsEnabled,
  type HomeBaseActivityKind,
  type HomeBaseActivityState,
  type HomeBaseTool,
  type HomeBaseVisit,
} from '@/lib/homeBaseActivity';
import { cn } from '@/lib/utils';

const SHORTLIST_KEY = 'cg-find-local-shortlist-v2';

type Panel = 'recent' | 'saved' | 'worksheets' | 'suggestions' | 'account' | 'clear' | null;

type ExploreItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  className: string;
  iconClassName: string;
};

const EXPLORE_ITEMS: ExploreItem[] = [
  {
    label: 'My Support Guide',
    href: '/support/care-plan',
    icon: Compass,
    className: 'border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50',
    iconClassName: 'text-orange-700',
  },
  {
    label: 'Mental Health Toolbox',
    href: '/support/caregiver',
    icon: HeartPulse,
    className: 'border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50',
    iconClassName: 'text-rose-700',
  },
  {
    label: 'Marriage & Relationships',
    href: '/support/couples',
    icon: HeartHandshake,
    className: 'border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50',
    iconClassName: 'text-violet-700',
  },
  {
    label: 'At Home Strategies',
    href: '/support/at-home',
    icon: Home,
    className: 'border-cyan-100 bg-gradient-to-br from-cyan-50 to-teal-50',
    iconClassName: 'text-teal-700',
  },
  {
    label: 'What Is ABA?',
    href: '/support/what-is-aba',
    icon: CircleHelp,
    className: 'border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50',
    iconClassName: 'text-sky-700',
  },
  {
    label: 'Resource Hub',
    href: '/support/resources',
    icon: BookOpen,
    className: 'border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50',
    iconClassName: 'text-indigo-700',
  },
  {
    label: 'Sibling Support',
    href: '/support/siblings',
    icon: Users,
    className: 'border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50',
    iconClassName: 'text-emerald-700',
  },
  {
    label: 'Find Local Help',
    href: '/support/find',
    icon: MapPin,
    className: 'border-green-100 bg-gradient-to-br from-green-50 to-emerald-50',
    iconClassName: 'text-green-700',
  },
  {
    label: 'Paying for Care',
    href: '/support/financial',
    icon: Wallet,
    className: 'border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50',
    iconClassName: 'text-amber-800',
  },
  {
    label: 'Parent Connection',
    href: '/support/connect',
    icon: UserRound,
    className: 'border-pink-100 bg-gradient-to-br from-pink-50 to-rose-50',
    iconClassName: 'text-pink-700',
  },
];

const WORKSHEETS = [
  { id: 'incident-log', label: 'Incident & Safety Record', href: '/worksheets/incident-log.pdf' },
  { id: 'load-map', label: 'Caregiver Load Map', href: '/worksheets/load-map.pdf' },
  { id: 'care-clarity', label: 'Care Clarity & Review Sheet', href: '/worksheets/care-clarity-review.pdf' },
  { id: 'parent-support', label: 'Parent Support Card', href: '/worksheets/parent-support-card.pdf' },
  { id: 'home-snapshot', label: 'Home Situation Snapshot', href: '/worksheets/home-situation-snapshot.pdf' },
  { id: 'provider-interview', label: 'Provider Interview Guide', href: '/worksheets/provider-interview.pdf' },
  { id: 'advocacy-card', label: 'One-Sentence Advocacy Card', href: '/worksheets/one-sentence-advocacy-card.pdf' },
  { id: 'family-friends', label: 'Family & Friends Support One-Pager', href: '/worksheets/relatives-onepager.pdf' },
] as const;

const KIND_ICONS: Record<HomeBaseActivityKind, LucideIcon> = {
  guide: Compass,
  connection: Users,
  'mental-health': HeartPulse,
  relationships: HeartHandshake,
  learning: CircleHelp,
  home: Home,
  resources: BookOpen,
  siblings: Users,
  'local-help': MapPin,
  financial: Wallet,
  worksheet: FileText,
};

const KIND_STYLES: Record<HomeBaseActivityKind, string> = {
  guide: 'bg-orange-50 text-orange-700',
  connection: 'bg-pink-50 text-pink-700',
  'mental-health': 'bg-rose-50 text-rose-700',
  relationships: 'bg-violet-50 text-violet-700',
  learning: 'bg-sky-50 text-sky-700',
  home: 'bg-teal-50 text-teal-700',
  resources: 'bg-indigo-50 text-indigo-700',
  siblings: 'bg-emerald-50 text-emerald-700',
  'local-help': 'bg-green-50 text-green-700',
  financial: 'bg-amber-50 text-amber-800',
  worksheet: 'bg-violet-50 text-violet-700',
};

function formatRelativeTime(value: string | null | undefined): string {
  if (!value) return 'Recently';
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return 'Recently';
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(timestamp));
}

function readShortlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SHORTLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

function mostCommonCity(resources: Resource[]): string | null {
  const counts = new Map<string, number>();
  resources.forEach((resource) => {
    resource.cities
      .filter((city) => city !== 'Statewide' && city !== 'Online')
      .forEach((city) => counts.set(city, (counts.get(city) ?? 0) + 1));
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function ActivityRow({ item }: { item: HomeBaseVisit | HomeBaseTool }) {
  const isTool = 'openedAt' in item;
  const kind: HomeBaseActivityKind = isTool ? 'worksheet' : item.kind;
  const Icon = KIND_ICONS[kind];
  const time = isTool ? item.openedAt : item.visitedAt;

  return (
    <Link
      href={item.href}
      onClick={() => {
        if (isTool) recordPrivateTool({ id: item.id, label: item.label, href: item.href });
      }}
      className="group flex min-h-[64px] items-center gap-3 border-t border-surface-border px-3 py-2.5 first:border-t-0 transition hover:bg-primary/[0.035]"
    >
      <span className={cn('inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', KIND_STYLES[kind])}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-brand-navy-800">{item.label}</span>
        <span className="mt-0.5 block text-[11px] text-brand-muted-500">{formatRelativeTime(time)}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-brand-muted-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

function EmptyCardState({
  title,
  body,
  href,
  action,
}: {
  title: string;
  body: string;
  href: string;
  action: string;
}) {
  return (
    <div className="flex min-h-[190px] flex-col items-start justify-center px-5 py-6">
      <p className="text-sm font-semibold text-brand-navy-800">{title}</p>
      <p className="mt-2 max-w-xs text-[12px] leading-relaxed text-brand-muted-500">{body}</p>
      <Link href={href} className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline">
        {action} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function DashboardPanel({
  title,
  icon: Icon,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  icon: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[1.35rem] border border-surface-border bg-white shadow-[0_12px_35px_rgba(26,46,82,0.055)]">
      <header className="flex min-h-12 items-center justify-between gap-3 border-b border-surface-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-[14px] font-semibold text-brand-navy-800">{title}</h2>
        </div>
        {actionLabel && onAction && (
          <button type="button" onClick={onAction} className="text-[11px] font-semibold text-primary hover:underline">
            {actionLabel}
          </button>
        )}
      </header>
      {children}
    </section>
  );
}

export default function HomeBaseContinuityDashboard() {
  const reduceMotion = Boolean(useReducedMotion());
  const [hydrated, setHydrated] = useState(false);
  const [activity, setActivity] = useState<HomeBaseActivityState>(() => loadHomeBaseActivity());
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [plan, setPlan] = useState<SavedCarePlan | null>(null);
  const [panel, setPanel] = useState<Panel>(null);

  const refresh = useCallback(() => {
    setActivity(loadHomeBaseActivity());
    setSavedIds(readShortlist());
    setPlan(loadCarePlan());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);

    const onStorage = () => refresh();
    window.addEventListener('storage', onStorage);
    window.addEventListener(HOME_BASE_ACTIVITY_EVENT, onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(HOME_BASE_ACTIVITY_EVENT, onStorage);
    };
  }, [refresh]);

  const savedResources = useMemo(
    () => savedIds.map((id) => findResources.find((resource) => resource.id === id)).filter((resource): resource is Resource => Boolean(resource)),
    [savedIds],
  );

  const recentItems = useMemo(() => {
    const visits = activity.visits.map((item) => ({ item, time: item.visitedAt }));
    const tools = activity.tools.map((item) => ({ item, time: item.openedAt }));
    return [...visits, ...tools]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .map(({ item }) => item);
  }, [activity.tools, activity.visits]);

  const continueCard = useMemo(() => {
    const latest = activity.visits[0];
    const city = mostCommonCity(savedResources);

    if (savedResources.length > 0) {
      return {
        eyebrow: 'Continue where you left off',
        title: `Continue comparing ${savedResources.length} saved resource${savedResources.length === 1 ? '' : 's'}${city ? ` near ${city}` : ''}`,
        description: 'Your shortlist is private to this browser. Confirm current availability and details directly with each organization.',
        href: '/support/find',
        action: 'Continue my search',
        secondaryHref: '/support/find',
        secondaryAction: 'View my saved resources',
        timestamp: latest?.kind === 'local-help' ? latest.visitedAt : null,
        location: city,
        countLabel: `${savedResources.length} saved`,
      };
    }

    if (latest) {
      return {
        eyebrow: 'Continue where you left off',
        title: `Return to ${latest.label}`,
        description: latest.description,
        href: latest.href,
        action: 'Continue',
        secondaryHref: '/support/intake',
        secondaryAction: 'Choose something different',
        timestamp: latest.visitedAt,
        location: null,
        countLabel: 'Private on this device',
      };
    }

    if (plan) {
      return {
        eyebrow: 'Your support guide is ready',
        title: 'Return to your focused support guide',
        description: plan.summary || 'Pick up with the support and private tools matched to what you selected.',
        href: '/support/care-plan',
        action: 'Open my support guide',
        secondaryHref: '/support/intake',
        secondaryAction: 'Choose something different',
        timestamp: plan.updatedAt,
        location: null,
        countLabel: 'Saved privately',
      };
    }

    return {
      eyebrow: 'Start here',
      title: 'Find one useful next step for right now',
      description: 'Answer two quick questions and Common Ground will show a focused starting point and a private worksheet when one could help.',
      href: '/support/intake',
      action: 'Find my next step',
      secondaryHref: '/support/find',
      secondaryAction: 'Browse local help',
      timestamp: null,
      location: null,
      countLabel: 'Nothing is sent anywhere',
    };
  }, [activity.visits, plan, savedResources]);

  const suggestion = useMemo(() => {
    if (!activity.suggestionsEnabled) {
      return {
        reason: 'Suggestions are turned off in your Home Base settings.',
        title: 'Your activity stays available without recommendations',
        body: 'Recently used and saved items still remain private on this device.',
        href: null,
        action: 'Manage suggestions',
      };
    }

    if (savedResources.length > 0 || activity.visits.some((visit) => visit.kind === 'local-help')) {
      return {
        reason: 'Suggested because you recently used Find Local Help or saved a resource.',
        title: 'Prepare for provider calls',
        body: 'Use the Provider Interview Guide to compare access, costs, staffing, and family involvement.',
        href: '/worksheets/provider-interview.pdf',
        action: 'Open the guide',
      };
    }

    if (activity.visits.some((visit) => visit.kind === 'mental-health')) {
      return {
        reason: 'Suggested because you recently opened the Mental Health Toolbox.',
        title: 'Map the load you are carrying',
        body: 'The Caregiver Load Map helps organize pressure points without scoring or diagnosing anything.',
        href: '/worksheets/load-map.pdf',
        action: 'Open the load map',
      };
    }

    if (plan || activity.visits.some((visit) => visit.kind === 'guide')) {
      return {
        reason: 'Suggested because you have used My Support Guide.',
        title: 'Return to the support matched to your selection',
        body: 'Your guide keeps the next step, questions, and private worksheet in one place.',
        href: '/support/care-plan',
        action: 'Open my guide',
      };
    }

    return {
      reason: 'Suggested because you have not chosen a starting point yet.',
      title: 'Find one focused next step',
      body: 'Two quick questions can make the rest of Common Ground easier to navigate.',
      href: '/support/intake',
      action: 'Start the guide',
    };
  }, [activity.suggestionsEnabled, activity.visits, plan, savedResources.length]);

  function openWorksheet(id: string, label: string, href: string) {
    recordPrivateTool({ id, label, href });
    refresh();
  }

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <div className="h-20 animate-pulse rounded-3xl bg-white/70" />
        <div className="h-40 animate-pulse rounded-3xl bg-white/70" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-3xl bg-white/70" />
          <div className="h-64 animate-pulse rounded-3xl bg-white/70" />
          <div className="h-64 animate-pulse rounded-3xl bg-white/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.34 }}
        className="flex items-center gap-4"
      >
        <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-brand-plum-100 bg-white text-brand-plum-700 shadow-soft">
          <Heart className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-semibold leading-tight text-brand-navy-800 sm:text-[2rem]">
            Welcome back. Let&rsquo;s pick up where you left off.
          </h1>
          <p className="mt-1 text-[14px] text-brand-muted-600">
            This is your space. Private, optional, and centered around you.
          </p>
        </div>
      </motion.header>

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.38, delay: reduceMotion ? 0 : 0.04 }}
        className="relative overflow-hidden rounded-[1.6rem] border border-primary/15 bg-gradient-to-br from-white via-white to-teal-50/70 p-5 shadow-[0_15px_45px_rgba(26,46,82,0.075)] sm:p-6"
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] overflow-hidden sm:block" aria-hidden>
          <div className="absolute -right-12 top-8 h-48 w-72 rounded-full bg-teal-100/45 blur-2xl" />
          <div className="absolute bottom-0 right-20 h-20 w-64 rounded-[100%] bg-cyan-100/45" />
          <MapPin className="absolute right-16 top-7 h-24 w-24 text-teal-500/55 drop-shadow-sm" strokeWidth={1.4} />
          <Heart className="absolute right-[5.65rem] top-[3.15rem] h-8 w-8 text-white" fill="currentColor" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex rounded-full bg-teal-100/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-800">
            {continueCard.eyebrow}
          </span>
          <h2 className="mt-3 max-w-3xl text-xl font-semibold leading-snug text-brand-navy-800 sm:text-2xl">
            {continueCard.title}
          </h2>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-brand-muted-600">
            {continueCard.description}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={continueCard.href}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              {continueCard.action} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={continueCard.secondaryHref} className="text-[12px] font-semibold text-primary hover:underline">
              {continueCard.secondaryAction}
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-brand-muted-600">
            <span className="inline-flex items-center gap-1.5"><Bookmark className="h-3.5 w-3.5" /> {continueCard.countLabel}</span>
            {continueCard.timestamp && (
              <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {formatRelativeTime(continueCard.timestamp)}</span>
            )}
            {continueCard.location && (
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {continueCard.location}, TX</span>
            )}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardPanel title="Recently used" icon={Clock3} actionLabel={recentItems.length > 3 ? 'View all' : undefined} onAction={() => setPanel('recent')}>
          {recentItems.length ? (
            <div>{recentItems.slice(0, 3).map((item) => <ActivityRow key={`${item.href}-${'openedAt' in item ? item.openedAt : item.visitedAt}`} item={item} />)}</div>
          ) : (
            <EmptyCardState title="Nothing used yet" body="Pages and private tools you open will appear here so you can find them again." href="/support/intake" action="Find my next step" />
          )}
        </DashboardPanel>

        <DashboardPanel title="Saved for later" icon={Bookmark} actionLabel={savedResources.length > 3 ? 'View all' : undefined} onAction={() => setPanel('saved')}>
          {savedResources.length ? (
            <div>
              {savedResources.slice(0, 3).map((resource) => (
                <Link key={resource.id} href="/support/find" className="group flex min-h-[64px] items-center gap-3 border-t border-surface-border px-3 py-2.5 first:border-t-0 transition hover:bg-primary/[0.035]">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Bookmark className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-brand-navy-800">{resource.name}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-brand-muted-500">{resource.services.slice(0, 2).join(' · ')}{resource.cities[0] ? ` · ${resource.cities[0]}` : ''}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-brand-muted-400 transition group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyCardState title="No saved resources yet" body="Save providers, support groups, and community resources inside Find Local Help." href="/support/find" action="Browse local help" />
          )}
        </DashboardPanel>

        <DashboardPanel title="Suggested next" icon={Sparkles} actionLabel="Manage" onAction={() => setPanel('suggestions')}>
          <div className="m-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/90 to-brand-plum-50/60 p-4">
            <p className="text-[11px] leading-relaxed text-brand-muted-600">{suggestion.reason}</p>
            <div className="mt-4 rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm">
              <p className="text-[14px] font-semibold text-brand-navy-800">{suggestion.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">{suggestion.body}</p>
              {suggestion.href ? (
                <Link
                  href={suggestion.href}
                  onClick={() => {
                    if (suggestion.href?.startsWith('/worksheets/')) {
                      const worksheet = WORKSHEETS.find((item) => item.href === suggestion.href);
                      if (worksheet) openWorksheet(worksheet.id, worksheet.label, worksheet.href);
                    }
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline"
                >
                  {suggestion.action} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <button type="button" onClick={() => setPanel('suggestions')} className="mt-3 text-[12px] font-semibold text-primary hover:underline">
                  {suggestion.action}
                </button>
              )}
            </div>
          </div>
        </DashboardPanel>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
          <div>
            <p className="text-[13px] font-semibold text-brand-navy-800">Private on this device</p>
            <p className="text-[11px] text-brand-muted-500">Activity is used only to organize this Home Base. Common Ground never receives it.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setPanel('clear')} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold text-brand-muted-600 transition hover:bg-rose-50 hover:text-rose-700">
            <Trash2 className="h-3.5 w-3.5" /> Clear recent activity
          </button>
          <button type="button" onClick={() => setPanel('suggestions')} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold text-primary transition hover:bg-primary/5">
            <Settings2 className="h-3.5 w-3.5" /> Manage suggestions
          </button>
        </div>
      </div>

      <section className="rounded-[1.4rem] border border-surface-border bg-white p-4 shadow-[0_12px_35px_rgba(26,46,82,0.045)] sm:p-5">
        <h2 className="text-lg font-semibold text-brand-navy-800">Explore Common Ground</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10">
          {EXPLORE_ITEMS.map((item) => (
            <motion.div key={item.href} whileHover={reduceMotion ? undefined : { y: -3 }} transition={{ duration: 0.18 }}>
              <Link href={item.href} className={cn('group flex min-h-[104px] h-full flex-col items-center justify-center rounded-2xl border p-3 text-center shadow-sm transition hover:shadow-md', item.className)}>
                <item.icon className={cn('h-6 w-6', item.iconClassName)} aria-hidden />
                <span className="mt-2 text-[11px] font-semibold leading-tight text-brand-navy-800">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-surface-border bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><FileText className="h-5 w-5" /></span>
            <div>
              <h2 className="text-[14px] font-semibold text-brand-navy-800">Private tools</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-500">Worksheets stay on your phone, computer, or paper. Common Ground never receives your answers.</p>
            </div>
          </div>
          <button type="button" onClick={() => setPanel('worksheets')} className="hidden shrink-0 items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-3 text-[12px] font-semibold text-brand-navy-800 transition hover:border-primary/30 hover:bg-primary/[0.025] sm:inline-flex">
            Open my worksheets <ChevronRight className="h-4 w-4" />
          </button>
        </section>

        <section className="relative overflow-hidden rounded-[1.35rem] border border-primary/15 bg-gradient-to-r from-white to-teal-50/70 p-5 shadow-sm">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-teal-100/55 blur-xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[14px] font-semibold text-brand-navy-800">Want your saved resources on another device?</h2>
              <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-brand-muted-500">Optional account sync is the next phase. It will never be required to use Common Ground.</p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
              <button type="button" onClick={() => setPanel('account')} className="rounded-xl bg-primary px-4 py-2.5 text-[12px] font-semibold text-white shadow-soft transition hover:bg-primary/90">
                See account options
              </button>
              <button type="button" onClick={() => setPanel('account')} className="text-[10px] font-semibold text-primary hover:underline">Learn how privacy works</button>
            </div>
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-[1.45rem] border border-orange-100 bg-gradient-to-r from-[#fffaf4] via-white to-rose-50/65 shadow-sm">
        <div className="grid divide-y divide-orange-100/70 lg:grid-cols-[0.85fr_1fr_1fr_1.2fr] lg:divide-x lg:divide-y-0">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-brand-navy-800">We&rsquo;re here for you</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">Real people. Real support. Whenever you need it.</p>
          </div>
          <a href="tel:+18777715725" className="group flex items-center gap-3 p-5 transition hover:bg-white/70">
            <Phone className="h-6 w-6 text-primary" />
            <span><span className="block text-[13px] font-semibold text-brand-navy-800">Admissions support</span><span className="mt-1 block text-[11px] text-brand-muted-500">Questions about ABA or next steps</span><span className="mt-1 block text-[12px] font-bold text-primary">(877) 771-5725</span></span>
          </a>
          <div className="flex items-center gap-3 p-5">
            <Heart className="h-6 w-6 text-primary" />
            <span><span className="block text-[13px] font-semibold text-brand-navy-800">Crisis support</span><span className="mt-1 block text-[11px] text-brand-muted-500">Help is available 24/7</span><span className="mt-1 flex gap-2 text-[12px] font-bold text-rose-600"><a href="tel:988" className="hover:underline">Call 988</a><span>or</span><a href="sms:988" className="hover:underline">text 988</a></span></span>
          </div>
          <div className="p-4">
            <a href="tel:988" className="group flex h-full items-center gap-3 rounded-2xl border border-rose-100 bg-white/85 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white"><Phone className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold text-rose-700">Talk to someone now</span><span className="mt-1 block text-[11px] leading-relaxed text-brand-muted-500">Immediate support when today feels unsafe.</span></span>
              <ArrowRight className="h-4 w-4 text-rose-600 transition group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-orange-100/70 px-5 py-3 text-[11px] text-brand-muted-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Privacy first. You&rsquo;re in control.</span>
          <span>Current family? <Link href="/client" className="font-semibold text-primary hover:underline">Sign in to the client portal →</Link></span>
        </div>
      </section>

      <AnimatePresence>
        {panel && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-navy-950/35 p-4 backdrop-blur-[2px]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setPanel(null);
            }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label="Home Base details"
              initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.99 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] border border-surface-border bg-white shadow-2xl"
            >
              <header className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-white/95 px-5 py-4 backdrop-blur">
                <h2 className="text-lg font-semibold text-brand-navy-800">
                  {panel === 'recent' && 'Recently used'}
                  {panel === 'saved' && 'Saved for later'}
                  {panel === 'worksheets' && 'Private worksheets'}
                  {panel === 'suggestions' && 'Suggestion settings'}
                  {panel === 'account' && 'Optional account and privacy'}
                  {panel === 'clear' && 'Clear recent activity?'}
                </h2>
                <button type="button" onClick={() => setPanel(null)} className="rounded-xl p-2 text-brand-muted-500 transition hover:bg-surface-subtle" aria-label="Close"><X className="h-5 w-5" /></button>
              </header>

              <div className="p-5">
                {panel === 'recent' && (
                  recentItems.length ? <div className="overflow-hidden rounded-xl border border-surface-border">{recentItems.map((item) => <ActivityRow key={`${item.href}-${'openedAt' in item ? item.openedAt : item.visitedAt}`} item={item} />)}</div> : <p className="text-sm text-brand-muted-600">Nothing has been opened yet.</p>
                )}

                {panel === 'saved' && (
                  savedResources.length ? (
                    <div className="space-y-3">{savedResources.map((resource) => (
                      <Link key={resource.id} href="/support/find" onClick={() => setPanel(null)} className="flex items-start gap-3 rounded-xl border border-surface-border p-4 transition hover:border-primary/25 hover:bg-primary/[0.02]">
                        <Bookmark className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                        <span><span className="block text-sm font-semibold text-brand-navy-800">{resource.name}</span><span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-500">{resource.blurb}</span></span>
                      </Link>
                    ))}</div>
                  ) : <p className="text-sm text-brand-muted-600">No providers or resources have been saved yet.</p>
                )}

                {panel === 'worksheets' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {WORKSHEETS.map((worksheet) => (
                      <a key={worksheet.id} href={worksheet.href} download onClick={() => openWorksheet(worksheet.id, worksheet.label, worksheet.href)} className="group flex min-h-20 items-center gap-3 rounded-xl border border-surface-border p-4 transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-sm">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><FileText className="h-5 w-5" /></span>
                        <span className="min-w-0 flex-1 text-[13px] font-semibold leading-snug text-brand-navy-800">{worksheet.label}</span>
                        <ArrowRight className="h-4 w-4 text-brand-muted-400 transition group-hover:translate-x-0.5" />
                      </a>
                    ))}
                    <p className="sm:col-span-2 text-[11px] leading-relaxed text-brand-muted-500">These files open or download directly to your device. Common Ground cannot see what you type into them.</p>
                  </div>
                )}

                {panel === 'suggestions' && (
                  <div>
                    <div className="flex items-start justify-between gap-4 rounded-xl border border-surface-border p-4">
                      <div><p className="text-sm font-semibold text-brand-navy-800">Explainable suggestions</p><p className="mt-1 text-[12px] leading-relaxed text-brand-muted-500">Use only the pages, worksheets, and provider shortlist stored in this browser. No diagnosis, behavior interpretation, or clinical recommendation is made.</p></div>
                      <button type="button" role="switch" aria-checked={activity.suggestionsEnabled} onClick={() => { setHomeBaseSuggestionsEnabled(!activity.suggestionsEnabled); refresh(); }} className={cn('relative h-7 w-12 shrink-0 rounded-full transition', activity.suggestionsEnabled ? 'bg-primary' : 'bg-brand-muted-300')}>
                        <span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition', activity.suggestionsEnabled ? 'left-6' : 'left-1')} />
                      </button>
                    </div>
                    <div className="mt-4 rounded-xl bg-primary/[0.035] p-4"><p className="text-[12px] font-semibold text-brand-navy-800">Why this suggestion appears</p><p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">{suggestion.reason}</p></div>
                  </div>
                )}

                {panel === 'account' && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4"><p className="text-sm font-semibold text-brand-navy-800">Today: private on this device</p><p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">Recent activity, your provider shortlist, and Home Base preferences stay in this browser. Worksheet answers are never uploaded.</p></div>
                    <div className="rounded-xl border border-surface-border p-4"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-violet-700" /><p className="text-sm font-semibold text-brand-navy-800">Next phase: optional sync</p></div><p className="mt-2 text-[12px] leading-relaxed text-brand-muted-600">Cross-device Home Base sync is not live yet. When added, it should be optional, explain exactly what syncs, and keep completed worksheet contents off the server.</p></div>
                    <div className="flex flex-col gap-2 sm:flex-row"><Link href="/client" onClick={() => setPanel(null)} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-[12px] font-semibold text-white">Current family sign-in</Link><button type="button" onClick={() => setPanel(null)} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-surface-border px-4 py-2.5 text-[12px] font-semibold text-brand-navy-800">Keep using this device</button></div>
                  </div>
                )}

                {panel === 'clear' && (
                  <div>
                    <p className="text-sm leading-relaxed text-brand-muted-600">This removes recently opened pages and worksheet history from Home Base. It does not remove your Support Guide or saved provider shortlist.</p>
                    <div className="mt-5 flex flex-col gap-2 sm:flex-row"><button type="button" onClick={() => { clearHomeBaseRecentActivity(); refresh(); setPanel(null); }} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-[12px] font-semibold text-white">Clear recent activity</button><button type="button" onClick={() => setPanel(null)} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-surface-border px-4 py-2.5 text-[12px] font-semibold text-brand-navy-800">Cancel</button></div>
                  </div>
                )}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
