'use client';

import { useEffect, useState } from 'react';
import { HeartHandshake, MessageCircle, Calendar, AlertCircle } from 'lucide-react';
import styles from '../../mental-health.module.css';

const BREAKING_POINTS = [
  {
    title: 'One partner more involved than the other',
    body: 'When one parent becomes the primary case manager — tracking goals, attending all sessions, fielding every call from the BCBA — the other can feel excluded or guilty. Both feelings are valid. The imbalance is real, and it builds resentment in both directions.',
  },
  {
    title: 'Disagreements about therapy goals',
    body: 'You will not always agree on what matters most or how aggressively to pursue progress. These are values conversations dressed up as logistics. Treating them as logistics keeps the real conversation from happening.',
  },
  {
    title: 'No time alone — together or apart',
    body: 'Couples lose intimacy when there\'s no longer space to be a couple. Not because love is gone. Because the schedule has nothing left in it.',
  },
  {
    title: 'Different grief timelines',
    body: 'Partners often grieve different things at different paces. One may have made peace with the diagnosis when the other is still in the early shock. Neither timeline is wrong. The mismatch alone is destabilizing.',
  },
];

const WEEKLY_CHECKIN_PROMPTS = [
  'One thing that worked this week',
  'One thing that didn\'t — and what we noticed about why',
  'What I need more of from you next week',
  'What I want to celebrate about us',
];

const SCRIPTS = [
  {
    label: 'When one of you is doing more',
    script: '"I think I\'ve been carrying more of the [scheduling / appointments / tracking] than we agreed to. Can we look at the next two weeks together and rebalance who handles what? I don\'t want this to become resentment."',
  },
  {
    label: 'When you disagree on a therapy decision',
    script: '"We don\'t see this the same way. Before we decide, I want to understand what you\'re actually worried about. Can you walk me through it?"',
  },
  {
    label: 'When you need a date night and feel guilty',
    script: '"I miss you. Not as my co-parent — as my person. Can we plan two hours, just us, this weekend? It doesn\'t need to be elaborate. It just needs to happen."',
  },
];

export function CouplesTopic() {
  const [responses, setResponses] = useState<string[]>(() => WEEKLY_CHECKIN_PROMPTS.map(() => ''));
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cg-couples-checkin');
      if (raw) {
        const parsed = JSON.parse(raw);
        setResponses(parsed.responses ?? WEEKLY_CHECKIN_PROMPTS.map(() => ''));
        setSavedAt(parsed.savedAt ?? null);
      }
    } catch { /* ignore */ }
  }, []);

  function save() {
    const at = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    setSavedAt(at);
    try {
      localStorage.setItem('cg-couples-checkin', JSON.stringify({ responses, savedAt: at }));
    } catch { /* ignore */ }
  }

  return (
    <div className={styles.topicBody}>
      <section className={styles.topicSection}>
        <p className={styles.topicLead}>
          The partnership is its own caregiving relationship. Resentment is a signal, not a character flaw —
          it usually means a need has gone unspoken too long. Most couples report the load lands unevenly,
          and that the partner doing more rarely says so directly.
        </p>
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <AlertCircle size={16} />
          <h3>The four quiet breaking points</h3>
        </div>
        <div className={styles.couplesGrid}>
          {BREAKING_POINTS.map((bp, i) => (
            <div key={i} className={styles.couplesCard}>
              <p className={styles.couplesCardTitle}>{bp.title}</p>
              <p className={styles.couplesCardBody}>{bp.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <Calendar size={16} />
          <h3>Weekly 10-minute check-in</h3>
        </div>
        <p className={styles.topicHelper}>
          The single biggest predictor of couples staying intact under high caregiving load. Pick a day
          (Sunday evening works for most). Set 10 minutes. Take turns answering each prompt. Save it here.
        </p>
        <div className={styles.checkinBox}>
          {WEEKLY_CHECKIN_PROMPTS.map((p, i) => (
            <div key={i} className={styles.checkinRow}>
              <label className={styles.checkinLabel}>{p}</label>
              <textarea
                className={styles.reclaimInput}
                value={responses[i]}
                onChange={(e) => setResponses((prev) => prev.map((r, j) => (j === i ? e.target.value : r)))}
                placeholder="Together: write what came up…"
                rows={2}
              />
            </div>
          ))}
          <div className={styles.checkinFooter}>
            <span className={styles.toolHint}>
              {savedAt ? `Last saved · ${savedAt}` : 'Not yet saved'}
            </span>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={save}>
              Save this check-in
            </button>
          </div>
        </div>
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <MessageCircle size={16} />
          <h3>Scripts for the conversations you keep avoiding</h3>
        </div>
        <div className={styles.scriptList}>
          {SCRIPTS.map((s, i) => (
            <div key={i} className={styles.scriptCard}>
              <span className={styles.scriptLabel}>{s.label}</span>
              <p className={styles.scriptText}>&ldquo;{s.script}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.topicCallout}>
        <HeartHandshake size={18} />
        <div>
          <p className={styles.topicCalloutHead}>The partnership needs caregiving too.</p>
          <p className={styles.topicCalloutBody}>
            You are tending to your child together. That requires tending to the &ldquo;together&rdquo; itself.
            Couples therapy specialized in special-needs families is one of the highest-leverage things you
            can buy. Ask your care coordinator for a referral if you want one.
          </p>
        </div>
      </section>
    </div>
  );
}
