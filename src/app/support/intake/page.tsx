'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Answers = {
  hardest: string | null;
  support: string | null;
  confidence: string | null;
  easier: string | null;
  connected: string | null;
};

type QuestionKey = keyof Answers;

type Question = {
  key: QuestionKey;
  label: string;
  options: readonly string[];
};

type CarePlan = {
  summary: string;
  nextSteps: string[];
  resources: Array<{ label: string; href: string }>;
  tryFirst: string;
  encouragement: string;
  portalNote?: string;
};

const QUESTIONS: readonly Question[] = [
  {
    key: 'hardest',
    label: 'What feels hardest right now?',
    options: [
      'Understanding ABA',
      'Managing behavior at home',
      'Feeling overwhelmed',
      'Finding resources',
      'Financial or insurance stress',
      'Supporting siblings',
      'Connecting with other parents',
    ],
  },
  {
    key: 'support',
    label: 'What kind of support would help most this week?',
    options: [
      'A simple explanation',
      'A home strategy I can try',
      'Someone to talk to',
      'Local resources',
      'Help understanding costs',
      'Support for the whole family',
    ],
  },
  {
    key: 'confidence',
    label: 'How confident do you feel about what to do next?',
    options: [
      'I feel lost',
      'I have some ideas',
      'I know the next step, but need support',
      'I feel confident',
    ],
  },
  {
    key: 'easier',
    label: 'What would make this easier for your family?',
    options: [
      'Clear next steps',
      'Less confusing information',
      'Parent connection',
      'Practical tools for home',
      'Help finding services',
      'Encouragement',
    ],
  },
  {
    key: 'connected',
    label: 'Are you currently connected with Texas ABA Centers?',
    options: ['Yes', 'No', "I'm not sure"],
  },
] as const;

function buildCarePlan(answers: Answers): CarePlan {
  const resources: CarePlan['resources'] = [];
  const nextSteps: string[] = [];

  const addResource = (label: string, href: string) => {
    if (!resources.find((r) => r.label === label)) resources.push({ label, href });
  };
  const addStep = (step: string) => {
    if (!nextSteps.includes(step)) nextSteps.push(step);
  };

  if (answers.hardest === 'Understanding ABA') {
    addResource('What Is ABA?', '/support/what-is-aba');
    addResource('Guides & Strategies', '/support/resources');
    addStep('Read the quick What Is ABA? guide for a simple foundation.');
  }
  if (answers.hardest === 'Managing behavior at home') {
    addResource('Guides & Strategies', '/support/resources');
    addStep('Try one short home strategy from Guides & Strategies today.');
  }
  if (answers.hardest === 'Feeling overwhelmed') {
    addResource('Parent Support', '/support/mental-health');
    addResource('Connect With Parents', '/support/connect');
    addStep('Take one small pause for yourself, then reach out to one support connection.');
  }
  if (answers.hardest === 'Finding resources') {
    addResource('Find Local Help', '/support/find');
    addStep('Use Find Local Help to shortlist two nearby support options.');
  }
  if (answers.hardest === 'Financial or insurance stress') {
    addResource('Financial Help', '/support/financial');
    addStep('Review Financial Help and write down one question about costs to ask this week.');
  }
  if (answers.hardest === 'Supporting siblings') {
    addResource('Sibling Support', '/support/siblings');
    addStep('Choose one sibling support idea you can try this week.');
  }
  if (answers.hardest === 'Connecting with other parents') {
    addResource('Connect With Parents', '/support/connect');
    addStep('Join one parent connection space for encouragement and shared ideas.');
  }

  if (answers.support === 'A simple explanation') addResource('What Is ABA?', '/support/what-is-aba');
  if (answers.support === 'A home strategy I can try') addResource('Guides & Strategies', '/support/resources');
  if (answers.support === 'Someone to talk to') addResource('Connect With Parents', '/support/connect');
  if (answers.support === 'Local resources') addResource('Find Local Help', '/support/find');
  if (answers.support === 'Help understanding costs') addResource('Financial Help', '/support/financial');
  if (answers.support === 'Support for the whole family') addResource('Sibling Support', '/support/siblings');

  if (nextSteps.length < 3) {
    addStep('Pick one support page below and spend 10 minutes there.');
    addStep('Write down one next question your family wants answered this week.');
    addStep('Share your plan with someone you trust so you feel supported.');
  }

  const summary =
    answers.confidence === 'I feel lost'
      ? 'You are carrying a lot right now. We kept this plan extra simple so you can start with one step today.'
      : 'You already have helpful insight into what your family needs. These next steps can help you move forward with support.';

  const tryFirst =
    answers.confidence === 'I feel lost'
      ? 'Start with one step today: open one resource below and choose just one action to try.'
      : 'Pick one next step below, then set aside 10 minutes to begin today.';

  return {
    summary,
    nextSteps: nextSteps.slice(0, 3),
    resources,
    tryFirst,
    encouragement: 'You do not have to figure this out all at once. Start with one next step.',
    portalNote:
      answers.connected === 'Yes'
        ? 'Since you are already connected with Texas ABA Centers, you can also use your client portal for updates and support.'
        : undefined,
  };
}

