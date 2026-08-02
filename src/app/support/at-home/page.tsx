'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle, ArrowRight, BookOpen, Brain, Check, ChevronRight, Download, Eye,
  Gift, HeartHandshake, Info, LockKeyhole, MessageCircle, PackageOpen, Phone,
  Printer, RefreshCcw, ShieldAlert, Sparkles, Users, X,
} from 'lucide-react';
import { AT_HOME_STRATEGIES_LABEL } from '@/lib/supportNavLabels';
import {
  AFTER_LABELS, BEFORE_LABELS, BEHAVIOR_LABELS, SETTING_EVENT_LABELS,
  isTierOneBehavior, matchAtHomeStrategies,
  type AfterId, type BeforeId, type BehaviorId, type FunctionId,
  type MatchInput, type MatchedStrategy, type SettingEventId,
} from '@/lib/atHomeMatcher';
import { cn } from '@/lib/utils';

const FUNCTIONS: Array<{ id: FunctionId; title: string; short: string; description: string; examples: string; icon: typeof Gift; className: string }> = [
  { id: 'tangible', title: 'Tangible', short: 'Getting something', description: 'The behavior may help get or regain an item, activity, food, location, or privilege.', examples: 'Watch for: denied, delayed, removed, or unavailable items.', icon: PackageOpen, className: 'border-emerald-200 bg-emerald-50/70 text-emerald-800' },
  { id: 'escape', title: 'Escape', short: 'Getting out of something', description: 'The behavior may help delay, reduce, avoid, or end something difficult or unwanted.', examples: 'Watch for: demands, transitions, waiting, endings, or discomfort.', icon: ArrowRight, className: 'border-sky-200 bg-sky-50/70 text-sky-800' },
  { id: 'attention', title: 'Attention', short: 'Getting someone', description: 'The behavior may reliably produce talking, helping, comforting, correcting, or another response.', examples: 'Watch for: another person was busy, unavailable, or elsewhere.', icon: Users, className: 'border-violet-200 bg-violet-50/70 text-violet-800' },
  { id: 'automatic', title: 'Automatic', short: 'How it feels', description: 'The behavior itself may provide sensory input, stimulation, regulation, relief, or comfort.', examples: 'Watch for: it also happens alone or without an obvious social outcome.', icon: Brain, className: 'border-amber-200 bg-amber-50/70 text-amber-800' },
];

const SETTING_EVENTS: Array<{ id: SettingEventId; label: string }> = Object.entries(SETTING_EVENT_LABELS).map(([id, label]) => ({ id: id as SettingEventId, label }));
const BEFORE_OPTIONS: Array<{ id: BeforeId; label: string }> = Object.entries(BEFORE_LABELS).map(([id, label]) => ({ id: id as BeforeId, label }));
const BEHAVIOR_OPTIONS: Array<{ id: BehaviorId; label: string; tierOne?: boolean }> = Object.entries(BEHAVIOR_LABELS).map(([id, label]) => ({ id: id as BehaviorId, label, tierOne: isTierOneBehavior(id as BehaviorId) }));
const AFTER_OPTIONS: Array<{ id: AfterId; label: string }> = Object.entries(AFTER_LABELS).map(([id, label]) => ({ id: id as AfterId, label }));

const EMPTY_INPUT: MatchInput = { settingEvents: [], before: null, behavior: null, after: null };

