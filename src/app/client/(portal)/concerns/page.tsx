'use client';

import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Heart,
  MessageSquare,
  Send,
} from 'lucide-react';
import { ClientDemoBanner } from '@/components/ui/ClientDemoBanner';
import { cn } from '@/lib/utils';

const quickTopics = [
  { label: "I don't understand something in the care plan", icon: HelpCircle },
  { label: "Something changed at home this week", icon: AlertCircle },
  { label: "Sleep or behavior has gotten harder", icon: AlertCircle },
  { label: "School is being difficult", icon: AlertCircle },
  { label: "I'm feeling overwhelmed", icon: Heart },
  { label: "I want to understand what my child's therapist is doing", icon: HelpCircle },
  { label: "Transitions, tantrums, or meltdowns are increasing", icon: AlertCircle },
  { label: "I have a question I don't know how to ask", icon: HelpCircle },
];

export default function ConcernsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleTopic = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-shell">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-12">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
          <h1 className="mt-5 text-2xl font-semibold text-brand-muted-900">
            We got it. Thank you for sharing.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-muted-600">
            Dr. Ortiz or a member of your care team will respond within one business day. You do
            not have to wait for the next session — questions belong here, not in your head.
          </p>
          <p className="mt-6 text-xs text-brand-muted-400">
            If this is urgent or you need someone now, call or text{' '}
            <a href="tel:988" className="font-semibold text-accent hover:underline">988</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <MessageSquare className="h-3.5 w-3.5" /> Questions &amp; Concerns
        </div>
        <h1 className="page-title">Tell us what&apos;s been hard lately.</h1>
        <p className="page-description">
          This is a warm, private space to share questions, concerns, or things that changed at
          home. No concern is too small. Your team reads every message.
        </p>
      </header>

      <ClientDemoBanner />

      {/* Reassurance strip */}
      <div className="rounded-3xl border border-primary/10 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <Heart className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold text-brand-muted-900">
              You do not need to have a polished question.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">
              "I don&apos;t know what to ask but something feels off" is a completely valid thing to send.
              So is "this week was really hard." Your care team is here to help you figure it out.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quick topic selector */}
        <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <ChevronDown className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-brand-muted-900">
              What is this about? <span className="text-sm font-normal text-brand-muted-500">(pick any that fit)</span>
            </h2>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {quickTopics.map((topic) => (
              <li key={topic.label}>
                <button
                  type="button"
                  onClick={() => toggleTopic(topic.label)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-all',
                    selected.includes(topic.label)
                      ? 'border-primary bg-primary/5 font-semibold text-primary'
                      : 'border-surface-border bg-surface-muted text-brand-muted-700 hover:border-primary/30 hover:text-brand-muted-900',
                  )}
                >
                  <topic.icon className={cn('h-4 w-4 shrink-0', selected.includes(topic.label) ? 'text-primary' : 'text-brand-muted-400')} />
                  {topic.label}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Free-text message */}
        <section className="rounded-3xl border border-surface-border bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-brand-muted-900">Tell us more</h2>
          </div>
          <p className="mt-1 text-sm text-brand-muted-500">
            Write as much or as little as feels right. There is no wrong way to say it.
          </p>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="This week has been hard because… / I noticed that… / I don't understand why… / I'm worried about…"
            className="mt-4 w-full resize-none rounded-2xl border border-surface-border bg-surface-muted p-4 text-sm leading-relaxed text-brand-muted-700 placeholder:text-brand-muted-400 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </section>

        {/* Urgency toggle */}
        <section className="rounded-3xl border border-surface-border bg-white p-5">
          <h2 className="text-sm font-semibold text-brand-muted-900">How urgent is this?</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: 'Just keeping you informed', color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
              { label: 'Needs attention this week', color: 'border-amber-200 bg-amber-50 text-amber-800' },
              { label: 'Please respond soon', color: 'border-accent/25 bg-accent/10 text-accent' },
            ].map((opt) => (
              <span
                key={opt.label}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${opt.color}`}
              >
                {opt.label}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-brand-muted-400">
            If this is a safety concern or emergency, call or text{' '}
            <a href="tel:988" className="font-semibold text-accent hover:underline">988</a> or go to your nearest ER.
          </p>
        </section>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
        >
          <Send className="h-4 w-4" /> Send to your care team
        </button>
      </form>
    </div>
  );
}
