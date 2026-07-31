'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Brain,
  Check,
  ChevronDown,
  CircleDollarSign,
  ExternalLink,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Languages,
  MapPin,
  Phone,
  Printer,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AGE_GROUPS,
  CITIES,
  DELIVERY,
  findResources,
  INSURANCE,
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
type CategoryKey = 'therapy' | 'medical' | 'respite' | 'community' | 'school' | 'financial';

interface CategoryDefinition {
  key: CategoryKey;
  icon: LucideIcon;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
  services?: Service[];
  intent?: Intent;
  tileClass: string;
  iconClass: string;
  badgeClass: string;
}

const COPY = {
  en: {
    title: 'Find local help that fits your family',
    intro: "You don't have to figure this out alone. Tell us what you're looking for and we'll help you narrow trusted resources near you.",
    searchLabel: 'What are you looking for?',
    searchPlaceholder: 'Speech therapy, parent support, respite...',
    locationLabel: 'City or area',
    allLocations: 'All locations',
    findHelp: 'Find help',
    helpChoose: 'Help me choose',
    helpChooseOn: 'Showing good first steps',
    categoriesLabel: 'Browse by need',
    service: 'Service type',
    location: 'Location',
    age: 'Ages served',
    insurance: 'Insurance / payment',
    delivery: 'In person / virtual',
    moreFilters: 'More filters',
    hideFilters: 'Hide filters',
    all: 'All',
    results: (count: number) => `${count} resources match your search`,
    closestMatches: 'Closest matches to your search',
    clearAll: 'Clear all',
    clearFilters: 'Clear filters',
    goodFirstStep: 'Good first step',
    reviewed: (date: string) => `Reviewed ${date}`,
    viewDetails: 'View details',
    savePrivately: 'Save privately',
    saved: 'Saved privately',
    showMore: 'Show more resources',
    emptyTitle: 'Nothing matches yet',
    emptyBody: 'Try clearing one filter or choosing a broader area.',
    detailsTitle: 'Resource details',
    closeDetails: 'Close details',
    services: 'Services',
    ages: 'Ages served',
    payment: 'Insurance / payment',
    format: 'How support is offered',
    address: 'Location',
    helpful: 'Helpful to know',
    questions: 'Questions worth asking',
    visitWebsite: 'Visit website',
    call: 'Call',
    openGuide: 'Open Provider Interview Guide',
    guideSub: 'Bring better questions to your first call.',
    shortlist: 'My private shortlist',
    shortlistBody: 'Saved only in this browser. Common Ground never receives your list.',
    compare: 'Compare',
    hideCompare: 'Hide comparison',
    print: 'Print shortlist',
    downloadQuestions: 'Download questions',
    remove: 'Remove',
    noSaved: 'Save a few resources to compare them without losing your place.',
    privacy: 'Private by design',
    privacyBody: 'Listings are informational, not rankings or endorsements. Confirm availability, insurance, and services directly with each organization.',
    language: 'Español',
  },
  es: {
    title: 'Encuentra ayuda local para tu familia',
    intro: 'No tienes que resolverlo solo. Dinos qué buscas y te ayudaremos a reducir la lista de recursos cerca de ti.',
    searchLabel: '¿Qué estás buscando?',
    searchPlaceholder: 'Terapia del habla, apoyo para padres, relevo...',
    locationLabel: 'Ciudad o área',
    allLocations: 'Todas las ubicaciones',
    findHelp: 'Buscar ayuda',
    helpChoose: 'Ayúdame a elegir',
    helpChooseOn: 'Mostrando buenos primeros pasos',
    categoriesLabel: 'Explorar por necesidad',
    service: 'Tipo de servicio',
    location: 'Ubicación',
    age: 'Edades',
    insurance: 'Seguro / pago',
    delivery: 'En persona / virtual',
    moreFilters: 'Más filtros',
    hideFilters: 'Ocultar filtros',
    all: 'Todos',
    results: (count: number) => `${count} recursos coinciden con tu búsqueda`,
    closestMatches: 'Coincidencias para tu búsqueda',
    clearAll: 'Limpiar todo',
    clearFilters: 'Limpiar filtros',
    goodFirstStep: 'Buen primer paso',
    reviewed: (date: string) => `Revisado ${date}`,
    viewDetails: 'Ver detalles',
    savePrivately: 'Guardar en privado',
    saved: 'Guardado en privado',
    showMore: 'Mostrar más recursos',
    emptyTitle: 'Todavía no hay coincidencias',
    emptyBody: 'Prueba quitar un filtro o elegir un área más amplia.',
    detailsTitle: 'Detalles del recurso',
    closeDetails: 'Cerrar detalles',
    services: 'Servicios',
    ages: 'Edades',
    payment: 'Seguro / pago',
    format: 'Cómo se ofrece el apoyo',
    address: 'Ubicación',
    helpful: 'Información útil',
    questions: 'Preguntas que vale la pena hacer',
    visitWebsite: 'Visitar sitio web',
    call: 'Llamar',
    openGuide: 'Abrir la guía para entrevistar proveedores',
    guideSub: 'Lleva mejores preguntas a tu primera llamada.',
    shortlist: 'Mi lista privada',
    shortlistBody: 'Se guarda solo en este navegador. Common Ground nunca recibe tu lista.',
    compare: 'Comparar',
    hideCompare: 'Ocultar comparación',
    print: 'Imprimir lista',
    downloadQuestions: 'Descargar preguntas',
    remove: 'Quitar',
    noSaved: 'Guarda algunos recursos para compararlos sin perder tu lugar.',
    privacy: 'Privado por diseño',
    privacyBody: 'Los listados son informativos, no clasificaciones ni recomendaciones. Confirma disponibilidad, seguro y servicios directamente.',
    language: 'English',
  },
} as const;

