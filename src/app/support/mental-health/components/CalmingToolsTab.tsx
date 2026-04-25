'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Wind,
  Hand,
  PenLine,
  MessageCircle,
  Sparkles,
  Footprints,
  Check,
  Copy,
  RotateCcw,
  Play,
  Pause,
  ArrowLeft,
  Heart,
} from 'lucide-react';
import styles from '../mental-health.module.css';

// ─── Tool registry ────────────────────────────────────────────────────────

type ToolKey =
  | 'breath'
  | 'grounding'
  | 'journal'
  | 'ask'
  | 'body'
  | 'floor';

interface ToolMeta {
  key: ToolKey;
  title: string;
  blurb: string;
  duration: string;
  icon: React.ReactNode;
  accent: 'sage' | 'blue' | 'gold' | 'burgundy';
}

const TOOLS: ToolMeta[] = [
  {
    key: 'breath',
    title: 'Box breath reset',
    blurb: 'In 4, hold 4, out 4, hold 4. Drops your shoulders before the next hard moment.',
    duration: '2 min',
    icon: <Wind size={20} />,
    accent: 'sage',
  },
  {
    key: 'grounding',
    title: '5-4-3-2-1 grounding',
    blurb: 'When the day is louder than your thinking. Pulls you back into the room.',
    duration: '3 min',
    icon: <Hand size={20} />,
    accent: 'blue',
  },
  {
    key: 'journal',
    title: 'One-line journal',
    blurb: "A single sentence about today. We'll save the streak — not the words.",
    duration: '30 sec',
    icon: <PenLine size={20} />,
    accent: 'gold',
  },
  {
    key: 'ask',
    title: 'Ask-for-help texts',
    blurb: 'Pre-written messages for when reaching out feels like one more task.',
    duration: '1 min',
    icon: <MessageCircle size={20} />,
    accent: 'burgundy',
  },
  {
    key: 'body',
    title: 'Body scan',
    blurb: 'Crown to feet. Notice where the day is being held, then let it go.',
    duration: '4 min',
    icon: <Sparkles size={20} />,
    accent: 'sage',
  },
  {
    key: 'floor',
    title: "Today's floor",
    blurb: 'When bandwidth is gone, this is what counts as success. Everything else is bonus.',
    duration: '1 min',
    icon: <Footprints size={20} />,
    accent: 'gold',
  },
];

const ACCENT_CLASS: Record<ToolMeta['accent'], string> = {
  sage: styles.qaIcon,
  blue: `${styles.qaIcon} ${styles.qaIconBlue}`,
  gold: `${styles.qaIcon} ${styles.qaIconGold}`,
  burgundy: `${styles.qaIcon} ${styles.qaIconBurgundy}`,
};

interface Props {
  userName: string;
}

