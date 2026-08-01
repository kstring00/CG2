'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, BookOpen, Bookmark, ChevronRight, CircleHelp, Clock3, Compass,
  FileText, Heart, HeartHandshake, HeartPulse, Home, Lock, MapPin, Phone,
  Settings2, ShieldCheck, Sparkles, Trash2, UserRound, Users, Wallet,
  type LucideIcon,
} from 'lucide-react';
import { findResources, type Resource } from '@/app/support/find/resources';
import { TOOLKIT_ITEM_BY_ID, type ToolkitItem } from '@/content/caregiverToolkit';
import { loadCarePlan, type SavedCarePlan } from '@/lib/carePlanStorage';
import {
  clearHomeBaseRecentActivity, getPrefs, HOME_BASE_ACTIVITY_EVENT,
  initializePersonalizationStorage, loadHomeBaseActivity, loadKitIds,
  recordPrivateTool, setPersonalization, type HomeBaseActivityState,
} from '@/lib/homeBaseActivity';
import { cn } from '@/lib/utils';

const SHORTLIST_KEY = 'cg-find-local-shortlist-v2';
const WORKSHEETS = [
  ['incident-log', 'Incident & Safety Record', '/worksheets/incident-log.pdf'],
  ['load-map', 'Caregiver Load Map', '/worksheets/load-map.pdf'],
  ['care-clarity', 'Care Clarity & Review Sheet', '/worksheets/care-clarity-review.pdf'],
  ['parent-support', 'Parent Support Card', '/worksheets/parent-support-card.pdf'],
  ['home-snapshot', 'Home Situation Snapshot', '/worksheets/home-situation-snapshot.pdf'],
  ['provider-interview', 'Provider Interview Guide', '/worksheets/provider-interview.pdf'],
  ['advocacy-card', 'One-Sentence Advocacy Card', '/worksheets/one-sentence-advocacy-card.pdf'],
  ['family-friends', 'Family & Friends Support One-Pager', '/worksheets/relatives-onepager.pdf'],
] as const;

const EXPLORE: Array<{ label: string; href: string; icon: LucideIcon; style: string }> = [
  { label: 'My Support Guide', href: '/support/care-plan', icon: Compass, style: 'from-orange-50 to-amber-50 border-orange-100' },
  { label: 'Caregiver Toolkit', href: '/support/caregiver', icon: HeartPulse, style: 'from-rose-50 to-pink-50 border-rose-100' },
  { label: 'Marriage & Relationships', href: '/support/couples', icon: HeartHandshake, style: 'from-violet-50 to-purple-50 border-violet-100' },
  { label: 'At Home Strategies', href: '/support/at-home', icon: Home, style: 'from-cyan-50 to-teal-50 border-cyan-100' },
  { label: 'What Is ABA?', href: '/support/what-is-aba', icon: CircleHelp, style: 'from-sky-50 to-blue-50 border-sky-100' },
  { label: 'Resource Hub', href: '/support/resources', icon: BookOpen, style: 'from-indigo-50 to-blue-50 border-indigo-100' },
  { label: 'Sibling Support', href: '/support/siblings', icon: Users, style: 'from-emerald-50 to-teal-50 border-emerald-100' },
  { label: 'Find Local Help', href: '/support/find', icon: MapPin, style: 'from-green-50 to-emerald-50 border-green-100' },
  { label: 'Paying for Care', href: '/support/financial', icon: Wallet, style: 'from-amber-50 to-orange-50 border-amber-100' },
  { label: 'Parent Connection', href: '/support/connect', icon: UserRound, style: 'from-pink-50 to-rose-50 border-pink-100' },
];

function readShortlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SHORTLIST_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch { return []; }
}

function relativeTime(value: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function Panel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-[1.35rem] border border-surface-border bg-white shadow-[0_12px_35px_rgba(26,46,82,0.055)]"><header className="flex items-center gap-2 border-b border-surface-border px-4 py-3"><Icon className="h-4 w-4 text-primary" /><h2 className="text-[14px] font-semibold text-brand-navy-800">{title}</h2></header>{children}</section>;
}

