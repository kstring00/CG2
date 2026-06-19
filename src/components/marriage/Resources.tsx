import Link from 'next/link';
import { ArrowRight, Heart, Home, Phone, Users } from 'lucide-react';
import { resources } from '@/lib/marriage/content';

const ICONS = [Heart, Users, Home, Phone];

function ResourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className =
    'group mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-marriage-pine transition hover:text-marriage-pine-soft';

  if (href.startsWith('tel:')) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function MarriageResources() {
  return (
    <section
      id="resources"
      aria-labelledby="marriage-resources-heading"
      className="bg-marriage-paper px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-marriage-pine-soft">
            When you need more than ten minutes
          </p>
          <h2
            id="marriage-resources-heading"
            className="mt-3 font-marriage-serif text-[clamp(1.65rem,4vw,2.25rem)] font-medium leading-snug text-marriage-body"
          >
            Real next steps, for couples who already feel stretched thin.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {resources.map((resource, index) => {
            const Icon = ICONS[index] ?? Heart;
            return (
              <article
                key={resource.title}
                className="flex h-full flex-col rounded-2xl border border-marriage-line bg-marriage-surface p-6"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-marriage-amber/15 text-marriage-amber-deep">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-marriage-serif text-xl font-medium text-marriage-body">
                  {resource.title}
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-marriage-muted">
                  {resource.body}
                </p>
                <ResourceLink href={resource.href}>
                  {resource.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </ResourceLink>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
