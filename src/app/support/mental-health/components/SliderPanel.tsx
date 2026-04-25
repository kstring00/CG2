'use client';

import { SLIDER_DEFS, type Inputs } from './RiskEngine';
import styles from '../mental-health.module.css';

interface Props {
  inputs: Inputs;
  onChange: (key: keyof Inputs, value: number) => void;
}

export function SliderPanel({ inputs, onChange }: Props) {
  return (
    <div className={styles.sliders}>
      {SLIDER_DEFS.map((def) => {
        const v = inputs[def.key];
        return (
          <div key={def.key} className={styles.sliderRow}>
            <span className={styles.sliderLabel}>{def.label}</span>
            <span className={styles.sliderValue}>{v}</span>
            <span className={styles.sliderDescriptor}>{def.lowDesc} ↔ {def.highDesc}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={v}
              className={def.adverse ? 'adverse' : 'positive'}
              onChange={(e) => onChange(def.key, parseInt(e.target.value, 10))}
            />
          </div>
        );
      })}
    </div>
  );
}