export function CalmingToolsTab({ userName }: Props) {
  const [active, setActive] = useState<ToolKey | null>(null);
  const [recents, setRecents] = useState<ToolKey[]>([]);

  function open(key: ToolKey) {
    setActive(key);
    setRecents((prev) => [key, ...prev.filter((r) => r !== key)].slice(0, 3));
  }

  if (active) {
    const meta = TOOLS.find((t) => t.key === active)!;
    return (
      <div>
        <button
          className={styles.toolBackBtn}
          onClick={() => setActive(null)}
        >
          <ArrowLeft size={14} /> All calming tools
        </button>
        <header className={styles.pageHeader}>
          <div className={styles.greeting}>
            <h1>{meta.title}</h1>
            <p>{meta.blurb}</p>
          </div>
        </header>
        <div className={styles.toolStage}>
          {active === 'breath' && <BreathTool />}
          {active === 'grounding' && <GroundingTool />}
          {active === 'journal' && <JournalTool userName={userName} />}
          {active === 'ask' && <AskForHelpTool />}
          {active === 'body' && <BodyScanTool />}
          {active === 'floor' && <FloorListTool />}
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className={styles.pageHeader}>
        <div className={styles.greeting}>
          <h1>Calming <em>tools</em></h1>
          <p>Two minutes or less. Pick one before the next hard moment — or just to feel a little more like yourself.</p>
        </div>
      </header>

      {recents.length > 0 && (
        <div className={styles.recentsRow}>
          <span className={styles.recentsLabel}>Recently used</span>
          {recents.map((k) => {
            const t = TOOLS.find((tt) => tt.key === k);
            if (!t) return null;
            return (
              <button key={k} className={styles.recentChip} onClick={() => open(k)}>
                {t.icon} {t.title}
              </button>
            );
          })}
        </div>
      )}

      <div className={styles.toolsGrid}>
        {TOOLS.map((t) => (
          <button
            key={t.key}
            className={styles.toolCard}
            onClick={() => open(t.key)}
          >
            <div className={ACCENT_CLASS[t.accent]}>{t.icon}</div>
            <div className={styles.toolCardTitle}>{t.title}</div>
            <p className={styles.toolCardBody}>{t.blurb}</p>
            <span className={styles.toolCardMeta}>{t.duration} · Tap to open</span>
          </button>
        ))}
      </div>

      <div className={styles.supportQuote}>
        <p className={styles.supportQuoteText}>
          &ldquo;You can&apos;t pour from an empty cup&rdquo; is true, but incomplete. You also don&apos;t have to be full
          to keep going. Sometimes the work is just refilling enough for the next hour.
        </p>
      </div>
    </div>
  );
}

/* ─── Tool: Box breathing ─────────────────────────────────────────────── */

type BreathPhase = 'idle' | 'in' | 'hold-in' | 'out' | 'hold-out' | 'done';

const PHASE_LABEL: Record<BreathPhase, string> = {
  idle: 'Ready when you are',
  'in': 'Breathe in',
  'hold-in': 'Hold',
  'out': 'Breathe out',
  'hold-out': 'Rest',
  done: 'You made it through',
};

function BreathTool() {
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [count, setCount] = useState(4);
  const [round, setRound] = useState(0);
  const TOTAL_ROUNDS = 4;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function tick(ph: BreathPhase, secsLeft: number, rnd: number) {
    setPhase(ph);
    setCount(secsLeft);
    if (secsLeft > 0) {
      timerRef.current = setTimeout(() => tick(ph, secsLeft - 1, rnd), 1000);
      return;
    }
    // advance phase
    const sequence: BreathPhase[] = ['in', 'hold-in', 'out', 'hold-out'];
    const idx = sequence.indexOf(ph);
    const nextIdx = idx + 1;
    if (nextIdx < sequence.length) {
      tick(sequence[nextIdx], 4, rnd);
    } else {
      const nextRound = rnd + 1;
      if (nextRound >= TOTAL_ROUNDS) {
        setPhase('done');
        setCount(0);
        setRound(0);
      } else {
        setRound(nextRound);
        tick('in', 4, nextRound);
      }
    }
  }

  function start() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRound(0);
    tick('in', 4, 0);
  }

  function stop() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('idle');
    setCount(4);
    setRound(0);
  }

  const isActive = phase !== 'idle' && phase !== 'done';
  const orbScale = phase === 'in' ? 1.15 : phase === 'hold-in' ? 1.15 : phase === 'out' ? 0.78 : phase === 'hold-out' ? 0.78 : 1;
  const orbDuration = phase === 'in' || phase === 'out' ? '4s' : '0.4s';

  return (
    <div className={styles.breathBox}>
      <div className={styles.breathOrbWrap}>
        <div
          className={styles.breathOrb}
          style={{
            transform: `scale(${orbScale})`,
            transition: `transform ${orbDuration} ease-in-out`,
          }}
        >
          <div className={styles.breathOrbInner}>
            {isActive ? (
              <>
                <div className={styles.breathCount}>{count}</div>
                <div className={styles.breathSub}>{PHASE_LABEL[phase]}</div>
              </>
            ) : phase === 'done' ? (
              <div className={styles.breathSub}>Well done.</div>
            ) : (
              <div className={styles.breathSub}>Ready when you are</div>
            )}
          </div>
        </div>
      </div>

      {(isActive || phase === 'done') && (
        <div className={styles.breathDots}>
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <span
              key={i}
              className={`${styles.breathDot} ${i < round || phase === 'done' ? styles.breathDotDone : ''} ${i === round && isActive ? styles.breathDotActive : ''}`}
            />
          ))}
        </div>
      )}

      <div className={styles.toolControls}>
        {!isActive ? (
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={start}>
            <Play size={14} /> {phase === 'done' ? 'Go again' : 'Start'}
          </button>
        ) : (
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={stop}>
            <Pause size={14} /> Stop
          </button>
        )}
      </div>
      <p className={styles.toolHint}>Box breathing · 4 rounds · ~1 min total</p>
    </div>
  );
}

