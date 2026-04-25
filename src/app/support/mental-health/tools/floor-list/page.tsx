'use client';

import { useState } from 'react';
import { ToolShell } from '../_shell';

const FLOOR_ITEMS = [
  { label: 'Kid fed', sub: 'Something eaten. It doesn\'t have to be a meal.' },
  { label: 'Kid safe', sub: 'They\'re okay. You\'re watching. That\'s the job.' },
  { label: 'You breathing', sub: 'Literally. In. Out. You\'re still here.' },
];

export default function FloorListPage() {
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const allChecked = checked.every(Boolean);

  function toggle(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <ToolShell
      title="Your floor for today"
      description="When bandwidth is gone, this is what counts as success. Everything else is a bonus."
    >
      <div className="space-y-3">
        {FLOOR_ITEMS.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all"
            style={
              checked[i]
                ? { borderColor: 'var(--sage-soft, #D9E0D2)', background: 'var(--sage-tint, #EEF1E8)' }
                : { borderColor: 'var(--line, #E5DBC9)', background: 'var(--paper, #FBF7EF)' }
            }
          >
            <div
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
              style={
                checked[i]
                  ? { borderColor: 'var(--sage-deep, #4F6249)', background: 'var(--sage-deep, #4F6249)' }
                  : { borderColor: 'var(--ink-faint, #B8AE9F)', background: 'white' }
              }
            >
              {checked[i] && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
              )}
            </div>
            <div>
              <p
                className="text-base font-semibold"
                style={{
                  fontFamily: 'var(--font-display, serif)',
                  color: checked[i] ? 'var(--sage-deep, #4F6249)' : 'var(--ink, #2A2520)',
                  textDecoration: checked[i] ? 'line-through' : 'none',
                  opacity: checked[i] ? 0.7 : 1,
                }}
              >
                {item.label}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--ink-muted, #897E72)' }}>{item.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {allChecked && (
        <div
          className="mt-6 rounded-2xl border-2 p-5 text-center"
          style={{ borderColor: 'var(--sage-soft, #D9E0D2)', background: 'var(--sage-tint, #EEF1E8)' }}
        >
          <p className="text-base font-semibold" style={{ color: 'var(--sage-deep, #4F6249)' }}>
            That&apos;s enough. That&apos;s the whole job today.
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted, #897E72)' }}>
            Anything else is extra credit.
          </p>
        </div>
      )}

      <p className="mt-5 text-xs text-center text-brand-muted-400">
        On the days when the floor is all you have, the floor is enough.
      </p>
    </ToolShell>
  );
}
