import { spawnSync } from 'node:child_process';

const checks = [
  {
    label: 'STORAGE_AUDIT',
    args: [
      '-rnE',
      'localStorage|sessionStorage|document\\.cookie',
      'src/app/support/intake',
      'src/app/support/care-plan',
      'src/lib/buildPlan.ts',
      'src/content',
    ],
  },
  {
    label: 'NETWORK_AI_AUDIT',
    args: [
      '-rnE',
      'fetch\\(|axios|ai-gateway',
      'src/app/support/intake',
      'src/app/support/care-plan',
    ],
  },
  {
    label: 'ADMISSIONS_NUMBER_AUDIT',
    args: ['-rnF', '877) 771-5725', 'src'],
  },
  {
    label: 'RETIRED_AI_TERMS_AUDIT',
    args: ['-rnE', 'ai-gateway|AI_GATEWAY_API_KEY|VERCEL_OIDC_TOKEN|AI_INTAKE_MODEL', 'src'],
  },
  {
    label: 'FREE_TEXT_CONTROL_AUDIT',
    args: [
      '-rnE',
      '<input|<textarea|contentEditable|contenteditable',
      'src/app/support/intake',
      'src/app/support/care-plan',
    ],
  },
];

for (const check of checks) {
  console.log(`${check.label}_BEGIN`);
  const result = spawnSync('grep', check.args, { encoding: 'utf8' });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  console.log(output || 'NO_MATCHES');
  console.log(`${check.label}_END`);
}
