import { NextResponse } from 'next/server';
import type { CarePlanAnswers, Hardest } from '@/lib/carePlanStorage';
import {
  buildFallbackParentSupportPlan,
  normalizeParentSupportPlan,
  PARENT_SUPPORT_PLAN_SCHEMA,
} from '@/lib/parentSupportPlan';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HARDEST_VALUES: Hardest[] = [
  'understanding-aba',
  'behavior-home',
  'overwhelmed',
  'finding-resources',
  'financial-insurance',
  'siblings',
  'connecting-parents',
  'school-iep',
];

const MAX_CONTEXT_LENGTH = 2000;

function trimOptional(value: unknown, max = MAX_CONTEXT_LENGTH): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length ? trimmed : null;
}

function parseRequest(value: unknown): CarePlanAnswers | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const answersRaw = raw.answers;
  if (!answersRaw || typeof answersRaw !== 'object') return null;
  const answers = answersRaw as Record<string, unknown>;

  const hardest = Array.isArray(answers.hardest)
    ? answers.hardest.filter(
        (item): item is Hardest =>
          typeof item === 'string' && HARDEST_VALUES.includes(item as Hardest),
      )
    : [];

  if (hardest.length === 0) return null;

  return {
    hardest: [...new Set(hardest)],
    stage: typeof answers.stage === 'string' ? (answers.stage as CarePlanAnswers['stage']) : null,
    coverageStatus:
      typeof answers.coverageStatus === 'string'
        ? (answers.coverageStatus as CarePlanAnswers['coverageStatus'])
        : null,
    hasOtherChildren:
      typeof answers.hasOtherChildren === 'boolean' ? answers.hasOtherChildren : null,
    hasPartner: typeof answers.hasPartner === 'boolean' ? answers.hasPartner : null,
    helpKinds: Array.isArray(answers.helpKinds)
      ? (answers.helpKinds.filter((item) => typeof item === 'string') as CarePlanAnswers['helpKinds'])
      : null,
    notes: trimOptional(answers.notes),
    support: trimOptional(answers.support, 500),
    confidence: trimOptional(answers.confidence, 500),
    easier: trimOptional(answers.easier, 500),
    connected: trimOptional(answers.connected, 500),
  };
}

function extractResponseText(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const raw = payload as Record<string, unknown>;
  if (typeof raw.output_text === 'string') return raw.output_text;
  if (!Array.isArray(raw.output)) return null;

  for (const item of raw.output) {
    if (!item || typeof item !== 'object') continue;
    const content = (item as Record<string, unknown>).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || typeof part !== 'object') continue;
      const text = (part as Record<string, unknown>).text;
      if (typeof text === 'string') return text;
    }
  }
  return null;
}

async function callGateway(answers: CarePlanAnswers): Promise<unknown> {
  const token = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!token) throw new Error('AI Gateway authentication is unavailable.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch('https://ai-gateway.vercel.sh/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({
        model:
          process.env.AI_PARENT_PLAN_MODEL ||
          process.env.AI_INTAKE_MODEL ||
          'openai/gpt-5.4',
        store: false,
        instructions: [
          'You are the bounded plan-organizing layer for Common Ground, a parent-support website for current Texas ABA Centers families.',
          'This is not a chatbot. Return exactly one structured object using the supplied schema.',
          'Your role is to reflect the parent’s concern and select the most relevant IDs from the approved option lists embedded in the schema.',
          'Do not create advice, treatment, a behavior intervention plan, a diagnosis, a behavioral function, a reinforcement schedule, a consequence procedure, or a clinical recommendation.',
          'Do not promise that behavior will stop. Do not contradict the child’s BCBA or current plan.',
          'The reflection may summarize the parent’s need in compassionate, concrete second-person language, but it must not include new facts or instructions.',
          'Select options that help the parent prepare, observe, care for their own capacity, and ask their BCBA useful questions.',
          'Set safetyEscalation true only when the text suggests immediate danger, inability to keep someone safe, serious injury, abuse or neglect, suicidal or homicidal intent, elopement with immediate danger, or a medical emergency.',
          'Never include identifying information from the parent’s text in the reflection.',
        ].join(' '),
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: JSON.stringify({
                  approvedConcernCategories: answers.hardest,
                  parentWrittenContext: answers.notes,
                  interpretedBarrier: answers.support,
                  whatTheyAlreadyTried: answers.confidence,
                  desiredOutcome: answers.easier,
                  requestedSupportKinds: answers.helpKinds,
                }),
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'cg_parent_support_plan',
            description:
              'A fixed-format selection from approved parent-support actions and BCBA preparation prompts.',
            strict: true,
            schema: PARENT_SUPPORT_PLAN_SCHEMA,
          },
        },
      }),
    });

    if (!response.ok) throw new Error(`AI Gateway returned ${response.status}.`);
    const payload = await response.json();
    const text = extractResponseText(payload);
    if (!text) throw new Error('AI Gateway returned no structured text.');
    return JSON.parse(text);
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const answers = parseRequest(raw);
  if (!answers) {
    return NextResponse.json(
      { error: 'A saved parent concern is required.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const fallback = buildFallbackParentSupportPlan(answers);

  try {
    const modelOutput = await callGateway(answers);
    return NextResponse.json(normalizeParentSupportPlan(modelOutput, fallback), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.warn('CG parent support plan used bounded fallback:', error);
    return NextResponse.json(fallback, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
