'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type Plugin,
  type ChartOptions,
  type ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { HistoryDay } from './RiskEngine';
import styles from '../mental-health.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const PALETTE = {
  ink: '#2A2520',
  inkMuted: '#897E72',
  lineSoft: '#EFE7D6',
  sage: '#6B8068',
  paper: '#FBF7EF',
  stableBg: '#E4EBDB',
  watchBg: '#F2E6C2',
  riskBg: '#ECD2CE',
};

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function createZonesPlugin(c: typeof PALETTE): Plugin<'line'> {
  return {
    id: 'zones',
    beforeDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) return;
      const yScale = scales['y'];
      if (!yScale) return;

      ctx.save();
      ctx.globalAlpha = 0.35;

      ctx.fillStyle = c.stableBg;
      const yTop = yScale.getPixelForValue(100);
      const yStableEnd = yScale.getPixelForValue(67);
      ctx.fillRect(chartArea.left, yTop, chartArea.right - chartArea.left, yStableEnd - yTop);

      ctx.fillStyle = c.watchBg;
      const yWatch = yScale.getPixelForValue(67);
      const yWatchEnd = yScale.getPixelForValue(34);
      ctx.fillRect(chartArea.left, yWatch, chartArea.right - chartArea.left, yWatchEnd - yWatch);

      ctx.fillStyle = c.riskBg;
      const yRisk = yScale.getPixelForValue(34);
      const yRiskEnd = yScale.getPixelForValue(0);
      ctx.fillRect(chartArea.left, yRisk, chartArea.right - chartArea.left, yRiskEnd - yRisk);

      ctx.restore();
    },
  };
}

function getChartValues(
  history: HistoryDay[],
  range: number,
  metric: string,
): { labels: string[]; values: number[]; label: string } {
  const data = history.slice(-range);
  const labels = data.map((d) =>
    d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  );
  let values: number[];
  let label: string;
  switch (metric) {
    case 'stress':
      values = data.map((d) => 100 - d.stress);
      label = 'Calm (inverse stress)';
      break;
    case 'sleep':
      values = data.map((d) => d.sleep);
      label = 'Sleep quality';
      break;
    case 'anxiety':
      values = data.map((d) => 100 - d.anxiety);
      label = 'Settled (inverse anxiety)';
      break;
    case 'support':
      values = data.map((d) => d.support);
      label = 'Support';
      break;
    case 'energy':
      values = data.map((d) => d.energy);
      label = 'Energy';
      break;
    default:
      values = data.map((d) => d.overall);
      label = 'Overall wellness';
  }
  return { labels, values, label };
}

interface Props {
  history: HistoryDay[];
  range: number;
  metric: string;
  heightClass?: string;
  maxTicksLimit?: number;
}

export function TrendChart({ history, range, metric, heightClass, maxTicksLimit }: Props) {
  const c = PALETTE;

  const zonesPlugin = useMemo(() => createZonesPlugin(c), [c]);

  const { labels, values, label } = useMemo(
    () => getChartValues(history, range, metric),
    [history, range, metric],
  );

  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label,
        data: values,
        borderColor: c.ink,
        backgroundColor: hexToRgba(c.sage, 0.10),
        borderWidth: 2.5,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: c.ink,
        pointBorderColor: c.paper,
        pointBorderWidth: 2,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: 'easeOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: c.ink,
        titleColor: c.paper,
        bodyColor: c.paper,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleFont: { family: 'Inter Tight, sans-serif', size: 12, weight: 'bold' },
        bodyFont: { family: 'Inter Tight, sans-serif', size: 13 },
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        border: { display: false },
        ticks: {
          color: c.inkMuted,
          font: { family: 'Inter Tight, sans-serif', size: 11 },
          stepSize: 25,
        },
        grid: { color: c.lineSoft },
      },
      x: {
        border: { display: false },
        ticks: {
          color: c.inkMuted,
          font: { family: 'Inter Tight, sans-serif', size: 11 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: maxTicksLimit ?? (range === 7 ? 7 : 8),
        },
        grid: { display: false },
      },
    },
  };

  const wrapClass = [styles.chartWrap, heightClass].filter(Boolean).join(' ');

  return (
    <div className={wrapClass}>
      <Line data={data} options={options} plugins={[zonesPlugin]} />
    </div>
  );
}
