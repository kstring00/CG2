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
    case 'able':
      return <AbleBody />;
    case 'respite':
      return <RespiteBody />;
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

/* ── 03 · ABLE accounts ───────────────────────────────────── */

function AbleBody() {
  return (
    <div className={styles.body}>
      <p>
        An <strong>ABLE account</strong> (Achieving a Better Life Experience) is a tax-advantaged
        savings account specifically for people with disabilities. The reason it exists: before ABLE,
        a person on SSI or Medicaid lost benefits the moment their savings crossed $2,000. That cap
        meant disabled adults — and the families saving for them — were structurally prevented from
        building any financial cushion at all.
      </p>
      <p>
        ABLE accounts let the beneficiary save real money <em>without</em> losing means-tested
        benefits. Up to $100,000 in an ABLE balance is excluded from the SSI $2,000 asset test,
        and ABLE balances are excluded from Medicaid asset tests in nearly every state. For autism
        families this is the single most important account type to know about, and one of the most
        chronically under-used.
      </p>

      <h3 className={styles.subhead}>
        Why it <em>matters</em>
      </h3>
      <ul>
        <li>
          <strong>Save without disqualifying benefits.</strong> The ABLE balance does not count
          against SSI&apos;s $2,000 asset cap (up to the $100,000 exclusion) and is fully excluded from
          Medicaid asset tests in most states.
        </li>
        <li>
          <strong>Family and friends can contribute.</strong> Anyone can deposit into the
          beneficiary&apos;s ABLE account — grandparents, aunts, employers — up to the annual contribution
          limit per beneficiary (not per contributor).
        </li>
        <li>
          <strong>Tax-free growth, tax-free qualified withdrawals.</strong> Same federal tax
          treatment as a 529 college savings plan, but for disability-related expenses.
        </li>
        <li>
          <strong>Eligibility is the disability, not the diagnosis date.</strong> The disability
          must have begun before age 26. (The ABLE Age Adjustment Act raises this to age 46
          starting in 2026 [verify effective date]; if your child&apos;s diagnosis came later, this
          change matters.)
        </li>
      </ul>

      <h3 className={styles.subhead}>
        Limits and <em>rules to know</em>
      </h3>
      <ul>
        <li>
          <strong>Annual contribution cap.</strong> The federal limit is tied to the gift-tax annual
          exclusion — currently $18,000 / year per beneficiary [verify for current tax year]. This
          is the total across all contributors combined.
        </li>
        <li>
          <strong>ABLE-to-Work.</strong> If the beneficiary works and is not enrolled in an employer
          retirement plan, an additional contribution is allowed up to the lesser of (a) their
          annual gross earnings or (b) the federal poverty line for a one-person household
          (~$15,060 for 2024 [verify]). This stacks on top of the $18,000 base.
        </li>
        <li>
          <strong>Total balance cap.</strong> Each state sets its own ceiling — Texas&apos; cap is in the
          $500K range [verify exact figure]. Most state caps fall between $300K and $550K. Hitting
          the cap is a good problem most families never face.
        </li>
        <li>
          <strong>Qualified Disability Expenses (QDEs) — what you can spend it on.</strong>{' '}
          Deliberately broad. Housing, transportation, education, employment training, assistive
          tech, health and wellness expenses not covered by other sources, financial management
          fees, legal fees, basic living expenses, even funeral expenses. The IRS standard is that
          the expense relate to the disability and improve quality of life.
        </li>
        <li>
          <strong>Non-qualified withdrawals.</strong> If money is spent on a non-QDE, the earnings
          portion is subject to federal income tax plus a 10% penalty, and the withdrawal can count
          against SSI / Medicaid eligibility. Track receipts.
        </li>
      </ul>

      <h3 className={styles.subhead}>
        How to <em>open one</em>
      </h3>
      <ol className={styles.stepList}>
        <li>
          <strong>Pick a state plan.</strong> You do not have to use your home state&apos;s plan. Compare
          plans on annual fees, investment options, debit-card access, and minimum contribution at{' '}
          <span className={styles.kbd}>ablenrc.org</span> (the ABLE National Resource Center
          comparison tool). Texans default to the Texas ABLE plan; other strong national options
          include Ohio STABLE and Oregon ABLE for State [verify].
        </li>
        <li>
          <strong>Gather your documents.</strong> Beneficiary&apos;s Social Security number, date of
          birth, and disability documentation (an SSI/SSDI award letter is the simplest; a signed
          physician diagnosis listing the eligible condition also works). The account opener (you,
          if your child is a minor) provides their own SSN and bank routing information.
        </li>
        <li>
          <strong>Open online.</strong> Most state plans have a 15–30 minute online application.
          Designate yourself as the Authorized Legal Representative if your child is a minor. Set
          up automatic monthly contributions even at $25/month — small consistent transfers compound
          and build the habit before larger contributions become possible.
        </li>
      </ol>
      <p>
        One more pointer: families often pair an ABLE account with a Special Needs Trust (SNT). They
        do different jobs — see §06 for when you need both.
      </p>
    </div>
  );
}

