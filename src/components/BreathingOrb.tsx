'use client';

import { useEffect, useRef, useState } from 'react';

type Phase = 'idle' | 'in' | 'hold' | 'out' | 'done';

const PHASES: { phase: Phase; label: string; sub: string; duration: number }[] = [
  { phase: 'in',   label: 'Breathe in',  sub: 'slowly through your nose', duration: 4000 },
  { phase: 'hold', label: 'Hold',        sub: 'stay still, you\'re safe',  duration: 7000 },
  { phase: 'out',  label: 'Breathe out', sub: 'slowly through your mouth', duration: 8000 },
];

const ROUNDS = 3;

const phaseClass: Record<Phase, string> = {
  idle:  '',
  in:    'breathe-in',
  hold:  'breathe-hold',
  out:   'breathe-out',
  done:  '',
};

export default function BreathingOrb() {
  const [phase, setPhase]   = useState<Phase>('idle');
  const [round, setRound]   = useState(0);
  const [count, setCount]   = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (timerRef.current)  clearTimeout(timerRef.current);
    if (countRef.current)  clearInterval(countRef.current);
  };

  const startPhase = (pIdx: number, rnd: number) => {
    const p = PHASES[pIdx];
    setPhase(p.phase);
    setPhaseIdx(pIdx);
    setCount(Math.round(p.duration / 1000));

    // countdown
    if (countRef.current) clearInterval(countRef.current);
    let c = Math.round(p.duration / 1000);
    countRef.current = setInterval(() => {
      c -= 1;
      setCount(c);
      if (c <= 0) { clearInterval(countRef.current!); }
    }, 1000);

    timerRef.current = setTimeout(() => {
      const nextIdx = pIdx + 1;
      if (nextIdx < PHASES.length) {
        startPhase(nextIdx, rnd);
      } else {
        const nextRound = rnd + 1;
        if (nextRound < ROUNDS) {
          setRound(nextRound);
          startPhase(0, nextRound);
        } else {
          setPhase('done');
          setRound(0);
          setPhaseIdx(0);
          setCount(0);
        }
      }
    }, p.duration);
  };

  const handleStart = () => {
    clear();
    setRound(0);
    startPhase(0, 0);
  };

  const handleStop = () => {
    clear();
    setPhase('idle');
    setCount(0);
    setRound(0);
  };

  useEffect(() => () => clear(), []);

  const isActive = phase !== 'idle' && phase !== 'done';
  const currentPhase = PHASES[phaseIdx];

  const orbSize = phase === 'in' || phase === 'hold' ? 'scale-100 opacity-100' : 'scale-[0.72] opacity-50';

  return (
    <div className="flex flex-col items-center gap-6 py-6">

      {/* Orb */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow ring */}
        {isActive && (
          <span className="absolute inset-0 rounded-full orb-active" style={{ borderRadius: '50%' }} />
        )}

        {/* Main orb */}
        <div
          key={`${phase}-${round}`}
          className={`relative flex h-44 w-44 items-center justify-center rounded-full transition-all ${phaseClass[phase]}`}
          style={{
            background: phase === 'idle' || phase === 'done'
              ? 'linear-gradient(135deg, #e9d5f0 0%, #c8a8d8 100%)'
              : phase === 'in' || phase === 'hold'
              ? 'linear-gradient(135deg, #703068 0%, #32175a 100%)'
              : 'linear-gradient(135deg, #9b59b6 0%, #703068 100%)',
            boxShadow: isActive ? '0 0 40px 8px rgba(112,48,104,0.25)' : 'none',
          }}
        >
          {/* Inner text */}
          <div className="text-center px-3">
            {phase === 'idle' && (
              <p className="text-sm font-semibold text-brand-plum-700 leading-tight">Press start<br/>to begin</p>
            )}
            {phase === 'done' && (
              <p className="text-sm font-semibold text-brand-plum-700 leading-tight">Well done 🤍</p>
            )}
            {isActive && (
              <>
                <p className="text-3xl font-bold text-white tabular-nums leading-none">{count}</p>
                <p className="mt-1 text-xs font-semibold text-white/80 uppercase tracking-widest">
                  {currentPhase?.phase === 'in' ? 'inhale' : currentPhase?.phase === 'hold' ? 'hold' : 'exhale'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Phase label */}
      <div className="text-center min-h-[2.5rem]">
        {isActive && (
          <>
            <p className="text-base font-semibold text-brand-muted-900">{currentPhase?.label}</p>
            <p className="text-xs text-brand-muted-500">{currentPhase?.sub}</p>
          </>
        )}
        {phase === 'idle' && (
          <p className="text-sm text-brand-muted-500">4-7-8 breathing · {ROUNDS} rounds · ~{Math.round((PHASES.reduce((a,p) => a + p.duration, 0) * ROUNDS) / 60000)} min</p>
        )}
        {phase === 'done' && (
          <p className="text-sm text-emerald-600 font-medium">You made it through all {ROUNDS} rounds.</p>
        )}
      </div>

      {/* Round dots */}
      {(isActive || phase === 'done') && (
        <div className="flex gap-2">
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${
                i < round || phase === 'done' ? 'bg-brand-plum-600' :
                i === round ? 'bg-brand-plum-300 scale-125' :
                'bg-surface-border'
              }`}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {(phase === 'idle' || phase === 'done') && (
          <button
            onClick={handleStart}
            className="rounded-2xl bg-brand-plum-600 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-plum-700 active:scale-95"
          >
            {phase === 'done' ? 'Go again' : 'Start exercise'}
          </button>
        )}
        {isActive && (
          <button
            onClick={handleStop}
            className="rounded-2xl border border-surface-border bg-white px-5 py-2.5 text-sm font-medium text-brand-muted-600 transition hover:bg-surface-muted active:scale-95"
          >
            Stop
          </button>
        )}
      </div>

    </div>
  );
}
