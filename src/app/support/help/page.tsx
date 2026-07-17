'use client';

import { useMemo, useState } from 'react';
import {
  ExternalLink,
  Filter,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Star,
} from 'lucide-react';
import { DemoDataNotice } from '@/components/ui/DemoDataNotice';
import { TrustPanel } from '@/components/ui/TrustPanel';
import {
  guidedSteps,
  stageMeta,
  supportProviders,
  type JourneyStageId,
} from '@/lib/data';
import { cn } from '@/lib/utils';

const typeLabels: Record<string, { label: string; color: string }> = {
  therapist: { label: 'Caregiver therapist', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  'support-group': { label: 'Parent support group', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  hotline: { label: 'Helpline / referral', color: 'bg-red-50 text-red-700 border-red-200' },
  respite: { label: 'Respite support', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  advocacy: { label: 'School advocacy', color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

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

  const filtered = useMemo(
    () =>
      supportProviders.filter((provider) => {
        const matchesType = activeFilter === 'all' || provider.type === activeFilter;
        const matchesStage = provider.journeyStages.includes(activeStage);
        return matchesType && matchesStage;
      }),
    [activeFilter, activeStage],
  );

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="page-title">Support Services</h1>
        <p className="page-description">
          This page is for triage and support routing. Use it when the family needs another layer of help,
          not when a parent is expected to just keep carrying more.
        </p>
      </header>

      <DemoDataNotice
        title="Some listings here are examples while we expand our verified network"
        description="Look for the &ldquo;Example listing&rdquo; tag — those are placeholders. Listings tagged &ldquo;Verified by Texas ABA Centers&rdquo; are real, vetted providers you can contact today."
      />

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <TrustPanel
          eyebrow="How to use this page"
          title="Start with the lightest route that still helps"
          description="If the parent is worn down, start with the lowest-friction support first: a helpline, support group, respite option, or caregiver counselor depending on urgency and fit."
          meta={[
            'Stage-aware support routing',
            'Clear use-case guidance',
            'Example listings marked visibly',
          ]}
          icon={Sparkles}
        />
        <TrustPanel
          eyebrow="Guardrails"
          title="Peer support is helpful, but not enough for every situation"
          description="If a family needs therapy, crisis response, or structured advocacy, Common Ground should route them there clearly instead of leaving them in a peer-only loop."
          meta={['Escalate early', 'Use the right route', 'Protect parent capacity']}
          icon={Shield}
          tone="muted"
        />
      </section>

      <section className="rounded-3xl border border-surface-border bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="section-title">Choose the stage you need support for</h2>
            <p className="mt-1 text-sm text-brand-muted-500">
              Different problems call for different support routes. Start with the stage that best matches the family pressure right now.
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

        <div className="mt-4 flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.key}
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

      <section className="space-y-4">
        {filtered.map((provider) => {
          const typeMeta = typeLabels[provider.type];
          return (
            <article key={provider.id} className="card p-5 sm:p-6">
              <div className="flex flex-col gap-5 xl:flex-row">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-brand-muted-900">{provider.name}</h2>
                    <span className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${typeMeta.color}`}>
                      {typeMeta.label}
                    </span>
                    {provider.isDemo && (
                      <span
                        className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-800"
                        title="Placeholder while we expand our verified provider network"
                      >
                        Example listing — not yet activated
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-primary">{provider.specialty}</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{provider.description}</p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Ideal use case</p>
                      <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{provider.fit}</p>
                    </div>
                    <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">When to use</p>
                      <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{provider.urgency}</p>
                    </div>
                    <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Payment & insurance</p>
                      <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{provider.payment}</p>
                    </div>
                    <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Access notes</p>
                      <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{provider.accessNotes}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-brand-muted-500 sm:grid-cols-2">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {provider.location}
                    </p>
                    {provider.phone ? (
                      <p className={cn('flex items-center gap-1.5', provider.isDemo && 'text-brand-muted-400')}>
                        <Phone className="h-4 w-4" />
                        <span className={cn(provider.isDemo && 'line-through')}>{provider.phone}</span>
                        {provider.isDemo && <span className="ml-1 text-[11px] italic">(example)</span>}
                      </p>
                    ) : (
                      <span />
                    )}
                    <p className="flex items-center gap-1.5">
                      <Shield className={cn('h-4 w-4', provider.acceptsInsurance ? 'text-green-600' : 'text-brand-muted-400')} />
                      {provider.acceptsInsurance ? 'Accepts insurance' : 'No insurance billing listed'}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
                      {provider.rating} family rating
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-brand-muted-500">
                    <span className="rounded-full border border-surface-border bg-white px-3 py-1">{provider.verification}</span>
                    <span className="rounded-full border border-surface-border bg-white px-3 py-1">Reviewed {provider.lastReviewed}</span>
                  </div>

                  {provider.isDemo && (
                    <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-[12px] leading-snug text-amber-900">
                      Contact info will be added when this provider is added to our network.
                    </p>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2 xl:w-[220px]">
                  <button
                    type="button"
                    disabled={provider.isDemo}
                    className={cn(
                      'btn-primary px-4 py-2.5 text-sm',
                      provider.isDemo && 'cursor-not-allowed opacity-60 hover:bg-primary',
                    )}
                  >
                    {provider.isDemo ? 'Available once activated' : (
                      <>Use this support route <ExternalLink className="h-4 w-4" /></>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={provider.isDemo}
                    className={cn(
                      'btn-secondary px-4 py-2.5 text-sm',
                      provider.isDemo && 'cursor-not-allowed opacity-60',
                    )}
                  >
                    Keep this option handy
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {filtered.length === 0 && (
        <div className="card py-14 text-center">
          <Filter className="mx-auto h-10 w-10 text-brand-muted-300" />
          <h3 className="mt-4 text-lg font-semibold text-brand-muted-600">No support routes match this view</h3>
          <p className="mt-1 text-sm text-brand-muted-500">
            Try a broader route type or a different stage to keep the support list useful.
          </p>
        </div>
      )}
    </div>
  );
}
