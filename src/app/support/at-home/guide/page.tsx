'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ClipboardList,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { AT_HOME_STRATEGIES_LABEL } from '@/lib/supportNavLabels';
import { cn } from '@/lib/utils';

type FunctionKey = 'escape' | 'attention' | 'access' | 'sensory';
type Answer = FunctionKey | 'alone-never' | 'alone-sometimes' | 'alone-often' | 'skip';
type Screen = 'gate' | 'intro' | 1 | 2 | 3 | 4 | 'result';

type Question = {
  title: string;
  options: { label: string; value: Answer }[];
};

const QUESTIONS: Record<1 | 2 | 3 | 4, Question> = {
  1: {
    title: 'When does it happen most?',
    options: [
      { label: 'When I ask them to do something, or stop something fun', value: 'escape' },
      { label: "When I'm busy — on the phone, with a sibling, in another room", value: 'attention' },
      { label: "When they want something specific they can't have right now", value: 'access' },
      { label: "It doesn't seem connected to what's going on around them", value: 'sensory' },
    ],
  },
  2: {
    title: 'What ends it fastest?',
    options: [
      { label: 'Dropping the request, or letting them skip it', value: 'escape' },
      { label: "Me responding to them — even when I'm correcting them", value: 'attention' },
      { label: 'Giving them the thing they wanted', value: 'access' },
      { label: 'Nothing reliably — it runs its course', value: 'sensory' },
    ],
  },
  3: {
    title: "Does it happen when they're alone?",
    options: [
      { label: "Almost never — someone's always around", value: 'alone-never' },
      { label: 'Sometimes', value: 'alone-sometimes' },
      { label: 'Often, even with nobody in the room', value: 'alone-often' },
    ],
  },
  4: {
    title: 'What usually happens right after?',
    options: [
      { label: 'The task goes away, or gets put off', value: 'escape' },
      { label: 'I talk to them, react, or correct them', value: 'attention' },
      { label: 'They end up getting the item or activity', value: 'access' },
      { label: 'Nothing really changes — they keep going', value: 'sensory' },
    ],
  },
};

const FUNCTION_LABEL: Record<FunctionKey, string> = {
  escape: 'getting out of something',
  attention: 'getting you',
  access: 'getting something',
  sensory: 'how something feels',
};

const FUNCTION_DESCRIPTION: Record<FunctionKey, string> = {
  escape:
    "It starts when you ask, when it's time to stop something fun, when the task is hard, or when there's a transition. It often stops when the demand goes away.",
  attention:
    "It happens most when you're busy, on the phone, with a sibling, or in another room. It often stops when you engage — even if you're engaging to correct.",
  access:
    'It shows up around a specific thing — an iPad, snack, toy, or activity — and often ends when they get it.',
  sensory:
    "It happens whether or not anyone's around and may increase when they're bored, tired, overstimulated, or under-stimulated.",
};

const STRATEGIES: Record<FunctionKey, { title: string; href: string }[]> = {
  escape: [
    { title: 'Give Two Good Choices', href: '/support/at-home#two-good-choices' },
    { title: 'Make the Next Step Smaller', href: '/support/at-home#smaller-step' },
    { title: 'First / Then', href: '/support/at-home#first-then' },
  ],
  attention: [
    { title: 'Catch Them Being Good', href: '/support/at-home#catch-them-being-good' },
    { title: 'Tell Them What To Do, Not Just What To Stop', href: '/support/at-home#replacement-behavior' },
    { title: 'Practice When Calm', href: '/support/at-home#practice-when-calm' },
  ],
  access: [
    { title: 'Give Two Good Choices', href: '/support/at-home#two-good-choices' },
    { title: 'Use a Timer for Transitions', href: '/support/at-home#timer-transitions' },
    { title: 'First / Then', href: '/support/at-home#first-then' },
  ],
  sensory: [
    { title: 'Use Visuals, Not Just Words', href: '/support/at-home#visuals-not-words' },
    { title: 'Reduce the Demand Before It Becomes a Battle', href: '/support/at-home#reduce-demand' },
    { title: 'Practice When Calm', href: '/support/at-home#practice-when-calm' },
  ],
};

