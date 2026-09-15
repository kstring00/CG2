import Link from 'next/link';
import Image from 'next/image';
import { Shield, Bot, Eye, Lock, Mail, FileText, AlertTriangle, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { SITE, siteHost } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE.orgName} collects, uses, and protects your information.`,
};

const EFFECTIVE_DATE = 'April 23, 2026';
const CONTACT_EMAIL = SITE.email;
const CONTACT_PHONE = SITE.phoneDisplay;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-page">
      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" aria-label="Common Ground home">
            <Image
              src={SITE.logoSrc}
              alt={SITE.orgName}
              width={623}
              height={205}
              priority
              className="h-8 w-auto sm:h-9"
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Care Navigation
          </Link>
        </div>
      </nav>

      {/* Page content */}
      <main id="main" className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-8">

        {/* Header */}
        <header className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-surface-border bg-white px-3 py-1.5 text-xs font-semibold text-primary">
            <Shield className="h-3.5 w-3.5" />
            Effective {EFFECTIVE_DATE}
          </div>
          <h1 className="mb-3 text-3xl font-bold text-primary sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-base leading-relaxed text-brand-muted-600">
            Common Ground is a free parent navigation resource.
            This policy explains what information we collect, how we use it, and your rights — in plain English.
          </p>
        </header>

        <div className="space-y-6">

          {/* Who we are */}
          <Section icon={<FileText className="h-5 w-5 text-primary" />} title="Who We Are">
            <p>
              Common Ground (<strong>{siteHost}</strong>) is a parent navigation system operated by{' '}
              {SITE.orgName}. It is designed to help families of children with autism understand ABA therapy,
              find local resources, and navigate each stage of their journey. The site is free and does not require
              an account to use.
            </p>
            <p className="mt-3">
              For questions about this policy, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary">{CONTACT_EMAIL}</a>{' '}
              or{' '}
              <a href={`tel:${CONTACT_PHONE}`} className="font-semibold text-primary">{CONTACT_PHONE}</a>.
            </p>
          </Section>

          {/* What we collect */}
          <Section icon={<Eye className="h-5 w-5 text-primary" />} title="What Information We Collect">
            <p className="mb-4">We collect only what is necessary to operate the site.</p>
            <div className="space-y-3">
              <InfoRow label="Chat messages" color="amber">
                When you use the ABA Guide chat assistant, your messages are sent to OpenAI to generate a
                response. We do not store your chat history on our servers. OpenAI may retain messages
                per their own privacy policy at{' '}
                <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer"
                  className="font-semibold text-primary">openai.com/privacy</a>.
                Do not include personal health information, your child&apos;s name, or identifying details in chat.
              </InfoRow>
              <InfoRow label="Usage data" color="sky">
                We collect standard web analytics — pages visited, time on site, device type, browser, and
                general geographic region (state/city level only). This data is anonymous and used to improve
                the site. We do not collect your name, email, or any personally identifying information
                through analytics.
              </InfoRow>
              <InfoRow label="No account required" color="emerald">
                Common Ground does not require you to create an account. We do not collect names, email
                addresses, phone numbers, or payment information. The site is fully anonymous to use.
              </InfoRow>
            </div>
          </Section>

          {/* AI disclosure — Texas HB 149 */}
          <Section
            icon={<Bot className="h-5 w-5 text-rose-600" />}
            title="AI Disclosure (Required by Texas Law)"
            highlight
          >
            <p className="mb-3">
              <strong>This site uses artificial intelligence.</strong> The ABA Guide chat assistant is powered
              by GPT-4o-mini, a large language model developed by OpenAI. This disclosure is required by{' '}
              <strong>Texas House Bill 149</strong>, effective January 2026.
            </p>
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="mb-1 text-sm font-semibold text-rose-800">Important limitations:</p>
              <ul className="space-y-1.5 text-sm text-brand-muted-600">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-rose-600">•</span>
                  The ABA Guide is an <strong>educational assistant only</strong> — it does not provide medical
                  advice, clinical recommendations, or diagnoses.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-rose-600">•</span>
                  It is not a licensed clinician and cannot replace your child&apos;s BCBA or treatment team.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-rose-600">•</span>
                  AI responses may contain errors. Always verify clinical information with a licensed professional.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-rose-600">•</span>
                  Do not share protected health information (PHI), diagnoses, or treatment details in the chat.
                </li>
              </ul>
            </div>
          </Section>

          {/* How we use information */}
          <Section icon={<Lock className="h-5 w-5 text-primary" />} title="How We Use Your Information">
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="space-y-2 text-sm text-brand-muted-600">
              {[
                'Operate and improve the Common Ground website and Care Navigation tools',
                'Generate AI responses to your chat questions via OpenAI',
                'Understand which resources and pages are most helpful to families',
                'Diagnose technical issues and improve site performance',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We do <strong>not</strong> sell your data, share it with advertisers, or use it for marketing purposes.
            </p>
          </Section>

          {/* Third-party services */}
          <Section icon={<Shield className="h-5 w-5 text-primary" />} title="Third-Party Services">
            <p className="mb-4">Common Ground uses the following third-party services:</p>
            <div className="overflow-hidden rounded-xl border border-surface-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-muted">
                    <th className="px-4 py-3 text-left font-semibold text-primary">Service</th>
                    <th className="px-4 py-3 text-left font-semibold text-primary">Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold text-primary">Privacy Policy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { service: 'OpenAI', purpose: 'Powers the ABA Guide chat assistant', link: 'openai.com/privacy', href: 'https://openai.com/privacy' },
                    { service: 'Vercel', purpose: 'Website hosting and infrastructure', link: 'vercel.com/legal/privacy-policy', href: 'https://vercel.com/legal/privacy-policy' },
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-surface-border">
                      <td className="px-4 py-3 font-semibold text-brand-muted-900">{row.service}</td>
                      <td className="px-4 py-3 text-brand-muted-600">{row.purpose}</td>
                      <td className="px-4 py-3">
                        <a href={row.href} target="_blank" rel="noopener noreferrer"
                          className="text-primary underline">{row.link}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* HIPAA note */}
          <Section icon={<AlertTriangle className="h-5 w-5 text-rose-600" />} title="HIPAA Notice">
            <p>
              Common Ground is a <strong>public educational resource</strong> — it is not a covered entity under HIPAA
              and does not create, store, or transmit protected health information (PHI). The site does not collect
              medical records, clinical diagnoses, or treatment data.
            </p>
            <p className="mt-3">
              If you are a current client seeking clinical support, please use the secure{' '}
              <Link href="/client" className="font-semibold text-primary">Client Portal</Link> rather
              than the public chat assistant.
            </p>
          </Section>

          {/* Children's privacy */}
          <Section icon={<Shield className="h-5 w-5 text-primary" />} title="Children's Privacy (COPPA)">
            <p>
              Common Ground is designed for parents and adult caregivers. We do not knowingly collect personal
              information from children under 13. If you believe a child has provided personal information
              through this site, please contact us immediately at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary">{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          {/* Your rights */}
          <Section icon={<FileText className="h-5 w-5 text-primary" />} title="Your Rights">
            <p className="mb-3">
              Because we collect minimal data and require no account, most standard privacy rights (access,
              deletion, correction) do not apply in practice — we simply don&apos;t have personal data associated
              with you to access or delete.
            </p>
            <p>
              If you have questions about what data may have been collected or want to request deletion of any
              analytics data, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary">{CONTACT_EMAIL}</a>.
              We will respond within 30 days.
            </p>
          </Section>

          {/* Changes */}
          <Section icon={<FileText className="h-5 w-5 text-primary" />} title="Changes to This Policy">
            <p>
              We may update this policy as the site evolves. When we do, we will update the effective date at the
              top of this page. Continued use of the site after changes constitutes acceptance of the updated policy.
              For significant changes, we will make reasonable efforts to notify users through the site.
            </p>
          </Section>

          {/* Contact */}
          <div className="rounded-2xl border border-surface-border bg-white p-6 text-center">
            <Mail className="mx-auto mb-3 h-6 w-6 text-primary" />
            <h2 className="mb-1 text-base font-bold text-primary">Questions about this policy?</h2>
            <p className="mb-4 text-sm text-brand-muted-600">
              We&apos;re real people. Reach out and we&apos;ll respond within 2 business days.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Mail className="h-4 w-4" />
                {CONTACT_EMAIL}
              </a>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="inline-flex items-center gap-2 rounded-xl border border-surface-border bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:opacity-90"
              >
                <Phone className="h-4 w-4" />
                {CONTACT_PHONE}
              </a>
            </div>
          </div>

          {/* Footer nav */}
          <div className="flex flex-wrap justify-center gap-4 pt-2 text-sm text-brand-muted-600">
            <Link href="/" className="text-primary hover:underline">Home</Link>
            <Link href="/support" className="text-primary hover:underline">Care Navigation</Link>
            <span>© {new Date().getFullYear()} {SITE.orgName}</span>
          </div>

        </div>
      </main>
    </div>
  );
}

/* ─── helpers ─────────────────────────────────────────────── */

function Section({
  icon,
  title,
  children,
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border p-6 ${
        highlight ? 'border-rose-200 bg-rose-50/40' : 'border-surface-border bg-white'
      }`}
    >
      <div className="flex items-center gap-2.5 mb-4">
        {icon}
        <h2 className="text-base font-bold text-primary">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-brand-muted-600">
        {children}
      </div>
    </section>
  );
}

function InfoRow({
  label,
  color,
  children,
}: {
  label: string;
  color: 'amber' | 'sky' | 'emerald';
  children: React.ReactNode;
}) {
  const tone = {
    amber:   { box: 'border-amber-200 bg-amber-50', badge: 'bg-amber-100 text-amber-800' },
    sky:     { box: 'border-sky-200 bg-sky-50', badge: 'bg-sky-100 text-sky-900' },
    emerald: { box: 'border-emerald-200 bg-emerald-50', badge: 'bg-emerald-100 text-emerald-900' },
  }[color];

  return (
    <div className={`rounded-xl border p-4 ${tone.box}`}>
      <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${tone.badge}`}>
        {label}
      </span>
      <p className="text-sm leading-relaxed text-brand-muted-600">{children}</p>
    </div>
  );
}
