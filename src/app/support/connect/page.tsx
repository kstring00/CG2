'use client';

import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  Languages,
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
  diagnosisStageLabels,
  mockParentMatches,
  peerGroups,
  type ConnectionPreference,
  type DiagnosisStage,
  type Struggle,
  type SupportStyle,
} from '@/lib/data';
import { cn } from '@/lib/utils';

/* ─── Types ─────────────────────────────────────────────────── */
type AgeRange = '0-2' | '2-5' | '6-12' | '13-17';
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

    // Intake
    intakeEyebrow: 'A short intake',
    intakeTitle: 'Tell us what support feels right',
    intakeSub:
      'We do not ask for identifying child details. Five quick questions to make the first step feel safer and more relevant.',
    intakeProgress: (done: number, total: number) => `${done} of ${total} answered`,
    intakeStep1Title: 'Child age range',
    intakeStep1Hint: 'Pick one or more — helps us match you with parents at the same stage of growth.',
    intakeStep2Title: 'Where are you in the journey?',
    intakeStep2Hint: 'Pick one. There is no wrong answer.',
    intakeStep3Eyebrow: 'The human moment',
    intakeStep3Title: 'What is hardest right now?',
    intakeStep3Reassure: 'Pick what fits today. You can change this anytime.',
    intakeStep3Hint: 'Pick one or more.',
    intakeStep4Title: 'How would you like to connect?',
    intakeStep4Hint: 'Pick one or more — text, calls, small groups, or any combination.',
    intakeStep5Title: 'Support style',
    intakeStep5Hint: 'Pick one. We use this to surface compatible parents and groups.',
    intakeInlineRequired: 'Pick at least one to continue.',
    intakeSectionDone: 'Done',
    intakeSubmit: 'Get my parent matches',
    intakeSubmitHint: 'We’ll show you 3–5 matches. You choose if and when to reach out.',
    intakeSubmittedHeading: 'Preferences saved.',
    intakeSubmittedBody: 'Scroll down to preview the kind of matches and groups that fit your answers.',
    intakeSubmittedSeeMatches: 'See parent matches',
    intakeSubmittedSeeGroups: 'Browse small groups',
    intakeOptionAge02: '0–2 years',
    intakeOptionAge25: '2–5 years',
    intakeOptionAge612: '6–12 years',
    intakeOptionAge1317: '13–17 years',
    intakeOptionStageNew: 'Newly diagnosed',
    intakeOptionStageOngoing: 'Ongoing journey',
    intakeOptionStageAdvanced: 'Experienced parent',
    intakeOptionStruggleBehavior: 'Behavior challenges',
    intakeOptionStruggleCommunication: 'Communication',
    intakeOptionStruggleSchool: 'School / IEP',
    intakeOptionStruggleBurnout: 'Caregiver burnout',
    intakeOptionStruggleIsolation: 'Feeling isolated',
    intakeOptionStruggleInsurance: 'Insurance / access',
    intakeOptionConnectText: 'Text',
    intakeOptionConnectCall: 'Call / video',
    intakeOptionConnectGroup: 'Small group',
    intakeOptionStyleFaith: 'Faith-based',
    intakeOptionStyleGeneral: 'General',

    // Preview
    previewEyebrow: 'Preview',
    previewTitle: 'What matches look like',
    previewSub:
      'Sample profiles styled exactly like the real product. Use these to get a feel — answer the intake above for real, tailored suggestions.',
    previewMatchesHeading: 'Example parent matches',
    previewGroupsHeading: 'Example small groups',
    previewMatchBadge: 'Example match',
    previewGroupBadge: 'Example group',
    previewBioLead: 'In their words',
    previewMatchCtaGuided: 'Guided intro',
    previewMatchCtaMod: 'Moderator-supported intro',
    previewGroupCta: 'Request to join',
    previewDemoNote:
      'Names, schedules, and any specific details are placeholders — real listings replace these once a navigator approves them.',
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

    // Intake
    intakeEyebrow: 'Un cuestionario breve',
    intakeTitle: 'Cuéntanos qué apoyo se siente correcto',
    intakeSub:
      'No pedimos detalles que identifiquen al niño. Cinco preguntas rápidas para que el primer paso se sienta más seguro y relevante.',
    intakeProgress: (done: number, total: number) => `${done} de ${total} contestadas`,
    intakeStep1Title: 'Rango de edad del niño',
    intakeStep1Hint: 'Elige una o más — ayuda a emparejarte con padres en la misma etapa.',
    intakeStep2Title: '¿En qué punto del camino estás?',
    intakeStep2Hint: 'Elige una. No hay respuesta incorrecta.',
    intakeStep3Eyebrow: 'El momento humano',
    intakeStep3Title: '¿Qué es lo más difícil ahora?',
    intakeStep3Reassure: 'Elige lo que encaje hoy. Puedes cambiarlo cuando quieras.',
    intakeStep3Hint: 'Elige una o más.',
    intakeStep4Title: '¿Cómo prefieres conectar?',
    intakeStep4Hint: 'Elige una o más — texto, llamadas, grupos o cualquier combinación.',
    intakeStep5Title: 'Estilo de apoyo',
    intakeStep5Hint: 'Elige una. Usamos esto para sugerir padres y grupos compatibles.',
    intakeInlineRequired: 'Elige al menos una opción para continuar.',
    intakeSectionDone: 'Listo',
    intakeSubmit: 'Ver mis emparejamientos',
    intakeSubmitHint: 'Te mostraremos de 3 a 5 emparejamientos. Tú decides si y cuándo escribir.',
    intakeSubmittedHeading: 'Preferencias guardadas.',
    intakeSubmittedBody: 'Desplázate para ver el tipo de emparejamientos y grupos que encajan con tus respuestas.',
    intakeSubmittedSeeMatches: 'Ver emparejamientos',
    intakeSubmittedSeeGroups: 'Ver grupos pequeños',
    intakeOptionAge02: '0–2 años',
    intakeOptionAge25: '2–5 años',
    intakeOptionAge612: '6–12 años',
    intakeOptionAge1317: '13–17 años',
    intakeOptionStageNew: 'Recién diagnosticado',
    intakeOptionStageOngoing: 'Camino en curso',
    intakeOptionStageAdvanced: 'Padre con experiencia',
    intakeOptionStruggleBehavior: 'Retos de comportamiento',
    intakeOptionStruggleCommunication: 'Comunicación',
    intakeOptionStruggleSchool: 'Escuela / IEP',
    intakeOptionStruggleBurnout: 'Agotamiento del cuidador',
    intakeOptionStruggleIsolation: 'Sentirse aislado',
    intakeOptionStruggleInsurance: 'Seguro / acceso',
    intakeOptionConnectText: 'Texto',
    intakeOptionConnectCall: 'Llamada / video',
    intakeOptionConnectGroup: 'Grupo pequeño',
    intakeOptionStyleFaith: 'Con base en la fe',
    intakeOptionStyleGeneral: 'General',

    // Preview
    previewEyebrow: 'Vista previa',
    previewTitle: 'Cómo se ven los emparejamientos',
    previewSub:
      'Perfiles de muestra con el mismo estilo que el producto real. Úsalos para hacerte una idea — responde al cuestionario para obtener sugerencias reales.',
    previewMatchesHeading: 'Ejemplos de padres compatibles',
    previewGroupsHeading: 'Ejemplos de grupos pequeños',
    previewMatchBadge: 'Ejemplo',
    previewGroupBadge: 'Ejemplo',
    previewBioLead: 'En sus palabras',
    previewMatchCtaGuided: 'Introducción guiada',
    previewMatchCtaMod: 'Introducción con moderador',
    previewGroupCta: 'Pedir unirme',
    previewDemoNote:
      'Los nombres, horarios y detalles específicos son temporales — los listados reales los reemplazarán cuando un navegador los apruebe.',
  },
} as const;

