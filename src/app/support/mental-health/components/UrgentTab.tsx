'use client';

import styles from '../mental-health.module.css';

export function UrgentTab() {
  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1>You don't have to <em>do this alone</em></h1>
          <p>If you're in crisis or worried about your safety, real help is one tap away.</p>
        </div>
      </header>

      <div className={styles.urgentHero}>
        <h2 className={styles.urgentHeroTitle}>Need someone right now?</h2>
        <p className={styles.urgentHeroBody}>
          The 988 Suicide &amp; Crisis Lifeline is free, confidential, and answers 24/7. You can
          call, text, or chat. You don't need to be in crisis to reach out — being overwhelmed is
          enough.
        </p>
        <a className={styles.btnUrgent} href="tel:988">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
          </svg>
          Call 988 — Crisis Lifeline
        </a>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitle}>More ways to reach support</div>
            <div className={styles.cardSubtitle}>All free · All confidential · No appointment needed</div>
          </div>
        </div>
        <div className={styles.resourceList}>
          <a href="tel:988" className={styles.resource}>
            <div>
              <div className={styles.resourceTitle}>988 Suicide &amp; Crisis Lifeline</div>
              <div className={styles.resourceDesc}>24/7 · Call or text · Free and confidential</div>
            </div>
            <span className={styles.resourceNum}>988</span>
          </a>
          <a href="sms:741741" className={styles.resource}>
            <div>
              <div className={styles.resourceTitle}>Crisis Text Line</div>
              <div className={styles.resourceDesc}>Text HOME · 24/7 trained crisis counselor</div>
            </div>
            <span className={styles.resourceNum}>741741</span>
          </a>
          <a href="tel:18006624357" className={styles.resource}>
            <div>
              <div className={styles.resourceTitle}>SAMHSA National Helpline</div>
              <div className={styles.resourceDesc}>Mental health &amp; substance use · 24/7 · English &amp; Spanish</div>
            </div>
            <span className={styles.resourceNum}>1-800-662-4357</span>
          </a>
          <a href="tel:18009444773" className={styles.resource}>
            <div>
              <div className={styles.resourceTitle}>Postpartum Support International</div>
              <div className={styles.resourceDesc}>Parents in the first years · Specialized support</div>
            </div>
            <span className={styles.resourceNum}>1-800-944-4773</span>
          </a>
          <a href="tel:911" className={styles.resource}>
            <div>
              <div className={styles.resourceTitle}>Emergency (911)</div>
              <div className={styles.resourceDesc}>If you or someone you love is in immediate danger</div>
            </div>
            <span className={styles.resourceNum}>911</span>
          </a>
        </div>
      </div>

      <div className={styles.urgentNote}>
        <h3 className={styles.urgentNoteTitle}>A note from the CG team</h3>
        <p className={styles.urgentNoteBody}>
          Reaching out is not a failure of caregiving. It's part of it. The strongest parents we've
          worked with are the ones who learned, often the hard way, that their oxygen mask goes on
          first. If today is heavy, please use a number above. Your CG family care navigator can
          also help you find ongoing support — message them anytime through your CG dashboard.
        </p>
      </div>
    </div>
  );
}
