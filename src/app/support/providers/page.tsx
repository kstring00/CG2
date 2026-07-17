'use client';

import { useMemo, useState } from 'react';
import {
  Phone,
  Globe,
  ChevronDown,
  ChevronUp,
  MapPin,
  Shield,
  Clock,
  ArrowRight,
  Search,
  X,
  AlertTriangle,
} from 'lucide-react';
import {
  providers,
  categoryMeta,
  recommendationMeta,
  startHereRoutes,
  type ProviderCategory,
  type RecommendationLevel,
  type StartHereRoute,
} from '@/lib/providers';
import { cn } from '@/lib/utils';

// ─── Filter state ──────────────────────────────────────────────────────────────

const allCategories = Object.entries(categoryMeta).map(([key, val]) => ({
  key: key as ProviderCategory,
  ...val,
}));

const allRecommendations = Object.entries(recommendationMeta).map(([key, val]) => ({
  key: key as RecommendationLevel,
  ...val,
}));

// ─── Sub-components ────────────────────────────────────────────────────────────

function StartHereCard({
  route,
  isActive,
  onClick,
}: {
  route: (typeof startHereRoutes)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all',
        isActive
          ? 'border-primary bg-primary text-white shadow-card'
          : 'border-surface-border bg-white hover:border-primary/30 hover:shadow-soft',
      )}
    >
      <span className="text-2xl">{route.emoji}</span>
      <span className={cn('text-sm font-semibold leading-snug', isActive ? 'text-white' : 'text-brand-muted-900')}>
        {route.label}
      </span>
      <span className={cn('text-xs leading-relaxed', isActive ? 'text-white/80' : 'text-brand-muted-500')}>
        {route.description}
      </span>
      <span
        className={cn(
          'mt-1 inline-flex items-center gap-1 text-xs font-semibold',
          isActive ? 'text-white/90' : 'text-primary',
        )}
      >
        Show resources <ArrowRight className="h-3 w-3" />
      </span>
    </button>
  );
}

