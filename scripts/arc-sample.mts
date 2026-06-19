/**
 * Arc + support system samples for pre-commit review.
 * Usage: npx tsx scripts/arc-sample.mts
 */
import { getArcWeek } from '../src/lib/arcs.ts';
import {
  FINANCIAL_CANDIDATE_IDS,
  generateArcWeekSteps,
  generateBucketSteps,
  isCandidateAllowed,
  resolveCoverageStatus,
  validateWeekTwoBecauseCopy,
} from '../src/lib/generateNextSteps.ts';
import type { CarePlanAnswers, CarePlanStep } from '../src/lib/carePlanStorage.ts';
import { getEligibleSupportThreads } from '../src/lib/carePlanSupport.ts';

function printSupportPanel(label: string, answers: CarePlanAnswers) {
  const threads = getEligibleSupportThreads(answers);
  console.log(`\n--- Support panel: ${label} ---`);
  threads.forEach((t) => console.log(`  · ${t.id}: ${t.title} → ${t.href}`));
}

function printWeek(
  answers: CarePlanAnswers,
  arcWeekNumber: number,
  priorSteps: CarePlanStep[],
  completedPriorIds: string[],
  lastNudge: 'mental-health' | 'siblings' | null = null,
) {
  const arcWeek = getArcWeek(answers.stage, arcWeekNumber);
  console.log(`\n--- Arc week ${arcWeekNumber}: ${arcWeek.theme} (${arcWeek.phase}) ---`);
  console.log(`  Pool: ${arcWeek.candidateStepIds.join(', ')}`);

  if (arcWeekNumber === 1) {
    const buckets = generateBucketSteps(answers, arcWeek);
    buckets.forEach(({ bucket, step }) => {
      if (!step) return;
      console.log(`  [${bucket}] ${step.title} (${step.id})`);
    });
    return buckets
      .map((b) => b.step)
      .filter((s): s is CarePlanStep => s !== null && s.bucket !== 'next-week');
  }

  const { steps, supportNudgeThread } = generateArcWeekSteps({
    answers,
    arcWeek,
    priorWeekSteps: priorSteps,
    completedPriorWeekIds: completedPriorIds,
    lastSupportNudgeThread: lastNudge,
  });

  steps.forEach((s, i) => {
    console.log(`\n  ${i + 1}. ${s.title} (${s.id})`);
    console.log(`     because: ${s.because}`);
  });
  if (supportNudgeThread) {
    console.log(`\n  Support nudge thread: ${supportNudgeThread}`);
  }
  return steps;
}

function coverageAudit(answers: CarePlanAnswers) {
  const arcWeek = getArcWeek(answers.stage, 2);
  const pool = arcWeek.candidateStepIds.filter((id) => !id.startsWith('todo-'));
  const coverages = [
    'private-insurance',
    'medicaid-waiver',
    'uninsured-self-pay',
    'not-sure',
  ] as const;

  console.log('\n--- Coverage audit (financial ids only may differ) ---');
  for (const cov of coverages) {
    const allowed = pool.filter((id) => isCandidateAllowed(id, cov));
    const blocked = pool.filter((id) => !isCandidateAllowed(id, cov));
    console.log(`  ${cov}: allows ${allowed.length}/${pool.length} pool ids`);
    if (blocked.length) {
      console.log(`    blocked (financial only): ${blocked.filter((id) => FINANCIAL_CANDIDATE_IDS.has(id)).join(', ') || blocked.join(', ')}`);
    }
  }

  const nonFinancialBlocked = pool.some(
    (id) => !FINANCIAL_CANDIDATE_IDS.has(id) && !isCandidateAllowed(id, 'uninsured-self-pay'),
  );
  console.log(
    `\n  Non-financial steps blocked by coverage: ${nonFinancialBlocked ? 'YES — BUG' : 'no'}`,
  );
  console.log(`  resolveCoverageStatus default: ${resolveCoverageStatus({})}`);
}

console.log('='.repeat(72));
console.log('SCENARIO A: newly diagnosed · two-parent family · siblings · week 2');
console.log('='.repeat(72));

const scenarioA: CarePlanAnswers = {
  stage: 'newly-diagnosed',
  coverageStatus: 'private-insurance',
  hasOtherChildren: true,
  hasPartner: true,
  hardest: ['understanding-aba', 'financial-insurance'],
  helpKinds: ['practical-info', 'local-providers'],
};

printSupportPanel('two-parent + siblings', scenarioA);

const week1A = printWeek(scenarioA, 1, [], []) ?? [];
const completedA = ['whatIsAba', 'practicalGuides'].filter((id) =>
  week1A.some((s) => (s.id ?? s.title) === id),
);
const week2A = printWeek(scenarioA, 2, week1A, completedA, null);
{
  const guardErrors = validateWeekTwoBecauseCopy(week2A, week1A, completedA);
  console.log(
    `\n  guard (validateWeekTwoBecauseCopy): ${guardErrors.length === 0 ? 'PASS' : 'FAIL — ' + guardErrors.join('; ')}`,
  );
}

console.log('\n' + '='.repeat(72));
console.log('SCENARIO B: newly diagnosed · solo parent · only child · week 2');
console.log('='.repeat(72));

const scenarioB: CarePlanAnswers = {
  stage: 'newly-diagnosed',
  coverageStatus: 'not-sure',
  hasOtherChildren: false,
  hasPartner: false,
  hardest: ['understanding-aba'],
  helpKinds: ['practical-info'],
};

printSupportPanel('solo · only child', scenarioB);

