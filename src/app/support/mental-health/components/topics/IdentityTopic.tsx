'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Star, Compass } from 'lucide-react';
import styles from '../../mental-health.module.css';

const IDENTITY_ITEMS = [
  'Having a hobby that had nothing to do with anyone else\'s needs',
  'Making spontaneous plans — a last-minute dinner, a drive, a weekend trip',
  'Laughing at yourself without it feeling like a distraction from something important',
  'Resting without calculating what you\'re not doing instead',
  'Having opinions about things that don\'t involve therapy, insurance, or schedules',
  'Finishing a sentence in a conversation that wasn\'t about your child',
  'Feeling curious about something — a book, a show, a new place',
  'Being someone a friend called when they needed help',
  'Feeling proud of something you made, did, or said — not something you managed',
];

const RECLAIM_PROMPTS = [
  'One thing I used to love that I haven\'t made time for in a year',
  'A song that always makes me feel like myself',
  'A friend I miss and could text right now',
  'A place I\'d go alone, just for an hour',
  'Something I\'m curious about that has nothing to do with anyone else',
];

export function IdentityTopic() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [reflections, setReflections] = useState<string[]>(() => RECLAIM_PROMPTS.map(() => ''));

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cg-identity-reflections');
      if (raw) setReflections(JSON.parse(raw));
      const ck = localStorage.getItem('cg-identity-checked');
      if (ck) setChecked(new Set(JSON.parse(ck)));
    } catch { /* ignore */ }
  }, []);

  function toggle(i: number) {
    const next = new Set(checked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setChecked(next);
    try { localStorage.setItem('cg-identity-checked', JSON.stringify([...next])); } catch { /* ignore */ }
  }

  function setReflection(i: number, v: string) {
    const next = reflections.map((r, idx) => (idx === i ? v : r));
    setReflections(next);
    try { localStorage.setItem('cg-identity-reflections', JSON.stringify(next)); } catch { /* ignore */ }
  }

  const missing = IDENTITY_ITEMS.length - checked.size;

  return (
    <div className={styles.topicBody}>
      <section className={styles.topicSection}>
        <p className={styles.topicLead}>
          Most caregivers describe a slow erosion of self — interests, friendships, hobbies that quietly stopped.
          You did not choose to disappear. The need was urgent, your time was finite, and the version of you
          that existed before kept getting deferred. That version is not gone. She got buried.
        </p>
        <p className={styles.topicLead}>
          Identity care is not selfish. It is the foundation for everything you give. A caregiver with no
          self left to come home to is a caregiver who eventually breaks. You don&apos;t need to rebuild her in a
          weekend. You need to start <em>noticing her</em> again.
        </p>
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <Sparkles size={16} />
          <h3>What you used to do without thinking about it</h3>
        </div>
        <p className={styles.topicHelper}>
          Tap each one that&apos;s true for you right now. Saved on this device. The unchecked ones are not failures
          — they&apos;re directions.
        </p>
        <ul className={styles.identityList}>
          {IDENTITY_ITEMS.map((item, i) => {
            const isOn = checked.has(i);
            return (
              <li key={i}>
                <button
                  className={`${styles.identityItem} ${isOn ? styles.identityItemDone : ''}`}
                  onClick={() => toggle(i)}
                >
                  <span className={`${styles.identityCheck} ${isOn ? styles.identityCheckDone : ''}`} />
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
        {checked.size > 0 && (
          <div className={styles.identityResult}>
            {missing === 0 ? (
              <span><strong>All nine on the list.</strong> Hold this — it&apos;s rarer than you think, and worth protecting.</span>
            ) : missing <= 3 ? (
              <span>You&apos;re holding most of yourself together. <strong>{missing} item{missing !== 1 ? 's' : ''}</strong> to gently reclaim.</span>
            ) : missing <= 6 ? (
              <span><strong>{missing} of these are missing right now.</strong> That tracks for someone in the thick of caregiving. The reclaim prompts below are how you start small.</span>
            ) : (
              <span><strong>Most of these have gone quiet.</strong> That&apos;s not a verdict on you — it&apos;s a measurement. Pick one prompt below. Just one.</span>
            )}
          </div>
        )}
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <Star size={16} />
          <h3>Reclaim prompts — answer one this week</h3>
        </div>
        <p className={styles.topicHelper}>
          You don&apos;t need to do anything with these. Just write them down. Saved as you type.
        </p>
        <div className={styles.reclaimGrid}>
          {RECLAIM_PROMPTS.map((prompt, i) => (
            <div key={i} className={styles.reclaimCard}>
              <p className={styles.reclaimPrompt}>{prompt}</p>
              <textarea
                className={styles.reclaimInput}
                value={reflections[i]}
                onChange={(e) => setReflection(i, e.target.value)}
                placeholder="Write what comes up…"
                rows={2}
              />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.topicCallout}>
        <Compass size={18} />
        <div>
          <p className={styles.topicCalloutHead}>You are more than the role.</p>
          <p className={styles.topicCalloutBody}>
            You were a person before you were a caregiver. You will be a person after the most intensive
            seasons end. Tending that person is part of how the caregiving stays sustainable — not a
            distraction from it.
          </p>
        </div>
      </section>
    </div>
  );
}
