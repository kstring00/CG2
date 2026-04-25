'use client';

import { useState } from 'react';
import { ToolShell } from '../_shell';

export default function OneThingPage() {
  const [mustDo, setMustDo]   = useState('');
  const [canWait, setCanWait] = useState('');
  const [done, setDone]       = useState(false);

  if (done) {
    return (
      <ToolShell
        title="The next 60 minutes"
        description="That's the whole list."
      >
        <div className="space-y-4">
          {mustDo.trim() && (
            <div className="rounded-xl border-2 p-4" style={{ borderColor: 'var(--sage-soft, #D9E0D2)', background: 'var(--sage-tint, #EEF1E8)' }}>
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--sage-deep, #4F6249)' }}>Has to happen</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--ink, #2A2520)' }}>{mustDo}</p>
            </div>
          )}
          {canWait.trim() && (
            <div className="rounded-xl border p-4" style={{ borderColor: 'var(--line, #E5DBC9)', background: 'var(--paper, #FBF7EF)', opacity: 0.7 }}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400 mb-2">Can wait until tomorrow</p>
              <p className="text-sm leading-relaxed text-brand-muted-600">{canWait}</p>
            </div>
          )}
          <p className="text-xs text-center text-brand-muted-400 pt-2">
            The "can wait" list is still there tomorrow. You don&apos;t have to carry it tonight.
          </p>
          <button
            onClick={() => { setMustDo(''); setCanWait(''); setDone(false); }}
            className="w-full text-sm font-medium text-brand-muted-500 hover:text-brand-muted-800 underline underline-offset-2 transition-colors"
          >
            Start over
          </button>
        </div>
      </ToolShell>
    );
  }

  const fieldClass = "w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-muted-900 placeholder-brand-muted-400 outline-none transition focus:ring-2 focus:ring-brand-plum-300";
  const fieldStyle = { borderColor: 'var(--line, #E5DBC9)' };

  return (
    <ToolShell
      title="The next 60 minutes"
      description="When everything feels equally urgent, that's the overwhelm talking, not the truth. Write down just the next hour."
    >
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-brand-muted-500 mb-1.5">
            Has to happen <span className="normal-case font-normal">(next 60 minutes)</span>
          </label>
          <textarea
            value={mustDo}
            onChange={(e) => setMustDo(e.target.value)}
            placeholder="One thing. Maybe two. Not five."
            rows={3}
            autoFocus
            className={fieldClass}
            style={fieldStyle}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-brand-muted-500 mb-1.5">
            Can wait until tomorrow
          </label>
          <textarea
            value={canWait}
            onChange={(e) => setCanWait(e.target.value)}
            placeholder="Everything else that felt urgent 10 minutes ago."
            rows={3}
            className={fieldClass}
            style={fieldStyle}
          />
        </div>
        <button
          onClick={() => setDone(true)}
          disabled={!mustDo.trim() && !canWait.trim()}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition disabled:opacity-40"
          style={{ background: 'var(--sage-deep, #4F6249)' }}
        >
          That&apos;s the list
        </button>
      </div>
      <p className="mt-4 text-xs text-center text-brand-muted-400">
        Nothing is saved. This is a 60-minute scope, not a to-do app.
      </p>
    </ToolShell>
  );
}
