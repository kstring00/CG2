'use client';

import { useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import { Fraunces, Inter_Tight } from 'next/font/google';
import {
  LayoutDashboard,
  ClipboardCheck,
  Activity,
  Lightbulb,
  Heart,
  AlertTriangle,
  Sun,
  Moon,
} from 'lucide-react';
import styles from './mental-health.module.css';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardTab } from './components/DashboardTab';
import { CheckInTab } from './components/CheckInTab';
import { TrendsTab } from './components/TrendsTab';
import { RecommendationsTab } from './components/RecommendationsTab';
import { SupportTab } from './components/SupportTab';
import { UrgentTab } from './components/UrgentTab';
import {
  type Inputs,
  type HistoryDay,
  DEFAULT_INPUTS,
  computeRiskScore,
  wellnessFromRisk,
  riskState,
  getDrivingFactors,
  buildExplain,
  seedHistory,
  anchorTodayInHistory,
} from './components/RiskEngine';
import { generateRecs, generateInsights } from './components/RecommendationsEngine';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

// ─── State + Reducer ───────────────────────────────────────────────────────

type TabKey = 'dashboard' | 'checkin' | 'trends' | 'recs' | 'support' | 'urgent';

interface AppState {
  userName: string;
  inputs: Inputs;
  history: HistoryDay[];
  range: number;
  metric: string;
  range2: number;
  metric2: string;
  darkMode: boolean;
}

type Action =
  | { type: 'SET_INPUT'; key: keyof Inputs; value: number }
  | { type: 'SET_RANGE'; range: number }
  | { type: 'SET_METRIC'; metric: string }
  | { type: 'SET_RANGE2'; range: number }
  | { type: 'SET_METRIC2'; metric: string }
  | { type: 'SET_USER_NAME'; name: string }
  | { type: 'SET_HISTORY'; history: HistoryDay[] }
  | { type: 'TOGGLE_DARK_MODE' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_INPUT': {
      const inputs = { ...state.inputs, [action.key]: action.value };
      return {
        ...state,
        inputs,
        history: anchorTodayInHistory(state.history, inputs),
      };
    }
    case 'SET_RANGE':
      return { ...state, range: action.range };
    case 'SET_METRIC':
      return { ...state, metric: action.metric };
    case 'SET_RANGE2':
      return { ...state, range2: action.range };
    case 'SET_METRIC2':
      return { ...state, metric2: action.metric };
    case 'SET_USER_NAME':
      return { ...state, userName: action.name };
    case 'SET_HISTORY':
      return { ...state, history: action.history };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

// ─── Tabs ──────────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string; icon: React.ReactNode; urgent?: boolean }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
  { key: 'checkin', label: 'Daily Check-In', icon: <ClipboardCheck size={14} /> },
  { key: 'trends', label: 'My Trends', icon: <Activity size={14} /> },
  { key: 'recs', label: 'Recommendations', icon: <Lightbulb size={14} /> },
  { key: 'support', label: 'Support for Me', icon: <Heart size={14} /> },
  { key: 'urgent', label: 'Urgent Help', icon: <AlertTriangle size={14} />, urgent: true },
];

// ─── Local storage helpers ─────────────────────────────────────────────────

function lsGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* noop */ }
}

// ─── Component ────────────────────────────────────────────────────────────