/* ─── Tool: 5-4-3-2-1 grounding ───────────────────────────────────────── */

const GROUNDING_STEPS = [
  { sense: 'See', count: 5, prompt: 'Name 5 things you can see right now.' },
  { sense: 'Feel', count: 4, prompt: 'Name 4 things you can physically feel — feet on the floor, your clothes, the air on your skin.' },
  { sense: 'Hear', count: 3, prompt: 'Name 3 things you can hear.' },
  { sense: 'Smell', count: 2, prompt: 'Name 2 things you can smell.' },
  { sense: 'Taste', count: 1, prompt: 'Name 1 thing you can taste.' },
];

function GroundingTool() {
  const [step, setStep] = useState(0);
  const [items, setItems] = useState<string[][]>(() => GROUNDING_STEPS.map((s) => Array(s.count).fill('')));
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className={styles.toolDoneBox}>
        <Sparkles className={styles.toolDoneIcon} />
        <p className={styles.toolDoneTitle}>You&apos;re back in the room.</p>
        <p className={styles.toolDoneBody}>
          Grounding works because it gives the part of your brain that spirals something specific to do.
          You can come back to this anytime.
        </p>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => {
            setStep(0);
            setItems(GROUNDING_STEPS.map((s) => Array(s.count).fill('')));
            setDone(false);
          }}
        >
          <RotateCcw size={14} /> Run it again
        </button>
      </div>
    );
  }

  const cur = GROUNDING_STEPS[step];
  const canAdvance = items[step].some((v) => v.trim().length > 0);

  function next() {
    if (step + 1 >= GROUNDING_STEPS.length) setDone(true);
    else setStep(step + 1);
  }

  function update(i: number, v: string) {
    setItems((prev) => prev.map((row, idx) => (idx === step ? row.map((val, j) => (j === i ? v : val)) : row)));
  }

  return (
    <div className={styles.groundingBox}>
      <div className={styles.groundingNumber}>{cur.count}</div>
      <div className={styles.groundingSense}>{cur.sense}</div>
      <p className={styles.groundingPrompt}>{cur.prompt}</p>
      <div className={styles.groundingInputs}>
        {items[step].map((v, i) => (
          <input
            key={i}
            value={v}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`${i + 1}`}
            className={styles.groundingInput}
          />
        ))}
      </div>
      <div className={styles.groundingProgress}>
        {GROUNDING_STEPS.map((_, i) => (
          <span key={i} className={`${styles.groundingDot} ${i <= step ? styles.groundingDotDone : ''}`} />
        ))}
      </div>
      <div className={styles.toolControls}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={next}
          disabled={!canAdvance}
        >
          {step + 1 === GROUNDING_STEPS.length ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

/* ─── Tool: One-line journal ──────────────────────────────────────────── */

const PROMPTS = [
  'What was harder than it should have been today?',
  'One small thing that worked, even a little?',
  'Where in your body is today sitting?',
  'What did you not get credit for today?',
  'What would you say to a friend going through your day?',
];

interface JournalEntry { date: string; text: string; promptIdx: number; }

function JournalTool({ userName }: { userName: string }) {
  const [text, setText] = useState('');
  const [promptIdx, setPromptIdx] = useState(0);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cg-journal');
      if (raw) setEntries(JSON.parse(raw));
    } catch { /* ignore */ }
    setPromptIdx(Math.floor(Math.random() * PROMPTS.length));
  }, []);

  function save() {
    if (!text.trim()) return;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    const next = [{ date: today, text: text.trim(), promptIdx }, ...entries].slice(0, 30);
    setEntries(next);
    try { localStorage.setItem('cg-journal', JSON.stringify(next)); } catch { /* ignore */ }
    setSaved(true);
    setText('');
    setTimeout(() => setSaved(false), 1800);
  }

  function shuffle() {
    setPromptIdx((i) => (i + 1) % PROMPTS.length);
  }

  return (
    <div className={styles.journalBox}>
      <div className={styles.journalCard}>
        <div className={styles.journalPromptRow}>
          <span className={styles.journalPromptLabel}>Today&apos;s prompt</span>
          <button className={styles.journalShuffle} onClick={shuffle}>
            <RotateCcw size={12} /> Try another
          </button>
        </div>
        <p className={styles.journalPrompt}>&ldquo;{PROMPTS[promptIdx]}&rdquo;</p>
        <textarea
          className={styles.journalTextarea}
          value={text}
          placeholder={userName ? `One line, ${userName}…` : 'One line…'}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
        <div className={styles.journalFooter}>
          <span className={styles.toolHint}>{entries.length} saved on this device · only you can see them</span>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={save}
            disabled={!text.trim()}
          >
            {saved ? <><Check size={14} /> Saved</> : 'Save line'}
          </button>
        </div>
      </div>

      {entries.length > 0 && (
        <div className={styles.journalHistory}>
          <h3 className={styles.journalHistoryTitle}>Past lines</h3>
          <ul className={styles.journalList}>
            {entries.slice(0, 5).map((e, i) => (
              <li key={i} className={styles.journalItem}>
                <span className={styles.journalDate}>{e.date}</span>
                <span className={styles.journalText}>&ldquo;{e.text}&rdquo;</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Tool: Ask-for-help templates ────────────────────────────────────── */

const TEMPLATES = [
  { tone: 'Low-ask', message: "I'm having a hard day. Not asking you to fix anything — just needed to tell someone." },
  { tone: 'Practical', message: "Rough one over here. Can you call me on the drive home, even for 5 minutes?" },
  { tone: 'Need company', message: "I could really use some company tonight. Even just sitting together would help." },
  { tone: 'Need a break', message: "I'm at the edge of what I can handle. Any chance you could take over for an hour?" },
  { tone: 'Asking for space', message: "I don't need you to do anything. I just need 30 quiet minutes. Can you hold things down?" },
  { tone: 'Just heard', message: "Harder than expected today. Just needed someone to know." },
];

function AskForHelpTool() {
  const [copied, setCopied] = useState<number | null>(null);

  function copy(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 1800);
    });
  }

  return (
    <div className={styles.askGrid}>
      {TEMPLATES.map((t, i) => (
        <div key={i} className={styles.askCard}>
          <span className={styles.askTone}>{t.tone}</span>
          <p className={styles.askMessage}>&ldquo;{t.message}&rdquo;</p>
          <button
            className={`${styles.askCopyBtn} ${copied === i ? styles.askCopyBtnDone : ''}`}
            onClick={() => copy(t.message, i)}
          >
            {copied === i ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy message</>}
          </button>
        </div>
      ))}
      <p className={styles.toolHint} style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: 8 }}>
        You don&apos;t need to explain everything. One line is enough.
      </p>
    </div>
  );
}

/* ─── Tool: Body scan ─────────────────────────────────────────────────── */

const BODY_STEPS = [
  { area: 'Crown of your head',  cue: 'Notice it. Is there tension there? You don\'t have to fix it — just notice, and let go.' },
  { area: 'Forehead and eyes',   cue: 'Relax your brow. Soften around your eyes. Let the muscles go slack.' },
  { area: 'Jaw and throat',      cue: 'This is where most of the day gets held. Let your teeth part slightly.' },
  { area: 'Shoulders',           cue: 'Let them fall. Not where you think they are — where they actually land when you stop holding them up.' },
  { area: 'Chest',               cue: 'Take one slow breath here. In through your nose. Feel your chest expand.' },
  { area: 'Belly',               cue: 'Let it soften. You don\'t have to hold anything in right now.' },
  { area: 'Hips and lower back', cue: 'Feel the weight of your body where it meets the surface below you. Let it be held.' },
  { area: 'Legs',                cue: 'Thighs, knees, calves. Any tension — just notice. Breathe into it.' },
  { area: 'Feet',                cue: 'All the way to your toes. You made it to the bottom. You\'re still here.' },
];

function BodyScanTool() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const STEP_SECONDS = 18;
  const [secsLeft, setSecsLeft] = useState(STEP_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  useEffect(() => {
    if (!running) return;
    setSecsLeft(STEP_SECONDS);
    timerRef.current = setInterval(() => {
      setSecsLeft((s) => {
        if (s <= 1) {
          // advance step
          if (step + 1 >= BODY_STEPS.length) {
            if (timerRef.current) clearInterval(timerRef.current);
            setRunning(false);
            setDone(true);
            return 0;
          }
          setStep((st) => st + 1);
          return STEP_SECONDS;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, step]);

  if (done) {
    return (
      <div className={styles.toolDoneBox}>
        <Heart className={styles.toolDoneIcon} />
        <p className={styles.toolDoneTitle}>You stayed with it.</p>
        <p className={styles.toolDoneBody}>
          Whatever tension is left, you noticed it. That&apos;s the practice — not the release, but the noticing.
        </p>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => { setStep(0); setRunning(false); setDone(false); }}
        >
          <RotateCcw size={14} /> Run it again
        </button>
      </div>
    );
  }

  const cur = BODY_STEPS[step];
  const progress = ((step + (running ? (STEP_SECONDS - secsLeft) / STEP_SECONDS : 0)) / BODY_STEPS.length) * 100;

  return (
    <div className={styles.bodyScanBox}>
      <div className={styles.bodyScanProgress}>
        <div className={styles.bodyScanFill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.bodyScanArea}>{cur.area}</div>
      <p className={styles.bodyScanCue}>{cur.cue}</p>
      <div className={styles.bodyScanMeta}>
        Step {step + 1} of {BODY_STEPS.length} · {running ? `${secsLeft}s` : 'Paused'}
      </div>
      <div className={styles.toolControls}>
        {!running ? (
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setRunning(true)}>
            <Play size={14} /> {step === 0 ? 'Start scan' : 'Resume'}
          </button>
        ) : (
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setRunning(false)}>
            <Pause size={14} /> Pause
          </button>
        )}
        <button
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={() => {
            if (step + 1 >= BODY_STEPS.length) {
              setDone(true);
              setRunning(false);
            } else {
              setStep((s) => s + 1);
              setSecsLeft(STEP_SECONDS);
            }
          }}
        >
          Skip ahead →
        </button>
      </div>
    </div>
  );
}

/* ─── Tool: Floor list ────────────────────────────────────────────────── */

const FLOOR_ITEMS = [
  { label: 'Kid fed', sub: 'Something eaten. It doesn\'t have to be a meal.' },
  { label: 'Kid safe', sub: 'They\'re okay. You\'re watching. That\'s the job.' },
  { label: 'You breathing', sub: 'Literally. In. Out. You\'re still here.' },
];

function FloorListTool() {
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const all = checked.every(Boolean);

  function toggle(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className={styles.floorBox}>
      {FLOOR_ITEMS.map((item, i) => (
        <button
          key={i}
          className={`${styles.floorItem} ${checked[i] ? styles.floorItemDone : ''}`}
          onClick={() => toggle(i)}
        >
          <span className={`${styles.floorCheck} ${checked[i] ? styles.floorCheckDone : ''}`}>
            {checked[i] && <Check size={12} />}
          </span>
          <span>
            <span className={styles.floorLabel}>{item.label}</span>
            <span className={styles.floorSub}>{item.sub}</span>
          </span>
        </button>
      ))}
      {all && (
        <div className={styles.floorDone}>
          <Sparkles size={16} />
          <span>That&apos;s the floor. Everything else today is bonus. Be proud.</span>
        </div>
      )}
    </div>
  );
}
