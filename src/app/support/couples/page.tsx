'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseMedical,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  DoorOpen,
  HeartHandshake,
  Home,
  LifeBuoy,
  Lock,
  MessageCircle,
  Moon,
  Pause,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';
import { suppressSession } from '@/lib/homeBaseActivity';
import { cn } from '@/lib/utils';

type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
type PathId = 'together' | 'apart' | 'not-engaging' | 'carrying-alone';

type PathTool = {
  title: string;
  body: string;
  icon: Icon;
  bcbaNote?: string;
};

type RelationshipPath = {
  id: PathId;
  title: string;
  subtitle: string;
  icon: Icon;
  tools: PathTool[];
};

const PATHS: RelationshipPath[] = [
  {
    id: 'together',
    title: 'We’re parenting together',
    subtitle: 'For partners sharing one home and one daily caregiving load.',
    icon: HeartHandshake,
    tools: [
      {
        title: 'The case manager and the assistant',
        body: 'One parent may carry appointments, data, school messages, and treatment details while the other feels corrected or left outside. Name the invisible work first. Then choose one area each person fully owns instead of one person supervising everything.',
        icon: BriefcaseMedical,
      },
      {
        title: 'We disagree about treatment',
        body: 'Separate the relationship conflict from the clinical question. Write down what each person is worried will happen, then bring the treatment-hours, goals, or approach question to the BCBA together.',
        icon: Scale,
        bcbaNote: 'Questions about treatment intensity, goals, or the child’s plan belong with the BCBA.',
      },
      {
        title: 'We are on different acceptance timelines',
        body: 'One person may be adapting while the other is still grieving, questioning, or hoping things will change quickly. Do not force matching emotions. Ask what each person needs to stay connected while processing at a different pace.',
        icon: Clock3,
      },
      {
        title: 'Sleep is driving the conflict',
        body: 'Treat exhaustion as a household problem, not a character flaw. Before solving the relationship, identify tonight’s sleep coverage, the next handoff, and the smallest recovery window each person can realistically get.',
        icon: Moon,
      },
      {
        title: 'There is no realistic date night',
        body: 'Connection does not have to require a sitter. Use ten minutes after a handoff, share a snack after bedtime, or sit together without discussing therapy logistics. The goal is contact, not a perfect outing.',
        icon: Sparkles,
      },
      {
        title: 'Therapy costs and lost income are shaping everything',
        body: 'Name the financial pressure directly before it becomes blame. Choose one money conversation with a clear purpose: understand the numbers, identify one decision, and stop before exhaustion turns it into a verdict on the relationship.',
        icon: Wallet,
      },
    ],
  },
  {
    id: 'apart',
    title: 'We’re co-parenting apart',
    subtitle: 'For separated or divorced caregivers coordinating across two homes.',
    icon: Home,
    tools: [
      {
        title: 'Consistency across two homes',
        body: 'Aim for a small shared floor rather than identical households. Agree on the few routines that most affect safety, sleep, communication, or treatment carryover. Each home can still have its own style.',
        icon: Home,
        bcbaNote: 'Ask the BCBA which routines or skills most need consistency across settings.',
      },
      {
        title: 'Share clinical information without reopening the relationship',
        body: 'Use a short, factual update: what changed, what the provider asked caregivers to do, and what response is needed. Leave old relationship arguments out of treatment communication.',
        icon: MessageCircle,
      },
      {
        title: 'Disagreement about hours or approach',
        body: 'Do not make one parent the messenger or clinical authority. Send the question to the care team and request that both caregivers receive the same explanation whenever permissions allow.',
        icon: Scale,
        bcbaNote: 'The care team should answer child-specific questions; this page does not decide treatment.',
      },
      {
        title: 'Keep the child out of the conflict',
        body: 'Do not ask the child to carry messages, report on the other home, or prove which approach works. Use a neutral adult channel for schedules, provider updates, and decisions.',
        icon: ShieldCheck,
      },
      {
        title: 'Different acceptance timelines across households',
        body: 'You do not need emotional agreement before creating workable coordination. Focus first on what the child needs adults to communicate clearly this week.',
        icon: Clock3,
      },
    ],
  },
  {
    id: 'not-engaging',
    title: 'My partner won’t engage',
    subtitle: 'For when you are the only person currently seeking support or change.',
    icon: UserRound,
    tools: [
      {
        title: 'Work with what one person can control',
        body: 'You cannot create mutual participation alone. You can shorten escalating conversations, make direct requests, protect your own support, and keep essential caregiving communication clear.',
        icon: CheckCircle2,
      },
      {
        title: 'Stop pursuing the same closed conversation',
        body: 'When repeated attempts produce withdrawal or escalation, pause the pursuit. State the issue once, name what decision is actually needed, and choose a later time or an outside support instead of repeating the entire argument.',
        icon: Pause,
      },
      {
        title: 'Individual counseling still counts',
        body: 'Relationship strain does not require both people to begin getting support. Individual counseling can help you clarify boundaries, communication, decisions, and what you need next.',
        icon: LifeBuoy,
      },
      {
        title: 'Keep co-parenting functional even when closeness is not',
        body: 'Reduce communication to the information required for safety, schedules, appointments, and the child’s care. A functional channel is a legitimate short-term goal.',
        icon: MessageCircle,
      },
      {
        title: 'Do not become the permanent translator for the care team',
        body: 'Where releases and permissions allow, ask providers to communicate directly with both caregivers. Carrying every explanation yourself can deepen the expert-and-assistant split.',
        icon: BriefcaseMedical,
      },
    ],
  },
  {
    id: 'carrying-alone',
    title: 'I’m carrying this mostly alone',
    subtitle: 'For single parents, grandparents, and caregivers without reliable partnership support.',
    icon: Users,
    tools: [
      {
        title: 'Build a bench, not a perfect village',
        body: 'Look for one person who can own one repeatable task: a pickup, meal, sibling activity, pharmacy run, or weekly check-in. Specific asks are easier to accept than “let me know if you need anything.”',
        icon: Users,
      },
      {
        title: 'Protect a minimum recovery window',
        body: 'Choose the smallest repeatable period that belongs to recovery rather than administration. Ten protected minutes used consistently can be more realistic than waiting for a free afternoon.',
        icon: Clock3,
      },
      {
        title: 'Separate essential care from ideal care',
        body: 'On overloaded days, identify what must happen for safety and health, what can move, and what can be dropped without guilt. Lowering the bar on purpose is different from giving up.',
        icon: CheckCircle2,
      },
      {
        title: 'Let providers know the plan has one adult carrying it',
        body: 'Tell the care team what is realistically possible at home. Recommendations that assume two available adults may need to be simplified or prioritized.',
        icon: BriefcaseMedical,
        bcbaNote: 'Ask the BCBA to prioritize what matters most when caregiver capacity is limited.',
      },
      {
        title: 'Use parent and local support before the tank is empty',
        body: 'Peer support, respite information, individual counseling, and practical local resources are valid parts of the care system—not rewards you earn after doing everything alone.',
        icon: LifeBuoy,
      },
    ],
  },
];

