/**
 * Curated Guides & Strategies catalog + deterministic need-matching.
 * External entries mirror `resources` in data.ts; internal entries are Common Ground pages.
 */

import { AT_HOME_STRATEGIES_LABEL } from '@/lib/supportNavLabels';
import { resources as externalResources } from '@/lib/data';

export type GuideResourceNeed =
  | 'newly-diagnosed'
  | 'understanding-aba'
  | 'preparing-iep'
  | 'insurance-access'
  | 'feeling-overwhelmed'
  | 'parent-support'
  | 'behavior-home'
  | 'not-sure';

export type GuideBrowseCategory =
  | 'understanding-autism'
  | 'education-iep'
  | 'insurance-access'
  | 'support-for-you'
  | 'community';

export interface GuideResource {
  id: string;
  title: string;
  /** One-line card copy */
  shortDescription: string;
  description: string;
  browseCategory: GuideBrowseCategory;
  categoryLabel: string;
  categoryPillClass: string;
  tags: string[];
  readTime: string;
  source: string;
  href: string;
  external: boolean;
  needs: GuideResourceNeed[];
  /** Needs that score highest when selected */
  primaryNeeds?: GuideResourceNeed[];
  featured?: boolean;
  /** Tie-breaker when nothing is selected */
  defaultScore?: number;
  isDemo?: boolean;
}

export interface GuideNeedOption {
  id: GuideResourceNeed;
  label: string;
}

export interface GuideBrowseCategoryMeta {
  id: GuideBrowseCategory;
  label: string;
  description: string;
}

export const GUIDE_NEED_OPTIONS: GuideNeedOption[] = [
  { id: 'newly-diagnosed', label: 'Newly diagnosed' },
  { id: 'understanding-aba', label: 'Understanding ABA' },
  { id: 'preparing-iep', label: 'Preparing for IEP / ARD' },
  { id: 'insurance-access', label: 'Insurance or access questions' },
  { id: 'feeling-overwhelmed', label: 'Feeling overwhelmed' },
  { id: 'parent-support', label: 'Looking for parent support' },
  { id: 'behavior-home', label: 'Behavior help at home' },
  { id: 'not-sure', label: 'Not sure yet' },
];

export const QUICK_FILTER_NEEDS: Record<
  'right-now' | 'understanding' | 'support-for-you',
  GuideResourceNeed[]
> = {
  'right-now': ['feeling-overwhelmed'],
  understanding: ['newly-diagnosed', 'understanding-aba', 'preparing-iep', 'insurance-access'],
  'support-for-you': ['feeling-overwhelmed', 'parent-support'],
};

export const BROWSE_CATEGORIES: GuideBrowseCategoryMeta[] = [
  {
    id: 'understanding-autism',
    label: 'Understanding Autism',
    description: 'Diagnosis, early signs, and trusted overviews for new families.',
  },
  {
    id: 'education-iep',
    label: 'Education & IEP',
    description: 'School rights, ARD meetings, and Texas-specific IEP guidance.',
  },
  {
    id: 'insurance-access',
    label: 'Insurance & Access',
    description: 'Coverage, benefits, and financial pressure — explained plainly.',
  },
  {
    id: 'support-for-you',
    label: 'Support for You',
    description: 'Caregiver mental health, at-home strategies, and parent connection.',
  },
  {
    id: 'community',
    label: 'Community',
    description: 'Research communities, local help, and families like yours.',
  },
];

const CATEGORY_PILLS: Record<
  GuideBrowseCategory,
  { label: string; className: string }
