'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { DemoDataNotice } from '@/components/ui/DemoDataNotice';
import {
  sensoryCategoryMeta,
  sensoryFriendlyPlaces,
  sensoryVerificationLabels,
  type SensoryPlaceCategory,
} from '@/lib/data';

type CityFilter = 'all' | 'Katy' | 'Sugar Land' | 'Pearland' | 'Houston' | 'Multiple';

const cityOptions: { id: CityFilter; label: string }[] = [
  { id: 'all', label: 'All locations' },
  { id: 'Katy', label: 'Katy' },
  { id: 'Sugar Land', label: 'Sugar Land' },
  { id: 'Pearland', label: 'Pearland' },
  { id: 'Houston', label: 'Houston' },
  { id: 'Multiple', label: 'Statewide / multiple' },
];

export default function SensoryFriendlyPage() {
  const [categoryFilter, setCategoryFilter] = useState<SensoryPlaceCategory | 'all'>('all');
  const [cityFilter, setCityFilter] = useState<CityFilter>('all');

  const filteredPlaces = useMemo(() => {
    return sensoryFriendlyPlaces.filter((place) => {
      const categoryMatch = categoryFilter === 'all' || place.category === categoryFilter;
      const cityMatch = cityFilter === 'all' || place.city === cityFilter;
      return categoryMatch && cityMatch;
    });
  }, [categoryFilter, cityFilter]);

  // Build category list with counts so parents see what is actually available
  const categoryOptions = useMemo(() => {
    const counts = new Map<SensoryPlaceCategory, number>();
    sensoryFriendlyPlaces.forEach((place) => {
      counts.set(place.category, (counts.get(place.category) ?? 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="page-title">Sensory-friendly guide &amp; vetted providers</h1>
        <p className="page-description">
          Dentists, haircuts, developmental pediatricians, therapists, mental health support, advocacy
          organizations, and more — all vetted for autism families in Sugar Land, Katy, and Pearland.
          No hunting through Facebook threads. Just places you can call today.
        </p>
      </header>

      <DemoDataNotice
        compact
        title="Vetted providers for Sugar Land, Katy, and Pearland"
        description="Every provider on this list has been researched and vetted. Verified badges mean our team has confirmed their autism-friendly approach. Always call ahead to confirm insurance and accommodations."
      />

      {/* Why this exists */}
      <section className="rounded-3xl border border-primary/10 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-brand-muted-900">
              Every place here has been checked.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
              A green badge means someone from our team has personally visited or worked with the
              business. A blue badge means a parent in our community recommended it. An amber badge
              means the business runs a sensory-friendly program on its own schedule.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Filter by category
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                categoryFilter === 'all'
                  ? 'border-primary bg-primary text-white shadow-soft'
                  : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary'
              }`}
            >
              All ({sensoryFriendlyPlaces.length})
            </button>
            {categoryOptions.map(([category, count]) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                  categoryFilter === category
                    ? 'border-primary bg-primary text-white shadow-soft'
                    : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary'
                }`}
              >
                <span className="mr-1.5">{sensoryCategoryMeta[category].emoji}</span>
                {sensoryCategoryMeta[category].label} ({count})
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Filter by city
          </p>
          <div className="flex flex-wrap gap-2">
            {cityOptions.map((city) => (
              <button
                key={city.id}
                onClick={() => setCityFilter(city.id)}
                className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                  cityFilter === city.id
                    ? 'border-primary bg-primary text-white shadow-soft'
                    : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary'
                }`}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      {filteredPlaces.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-surface-border bg-white p-8 text-center">
          <p className="text-base font-semibold text-brand-muted-900">Nothing yet in that combo.</p>
          <p className="mt-2 text-sm text-brand-muted-600">
            Try a different category or city, or let us know what you are looking for — we are
            growing this list based on what families actually need.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredPlaces.map((place) => {
            const verification = sensoryVerificationLabels[place.verificationSource];
            return (
              <article
                key={place.id}
                className="flex flex-col rounded-3xl border border-surface-border bg-white p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-2xl">{sensoryCategoryMeta[place.category].emoji}</p>
                    <h3 className="mt-2 text-lg font-semibold text-brand-muted-900">
                      {place.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-brand-muted-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {place.city}, {place.state}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${verification.color}`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {place.verificationSource === 'staff-vouched' ? 'Verified' : 'Noted'}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-brand-muted-600">
                  {place.description}
                </p>

                <div className="mt-4 rounded-2xl bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    What works
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-muted-700">
                    {place.whatWorks}
                  </p>
                </div>

                <div className="mt-3 rounded-2xl bg-brand-plum-50/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-plum-700">
                    What to know before you go
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-muted-700">
                    {place.whatToKnow}
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                  {place.phone && (
                    <a
                      href={`tel:${place.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3 py-2 text-sm font-semibold text-primary hover:border-primary/30"
                    >
                      <Phone className="h-4 w-4" />
                      {place.phone}
                    </a>
                  )}
                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3 py-2 text-sm font-semibold text-primary hover:border-primary/30"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>

                <p className="mt-4 text-[11px] uppercase tracking-wide text-brand-muted-400">
                  {verification.label} · Last reviewed {place.lastReviewed}
                </p>
              </article>
            );
          })}
        </section>
      )}

      {/* Suggest a place CTA — community engagement hook */}
      <section className="rounded-3xl border border-surface-border bg-gradient-to-br from-white to-brand-warm-50 p-6 sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-brand-muted-900">
              Know a place that should be here?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted-600">
              If you have a dentist, barber, restaurant, or anywhere else that gets it, tell us. Our
              team will reach out to verify before adding it — your name and info stay private.
            </p>
          </div>
          <button
            disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary"
          >
            Suggestion form coming soon
          </button>
        </div>
      </section>
    </div>
  );
}
