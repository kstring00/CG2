'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  BookmarkPlus,
  Eraser,
  ExternalLink,
  Globe,
  HeartHandshake,
  Keyboard,
  Languages,
  List,
  Mail,
  MapPin,
  Map as MapIcon,
  Navigation,
  Phone,
  Pin,
  Printer,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';
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
    searchPlaceholder: 'Search by name, service, neighborhood, or keyword',
    searchShortcut: 'Press / to focus',
    showing: (n: number, total: number) => `Showing ${n} of ${total}`,
    sortLabel: 'Sort',
    sortRecommended: 'Recommended',
    sortRecent: 'Recently reviewed',
    sortAlpha: 'Alphabetical',
    viewList: 'List',
    viewMap: 'By city',
    activeChipsLabel: 'Active filters',
    callButton: 'Call',
    websiteButton: 'Website',
    saveCard: 'Save',
    saved: 'Saved',
    crisisBadge: '24/7',
    goodFirstStepBadge: 'Good first step',
    sensoryBadge: 'Sensory-friendly',
    crisisLabel: 'Crisis & urgent support',
    reviewedTooltip: (date: string) => `Reviewed ${date} by Texas ABA Centers`,
    hoverHint: 'Hover for details · click to pin',
    inlineHelpTitle: "Don't see what you need?",
    inlineHelpBody: 'A care navigator can spend 10 minutes with you and point to the right place.',
    inlineHelpCta: 'Connect with a navigator',
    emptyTitle: 'Nothing matches yet',
    emptyBody: 'Try removing a filter or broadening the location. Or talk to a navigator.',
    mapEmpty: 'No resources to show on the map yet.',
    mapHint: 'Hover a city to highlight its resources.',
    rightDefaultTitle: 'Your saved resources',
    rightDefaultEmpty: 'Save anything you want to come back to. They\'ll live here, in your browser, no login required.',
    rightDefaultEmptyHint: 'Tip: hover a card to preview · click to pin · ⌘/Ctrl+S to save the focused one.',
    rightSavedCount: (n: number) => (n === 1 ? '1 saved' : `${n} saved`),
    rightEmailLabel: 'Email this list to myself',
    rightEmailPlaceholder: 'you@example.com',
    rightEmailSend: 'Send',
    rightPrint: 'Print',
    rightClear: 'Clear list',
    rightNavigatorTitle: 'Not finding what you need?',
    rightNavigatorBody: 'A care navigator can spend ten minutes with you and point you to what fits your week.',
    rightNavigatorCta: 'Talk to a navigator',
    expandedReviewed: (date: string) => `Reviewed ${date} · vetted by Texas ABA Centers`,
    expandedSection: 'About',
    expandedSectionGood: 'Helpful to know',
    expandedSectionContact: 'How to reach them',
    expandedDirections: 'Get directions',
    expandedClose: 'Close',
    expandedAddress: 'Address',
    expandedAge: 'Age range',
    expandedServices: 'Services',
    expandedDelivery: 'How they deliver',
    expandedInsurance: 'Insurance',
    pinnedLabel: 'Pinned',
    hoveringLabel: 'Hover preview',
    keyboardButton: 'Keyboard shortcuts',
    helpTitle: 'Keyboard shortcuts',
    helpClose: 'Close',
    mobileFiltersButton: 'Filters',
    mobileSavedButton: 'Saved',
    mobileDrawerClose: 'Close drawer',
    helpRows: [
      ['/', 'Focus search'],
      ['⌘K · Ctrl+K', 'Focus search'],
      ['↑ ↓', 'Walk through results'],
      ['Enter', 'Pin the focused card'],
      ['⌘S · Ctrl+S', 'Save the focused card'],
      ['Esc', 'Clear the right-rail panel'],
      ['?', 'Toggle this overlay'],
    ] as const,
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
    searchPlaceholder: 'Buscar por nombre, servicio, vecindario o palabra clave',
    searchShortcut: 'Presiona / para enfocar',
    showing: (n: number, total: number) => `Mostrando ${n} de ${total}`,
    sortLabel: 'Ordenar',
    sortRecommended: 'Recomendado',
    sortRecent: 'Revisado recientemente',
    sortAlpha: 'Alfabético',
    viewList: 'Lista',
    viewMap: 'Por ciudad',
    activeChipsLabel: 'Filtros activos',
    callButton: 'Llamar',
    websiteButton: 'Sitio web',
    saveCard: 'Guardar',
    saved: 'Guardado',
    crisisBadge: '24/7',
    goodFirstStepBadge: 'Buen primer paso',
    sensoryBadge: 'Sensorial-amigable',
    crisisLabel: 'Apoyo de crisis y urgente',
    reviewedTooltip: (date: string) => `Revisado ${date} por Texas ABA Centers`,
    hoverHint: 'Pasa el cursor para ver detalles · haz clic para fijar',
    inlineHelpTitle: '¿No encuentras lo que necesitas?',
    inlineHelpBody: 'Un navegador de atención puede dedicarte 10 minutos y guiarte al lugar correcto.',
    inlineHelpCta: 'Conectar con un navegador',
    emptyTitle: 'Nada coincide aún',
    emptyBody: 'Intenta quitar un filtro o ampliar la ubicación. O habla con un navegador.',
    mapEmpty: 'No hay recursos para mostrar en el mapa.',
    mapHint: 'Pasa el cursor sobre una ciudad para resaltar sus recursos.',
    rightDefaultTitle: 'Tus recursos guardados',
    rightDefaultEmpty: 'Guarda lo que quieras revisar después. Vivirá aquí, en tu navegador, sin necesidad de cuenta.',
    rightDefaultEmptyHint: 'Tip: pasa el cursor para previsualizar · clic para fijar · ⌘/Ctrl+S para guardar el seleccionado.',
    rightSavedCount: (n: number) => (n === 1 ? '1 guardado' : `${n} guardados`),
    rightEmailLabel: 'Enviarme esta lista por email',
    rightEmailPlaceholder: 'tu@ejemplo.com',
    rightEmailSend: 'Enviar',
    rightPrint: 'Imprimir',
    rightClear: 'Vaciar lista',
    rightNavigatorTitle: '¿No encuentras lo que necesitas?',
    rightNavigatorBody: 'Un navegador de atención puede dedicarte diez minutos y guiarte a lo que encaje con tu semana.',
    rightNavigatorCta: 'Habla con un navegador',
    expandedReviewed: (date: string) => `Revisado ${date} · verificado por Texas ABA Centers`,
    expandedSection: 'Acerca de',
    expandedSectionGood: 'Bueno saber',
    expandedSectionContact: 'Cómo contactar',
    expandedDirections: 'Ver indicaciones',
    expandedClose: 'Cerrar',
    expandedAddress: 'Dirección',
    expandedAge: 'Rango de edad',
    expandedServices: 'Servicios',
    expandedDelivery: 'Cómo atienden',
    expandedInsurance: 'Seguro',
    pinnedLabel: 'Fijado',
    hoveringLabel: 'Vista previa',
    keyboardButton: 'Atajos de teclado',
    helpTitle: 'Atajos de teclado',
    helpClose: 'Cerrar',
    mobileFiltersButton: 'Filtros',
    mobileSavedButton: 'Guardados',
    mobileDrawerClose: 'Cerrar panel',
    helpRows: [
      ['/', 'Enfocar búsqueda'],
      ['⌘K · Ctrl+K', 'Enfocar búsqueda'],
      ['↑ ↓', 'Recorrer resultados'],
      ['Enter', 'Fijar la tarjeta enfocada'],
      ['⌘S · Ctrl+S', 'Guardar la tarjeta enfocada'],
      ['Esc', 'Cerrar el panel derecho'],
      ['?', 'Alternar este panel'],
    ] as const,
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