const CATEGORIES: CategoryDefinition[] = [
  {
    key: 'therapy',
    icon: Brain,
    label: { en: 'Therapy & development', es: 'Terapia y desarrollo' },
    description: { en: 'Services that help children learn and grow', es: 'Servicios para aprender y crecer' },
    services: ['ABA', 'Speech', 'OT', 'Feeding'],
    tileClass: 'border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 hover:border-teal-300',
    iconClass: 'bg-teal-100 text-teal-700',
    badgeClass: 'bg-teal-50 text-teal-700',
  },
  {
    key: 'medical',
    icon: Stethoscope,
    label: { en: 'Medical & dental', es: 'Médico y dental' },
    description: { en: 'Healthcare and specialty care', es: 'Atención médica y especializada' },
    services: ['Pediatrician', 'Diagnosis'],
    tileClass: 'border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 hover:border-blue-300',
    iconClass: 'bg-blue-100 text-blue-700',
    badgeClass: 'bg-blue-50 text-blue-700',
  },
  {
    key: 'respite',
    icon: HandHeart,
    label: { en: 'Respite & caregiver support', es: 'Relevo y apoyo al cuidador' },
    description: { en: 'Take a break and get support', es: 'Descansa y recibe apoyo' },
    services: ['Respite', 'Mental Health'],
    tileClass: 'border-rose-100 bg-gradient-to-br from-rose-50 to-orange-50 hover:border-rose-300',
    iconClass: 'bg-rose-100 text-rose-600',
    badgeClass: 'bg-rose-50 text-rose-700',
  },
  {
    key: 'community',
    icon: Users,
    label: { en: 'Parent & community support', es: 'Apoyo para padres y comunidad' },
    description: { en: 'Connect, learn, and feel less alone', es: 'Conecta, aprende y siéntete acompañado' },
    services: ['Recreation', 'Sensory-friendly business'],
    tileClass: 'border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 hover:border-violet-300',
    iconClass: 'bg-violet-100 text-violet-700',
    badgeClass: 'bg-violet-50 text-violet-700',
  },
  {
    key: 'school',
    icon: GraduationCap,
    label: { en: 'School & advocacy', es: 'Escuela y defensa' },
    description: { en: 'Support at school and beyond', es: 'Apoyo escolar y más' },
    services: ['Advocacy'],
    tileClass: 'border-amber-100 bg-gradient-to-br from-amber-50 to-yellow-50 hover:border-amber-300',
    iconClass: 'bg-amber-100 text-amber-700',
    badgeClass: 'bg-amber-50 text-amber-800',
  },
  {
    key: 'financial',
    icon: CircleDollarSign,
    label: { en: 'Financial help', es: 'Ayuda financiera' },
    description: { en: 'Funding and cost-saving support', es: 'Apoyo con costos y financiamiento' },
    intent: 'financial',
    tileClass: 'border-emerald-100 bg-gradient-to-br from-emerald-50 to-lime-50 hover:border-emerald-300',
    iconClass: 'bg-emerald-100 text-emerald-700',
    badgeClass: 'bg-emerald-50 text-emerald-700',
  },
];

