import Link from 'next/link';
import { Shield, Bot, Eye, Lock, Mail, FileText, AlertTriangle, Phone } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Common Ground',
  description: 'How Common Ground by Texas ABA Centers collects, uses, and protects your information.',
};

const EFFECTIVE_DATE = 'April 23, 2026';
const CONTACT_EMAIL = 'info@texasabacenters.com';
const CONTACT_PHONE = '(832) 402-4144';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4efe8' }}>
      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" aria-label="Common Ground home">
            <img
              alt="Texas ABA Centers | Common Ground"
              width={320}
              height={48}
              className="h-8 w-auto sm:h-9"
              style={{ objectFit: 'contain' }}
              src="/_next/image?url=%2Flogos%2Fcg2-lockup-final.png&w=640&q=100"
            />
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: '#1a2e52' }}
          >
            Care Navigation
          </Link>
        </div>
      </nav>

      {/* Page content */}
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-8">

        {/* Header */}
        <header className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
            style={{ borderColor: '#d4d8e3', backgroundColor: '#ffffff', color: '#1a2e52' }}>
            <Shield className="h-3.5 w-3.5" />
            Effective {EFFECTIVE_DATE}
          </div>
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl" style={{ color: '#1a2e52' }}>
            Privacy Policy
          </h1>
          <p className="text-base leading-relaxed" style={{ color: '#5a5d64' }}>
            Common Ground is a free parent navigation resource provided by Texas ABA Centers.
            This policy explains what information we collect, how we use it, and your rights — in plain English.
          </p>
        </header>

        <div className="space-y-6">

          {/* Who we are */}
          <Section icon={<FileText className="h-5 w-5" style={{ color: '#1a2e52' }} />} title="Who We Are">
            <p>
              Common Ground (<strong>texasabacenterscg.com</strong>) is a parent navigation system operated by
              Texas ABA Centers. It is designed to help families of children with autism understand ABA therapy,
              find local resources, and navigate each stage of their journey. The site is free and does not require
              an account to use.
            </p>
            <p className="mt-3">
              Texas ABA Centers is headquartered in Houston, Texas. For questions about this policy, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#1a2e52', fontWeight: 600 }}>{CONTACT_EMAIL}</a>{' '}
              or{' '}
              <a href={`tel:${CONTACT_PHONE}`} style={{ color: '#1a2e52', fontWeight: 600 }}>{CONTACT_PHONE}</a>.
            </p>
          </Section>

          {/* What we collect */}
          <Section icon={<Eye className="h-5 w-5" style={{ color: '#1a2e52' }} />} title="What Information We Collect">
            <p className="mb-4">We collect only what is necessary to operate the site.</p>
            <div className="space-y-3">
              <InfoRow label="Chat messages" color="amber">
                When you use the ABA Guide chat assistant, your messages are sent to OpenAI to generate a
                response. We do not store your chat history on our servers. OpenAI may retain messages
                per their own privacy policy at{' '}
                <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#1a2e52', fontWeight: 600 }}>openai.com/privacy</a>.
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
            icon={<Bot className="h-5 w-5" style={{ color: '#e2283a' }} />}
            title="AI Disclosure (Required by Texas Law)"
            highlight
          >
            <p className="mb-3">
              <strong>This site uses artificial intelligence.</strong> The ABA Guide chat assistant is powered
              by GPT-4o-mini, a large language model developed by OpenAI. This disclosure is required by{' '}
              <strong>Texas House Bill 149</strong>, effective January 2026.
            </p>
            <div className="rounded-xl border p-4 mt-3" style={{ borderColor: '#fcd4d7', backgroundColor: '#fef0f1' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#a31929' }}>Important limitations:</p>
              <ul className="space-y-1.5 text-sm" style={{ color: '#5a5d64' }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#e2283a', marginTop: '2px' }}>•</span>
                  The ABA Guide is an <strong>educational assistant only</strong> — it does not provide medical
                  advice, clinical recommendations, or diagnoses.
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#e2283a', marginTop: '2px' }}>•</span>
                  It is not a licensed clinician and cannot replace your child&apos;s BCBA or treatment team.
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#e2283a', marginTop: '2px' }}>•</span>
                  AI responses may contain errors. Always verify clinical information with a licensed professional.
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#e2283a', marginTop: '2px' }}>•</span>
                  Do not share protected health information (PHI), diagnoses, or treatment details in the chat.
                </li>
              </ul>
            </div>
          </Section>

          {/* How we use information */}
          <Section icon={<Lock className="h-5 w-5" style={{ color: '#1a2e52' }} />} title="How We Use Your Information">
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="space-y-2 text-sm" style={{ color: '#5a5d64' }}>
              {[
                'Operate and improve the Common Ground website and Care Navigation tools',
                'Generate AI responses to your chat questions via OpenAI',
                'Understand which resources and pages are most helpful to families',
                'Diagnose technical issues and improve site performance',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: '#1a2e52' }} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              We do <strong>not</strong> sell your data, share it with advertisers, or use it for marketing purposes.
            </p>
          </Section>

          {/* Third-party services */}
          <Section icon={<Shield className="h-5 w-5" style={{ color: '#1a2e52' }} />} title="Third-Party Services">
            <p className="mb-4">Common Ground uses the following third-party services:</p>
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: '#d4d8e3' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#eaecf2' }}>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a2e52' }}>Service</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a2e52' }}>Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a2e52' }}>Privacy Policy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { service: 'OpenAI', purpose: 'Powers the ABA Guide chat assistant', link: 'openai.com/privacy', href: 'https://openai.com/privacy' },
                    { service: 'Vercel', purpose: 'Website hosting and infrastructure', link: 'vercel.com/legal/privacy-policy', href: 'https://vercel.com/legal/privacy-policy' },
                  ].map((row, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: '#d4d8e3' }}>
                      <td className="px-4 py-3 font-semibold" style={{ color: '#212226' }}>{row.service}</td>
                      <td className="px-4 py-3" style={{ color: '#5a5d64' }}>{row.purpose}</td>
                      <td className="px-4 py-3">
                        <a href={row.href} target="_blank" rel="noopener noreferrer"
                          className="underline" style={{ color: '#1a2e52' }}>{row.link}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* HIPAA note */}
          <Section icon={<AlertTriangle className="h-5 w-5" style={{ color: '#e2283a' }} />} title="HIPAA Notice">
            <p>
              Common Ground is a <strong>public educational resource</strong> — it is not a covered entity under HIPAA
              and does not create, store, or transmit protected health information (PHI). The site does not collect
              medical records, clinical diagnoses, or treatment data.
            </p>
            <p className="mt-3">
              If you are a current Texas ABA Centers client seeking clinical support, please use the secure{' '}
              <Link href="/client" style={{ color: '#1a2e52', fontWeight: 600 }}>Client Portal</Link> rather
              than the public chat assistant.
            </p>
          </Section>

          {/* Children's privacy */}
          <Section icon={<Shield className="h-5 w-5" style={{ color: '#1a2e52' }} />} title="Children's Privacy (COPPA)">
            <p>
              Common Ground is designed for parents and adult caregivers. We do not knowingly collect personal
              information from children under 13. If you believe a child has provided personal information
              through this site, please contact us immediately at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#1a2e52', fontWeight: 600 }}>{CONTACT_EMAIL}</a>.
            </p>
          </Section>

          {/* Your rights */}
          <Section icon={<FileText className="h-5 w-5" style={{ color: '#1a2e52' }} />} title="Your Rights">
            <p className="mb-3">
              Because we collect minimal data and require no account, most standard privacy rights (access,
              deletion, correction) do not apply in practice — we simply don&apos;t have personal data associated
              with you to access or delete.
            </p>
            <p>
              If you have questions about what data may have been collected or want to request deletion of any
              analytics data, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#1a2e52', fontWeight: 600 }}>{CONTACT_EMAIL}</a>.
              We will respond within 30 days.
            </p>
          </Section>

          {/* Changes */}
          <Section icon={<FileText className="h-5 w-5" style={{ color: '#1a2e52' }} />} title="Changes to This Policy">
            <p>
              We may update this policy as the site evolves. When we do, we will update the effective date at the
              top of this page. Continued use of the site after changes constitutes acceptance of the updated policy.
              For significant changes, we will make reasonable efforts to notify users through the site.
            </p>
          </Section>

          {/* Contact */}
          <div className="rounded-2xl border p-6 text-center" style={{ backgroundColor: '#ffffff', borderColor: '#d4d8e3' }}>
            <Mail className="mx-auto mb-3 h-6 w-6" style={{ color: '#1a2e52' }} />
            <h2 className="text-base font-bold mb-1" style={{ color: '#1a2e52' }}>Questions about this policy?</h2>
            <p className="text-sm mb-4" style={{ color: '#5a5d64' }}>
              We&apos;re real people. Reach out and we&apos;ll respond within 2 business days.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: '#1a2e52' }}
              >
                <Mail className="h-4 w-4" />
                {CONTACT_EMAIL}
              </a>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
                style={{ borderColor: '#d4d8e3', color: '#1a2e52', backgroundColor: '#ffffff' }}
              >
                <Phone className="h-4 w-4" />
                {CONTACT_PHONE}
              </a>
            </div>
          </div>

          {/* Footer nav */}
          <div className="flex flex-wrap justify-center gap-4 pt-2 text-sm" style={{ color: '#8f9299' }}>
            <Link href="/" className="hover:underline" style={{ color: '#1a2e52' }}>Home</Link>
            <Link href="/support" className="hover:underline" style={{ color: '#1a2e52' }}>Care Navigation</Link>
            <span>© {new Date().getFullYear()} Texas ABA Centers</span>
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
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: highlight ? '#fff8f8' : '#ffffff',
        borderColor: highlight ? '#fcd4d7' : '#d4d8e3',
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        {icon}
        <h2 className="text-base font-bold" style={{ color: '#1a2e52' }}>{title}</h2>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: '#5a5d64' }}>
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
  const colors = {
    amber:   { bg: '#fffbeb', border: '#fde68a', badge: '#92400e', badgeBg: '#fef3c7' },
    sky:     { bg: '#f0f9ff', border: '#bae6fd', badge: '#0c4a6e', badgeBg: '#e0f2fe' },
    emerald: { bg: '#f0fdf4', border: '#bbf7d0', badge: '#14532d', badgeBg: '#dcfce7' },
  }[color];

  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
      <span
        className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold"
        style={{ backgroundColor: colors.badgeBg, color: colors.badge }}
      >
        {label}
      </span>
      <p className="text-sm leading-relaxed" style={{ color: '#5a5d64' }}>{children}</p>
    </div>
  );
}
