'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Heart,
  Link2,
  MessageSquare,
  Shield,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import {
  conversationPrompts,
  diagnosisStageLabels,
  mockParentMatches,
  peerGroups,
  struggleLabels,
  type ConnectionPreference,
  type DiagnosisStage,
  type Struggle,
  type SupportStyle,
} from '@/lib/data';
import { cn } from '@/lib/utils';

/* ─── Types ─────────────────────────────────────────────────── */
type AgeRange = '0-2' | '2-5' | '6-12' | '13-17';
type ActiveTab = 'get-started' | 'matches' | 'groups' | 'messages';

const ageRangeOptions: { value: AgeRange; label: string }[] = [
  { value: '0-2', label: '0–2 years' },
  { value: '2-5', label: '2–5 years' },
  { value: '6-12', label: '6–12 years' },
  { value: '13-17', label: '13–17 years' },
];

const stageOptions: { value: DiagnosisStage; label: string }[] = [
  { value: 'new', label: 'Newly diagnosed' },
  { value: 'ongoing', label: 'Ongoing journey' },
  { value: 'advanced', label: 'Experienced parent' },
];

const struggleOptions: { value: Struggle; label: string }[] = [
  { value: 'behavior', label: 'Behavior challenges' },
  { value: 'communication', label: 'Communication' },
  { value: 'school', label: 'School / IEP' },
  { value: 'burnout', label: 'Caregiver burnout' },
  { value: 'isolation', label: 'Feeling isolated' },
  { value: 'insurance', label: 'Insurance / access' },
];

const connectionOptions: { value: ConnectionPreference; label: string; icon: typeof MessageSquare }[] = [
  { value: 'text', label: 'Text', icon: MessageSquare },
  { value: 'call', label: 'Call / video', icon: Video },
  { value: 'group', label: 'Small group', icon: Users },
];

const styleOptions: { value: SupportStyle; label: string }[] = [
  { value: 'faith-based', label: 'Faith-based' },
  { value: 'general', label: 'General' },
];

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl border px-3.5 py-2 text-sm font-medium transition-all',
        active
          ? 'border-primary bg-primary text-white shadow-soft'
          : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary',
      )}
    >
      {children}
    </button>
  );
}

