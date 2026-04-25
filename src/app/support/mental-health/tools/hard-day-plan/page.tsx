'use client';

import { useState } from 'react';
import { ToolShell } from '../_shell';

export default function HardDayPlanPage() {
  const [dropping, setDropping]   = useState('');
  const [keeping, setKeeping]     = useState('');
  const [person, setPerson]       = useState('');
  const [saved, setSaved]         = useState(false);

  const canSave = dropping.trim() || keeping.trim() || person.trim();

  if (saved) {
    return (
      <ToolShell
        title="Your hard-day plan"
        description="Decided on a good day, ready for a hard one."
      >
        <div className="space-y-4">
          {dropping.trim() && (
            <div className="rounded-xl border p-4" style={{ borderColor: 'var(--line, #E5DBC9)', background: 'var(--paper, #FBF7EF)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted-400 mb-1">What I&apos;m dropping today</p>
              <p className="text-sm text-brand-muted-800">{dropping}</p>
            </div>
          )}
          {keeping.trim() && (
            <div className="rounded-xl border p-4" style={{ borderColor: 'var(--sage-soft, #D9E0D2)', background: 'var(--sage-tint, #EEF1E8)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted-400 mb-1">What stays no matter what</p>
              <p className="text-sm text-brand-muted-800">{keeping}</p>
            </div>
          )}
          {person.trim() && (
            <div className="rounded-xl border p-4" style={{ borderColor: 'var(--line, #E5DBC9)', background: 'var(--paper, #FBF7EF)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted-400 mb-1">One person I&apos;ll text</p>
              <p className="text-sm text-brand-muted-800">{person}</p>
            </div>
          )}
          <p className="text-xs text-center text-brand-muted-400 pt-2">Screenshot this to keep it.</p>
          <button
            onClick={() => setSaved(false)}
            className="w-full text-sm font-medium text-brand-muted-500 hover:text-brand-muted-800 underline underline-offset-2 transition-colors"
          >
            Edit plan
          </button>
        </div>
      </ToolShell>
    );
  }

  const fieldClass = "w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-muted-900 placeholder-brand-muted-400 outline-none transition focus:ring-2 focus:ring-brand-plum-300";
  const fieldStyle = { borderColor: 'var(--line, #E5DBC9)' };

  return (
    <ToolShell
      title="Hard-day plan"
      description="Write this on a good day. When the day collapses, your better self already decided."
    >
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-brand-muted-500 mb-2">
            What I&apos;m dropping today
          </label>
          <p className="text-xs text-brand-muted-400 mb-2">Laundry, dinner-as-event, the non-urgent email — what genuinely does not have to happen.</p>
          <textarea
            value={dropping}
            onChange={(e) => setDropping(e.target.value)}
            placeholder="e.g. Cooking a real dinner. Responding to that email."
            rows={2}
            className={fieldClass}
            style={fieldStyle}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-brand-muted-500 mb-2">
            What stays no matter what
          </label>
          <p className="text-xs text-brand-muted-400 mb-2">The floor. Kid fed, kid safe, you breathing — and anything else that truly can't move.</p>
          <textarea
            value={keeping}
            onChange={(e) => setKeeping(e.target.value)}
            placeholder="e.g. Kid fed. Kid safe. I drink water."
            rows={2}
            className={fieldClass}
            style={fieldStyle}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-brand-muted-500 mb-2">
            One person I&apos;ll text
          </label>
          <p className="text-xs text-brand-muted-400 mb-2">Not to fix it — just to name the day. "Rough one." That counts.</p>
          <input
            type="text"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            placeholder="Their name"
            className={fieldClass}
            style={fieldStyle}
          />
        </div>
        <button
          onClick={() => setSaved(true)}
          disabled={!canSave}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition disabled:opacity-40"
          style={{ background: 'var(--sage-deep, #4F6249)' }}
        >
          Save my plan
        </button>
      </div>
      <p className="mt-4 text-xs text-center text-brand-muted-400">
        Nothing is stored. Screenshot the result to keep it.
      </p>
    </ToolShell>
  );
}
