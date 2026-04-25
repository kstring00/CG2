'use client';

import Link from 'next/link';
import type { Rec } from './RecommendationsEngine';
import styles from '../mental-health.module.css';

const ICON_SVGS: Record<string, React.ReactNode> = {
  priority: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  support: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
    </svg>
  ),
  calm: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>
    </svg>
  ),
  insight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.5.5 1 1.3 1 2.3v1h6v-1c0-1 .5-1.8 1-2.3A7 7 0 0012 2z"/>
    </svg>
  ),
};

const REC_ICON_CLASS: Record<string, string> = {
  priority: styles.recIconPriority,
  support: styles.recIconSupport,
  calm: styles.recIconCalm,
  insight: styles.recIconInsight,
};

const STATIC_RECS: Rec[] = [
  {
    icon: 'insight',
    tag: 'Routine',
    title: 'Protect one 15-minute window',
    body: 'A short, predictable break each day raises your floor more than any single big self-care moment. Same time, same place if possible.',
    action: 'How others schedule this →',
    href: '/support/mental-health/resources/daily-break',
  },
  {
    icon: 'support',
    tag: 'Support',
    title: "Build a \"two-text\" support list",
    body: "When support drops, you don't need a whole village — just two people you can reach without explaining the backstory. Add them once and we'll surface them on hard days.",
    action: 'Set this up →',
    href: '/support/mental-health/tools/support-list',
  },
  {
    icon: 'calm',
    tag: 'Planning',
    title: "A \"hard-day plan\" you wrote on a good day",
    body: 'When the bandwidth drops, decisions feel heavier. A 5-line plan from your better self — what to skip, what to lean on — does the deciding for you.',
    action: 'Draft mine →',
    href: '/support/mental-health/tools/hard-day-plan',
  },
];

interface Props {
  recs: Rec[];
}

export function RecommendationsTab({ recs }: Props) {
  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1><em>Recommendations</em> for the day you're having</h1>
          <p>These shift in real time as your inputs change. Nothing here is one-size-fits-all.</p>
        </div>
      </header>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitle}>Right now</div>
            <div className={styles.cardSubtitle}>Based on your most recent inputs</div>
          </div>
          <span className={styles.heroLabel} style={{ marginBottom: 0 }}>
            <span className={styles.liveDot} />
            Live
          </span>
        </div>
        <div className={styles.recsGrid}>
          {recs.map((r, idx) => (
            <div key={idx} className={styles.rec} style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className={styles.recTag}>{r.tag}</div>
              <div className={`${styles.recIcon} ${REC_ICON_CLASS[r.icon]}`}>
                {ICON_SVGS[r.icon]}
              </div>
              <div className={styles.recTitle}>{r.title}</div>
              <div className={styles.recBody}>{r.body}</div>
              {r.href
                ? <Link href={r.href} className={styles.recAction}>{r.action}</Link>
                : <button className={styles.recAction}>{r.action}</button>}
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.card} ${styles.sectionSpacer}`}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitle}>Worth coming back to</div>
            <div className={styles.cardSubtitle}>Steady-state practices for over the longer arc</div>
          </div>
        </div>
        <div className={styles.recsGrid}>
          {STATIC_RECS.map((r, idx) => (
            <div key={idx} className={styles.rec}>
              <div className={`${styles.recIcon} ${REC_ICON_CLASS[r.icon]}`}>
                {ICON_SVGS[r.icon]}
              </div>
              <div className={styles.recTitle}>{r.title}</div>
              <div className={styles.recBody}>{r.body}</div>
              {r.href
                ? <Link href={r.href} className={styles.recAction}>{r.action}</Link>
                : <button className={styles.recAction}>{r.action}</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
