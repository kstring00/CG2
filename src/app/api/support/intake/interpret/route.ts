import { NextResponse } from 'next/server';
import type { Hardest, Stage } from '@/lib/carePlanStorage';
import {
  buildBoundedFallbackInterpretation,
  INTAKE_INTERPRETATION_SCHEMA,
  normalizeInterpretation,
  type IntakeInterpretationRequest,
} from '@/lib/intakeInterpretation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STAGE_VALUES: Stage[] = [
  'newly-diagnosed',
  'waiting-diagnosis',
  'in-aba',
  'looking-for-aba',
  'past-aba',
];

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

function parseRequest(value: unknown): IntakeInterpretationRequest | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.stage !== 'string' || !STAGE_VALUES.includes(raw.stage as Stage)) {
    return null;
  }
  if (!Array.isArray(raw.hardest)) return null;
  const hardest = raw.hardest.filter(
    (item): item is Hardest =>
      typeof item === 'string' && HARDEST_VALUES.includes(item as Hardest),
  );
  if (hardest.length === 0) return null;
  if (typeof raw.parentContext !== 'string') return null;
  const parentContext = raw.parentContext.trim().slice(0, MAX_CONTEXT_LENGTH);
  if (parentContext.length < 20) return null;

  return {
    stage: raw.stage as Stage,
    hardest: [...new Set(hardest)],
    parentContext,
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

async function callGateway(input: IntakeInterpretationRequest): Promise<unknown> {
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
        model: process.env.AI_INTAKE_MODEL || 'openai/gpt-5.4',
        store: false,
        instructions: [
          'You are a bounded intake-interpretation service for Common Ground, a parent-support website.',
          'Your only job is to organize the parent’s own words into the supplied schema.',
          'Do not provide advice, diagnosis, treatment, eligibility decisions, clinical recommendations, URLs, or resources.',
          'Do not invent facts. Use null when the parent did not clearly state something.',
          'The selected journey position and concern categories are authoritative.',
          'Keep the summary neutral, compassionate, concise, and written in second person.',
          'Only mark requiresHumanSupport true when the text suggests immediate danger, inability to keep someone safe, serious injury, abuse or neglect, suicidal or homicidal intent, or a medical emergency.',
        ].join(' '),
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: JSON.stringify({
                  approvedJourneyPosition: input.stage,
                  approvedConcernCategories: input.hardest,
                  parentWrittenContext: input.parentContext,
                }),
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'cg_intake_interpretation',
            description:
              'Structured extraction of a parent’s intake context. This is not a recommendation.',
            strict: true,
            schema: INTAKE_INTERPRETATION_SCHEMA,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`AI Gateway returned ${response.status}.`);
    }

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

  const input = parseRequest(raw);
  if (!input) {
    return NextResponse.json(
      { error: 'Please select a journey position, choose at least one concern, and add more detail.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const fallback = buildBoundedFallbackInterpretation(input);

  try {
    const modelOutput = await callGateway(input);
    const interpretation = normalizeInterpretation(modelOutput, fallback);
    return NextResponse.json(interpretation, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.warn('CG intake interpretation used bounded fallback:', error);
    return NextResponse.json(fallback, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