export default function IntakePage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ hardest: null, support: null, confidence: null, easier: null, connected: null });
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState(false);

  const done = showPlan || step >= QUESTIONS.length;
  const plan = useMemo(() => (done ? buildCarePlan(answers) : null), [done, answers]);

  const current = QUESTIONS[step];
  const key = current?.key;
  const selectedValue = key ? answers[key] : undefined;

  const selectOption = (value: string) => {
    if (!current) return;

    setAnswers((prev) => ({
      ...prev,
      [current.key]: value,
    }));

    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      setShowPlan(true);
    }
  };

  const sendEmail = async () => {
    setEmailStatus('Sending...');
    const res = await fetch('/api/email-care-plan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, answers, carePlan: plan }),
    });
    const data = await res.json();
    if (data.ok) setEmailStatus('Your care plan was sent.');
    else if (data.reason === 'EMAIL_NOT_CONFIGURED') setEmailStatus('Email delivery is not connected yet, but your care plan is ready below. You can copy or screenshot it for now.');
    else setEmailStatus('We couldn’t send the email right now, but your care plan is still available on this page.');
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-surface-border bg-white p-6 shadow-card sm:p-8">
        {!done ? (
          <>
            <h1 className="text-3xl font-bold text-brand-muted-900">Let&apos;s find your next best step</h1>
            <p className="mt-2 text-brand-muted-700">Answer a few quick questions and we’ll build a simple care plan with support options for your family.</p>
            <p className="mt-2 text-sm text-brand-muted-500">This is not a clinical assessment. It is a starting point to help you find support, resources, and next steps.</p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-primary">Question {step + 1} of {QUESTIONS.length}</p>
            <h2 className="mt-2 text-xl font-semibold text-brand-muted-900">{current?.label}</h2>

            <div className="mt-5 grid gap-3">
              {current?.options.map((opt) => (
                <button key={opt} type="button" aria-label={opt} onClick={() => selectOption(opt)} className="flex w-full items-center justify-between rounded-2xl border-2 border-surface-border px-4 py-4 text-left font-semibold text-brand-muted-800 hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <span>{opt}</span>
                  <Check className="h-4 w-4 text-primary opacity-60" />
                </button>
              ))}
            </div>

            <div className="mt-6">
              {step > 0 && (
                <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted-700 hover:text-brand-muted-900">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-brand-muted-900">Your Family Care Plan</h1>
            <p className="mt-2 text-brand-muted-700">Based on your answers, here are a few helpful starting points.</p>

            <section className="mt-6 rounded-2xl bg-surface-subtle p-4">
              <h2 className="font-semibold">Start here</h2>
              <p className="mt-2 text-sm">{plan?.summary}</p>
              <ul className="mt-3 list-disc pl-5 text-sm">
                {plan?.nextSteps.map((stepItem) => <li key={stepItem}>{stepItem}</li>)}
              </ul>
            </section>

            <section className="mt-4 rounded-2xl border border-surface-border p-4">
              <h2 className="font-semibold">Helpful resources for you</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {plan?.resources.map((resource) => (
                  <li key={resource.label}><Link className="text-primary underline" href={resource.href}>{resource.label}</Link></li>
                ))}
                {answers.connected === 'Yes' && <li><Link className="text-primary underline" href="/client">Client Portal</Link></li>}
              </ul>
            </section>

            <section className="mt-4 rounded-2xl border border-surface-border p-4">
              <h2 className="font-semibold">Try this first</h2>
              <p className="mt-2 text-sm">{plan?.tryFirst}</p>
            </section>

            <section className="mt-4 rounded-2xl border border-surface-border p-4">
              <h2 className="font-semibold">Encouragement</h2>
              <p className="mt-2 text-sm">{plan?.encouragement}</p>
              {plan?.portalNote && (
                <p className="mt-2 text-sm"><Link href="/client" className="font-semibold text-accent underline">Go to Client Portal</Link> — {plan.portalNote}</p>
              )}
            </section>

            <section className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <h2 className="font-semibold">Want a copy of this plan?</h2>
              <p className="mt-1 text-sm">Enter your email and we’ll send this care plan so you can come back to it later.</p>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" aria-label="Email address" placeholder="Email address" className="mt-3 w-full rounded-xl border border-surface-border px-3 py-2" />
              <button type="button" onClick={sendEmail} disabled={!email} className={cn('mt-3 rounded-xl px-4 py-2 font-semibold text-white', email ? 'bg-primary' : 'bg-stone-300')}>
                Email My Care Plan
              </button>
              {emailStatus && <p className="mt-2 text-sm text-brand-muted-700">{emailStatus}</p>}
            </section>

            <button type="button" onClick={() => { setStep(0); setShowPlan(false); setAnswers({ hardest: null, support: null, confidence: null, easier: null, connected: null }); setEmail(''); setEmailStatus(null); }} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-muted-700 hover:text-brand-muted-900">
              <RefreshCw className="h-4 w-4" /> Restart
            </button>
          </>
        )}
      </div>
    </main>
  );
}