export default function AtHomeStrategiesPage() {
  const [input, setInput] = useState<MatchInput>(EMPTY_INPUT);
  const [showResults, setShowResults] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState<MatchedStrategy | null>(null);
  const [currentFamily, setCurrentFamily] = useState(false);
  const receiveRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const cookieSignal = /(?:^|;\s*)(cg_current_family|current_family|client_session)=([^;]+)/.test(document.cookie);
    setCurrentFamily(query.get('currentFamily') === '1' || cookieSignal);
  }, []);

  const complete = Boolean(input.before && input.behavior && input.after);
  const tierOne = isTierOneBehavior(input.behavior);
  const result = useMemo(() => matchAtHomeStrategies(input), [input]);

  function update<K extends keyof MatchInput>(key: K, value: MatchInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
    setShowResults(false);
    setActiveStrategy(null);
  }

  function toggleSettingEvent(id: SettingEventId) {
    setInput((current) => ({ ...current, settingEvents: current.settingEvents.includes(id) ? current.settingEvents.filter((item) => item !== id) : [...current.settingEvents, id] }));
    setShowResults(false);
  }

  function revealResults() {
    if (!complete || tierOne) return;
    setShowResults(true);
    window.setTimeout(() => receiveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  }

  function clearActivity() {
    setInput(EMPTY_INPUT);
    setShowResults(false);
    setActiveStrategy(null);
  }

  function summaryHtml() {
    const insightRows = result.insights.map((item) => `<li><strong>${item.label}: ${item.status === 'possible' ? 'Possible' : 'Unclear'}</strong><br/>${item.explanation}</li>`).join('');
    const strategyRows = tierOne || currentFamily ? '' : result.strategies.map((item) => `<li><strong>${item.strategy.title}</strong> — ${item.mechanismLabel}<br/>${item.why}</li>`).join('');
    const settings = input.settingEvents.length ? input.settingEvents.map((id) => SETTING_EVENT_LABELS[id]).join(', ') : 'None selected';
    return `<!doctype html><html><head><meta charset="utf-8"><title>Caregiver observation summary</title><style>body{font-family:Arial,sans-serif;color:#17233f;max-width:760px;margin:40px auto;padding:0 24px;line-height:1.5}h1{font-size:28px}h2{font-size:18px;margin-top:28px;border-bottom:1px solid #d9deea;padding-bottom:6px}.note{background:#f4f6fa;border:1px solid #d9deea;border-radius:12px;padding:14px}li{margin:10px 0}@media print{body{margin:0;max-width:none}}</style></head><body><h1>Caregiver observation summary</h1><p class="note">Caregiver observations only. This is not a functional assessment, diagnosis, or treatment plan.</p><h2>Setting events</h2><p>${settings}</p><h2>ABC observation</h2><p><strong>Before:</strong> ${input.before ? BEFORE_LABELS[input.before] : 'Not selected'}<br/><strong>Behavior:</strong> ${input.behavior ? BEHAVIOR_LABELS[input.behavior] : 'Not selected'}<br/><strong>After:</strong> ${input.after ? AFTER_LABELS[input.after] : 'Not selected'}</p>${tierOne ? '<h2>Safety note</h2><p>A higher-risk behavior was selected. No function insight or routine strategies were generated. Review safety and the established plan with the care team.</p>' : `<h2>Function observations</h2><ul>${insightRows}</ul>`}${strategyRows ? `<h2>Strategies surfaced</h2><ul>${strategyRows}</ul>` : ''}<h2>Questions for the care team</h2><ul><li>What additional observations would make the pattern clearer?</li><li>Does the current behavior or safety plan already address this situation?</li><li>Which prevention, communication, or regulation support should we practice?</li></ul></body></html>`;
  }

  function downloadSummary() {
    const blob = new Blob([summaryHtml()], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'common-ground-caregiver-observation.html';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function printSummary() {
    const popup = window.open('', '_blank', 'noopener,noreferrer');
    if (!popup) return;
    popup.document.write(summaryHtml());
    popup.document.close();
    popup.focus();
    popup.print();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500">
        <ol className="flex items-center gap-1.5"><li><Link href="/support" className="hover:text-brand-navy-700">Home</Link></li><li aria-hidden><ChevronRight className="h-3 w-3" /></li><li className="font-medium text-brand-muted-700">{AT_HOME_STRATEGIES_LABEL}</li></ol>
      </nav>

      <header className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1 text-[11px] font-semibold text-brand-plum-700"><Sparkles className="h-3.5 w-3.5" /> {AT_HOME_STRATEGIES_LABEL}</span>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-brand-navy-700 sm:text-4xl">Understand the pattern. Choose a tool that fits.</h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-brand-muted-700">Learn the four common functions of behavior, apply an ABC lens to one moment, and receive non-restrictive supports to discuss with your care team.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 lg:w-72">
          <div className="flex items-start gap-3"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><div><p className="text-sm font-bold text-emerald-900">Temporary activity</p><p className="mt-1 text-[12px] leading-relaxed text-emerald-800">This page holds selections in the open tab’s memory. It does not write them to Home Base, a child profile, local storage, or cookies. Refreshing or leaving clears them. Site analytics and error logging still require launch review.</p><button type="button" onClick={clearActivity} className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-800 hover:underline"><RefreshCcw className="h-3.5 w-3.5" /> Clear this activity</button></div></div>
        </div>
      </header>

      <div className="mt-7 grid gap-3 sm:grid-cols-3"><StepBadge number="1" title="Learn" text="Understand the four functions" /><StepBadge number="2" title="Apply" text="Look at one moment with ABC" /><StepBadge number="3" title="Receive" text="See matched supports and why" /></div>

      <section aria-labelledby="learn-heading" className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-5 shadow-sm sm:p-6">
        <SectionHeading number="1" label="Learn" title="The four common functions of behavior" id="learn-heading" />
        <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-brand-muted-700">The same behavior can happen for different reasons. These are four lenses to consider—not a diagnosis or confirmed function.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{FUNCTIONS.map((item) => { const Icon = item.icon; return <article key={item.id} className={cn('rounded-2xl border p-4', item.className)}><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-sm"><Icon className="h-5 w-5" /></span><h3 className="mt-3 text-base font-bold">{item.title}</h3><p className="text-[12px] font-semibold opacity-80">{item.short}</p><p className="mt-2 text-[13px] leading-relaxed text-brand-muted-800">{item.description}</p><p className="mt-3 border-t border-current/15 pt-3 text-[11px] leading-relaxed opacity-80">{item.examples}</p></article>; })}</div>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-white/75 px-4 py-3 text-[12px] leading-relaxed text-emerald-900"><Eye className="mt-0.5 h-4 w-4 shrink-0" /><p><strong>Think like a detective, not a judge.</strong> Ask what changed before and after instead of assigning motives to the child.</p></div>
      </section>

      <section aria-labelledby="apply-heading" className="mt-5 rounded-[1.5rem] border border-sky-200 bg-gradient-to-br from-sky-50/80 to-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><SectionHeading number="2" label="Apply" title="Use ABC to examine one moment" id="apply-heading" /><p className="mt-2 text-[14px] leading-relaxed text-brand-muted-700">Select what was most true. Do not include names or identifying details.</p></div><span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold text-sky-800"><LockKeyhole className="h-3.5 w-3.5" /> Cleared when you leave</span></div>
        <fieldset className="mt-5 rounded-2xl border border-sky-100 bg-white p-4"><legend className="text-sm font-bold text-brand-navy-700">Optional setting events</legend><p className="mt-1 text-[11px] text-brand-muted-600">Was anything different earlier that day?</p><div className="mt-3 flex flex-wrap gap-2">{SETTING_EVENTS.map((option) => <ChoiceChip key={option.id} label={option.label} active={input.settingEvents.includes(option.id)} onClick={() => toggleSettingEvent(option.id)} />)}</div></fieldset>
        <div className="mt-4 grid gap-4 lg:grid-cols-3"><ChoicePanel letter="A" title="Before" question="What happened immediately before?" options={BEFORE_OPTIONS} value={input.before} onSelect={(value) => update('before', value as BeforeId)} tone="sky" /><ChoicePanel letter="B" title="Behavior" question="What could someone see or hear?" options={BEHAVIOR_OPTIONS} value={input.behavior} onSelect={(value) => update('behavior', value as BehaviorId)} tone="violet" /><ChoicePanel letter="C" title="After" question="What happened immediately afterward?" options={AFTER_OPTIONS} value={input.after} onSelect={(value) => update('after', value as AfterId)} tone="emerald" /></div>
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-2 text-[12px] leading-relaxed text-brand-muted-700"><Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" /><p>ABC organizes an observation. It does not prove why a behavior occurred.</p></div>{!tierOne && <button type="button" onClick={revealResults} disabled={!complete} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy-700 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-brand-navy-800 disabled:cursor-not-allowed disabled:opacity-40">See matched supports <ArrowRight className="h-4 w-4" /></button>}</div>
      </section>

      <section ref={receiveRef} aria-labelledby="receive-heading" className="mt-5 rounded-[1.5rem] border border-violet-200 bg-gradient-to-br from-violet-50/80 to-white p-5 shadow-sm sm:p-6">
        <SectionHeading number="3" label="Receive" title={tierOne ? 'Safety comes first' : currentFamily ? 'Use the plan your team already built' : 'See what may be worth noticing'} id="receive-heading" />
        {tierOne ? <SafetyInterstitial input={input} onSave={downloadSummary} /> : currentFamily ? <CurrentFamilyPanel onDownload={downloadSummary} onPrint={printSummary} /> : !showResults ? <LockedReceive /> : <Results result={result} onOpen={setActiveStrategy} onDownload={downloadSummary} onPrint={printSummary} />}
      </section>

      <div className="mt-5 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/60 p-5"><div className="flex items-start gap-3"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-plum-700" /><div><h2 className="text-base font-bold text-brand-navy-700">Common Ground supports the conversation</h2><p className="mt-1 text-[12px] leading-relaxed text-brand-muted-700">This activity helps caregivers notice useful details. A BCBA can assess the pattern, consider the full context, and individualize treatment.</p></div></div></div>

      {activeStrategy && <StrategyDialog match={activeStrategy} onClose={() => setActiveStrategy(null)} />}
    </main>
  );
}

