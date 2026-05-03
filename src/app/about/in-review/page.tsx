'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Hammer, MessageSquare } from 'lucide-react';

const realToday = [
  'Verified provider listings (the ones tagged "Verified by Texas ABA Centers")',
  'The resource library',
  'The intake flow',
  'The wellness check-in tool',
  'Still Waters journaling',
  'Crisis access (988, Harris Center, 911)',
];

const stillBuilding = [
  'Pathfinder matching — real human navigators are being onboarded now',
  'Parent-to-parent matching pool',
  'Additional verified providers across more counties',
  'The full caregiver resource library',
];

export default function InReviewPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [page, setPage] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const existing = JSON.parse(window.localStorage.getItem('cg.feedback.v1') || '[]');
      existing.push({
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        name: name || null,
        email,
        page,
        notes,
        createdAt: new Date().toISOString(),
      });
      window.localStorage.setItem('cg.feedback.v1', JSON.stringify(existing));
    } catch {
      // ignore — submission is best-effort while there is no backend
    }
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-brand-muted-600 hover:text-brand-muted-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Common Ground
      </Link>

      <h1 className="mt-6 text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
        Common Ground is being built in the open.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-brand-muted-700">
        This site is currently in review with families, providers, and partners.
        We&rsquo;re showing it before it&rsquo;s finished &mdash; on purpose.
        Feedback shapes what gets built next.
      </p>

      <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 sm:p-6">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-800">
          <CheckCircle2 className="h-4 w-4" /> What&rsquo;s real today
        </h2>
        <ul className="mt-3 space-y-1.5 text-[14px] text-emerald-900/90">
          {realToday.map((item) => (
            <li key={item} className="leading-relaxed">&middot; {item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-800">
          <Hammer className="h-4 w-4" /> What&rsquo;s still being built
        </h2>
        <ul className="mt-3 space-y-1.5 text-[14px] text-amber-900/90">
          {stillBuilding.map((item) => (
            <li key={item} className="leading-relaxed">&middot; {item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl border border-surface-border bg-white p-5 sm:p-6">
        <h2 className="text-base font-semibold text-brand-navy-700">
          Why we&rsquo;re showing it now
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-700">
          Parents need help whether we&rsquo;re &ldquo;done&rdquo; or not. The choice was wait until perfect, or open the doors and keep building. We chose the second.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-brand-navy-700">
          <MessageSquare className="h-4 w-4" /> Tell us what you noticed
        </h2>
        {submitted ? (
          <p className="mt-3 text-[14px] leading-relaxed text-brand-muted-700">
            Thank you. We read every note. It shapes what we build next.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-brand-muted-500">
                  Name (optional)
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-brand-muted-500">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-brand-muted-500">
                What page
              </span>
              <input
                type="text"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                placeholder="e.g. Find Local Help"
                className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-brand-muted-500">
                What you noticed
              </span>
              <textarea
                required
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 w-full rounded-xl border border-surface-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
            >
              Send feedback
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