const QUESTIONS = {
  en: [
    "What experience do you have with needs like my child's?",
    'What will the first few weeks look like?',
    'How do you communicate progress with families?',
    'What is your cancellation or reschedule policy?',
  ],
  es: [
    '¿Qué experiencia tienen con necesidades como las de mi hijo?',
    '¿Cómo serán las primeras semanas?',
    '¿Cómo comunican el progreso a las familias?',
    '¿Cuál es su política de cancelación o reprogramación?',
  ],
};

function categoryMatches(resource: Resource, category: CategoryDefinition): boolean {
  if (category.intent && resource.intents.includes(category.intent)) return true;
  return Boolean(category.services?.some((service) => resource.services.includes(service)));
}

function categoryForResource(resource: Resource): CategoryDefinition {
  if (resource.intents.includes('financial')) return CATEGORIES[5];
  if (resource.services.includes('Respite') || resource.services.includes('Mental Health')) return CATEGORIES[2];
  if (resource.services.includes('Advocacy')) return CATEGORIES[4];
  if (resource.services.includes('Pediatrician') || resource.services.includes('Diagnosis')) return CATEGORIES[1];
  if (resource.services.some((service) => ['ABA', 'Speech', 'OT', 'Feeding'].includes(service))) return CATEGORIES[0];
  return CATEGORIES[3];
}

function searchResource(resource: Resource, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const terms = normalized.split(/\s+/);
  const haystack = [
    resource.name,
    resource.blurb,
    resource.description,
    resource.helpfulToKnow ?? '',
    resource.cities.join(' '),
    resource.services.join(' '),
    resource.tags.join(' '),
    resource.address ?? '',
  ]
    .join(' ')
    .toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

function recommendedSort(a: Resource, b: Resource): number {
  const rank = (resource: Resource) => {
    if (resource.urgency === 'crisis') return 0;
    if (resource.goodFirstStep) return 1;
    return 2;
  };
  return rank(a) - rank(b) || a.name.localeCompare(b.name);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative min-w-[148px] flex-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-surface-border bg-white px-3 pr-9 text-[13px] font-semibold text-brand-muted-800 shadow-sm outline-none transition hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/15"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted-400" />
    </label>
  );
}

