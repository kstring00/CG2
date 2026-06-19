'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { prompts } from '@/lib/marriage/content';

const TOTAL_SECONDS = 600;

type TimerPhase = 'idle' | 'running' | 'paused' | 'done';

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function pickNextPrompt(current: string): string {
  if (prompts.length <= 1) return prompts[0];
  let next = current;
  while (next === current) {
    next = prompts[Math.floor(Math.random() * prompts.length)]!;
  }
  return next;
}

export default function MarriageReconnectTool() {
  const [prompt, setPrompt] = useState(prompts[0]!);
  const [promptVisible, setPromptVisible] = useState(true);
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);

  const phase: TimerPhase = useMemo(() => {
    if (remaining === 0) return 'done';
    if (running) return 'running';
    if (started) return 'paused';
    return 'idle';
  }, [remaining, running, started]);

  const statusLabel = useMemo(() => {
    switch (phase) {
      case 'running':
        return 'on the clock — talk';
      case 'paused':
        return 'paused';
      case 'done':
        return 'ten minutes well spent';
      default:
        return 'ready when you are';
    }
  }, [phase]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, remaining]);

  const shufflePrompt = useCallback(() => {
    setPromptVisible(false);
    window.setTimeout(() => {
      setPrompt((current) => pickNextPrompt(current));
      setPromptVisible(true);
    }, 180);
  }, []);

  const startTimer = () => {
    setStarted(true);
    setRunning(true);
  };

  const pauseTimer = () => setRunning(false);
  const resumeTimer = () => {
    if (remaining > 0) setRunning(true);
  };

  const resetTimer = () => {
    setRunning(false);
    setStarted(false);
    setRemaining(TOTAL_SECONDS);
  };

  return (
    <section
      id="tool"
      aria-labelledby="marriage-tool-heading"
      className="bg-gradient-to-br from-marriage-pine via-[#1a3a32] to-marriage-ink px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-marriage-amber">
          The ten-minute reconnect
        </p>
        <h2
          id="marriage-tool-heading"
          className="mt-3 font-marriage-serif text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-snug text-white"
        >
          You have ten minutes tonight. Spend them on each other.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/75 sm:text-[16px]">
          Not date night. Not a fix. Just one real question and a quiet ten minutes with no kids on
          the table. Pull one up, start the timer, and talk.
        </p>

        <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-marriage-surface p-6 text-left shadow-[0_24px_60px_rgba(0,0,0,0.25)] sm:p-8">
          <p
            className="marriage-prompt-fade min-h-[4.5rem] font-marriage-serif text-[clamp(1.35rem,3.2vw,1.85rem)] italic leading-snug text-marriage-body sm:min-h-[5rem]"
            data-visible={promptVisible ? 'true' : 'false'}
          >
            {prompt}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={shufflePrompt}
              className="rounded-full bg-marriage-amber px-5 py-2.5 text-[13px] font-semibold text-marriage-ink transition hover:bg-marriage-amber-deep"
            >
              Another question
            </button>
            {!started && (
              <button
                type="button"
                onClick={startTimer}
                className="rounded-full border border-marriage-line-strong bg-transparent px-5 py-2.5 text-[13px] font-semibold text-marriage-body transition hover:bg-marriage-paper"
              >
                Start 10 minutes
              </button>
            )}
          </div>

          <div className="mt-8 border-t border-dashed border-marriage-line pt-8 text-center">
            <p
              className={[
                'font-marriage-serif text-[clamp(3rem,10vw,4.75rem)] tabular-nums leading-none tracking-tight',
                phase === 'done' ? 'text-marriage-clay' : 'text-marriage-body',
              ].join(' ')}
              aria-live="polite"
            >
              {formatClock(remaining)}
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-marriage-muted">
              {statusLabel}
            </p>

            {started && phase !== 'done' && (
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {running ? (
                  <button
                    type="button"
                    onClick={pauseTimer}
                    className="rounded-full border border-marriage-line-strong px-4 py-2 text-[13px] font-semibold text-marriage-body transition hover:bg-marriage-paper"
                  >
                    Pause
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resumeTimer}
                    className="rounded-full border border-marriage-line-strong px-4 py-2 text-[13px] font-semibold text-marriage-body transition hover:bg-marriage-paper"
                  >
                    Resume
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetTimer}
                  className="rounded-full border border-marriage-line-strong px-4 py-2 text-[13px] font-semibold text-marriage-muted transition hover:bg-marriage-paper hover:text-marriage-body"
                >
                  Reset
                </button>
              </div>
            )}

            {phase === 'done' && (
              <button
                type="button"
                onClick={resetTimer}
                className="mt-5 rounded-full border border-marriage-line-strong px-4 py-2 text-[13px] font-semibold text-marriage-body transition hover:bg-marriage-paper"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
