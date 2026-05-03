'use client';

import { useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import { Fraunces, Inter_Tight } from 'next/font/google';
import {
  LayoutDashboard,
  Activity,
  Sparkles,
  LogIn,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import styles from './mental-health.module.css';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardTab } from './components/DashboardTab';
import { TrendsTab } from './components/TrendsTab';
import { CalmingToolsTab } from './components/CalmingToolsTab';
import { TopicsTab } from './components/TopicsTab';
import { UrgentTab } from './components/UrgentTab';
import PathfinderCard from '@/components/PathfinderCard';

/** Pathfinder strip rendered inside the Support tab. */
function SupportPathfinderBlock() {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-500, #6e727a)', marginBottom: 8 }}>
        your pathfinder
      </p>
      <PathfinderCard showSendAction />
    </div>
  );
}
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

type TabKey = 'dashboard' | 'trends' | 'support';

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
  { key: 'trends', label: 'Patterns', icon: <Activity size={14} /> },
  { key: 'support', label: 'Support', icon: <Sparkles size={14} /> },
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
  const [freshStart, setFreshStart] = useState(false);

  function dispatchRecAction(action: RecAction) {
    if (action.kind === 'tab') {
      // Old tab keys collapse into the new 3-tab structure (Today / Patterns / Support).
      const tab = action.tab;
      if (tab === 'dashboard' || tab === 'checkin') setActiveTab('dashboard');
      else if (tab === 'trends') setActiveTab('trends');
      else setActiveTab('support'); // calming, topics, urgent → Support
      return;
    }
    if (action.kind === 'tool') {
      setPendingTool(action.tool);
      setActiveTab('support');
      return;
    }
    if (action.kind === 'topic') {
      setPendingTopic(action.topic);
      setActiveTab('support');
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

      {/* Back to Parent Support — keeps the dashboard from feeling orphaned. */}
      <div style={{ padding: '8px 12px 0' }}>
        <Link
          href="/support/caregiver"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--ink-600, #5a5d64)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={13} aria-hidden /> back to parent support
        </Link>
      </div>

      {/* Page header row */}
      <div className={styles.pageTop}>
        <span className={styles.pageTitle}>Support for Parents</span>
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

      {/* Demo banner — only shows for parents who haven't signed in (i.e. no real data). */}
      {!profileSignedIn && (
        <div
          style={{
            margin: '8px 12px 0',
            padding: '12px 16px',
            borderRadius: 14,
            background: 'rgba(255,247,232,0.85)',
            border: '1px solid rgba(180, 130, 30, 0.18)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: '#7a4f00' }}>
              demo view.
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#7a4f00', lineHeight: 1.4 }}>
              this is example data showing how the dashboard reflects a parent&rsquo;s check-ins over time. once you start checking in, you&rsquo;ll see your own patterns here.
            </p>
          </div>
          <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setFreshStart(false)}
              aria-pressed={!freshStart}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 600,
                border: '1px solid #d8b46e',
                background: !freshStart ? '#7a4f00' : 'white',
                color: !freshStart ? 'white' : '#7a4f00',
                cursor: 'pointer',
              }}
            >
              view example data
            </button>
            <button
              type="button"
              onClick={() => setFreshStart(true)}
              aria-pressed={freshStart}
              style={{
                padding: '6px 12px',
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 600,
                border: '1px solid #d8b46e',
                background: freshStart ? '#7a4f00' : 'white',
                color: freshStart ? 'white' : '#7a4f00',
                cursor: 'pointer',
              }}
            >
              start fresh
            </button>
          </div>
        </div>
      )}

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
          freshStart={freshStart && !profileSignedIn}
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

      {/* Support tab — folds Urgent help, Pathfinder, and Calming tools into one
          place. The persistent crisis strip at the top of every page handles the
          highest-urgency surface, so the in-tab content can be calm. */}
      {ready && activeTab === 'support' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <UrgentTab />
          <SupportPathfinderBlock />
          <CalmingToolsTab
            userName={state.userName}
            initialTool={pendingTool}
            onToolConsumed={() => setPendingTool(null)}
          />
          <TopicsTab
            onNavigate={(tab) => {
              if (tab === 'dashboard' || tab === 'checkin') setActiveTab('dashboard');
              else if (tab === 'trends') setActiveTab('trends');
              else setActiveTab('support');
            }}
            initialTopic={pendingTopic as never}
            onTopicConsumed={() => setPendingTopic(null)}
          />
        </div>
      )}
    </div>
  );
}
