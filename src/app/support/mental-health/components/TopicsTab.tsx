'use client';

import { useEffect, useState } from 'react';
import {
  Moon,
  HeartHandshake,
  User,
  CloudRain,
  ArrowLeft,
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
  icon: React.ReactNode;
  accent: 'sage' | 'blue' | 'gold' | 'burgundy';
}

const TOPICS: TopicMeta[] = [
  {
    key: 'identity',
    title: 'Caregiver identity',
    blurb: "Who you are, separate from who you take care of. Reclaiming the parts of yourself that didn't disappear — they got buried.",
    icon: <User size={18} />,
    accent: 'sage',
  },
  {
    key: 'sleep',
    title: 'Sleep & rest',
    blurb: "Sleep is the lever that resets every other lever. Practical ways to protect it when nights are unpredictable.",
    icon: <Moon size={18} />,
    accent: 'blue',
  },
  {
    key: 'couples',
    title: 'Couples & partners',
    blurb: 'When the caregiving load lands unevenly. Scripts and check-ins for keeping the partnership intact.',
    icon: <HeartHandshake size={18} />,
    accent: 'burgundy',
  },
  {
    key: 'hard-days',
    title: 'Hard days & meltdowns',
    blurb: "When the day collapses. A short script for what to drop, what to keep, and who to text.",
    icon: <CloudRain size={18} />,
    accent: 'burgundy',
  },
];

const ACCENT_CLASS: Record<TopicMeta['accent'], string> = {
  sage: styles.qaIcon,
  blue: `${styles.qaIcon} ${styles.qaIconBlue}`,
  gold: `${styles.qaIcon} ${styles.qaIconGold}`,
  burgundy: `${styles.qaIcon} ${styles.qaIconBurgundy}`,
};

interface Props {
  onNavigate: (tab: string) => void;
  initialTopic?: TopicKey | null;
  onTopicConsumed?: () => void;
}

export function TopicsTab({ onNavigate, initialTopic = null, onTopicConsumed }: Props) {
  const [active, setActive] = useState<TopicKey | null>(initialTopic);

  useEffect(() => {
    if (initialTopic && TOPICS.some((t) => t.key === initialTopic)) {
      setActive(initialTopic);
      onTopicConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTopic]);

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
        {topic.key === 'identity' && <IdentityTopic />}
        {topic.key === 'sleep' && <SleepTopic />}
        {topic.key === 'couples' && <CouplesTopic />}
        {topic.key === 'hard-days' && <HardDaysTopic onOpenCalming={() => onNavigate('calming')} />}
      </div>
    );
  }

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1>All <em>topics</em>, in one place</h1>
          <p>
            Everything related to your wellbeing, gathered here. Tap a topic to read it inline — no leaving
            the center, no losing your place.
          </p>
        </div>
      </header>
      <div className={styles.topicsGrid}>
        {TOPICS.map((t) => (
          <button key={t.key} className={styles.toolCard} onClick={() => setActive(t.key)}>
            <div className={ACCENT_CLASS[t.accent]}>{t.icon}</div>
            <div className={styles.toolCardTitle}>{t.title}</div>
            <p className={styles.toolCardBody}>{t.blurb}</p>
            <span className={styles.toolCardMeta}>Tap to open inline</span>
          </button>
        ))}
      </div>
    </div>
  );
}
