export interface Inputs {
  stress: number;
  anxiety: number;
  sleep: number;
  bandwidth: number;
  support: number;
  overwhelm: number;
  isolation: number;
  hopefulness: number;
}

export interface HistoryDay {
  date: Date;
  overall: number;
  stress: number;
  anxiety: number;
  sleep: number;
  support: number;
  energy: number;
}

export interface Driver {
  key: keyof Inputs;
  label: string;
  value: number;
  adverse: boolean;
  weight: number;
  impact: number;
}

export interface RiskStateResult {
  key: 'stable' | 'watch' | 'risk';
  label: string;
  cls: string;
}

export const SLIDER_DEFS: {
  key: keyof Inputs;
  label: string;
  adverse: boolean;
  lowDesc: string;
  highDesc: string;
}[] = [
  { key: 'stress', label: 'Stress', adverse: true, lowDesc: 'Quiet inside', highDesc: 'Running hot' },
  { key: 'anxiety', label: 'Anxiety', adverse: true, lowDesc: 'Settled', highDesc: 'On edge' },
  { key: 'sleep', label: 'Sleep quality', adverse: false, lowDesc: 'Restless', highDesc: 'Restored' },
  { key: 'bandwidth', label: 'Emotional bandwidth', adverse: false, lowDesc: 'Empty', highDesc: 'Full' },
  { key: 'support', label: 'Support level', adverse: false, lowDesc: 'Alone in it', highDesc: 'Held' },
  { key: 'overwhelm', label: 'Overwhelm', adverse: true, lowDesc: 'Manageable', highDesc: 'Drowning' },
  { key: 'isolation', label: 'Isolation', adverse: true, lowDesc: 'Connected', highDesc: 'Cut off' },
  { key: 'hopefulness', label: 'Hopefulness', adverse: false, lowDesc: 'Fading', highDesc: 'Lit up' },
];

export const DEFAULT_INPUTS: Inputs = {
  stress: 65,
  anxiety: 55,
  sleep: 40,
  bandwidth: 45,
  support: 50,
  overwhelm: 60,
  isolation: 50,
  hopefulness: 55,
};

// Returns 0-100 risk score (higher = worse wellbeing)
export function computeRiskScore(inputs: Inputs): number {
  const weights = {
    stress: 0.18,
    anxiety: 0.16,
    overwhelm: 0.13,
    isolation: 0.10,
    sleep: 0.16,
    bandwidth: 0.09,
    support: 0.10,
    hopefulness: 0.08,
  };

  let risk = 0;
  risk += inputs.stress * weights.stress;
  risk += inputs.anxiety * weights.anxiety;
  risk += inputs.overwhelm * weights.overwhelm;
  risk += inputs.isolation * weights.isolation;
  risk += (100 - inputs.sleep) * weights.sleep;
  risk += (100 - inputs.bandwidth) * weights.bandwidth;
  risk += (100 - inputs.support) * weights.support;
  risk += (100 - inputs.hopefulness) * weights.hopefulness;

  return Math.max(0, Math.min(100, Math.round(risk)));
}

export function wellnessFromRisk(risk: number): number {
  return 100 - risk;
}

export function riskState(score: number): RiskStateResult {
  if (score <= 33) return { key: 'stable', label: 'Stable', cls: 'stable' };
  if (score <= 66) return { key: 'watch', label: 'Watch zone', cls: 'watch' };
  return { key: 'risk', label: 'At-risk zone', cls: 'risk' };
}

export function getDrivingFactors(inputs: Inputs): Driver[] {
  const factors: Driver[] = [
    { key: 'stress', label: 'Stress', value: inputs.stress, adverse: true, weight: 0.18, impact: 0 },
    { key: 'anxiety', label: 'Anxiety', value: inputs.anxiety, adverse: true, weight: 0.16, impact: 0 },
    { key: 'sleep', label: 'Sleep', value: inputs.sleep, adverse: false, weight: 0.16, impact: 0 },
    { key: 'overwhelm', label: 'Overwhelm', value: inputs.overwhelm, adverse: true, weight: 0.13, impact: 0 },
    { key: 'support', label: 'Support', value: inputs.support, adverse: false, weight: 0.10, impact: 0 },
    { key: 'isolation', label: 'Isolation', value: inputs.isolation, adverse: true, weight: 0.10, impact: 0 },
    { key: 'bandwidth', label: 'Bandwidth', value: inputs.bandwidth, adverse: false, weight: 0.09, impact: 0 },
    { key: 'hopefulness', label: 'Hope', value: inputs.hopefulness, adverse: false, weight: 0.08, impact: 0 },
  ];

  for (const f of factors) {
    const deviation = f.adverse ? f.value - 50 : 50 - f.value;
    f.impact = deviation * f.weight;
  }

  factors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  return factors.slice(0, 3);
}

