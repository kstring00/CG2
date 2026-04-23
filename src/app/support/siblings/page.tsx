'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Users,
  Heart,
  BookOpen,
  Star,
  Smile,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/* ─── data ─────────────────────────────────────────────────── */

const ageGroups = [
  {
    range: 'Ages 3–6',
    tag: 'Simple explanations, big reassurance',
    color: 'sky',
    summary: 'At this age, siblings feel everything and understand more than adults give them credit for — but they lack the vocabulary to name it. They need simple truth, physical closeness, and proof that they\'re still loved.',
    sections: [
      {
        heading: 'How to explain it',
        content: 'Keep it concrete and honest: "Your brother\'s brain works a little differently than yours. That\'s why he needs extra help learning things. It doesn\'t mean he loves you less. It doesn\'t mean we love you less." Repeat this often. Young children need repetition to believe something is permanently true.',
      },
      {
        heading: 'What they\'re actually feeling',
        content: 'Confusion is the dominant emotion at this age — not jealousy (yet). Why does he get to have a tantrum when I don\'t? Why does she have a special helper? Why do grown-ups talk so quietly around her? Answer the questions they don\'t know how to ask.',
      },
      {
        heading: 'Play-based connection',
        content: 'Schedule deliberate sibling play that doesn\'t require the child with autism to perform or succeed. Play with slime, blocks, or water. Follow the younger sibling\'s lead for 20 minutes without redirecting anyone. Let the connection be messy and real.',
      },
      {
        heading: 'Reassurance they can absorb',
        content: 'This age group needs physical confirmation: hug them extra. Read them a book at bedtime. Ask about their day with genuine curiosity. Physical presence communicates safety in a way words can\'t fully reach.',
      },
    ],
  },
  {
    range: 'Ages 7–11',
    tag: 'Honest conversations, mixed feelings',
    color: 'emerald',
    summary: 'School-age siblings are now old enough to notice — and feel embarrassed, proud, jealous, and fiercely protective, sometimes all in the same day. This age group needs validation more than explanation. The goal is to help them name what they\'re feeling before it calcifies into shame.',
    sections: [
      {
        heading: 'The jealousy they won\'t say out loud',
        content: '"Why does she get more attention?" is a fair question. Don\'t deny it — acknowledge it: "You\'re right that we spend more time on his needs right now. That\'s not because you matter less. It\'s because he needs more right now, and that\'s not your fault and it\'s not fair, and we know that." Fair witness to injustice goes further than denial.',
      },
      {
        heading: 'Embarrassment at school',
        content: 'If the sibling with autism has public meltdowns or unusual behavior, school-age kids often feel social fallout. Let them talk about it without shame: "It sounds like that was embarrassing. You\'re allowed to feel that way. Do you want to talk about what to say to your friends?" Giving them scripts for their peers helps.',
      },
      {
        heading: 'Pride and protective instinct',
        content: 'Many siblings this age are fierce advocates for their sibling on the playground — and that deserves to be named and celebrated. "I noticed you stood up for your brother today. That was brave." Don\'t take that loyalty for granted or let it go unseen.',
      },
      {
        heading: 'What they need from you',
        content: 'One night a month that is theirs completely — pick the dinner, the activity, the movie. No talk about therapy. Their world, their choices, your full attention. This matters more than you think it does.',
      },
    ],
  },
  {
    range: 'Ages 12–16',
    tag: 'Real conversations, real inclusion',
    color: 'violet',
    summary: 'Adolescent siblings are forming their own identities and often doing it in the shadow of a family narrative that centers someone else. They need to be included in understanding what\'s happening — not managed or protected from it. Their questions deserve real answers.',
    sections: [
      {
        heading: 'Include them in understanding ABA',
        content: 'If they ask what therapy is, tell them. Explain what the goals are. You don\'t need to share clinical data — but including a 14-year-old in the general narrative of what\'s happening helps them feel like a member of the family, not a bystander in it. "We\'re working on communication skills right now. The goal is for him to be able to ask for what he wants more clearly."',
      },
      {
        heading: 'Their own identity is at stake',
        content: 'At this age, siblings often struggle with the question: "Is my whole identity \'person with a disabled sibling?\'  Do I want that to define me?" These questions are healthy and deserve space. Let them explore their own identity without guilt about wanting a life that is their own.',
      },
      {
        heading: 'The resentment that builds in silence',
        content: 'If mixed feelings have never been validated, adolescent siblings may carry years of unnamed resentment that eventually surfaces as distance or conflict. Check in directly: "I know this family asks a lot of you. I want to hear how you\'re actually doing — not the version you think I want to hear."',
      },
      {
        heading: 'Give them agency',
        content: 'Let them participate in decisions about family plans, holiday accommodations, and public outings at their comfort level. Agency is respect. Being consulted rather than managed is enormously meaningful to a teenager.',
      },
    ],
  },
  {
    range: 'Ages 17+',
    tag: 'Adult sibling role, advocacy, their own processing',
    color: 'amber',
    summary: 'Adult and emerging-adult siblings are often silently processing enormous questions about the future: Will I be responsible for my sibling? What does my life look like with this? These questions deserve direct conversation and supported space — not assumptions.',
    sections: [
      {
        heading: 'The future caregiving question',
        content: '"Will I have to take care of them someday?" is the question many adult siblings carry alone. Have the conversation explicitly: share what your plans are, what your expectations are (or aren\'t), and give them room to express their own feelings about it. Uncertainty is worse than a hard truth.',
      },
      {
        heading: 'Their own grief and processing',
        content: 'Adult siblings may not have had space to grieve the childhood they expected. They may love their sibling deeply and also carry real pain. Both are true simultaneously. If you sense this, naming it creates permission: "I think you might have some grief about all of this too. You\'re allowed to."',
      },
      {
        heading: 'Supporting their advocacy',
        content: 'Many adult siblings become fierce advocates — in their careers, communities, or policy spaces. If your older child shows this impulse, connect them with sibling support networks, the Sibling Leadership Network, or Autism Speaks advocacy programs. That instinct is a gift.',
      },
      {
        heading: 'The sibling relationship itself',
        content: 'As children age into adulthood, the sibling relationship changes shape. Support connection that doesn\'t depend on proximity — structured video calls, shared interests, and activities designed around what the sibling with autism enjoys and can access. The relationship is worth investing in.',
      },
    ],
  },
];