export default function FindLocalHelpPage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [query, setQuery] = useState('');
  const [city, setCity] = useState<City | ''>('');
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [service, setService] = useState<Service | ''>('');
  const [age, setAge] = useState<AgeGroup | ''>('');
  const [insurance, setInsurance] = useState<Insurance | ''>('');
  const [delivery, setDelivery] = useState<Delivery | ''>('');
  const [goodFirstStepOnly, setGoodFirstStepOnly] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedReady, setSavedReady] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const t = COPY[locale];

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('cg-find-local-shortlist-v2');
      if (stored) setSavedIds(JSON.parse(stored) as string[]);
    } catch {
      setSavedIds([]);
    } finally {
      setSavedReady(true);
    }
  }, []);

  useEffect(() => {
    if (!savedReady) return;
    window.localStorage.setItem('cg-find-local-shortlist-v2', JSON.stringify(savedIds));
  }, [savedIds, savedReady]);

  const filteredResources = useMemo(() => {
    const selectedCategory = category ? CATEGORIES.find((item) => item.key === category) : null;
    return findResources
      .filter((resource) => searchResource(resource, query))
      .filter((resource) => (!city ? true : resource.cities.includes(city)))
      .filter((resource) => (!selectedCategory ? true : categoryMatches(resource, selectedCategory)))
      .filter((resource) => (!service ? true : resource.services.includes(service)))
      .filter((resource) => (!age ? true : resource.ageGroups.includes(age)))
      .filter((resource) => (!insurance ? true : resource.insurance === insurance))
      .filter((resource) => (!delivery ? true : resource.delivery.includes(delivery)))
      .filter((resource) => (!goodFirstStepOnly ? true : resource.goodFirstStep || resource.urgency === 'crisis'))
      .sort(recommendedSort);
  }, [age, category, city, delivery, goodFirstStepOnly, insurance, query, service]);

  const visibleResources = filteredResources.slice(0, visibleCount);
  const savedResources = useMemo(
    () => savedIds.map((id) => findResources.find((resource) => resource.id === id)).filter(Boolean) as Resource[],
    [savedIds],
  );

  const activeFilters = [
    category ? CATEGORIES.find((item) => item.key === category)?.label[locale] : null,
    city || null,
    service || null,
    age || null,
    insurance || null,
    delivery || null,
    goodFirstStepOnly ? t.goodFirstStep : null,
  ].filter(Boolean) as string[];

  const clearFilters = () => {
    setQuery('');
    setCity('');
    setCategory(null);
    setService('');
    setAge('');
    setInsurance('');
    setDelivery('');
    setGoodFirstStepOnly(false);
    setVisibleCount(6);
  };

  const toggleSave = (id: string) => {
    setSavedIds((current) => (current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]));
  };

  const handleFind = () => {
    setVisibleCount(6);
    window.requestAnimationFrame(() => {
      document.getElementById('local-help-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const printShortlist = () => {
    if (!savedResources.length) return;
    const popup = window.open('', '_blank', 'width=800,height=900');
    if (!popup) return;
    const rows = savedResources
      .map(
        (resource) => `<article><h2>${escapeHtml(resource.name)}</h2><p class="meta">${escapeHtml(resource.cities.join(', '))}</p><p>${escapeHtml(resource.blurb)}</p><p class="meta">${escapeHtml(resource.services.join(' · '))} · ${escapeHtml(resource.ageGroups.join(', '))} · ${escapeHtml(resource.insurance)}</p>${resource.phone ? `<p>${escapeHtml(resource.phone)}</p>` : ''}${resource.website ? `<p>${escapeHtml(resource.website)}</p>` : ''}</article>`,
      )
      .join('');
    popup.document.write(`<!doctype html><html><head><title>Common Ground shortlist</title><style>body{font-family:Arial,sans-serif;max-width:720px;margin:32px auto;padding:0 20px;color:#14274a}h1{font-size:24px}h2{font-size:17px;margin:0 0 4px}article{padding:18px 0;border-bottom:1px solid #dfe5ee;page-break-inside:avoid}p{font-size:13px;line-height:1.55;margin:5px 0}.meta{color:#687389;font-size:11px}</style></head><body><h1>${escapeHtml(t.shortlist)}</h1><p class="meta">texasabacenterscg.com/support/find</p>${rows}<script>window.onload=()=>window.print()</script></body></html>`);
    popup.document.close();
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-3 py-4 sm:px-5 lg:px-7 lg:py-7">
      <div className="mx-auto max-w-[1480px]">
        <section className="relative overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-[#f5fbff] via-white to-[#fff4eb] px-5 py-7 shadow-soft sm:px-8 lg:px-10 lg:py-9">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl" />
          <div className="pointer-events-none absolute right-20 top-16 hidden h-24 w-64 rotate-[-8deg] rounded-[50%] border-t-2 border-dashed border-teal-500/35 lg:block" />
          <MapPin className="pointer-events-none absolute right-20 top-9 hidden h-8 w-8 text-teal-600/70 lg:block" />

          <div className="relative flex items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Common Ground · Local Support</p>
              <h1 className="font-display text-3xl font-semibold leading-tight text-[#12284d] sm:text-4xl lg:text-[46px]">
                {t.title}
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-brand-muted-600 sm:text-base">{t.intro}</p>
            </div>
            <button
              type="button"
              onClick={() => setLocale((current) => (current === 'en' ? 'es' : 'en'))}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-2 text-xs font-bold text-primary shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Languages className="h-4 w-4" />
              {t.language}
            </button>
          </div>

          <div className="relative mt-7 grid gap-3 rounded-2xl border border-white bg-white/90 p-3 shadow-[0_14px_40px_rgba(25,49,84,0.10)] lg:grid-cols-[minmax(0,1.3fr)_minmax(220px,.7fr)_140px_170px] lg:items-end">
            <label>
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brand-muted-600">{t.searchLabel}</span>
              <span className="relative block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted-400" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleCount(6);
                  }}
                  placeholder={t.searchPlaceholder}
                  className="h-12 w-full rounded-xl border border-surface-border bg-white pl-10 pr-3 text-sm text-brand-muted-900 outline-none transition placeholder:text-brand-muted-400 focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </span>
            </label>
            <label>
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brand-muted-600">{t.locationLabel}</span>
              <span className="relative block">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted-400" />
                <select
                  value={city}
                  onChange={(event) => {
                    setCity(event.target.value as City | '');
                    setVisibleCount(6);
                  }}
                  className="h-12 w-full appearance-none rounded-xl border border-surface-border bg-white pl-10 pr-9 text-sm font-semibold text-brand-muted-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  <option value="">{t.allLocations}</option>
                  {CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted-400" />
              </span>
            </label>
            <button
              type="button"
              onClick={handleFind}
              className="h-12 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(244,63,94,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(244,63,94,0.32)]"
            >
              {t.findHelp}
            </button>
            <button
              type="button"
              onClick={() => {
                setGoodFirstStepOnly((current) => !current);
                setVisibleCount(6);
              }}
              className={cn(
                'inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition',
                goodFirstStepOnly
                  ? 'border-teal-600 bg-teal-600 text-white shadow-md'
                  : 'border-teal-100 bg-teal-50 text-teal-700 hover:border-teal-300 hover:bg-teal-100',
              )}
            >
              <Sparkles className="h-4 w-4" />
              {goodFirstStepOnly ? t.helpChooseOn : t.helpChoose}
            </button>
          </div>
        </section>

        <section className="mt-5" aria-labelledby="browse-by-need">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="browse-by-need" className="text-sm font-bold text-[#17315a]">{t.categoriesLabel}</h2>
            {activeFilters.length > 0 && (
              <button type="button" onClick={clearFilters} className="text-xs font-bold text-primary hover:underline">{t.clearAll}</button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {CATEGORIES.map((item) => {
              const Icon = item.icon;
              const selected = category === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setCategory((current) => (current === item.key ? null : item.key));
                    setVisibleCount(6);
                  }}
                  aria-pressed={selected}
                  className={cn(
                    'group relative min-h-[152px] overflow-hidden rounded-2xl border p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    item.tileClass,
                    selected && 'ring-2 ring-primary ring-offset-2',
                  )}
                >
                  <span className={cn('mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl transition group-hover:scale-105', item.iconClass)}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <strong className="block text-[15px] leading-snug text-[#17315a]">{item.label[locale]}</strong>
                  <span className="mt-1.5 block text-xs leading-5 text-brand-muted-600">{item.description[locale]}</span>
                  {selected && <Check className="absolute right-3 top-3 h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-surface-border bg-white p-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <FilterSelect label={t.service} value={service} onChange={(value) => { setService(value as Service | ''); setVisibleCount(6); }}>
              <option value="">{t.service}</option>
              {SERVICES.map((item) => <option key={item} value={item}>{item}</option>)}
            </FilterSelect>
            <FilterSelect label={t.location} value={city} onChange={(value) => { setCity(value as City | ''); setVisibleCount(6); }}>
              <option value="">{t.location}</option>
              {CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </FilterSelect>
            <FilterSelect label={t.age} value={age} onChange={(value) => { setAge(value as AgeGroup | ''); setVisibleCount(6); }}>
              <option value="">{t.age}</option>
              {AGE_GROUPS.map((item) => <option key={item} value={item}>{item}</option>)}
            </FilterSelect>
            <FilterSelect label={t.insurance} value={insurance} onChange={(value) => { setInsurance(value as Insurance | ''); setVisibleCount(6); }}>
              <option value="">{t.insurance}</option>
              {INSURANCE.map((item) => <option key={item} value={item}>{item}</option>)}
            </FilterSelect>
            <button
              type="button"
              onClick={() => setAdvancedOpen((current) => !current)}
              className="inline-flex h-11 min-w-[150px] flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-teal-300 bg-teal-50/70 px-4 text-[13px] font-bold text-teal-700 transition hover:bg-teal-100"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {advancedOpen ? t.hideFilters : t.moreFilters}
            </button>
          </div>
          {advancedOpen && (
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-surface-border pt-3">
              <FilterSelect label={t.delivery} value={delivery} onChange={(value) => { setDelivery(value as Delivery | ''); setVisibleCount(6); }}>
                <option value="">{t.delivery}</option>
                {DELIVERY.map((item) => <option key={item} value={item}>{item}</option>)}
              </FilterSelect>
              <label className="inline-flex min-h-11 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-surface-border bg-surface-muted/40 px-3 text-sm font-semibold text-brand-muted-700">
                <input
                  type="checkbox"
                  checked={goodFirstStepOnly}
                  onChange={(event) => { setGoodFirstStepOnly(event.target.checked); setVisibleCount(6); }}
                  className="h-4 w-4 rounded border-surface-border text-primary focus:ring-primary"
                />
                {t.goodFirstStep}
              </label>
            </div>
          )}
        </section>

        <div id="local-help-results" className="mt-5 scroll-mt-6 xl:grid xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start xl:gap-5">
          <section>
            <div className="rounded-2xl border border-surface-border bg-white px-4 py-4 shadow-sm sm:px-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">{t.closestMatches}</p>
                  <h2 className="mt-1 text-lg font-bold text-[#17315a]">{t.results(filteredResources.length)}</h2>
                </div>
                {activeFilters.length > 0 && (
                  <button type="button" onClick={clearFilters} className="rounded-lg px-3 py-2 text-xs font-bold text-brand-muted-600 hover:bg-surface-muted hover:text-primary">
                    {t.clearFilters}
                  </button>
                )}
              </div>
              {activeFilters.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2" aria-label="Active filters">
                  {activeFilters.map((filter) => (
                    <span key={filter} className="inline-flex items-center rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700">{filter}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 space-y-3">
              {visibleResources.map((resource) => {
                const meta = categoryForResource(resource);
                const Icon = meta.icon;
                const saved = savedIds.includes(resource.id);
                return (
                  <article
                    key={resource.id}
                    className={cn(
                      'group rounded-2xl border bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-4',
                      selectedResource?.id === resource.id ? 'border-teal-500 ring-2 ring-teal-100' : 'border-surface-border hover:border-teal-200',
                    )}
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:h-16 sm:w-16', meta.iconClass)}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider', meta.badgeClass)}>{meta.label[locale]}</span>
                          {resource.goodFirstStep && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700">{t.goodFirstStep}</span>}
                          {resource.urgency === 'crisis' && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-700">24/7</span>}
                        </div>
                        <h3 className="mt-1.5 text-[16px] font-bold leading-snug text-[#17315a] sm:text-[17px]">{resource.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-brand-muted-500">
                          <MapPin className="h-3 w-3" /> {resource.cities.slice(0, 2).join(' · ')}
                          <span aria-hidden="true">·</span>
                          <ShieldCheck className="h-3 w-3" /> {t.reviewed(resource.lastReviewed)}
                        </p>
                        <p className="mt-2 text-[13px] leading-5 text-brand-muted-600">{resource.blurb}</p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {resource.services.slice(0, 3).map((item) => <span key={item} className="rounded-md border border-surface-border bg-surface-muted/50 px-2 py-1 text-[10px] font-semibold text-brand-muted-600">{item}</span>)}
                          {resource.delivery.slice(0, 1).map((item) => <span key={item} className="rounded-md border border-surface-border bg-surface-muted/50 px-2 py-1 text-[10px] font-semibold text-brand-muted-600">{item}</span>)}
                          <span className="rounded-md border border-surface-border bg-surface-muted/50 px-2 py-1 text-[10px] font-semibold text-brand-muted-600">{resource.insurance}</span>
                        </div>
                      </div>
                      <div className="hidden shrink-0 flex-col items-end justify-center gap-2 sm:flex">
                        <button
                          type="button"
                          onClick={() => setSelectedResource(resource)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          {t.viewDetails} <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSave(resource.id)}
                          className={cn('inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-bold transition', saved ? 'text-teal-700' : 'text-brand-muted-500 hover:bg-surface-muted hover:text-primary')}
                        >
                          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                          {saved ? t.saved : t.savePrivately}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
                      <button type="button" onClick={() => setSelectedResource(resource)} className="rounded-xl bg-gradient-to-r from-rose-500 to-red-500 px-3 py-2.5 text-xs font-bold text-white">{t.viewDetails}</button>
                      <button type="button" onClick={() => toggleSave(resource.id)} className="rounded-xl border border-surface-border px-3 py-2.5 text-xs font-bold text-brand-muted-700">{saved ? t.saved : t.savePrivately}</button>
                    </div>
                  </article>
                );
              })}

              {filteredResources.length === 0 && (
                <div className="rounded-2xl border border-dashed border-surface-border bg-white px-5 py-12 text-center">
                  <Search className="mx-auto h-8 w-8 text-brand-muted-300" />
                  <h3 className="mt-3 text-lg font-bold text-[#17315a]">{t.emptyTitle}</h3>
                  <p className="mt-1 text-sm text-brand-muted-600">{t.emptyBody}</p>
                  <button type="button" onClick={clearFilters} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white">{t.clearFilters}</button>
                </div>
              )}

              {visibleCount < filteredResources.length && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 8)}
                  className="w-full rounded-2xl border border-dashed border-teal-300 bg-teal-50/70 px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-100"
                >
                  {t.showMore}
                </button>
              )}
            </div>
          </section>

          <aside
            className={cn(
              'mt-5 space-y-4 xl:sticky xl:top-5 xl:mt-0',
              selectedResource && 'max-xl:fixed max-xl:inset-0 max-xl:z-50 max-xl:overflow-y-auto max-xl:bg-[#f5f7fb] max-xl:p-3',
            )}
            aria-label={selectedResource ? t.detailsTitle : t.shortlist}
          >
            {selectedResource && (
              <section className="rounded-2xl border border-surface-border bg-white p-4 shadow-xl sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">{t.detailsTitle}</p>
                    <h2 className="mt-1 text-xl font-bold leading-tight text-[#17315a]">{selectedResource.name}</h2>
                  </div>
                  <button type="button" onClick={() => setSelectedResource(null)} className="rounded-full border border-surface-border p-2 text-brand-muted-500 hover:bg-surface-muted" aria-label={t.closeDetails}>
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={cn('rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider', categoryForResource(selectedResource).badgeClass)}>{categoryForResource(selectedResource).label[locale]}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-muted-500"><ShieldCheck className="h-3 w-3" />{t.reviewed(selectedResource.lastReviewed)}</span>
                </div>

                <p className="mt-4 text-[13px] leading-6 text-brand-muted-700">{selectedResource.description}</p>

                <dl className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-surface-muted/60 p-3 text-[11px]">
                  <div><dt className="font-bold uppercase tracking-wider text-brand-muted-400">{t.services}</dt><dd className="mt-1 font-semibold text-brand-muted-700">{selectedResource.services.join(' · ')}</dd></div>
                  <div><dt className="font-bold uppercase tracking-wider text-brand-muted-400">{t.ages}</dt><dd className="mt-1 font-semibold text-brand-muted-700">{selectedResource.ageGroups.join(', ')}</dd></div>
                  <div><dt className="font-bold uppercase tracking-wider text-brand-muted-400">{t.payment}</dt><dd className="mt-1 font-semibold text-brand-muted-700">{selectedResource.insurance}</dd></div>
                  <div><dt className="font-bold uppercase tracking-wider text-brand-muted-400">{t.format}</dt><dd className="mt-1 font-semibold text-brand-muted-700">{selectedResource.delivery.join(' · ')}</dd></div>
                  <div className="col-span-2"><dt className="font-bold uppercase tracking-wider text-brand-muted-400">{t.address}</dt><dd className="mt-1 font-semibold text-brand-muted-700">{selectedResource.address ?? selectedResource.cities.join(' · ')}</dd></div>
                </dl>

                {selectedResource.helpfulToKnow && (
                  <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-800">{t.helpful}</p>
                    <p className="mt-1 text-[12px] leading-5 text-brand-muted-700">{selectedResource.helpfulToKnow}</p>
                  </div>
                )}

                <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  {selectedResource.website && (
                    <a href={selectedResource.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-teal-700">
                      {t.visitWebsite} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {selectedResource.phone && (
                    <a href={`tel:${selectedResource.phone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border px-4 py-3 text-xs font-bold text-[#17315a] transition hover:bg-surface-muted">
                      <Phone className="h-3.5 w-3.5" /> {t.call}
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleSave(selectedResource.id)}
                  className={cn('mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition', savedIds.includes(selectedResource.id) ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-surface-border text-brand-muted-700 hover:bg-surface-muted')}
                >
                  {savedIds.includes(selectedResource.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  {savedIds.includes(selectedResource.id) ? t.saved : t.savePrivately}
                </button>

                <div className="mt-5 border-t border-surface-border pt-4">
                  <h3 className="text-sm font-bold text-[#17315a]">{t.questions}</h3>
                  <ul className="mt-2 space-y-2">
                    {QUESTIONS[locale].map((question) => (
                      <li key={question} className="flex gap-2 text-[12px] leading-5 text-brand-muted-700"><span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-teal-300 text-teal-700"><Check className="h-2.5 w-2.5" /></span>{question}</li>
                    ))}
                  </ul>
                  <a href="/worksheets/provider-interview.pdf" className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 p-3 text-teal-800 transition hover:from-teal-100 hover:to-cyan-100">
                    <span><strong className="block text-xs">{t.openGuide}</strong><small className="mt-0.5 block text-[10px] text-teal-700">{t.guideSub}</small></span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </section>
            )}

            <section className="rounded-2xl border border-surface-border bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-bold text-[#17315a]"><BookmarkCheck className="h-5 w-5 text-teal-600" />{t.shortlist} {savedResources.length > 0 && `(${savedResources.length})`}</h2>
                  <p className="mt-1 text-[11px] leading-5 text-brand-muted-500">{t.shortlistBody}</p>
                </div>
              </div>

              {savedResources.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-surface-border bg-surface-muted/40 px-4 py-6 text-center text-xs leading-5 text-brand-muted-500">{t.noSaved}</div>
              ) : (
                <>
                  <ul className="mt-4 space-y-2">
                    {savedResources.map((resource) => (
                      <li key={`saved-${resource.id}`} className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface-muted/30 p-2.5">
                        <button type="button" onClick={() => setSelectedResource(resource)} className="min-w-0 flex-1 text-left">
                          <strong className="block truncate text-[12px] text-[#17315a] hover:text-primary">{resource.name}</strong>
                          <span className="mt-0.5 block text-[10px] text-brand-muted-500">{resource.cities[0]} · {resource.services.slice(0, 2).join(', ')}</span>
                        </button>
                        <button type="button" onClick={() => toggleSave(resource.id)} className="rounded-lg p-1.5 text-brand-muted-400 hover:bg-white hover:text-red-600" aria-label={`${t.remove} ${resource.name}`}><X className="h-3.5 w-3.5" /></button>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setCompareOpen((current) => !current)} className="rounded-xl border border-surface-border px-2 py-2 text-[10px] font-bold text-teal-700 hover:bg-teal-50">{compareOpen ? t.hideCompare : t.compare}</button>
                    <button type="button" onClick={printShortlist} className="inline-flex items-center justify-center gap-1 rounded-xl border border-surface-border px-2 py-2 text-[10px] font-bold text-teal-700 hover:bg-teal-50"><Printer className="h-3 w-3" />{t.print}</button>
                    <a href="/worksheets/provider-interview.pdf" className="inline-flex items-center justify-center rounded-xl border border-surface-border px-2 py-2 text-center text-[10px] font-bold text-teal-700 hover:bg-teal-50">{t.downloadQuestions}</a>
                  </div>

                  {compareOpen && (
                    <div className="mt-3 overflow-x-auto rounded-xl border border-surface-border">
                      <table className="w-full min-w-[520px] text-left text-[10px]">
                        <thead className="bg-surface-muted text-brand-muted-500"><tr><th className="p-2">Resource</th><th className="p-2">Location</th><th className="p-2">Services</th><th className="p-2">Payment</th></tr></thead>
                        <tbody>{savedResources.map((resource) => <tr key={`compare-${resource.id}`} className="border-t border-surface-border"><td className="p-2 font-bold text-[#17315a]">{resource.name}</td><td className="p-2">{resource.cities[0]}</td><td className="p-2">{resource.services.slice(0, 2).join(', ')}</td><td className="p-2">{resource.insurance}</td></tr>)}</tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </section>

            <section className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50 p-4">
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white"><ShieldCheck className="h-4 w-4" /></span>
                <div><h2 className="text-sm font-bold text-[#17315a]">{t.privacy}</h2><p className="mt-1 text-[11px] leading-5 text-brand-muted-600">{t.privacyBody}</p></div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