> = {
  'understanding-autism': {
    label: 'Understanding',
    className: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  'education-iep': {
    label: 'Education & IEP',
    className: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  'insurance-access': {
    label: 'Insurance & Access',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  'support-for-you': {
    label: 'Support for You',
    className: 'bg-brand-plum-50 text-brand-plum-700 border-brand-plum-200',
  },
  community: {
    label: 'Community',
    className: 'bg-orange-50 text-orange-700 border-orange-200',
  },
};

function shortText(text: string, max = 110): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function fromExternal(
  id: string,
  overrides: Partial<GuideResource> & Pick<GuideResource, 'browseCategory' | 'needs' | 'href'>,
): GuideResource | null {
  const base = externalResources.find((r) => r.id === id);
  if (!base) return null;
  const pill = CATEGORY_PILLS[overrides.browseCategory];
  return {
    id: base.id,
    title: base.title,
    shortDescription: shortText(base.description),
    description: base.description,
    browseCategory: overrides.browseCategory,
    categoryLabel: pill.label,
    categoryPillClass: pill.className,
    tags: base.tags,
    readTime: base.readTime,
    source: base.reviewedBy,
    href: overrides.href ?? base.url ?? '#',
    external: overrides.external ?? !overrides.href?.startsWith('/'),
    needs: overrides.needs,
    primaryNeeds: overrides.primaryNeeds,
    featured: overrides.featured ?? base.isFeatured,
    defaultScore: overrides.defaultScore,
    isDemo: base.isDemo,
  };
}

function internalGuide(
  entry: Omit<GuideResource, 'external' | 'categoryLabel' | 'categoryPillClass' | 'isDemo'>,
): GuideResource {
  const pill = CATEGORY_PILLS[entry.browseCategory];
  return {
    ...entry,
    categoryLabel: pill.label,
    categoryPillClass: pill.className,
    external: false,
    isDemo: false,
  };
}

/** Full curated catalog — intentionally small while resources are vetted. */
export const GUIDE_RESOURCES: GuideResource[] = [
  fromExternal('r-cdc-milestones', {
    browseCategory: 'understanding-autism',
    needs: ['newly-diagnosed', 'not-sure'],
    primaryNeeds: ['newly-diagnosed'],
    featured: true,
    defaultScore: 90,
    href: 'https://www.cdc.gov/autism/about/information-for-families.html',
  })!,
  fromExternal('r-autism-speaks-100day', {
    browseCategory: 'understanding-autism',
    needs: ['newly-diagnosed'],
    primaryNeeds: ['newly-diagnosed'],
    featured: true,
    defaultScore: 95,
    href: 'https://www.autismspeaks.org/tool-kit/100-day-kit-young-children',
  })!,
  fromExternal('r-autism-speaks-parents-guide', {
    browseCategory: 'understanding-autism',
    needs: ['newly-diagnosed', 'not-sure', 'parent-support'],
    defaultScore: 70,
    href: 'https://www.autismspeaks.org/tool-kit/parents-guide-autism',
  })!,
  fromExternal('r-ari-advice-parents', {
    browseCategory: 'understanding-autism',
    needs: ['understanding-aba', 'newly-diagnosed', 'not-sure'],
    primaryNeeds: ['understanding-aba'],
    defaultScore: 65,
    href: 'https://autism.org/advice-for-parents/',
  })!,
  internalGuide({
    id: 'cg-what-is-aba',
    title: 'What is ABA?',
    shortDescription:
      'Plain-language guide to what BCBAs study, what therapy looks like, and questions you can ask.',
    description:
      'A Common Ground guide to modern ABA — myths, green flags, parent involvement, and terms in plain English.',
    browseCategory: 'understanding-autism',
    tags: ['ABA basics', 'therapy', 'questions for BCBA'],
    readTime: '12 min',
    source: 'Common Ground',
    href: '/support/what-is-aba',
    needs: ['understanding-aba', 'newly-diagnosed'],
    primaryNeeds: ['understanding-aba'],
    featured: true,
    defaultScore: 88,
  }),
  fromExternal('r-navigate-life-texas', {
    browseCategory: 'education-iep',
    needs: ['preparing-iep'],
    primaryNeeds: ['preparing-iep'],
    featured: true,
    defaultScore: 92,
    href: 'https://www.navigatelifetexas.org',
  })!,
  fromExternal('r-autism-speaks-texas-insurance', {
    browseCategory: 'insurance-access',
    needs: ['insurance-access', 'newly-diagnosed'],
    primaryNeeds: ['insurance-access'],
    featured: true,
    defaultScore: 85,
    href: 'https://www.autismspeaks.org/texas-state-regulated-insurance-coverage',
  })!,
  internalGuide({
    id: 'cg-financial',
    title: 'Financial Help',
    shortDescription:
      'Insurance, Medicaid waivers, ABLE accounts, respite funding, and scripts — a working guide for Texas families.',
    description:
      'Money stress is its own kind of crisis. Programs, scripts, and decisions that can take some weight off.',
    browseCategory: 'insurance-access',
    tags: ['Medicaid', 'ABLE', 'tax credits', 'scripts'],
    readTime: '20 min guide',
    source: 'Common Ground',
    href: '/support/financial',
    needs: ['insurance-access'],
    primaryNeeds: ['insurance-access'],
    defaultScore: 80,
  }),
  internalGuide({
    id: 'cg-toolbox',
    title: 'Mental Health Toolbox',
    shortDescription:
      'Quick resets for caregivers — breathing, grounding, and permission phrases when today is heavy.',
    description:
      'Compact tools you can use in two minutes when your nervous system needs a reset.',
    browseCategory: 'support-for-you',
    tags: ['burnout', 'grounding', 'self-care'],
    readTime: '2–5 min tools',
    source: 'Common Ground',
    href: '/support/caregiver',
    needs: ['feeling-overwhelmed'],
    primaryNeeds: ['feeling-overwhelmed'],
    featured: true,
    defaultScore: 86,
  }),
  internalGuide({
    id: 'cg-at-home',
    title: AT_HOME_STRATEGIES_LABEL,
    shortDescription:
      'Ten ABA-grounded tactics you can try in the next 60 seconds when the moment is hard.',
    description:
      'Real strategies in parent-friendly language — transitions, meltdowns, refusal, and more.',
    browseCategory: 'support-for-you',
    tags: ['behavior', 'transitions', 'meltdowns'],
    readTime: '10 strategies',
    source: 'Common Ground',
    href: '/support/at-home',
    needs: ['behavior-home', 'feeling-overwhelmed'],
    primaryNeeds: ['behavior-home'],
    defaultScore: 84,
  }),
  internalGuide({
    id: 'cg-connect',
    title: 'Parent Connection',
    shortDescription:
      'Find peer support and other families who understand what this season feels like.',
    description:
      'A guided path to parent connection — without pressure to share more than you want.',
    browseCategory: 'support-for-you',
    tags: ['peer support', 'community', 'parents'],
    readTime: '5 min setup',
    source: 'Common Ground',
    href: '/support/connect',
    needs: ['parent-support', 'feeling-overwhelmed'],
    primaryNeeds: ['parent-support'],
    defaultScore: 78,
  }),
  internalGuide({
    id: 'cg-hard-days',
    title: 'Hard Days Support',
    shortDescription:
      'Grounding tools, crisis lines, and what to do when today feels like too much.',
    description:
      'When you need relief right now — not a long read.',
    browseCategory: 'support-for-you',
    tags: ['crisis', 'grounding', '988'],
    readTime: '5 min',
    source: 'Common Ground',
    href: '/support/hard-days',
    needs: ['feeling-overwhelmed'],
    primaryNeeds: ['feeling-overwhelmed'],
    defaultScore: 82,
  }),
  fromExternal('r-spark-autism', {
    browseCategory: 'community',
    needs: ['parent-support', 'not-sure'],
    defaultScore: 55,
    href: 'https://sparkforautism.org',
  })!,
  fromExternal('r-ari-research', {
    browseCategory: 'community',
    needs: ['understanding-aba', 'not-sure'],
    defaultScore: 50,
    href: 'https://autism.org',
  })!,
  internalGuide({
    id: 'cg-find',
    title: 'Find Local Help',
    shortDescription:
      'Therapists, support groups, and services near you — filtered for autism families.',
    description:
      'Browse vetted-style listings for local support in the Houston area and beyond.',
    browseCategory: 'community',
    tags: ['local help', 'therapists', 'groups'],
    readTime: 'Browse',
    source: 'Common Ground',
    href: '/support/find',
    needs: ['parent-support', 'insurance-access', 'not-sure'],
    defaultScore: 60,
  }),
];

export const DEFAULT_STARTER_IDS = [
  'r-autism-speaks-100day',
  'r-navigate-life-texas',
  'cg-toolbox',
] as const;

export const DEFAULT_FEATURED_IDS = [
  'r-cdc-milestones',
  'r-autism-speaks-100day',
  'cg-what-is-aba',
  'r-navigate-life-texas',
] as const;

const PRIMARY_NEED_SCORE = 15;
const NEED_SCORE = 8;
const FEATURED_SCORE = 4;
const SEARCH_SCORE = 25;

function resourceMatchesSearch(resource: GuideResource, query: string): boolean {
  const haystack = [
    resource.title,
    resource.shortDescription,
    resource.description,
    resource.source,
    ...resource.tags,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export function scoreGuideResource(
  resource: GuideResource,
  selectedNeeds: GuideResourceNeed[],
  searchQuery: string,
): number {
  const q = searchQuery.trim().toLowerCase();
  if (q && !resourceMatchesSearch(resource, q)) return -1;

  let score = resource.defaultScore ?? 0;
  if (resource.featured) score += FEATURED_SCORE;

  for (const need of selectedNeeds) {
    if (!resource.needs.includes(need)) continue;
    score += resource.primaryNeeds?.includes(need) ? PRIMARY_NEED_SCORE : NEED_SCORE;
  }

  if (q && resourceMatchesSearch(resource, q)) score += SEARCH_SCORE;

  return score;
}

export function rankGuideResources(options: {
  selectedNeeds: GuideResourceNeed[];
  searchQuery?: string;
  limit?: number;
}): GuideResource[] {
  const { selectedNeeds, searchQuery = '', limit } = options;
  const ranked = GUIDE_RESOURCES.map((resource) => ({
    resource,
    score: scoreGuideResource(resource, selectedNeeds, searchQuery),
  }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score || a.resource.title.localeCompare(b.resource.title));

  const list = ranked.map(({ resource }) => resource);
  return limit ? list.slice(0, limit) : list;
}

export function getGuideResourceById(id: string): GuideResource | undefined {
  return GUIDE_RESOURCES.find((r) => r.id === id);
}

export function getDefaultStarters(): GuideResource[] {
  return DEFAULT_STARTER_IDS.map((id) => getGuideResourceById(id)).filter(
    (r): r is GuideResource => Boolean(r),
  );
}

export function getDefaultFeatured(): GuideResource[] {
  return DEFAULT_FEATURED_IDS.map((id) => getGuideResourceById(id)).filter(
    (r): r is GuideResource => Boolean(r),
  );
}

export function resourcesForBrowseCategory(
  category: GuideBrowseCategory,
  selectedNeeds: GuideResourceNeed[],
  searchQuery: string,
): GuideResource[] {
  return rankGuideResources({ selectedNeeds, searchQuery }).filter(
    (r) => r.browseCategory === category,
  );
}

export function countForBrowseCategory(
  category: GuideBrowseCategory,
  selectedNeeds: GuideResourceNeed[],
  searchQuery: string,
): number {
  return resourcesForBrowseCategory(category, selectedNeeds, searchQuery).length;
}

/** Boost category order when parent selects matching needs. */
export function orderedBrowseCategories(
  selectedNeeds: GuideResourceNeed[],
): GuideBrowseCategoryMeta[] {
  if (selectedNeeds.length === 0) return BROWSE_CATEGORIES;

  const scores = new Map<GuideBrowseCategory, number>();
  for (const cat of BROWSE_CATEGORIES) scores.set(cat.id, 0);

  for (const resource of GUIDE_RESOURCES) {
    for (const need of selectedNeeds) {
      if (resource.needs.includes(need)) {
        scores.set(
          resource.browseCategory,
          (scores.get(resource.browseCategory) ?? 0) + 1,
        );
      }
    }
  }

  return [...BROWSE_CATEGORIES].sort(
    (a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0),
  );
}
