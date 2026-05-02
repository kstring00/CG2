'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { deleteEntry, formatDate, loadById } from '../../_lib/storage';
import { MOOD_LABELS, type Entry } from '../../_lib/types';

export default function EntryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    setEntry(loadById(params.id));
    setHydrated(true);
  }, [params?.id]);

  if (!hydrated) return <div className="pt-12" />;

  if (!entry) {
    return (
      <section className="animate-fade-in pt-20 text-center">
        <p
          className="text-xl text-slate-700"
          style={{ fontFamily: 'var(--font-still-waters-serif), Georgia, serif' }}
        >
          That entry is not here.
        </p>
        <Link
          href="/support/still-waters/history"
          className="mt-6 inline-block text-[13px] text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline"
        >
          Back to look back
        </Link>
      </section>
    );
  }

  const handleDelete = () => {
    if (!entry) return;
    const ok = window.confirm(
      'Delete this entry? It cannot be brought back.',
    );
    if (!ok) return;
    deleteEntry(entry.id);
    router.push('/support/still-waters/history');
  };

  return (
    <article className="animate-fade-in pt-6 sm:pt-10">
      <Link
        href="/support/still-waters/history"
        className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Look back
      </Link>

      <header className="mt-6 border-b border-slate-300/50 pb-6">
        <p className="text-[12px] text-slate-500">{formatDate(entry.createdAt)}</p>
        {entry.mood && (
          <p className="mt-1 text-[12px] text-slate-500">
            Walked in {MOOD_LABELS[entry.mood].toLowerCase()}.
          </p>
        )}
        {entry.promptText && (
          <p
            className="mt-5 text-[1.35rem] leading-snug text-slate-700"
            style={{ fontFamily: 'var(--font-still-waters-serif), Georgia, serif' }}
          >
            {entry.promptText}
          </p>
        )}
      </header>

      <div
        className="mt-8 whitespace-pre-wrap text-[1.05rem] leading-[1.75] text-slate-800"
        style={{ fontFamily: 'var(--font-still-waters-sans), system-ui, sans-serif' }}
      >
        {entry.body}
      </div>

      <footer className="mt-16 border-t border-slate-300/50 pt-6 text-center">
        <button
          onClick={handleDelete}
          className="inline-flex items-center gap-1.5 text-[12px] text-slate-400 underline-offset-4 hover:text-slate-700 hover:underline"
        >
          <Trash2 className="h-3 w-3" />
          Delete this entry
        </button>
      </footer>
    </article>
  );
}
