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

        {/* Reading column — explicit sections so each can carry its own body */}
        <main className={styles.reading}>
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className={styles.section}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionNum}>{s.num}</span>
                <span className={styles.sectionIcon}>{s.icon}</span>
                <h2 className={styles.sectionTitle}>{s.title}</h2>
              </div>
              <SectionBody id={s.id} />
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

/* ─── Section bodies ───────────────────────────────────────── */

function SectionBody({ id }: { id: string }) {
  switch (id) {
    case 'insurance':
      return <InsuranceBody />;
    case 'medicaid':
      return <MedicaidBody />;
    default:
      return null;
  }
}

/* ── 01 · Insurance & coverage ────────────────────────────── */

function InsuranceBody() {
  return (
    <div className={styles.body}>
      <p>
        When your child gets a treatment plan, the next conversation is almost always about money —
        what&apos;s covered, what isn&apos;t, and how much of the work falls back on you. Most parents are
        surprised at how much of this is advocacy, not paperwork. The two questions below are the
        ones to ask first.
      </p>

      <h3 className={styles.subhead}>
        Getting <em>therapies covered</em>
      </h3>
      <p>
        Coverage is unevenly applied across therapies, even within the same plan. A starting map:
      </p>
      <ul>
        <li>
          <strong>Applied Behavior Analysis (ABA).</strong> Most state-regulated plans must cover
          ABA when medically necessary for autism — Texas has a mandate, and so do most states. The
          gatekeeping language is <em>medically necessary</em>. Your provider&apos;s BCBA writes a Letter
          of Medical Necessity (LMN) that frames the care to fit the criteria, and the LMN is what
          most appeals turn on.
        </li>
        <li>
          <strong>Speech therapy (ST).</strong> Usually covered, often with annual visit caps
          (frequently in the 30–60 visit range, but plan-dependent). When the cap runs out, an
          appeal with an updated LMN can extend it for the calendar year.
        </li>
        <li>
          <strong>Occupational therapy (OT).</strong> Same pattern as speech — visit-cap-limited and
          dependent on documented medical necessity. If sensory-integration goals are central, ask
          the OT to document them explicitly in the LMN.
        </li>
        <li>
          <strong>Behavioral health (counseling, family therapy).</strong> Federal mental health
          parity laws require your plan to cover behavioral health at the same level as physical
          health. If your plan offers $30 primary-care copays, behavioral health should match. Plans
          that quietly violate parity can be reported to your state insurance commissioner.
        </li>
      </ul>
      <p>
        Two terms worth knowing before any phone call: <strong>Single Case Agreement (SCA)</strong>{' '}
        — when no in-network provider can serve your child, insurance can treat an out-of-network
        provider as in-network for billing — and <strong>Letter of Medical Necessity (LMN)</strong>{' '}
        — the clinician&apos;s written justification for a service. Both come up below.
      </p>

      <div className={styles.callout}>
        <span className={styles.calloutLabel}>Scripts for calling your insurer</span>
        <p className={styles.calloutTitle}>
          Three scripts to keep on a sticky note before you pick up the phone.
        </p>
        <div className={styles.calloutBody}>
          <p>
            <strong>1 · Requesting a Single Case Agreement</strong>
          </p>
          <div className={styles.scriptBlock}>
            &ldquo;Hi, I&apos;m calling to request a Single Case Agreement. My child is a member, ID
            number [<span className={styles.kbd}>member ID</span>]. The covered benefit is{' '}
            [<span className={styles.kbd}>ABA / OT / ST</span>]. There is no in-network provider
            within [<span className={styles.kbd}>distance / drive time</span>] available within
            [<span className={styles.kbd}>time frame</span>]. The provider we&apos;ve identified is
            [<span className={styles.kbd}>provider name and NPI</span>]. Can you start the SCA
            review and tell me what documentation you need from them, and the typical turnaround?&rdquo;
          </div>

          <p>
            <strong>2 · Appealing a denial</strong>
          </p>
          <div className={styles.scriptBlock}>
            &ldquo;I&apos;m calling to appeal a denial. The claim or authorization number is
            [<span className={styles.kbd}>number</span>], denied on
            [<span className={styles.kbd}>date</span>]. The reason cited was
            [<span className={styles.kbd}>reason</span>]. I&apos;m requesting in writing: the medical
            necessity criteria the reviewer applied, and the clinical guideline used. I&apos;d like to
            file the appeal in writing — please send the appeal form and confirm the submission
            deadline.&rdquo;
          </div>
          <p>
            About 40% of behavioral health denials are overturned on appeal. Insurers count on
            families not appealing — don&apos;t give them that.
          </p>

          <p>
            <strong>3 · Requesting a Letter of Medical Necessity from your provider</strong>
          </p>
          <div className={styles.scriptBlock}>
            &ldquo;I&apos;m requesting a Letter of Medical Necessity for
            [<span className={styles.kbd}>child&apos;s name</span>]. Insurance is asking for documentation
            supporting [<span className={styles.kbd}>requested service</span>] — they specifically
            want diagnosis, frequency, duration, and expected functional outcomes. Could you send the
            LMN to [<span className={styles.kbd}>insurance fax / portal</span>] and copy us? If
            easier, I can pick it up.&rdquo;
          </div>
          <p>
            An LMN unlocks more than coverage decisions — it&apos;s also what makes some tax deductions
            legitimate (more on that in §05).
          </p>
        </div>
      </div>

      <h3 className={styles.subhead}>
        When private insurance <em>isn&apos;t enough</em>
      </h3>
      <ul>
        <li>
          <strong>Secondary coverage.</strong> A child can carry private insurance <em>and</em>{' '}
          Medicaid simultaneously when the child qualifies via a waiver (see §02). Medicaid as
          secondary picks up copays, deductibles, and services your private plan rejects. Many
          families don&apos;t realize this stacking is allowed.
        </li>
        <li>
          <strong>Marketplace plans (HealthCare.gov).</strong> If you&apos;ve lost employer coverage or
          you&apos;re self-employed, marketplace plans must cover essential health benefits, including
          pediatric services and behavioral health. Compare plans on out-of-network costs and
          behavioral health specifically — not all metal tiers cover ABA equally.
        </li>
        <li>
          <strong>COBRA gotchas.</strong> COBRA continues your employer plan, but you pay the full
          premium plus a 2% admin fee — often four to six times your prior payroll deduction. The
          60-day enrollment window after coverage loss is critical; missing it forfeits the option.
          Before electing COBRA solely for therapy continuity, price-check the marketplace special
          enrollment period (job loss triggers one) — equivalent coverage is often cheaper.
        </li>
      </ul>
    </div>
  );
}

