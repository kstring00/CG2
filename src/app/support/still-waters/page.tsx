'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoodPicker } from './_components/MoodPicker';
import { WritingSurface } from './_components/WritingSurface';
import { pickPromptForMood } from './_lib/prompts';
import type { Mood, Prompt } from './_lib/types';

type Stage =
  | { kind: 'mood' }
  | { kind: 'write'; mood: Mood | null; prompt: Prompt }
  | { kind: 'done' };

export default function StillWatersHome() {
  const [stage, setStage] = useState<Stage>({ kind: 'mood' });

  if (stage.kind === 'mood') {
    return (
      <MoodPicker
        onPick={(mood) =>
          setStage({ kind: 'write', mood, prompt: pickPromptForMood(mood) })
        }
      />
    );
  }

  if (stage.kind === 'write') {
    return (
      <WritingSurface
        mood={stage.mood}
        initialPrompt={stage.prompt}
        onDone={() => setStage({ kind: 'done' })}
      />
    );
  }

  return <DoneState onAgain={() => setStage({ kind: 'mood' })} />;
}

function DoneState({ onAgain }: { onAgain: () => void }) {
  return (
    <section className="animate-fade-in pt-20 text-center sm:pt-32">
      <p
        className="mx-auto max-w-md text-2xl leading-relaxed text-slate-700 sm:text-[1.6rem]"
        style={{ fontFamily: 'var(--font-still-waters-serif), Georgia, serif' }}
      >
        Thank you for sitting here for a minute.
      </p>
      <p className="mt-4 text-sm text-slate-500">
        No one will read this. Including us.
      </p>

      <div className="mt-12 flex flex-col items-center gap-3">
        <button
          onClick={onAgain}
          className="rounded-full border border-slate-400 bg-white/60 px-5 py-2 text-[13px] text-slate-700 transition hover:bg-white hover:text-slate-900"
        >
          Write something else
        </button>
        <Link
          href="/support/still-waters/history"
          className="text-[12px] text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline"
        >
          Look back
        </Link>
      </div>
    </section>
  );
}
