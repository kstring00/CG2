/**
 * Dev-only: sample week-1 / week-2 plans + because-copy guard checks.
 * Usage: npx tsx scripts/week2-sample.mts
 */
import {
  generateBucketSteps,
  generateWeekTwoSteps,
  validateWeekTwoBecauseCopy,
} from '../src/lib/generateNextSteps.ts';
import type { CarePlanAnswers } from '../src/lib/carePlanStorage.ts';

function printScenario(
  label: string,
  answers: CarePlanAnswers,
  completedWeekOneIds: string[],
) {
  console.log(`\n${'='.repeat(72)}`);
  console.log(label);
  console.log('='.repeat(72));

  const weekOneSteps = generateBucketSteps(answers)
    .map((b) => b.step)
    .filter((s): s is NonNullable<typeof s> => s !== null);

  const verified = completedWeekOneIds.filter((id) =>
    weekOneSteps.some((s) => (s.id ?? s.title) === id),
  );

  console.log('\n--- Week 1 (bucket view) ---');
  weekOneSteps.forEach((s, i) => {
    const id = s.id ?? s.title;
    const done = verified.includes(id);
    console.log(`${i + 1}. [${done ? 'DONE' : 'OPEN'}] ${s.title} (${id})`);
  });

  const hasInsuranceStep = weekOneSteps.some(
    (s) => s.id === 'insuranceCall' || s.id === 'verifyCoverage',
  );
  console.log(
    `\nWeek 1 includes private-insurance step: ${hasInsuranceStep ? 'YES (unexpected)' : 'no'}`,
  );

  const weekTwo = generateWeekTwoSteps({
    answers,
    weekOneSteps,
    completedWeekOneIds,
  });

  console.log('\n--- Week 2 generated ---');
  weekTwo.forEach((s, i) => {
    console.log(`\n${i + 1}. ${s.title}`);
    console.log(`   bucket: ${s.bucket}`);
    console.log(`   because: ${s.because}`);
    console.log(`   href: ${s.href}`);
  });

  const errors = validateWeekTwoBecauseCopy(
    weekTwo,
    weekOneSteps,
    completedWeekOneIds,
  );
  console.log('\n--- Because-copy guard ---');
  if (errors.length === 0) {
    console.log('PASS — no false "Because you finished …" attributions');
  } else {
    console.log('FAIL:');
    errors.forEach((e) => console.log(`  - ${e}`));
    process.exitCode = 1;
  }
}

// Newly diagnosed, uninsured — only mark steps that exist in week 1 as done.
const uninsuredAnswers: CarePlanAnswers = {
  stage: 'newly-diagnosed',
  coverageStatus: 'uninsured-self-pay',
  hardest: ['financial-insurance', 'understanding-aba', 'finding-resources'],
  helpKinds: ['practical-info', 'local-providers'],
};

printScenario(
  'SCENARIO A: newly diagnosed · uninsured/self-pay',
  uninsuredAnswers,
  ['whatIsAba', 'medicaidWaiver'], // only week-1 steps actually in plan
);

// Not-sure coverage — should surface checkCoverageStatus in week 1 when financial stress selected.
const notSureAnswers: CarePlanAnswers = {
  stage: 'newly-diagnosed',
  coverageStatus: 'not-sure',
  hardest: ['financial-insurance', 'understanding-aba'],
  helpKinds: ['local-providers'],
};

printScenario(
  'SCENARIO B: newly diagnosed · not sure about coverage',
  notSureAnswers,
  ['checkCoverageStatus', 'whatIsAba'],
);
