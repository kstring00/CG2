'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  ChevronDown,
  ClipboardList,
  Compass,
  DollarSign,
  GraduationCap,
  Heart,
  HeartHandshake,
  HelpCircle,
  Home,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Sprout,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  GUIDE_NEED_OPTIONS,
  QUICK_FILTER_NEEDS,
  getDefaultFeatured,
  getDefaultStarters,
  orderedBrowseCategories,
  rankGuideResources,
  resourcesForBrowseCategory,
  type GuideBrowseCategory,
  type GuideResource,
  type GuideResourceNeed,
} from '@/lib/resourceCatalog';

const STARTER_VISUALS: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; tint: string }
> = {
  'r-autism-speaks-100day': {
    icon: Sprout,
    tint: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  'r-navigate-life-texas': {
    icon: ClipboardList,
    tint: 'bg-violet-50 text-violet-600 border-violet-100',
  },
  'cg-toolbox': {
    icon: Heart,
    tint: 'bg-rose-50 text-rose-600 border-rose-100',
  },
  'r-cdc-milestones': {
    icon: Sparkles,
    tint: 'bg-sky-50 text-sky-600 border-sky-100',
  },
  'cg-what-is-aba': {
    icon: BookOpen,
    tint: 'bg-sky-50 text-sky-600 border-sky-100',
  },
  'cg-at-home': {
    icon: Home,
    tint: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  'cg-connect': {
    icon: Users,
    tint: 'bg-brand-plum-50 text-brand-plum-600 border-brand-plum-100',
  },
  'cg-financial': {
    icon: DollarSign,
    tint: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  'cg-hard-days': {
    icon: HeartHandshake,
    tint: 'bg-rose-50 text-rose-600 border-rose-100',
  },
};

const CATEGORY_ICONS: Record<
  GuideBrowseCategory,
  React.ComponentType<{ className?: string }>
> = {
  'understanding-autism': Compass,
  'education-iep': GraduationCap,
  'insurance-access': DollarSign,
  'support-for-you': Heart,
  community: Users,
};

const QUICK_FILTERS = [
  {
    id: 'right-now' as const,
    label: 'Right now',
    description: 'Grounding tools, crisis lines, quick relief.',
    className: 'border-rose-200/80 bg-gradient-to-br from-rose-50 to-white',
    accent: 'text-rose-700',
  },
  {
    id: 'understanding' as const,
    label: 'Understanding',
    description: 'ABA, diagnosis, IEPs, insurance, therapy terms.',
    className: 'border-sky-200/80 bg-gradient-to-br from-sky-50 to-white',
    accent: 'text-sky-700',
  },
  {
    id: 'support-for-you' as const,
    label: 'Support for you',
    description: 'Burnout, mental health, community, parent connection.',
    className: 'border-brand-plum-200/80 bg-gradient-to-br from-brand-plum-50 to-white',
    accent: 'text-brand-plum-700',
  },
];

function starterVisual(id: string) {
  return (
    STARTER_VISUALS[id] ?? {
      icon: BookOpen,
      tint: 'bg-brand-plum-50 text-brand-plum-600 border-brand-plum-100',
    }
  );
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState<GuideResourceNeed[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [expandedCategory, setExpandedCategory] = useState<GuideBrowseCategory | null>(
    null,
  );
  const [demoModalOpen, setDemoModalOpen] = useState<string | null>(null);

  const hasNeeds = selectedNeeds.length > 0;
  const hasSearch = searchQuery.trim().length > 0;

  const ranked = useMemo(
    () => rankGuideResources({ selectedNeeds, searchQuery }),
    [selectedNeeds, searchQuery],
  );

  const starters = useMemo(() => {
    if (hasNeeds || hasSearch) return ranked.slice(0, 3);
    return getDefaultStarters();
  }, [hasNeeds, hasSearch, ranked]);

  const featured = useMemo(() => {
    if (hasNeeds || hasSearch) return ranked.slice(0, 4);
    return getDefaultFeatured();
  }, [hasNeeds, hasSearch, ranked]);

  const browseOrder = useMemo(
    () => orderedBrowseCategories(selectedNeeds),
    [selectedNeeds],
  );

  const toggleNeed = (need: GuideResourceNeed) => {
    setSelectedNeeds((current) =>
      current.includes(need) ? current.filter((n) => n !== need) : [...current, need],
    );
  };

  const toggleQuickFilter = (filterId: keyof typeof QUICK_FILTER_NEEDS) => {
    const filterNeeds = QUICK_FILTER_NEEDS[filterId];
    setSelectedNeeds((current) => {
      const allSelected = filterNeeds.every((n) => current.includes(n));
      if (allSelected) return current.filter((n) => !filterNeeds.includes(n));
      const next = new Set(current);
      filterNeeds.forEach((n) => next.add(n));
      return [...next];
    });
  };

  const isQuickFilterActive = (filterId: keyof typeof QUICK_FILTER_NEEDS) =>
    QUICK_FILTER_NEEDS[filterId].every((n) => selectedNeeds.includes(n));

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandCategory = (category: GuideBrowseCategory) => {
    setExpandedCategory((current) => (current === category ? null : category));
  };

  return (
    <div className="page-shell pb-10">
      {/* Header */}
      <header className="page-header max-w-3xl">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Helpful Guides
        </p>
        <h1 className="page-title text-brand-navy-700">Resources that actually help.</h1>
        <p className="page-description text-[15px] text-brand-muted-700">
          Vetted, trusted resources chosen to answer the real questions parents ask.
        </p>
      </header>

      {/* Search */}
      <section className="mt-6" aria-label="Search resources">
        <div className="relative">
          <Search
            className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted-400"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by question, topic, or decision"
            className="w-full rounded-2xl border border-surface-border bg-white py-4 pl-14 pr-5 text-[15px] shadow-soft transition focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </section>

      {/* Quick-filter cards */}
      <section
        aria-label="Quick filters"
        className="mt-5 grid gap-3 sm:grid-cols-3"
      >
        {QUICK_FILTERS.map((filter) => {
          const active = isQuickFilterActive(filter.id);
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => toggleQuickFilter(filter.id)}
              className={cn(
                'group rounded-2xl border p-4 text-left shadow-soft transition duration-200',
                filter.className,
                active && 'ring-2 ring-primary/20',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={cn('text-sm font-bold', filter.accent)}>{filter.label}</p>
                <ArrowRight
                  className={cn(
                    'h-4 w-4 shrink-0 transition group-hover:translate-x-0.5',
                    filter.accent,
                  )}
                />
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-brand-muted-600">
                {filter.description}
              </p>
            </button>
          );
        })}
      </section>

      {/* Need matcher */}
      <section
        aria-label="Tell us what you need"
        className="mt-8 rounded-2xl border border-brand-plum-100 bg-brand-plum-50/40 p-5 shadow-soft sm:p-6"
      >
        <h2 className="text-lg font-bold text-brand-navy-700">Tell us what you need</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-brand-muted-600">
          Answer one or two quick questions and we&rsquo;ll show the best resources first.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {GUIDE_NEED_OPTIONS.map(({ id, label }) => {
            const selected = selectedNeeds.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleNeed(id)}
                aria-pressed={selected}
                className={cn(
                  'rounded-full border px-3.5 py-2 text-[13px] font-semibold transition duration-200',
                  selected
                    ? 'border-primary bg-primary text-white shadow-soft'
                    : 'border-surface-border bg-white text-brand-muted-700 hover:border-brand-plum-200 hover:bg-white',
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
        {hasNeeds && (
          <button
            type="button"
            onClick={() => setSelectedNeeds([])}
            className="mt-3 text-[12px] font-semibold text-brand-plum-700 hover:text-brand-plum-800"
          >
            Clear selections
          </button>
        )}
      </section>

      {/* Best place to start */}
      <section aria-label="Best place to start" className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold text-brand-navy-700">Best place to start</h2>
          {(hasNeeds || hasSearch) && (
            <p className="text-[12px] font-medium text-brand-muted-500">Updated for you</p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {starters.map((resource) => (
            <StarterCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>

      {/* Featured resources */}
      <section aria-label="Featured resources" className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-xl font-bold text-brand-navy-700">Featured resources</h2>
          <span className="text-[12px] font-medium text-brand-muted-500">
            {featured.length} curated
          </span>
        </div>
        {featured.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((resource) => (
              <FeaturedResourceCard
                key={resource.id}
                resource={resource}
                isSaved={savedIds.has(resource.id)}
                onToggleSave={() => toggleSave(resource.id)}
                onDemoClick={() => setDemoModalOpen(resource.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyResults onClear={() => setSearchQuery('')} />
        )}
      </section>

      {/* Browse by category */}
      <section aria-label="Browse by category" className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-brand-navy-700">Browse by category</h2>
        <div className="rounded-2xl border border-surface-border bg-white shadow-soft">
          {browseOrder.map((category) => {
            const Icon = CATEGORY_ICONS[category.id];
            const expanded = expandedCategory === category.id;
            const items = resourcesForBrowseCategory(
              category.id,
              selectedNeeds,
              searchQuery,
            );
            if (items.length === 0 && (hasSearch || hasNeeds)) return null;

            return (
              <div
                key={category.id}
                className="border-b border-surface-border last:border-b-0"
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => expandCategory(category.id)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-4 text-left transition duration-200 sm:px-5',
                    expanded ? 'bg-brand-plum-50/50' : 'hover:bg-surface-subtle/40',
                  )}
                >
                  <span
                    className={cn(
                      'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition',
                      expanded
                        ? 'border-brand-plum-200 bg-brand-plum-100 text-brand-plum-700'
                        : 'border-surface-border bg-primary/5 text-primary',
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-brand-navy-700">
                      {category.label}
                    </p>
                    <p className="mt-0.5 text-[13px] text-brand-muted-600">
                      {category.description}
                    </p>
                  </div>
                  <div className="hidden shrink-0 items-center gap-3 sm:flex">
                    <span className="text-[12px] font-medium text-brand-muted-500">
                      {items.length} resource{items.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-[12px] font-semibold text-primary">
                      View resources →
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-brand-muted-400 transition duration-200',
                      expanded && 'rotate-180',
                    )}
                  />
                </button>
                <div
                  className="toolbox-reveal grid"
                  data-open={expanded ? 'true' : 'false'}
                >
                  <div className="toolbox-reveal-inner min-h-0">
                    <div className="toolbox-reveal-content border-t border-surface-border bg-surface-subtle/30 px-4 py-3 sm:px-5">
                      {items.length === 0 ? (
                        <p className="py-2 text-[13px] text-brand-muted-500">
                          No resources in this category yet — we&rsquo;re vetting more.
                        </p>
                      ) : (
                        <ul className="divide-y divide-surface-border">
                          {items.map((resource) => (
                            <CompactResourceRow
                              key={resource.id}
                              resource={resource}
                              isSaved={savedIds.has(resource.id)}
                              onToggleSave={() => toggleSave(resource.id)}
                              onDemoClick={() => setDemoModalOpen(resource.id)}
                            />
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom callout */}
      <section className="mt-10 rounded-3xl border border-brand-plum-200 bg-gradient-to-br from-brand-plum-50 via-rose-50/40 to-white p-6 shadow-soft sm:p-8">
        <h2 className="text-xl font-bold text-brand-navy-700">Need help right now?</h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-brand-muted-700">
          You are not alone. Get support that fits what you need today.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <SupportActionCard
            href="/support/caregiver"
            icon={Heart}
            title="Mental health for caregivers"
            detail="Quick resets & tools"
          />
          <SupportActionCard
            href="/support/find"
            icon={MapPin}
            title="Find local help"
            detail="Therapists, groups, resources"
          />
          <SupportActionCard
            href="tel:988"
            icon={Phone}
            title="Crisis support"
            detail="Call or text 988 — 24/7"
            crisis
          />
        </div>
      </section>

      {demoModalOpen && (
        <DemoModal onClose={() => setDemoModalOpen(null)} />
      )}
    </div>
  );
}

function StarterCard({ resource }: { resource: GuideResource }) {
  const { icon: Icon, tint } = starterVisual(resource.id);
  const LinkWrap = resource.external ? 'a' : Link;
  const linkProps = resource.external
    ? { href: resource.href, target: '_blank', rel: 'noopener noreferrer' as const }
    : { href: resource.href };

  return (
    <LinkWrap
      {...linkProps}
      className="group flex h-full flex-col rounded-2xl border border-surface-border bg-white p-5 shadow-soft transition hover:border-brand-plum-200 hover:shadow-card"
    >
      <div
        className={cn(
          'mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border',
          tint,
        )}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="text-[15px] font-bold leading-snug text-brand-navy-700">
        {resource.title}
      </h3>
      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-brand-muted-600">
        {resource.shortDescription}
      </p>
      <span className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-border bg-surface-subtle text-brand-muted-600 transition group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary">
        <ArrowRight className="h-4 w-4" />
      </span>
    </LinkWrap>
  );
}

function FeaturedResourceCard({
  resource,
  isSaved,
  onToggleSave,
  onDemoClick,
}: {
  resource: GuideResource;
  isSaved: boolean;
  onToggleSave: () => void;
  onDemoClick: () => void;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-surface-border bg-white p-4 shadow-soft transition duration-200 hover:border-brand-plum-100 hover:shadow-card sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span
          className={cn(
            'inline-flex rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
            resource.categoryPillClass,
          )}
        >
          {resource.categoryLabel}
        </span>
        <button
          type="button"
          onClick={onToggleSave}
          className={cn(
            'rounded-lg p-1.5 transition',
            isSaved
              ? 'bg-primary/10 text-primary'
              : 'text-brand-muted-300 hover:bg-primary/5 hover:text-primary',
          )}
          aria-label={isSaved ? 'Remove saved resource' : 'Save resource'}
        >
          <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <h3 className="text-[15px] font-bold leading-snug text-brand-navy-700">
        {resource.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-brand-muted-600">
        {resource.shortDescription}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {resource.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-brand-muted-500"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto border-t border-surface-border pt-3">
        <p className="text-[11px] text-brand-muted-500">
          {resource.readTime} · {resource.source}
        </p>
        <ResourceCta
          resource={resource}
          onDemoClick={onDemoClick}
          className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:text-primary/80"
        >
          View resource <ArrowUpRight className="h-3.5 w-3.5" />
        </ResourceCta>
      </div>
    </article>
  );
}

function CompactResourceRow({
  resource,
  isSaved,
  onToggleSave,
  onDemoClick,
}: {
  resource: GuideResource;
  isSaved: boolean;
  onToggleSave: () => void;
  onDemoClick: () => void;
}) {
  return (
    <li className="flex items-start justify-between gap-3 py-3 first:pt-1 last:pb-1">
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-brand-navy-700">{resource.title}</p>
        <p className="mt-0.5 line-clamp-2 text-[13px] text-brand-muted-600">
          {resource.shortDescription}
        </p>
        <p className="mt-1 text-[11px] text-brand-muted-500">
          {resource.readTime} · {resource.source}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onToggleSave}
          className={cn(
            'rounded-lg p-2 transition',
            isSaved
              ? 'bg-primary/10 text-primary'
              : 'text-brand-muted-300 hover:bg-primary/5 hover:text-primary',
          )}
          aria-label={isSaved ? 'Remove saved resource' : 'Save resource'}
        >
          <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        <ResourceCta
          resource={resource}
          onDemoClick={onDemoClick}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-primary hover:bg-primary/5"
        >
          Open <ArrowUpRight className="h-3.5 w-3.5" />
        </ResourceCta>
      </div>
    </li>
  );
}

function ResourceCta({
  resource,
  onDemoClick,
  className,
  children,
}: {
  resource: GuideResource;
  onDemoClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  if (resource.isDemo) {
    return (
      <button type="button" onClick={onDemoClick} className={className}>
        {children}
      </button>
    );
  }
  if (resource.external) {
    return (
      <a
        href={resource.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={resource.href} className={className}>
      {children}
    </Link>
  );
}

function SupportActionCard({
  href,
  icon: Icon,
  title,
  detail,
  crisis,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  detail: string;
  crisis?: boolean;
}) {
  const className = cn(
    'group flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-soft transition hover:shadow-card',
    crisis ? 'border-rose-200 hover:border-rose-300' : 'border-surface-border hover:border-brand-plum-200',
  );
  const inner = (
    <>
      <span
        className={cn(
          'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          crisis ? 'bg-rose-50 text-rose-600' : 'bg-brand-plum-50 text-brand-plum-600',
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-brand-navy-700">{title}</p>
        <p className="text-[12px] text-brand-muted-600">{detail}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-brand-muted-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </>
  );

  if (href.startsWith('tel:')) {
    return (
      <a href={href} className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-surface-border bg-white py-12 text-center shadow-soft">
      <HelpCircle className="mx-auto h-9 w-9 text-brand-muted-300" />
      <p className="mt-3 text-[15px] font-semibold text-brand-navy-700">
        No resources match right now
      </p>
      <p className="mt-1 text-[13px] text-brand-muted-500">
        Try fewer filters or a broader search.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 text-[13px] font-semibold text-primary hover:text-primary/80"
      >
        Clear search
      </button>
    </div>
  );
}

function DemoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Example resource"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-surface-border bg-white p-6 shadow-card"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1 text-brand-muted-400 hover:bg-surface-subtle"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
          Example resource
        </p>
        <h3 className="mt-2 text-lg font-semibold text-brand-navy-700">
          This guide is still being vetted.
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-700">
          We&rsquo;ll publish the full version once review is complete. For now, try a featured
          resource above.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-primary/90"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