function scoreAnswers(answers: Partial<Record<1 | 2 | 3 | 4, Answer>>) {
  const scores: Record<FunctionKey, number> = { escape: 0, attention: 0, access: 0, sensory: 0 };
  const answered = ([1, 2, 3, 4] as const).filter((number) => {
    const answer = answers[number];
    return answer && answer !== 'skip';
  }).length;

  const q1 = answers[1];
  if (q1 && q1 !== 'skip' && !q1.startsWith('alone-')) scores[q1] += 2;

  const q2 = answers[2];
  if (q2 && q2 !== 'skip' && !q2.startsWith('alone-')) scores[q2] += 3;

  const q3 = answers[3];
  if (q3 === 'alone-never') {
    scores.escape += 1;
    scores.attention += 1;
    scores.access += 1;
  }
  if (q3 === 'alone-sometimes') scores.sensory += 1;
  if (q3 === 'alone-often') scores.sensory += 3;

  const q4 = answers[4];
  if (q4 && q4 !== 'skip' && !q4.startsWith('alone-')) scores[q4] += 2;

  const ranked = (Object.entries(scores) as [FunctionKey, number][]).sort((a, b) => b[1] - a[1]);
  const [top, runnerUp] = ranked;
  const values = ranked.map(([, value]) => value);
  const allWithinTwo = Math.max(...values) - Math.min(...values) <= 2;

  if (answered <= 1) return { type: 'not-enough' as const, answered, top: top[0], runnerUp: runnerUp[0] };
  if (allWithinTwo) return { type: 'unclear' as const, answered, top: top[0], runnerUp: runnerUp[0] };
  if (top[1] - runnerUp[1] >= 3) return { type: 'single' as const, answered, top: top[0], runnerUp: runnerUp[0] };
  return { type: 'mixed' as const, answered, top: top[0], runnerUp: runnerUp[0] };
}

export default function FunctionGuidePage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('gate');
  const [answers, setAnswers] = useState<Partial<Record<1 | 2 | 3 | 4, Answer>>>({});
  const result = useMemo(() => scoreAnswers(answers), [answers]);

  function routeUnsafe() {
    setAnswers({});
    router.replace('/support/at-home/unsafe');
  }

  function answerQuestion(question: 1 | 2 | 3 | 4, answer: Answer) {
    setAnswers((current) => ({ ...current, [question]: answer }));
    setScreen(question === 4 ? 'result' : ((question + 1) as 2 | 3 | 4));
  }

  function goBack() {
    if (screen === 'intro') setScreen('gate');
    else if (screen === 1) setScreen('intro');
    else if (typeof screen === 'number' && screen > 1) setScreen((screen - 1) as 1 | 2 | 3);
    else if (screen === 'result') setScreen(4);
  }

  function restart() {
    setAnswers({});
    setScreen('gate');
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/support" className="hover:text-brand-navy-700">Home</Link></li>
          <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
          <li><Link href="/support/at-home" className="hover:text-brand-navy-700">{AT_HOME_STRATEGIES_LABEL}</Link></li>
          <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
          <li className="font-medium text-brand-muted-700">4-question guide</li>
        </ol>
      </nav>

      <section className="mt-5 rounded-3xl border border-surface-border bg-white p-5 shadow-soft sm:p-8">
        {screen === 'gate' && (
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-800">
              <ShieldAlert className="h-4 w-4" aria-hidden /> Before we start
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-navy-800">Before we start.</h1>
            <p className="mt-3 text-[16px] leading-relaxed text-brand-muted-800">
              Is this behavior hurting your child, hurting someone else, or putting them in danger — like running into a street?
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button type="button" onClick={routeUnsafe} className="min-h-12 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-[14px] font-semibold text-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">Yes</button>
              <button type="button" onClick={() => setScreen('intro')} className="min-h-12 rounded-2xl bg-primary px-4 py-3 text-[14px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2">No</button>
              <button type="button" onClick={routeUnsafe} className="min-h-12 rounded-2xl border border-rose-300 bg-white px-4 py-3 text-[14px] font-semibold text-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2">I'm not sure</button>
            </div>
          </div>
        )}

        {screen === 'intro' && (
          <div>
            <h1 className="text-3xl font-bold leading-tight text-brand-navy-800">Think of one behavior.</h1>
            <p className="mt-3 text-[16px] leading-relaxed text-brand-muted-800">Not everything at once — just the one that's been hardest lately. Four quick questions.</p>
            <p className="mt-3 text-[16px] leading-relaxed text-brand-muted-800">This won't tell you what's causing it. It'll give you a good guess, and point you to the strategies most likely to fit.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={goBack} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-surface-border px-4 py-2.5 text-[13px] font-semibold text-brand-muted-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"><ArrowLeft className="h-4 w-4" aria-hidden /> Back</button>
              <button type="button" onClick={() => setScreen(1)} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2">Start <ArrowRight className="h-4 w-4" aria-hidden /></button>
            </div>
          </div>
        )}

        {typeof screen === 'number' && (
          <QuestionScreen
            number={screen}
            selected={answers[screen]}
            onBack={goBack}
            onAnswer={(answer) => answerQuestion(screen, answer)}
          />
        )}

        {screen === 'result' && (
          <div aria-live="polite">
            <ResultView result={result} />
            <button type="button" onClick={restart} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-plum-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">
              <RotateCcw className="h-4 w-4" aria-hidden /> Restart
            </button>
          </div>
        )}
      </section>

      <p className="mt-4 text-center text-[11px] text-brand-muted-500">Saved nowhere. Read privately.</p>
    </main>
  );
}

