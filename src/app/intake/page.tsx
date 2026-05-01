'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import IntakeFlow, { type IntakeAnswers } from '@/components/IntakeFlow';
import { useParentContext } from '@/lib/useParentContext';

export default function IntakePreviewPage() {
  const { context, clearContext, ready } = useParentContext();
  const [submission, setSubmission] = useState<IntakeAnswers | null>(null);
  const [version, setVersion] = useState(0);

  function handleComplete(answers: IntakeAnswers) {
    setSubmission(answers);
  }

  function reset() {
    clearContext();
    setSubmission(null);
    setVersion((v) => v + 1);
  }

  return (
    <main className="min-h-screen px-6 py-12 sm:px-8 sm:py-16" style={{ backgroundColor: '#f4efe8' }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 transition hover:text-stone-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Home
          </Link>
          <span className="rounded-full bg-stone-900/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-stone-500">
            Dev preview · /intake
          </span>
        </div>

        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          Intake flow preview
        </h1>
        <p className="mt-2 max-w-md text-sm text-stone-500">
          Standalone harness for reviewing the IntakeFlow component before integration.
        </p>

        <div className="mt-8">
          <IntakeFlow key={version} onComplete={handleComplete} />
        </div>

        <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Persisted parent context
            </p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:border-primary hover:text-primary"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Clear &amp; restart
            </button>
          </div>

          <pre className="mt-4 overflow-x-auto rounded-2xl bg-stone-50 p-4 text-xs leading-relaxed text-stone-700">
{ready ? JSON.stringify(context, null, 2) : 'loading…'}
          </pre>

          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-stone-400">
            Last onComplete payload
          </p>
          <pre className="mt-2 overflow-x-auto rounded-2xl bg-stone-50 p-4 text-xs leading-relaxed text-stone-700">
{submission ? JSON.stringify(submission, null, 2) : '— not submitted yet —'}
          </pre>
        </section>
      </div>
    </main>
  );
}
