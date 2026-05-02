import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'I need real support · Still Waters',
};

const RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    detail: 'Call or text 988. Free, confidential, 24/7.',
    href: 'tel:988',
    cta: 'Call 988',
    second: { href: 'sms:988', cta: 'Text 988' },
  },
  {
    name: 'Crisis Text Line',
    detail: 'Text HOME to 741741 from anywhere in the U.S.',
    href: 'sms:741741?body=HOME',
    cta: 'Text HOME to 741741',
  },
  {
    name: 'Postpartum Support International',
    detail: 'For parents of any age child. Call or text. Help in 60+ languages.',
    href: 'tel:1-800-944-4773',
    cta: 'Call 1-800-944-4773',
    second: { href: 'sms:800-944-4773', cta: 'Text 800-944-4773' },
  },
  {
    name: 'The Harris Center (Texas)',
    detail: 'Local Texas crisis line for Houston / Harris County.',
    href: 'tel:+17139707000',
    cta: 'Call (713) 970-7000',
  },
  {
    name: 'If you or your child are in immediate danger',
    detail: 'Call 911. Tell them you need help with a mental-health crisis.',
    href: 'tel:911',
    cta: 'Call 911',
  },
];

export default function CrisisPage() {
  return (
    <section className="animate-fade-in pt-6 sm:pt-10">
      <Link
        href="/support/still-waters"
        className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </Link>

      <header className="mt-6">
        <h1
          className="text-3xl text-slate-800 sm:text-4xl"
          style={{ fontFamily: 'var(--font-still-waters-serif), Georgia, serif' }}
        >
          Real support, when writing isn&rsquo;t enough.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600">
          These are real lines, staffed by real people. You do not have to be in
          crisis to call. You can call when it is bad, or when it might be
          getting bad.
        </p>
      </header>

      <ul className="mt-10 space-y-4">
        {RESOURCES.map((r) => (
          <li
            key={r.name}
            className="rounded-2xl border border-slate-300/50 bg-white/70 p-5 sm:p-6"
          >
            <p
              className="text-lg text-slate-800"
              style={{
                fontFamily: 'var(--font-still-waters-serif), Georgia, serif',
              }}
            >
              {r.name}
            </p>
            <p className="mt-1 text-[14px] text-slate-600">{r.detail}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={r.href}
                className="inline-flex items-center rounded-full bg-slate-800 px-4 py-2 text-[13px] font-medium text-white hover:bg-slate-900"
              >
                {r.cta}
              </a>
              {r.second && (
                <a
                  href={r.second.href}
                  className="inline-flex items-center rounded-full border border-slate-400 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
                >
                  {r.second.cta}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-[13px] leading-relaxed text-slate-500">
        Common Ground is a support guide. It is not therapy or clinical care.
        For an emergency, call 911.
      </p>
    </section>
  );
}
