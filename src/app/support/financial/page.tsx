import type { Metadata } from 'next';
import { Fraunces, Inter_Tight } from 'next/font/google';
import {
  Shield,
  HeartPulse,
  PiggyBank,
  HandCoins,
  Receipt,
  Compass,
  ScrollText,
  Phone,
} from 'lucide-react';
import styles from './financial.module.css';

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

export const metadata: Metadata = {
  title: 'Financial pressure is mental health · Common Ground',
  description:
    'A working guide to therapy coverage, Medicaid waivers, ABLE accounts, respite funding, tax breaks, and adulthood planning for autism families.',
};

interface SectionMeta {
  num: string;
  id: string;
  title: React.ReactNode;
  short: string;
  icon: React.ReactNode;
}

const SECTIONS: SectionMeta[] = [
  {
    num: '01',
    id: 'insurance',
    title: <>Insurance &amp; <em>coverage</em></>,
    short: 'Insurance & coverage',
    icon: <Shield size={16} />,
  },
  {
    num: '02',
    id: 'medicaid',
    title: <>Medicaid &amp; <em>waivers</em></>,
    short: 'Medicaid & waivers',
    icon: <HeartPulse size={16} />,
  },
  {
    num: '03',
    id: 'able',
    title: <><em>ABLE</em> accounts</>,
    short: 'ABLE accounts',
    icon: <PiggyBank size={16} />,
  },
  {
    num: '04',
    id: 'respite',
    title: <>Respite &amp; <em>emergency</em> funds</>,
    short: 'Respite & emergency funds',
    icon: <HandCoins size={16} />,
  },
  {
    num: '05',
    id: 'taxes',
    title: <>Tax credits &amp; <em>deductions</em></>,
    short: 'Tax credits & deductions',
    icon: <Receipt size={16} />,
  },
  {
    num: '06',
    id: 'adulthood',
    title: <>Planning for <em>adulthood</em></>,
    short: 'Planning for adulthood',
    icon: <Compass size={16} />,
  },
  {
    num: '07',
    id: 'scripts',
    title: <>Scripts &amp; <em>templates</em></>,
    short: 'Scripts & templates',
    icon: <ScrollText size={16} />,
  },
  {
    num: '08',
    id: 'navigators',
    title: <>Get help <em>navigating this</em></>,
    short: 'Get help navigating this',
    icon: <Phone size={16} />,
  },
];

export default function FinancialPage() {
  return (
    <div className={`${styles.root} ${fraunces.variable} ${interTight.variable}`}>
      {/* ─── Hero ────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <span className={styles.chip}>Inside Common Ground</span>
        <h1 className={styles.heroTitle}>
          Financial pressure is <em>mental health.</em>
        </h1>
        <p className={styles.heroSubtitle}>
          Money stress for autism families is its own kind of crisis — therapy costs that outpace
          coverage, lost income from caregiving, the labyrinth of insurance and Medicaid, and a
          horizon of adulthood planning nobody prepared you for. This is a working guide to the
          programs, scripts, and decisions that can take some weight off.
        </p>
        <div className={styles.heroMeta}>
          <span className={styles.heroReviewed}>Last reviewed · April 2026</span>
          <span className={styles.heroDisclaimer}>
            Not financial advice — start here, then talk to a benefits counselor for your situation.
          </span>
        </div>
      </header>

      {/* ─── Two-column reading shell ─────────────────────────── */}
      <div className={styles.shell}>
        {/* Sticky left TOC (desktop only) */}
        <aside className={styles.toc} aria-label="On this page">
          <p className={styles.tocLabel}>On this page</p>
          <ul className={styles.tocList}>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>
                  <span className={styles.tocNum}>{s.num}</span>
                  <span>{s.short}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Reading column — 8 section shells, body content added in later steps */}
        <main className={styles.reading}>
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className={styles.section}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionNum}>{s.num}</span>
                <span className={styles.sectionIcon}>{s.icon}</span>
                <h2 className={styles.sectionTitle}>{s.title}</h2>
              </div>
              {/* Body content added in Steps 2–5 */}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
