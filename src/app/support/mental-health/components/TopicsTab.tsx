'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Moon,
  HeartHandshake,
  User,
  Users,
  DollarSign,
  CloudRain,
  Wind,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import styles from '../mental-health.module.css';

interface Topic {
  key: string;
  title: string;
  blurb: string;
  icon: React.ReactNode;
  accent: 'sage' | 'blue' | 'gold' | 'burgundy';
  fullHref: string;
  inlineSummary: {
    headline: string;
    bullets: string[];
    nextSteps: { label: string; tabKey?: string; href?: string }[];
  };
}

const TOPICS: Topic[] = [
  {
    key: 'identity',
    title: 'Caregiver identity',
    blurb: "Who you are, separate from who you take care of. Reclaiming the parts of yourself that didn't disappear — they got buried.",
    icon: <User size={18} />,
    accent: 'sage',
    fullHref: '/support/caregiver/identity',
    inlineSummary: {
      headline: "You're more than the role.",
      bullets: [
        'Most caregivers describe a slow erosion of self — interests, friendships, hobbies that quietly stopped.',
        'Identity care is not selfish. It is a foundation for everything you give.',
        'Even 15 minutes a week of something that is only yours rebuilds the floor.',
      ],
      nextSteps: [
        { label: 'Open a calming tool', tabKey: 'calming' },
        { label: 'Read the full identity guide →', href: '/support/caregiver/identity' },
      ],
    },
  },
  {
    key: 'sleep',
    title: 'Sleep & rest',
    blurb: "Sleep is the lever that resets every other lever. Practical ways to protect it when nights are unpredictable.",
    icon: <Moon size={18} />,
    accent: 'blue',
    fullHref: '/support/sleep',
    inlineSummary: {
      headline: "Tonight's priority is rest, not productivity.",
      bullets: [
        'Three nights of thin sleep raise everything else — stress, anxiety, the 3 AM spirals.',
        'A predictable wind-down beats sleep tracking every time. Same time, dim lights, no problem-solving after 9.',
        '30 extra minutes tonight matters more than anything you would get done after 9 PM.',
      ],
      nextSteps: [
        { label: 'Try the body scan in bed', tabKey: 'calming' },
        { label: 'See the full sleep guide →', href: '/support/sleep' },
      ],
    },
  },
  {
    key: 'couples',
    title: 'Couples & partners',
    blurb: 'When the caregiving load lands unevenly. Scripts and check-ins for keeping the partnership intact.',
    icon: <HeartHandshake size={18} />,
    accent: 'burgundy',
    fullHref: '/support/couples',
    inlineSummary: {
      headline: "The partnership is its own caregiving relationship.",
      bullets: [
        'Resentment is a signal, not a character flaw. It usually means a need has gone unspoken too long.',
        'Most couples report the load lands unevenly — and that the partner doing more rarely says so directly.',
        'A weekly 10-minute check-in (what worked, what didn\'t, what each of you needs next week) prevents most slow-rolling fights.',
      ],
      nextSteps: [
        { label: 'Use an ask-for-help script', tabKey: 'calming' },
        { label: 'Open the couples guide →', href: '/support/couples' },
      ],
    },
  },
  {
    key: 'hard-days',
    title: 'Hard days & meltdowns',
    blurb: "When the day collapses. A short script for what to drop, what to keep, and who to text.",
    icon: <CloudRain size={18} />,
    accent: 'burgundy',
    fullHref: '/support/hard-days',
    inlineSummary: {
      headline: 'Hard days don\'t need a hero. They need a smaller plan.',
      bullets: [
        'On hard days, decisions feel heavier. A 5-line plan from your better self does the deciding for you.',
        'What gets dropped (laundry, dinner-as-event), what stays (kid fed, kid safe, you breathing), and one person you\'ll text.',
        'Hard does not mean failing. It means today asked for more than your bandwidth had.',
      ],
      nextSteps: [
        { label: 'Open the floor list', tabKey: 'calming' },
        { label: 'Read the full hard-days guide →', href: '/support/hard-days' },
      ],
    },
  },
  {
    key: 'financial',
    title: 'Financial pressure',
    blurb: "Money stress is mental health stress. Practical paths through the labyrinth of insurance, Medicaid, and respite funding.",
    icon: <DollarSign size={18} />,
    accent: 'gold',
    fullHref: '/support/financial',
    inlineSummary: {
      headline: "Money stress is part of the load.",
      bullets: [
        'Insurance navigation is a job most caregivers were never trained for. Confusion is the system, not you.',
        'In Texas, Medicaid waivers, ECI, and community grants exist — most families never hear about them.',
        'A care coordinator can pull most of this off your plate. That\'s what they\'re for.',
      ],
      nextSteps: [
        { label: 'Open the financial guide →', href: '/support/financial' },
      ],
    },
  },
  {
    key: 'siblings',
    title: 'Siblings',
    blurb: 'How brothers and sisters of the autistic child are doing — and how to make room for them too.',
    icon: <Users size={18} />,
    accent: 'sage',
    fullHref: '/support/siblings',
    inlineSummary: {
      headline: 'Siblings carry a quieter version of this.',
      bullets: [
        '"Glass child" is the term researchers use — they often try not to add anything to your plate.',
        'Even 15 minutes a week of one-on-one attention is the single biggest predictor of sibling resilience.',
        'They notice the imbalance. Naming it together helps more than pretending it isn\'t there.',
      ],
      nextSteps: [
        { label: 'Open the sibling guide →', href: '/support/siblings' },
      ],
    },
  },
];

