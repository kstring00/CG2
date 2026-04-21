'use client';

import { useMemo, useState } from 'react';
import { Bookmark, BookOpen, Clock, Search, Sparkles } from 'lucide-react';
import { DemoDataNotice } from '@/components/ui/DemoDataNotice';
import { TrustPanel } from '@/components/ui/TrustPanel';
import {
  categoryMeta,
  guidedSteps,
  resources,
  stageMeta,
  type JourneyStageId,
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
  const [activeStage, setActiveStage] = useState<JourneyStageId>('just-diagnosed');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () =>
      resources.filter((resource) => {
        const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
        const matchesStage = resource.journeyStages.includes(activeStage);
        const matchesSearch =
          !searchQuery ||
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesStage && matchesSearch;
      }),
    [activeCategory, activeStage, searchQuery],
  );

  const recommended = useMemo(
    () =>
      resources.find((resource) => resource.isFeatured && resource.journeyStages.includes(activeStage)) ??
      resources.find((resource) => resource.journeyStages.includes(activeStage)) ??
      resources[0],
    [activeStage],
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
        <h1 className="page-title">Resources &amp; Support Library</h1>
        <p className="page-description">
          This page is designed to answer the question in front of you, not flood you with more reading.
          Choose your stage first, then use the resources that support a real next decision.
        </p>
      </header>

      <DemoDataNotice
        title="Example resource library"
        description="Resource titles and summaries are demo content. Stage logic, reviewed labels, and action framing show how the real system would guide a parent."
        compact
      />

      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="section-title">For your stage</h2>
            <p className="mt-1 text-sm text-brand-muted-500">
              Select the family stage you are in so Common Ground can surface the most useful reading first.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {guidedSteps.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                  activeStage === stage.id
                    ? 'border-primary bg-primary text-white shadow-soft'
                    : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary'
                }`}
              >
                {stageMeta[stage.id].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-surface-border bg-surface-muted p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Recommended now</p>
                <h3 className="mt-2 text-xl font-semibold text-brand-muted-900">{recommended.title}</h3>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-muted-500">
                {recommended.readTime}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted-600">{recommended.description}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-surface-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Why this matters now</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{recommended.whyNow}</p>
              </div>
              <div className="rounded-2xl border border-surface-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Question it helps answer</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{recommended.question}</p>
              </div>
              <div className="rounded-2xl border border-surface-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Action it supports</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{recommended.action}</p>
              </div>
            </div>
          </article>

          <TrustPanel
            eyebrow="Resource guardrails"
            title="Built to guide a decision, not replace professional care"
            description="Resources explain what matters now, who they are for, and what action they support. They do not replace therapy, school advice, or crisis support."
            meta={['Reviewed labels visible', 'Stage-aware recommendations', 'Example content clearly marked']}
            icon={Sparkles}
            tone="muted"
          />
        </div>
      </section>

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
            {filtered.length} resource{filtered.length !== 1 ? 's' : ''} for {stageMeta[activeStage].label.toLowerCase()}
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
                {resource.isDemo && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800">
                    Example content
                  </span>
                )}
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
            Try a broader search or a different category for {stageMeta[activeStage].label.toLowerCase()}.
          </p>
        </div>
      )}
    </div>
  );
}
