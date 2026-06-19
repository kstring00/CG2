'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import MarriageHero from '@/components/marriage/MarriageHero';
import SituationSelector from '@/components/marriage/SituationSelector';
import FourStepPath from '@/components/marriage/FourStepPath';
import ResourcesGrid from '@/components/marriage/ResourcesGrid';
import RelationshipReset from '@/components/marriage/RelationshipReset';
import CounselorAccordion from '@/components/marriage/CounselorAccordion';
import ExtraSupportSection from '@/components/marriage/ExtraSupportSection';
import BottomCta from '@/components/marriage/BottomCta';
import type { InsightId, SituationId } from '@/lib/marriage/content';

export default function CouplesSupportPage() {
  const [selectedSituation, setSelectedSituation] = useState<SituationId | null>(null);
  const [openInsight, setOpenInsight] = useState<InsightId | null>(null);

  const handleSituationSelect = useCallback((id: SituationId) => {
    setSelectedSituation(id);
    requestAnimationFrame(() => {
      document.getElementById('four-step')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const handleInsightToggle = useCallback((id: InsightId) => {
    setOpenInsight((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash.startsWith('insight-')) return;
      const id = hash.replace(/^insight-/, '') as InsightId;
      setOpenInsight(id);
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  return (
    <div className="space-y-12 pb-4 sm:space-y-14">
      <nav aria-label="Breadcrumb" className="text-[12px] text-brand-muted-500">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/support" className="hover:text-brand-navy-700">
              Home
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="h-3 w-3" />
          </li>
          <li className="font-medium text-brand-muted-700">Marriage &amp; Relationships</li>
        </ol>
      </nav>

      <MarriageHero />
      <SituationSelector selectedId={selectedSituation} onSelect={handleSituationSelect} />
      <FourStepPath />
      <ResourcesGrid />
      <RelationshipReset />
      <CounselorAccordion openId={openInsight} onToggle={handleInsightToggle} />
      <ExtraSupportSection />
      <BottomCta />
    </div>
  );
}
