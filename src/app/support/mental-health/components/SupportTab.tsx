'use client';

import styles from '../mental-health.module.css';

interface Props {
  onOpenTool: (name: string) => void;
}

export function SupportTab({ onOpenTool }: Props) {
  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1>Support <em>for you</em></h1>
          <p>Small, real tools. Use one when you need it — not as homework.</p>
        </div>
      </header>

      <div className={styles.supportGrid}>
        <div className={styles.supportCard} onClick={() => onOpenTool('breathing')}>
          <div className={`${styles.supportCardIcon} ${styles.supportCardIconBreath}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <div className={styles.supportCardTitle}>3-minute breath reset</div>
          <p className={styles.supportCardBody}>
            Box breathing — in 4, hold 4, out 4, hold 4. Drops the cortisol enough to keep going.
            Use it before pickup, before the meltdown, before bed.
          </p>
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            Start →
          </button>
        </div>

        <div className={styles.supportCard} onClick={() => onOpenTool('grounding')}>
          <div className={`${styles.supportCardIcon} ${styles.supportCardIconGround}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 12h3l3-9 6 18 3-9h3"/>
            </svg>
          </div>
          <div className={styles.supportCardTitle}>5-4-3-2-1 grounding</div>
          <p className={styles.supportCardBody}>
            For when the day's noise is louder than your thinking. Five things you see, four you feel,
            three you hear, two you smell, one you can taste. Pulls you back into the room.
          </p>
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            Walk me through it →
          </button>
        </div>

        <div className={styles.supportCard} onClick={() => onOpenTool('journal')}>
          <div className={`${styles.supportCardIcon} ${styles.supportCardIconJournal}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div className={styles.supportCardTitle}>One-line journal</div>
          <p className={styles.supportCardBody}>
            Today's prompt: <em>"What was harder than it should have been?"</em> A single line.
            No paragraphs needed. We'll save the patterns, not the words.
          </p>
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            Write one line →
          </button>
        </div>

        <div className={styles.supportCard} onClick={() => onOpenTool('hardday')}>
          <div className={`${styles.supportCardIcon} ${styles.supportCardIconHard}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </div>
          <div className={styles.supportCardTitle}>Hard-day plan</div>
          <p className={styles.supportCardBody}>
            A short script for when the day collapses. What gets dropped (laundry, dinner-as-event),
            what stays (kid fed, kid safe, you breathing), and one person you'll text. Decided ahead of time.
          </p>
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            Open my plan →
          </button>
        </div>

        <div className={styles.supportCard} onClick={() => onOpenTool('ask')}>
          <div className={`${styles.supportCardIcon} ${styles.supportCardIconHelp}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
            </svg>
          </div>
          <div className={styles.supportCardTitle}>Ask-for-help template</div>
          <p className={styles.supportCardBody}>
            Pre-written texts for when reaching out feels like one more task. Pick a tone, pick a
            request, send. <em>"I'm having a hard day. Can you call me on the drive home?"</em>
          </p>
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            Pick a message →
          </button>
        </div>

        <div className={styles.supportCard} onClick={() => onOpenTool('counselor')}>
          <div className={`${styles.supportCardIcon} ${styles.supportCardIconHelp}`} style={{ background: 'var(--cream-deep)', color: 'var(--ink)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div className={styles.supportCardTitle}>Talk to someone</div>
          <p className={styles.supportCardBody}>
            Caregiver-specialized therapists, parent peer-support groups, and CG's family care
            navigators. The bar isn't crisis — it's "this would help."
          </p>
          <button className={`${styles.btn} ${styles.btnSecondary}`} style={{ alignSelf: 'flex-start', marginTop: 4 }}>
            See providers →
          </button>
        </div>
      </div>

      <div className={styles.supportQuote}>
        <p className={styles.supportQuoteText}>
          "You can't pour from an empty cup" is true, but incomplete. You also don't have to be full
          to keep going. Sometimes the work is just refilling enough for the next hour.
        </p>
      </div>
    </div>
  );
}
