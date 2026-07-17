'use client';

import { useMemo, useState } from 'react';
import { Filter, Shield, Sparkles } from 'lucide-react';
import { TrustPanel } from '@/components/ui/TrustPanel';
import {
  guidedSteps,
  stageMeta,
  supportProviders,
  type JourneyStageId,
} from '@/lib/data';
import { cn } from '@/lib/utils';

const filterOptions = [
  { key: 'all', label: 'All routes' },
  { key: 'therapist', label: 'Therapists' },
  { key: 'support-group', label: 'Support groups' },
  { key: 'hotline', label: 'Helplines' },
  { key: 'respite', label: 'Respite' },
  { key: 'advocacy', label: 'Advocacy' },
];

export default function SupportPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeStage, setActiveStage] = useState<JourneyStageId>('just-diagnosed');

  const verifiedProviders = useMemo(
    () => supportProviders.filter((provider) => !provider.isDemo),
    [],
  );

  const filtered = useMemo(
    () =>
      verifiedProviders.filter((provider) => {
        const matchesType = activeFilter === 'all' || provider.type === activeFilter;
        const matchesStage = provider.journeyStages.includes(activeStage);
        return matchesType && matchesStage;
      }),
    [activeFilter, activeStage, verifiedProviders],
  );

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="page-title">Support Services</h1>
        <p className="page-description">
          This page is for triage and support routing. Only verified, contactable providers are shown.
        </p>
      </header>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <TrustPanel
          eyebrow="How to use this page"
          title="Start with the lightest route that still helps"
          description="Choose the support route that best fits the family’s current pressure and stage."
          meta={['Verified listings only', 'Stage-aware routing', 'Clear next steps']}
          icon={Sparkles}
        />
        <TrustPanel
          eyebrow="Guardrails"
          title="Accuracy matters more than a full-looking directory"
          description="We would rather show no listing than publish an unverified name, phone number, website, rating, or schedule."
          meta={['No placeholders', 'No demo contacts', 'No fabricated ratings']}
          icon={Shield}
          tone="muted"
        />
      </section>

      <section className="rounded-3xl border border-surface-border bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="section-title">Choose the stage you need support for</h2>
            <p className="mt-1 text-sm text-brand-muted-500">
              Different problems call for different support routes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {guidedSteps.map((stage) => (
              <button
                key={stage.id}
                type="button"
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

        <div className="mt-4 flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setActiveFilter(option.key)}
              className={cn(
                'rounded-xl border px-3.5 py-2 text-sm font-medium',
                activeFilter === option.key
                  ? 'border-primary bg-primary text-white'
                  : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 && (
        <div className="card py-14 text-center">
          <Filter className="mx-auto h-10 w-10 text-brand-muted-300" />
          <h3 className="mt-4 text-lg font-semibold text-brand-muted-700">
            No verified providers are published for this view yet
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-brand-muted-500">
            Placeholder contacts and demo listings have been removed. Use the verified resource directory or contact Texas ABA Centers directly for current navigation support.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href="/support/find" className="btn-primary px-4 py-2.5 text-sm">
              Open verified resource directory
            </a>
            <a href="tel:8777715725" className="btn-secondary px-4 py-2.5 text-sm">
              Call Texas ABA Centers: (877) 771-5725
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
