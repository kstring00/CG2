'use client';

import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const stages = [
  {
    number: 1,
    label: 'Assessment',
    shortLabel: 'Assessment &\nGoal Setting',
    color: '#1a2e52',
    lightColor: '#eef1f8',
    borderColor: '#a9b6d2',
    emoji: '📋',
    tagline: 'Where your child\'s journey begins.',
    description:
      'Before a single therapy session starts, your child\'s BCBA conducts a Functional Behavior Assessment (FBA). This is where we listen — to your child, and to you. We observe behaviors, identify what drives them, understand your family\'s goals, and build a program around your child specifically. No templates. No guesswork.',
    whatHappens: [
      'BCBA meets with you and your child to observe and assess',
      'Functional Behavior Assessment (FBA) identifies the "why" behind behaviors',
      'Parent interview — your input directly shapes the goals',
      'Behavior and skill targets are defined and prioritized',
      'A detailed, individualized treatment plan is created',
    ],
    whatToExpect:
      'This phase typically takes 1–2 weeks. You\'ll leave with a clear treatment plan and know exactly what your child will be working toward — and why.',
    forParents:
      'Ask questions. This is your chance to make sure the goals reflect what matters most to your family at home, at school, and in the community.',
  },
  {
    number: 2,
    label: 'Skill Building',
    shortLabel: 'Developing\nSkills',
    color: '#065f46',
    lightColor: '#ecfdf5',
    borderColor: '#6ee7b7',
    emoji: '🌱',
    tagline: 'Building the foundation, one skill at a time.',
    description:
      'This is the core of therapy — where real growth happens. Your child\'s RBT works with them daily, using play-based techniques and positive reinforcement to teach communication, self-care, daily living skills, and adaptive behavior. Every session is tracked with data so the BCBA can see what\'s working and adjust in real time.',
    whatHappens: [
      'Daily sessions with your child\'s Registered Behavior Technician (RBT)',
      'Targeting functional communication — how your child expresses needs',
      'Building adaptive behavior and daily living skills (routines, self-care)',
      'Positive reinforcement drives every learning moment',
      'BCBA reviews data weekly and adjusts goals as your child grows',
    ],
    whatToExpect:
      'Progress is not always linear — and that\'s normal. Some weeks feel like leaps. Others feel quiet. The data tells the real story, and your BCBA is watching it closely.',
    forParents:
      'You\'ll receive regular updates from your child\'s team. The skills being built in therapy are most powerful when they\'re practiced at home too — your BCBA will show you how.',
  },
  {
    number: 3,
    label: 'Generalization',
    shortLabel: 'Generalizing\nSkills',
    color: '#92400e',
    lightColor: '#fffbeb',
    borderColor: '#fcd34d',
    emoji: '🌍',
    tagline: 'Skills that only work in one room aren\'t really learned yet.',
    description:
      'This is where therapy gets real. Generalization means your child applies what they\'ve learned across different people, places, and situations — not just with their RBT in the clinic. This is why Texas ABA Centers works across home, school, clinic, and community environments. Real life is the goal.',
    whatHappens: [
      'Skills practiced with multiple people (RBTs, BCBAs, family, teachers)',
      'Therapy moves into home, school, and community settings',
      'Grocery stores, playgrounds, classrooms — real environments, real practice',
      'Your child learns to use skills with anyone, anywhere',
      'Family coaching intensifies so you can reinforce skills at home',
    ],
    whatToExpect:
      'You may notice your child using skills at home that they learned in therapy — that\'s generalization working. This phase is deeply satisfying to watch.',
    forParents:
      'This is where your involvement pays the biggest dividends. When you use the same language and reinforcement strategies as the therapy team, skills stick faster and last longer.',
  },
  {
    number: 4,
    label: 'Reduced Support',
    shortLabel: 'Reduced\nSupport',
    color: '#5b21b6',
    lightColor: '#f5f3ff',
    borderColor: '#c4b5fd',
    emoji: '🦋',
    tagline: 'The goal was never dependence on us.',
    description:
      'As your child masters skills and internalizes what they\'ve learned, the therapy team intentionally steps back. Prompts are faded, reinforcement schedules are thinned, and your child is encouraged to problem-solve and self-manage. This is not reducing care — it\'s building independence. It\'s one of the most important phases of the whole program.',
    whatHappens: [
      'Systematic fading of prompts and therapist support',
      'Reinforcement schedules are adjusted to build intrinsic motivation',
      'Child practices independent problem-solving and self-management',
      'Therapy frequency may reduce as mastery increases',
      'Family and natural supports take on a larger role',
    ],
    whatToExpect:
      'Your child may seem to need less help — because they do. That\'s the goal. This phase can feel bittersweet, but it\'s a sign that everything is working.',
    forParents:
      'Trust the process here. Stepping back at the right time is a clinical decision your BCBA makes based on data — not a sign that your child is being left on their own.',
  },
  {
    number: 5,
    label: 'Transition',
    shortLabel: 'Transition to\nIndependence',
    color: '#be185d',
    lightColor: '#fdf2f8',
    borderColor: '#f9a8d4',
    emoji: '🎓',
    tagline: 'This was always the destination.',
    description:
      'Graduation. Your child transitions to natural supports — their school, their community, their family — with the skills and independence they\'ve built over the course of their program. Some children transition to less intensive care. Others are ready for full independence. Either way, this moment is celebrated. It\'s what everything was building toward.',
    whatHappens: [
      'Transition plan created with family, BCBA, and school team',
      'Child moves toward school-based services, natural supports, or less intensive care',
      'Milestone celebrations for the child and family',
      'Handoff materials and guidance provided to receiving team',
      'Texas ABA Centers remains a resource even after graduation',
    ],
    whatToExpect:
      'This looks different for every child. Some graduate in 18 months. Some take longer. The timeline is based on your child\'s progress — not a calendar.',
    forParents:
      'You helped get your child here. The advocacy, the appointments, the hard days — they all led to this. This moment belongs to your whole family.',
  },
];

