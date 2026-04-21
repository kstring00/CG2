import { ArrowRight, Calendar, Globe, Heart, MapPin, Shield, Users } from 'lucide-react';
import { DemoDataNotice } from '@/components/ui/DemoDataNotice';
import { TrustPanel } from '@/components/ui/TrustPanel';
import { communityGroups } from '@/lib/data';

const typeConfig: Record<string, { icon: typeof MapPin; color: string; badge: string }> = {
  local: { icon: MapPin, color: 'bg-primary/10 text-primary', badge: 'Local group' },
  online: { icon: Globe, color: 'bg-brand-plum-50 text-brand-plum-700', badge: 'Online community' },
  event: { icon: Calendar, color: 'bg-accent/10 text-accent', badge: 'Family event' },
};

export default function CommunityPage() {
  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="page-title">Community</h1>
        <p className="page-description">
          Community exists to reduce isolation, support long-term family sustainability, and make sure
          parents do not feel like every hard week has to be carried alone.
        </p>
      </header>

      <DemoDataNotice
        title="Example community spaces"
        description="Community names, member counts, and schedules are demo content. The categories, moderation framing, and support positioning reflect the intended product structure."
        compact
      />

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <TrustPanel
          eyebrow="Purpose of community"
          title="Belonging is part of sustainability"
          description="Community is not filler around the product. It helps lower isolation, reinforces steady engagement, and gives families a place to be understood outside appointments."
          meta={['Local', 'Online', 'Events', 'Moderated spaces']}
          icon={Heart}
        />
        <TrustPanel
          eyebrow="Guardrails"
          title="Connection should still feel protected"
          description="Community spaces should feel warm without becoming chaotic. Moderation, category clarity, and faith-style labeling help parents choose the environment that fits them best."
          meta={['Moderated spaces', 'Clear audience labels', 'Example group data marked']}
          icon={Shield}
          tone="muted"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {communityGroups.map((group) => {
          const config = typeConfig[group.type];
          const Icon = config.icon;
          return (
            <article key={group.id} className="card flex h-full flex-col p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${config.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg border border-surface-border bg-surface-muted px-2.5 py-1 text-xs font-semibold text-brand-muted-500">
                    {config.badge}
                  </span>
                  {group.isDemo && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-800">
                      Example group
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-brand-muted-900">{group.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{group.description}</p>

              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Who it is for</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{group.audience}</p>
                </div>
                <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Moderation</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">{group.moderation}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-brand-muted-500">
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {group.location}
                </p>
                <p className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {group.meetingSchedule}
                </p>
                <p className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {group.memberCount} active members
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-brand-muted-500">
                <span className="rounded-full border border-surface-border bg-white px-3 py-1">
                  {group.faithStyle === 'faith-based'
                    ? 'Faith-based'
                    : group.faithStyle === 'faith-friendly'
                      ? 'Faith-friendly'
                      : 'General'}
                </span>
                <span className="rounded-full border border-surface-border bg-white px-3 py-1">
                  Reviewed {group.lastReviewed}
                </span>
              </div>

              <button className="btn-secondary mt-5 w-full justify-between py-2.5 text-sm">
                See group details <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
