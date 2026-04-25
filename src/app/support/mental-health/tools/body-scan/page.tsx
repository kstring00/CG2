'use client';

import { useState } from 'react';
import { ToolShell } from '../_shell';

const STEPS = [
  { area: 'Crown of your head',  cue: 'Notice it. Is there tension there? You don\'t have to fix it — just notice, and let go.' },
  { area: 'Forehead and eyes',   cue: 'Relax your brow. Soften around your eyes. Let the muscles go slack.' },
  { area: 'Jaw and throat',      cue: 'This is where most of the day gets held. Let your teeth part slightly. Drop your tongue from the roof of your mouth.' },
  { area: 'Shoulders',           cue: 'Let them fall. Not where you think they are — where they actually land when you stop holding them up.' },
  { area: 'Chest',               cue: 'Take one slow breath here. In through your nose. Feel your chest expand. Let it fall.' },
  { area: 'Belly',               cue: 'Let it soften. You don\'t have to hold anything in right now. Nothing to perform here.' },
  { area: 'Hips and lower back', cue: 'Feel the weight of your body where it meets the surface below you. Let it be held.' },
  { area: 'Legs',                cue: 'Thighs, knees, calves. Any tension — just notice. Breathe into it. Let it go.' },
  { area: 'Feet',                cue: 'All the way to your toes. You made it to the bottom. You\'re still here. That\'s enough.' },
];

export default function BodyScanPage() {
  const [step, setStep]   = useState<number | null>(null);
  const [done, setDone]   = useState(false);

  if (done) {
    return (
      <ToolShell
        title="Body scan"
        description="You stayed with it."
      >
        <div
          className="rounded-2xl border-2 p-8 text-center"
          style={{ borderColor: 'var(--sage-soft, #D9E0D2)', background: 'var(--sage-tint, #EEF1E8)' }}
        >
          <p className="text-3xl mb-4">🌿</p>
          <p className="text-base font-semibold text-brand-muted-900 mb-2">You made it through.</p>
          <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
            Whatever tension is left, you noticed it. That&apos;s the practice — not the release, but the noticing.
          </p>
          <button
            onClick={() => { setStep(null); setDone(false); }}
            className="text-sm font-medium text-brand-muted-500 hover:text-brand-muted-800 underline underline-offset-2 transition-colors"
          >
            Go again
          </button>
        </div>
      </ToolShell>
    );
  }

  if (step === null) {
    return (
      <ToolShell
        title="Body scan"
        description="Five minutes. You don't have to fix anything — just notice where you're holding the day. Crown to feet."
      >
        <div
          className="rounded-2xl border p-6 text-center"
          style={{ borderColor: 'var(--line, #E5DBC9)', background: 'var(--paper, #FBF7EF)' }}
        >
          <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
            Lie down if you can. Close your eyes when you&apos;re ready. We&apos;ll move from the top of your head to your feet, one area at a time. Tap <strong>Next</strong> when you&apos;re ready to move on.
          </p>
          <button
            onClick={() => setStep(0)}
            className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition"
            style={{ background: 'var(--sage-deep, #4F6249)' }}
          >
            Begin
          </button>
        </div>
      </ToolShell>
    );
  }

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  return (
    <ToolShell title="Body scan" description="">
      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all"
            style={{
              background: i < step
                ? 'var(--sage-deep, #4F6249)'
                : i === step
                ? 'var(--sage, #6B8068)'
                : 'var(--line, #E5DBC9)',
            }}
          />
        ))}
      </div>

      <div
        className="rounded-2xl border p-6 mb-6"
        style={{ borderColor: 'var(--line, #E5DBC9)', background: 'var(--paper, #FBF7EF)' }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400 mb-3">
          Step {step + 1} of {STEPS.length}
        </p>
        <p
          className="text-xl font-semibold mb-4"
          style={{ fontFamily: 'var(--font-display, serif)', color: 'var(--ink, #2A2520)' }}
        >
          {current.area}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft, #5A5048)' }}>
          {current.cue}
        </p>
      </div>

      <button
        onClick={() => isLast ? setDone(true) : setStep(step + 1)}
        className="w-full rounded-xl py-3 text-sm font-semibold text-white transition"
        style={{ background: 'var(--sage-deep, #4F6249)' }}
      >
        {isLast ? 'I\'m done' : 'Next →'}
      </button>

      <button
        onClick={() => { setStep(null); setDone(false); }}
        className="mt-3 w-full text-xs text-brand-muted-400 hover:text-brand-muted-600 transition-colors"
      >
        Start over
      </button>
    </ToolShell>
  );
}