function SafetyInterstitial({ input, onSave }: { input: MatchInput; onSave: () => void }) {
  return <div className="mt-5 rounded-2xl border-2 border-rose-300 bg-rose-50 p-5 sm:p-6"><div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 h-7 w-7 shrink-0 text-rose-700" /><div><h3 className="text-xl font-bold text-rose-950">Focus on immediate safety—not strategy matching.</h3><p className="mt-2 text-sm leading-relaxed text-rose-900">A higher-risk behavior was selected: <strong>{input.behavior ? BEHAVIOR_LABELS[input.behavior] : ''}</strong>. Follow the child’s established safety or crisis plan, reduce immediate hazards when safe to do so, and avoid introducing an unfamiliar intervention during the event.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Link href="/support/crisis" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 text-sm font-bold text-white hover:bg-rose-800"><ShieldAlert className="h-4 w-4" /> Open crisis support</Link><a href="tel:+18777715725" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-navy-700 px-4 text-sm font-bold text-white hover:bg-brand-navy-800"><Phone className="h-4 w-4" /> Talk to someone now</a></div><button type="button" onClick={onSave} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 text-sm font-semibold text-rose-900 hover:bg-rose-100"><Download className="h-4 w-4" /> Save this observation for your care team</button><p className="mt-3 text-[11px] leading-relaxed text-rose-800">No pattern insight or routine strategy cards are generated for this selection. Deselect it to continue with a non-Tier-1 behavior.</p></div>;
}