// ── URL encoding ───────────────────────────────────────────────

const citySlug: Record<City, string> = {
  'Sugar Land': 'sugar-land',
  Katy: 'katy',
  Pearland: 'pearland',
  'Missouri City': 'missouri-city',
  'Clear Lake': 'clear-lake',
  Houston: 'houston',
  'Fort Bend County': 'fort-bend',
  'The Woodlands': 'woodlands',
  Statewide: 'statewide',
  Online: 'online',
};

const serviceSlug: Record<Service, string> = {
  ABA: 'aba',
  Speech: 'speech',
  OT: 'ot',
  Feeding: 'feeding',
  Diagnosis: 'diagnosis',
  Pediatrician: 'pediatrician',
  'Mental Health': 'mental-health',
  Respite: 'respite',
  Advocacy: 'advocacy',
  Recreation: 'recreation',
  'Sensory-friendly business': 'sensory',
};

const ageSlug: Record<AgeGroup, string> = {
  'Birth–5': 'birth-5',
  '6–12': '6-12',
  '13–17': '13-17',
  Adult: 'adult',
  'All ages': 'all',
};

const insuranceSlug: Record<Insurance, string> = {
  'Accepts insurance': 'yes',
  'No insurance needed': 'no',
  Varies: 'varies',
};

const deliverySlug: Record<Delivery, string> = {
  'In-person': 'in-person',
  'In-home/Mobile': 'mobile',
  Virtual: 'virtual',
};

function invert<K extends string, V extends string>(map: Record<K, V>): Record<V, K> {
  const out = {} as Record<V, K>;
  (Object.keys(map) as K[]).forEach((k) => {
    out[map[k]] = k;
  });
  return out;
}

const cityFromSlug = invert(citySlug);
const serviceFromSlug = invert(serviceSlug);
const ageFromSlug = invert(ageSlug);
const insuranceFromSlug = invert(insuranceSlug);
const deliveryFromSlug = invert(deliverySlug);

interface UrlState {
  filters: FilterState;
  query: string;
  intent: Intent | null;
  sort: SortKey;
  view: ViewKey;
}

function urlStateToParams(s: UrlState): URLSearchParams {
  const params = new URLSearchParams();
  if (s.intent) params.set('need', s.intent);
  if (s.query.trim()) params.set('q', s.query.trim());
  if (s.filters.cities.length) params.set('city', s.filters.cities.map((c) => citySlug[c]).join(','));
  if (s.filters.services.length) params.set('service', s.filters.services.map((c) => serviceSlug[c]).join(','));
  if (s.filters.ageGroups.length) params.set('age', s.filters.ageGroups.map((c) => ageSlug[c]).join(','));
  if (s.filters.insurance.length) params.set('insurance', s.filters.insurance.map((c) => insuranceSlug[c]).join(','));
  if (s.filters.delivery.length) params.set('delivery', s.filters.delivery.map((c) => deliverySlug[c]).join(','));
  if (s.filters.goodFirstStepOnly) params.set('gfs', '1');
  if (s.sort !== 'recommended') params.set('sort', s.sort);
  if (s.view !== 'list') params.set('view', s.view);
  return params;
}

function parseList<T extends string>(value: string | null, lookup: Record<string, T>): T[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => lookup[s])
    .filter((s): s is T => Boolean(s));
}