const ageRangeValues: AgeRange[] = ['0-2', '2-5', '6-12', '13-17'];
const stageValues: DiagnosisStage[] = ['new', 'ongoing', 'advanced'];
const struggleValues: Struggle[] = [
  'behavior',
  'communication',
  'school',
  'burnout',
  'isolation',
  'insurance',
];
const connectionValues: { value: ConnectionPreference; icon: typeof MessageSquare }[] = [
  { value: 'text', icon: MessageSquare },
  { value: 'call', icon: Video },
  { value: 'group', icon: Users },
];
const styleValues: SupportStyle[] = ['faith-based', 'general'];

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
      aria-pressed={active}
      className={cn(
        'rounded-xl border px-3.5 py-2 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
        active
          ? 'border-primary bg-primary text-white shadow-soft'
          : 'border-surface-border bg-white text-brand-muted-600 hover:border-primary/30 hover:text-primary',
      )}
    >
      {children}
    </button>
  );
}

/* ─── Intake section wrapper ────────────────────────────────── */
interface IntakeSectionProps {
  number: number;
  total: number;
  done: boolean;
  invalid: boolean;
  title: string;
  hint: string;
  doneLabel: string;
  errorLabel: string;
  /** Render the section as the page's "human moment" — softer
   *  inset background, eyebrow + reassurance line above the title. */
  human?: boolean;
  eyebrow?: string;
  reassurance?: string;
  children: React.ReactNode;
}