export function buildExplain(risk: number, drivers: Driver[]): string {
  const top = drivers[0];
  const second = drivers[1];

  const phrases: Record<string, string> = {
    stress_up: 'stress is sitting high',
    anxiety_up: 'anxiety has been climbing',
    overwhelm_up: 'the overwhelm is heavier than usual',
    isolation_up: "you're carrying a lot of this alone",
    sleep_down: 'sleep has been thin',
    bandwidth_down: 'your bandwidth is running low',
    support_down: 'support has thinned out',
    hopefulness_down: 'hope is taking a hit',
    stress_down: 'stress is calmer today',
    anxiety_down: 'anxiety has settled',
    overwhelm_down: 'the overwhelm has eased',
    isolation_down: "you're feeling more connected",
    sleep_up: 'sleep has been steadier',
    bandwidth_up: 'your bandwidth is back',
    support_up: "you're more supported today",
    hopefulness_up: 'hope is showing up',
  };

  function phrase(d: Driver): string {
    const dir = d.impact > 0 ? '_up' : '_down';
    return phrases[d.key + dir] ?? '';
  }

  const p1 = phrase(top);
  const p2 = phrase(second);

  if (risk <= 33) {
    if (top.impact < 0) {
      return `Today's a steadier one — ${p1}, and ${p2}. Notice what's working and protect it.`;
    }
    return `You're in a stable place overall. ${p1 ? p1.charAt(0).toUpperCase() + p1.slice(1) : 'Things feel okay'}, but it's still worth a small reset today.`;
  }
  if (risk <= 66) {
    if (top.impact > 0) {
      return `You're in the Watch zone — ${p1}, and ${p2}. You're holding it together, but the engine is running hot.`;
    }
    return `You're in the Watch zone, but the trend is gentler today. ${p1 ? p1.charAt(0).toUpperCase() + p1.slice(1) : 'Things are improving'} — keep the small wins.`;
  }
  return `Today's heavy. ${p1 ? p1.charAt(0).toUpperCase() + p1.slice(1) : 'Things feel hard'}, and ${p2}. The next step doesn't need to be big — just one thing that lowers the load.`;
}

export function seedHistory(): HistoryDay[] {
  const today = new Date();
  const data: HistoryDay[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const t = (29 - i) / 29;

    const base = 55 + Math.sin(t * Math.PI * 1.6) * 10 - Math.cos(t * Math.PI * 2.3) * 6;
    const noise = (Math.random() - 0.5) * 8;
    const overall = Math.max(15, Math.min(92, Math.round(base + noise)));

    const stress = Math.max(5, Math.min(95, 100 - overall + (Math.random() - 0.5) * 12));
    const anxiety = Math.max(5, Math.min(95, 100 - overall - 5 + (Math.random() - 0.5) * 14));
    const sleep = Math.max(10, Math.min(95, overall - 8 + (Math.random() - 0.5) * 14));
    const support = Math.max(10, Math.min(95, overall + 5 + (Math.random() - 0.5) * 16));
    const energy = Math.max(10, Math.min(95, overall - 4 + (Math.random() - 0.5) * 12));

    data.push({
      date: d,
      overall,
      stress: Math.round(stress),
      anxiety: Math.round(anxiety),
      sleep: Math.round(sleep),
      support: Math.round(support),
      energy: Math.round(energy),
    });
  }
  return data;
}

export function anchorTodayInHistory(history: HistoryDay[], inputs: Inputs): HistoryDay[] {
  if (history.length === 0) return history;
  const risk = computeRiskScore(inputs);
  const wellness = wellnessFromRisk(risk);
  const updated = [...history];
  const last = { ...updated[updated.length - 1] };
  last.overall = wellness;
  last.stress = inputs.stress;
  last.sleep = inputs.sleep;
  last.anxiety = inputs.anxiety;
  last.support = inputs.support;
  last.energy = Math.round((inputs.bandwidth + inputs.hopefulness) / 2);
  updated[updated.length - 1] = last;
  return updated;
}