function QuestionScreen({
  number,
  selected,
  onBack,
  onAnswer,
}: {
  number: 1 | 2 | 3 | 4;
  selected?: Answer;
  onBack: () => void;
  onAnswer: (answer: Answer) => void;
}) {
  const question = QUESTIONS[number];
  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-muted-500">{number} of 4</p>
      <h1 className="mt-2 text-2xl font-bold leading-tight text-brand-navy-800 sm:text-3xl">{question.title}</h1>
      <div className="mt-6 space-y-3" role="radiogroup" aria-label={question.title}>
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected === option.value}
            onClick={() => onAnswer(option.value)}
            className={cn(
              'flex min-h-12 w-full items-center rounded-2xl border px-4 py-3 text-left text-[14px] font-medium leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
              selected === option.value
                ? 'border-brand-plum-400 bg-brand-plum-50 text-brand-plum-950'
                : 'border-surface-border bg-white text-brand-muted-800 hover:border-brand-plum-200 hover:bg-brand-plum-50/40',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-surface-border px-4 py-2.5 text-[13px] font-semibold text-brand-muted-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"><ArrowLeft className="h-4 w-4" aria-hidden /> Back</button>
        <button type="button" onClick={() => onAnswer('skip')} className="min-h-11 rounded-2xl px-4 py-2.5 text-[13px] font-semibold text-brand-muted-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2">Skip</button>
      </div>
    </div>
  );
}

