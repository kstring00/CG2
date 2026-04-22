'use client';

import { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Search,
  Shield,
  TriangleAlert,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { communityGroups, sensoryCategoryMeta, sensoryFriendlyPlaces, supportProviders } from '@/lib/data';
import { categoryMeta, verifiedProviders } from '@/lib/providers';

type SourceFilter = 'all' | 'providers-services' | 'sensory-friendly' | 'community' | 'help-support';

type UnifiedItem = {
  id: string;
  source: Exclude<SourceFilter, 'all'>;
  name: string;
  type: string;
  typeBadgeColor: string;
  description: string;
  location?: string;
  phone?: string;
  website?: string;
  rating?: number;
  tags: string[];
  whyHelpful?: string;
  isDemo: boolean;
  verifiedLabel?: string;
  verifiedColor?: string;
  details: Array<{ label: string; value: string }>;
};

const sourceMeta: Record<SourceFilter, { label: string }> = {
  all: { label: 'All' },
  'providers-services': { label: 'Providers & Services' },
  'sensory-friendly': { label: 'Sensory-Friendly Places' },
  community: { label: 'Community & Groups' },
  'help-support': { label: 'Help Lines & Support' },
};

function SupportCard({ item }: { item: UnifiedItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-3xl border border-surface-border bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold', item.typeBadgeColor)}>
          {item.type}
        </span>
        {item.verifiedLabel && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold',
              item.verifiedColor,
            )}
          >
            <Shield className="h-3 w-3" />
            {item.verifiedLabel}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-base font-semibold text-brand-muted-900">{item.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-muted-600">{item.description}</p>

      <div className="mt-3 flex flex-wrap gap-3 text-xs text-brand-muted-500">
        {item.location && (
          <p className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {item.location}
          </p>
        )}
        {item.phone && (
          <a href={`tel:${item.phone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center gap-1.5 hover:text-primary">
            <Phone className="h-3.5 w-3.5" />
            {item.phone}
          </a>
        )}
        {item.website && (
          <a
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-primary"
          >
            <Globe className="h-3.5 w-3.5" />
            Website
          </a>
        )}
      </div>

      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full border border-surface-border bg-surface-muted px-2 py-0.5 text-[11px] text-brand-muted-500">
              {tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary"
      >
        {expanded ? 'Less details' : 'More details'}
        {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-surface-border pt-3">
          {item.whyHelpful && (
            <div className="rounded-xl bg-primary/5 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Why helpful</p>
              <p className="mt-1 text-xs leading-relaxed text-brand-muted-700">{item.whyHelpful}</p>
            </div>
          )}
          {item.details.map((detail) => (
            <div key={detail.label} className="rounded-xl bg-surface-muted p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-muted-500">{detail.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-brand-muted-700">{detail.value}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default function FindSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSource, setActiveSource] = useState<SourceFilter>('all');

  const unifiedItems = useMemo<UnifiedItem[]>(() => {
    const providerItems: UnifiedItem[] = verifiedProviders.map((provider) => ({
      id: `provider-${provider.id}`,
      source: 'providers-services',
      name: provider.provider_name,
      type: categoryMeta[provider.category].label,
      typeBadgeColor: categoryMeta[provider.category].color,
      description: provider.why_it_may_help,
      location: provider.location,
      phone: provider.phone,
      website: provider.website,
      tags: [provider.age_range, ...provider.service_type.map((item) => item.replace('-', ' ')), ...provider.services.slice(0, 2)],
      whyHelpful: provider.why_it_may_help,
      isDemo: false,
      verifiedLabel: `Verified ${provider.last_verified_date}`,
      verifiedColor: 'bg-green-50 text-green-700 border-green-200',
      details: [
        { label: 'Helpful to know', value: provider.helpful_to_know },
        { label: 'Insurance notes', value: provider.insurance_notes },
        { label: 'Waitlist', value: provider.waitlist_status },
      ],
    }));

    const sensoryItems: UnifiedItem[] = sensoryFriendlyPlaces.map((place) => ({
      id: `sensory-${place.id}`,
      source: 'sensory-friendly',
      name: place.name,
      type: sensoryCategoryMeta[place.category].label,
      typeBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: place.description,
      location: `${place.city}, ${place.state}`,
      phone: place.phone,
      website: place.website,
      tags: [place.category, place.city, 'sensory-friendly'],
      whyHelpful: place.whatWorks,
      isDemo: place.isDemo,
      verifiedLabel: place.verificationSource === 'staff-vouched' ? 'Staff verified' : 'Community noted',
      verifiedColor:
        place.verificationSource === 'staff-vouched'
          ? 'bg-green-50 text-green-700 border-green-200'
          : place.verificationSource === 'parent-submitted'
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-amber-50 text-amber-700 border-amber-200',
      details: [
        { label: 'Before you go', value: place.whatToKnow },
        { label: 'Last reviewed', value: place.lastReviewed },
      ],
    }));

    const communityItems: UnifiedItem[] = communityGroups.map((group) => ({
      id: `community-${group.id}`,
      source: 'community',
      name: group.name,
      type: group.type === 'local' ? 'Local group' : group.type === 'online' ? 'Online community' : 'Family event',
      typeBadgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      description: group.description,
      location: group.location,
      tags: [group.audience, group.faithStyle, `${group.memberCount} members`],
      whyHelpful: group.moderation,
      isDemo: group.isDemo,
      verifiedLabel: 'Community reviewed',
      verifiedColor: 'bg-purple-50 text-purple-700 border-purple-200',
      details: [
        { label: 'Meeting schedule', value: group.meetingSchedule },
        { label: 'Audience', value: group.audience },
      ],
    }));

    const supportItems: UnifiedItem[] = supportProviders.map((provider) => ({
      id: `support-${provider.id}`,
      source: 'help-support',
      name: provider.name,
      type:
        provider.type === 'hotline'
          ? 'Help line'
          : provider.type === 'support-group'
            ? 'Support group'
            : provider.type === 'therapist'
              ? 'Therapist'
              : provider.type === 'respite'
                ? 'Respite'
                : 'Advocacy',
      typeBadgeColor: provider.type === 'hotline' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200',
      description: provider.description,
      location: provider.location,
      phone: provider.phone,
      website: provider.website,
      rating: provider.rating,
      tags: [provider.specialty, provider.urgency, provider.acceptsInsurance ? 'accepts insurance' : 'no insurance'],
      whyHelpful: provider.fit,
      isDemo: provider.isDemo,
      verifiedLabel: provider.verification,
      verifiedColor: 'bg-slate-100 text-slate-700 border-slate-200',
      details: [
        { label: 'Payment', value: provider.payment },
        { label: 'Access notes', value: provider.accessNotes },
      ],
    }));

    return [...providerItems, ...sensoryItems, ...communityItems, ...supportItems];
  }, []);

  const counts = useMemo(() => {
    return {
      all: unifiedItems.length,
      'providers-services': unifiedItems.filter((item) => item.source === 'providers-services').length,
      'sensory-friendly': unifiedItems.filter((item) => item.source === 'sensory-friendly').length,
      community: unifiedItems.filter((item) => item.source === 'community').length,
      'help-support': unifiedItems.filter((item) => item.source === 'help-support').length,
    };
  }, [unifiedItems]);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return unifiedItems.filter((item) => {
      const sourceMatch = activeSource === 'all' || item.source === activeSource;
      const searchMatch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        (item.location ?? '').toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query));

      return sourceMatch && searchMatch;
    });
  }, [activeSource, searchQuery, unifiedItems]);

  const hasFilters = activeSource !== 'all' || searchQuery !== '';

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="page-title">Find Support</h1>
      </header>

      <section className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-5 w-5 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-700">Need immediate help?</p>
            <p className="mt-1 text-sm text-red-700">
              Call or text <a href="tel:988" className="font-bold underline">988</a> · Harris Center Crisis Line{' '}
              <a href="tel:+17139707000" className="font-bold underline">(713) 970-7000</a> · Life-threatening emergency: call{' '}
              <a href="tel:911" className="font-bold underline">911</a>.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-surface-border bg-white p-4 sm:p-5">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, type, description, location, or tag..."
            className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-9 pr-10 text-sm outline-none ring-primary/20 transition focus:ring-2"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-brand-muted-400 hover:bg-surface-muted"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(sourceMeta) as SourceFilter[]).map((source) => (
            <button
              key={source}
              onClick={() => setActiveSource(source)}
              className={cn(
                'rounded-xl border px-3.5 py-2 text-sm font-medium transition',
                activeSource === source
                  ? 'border-primary bg-primary text-white shadow-soft'
                  : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary',
              )}
            >
              {sourceMeta[source].label} ({counts[source]})
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-surface-border bg-white p-10 text-center">
          <p className="text-base font-semibold text-brand-muted-900">No results found.</p>
          <p className="mt-2 text-sm text-brand-muted-600">
            Try a broader search or clear filters to see all support options.
          </p>
          {hasFilters && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveSource('all');
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-surface-border px-4 py-2 text-sm font-semibold text-primary"
            >
              Clear filters
            </button>
          )}
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <SupportCard key={item.id} item={item} />
          ))}
        </section>
      )}

      <p className="text-xs text-brand-muted-400">
        For direct websites, choose <ExternalLink className="mx-1 inline h-3 w-3" /> Website on each card.
      </p>
    </div>
  );
}
