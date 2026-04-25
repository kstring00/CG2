'use client';

import { useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import { Fraunces, Inter_Tight } from 'next/font/google';
import {
  LayoutDashboard,
  ClipboardCheck,
  Activity,
  Sparkles,
  Compass,
  AlertTriangle,
  LogIn,
  LogOut,
} from 'lucide-react';
import styles from './mental-health.module.css';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardTab } from './components/DashboardTab';
import { CheckInTab } from './components/CheckInTab';
import { TrendsTab } from './components/TrendsTab';
import { CalmingToolsTab } from './components/CalmingToolsTab';
import { TopicsTab } from './components/TopicsTab';
import { UrgentTab } from './components/UrgentTab';
import {
  type Inputs,
  type HistoryDay,
  DEFAULT_INPUTS,
  computeRiskScore,
  wellnessFromRisk,
  getDrivingFactors,
  buildExplain,
  seedHistory,
  anchorTodayInHistory,
} from './components/RiskEngine';
import { generateRecs, generateInsights, type RecAction } from './components/RecommendationsEngine';

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

type TabKey = 'dashboard' | 'checkin' | 'calming' | 'trends' | 'topics' | 'urgent';

interface AppState {
  userName: string;
  inputs: Inputs;
  history: HistoryDay[];
  range: number;
  metric: string;
  range2: number;
  metric2: string;
}

type Action =
  | { type: 'SET_INPUT'; key: keyof Inputs; value: number }
  | { type: 'SET_INPUTS'; inputs: Inputs }
  | { type: 'SET_RANGE'; range: number }
  | { type: 'SET_METRIC'; metric: string }
  | { type: 'SET_RANGE2'; range: number }
  | { type: 'SET_METRIC2'; metric: string }
  | { type: 'SET_USER_NAME'; name: string }
  | { type: 'SET_HISTORY'; history: HistoryDay[] };

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
    case 'SET_INPUTS':
      return {
        ...state,
        inputs: action.inputs,
        history: anchorTodayInHistory(state.history, action.inputs),
      };
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
    default:
      return state;
  }
}

// ─── Tabs ──────────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string; icon: React.ReactNode; urgent?: boolean }[] = [
  { key: 'dashboard', label: 'Today', icon: <LayoutDashboard size={14} /> },
  { key: 'checkin', label: 'Check-In', icon: <ClipboardCheck size={14} /> },
  { key: 'calming', label: 'Calming Tools', icon: <Sparkles size={14} /> },
  { key: 'trends', label: 'Trends', icon: <Activity size={14} /> },
  { key: 'topics', label: 'Topics', icon: <Compass size={14} /> },
  { key: 'urgent', label: 'Urgent Help', icon: <AlertTriangle size={14} />, urgent: true },
];

// ─── Local storage helpers ─────────────────────────────────────────────────

function lsGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* noop */ }
}
function lsRemove(key: string): void {
  try { localStorage.removeItem(key); } catch { /* noop */ }
}

// ─── Persistence keys ──────────────────────────────────────────────────────
const LS_ONBOARDED = 'cg-onboarded';
const LS_NAME = 'cg-name';
const LS_INPUTS = 'cg-inputs-v2';
const LS_HISTORY = 'cg-history-v2';
const LS_PROFILE = 'cg-profile-v1';
const LS_LAST_CHECKIN = 'cg-last-checkin';
const LS_STREAK = 'cg-streak';

// ─── Component ────────────────────────────────────────────────────────────

