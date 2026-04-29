'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, BookmarkPlus, Eraser, Languages, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AGE_GROUPS,
  CITIES,
  DELIVERY,
  findResources,
  INSURANCE,
  intentMeta,
  INTENTS,
  SERVICES,
  type AgeGroup,
  type City,
  type Delivery,
  type Insurance,
  type Intent,
  type Resource,
  type Service,
} from './resources';

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
    filtersTitle: 'Filters',
    activeCount: (n: number) => (n === 1 ? '1 active' : `${n} active`),
    clearAll: 'Clear all',
    groupLocation: 'Location / Area',
    groupService: 'Service type',
    groupAge: 'Age group',
    groupInsurance: 'Insurance',
    groupDelivery: 'Delivery',
    goodFirstStep: 'Good first step only',
    goodFirstStepHelp: 'Highest-confidence starting points, vetted by our navigators.',
    saveFilterSet: 'Save this filter set',
    saveFilterSetHelp: 'Stored in your browser so you can pick up where you left off.',
    savedFilterSet: 'Filter set saved ✓',
    centerPlaceholder: (n: number) => `${n} of ${findResources.length} resources match`,
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
    filtersTitle: 'Filtros',
    activeCount: (n: number) => (n === 1 ? '1 activo' : `${n} activos`),
    clearAll: 'Limpiar todo',
    groupLocation: 'Ubicación / Área',
    groupService: 'Tipo de servicio',
    groupAge: 'Grupo de edad',
    groupInsurance: 'Seguro',
    groupDelivery: 'Modalidad',
    goodFirstStep: 'Solo "buen primer paso"',
    goodFirstStepHelp: 'Puntos de partida de mayor confianza, revisados por nuestros navegadores.',
    saveFilterSet: 'Guardar este conjunto',
    saveFilterSetHelp: 'Se guarda en tu navegador para que puedas retomar.',
    savedFilterSet: 'Conjunto guardado ✓',
    centerPlaceholder: (n: number) => `${n} de ${findResources.length} recursos coinciden`,
  },
} as const;

const localizedLabel = {
  en: {
    services: {
      ABA: 'ABA',
      Speech: 'Speech',
      OT: 'OT',
      Feeding: 'Feeding',
      Diagnosis: 'Diagnosis',
      Pediatrician: 'Pediatrician',
      'Mental Health': 'Mental Health',
      Respite: 'Respite',
      Advocacy: 'Advocacy',
      Recreation: 'Recreation',
      'Sensory-friendly business': 'Sensory-friendly business',
    } satisfies Record<Service, string>,
    insurance: {
      'Accepts insurance': 'Accepts insurance',
      'No insurance needed': 'No insurance needed',
      Varies: 'Varies',
    } satisfies Record<Insurance, string>,
    delivery: {
      'In-person': 'In-person',
      'In-home/Mobile': 'In-home / Mobile',
      Virtual: 'Virtual',
    } satisfies Record<Delivery, string>,
  },
  es: {
    services: {
      ABA: 'ABA',
      Speech: 'Lenguaje',
      OT: 'OT',
      Feeding: 'Alimentación',
      Diagnosis: 'Diagnóstico',
      Pediatrician: 'Pediatra',
      'Mental Health': 'Salud mental',
      Respite: 'Relevo',
      Advocacy: 'Apoyo / IEP',
      Recreation: 'Recreación',
      'Sensory-friendly business': 'Negocio sensorial',
    } satisfies Record<Service, string>,
    insurance: {
      'Accepts insurance': 'Acepta seguro',
      'No insurance needed': 'Sin seguro requerido',
      Varies: 'Varía',
    } satisfies Record<Insurance, string>,
    delivery: {
      'In-person': 'En persona',
      'In-home/Mobile': 'A domicilio',
      Virtual: 'Virtual',
    } satisfies Record<Delivery, string>,
  },
} as const;

interface FilterState {
  cities: City[];
  services: Service[];
  ageGroups: AgeGroup[];
  insurance: Insurance[];
  delivery: Delivery[];
  goodFirstStepOnly: boolean;
}

