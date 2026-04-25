'use client';

import { useState, useRef } from 'react';
import styles from '../mental-health.module.css';

interface Props {
  onComplete: (name: string, signIn: boolean) => void;
}

export function OnboardingModal({ onComplete }: Props) {
  const [screen, setScreen] = useState(1);
  const [capturedName, setCapturedName] = useState('');
  const [signIn, setSignIn] = useState(true);
  const nameRef = useRef<HTMLInputElement>(null);

  function goTo(n: number) {
    setScreen(n);
  }

  // Capture the name from the ref BEFORE screen 2 unmounts, then advance.
  function advanceToScreen3() {
    setCapturedName(nameRef.current?.value.trim() ?? '');
    setScreen(3);
  }

  function finish() {
    onComplete(capturedName, signIn);
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
              high needs is real work, and your wellbeing is part of theirs. We&apos;ll help you notice
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
            <p>
              Add your first name if you&apos;d like, and we&apos;ll save your check-ins on this device so
              your patterns build over time. We don&apos;t send anything to a server yet.
            </p>
            <input
              ref={nameRef}
              className={styles.modalInput}
              placeholder="Your first name"
              defaultValue={capturedName}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && advanceToScreen3()}
            />
            <label className={styles.modalCheckRow}>
              <input
                type="checkbox"
                checked={signIn}
                onChange={(e) => setSignIn(e.target.checked)}
              />
              <span>
                <strong>Save my data on this device.</strong>
                <span className={styles.modalCheckHelp}>
                  Sliders, check-ins, and notes persist across visits. Sign out anytime to clear it.
                </span>
              </span>
            </label>
            <button className={styles.modalSkip} onClick={() => onComplete('', false)}>
              Skip — just let me look around
            </button>
            <div className={styles.modalActions}>
              <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => goTo(1)}>
                ← Back
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={advanceToScreen3}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {screen === 3 && (
          <div>
            <h2>One small thing <em>before we start</em></h2>
            <p>
              This isn&apos;t a diagnosis tool — it&apos;s a companion. We&apos;ll show you what your patterns look
              like, and offer next steps that fit the day you&apos;re actually having. If something hard
              comes up, urgent help is always one tap away in the tab bar.
            </p>
            <div className={styles.modalActions}>
              <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => goTo(2)}>
                ← Back
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={finish}>
                I&apos;m ready
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