export default function MentalHealthCenter() {
  const [state, dispatch] = useReducer(reducer, {
    userName: '',
    inputs: DEFAULT_INPUTS,
    history: [],
    range: 7,
    metric: 'overall',
    range2: 30,
    metric2: 'overall',
  });

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [pendingTool, setPendingTool] = useState<string | null>(null);
  const [pendingTopic, setPendingTopic] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [ready, setReady] = useState(false);
  const [wasOnboarded, setWasOnboarded] = useState(false);
  const [profileSignedIn, setProfileSignedIn] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [streak, setStreak] = useState(0);

  function dispatchRecAction(action: RecAction) {
    if (action.kind === 'tab') {
      setActiveTab(action.tab);
      return;
    }
    if (action.kind === 'tool') {
      setPendingTool(action.tool);
      setActiveTab('calming');
      return;
    }
    if (action.kind === 'topic') {
      setPendingTopic(action.topic);
      setActiveTab('topics');
      return;
    }
    if (action.kind === 'href') {
      // External fallback — only used when a topic/tool isn't available inline
      window.location.href = action.href;
    }
  }

  // ─── Initialize from localStorage on mount ────────────────────────────
  useEffect(() => {
    const onboarded = lsGet(LS_ONBOARDED) === '1';
    const savedName = lsGet(LS_NAME) ?? '';
    const profile = lsGet(LS_PROFILE);

    setWasOnboarded(onboarded);
    setProfileSignedIn(profile === '1');
    if (!onboarded) setShowOnboarding(true);
    dispatch({ type: 'SET_USER_NAME', name: savedName });

    // Restore inputs if previously saved
    let inputs = DEFAULT_INPUTS;
    const rawInputs = lsGet(LS_INPUTS);
    if (rawInputs) {
      try {
        const parsed = JSON.parse(rawInputs) as Partial<Inputs>;
        inputs = { ...DEFAULT_INPUTS, ...parsed };
      } catch { /* ignore */ }
    }
    dispatch({ type: 'SET_INPUTS', inputs });

    // Restore history if previously saved (with date revival)
    let history: HistoryDay[] = [];
    const rawHistory = lsGet(LS_HISTORY);
    if (rawHistory) {
      try {
        const parsed = JSON.parse(rawHistory) as HistoryDay[];
        history = parsed.map((d) => ({ ...d, date: new Date(d.date) }));
        // Trim to last 30 days, append today if missing
        const today = new Date();
        const lastDate = history[history.length - 1]?.date;
        const sameDay = lastDate &&
          lastDate.getFullYear() === today.getFullYear() &&
          lastDate.getMonth() === today.getMonth() &&
          lastDate.getDate() === today.getDate();
        if (!sameDay) {
          history.push({
            date: today,
            overall: wellnessFromRisk(computeRiskScore(inputs)),
            stress: inputs.stress,
            anxiety: inputs.anxiety,
            sleep: inputs.sleep,
            support: inputs.support,
            energy: Math.round((inputs.bandwidth + inputs.hopefulness) / 2),
          });
          history = history.slice(-30);
        }
      } catch { /* ignore */ }
    }
    if (history.length === 0) {
      history = seedHistory();
    }
    dispatch({ type: 'SET_HISTORY', history: anchorTodayInHistory(history, inputs) });

    setStreak(parseInt(lsGet(LS_STREAK) ?? '0', 10) || 0);
    setReady(true);
  }, []);

  // ─── Auto-save inputs whenever they change (after ready) ──────────────
  useEffect(() => {
    if (!ready) return;
    lsSet(LS_INPUTS, JSON.stringify(state.inputs));
  }, [state.inputs, ready]);

  // ─── Auto-save history whenever it changes ────────────────────────────
  useEffect(() => {
    if (!ready || state.history.length === 0) return;
    lsSet(LS_HISTORY, JSON.stringify(state.history));
  }, [state.history, ready]);

  // Derived values — recomputed whenever inputs or history change
  const risk = useMemo(() => computeRiskScore(state.inputs), [state.inputs]);
  const wellness = useMemo(() => wellnessFromRisk(risk), [risk]);
  const drivers = useMemo(() => getDrivingFactors(state.inputs), [state.inputs]);
  const explainText = useMemo(() => buildExplain(risk, drivers), [risk, drivers]);
  const recs = useMemo(() => generateRecs(state.inputs, risk, drivers), [state.inputs, risk, drivers]);
  const insights = useMemo(() => generateInsights(state.history), [state.history]);

  const isReturning = ready && wasOnboarded;

  const handleInputChange = useCallback((key: keyof Inputs, value: number) => {
    dispatch({ type: 'SET_INPUT', key, value });
    setSavedFlash(true);
    window.clearTimeout((handleInputChange as unknown as { _t?: number })._t);
    (handleInputChange as unknown as { _t?: number })._t = window.setTimeout(
      () => setSavedFlash(false),
      900,
    );
  }, []);

  function handleOnboardingComplete(name: string, signIn: boolean) {
    dispatch({ type: 'SET_USER_NAME', name });
    lsSet(LS_ONBOARDED, '1');
    if (name) lsSet(LS_NAME, name);
    if (signIn) {
      lsSet(LS_PROFILE, '1');
      setProfileSignedIn(true);
    }
    setShowOnboarding(false);
  }

  function handleSignOut() {
    if (typeof window === 'undefined') return;
    const ok = window.confirm(
      'Sign out and clear your saved data on this device? Your check-ins and notes will be removed.',
    );
    if (!ok) return;
    [LS_ONBOARDED, LS_NAME, LS_INPUTS, LS_HISTORY, LS_PROFILE, LS_LAST_CHECKIN, LS_STREAK].forEach(lsRemove);
    window.location.reload();
  }

  function handleCheckinComplete() {
    // Streak: bump if last check-in wasn't today
    const today = new Date().toDateString();
    const last = lsGet(LS_LAST_CHECKIN);
    if (last !== today) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      lsSet(LS_STREAK, String(newStreak));
      lsSet(LS_LAST_CHECKIN, today);
    }
    setActiveTab('dashboard');
  }

  return (
    <div className={`${styles.root} ${fraunces.variable} ${interTight.variable}`}>
      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {/* Page header row */}
      <div className={styles.pageTop}>
        <span className={styles.pageTitle}>Mental Health Center</span>
        <div className={styles.pageTopActions}>
          {savedFlash && (
            <span className={styles.savedBadge} aria-live="polite">
              <span className={styles.savedDot} /> Saved
            </span>
          )}
          {profileSignedIn ? (
            <button
              className={styles.themeToggle}
              onClick={handleSignOut}
              title="Sign out and clear local data"
            >
              <LogOut size={13} />
              {state.userName ? `${state.userName} · sign out` : 'Sign out'}
            </button>
          ) : (
            <button
              className={styles.themeToggle}
              onClick={() => setShowOnboarding(true)}
            >
              <LogIn size={13} />
              Sign in to save
            </button>
          )}
        </div>
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
          streak={streak}
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
          onInputChange={handleInputChange}
          onRangeChange={(r) => dispatch({ type: 'SET_RANGE', range: r })}
          onMetricChange={(m) => dispatch({ type: 'SET_METRIC', metric: m })}
          onNavigate={(tab) => setActiveTab(tab as TabKey)}
          onRecAction={dispatchRecAction}
        />
      )}

      {ready && activeTab === 'checkin' && (
        <CheckInTab
          inputs={state.inputs}
          onInputChange={handleInputChange}
          onComplete={handleCheckinComplete}
        />
      )}

      {ready && activeTab === 'calming' && (
        <CalmingToolsTab
          userName={state.userName}
          initialTool={pendingTool}
          onToolConsumed={() => setPendingTool(null)}
        />
      )}

      {ready && activeTab === 'trends' && (
        <TrendsTab
          history={state.history}
          range={state.range2}
          metric={state.metric2}
          insights={insights}
          onRangeChange={(r) => dispatch({ type: 'SET_RANGE2', range: r })}
          onMetricChange={(m) => dispatch({ type: 'SET_METRIC2', metric: m })}
        />
      )}

      {ready && activeTab === 'topics' && (
        <TopicsTab
          onNavigate={(tab) => setActiveTab(tab as TabKey)}
          initialTopic={pendingTopic as never}
          onTopicConsumed={() => setPendingTopic(null)}
        />
      )}

      {ready && activeTab === 'urgent' && <UrgentTab />}
    </div>
  );
}
