'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  DollarSign,
  Shield,
  FileText,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/* ─── data ─────────────────────────────────────────────────── */

const insuranceSections = [
  {
    id: 'texas-mandate',
    title: 'Texas insurance mandate',
    subtitle: 'What the law actually requires',
    icon: Shield,
    color: 'sky',
    content: (
      <>
        <p className="text-sm leading-relaxed text-brand-muted-700 mb-4">
          Texas Senate Bill 1186 (and subsequent updates) requires most Texas health insurance plans to cover
          autism spectrum disorder diagnosis and treatment — including ABA therapy — without arbitrary dollar or
          visit limits. This applies to fully-insured plans regulated by the Texas Department of Insurance.
        </p>
        <div className="space-y-3">
          {[
            { label: 'Covered', items: ['ABA therapy delivered by or supervised by a licensed behavior analyst', 'Psychological testing and evaluation', 'Speech therapy, occupational therapy, and physical therapy related to autism', 'Psychiatric treatment'] },
            { label: 'Important exceptions', items: ['Self-funded (ERISA) employer plans are regulated federally, not by Texas — they may have different rules', 'Medicaid follows separate rules (see the Medicaid section below)', 'Always confirm your specific plan covers "autism spectrum disorder" on your Summary of Benefits'] },
          ].map((block, i) => (
            <div key={i} className={`rounded-xl border p-4 ${i === 0 ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${i === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>{block.label}</p>
              <ul className="space-y-1.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-brand-muted-700">
                    <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${i === 0 ? 'text-emerald-500' : 'text-amber-500'}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-brand-muted-500">
          Source:{' '}
          <a href="https://www.tdi.texas.gov/pubs/consumer/cb066.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            Texas Department of Insurance — Autism Coverage
          </a>
        </p>
      </>
    ),
  },
  {
    id: 'eob',
    title: 'How to read your EOB',
    subtitle: 'Explanation of Benefits — decoded',
    icon: FileText,
    color: 'violet',
    content: (
      <>
        <p className="text-sm leading-relaxed text-brand-muted-700 mb-4">
          Your EOB is not a bill. It is a record of what your insurance company processed. Most parents find
          it confusing — here is what each column actually means.
        </p>
        <div className="space-y-3">
          {[
            { term: 'Billed amount', def: 'What the provider charged. This is almost never what you actually owe.' },
            { term: 'Allowed amount', def: 'What your insurance has negotiated as the maximum payable rate for that service. The billed amount beyond this is written off.' },
            { term: 'Plan paid', def: 'What your insurance company actually paid the provider directly.' },
            { term: 'Your responsibility', def: 'What you owe. This is made up of your deductible, copay, and coinsurance. THIS is the number that matters.' },
            { term: 'Denial code / remark code', def: 'If the claim was denied or adjusted, there will be a code here. Look this code up — it tells you exactly why and what you can do about it.' },
          ].map((row, i) => (
            <div key={i} className="rounded-xl border border-surface-border bg-surface-muted p-3.5">
              <p className="text-xs font-bold text-brand-muted-900">{row.term}</p>
              <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{row.def}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-brand-plum-200 bg-brand-plum-50 p-3.5">
          <p className="text-xs font-bold text-brand-plum-800 mb-1">If a claim looks wrong:</p>
          <p className="text-sm text-brand-plum-700">Call the member services number on your insurance card. Say: &ldquo;I have a question about claim number [X] on my EOB dated [date]. The allowed amount seems incorrect for CPT code [code].&rdquo; Write down the rep&apos;s name and the date of your call.</p>
        </div>
      </>
    ),
  },
  {
    id: 'denial',
    title: 'How to fight a denial',
    subtitle: 'Step-by-step appeals process',
    icon: AlertCircle,
    color: 'rose',
    content: (
      <>
        <p className="text-sm leading-relaxed text-brand-muted-700 mb-4">
          Insurance denials for ABA therapy are common — and they are frequently overturned on appeal. Do not
          accept a denial as the final answer. The appeals process exists precisely for this situation.
        </p>
        <div className="space-y-3">
          {[
            { n: '1', title: 'Request the denial in writing', body: 'You have the right to a written explanation of any denied claim, including the specific medical criteria used to make the decision. Call and ask for this.' },
            { n: '2', title: 'File an internal appeal', body: 'Most plans require you to exhaust internal appeals before escalating. Write a letter that includes: your child\'s diagnosis, the specific service denied, the date of denial, and a statement that the service is medically necessary. Attach supporting documentation from your BCBA and physician.' },
            { n: '3', title: 'Request a peer-to-peer review', body: 'Ask your BCBA or physician to speak directly with the insurance company\'s medical reviewer. Many denials are reversed at this stage. This is free and takes one phone call to arrange — your BCBA has likely done this before.' },
            { n: '4', title: 'File an external review', body: 'If your internal appeal is denied, you have the right to request an independent external review through the Texas Department of Insurance. An independent reviewer decides whether the denial was appropriate. External reviews are overturned in favor of patients at significant rates.' },
            { n: '5', title: 'File a complaint with TDI', body: 'If you believe your insurer is violating Texas autism coverage law, file a complaint at tdi.texas.gov. The Texas Department of Insurance investigates insurance company practices.' },
          ].map((step, i) => (
            <div key={i} className="flex gap-4 rounded-xl border border-surface-border bg-surface-muted p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                {step.n}
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-muted-900">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
          <p className="text-xs font-bold text-rose-700 mb-1">Sample appeal language</p>
          <p className="text-sm italic text-rose-700 leading-relaxed">
            &ldquo;This denial is being appealed on the basis that [service] is medically necessary for the treatment of Autism Spectrum Disorder, which is a covered condition under Texas SB 1186. Attached is documentation from [BCBA name] supporting medical necessity. I am requesting immediate reconsideration.&rdquo;
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'prior-auth',
    title: 'Prior authorization',
    subtitle: 'What it is, how to get it, what to do when denied',
    icon: FileText,
    color: 'amber',
    content: (
      <>
        <p className="text-sm leading-relaxed text-brand-muted-700 mb-4">
          Prior authorization (PA) means your insurance company must approve ABA therapy before it will cover
          the cost. This is one of the most frustrating parts of the ABA journey — here is how to navigate it.
        </p>
        <div className="space-y-3">
          {[
            { title: 'What a PA requires', body: 'A written request from your BCBA or treating physician documenting the autism diagnosis (with DSM-5 code F84.0), the specific services requested (typically ABA, CPT codes 97153–97158), hours requested per week, and a statement of medical necessity. Texas ABA Centers handles this for our clients.' },
            { title: 'How long it takes', body: 'Standard PA: up to 15 business days. Urgent PA: 72 hours. If your child\'s therapy is about to start, request an urgent PA and explain that delay would disrupt ongoing treatment.' },
            { title: 'When a PA is denied', body: 'Request the specific reason in writing. The most common reasons are "not medically necessary" (appeal with updated documentation) or "frequency/duration not supported" (have your BCBA write a letter justifying the hours). Then follow the denial appeal process above.' },
            { title: 'Continuity of care', body: 'If your insurance plan changes mid-treatment, Texas law protects continuity of care. You can often continue with your current provider during a transition period — ask your new insurer about continuity of care provisions.' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-surface-border bg-surface-muted p-4">
              <p className="text-sm font-semibold text-brand-muted-900">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{item.body}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'medicaid',
    title: 'Medicaid & CHIP in Texas',
    subtitle: 'Eligibility, application, and ABA coverage',
    icon: Shield,
    color: 'emerald',
    content: (
      <>
        <p className="text-sm leading-relaxed text-brand-muted-700 mb-4">
          Texas Medicaid (through STAR and STAR Kids programs) covers ABA therapy for children with autism.
          If your family qualifies based on income, Medicaid can cover ABA with little or no out-of-pocket cost.
        </p>
        <div className="space-y-3">
          {[
            { title: 'Medicaid eligibility', body: 'Based on household income and family size. As of 2024, a family of 4 with income up to roughly $36,000/year may qualify. Use the screening tool at yourtexasbenefits.com to check eligibility — it takes about 10 minutes.' },
            { title: 'CHIP (Children\'s Health Insurance Program)', body: 'For children in families that earn too much for Medicaid but cannot afford private insurance. CHIP covers ABA therapy for children diagnosed with autism. Monthly premiums are income-based, starting at $50/month per family.' },
            { title: 'How to apply', body: 'Apply at yourtexasbenefits.com or call 2-1-1 (Texas Health and Human Services). You will need: proof of income, Social Security numbers for all family members, and documentation of your child\'s autism diagnosis. Texas ABA Centers care coordinators can assist with this process.' },
            { title: 'What Medicaid covers for ABA', body: 'HHSC-contracted ABA providers are covered at no cost to you. This includes initial assessment, individual therapy (CPT 97153), group therapy (97154), and caregiver training (97156). Prior authorization is still required, but the process is managed by your provider.' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-surface-border bg-surface-muted p-4">
              <p className="text-sm font-semibold text-brand-muted-900">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{item.body}</p>
            </div>
          ))}
        </div>
        <a
          href="https://www.yourtexasbenefits.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Check Medicaid eligibility <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </>
    ),
  },
];

const sectionColorMap: Record<string, { border: string; bg: string; icon: string; badge: string }> = {
  sky:     { border: 'border-sky-200',     bg: 'bg-sky-50',     icon: 'text-sky-600',     badge: 'bg-sky-100 text-sky-700 border-sky-200' },
  violet:  { border: 'border-violet-200',  bg: 'bg-violet-50',  icon: 'text-violet-600',  badge: 'bg-violet-100 text-violet-700 border-violet-200' },
  rose:    { border: 'border-rose-200',    bg: 'bg-rose-50',    icon: 'text-rose-600',    badge: 'bg-rose-100 text-rose-700 border-rose-200' },
  amber:   { border: 'border-amber-200',   bg: 'bg-amber-50',   icon: 'text-amber-600',   badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  emerald: { border: 'border-emerald-200', bg: 'bg-emerald-50', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const assistancePrograms = [
  {
    title: 'HCS Waiver — Home and Community-based Services',
    body: 'Provides funding for residential support, day programs, and related services for people with intellectual disabilities including autism. There is a wait list — apply now even if you don\'t need it yet.',
    url: 'https://hhs.texas.gov/programs/home-community-based-services-hcs',
    tag: 'Texas waiver program',
  },
  {
    title: 'MDCP Waiver — Medically Dependent Children Program',
    body: 'For children with complex medical needs who would otherwise require nursing facility care. Covers respite, day activity programs, and certain therapies.',
    url: 'https://hhs.texas.gov/programs/medically-dependent-children-program-mdcp',
    tag: 'Texas waiver program',
  },
  {
    title: 'CLASS Waiver — Community Living Assistance and Support Services',
    body: 'For individuals with related conditions (including autism) who need support to live independently or with their family. Covers habilitation, respite, and supported employment.',
    url: 'https://hhs.texas.gov/programs/community-living-assistance-support-services-class',
    tag: 'Texas waiver program',
  },
  {
    title: 'The Arc of Texas — Emergency Assistance Fund',
    body: 'One-time emergency financial assistance for families in crisis. Cover immediate needs like utilities, food, or therapy gaps while insurance issues are resolved.',
    url: 'https://thearcoftexas.org',
    tag: 'Emergency assistance',
  },
  {
    title: 'Autism Speaks — Family Services Grants',
    body: 'Provides grants to families who need help paying for services and supports not covered by insurance or government programs. Applications reviewed on a rolling basis.',
    url: 'https://www.autismspeaks.org/family-services-grants',
    tag: 'Grant program',
  },
  {
    title: 'SHIP — Special Kids Network of Texas',
    body: 'A free information and referral network for families of children with special health care needs. Connects families to local financial assistance, services, and support programs across Texas.',
    url: 'https://www.texaschildrens.org/departments/special-kids-network',
    tag: 'Texas referral network',
  },
];

const taxDeductions = [
  {
    item: 'ABA therapy costs',
    detail: 'ABA therapy is deductible as a medical expense if it exceeds 7.5% of your adjusted gross income. This includes all out-of-pocket costs not reimbursed by insurance.',
  },
  {
    item: 'Diagnosis and evaluation costs',
    detail: 'Psychological evaluations, medical visits related to autism, and diagnostic testing are all deductible medical expenses.',
  },
  {
    item: 'Transportation to therapy',
    detail: 'Mileage driven to and from ABA therapy appointments is deductible at the IRS medical mileage rate (21 cents/mile for 2024). Keep a log.',
  },
  {
    item: 'Special equipment and tools',
    detail: 'Communication devices, sensory equipment, and other items prescribed or recommended by your BCBA for treatment purposes may be deductible.',
  },
  {
    item: 'Dependent Care FSA',
    detail: 'If your employer offers a Dependent Care FSA, you can contribute up to $5,000 pre-tax per year. ABA therapy does not qualify for DCFSA (that is for care while you work), but a Healthcare FSA or HSA can be used for ABA costs.',
  },
];

const preCallChecklist = [
  'Your insurance member ID number (front of insurance card)',
  'The date(s) of service you\'re calling about',
  'The CPT codes for the services — ask your provider for these (97153, 97155, 97156 are the most common ABA codes)',
  'The claim number from your EOB, if you have one',
  'The name of your child\'s BCBA and their NPI (National Provider Identifier) number',
  'A pen and paper — or an open notes app',
  'A quiet place where you can hold for up to 45 minutes',
  'Your diagnosis documentation (DSM-5 code: F84.0)',
];

/* ─── component ────────────────────────────────────────────── */

export default function FinancialPage() {
  const [openInsurance, setOpenInsurance] = useState<number | null>(0);
  const [openAssistance, setOpenAssistance] = useState(false);
  const [openTax, setOpenTax] = useState(false);
  const [openChecklist, setOpenChecklist] = useState(false);

  return (
    <div className="page-shell">

      {/* ══════════════════════════════════════════
          SECTION 1 — SEEN
          "Nobody talks about the money."
      ══════════════════════════════════════════ */}

      <header className="page-header">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <DollarSign className="h-3.5 w-3.5" /> Financial Stress Resources
        </div>
        <h1 className="page-title text-3xl font-bold sm:text-4xl">
          Nobody talks about the money. Let&apos;s talk about the money.
        </h1>
        <p className="page-description text-base leading-relaxed">
          The financial burden on ABA families is real, large, and mostly invisible in public conversation.
          This page gives you the specific information and tools to navigate it — starting with insurance,
          where most families can recover the most.
        </p>
      </header>

      {/* Cost reality card */}
      <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 sm:p-8">
        <div className="flex gap-4">
          <DollarSign className="mt-1 h-6 w-6 shrink-0 text-amber-500" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-500 mb-2">The reality</p>
            <p className="text-2xl font-bold text-brand-muted-900 leading-tight">
              $40,000 – $60,000 per year
            </p>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted-700">
              That is what ABA therapy costs without insurance coverage — for a child receiving a typical 20–40 hours
              of therapy per week. Most families do not learn this number before starting. Most families also do not
              know how much of it they can recover through insurance if they know how to fight for it.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted-700">
              The insurance section below is the most important page in this guide. If your child has a commercial
              insurance plan in Texas, you very likely have more coverage than you think.
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 2 — GROUNDED
          Insurance navigation — most prominent section
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          Insurance navigation
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      {/* Insurance accordion — most prominent section */}
      <section className="rounded-3xl border-2 border-primary/20 bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 id="sec-insurance" className="text-xl font-bold text-brand-muted-900">Insurance — where to start</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-6">
          Insurance is confusing by design. These five sections break down exactly what you need to know —
          from what Texas law requires, to what to do when you get a denial. Open each one.
        </p>
        <div className="space-y-3">
          {insuranceSections.map((section, i) => {
            const c = sectionColorMap[section.color];
            const isOpen = openInsurance === i;
            return (
              <div
                key={section.id}
                className={`rounded-2xl border-2 transition-all ${isOpen ? `${c.border} ${c.bg}` : 'border-surface-border bg-surface-muted'}`}
              >
                <button
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  onClick={() => setOpenInsurance(isOpen ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <section.icon className={`h-4 w-4 shrink-0 ${isOpen ? c.icon : 'text-brand-muted-400'}`} />
                    <div>
                      <span className="text-sm font-semibold text-brand-muted-900">{section.title}</span>
                      <span className="ml-2 text-xs text-brand-muted-500">{section.subtitle}</span>
                    </div>
                  </div>
                  {isOpen
                    ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
                    : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-6">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ask your care coordinator CTA */}
        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-bold text-brand-muted-900">Ask your Texas ABA Centers care coordinator</p>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-muted-600">
                Our care coordinators have navigated hundreds of insurance situations. They can help you read
                your EOB, draft appeal letters, arrange peer-to-peer reviews, and connect you with benefits
                counselors. You do not have to do this alone — that is specifically part of what they are here for.
              </p>
              <Link
                href="/support/connect"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Contact your care coordinator <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Pre-call checklist — practical tool
      ══════════════════════════════════════════ */}

      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <button
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => setOpenChecklist(!openChecklist)}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-brand-muted-900">
              Before your next insurance call — have these ready
            </h2>
          </div>
          {openChecklist
            ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
            : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
        </button>
        <p className="mt-1 text-sm text-brand-muted-500">
          Insurance calls go much better when you walk in prepared. This is everything you need.
        </p>
        {openChecklist && (
          <ul className="mt-4 space-y-2">
            {preCallChecklist.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span className="text-sm text-brand-muted-700">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ══════════════════════════════════════════
          Financial assistance programs
      ══════════════════════════════════════════ */}

      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="rounded-full border border-surface-border bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-muted-400">
          Financial assistance
        </span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <button
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => setOpenAssistance(!openAssistance)}
        >
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-plum-600" />
            <h2 id="sec-texas-programs" className="text-lg font-semibold text-brand-muted-900">Texas financial assistance programs</h2>
          </div>
          {openAssistance
            ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
            : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
        </button>
        <p className="mt-1 text-sm text-brand-muted-500">Waiver programs, emergency funds, and grants available to Texas families</p>
        {openAssistance && (
          <div className="mt-5 space-y-3">
            {assistancePrograms.map((program, i) => (
              <div key={i} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
                <div className="mb-2">
                  <span className="rounded-lg border border-brand-plum-200 bg-brand-plum-50 px-2.5 py-0.5 text-xs font-semibold text-brand-plum-700">
                    {program.tag}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-brand-muted-900">{program.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{program.body}</p>
                <a
                  href={program.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Learn more <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold text-amber-800 mb-1">Important: apply for waivers now</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                Texas Medicaid waiver programs (HCS, CLASS, MDCP) have waiting lists that can span years.
                Apply as soon as your child is diagnosed — even if you don&apos;t think you need it yet. Your
                position on the wait list is determined by application date, not current need.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Lost income / FMLA */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-sky-600" />
          <h2 className="text-lg font-semibold text-brand-muted-900">Lost income &amp; FMLA rights</h2>
        </div>
        <p className="text-sm leading-relaxed text-brand-muted-600 mb-5">
          Many parents of children in ABA therapy have to reduce their work hours — and many do not know
          their legal protections when doing so.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'FMLA protects your job', body: 'If your employer has 50+ employees and you have worked there for 12+ months, the Family and Medical Leave Act allows up to 12 weeks of unpaid, job-protected leave per year to care for a child with a serious health condition. Autism + ABA therapy qualifies.' },
            { title: 'Intermittent FMLA', body: 'You can use FMLA leave in small increments — hours or days — not just weeks at a time. This is critical for parents who need to attend therapy sessions or manage crisis situations without using all their PTO.' },
            { title: 'How to document medical necessity', body: 'Your BCBA or physician completes an FMLA certification form (Form WH-380-F). This form documents that your child\'s condition requires your care and that ABA therapy is an ongoing medical treatment.' },
            { title: 'ADA workplace accommodations', body: 'Even if you don\'t qualify for FMLA, the ADA may require your employer to provide reasonable accommodations — like flexible scheduling or remote work — to support a caregiver. Document your request in writing.' },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl border border-surface-border bg-surface-muted p-4">
              <p className="text-sm font-semibold text-brand-muted-900">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-muted-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tax deductions */}
      <section className="rounded-3xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <button
          className="flex w-full items-center justify-between gap-3 text-left"
          onClick={() => setOpenTax(!openTax)}
        >
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <h2 id="sec-tax" className="text-lg font-semibold text-brand-muted-900">Tax deductions for special needs families</h2>
          </div>
          {openTax
            ? <ChevronUp className="h-4 w-4 shrink-0 text-brand-muted-400" />
            : <ChevronDown className="h-4 w-4 shrink-0 text-brand-muted-400" />}
        </button>
        <p className="mt-1 text-sm text-brand-muted-500">
          These deductions exist. Most families never take them because they don&apos;t know about them.
        </p>
        {openTax && (
          <div className="mt-5 space-y-3">
            {taxDeductions.map((row, i) => (
              <div key={i} className="rounded-xl border border-surface-border bg-surface-muted p-4">
                <p className="text-sm font-semibold text-brand-muted-900">{row.item}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-muted-600">{row.detail}</p>
              </div>
            ))}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-bold text-emerald-800 mb-1">Use a tax professional</p>
              <p className="text-sm text-emerald-700 leading-relaxed">
                Special needs family tax situations are complex. A CPA or enrolled agent who understands disability-related deductions can often save families thousands of dollars. Ask your care coordinator if they know local resources.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Closing */}
      <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-emerald-50/40 to-white border border-primary/10 p-8 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-surface-border shadow-soft mb-5">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-brand-muted-900">
          You are allowed to fight for coverage. That is what it is there for.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-brand-muted-600">
          Insurance companies count on families not knowing their rights or not having the energy to appeal.
          You now have both. Your care coordinator is here to help you use them.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/support/connect"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary/90"
          >
            Talk to your care coordinator <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/support/couples"
            className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-muted-700 transition hover:bg-surface-muted"
          >
            Couples &amp; relationship support
          </Link>
        </div>
      </div>

    </div>
  );
}
