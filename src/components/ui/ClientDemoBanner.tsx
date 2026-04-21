import { Info } from 'lucide-react';

/**
 * Shown on every client-portal page during the prototype phase. Makes it
 * obvious to demo viewers (execs, BCBAs, families) that the personalized
 * data is illustrative and not tied to a real chart.
 */
export function ClientDemoBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-700" />
      <div className="text-sm leading-relaxed text-amber-900">
        <span className="font-semibold">Prototype preview.</span> The Rivera family
        profile, goals, and progress shown here are illustrative. In production,
        every element would be drawn from your child&apos;s BCBA-authored care
        plan and session data.
      </div>
    </div>
  );
}
