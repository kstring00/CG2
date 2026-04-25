'use client';

import type { HistoryDay } from './RiskEngine';
import type { Insight } from './RecommendationsEngine';
import { TrendChart } from './TrendChart';
import styles from '../mental-health.module.css';

const METRICS = ['overall', 'stress', 'sleep', 'anxiety', 'support', 'energy'];
const METRIC_LABELS: Record<string, string> = {
  overall: 'Overall wellness',
  stress: 'Stress',
  sleep: 'Sleep',
  anxiety: 'Anxiety',
  support: 'Support',
  energy: 'Energy',
};

interface Props {
  history: HistoryDay[];
  range: number;
  metric: string;
  insights: Insight[];
  darkMode: boolean;
  onRangeChange: (r: number) => void;
  onMetricChange: (m: string) => void;
}

export function TrendsTab({ history, range, metric, insights, darkMode, onRangeChange, onMetricChange }: Props) {
  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1>My <em>trends</em></h1>
          <p>Patterns from the last month · Click metrics to compare</p>
        </div>
      </header>

      <div className={`${styles.card} ${styles.cardPadLg}`}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitle}>30-day wellness</div>
            <div className={styles.cardSubtitle}>Background bands show your risk zone over time</div>
          </div>
          <div className={styles.rangeTabs}>
            {[7, 30].map((r) => (
              <button
                key={r}
                className={`${styles.rangeTab} ${range === r ? styles.rangeTabActive : ''}`}
                onClick={() => onRangeChange(r)}
              >
                {r === 7 ? '7d' : '30d'}
              </button>
            ))}
          </div>
        </div>
        <TrendChart
          history={history}
          range={range}
          metric={metric}
          darkMode={darkMode}
          heightClass={styles.chartWrapLg}
          maxTicksLimit={range === 7 ? 7 : 8}
        />
        <div className={styles.chartToggles}>
          {METRICS.map((m) => (
            <button
              key={m}
              className={`${styles.togglePill} ${metric === m ? styles.togglePillActive : ''}`}
              onClick={() => onMetricChange(m)}
            >
              {METRIC_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div className={`${styles.card} ${styles.sectionSpacer}`}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitle}>Patterns we've noticed</div>
            <div className={styles.cardSubtitle}>Honest observations · Always paired with a next step</div>
          </div>
        </div>
        <div className={styles.insightList}>
          {insights.map((ins, i) => (
            <div
              key={i}
              className={`${styles.insight} ${ins.type === 'warning' ? styles.insightWarning : ins.type === 'alert' ? styles.insightAlert : ''}`}
            >
              <div className={styles.insightBullet} />
              <div
                className={styles.insightText}
                dangerouslySetInnerHTML={{ __html: ins.text }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
