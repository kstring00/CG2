'use client';

import { useState } from 'react';
import { Moon, Brain, Wind, Sun, Heart, Clock, AlertCircle } from 'lucide-react';
import styles from '../../mental-health.module.css';

const SLEEP_QUESTIONS = [
  'Do you fall asleep thinking through tomorrow\'s therapy schedule, appointments, or what you need to prepare?',
  'Do you wake up between 2–4am and find yourself unable to stop problem-solving?',
  'Do you sleep with one ear open — even when nothing is happening — because you\'ve learned not to fully relax?',
  'Has it been more than a week since you woke up feeling genuinely rested?',
  'Do you need caffeine within 30 minutes of waking up just to function?',
  'Do you feel more anxious or emotionally fragile in the evenings, even when the day went okay?',
  'Do you feel dread at bedtime — not sleepiness, but a tight, wound-up alertness that won\'t let you land?',
];

const WIND_DOWN = [
  { time: 'T–30 min', icon: Moon, title: 'Phone down, screen off', desc: 'Not on silent — down. On the charger, across the room if possible. Every scroll extends your cortisol response by minutes.' },
  { time: 'T–25 min', icon: Wind, title: 'Physical transition', desc: 'Warm shower, a cup of caffeine-free tea, or simply changing into clothes you only sleep in. The ritual signals: the day is over.' },
  { time: 'T–15 min', icon: Brain, title: 'Body scan — top to bottom', desc: 'Lying down, eyes closed. Crown, forehead, jaw, shoulders, chest, belly, hips, legs, feet. Notice the tension. Release what you can.' },
  { time: 'T–8 min', icon: Heart, title: 'One thing to release tonight', desc: 'Pick one worry that does not need to be solved before morning. Name it. Then say: "I am putting this down for tonight. It will be there in the morning if it needs me."' },
  { time: 'T–3 min', icon: Sun, title: 'One thing you did well today', desc: 'Not a big thing. Something small and real. Your brain will look for threats as you fall asleep unless you give it something else to hold.' },
];

const MYTHS = [
  { myth: '"I can catch up on sleep over the weekend."', truth: 'You cannot. Chronic sleep deprivation changes your baseline cognitive function in ways one long Saturday does not reverse.' },
  { myth: '"I just need to push through — it\'ll get better when things calm down."', truth: 'For caregivers, "when things calm down" is a mirage. There is always another transition. The time to address sleep is now, when you still have something left.' },
  { myth: '"Melatonin will fix this."', truth: 'Melatonin can help with sleep onset but does not address the hypervigilance and nervous-system dysregulation that drive most caregiver sleep disruption.' },
];

function getSleepScore(yes: number) {
  if (yes <= 2) return { label: 'Holding the line', tone: 'good', body: 'You\'re managing sleep reasonably well given the load. Protect what\'s working.' };
  if (yes <= 4) return { label: 'Sleep debt is building', tone: 'warning', body: 'A few patterns are catching up with you. Tonight\'s wind-down sequence below is your highest-leverage intervention.' };
  return { label: 'You are running on empty', tone: 'alert', body: 'This level of sleep disruption is serious — it changes how your brain regulates everything else. Please make this a priority. Talk to your care coordinator about adding a sleep referral.' };
}

export function SleepTopic() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(SLEEP_QUESTIONS.map(() => null));
  const [openStep, setOpenStep] = useState<number | null>(0);
  const allAnswered = answers.every((a) => a !== null);
  const yesCount = answers.filter((a) => a === true).length;
  const score = allAnswered ? getSleepScore(yesCount) : null;

  return (
    <div className={styles.topicBody}>
      <section className={styles.topicSection}>
        <p className={styles.topicLead}>
          Sleep is the lever that resets every other lever. It is also the first thing caregivers lose, and
          the last thing they think to protect. You cannot regulate your child&apos;s nervous system from a
          deregulated body. Tonight&apos;s priority is rest, not productivity.
        </p>
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <Brain size={16} />
          <h3>How is your sleep, actually?</h3>
        </div>
        <p className={styles.topicHelper}>Yes or no. No middle ground — go with your gut.</p>
        <ul className={styles.sleepQuiz}>
          {SLEEP_QUESTIONS.map((q, i) => (
            <li key={i} className={styles.sleepQRow}>
              <span className={styles.sleepQText}>{q}</span>
              <div className={styles.sleepQBtns}>
                <button
                  className={`${styles.sleepQBtn} ${answers[i] === false ? styles.sleepQBtnNo : ''}`}
                  onClick={() => setAnswers((prev) => prev.map((a, j) => (j === i ? false : a)))}
                >
                  No
                </button>
                <button
                  className={`${styles.sleepQBtn} ${answers[i] === true ? styles.sleepQBtnYes : ''}`}
                  onClick={() => setAnswers((prev) => prev.map((a, j) => (j === i ? true : a)))}
                >
                  Yes
                </button>
              </div>
            </li>
          ))}
        </ul>
        {score && (
          <div className={`${styles.patternCard} ${styles[`patternCard_${score.tone}`]}`} style={{ marginTop: 16 }}>
            <span className={styles.patternBadge}>
              {yesCount} / {SLEEP_QUESTIONS.length} · {score.label}
            </span>
            <div className={styles.patternText}>{score.body}</div>
          </div>
        )}
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <Clock size={16} />
          <h3>Tonight&apos;s 30-minute wind-down</h3>
        </div>
        <p className={styles.topicHelper}>
          Not a hack. A protocol. Tap any step to expand. You can run this any night this week.
        </p>
        <div className={styles.windDown}>
          {WIND_DOWN.map((step, i) => {
            const Icon = step.icon;
            const isOpen = openStep === i;
            return (
              <div key={i} className={`${styles.windStep} ${isOpen ? styles.windStepOpen : ''}`}>
                <button
                  className={styles.windHead}
                  onClick={() => setOpenStep(isOpen ? null : i)}
                >
                  <span className={styles.windTime}>{step.time}</span>
                  <span className={styles.windIcon}><Icon size={16} /></span>
                  <span className={styles.windTitle}>{step.title}</span>
                </button>
                {isOpen && <p className={styles.windDesc}>{step.desc}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <AlertCircle size={16} />
          <h3>What we wish more caregivers knew</h3>
        </div>
        <div className={styles.mythGrid}>
          {MYTHS.map((m, i) => (
            <div key={i} className={styles.mythCard}>
              <p className={styles.mythLabel}>The myth</p>
              <p className={styles.mythText}>{m.myth}</p>
              <p className={styles.mythLabel} style={{ marginTop: 10 }}>The truth</p>
              <p className={styles.mythTruth}>{m.truth}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.topicCallout}>
        <Moon size={18} />
        <div>
          <p className={styles.topicCalloutHead}>30 extra minutes tonight is more than anything you&apos;d get done after 9 PM.</p>
          <p className={styles.topicCalloutBody}>
            Your child&apos;s sleep affects yours. If chronic sleep disruption is a problem, name it at your next
            care meeting — &ldquo;my sleep is being disrupted, I cannot function at this level&rdquo; is a clinical
            statement that deserves a clinical response.
          </p>
        </div>
      </section>
    </div>
  );
}
