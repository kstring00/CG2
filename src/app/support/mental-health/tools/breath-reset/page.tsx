'use client';

import BreathingOrb from '@/components/BreathingOrb';
import { ToolShell } from '../_shell';

export default function BreathResetPage() {
  return (
    <ToolShell
      title="3-minute breath reset"
      description="Box breathing — in 4, hold 4, out 4, hold 4. Drops the cortisol enough to keep going. Use it before pickup, before the meltdown, before bed."
    >
      <BreathingOrb technique="box" />
      <p className="mt-2 text-center text-xs text-brand-muted-400">
        Inhale 4 · Hold 4 · Exhale 4 · Hold 4 · Repeat 4 rounds
      </p>
    </ToolShell>
  );
}
