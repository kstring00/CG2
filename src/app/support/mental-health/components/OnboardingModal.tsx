'use client';

import { useState, useRef } from 'react';
import styles from '../mental-health.module.css';

interface Props {
  onComplete: (name: string) => void;
}

export function OnboardingModal({ onComplete }: Props) {
  const [screen, setScreen] = useState(1);
  const nameRef = useRef<HTMLInputElement>(null);

  function goTo(n: number) {
    setScreen(n);
  }

  function finish() {
    const name = nameRef.current?.value.trim() || '';
    onComplete(name);
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalProgress}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={[styles.modalStep, i <= screen ? styles.modalStepActive : ''].join(' ')}
            />
          ))}
        </div>

        {screen === 1 && (
          <div>
            <h2>Welcome. <em>You matter here too.</em></h2>
            <p>
              This is a quiet space inside CG built for you — the parent. Caring for a child with
              high needs is real work, and your wellbeing is part of theirs. We'll help you notice
              patterns, catch hard days early, and find small ways to feel steadier.
            </p>
            <div className={styles.modalActions}>
              <span className={styles.modalMuted}>Takes about 60 seconds</span>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => goTo(2)}>
                Begin →
              </button>
            </div>
          </div>
        )}

        {screen === 2 && (
          <div>
            <h2>Want to make this <em>feel like yours?</em></h2>
            <p>Add your first name if you'd like. Totally optional — this stays on your device only.</p>
            <input
              ref={nameRef}
              className={styles.modalInput}
              placeholder="Your first name"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && goTo(3)}
            />
            <button className={styles.modalSkip} onClick={() => onComplete('')}>
              Skip for now
            </button>
            <div className={styles.modalActions}>
              <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => goTo(1)}>
                ← Back
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => goTo(3)}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {screen === 3 && (
          <div>
            <h2>One small thing <em>before we start</em></h2>
            <p>
              This isn't a diagnosis tool — it's a companion. We'll show you what your patterns look
              like, and offer next steps that fit the day you're actually having. If something hard
              comes up, urgent help is always one tap away in the sidebar.
            </p>
            <div className={styles.modalActions}>
              <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => goTo(2)}>
                ← Back
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={finish}>
                I'm ready
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
