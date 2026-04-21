import { Database, ShieldAlert } from 'lucide-react';

interface DemoDataNoticeProps {
  title: string;
  description: string;
  compact?: boolean;
}

export function DemoDataNotice({ title, description, compact = false }: DemoDataNoticeProps) {
  return (
    <section className={`rounded-3xl border border-amber-200 bg-amber-50/80 ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          {compact ? <Database className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-amber-900">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-amber-800">{description}</p>
        </div>
      </div>
    </section>
  );
}