function CurrentFamilyPanel({ onDownload, onPrint }: { onDownload: () => void; onPrint: () => void }) {
  return <div className="mt-5 rounded-2xl border border-brand-plum-200 bg-white p-5"><div className="flex items-start gap-3"><HeartHandshake className="mt-0.5 h-6 w-6 shrink-0 text-brand-plum-700" /><div><h3 className="text-lg font-bold text-brand-navy-700">Your team already has a plan for this.</h3><p className="mt-2 text-sm leading-relaxed text-brand-muted-700">Common Ground will not run a parallel recommendation engine for a signed-in family. Use the observation summary to ask how this situation fits the current behavior plan.</p></div></div><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={onDownload} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy-700 px-4 text-sm font-semibold text-white"><Download className="h-4 w-4" /> Download handoff</button><button type="button" onClick={onPrint} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-surface-border bg-white px-4 text-sm font-semibold text-brand-navy-700"><Printer className="h-4 w-4" /> Print handoff</button><Link href="/client/portal" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-plum-200 bg-brand-plum-50 px-4 text-sm font-semibold text-brand-plum-800">Open client portal <ArrowRight className="h-4 w-4" /></Link></div></div>;
}

function LockedReceive() { return <div className="mt-5 rounded-2xl border border-dashed border-violet-200 bg-white/70 p-8 text-center"><Gift className="mx-auto h-8 w-8 text-violet-500" /><p className="mt-3 text-sm font-bold text-brand-navy-700">Complete A, B, and C to unlock this section.</p><p className="mt-1 text-[12px] text-brand-muted-600">Possible requires at least two details pointing in the same direction.</p></div>; }

