'use client';

import { useState } from 'react';
import { Users, Heart, BookOpen, Star } from 'lucide-react';
import styles from '../../mental-health.module.css';

const AGE_GROUPS = [
  {
    range: 'Ages 3–6',
    tag: 'Simple explanations, big reassurance',
    summary: 'At this age, siblings feel everything and understand more than adults give them credit for — but they lack the vocabulary to name it. They need simple truth, physical closeness, and proof that they\'re still loved.',
    sayIt: '"Your brother\'s brain works a little differently than yours. That\'s why he needs extra help learning things. It doesn\'t mean he loves you less. It doesn\'t mean we love you less."',
    doIt: 'Repeat often. Give physical closeness daily — even five minutes of lap time. Name their feelings out loud: "You wanted Mommy and Mommy was with brother. That\'s hard."',
  },
  {
    range: 'Ages 7–11',
    tag: 'They\'re watching everything',
    summary: 'They notice the imbalance. They notice when you\'re tired. They start protecting you by hiding their own needs. This is the age where the "glass child" pattern locks in if it isn\'t named.',
    sayIt: '"I\'ve noticed you sometimes don\'t tell me when something\'s hard for you. I think you\'re trying to help by not adding to the list. I want you to know your hard things matter to me too."',
    doIt: 'Carve out 15 weekly minutes that are just theirs — same time each week if possible. Ask specific questions ("what\'s the hardest part of school right now?") not vague ones ("how are you?").',
  },
  {
    range: 'Ages 12–17',
    tag: 'Independence and identity',
    summary: 'Adolescents need to differentiate from family — and that\'s harder when family\'s gravitational pull is so heavy. They may push away. They may pull closer. Both are normal. They need permission to have a life that isn\'t about their sibling.',
    sayIt: '"Your life — your friendships, your interests, what you want — matters as much as anyone\'s in this family. You don\'t need permission to want a normal teenage life."',
    doIt: 'Resist the urge to recruit them as helpers more than is fair. Say yes to sleepovers and activities even when it\'s logistically hard. Connect them with sibling support groups (Sibshops is the gold standard).',
  },
];

const PRINCIPLES = [
  {
    icon: Heart,
    title: 'Name the imbalance, don\'t pretend',
    body: 'Pretending it\'s "fair" when it visibly isn\'t teaches kids not to trust their own perception. "It\'s not fair, and we\'re still doing the best we can. Both are true" is more honest and more reassuring.',
  },
  {
    icon: Star,
    title: 'Catch them being themselves, not helpful',
    body: 'Praise that lands hardest is praise for who they are — funny, curious, kind — not for what they did to make your life easier. The latter creates a fragile sense of self.',
  },
  {
    icon: BookOpen,
    title: 'Give them somewhere to put it',
    body: 'A therapist who specializes in siblings of children with disabilities, a sibling support group like Sibshops, or even just a trusted adult outside the family. They need a space where it\'s about them.',
  },
];

export function SiblingsTopic() {
  const [openAge, setOpenAge] = useState<number | null>(0);

  return (
    <div className={styles.topicBody}>
      <section className={styles.topicSection}>
        <p className={styles.topicLead}>
          &ldquo;Glass child&rdquo; is the term researchers use — siblings of disabled children who often try not to add
          anything to your plate. They notice the imbalance. They love their sibling and they grieve quietly,
          and they often don&apos;t name what they need because they can see how stretched you already are.
        </p>
        <p className={styles.topicLead}>
          Even 15 minutes a week of dedicated one-on-one attention is the single biggest predictor of sibling
          resilience. Not a fancy outing — undivided presence.
        </p>
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <Users size={16} />
          <h3>What to say, by age</h3>
        </div>
        <div className={styles.siblingsAccordion}>
          {AGE_GROUPS.map((g, i) => {
            const isOpen = openAge === i;
            return (
              <div key={i} className={`${styles.siblingItem} ${isOpen ? styles.siblingItemOpen : ''}`}>
                <button
                  className={styles.siblingHead}
                  onClick={() => setOpenAge(isOpen ? null : i)}
                >
                  <div>
                    <p className={styles.siblingRange}>{g.range}</p>
                    <p className={styles.siblingTag}>{g.tag}</p>
                  </div>
                </button>
                {isOpen && (
                  <div className={styles.siblingBody}>
                    <p className={styles.siblingSummary}>{g.summary}</p>
                    <div className={styles.siblingScript}>
                      <span className={styles.siblingScriptLabel}>Try saying</span>
                      <p>&ldquo;{g.sayIt}&rdquo;</p>
                    </div>
                    <div className={styles.siblingScript}>
                      <span className={styles.siblingScriptLabel}>Try doing</span>
                      <p>{g.doIt}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <Heart size={16} />
          <h3>Three principles for the long arc</h3>
        </div>
        <div className={styles.couplesGrid}>
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className={styles.couplesCard}>
                <Icon size={16} className={styles.couplesIcon} />
                <p className={styles.couplesCardTitle}>{p.title}</p>
                <p className={styles.couplesCardBody}>{p.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.topicCallout}>
        <Users size={18} />
        <div>
          <p className={styles.topicCalloutHead}>Their experience deserves room too.</p>
          <p className={styles.topicCalloutBody}>
            You can&apos;t be a perfectly equal parent right now — that&apos;s not the deal you got. But you can be an
            honest one. Honesty about the imbalance, paired with steady reassurance that they matter, is what
            keeps siblings whole through this.
          </p>
        </div>
      </section>
    </div>
  );
}
