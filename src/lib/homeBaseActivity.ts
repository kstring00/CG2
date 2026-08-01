export const HOME_BASE_ACTIVITY_EVENT = 'cg:home-base-activity';
const ACTIVITY_KEY = 'cg.homeBase.activity.v1';

export type HomeBaseActivityKind =
  | 'guide'
  | 'connection'
  | 'mental-health'
  | 'relationships'
  | 'learning'
  | 'home'
  | 'resources'
  | 'siblings'
  | 'local-help'
  | 'financial'
  | 'worksheet';

export type HomeBaseVisit = {
  href: string;
  label: string;
  description: string;
  kind: HomeBaseActivityKind;
  visitedAt: string;
};

export type HomeBaseTool = {
  id: string;
  label: string;
  href: string;
  kind: 'worksheet';
  openedAt: string;
};

export type HomeBaseActivityState = {
  version: 1;
  visits: HomeBaseVisit[];
  tools: HomeBaseTool[];
  suggestionsEnabled: boolean;
};

const EMPTY_STATE: HomeBaseActivityState = {
  version: 1,
  visits: [],
  tools: [],
  suggestionsEnabled: true,
};

const ROUTES: Array<{
  matches: (pathname: string) => boolean;
  href: string;
  label: string;
  description: string;
  kind: HomeBaseActivityKind;
}> = [
  {
    matches: (pathname) => pathname.startsWith('/support/care-plan'),
    href: '/support/care-plan',
    label: 'My Support Guide',
    description: 'Your focused support guide and private tools.',
    kind: 'guide',
  },
  {
    matches: (pathname) => pathname.startsWith('/support/connect'),
    href: '/support/connect',
    label: 'Parent Connection',
    description: 'Parent groups and ways to feel less alone.',
    kind: 'connection',
  },
  {
    matches: (pathname) => pathname.startsWith('/support/caregiver'),
    href: '/support/caregiver',
    label: 'Mental Health Toolbox',
    description: 'Grounding and support for the caregiver.',
    kind: 'mental-health',
  },
  {
    matches: (pathname) => pathname.startsWith('/support/couples'),
    href: '/support/couples',
    label: 'Marriage & Relationships',
    description: 'Support for strain around the caregiving load.',
    kind: 'relationships',
  },
  {
    matches: (pathname) => pathname.startsWith('/support/what-is-aba'),
    href: '/support/what-is-aba',
    label: 'What Is ABA?',
    description: 'Plain-language information about ABA care.',
    kind: 'learning',
  },
  {
    matches: (pathname) => pathname.startsWith('/support/at-home'),
    href: '/support/at-home',
    label: 'At Home Strategies',
    description: 'Practical routines and parent-friendly tools.',
    kind: 'home',
  },
  {
    matches: (pathname) => pathname.startsWith('/support/resources'),
    href: '/support/resources',
    label: 'Resource Hub',
    description: 'Trusted guides and practical resources.',
    kind: 'resources',
  },
  {
    matches: (pathname) => pathname.startsWith('/support/siblings'),
    href: '/support/siblings',
    label: 'Sibling Support',
    description: 'Support for siblings and the whole family.',
    kind: 'siblings',
  },
  {
    matches: (pathname) => pathname.startsWith('/support/find'),
    href: '/support/find',
    label: 'Find Local Help',
    description: 'Local providers, support groups, and community resources.',
    kind: 'local-help',
  },
  {
    matches: (pathname) => pathname.startsWith('/support/financial'),
    href: '/support/financial',
    label: 'Paying for Care',
    description: 'Insurance, funding, and cost-support information.',
    kind: 'financial',
  },
];

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function normalizeState(value: unknown): HomeBaseActivityState {
  if (!value || typeof value !== 'object') return EMPTY_STATE;
  const candidate = value as Partial<HomeBaseActivityState>;
  return {
    version: 1,
    visits: Array.isArray(candidate.visits) ? candidate.visits.slice(0, 16) : [],
    tools: Array.isArray(candidate.tools) ? candidate.tools.slice(0, 12) : [],
    suggestionsEnabled: candidate.suggestionsEnabled !== false,
  };
}

export function loadHomeBaseActivity(): HomeBaseActivityState {
  if (!isBrowser()) return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(ACTIVITY_KEY);
    if (!raw) return EMPTY_STATE;
    return normalizeState(JSON.parse(raw));
  } catch {
    return EMPTY_STATE;
  }
}

function saveHomeBaseActivity(state: HomeBaseActivityState) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(HOME_BASE_ACTIVITY_EVENT));
  } catch {
    // Ignore storage quota and private-mode failures.
  }
}

export function recordSupportVisit(pathname: string) {
  if (!isBrowser() || pathname === '/support' || pathname.startsWith('/support/intake')) return;
  const route = ROUTES.find((item) => item.matches(pathname));
  if (!route) return;

  const current = loadHomeBaseActivity();
  const visitedAt = new Date().toISOString();
  const visit: HomeBaseVisit = {
    href: route.href,
    label: route.label,
    description: route.description,
    kind: route.kind,
    visitedAt,
  };

  saveHomeBaseActivity({
    ...current,
    visits: [visit, ...current.visits.filter((item) => item.href !== visit.href)].slice(0, 16),
  });
}

export function recordPrivateTool(tool: Omit<HomeBaseTool, 'kind' | 'openedAt'>) {
  if (!isBrowser()) return;
  const current = loadHomeBaseActivity();
  const opened: HomeBaseTool = {
    ...tool,
    kind: 'worksheet',
    openedAt: new Date().toISOString(),
  };

  saveHomeBaseActivity({
    ...current,
    tools: [opened, ...current.tools.filter((item) => item.id !== opened.id)].slice(0, 12),
  });
}

export function clearHomeBaseRecentActivity() {
  const current = loadHomeBaseActivity();
  saveHomeBaseActivity({ ...current, visits: [], tools: [] });
}

export function setHomeBaseSuggestionsEnabled(enabled: boolean) {
  const current = loadHomeBaseActivity();
  saveHomeBaseActivity({ ...current, suggestionsEnabled: enabled });
}
