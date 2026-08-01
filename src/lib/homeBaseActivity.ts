import {
  NEVER_PRIVACY,
  TOOLKIT_ITEM_BY_ID,
  type ItemPrivacy,
  type ToolkitItem,
} from '@/content/caregiverToolkit';

export const HOME_BASE_ACTIVITY_EVENT = 'cg:home-base-activity';
export const ACTIVITY_KEY = 'cg.activity';
export const KIT_KEY = 'cg.kit';
export const PROGRESS_KEY = 'cg.progress';
export const PREFS_KEY = 'cg.prefs';
export const SESSION_SUPPRESSION_KEY = 'cg.session.suppressed';
const OLD_ACTIVITY_KEY = 'cg.homeBase.activity.v1';

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

export type ActivityEvent = { id: string; title: string; section: string; href: string; ts: number; kind?: HomeBaseActivityKind };
export type HomeBaseVisit = { id: string; href: string; label: string; description: string; kind: HomeBaseActivityKind; visitedAt: string };
export type HomeBaseTool = { id: string; label: string; href: string; kind: 'worksheet'; openedAt: string };
export type HomeBaseActivityState = { version: 2; visits: HomeBaseVisit[]; tools: HomeBaseTool[]; suggestionsEnabled: boolean };
export type PersonalizationPrefs = { personalization: boolean };
export type RecordableItem = { id: string; title: string; section: string; href: string; privacy?: ItemPrivacy; kind?: HomeBaseActivityKind };

const DEFAULT_PREFS: PersonalizationPrefs = { personalization: true };
const ROUTES: Array<RecordableItem & { description: string; matches: (pathname: string) => boolean }> = [
  { id: 'route.support-guide', matches: (p) => p.startsWith('/support/care-plan'), href: '/support/care-plan', title: 'My Support Guide', description: 'Your focused support guide and private tools.', section: 'support', kind: 'guide', privacy: { activity: 'allowed', homeBase: 'allowed', sync: 'allowed' } },
  { id: 'route.parent-connection', matches: (p) => p.startsWith('/support/connect'), href: '/support/connect', title: 'Parent Connection', description: 'Parent groups and ways to feel less alone.', section: 'support', kind: 'connection', privacy: { activity: 'allowed', homeBase: 'allowed', sync: 'allowed' } },
  { id: 'route.caregiver-toolkit', matches: (p) => p === '/support/caregiver', href: '/support/caregiver', title: 'Your caregiver toolkit', description: 'Tools for before, during, and after the hard moments.', section: 'caregiver-toolkit', kind: 'mental-health', privacy: { activity: 'allowed', homeBase: 'allowed', sync: 'allowed' } },
  { id: 'route.relationships', matches: (p) => p.startsWith('/support/couples'), href: '/support/couples', title: 'Marriage & Relationships', description: 'Support for strain around the caregiving load.', section: 'support', kind: 'relationships', privacy: { activity: 'allowed', homeBase: 'allowed', sync: 'never' } },
  { id: 'route.what-is-aba', matches: (p) => p.startsWith('/support/what-is-aba'), href: '/support/what-is-aba', title: 'What Is ABA?', description: 'Plain-language information about ABA care.', section: 'learn', kind: 'learning', privacy: { activity: 'allowed', homeBase: 'allowed', sync: 'allowed' } },
  { id: 'route.at-home', matches: (p) => p.startsWith('/support/at-home'), href: '/support/at-home', title: 'At Home Strategies', description: 'Practical routines and parent-friendly tools.', section: 'learn', kind: 'home', privacy: { activity: 'allowed', homeBase: 'allowed', sync: 'allowed' } },
  { id: 'route.resources', matches: (p) => p.startsWith('/support/resources'), href: '/support/resources', title: 'Resource Hub', description: 'Trusted guides and practical resources.', section: 'learn', kind: 'resources', privacy: { activity: 'allowed', homeBase: 'allowed', sync: 'allowed' } },
  { id: 'route.siblings', matches: (p) => p.startsWith('/support/siblings'), href: '/support/siblings', title: 'Sibling Support', description: 'Support for siblings and the whole family.', section: 'support', kind: 'siblings', privacy: { activity: 'allowed', homeBase: 'allowed', sync: 'allowed' } },
  { id: 'route.find-local', matches: (p) => p.startsWith('/support/find'), href: '/support/find', title: 'Find Local Help', description: 'Local providers, support groups, and community resources.', section: 'support', kind: 'local-help', privacy: { activity: 'allowed', homeBase: 'allowed', sync: 'allowed' } },
  { id: 'route.financial', matches: (p) => p.startsWith('/support/financial'), href: '/support/financial', title: 'Paying for Care', description: 'Insurance, funding, and cost-support information.', section: 'support', kind: 'financial', privacy: { activity: 'allowed', homeBase: 'allowed', sync: 'allowed' } },
];