function Results({ result, onOpen, onDownload, onPrint }: { result: ReturnType<typeof matchAtHomeStrategies>; onOpen: (match: MatchedStrategy) => void; onDownload: () => void; onPrint: () => void }) {
  return <><div className={cn('mt-4 rounded-2xl border p-4', result.sensorySupport ? 'border-teal-200 bg-teal-50/80' : 'border-amber-200 bg-amber-50/75')}><div className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="text-[13px] font-bold text-brand-navy-800">Observation coaching—not an assessment</p><p className="mt-1 text-[12px] leading-relaxed text-brand-muted-800">{result.summary}</p></div></div></div><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{result.insights.map((insight) => <article key={insight.id} className="rounded-2xl border border-violet-100 bg-white p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-bold text-brand-navy-700">{insight.label}</h3><span className={cn('rounded-full px-2 py-1 text-[10px] font-bold', insight.status === 'possible' ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-600')}>{insight.status === 'possible' ? 'Possible' : 'Unclear'}</span></div><p className="mt-2 text-[11px] leading-relaxed text-brand-muted-600">{insight.explanation}</p></article>)}</div><div className="mt-6"><h3 className="text-lg font-bold text-brand-navy-700">Four distinct supports to explore</h3><p className="mt-1 text-[12px] text-brand-muted-600">At most one support is returned from each mechanism. These are non-restrictive options, not a treatment plan.</p></div><div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{result.strategies.map((match) => <button key={match.strategy.id} type="button" onClick={() => onOpen(match)} className="group rounded-2xl border border-violet-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"><span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">{match.mechanismLabel}</span><h4 className="mt-3 text-sm font-bold text-brand-navy-700">{match.strategy.title}</h4><p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-violet-700">Why it appeared</p><p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">{match.why}</p><span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-brand-navy-700">See how to use it <ArrowRight className="h-3.5 w-3.5" /></span></button>)}</div><div className="mt-5 rounded-2xl border border-violet-200 bg-white p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex max-w-xl items-start gap-3"><HeartHandshake className="mt-0.5 h-6 w-6 shrink-0 text-violet-700" /><div><h3 className="text-base font-bold text-brand-navy-700">Bring the observation to your BCBA</h3><p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">Generate a one-page handoff with ABC, function observations, surfaced supports, and questions.</p></div></div><div className="flex flex-wrap gap-2"><button type="button" onClick={onDownload} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-navy-700 px-4 text-sm font-semibold text-white"><Download className="h-4 w-4" /> Download</button><button type="button" onClick={onPrint} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-surface-border bg-white px-4 text-sm font-semibold text-brand-navy-700"><Printer className="h-4 w-4" /> Print</button></div></div></div></>;
}

function StepBadge({ number, title, text }: { number: string; title: string; text: string }) { return <div className="flex items-center gap-3 rounded-2xl border border-surface-border bg-white px-4 py-3 shadow-sm"><span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy-700 text-sm font-bold text-white">{number}</span><div><p className="text-sm font-bold text-brand-navy-700">{title}</p><p className="text-[11px] text-brand-muted-600">{text}</p></div></div>; }
function SectionHeading({ number, label, title, id }: { number: string; label: string; title: string; id: string }) { return <div className="flex items-center gap-3"><span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-navy-700 shadow-sm">{number}</span><div><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">{label}</p><h2 id={id} className="text-lg font-bold text-brand-navy-700 sm:text-xl">{title}</h2></div></div>; }
function ChoiceChip({ label, active, onClick, danger }: { label: string; active: boolean; onClick: () => void; danger?: boolean }) { return <button type="button" onClick={onClick} aria-pressed={active} className={cn('rounded-full border px-3 py-2 text-left text-[11px] font-semibold transition', active ? danger ? 'border-rose-700 bg-rose-700 text-white' : 'border-brand-navy-700 bg-brand-navy-700 text-white' : danger ? 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100' : 'border-surface-border bg-slate-50 text-brand-muted-700 hover:border-brand-plum-200 hover:bg-brand-plum-50')}>{label}{danger && <span className="ml-1 text-[9px] uppercase">Safety</span>}</button>; }
function ChoicePanel({ letter, title, question, options, value, onSelect, tone }: { letter: string; title: string; question: string; options: Array<{ id: string; label: string; tierOne?: boolean }>; value: string | null; onSelect: (value: string) => void; tone: 'sky' | 'violet' | 'emerald' }) { const toneClass = tone === 'sky' ? 'bg-sky-100 text-sky-800' : tone === 'violet' ? 'bg-violet-100 text-violet-800' : 'bg-emerald-100 text-emerald-800'; return <fieldset className="rounded-2xl border border-surface-border bg-white p-4"><legend className="sr-only">{title}: {question}</legend><div className="flex items-start gap-3"><span className={cn('inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold', toneClass)}>{letter}</span><div><h3 className="text-sm font-bold text-brand-navy-700">{title}</h3><p className="text-[11px] text-brand-muted-600">{question}</p></div></div><div className="mt-4 flex flex-wrap gap-2">{options.map((option) => <ChoiceChip key={option.id} label={option.label} active={value === option.id} onClick={() => onSelect(option.id)} danger={option.tierOne} />)}</div></fieldset>; }
function StrategyDialog({ match, onClose }: { match: MatchedStrategy; onClose: () => void }) { const { strategy } = match; return <div className="fixed inset-0 z-50 flex items-end justify-center bg-brand-navy-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="strategy-dialog-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[1.5rem] bg-white p-5 shadow-2xl sm:rounded-[1.5rem] sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-violet-700">{match.mechanismLabel}</p><h2 id="strategy-dialog-title" className="mt-1 text-2xl font-bold text-brand-navy-700">{strategy.title}</h2><p className="mt-2 text-sm leading-relaxed text-brand-muted-700">{strategy.explanation}</p></div><button type="button" onClick={onClose} aria-label="Close strategy" className="rounded-full border border-surface-border p-2 text-brand-muted-600"><X className="h-4 w-4" /></button></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4"><h3 className="text-sm font-bold text-brand-navy-700">Why it appeared</h3><p className="mt-2 text-[12px] leading-relaxed text-brand-muted-700">{match.why}</p></div><div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4"><h3 className="text-sm font-bold text-brand-navy-700">When to use it</h3><p className="mt-2 text-[12px] leading-relaxed text-brand-muted-700">{match.when}</p></div></div><div className="mt-5"><h3 className="text-sm font-bold text-brand-navy-700">How to try it</h3><ol className="mt-3 space-y-2">{strategy.howTo.map((step, index) => <li key={step} className="flex gap-3 text-[13px] leading-relaxed text-brand-muted-700"><span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-plum-50 text-[11px] font-bold text-brand-plum-700">{index + 1}</span>{step}</li>)}</ol></div><div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4"><div className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /><div><h3 className="text-sm font-bold text-amber-950">Common way this can miss</h3><p className="mt-1 text-[12px] leading-relaxed text-amber-900">{strategy.commonMistake}</p></div></div></div><div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4"><h3 className="text-sm font-bold text-emerald-950">Ask your BCBA</h3><p className="mt-1 text-[12px] leading-relaxed text-emerald-900">“{match.askYourBcba}”</p></div><button type="button" onClick={onClose} className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-navy-700 px-5 text-sm font-semibold text-white">Done</button></div></div>; }
