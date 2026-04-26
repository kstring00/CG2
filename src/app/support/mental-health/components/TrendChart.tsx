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
  inkFaint: '#B8AE9F',
  lineSoft: '#EFE7D6',
  sage: '#6B8068',
  paper: '#FBF7EF',
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

function createGridlinesPlugin(c: typeof PALETTE): Plugin<'line'> {
  return {
    id: 'softGridlines',
    beforeDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) return;
      const yScale = scales['y'];
      if (!yScale) return;

      ctx.save();
      ctx.strokeStyle = c.lineSoft;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      [25, 50, 75].forEach((value) => {
        const y = yScale.getPixelForValue(value);
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y);
        ctx.lineTo(chartArea.right, y);
        ctx.stroke();
      });
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

  const gridlinesPlugin = useMemo(() => createGridlinesPlugin(c), [c]);

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
    layout: {
      // Breathing room around the plot — pushes axis labels away from card edges
      padding: { top: 14, right: 8, bottom: 12, left: 4 },
    },
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
          color: c.inkFaint,
          font: { family: 'Inter Tight, sans-serif', size: 10, weight: 400 },
          stepSize: 25,
          padding: 8,
        },
        // Native grid hidden — we draw cleaner dashed lines via the plugin
        grid: { display: false },
      },
      x: {
        border: { display: false },
        ticks: {
          color: c.inkFaint,
          font: { family: 'Inter Tight, sans-serif', size: 10, weight: 400 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: maxTicksLimit ?? (range === 7 ? 7 : 8),
          padding: 8,
        },
        grid: { display: false },
      },
    },
  };

  const wrapClass = [styles.chartWrap, heightClass].filter(Boolean).join(' ');

  return (
    <div className={wrapClass}>
      <Line data={data} options={options} plugins={[gridlinesPlugin]} />
    </div>
  );
}
