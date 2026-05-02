'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Shuffle, Timer, Check } from 'lucide-react';
import type { Prompt, Mood } from '../_lib/types';
import { pickPromptForMood } from '../_lib/prompts';
import { newEntryId, saveEntry } from '../_lib/storage';

type Props = {
  mood: Mood | null;
  initialPrompt: Prompt;
  onDone: () => void;
};

const TIMER_SECONDS = 15 * 60;

export function WritingSurface({ mood, initialPrompt, onDone }: Props) {
  const [prompt, setPrompt] = useState<Prompt>(initialPrompt);
  const [body, setBody] = useState('');
  const [entryId] = useState(() => newEntryId());
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [seenIds, setSeenIds] = useState<string[]>([initialPrompt.id]);

  const [timerOn, setTimerOn] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [body]);

  // Auto-save: 2 seconds after the last keystroke, only if there's content.
  useEffect(() => {
    if (!body.trim()) return;
    const handle = setTimeout(() => {
      saveEntry({
        id: entryId,
        mood,
        promptId: prompt.id,
        promptText: prompt.text,
        body,
      });
      setSavedAt(new Date());
    }, 2000);
    return () => clearTimeout(handle);
  }, [body, entryId, mood, prompt]);

  // Save on unmount/leave too, so nothing gets lost.
  useEffect(() => {
    const handler = () => {
      if (body.trim()) {
        saveEntry({
          id: entryId,
          mood,
          promptId: prompt.id,
          promptText: prompt.text,
          body,
        });
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      handler();
      window.removeEventListener('beforeunload', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body, entryId, mood, prompt.id, prompt.text]);

  // Optional 15-minute timer
  useEffect(() => {
    if (!timerOn) return;
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timerOn, secondsLeft]);

  const swap = () => {
    const next = pickPromptForMood(mood, seenIds);
    setSeenIds((ids) => [...ids, next.id]);
    setPrompt(next);
  };

  const handleDone = () => {
    if (body.trim()) {
      saveEntry({
        id: entryId,
        mood,
        promptId: prompt.id,
        promptText: prompt.text,
        body,
      });
    }
    onDone();
  };

  const timerLabel = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [secondsLeft]);

  return (
    <section className="animate-fade-in pt-6 sm:pt-10">
      <div className="flex items-center justify-between text-[12px] text-slate-500">
        <button
          onClick={swap}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/60 bg-white/60 px-3 py-1.5 text-slate-600 transition hover:border-slate-400 hover:bg-white hover:text-slate-900"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Swap prompt
        </button>

        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <Check className="h-3 w-3" /> Saved
            </span>
          )}
          <button
            onClick={() => {
              setTimerOn((on) => !on);
              if (!timerOn) setSecondsLeft(TIMER_SECONDS);
            }}
            className={
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition ' +
              (timerOn
                ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                : 'border-slate-300/60 bg-white/60 text-slate-600 hover:border-slate-400 hover:bg-white hover:text-slate-900')
            }
          >
            <Timer className="h-3.5 w-3.5" />
            {timerOn ? timerLabel : '15 min'}
          </button>
        </div>
      </div>

      <div className="mt-10">
        <p
          className="text-2xl leading-relaxed text-slate-800 sm:text-[1.6rem] sm:leading-[1.5]"
          style={{ fontFamily: 'var(--font-still-waters-serif), Georgia, serif' }}
        >
          {prompt.text}
        </p>
      </div>

      <div className="mt-8">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start anywhere."
          spellCheck={false}
          autoFocus
          className="block w-full resize-none border-0 border-b border-transparent bg-transparent text-base leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-0 sm:text-[1.05rem] sm:leading-[1.75]"
          style={{
            fontFamily: 'var(--font-still-waters-sans), system-ui, sans-serif',
            minHeight: '40vh',
          }}
        />
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-300/40 pt-6 text-center">
        <p className="text-[13px] text-slate-500">
          You can stop whenever you want.
        </p>
        <button
          onClick={handleDone}
          className="rounded-full bg-slate-800 px-6 py-2.5 text-[13px] font-medium text-white transition hover:bg-slate-900"
        >
          I&rsquo;m done for now
        </button>
        <Link
          href="/support/still-waters/crisis"
          className="text-[12px] text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline"
        >
          I need real support
        </Link>
      </div>
    </section>
  );
}