/* ── 04 · Respite & emergency funds ───────────────────────── */

function RespiteBody() {
  return (
    <div className={styles.body}>
      <p>
        Respite funding and emergency grants exist for autism families, but the programs are
        scattered, lightly publicized, and — for most of them — application-driven rather than
        automatic. The list below is the working short list. None of these is going to fix
        everything; together they can take a real bite out of a hard month.
      </p>
      <p>
        A note on style: the &ldquo;typical award&rdquo; ranges below are directional. Individual
        program awards vary year-to-year and by demand; verify the current cycle&apos;s specifics on each
        program&apos;s site before counting on a number.
      </p>

      <h3 className={styles.subhead}>
        Six <em>funding sources</em> worth applying to
      </h3>
      <div className={styles.cardList}>
        <div className={styles.resCard}>
          <h4>Take Time Texas (state respite voucher)</h4>
          <div className={styles.resCardMeta}>
            <span><strong>Award</strong> Per-family respite hours; voucher-based</span>
            <span><strong>Best for</strong> Families needing scheduled regular breaks</span>
          </div>
          <div className={styles.resCardBody}>
            <p>
              Texas&apos;s Lifespan Respite program offering subsidized respite vouchers families can
              redeem with approved providers. Annual allocation per family varies by funding cycle
              [verify]. Apply through{' '}
              <span className={styles.kbd}>taketimetexas.org</span> — registration is the gating
              step; vouchers are released as funding allows.
            </p>
          </div>
          <div className={styles.resCardReach}>
            <strong>To reach:</strong> taketimetexas.org · also reachable via your Aging and
            Disability Resource Center (ADRC).
          </div>
        </div>

        <div className={styles.resCard}>
          <h4>Autism Cares Today</h4>
          <div className={styles.resCardMeta}>
            <span><strong>Award</strong> $100 – $5,000 [verify range]</span>
            <span><strong>Best for</strong> Specific therapy, medical, or equipment needs</span>
          </div>
          <div className={styles.resCardBody}>
            <p>
              Quarterly grants for autism-related therapy, medical needs, biomedical treatments,
              equipment, and safety items. Application opens four times a year; awards are
              competitive but turnaround is faster than most government programs.
            </p>
          </div>
          <div className={styles.resCardReach}>
            <strong>To reach:</strong> autismcarestoday.com · review eligibility and current cycle
            dates before drafting an application.
          </div>
        </div>

        <div className={styles.resCard}>
          <h4>UnitedHealthcare Children&apos;s Foundation</h4>
          <div className={styles.resCardMeta}>
            <span><strong>Award</strong> Up to $5,000 [verify]</span>
            <span><strong>Best for</strong> Medical bills, specialized equipment insurance won&apos;t cover</span>
          </div>
          <div className={styles.resCardBody}>
            <p>
              Grants for medical expenses, equipment, and therapies not fully covered by insurance —
              not autism-specific, but autism families regularly qualify. You do <em>not</em> need
              UnitedHealthcare insurance to apply. Income guidelines apply.
            </p>
          </div>
          <div className={styles.resCardReach}>
            <strong>To reach:</strong> uhccf.org · application is online, decisions typically
            within a few weeks [verify].
          </div>
        </div>

        <div className={styles.resCard}>
          <h4>ACT Today (Autism Care and Treatment Today)</h4>
          <div className={styles.resCardMeta}>
            <span><strong>Award</strong> $100 – $5,000 [verify range]</span>
            <span><strong>Best for</strong> Bridge funding for therapy when waivers are pending</span>
          </div>
          <div className={styles.resCardBody}>
            <p>
              Grants specifically for autism treatment, equipment, and care. Particularly helpful for
              families on long Medicaid waiver waitlists who need to fund therapy in the meantime.
              Quarterly application cycle.
            </p>
          </div>
          <div className={styles.resCardReach}>
            <strong>To reach:</strong> act-today.org · check current application window before
            preparing materials.
          </div>
        </div>

        <div className={styles.resCard}>
          <h4>MyGOAL Inc.</h4>
          <div className={styles.resCardMeta}>
            <span><strong>Award</strong> Multi-thousand range, varies by program [verify]</span>
            <span><strong>Best for</strong> Filling gaps in covered therapy and intervention</span>
          </div>
          <div className={styles.resCardBody}>
            <p>
              Funds autism services, therapies, and adaptive technology. Programs include grant
              awards and direct service support. Smaller foundation, less competitive than the big
              names — worth applying to even if other applications are pending.
            </p>
          </div>
          <div className={styles.resCardReach}>
            <strong>To reach:</strong> mygoalautism.org.
          </div>
        </div>

        <div className={styles.resCard}>
          <h4>Local family support funds</h4>
          <div className={styles.resCardMeta}>
            <span><strong>Award</strong> Varies — typically a few hundred to a few thousand</span>
            <span><strong>Best for</strong> Immediate crisis (utilities, rent, food)</span>
          </div>
          <div className={styles.resCardBody}>
            <p>
              County MHMR centers, local United Way chapters, faith-community emergency funds, and
              school-district family liaison budgets all carry discretionary money for families in
              acute need. These are application-light and decision-fast — designed to be deployed in
              days, not months.
            </p>
          </div>
          <div className={styles.resCardReach}>
            <strong>To reach:</strong> 211 (covered below) is the fastest single front door to all
            of these.
          </div>
        </div>
      </div>

      <div className={styles.callout}>
        <span className={styles.calloutLabel}>In the next 24 hours</span>
        <p className={styles.calloutTitle}>
          Three calls that put real money or real help on the table fast.
        </p>
        <div className={styles.calloutBody}>
          <p>
            <strong>1 · Dial 211.</strong> Free, confidential, available 24/7 across the U.S. The
            United Way&apos;s 211 line connects callers with emergency rent / utility / food assistance,
            local respite funds, and crisis childcare. The intake person also knows about local
            grants you won&apos;t find online. If today is the day money is making caregiving feel
            impossible, this is the first call.
          </p>
          <p>
            <strong>2 · Your county MHMR (or LIDDA).</strong> Most county mental-health and
            developmental-disability authorities have small discretionary &ldquo;family support&rdquo;
            funds for crisis use. They can also flag your child for waiver-list priority if the
            situation warrants. Find yours by searching{' '}
            <span className={styles.kbd}>[your county] MHMR</span> or{' '}
            <span className={styles.kbd}>[your county] IDD authority</span>.
          </p>
          <p>
            <strong>3 · Your school district&apos;s family liaison or special-education coordinator.</strong>{' '}
            Districts maintain modest discretionary funds for families in crisis — particularly
            around school supplies, food, transportation, and safety equipment. They also know which
            community partners can move fastest. Call the district office and ask for the family
            liaison or McKinney-Vento coordinator.
          </p>
        </div>
      </div>
    </div>
  );
}
