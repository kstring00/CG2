'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronRight, RotateCcw, ShieldAlert } from 'lucide-react';
import { AT_HOME_STRATEGIES_LABEL } from '@/lib/supportNavLabels';
import { cn } from '@/lib/utils';

type FunctionKey = 'escape' | 'attention' | 'access' | 'sensory';
type Answer = FunctionKey | 'alone-never' | 'alone-sometimes' | 'alone-often' | 'skip';
type Screen = 'gate' | 'intro' | 1 | 2 | 3 | 4 | 'result';
type ResultType = 'single' | 'mixed' | 'unclear' | 'not-enough';

type Question = { title: string; options: { label: string; value: Answer }[] };

const QUESTIONS: Record<1 | 2 | 3 | 4, Question> = {
  1: { title: 'When does it happen most?', options: [
    { label: 'When I ask them to do something, or stop something fun', value: 'escape' },
    { label: "When I'm busy — on the phone, with a sibling, in another room", value: 'attention' },
    { label: "When they want something specific they can't have right now", value: 'access' },
    { label: "It doesn't seem connected to what's going on around them", value: 'sensory' },
  ] },
  2: { title: 'What ends it fastest?', options: [
    { label: 'Dropping the request, or letting them skip it', value: 'escape' },
    { label: "Me responding to them — even when I'm correcting them", value: 'attention' },
    { label: 'Giving them the thing they wanted', value: 'access' },
    { label: 'Nothing reliably — it runs its course', value: 'sensory' },
  ] },
  3: { title: "Does it happen when they're alone?", options: [
    { label: "Almost never — someone's always around", value: 'alone-never' },
    { label: 'Sometimes', value: 'alone-sometimes' },
    { label: 'Often, even with nobody in the room', value: 'alone-often' },
  ] },
  4: { title: 'What usually happens right after?', options: [
    { label: 'The task goes away, or gets put off', value: 'escape' },
    { label: 'I talk to them, react, or correct them', value: 'attention' },
    { label: 'They end up getting the item or activity', value: 'access' },
    { label: 'Nothing really changes — they keep going', value: 'sensory' },
  ] },
};

const LABEL: Record<FunctionKey, string> = {
  escape: 'getting out of something', attention: 'getting you', access: 'getting something', sensory: 'how something feels',
};

const DESCRIPTION: Record<FunctionKey, string> = {
  escape: "It starts when you ask, when it's time to stop something fun, when the task is hard, when there's a transition. It stops the second the demand goes away.",
  attention: "It happens most when you're busy, on the phone, with a sibling, in another room. It stops when you engage — even if you're engaging to correct.",
  access: 'It shows up around a specific thing. The iPad. A snack. A toy a sibling has. It ends the moment they get it.',
  sensory: "It happens whether or not anyone's around. It doesn't seem tied to what's going on. It might increase when they're bored, tired, overstimulated, or under-stimulated.",
};

const STRATEGIES: Record<FunctionKey, string[]> = {
  escape: ['Give Two Good Choices', 'Use a Timer for Transitions', 'Make the Next Step Smaller'],
  attention: ['Catch Them Being Good', 'Tell Them What To Do, Not Just What To Stop', 'Practice When Calm'],
  access: ['Give Two Good Choices', 'Use a Timer for Transitions', 'First / Then'],
  sensory: ['Use Visuals, Not Just Words', 'Reduce the Demand Before It Becomes a Battle', 'Practice When Calm'],
};

function isFunctionKey(value: Answer | undefined): value is FunctionKey {
  return value === 'escape' || value === 'attention' || value === 'access' || value === 'sensory';
}

function calculate(answers: Partial<Record<1 | 2 | 3 | 4, Answer>>) {
  const scores: Record<FunctionKey, number> = { escape: 0, attention: 0, access: 0, sensory: 0 };
  const answered = ([1, 2, 3, 4] as const).filter((n) => answers[n] && answers[n] !== 'skip').length;
  if (isFunctionKey(answers[1])) scores[answers[1]] += 2;
  if (isFunctionKey(answers[2])) scores[answers[2]] += 3;
  if (answers[3] === 'alone-never') { scores.escape += 1; scores.attention += 1; scores.access += 1; }
  if (answers[3] === 'alone-sometimes') scores.sensory += 1;
  if (answers[3] === 'alone-often') scores.sensory += 3;
  if (isFunctionKey(answers[4])) scores[answers[4]] += 2;

  const ranked = (Object.entries(scores) as [FunctionKey, number][]).sort((a, b) => b[1] - a[1]);
  const [top, runnerUp] = ranked;
  const spread = Math.max(...ranked.map(([, v]) => v)) - Math.min(...ranked.map(([, v]) => v));
  let type: ResultType;
  if (answered <= 1) type = 'not-enough';
  else if (spread <= 2) type = 'unclear';
  else if (top[1] - runnerUp[1] >= 3) type = 'single';
  else type = 'mixed';
  return { type, top: top[0], runnerUp: runnerUp[0] };
}