function IntakeSection({
  number,
  total,
  done,
  invalid,
  title,
  hint,
  doneLabel,
  errorLabel,
  human,
  eyebrow,
  reassurance,
  children,
}: IntakeSectionProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4 sm:p-5 transition-colors',
        human
          ? 'border-brand-plum-100 bg-gradient-to-br from-brand-plum-50/60 via-white to-brand-warm-100/40'
          : 'border-surface-border bg-white',
        invalid && 'border-red-300 bg-red-50/40',
      )}
      aria-invalid={invalid || undefined}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {human && eyebrow && (
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
              {eyebrow}
            </p>
          )}
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-muted-400">
            {number} / {total}
          </p>
          <h3
            className={cn(
              'mt-1 text-[15.5px] font-semibold leading-snug text-brand-muted-900 sm:text-base',
              human && 'text-[16px]',
            )}
          >
            {title}
          </h3>
          {human && reassurance && (
            <p className="mt-1.5 text-[12.5px] italic leading-snug text-brand-plum-700/85">
              {reassurance}
            </p>
          )}
          <p className="mt-1 text-[12px] text-brand-muted-500">{hint}</p>
        </div>
        {done && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700"
            aria-label={doneLabel}
          >
            <Check className="h-3 w-3" aria-hidden />
            {doneLabel}
          </span>
        )}
      </div>
      <div className="mt-3">{children}</div>
      {invalid && (
        <p
          className="mt-2 text-[12px] font-semibold text-red-700"
          role="alert"
          aria-live="polite"
        >
          {errorLabel}
        </p>
      )}
    </div>
  );
}

/* ─── Preview match card ────────────────────────────────────── */
interface PreviewMatchCardProps {
  match: (typeof mockParentMatches)[0];
  locale: Locale;
}

