'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Check, ChevronDown, ChevronRight, Clock3, Heart, HeartHandshake,
  HeartPulse, LifeBuoy, MapPin, Moon, Phone, ShieldCheck, Sparkles, SunMedium,
  UserRoundCheck, Users, X, Zap, type LucideIcon,
} from 'lucide-react';
import {
  TOOLKIT_ITEM_BY_ID, TOOLKIT_PLAYBOOKS, TOOLKIT_SECTIONS, TOOLKIT_TOOLS,
  type ToolkitItem, type ToolkitSectionId,
} from '@/content/caregiverToolkit';
import {
  HOME_BASE_ACTIVITY_EVENT, initializePersonalizationStorage, loadKitIds,
  recordToolkitItem, resetKit, suppressSession, toggleKitItem,
} from '@/lib/homeBaseActivity';
import { cn } from '@/lib/utils';

const SECTION_ICONS: Record<ToolkitSectionId, LucideIcon> = {
  'build-capacity': SunMedium, 'catch-it-early': Sparkles, 'get-through-it': Zap,
  'come-down': HeartPulse, 'long-haul': HeartHandshake,
};
const PLAYBOOK_ICONS: LucideIcon[] = [MapPin, Users, ShieldCheck, SunMedium, Heart, Sparkles, UserRoundCheck, LifeBuoy, Moon];
const DOORS = [
  { title: "I'm about to lose it", subtitle: 'Get through the next 5 minutes', section: 'get-through-it' as const, icon: Zap, className: 'border-rose-100 bg-gradient-to-br from-rose-50 to-orange-50' },
  { title: 'It just happened', subtitle: 'Come down and reset', section: 'come-down' as const, icon: HeartPulse, className: 'border-violet-100 bg-gradient-to-br from-violet-50 to-brand-plum-50' },
  { title: "I'm running on empty", subtitle: 'Build back your capacity', section: 'build-capacity' as const, icon: SunMedium, className: 'border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50' },
];