export default function FunctionGuidePage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('gate');
  const [answers, setAnswers] = useState<Partial<Record<1 | 2 | 3 | 4, Answer>>>({});
  const result = useMemo(() => calculate(answers), [answers]);

  const unsafe = () => { setAnswers({}); router.replace('/support/at-home/unsafe'); };
  const restart = () => { setAnswers({}); setScreen('gate'); };
  const back = () => {
    if (screen === 'intro') setScreen('gate');
    else if (screen === 1) setScreen('intro');
    else if (typeof screen === 'number') setScreen((screen - 1) as 1 | 2 | 3);
    else if (screen === 'result') setScreen(4);
  };
  const choose = (number: 1 | 2 | 3 | 4, answer: Answer) => {
    setAnswers((old) => ({ ...old, [number]: answer }));
    setScreen(number === 4 ? 'result' : ((number + 1) as 2 | 3 | 4));
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500"><ol className="flex flex-wrap items-center gap-1.5">
        <li><Link href="/support">Home</Link></li><li aria-hidden><ChevronRight className="h-3 w-3" /></li>
        <li><Link href="/support/at-home">{AT_HOME_STRATEGIES_LABEL}</Link></li><li aria-hidden><ChevronRight className="h-3 w-3" /></li>
        <li className="font-medium text-brand-muted-700">4-question guide</li>
      </ol></nav>

      <section className="mt-5 rounded-3xl border border-surface-border bg-white p-5 shadow-soft sm:p-8">
        {screen === 'gate' && <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-800"><ShieldAlert className="h-4 w-4" /> Before we start</span>
          <h1 className="mt-4 text-3xl font-bold text-brand-navy-800">Before we start.</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-brand-muted-800">Is this behavior hurting your child, hurting someone else, or putting them in danger — like running into a street?</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <GateButton onClick={unsafe}>Yes</GateButton>
            <GateButton primary onClick={() => setScreen('intro')}>No</GateButton>
            <GateButton onClick={unsafe}>I'm not sure</GateButton>
          </div>
        </div>}

        {screen === 'intro' && <div>
          <h1 className="text-3xl font-bold text-brand-navy-800">Think of one behavior.</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-brand-muted-800">Not everything at once — just the one that's been hardest lately. Four quick questions.</p>
          <p className="mt-3 text-[16px] leading-relaxed text-brand-muted-800">This won't tell you what's causing it. It'll give you a good guess, and point you to the strategies most likely to fit.</p>
          <Actions onBack={back}><button type="button" onClick={() => setScreen(1)} className="rounded-2xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white">Start <ArrowRight className="ml-1 inline h-4 w-4" /></button></Actions>
        </div>}

        {typeof screen === 'number' && <QuestionScreen number={screen} selected={answers[screen]} onBack={back} onChoose={(a) => choose(screen, a)} />}
        {screen === 'result' && <div aria-live="polite"><Result result={result} /><button type="button" onClick={restart} className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-brand-plum-300 px-4 py-2.5 text-[13px] font-semibold text-brand-plum-800"><RotateCcw className="h-4 w-4" /> Restart</button></div>}
      </section>
      <p className="mt-4 text-center text-[11px] text-brand-muted-500">Saved nowhere. Read privately.</p>
    </main>
  );
}

function GateButton({ children, onClick, primary = false }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return <button type="button" onClick={onClick} className={cn('min-h-12 rounded-2xl border px-4 py-3 text-[14px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2', primary ? 'border-primary bg-primary text-white focus-visible:ring-primary/50' : 'border-rose-300 bg-rose-50 text-rose-900 focus-visible:ring-rose-500')}>{children}</button>;
}

function Actions({ onBack, children }: { onBack: () => void; children: React.ReactNode }) {
  return <div className="mt-6 flex items-center justify-between gap-3"><button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-2xl border border-surface-border px-4 py-2.5 text-[13px] font-semibold"><ArrowLeft className="h-4 w-4" /> Back</button>{children}</div>;
}