export default function HomeBaseV22() {
  const [ready, setReady] = useState(false);
  const [activity, setActivity] = useState<HomeBaseActivityState>(() => loadHomeBaseActivity());
  const [kitIds, setKitIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [plan, setPlan] = useState<SavedCarePlan | null>(null);
  const [personalization, setPersonalizationState] = useState(true);
  const [worksheetsOpen, setWorksheetsOpen] = useState(false);

  const refresh = useCallback(() => {
    initializePersonalizationStorage();
    setActivity(loadHomeBaseActivity());
    setKitIds(loadKitIds());
    setSavedIds(readShortlist());
    setPlan(loadCarePlan());
    setPersonalizationState(getPrefs().personalization);
  }, []);

  useEffect(() => {
    refresh(); setReady(true);
    window.addEventListener('storage', refresh);
    window.addEventListener(HOME_BASE_ACTIVITY_EVENT, refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener(HOME_BASE_ACTIVITY_EVENT, refresh); };
  }, [refresh]);

  const allowedKit = useMemo(() => kitIds.map((id) => TOOLKIT_ITEM_BY_ID[id]).filter((item): item is ToolkitItem => Boolean(item) && item.privacy.homeBase === 'allowed'), [kitIds]);
  const savedResources = useMemo(() => savedIds.map((id) => findResources.find((r) => r.id === id)).filter((r): r is Resource => Boolean(r)), [savedIds]);
  const recent = useMemo(() => [...activity.visits, ...activity.tools].sort((a, b) => new Date('visitedAt' in b ? b.visitedAt : b.openedAt).getTime() - new Date('visitedAt' in a ? a.visitedAt : a.openedAt).getTime()), [activity]);

  const continuation = useMemo(() => {
    if (!personalization) return { title: 'Find one useful next step for right now', body: 'Personalized Home Base is off. Nothing you open will be added to recent activity.', href: '/support/intake', action: 'Find my next step' };
    if (savedResources.length) return { title: `Continue comparing ${savedResources.length} saved resource${savedResources.length === 1 ? '' : 's'}`, body: 'Your shortlist remains private to this browser.', href: '/support/find', action: 'Continue my search' };
    const latest = activity.visits[0];
    if (latest) return { title: `Return to ${latest.label}`, body: latest.description, href: latest.href, action: 'Continue' };
    if (plan) return { title: 'Return to your focused support guide', body: plan.summary || 'Pick up with the support matched to what you selected.', href: '/support/care-plan', action: 'Open my support guide' };
    return { title: 'Find one useful next step for right now', body: 'Answer two quick questions for a focused starting point.', href: '/support/intake', action: 'Find my next step' };
  }, [activity.visits, personalization, plan, savedResources.length]);

  const suggestion = useMemo(() => {
    if (!personalization) return null;
    if (savedResources.length || activity.visits.some((v) => v.kind === 'local-help')) return { reason: 'Suggested because you saved or opened local resources.', title: 'Prepare for provider calls', href: '/worksheets/provider-interview.pdf', action: 'Open Provider Interview Guide' };
    if (activity.visits.some((v) => v.id === 'route.caregiver-toolkit')) return { reason: 'Suggested because you opened the Caregiver Toolkit.', title: 'Build a private kit of tools that work for you', href: '/support/caregiver', action: 'Open the toolkit' };
    if (plan) return { reason: 'Suggested because you created My Support Guide.', title: 'Return to your guide', href: '/support/care-plan', action: 'Open my guide' };
    return { reason: 'Suggested because you have not chosen a starting point yet.', title: 'Find one focused next step', href: '/support/intake', action: 'Start the guide' };
  }, [activity.visits, personalization, plan, savedResources.length]);

  if (!ready) return <div className="space-y-4"><div className="h-20 animate-pulse rounded-3xl bg-white/70" /><div className="h-44 animate-pulse rounded-3xl bg-white/70" /><div className="h-64 animate-pulse rounded-3xl bg-white/70" /></div>;

  return <div className="space-y-4 pb-5">
    <header className="flex items-center gap-4"><span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-brand-plum-100 bg-white text-brand-plum-700 shadow-soft"><Heart className="h-6 w-6" /></span><div><h1 className="text-2xl font-semibold leading-tight text-brand-navy-800 sm:text-[2rem]">Welcome back. Let&rsquo;s pick up where you left off.</h1><p className="mt-1 text-[14px] text-brand-muted-600">This is your space. Private, optional, and centered around you.</p></div></header>

    <section className="relative overflow-hidden rounded-[1.6rem] border border-primary/15 bg-gradient-to-br from-white via-white to-teal-50/70 p-6 shadow-[0_15px_45px_rgba(26,46,82,0.075)]"><span className="inline-flex rounded-full bg-teal-100/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-800">Continue where you left off</span><h2 className="mt-3 max-w-3xl text-2xl font-semibold text-brand-navy-800">{continuation.title}</h2><p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-brand-muted-600">{continuation.body}</p><Link href={continuation.href} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary/90">{continuation.action}<ArrowRight className="h-4 w-4" /></Link></section>

    {personalization && allowedKit.length > 0 && <section className="rounded-[1.35rem] border border-indigo-100 bg-gradient-to-r from-indigo-50/75 via-white to-brand-plum-50/55 p-5 shadow-sm"><div className="flex items-center gap-2"><Heart className="h-4 w-4 text-indigo-700" /><h2 className="text-[15px] font-semibold text-brand-navy-800">Your kit</h2></div><p className="mt-1 text-[11px] text-brand-muted-500">Only tools approved for Home Base appear here.</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{allowedKit.map((item) => <Link key={item.id} href="/support/caregiver" className="rounded-xl border border-white bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5"><span className="text-[13px] font-semibold text-brand-navy-800">{item.title}</span>{item.duration && <span className="mt-1 block text-[11px] text-brand-muted-500">{item.duration}</span>}</Link>)}</div></section>}

    <div className="grid gap-4 lg:grid-cols-3">
      <Panel title="Recently used" icon={Clock3}>{personalization && recent.length ? <div>{recent.slice(0, 3).map((item) => <Link key={`${item.id}-${'visitedAt' in item ? item.visitedAt : item.openedAt}`} href={item.href} className="group flex min-h-16 items-center gap-3 border-t border-surface-border px-4 py-3 first:border-t-0 hover:bg-primary/[0.035]"><span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold text-brand-navy-800">{'label' in item ? item.label : ''}</span><span className="mt-0.5 block text-[11px] text-brand-muted-500">{relativeTime('visitedAt' in item ? item.visitedAt : item.openedAt)}</span></span><ChevronRight className="h-4 w-4 text-brand-muted-400" /></Link>)}</div> : <div className="p-5 text-[12px] leading-relaxed text-brand-muted-500">{personalization ? 'Pages and private tools you open will appear here.' : 'Personalized Home Base is turned off.'}</div>}</Panel>
      <Panel title="Saved for later" icon={Bookmark}>{savedResources.length ? <div>{savedResources.slice(0, 3).map((r) => <Link key={r.id} href="/support/find" className="group flex min-h-16 items-center gap-3 border-t border-surface-border px-4 py-3 first:border-t-0 hover:bg-primary/[0.035]"><span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold text-brand-navy-800">{r.name}</span><span className="mt-0.5 block truncate text-[11px] text-brand-muted-500">{r.services.slice(0, 2).join(' · ')}</span></span><ChevronRight className="h-4 w-4 text-brand-muted-400" /></Link>)}</div> : <div className="p-5 text-[12px] text-brand-muted-500">Save providers and community resources inside Find Local Help.</div>}</Panel>
      <Panel title="Suggested next" icon={Sparkles}>{suggestion ? <div className="m-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-4"><p className="text-[11px] leading-relaxed text-brand-muted-600">{suggestion.reason}</p><p className="mt-3 text-[14px] font-semibold text-brand-navy-800">{suggestion.title}</p><Link href={suggestion.href} className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline">{suggestion.action}<ArrowRight className="h-3.5 w-3.5" /></Link></div> : <div className="p-5 text-[12px] text-brand-muted-500">Suggestions are off.</div>}</Panel>
    </div>

    <section className="rounded-[1.4rem] border border-surface-border bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold text-brand-navy-800">Explore Common Ground</h2><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{EXPLORE.map((item) => <Link key={item.href} href={item.href} className={cn('flex min-h-[104px] flex-col items-center justify-center rounded-2xl border bg-gradient-to-br p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md', item.style)}><item.icon className="h-6 w-6 text-primary" /><span className="mt-2 text-[11px] font-semibold leading-tight text-brand-navy-800">{item.label}</span></Link>)}</div></section>

    <div className="grid gap-4 lg:grid-cols-2"><section className="rounded-[1.35rem] border border-surface-border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><FileText className="h-5 w-5 text-indigo-700" /><h2 className="text-[14px] font-semibold text-brand-navy-800">Private tools</h2></div><p className="mt-2 text-[12px] leading-relaxed text-brand-muted-500">Worksheet answers stay on your device. Common Ground never receives them.</p></div><button type="button" onClick={() => setWorksheetsOpen((v) => !v)} className="rounded-xl px-3 py-2 text-[11px] font-semibold text-primary hover:bg-primary/5">{worksheetsOpen ? 'Hide' : 'Open'}</button></div>{worksheetsOpen && <div className="mt-4 grid gap-2 sm:grid-cols-2">{WORKSHEETS.map(([id, label, href]) => <a key={id} href={href} download onClick={() => recordPrivateTool({ id, label, href })} className="rounded-xl border border-surface-border p-3 text-[12px] font-semibold text-brand-navy-800 hover:border-primary/25">{label}</a>)}</div>}</section>
      <section className="rounded-[1.35rem] border border-primary/15 bg-gradient-to-r from-white to-teal-50/70 p-5 shadow-sm"><div className="flex items-start gap-3"><Settings2 className="mt-0.5 h-5 w-5 text-primary" /><div className="flex-1"><h2 className="text-[14px] font-semibold text-brand-navy-800">Personalized Home Base</h2><p className="mt-1 text-[12px] leading-relaxed text-brand-muted-500">Remember only explicitly allowed activity on this device. Sensitive and unclassified content is never included.</p><button type="button" role="switch" aria-checked={personalization} onClick={() => { setPersonalization(!personalization); refresh(); }} className={cn('mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-semibold', personalization ? 'bg-primary text-white' : 'border border-surface-border bg-white text-brand-navy-800')}>{personalization ? 'Turn off and purge activity' : 'Turn on personalization'}</button>{personalization && <button type="button" onClick={() => { clearHomeBaseRecentActivity(); refresh(); }} className="ml-2 mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" />Clear recent activity</button>}</div></div></section></div>

    <section className="overflow-hidden rounded-[1.45rem] border border-orange-100 bg-gradient-to-r from-[#fffaf4] via-white to-rose-50/65 shadow-sm"><div className="grid divide-y divide-orange-100/70 lg:grid-cols-4 lg:divide-x lg:divide-y-0"><div className="p-5"><h2 className="text-lg font-semibold text-brand-navy-800">We&rsquo;re here for you</h2><p className="mt-1 text-[12px] text-brand-muted-600">Real people. Real support.</p></div><a href="tel:+18777715725" className="flex items-center gap-3 p-5"><Phone className="h-5 w-5 text-primary" /><span className="text-[13px] font-semibold text-brand-navy-800">Admissions<br /><span className="text-primary">(877) 771-5725</span></span></a><a href="tel:988" className="flex items-center gap-3 p-5"><Heart className="h-5 w-5 text-rose-600" /><span className="text-[13px] font-semibold text-brand-navy-800">Crisis support<br /><span className="text-rose-600">Call or text 988</span></span></a><Link href="/client" className="flex items-center gap-3 p-5"><Lock className="h-5 w-5 text-primary" /><span className="text-[13px] font-semibold text-brand-navy-800">Current family sign-in</span></Link></div><div className="flex items-center gap-2 border-t border-orange-100/70 px-5 py-3 text-[11px] text-brand-muted-500"><ShieldCheck className="h-3.5 w-3.5" />Privacy first. You&rsquo;re in control.</div></section>
  </div>;
}