const ACCENT_CLASS: Record<Topic['accent'], string> = {
  sage: styles.qaIcon,
  blue: `${styles.qaIcon} ${styles.qaIconBlue}`,
  gold: `${styles.qaIcon} ${styles.qaIconGold}`,
  burgundy: `${styles.qaIcon} ${styles.qaIconBurgundy}`,
};

interface Props {
  onNavigate: (tab: string) => void;
}

export function TopicsTab({ onNavigate }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const topic = active ? TOPICS.find((t) => t.key === active) ?? null : null;

  if (topic) {
    return (
      <div>
        <button className={styles.toolBackBtn} onClick={() => setActive(null)}>
          <ArrowLeft size={14} /> All topics
        </button>
        <header className={styles.pageHeader}>
          <div className={styles.greeting}>
            <h1>{topic.title}</h1>
            <p>{topic.blurb}</p>
          </div>
        </header>
        <div className={styles.topicDetail}>
          <div className={styles.topicDetailHead}>
            <Wind size={16} />
            <span>{topic.inlineSummary.headline}</span>
          </div>
          <ul className={styles.topicBullets}>
            {topic.inlineSummary.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <div className={styles.topicNextSteps}>
            <span className={styles.topicNextStepsLabel}>Take a next step</span>
            <div className={styles.topicNextStepsBtns}>
              {topic.inlineSummary.nextSteps.map((s, i) =>
                s.tabKey ? (
                  <button
                    key={i}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => onNavigate(s.tabKey!)}
                  >
                    {s.label} <ArrowRight size={14} />
                  </button>
                ) : (
                  <Link
                    key={i}
                    href={s.href!}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    {s.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1>All <em>topics</em>, in one place</h1>
          <p>Everything related to your wellbeing, gathered here so you don&apos;t have to leave to find it.</p>
        </div>
      </header>
      <div className={styles.toolsGrid}>
        {TOPICS.map((t) => (
          <button key={t.key} className={styles.toolCard} onClick={() => setActive(t.key)}>
            <div className={ACCENT_CLASS[t.accent]}>{t.icon}</div>
            <div className={styles.toolCardTitle}>{t.title}</div>
            <p className={styles.toolCardBody}>{t.blurb}</p>
            <span className={styles.toolCardMeta}>Read inline · or open full guide</span>
          </button>
        ))}
      </div>
    </div>
  );
}
