'use client';

import { useState } from 'react';
import { CloudRain, Heart, Wind, Shield } from 'lucide-react';
import styles from '../../mental-health.module.css';

interface Props {
  onOpenCalming?: () => void;
}

const HARD_FEELINGS = [
  {
    id: 'screamed',
    title: 'I screamed at my child today.',
    response: 'You are not the only parent who has done this. You are not a monster. The fact that you noticed and feel bad about it is the most important thing. Repair is what makes the relationship — not perfection.',
  },
  {
    id: 'thought',
    title: 'I thought, "I cannot do this anymore."',
    response: 'This is one of the most common thoughts caregivers report having and one of the least talked about. It does not mean you do not love your child. It means you are exhausted past your capacity. The thought is information — about how depleted you are. It is not a verdict on you.',
  },
  {
    id: 'cried',
    title: "I cried in the car, in the bathroom, in the parking lot.",
    response: 'These are the places caregivers grieve in. Not because the grief is shameful, but because there\'s no other space for it. Naming it here is the first step in not having to hide it.',
  },
  {
    id: 'jealous',
    title: 'I felt jealous of other families who don\'t have to do this.',
    response: 'Jealousy is grief looking for a target. You are mourning the path you expected. That mourning is allowed to coexist with deep love for the child you have. Both are true.',
  },
  {
    id: 'numb',
    title: 'I felt nothing — and then felt guilty for feeling nothing.',
    response: 'Numbness is what happens when feelings get more expensive than your nervous system can afford. It is a protection, not a flaw. It tends to lift when sleep, support, and nutrition return.',
  },
];

export function HardDaysTopic({ onOpenCalming }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = HARD_FEELINGS.find((f) => f.id === selected);

  return (
    <div className={styles.topicBody}>
      <section className={styles.topicSection}>
        <p className={styles.topicLead}>
          Hard days don&apos;t need a hero. They need a smaller plan. On hard days, decisions feel heavier — a
          5-line plan from your better self does the deciding for you. What gets dropped (laundry, dinner-as-event),
          what stays (kid fed, kid safe, you breathing), and one person you&apos;ll text. Today does not require
          perfection. It requires getting through.
        </p>
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <Heart size={16} />
          <h3>Pick what felt true today</h3>
        </div>
        <p className={styles.topicHelper}>
          You don&apos;t have to share this. Tap one to read what we wish more parents heard.
        </p>
        <div className={styles.feelingsGrid}>
          {HARD_FEELINGS.map((f) => (
            <button
              key={f.id}
              className={`${styles.feelingCard} ${selected === f.id ? styles.feelingCardActive : ''}`}
              onClick={() => setSelected(selected === f.id ? null : f.id)}
            >
              {f.title}
            </button>
          ))}
        </div>
        {sel && (
          <div className={styles.feelingResponse}>
            <p>{sel.response}</p>
          </div>
        )}
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <Shield size={16} />
          <h3>The hard-day script</h3>
        </div>
        <p className={styles.topicHelper}>
          Build it on a good day. Use it on a bad one. Your hard-day plan tool in Calming Tools saves it for you.
        </p>
        <ol className={styles.scriptOl}>
          <li>
            <strong>Drop one thing on the list.</strong> Laundry, dinner-as-event, an email, a non-essential errand.
            Pick the one that feels heaviest right now and let it go for today.
          </li>
          <li>
            <strong>Hold the floor.</strong> Kid fed (something — anything). Kid safe. You breathing. That&apos;s the
            day&apos;s job. Everything else is bonus.
          </li>
          <li>
            <strong>Send one text.</strong> One person, one line. &ldquo;Rough one. Just needed someone to know.&rdquo;
            That counts. You don&apos;t need to be eloquent. You need to not be alone.
          </li>
          <li>
            <strong>Pick one calming tool.</strong> Two minutes is enough. The breath reset, the body scan, the
            floor list — whatever you can manage right now.
          </li>
        </ol>
        {onOpenCalming && (
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ marginTop: 16 }}
            onClick={onOpenCalming}
          >
            Open Calming Tools →
          </button>
        )}
      </section>

      <section className={styles.topicCallout}>
        <Wind size={18} />
        <div>
          <p className={styles.topicCalloutHead}>Hard does not mean failing.</p>
          <p className={styles.topicCalloutBody}>
            It means today asked for more than your bandwidth had. That happens. The repair is in tomorrow,
            not in beating yourself up tonight. If today felt unsafe — for you or your child — please use the
            Urgent Help tab. Reaching out is not failure. It is part of caregiving.
          </p>
        </div>
      </section>
    </div>
  );
}
