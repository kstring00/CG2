'use client';

import { useEffect } from 'react';
import FlowChromeIsolation from './FlowChromeIsolation';

const LEGACY_KEYS = [
  'cg.carePlanDraft.v1',
  'cg.carePlan.v1',
  'cg.weeklyCheckIn.v1',
  'cg.weeklyProgress.v1',
  'cg.weeklyProgress.prev.v1',
] as const;

export default function LegacyStoredDataCleanup() {
  useEffect(() => {
    // One-time cleanup of legacy stored data (including parent email and written context). Remove this effect after ~90 days in production.
    for (const key of LEGACY_KEYS) {
      window.localStorage.removeItem(key);
    }
  }, []);

  return <FlowChromeIsolation />;
}
