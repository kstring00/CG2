import { Clock, Lock, MessageSquare, Send, UserRound } from 'lucide-react';
import { ClientDemoBanner } from '@/components/ui/ClientDemoBanner';

const thread = [
  {
    from: 'Dr. Ortiz (BCBA)',
    role: 'care-team',
    at: 'Yesterday · 4:12pm',
    body: 'Quick note — Mateo used his break card unprompted during snack today. Huge milestone. Want to try it at dinner this week and let me know how it goes?',
  },
  {
    from: 'You',
    role: 'parent',
    at: 'Yesterday · 6:40pm',
    body: 'Yes! We tried it tonight and he handed it to me before getting up from the table. Felt like a big moment for us.',
  },
  {
    from: 'Dr. Ortiz (BCBA)',
    role: 'care-team',
    at: 'Today · 8:02am',
    body: 'That is exactly what we were hoping for. I will have Jasmine reinforce it in tomorrow&apos;s session and we will keep the card visible at meals for the next two weeks.',
  },
];

export default function MessagesPage() {
  return (
    <div className="page-shell space-y-6">
      <header className="page-header">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Secure messaging
        </p>
        <h1 className="page-title">Reach your care team</h1>
        <p className="page-description">
          Message your BCBA or RBT directly. Typical response time is within one
          business day. For anything urgent, call the number on your intake paperwork.
        </p>
      </header>

      <ClientDemoBanner />

      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-[11px] font-semibold text-accent">
          <Lock className="h-3.5 w-3.5" /> HIPAA-protected
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold text-brand-muted-600">
          <Clock className="h-3.5 w-3.5" /> Response within 1 business day
        </span>
      </div>

      <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-brand-muted-900">
            Conversation with Dr. Ortiz
          </h2>
        </div>

        <ul className="mt-5 space-y-3">
          {thread.map((m, idx) => (
            <li
              key={idx}
              className={`rounded-2xl border p-4 ${
                m.role === 'parent'
                  ? 'border-primary/15 bg-primary/5 ml-10'
                  : 'border-accent/20 bg-accent/5 mr-10'
              }`}
            >
              <p className="flex items-center gap-2 text-xs font-semibold text-brand-muted-900">
                <UserRound className="h-3.5 w-3.5" /> {m.from}
                <span className="font-normal text-brand-muted-400">· {m.at}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted-700">
                {m.body}
              </p>
            </li>
          ))}
        </ul>

        <form className="mt-6 rounded-2xl border border-surface-border bg-surface-muted p-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-brand-muted-500">
            New message to Dr. Ortiz
          </label>
          <textarea
            disabled
            rows={3}
            placeholder="Message send is disabled in the prototype demo."
            className="mt-2 w-full resize-none rounded-xl border border-surface-border bg-white p-3 text-sm text-brand-muted-700 placeholder:text-brand-muted-400"
          />
          <button
            disabled
            className="mt-3 inline-flex cursor-not-allowed items-center gap-2 rounded-2xl bg-accent/40 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Send className="h-4 w-4" /> Send (demo)
          </button>
        </form>
      </section>
    </div>
  );
}