const emptyFilters: FilterState = {
  cities: [],
  services: [],
  ageGroups: [],
  insurance: [],
  delivery: [],
  goodFirstStepOnly: false,
};

const intentToFilters: Record<Intent, Partial<FilterState>> = {
  'just-diagnosed': { goodFirstStepOnly: true },
  therapy: { services: ['ABA', 'Speech', 'OT', 'Feeding'] },
  'sensory-friendly': { services: ['Sensory-friendly business'] },
  respite: { services: ['Respite'] },
  financial: { services: ['Advocacy'] },
  crisis: { services: ['Mental Health'] },
};

function countActiveFilters(f: FilterState): number {
  return (
    f.cities.length +
    f.services.length +
    f.ageGroups.length +
    f.insurance.length +
    f.delivery.length +
    (f.goodFirstStepOnly ? 1 : 0)
  );
}

function applyFilters(items: Resource[], f: FilterState): Resource[] {
  return items.filter((r) => {
    if (f.goodFirstStepOnly && !r.goodFirstStep && r.urgency !== 'crisis') return false;
    if (f.cities.length && !f.cities.some((c) => r.cities.includes(c))) return false;
    if (f.services.length && !f.services.some((s) => r.services.includes(s))) return false;
    if (f.ageGroups.length && !f.ageGroups.some((a) => r.ageGroups.includes(a))) return false;
    if (f.insurance.length && !f.insurance.includes(r.insurance)) return false;
    if (f.delivery.length && !f.delivery.some((d) => r.delivery.includes(d))) return false;
    return true;
  });
}

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

interface CheckboxGroupProps<T extends string> {
  legend: string;
  options: readonly T[];
  selected: T[];
  onToggle: (v: T) => void;
  labelMap?: Partial<Record<T, string>>;
}