function isBrowser() { return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'; }
function emitChange() { window.dispatchEvent(new CustomEvent(HOME_BASE_ACTIVITY_EVENT)); }
function safeParse<T>(raw: string | null, fallback: T): T { if (!raw) return fallback; try { return JSON.parse(raw) as T; } catch { return fallback; } }

export function initializePersonalizationStorage() { if (!isBrowser()) return; try { window.localStorage.removeItem(OLD_ACTIVITY_KEY); } catch {} }
export function getPrefs(): PersonalizationPrefs { if (!isBrowser()) return DEFAULT_PREFS; try { const parsed = safeParse<Partial<PersonalizationPrefs>>(window.localStorage.getItem(PREFS_KEY), DEFAULT_PREFS); return { personalization: parsed.personalization !== false }; } catch { return { personalization: false }; } }
export function setPersonalization(enabled: boolean) { if (!isBrowser()) return; try { window.localStorage.setItem(PREFS_KEY, JSON.stringify({ personalization: enabled })); if (!enabled) { window.localStorage.removeItem(ACTIVITY_KEY); window.localStorage.removeItem(PROGRESS_KEY); } emitChange(); } catch {} }
export function suppressSession() { if (typeof window === 'undefined') return; try { window.sessionStorage.setItem(SESSION_SUPPRESSION_KEY, '1'); } catch {} }
export function isSessionSuppressed(): boolean { if (typeof window === 'undefined') return true; try { return Boolean(window.sessionStorage.getItem(SESSION_SUPPRESSION_KEY)); } catch { return true; } }

export function recordActivity(item: RecordableItem): void {
  if (!isBrowser()) return;
  try {
    if (isSessionSuppressed() || !getPrefs().personalization) return;
    const privacy = item.privacy ?? NEVER_PRIVACY;
    if (privacy.activity !== 'allowed') return;
    const current = safeParse<ActivityEvent[]>(window.localStorage.getItem(ACTIVITY_KEY), []);
    const event: ActivityEvent = { id: item.id, title: item.title, section: item.section, href: item.href, ts: Date.now(), kind: item.kind };
    window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify([event, ...current.filter((entry) => entry.id !== item.id)].slice(0, 30)));
    emitChange();
  } catch {}
}

function lookupPrivacy(id: string): ItemPrivacy { if (TOOLKIT_ITEM_BY_ID[id]) return TOOLKIT_ITEM_BY_ID[id].privacy ?? NEVER_PRIVACY; return ROUTES.find((route) => route.id === id)?.privacy ?? NEVER_PRIVACY; }
export function readActivity(): ActivityEvent[] { if (!isBrowser()) return []; try { return safeParse<ActivityEvent[]>(window.localStorage.getItem(ACTIVITY_KEY), []).filter((event) => lookupPrivacy(event.id).activity === 'allowed').slice(0, 30); } catch { return []; } }
export function recordSupportVisit(pathname: string) { initializePersonalizationStorage(); if (!isBrowser() || pathname === '/support' || pathname.startsWith('/support/intake')) return; const route = ROUTES.find((item) => item.matches(pathname)); if (route) recordActivity(route); }
export function recordToolkitItem(item: ToolkitItem) { recordActivity({ id: item.id, title: item.title, section: item.section, href: '/support/caregiver', privacy: item.privacy, kind: 'mental-health' }); }

export function loadKitIds(): string[] { if (!isBrowser()) return []; try { return safeParse<unknown[]>(window.localStorage.getItem(KIT_KEY), []).filter((id): id is string => typeof id === 'string' && Boolean(TOOLKIT_ITEM_BY_ID[id])); } catch { return []; } }
export function toggleKitItem(id: string): string[] { if (!isBrowser() || !TOOLKIT_ITEM_BY_ID[id]) return loadKitIds(); const current = loadKitIds(); const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-3); try { window.localStorage.setItem(KIT_KEY, JSON.stringify(next)); emitChange(); } catch {} return next; }
export function resetKit() { if (!isBrowser()) return; try { window.localStorage.removeItem(KIT_KEY); emitChange(); } catch {} }
export function clearHomeBaseRecentActivity() { if (!isBrowser()) return; try { window.localStorage.removeItem(ACTIVITY_KEY); window.localStorage.removeItem(PROGRESS_KEY); emitChange(); } catch {} }
export function removeAllCommonGroundDeviceData() { if (!isBrowser()) return; const keys = [ACTIVITY_KEY, KIT_KEY, PROGRESS_KEY, PREFS_KEY, 'cg-find-local-shortlist-v2', 'cg.carePlan.v1', 'cg.carePlanDraft.v1']; try { keys.forEach((key) => window.localStorage.removeItem(key)); emitChange(); } catch {} }

export function loadHomeBaseActivity(): HomeBaseActivityState {
  const events = readActivity();
  return {
    version: 2,
    visits: events.filter((event) => event.kind !== 'worksheet').map((event) => {
      const route = ROUTES.find((item) => item.id === event.id);
      const toolkitItem = TOOLKIT_ITEM_BY_ID[event.id];
      return { id: event.id, href: event.href, label: event.title, description: route?.description ?? toolkitItem?.descriptor ?? 'A tool you opened recently.', kind: event.kind ?? (toolkitItem ? 'mental-health' : 'resources'), visitedAt: new Date(event.ts).toISOString() };
    }),
    tools: events.filter((event) => event.kind === 'worksheet').map((event) => ({ id: event.id, label: event.title, href: event.href, kind: 'worksheet' as const, openedAt: new Date(event.ts).toISOString() })),
    suggestionsEnabled: getPrefs().personalization,
  };
}

export function recordPrivateTool(tool: { id: string; label: string; href: string }) { recordActivity({ id: `worksheet.${tool.id}`, title: tool.label, section: 'worksheet', href: tool.href, kind: 'worksheet', privacy: { activity: 'allowed', homeBase: 'allowed', sync: 'never' } }); }
export function setHomeBaseSuggestionsEnabled(enabled: boolean) { setPersonalization(enabled); }
