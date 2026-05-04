'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RefreshCcw } from 'lucide-react';
import CategorySliders from '@/components/groundLevel/CategorySliders';
import MirrorParagraph from '@/components/groundLevel/MirrorParagraph';
import CategoryBreakdown from '@/components/groundLevel/CategoryBreakdown';
import NervousSystemSigns from '@/components/groundLevel/NervousSystemSigns';
import {
  DEFAULT_INPUTS,
  type CategoryId,
  type GroundLevelInputs,
  type LoadTier,
  type NextStep,
} from '@/lib/groundLevel/types';
import { loadTier, topCategory, totalLoad } from '@/lib/groundLevel/loadMath';
import { generateMirror } from '@/lib/groundLevel/generateMirror';
import { selectSigns } from '@/lib/groundLevel/nervousSystemSigns';
import { loadLatestEntry, saveEntry } from '@/lib/groundLevel/storage';

type Stage = 'input' | 'submitting' | 'mirror';

const MIN_SUBMIT_MS = 2000;

export default function GroundLevelPage() {
  const [hydrated, setHydrated] = useState(false);
  const [stage, setStage] = useState<Stage>('input');
  const [inputs, setInputs] = useState<GroundLevelInputs>(DEFAULT_INPUTS);
  const [mirrorText, setMirrorText] = useState<string>('');
  const [tier, setTier] = useState<LoadTier>('light');
  const [topCat, setTopCat] = useState<CategoryId>('caregiving');

  // Hydrate from localStorage on mount. If there's a saved entry, jump
  // straight to the mirror state — no re-call to the AI.
  useEffect(() => {
    const latest = loadLatestEntry();
    if (latest) {
      setInputs(latest.inputs);
      setMirrorText(latest.mirrorText);
      setTier(latest.tier);
      setTopCat(topCategory(latest.inputs));
      setStage('mirror');
    }
    setHydrated(true);
  }, []);

  const handleSliderChange = (id: CategoryId, key: 'heaviness' | 'support', value: number) => {
    setInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  const handleSubmit = async () => {
    setStage('submitting');
    const total = totalLoad(inputs);
    const computedTier = loadTier(total);
    const computedTopCat = topCategory(inputs);

    const startedAt = Date.now();
    const [text] = await Promise.all([
      generateMirror(inputs, computedTier, computedTopCat),
      new Promise<void>((resolve) => setTimeout(resolve, MIN_SUBMIT_MS)),
    ]);

    // Guarantee minimum loading time even if the API returned faster than the timer.
    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_SUBMIT_MS) {
      await new Promise((r) => setTimeout(r, MIN_SUBMIT_MS - elapsed));
    }

    saveEntry({
      timestamp: new Date().toISOString(),
      inputs,
      totalLoad: total,
      tier: computedTier,
      mirrorText: text,
    });

    setMirrorText(text);
    setTier(computedTier);
    setTopCat(computedTopCat);
    setStage('mirror');
  };

  const handleRedo = () => {
    setInputs(DEFAULT_INPUTS);
    setMirrorText('');
    setStage('input');
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="h-40 animate-pulse rounded-2xl bg-surface-subtle" aria-hidden />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/support/caregiver"
        className="inline-flex items-center gap-1 text-sm font-semibold text-brand-muted-600 hover:text-brand-muted-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Parent Support
      </Link>

      <header className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Common Ground · Ground Level
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
          ground level.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-brand-muted-700">
          a quiet read of what your week is asking of you. no score, no streak. just a mirror.
        </p>
      </header>

      {stage === 'input' && (
        <InputView
          inputs={inputs}
          onSliderChange={handleSliderChange}
          onSubmit={handleSubmit}
        />
      )}

      {stage === 'submitting' && <SubmittingView />}

      {stage === 'mirror' && (
        <MirrorView
          inputs={inputs}
          mirrorText={mirrorText}
          tier={tier}
          topCat={topCat}
          onRedo={handleRedo}
        />
      )}
    </main>
  );
}

/* ─── input state ─────────────────────────────────────────────── */