const connectorColors = ['#1a2e52', '#065f46', '#92400e', '#5b21b6'];

export default function PathToIndependence() {
  const [active, setActive] = useState<number | null>(null);

  const selected = active !== null ? stages[active] : null;

  return (
    <div className="rounded-3xl border overflow-hidden" style={{ borderColor: '#d4d8e3', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 sm:px-8" style={{ backgroundColor: '#f4efe8', borderBottom: '1px solid #e8e0d8' }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: '#1a2e52' }}>
          Texas ABA Centers
        </p>
        <h3 className="text-xl font-bold mb-1" style={{ color: '#1a2e52' }}>
          Path to Independence
        </h3>
        <p className="text-sm" style={{ color: '#5a5d64' }}>
          Our goal is independence — not long-term dependence on services.{' '}
          <span className="font-medium" style={{ color: '#1a2e52' }}>Tap any stage to learn what happens there.</span>
        </p>
      </div>

      {/* Interactive stage track */}
      <div className="px-6 py-8 sm:px-8">
        {/* Desktop: horizontal winding path */}
        <div className="relative">
          {/* Path connector line */}
          <div className="hidden sm:block absolute top-10 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: '#e8e6ef', top: '28px' }} />

          {/* Stages */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
            {stages.map((stage, i) => (
              <div key={i} className="flex sm:flex-col sm:items-center sm:flex-1 gap-4 sm:gap-0">
                {/* Mobile connector */}
                {i > 0 && (
                  <div className="flex-shrink-0 w-1 h-8 rounded-full sm:hidden self-center ml-7" style={{ backgroundColor: connectorColors[i - 1] }} />
                )}

                <button
                  onClick={() => setActive(active === i ? null : i)}
                  className="relative flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-full text-lg font-black text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 z-10"
                  style={{
                    backgroundColor: stage.color,
                    boxShadow: active === i
                      ? `0 0 0 4px ${stage.color}40, 0 8px 24px ${stage.color}60`
                      : `0 4px 16px ${stage.color}40`,
                    transform: active === i ? 'scale(1.15)' : undefined,
                  }}
                  aria-label={`Stage ${stage.number}: ${stage.label}`}
                >
                  {stage.emoji}
                </button>

                <div className="flex-1 sm:flex-none sm:mt-3 sm:text-center">
                  <p className="text-xs font-bold leading-tight" style={{ color: stage.color }}>
                    {stage.shortLabel.split('\n').map((line, li) => (
                      <span key={li} className="block">{line}</span>
                    ))}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: '#8f9299' }}>Stage {stage.number}</p>
                </div>
              </div>
            ))}
          </div>

          {/* START label */}
          <div className="hidden sm:flex absolute -bottom-6 left-0 items-center gap-1">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#1a2e52' }} />
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#8f9299' }}>Start</span>
          </div>
          {/* END label */}
          <div className="hidden sm:flex absolute -bottom-6 right-0 items-center gap-1">
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#be185d' }}>Graduation</span>
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#be185d' }} />
          </div>
        </div>

        {/* Detail panel — expands below track */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: selected ? '800px' : '0', marginTop: selected ? '48px' : '0', opacity: selected ? 1 : 0 }}
        >
          {selected && (
            <div
              className="rounded-2xl p-5 sm:p-6 relative"
              style={{ backgroundColor: selected.lightColor, border: `1.5px solid ${selected.borderColor}` }}
            >
              {/* Close button */}
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full transition hover:opacity-70"
                style={{ backgroundColor: selected.color + '20', color: selected.color }}
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Stage header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-2xl shadow-sm" style={{ backgroundColor: selected.color + '15' }}>
                  {selected.emoji}
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: selected.color }}>Stage {selected.number}</p>
                  <h4 className="text-lg font-bold leading-tight" style={{ color: '#1a2e52' }}>{selected.label}</h4>
                  <p className="text-xs italic mt-0.5" style={{ color: '#5a5d64' }}>{selected.tagline}</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: '#34363b' }}>{selected.description}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* What happens */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: selected.color }}>What happens in this stage</p>
                  <ul className="space-y-2">
                    {selected.whatHappens.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#474950' }}>
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: selected.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What to expect + for parents */}
                <div className="space-y-4">
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: `1px solid ${selected.borderColor}` }}>
                    <p className="text-[11px] font-bold uppercase tracking-wide mb-1.5" style={{ color: selected.color }}>What to expect</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#474950' }}>{selected.whatToExpect}</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'white', border: `1px solid ${selected.borderColor}` }}>
                    <p className="text-[11px] font-bold uppercase tracking-wide mb-1.5" style={{ color: selected.color }}>For parents</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#474950' }}>{selected.forParents}</p>
                  </div>
                </div>
              </div>

              {/* Navigation between stages */}
              <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: `1px solid ${selected.borderColor}` }}>
                <button
                  onClick={() => setActive(Math.max(0, active! - 1))}
                  disabled={active === 0}
                  className="text-xs font-semibold flex items-center gap-1 transition disabled:opacity-30"
                  style={{ color: selected.color }}
                >
                  ← Previous stage
                </button>
                <div className="flex gap-1.5">
                  {stages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: active === i ? '20px' : '8px',
                        backgroundColor: active === i ? selected.color : '#d4d8e3',
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActive(Math.min(stages.length - 1, active! + 1))}
                  disabled={active === stages.length - 1}
                  className="text-xs font-semibold flex items-center gap-1 transition disabled:opacity-30"
                  style={{ color: selected.color }}
                >
                  Next stage →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-5 sm:px-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4">
          {['Person-centered', 'Family collaboration', 'Evidence-based', 'Compassionate support'].map((v) => (
            <span key={v} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#5a5d64' }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#1a2e52' }} />
              {v}
            </span>
          ))}
        </div>
        <a
          href="tel:8777715725"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition hover:opacity-90"
          style={{ backgroundColor: '#1a2e52' }}
        >
          Start your journey →
        </a>
      </div>
    </div>
  );
}