const strugglingSignals = [
  {
    icon: AlertCircle,
    color: 'amber',
    title: 'Withdrawal from family activities',
    desc: 'Increasingly absent at mealtimes, family outings, or any context that involves the whole family. May be spending more time alone in their room or at friends\' homes.',
  },
  {
    icon: AlertCircle,
    color: 'rose',
    title: 'Acting out or picking fights',
    desc: 'Increased irritability, arguments, or provocative behavior — often a bid for attention that has been structurally difficult to give. The behavior is communication.',
  },
  {
    icon: AlertCircle,
    color: 'amber',
    title: 'Sudden regression',
    desc: 'A child who was previously independent starts wetting the bed, clinging, having meltdowns, or reverting to younger behaviors. This is often an unconscious attempt to receive the attention their sibling gets.',
  },
  {
    icon: AlertCircle,
    color: 'violet',
    title: 'Becoming "too perfect"',
    desc: 'The sibling who never complains, never asks for anything, always says they\'re fine — and is being invisible on purpose. This child has learned that their needs are secondary and has adapted by erasing them. This pattern is often the most overlooked.',
  },
  {
    icon: AlertCircle,
    color: 'rose',
    title: 'Anxiety or sleep issues',
    desc: 'New fear of school, nightmares, stomach aches with no medical cause. Siblings often absorb household stress somatically before they can name it emotionally.',
  },
  {
    icon: AlertCircle,
    color: 'amber',
    title: 'Talking about fairness constantly',
    desc: '"It\'s not fair" repeated and escalating — the verbal version of a child trying to articulate an injustice they feel but can\'t fully name. Underneath it is usually a need for acknowledgment, not an argument to be won.',
  },
];

const siblingGuilts = [
  'Feeling relieved when their sibling is at therapy and they have their parent\'s full attention',
  'Feeling embarrassed by their sibling\'s behavior in public',
  'Wishing their sibling were "normal" — even for a moment',
  'Feeling angry about the way the family\'s plans revolve around their sibling\'s needs',
  'Not wanting to bring friends home because of unpredictability',
  'Feeling guilty for having all the things their sibling struggles with — friends, school, language',
];