function QuestionScreen({ number, selected, onBack, onChoose }: { number: 1 | 2 | 3 | 4; selected?: Answer; onBack: () => void; onChoose: (answer: Answer) => void }) {
  const q = QUESTIONS[number];
  return <div>
    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-muted-500">{number} of 4</p>
    <h1 className="mt-2 text-3xl font-bold text-brand-navy-800">{q.title}</h1>
    <div className="mt-6 space-y-3" role="radiogroup" aria-label={q.title}>{q.options.map((o) => <button key={o.value} type="button" role="radio" aria-checked={selected === o.value} onClick={() => onChoose(o.value)} className={cn('min-h-12 w-full rounded-2xl border px-4 py-3 text-left text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2', selected === o.value ? 'border-brand-plum-400 bg-brand-plum-50' : 'border-surface-border bg-white hover:bg-brand-plum-50/40')}>{o.label}</button>)}</div>
    <Actions onBack={onBack}><button type="button" onClick={() => onChoose('skip')} className="rounded-2xl px-4 py-2.5 text-[13px] font-semibold text-brand-muted-600 underline-offset-4 hover:underline">Skip</button></Actions>
  </div>;
}

function GuessLine() {
  return <div className="mt-5 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/50 p-4 text-[14px] leading-relaxed text-brand-muted-800"><strong>This is a guess, not an assessment.</strong> Behavior often does more than one job, and it can change over time. Your BCBA can run a real functional assessment, which is far more accurate than four questions.</div>;
}

function Result({ result }: { result: ReturnType<typeof calculate> }) {
  if (result.type === 'unclear' || result.type === 'not-enough') return <div>
    <h1 className="text-3xl font-bold text-brand-navy-800">Not enough to make a guess yet — and that's actually useful information.</h1>
    <p className="mt-4 text-[15px] text-brand-muted-800">Try this for three days: each time it happens, write down three things.</p>
    <ul className="mt-3 space-y-2 text-[14px] text-brand-muted-800"><li>• What happened right before</li><li>• What your child did, and how long it lasted</li><li>• What happened right after</li></ul>
    <p className="mt-4 text-[15px] text-brand-muted-800">Three lines. Patterns show up faster than you'd expect, and this is the single most useful thing you can hand your BCBA.</p>
    <GuessLine /><Links tracking />
  </div>;

  if (result.type === 'mixed') return <div>
    <h1 className="text-3xl font-bold text-brand-navy-800">This looks like it might be doing two jobs — {LABEL[result.top]} and {LABEL[result.runnerUp]}.</h1>
    <p className="mt-4 text-[15px] text-brand-muted-800">That's common, and it's not a sign you answered wrong. The same behavior can serve different purposes at different times of day or with different people.</p>
    <p className="mt-4 text-[15px] text-brand-muted-800"><strong>Start with the {LABEL[result.top]} strategies</strong> — that scored highest. If they don't shift anything after a week, the {LABEL[result.runnerUp]} set is the next place to look.</p>
    <GuessLine /><StrategyCards functionKey={result.top} />
    <details className="mt-4 rounded-2xl border border-surface-border p-4"><summary className="cursor-pointer font-semibold">Then look at {LABEL[result.runnerUp]}</summary><StrategyCards functionKey={result.runnerUp} /></details><Links />
  </div>;

  const sensory = result.top === 'sensory';
  return <div>
    <h1 className="text-3xl font-bold text-brand-navy-800">This looks like it might be about {LABEL[result.top]}.</h1>
    {sensory ? <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-[15px] font-semibold text-amber-950">This is the one where a page can help least. Behavior that's about how something feels usually needs changes to the environment or a sensory alternative chosen for your specific child — and that's a conversation with your BCBA or an OT, not a strategy you pick from a list.</p> : <p className="mt-4 text-[15px] text-brand-muted-800">{DESCRIPTION[result.top]}</p>}
    <GuessLine /><StrategyCards functionKey={result.top} heading={sensory ? 'Partial supports' : 'Strategies most likely to fit'} /><Links />
  </div>;
}

function StrategyCards({ functionKey, heading }: { functionKey: FunctionKey; heading?: string }) {
  return <section className="mt-5">{heading && <h2 className="text-lg font-bold text-brand-navy-800">{heading}</h2>}<div className="mt-3 grid gap-3 sm:grid-cols-3">{STRATEGIES[functionKey].map((title) => <Link key={title} href="/support/at-home" className="rounded-2xl border border-surface-border p-4 text-[13px] font-semibold text-brand-navy-800 shadow-soft">{title} <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>)}</div></section>;
}

function Links({ tracking = false }: { tracking?: boolean }) {
  return <div className="mt-6 flex flex-wrap gap-3"><Link href="/support/at-home" className="rounded-2xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white">See all strategies</Link><Link href="/support/at-home/why" className="rounded-2xl border border-brand-plum-300 px-4 py-2.5 text-[13px] font-semibold text-brand-plum-800">{tracking ? 'Read the full primer' : 'Why tracking helps'}</Link>{/* TODO: Replace /client with confirmed direct care-team route. */}<Link href="/client" className="rounded-2xl border border-surface-border px-4 py-2.5 text-[13px] font-semibold text-brand-navy-800">Talk to my care team</Link></div>;
}
