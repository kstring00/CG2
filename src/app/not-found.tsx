import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowRight, Compass, LifeBuoy, Phone, Search } from 'lucide-react';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'That page has moved or no longer exists. Here are the places families use most.',
  robots: { index: false, follow: true },
};

const ROUTES = [
  {
    href: '/support/intake',
    icon: Compass,
    title: 'Find my next step',
    description: 'Answer a few questions and get a plan built around where you are right now.',
  },
  {
    href: '/support/find',
    icon: Search,
    title: 'Local resources',
    description: 'Search verified providers and support services, filtered by your insurance.',
  },
  {
    href: '/support',
    icon: LifeBuoy,
    title: 'All parent support',
    description: 'Guides, worksheets, and help for the parts nobody prepared you for.',
  },
] as const;

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-3xl flex-col px-5 py-16 sm:px-8 sm:py-24">
      <Link href="/" aria-label={`${SITE.orgName} home`} className="mb-12 inline-block">
        <Image
          src={SITE.logoSrc}
          alt={SITE.orgName}
          width={200}
          height={77}
          className="h-9 w-auto"
          priority
        />
      </Link>

      <p className="t-meta font-semibold uppercase tracking-[0.16em] text-brand-plum-500">
        Error 404
      </p>
      <h1 className="t-h1 mt-3 text-brand-navy-800">
        we couldn&rsquo;t find that page
      </h1>
      <p className="t-lead mt-4 max-w-xl text-brand-muted-600">
        The link may be old, or the page may have moved. Nothing you did caused
        this — and you don&rsquo;t have to go hunting. Here is where most families
        start.
      </p>

      <nav aria-label="Popular pages" className="mt-10 grid gap-3">
        {ROUTES.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="lift group flex items-start gap-4 rounded-2xl border border-surface-border bg-white p-5 shadow-soft"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy-50 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-brand-navy-800">{title}</span>
              <span className="t-meta mt-1 block">{description}</span>
            </span>
            <ArrowRight
              className="mt-3 h-4 w-4 shrink-0 text-brand-muted-600 transition group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden
            />
          </Link>
        ))}
      </nav>

      <div className="mt-10 rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <p className="text-sm font-semibold text-rose-900">If this is urgent</p>
        <p className="t-meta mt-1 text-rose-800">
          Call or text <a href="tel:988" className="font-bold underline underline-offset-2">988</a> for
          the Suicide &amp; Crisis Lifeline, any time, day or night.
        </p>
      </div>

      <p className="t-meta mt-8">
        Still stuck?{' '}
        <a href={`tel:${SITE.phone}`} className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-2 hover:underline">
          <Phone className="h-3.5 w-3.5" aria-hidden />
          Talk to someone — {SITE.phoneDisplay}
        </a>
      </p>
    </main>
  );
}