const books = [
  {
    title: 'We\'ll Paint the Octopus Red',
    ages: '4–8',
    desc: 'A young girl learns her new baby sibling has Down syndrome and discovers what can and can\'t change.',
    color: 'sky',
  },
  {
    title: 'My Brother Charlie',
    ages: '5–10',
    desc: 'Written by Holly Robinson Peete and her daughter Ryan, about growing up with a brother with autism. Warm, specific, and real.',
    color: 'emerald',
  },
  {
    title: 'The Reason I Jump',
    ages: '12+',
    desc: 'Written by a 13-year-old with non-verbal autism. Profound for siblings trying to understand their sibling\'s inner world.',
    color: 'violet',
  },
  {
    title: 'Views from Our Shoes',
    ages: '10–16',
    desc: 'A collection of first-person essays by siblings of children with disabilities. Validating, honest, and diverse.',
    color: 'amber',
  },
  {
    title: 'Sibling Support Project (online)',
    ages: 'All ages',
    desc: 'sibshops.org — workshop programs specifically for siblings of kids with disabilities. Available in many communities and online.',
    color: 'rose',
  },
];

const colorMap: Record<string, { card: string; tag: string; accent: string }> = {
  sky: {
    card: 'border-sky-200 bg-sky-50',
    tag: 'bg-sky-100 text-sky-700',
    accent: 'text-sky-600',
  },
  emerald: {
    card: 'border-emerald-200 bg-emerald-50',
    tag: 'bg-emerald-100 text-emerald-700',
    accent: 'text-emerald-600',
  },
  violet: {
    card: 'border-violet-200 bg-violet-50',
    tag: 'bg-violet-100 text-violet-700',
    accent: 'text-violet-600',
  },
  amber: {
    card: 'border-amber-200 bg-amber-50',
    tag: 'bg-amber-100 text-amber-700',
    accent: 'text-amber-600',
  },
  rose: {
    card: 'border-rose-200 bg-rose-50',
    tag: 'bg-rose-100 text-rose-700',
    accent: 'text-rose-600',
  },
};

const signalColorMap: Record<string, string> = {
  amber: 'border-amber-200 bg-amber-50 text-amber-600',
  rose: 'border-rose-200 bg-rose-50 text-rose-600',
  violet: 'border-violet-200 bg-violet-50 text-violet-600',
};

/* ─── component ────────────────────────────────────────────── */

