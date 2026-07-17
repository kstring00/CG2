'use client';

import { useEffect, useRef, useState } from 'react';
import { Copy, Mail, X } from 'lucide-react';
import type { SavedCarePlan } from '@/lib/carePlanStorage';
import {
  isValidEmail,
  loadCheckInState,
  setParentEmail,
  type WeeklyCheckInEntry,
} from '@/lib/weeklyCheckIn';

type Props = {
  open: boolean;
  onClose: () => void;
  plan: SavedCarePlan | null;
  latestCheckIn?: WeeklyCheckInEntry | null;
};

type SendState =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'fallback'; reason: 'EMAIL_NOT_CONFIGURED' }
  | { kind: 'error'; message: string };

export default function EmailPlanDialog({ open, onClose, plan, latestCheckIn }: Props) {
  const [email, setEmail] = useState('');
  const [send, setSend] = useState<SendState>({ kind: 'idle' });
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const state = loadCheckInState();
    if (state.parentEmail) setEmail(state.parentEmail);
    setSend({ kind: 'idle' });
    setCopied(false);
    // Focus close button on open for a sane focus landing.
    const id = window.requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const planText = plan ? buildPlanText(plan, latestCheckIn ?? null) : '';
  const mailtoHref = plan && email
    ? `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Your Common Ground plan')}&body=${encodeURIComponent(planText)}`
    : '';

  async function handleSend() {
    if (!plan) return;
    if (!isValidEmail(email)) {
      setSend({ kind: 'error', message: 'That email doesn’t look right.' });
      return;
    }
    setParentEmail(email);
    setSend({ kind: 'sending' });
    try {
      const res = await fetch('/api/email-care-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          answers: plan.answers,
          carePlan: {
            summary: plan.summary,
            nextSteps: plan.steps.map((s) => `${s.title} — ${s.why}`),
            resources: plan.resources.map((r) => ({ label: r.label, href: r.href })),
            encouragement: plan.weekMessage ?? '',
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reason?: string };
      if (data.ok) {
        setSend({ kind: 'sent' });
        return;
      }
      if (data.reason === 'EMAIL_NOT_CONFIGURED') {
        setSend({ kind: 'fallback', reason: 'EMAIL_NOT_CONFIGURED' });
        return;
      }
      setSend({ kind: 'error', message: 'Something went wrong sending the email.' });
    } catch {
      setSend({ kind: 'error', message: 'Could not reach the server. Try the copy option below.' });
    }
  }

  async function handleCopy() {
    if (!planText) return;
    try {
      await navigator.clipboard.writeText(planText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleDownload() {
    if (!planText) return;
    const blob = new Blob([planText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'common-ground-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-plan-title"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-plum-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-plum-700">
              <Mail className="h-3 w-3" aria-hidden /> Email my plan
            </p>
            <h2 id="email-plan-title" className="mt-2 text-xl font-bold text-stone-900">
              Send your plan to yourself.
            </h2>
            <p className="mt-1 text-[13.5px] leading-relaxed text-stone-600">
              We’ll email a plain-text copy of your plan and latest check-in. Stored on this device only.
            </p>
          </div>
          <button
            type="button"
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close email dialog"
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5">
          <label htmlFor="parent-email" className="block text-sm font-semibold text-stone-800">
            Your email
          </label>
          <input
            id="parent-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSend}
            disabled={!email || send.kind === 'sending' || !plan}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mail className="h-4 w-4" />
            {send.kind === 'sending' ? 'Sending…' : 'Email me my plan'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!plan}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-4 w-4" /> {copied ? 'Copied' : 'Copy text'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!plan}
            className="text-sm font-medium text-stone-600 underline-offset-4 hover:text-stone-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Download as .txt
          </button>
        </div>

        <div className="mt-4" aria-live="polite">
          {send.kind === 'sent' && (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">
              Sent. Check your inbox (and spam folder) for a message from Common Ground.
            </p>
          )}
          {send.kind === 'fallback' && (
            <div className="rounded-xl bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
              <p className="font-semibold">Automated email isn’t set up on this site yet.</p>
              <p className="mt-1">
                Use the copy or download buttons above, or {' '}
                {mailtoHref && (
                  <a
                    href={mailtoHref}
                    className="font-semibold underline underline-offset-2"
                  >
                    open your mail app
                  </a>
                )}{' '}
                with the plan pre-filled.
              </p>
            </div>
          )}
          {send.kind === 'error' && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-[13px] text-rose-800">
              {send.message}
            </p>
          )}
        </div>

        <p className="mt-5 text-[11.5px] leading-relaxed text-stone-500">
          We only send what’s in your plan summary — no medical or child details beyond what you wrote.
          Automated weekly reminder emails would require server-side scheduling and a real account, which this MVP doesn’t include.
        </p>
      </div>
    </div>
  );
}

function buildPlanText(plan: SavedCarePlan, checkIn: WeeklyCheckInEntry | null): string {
  const lines: string[] = [];
  lines.push('Common Ground — Your Plan');
  lines.push(`Saved: ${new Date(plan.updatedAt).toLocaleDateString()}`);
  lines.push('');
  lines.push('SUMMARY');
  lines.push(plan.summary);
  lines.push('');
  lines.push('YOUR NEXT STEPS');
  plan.steps.forEach((s, i) => {
    lines.push(`${i + 1}. ${s.title}`);
    lines.push(`   ${s.why}`);
    if (s.because) lines.push(`   ${s.because}`);
    lines.push('');
  });
  if (plan.resources.length) {
    lines.push('RESOURCES');
    plan.resources.forEach((r) => lines.push(`- ${r.label}`));
    lines.push('');
  }
  if (plan.weekMessage) {
    lines.push('FOR YOU, THIS WEEK');
    lines.push(plan.weekMessage);
    lines.push('');
  }
  if (checkIn) {
    lines.push(`WEEK ${checkIn.weekNumber} CHECK-IN`);
    lines.push(checkIn.summary);
    if (checkIn.nextSteps.length) {
      lines.push('');
      lines.push('What we’d try this week:');
      checkIn.nextSteps.forEach((s) => lines.push(`- ${s}`));
    }
    lines.push('');
  }
  lines.push('—');
  lines.push('Common Ground is parent support, not clinical care.');
  lines.push('In an emergency, call 911 or 988 (Suicide & Crisis Lifeline).');
  return lines.join('\n');
}
