'use client';

import { MOOD_LABELS, type Mood } from '../_lib/types';

const ORDER: Mood[] = ['frayed', 'heavy', 'numb', 'steady', 'hopeful'];

type Props = {
  onPick: (mood: Mood | null) => void;
};

export function MoodPicker({ onPick }: Props) {
  return (
    <section className="animate-fade-in pt-12 sm:pt-20">
      <p className="text-center text-[12px] font-medium uppercase tracking-[0.2em] text-slate-500">
        Welcome back
      </p>
      <h1
        className="mt-5 text-center text-3xl leading-snug text-slate-800 sm:text-4xl"
        style={{ fontFamily: 'var(--font-still-waters-serif), Georgia, serif' }}
      >
        How are you walking in today?
      </h1>
      <p className="mt-4 text-center text-sm text-slate-500">
        You can skip this.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {ORDER.map((mood) => (
          <button
            key={mood}
            onClick={() => onPick(mood)}
            className="rounded-2xl border border-slate-300/60 bg-white/70 px-4 py-5 text-base text-slate-700 shadow-[0_2px_12px_rgba(30,41,59,0.04)] transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white hover:text-slate-900"
            style={{ fontFamily: 'var(--font-still-waters-serif), Georgia, serif' }}
          >
            {MOOD_LABELS[mood]}
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => onPick(null)}
          className="text-[13px] text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline"
        >
          Just give me a prompt
        </button>
      </div>
    </section>
  );
}