export default function SiblingsPage() {
  const [openAge, setOpenAge] = useState<number | null>(0);
  const [openSection, setOpenSection] = useState<Record<number, number | null>>({});

  function toggleSection(ageIdx: number, secIdx: number) {
    setOpenSection((prev) => ({
      ...prev,
      [ageIdx]: prev[ageIdx] === secIdx ? null : secIdx,
    }));
  }

  return (
    <div className="page-shell">

      {/* ══════════════════════════════════════════
          SECTION 1 — SEEN
          "We see the invisible child."
      ══════════════════════════════════════════ */}

      {/* Hero header */}
      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1.5 text-xs font-semibold text-brand-plum-700">
          <Users className="h-3.5 w-3.5" /> For siblings — and the parents watching them
        </div>
        <h1 className="page-title text-3xl font-bold sm:text-4xl">
          The invisible child
        </h1>
        <p className="page-description text-base leading-relaxed">
          In families where one child has significant needs, another child often quietly disappears
          into the background. Not through neglect — through the sheer gravitational pull of a child
          who needs more. This page is for the child who needed less and learned to ask for even
          less than that.
        </p>
      </header>

      {/* The honest opening */}
      <div className="rounded-3xl border-2 border-brand-plum-200 bg-gradient-to-br from-brand-plum-50 to-white p-6 sm:p-8">
        <div className="flex gap-4">
          <Heart className="mt-1 h-6 w-6 shrink-0 text-brand-plum-400" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-plum-400 mb-2">
              What we know about siblings
            </p>
            <p className="text-base leading-relaxed text-brand-plum-900">
              Research on neurotypical siblings of children with autism consistently shows they are
              at elevated risk for anxiety, depression, and social difficulty — not because something
              is wrong with them, but because their environment places enormous invisible demands on
              them. They adapt. They become capable, independent, low-maintenance. And in doing so,
              they often stop letting you see how much they need too.
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 2 — GROUNDED
          "Here's what to know at each age."
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          Age by age
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* Age-by-age accordion */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">What siblings need — at each stage</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          A three-year-old sibling and a seventeen-year-old sibling are living in completely
          different emotional worlds. What they need from you is different too. Open the age group
          that matches your child.
        </p>
        <div className="space-y-3">
          {ageGroups.map((group, ageIdx) => {
            const colors = colorMap[group.color];
            return (
              <div
                key={group.range}
                className={`rounded-2xl border transition-all ${
                  openAge === ageIdx ? colors.card : 'border-surface-border bg-surface-muted'
                }`}
              >
                <button
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  onClick={() => {
                    setOpenAge(openAge === ageIdx ? null : ageIdx);
                    setOpenSection({});
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colors.tag}`}>
                      {group.range}
                    </span>
                    <span className="text-sm font-semibold text-brand-muted-900">{group.tag}</span>
                  </div>
                  {openAge === ageIdx
                    ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
                    : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
                </button>
                {openAge === ageIdx && (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed text-brand-muted-700 mb-4 italic border-b border-surface-border pb-4">
                      {group.summary}
                    </p>
                    <div className="space-y-2">
                      {group.sections.map((sec, secIdx) => (
                        <div
                          key={sec.heading}
                          className="rounded-xl border border-surface-border bg-white overflow-hidden"
                        >
                          <button
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                            onClick={() => toggleSection(ageIdx, secIdx)}
                          >
                            <span className="text-sm font-semibold text-brand-muted-900">{sec.heading}</span>
                            {openSection[ageIdx] === secIdx
                              ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
                              : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
                          </button>
                          {openSection[ageIdx] === secIdx && (
                            <div className="px-4 pb-4">
                              <p className="text-sm leading-relaxed text-brand-muted-600">{sec.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Signs a sibling is struggling */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Signs a sibling is struggling</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          These signals are not bad behavior. They are communication from a child who doesn&apos;t
          have the words — or who has learned that their words don&apos;t change anything. Pay
          attention to the pattern more than the individual incident.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {strugglingSignals.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className={`flex gap-3 rounded-2xl border p-4 ${signalColorMap[color]}`}>
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-relaxed opacity-80">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">A note on the &ldquo;too perfect&rdquo; child</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-700">
            This is the most commonly missed signal. The sibling who never complains is often the
            sibling who needs the most attention. Their invisibility is not contentment — it is
            adaptation. Check in with that child specifically and regularly.
          </p>
        </div>
      </section>

      {/* The guilt siblings feel */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-brand-plum-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">The guilt siblings feel — and how to name it with them</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          Siblings carry guilt that they often haven&apos;t named and haven&apos;t been given
          permission to release. The act of naming it — before they do — signals that their inner
          experience is acceptable and seen.
        </p>
        <p className="mb-4 text-sm font-semibold text-brand-muted-700">
          Things siblings feel guilty for feeling:
        </p>
        <ul className="space-y-2 mb-5">
          {siblingGuilts.map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-2xl border border-surface-border bg-surface-muted px-4 py-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum-400" />
              <p className="text-sm leading-relaxed text-brand-muted-700">{item}</p>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-brand-plum-200 bg-brand-plum-50 p-4">
          <p className="text-sm font-semibold text-brand-plum-800 mb-2">How to start the conversation</p>
          <p className="text-sm leading-relaxed text-brand-plum-700 italic">
            &ldquo;Sometimes kids feel embarrassed, or left out, or even a little jealous when their
            sibling needs so much attention. That would be totally normal — and I want you to know
            you can tell me any of that without getting in trouble.&rdquo;
          </p>
          <p className="mt-3 text-sm leading-relaxed text-brand-plum-700">
            You don&apos;t have to wait for them to bring it up. Opening the door is enough.
          </p>
        </div>
      </section>

      {/* 1:1 time */}
      <section className="rounded-3xl border-2 border-primary/20 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Smile className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Dedicated 1:1 time — what actually works</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
          A sibling who gets real, uninterrupted time with a parent will regulate more, act out less,
          and feel genuinely less resentful — even if the time is small. The key word is
          &ldquo;real.&rdquo; Distracted presence doesn&apos;t count to a child.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: 'Let them choose the entire activity',
              desc: 'No suggestions. No redirecting. Whatever they want to do for that hour, you do it. Their preferences matter more than efficiency.',
            },
            {
              title: 'Announce it as theirs',
              desc: '"This is your time. No phones, no interruptions, no talking about your brother unless you want to." Naming it makes it land differently.',
            },
            {
              title: 'Don\'t wait for a big block of time',
              desc: '20 focused minutes beats a distracted afternoon. Frequency matters more than duration. Twice a week for 20 minutes is worth more than one annual day trip.',
            },
            {
              title: 'Debrief after, not during',
              desc: 'During their time, just be present. After, if they open up about the family situation, follow their lead. Don\'t use their 1:1 time as a processing session unless they initiate it.',
            },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
              <p className="text-sm font-semibold text-brand-muted-900">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Books */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Books and resources for siblings</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          Reading about other kids in similar situations is enormously validating for siblings.
          These books and resources are worth keeping accessible — on the nightstand, not the shelf.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {books.map((book) => {
            const colors = colorMap[book.color];
            return (
              <div key={book.title} className={`rounded-2xl border p-4 ${colors.card}`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-brand-muted-900">{book.title}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${colors.tag}`}>
                    {book.ages}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-brand-muted-600">{book.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Talking to teachers */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Talking to teachers and school counselors</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          A school counselor who knows what&apos;s happening at home can be a powerful support for
          a sibling — checking in regularly, watching for signs of stress, and providing a neutral
          space for the child to process without feeling like they&apos;re burdening their parents.
        </p>
        <div className="space-y-4">
          {[
            {
              title: 'What to tell the teacher at the start of the year',
              content: '"We have a child with autism in our family who has complex needs. Our other child, [name], sometimes carries stress from that at home. I want you to know so if you notice anything — withdrawal, anxiety, behavior changes — you can tell me and we can address it together."',
            },
            {
              title: 'What to tell the school counselor',
              content: '"I\'d like [name] to check in with you periodically, not because anything is wrong, but because they might need a neutral place to talk about what\'s hard at home. They won\'t always bring it to me — and that\'s okay — but I want them to have somewhere to put it."',
            },
            {
              title: 'What the sibling needs permission to say at school',
              content: 'Help them find age-appropriate language for their peers: "My brother has autism. That\'s why sometimes he does things that look different." You don\'t need to share more than that. Practice this with them so it feels natural, not heavy.',
            },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
              <p className="text-sm font-semibold text-brand-muted-900 mb-2">{item.title}</p>
              <p className="text-sm leading-relaxed text-brand-muted-600 italic">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — HOPEFUL
          Direct note to the sibling
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          For the sibling
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* Note directly to the sibling */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-plum-50 via-white to-sky-50 border border-brand-plum-200 p-8 shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-surface-border shadow-soft mb-5">
          <Star className="h-6 w-6 text-amber-400" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400 text-center mb-4">
          A note for the sibling — written for them, for you to share
        </p>
        <div className="max-w-lg mx-auto space-y-4 text-sm leading-relaxed text-brand-muted-800">
          <p>
            This is hard. What is happening in your family is hard — and no one should tell you
            it&apos;s not, or that you shouldn&apos;t have big feelings about it.
          </p>
          <p>
            If you feel jealous sometimes, that makes sense. If you feel embarrassed sometimes,
            that makes sense. If you feel proud of your sibling and frustrated with them in the same
            hour — that makes sense too. Feelings can be complicated. They don&apos;t have to be
            neat, and they don&apos;t make you a bad person.
          </p>
          <p>
            Your needs matter. Your feelings matter. You are not forgotten — even when it might
            feel that way. The grownups in your life are doing their best, and sometimes their best
            means you get less than you deserve. That&apos;s not your fault.
          </p>
          <p className="font-semibold text-brand-muted-900">
            You are not forgotten. You are loved. And you are allowed to say when things are hard.
          </p>
        </div>
      </div>

      {/* Closing CTAs */}
      <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-sky-50/40 to-white border border-primary/10 p-8 text-center shadow-soft">
        <h2 className="text-xl font-bold text-brand-muted-900">
          Your whole family matters — not just the child in therapy.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-brand-muted-600">
          Supporting siblings well makes the family stronger — and ultimately, it makes the
          entire ABA journey more sustainable for everyone. You don&apos;t have to choose between
          your children&apos;s wellbeing. They both count.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/support/caregiver"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
          >
            Caregiver support <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/support/connect"
            className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition hover:bg-surface-muted"
          >
            <Users className="h-4 w-4" /> Connect with other families
          </Link>
        </div>
      </div>

    </div>
  );
}