const week1B = printWeek(scenarioB, 1, [], []) ?? [];
const completedB = ['whatIsAba'].filter((id) =>
  week1B.some((s) => (s.id ?? s.title) === id),
);
const week2B = printWeek(scenarioB, 2, week1B, completedB, 'mental-health');
{
  const guardErrors = validateWeekTwoBecauseCopy(week2B, week1B, completedB);
  console.log(
    `\n  guard (validateWeekTwoBecauseCopy): ${guardErrors.length === 0 ? 'PASS' : 'FAIL — ' + guardErrors.join('; ')}`,
  );
}

coverageAudit(scenarioA);

// ---------------------------------------------------------------------------
// Item 3 — cap accounting for Scenario A week 2 (was a 5th step dropped?)
// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(72));
console.log('ITEM 3: Scenario A week-2 cap accounting (drop vs. exhausted)');
console.log('='.repeat(72));
{
  const arcWeek2 = getArcWeek(scenarioA.stage, 2);
  const cov = resolveCoverageStatus(scenarioA);
  const completedSet = new Set(completedA);
  const seen = new Set<string>();

  const carry = week1A
    .filter((s) => !completedSet.has(s.id ?? s.title))
    .map((s) => s.id ?? s.title);
  carry.forEach((id) => seen.add(id));

  const continuationCandidates = completedA
    .filter((id) => !completedSet.has(id) || true) // verified completions
    .map((id) => id);
  // Which verified completions even HAVE a continuation rule?
  const withRule = completedA.filter((id) =>
    ['whatIsAba','insuranceCall','verifyCoverage','medicaidWaiver','hopeForThree','financialGuide','checkCoverageStatus','findLocal','slidingScaleFind','firstCallQuestions','questionsForBCBA','shortlistProviders','callOneProvider','meltdownNow','parentMatch'].includes(id),
  );

  const poolEligible = arcWeek2.candidateStepIds.filter(
    (id) =>
      !id.startsWith('todo-') &&
      !completedSet.has(id) &&
      !seen.has(id) &&
      isCandidateAllowed(id, cov),
  );

  console.log(`  Verified completions: [${completedA.join(', ') || '(none)'}]`);
  console.log(`  ...of which have a continuation rule: [${withRule.join(', ') || '(none)'}]`);
  console.log(`  Carry-forward (incomplete prior steps): [${carry.join(', ') || '(none)'}]`);
  console.log(`  Arc-week-2 fallback pool, still-eligible: [${poolEligible.join(', ') || '(none)'}]`);
  const theoreticalMax = carry.length + withRule.length + 1 /* nudge */ + poolEligible.length;
  console.log(`  Theoretical distinct eligible steps: ${theoreticalMax} (cap = 5)`);
  console.log(
    theoreticalMax <= 4
      ? '  => Pool GENUINELY EXHAUSTED — no 5th eligible step existed; nothing was dropped.'
      : '  => A 5th step existed; investigate the cap.',
  );
}

// ---------------------------------------------------------------------------
// Item 2 — cross-pool continuation proof
//   looking-for-aba week 2 theme = financial pool. Parent completed
//   questionsForBCBA in week 1, whose unlocked continuation is callOneProvider —
//   NOT in week 2's candidateStepIds. It must still appear (parent-driven).
// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(72));
console.log('ITEM 2: cross-pool continuation (parent-driven, not theme-gated)');
console.log('='.repeat(72));
{
  const answers: CarePlanAnswers = {
    stage: 'looking-for-aba',
    coverageStatus: 'private-insurance',
    hasOtherChildren: false,
    hasPartner: false,
    hardest: ['understanding-aba', 'finding-resources'],
    helpKinds: ['practical-info', 'local-providers'],
  };

  const week1 = (printWeek(answers, 1, [], []) ?? []) as CarePlanStep[];
  const completed = ['whatIsAba', 'questionsForBCBA'].filter((id) =>
    week1.some((s) => (s.id ?? s.title) === id),
  );

  const arcWeek2 = getArcWeek(answers.stage, 2);
  const { steps } = generateArcWeekSteps({
    answers,
    arcWeek: arcWeek2,
    priorWeekSteps: week1,
    completedPriorWeekIds: completed,
    lastSupportNudgeThread: null,
  });

  console.log(`\n  Week-2 theme pool (financial): [${arcWeek2.candidateStepIds.join(', ')}]`);
  console.log(`  Verified completions: [${completed.join(', ')}]`);
  console.log('\n  Generated week 2:');
  steps.forEach((s, i) => {
    const inPool = arcWeek2.candidateStepIds.includes(s.id ?? '');
    console.log(`    ${i + 1}. ${s.title} (${s.id})${inPool ? '' : '  <-- NOT in this week\'s pool'}`);
    console.log(`       because: ${s.because}`);
  });

  const continuation = steps.find((s) => s.id === 'callOneProvider');
  const inPool = arcWeek2.candidateStepIds.includes('callOneProvider');
  console.log(
    `\n  callOneProvider in week-2 pool? ${inPool ? 'yes' : 'NO'}` +
      ` | appears in generated week? ${continuation ? 'YES' : 'no'}`,
  );
  console.log(
    !inPool && continuation
      ? '  => PROOF: a continuation unlocked by the parent surfaced despite NOT being in the theme pool.'
      : '  => FAILED to demonstrate cross-pool continuation.',
  );

  // Item 4 — guard runs on the new path too.
  const guardErrors = validateWeekTwoBecauseCopy(steps, week1, completed);
  console.log(
    `\n  validateWeekTwoBecauseCopy on generateArcWeekSteps output: ${
      guardErrors.length === 0 ? 'PASS' : 'FAIL\n   - ' + guardErrors.join('\n   - ')
    }`,
  );
}

console.log('\n' + '='.repeat(72));
console.log('Arc week 1 pool source (arcs.ts → generateBucketSteps boostArcPool)');
console.log('='.repeat(72));
console.log(JSON.stringify(getArcWeek('newly-diagnosed', 1), null, 2));