export default function CaregiverSupportPage() {
  const [kitIds, setKitIds] = useState<string[]>([]);
  const [openSection, setOpenSection] = useState<ToolkitSectionId | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [manageKit, setManageKit] = useState(false);
  const activePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializePersonalizationStorage();
    setKitIds(loadKitIds());
    const refresh = () => setKitIds(loadKitIds());
    window.addEventListener(HOME_BASE_ACTIVITY_EVENT, refresh);
    return () => window.removeEventListener(HOME_BASE_ACTIVITY_EVENT, refresh);
  }, []);

  useEffect(() => {
    if (!activeItemId) return;
    const timer = window.setTimeout(() => activePanelRef.current?.focus({ preventScroll: true }), 40);
    return () => window.clearTimeout(timer);
  }, [activeItemId]);

  const kitItems = useMemo(() => kitIds.map((id) => TOOLKIT_ITEM_BY_ID[id]).filter((item): item is ToolkitItem => Boolean(item)), [kitIds]);

  function openDoor(section: ToolkitSectionId) {
    setOpenSection(section);
    setActiveItemId(null);
    window.setTimeout(() => document.getElementById(`toolkit-section-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  }
  function openItem(item: ToolkitItem) {
    if (item.privacy.activity === 'allowed') recordToolkitItem(item);
    if (item.section !== 'playbooks') setOpenSection(item.section);
    setActiveItemId(item.id);
  }
  function toggleKit(id: string) { setKitIds(toggleKitItem(id)); }
  function beginPrivateSupport() { suppressSession(); }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500">
        <ol className="flex items-center gap-1.5"><li><Link href="/support" className="hover:text-brand-navy-700">Home</Link></li><li aria-hidden><ChevronRight className="h-3 w-3" /></li><li className="font-medium text-brand-muted-700">Caregiver toolkit</li></ol>
      </nav>
      <header className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Common Ground · Parent Support</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-brand-navy-800 sm:text-4xl">Your caregiver toolkit.</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-brand-muted-700">Tools for before, during, and after the hard moments.</p>
      </header>

      <section aria-labelledby="right-now-heading" className="mt-7">
        <h2 id="right-now-heading" className="text-lg font-semibold text-brand-navy-800">What&rsquo;s happening right now?</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {DOORS.map((door) => (
            <button key={door.section} type="button" onClick={() => openDoor(door.section)} className={cn('group flex min-h-[116px] items-center gap-4 rounded-[1.35rem] border p-5 text-left shadow-sm outline-none transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2', door.className)}>
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm"><door.icon className="h-6 w-6" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[15px] font-semibold text-brand-navy-800">{door.title}</span><span className="mt-1 block text-[12px] leading-relaxed text-brand-muted-600">{door.subtitle}</span></span>
              <ArrowRight className="h-4 w-4 text-brand-muted-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </section>

      {kitItems.length > 0 && (
        <section className="mt-6 rounded-[1.35rem] border border-indigo-100 bg-gradient-to-r from-indigo-50/75 via-white to-brand-plum-50/55 p-5 shadow-sm" aria-labelledby="my-kit-heading">
          <div className="flex items-start justify-between gap-4"><div><h2 id="my-kit-heading" className="text-lg font-semibold text-brand-navy-800">My kit</h2><p className="mt-1 text-[12px] text-brand-muted-500">Saved on this device.</p></div><button type="button" onClick={() => setManageKit((v) => !v)} className="rounded-xl px-3 py-2 text-[12px] font-semibold text-primary transition hover:bg-white" aria-expanded={manageKit}>Manage</button></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {kitItems.map((item) => <div key={item.id} className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm"><button type="button" onClick={() => openItem(item)} className="w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/40"><span className="block text-[13px] font-semibold text-brand-navy-800">{item.title}</span>{item.duration && <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand-muted-500"><Clock3 className="h-3 w-3" /> {item.duration}</span>}</button>{manageKit && <button type="button" onClick={() => toggleKit(item.id)} className="mt-3 text-[11px] font-semibold text-rose-700 hover:underline">Remove</button>}</div>)}
          </div>
          {manageKit && <button type="button" onClick={() => { resetKit(); setKitIds([]); setManageKit(false); }} className="mt-4 text-[11px] font-semibold text-rose-700 hover:underline">Reset my kit</button>}
        </section>
      )}

      <section className="mt-8" aria-labelledby="tools-by-moment-heading">
        <h2 id="tools-by-moment-heading" className="text-xl font-semibold text-brand-navy-800">Tools by moment</h2>
        <div className="mt-3 overflow-hidden rounded-[1.35rem] border border-surface-border bg-white shadow-sm">
          {TOOLKIT_SECTIONS.map((section) => {
            const tools = TOOLKIT_TOOLS.filter((item) => item.section === section.id);
            const expanded = openSection === section.id;
            const Icon = SECTION_ICONS[section.id];
            return <div key={section.id} id={`toolkit-section-${section.id}`} className="scroll-mt-24 border-b border-surface-border last:border-b-0">
              <button type="button" onClick={() => setOpenSection(expanded ? null : section.id)} aria-expanded={expanded} className={cn('flex min-h-[76px] w-full items-center gap-3 px-4 py-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 sm:px-5', expanded ? 'bg-primary/[0.045]' : 'hover:bg-surface-subtle/60')}>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block text-[14px] font-semibold text-brand-navy-800">{section.title}</span><span className="mt-0.5 block text-[12px] leading-relaxed text-brand-muted-500">{section.summary}</span></span><span className="hidden text-[11px] font-semibold text-brand-muted-500 sm:inline">{tools.length} tools</span><ChevronDown className={cn('h-4 w-4 text-brand-muted-400 transition', expanded && 'rotate-180')} />
              </button>
              {expanded && <div className="grid gap-3 border-t border-surface-border bg-surface-subtle/35 p-3 sm:grid-cols-2 sm:p-4">
                {tools.map((item) => { const inKit = kitIds.includes(item.id); return <article key={item.id} className="rounded-2xl border border-surface-border bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="text-[14px] font-semibold text-brand-navy-800">{item.title}</h3>{item.duration && <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2 py-1 text-[10px] font-semibold text-brand-muted-600"><Clock3 className="h-3 w-3" />{item.duration}</span>}</div><button type="button" onClick={() => toggleKit(item.id)} className={cn('inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40', inKit ? 'bg-teal-50 text-teal-800' : 'bg-primary/[0.06] text-primary hover:bg-primary/[0.1]')}>{inKit ? <Check className="h-3.5 w-3.5" /> : <Heart className="h-3.5 w-3.5" />}{inKit ? 'In my kit' : 'Helped me'}</button></div><p className="mt-3 text-[13px] leading-relaxed text-brand-muted-700">{item.body}</p><button type="button" onClick={() => openItem(item)} className="mt-3 text-[11px] font-semibold text-primary hover:underline">Open focused view</button></article>; })}
              </div>}
            </div>;
          })}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="playbooks-heading">
        <h2 id="playbooks-heading" className="text-xl font-semibold text-brand-navy-800">Playbooks</h2><p className="mt-1 text-[13px] text-brand-muted-600">Specific situations. One practical play.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLKIT_PLAYBOOKS.map((item, index) => { const Icon = PLAYBOOK_ICONS[index] ?? LifeBuoy; const inKit = kitIds.includes(item.id); return <article key={item.id} className="group rounded-[1.25rem] border border-surface-border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start gap-3"><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-plum-50 text-brand-plum-700"><Icon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h3 className="text-[14px] font-semibold text-brand-navy-800">{item.title}</h3><p className="mt-1 text-[12px] leading-relaxed text-brand-muted-500">{item.descriptor}</p></div></div><div className="mt-4 flex items-center justify-between gap-2"><button type="button" onClick={() => openItem(item)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-primary/[0.06] px-3 py-2 text-[11px] font-semibold text-primary outline-none transition hover:bg-primary/[0.1] focus-visible:ring-2 focus-visible:ring-primary/40">Open playbook <ArrowRight className="h-3.5 w-3.5" /></button><button type="button" onClick={() => toggleKit(item.id)} aria-label={inKit ? `Remove ${item.title} from my kit` : `Add ${item.title} to my kit`} className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40', inKit ? 'bg-teal-50 text-teal-800' : 'bg-surface-subtle text-brand-muted-500 hover:text-primary')}>{inKit ? <Check className="h-4 w-4" /> : <Heart className="h-4 w-4" />}</button></div></article>; })}
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-[1.35rem] border border-rose-100 bg-gradient-to-br from-rose-50/80 via-white to-orange-50/80 shadow-sm" aria-labelledby="support-heading">
        <button type="button" onClick={() => { beginPrivateSupport(); setSupportOpen((v) => !v); }} aria-expanded={supportOpen} className="flex min-h-[84px] w-full items-center gap-3 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-400"><span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white"><LifeBuoy className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span id="support-heading" className="block text-[15px] font-semibold text-brand-navy-800">If a tool isn&rsquo;t enough today</span><span className="mt-1 block text-[12px] text-brand-muted-600">Open human support and crisis options.</span></span><ChevronDown className={cn('h-4 w-4 text-brand-muted-500 transition', supportOpen && 'rotate-180')} /></button>
        {supportOpen && <div className="grid gap-3 border-t border-rose-100 p-4 sm:grid-cols-3"><Link href="/support/connect" onClick={beginPrivateSupport} className="flex min-h-16 items-center gap-3 rounded-xl border border-white bg-white/90 p-4 text-[13px] font-semibold text-brand-navy-800 shadow-sm"><Users className="h-5 w-5 text-primary" /> Connect with parents</Link><Link href="/support/find" onClick={beginPrivateSupport} className="flex min-h-16 items-center gap-3 rounded-xl border border-white bg-white/90 p-4 text-[13px] font-semibold text-brand-navy-800 shadow-sm"><MapPin className="h-5 w-5 text-primary" /> Find local help</Link><a href="tel:988" onClick={beginPrivateSupport} className="flex min-h-16 items-center gap-3 rounded-xl border border-rose-200 bg-rose-600 p-4 text-[13px] font-semibold text-white shadow-sm"><Phone className="h-5 w-5" /> Call 988</a></div>}
      </section>

      <p className="mt-6 text-[11.5px] leading-relaxed text-brand-muted-500">Common Ground is parent support, not clinical care. These tools are general mental-health techniques drawn from public, evidence-based practice. They do not diagnose, treat, or replace care from a licensed clinician. If you are in crisis, call or text <a href="tel:988" onClick={beginPrivateSupport} className="font-semibold underline">988</a>.</p>

      {activeItemId && TOOLKIT_ITEM_BY_ID[activeItemId] && <div className="fixed inset-0 z-[90] flex items-end justify-center bg-brand-navy-950/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setActiveItemId(null); }}><div ref={activePanelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="toolkit-panel-title" className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-[1.5rem] border border-surface-border bg-white p-5 shadow-2xl outline-none sm:rounded-[1.5rem] sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">Caregiver toolkit</p><h2 id="toolkit-panel-title" className="mt-2 text-2xl font-semibold text-brand-navy-800">{TOOLKIT_ITEM_BY_ID[activeItemId].title}</h2></div><button type="button" onClick={() => setActiveItemId(null)} className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-brand-muted-500 transition hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-primary/40" aria-label="Close tool"><X className="h-5 w-5" /></button></div>{TOOLKIT_ITEM_BY_ID[activeItemId].duration && <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-surface-subtle px-3 py-1.5 text-[11px] font-semibold text-brand-muted-600"><Clock3 className="h-3.5 w-3.5" />{TOOLKIT_ITEM_BY_ID[activeItemId].duration}</span>}<p className="mt-5 text-[15px] leading-7 text-brand-muted-700">{TOOLKIT_ITEM_BY_ID[activeItemId].body}</p><button type="button" onClick={() => toggleKit(activeItemId)} className={cn('mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-primary/40', kitIds.includes(activeItemId) ? 'bg-teal-50 text-teal-800' : 'bg-primary text-white')}>{kitIds.includes(activeItemId) ? <Check className="h-4 w-4" /> : <Heart className="h-4 w-4" />}{kitIds.includes(activeItemId) ? 'In my kit' : 'Helped me'}</button></div></div>}
    </main>
  );
}
