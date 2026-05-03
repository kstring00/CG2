import Link from 'next/link';
import { ArrowLeft, Compass, GraduationCap, MessageCircleHeart, Stethoscope, Users } from 'lucide-react';
import PathfinderCard from '@/components/PathfinderCard';

const whatTheyDo = [
  {
    icon: Compass,
    title: 'sorts the next step',
    body: 'helps you decide what comes first when everything feels first.',
  },
  {
    icon: MessageCircleHeart,
    title: 'reaches out when the data turns',
    body: 'when your check-ins say you&rsquo;re carrying more, you don&rsquo;t have to ask. they reach out.',
  },
  {
    icon: GraduationCap,
    title: 'sits in on school meetings if you want',
    body: 'arD, ieP, 504. they prep with you and show up beside you.',
  },
  {
    icon: Stethoscope,
    title: 'knows the local providers personally',
    body: 'so the referral isn&rsquo;t just a name — it&rsquo;s a known door.',
  },
];

export default function PathfindersPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <Link
        href="/support/caregiver"
        className="inline-flex items-center gap-1 text-sm font-semibold text-brand-muted-600 hover:text-brand-muted-900"
      >
        <ArrowLeft className="h-4 w-4" /> back to parent support
      </Link>

      <header className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-plum-600">
          common ground &middot; pathfinders
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-brand-navy-700 sm:text-4xl">
          meet your pathfinder.
        </h1>
        <p className="mt-4 text-[15.5px] leading-relaxed text-brand-muted-700">
          a real human who has walked this road. pathfinders are texas aba centers care navigators &mdash; trained to help you sort the next step, advocate at school meetings, and check in when the weeks get heavy. you don&rsquo;t have to explain everything from scratch.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted-500">
          what a pathfinder does
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {whatTheyDo.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-2xl border border-surface-border bg-white p-5 shadow-soft"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-brand-plum-50 text-brand-plum-600">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-[15px] font-semibold text-brand-navy-700">{title}</h3>
              <p
                className="mt-1.5 text-[13.5px] leading-relaxed text-brand-muted-600"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-800">
          a note on where we are
        </h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-amber-900/95">
          pathfinders are currently being onboarded. the relationship layer below is shown in demo form so families and providers reviewing common ground can see what we&rsquo;re building. when we launch, this page will introduce you to your real pathfinder by name.
        </p>
      </section>

      <section className="mt-6">
        <PathfinderCard />
      </section>

      <section className="mt-10 rounded-2xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-brand-navy-700">
          <Users className="h-4 w-4 text-primary" /> while you wait
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-brand-muted-700">
          you don&rsquo;t have to wait on us to start. these doors are open today.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li>
            <Link
              href="/support/intake"
              className="block rounded-xl border border-surface-border bg-white px-4 py-3 text-[13.5px] font-medium text-brand-muted-800 transition hover:border-primary/40 hover:bg-primary/5 hover:text-brand-navy-700"
            >
              build a 3-minute care plan &rarr;
            </Link>
          </li>
          <li>
            <Link
              href="/support/find"
              className="block rounded-xl border border-surface-border bg-white px-4 py-3 text-[13.5px] font-medium text-brand-muted-800 transition hover:border-primary/40 hover:bg-primary/5 hover:text-brand-navy-700"
            >
              find local help today &rarr;
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
