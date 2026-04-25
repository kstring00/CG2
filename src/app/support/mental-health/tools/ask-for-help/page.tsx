'use client';

import { useState } from 'react';
import { ToolShell } from '../_shell';

const TEMPLATES = [
  {
    tone: 'Low-ask',
    message: "I'm having a hard day. Not asking you to fix anything — just needed to tell someone.",
  },
  {
    tone: 'Practical',
    message: "Rough one over here. Can you call me on the drive home, even for 5 minutes?",
  },
  {
    tone: 'Need company',
    message: "I could really use some company tonight. Even just sitting together would help.",
  },
  {
    tone: 'Need a break',
    message: "I'm at the edge of what I can handle. Any chance you could take over for an hour?",
  },
  {
    tone: 'Asking for space',
    message: "I don't need you to do anything. I just need 30 quiet minutes. Can you hold things down?",
  },
  {
    tone: 'Just heard',
    message: "Harder than expected today. Just needed someone to know.",
  },
];

export default function AskForHelpPage() {
  const [copied, setCopied] = useState<number | null>(null);

  function copyText(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <ToolShell
      title="Ask-for-help templates"
      description="Pre-written texts for when reaching out feels like one more task. Pick one, copy it, send it."
    >
      <div className="space-y-3">
        {TEMPLATES.map((t, i) => (
          <div
            key={i}
            className="rounded-2xl border p-4"
            style={{ borderColor: 'var(--line, #E5DBC9)', background: 'var(--paper, #FBF7EF)' }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400 mb-2">
              {t.tone}
            </p>
            <p className="text-sm leading-relaxed text-brand-muted-800 mb-3 italic">
              &ldquo;{t.message}&rdquo;
            </p>
            <button
              onClick={() => copyText(t.message, i)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
              style={
                copied === i
                  ? { background: 'var(--sage-soft, #D9E0D2)', color: 'var(--sage-deep, #4F6249)' }
                  : { background: 'var(--cream-deep, #EDE4D3)', color: 'var(--ink-soft, #5A5048)' }
              }
            >
              {copied === i ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  Copy message
                </>
              )}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-center leading-relaxed text-brand-muted-400">
        You don&apos;t need to explain everything. One line is enough.
      </p>
    </ToolShell>
  );
}
