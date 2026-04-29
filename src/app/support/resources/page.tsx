'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, Bookmark, BookOpen, Clock, Search, Tag } from 'lucide-react';
import {
  categoryMeta,
  resources,
  type ResourceCategory,
} from '@/lib/data';
import { cn } from '@/lib/utils';
import { StickyToc, type TocItem } from '@/components/ui/StickyToc';

/* Order of categories down the page (mirrors the TOC). */
const CATEGORY_ORDER: ResourceCategory[] = [
  'understanding-autism',
  'therapy-options',
  'daily-life',
  'education-iep',
  'caregiver-wellness',
  'community',
];

const RESOURCES_TOC: TocItem[] = CATEGORY_ORDER.map((cat, i) => ({
  num: String(i + 1).padStart(2, '0'),
  id: cat,
  label: categoryMeta[cat].label,
}));

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Group all resources by category, then filter each group by the search
  // query. A category section is hidden entirely when its filtered list is
  // empty so the TOC doesn't dead-link.
  const grouped = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = (text: string) => !q || text.toLowerCase().includes(q);

    return CATEGORY_ORDER.map((cat) => ({
      cat,
      items: resources.filter((r) => {
        if (r.category !== cat) return false;
        if (!q) return true;
        return (
          matchesQuery(r.title) ||
          matchesQuery(r.description) ||
          matchesQuery(r.question) ||
          r.tags.some((t) => matchesQuery(t))
        );
      }),
    }));
  }, [searchQuery]);

  const totalShown = grouped.reduce((acc, g) => acc + g.items.length, 0);
  const visibleToc = RESOURCES_TOC.filter((t) =>
    grouped.find((g) => g.cat === t.id)?.items.length ?? 0,
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-2">Helpful Guides</p>
        <h1 className="page-title">Resources that actually help.</h1>
        <p className="page-description">
          Vetted, trusted resources — not a firehose. Each one was chosen because it answers a
          real question parents are asking.
        </p>
        {/* 3-bucket guide */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Right Now', desc: 'If today is hard — grounding tools, crisis lines, quick relief.', color: 'border-rose-200 bg-rose-50 text-rose-700' },
            { label: 'Understanding', desc: 'ABA, IEP, insurance, therapy jargon — explained in plain English.', color: 'border-sky-200 bg-sky-50 text-sky-700' },
            { label: 'Support for You', desc: 'Burnout, mental health, community, couples — because you matter too.', color: 'border-brand-plum-200 bg-brand-plum-50 text-brand-plum-700' },
          ].map((bucket) => (
            <div key={bucket.label} className={`rounded-2xl border px-4 py-3 ${bucket.color}`}>
              <p className="text-xs font-bold uppercase tracking-wide">{bucket.label}</p>
              <p className="mt-1 text-xs leading-relaxed opacity-80">{bucket.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-brand-muted-500">
          Browse by category in the rail — or search by what you are going through right now.
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
        <StickyToc items={visibleToc.length > 0 ? visibleToc : RESOURCES_TOC} />

        <div className="space-y-8 md:space-y-10">
          {/* Search bar (category filter is gone — the TOC does that job). */}
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
                {totalShown} resource{totalShown !== 1 ? 's' : ''}
              </p>
            </div>
          </section>

          {/* One section per category — anchored for the TOC */}
          {grouped.map(({ cat, items }) => {
            if (items.length === 0) return null;
            const meta = categoryMeta[cat];
            return (
              <section key={cat} id={cat} className="scroll-mt-24">
                <div className="mb-4 flex items-end justify-between gap-3 border-b border-surface-border pb-3">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-muted-900">
                      <span aria-hidden>{meta.emoji}</span>
                      {meta.label}
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-muted-400">
                    {items.length} resource{items.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {items.map((resource) => {
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

                        <h3 className="text-base font-semibold leading-snug text-brand-muted-900">{resource.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-brand-muted-600">{resource.description}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-brand-muted-400">
                          <Tag className="h-3 w-3" />
                          {resource.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-md border border-surface-border bg-surface-muted px-2 py-0.5">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-surface-border pt-3 text-xs text-brand-muted-500">
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
                </div>
              </section>
            );
          })}

          {totalShown === 0 && (
            <div className="card py-14 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-brand-muted-300" />
              <h3 className="mt-4 text-lg font-semibold text-brand-muted-600">No resources match this search</h3>
              <p className="mt-1 text-sm text-brand-muted-500">
                Try a broader search, or use the category rail on the left to browse.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
