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
  onRangeChange: (r: number) => void;
  onMetricChange: (m: string) => void;
}

export function TrendsTab({ history, range, metric, insights, onRangeChange, onMetricChange }: Props) {
  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1>My <em>trends</em></h1>
          <p>Patterns from the last month · Click metrics to compare</p>
        </div>
      </header>

      <div className={`${styles.card} ${styles.cardPadLg} ${styles.chartCard}`}>
        <div className={styles.chartCardTop}>
          <div>
            <div className={styles.cardTitle}>{range}-day wellness</div>
            <div className={styles.cardSubtitle}>Pick a metric to overlay · Tap a date to see the score</div>
          </div>
          <div className={styles.chartCardActions}>
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
        </div>

        <div className={styles.metricSegments} role="tablist" aria-label="Choose metric">
          {METRICS.map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={metric === m}
              className={`${styles.metricSegment} ${metric === m ? styles.metricSegmentActive : ''}`}
              onClick={() => onMetricChange(m)}
            >
              {METRIC_LABELS[m]}
            </button>
          ))}
        </div>

        <TrendChart
          history={history}
          range={range}
          metric={metric}
          heightClass={styles.chartWrapLg}
          maxTicksLimit={range === 7 ? 7 : 8}
        />
      </div>

      <div className={`${styles.card} ${styles.sectionSpacer}`}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitle}>Patterns we&apos;ve noticed</div>
            <div className={styles.cardSubtitle}>Honest observations · Always paired with a next step</div>
          </div>
        </div>
        <div className={styles.patternGrid}>
          {insights.length === 0 && (
            <div className={styles.patternEmpty}>
              Patterns appear here after a few days of check-ins.
            </div>
          )}
          {insights.map((ins, i) => {
            const tone = ins.type === 'alert' ? 'alert' : ins.type === 'warning' ? 'warning' : 'good';
            return (
              <div
                key={i}
                className={`${styles.patternCard} ${styles[`patternCard_${tone}`]}`}
              >
                <span className={styles.patternBadge}>
                  {tone === 'alert' ? 'Heads up' : tone === 'warning' ? 'Watch this' : 'Good to know'}
                </span>
                <div
                  className={styles.patternText}
                  dangerouslySetInnerHTML={{ __html: ins.text }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