function paramsToUrlState(params: URLSearchParams): UrlState {
  const intentRaw = params.get('need');
  const intent = (INTENTS as readonly string[]).includes(intentRaw ?? '') ? (intentRaw as Intent) : null;
  const sortRaw = params.get('sort');
  const sort: SortKey = sortRaw === 'recent' || sortRaw === 'alpha' ? sortRaw : 'recommended';
  const viewRaw = params.get('view');
  const view: ViewKey = viewRaw === 'map' ? 'map' : 'list';
  return {
    intent,
    query: params.get('q') ?? '',
    sort,
    view,
    filters: {
      cities: parseList(params.get('city'), cityFromSlug),
      services: parseList(params.get('service'), serviceFromSlug),
      ageGroups: parseList(params.get('age'), ageFromSlug),
      insurance: parseList(params.get('insurance'), insuranceFromSlug),
      delivery: parseList(params.get('delivery'), deliveryFromSlug),
      goodFirstStepOnly: params.get('gfs') === '1',
    },
  };
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

type SortKey = 'recommended' | 'recent' | 'alpha';
type ViewKey = 'list' | 'map';

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function reviewedToTime(s: string): number {
  const [m, y] = s.toLowerCase().split(/\s+/);
  const mi = MONTHS[m] ?? 0;
  const yi = parseInt(y ?? '2026', 10);
  return new Date(yi, mi, 1).getTime();
}

function searchResources(items: Resource[], q: string): Resource[] {
  const query = q.trim().toLowerCase();
  if (!query) return items;
  const tokens = query.split(/\s+/);
  return items.filter((r) => {
    const haystack = [
      r.name,
      r.blurb,
      r.description,
      r.helpfulToKnow ?? '',
      r.cities.join(' '),
      r.services.join(' '),
      r.tags.join(' '),
      r.address ?? '',
    ]
      .join(' ')
      .toLowerCase();
    return tokens.every((t) => haystack.includes(t));
  });
}

function sortResources(items: Resource[], key: SortKey): Resource[] {
  const arr = [...items];
  if (key === 'alpha') {
    arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }
  if (key === 'recent') {
    arr.sort((a, b) => reviewedToTime(b.lastReviewed) - reviewedToTime(a.lastReviewed));
    return arr;
  }
  // recommended: crisis → good first step → alpha
  arr.sort((a, b) => {
    const rank = (r: Resource) => (r.urgency === 'crisis' ? 0 : r.goodFirstStep ? 1 : 2);
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  });
  return arr;
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

// ── Right rail: expanded card details ─────────────────────────

function directionsHref(r: Resource): string | null {
  const target = r.address || r.cities[0];
  if (!target) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target)}`;
}

interface ExpandedPanelProps {
  resource: Resource;
  locale: Locale;
  isPinned: boolean;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: (id: string) => void;
}

function ExpandedResourcePanel({
  resource,
  locale,
  isPinned,
  isSaved,
  onClose,
  onToggleSave,
}: ExpandedPanelProps) {
  const t = copy[locale];
  const labels = localizedLabel[locale];
  const isCrisis = resource.urgency === 'crisis';
  const directions = directionsHref(resource);

  return (
    <div
      className={cn(
        'rounded-2xl border bg-white p-4 shadow-card',
        isCrisis ? 'border-red-200' : 'border-surface-border',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
            isPinned ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
          )}
        >
          {isPinned ? <Pin className="h-3 w-3" /> : null}
          {isPinned ? t.pinnedLabel : t.hoveringLabel}
        </span>
        {isPinned && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-brand-muted-400 hover:bg-surface-subtle hover:text-brand-muted-700"
            aria-label={t.expandedClose}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <h3 className="mt-2 text-[16px] font-semibold leading-snug text-brand-muted-900">
        {resource.name}
      </h3>
      <p className="mt-1 text-[11.5px] text-brand-muted-500" title={t.expandedReviewed(resource.lastReviewed)}>
        <ShieldCheck className="mr-1 inline h-3 w-3" />
        {t.expandedReviewed(resource.lastReviewed)}
      </p>

      <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-brand-muted-700">
        <p className="whitespace-pre-line">{resource.description}</p>
        {resource.helpfulToKnow && (
          <div className="rounded-xl bg-surface-muted p-3">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-brand-muted-500">
              {t.expandedSectionGood}
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-brand-muted-700">{resource.helpfulToKnow}</p>
          </div>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11.5px]">
        <div>
          <dt className="font-semibold uppercase tracking-wider text-brand-muted-400">{t.expandedAge}</dt>
          <dd className="mt-0.5 text-brand-muted-700">{resource.ageGroups.join(', ')}</dd>
        </div>
        <div>
          <dt className="font-semibold uppercase tracking-wider text-brand-muted-400">{t.expandedInsurance}</dt>
          <dd className="mt-0.5 text-brand-muted-700">{labels.insurance[resource.insurance]}</dd>
        </div>
        <div className="col-span-2">
          <dt className="font-semibold uppercase tracking-wider text-brand-muted-400">{t.expandedServices}</dt>
          <dd className="mt-0.5 text-brand-muted-700">
            {resource.services.map((s) => labels.services[s]).join(' · ')}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="font-semibold uppercase tracking-wider text-brand-muted-400">{t.expandedDelivery}</dt>
          <dd className="mt-0.5 text-brand-muted-700">
            {resource.delivery.map((d) => labels.delivery[d]).join(' · ')}
          </dd>
        </div>
        {resource.address && (
          <div className="col-span-2">
            <dt className="font-semibold uppercase tracking-wider text-brand-muted-400">{t.expandedAddress}</dt>
            <dd className="mt-0.5 text-brand-muted-700">{resource.address}</dd>
          </div>
        )}
      </dl>

      <div className="mt-3 border-t border-surface-border pt-3">
        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-brand-muted-400">
          {t.expandedSectionContact}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {resource.phone && (
            <a
              href={`tel:${resource.phone.replace(/[^0-9+]/g, '')}`}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors',
                isCrisis ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-primary text-white hover:bg-primary-dark',
              )}
            >
              <Phone className="h-3.5 w-3.5" />
              {resource.phone}
            </a>
          )}
          {resource.website && (
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border px-2.5 py-1.5 text-[12px] font-semibold text-brand-muted-700 hover:border-primary/30 hover:text-primary"
            >
              <Globe className="h-3.5 w-3.5" />
              {t.websiteButton}
            </a>
          )}
          {directions && (
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border px-2.5 py-1.5 text-[12px] font-semibold text-brand-muted-700 hover:border-primary/30 hover:text-primary"
            >
              <Navigation className="h-3.5 w-3.5" />
              {t.expandedDirections}
            </a>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onToggleSave(resource.id)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors',
            isSaved
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              : 'border border-surface-border text-brand-muted-700 hover:bg-surface-subtle',
          )}
          aria-pressed={isSaved}
        >
          <BookmarkPlus className={cn('h-3.5 w-3.5', isSaved && 'fill-amber-500 text-amber-500')} />
          {isSaved ? t.saved : t.saveCard}
        </button>
      </div>
    </div>
  );
}

// ── Right rail: saved resources panel ─────────────────────────

interface SavedPanelProps {
  locale: Locale;
  savedResources: Resource[];
  onUnsave: (id: string) => void;
  onClear: () => void;
  onPin: (id: string) => void;
}

function SavedResourcesPanel({ locale, savedResources, onUnsave, onClear, onPin }: SavedPanelProps) {
  const t = copy[locale];
  const [email, setEmail] = useState('');

  const buildEmailHref = (to: string): string => {
    const subject = locale === 'en' ? 'My saved support resources' : 'Mis recursos de apoyo guardados';
    const intro =
      locale === 'en'
        ? 'Saved from texasabacenterscg.com/support/find:\n\n'
        : 'Guardado desde texasabacenterscg.com/support/find:\n\n';
    const body = savedResources
      .map((r) => {
        const lines = [`• ${r.name}`];
        if (r.phone) lines.push(`  ☎ ${r.phone}`);
        if (r.website) lines.push(`  ${r.website}`);
        if (r.cities[0]) lines.push(`  ${r.cities[0]}`);
        return lines.join('\n');
      })
      .join('\n\n');
    return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(intro + body)}`;
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const win = window.open('', '_blank', 'width=720,height=900');
    if (!win) return;
    const rows = savedResources
      .map(
        (r) => `
        <article>
          <h2>${escapeHtml(r.name)}</h2>
          <p class="meta">${escapeHtml(r.cities.join(', '))} · ${escapeHtml(r.lastReviewed)}</p>
          <p>${escapeHtml(r.description)}</p>
          <p class="contact">
            ${r.phone ? `☎ ${escapeHtml(r.phone)}` : ''}
            ${r.website ? `· ${escapeHtml(r.website)}` : ''}
            ${r.address ? `· ${escapeHtml(r.address)}` : ''}
          </p>
        </article>`,
      )
      .join('');
    win.document.write(`<!doctype html><html><head><title>Saved support resources</title>
      <style>
        body { font-family: -apple-system, system-ui, sans-serif; max-width: 680px; margin: 24px auto; padding: 0 16px; color: #212226; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        h2 { font-size: 15px; margin: 0 0 4px; }
        article { padding: 12px 0; border-bottom: 1px solid #d4d8e3; page-break-inside: avoid; }
        .meta { font-size: 11px; color: #6e727a; margin: 0 0 6px; }
        .contact { font-size: 11px; color: #5a5d64; margin-top: 6px; }
        p { font-size: 12.5px; line-height: 1.5; margin: 0 0 6px; }
      </style></head><body>
      <h1>${locale === 'en' ? 'Saved support resources' : 'Recursos de apoyo guardados'}</h1>
      <p class="meta">texasabacenterscg.com/support/find</p>
      ${rows}
      <script>window.onload = () => window.print();</script>
      </body></html>`);
    win.document.close();
  };

  const isEmpty = savedResources.length === 0;

  return (
    <section className="rounded-2xl border border-surface-border bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-muted-900">
          <BookmarkPlus className="h-4 w-4 text-amber-500" />
          {t.rightDefaultTitle}
        </p>
        {!isEmpty && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-bold text-amber-700">
            {t.rightSavedCount(savedResources.length)}
          </span>
        )}
      </div>

      {isEmpty ? (
        <>
          <p className="mt-2 text-[12.5px] leading-relaxed text-brand-muted-600">{t.rightDefaultEmpty}</p>
          <p className="mt-2 text-[11px] leading-snug text-brand-muted-500">{t.rightDefaultEmptyHint}</p>
        </>
      ) : (
        <>
          <ul className="mt-3 flex flex-col gap-1.5">
            {savedResources.map((r) => (
              <li
                key={`saved-${r.id}`}
                className="group flex items-start gap-2 rounded-lg border border-surface-border bg-surface-muted/40 p-2"
              >
                <button
                  type="button"
                  onClick={() => onPin(r.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-[12.5px] font-semibold text-brand-muted-900 hover:text-primary">
                    {r.name}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-brand-muted-500">
                    {r.cities[0]}
                    {r.phone ? ` · ${r.phone}` : ''}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => onUnsave(r.id)}
                  className="rounded-md p-1 text-brand-muted-400 opacity-0 transition-opacity hover:bg-surface-subtle hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Remove from saved"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-surface-border pt-3">
            <label className="text-[10.5px] font-semibold uppercase tracking-wider text-brand-muted-500">
              {t.rightEmailLabel}
            </label>
            <div className="mt-1.5 flex gap-1.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.rightEmailPlaceholder}
                className="min-w-0 flex-1 rounded-lg border border-surface-border bg-white px-2 py-1.5 text-[12px] outline-none ring-primary/20 focus:ring-2"
              />
              <a
                href={email ? buildEmailHref(email) : '#'}
                onClick={(e) => {
                  if (!email) e.preventDefault();
                }}
                className={cn(
                  'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors',
                  email
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'cursor-not-allowed bg-surface-muted text-brand-muted-400',
                )}
                aria-disabled={!email}
              >
                <Mail className="h-3.5 w-3.5" />
                {t.rightEmailSend}
              </a>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-primary hover:underline"
              >
                <Printer className="h-3.5 w-3.5" />
                {t.rightPrint}
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand-muted-500 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t.rightClear}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function NavigatorCTA({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section className="rounded-2xl border border-brand-plum-200 bg-gradient-to-br from-brand-plum-50 to-white p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-plum-100 text-brand-plum-700">
          <HeartHandshake className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-brand-plum-800">{t.rightNavigatorTitle}</p>
          <p className="mt-1 text-[11.5px] leading-snug text-brand-plum-700/80">{t.rightNavigatorBody}</p>
          <a
            href="/support/connect"
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-plum-700 px-3 py-1.5 text-[11.5px] font-semibold text-white hover:bg-brand-plum-800"
          >
            {t.rightNavigatorCta}
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Resource card ──────────────────────────────────────────────

interface ResourceCardProps {
  resource: Resource;
  locale: Locale;
  isPinned: boolean;
  isHovered: boolean;
  isSaved: boolean;
  onHover: (id: string | null) => void;
  onPin: (id: string) => void;
  onToggleSave: (id: string) => void;
}

function ResourceCard({
  resource,
  locale,
  isPinned,
  isHovered,
  isSaved,
  onHover,
  onPin,
  onToggleSave,
}: ResourceCardProps) {
  const t = copy[locale];
  const labels = localizedLabel[locale];
  const isCrisis = resource.urgency === 'crisis';
  const isBrowse = resource.urgency === 'sensory-browse';
  const goodFirstStep = resource.goodFirstStep;

  const meta = [
    resource.cities[0],
    resource.ageGroups.includes('All ages') ? 'All ages' : resource.ageGroups.join(', '),
    labels.insurance[resource.insurance],
    resource.delivery.map((d) => labels.delivery[d]).join(' · '),
  ].filter(Boolean);

  type Tone = 'green' | 'red' | 'emerald' | 'neutral';
  const tagList: { label: string; tone: Tone }[] = [];
  if (goodFirstStep) tagList.push({ label: t.goodFirstStepBadge, tone: 'green' });
  if (isCrisis) tagList.push({ label: t.crisisBadge, tone: 'red' });
  if (resource.services.includes('Sensory-friendly business'))
    tagList.push({ label: t.sensoryBadge, tone: 'emerald' });
  resource.tags
    .filter((tg) => !['Good first step', '24/7', 'Sensory-friendly'].includes(tg))
    .slice(0, 2)
    .forEach((tg) => tagList.push({ label: tg, tone: 'neutral' }));

  return (
    <article
      onMouseEnter={() => onHover(resource.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(resource.id)}
      onClick={() => onPin(resource.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onPin(resource.id);
        }
      }}
      tabIndex={0}
      aria-pressed={isPinned}
      className={cn(
        'group relative flex cursor-pointer flex-col gap-2 rounded-2xl border bg-white p-4 text-left shadow-soft outline-none transition-all',
        'focus-visible:ring-2 focus-visible:ring-primary/40',
        isCrisis ? 'border-l-4 border-red-500' : 'border-surface-border',
        isPinned ? 'ring-2 ring-primary/40 shadow-card-hover' : isHovered ? 'border-primary/40 shadow-card-hover' : '',
        isBrowse ? 'p-3' : '',
      )}
    >
      <div className="flex items-start gap-2">
        {goodFirstStep && !isCrisis && (
          <span aria-hidden className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
            <Star className="h-3 w-3 fill-emerald-600 text-emerald-600" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn('font-semibold leading-snug text-brand-muted-900', isBrowse ? 'text-[14px]' : 'text-[15px]')}>
              {resource.name}
            </h3>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(resource.id);
              }}
              className={cn(
                'inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold transition-colors',
                isSaved ? 'bg-amber-100 text-amber-700' : 'text-brand-muted-400 hover:bg-surface-subtle hover:text-primary',
              )}
              aria-label={isSaved ? t.saved : t.saveCard}
              aria-pressed={isSaved}
            >
              <BookmarkPlus className={cn('h-3.5 w-3.5', isSaved && 'fill-amber-500 text-amber-500')} />
              <span className="hidden sm:inline">{isSaved ? t.saved : t.saveCard}</span>
            </button>
          </div>
          {!isBrowse && (
            <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-brand-muted-600">{resource.blurb}</p>
          )}
        </div>
      </div>

      {!isBrowse && (
        <p className="text-[11.5px] text-brand-muted-500">
          {meta.map((m, i) => (
            <span key={`${resource.id}-meta-${i}`}>
              {i > 0 && <span className="mx-1.5 text-brand-muted-300">·</span>}
              {m}
            </span>
          ))}
        </p>
      )}

      {isBrowse && (
        <p className="text-[11px] text-brand-muted-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {resource.cities[0]}
          </span>
        </p>
      )}

      {tagList.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tagList.map((tag, i) => (
            <span
              key={`${resource.id}-tag-${i}`}
              className={cn(
                'inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-semibold',
                tag.tone === 'green' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                tag.tone === 'red' && 'border-red-200 bg-red-50 text-red-700',
                tag.tone === 'emerald' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                tag.tone === 'neutral' && 'border-surface-border bg-surface-muted text-brand-muted-600',
              )}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {(resource.phone || resource.website) && !isBrowse && (
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {resource.phone && (
            <a
              href={`tel:${resource.phone.replace(/[^0-9+]/g, '')}`}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors',
                isCrisis
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-primary text-white hover:bg-primary-dark',
              )}
            >
              <Phone className={cn('h-3.5 w-3.5', isCrisis && 'h-4 w-4')} />
              {t.callButton} {resource.phone}
            </a>
          )}
          {resource.website && (
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border px-2.5 py-1.5 text-[12px] font-semibold text-brand-muted-700 hover:border-primary/30 hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t.websiteButton}
            </a>
          )}
        </div>
      )}

      <div className="mt-1 flex items-center justify-between text-[10.5px] text-brand-muted-400">
        <span title={t.reviewedTooltip(resource.lastReviewed)} className="inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          {resource.lastReviewed}
        </span>
        {!isPinned && <span className="opacity-0 transition-opacity group-hover:opacity-100">{t.hoverHint}</span>}
      </div>
    </article>
  );
}

// ── Active filter chips ────────────────────────────────────────

function ActiveChips({
  locale,
  filters,
  setFilters,
  query,
  setQuery,
}: {
  locale: Locale;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  query: string;
  setQuery: (q: string) => void;
}) {
  const labels = localizedLabel[locale];
  const t = copy[locale];

  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (filters.goodFirstStepOnly) {
    chips.push({ key: 'gfs', label: t.goodFirstStepBadge, remove: () => setFilters({ ...filters, goodFirstStepOnly: false }) });
  }
  filters.cities.forEach((c) => chips.push({ key: `c-${c}`, label: c, remove: () => setFilters({ ...filters, cities: filters.cities.filter((x) => x !== c) }) }));
  filters.services.forEach((s) => chips.push({ key: `s-${s}`, label: labels.services[s], remove: () => setFilters({ ...filters, services: filters.services.filter((x) => x !== s) }) }));
  filters.ageGroups.forEach((a) => chips.push({ key: `a-${a}`, label: a, remove: () => setFilters({ ...filters, ageGroups: filters.ageGroups.filter((x) => x !== a) }) }));
  filters.insurance.forEach((i) => chips.push({ key: `i-${i}`, label: labels.insurance[i], remove: () => setFilters({ ...filters, insurance: filters.insurance.filter((x) => x !== i) }) }));
  filters.delivery.forEach((d) => chips.push({ key: `d-${d}`, label: labels.delivery[d], remove: () => setFilters({ ...filters, delivery: filters.delivery.filter((x) => x !== d) }) }));
  if (query.trim()) chips.push({ key: 'q', label: `“${query.trim()}”`, remove: () => setQuery('') });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted-400">
        {t.activeChipsLabel}:
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-[11.5px] font-medium text-primary transition-colors hover:bg-primary/15"
        >
          <span>{chip.label}</span>
          <X className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
}

// ── Inline navigator help row ─────────────────────────────────

function InlineNavigatorHelp({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <div className="my-2 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-plum-100 text-brand-plum-700">
            <HeartHandshake className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold text-brand-plum-800">{t.inlineHelpTitle}</p>
            <p className="text-[12px] text-brand-plum-700/80">{t.inlineHelpBody}</p>
          </div>
        </div>
        <a
          href="/support/connect"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-plum-700 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-brand-plum-800"
        >
          {t.inlineHelpCta}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

// ── Map view (city-grouped fallback for the map toggle) ──────

function MapByCity({
  locale,
  resources,
  hoveredId,
  pinnedId,
  onHover,
  onPin,
}: {
  locale: Locale;
  resources: Resource[];
  hoveredId: string | null;
  pinnedId: string | null;
  onHover: (id: string | null) => void;
  onPin: (id: string) => void;
}) {
  const t = copy[locale];
  if (resources.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-surface-border bg-white/60 p-8 text-center text-sm text-brand-muted-500">
        {t.mapEmpty}
      </div>
    );
  }
  const byCity = new Map<City, Resource[]>();
  resources.forEach((r) => {
    r.cities.forEach((c) => {
      if (!byCity.has(c)) byCity.set(c, []);
      byCity.get(c)!.push(r);
    });
  });
  const ordered = Array.from(byCity.entries()).sort((a, b) => b[1].length - a[1].length);
  return (
    <div className="space-y-3">
      <p className="text-[12px] text-brand-muted-500">{t.mapHint}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ordered.map(([city, list]) => (
          <div
            key={city}
            className="rounded-2xl border border-surface-border bg-white p-4 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-muted-900">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {city}
              </p>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                {list.length}
              </span>
            </div>
            <ul className="mt-3 flex flex-col gap-1">
              {list.slice(0, 8).map((r) => (
                <li key={`${city}-${r.id}`}>
                  <button
                    type="button"
                    onMouseEnter={() => onHover(r.id)}
                    onMouseLeave={() => onHover(null)}
                    onFocus={() => onHover(r.id)}
                    onClick={() => onPin(r.id)}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[12.5px] transition-colors',
                      pinnedId === r.id
                        ? 'bg-primary text-white'
                        : hoveredId === r.id
                          ? 'bg-primary/10 text-brand-muted-900'
                          : 'text-brand-muted-700 hover:bg-surface-subtle',
                    )}
                  >
                    <span className="truncate">{r.name}</span>
                    {r.urgency === 'crisis' && <span className="ml-1 rounded-full bg-red-100 px-1.5 py-0 text-[10px] font-bold text-red-700">24/7</span>}
                  </button>
                </li>
              ))}
              {list.length > 8 && (
                <li className="px-2 pt-1 text-[11px] text-brand-muted-400">+{list.length - 8} more in {city}</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

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
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('recommended');
  const [view, setView] = useState<ViewKey>('list');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const t = copy[locale];

  // Restore from URL first (shareable links win), then fall back to localStorage.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = paramsToUrlState(params);
    const hasUrlState =
      params.toString().length > 0 &&
      (fromUrl.query ||
        fromUrl.intent ||
        countActiveFilters(fromUrl.filters) > 0 ||
        fromUrl.sort !== 'recommended' ||
        fromUrl.view !== 'list');

    if (hasUrlState) {
      setActiveIntent(fromUrl.intent);
      setFilters(fromUrl.filters);
      setQuery(fromUrl.query);
      setSort(fromUrl.sort);
      setView(fromUrl.view);
    } else {
      const raw = window.localStorage.getItem('cg2.find.filters');
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<FilterState>;
          setFilters({ ...emptyFilters, ...parsed });
        } catch {
          /* ignore corrupt JSON */
        }
      }
    }

    const savedRaw = window.localStorage.getItem('cg2.find.saved');
    if (savedRaw) {
      try {
        const parsed = JSON.parse(savedRaw) as string[];
        if (Array.isArray(parsed)) setSavedIds(parsed);
      } catch {
        /* ignore */
      }
    }
    setHydrated(true);
  }, []);

  // Keep the URL in sync after hydration so refresh / share links round-trip.
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    const params = urlStateToParams({ filters, query, intent: activeIntent, sort, view });
    const qs = params.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', next);
  }, [filters, query, activeIntent, sort, view, hydrated]);

  // Persist saved-resource IDs.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('cg2.find.saved', JSON.stringify(savedIds));
    } catch {
      /* ignore */
    }
  }, [savedIds]);

  const filteredResources = useMemo(() => {
    const a = applyFilters(findResources, filters);
    const b = searchResources(a, query);
    return sortResources(b, sort);
  }, [filters, query, sort]);

  const savedResources = useMemo(
    () => savedIds.map((id) => findResources.find((r) => r.id === id)).filter((r): r is Resource => Boolean(r)),
    [savedIds],
  );

  // Keyboard shortcuts: /, ⌘K, ⌘S, ↑/↓, Enter, Esc, ?
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping = !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      const focusedId = pinnedId ?? hoveredId;

      // ⌘K / Ctrl+K → focus search (works even while typing in another input).
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('find-search')?.focus();
        return;
      }

      // ⌘S / Ctrl+S → save the focused card.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        if (focusedId) {
          e.preventDefault();
          setSavedIds((prev) =>
            prev.includes(focusedId) ? prev.filter((x) => x !== focusedId) : [...prev, focusedId],
          );
        }
        return;
      }

      if (isTyping) {
        if (e.key === 'Escape') (target as HTMLElement).blur();
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        document.getElementById('find-search')?.focus();
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setHelpOpen((p) => !p);
        return;
      }

      if (e.key === 'Escape') {
        if (helpOpen) setHelpOpen(false);
        else if (filtersDrawerOpen) setFiltersDrawerOpen(false);
        else if (savedDrawerOpen) setSavedDrawerOpen(false);
        else if (pinnedId) setPinnedId(null);
        else if (hoveredId) setHoveredId(null);
        return;
      }

      if (filteredResources.length === 0) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = focusedId
          ? filteredResources.findIndex((r) => r.id === focusedId)
          : -1;
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        const nextIndex = Math.max(
          0,
          Math.min(filteredResources.length - 1, (currentIndex < 0 ? -1 : currentIndex) + delta),
        );
        const nextId = filteredResources[nextIndex].id;
        setHoveredId(nextId);
        const node = document.getElementById(`card-${nextId}`);
        node?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      if (e.key === 'Enter' && focusedId) {
        e.preventDefault();
        setPinnedId((prev) => (prev === focusedId ? null : focusedId));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [filteredResources, hoveredId, pinnedId, helpOpen]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handlePin = (id: string) => {
    setPinnedId((prev) => (prev === id ? null : id));
  };

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
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setHelpOpen(true)}
                className="hidden items-center gap-1.5 rounded-xl border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-brand-muted-700 hover:border-primary/30 hover:text-primary md:inline-flex"
                aria-label={t.keyboardButton}
              >
                <Keyboard className="h-4 w-4" />
                <span>?</span>
              </button>
              <button
                onClick={() => setLocale((l) => (l === 'en' ? 'es' : 'en'))}
                className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3 py-2 text-xs font-semibold text-brand-muted-700 hover:border-primary/30 hover:text-primary"
                aria-label="Toggle language"
              >
                <Languages className="h-4 w-4" />
                <span>{locale === 'en' ? 'EN' : 'ES'}</span>
                <span className="text-brand-muted-400">·</span>
                <span>{t.languageToggle}</span>
              </button>
            </div>
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
            {/* Left rail (hidden < lg; opens as a drawer instead) */}
            <aside className="hidden lg:sticky lg:top-[104px] lg:block lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-1">
              <LeftFilters locale={locale} filters={filters} setFilters={setFilters} />
            </aside>

            {/* Center column */}
            <div className="min-w-0">
              {/* Sticky toolbar */}
              <div className="sticky top-[88px] z-10 -mx-1 flex flex-col gap-3 rounded-2xl border border-surface-border bg-white/95 p-3 shadow-soft backdrop-blur-md">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted-400" />
                    <input
                      id="find-search"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full rounded-xl border border-surface-border bg-white py-2 pl-9 pr-24 text-sm outline-none ring-primary/20 transition focus:ring-2"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wider text-brand-muted-400 lg:flex">
                      <kbd className="rounded border border-surface-border bg-surface-muted px-1 py-0.5 text-[10px] font-mono text-brand-muted-500">/</kbd>
                      <span>{t.searchShortcut}</span>
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setFiltersDrawerOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-white px-2.5 py-1.5 text-[12px] font-semibold text-brand-muted-700 hover:border-primary/30 hover:text-primary lg:hidden"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    {t.mobileFiltersButton}
                    {countActiveFilters(filters) > 0 && (
                      <span className="rounded-full bg-primary/10 px-1.5 py-0 text-[10px] font-bold text-primary">
                        {countActiveFilters(filters)}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSavedDrawerOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-white px-2.5 py-1.5 text-[12px] font-semibold text-brand-muted-700 hover:border-primary/30 hover:text-primary lg:hidden"
                  >
                    <BookmarkPlus className={cn('h-3.5 w-3.5', savedIds.length > 0 && 'fill-amber-500 text-amber-500')} />
                    {t.mobileSavedButton}
                    {savedIds.length > 0 && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0 text-[10px] font-bold text-amber-700">
                        {savedIds.length}
                      </span>
                    )}
                  </button>

                  <div className="inline-flex items-center gap-1 rounded-xl border border-surface-border bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setView('list')}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors',
                        view === 'list' ? 'bg-primary text-white' : 'text-brand-muted-600 hover:text-primary',
                      )}
                      aria-pressed={view === 'list'}
                    >
                      <List className="h-3.5 w-3.5" />
                      {t.viewList}
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('map')}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors',
                        view === 'map' ? 'bg-primary text-white' : 'text-brand-muted-600 hover:text-primary',
                      )}
                      aria-pressed={view === 'map'}
                    >
                      <MapIcon className="h-3.5 w-3.5" />
                      {t.viewMap}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[12.5px] font-semibold text-brand-muted-700">
                    {t.showing(filteredResources.length, findResources.length)}
                  </p>
                  <label className="inline-flex items-center gap-2 text-[12px] text-brand-muted-600">
                    <span className="font-semibold uppercase tracking-wider text-brand-muted-400">
                      {t.sortLabel}
                    </span>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortKey)}
                      className="rounded-lg border border-surface-border bg-white px-2 py-1 text-[12px] outline-none ring-primary/20 focus:ring-2"
                    >
                      <option value="recommended">{t.sortRecommended}</option>
                      <option value="recent">{t.sortRecent}</option>
                      <option value="alpha">{t.sortAlpha}</option>
                    </select>
                  </label>
                </div>

                <ActiveChips
                  locale={locale}
                  filters={filters}
                  setFilters={setFilters}
                  query={query}
                  setQuery={setQuery}
                />
              </div>

              {/* Results body */}
              <div className="mt-4">
                {view === 'map' ? (
                  <MapByCity
                    locale={locale}
                    resources={filteredResources}
                    hoveredId={hoveredId}
                    pinnedId={pinnedId}
                    onHover={setHoveredId}
                    onPin={handlePin}
                  />
                ) : filteredResources.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-surface-border bg-white/60 p-8 text-center">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted-700">
                      <Sparkles className="h-4 w-4 text-primary" />
                      {t.emptyTitle}
                    </p>
                    <p className="mt-2 text-[12.5px] text-brand-muted-500">{t.emptyBody}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setFilters(emptyFilters);
                        setQuery('');
                      }}
                      className="mt-3 inline-flex items-center gap-1 rounded-lg border border-surface-border px-3 py-1.5 text-[12px] font-semibold text-primary hover:bg-primary/5"
                    >
                      <Eraser className="h-3.5 w-3.5" />
                      {t.clearAll}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredResources.map((r, i) => (
                      <div key={r.id} id={`card-${r.id}`}>
                        <ResourceCard
                          resource={r}
                          locale={locale}
                          isPinned={pinnedId === r.id}
                          isHovered={hoveredId === r.id}
                          isSaved={savedIds.includes(r.id)}
                          onHover={setHoveredId}
                          onPin={handlePin}
                          onToggleSave={toggleSave}
                        />
                        {(i + 1) % 12 === 0 && i < filteredResources.length - 1 && (
                          <InlineNavigatorHelp locale={locale} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right rail — context panel */}
            <aside className="hidden lg:flex lg:sticky lg:top-[104px] lg:max-h-[calc(100vh-120px)] lg:flex-col lg:gap-3 lg:overflow-y-auto lg:pr-1">
              {(() => {
                const focusedId = pinnedId ?? hoveredId;
                const focused = focusedId ? findResources.find((r) => r.id === focusedId) ?? null : null;
                if (focused) {
                  return (
                    <ExpandedResourcePanel
                      resource={focused}
                      locale={locale}
                      isPinned={pinnedId === focused.id}
                      isSaved={savedIds.includes(focused.id)}
                      onClose={() => setPinnedId(null)}
                      onToggleSave={toggleSave}
                    />
                  );
                }
                return (
                  <>
                    <SavedResourcesPanel
                      locale={locale}
                      savedResources={savedResources}
                      onUnsave={(id) => setSavedIds((prev) => prev.filter((x) => x !== id))}
                      onClear={() => setSavedIds([])}
                      onPin={handlePin}
                    />
                    <NavigatorCTA locale={locale} />
                  </>
                );
              })()}
            </aside>
          </div>
        </div>
      </section>

      {/* Mobile filters drawer (< lg) */}
      {filtersDrawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t.filtersTitle}
        >
          <button
            type="button"
            aria-label={t.mobileDrawerClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setFiltersDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-[340px] flex-col bg-white shadow-card-hover">
            <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted-900">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                {t.filtersTitle}
              </p>
              <button
                type="button"
                onClick={() => setFiltersDrawerOpen(false)}
                className="rounded-md p-1 text-brand-muted-400 hover:bg-surface-subtle hover:text-brand-muted-700"
                aria-label={t.mobileDrawerClose}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <LeftFilters locale={locale} filters={filters} setFilters={setFilters} />
            </div>
            <div className="border-t border-surface-border px-4 py-3">
              <button
                type="button"
                onClick={() => setFiltersDrawerOpen(false)}
                className="w-full rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                {t.showing(filteredResources.length, findResources.length)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile saved drawer (< lg) */}
      {savedDrawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t.rightDefaultTitle}
        >
          <button
            type="button"
            aria-label={t.mobileDrawerClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSavedDrawerOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-card-hover sm:inset-y-0 sm:bottom-auto sm:right-0 sm:left-auto sm:max-h-none sm:w-[420px] sm:max-w-full sm:rounded-none sm:rounded-l-3xl">
            <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted-900">
                <BookmarkPlus className="h-4 w-4 text-amber-500" />
                {t.rightDefaultTitle}
              </p>
              <button
                type="button"
                onClick={() => setSavedDrawerOpen(false)}
                className="rounded-md p-1 text-brand-muted-400 hover:bg-surface-subtle hover:text-brand-muted-700"
                aria-label={t.mobileDrawerClose}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <SavedResourcesPanel
                locale={locale}
                savedResources={savedResources}
                onUnsave={(id) => setSavedIds((prev) => prev.filter((x) => x !== id))}
                onClear={() => setSavedIds([])}
                onPin={(id) => {
                  handlePin(id);
                  setSavedDrawerOpen(false);
                }}
              />
              <NavigatorCTA locale={locale} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile pinned-detail modal (< lg) — the right rail's expanded view as a modal */}
      {pinnedId && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t.pinnedLabel}
        >
          <button
            type="button"
            aria-label={t.expandedClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setPinnedId(null)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-card-hover sm:inset-y-6 sm:left-1/2 sm:bottom-auto sm:max-h-[88vh] sm:w-[520px] sm:max-w-full sm:-translate-x-1/2 sm:rounded-2xl">
            {(() => {
              const focused = findResources.find((r) => r.id === pinnedId);
              if (!focused) return null;
              return (
                <div className="flex-1 overflow-y-auto p-4">
                  <ExpandedResourcePanel
                    resource={focused}
                    locale={locale}
                    isPinned
                    isSaved={savedIds.includes(focused.id)}
                    onClose={() => setPinnedId(null)}
                    onToggleSave={toggleSave}
                  />
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {helpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t.helpTitle}
          onClick={(e) => {
            if (e.target === e.currentTarget) setHelpOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-surface-border bg-white p-5 shadow-card-hover">
            <div className="flex items-start justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-base font-semibold text-brand-muted-900">
                <Keyboard className="h-4 w-4 text-primary" />
                {t.helpTitle}
              </p>
              <button
                onClick={() => setHelpOpen(false)}
                className="rounded-md p-1 text-brand-muted-400 hover:bg-surface-subtle hover:text-brand-muted-700"
                aria-label={t.helpClose}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {t.helpRows.map(([keys, label]) => (
                <li
                  key={keys}
                  className="flex items-center justify-between gap-3 rounded-lg border border-surface-border bg-surface-muted/40 px-3 py-2"
                >
                  <span className="text-[12.5px] text-brand-muted-700">{label}</span>
                  <span className="rounded-md border border-surface-border bg-white px-2 py-0.5 text-[11px] font-mono font-semibold text-brand-muted-700">
                    {keys}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-brand-muted-500">
              {locale === 'en'
                ? 'Filtered URLs are shareable — copy this tab\'s link to send a co-parent the same view.'
                : 'Las URLs filtradas se pueden compartir — copia el enlace para que tu copadre vea la misma vista.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