function CheckboxGroup<T extends string>({
  legend,
  options,
  selected,
  onToggle,
  labelMap,
}: CheckboxGroupProps<T>) {
  const activeCount = selected.length;
  return (
    <fieldset className="border-t border-surface-border pt-3 first:border-t-0 first:pt-0">
      <legend className="mb-1.5 flex w-full items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-muted-500">
        <span>{legend}</span>
        {activeCount > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-primary">
            {activeCount}
          </span>
        )}
      </legend>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {options.map((value) => {
          const checked = selected.includes(value);
          const label = labelMap?.[value] ?? value;
          return (
            <li key={value}>
              <label
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors',
                  checked ? 'bg-primary/8 text-brand-muted-900' : 'text-brand-muted-700 hover:bg-surface-subtle',
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(value)}
                  className="h-4 w-4 cursor-pointer rounded border-surface-border text-primary focus:ring-primary/30"
                />
                <span className="flex-1 leading-tight">{label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

interface LeftFiltersProps {
  locale: Locale;
  filters: FilterState;
  setFilters: (next: FilterState) => void;
}

function LeftFilters({ locale, filters, setFilters }: LeftFiltersProps) {
  const t = copy[locale];
  const labels = localizedLabel[locale];
  const totalActive = countActiveFilters(filters);
  const [savedNote, setSavedNote] = useState(false);

  const toggle = <K extends keyof FilterState>(key: K, value: FilterState[K] extends Array<infer V> ? V : never) => {
    const arr = filters[key] as unknown as string[];
    const v = value as unknown as string;
    const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    setFilters({ ...filters, [key]: next } as FilterState);
  };

  const handleSaveSet = () => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('cg2.find.filters', JSON.stringify(filters));
      setSavedNote(true);
      setTimeout(() => setSavedNote(false), 1800);
    } catch {
      /* ignore quota / privacy errors */
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-muted-900">{t.filtersTitle}</p>
        {totalActive > 0 ? (
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
          >
            <Eraser className="h-3.5 w-3.5" />
            {t.clearAll}
          </button>
        ) : (
          <span className="text-[11px] text-brand-muted-400">—</span>
        )}
      </div>

      {totalActive > 0 && (
        <p className="-mt-2 text-[11px] font-semibold text-primary">{t.activeCount(totalActive)}</p>
      )}

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={filters.goodFirstStepOnly}
            onChange={(e) => setFilters({ ...filters, goodFirstStepOnly: e.target.checked })}
            className="mt-0.5 h-4 w-4 cursor-pointer rounded border-emerald-300 text-emerald-700 focus:ring-emerald-400"
          />
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-800">
              <Star className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
              {t.goodFirstStep}
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-emerald-700/80">
              {t.goodFirstStepHelp}
            </span>
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-surface-border bg-white p-3">
        <CheckboxGroup
          legend={t.groupLocation}
          options={CITIES}
          selected={filters.cities}
          onToggle={(v) => toggle('cities', v)}
        />
        <CheckboxGroup
          legend={t.groupService}
          options={SERVICES}
          selected={filters.services}
          onToggle={(v) => toggle('services', v)}
          labelMap={labels.services}
        />
        <CheckboxGroup
          legend={t.groupAge}
          options={AGE_GROUPS}
          selected={filters.ageGroups}
          onToggle={(v) => toggle('ageGroups', v)}
        />
        <CheckboxGroup
          legend={t.groupInsurance}
          options={INSURANCE}
          selected={filters.insurance}
          onToggle={(v) => toggle('insurance', v)}
          labelMap={labels.insurance}
        />
        <CheckboxGroup
          legend={t.groupDelivery}
          options={DELIVERY}
          selected={filters.delivery}
          onToggle={(v) => toggle('delivery', v)}
          labelMap={labels.delivery}
        />
      </div>

      <div className="rounded-xl border border-surface-border bg-white p-3">
        <button
          type="button"
          onClick={handleSaveSet}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-[12px] font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          <BookmarkPlus className="h-3.5 w-3.5" />
          {savedNote ? t.savedFilterSet : t.saveFilterSet}
        </button>
        <p className="mt-2 text-[11px] leading-snug text-brand-muted-500">{t.saveFilterSetHelp}</p>
      </div>
    </div>
  );
}

export default function FindSupportPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [activeIntent, setActiveIntent] = useState<Intent | null>(null);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const t = copy[locale];

  // Restore saved filter set from prior session, once.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem('cg2.find.filters');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Partial<FilterState>;
      setFilters({ ...emptyFilters, ...parsed });
    } catch {
      /* ignore corrupt JSON */
    }
  }, []);

  const filteredResources = useMemo(() => applyFilters(findResources, filters), [filters]);

  const handleIntentClick = (intent: Intent) => {
    const next = activeIntent === intent ? null : intent;
    setActiveIntent(next);
    if (next) {
      setFilters({ ...emptyFilters, ...intentToFilters[next] });
    } else {
      setFilters(emptyFilters);
    }
    if (typeof window !== 'undefined') {
      document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

      {/* Directory — three-column desktop grid */}
      <section id="directory" className="border-t border-surface-border bg-page">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)_320px] xl:grid-cols-[280px_minmax(0,1fr)_360px]">
            {/* Left rail */}
            <aside className="lg:sticky lg:top-[104px] lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-1">
              <LeftFilters locale={locale} filters={filters} setFilters={setFilters} />
            </aside>

            {/* Center column — populated in Step 3 */}
            <div className="min-w-0">
              <div className="rounded-2xl border border-dashed border-surface-border bg-white/60 p-6 text-center">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted-700">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t.centerPlaceholder(filteredResources.length)}
                </p>
                <p className="mt-2 text-[12px] text-brand-muted-500">
                  Search bar, sort dropdown, view toggle, and result cards arrive in the next step.
                </p>
              </div>
            </div>

            {/* Right rail — populated in Step 4 */}
            <aside className="hidden lg:block lg:sticky lg:top-[104px] lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
              <div className="rounded-2xl border border-dashed border-surface-border bg-white/60 p-4 text-[12px] text-brand-muted-500">
                Context panel · default state arrives in the next step (saved resources + navigator CTA).
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