const STEPS = [
  { title: 'Pause', body: 'Create enough space to stop the conversation from escalating.', icon: Pause },
  { title: 'Name what is underneath', body: 'Identify the practical pressure or fear without turning it into blame.', icon: CircleHelp },
  { title: 'Listen before solving', body: 'Reflect what you heard before defending, correcting, or fixing.', icon: MessageCircle },
  { title: 'Decide what support comes next', body: 'Choose one small next step together or involve outside support.', icon: LifeBuoy },
];

export default function CouplesSupportPage() {
  const [selectedPath, setSelectedPath] = useState<PathId>('together');
  const [safetyOpen, setSafetyOpen] = useState(false);
  const pathPanelRef = useRef<HTMLDivElement>(null);
  const selected = PATHS.find((path) => path.id === selectedPath) ?? PATHS[0];

  useEffect(() => {
    pathPanelRef.current?.focus({ preventScroll: true });
  }, [selectedPath]);

  function choosePath(id: PathId) {
    setSelectedPath(id);
    window.setTimeout(() => {
      document.getElementById('path-guidance')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
  }

  function openSafety() {
    suppressSession();
    setSafetyOpen((open) => !open);
  }

  function leavePage() {
    window.location.replace('https://www.google.com');
  }

  return (
    <div className="relative space-y-9 pb-8 sm:space-y-11">
      <button
        type="button"
        onClick={leavePage}
        className="fixed right-3 top-3 z-50 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-[12px] font-semibold text-slate-800 shadow-lg transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:right-5 sm:top-5"
      >
        <DoorOpen className="h-4 w-4" aria-hidden />
        Leave this page
      </button>

      <nav aria-label="Breadcrumb" className="pr-32 text-[12px] text-brand-muted-500">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/support" className="hover:text-brand-navy-700">Home</Link></li>
          <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
          <li className="font-medium text-brand-muted-700">Partnership &amp; co-parenting</li>
        </ol>
      </nav>

      <header className="overflow-hidden rounded-[1.7rem] border border-surface-border bg-gradient-to-br from-white via-white to-orange-50/60 p-6 shadow-soft sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-primary">Common Ground · Parent support</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-brand-navy-800 sm:text-5xl">Partnership &amp; co-parenting</h1>
        <p className="mt-3 max-w-2xl text-[16px] font-semibold text-brand-navy-700">Support for the relationships that support your child.</p>
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-brand-muted-700">
          Caregiving pressure can change communication, closeness, sleep, money, and how adults divide responsibility. Start with the family arrangement that matches your life now.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4" aria-label="Scope note">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-navy-600" aria-hidden />
          <p className="text-[13px] leading-relaxed text-brand-muted-700">
            <strong className="text-brand-navy-800">Scope note:</strong> This page offers general relationship and co-parenting education. It does not provide legal advice, diagnose a relationship, replace licensed care, or make decisions about your child’s treatment plan.
          </p>
        </div>
      </section>

      <section aria-labelledby="path-heading">
        <h2 id="path-heading" className="text-2xl font-semibold text-brand-navy-800">Find the path that fits your situation</h2>
        <p className="mt-1 text-[13px] text-brand-muted-600">All families and caregiving arrangements are welcome here. Your selection is not saved.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {PATHS.map((path) => {
            const active = selectedPath === path.id;
            return (
              <button
                key={path.id}
                type="button"
                onClick={() => choosePath(path.id)}
                aria-pressed={active}
                className={cn(
                  'min-h-[156px] rounded-2xl border p-5 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  active ? 'border-primary bg-primary/5 shadow-md' : 'border-surface-border bg-white hover:-translate-y-0.5 hover:shadow-md',
                )}
              >
                <span className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl', active ? 'bg-primary text-white' : 'bg-slate-100 text-brand-navy-700')}>
                  <path.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-4 block text-[15px] font-semibold text-brand-navy-800">{path.title}</span>
                <span className="mt-1.5 block text-[12px] leading-relaxed text-brand-muted-600">{path.subtitle}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section id="path-guidance" className="scroll-mt-24" aria-labelledby="guidance-heading">
        <div ref={pathPanelRef} tabIndex={-1} className="rounded-[1.5rem] border border-surface-border bg-white p-5 shadow-soft outline-none sm:p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><selected.icon className="h-5 w-5" aria-hidden /></span>
            <div>
              <h2 id="guidance-heading" className="text-xl font-semibold text-brand-navy-800">{selected.title}</h2>
              <p className="mt-1 text-[13px] text-brand-muted-600">Choose one pressure point. You do not need to work through every card.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {selected.tools.map((tool) => (
              <article key={tool.title} className="rounded-2xl border border-surface-border bg-surface-subtle/30 p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-navy-700 shadow-sm"><tool.icon className="h-4.5 w-4.5" aria-hidden /></span>
                  <div>
                    <h3 className="text-[14px] font-semibold text-brand-navy-800">{tool.title}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-brand-muted-700">{tool.body}</p>
                    {tool.bcbaNote && <p className="mt-2 rounded-xl bg-blue-50 px-3 py-2 text-[11.5px] leading-relaxed text-blue-900">{tool.bcbaNote}</p>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="sequence-heading" className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-r from-blue-50/80 to-white p-5 sm:p-6">
        <div className="max-w-2xl">
          <h2 id="sequence-heading" className="text-xl font-semibold text-brand-navy-800">A four-step sequence for when a conversation is going badly</h2>
          <p className="mt-1 text-[13px] text-brand-muted-600">This is a way to slow the moment down, not a promise to solve a long-standing conflict in one conversation.</p>
        </div>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-blue-100 bg-white p-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy-700 text-[11px] font-bold text-white">{index + 1}</span>
                <step.icon className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <h3 className="mt-3 text-[14px] font-semibold text-brand-navy-800">{step.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-brand-muted-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-[1.5rem] border border-rose-200 bg-rose-50/70 p-5 sm:p-6" aria-labelledby="safety-heading">
        <button
          type="button"
          onClick={openSafety}
          aria-expanded={safetyOpen}
          className="flex min-h-12 w-full items-center gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-700 shadow-sm"><ShieldCheck className="h-5 w-5" aria-hidden /></span>
          <span className="min-w-0 flex-1">
            <span id="safety-heading" className="block text-[16px] font-semibold text-rose-950">Safety and confidential support resources</span>
            <span className="mt-0.5 block text-[12px] text-rose-900/75">Open factual support contacts. No self-assessment is required.</span>
          </span>
          <ChevronDown className={cn('h-5 w-5 text-rose-800 transition', safetyOpen && 'rotate-180')} aria-hidden />
        </button>

        {safetyOpen && (
          <div className="mt-4 border-t border-rose-200 pt-4">
            <p className="text-[13px] leading-relaxed text-rose-950">
              <strong>National Domestic Violence Hotline</strong> — free, confidential support available 24/7.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a href="tel:18007997233" onClick={suppressSession} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-rose-800">
                <Phone className="h-4 w-4" aria-hidden /> Call 1-800-799-7233
              </a>
              <a href="sms:88788&body=START" onClick={suppressSession} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-rose-900 hover:bg-rose-100">
                <MessageCircle className="h-4 w-4" aria-hidden /> Text START to 88788
              </a>
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-white/70 px-3 py-2.5 text-[11.5px] leading-relaxed text-rose-950">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Opening or using this section stops Common Ground activity recording for the rest of this tab session. It will not be saved to your Common Ground activity or shown on Home Base. Your browser or device may still keep its own history.
            </p>
          </div>
        )}
      </section>

      <section className="grid gap-3 md:grid-cols-2" aria-label="Outside support">
        <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-5">
          <h2 className="text-[16px] font-semibold text-brand-navy-800">You do not have to do this alone</h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-brand-muted-700">Connect with other caregivers who understand the load.</p>
          <Link href="/support/connect" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-primary/90">Parent Connection <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-5">
          <h2 className="text-[16px] font-semibold text-brand-navy-800">Need local relationship support?</h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-brand-muted-700">Browse counseling, support groups, and community resources. Confirm services and availability directly.</p>
          <Link href="/support/find" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary/30 bg-white px-4 py-2.5 text-[13px] font-semibold text-primary hover:bg-primary/5">Find local help <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <p className="text-[11.5px] leading-relaxed text-brand-muted-500">
        Common Ground provides caregiver education and support, not marriage therapy, legal advice, emergency intervention, or child-specific clinical guidance. Relationship content should be reviewed by an appropriately licensed professional before being treated as clinical guidance. Bring questions about your child’s ABA plan to your BCBA.
      </p>
    </div>
  );
}