export default function MentalHealthCommandCenter() {
  const [state, dispatch] = useReducer(reducer, {
    userName: 'friend',
    inputs: DEFAULT_INPUTS,
    history: [],
    range: 7,
    metric: 'overall',
    range2: 30,
    metric2: 'overall',
    darkMode: false,
  });

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [ready, setReady] = useState(false);
  // true only if cg-onboarded was already '1' at page load — not set during this session
  const [wasOnboarded, setWasOnboarded] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const onboarded = lsGet('cg-onboarded') === '1';
    const savedName = lsGet('cg-name') ?? '';
    const savedTheme = lsGet('cg-theme') ?? 'light';

    setWasOnboarded(onboarded);
    if (!onboarded) setShowOnboarding(true);
    dispatch({ type: 'SET_USER_NAME', name: savedName });
    if (savedTheme === 'dark') dispatch({ type: 'TOGGLE_DARK_MODE' });

    const h = seedHistory();
    dispatch({ type: 'SET_HISTORY', history: anchorTodayInHistory(h, DEFAULT_INPUTS) });
    setReady(true);
  }, []);

  // Persist dark mode preference
  useEffect(() => {
    if (!ready) return;
    lsSet('cg-theme', state.darkMode ? 'dark' : 'light');
  }, [state.darkMode, ready]);

  // Derived values — recomputed whenever inputs or history change
  const risk = useMemo(() => computeRiskScore(state.inputs), [state.inputs]);
  const wellness = useMemo(() => wellnessFromRisk(risk), [risk]);
  const rs = useMemo(() => riskState(risk), [risk]);
  const drivers = useMemo(() => getDrivingFactors(state.inputs), [state.inputs]);
  const explainText = useMemo(() => buildExplain(risk, drivers), [risk, drivers]);
  const recs = useMemo(() => generateRecs(state.inputs, risk, drivers), [state.inputs, risk, drivers]);
  const insights = useMemo(() => generateInsights(state.history), [state.history]);

  // "back" only on a return session — not during the visit they first onboarded
  const isReturning = ready && wasOnboarded;

  const handleInputChange = useCallback((key: keyof Inputs, value: number) => {
    dispatch({ type: 'SET_INPUT', key, value });
  }, []);

  function handleOnboardingComplete(name: string) {
    dispatch({ type: 'SET_USER_NAME', name });
    lsSet('cg-onboarded', '1');
    lsSet('cg-name', name);
    setShowOnboarding(false);
  }

  function handleCheckinComplete() {
    setActiveTab('dashboard');
  }

  return (
    <div
      className={`${styles.root} ${fraunces.variable} ${interTight.variable}`}
      data-theme={state.darkMode ? 'dark' : undefined}
    >
      {/* Onboarding modal */}
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {/* Page header row */}
      <div className={styles.pageTop}>
        <span className={styles.pageTitle}>Mental Health Command Center</span>
        <button
          className={styles.themeToggle}
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          aria-label="Toggle dark mode"
        >
          {state.darkMode ? <Sun size={14} /> : <Moon size={14} />}
          {state.darkMode ? 'Light mode' : 'Dark mode'}
        </button>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar} role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const cls = [
            styles.tabBtn,
            tab.urgent ? styles.tabBtnUrgent : '',
            isActive
              ? tab.urgent ? styles.tabBtnUrgentActive : styles.tabBtnActive
              : '',
          ].filter(Boolean).join(' ');
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              className={cls}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content — gated on ready so localStorage is checked before any tab renders */}
      {!ready && <div className={styles.loadingState}>Loading…</div>}

      {ready && activeTab === 'dashboard' && (
        <DashboardTab
          userName={state.userName}
          isReturning={isReturning}
          inputs={state.inputs}
          history={state.history}
          risk={risk}
          wellness={wellness}
          drivers={drivers}
          explainText={explainText}
          recs={recs}
          insights={insights}
          range={state.range}
          metric={state.metric}
          darkMode={state.darkMode}
          onInputChange={handleInputChange}
          onRangeChange={(r) => dispatch({ type: 'SET_RANGE', range: r })}
          onMetricChange={(m) => dispatch({ type: 'SET_METRIC', metric: m })}
          onNavigate={(tab) => setActiveTab(tab as TabKey)}
        />
      )}

      {ready && activeTab === 'checkin' && (
        <CheckInTab
          inputs={state.inputs}
          onInputChange={handleInputChange}
          onComplete={handleCheckinComplete}
        />
      )}

      {ready && activeTab === 'trends' && (
        <TrendsTab
          history={state.history}
          range={state.range2}
          metric={state.metric2}
          insights={insights}
          darkMode={state.darkMode}
          onRangeChange={(r) => dispatch({ type: 'SET_RANGE2', range: r })}
          onMetricChange={(m) => dispatch({ type: 'SET_METRIC2', metric: m })}
        />
      )}

      {ready && activeTab === 'recs' && <RecommendationsTab recs={recs} />}

      {ready && activeTab === 'support' && <SupportTab />}

      {ready && activeTab === 'urgent' && <UrgentTab />}
    </div>
  );
}
