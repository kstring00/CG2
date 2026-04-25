'use client';

import { useState } from 'react';
import type { Inputs } from './RiskEngine';
import { computeRiskScore, wellnessFromRisk, riskState, buildExplain, getDrivingFactors } from './RiskEngine';
import { SliderPanel } from './SliderPanel';
import styles from '../mental-health.module.css';

const EMOJI_OPTS = [
  { val: 1, emoji: '😌', label: 'Calm' },
  { val: 2, emoji: '🙂', label: 'Steady' },
  { val: 3, emoji: '😐', label: 'Mixed' },
  { val: 4, emoji: '😣', label: 'Hard' },
  { val: 5, emoji: '😞', label: 'Heavy' },
];

const CHIPS = [
  { id: 'stress', label: 'Stress' },
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'overwhelm', label: 'Overwhelm' },
  { id: 'isolation', label: 'Isolation' },
  { id: 'exhaustion', label: 'Emotional exhaustion' },
  { id: 'grief', label: 'Grief' },
  { id: 'anger', label: 'Anger / frustration' },
  { id: 'guilt', label: 'Guilt' },
];

interface Props {
  inputs: Inputs;
  onInputChange: (key: keyof Inputs, value: number) => void;
  onComplete: () => void;
}

export function CheckInTab({ inputs, onInputChange, onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [feel, setFeel] = useState(3);
  const [chips, setChips] = useState<string[]>([]);

  const MAX_STEPS = 4;

  function handleChipToggle(id: string) {
    const next = chips.includes(id) ? chips.filter((c) => c !== id) : [...chips, id];
    setChips(next);

    // Nudge global inputs based on chip selection
    if (next.includes('stress')) onInputChange('stress', Math.max(inputs.stress, 65));
    if (next.includes('anxiety')) onInputChange('anxiety', Math.max(inputs.anxiety, 65));
    if (next.includes('overwhelm')) onInputChange('overwhelm', Math.max(inputs.overwhelm, 65));
    if (next.includes('isolation')) onInputChange('isolation', Math.max(inputs.isolation, 65));
    if (next.includes('exhaustion')) onInputChange('bandwidth', Math.min(inputs.bandwidth, 35));
  }

  function nav(dir: number) {
    const next = step + dir;
    if (next < 1) return;
    if (next > MAX_STEPS) {
      onComplete();
      setStep(1);
      setFeel(3);
      setChips([]);
      return;
    }
    setStep(next);
  }

  const risk = computeRiskScore(inputs);
  const wellness = wellnessFromRisk(risk);
  const rs = riskState(risk);
  const drivers = getDrivingFactors(inputs);

  const riskPillClass = {
    stable: styles.riskPillStable,
    watch: styles.riskPillWatch,
    risk: styles.riskPillRisk,
  }[rs.key];

  let nextStepCopy: string;
  if (rs.key === 'risk') nextStepCopy = 'One small thing tonight: lights out 30 minutes earlier. The rest can wait.';
  else if (rs.key === 'watch') nextStepCopy = 'A 3-minute breath reset before the bedtime routine starts.';
  else nextStepCopy = 'Notice what worked today. Write it down — your future-self on a hard day will thank you.';

  const nextBtnLabel = step === 4 ? 'Save & continue →' : step === 3 ? 'Almost done →' : 'Continue →';

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1>Today's <em>check-in</em></h1>
          <p>Less than a minute. Honest is more useful than tidy.</p>
        </div>
      </header>

      <div className={styles.checkinWrap}>
        <div className={styles.checkinStep}>
          {/* Progress dots */}
          <div className={styles.checkinProgress}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={[
                  styles.checkinDot,
                  i < step ? styles.checkinDotDone : '',
                  i === step ? styles.checkinDotActive : '',
                ].join(' ')}
              />
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div className={styles.checkinQuestion}>How's the weight of today, on a scale?</div>
              <div className={styles.checkinHelper}>There's no right answer. Whatever you'd say to a friend who really gets it.</div>
              <div className={styles.emojiRow}>
                {EMOJI_OPTS.map((opt) => (
                  <button
                    key={opt.val}
                    className={`${styles.emojiBtn} ${feel === opt.val ? styles.emojiBtnSelected : ''}`}
                    onClick={() => setFeel(opt.val)}
                  >
                    <span>{opt.emoji}</span>
                    <span className={styles.emojiBtnLabel}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <div className={styles.checkinQuestion}>What's running high?</div>
              <div className={styles.checkinHelper}>Tap any that fit. You can choose more than one.</div>
              <div className={styles.chipRow}>
                {CHIPS.map((c) => (
                  <button
                    key={c.id}
                    className={`${styles.chip} ${chips.includes(c.id) ? styles.chipSelected : ''}`}
                    onClick={() => handleChipToggle(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <div className={styles.checkinQuestion}>A few quick numbers</div>
              <div className={styles.checkinHelper}>Slide each one. Your live score updates below.</div>
              <div style={{ marginBottom: 24 }}>
                <SliderPanel inputs={inputs} onChange={onInputChange} />
              </div>
              <div className={styles.livePreview}>
                <div className={styles.livePreviewLabel}>Live score</div>
                <div className={styles.livePreviewValue}>
                  <span>{wellness}</span>
                  <span className={styles.livePreviewZone}>{rs.label}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <div className={styles.checkinQuestion}>Thanks for showing up.</div>
              <div className={styles.checkinHelper}>Here's what today looks like, and one small next step.</div>

              <div className={styles.checkinSummaryBox}>
                <div className={styles.checkinSummaryMeta}>
                  <span className={styles.checkinSummaryMetaLabel}>Today's score</span>
                  <div className={`${styles.riskPill} ${riskPillClass}`}>
                    <span className={styles.riskPillDot} />
                    {rs.label}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span className={styles.checkinFinalScore}>{wellness}</span>
                  <span className={styles.checkinFinalSuffix}>/ 100</span>
                </div>
                <p className={styles.checkinFinalNarrative}>{buildExplain(risk, drivers)}</p>
              </div>

              <div className={styles.checkinNextStep}>
                <div className={styles.checkinNextStepLabel}>Your next step</div>
                <div className={styles.checkinNextStepText}>{nextStepCopy}</div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.checkinNav}>
            <button
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={() => nav(-1)}
              style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
            >
              ← Back
            </button>
            <span className={styles.checkinStepLabel}>Step {step} of {MAX_STEPS}</span>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => nav(1)}>
              {nextBtnLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
