'use client';

import { useState } from 'react';
import { ArrowDown, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { findResources, intentMeta, INTENTS, type Intent } from './resources';

type Locale = 'en' | 'es';

const copy = {
  en: {
    eyebrow: 'Find Support',
    title: 'Real help, near you.',
    description:
      'Every provider, place, and group here has been reviewed by our care navigation team. Pick the situation that fits — we\'ll narrow the list to what makes sense.',
    intentTitle: 'What do you need right now?',
    intentSub: 'Pick one to pre-filter the directory below. You can keep adjusting from there.',
    browseAll: (n: number) => `Browse all ${n} resources`,
    languageToggle: 'Español',
  },
  es: {
    eyebrow: 'Encuentra Apoyo',
    title: 'Ayuda real, cerca de ti.',
    description:
      'Cada proveedor, lugar y grupo ha sido revisado por nuestro equipo de navegación. Elige la situación que mejor describe la tuya — filtraremos la lista.',
    intentTitle: '¿Qué necesitas ahora mismo?',
    intentSub: 'Elige uno para pre-filtrar el directorio. Puedes ajustar desde ahí.',
    browseAll: (n: number) => `Ver los ${n} recursos`,
    languageToggle: 'English',
  },
} as const;

const intentCopy: Record<Locale, Record<Intent, { label: string; sublabel: string }>> = {
  en: {
    'just-diagnosed': { label: 'Just got a diagnosis', sublabel: 'A guided starter path of first calls.' },
    therapy: { label: 'I need therapy services', sublabel: 'ABA, speech, OT, feeding — what fits.' },
    'sensory-friendly': { label: 'A sensory-friendly place', sublabel: 'Dentists, haircuts, grocery, fun.' },
    respite: { label: 'I need a break', sublabel: 'Respite care so you can rest.' },
    financial: { label: 'I need financial help', sublabel: 'Grants, waivers, low-cost programs.' },
    crisis: { label: "I'm struggling", sublabel: 'Parent mental health & crisis support.' },
  },
  es: {
    'just-diagnosed': { label: 'Acabamos de recibir un diagnóstico', sublabel: 'Una ruta guiada de primeras llamadas.' },
    therapy: { label: 'Necesito servicios de terapia', sublabel: 'ABA, lenguaje, OT, alimentación.' },
    'sensory-friendly': { label: 'Un lugar sensorialmente amigable', sublabel: 'Dentistas, cortes, comida, diversión.' },
    respite: { label: 'Necesito un descanso', sublabel: 'Cuidado de relevo para descansar.' },
    financial: { label: 'Necesito ayuda financiera', sublabel: 'Becas, exenciones, programas de bajo costo.' },
    crisis: { label: 'Estoy luchando', sublabel: 'Salud mental del cuidador y apoyo de crisis.' },
  },
};

export default function FindSupportPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [activeIntent, setActiveIntent] = useState<Intent | null>(null);
  const t = copy[locale];

  const handleIntentClick = (intent: Intent) => {
    setActiveIntent((prev) => (prev === intent ? null : intent));
    if (typeof window !== 'undefined') {
      const el = document.getElementById('directory');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-page">
      {/* Header strip */}
      <section className="border-b border-surface-border bg-white">
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-6 pt-5 sm:px-6 lg:px-8 lg:pb-7 lg:pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                {t.eyebrow}
              </p>
              <h1 className="mt-1.5 text-2xl font-bold text-brand-muted-900 sm:text-[28px]">{t.title}</h1>
              <p className="mt-1.5 max-w-2xl text-sm text-brand-muted-600">{t.description}</p>
            </div>
            <button
              onClick={() => setLocale((l) => (l === 'en' ? 'es' : 'en'))}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-brand-muted-700 hover:border-primary/30 hover:text-primary"
              aria-label="Toggle language"
            >
              <Languages className="h-4 w-4" />
              <span>{locale === 'en' ? 'EN' : 'ES'}</span>
              <span className="text-brand-muted-400">·</span>
              <span>{t.languageToggle}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Intent picker hero */}
      <section className="bg-gradient-to-b from-white to-page">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-semibold text-brand-muted-900 sm:text-2xl">{t.intentTitle}</h2>
            <p className="text-sm text-brand-muted-600">{t.intentSub}</p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INTENTS.map((intent) => {
              const meta = intentMeta[intent];
              const c = intentCopy[locale][intent];
              const active = activeIntent === intent;
              return (
                <button
                  key={intent}
                  onClick={() => handleIntentClick(intent)}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-left transition-all',
                    'hover:-translate-y-0.5 hover:shadow-card-hover',
                    meta.accent,
                    active
                      ? 'border-primary ring-2 ring-primary/30 shadow-card-hover'
                      : 'border-surface-border shadow-soft',
                  )}
                  aria-pressed={active}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl leading-none" aria-hidden>
                      {meta.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-brand-muted-900">{c.label}</p>
                      <p className="mt-1 text-[13px] leading-snug text-brand-muted-600">{c.sublabel}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Filter the list
                    <ArrowDown className="h-3 w-3" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-center">
            <button
              onClick={() => {
                setActiveIntent(null);
                document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              {t.browseAll(findResources.length)} →
            </button>
          </div>
        </div>
      </section>

      {/* Directory placeholder — will become the three-column layout */}
      <section id="directory" className="border-t border-surface-border bg-page">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <p className="text-sm text-brand-muted-500">
            Directory shell · active intent: <strong>{activeIntent ?? 'none'}</strong> · {findResources.length} resources loaded.
          </p>
        </div>
      </section>
    </div>
  );
}
