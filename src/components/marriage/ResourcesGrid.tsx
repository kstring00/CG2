import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GuideCard } from '@/components/support/GuideCards';
import { RESOURCES } from '@/lib/marriage/content';

export default function ResourcesGrid() {
  return (
    <section id="resources" aria-labelledby="resources-heading" className="scroll-mt-6">
      <div className="text-center">
        <h2 id="resources-heading" className="text-2xl font-bold text-brand-navy-700">
          Practical Tools &amp; Resources
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-[15px] leading-relaxed text-brand-muted-600">
          Evidence-informed tools designed for real life with kids.
        </p>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="list">
        {RESOURCES.map((resource) => {
          const Icon = resource.icon;
          return (
            <li key={resource.id}>
              <GuideCard className="group h-full hover:-translate-y-0.5 hover:border-emerald-100">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <h3 className="mt-3 text-[14px] font-semibold text-brand-navy-700">{resource.title}</h3>
                <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-brand-muted-600">
                  {resource.description}
                </p>
                <Link
                  href={resource.href}
                  className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700 transition group-hover:gap-1.5"
                >
                  Open
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </GuideCard>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
