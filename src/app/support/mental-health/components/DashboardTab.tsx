'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Inputs, HistoryDay, Driver } from './RiskEngine';
import { riskState } from './RiskEngine';
import type { Rec, Insight } from './RecommendationsEngine';
import { SliderPanel } from './SliderPanel';
import { TrendChart } from './TrendChart';
import styles from '../mental-health.module.css';

function useAnimatedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    const start = prevRef.current;
    if (start === target) { prevRef.current = target; return; }
    const duration = 400;
    const startTime = performance.now();
    let rafId: number;

    function step(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (t < 1) { rafId = requestAnimationFrame(step); }
      else { prevRef.current = target; }
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target]);

  return value;
}

function getDayGreeting(streak: number): string {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const hour = now.getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  if (streak > 0) {
    return `${day} ${timeOfDay} · ${streak}-day check-in streak`;
  }
  return `${day} ${timeOfDay} · Pull a slider or take a 1-minute check-in`;
}

const ICON_SVGS: Record<string, React.ReactNode> = {
  priority: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  support: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
    </svg>
  ),
  calm: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>
    </svg>
  ),
  insight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.5.5 1 1.3 1 2.3v1h6v-1c0-1 .5-1.8 1-2.3A7 7 0 0012 2z"/>
    </svg>
  ),
};

const REC_ICON_CLASS: Record<string, string> = {
  priority: styles.recIconPriority,
  support: styles.recIconSupport,
  calm: styles.recIconCalm,
  insight: styles.recIconInsight,
};

interface Props {
  userName: string;
  isReturning: boolean;
  streak: number;
  inputs: Inputs;
  history: HistoryDay[];
  risk: number;
  wellness: number;
  drivers: Driver[];
  explainText: string;
  recs: Rec[];
  insights: Insight[];
  range: number;
  metric: string;
  onInputChange: (key: keyof Inputs, value: number) => void;
  onRangeChange: (r: number) => void;
  onMetricChange: (m: string) => void;
  onNavigate: (tab: string) => void;
}

export function DashboardTab({
  userName,
  isReturning,
  streak,
  inputs,
  history,
  risk,
  wellness,
  drivers,
  explainText,
  recs,
  insights,
  range,
  metric,
  onInputChange,
  onRangeChange,
  onMetricChange,
  onNavigate,
}: Props) {
  const animatedWellness = useAnimatedNumber(wellness);
  const rs = riskState(risk);

  const riskPillClass = {
    stable: styles.riskPillStable,
    watch: styles.riskPillWatch,
    risk: styles.riskPillRisk,
  }[rs.key];

  const heroScoreColor = {
    stable: 'var(--sage-deep)',
    watch: 'var(--gold)',
    risk: 'var(--burgundy)',
  }[rs.key];

  const METRICS = ['overall', 'stress', 'sleep', 'anxiety', 'support', 'energy'];
  const METRIC_LABELS: Record<string, string> = {
    overall: 'Overall',
    stress: 'Stress',
    sleep: 'Sleep',
    anxiety: 'Anxiety',
    support: 'Support',
    energy: 'Energy',
  };

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1>
            {userName
              ? <>{isReturning ? 'Welcome back, ' : 'Welcome, '}<em>{userName}</em>.</>
              : (isReturning ? 'Welcome back.' : 'Welcome.')}
          </h1>
          <p>{getDayGreeting(streak)}</p>
        </div>
        <div className={styles.headerActions}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => onNavigate('calming')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            Calming tools
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onNavigate('checkin')}>
            New check-in
          </button>
        </div>
      </header>

      {/* Compact hero — score + sliders side by side, chart moved below the fold */}
      <div className={styles.dashGrid}>
        <div className={styles.heroCardCompact}>
          <div className={styles.heroLabel}>
            <span className={styles.liveDot} />
            Caregiver wellness · Live
          </div>
          <div className={styles.heroScoreRow}>
            <div className={styles.heroScoreCompact} style={{ color: heroScoreColor }}>
              {animatedWellness}
            </div>
            <div className={styles.heroScoreSuffix}>/ 100</div>
            <div style={{ marginLeft: 'auto' }}>
              <div className={`${styles.riskPill} ${riskPillClass}`}>
                <span className={styles.riskPillDot} />
                {rs.label}
              </div>
            </div>
          </div>
          <p className={styles.heroExplain}>{explainText}</p>
          <div className={styles.drivingList}>
            {drivers.map((d) => {
              const isUp = d.impact > 0;
              return (
                <div
                  key={d.key}
                  className={`${styles.drivingChip} ${isUp ? styles.drivingChipUp : styles.drivingChipDown}`}
                >
                  <span className={styles.drivingChipArrow}>{isUp ? '↑' : '↓'}</span>
                  {d.label}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitle}>How are you right now?</div>
              <div className={styles.cardSubtitle}>Pull a slider — your score moves with you, and saves automatically</div>
            </div>
          </div>
          <SliderPanel inputs={inputs} onChange={onInputChange} />
        </div>
      </div>

      {/* Recommendations — bumped up so they're the first thing after the hero */}
      <div className={`${styles.card} ${styles.sectionSpacer}`}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitle}>For you, right now</div>
            <div className={styles.cardSubtitle}>Updates as your inputs change · Based on what&apos;s driving your score today</div>
          </div>
          <span className={styles.heroLabel} style={{ marginBottom: 0 }}>
            <span className={styles.liveDot} />
            Live
          </span>
        </div>
        <div className={styles.recsGrid}>
          {recs.map((r, idx) => (
            <div key={idx} className={styles.rec} style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className={styles.recTag}>{r.tag}</div>
              <div className={`${styles.recIcon} ${REC_ICON_CLASS[r.icon]}`}>
                {ICON_SVGS[r.icon]}
              </div>
              <div className={styles.recTitle}>{r.title}</div>
              <div className={styles.recBody}>{r.body}</div>
              {r.href
                ? <Link href={r.href} className={styles.recAction}>{r.action}</Link>
                : <button className={styles.recAction}>{r.action}</button>}
            </div>
          ))}
        </div>
      </div>

      {/* Trend — collapsed to a tighter card; a button reveals the deeper Trends tab */}
      <div className={`${styles.card} ${styles.sectionSpacer}`}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitle}>Wellness over time</div>
            <div className={styles.cardSubtitle}>Last {range} days · Tap a metric to overlay</div>
          </div>
          <div className={styles.cardHeaderRight}>
            <div className={styles.rangeTabs}>
              {[7, 30].map((r) => (
                <button
                  key={r}
                  className={`${styles.rangeTab} ${range === r ? styles.rangeTabActive : ''}`}
                  onClick={() => onRangeChange(r)}
                >
                  {r}d
                </button>
              ))}
            </div>
            <button
              className={styles.miniLink}
              onClick={() => onNavigate('trends')}
            >
              Open trends →
            </button>
          </div>
        </div>
        <div className={styles.chartCompact}>
          <TrendChart
            history={history}
            range={range}
            metric={metric}
            maxTicksLimit={range === 7 ? 7 : 8}
          />
        </div>
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

      {/* Patterns — improved presentation, grouped */}
      <div className={`${styles.card} ${styles.sectionSpacer}`}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitle}>Patterns worth knowing</div>
            <div className={styles.cardSubtitle}>From your last 30 days · Not a diagnosis — just what we&apos;ve noticed</div>
          </div>
        </div>
        <div className={styles.patternGrid}>
          {insights.length === 0 && (
            <div className={styles.patternEmpty}>
              Patterns appear here after a few days of check-ins. Pull a slider, do a quick check-in, and come back tomorrow.
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
