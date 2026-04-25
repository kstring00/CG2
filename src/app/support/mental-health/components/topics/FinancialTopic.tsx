'use client';

import { useState } from 'react';
import { DollarSign, Shield, FileText, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import styles from '../../mental-health.module.css';

const SECTIONS = [
  {
    id: 'mandate',
    icon: Shield,
    title: 'Texas insurance mandate',
    subtitle: 'What the law actually requires',
    body: (
      <>
        <p>
          Texas state-regulated health plans are required to cover applied behavior analysis (ABA) when
          medically necessary for autism spectrum disorder. This includes individual and group plans
          regulated by Texas, but does <strong>not</strong> automatically include self-funded employer plans
          (which are governed by federal ERISA and may opt out).
        </p>
        <p className={styles.topicHelper}>
          To check: ask HR (or your insurer) whether your plan is &ldquo;fully insured&rdquo; or &ldquo;self-funded.&rdquo;
          That single answer changes everything about your coverage rights.
        </p>
      </>
    ),
  },
  {
    id: 'medicaid',
    icon: FileText,
    title: 'Texas Medicaid + waivers',
    subtitle: 'The programs most families never hear about',
    body: (
      <>
        <p>
          Texas Medicaid covers ABA for children under 21 (Texas Health Steps / EPSDT). Even if your income
          is too high for standard Medicaid, your child may qualify under one of several waiver programs that
          look only at the <em>child&apos;s</em> income, not the household&apos;s:
        </p>
        <ul className={styles.topicBullets} style={{ marginTop: 10 }}>
          <li><strong>MDCP</strong> — Medically Dependent Children Program. For children with serious medical needs.</li>
          <li><strong>HCS</strong> — Home and Community-based Services. Long waitlist; get on it the day you suspect autism.</li>
          <li><strong>CLASS</strong> — Community Living Assistance and Support Services. Similar to HCS, separate waitlist.</li>
          <li><strong>YES</strong> — Youth Empowerment Services. For kids with serious emotional needs.</li>
        </ul>
        <p className={styles.topicHelper} style={{ marginTop: 10 }}>
          The waitlists are years long. The only mistake is not getting on them today. Contact your Local
          Intellectual and Developmental Disability Authority (LIDDA) to start.
        </p>
      </>
    ),
  },
  {
    id: 'denied',
    icon: Phone,
    title: 'When a claim gets denied',
    subtitle: 'A denial is the start of the conversation, not the end',
    body: (
      <>
        <p>
          About 40% of behavioral health denials are overturned on appeal. Insurers count on you not appealing.
          Don&apos;t give them that.
        </p>
        <ol className={styles.scriptOl} style={{ marginTop: 10 }}>
          <li>Request the denial in writing with the specific reason cited.</li>
          <li>Ask for the &ldquo;medical necessity criteria&rdquo; the reviewer applied.</li>
          <li>Get a letter from your child&apos;s BCBA addressing each cited reason.</li>
          <li>File the appeal in writing within the deadline (usually 180 days).</li>
          <li>If the internal appeal fails, file an external review with the Texas Department of Insurance.</li>
        </ol>
        <p className={styles.topicHelper} style={{ marginTop: 10 }}>
          Your child&apos;s BCBA does this regularly. So does your CG care coordinator. You do not have to be the
          one figuring out the form.
        </p>
      </>
    ),
  },
  {
    id: 'respite',
    icon: DollarSign,
    title: 'Respite & community grants',
    subtitle: 'Money that exists, mostly hidden',
    body: (
      <>
        <p>
          Respite care funding exists in Texas through several sources, but most families never apply because
          they don&apos;t know it exists.
        </p>
        <ul className={styles.topicBullets} style={{ marginTop: 10 }}>
          <li><strong>Take Time Texas</strong> — short-term respite vouchers. Apply once, use as needed.</li>
          <li><strong>Autism Speaks Family Grant</strong> — small grants for therapy materials, respite, equipment.</li>
          <li><strong>UnitedHealthcare Children&apos;s Foundation</strong> — for medical expenses insurance won&apos;t cover.</li>
          <li><strong>Local United Way chapters</strong> — emergency assistance funds; vary by county.</li>
        </ul>
      </>
    ),
  },
];

export function FinancialTopic() {
  const [open, setOpen] = useState<string | null>('mandate');

  return (
    <div className={styles.topicBody}>
      <section className={styles.topicSection}>
        <p className={styles.topicLead}>
          Money stress is mental health stress. Insurance navigation is a job most caregivers were never
          trained for — confusion is the system, not you. In Texas, Medicaid waivers, ECI, and community grants
          exist; most families never hear about them. A care coordinator can pull most of this off your plate.
          That&apos;s what they&apos;re for.
        </p>
      </section>

      <section className={styles.topicSection}>
        <div className={styles.topicSectionHead}>
          <FileText size={16} />
          <h3>The four things to know</h3>
        </div>
        <div className={styles.financeAccordion}>
          {SECTIONS.map((s) => {
            const isOpen = open === s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className={`${styles.financeItem} ${isOpen ? styles.financeItemOpen : ''}`}>
                <button
                  className={styles.financeHead}
                  onClick={() => setOpen(isOpen ? null : s.id)}
                >
                  <span className={styles.financeIcon}><Icon size={16} /></span>
                  <span className={styles.financeTitleWrap}>
                    <span className={styles.financeTitle}>{s.title}</span>
                    <span className={styles.financeSub}>{s.subtitle}</span>
                  </span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isOpen && <div className={styles.financeBody}>{s.body}</div>}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.topicCallout}>
        <Phone size={18} />
        <div>
          <p className={styles.topicCalloutHead}>You don&apos;t have to figure this out alone.</p>
          <p className={styles.topicCalloutBody}>
            Your CG care coordinator handles insurance navigation, waiver applications, and grant matching as
            part of their job. Message them through the client portal, or call your local Texas ABA Centers
            office. The script is: &ldquo;I need help understanding what I&apos;m eligible for.&rdquo;
          </p>
        </div>
      </section>
    </div>
  );
}
