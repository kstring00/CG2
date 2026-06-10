'use client';

import { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Heart,
  Smile,
  Star,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BadgePill,
  GuideCard,
  GuideSectionHeading,
  SupportActionCard,
  SupportCalloutBand,
} from '@/components/support/GuideCards';
import {
  SectionChooser,
  type ChooserSection,
} from '@/components/support/SectionChooser';

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
    color: 'amber',
    title: 'Withdrawal from family activities',
    desc: 'Increasingly absent at mealtimes, family outings, or any context that involves the whole family. May be spending more time alone in their room or at friends\' homes.',
  },
  {
    color: 'rose',
    title: 'Acting out or picking fights',
    desc: 'Increased irritability, arguments, or provocative behavior — often a bid for attention that has been structurally difficult to give. The behavior is communication.',
  },
  {
    color: 'amber',
    title: 'Sudden regression',
    desc: 'A child who was previously independent starts wetting the bed, clinging, having meltdowns, or reverting to younger behaviors. This is often an unconscious attempt to receive the attention their sibling gets.',
  },
  {
    color: 'violet',
    title: 'Becoming "too perfect"',
    desc: 'The sibling who never complains, never asks for anything, always says they\'re fine — and is being invisible on purpose. This child has learned that their needs are secondary and has adapted by erasing them. This pattern is often the most overlooked.',
  },
  {
    color: 'rose',
    title: 'Anxiety or sleep issues',
    desc: 'New fear of school, nightmares, stomach aches with no medical cause. Siblings often absorb household stress somatically before they can name it emotionally.',
  },
  {
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

const oneOnOnePrinciples = [
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

const teacherScripts = [
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
];

/** Badge-pill + icon tints per accent color (same palette as resource pills). */
const ACCENT: Record<string, { badge: string; icon: string }> = {
  rose:    { badge: 'border-rose-200 bg-rose-50 text-rose-700',          icon: 'text-rose-500' },
  amber:   { badge: 'border-amber-200 bg-amber-50 text-amber-700',       icon: 'text-amber-500' },
  violet:  { badge: 'border-violet-200 bg-violet-50 text-violet-700',    icon: 'text-violet-500' },
  sky:     { badge: 'border-sky-200 bg-sky-50 text-sky-700',             icon: 'text-sky-500' },
  emerald: { badge: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: 'text-emerald-500' },
};

/* ─── section panels ───────────────────────────────────────── */

function AgePanel() {
  const [ageIdx, setAgeIdx] = useState(0);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const group = ageGroups[ageIdx];
  const accent = ACCENT[group.color];

  return (
    <div>
      <GuideSectionHeading
        icon={Star}
        title="What siblings need — at each stage"
        meta="4 stages"
      />
      <p className="-mt-2 mb-4 text-[13px] leading-relaxed text-brand-muted-600">
        A three-year-old sibling and a seventeen-year-old sibling are living in completely
        different emotional worlds. What they need from you is different too. Open the age group
        that matches your child.
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose an age range">
        {ageGroups.map((g, i) => (
          <button
            key={g.range}
            type="button"
            aria-pressed={i === ageIdx}
            onClick={() => {
              setAgeIdx(i);
              setOpenSub(null);
            }}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition duration-200',
              i === ageIdx
                ? 'border-primary bg-primary text-white shadow-soft'
                : 'border-surface-border bg-white text-brand-muted-600 hover:border-brand-plum-200 hover:text-brand-plum-700',
            )}
          >
            {g.range}
          </button>
        ))}
      </div>
      <GuideCard as="div" className="mt-4">
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <BadgePill className={accent.badge}>{group.range}</BadgePill>
          <span className="text-[13px] font-semibold text-brand-navy-700">{group.tag}</span>
        </div>
        <p className="mb-4 border-b border-surface-border pb-4 text-[13px] italic leading-relaxed text-brand-muted-700">
          {group.summary}
        </p>
        <div className="divide-y divide-surface-border">
          {group.sections.map((sec, i) => {
            const isOpen = openSub === i;
            return (
              <div key={sec.heading}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenSub(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left"
                >
                  <span className="text-[14px] font-semibold text-brand-navy-700">{sec.heading}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-brand-muted-400 transition duration-200',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                <div className="toolbox-reveal grid" data-open={isOpen ? 'true' : 'false'}>
                  <div className="toolbox-reveal-inner min-h-0">
                    <div className="toolbox-reveal-content pb-3.5">
                      <p className="text-[13px] leading-relaxed text-brand-muted-600">{sec.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GuideCard>
    </div>
  );
}

function SignsPanel() {
  const [openSign, setOpenSign] = useState<string | null>(null);
  return (
    <div>
      <GuideSectionHeading
        icon={AlertCircle}
        title="Signs a sibling is struggling"
        meta="6 signals"
      />
      <p className="-mt-2 mb-4 text-[13px] leading-relaxed text-brand-muted-600">
        These signals are not bad behavior. They are communication from a child who doesn&apos;t
        have the words — or who has learned that their words don&apos;t change anything. Pay
        attention to the pattern more than the individual incident.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {strugglingSignals.map(({ color, title, desc }) => {
          const isOpen = openSign === title;
          return (
            <GuideCard as="div" key={title} className="p-4 sm:p-4">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenSign(isOpen ? null : title)}
                className="flex w-full items-start gap-3 text-left"
              >
                <AlertCircle className={cn('mt-0.5 h-4 w-4 shrink-0', ACCENT[color].icon)} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-snug text-brand-navy-700">
                    {title}
                  </span>
                  <span
                    className={cn(
                      'mt-1 block text-[13px] leading-relaxed text-brand-muted-600',
                      !isOpen && 'line-clamp-2',
                    )}
                  >
                    {desc}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0 text-brand-muted-400 transition duration-200',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
            </GuideCard>
          );
        })}
      </div>
      {/* Pinned — always visible, never behind a tap */}
      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
        <p className="text-[14px] font-semibold text-amber-800">
          A note on the &ldquo;too perfect&rdquo; child
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-amber-700">
          This is the most commonly missed signal. The sibling who never complains is often the
          sibling who needs the most attention. Their invisibility is not contentment — it is
          adaptation. Check in with that child specifically and regularly.
        </p>
      </div>
    </div>
  );
}

function GuiltPanel() {
  return (
    <div>
      <GuideSectionHeading
        icon={Heart}
        title="The guilt siblings feel — and how to name it with them"
      />
      <p className="-mt-2 mb-4 text-[13px] leading-relaxed text-brand-muted-600">
        Siblings carry guilt that they often haven&apos;t named and haven&apos;t been given
        permission to release. The act of naming it — before they do — signals that their inner
        experience is acceptable and seen.
      </p>
      <p className="mb-3 text-[13px] font-semibold text-brand-muted-700">
        Things siblings feel guilty for feeling:
      </p>
      <GuideCard as="div" className="overflow-hidden p-0 sm:p-0">
        <ul className="divide-y divide-surface-border">
          {siblingGuilts.map((item, i) => (
            <li key={i} className="flex items-start gap-3 px-4 py-3 sm:px-5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-plum-400" />
              <p className="text-[13px] leading-relaxed text-brand-muted-700">{item}</p>
            </li>
          ))}
        </ul>
      </GuideCard>
      <div className="mt-4 rounded-2xl border border-brand-plum-200 bg-brand-plum-50 p-4 sm:p-5">
        <p className="mb-2 text-[14px] font-semibold text-brand-plum-800">
          How to start the conversation
        </p>
        <blockquote className="border-l-2 border-brand-plum-300 pl-3 text-[13px] italic leading-relaxed text-brand-plum-700">
          &ldquo;Sometimes kids feel embarrassed, or left out, or even a little jealous when their
          sibling needs so much attention. That would be totally normal — and I want you to know
          you can tell me any of that without getting in trouble.&rdquo;
        </blockquote>
        <p className="mt-3 text-[13px] leading-relaxed text-brand-plum-700">
          You don&apos;t have to wait for them to bring it up. Opening the door is enough.
        </p>
      </div>
    </div>
  );
}

function OneOnOnePanel() {
  return (
    <div>
      <GuideSectionHeading
        icon={Smile}
        title="Dedicated 1:1 time — what actually works"
        meta="4 principles"
      />
      <p className="-mt-2 mb-4 text-[13px] leading-relaxed text-brand-muted-600">
        A sibling who gets real, uninterrupted time with a parent will regulate more, act out less,
        and feel genuinely less resentful — even if the time is small. The key word is
        &ldquo;real.&rdquo; Distracted presence doesn&apos;t count to a child.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {oneOnOnePrinciples.map((item) => (
          <GuideCard as="div" key={item.title}>
            <h3 className="text-[14px] font-bold leading-snug text-brand-navy-700">{item.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-brand-muted-600">{item.desc}</p>
          </GuideCard>
        ))}
      </div>
    </div>
  );
}

function BooksPanel() {
  return (
    <div>
      <GuideSectionHeading
        icon={BookOpen}
        title="Books and resources for siblings"
        meta={`${books.length} picks`}
      />
      <p className="-mt-2 mb-4 text-[13px] leading-relaxed text-brand-muted-600">
        Reading about other kids in similar situations is enormously validating for siblings.
        These books and resources are worth keeping accessible — on the nightstand, not the shelf.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {books.map((book) => (
          <GuideCard as="div" key={book.title}>
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-[14px] font-bold leading-snug text-brand-navy-700">{book.title}</h3>
              <BadgePill className={cn('shrink-0', ACCENT[book.color].badge)}>
                {book.ages}
              </BadgePill>
            </div>
            <p className="text-[13px] leading-relaxed text-brand-muted-600">{book.desc}</p>
          </GuideCard>
        ))}
      </div>
    </div>
  );
}

function ScriptCard({ title, content }: { title: string; content: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the quote is still selectable.
    }
  };
  return (
    <GuideCard as="div">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[14px] font-semibold leading-snug text-brand-navy-700">{title}</h3>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-surface-border bg-white px-2.5 py-1 text-[11px] font-semibold text-brand-muted-600 transition hover:border-brand-plum-200 hover:text-brand-plum-700"
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <blockquote className="mt-3 border-l-2 border-brand-plum-300 pl-3 text-[13px] italic leading-relaxed text-brand-muted-700">
        {content}
      </blockquote>
    </GuideCard>
  );
}

function TeachersPanel() {
  return (
    <div>
      <GuideSectionHeading
        icon={Users}
        title="Talking to teachers and school counselors"
        meta="3 scripts"
      />
      <p className="-mt-2 mb-4 text-[13px] leading-relaxed text-brand-muted-600">
        A school counselor who knows what&apos;s happening at home can be a powerful support for
        a sibling — checking in regularly, watching for signs of stress, and providing a neutral
        space for the child to process without feeling like they&apos;re burdening their parents.
      </p>
      <div className="space-y-3">
        {teacherScripts.map((item) => (
          <ScriptCard key={item.title} title={item.title} content={item.content} />
        ))}
      </div>
    </div>
  );
}

/* ─── "what we know" disclosure (kept compact under the hero) ── */

function ResearchNote() {
  const [open, setOpen] = useState(false);
  return (
    <GuideCard as="div" className="overflow-hidden p-0 sm:p-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center gap-3 px-4 py-3.5 text-left transition duration-200 sm:px-5',
          open ? 'bg-brand-plum-50/50' : 'hover:bg-surface-subtle/40',
        )}
      >
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-plum-200 bg-brand-plum-50 text-brand-plum-600">
          <Heart className="h-4 w-4" aria-hidden />
        </span>
        <span className="flex-1 text-[14px] font-semibold text-brand-navy-700">
          What we know about siblings
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-brand-muted-400 transition duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      <div className="toolbox-reveal grid" data-open={open ? 'true' : 'false'}>
        <div className="toolbox-reveal-inner min-h-0">
          <div className="toolbox-reveal-content border-t border-surface-border bg-surface-subtle/30 px-4 py-4 sm:px-5">
            <p className="text-[13px] leading-relaxed text-brand-muted-700">
              Research on neurotypical siblings of children with autism consistently shows they are
              at elevated risk for anxiety, depression, and social difficulty — not because something
              is wrong with them, but because their environment places enormous invisible demands on
              them. They adapt. They become capable, independent, low-maintenance. And in doing so,
              they often stop letting you see how much they need too.
            </p>
          </div>
        </div>
      </div>
    </GuideCard>
  );
}

/* ─── page ─────────────────────────────────────────────────── */

const SIBLING_SECTIONS: ChooserSection[] = [
  {
    id: 'age-by-age',
    label: 'By age',
    description: 'What siblings need at 3–6, 7–11, 12–16, and 17+.',
    cardClass: 'border-sky-200/80 bg-gradient-to-br from-sky-50 to-white',
    accentClass: 'text-sky-700',
    content: <AgePanel />,
  },
  {
    id: 'signs-struggling',
    label: "Signs they're struggling",
    description: 'Six signals — including the one most parents miss.',
    cardClass: 'border-amber-200/80 bg-gradient-to-br from-amber-50 to-white',
    accentClass: 'text-amber-700',
    content: <SignsPanel />,
  },
  {
    id: 'guilt',
    label: 'The guilt',
    description: 'Name it before they do — and open the conversation.',
    cardClass: 'border-brand-plum-200/80 bg-gradient-to-br from-brand-plum-50 to-white',
    accentClass: 'text-brand-plum-700',
    content: <GuiltPanel />,
  },
  {
    id: 'one-on-one',
    label: '1:1 time',
    description: 'What actually works, even in small windows.',
    cardClass: 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white',
    accentClass: 'text-emerald-700',
    content: <OneOnOnePanel />,
  },
  {
    id: 'books',
    label: 'Books & resources',
    description: 'Validating reads for every age.',
    cardClass: 'border-violet-200/80 bg-gradient-to-br from-violet-50 to-white',
    accentClass: 'text-violet-700',
    content: <BooksPanel />,
  },
  {
    id: 'teachers',
    label: 'School & teachers',
    description: 'Scripts for teachers and counselors.',
    cardClass: 'border-rose-200/80 bg-gradient-to-br from-rose-50 to-white',
    accentClass: 'text-rose-700',
    content: <TeachersPanel />,
  },
];

export default function SiblingsPage() {
  return (
    <div className="page-shell pb-10">

      {/* Compact hero */}
      <header className="page-header max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Sibling Support
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-plum-200 bg-brand-plum-50 px-3 py-1 text-xs font-semibold text-brand-plum-700">
            <Users className="h-3.5 w-3.5" /> For siblings — and the parents watching them
          </span>
        </div>
        <h1 className="page-title text-brand-navy-700">The invisible child</h1>
        <p className="page-description text-[15px] text-brand-muted-700">
          In families where one child has significant needs, another child often quietly disappears
          into the background. Not through neglect — through the sheer gravitational pull of a child
          who needs more. This page is for the child who needed less and learned to ask for even
          less than that.
        </p>
      </header>

      {/* The honest opening — compact disclosure */}
      <ResearchNote />

      {/* "What do you need?" chooser */}
      <section aria-label="What do you need?">
        <GuideSectionHeading title="What do you need?" meta="Pick a topic" />
        <SectionChooser ariaLabel="Sibling support topics" sections={SIBLING_SECTIONS} />
      </section>

      {/* A note for the sibling — intentionally NOT in the chooser.
          Written to be shown to a child; reachable by scrolling alone. */}
      <section aria-label="A note for the sibling">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-plum-600">
          Show this to your child
        </p>
        <div className="rounded-3xl border border-brand-plum-200 bg-gradient-to-br from-brand-plum-50 via-white to-sky-50 p-6 shadow-soft sm:p-8">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-border bg-white shadow-soft">
            <Star className="h-6 w-6 text-amber-400" />
          </div>
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
            A note for the sibling — written for them, for you to share
          </p>
          <div className="mx-auto max-w-lg space-y-4 text-[14px] leading-relaxed text-brand-muted-800">
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
            <p className="font-semibold text-brand-navy-700">
              You are not forgotten. You are loved. And you are allowed to say when things are hard.
            </p>
          </div>
        </div>
      </section>

      {/* Closing — styled like the resources closing band */}
      <SupportCalloutBand
        title="Your whole family matters — not just the child in therapy."
        text="Supporting siblings well makes the family stronger — and ultimately, it makes the entire ABA journey more sustainable for everyone. You don't have to choose between your children's wellbeing. They both count."
        columns={2}
      >
        <SupportActionCard
          href="/support/caregiver"
          icon={Heart}
          title="Caregiver support"
          detail="Mental health toolbox"
        />
        <SupportActionCard
          href="/support/connect"
          icon={Users}
          title="Connect with other families"
          detail="Find peer support"
        />
      </SupportCalloutBand>

    </div>
  );
}
