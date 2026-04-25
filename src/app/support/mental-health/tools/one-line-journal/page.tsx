'use client';

import { useState } from 'react';
import { ToolShell } from '../_shell';

export default function OneLineJournalPage() {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (done) {
    return (
      <ToolShell
        title="One-line journal"
        description="Written. That's it — that's the whole thing."
      >
        <div
          className="rounded-2xl border-2 p-8 text-center"
          style={{ borderColor: 'var(--sage-soft, #D9E0D2)', background: 'var(--sage-tint, #EEF1E8)' }}
        >
          <p className="text-3xl mb-4">🤍</p>
          <p className="text-base font-semibold text-brand-muted-900 mb-2">You wrote today.</p>
          <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
            That's not nothing. Noticing is how patterns become visible.
          </p>
          <button
            onClick={() => { setText(''); setDone(false); }}
            className="text-sm font-medium text-brand-muted-500 hover:text-brand-muted-800 underline underline-offset-2 transition-colors"
          >
            Write another
          </button>
        </div>
      </ToolShell>
    );
  }

  return (
    <ToolShell
      title="One-line journal"
      description="One sentence. No paragraphs needed."
    >
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: 'var(--line, #E5DBC9)', background: 'var(--paper, #FBF7EF)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted-400 mb-1">
          {today}
        </p>
        <p className="text-base font-medium text-brand-muted-900 mb-5" style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic' }}>
          "What was harder than it should have been?"
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write one line…"
          rows={3}
          autoFocus
          className="w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-brand-muted-900 placeholder-brand-muted-400 outline-none transition focus:ring-2 focus:ring-brand-plum-300"
          style={{ borderColor: 'var(--line, #E5DBC9)' }}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setDone(true)}
            disabled={!text.trim()}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-40"
            style={{ background: 'var(--sage-deep, #4F6249)' }}
          >
            Done
          </button>
        </div>
      </div>
      <p className="mt-4 text-xs text-center text-brand-muted-400">
        Nothing is saved. This is for you, right now.
      </p>
    </ToolShell>
  );
}