/* ── 02 · Medicaid & waivers ──────────────────────────────── */

function MedicaidBody() {
  return (
    <div className={styles.body}>
      <p>
        Medicaid waivers are the single most under-discovered tool for autism families. They aren&apos;t
        well-publicized partly because the agencies that run them are perpetually overwhelmed and
        partly because the eligibility rules are counter-intuitive. The most important fact first:
        in most states, <strong>waiver eligibility is calculated using the child&apos;s income — not the
        household&apos;s.</strong> Most kids have no income. So families well above the standard Medicaid
        income threshold can still qualify their child for waiver benefits.
      </p>
      <p>
        An <strong>HCBS waiver</strong> (Home and Community-Based Services) lets a state cover
        Medicaid services for people who would otherwise need institutional care. For a child with
        autism, that translates to therapy, attendant care, respite, behavioral support, sometimes
        nutrition, transportation, or environmental modifications. Specifics vary by state and by
        waiver — the section below is Texas-specific because the rest of this platform is
        Texas-leaning. A generic block follows for everyone else.
      </p>

      <h3 className={styles.subhead}>
        Texas <em>waivers</em>
      </h3>
      <p>
        Texas runs four waivers most relevant to autism families. The interest lists are long — for
        most of them, years long — so the rule is simple: <strong>get on every list you might
        qualify for today</strong>, even if you&apos;re not sure. Adding your child does not commit you to
        anything. You can decline services later. The list moves slowly enough that there is no
        penalty for being early; there is a real cost to being late.
      </p>
      <ul className={styles.waiverList}>
        <li className={styles.waiverItem}>
          <span className={styles.waiverName}>MDCP</span>
          <span className={styles.waiverPlain}>
            Medically Dependent Children Program. Covers medically-necessary services, attendant
            care, and respite for kids whose medical complexity would otherwise require nursing-home
            level care.
          </span>
          <div className={styles.waiverMeta}>
            <span><strong>For</strong> Children with significant medical needs.</span>
            <span><strong>Wait</strong> Months to about a year [verify].</span>
          </div>
        </li>
        <li className={styles.waiverItem}>
          <span className={styles.waiverName}>CLASS</span>
          <span className={styles.waiverPlain}>
            Community Living Assistance & Support Services. Habilitation, respite, adaptive aids,
            nursing, and behavioral support for individuals with related conditions including
            autism.
          </span>
          <div className={styles.waiverMeta}>
            <span><strong>For</strong> Individuals with related conditions (autism qualifies).</span>
            <span><strong>Wait</strong> Many years — often 5+ [verify].</span>
          </div>
        </li>
        <li className={styles.waiverItem}>
          <span className={styles.waiverName}>HCS</span>
          <span className={styles.waiverPlain}>
            Home & Community-based Services. Day habilitation, supported employment, residential
            options, respite, and behavioral support for individuals with intellectual or
            developmental disabilities.
          </span>
          <div className={styles.waiverMeta}>
            <span><strong>For</strong> Individuals with IDD (autism qualifies).</span>
            <span><strong>Wait</strong> 10+ years in most parts of Texas [verify].</span>
          </div>
        </li>
        <li className={styles.waiverItem}>
          <span className={styles.waiverName}>TxHmL</span>
          <span className={styles.waiverPlain}>
            Texas Home Living. A lighter support package than HCS — no residential component, but
            similar habilitation, respite, and behavioral supports for those living at home.
          </span>
          <div className={styles.waiverMeta}>
            <span><strong>For</strong> Individuals with IDD living at home.</span>
            <span><strong>Wait</strong> Multi-year, similar to HCS [verify].</span>
          </div>
        </li>
      </ul>
      <p>
        How to get on the lists: contact your Local Intellectual and Developmental Disability
        Authority (LIDDA). Texas has 39 LIDDAs covering all counties — call yours and ask to be added
        to interest lists for HCS, CLASS, TxHmL, and MDCP if applicable. The intake call usually
        takes 30–60 minutes. Bring your child&apos;s diagnostic documentation and Medicaid number if you
        have one.
      </p>

      <h3 className={styles.subhead}>
        If you&apos;re <em>not in Texas</em>
      </h3>
      <p>
        Every state runs its own slate of waivers under different names. The questions to ask are
        the same:
      </p>
      <ul>
        <li>
          Search <span className={styles.kbd}>[your state] HCBS waiver autism</span> or{' '}
          <span className={styles.kbd}>[your state] Medicaid waiver children developmental
          disability</span>. Your state Medicaid agency will list the active waivers.
        </li>
        <li>
          Your state&apos;s Department of Developmental Services (or its equivalent) usually maintains the
          interest list and intake process.
        </li>
        <li>
          Your state&apos;s <strong>Family-to-Family Health Information Center</strong> (covered in §08)
          can tell you which waivers exist, who runs them, and walk you through the application. Free
          service, every state has one.
        </li>
      </ul>
      <p>
        Two more federal programs worth knowing about regardless of state:
      </p>
      <ul>
        <li>
          <strong>Katie Beckett option (TEFRA).</strong> About a dozen states use this Medicaid
          eligibility category, which lets a child with significant disabilities qualify for Medicaid
          based on the child&apos;s assets only. Worth checking if your state participates.
        </li>
        <li>
          <strong>Children&apos;s Health Insurance Program (CHIP).</strong> If you&apos;re between Medicaid and
          marketplace, CHIP covers kids in households up to roughly 200–300% of the federal poverty
          level (varies by state) and includes behavioral health.
        </li>
      </ul>
    </div>
  );
}