function ProviderCard({ provider }: { provider: (typeof providers)[0] }) {
  const [expanded, setExpanded] = useState(false);
  const catMeta = categoryMeta[provider.category];
  const recMeta = recommendationMeta[provider.recommendation_level];

  return (
    <article
      className={cn(
        'rounded-3xl border bg-white p-5 shadow-soft transition-all',
        provider.recommendation_level === 'great-first-call'
          ? 'border-primary/20'
          : 'border-surface-border',
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className={cn('inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold', catMeta.color)}>
            <span>{catMeta.emoji}</span>
            {catMeta.label}
          </span>
          <span className={cn('inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold', recMeta.color)}>
            {recMeta.label}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-surface-border bg-surface-muted px-3 py-1 text-[11px] text-brand-muted-500">
          <Shield className="h-3 w-3" /> Verified {provider.last_verified_date}
        </span>
      </div>

      {/* Name & location */}
      <div className="mt-3">
        <h3 className="text-lg font-semibold leading-snug text-brand-muted-900">{provider.provider_name}</h3>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-brand-muted-500">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          {provider.location}
        </p>
      </div>

      {/* Why this may help */}
      <div className="mt-4 rounded-2xl bg-surface-muted p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Why This May Help Your Family</p>
        <p className="mt-2 text-sm leading-relaxed text-brand-muted-700">{provider.why_it_may_help}</p>
      </div>

      {/* Quick tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-md border border-surface-border bg-surface-muted px-2 py-1 text-xs text-brand-muted-500">
          Ages: {provider.age_range}
        </span>
        {provider.service_type.map((type) => (
          <span key={type} className="rounded-md border border-surface-border bg-surface-muted px-2 py-1 text-xs text-brand-muted-500 capitalize">
            {type.replace('-', ' ')}
          </span>
        ))}
        {provider.languages_offered.length > 1 && (
          <span className="rounded-md border border-surface-border bg-surface-muted px-2 py-1 text-xs text-brand-muted-500">
            {provider.languages_offered.join(' · ')}
          </span>
        )}
        {provider.referral_required === true && (
          <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700">
            Referral required
          </span>
        )}
      </div>

      {/* Contact bar */}
      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-surface-border pt-4">
        {provider.phone && provider.phone !== 'See website for current contact' && (
          <a
            href={`tel:${provider.phone.replace(/\D/g, '')}`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-dark hover:shadow-card"
          >
            <Phone className="h-4 w-4" />
            {provider.phone}
          </a>
        )}
        {provider.website && (
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-muted-700 transition-all hover:border-primary/20 hover:text-primary"
          >
            <Globe className="h-4 w-4" /> Visit website
          </a>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-brand-muted-500 hover:text-primary"
        >
          {expanded ? 'Show less' : 'Full details'}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-4 grid gap-3 border-t border-surface-border pt-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-500">Helpful to Know</p>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{provider.helpful_to_know}</p>
          </div>
          <div className="rounded-2xl bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-500">Insurance & Cost</p>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{provider.insurance_notes}</p>
          </div>
          <div className="rounded-2xl bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-500">Waitlist Status</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-muted-700">
              <Clock className="h-3.5 w-3.5" />
              {provider.waitlist_status}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-500">Services Offered</p>
            <ul className="mt-2 space-y-1">
              {provider.services.slice(0, 5).map((service) => (
                <li key={service} className="text-sm text-brand-muted-600 before:mr-2 before:content-['·']">
                  {service}
                </li>
              ))}
              {provider.services.length > 5 && (
                <li className="text-xs text-brand-muted-400">+{provider.services.length - 5} more — see website</li>
              )}
            </ul>
          </div>
          {provider.sensory_accommodations && (
            <div className="rounded-2xl bg-surface-muted p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-500">Sensory Accommodations</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{provider.sensory_accommodations}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ProvidersPage() {
  const [activeRoute, setActiveRoute] = useState<StartHereRoute | null>(null);
  const [activeCategories, setActiveCategories] = useState<Set<ProviderCategory>>(new Set());
  const [activeRecommendation, setActiveRecommendation] = useState<RecommendationLevel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // When a Start Here route is selected, set the categories to match
  const handleRouteSelect = (routeId: StartHereRoute) => {
    if (activeRoute === routeId) {
      setActiveRoute(null);
      setActiveCategories(new Set());
    } else {
      setActiveRoute(routeId);
      const route = startHereRoutes.find((r) => r.id === routeId)!;
      setActiveCategories(new Set(route.categories));
    }
  };

  const toggleCategory = (cat: ProviderCategory) => {
    setActiveRoute(null); // deselect guided route when manually filtering
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const clearFilters = () => {
    setActiveRoute(null);
    setActiveCategories(new Set());
    setActiveRecommendation(null);
    setSearchQuery('');
  };

  const hasFilters = activeCategories.size > 0 || activeRecommendation !== null || searchQuery !== '';

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchesCat = activeCategories.size === 0 || activeCategories.has(p.category);
      const matchesRec = !activeRecommendation || p.recommendation_level === activeRecommendation;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        p.provider_name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.why_it_may_help.toLowerCase().includes(query) ||
        p.services.some((s) => s.toLowerCase().includes(query)) ||
        categoryMeta[p.category].label.toLowerCase().includes(query);
      return matchesCat && matchesRec && matchesSearch;
    });
  }, [activeCategories, activeRecommendation, searchQuery]);

  const firstCallCount = filtered.filter((p) => p.recommendation_level === 'great-first-call').length;

  return (
    <div className="page-shell">
      {/* Page header */}
      <header className="page-header">
        <h1 className="page-title">Providers & Community Resources</h1>
        <p className="page-description">
          Every provider on this list is real, verifiable, and relevant to autism families in the Houston and Fort Bend area.
          We removed anything we couldn't confirm. Start with the section below if you're not sure where to begin.
        </p>
      </header>

      {/* Data integrity notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-800">How we verify this directory</p>
          <p className="mt-1 text-sm text-amber-700">
            Every entry has been confirmed against official websites and public sources. Phone numbers and service details
            change — always call to verify before your first visit. Last full audit: April 2026.
          </p>
        </div>
      </div>

      {/* ── START HERE section ─────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="section-title">Start Here</h2>
          <p className="mt-1 text-sm text-brand-muted-500">
            Choose the situation that best describes where you are right now. We'll filter to the most relevant resources.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {startHereRoutes.map((route) => (
            <StartHereCard
              key={route.id}
              route={route}
              isActive={activeRoute === route.id}
              onClick={() => handleRouteSelect(route.id)}
            />
          ))}
        </div>
        {activeRoute && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-sm text-primary">
              Showing <strong>{filtered.length} resources</strong> for{' '}
              <strong>"{startHereRoutes.find((r) => r.id === activeRoute)?.label}"</strong>
              {firstCallCount > 0 && ` — ${firstCallCount} marked "Great First Call"`}
            </p>
            <button
              onClick={clearFilters}
              className="ml-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
        )}
      </section>

      {/* ── FILTERS ────────────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-surface-border bg-white p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted-400" />
            <input
              type="text"
              placeholder="Search by name, service, or location…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveRoute(null);
              }}
              className="input-field pl-11"
            />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-brand-muted-500">
              {filtered.length} of {providers.length} providers
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-lg border border-surface-border bg-white px-3 py-2 text-xs font-medium text-brand-muted-600 hover:border-primary/20 hover:text-primary"
              >
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-400">Filter by type</p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => {
              const isActive = activeCategories.has(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => toggleCategory(cat.key)}
                  className={cn(
                    'rounded-xl border px-3 py-1.5 text-xs font-medium transition-all',
                    isActive
                      ? 'border-primary bg-primary text-white shadow-soft'
                      : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary',
                  )}
                >
                  <span className="mr-1">{cat.emoji}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recommendation level filters */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-400">Filter by priority</p>
          <div className="flex flex-wrap gap-2">
            {allRecommendations.map((rec) => (
              <button
                key={rec.key}
                onClick={() => setActiveRecommendation(activeRecommendation === rec.key ? null : rec.key)}
                className={cn(
                  'rounded-xl border px-3 py-1.5 text-xs font-medium transition-all',
                  activeRecommendation === rec.key
                    ? 'border-primary bg-primary text-white shadow-soft'
                    : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary',
                )}
              >
                {rec.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CRISIS BANNER (always visible) ────────────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
        <div>
          <p className="text-sm font-semibold text-red-800">If you or your child is in crisis right now</p>
          <p className="mt-1 text-sm text-red-700">
            Call or text <strong>988</strong> (24/7 mental health crisis line) or call{' '}
            <strong>(713) 970-7000</strong> (Harris Center crisis line, Houston). For life-threatening emergencies, call 911.
          </p>
        </div>
      </div>

      {/* ── PROVIDER CARDS ─────────────────────────────────────────────────────── */}

      {/* Great First Call section */}
      {filtered.some((p) => p.recommendation_level === 'great-first-call') && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-brand-muted-900">Great First Calls</h2>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              Start here
            </span>
          </div>
          <p className="mb-4 text-sm text-brand-muted-500">
            These are our highest-confidence starting points — real organizations with confirmed contact information and direct relevance to autism families.
          </p>
          <div className="grid gap-4 xl:grid-cols-2">
            {filtered
              .filter((p) => p.recommendation_level === 'great-first-call')
              .map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
          </div>
        </section>
      )}

      {/* Specialized Support section */}
      {filtered.some((p) => p.recommendation_level === 'specialized-support') && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-brand-muted-900">Specialized Support</h2>
          <p className="mb-4 text-sm text-brand-muted-500">
            For families with a specific, identified need. Best used once you know what you're looking for.
          </p>
          <div className="grid gap-4 xl:grid-cols-2">
            {filtered
              .filter((p) => p.recommendation_level === 'specialized-support')
              .map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
          </div>
        </section>
      )}

      {/* Community Resources section */}
      {filtered.some((p) => p.recommendation_level === 'community-resource') && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-brand-muted-900">Community Resources</h2>
          <p className="mb-4 text-sm text-brand-muted-500">
            Peer support, local programs, and community connection. These work best alongside clinical services.
          </p>
          <div className="grid gap-4 xl:grid-cols-2">
            {filtered
              .filter((p) => p.recommendation_level === 'community-resource')
              .map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
          </div>
        </section>
      )}

      {/* Backup Options section */}
      {filtered.some((p) => p.recommendation_level === 'backup-option') && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-brand-muted-900">Backup Options</h2>
          <p className="mb-4 text-sm text-brand-muted-500">
            Worth knowing about, especially if higher-priority options have long waitlists.
          </p>
          <div className="grid gap-4 xl:grid-cols-2">
            {filtered
              .filter((p) => p.recommendation_level === 'backup-option')
              .map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="card py-14 text-center">
          <Search className="mx-auto h-10 w-10 text-brand-muted-300" />
          <h3 className="mt-4 text-lg font-semibold text-brand-muted-600">No providers match this view</h3>
          <p className="mt-1 text-sm text-brand-muted-500">
            Try clearing your filters or adjusting your search.
          </p>
          <button onClick={clearFilters} className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
            Clear all filters
          </button>
        </div>
      )}

      {/* Footer trust note */}
      <div className="rounded-2xl border border-surface-border bg-surface-muted px-5 py-4">
        <p className="text-xs leading-relaxed text-brand-muted-500">
          <strong className="text-brand-muted-700">About this directory:</strong> Providers are included only if they
          are real, verifiable organizations with confirmed public contact information. We do not accept payment for
          inclusion. Entries are removed when information cannot be verified. Information changes — always call before
          your first visit. If you find an error, contact your care navigator.
        </p>
      </div>
    </div>
  );
}