function ResultView({ result }: { result: ReturnType<typeof scoreAnswers> }) {
  if (result.type === 'not-enough' || result.type === 'unclear') {
    return (
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1 text-[11px] font-semibold text-brand-plum-800"><ClipboardList className="h-4 w-4" aria-hidden /> {result.type === 'unclear' ? 'Unclear' : 'Not enough info'}</span>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-navy-800">Not enough to make a guess yet — and that's actually useful information.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-brand-muted-800">Try this for three days: each time it happens, write down three things.</p>
        <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-brand-muted-800">
          <li>• What happened right before</li>
          <li>• What your child did, and how long it lasted</li>
          <li>• What happened right after</li>
        </ul>
        <p className="mt-4 text-[15px] leading-relaxed text-brand-muted-800">Three lines. Patterns show up faster than you'd expect, and this is the single most useful thing you can hand your BCBA.</p>
        <GuessLine />
        <ResultLinks includePrimer />
      </div>
    );
  }

  if (result.type === 'mixed') {
    return (
      <div>
        <h1 className="text-3xl font-bold leading-tight text-brand-navy-800">This looks like it might be doing two jobs — {FUNCTION_LABEL[result.top]} and {FUNCTION_LABEL[result.runnerUp]}.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-brand-muted-800">That's common, and it's not a sign you answered wrong. The same behavior can serve different purposes at different times of day or with different people.</p>
        <p className="mt-4 text-[15px] leading-relaxed text-brand-muted-800"><strong>Start with the {FUNCTION_LABEL[result.top]} strategies</strong> — that scored highest. If they don't shift anything after a week, the {FUNCTION_LABEL[result.runnerUp]} set is the next place to look.</p>
        <GuessLine />
        <StrategyList functionKey={result.top} heading="Start here" />
        <details className="mt-4 rounded-2xl border border-surface-border bg-surface-subtle px-4 py-3">
          <summary className="cursor-pointer text-[14px] font-semibold text-brand-navy-800">Then look at {FUNCTION_LABEL[result.runnerUp]}</summary>
          <StrategyList functionKey={result.runnerUp} heading="" />
        </details>
        <ResultLinks />
      </div>
    );
  }

  const sensory = result.top === 'sensory';
  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight text-brand-navy-800">This looks like it might be about {FUNCTION_LABEL[result.top]}.</h1>
      {sensory ? (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-[15px] font-semibold leading-relaxed text-amber-950">
          This is the one where a page can help least. Behavior that's about how something feels usually needs changes to the environment or a sensory alternative chosen for your specific child — and that's a conversation with your BCBA or an OT, not a strategy you pick from a list.
        </p>
      ) : (
        <p className="mt-4 text-[15px] leading-relaxed text-brand-muted-800">{FUNCTION_DESCRIPTION[result.top]}</p>
      )}
      <GuessLine />
      <StrategyList functionKey={result.top} heading={sensory ? 'Partial supports' : 'Strategies most likely to fit'} />
      <ResultLinks />
    </div>
  );
}

function GuessLine() {
  return (
    <div className="mt-5 rounded-2xl border border-brand-plum-200 bg-brand-plum-50/50 p-4 text-[14px] leading-relaxed text-brand-muted-800">
      <strong>This is a guess, not an assessment.</strong> Behavior often does more than one job, and it can change over time. Your BCBA can run a real functional assessment, which is far more accurate than four questions.
    </div>
  );
}

function StrategyList({ functionKey, heading }: { functionKey: FunctionKey; heading: string }) {
  return (
    <section className="mt-5">
      {heading && <h2 className="text-lg font-bold text-brand-navy-800">{heading}</h2>}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {STRATEGIES[functionKey].map((strategy) => (
          <Link key={strategy.title} href={strategy.href} className="rounded-2xl border border-surface-border bg-white p-4 text-[13px] font-semibold leading-relaxed text-brand-navy-800 shadow-soft transition hover:border-brand-plum-200 hover:bg-brand-plum-50/40">
            {strategy.title} <ArrowRight className="ml-1 inline h-3.5 w-3.5" aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  );
}

function ResultLinks({ includePrimer = false }: { includePrimer?: boolean }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link href="/support/at-home" className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white shadow-soft">See all strategies <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      {includePrimer ? (
        <Link href="/support/at-home/why" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-plum-800">Read the full primer</Link>
      ) : (
        <Link href="/support/at-home/why" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-brand-plum-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-plum-800">Why tracking helps</Link>
      )}
      {/* TODO: Replace /client with the confirmed direct care-team contact route when available. */}
      <Link href="/client" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-surface-border bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-navy-800">Talk to my care team</Link>
    </div>
  );
}
