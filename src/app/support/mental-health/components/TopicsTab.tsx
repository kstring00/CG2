'use client';

import { useEffect, useState } from 'react';
import {
  Moon,
  HeartHandshake,
  User,
  CloudRain,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import styles from '../mental-health.module.css';
import { IdentityTopic } from './topics/IdentityTopic';
import { SleepTopic } from './topics/SleepTopic';
import { CouplesTopic } from './topics/CouplesTopic';
import { HardDaysTopic } from './topics/HardDaysTopic';

type TopicKey = 'identity' | 'sleep' | 'couples' | 'hard-days';

interface TopicMeta {
  key: TopicKey;
  title: string;
  blurb: string;
  inside: string[];
  icon: React.ReactNode;
  iconBig: React.ReactNode;
  /** CSS class accent — drives top border + badge tint */
  accent: 'Sleep' | 'Couples' | 'Hard';
}

// Caregiver identity is the lead/featured topic (full-width hero card).
const LEAD: TopicMeta = {
  key: 'identity',
  title: 'Caregiver identity',
  blurb:
    "Who you are, separate from who you take care of. Most caregivers describe a slow erosion of self — interests, friendships, hobbies that quietly stopped. You did not choose to disappear; the need was urgent and your time was finite. Identity care is not selfish, it's the foundation for everything you give. The version of you that existed before isn't gone — she got buried.",
  inside: [
    'A 9-item checklist of what you used to do without thinking',
    'Five reclaim prompts that save as you type',
    'Honest framing: which things you can let go of, which need tending now',
  ],
  icon: <User size={20} />,
  iconBig: <User size={42} strokeWidth={1.4} />,
  // Lead card uses sage by default; no accent class needed
  accent: 'Sleep', // unused for the lead card
};

const ROW: TopicMeta[] = [
  {
    key: 'sleep',
    title: 'Sleep & rest',
    blurb:
      "Sleep is the lever that resets every other lever. It's also the first thing caregivers lose, and the last thing they think to protect. You can't regulate your child's nervous system from a deregulated body — tonight's priority is rest, not productivity.",
    inside: [
      'A 7-question sleep quiz with a tone-coded result',
      'A 30-minute wind-down sequence you can run any night',
      'The myths most caregivers were told about sleep, debunked',
    ],
    icon: <Moon size={18} />,
    iconBig: <Moon size={26} strokeWidth={1.5} />,
    accent: 'Sleep',
  },
  {
    key: 'couples',
    title: 'Couples & partners',
    blurb:
      "When the caregiving load lands unevenly. Resentment is a signal, not a character flaw — it usually means a need has gone unspoken too long. The partnership is its own caregiving relationship, and it deserves tending too.",
    inside: [
      'The four quiet breaking points couples don\'t name out loud',
      'A weekly 10-minute check-in template that saves your answers',
      'Three scripts for the conversations you keep avoiding',
    ],
    icon: <HeartHandshake size={18} />,
    iconBig: <HeartHandshake size={26} strokeWidth={1.5} />,
    accent: 'Couples',
  },
  {
    key: 'hard-days',
    title: 'Hard days & meltdowns',
    blurb:
      "When the day collapses. On hard days, decisions feel heavier, and a five-line plan from your better self does the deciding for you. What gets dropped, what stays, and one person you'll text — decided ahead of time.",
    inside: [
      'A "this felt true today" picker with personalized responses',
      'A 4-step hard-day script you can rehearse on a good day',
      'A direct line into the calming tools when you need them',
    ],
    icon: <CloudRain size={18} />,
    iconBig: <CloudRain size={26} strokeWidth={1.5} />,
    accent: 'Hard',
  },
];

const ALL_TOPICS: TopicMeta[] = [LEAD, ...ROW];

interface Props {
  onNavigate: (tab: string) => void;
  initialTopic?: TopicKey | null;
  onTopicConsumed?: () => void;
}

export function TopicsTab({ onNavigate, initialTopic = null, onTopicConsumed }: Props) {
  const [active, setActive] = useState<TopicKey | null>(initialTopic);

  useEffect(() => {
    if (initialTopic && ALL_TOPICS.some((t) => t.key === initialTopic)) {
      setActive(initialTopic);
      onTopicConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTopic]);

  const topic = active ? ALL_TOPICS.find((t) => t.key === active) ?? null : null;

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
        {topic.key === 'identity' && <IdentityTopic />}
        {topic.key === 'sleep' && <SleepTopic />}
        {topic.key === 'couples' && <CouplesTopic />}
        {topic.key === 'hard-days' && <HardDaysTopic onOpenCalming={() => onNavigate('calming')} />}
      </div>
    );
  }

  return (
    <div>
      <header className={styles.editorialHero}>
        <span className={styles.editorialChip}>Inside the Center</span>
        <h1 className={styles.editorialTitle}>
          Topics worth <em>sitting with</em>.
        </h1>
        <p className={styles.editorialSubtitle}>
          Four guides written for the parts of caregiving nobody hands you a manual for. Tap any
          one to read it inline — no leaving the center, no losing your place.
        </p>
      </header>

      {/* Featured lead card — Caregiver identity */}
      <button className={styles.leadCard} onClick={() => setActive(LEAD.key)}>
        <div className={styles.leadCardLeft}>
          <span className={styles.leadKicker}>Featured · Start here</span>
          <div className={styles.leadIconBig}>{LEAD.iconBig}</div>
        </div>
        <div className={styles.leadCardRight}>
          <h2 className={styles.leadCardTitle}>{LEAD.title}</h2>
          <p className={styles.leadCardBody}>{LEAD.blurb}</p>
          <ul className={styles.leadCardInside}>
            {LEAD.inside.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <span className={styles.readGuideLink}>
            Read this guide <ArrowRight size={14} />
          </span>
        </div>
      </button>

      {/* 3-up row */}
      <div className={styles.editorialGrid}>
        {ROW.map((t) => (
          <button
            key={t.key}
            className={`${styles.editorialCard} ${styles[`accent${t.accent}`]}`}
            onClick={() => setActive(t.key)}
          >
            <div className={styles.editorialIconBadge}>{t.iconBig}</div>
            <h3 className={styles.editorialCardTitle}>{t.title}</h3>
            <p className={styles.editorialCardBody}>{t.blurb}</p>
            <span className={styles.editorialInsideLabel}>What&apos;s inside</span>
            <ul className={styles.editorialInsideList}>
              {t.inside.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <span className={styles.readGuideLink}>
              Read this guide <ArrowRight size={14} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