/* ─── Match Card ─────────────────────────────────────────────── */
function MatchCard({ match, prompts }: { match: (typeof mockParentMatches)[0]; prompts: typeof conversationPrompts }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const stageLabel = diagnosisStageLabels[match.diagnosisStage];
  const prompt = prompts.find((p) => p.id === selectedPrompt);

  return (
    <article className="rounded-3xl border border-surface-border bg-white p-5">
      {/* Header row */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-base font-bold text-primary">
          {match.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-brand-muted-900">{match.displayName}</p>
            <span className={cn('rounded-full border px-2.5 py-0.5 text-[11px] font-semibold', stageLabel.color)}>
              {stageLabel.label}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{match.bio}</p>
        </div>
        <div className="shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Match</p>
          <p className="text-lg font-bold text-emerald-700">{match.matchScore}%</p>
        </div>
      </div>

      {/* Struggles */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {match.struggles.map((s) => (
          <span key={s} className="rounded-full border border-surface-border bg-surface-muted px-2.5 py-0.5 text-xs text-brand-muted-600">
            {struggleLabels[s]}
          </span>
        ))}
        {match.connectionPreference.map((c) => (
          <span key={c} className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
            {c === 'text' ? 'Text' : c === 'call' ? 'Call / video' : 'Small group'}
          </span>
        ))}
      </div>

      {/* Why matched */}
      <div className="mt-4 rounded-2xl border border-surface-border bg-surface-muted p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted-400">Why this match</p>
        <ul className="mt-2 space-y-1">
          {match.matchReasons.map((r) => (
            <li key={r} className="flex items-start gap-2 text-xs text-brand-muted-700">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Expand */}
      {expanded && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted-400">What is shared with a match</p>
            <p className="mt-1 text-xs leading-relaxed text-brand-muted-600">{match.sharedInfo}</p>
          </div>
          <div className="rounded-2xl border border-surface-border bg-surface-muted p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted-400">What stays private</p>
            <p className="mt-1 text-xs leading-relaxed text-brand-muted-600">{match.keptPrivate}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-700">After a match</p>
            <p className="mt-1 text-xs leading-relaxed text-brand-muted-700">{match.nextStepAfterMatch}</p>
          </div>

          {/* Conversation prompt picker */}
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-brand-muted-600">
              Start with a conversation prompt — or write your own.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {conversationPrompts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPrompt(p.id === selectedPrompt ? null : p.id)}
                  className={cn(
                    'rounded-xl border px-3 py-1.5 text-xs transition-all',
                    p.id === selectedPrompt
                      ? 'border-primary bg-primary text-white'
                      : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30',
                  )}
                >
                  {p.text}
                </button>
              ))}
            </div>
            {prompt && (
              <div className="mt-3 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Selected opening</p>
                <p className="mt-1 text-sm font-medium text-brand-muted-900">&ldquo;{prompt.text}&rdquo;</p>
                <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90">
                  <MessageSquare className="h-3.5 w-3.5" /> Send this introduction (demo)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-surface-border pt-3">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-surface-muted px-4 py-2 text-xs font-semibold text-brand-muted-700 transition hover:border-primary/30 hover:text-primary"
        >
          {expanded ? 'Show less' : 'See more details'}
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90">
          <MessageSquare className="h-3.5 w-3.5" /> Connect (demo)
        </button>
      </div>
    </article>
  );
}

/* ─── Group Card ─────────────────────────────────────────────── */
function GroupCard({ group }: { group: (typeof peerGroups)[0] }) {
  const spotsLeft = group.maxMembers - group.memberCount;
  return (
    <article className="rounded-3xl border border-surface-border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className={cn(
              'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
              group.faithStyle === 'faith-based' ? 'border-amber-200 bg-amber-50 text-amber-800' :
              group.faithStyle === 'faith-friendly' ? 'border-amber-100 bg-amber-50/50 text-amber-700' :
              'border-surface-border bg-surface-muted text-brand-muted-500'
            )}>
              {group.faithStyle === 'faith-based' ? 'Faith-based' : group.faithStyle === 'faith-friendly' ? 'Faith-friendly' : 'General'}
            </span>
            <span className={cn(
              'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
              group.format === 'virtual' ? 'border-primary/20 bg-primary/5 text-primary' :
              group.format === 'in-person' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
              'border-brand-plum-100 bg-brand-plum-50 text-brand-plum-700'
            )}>
              {group.format === 'virtual' ? 'Virtual' : group.format === 'in-person' ? 'In-person' : 'Hybrid'}
            </span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-brand-muted-900">{group.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{group.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className={cn('text-sm font-bold', spotsLeft <= 2 ? 'text-accent' : 'text-emerald-600')}>
            {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
          </p>
          <p className="text-xs text-brand-muted-400">{group.memberCount}/{group.maxMembers}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-surface-border bg-surface-muted p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted-400">Who it is for</p>
          <p className="mt-1 text-xs leading-relaxed text-brand-muted-700">{group.audience}</p>
        </div>
        <div className="rounded-2xl border border-surface-border bg-surface-muted p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted-400">Moderation</p>
          <p className="mt-1 text-xs leading-relaxed text-brand-muted-700">{group.moderation}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {group.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-surface-border bg-white px-2.5 py-0.5 text-[11px] text-brand-muted-500">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-surface-border pt-3 text-xs text-brand-muted-500">
        <div className="flex flex-wrap gap-3">
          <span>{group.meetingSchedule}</span>
          <span>Hosted by {group.moderator}</span>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90">
          Request to join (demo)
        </button>
      </div>
    </article>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function ConnectPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('get-started');

  // Intake form state
  const [ageRanges, setAgeRanges] = useState<AgeRange[]>([]);
  const [stage, setStage] = useState<DiagnosisStage | null>(null);
  const [struggles, setStruggles] = useState<Struggle[]>([]);
  const [connections, setConnections] = useState<ConnectionPreference[]>([]);
  const [style, setStyle] = useState<SupportStyle | null>(null);
  const [intakeSubmitted, setIntakeSubmitted] = useState(false);

  const toggleArr = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const intakeComplete = ageRanges.length > 0 && stage !== null && struggles.length > 0 && connections.length > 0 && style !== null;

  const tabs: { id: ActiveTab; label: string; icon: typeof Sparkles; disabled?: boolean }[] = [
    { id: 'get-started', label: 'Get started', icon: Sparkles },
    { id: 'matches', label: 'Parent matches', icon: Heart },
    { id: 'groups', label: 'Small groups', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare, disabled: true },
  ];

  return (
    <div className="page-shell">
      {/* Header */}
      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <Link2 className="h-3.5 w-3.5" /> Parent connection
        </div>
        <h1 className="page-title">Connect with parents who get it.</h1>
        <p className="page-description">
          Protected parent-to-parent support for the moments when you need someone who understands —
          with clear privacy boundaries, moderation, and a path to more support if peer connection
          is not enough.
        </p>
      </header>

      {/* Four feature cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: Shield,
            eyebrow: 'Moderation',
            title: 'Conversations are moderated',
            body: 'A protected parent space with community boundaries, moderator oversight, and escalation guidance when peer support is not enough.',
            tags: ['Guided onboarding', 'Moderator support', 'Clear group norms'],
            color: 'bg-primary/10 text-primary',
          },
          {
            icon: Shield,
            eyebrow: 'Privacy',
            title: 'Only limited details are shared',
            body: 'Parents share stage, support preferences, and broad struggle themes. Identifying child details stay private until you choose otherwise.',
            tags: ['No child records shared', 'No address required', 'Opt-in only'],
            color: 'bg-emerald-100 text-emerald-700',
          },
          {
            icon: Sparkles,
            eyebrow: 'Matching',
            title: 'Matches based on stage and fit',
            body: 'Common Ground uses child age range, journey stage, struggle themes, support style, and preferred format to shape matches.',
            tags: ['Age range', 'Journey stage', 'Support preference'],
            color: 'bg-brand-plum-100 text-brand-plum-700',
          },
          {
            icon: Heart,
            eyebrow: 'Escalation',
            title: 'Peer support is not the final stop',
            body: 'If a parent needs therapy, advocacy, respite, or more structured help, Common Ground routes them there rather than leaving them unsupported.',
            tags: ['Use support services', 'Escalate early', 'Do not carry this alone'],
            color: 'bg-accent/10 text-accent',
          },
        ].map((card) => (
          <article key={card.eyebrow} className="rounded-3xl border border-surface-border bg-white p-5">
            <div className={cn('mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl', card.color)}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted-400">{card.eyebrow}</p>
            <h3 className="mt-1.5 text-sm font-semibold text-brand-muted-900">{card.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-brand-muted-600">{card.body}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {card.tags.map((t) => (
                <span key={t} className="rounded-full border border-surface-border bg-surface-muted px-2.5 py-0.5 text-[11px] text-brand-muted-500">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* Tab bar */}
      <div className="rounded-3xl border border-surface-border bg-white p-2">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all',
                tab.disabled
                  ? 'cursor-not-allowed text-brand-muted-300'
                  : activeTab === tab.id
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-brand-muted-600 hover:bg-surface-subtle hover:text-brand-muted-900',
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.disabled && (
                <span className="rounded-full border border-surface-border bg-surface-muted px-2 py-0.5 text-[10px] text-brand-muted-400">
                  Unlocks after match
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="mt-3 px-2 text-xs text-brand-muted-400">
          You can browse example matches and groups right away. Complete the short intake to tailor them to your stage.
        </p>
      </div>

      {/* ── GET STARTED tab ── */}
      {activeTab === 'get-started' && (
        <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          {/* Left: how it works */}
          <div className="space-y-5">
            <article className="rounded-3xl border border-surface-border bg-white p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted-400">How matching works</p>
              <h3 className="mt-1.5 text-base font-semibold text-brand-muted-900">A low-pressure way to ask for support</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
                Parents can choose text, calls, or small groups. A guided prompt helps start the
                conversation, and a moderator can support the introduction if needed.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Match by age and stage', 'Choose your format', 'Change preferences anytime'].map((t) => (
                  <span key={t} className="rounded-full border border-surface-border bg-surface-muted px-2.5 py-0.5 text-[11px] text-brand-muted-500">{t}</span>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-surface-border bg-white p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted-400">After a match</p>
              <h3 className="mt-1.5 text-base font-semibold text-brand-muted-900">The first step is simple</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted-600">
                Parents can send a guided introduction, ask for a moderator-supported intro, or move to
                a small group if 1:1 feels like too much right now.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Start with a prompt', 'Move at your pace', 'Use Support if peer help is not enough'].map((t) => (
                  <span key={t} className="rounded-full border border-surface-border bg-surface-muted px-2.5 py-0.5 text-[11px] text-brand-muted-500">{t}</span>
                ))}
              </div>
            </article>
          </div>

          {/* Right: intake form */}
          <div className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
            {intakeSubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                  <Heart className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-brand-muted-900">Preferences saved.</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-brand-muted-600">
                  Switch to the Parent Matches or Small Groups tabs to see who fits your stage.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('matches')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                  >
                    <Heart className="h-4 w-4" /> See parent matches <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('groups')}
                    className="inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-surface-muted px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition hover:border-primary/30"
                  >
                    <Users className="h-4 w-4" /> Browse small groups
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-brand-muted-900">Tell us what support feels right</h2>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">
                  This intake does not ask for identifying child details. It is here to make the first
                  support step feel safer and more relevant.
                </p>

                <div className="mt-6 space-y-6">
                  {/* Age range */}
                  <div>
                    <label className="block text-sm font-semibold text-brand-muted-800">Child age range</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ageRangeOptions.map((opt) => (
                        <Toggle key={opt.value} active={ageRanges.includes(opt.value)} onClick={() => setAgeRanges(toggleArr(ageRanges, opt.value))}>
                          {opt.label}
                        </Toggle>
                      ))}
                    </div>
                  </div>

                  {/* Stage */}
                  <div>
                    <label className="block text-sm font-semibold text-brand-muted-800">Journey stage</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {stageOptions.map((opt) => (
                        <Toggle key={opt.value} active={stage === opt.value} onClick={() => setStage(opt.value)}>
                          {opt.label}
                        </Toggle>
                      ))}
                    </div>
                  </div>

                  {/* Struggles */}
                  <div>
                    <label className="block text-sm font-semibold text-brand-muted-800">What is hardest right now?</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {struggleOptions.map((opt) => (
                        <Toggle key={opt.value} active={struggles.includes(opt.value)} onClick={() => setStruggles(toggleArr(struggles, opt.value))}>
                          {opt.label}
                        </Toggle>
                      ))}
                    </div>
                  </div>

                  {/* Connection format */}
                  <div>
                    <label className="block text-sm font-semibold text-brand-muted-800">Preferred connection format</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {connectionOptions.map((opt) => (
                        <Toggle key={opt.value} active={connections.includes(opt.value)} onClick={() => setConnections(toggleArr(connections, opt.value))}>
                          <span className="inline-flex items-center gap-1.5">
                            <opt.icon className="h-3.5 w-3.5" /> {opt.label}
                          </span>
                        </Toggle>
                      ))}
                    </div>
                  </div>

                  {/* Support style */}
                  <div>
                    <label className="block text-sm font-semibold text-brand-muted-800">Support style</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {styleOptions.map((opt) => (
                        <Toggle key={opt.value} active={style === opt.value} onClick={() => setStyle(opt.value)}>
                          {opt.label}
                        </Toggle>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => intakeComplete && setIntakeSubmitted(true)}
                  disabled={!intakeComplete}
                  className={cn(
                    'mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition',
                    intakeComplete ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-brand-muted-300',
                  )}
                >
                  Get my parent matches <ArrowRight className="h-4 w-4" />
                </button>
                {!intakeComplete && (
                  <p className="mt-2 text-center text-xs text-brand-muted-400">
                    Select at least one option in each section to continue.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── PARENT MATCHES tab ── */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-sm font-semibold text-amber-900">Example matching experience</p>
            <p className="mt-0.5 text-sm text-amber-800">
              Parent profiles and match scores are demo content. The moderation, privacy, and escalation patterns are the real product behavior.
            </p>
          </div>
          {mockParentMatches.map((match) => (
            <MatchCard key={match.id} match={match} prompts={conversationPrompts} />
          ))}
        </div>
      )}

      {/* ── SMALL GROUPS tab ── */}
      {activeTab === 'groups' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-sm font-semibold text-amber-900">Example group experience</p>
            <p className="mt-0.5 text-sm text-amber-800">
              Group names, member counts, and schedules are demo content. Moderation framing and privacy guardrails reflect real product behavior.
            </p>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {peerGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