function InputView({
  inputs,
  onSliderChange,
  onSubmit,
}: {
  inputs: GroundLevelInputs;
  onSliderChange: (id: CategoryId, key: 'heaviness' | 'support', value: number) => void;
  onSubmit: () => void;
}) {
  return (
    <>
      <p className="mt-6 text-[14.5px] leading-relaxed text-brand-muted-700">
        five parts of your life. two questions each — how heavy, and how supported. it takes about a minute. you don&rsquo;t need to be exact. your gut is enough.
      </p>

      <div className="mt-6">
        <CategorySliders values={inputs} onChange={onSliderChange} />
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={onSubmit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          See what&rsquo;s underneath <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-4 text-center text-[12px] text-brand-muted-500">
        this stays on your device. nothing leaves your browser.
      </p>
    </>
  );
}

/* ─── submitting state ────────────────────────────────────────── */

function SubmittingView() {
  return (
    <div className="mt-16 flex flex-col items-center justify-center py-12 text-center">
      <div
        aria-hidden
        className="h-8 w-8 animate-spin rounded-full border-2 border-brand-muted-300 border-t-primary"
      />
      <p className="mt-6 text-[14.5px] text-brand-muted-600">reading the ground...</p>
    </div>
  );
}

/* ─── mirror state ────────────────────────────────────────────── */

function MirrorView({
  inputs,
  mirrorText,
  tier,
  topCat,
  onRedo,
}: {
  inputs: GroundLevelInputs;
  mirrorText: string;
  tier: LoadTier;
  topCat: CategoryId;
  onRedo: () => void;
}) {
  const showSigns = tier === 'heavy' || tier === 'crushing';
  const signs = showSigns ? selectSigns(inputs, tier) : [];
  const nextSteps = getNextSteps(tier, topCat);

  return (
    <>
      <div className="mt-7">
        <MirrorParagraph text={mirrorText} />
      </div>

      <section className="mt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          where the weight is sitting
        </h2>
        <div className="mt-3">
          <CategoryBreakdown inputs={inputs} />
        </div>
      </section>

      {showSigns && (
        <section className="mt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
            what this might be doing to you
          </h2>
          <div className="mt-3">
            <NervousSystemSigns signs={signs} />
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          if you want a next step
        </h2>
        {tier === 'light' ? (
          <p className="mt-3 text-[14px] leading-relaxed text-brand-muted-700">
            nothing flagged today. if you want a soft place anyway,{' '}
            <Link href="/support/still-waters" className="font-semibold text-primary hover:underline">
              still waters →
            </Link>
          </p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {nextSteps.map((step) => (
              <li key={step.href}>
                <Link
                  href={step.href}
                  className="flex items-center justify-between gap-3 rounded-xl border border-surface-border bg-white px-4 py-3 text-[13.5px] font-medium text-brand-muted-800 transition hover:border-primary/40 hover:bg-primary/5 hover:text-brand-navy-700"
                >
                  <span>{step.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-brand-muted-400" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-6">
        <button
          type="button"
          onClick={onRedo}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
        >
          <RefreshCcw className="h-4 w-4" /> Redo this read
        </button>
        <Link
          href="/support"
          className="text-[13px] font-medium text-brand-muted-500 hover:text-brand-muted-800"
        >
          Save and close
        </Link>
      </footer>
    </>
  );
}

/* ─── next-step routing ───────────────────────────────────────── */

function getNextSteps(tier: LoadTier, topCategoryId: CategoryId): NextStep[] {
  if (tier === 'crushing') {
    return [
      { label: 'open hard days & crisis', href: '/support/hard-days' },
      { label: 'reach out — pre-written texts', href: '/support/hard-days#ask-for-help' },
      { label: '988 — talk to someone now', href: 'tel:988' },
    ];
  }

  const byCategory: Record<CategoryId, NextStep[]> = {
    caregiving: [
      { label: 'home strategies', href: '/support/help' },
      { label: 'find local help', href: '/support/find' },
    ],
    work: [
      { label: 'still waters — write it down', href: '/support/still-waters' },
      { label: 'parent support', href: '/support/caregiver' },
    ],
    money: [
      { label: 'financial help', href: '/support/financial' },
      { label: 'find local help', href: '/support/find' },
    ],
    partner: [
      { label: 'couples support', href: '/support/couples' },
      { label: 'connect with parents', href: '/support/connect' },
    ],
    self: [
      { label: 'parent support', href: '/support/caregiver' },
      { label: 'still waters', href: '/support/still-waters' },
    ],
  };

  return byCategory[topCategoryId] ?? byCategory.self;
}
