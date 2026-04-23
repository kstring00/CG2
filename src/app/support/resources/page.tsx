'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, Bookmark, BookOpen, Clock, Search } from 'lucide-react';
import {
  categoryMeta,
  resources,
  type ResourceCategory,
} from '@/lib/data';
import { cn } from '@/lib/utils';

const allCategories: { key: ResourceCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All categories' },
  ...Object.entries(categoryMeta).map(([key, val]) => ({
    key: key as ResourceCategory,
    label: val.label,
  })),
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () =>
      resources.filter((resource) => {
        const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
        const matchesSearch =
          !searchQuery ||
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      }),
    [activeCategory, searchQuery],
  );

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="page-title">Helpful right now</h1>
        <p className="page-description">
          Choose your stage and we surface the resources that matter for where you are — not a
          giant list to scroll through. Each one is from a trusted source and chosen because it
          answers a real question parents in your stage are asking.
        </p>
      </header>

      <section className="rounded-3xl border border-surface-border bg-white p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted-400" />
            <input
              type="text"
              placeholder="Search by question, topic, or decision"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="input-field pl-11"
            />
          </div>
          <p className="text-sm text-brand-muted-500">
            {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={cn(
                'rounded-xl border px-3.5 py-2 text-sm font-medium transition-all',
                activeCategory === category.key
                  ? 'border-primary bg-primary text-white shadow-soft'
                  : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary',
              )}
            >
              {category.key !== 'all' && (
                <span className="mr-1.5">{categoryMeta[category.key as ResourceCategory].emoji}</span>
              )}
              {category.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {filtered.map((resource) => {
          const meta = categoryMeta[resource.category];
          const isSaved = savedIds.has(resource.id);
          return (
            <article key={resource.id} className="card flex h-full flex-col p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold ${meta.color}`}>
                    {meta.emoji} {meta.label}
                  </span>
                  <span className="rounded-full border border-surface-border bg-surface-muted px-3 py-1 text-[11px] font-medium text-brand-muted-500">
                    {resource.lastUpdated}
                  </span>
                </div>
                <button
                  onClick={() => toggleSave(resource.id)}
                  className={cn(
                    'rounded-lg p-2 transition-colors',
                    isSaved
                      ? 'bg-primary/10 text-primary'
                      : 'text-brand-muted-300 hover:bg-primary/5 hover:text-primary',
                  )}
                  aria-label={isSaved ? 'Remove saved resource' : 'Save resource'}
                >
                  <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>

              <h3 className="text-lg font-semibold leading-snug text-brand-muted-900">{resource.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{resource.description}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Who it is for</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{resource.whoItsFor}</p>
                </div>
                <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Question it helps answer</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{resource.question}</p>
                </div>
                <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Why this matters now</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{resource.whyNow}</p>
                </div>
                <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Action it supports</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{resource.action}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span key={tag} className="rounded-md border border-surface-border bg-surface-muted px-2 py-1 text-xs text-brand-muted-500">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-surface-border pt-3 text-xs text-brand-muted-500">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {resource.readTime}
                  </span>
                  <span>{resource.reviewedBy}</span>
                </div>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    Visit resource <ArrowUpRight className="h-3 w-3" />
                  </a>
                ) : resource.isDemo ? (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800">
                    Example content
                  </span>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>

      {filtered.length === 0 && (
        <div className="card py-14 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-brand-muted-300" />
          <h3 className="mt-4 text-lg font-semibold text-brand-muted-600">No resources match this view</h3>
          <p className="mt-1 text-sm text-brand-muted-500">
            Try a broader search or a different category.
          </p>
        </div>
      )}
    </div>
  );
}