function PreviewMatchCard({ match, locale }: PreviewMatchCardProps) {
  const t = connectCopy[locale];
  const stageLabel = diagnosisStageLabels[match.diagnosisStage];
  const formatChip = (c: ConnectionPreference): string => {
    if (c === 'text') return t.intakeOptionConnectText;
    if (c === 'call') return t.intakeOptionConnectCall;
    return t.intakeOptionConnectGroup;
  };
  const ageChip: Record<AgeRange, string> = {
    '0-2': t.intakeOptionAge02,
    '2-5': t.intakeOptionAge25,
    '6-12': t.intakeOptionAge612,
    '13-17': t.intakeOptionAge1317,
  };

  return (
    <article
      className={cn(
        'group/match relative overflow-hidden rounded-3xl bg-white p-5 shadow-soft transition-all',
        'motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-card-hover',
      )}
    >
      <span
        className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800"
        aria-label={t.previewMatchBadge}
      >
        <Sparkles className="h-3 w-3" aria-hidden />
        {t.previewMatchBadge}
      </span>

      <div className="flex items-start gap-3 pr-20">
        <span
          aria-hidden
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-[13px] font-bold text-primary"
        >
          {match.avatar}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-snug text-brand-muted-900">{match.displayName}</p>
          <span className={cn('mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10.5px] font-semibold', stageLabel.color)}>
            {stageLabel.label}
          </span>
        </div>
      </div>

      <p className="mt-4 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-muted-400">
        {t.previewBioLead}
      </p>
      <p className="mt-1 text-[13.5px] leading-relaxed text-brand-muted-700">{match.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-full border border-surface-border bg-surface-muted px-2 py-0.5 text-[10.5px] font-semibold text-brand-muted-600">
          {ageChip[match.childAgeRange as AgeRange]}
        </span>
        {match.connectionPreference.map((c) => (
          <span
            key={c}
            className="rounded-full border border-primary/15 bg-primary/5 px-2 py-0.5 text-[10.5px] font-semibold text-primary"
          >
            {formatChip(c)}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          {t.previewMatchCtaGuided}
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-white px-3 py-1.5 text-[12px] font-semibold text-brand-muted-700 transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          <Shield className="h-3.5 w-3.5" aria-hidden />
          {t.previewMatchCtaMod}
        </button>
      </div>
    </article>
  );
}

/* ─── Preview group card ────────────────────────────────────── */
interface PreviewGroupCardProps {
  group: (typeof peerGroups)[0];
  locale: Locale;
}

function PreviewGroupCard({ group, locale }: PreviewGroupCardProps) {
  const t = connectCopy[locale];
  const formatLabel =
    group.format === 'virtual' ? 'Virtual' : group.format === 'in-person' ? 'In-person' : 'Hybrid';
  const styleLabel =
    group.faithStyle === 'faith-based'
      ? t.intakeOptionStyleFaith
      : group.faithStyle === 'faith-friendly'
        ? `${t.intakeOptionStyleFaith}-friendly`
        : t.intakeOptionStyleGeneral;
  const spotsLeft = group.maxMembers - group.memberCount;

  return (
    <article
      className={cn(
        'group/grp relative overflow-hidden rounded-3xl bg-white p-5 shadow-soft transition-all',
        'motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-card-hover',
      )}
    >
      <span
        className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800"
        aria-label={t.previewGroupBadge}
      >
        <Sparkles className="h-3 w-3" aria-hidden />
        {t.previewGroupBadge}
      </span>

      <div className="flex flex-wrap items-start gap-2 pr-20">
        <span className="rounded-full border border-primary/15 bg-primary/5 px-2 py-0.5 text-[10.5px] font-semibold text-primary">
          {formatLabel}
        </span>
        <span className="rounded-full border border-amber-100 bg-amber-50/80 px-2 py-0.5 text-[10.5px] font-semibold text-amber-800">
          {styleLabel}
        </span>
      </div>

      <h3 className="mt-3 text-[15.5px] font-semibold leading-snug text-brand-muted-900">{group.name}</h3>
      <p className="mt-1 text-[13.5px] leading-relaxed text-brand-muted-600">{group.description}</p>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
        <div className="rounded-xl bg-surface-muted/60 px-2.5 py-1.5">
          <dt className="font-semibold uppercase tracking-wider text-brand-muted-400">Schedule</dt>
          <dd className="mt-0.5 text-brand-muted-700">{group.meetingSchedule}</dd>
        </div>
        <div className="rounded-xl bg-surface-muted/60 px-2.5 py-1.5">
          <dt className="font-semibold uppercase tracking-wider text-brand-muted-400">Spots</dt>
          <dd className="mt-0.5 text-brand-muted-700">
            {spotsLeft} / {group.maxMembers}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          <Users className="h-3.5 w-3.5" aria-hidden />
          {t.previewGroupCta}
        </button>
      </div>
    </article>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function ConnectPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const t = connectCopy[locale];

  // Intake form state
  const [ageRanges, setAgeRanges] = useState<AgeRange[]>([]);
  const [stage, setStage] = useState<DiagnosisStage | null>(null);
  const [struggles, setStruggles] = useState<Struggle[]>([]);
  const [connections, setConnections] = useState<ConnectionPreference[]>([]);
  const [style, setStyle] = useState<SupportStyle | null>(null);
  const [intakeSubmitted, setIntakeSubmitted] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const toggleArr = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  // Per-section completion → drives the inline progress indicator
  // and the per-section validation messages.
  const sectionDone = {
    age: ageRanges.length > 0,
    stage: stage !== null,
    struggles: struggles.length > 0,
    connections: connections.length > 0,
    style: style !== null,
  };
  const sectionsComplete = Object.values(sectionDone).filter(Boolean).length;
  const intakeComplete = sectionsComplete === 5;

  const ageLabel: Record<AgeRange, string> = {
    '0-2': t.intakeOptionAge02,
    '2-5': t.intakeOptionAge25,
    '6-12': t.intakeOptionAge612,
    '13-17': t.intakeOptionAge1317,
  };
  const stageLabelLocal: Record<DiagnosisStage, string> = {
    new: t.intakeOptionStageNew,
    ongoing: t.intakeOptionStageOngoing,
    advanced: t.intakeOptionStageAdvanced,
  };
  const struggleLabelLocal: Record<Struggle, string> = {
    behavior: t.intakeOptionStruggleBehavior,
    communication: t.intakeOptionStruggleCommunication,
    school: t.intakeOptionStruggleSchool,
    burnout: t.intakeOptionStruggleBurnout,
    isolation: t.intakeOptionStruggleIsolation,
    insurance: t.intakeOptionStruggleInsurance,
  };
  const connectionLabelLocal: Record<ConnectionPreference, string> = {
    text: t.intakeOptionConnectText,
    call: t.intakeOptionConnectCall,
    group: t.intakeOptionConnectGroup,
  };
  const styleLabelLocal: Record<SupportStyle, string> = {
    'faith-based': t.intakeOptionStyleFaith,
    general: t.intakeOptionStyleGeneral,
  };

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
                if (typeof window === 'undefined') return;
                document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              {t.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              onClick={() => {
                if (typeof window === 'undefined') return;
                document.getElementById('preview-groups')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
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

      {/* ── INTAKE — single-page progressive form ── */}
      <section
          id="intake"
          className="rounded-3xl border border-surface-border bg-white p-5 shadow-soft sm:p-7"
          aria-labelledby="intake-heading"
        >
          {intakeSubmitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                <Heart className="h-8 w-8 text-emerald-600" aria-hidden />
              </div>
              <h2 id="intake-heading" className="mt-5 text-xl font-semibold text-brand-muted-900">
                {t.intakeSubmittedHeading}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-brand-muted-600">
                {t.intakeSubmittedBody}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById('preview-matches')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  <Heart className="h-4 w-4" aria-hidden /> {t.intakeSubmittedSeeMatches}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById('preview-groups')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-surface-border bg-surface-muted px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  <Users className="h-4 w-4" aria-hidden /> {t.intakeSubmittedSeeGroups}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {t.intakeEyebrow}
                  </p>
                  <h2 id="intake-heading" className="mt-1 text-xl font-semibold leading-snug text-brand-muted-900 sm:text-[22px]">
                    {t.intakeTitle}
                  </h2>
                </div>
                <p
                  className="text-[12px] font-semibold text-brand-muted-500"
                  aria-live="polite"
                >
                  {t.intakeProgress(sectionsComplete, 5)}
                </p>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted-600">{t.intakeSub}</p>

              {/* Slim segmented progress bar — five segments, fills as
                  sections complete. Decorative; the live region above
                  carries the assistive announcement. */}
              <div
                aria-hidden
                className="mt-4 grid grid-cols-5 gap-1"
              >
                {Object.values(sectionDone).map((done, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full',
                      done ? 'bg-primary' : 'bg-surface-muted',
                    )}
                  />
                ))}
              </div>

              <div className="mt-7 space-y-6">
                {/* 1 — Age range (multi-select) */}
                <IntakeSection
                  number={1}
                  total={5}
                  done={sectionDone.age}
                  invalid={attemptedSubmit && !sectionDone.age}
                  title={t.intakeStep1Title}
                  hint={t.intakeStep1Hint}
                  doneLabel={t.intakeSectionDone}
                  errorLabel={t.intakeInlineRequired}
                >
                  <fieldset>
                    <legend className="sr-only">{t.intakeStep1Title}</legend>
                    <div className="flex flex-wrap gap-2">
                      {ageRangeValues.map((value) => (
                        <Toggle
                          key={value}
                          active={ageRanges.includes(value)}
                          onClick={() => setAgeRanges(toggleArr(ageRanges, value))}
                        >
                          {ageLabel[value]}
                        </Toggle>
                      ))}
                    </div>
                  </fieldset>
                </IntakeSection>

                {/* 2 — Journey stage (single-select) */}
                <IntakeSection
                  number={2}
                  total={5}
                  done={sectionDone.stage}
                  invalid={attemptedSubmit && !sectionDone.stage}
                  title={t.intakeStep2Title}
                  hint={t.intakeStep2Hint}
                  doneLabel={t.intakeSectionDone}
                  errorLabel={t.intakeInlineRequired}
                >
                  <fieldset>
                    <legend className="sr-only">{t.intakeStep2Title}</legend>
                    <div className="flex flex-wrap gap-2">
                      {stageValues.map((value) => (
                        <Toggle
                          key={value}
                          active={stage === value}
                          onClick={() => setStage(value)}
                        >
                          {stageLabelLocal[value]}
                        </Toggle>
                      ))}
                    </div>
                  </fieldset>
                </IntakeSection>

                {/* 3 — Hardest right now (multi-select). Visually
                    distinct: softer inset background, reassurance line. */}
                <IntakeSection
                  number={3}
                  total={5}
                  done={sectionDone.struggles}
                  invalid={attemptedSubmit && !sectionDone.struggles}
                  title={t.intakeStep3Title}
                  hint={t.intakeStep3Hint}
                  doneLabel={t.intakeSectionDone}
                  errorLabel={t.intakeInlineRequired}
                  human
                  eyebrow={t.intakeStep3Eyebrow}
                  reassurance={t.intakeStep3Reassure}
                >
                  <fieldset>
                    <legend className="sr-only">{t.intakeStep3Title}</legend>
                    <div className="flex flex-wrap gap-2">
                      {struggleValues.map((value) => (
                        <Toggle
                          key={value}
                          active={struggles.includes(value)}
                          onClick={() => setStruggles(toggleArr(struggles, value))}
                        >
                          {struggleLabelLocal[value]}
                        </Toggle>
                      ))}
                    </div>
                  </fieldset>
                </IntakeSection>

                {/* 4 — Connection format (multi-select) */}
                <IntakeSection
                  number={4}
                  total={5}
                  done={sectionDone.connections}
                  invalid={attemptedSubmit && !sectionDone.connections}
                  title={t.intakeStep4Title}
                  hint={t.intakeStep4Hint}
                  doneLabel={t.intakeSectionDone}
                  errorLabel={t.intakeInlineRequired}
                >
                  <fieldset>
                    <legend className="sr-only">{t.intakeStep4Title}</legend>
                    <div className="flex flex-wrap gap-2">
                      {connectionValues.map((opt) => (
                        <Toggle
                          key={opt.value}
                          active={connections.includes(opt.value)}
                          onClick={() => setConnections(toggleArr(connections, opt.value))}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <opt.icon className="h-3.5 w-3.5" aria-hidden />
                            {connectionLabelLocal[opt.value]}
                          </span>
                        </Toggle>
                      ))}
                    </div>
                  </fieldset>
                </IntakeSection>

                {/* 5 — Support style (single-select) */}
                <IntakeSection
                  number={5}
                  total={5}
                  done={sectionDone.style}
                  invalid={attemptedSubmit && !sectionDone.style}
                  title={t.intakeStep5Title}
                  hint={t.intakeStep5Hint}
                  doneLabel={t.intakeSectionDone}
                  errorLabel={t.intakeInlineRequired}
                >
                  <fieldset>
                    <legend className="sr-only">{t.intakeStep5Title}</legend>
                    <div className="flex flex-wrap gap-2">
                      {styleValues.map((value) => (
                        <Toggle
                          key={value}
                          active={style === value}
                          onClick={() => setStyle(value)}
                        >
                          {styleLabelLocal[value]}
                        </Toggle>
                      ))}
                    </div>
                  </fieldset>
                </IntakeSection>
              </div>

              <div className="mt-8 border-t border-surface-border pt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (intakeComplete) {
                      setIntakeSubmitted(true);
                      setAttemptedSubmit(false);
                      requestAnimationFrame(() =>
                        document
                          .getElementById('preview')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
                      );
                    } else {
                      setAttemptedSubmit(true);
                    }
                  }}
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-colors',
                    intakeComplete
                      ? 'bg-primary hover:bg-primary-dark'
                      : 'bg-primary/70 hover:bg-primary',
                  )}
                  aria-disabled={!intakeComplete}
                >
                  {t.intakeSubmit}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                <p className="mt-2 text-center text-[12px] text-brand-muted-500">
                  {t.intakeSubmitHint}
                </p>
              </div>
            </>
          )}
        </section>

      {/* ── POST-INTAKE PREVIEW — example matches and groups ── */}
      <section
        id="preview"
        aria-labelledby="preview-heading"
        className="space-y-6"
      >
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-primary">
              {t.previewEyebrow}
            </p>
            <h2
              id="preview-heading"
              className="mt-1 text-xl font-semibold leading-snug text-brand-muted-900 sm:text-[22px]"
            >
              {t.previewTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted-600">
              {t.previewSub}
            </p>
          </div>
        </header>

        {/* Example parent matches — three cards in a 3-up grid (lg+),
            stack on mobile. Each card carries an "Example match" badge. */}
        <div id="preview-matches">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-muted-500">
            {t.previewMatchesHeading}
          </h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mockParentMatches.slice(0, 3).map((match) => (
              <PreviewMatchCard key={match.id} match={match} locale={locale} />
            ))}
          </div>
        </div>

        {/* Example small groups — two cards in a 2-up grid (md+). */}
        <div id="preview-groups">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-muted-500">
            {t.previewGroupsHeading}
          </h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {peerGroups.slice(0, 2).map((group) => (
              <PreviewGroupCard key={group.id} group={group} locale={locale} />
            ))}
          </div>
        </div>

        <p className="text-[11.5px] italic text-brand-muted-500">{t.previewDemoNote}</p>
      </section>
    </div>
  );
}
