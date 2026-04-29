'use client';

import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  Languages,
  Link2,
  Lock,
  MessageCircle,
  MessageSquare,
  Phone,
  Shield,
  ShieldCheck,
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
type Locale = 'en' | 'es';

/* ─── EN/ES copy ────────────────────────────────────────────── */
const connectCopy = {
  en: {
    eyebrow: 'Parent Connection',
    headline: "You don't have to explain it. They already know.",
    subhead:
      'Connect with other parents who are living this — same stage, same struggles, same long days. Moderated, private, and low-pressure.',
    ctaPrimary: 'Find my match',
    ctaSecondary: 'Browse small groups',
    trustModerated: 'Moderated',
    trustPrivate: 'Private',
    trustFree: 'Free',
    trustStripAria: 'How this space is run',
    testimonialQuote: '“I didn’t have to start at the beginning. They already knew.”',
    testimonialMeta: 'Parent of a 6-year-old, 14 months in',
    testimonialBadge: 'Parent voice',
    crisisBannerLead: 'In crisis right now?',
    crisisBannerCallText: 'Call or text 988 — free, confidential, 24/7.',
    crisisBannerLinkLabel: 'Call 988',
    languageToggle: 'Español',

    // Pillars
    pillarsAria: 'How Parent Connection works',
    pillarModerationEyebrow: 'Moderation',
    pillarModerationTitle: 'Real moderators in every space',
    pillarModerationLead:
      'Moderators set the tone, reset hard threads, and step in when a conversation needs care.',
    threadModNote: 'A gentle reminder before we share: stories stay in this room.',
    threadParent1Name: 'Parent A',
    threadParent1Reply: 'Thank you. That helps me actually post tonight.',
    threadParent2Name: 'Parent B',
    threadParent2Reply: 'Same. The structure is part of why I keep showing up.',

    pillarPrivacyEyebrow: 'Privacy',
    pillarPrivacyTitle: 'Your child stays private. Always.',
    pillarPrivacyLead: 'Three commitments, in plain language.',
    privacyItem1: 'No child records, names, schools, or diagnoses are ever shared.',
    privacyItem2: 'No home address required — ever.',
    privacyItem3: 'Opt-in only. Nothing is shared with another parent until you say so.',

    pillarMatchingEyebrow: 'Matching',
    pillarMatchingTitle: 'Matched by stage and fit, not by algorithm guessing',
    pillarMatchingLead:
      'We use four signals — and only four — to suggest parents who actually get your week.',
    matchAxisAge: 'Age range',
    matchAxisStage: 'Journey stage',
    matchAxisFormat: 'Format',
    matchAxisStyle: 'Support style',
    matchAxisAgeHint: 'e.g. 6–12',
    matchAxisStageHint: 'e.g. ongoing',
    matchAxisFormatHint: 'e.g. text · group',
    matchAxisStyleHint: 'e.g. faith-based',

    pillarMoreEyebrow: 'When you need more',
    pillarMoreTitle: 'Peer support is not the last stop.',
    pillarMoreLead:
      'If peer support isn’t enough, we don’t leave you holding it. Three real exits, always reachable.',
    pillarMoreLinkFind: 'Find a vetted provider',
    pillarMoreLinkMental: 'Mental health for caregivers',
    pillarMoreLinkCrisis: 'Crisis support — 988',
  },
  es: {
    eyebrow: 'Conexión entre padres',
    headline: 'No tienes que explicarlo. Ya lo entienden.',
    subhead:
      'Conecta con otros padres que están viviendo esto — la misma etapa, las mismas luchas, los mismos días largos. Moderado, privado y sin presión.',
    ctaPrimary: 'Encontrar mi conexión',
    ctaSecondary: 'Ver grupos pequeños',
    trustModerated: 'Moderado',
    trustPrivate: 'Privado',
    trustFree: 'Gratis',
    trustStripAria: 'Cómo se mantiene este espacio',
    testimonialQuote: '“No tuve que empezar desde el principio. Ya lo entendían.”',
    testimonialMeta: 'Madre de un niño de 6 años, 14 meses en este camino',
    testimonialBadge: 'Voz de un padre',
    crisisBannerLead: '¿Estás en crisis ahora?',
    crisisBannerCallText: 'Llama o envía mensaje al 988 — gratis, confidencial, 24/7.',
    crisisBannerLinkLabel: 'Llamar al 988',
    languageToggle: 'English',

    // Pillars
    pillarsAria: 'Cómo funciona la conexión entre padres',
    pillarModerationEyebrow: 'Moderación',
    pillarModerationTitle: 'Moderadores reales en cada espacio',
    pillarModerationLead:
      'Los moderadores marcan el tono, reencauzan los hilos difíciles y ayudan cuando una conversación necesita cuidado.',
    threadModNote: 'Recordatorio suave antes de compartir: lo que se cuenta aquí, se queda aquí.',
    threadParent1Name: 'Padre A',
    threadParent1Reply: 'Gracias. Eso me ayuda a publicar esta noche.',
    threadParent2Name: 'Madre B',
    threadParent2Reply: 'Igual. La estructura es parte de por qué sigo viniendo.',

    pillarPrivacyEyebrow: 'Privacidad',
    pillarPrivacyTitle: 'Tu hijo permanece privado. Siempre.',
    pillarPrivacyLead: 'Tres compromisos, en lenguaje claro.',
    privacyItem1: 'Nunca se comparten registros, nombres, escuelas ni diagnósticos del niño.',
    privacyItem2: 'Nunca se requiere dirección de casa.',
    privacyItem3: 'Solo si tú aceptas. Nada se comparte con otro padre hasta que lo decidas.',

    pillarMatchingEyebrow: 'Emparejamiento',
    pillarMatchingTitle: 'Por etapa y afinidad, no por adivinanzas algorítmicas',
    pillarMatchingLead:
      'Usamos cuatro señales — y solo cuatro — para sugerir padres que entienden tu semana.',
    matchAxisAge: 'Rango de edad',
    matchAxisStage: 'Etapa del camino',
    matchAxisFormat: 'Formato',
    matchAxisStyle: 'Estilo de apoyo',
    matchAxisAgeHint: 'p. ej. 6–12',
    matchAxisStageHint: 'p. ej. en curso',
    matchAxisFormatHint: 'p. ej. texto · grupo',
    matchAxisStyleHint: 'p. ej. con base en la fe',

    pillarMoreEyebrow: 'Cuando necesitas más',
    pillarMoreTitle: 'El apoyo entre padres no es la última parada.',
    pillarMoreLead:
      'Si el apoyo entre padres no alcanza, no te dejamos sostenerlo. Tres salidas reales, siempre disponibles.',
    pillarMoreLinkFind: 'Buscar un proveedor verificado',
    pillarMoreLinkMental: 'Salud mental para cuidadores',
    pillarMoreLinkCrisis: 'Apoyo en crisis — 988',
  },
} as const;

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
  const [locale, setLocale] = useState<Locale>('en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('get-started');
  const t = connectCopy[locale];

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
      {/* Sticky 988 mini-banner — quiet, persistent crisis line. Pins below
          the support nav header so it's always within reach without
          dominating this connection-focused page. */}
      <div
        className="sticky top-[56px] z-10 -mx-4 -mt-6 border-b border-amber-200/70 bg-amber-50/95 backdrop-blur-md sm:-mx-6 sm:-mt-8 lg:-mx-8"
        role="region"
        aria-label="Crisis support"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 text-[12px] text-amber-900">
            <Phone className="h-3.5 w-3.5" aria-hidden />
            <span className="font-semibold">{t.crisisBannerLead}</span>
            <span className="hidden sm:inline">{t.crisisBannerCallText}</span>
          </p>
          <a
            href="tel:988"
            className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-amber-900 transition-colors hover:bg-amber-100"
          >
            <Phone className="h-3 w-3" aria-hidden />
            {t.crisisBannerLinkLabel}
          </a>
        </div>
      </div>

      {/* Hero — headline (the whole page in one line), subhead, two CTAs,
          trust strip, and a parent-voice testimonial card on the right. */}
      <header className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              {t.eyebrow}
            </p>
            <button
              type="button"
              onClick={() => setLocale((l) => (l === 'en' ? 'es' : 'en'))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-white px-2.5 py-1 text-[11px] font-semibold text-brand-muted-600 hover:border-primary/30 hover:text-primary"
              aria-label="Toggle language"
            >
              <Languages className="h-3.5 w-3.5" />
              <span>{locale === 'en' ? 'EN' : 'ES'}</span>
              <span className="text-brand-muted-400">·</span>
              <span>{t.languageToggle}</span>
            </button>
          </div>
          <h1 className="mt-2 text-3xl font-bold leading-[1.1] tracking-tight text-brand-muted-900 sm:text-[2.25rem] lg:text-[2.6rem]">
            {t.headline}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-muted-600">
            {t.subhead}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setActiveTab('get-started');
                if (typeof window !== 'undefined') {
                  requestAnimationFrame(() =>
                    document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                  );
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-dark"
            >
              {t.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              onClick={() => {
                setActiveTab('groups');
                if (typeof window !== 'undefined') {
                  requestAnimationFrame(() =>
                    document.getElementById('groups')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                  );
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition-colors hover:border-primary/30 hover:text-primary"
            >
              {t.ctaSecondary}
            </button>
          </div>

          <ul
            className="mt-4 inline-flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-semibold text-brand-muted-500"
            aria-label={t.trustStripAria}
          >
            <li className="inline-flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-emerald-600" aria-hidden /> {t.trustModerated}
            </li>
            <li aria-hidden className="text-brand-muted-300">·</li>
            <li className="inline-flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-emerald-600" aria-hidden /> {t.trustPrivate}
            </li>
            <li aria-hidden className="text-brand-muted-300">·</li>
            <li className="inline-flex items-center gap-1.5">
              <Heart className="h-3 w-3 text-emerald-600" aria-hidden /> {t.trustFree}
            </li>
          </ul>
        </div>

        {/* Parent-voice testimonial card */}
        <figure className="relative overflow-hidden rounded-3xl border border-brand-plum-100 bg-gradient-to-br from-brand-plum-50 via-white to-brand-warm-100 p-6 shadow-soft sm:p-7">
          <div
            aria-hidden
            className="absolute -top-10 -right-8 h-40 w-40 rounded-full bg-brand-plum-100/60 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-brand-warm-200/70 blur-2xl"
          />
          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-plum-700 ring-1 ring-brand-plum-200">
            <Sparkles className="h-3 w-3" aria-hidden />
            {t.testimonialBadge}
          </span>
          <blockquote className="relative mt-4">
            <p className="text-[18px] font-semibold leading-snug text-brand-muted-900 sm:text-[20px]">
              {t.testimonialQuote}
            </p>
          </blockquote>
          <figcaption className="relative mt-4 flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-plum-100 text-[11px] font-bold text-brand-plum-700"
            >
              ✦
            </span>
            <span className="text-[12.5px] text-brand-muted-600">{t.testimonialMeta}</span>
          </figcaption>
        </figure>
      </header>

      {/* Pillars — four cards, four different treatments. Privacy is the
          load-bearing promise so it gets the visually heaviest card. */}
      <section
        aria-label={t.pillarsAria}
        className="grid gap-4 lg:grid-cols-2"
      >
        {/* Moderation — show, don't tell. A miniature moderated thread. */}
        <article className="group/card relative rounded-3xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Shield className="h-4 w-4" aria-hidden />
            </span>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-muted-400">
              {t.pillarModerationEyebrow}
            </p>
          </div>
          <h3 className="text-[17px] font-semibold leading-snug text-brand-muted-900">
            {t.pillarModerationTitle}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-brand-muted-600">
            {t.pillarModerationLead}
          </p>

          {/* Mock moderated thread — purely illustrative. */}
          <div
            aria-hidden
            className="mt-4 space-y-2 rounded-2xl border border-surface-border bg-surface-muted/60 p-3"
          >
            <div className="flex items-start gap-2">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                M
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11.5px] font-semibold text-brand-muted-900">Mod</span>
                  <span className="rounded-full bg-primary/10 px-1.5 py-0 text-[9.5px] font-bold uppercase tracking-wider text-primary">
                    Moderator
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] leading-snug text-brand-muted-700">
                  {t.threadModNote}
                </p>
              </div>
            </div>

            <div className="ml-9 flex items-start gap-2">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-plum-100 text-[10px] font-bold text-brand-plum-700">
                A
              </span>
              <div className="min-w-0 flex-1 rounded-xl border border-surface-border bg-white px-2.5 py-1.5">
                <p className="text-[11px] font-semibold text-brand-muted-900">{t.threadParent1Name}</p>
                <p className="text-[11.5px] leading-snug text-brand-muted-600">
                  {t.threadParent1Reply}
                </p>
              </div>
            </div>

            <div className="ml-9 flex items-start gap-2">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                B
              </span>
              <div className="min-w-0 flex-1 rounded-xl border border-surface-border bg-white px-2.5 py-1.5">
                <p className="text-[11px] font-semibold text-brand-muted-900">{t.threadParent2Name}</p>
                <p className="text-[11.5px] leading-snug text-brand-muted-600">
                  {t.threadParent2Reply}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Privacy — heaviest card. Deep navy panel with white text +
            three checkmark commitments. AAA contrast on body copy. */}
        <article className="relative overflow-hidden rounded-3xl border border-brand-navy-700 bg-gradient-to-br from-brand-navy-700 via-brand-navy-600 to-brand-navy-500 p-5 text-white shadow-card sm:p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -right-12 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl"
          />
          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                <ShieldCheck className="h-4 w-4" aria-hidden />
              </span>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                {t.pillarPrivacyEyebrow}
              </p>
            </div>
            <h3 className="text-[18px] font-semibold leading-snug text-white sm:text-[19px]">
              {t.pillarPrivacyTitle}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/85">{t.pillarPrivacyLead}</p>

            <ul className="mt-5 space-y-3">
              {[t.privacyItem1, t.privacyItem2, t.privacyItem3].map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 ring-1 ring-emerald-300/40"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-200" />
                  </span>
                  <span className="text-[14px] leading-snug text-white">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* Matching — the four matching axes as chips that highlight on hover. */}
        <article className="rounded-3xl border border-surface-border bg-white p-5 shadow-soft sm:p-6">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-plum-100 text-brand-plum-700">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-muted-400">
              {t.pillarMatchingEyebrow}
            </p>
          </div>
          <h3 className="text-[17px] font-semibold leading-snug text-brand-muted-900">
            {t.pillarMatchingTitle}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-brand-muted-600">
            {t.pillarMatchingLead}
          </p>

          <ul
            aria-label={t.pillarMatchingEyebrow}
            className="mt-4 grid grid-cols-2 gap-2"
          >
            {[
              { label: t.matchAxisAge, hint: t.matchAxisAgeHint },
              { label: t.matchAxisStage, hint: t.matchAxisStageHint },
              { label: t.matchAxisFormat, hint: t.matchAxisFormatHint },
              { label: t.matchAxisStyle, hint: t.matchAxisStyleHint },
            ].map((axis, i) => (
              <li
                key={axis.label}
                className={cn(
                  'group/axis relative overflow-hidden rounded-xl border border-surface-border bg-surface-muted/40 px-3 py-2 transition-all',
                  'motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-brand-plum-300 motion-safe:hover:bg-brand-plum-50',
                )}
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-brand-plum-400 transition-transform duration-300 group-hover/axis:scale-x-100"
                />
                <p className="text-[12px] font-semibold text-brand-muted-900">{axis.label}</p>
                <p className="mt-0.5 text-[11px] text-brand-muted-500">{axis.hint}</p>
              </li>
            ))}
          </ul>
        </article>

        {/* When you need more — a door, not a wall. Three explicit exits. */}
        <article className="rounded-3xl border border-surface-border bg-gradient-to-br from-white to-brand-warm-100 p-5 shadow-soft sm:p-6">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-muted-400">
              {t.pillarMoreEyebrow}
            </p>
          </div>
          <h3 className="text-[17px] font-semibold leading-snug text-brand-muted-900">
            {t.pillarMoreTitle}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-brand-muted-600">
            {t.pillarMoreLead}
          </p>

          <ul className="mt-4 space-y-2">
            {[
              { label: t.pillarMoreLinkFind, href: '/support/find', icon: Users },
              { label: t.pillarMoreLinkMental, href: '/support/mental-health', icon: Heart },
              { label: t.pillarMoreLinkCrisis, href: 'tel:988', icon: Phone, accent: true },
            ].map((row) => (
              <li key={row.label}>
                <a
                  href={row.href}
                  className={cn(
                    'group/exit flex items-center justify-between gap-3 rounded-xl border border-surface-border bg-white px-3 py-2.5 text-[13px] font-semibold transition-colors',
                    row.accent
                      ? 'text-red-700 hover:border-red-200 hover:bg-red-50'
                      : 'text-brand-muted-800 hover:border-primary/30 hover:bg-primary/5 hover:text-primary',
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <row.icon className="h-3.5 w-3.5" aria-hidden />
                    {row.label}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-brand-muted-400 transition-transform motion-safe:group-hover/exit:translate-x-0.5 motion-safe:group-hover/exit:-translate-y-0.5 group-hover/exit:text-current"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>
        </article>
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
        <div id="intake" className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
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
        <div id="groups" className="space-y-4">
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
