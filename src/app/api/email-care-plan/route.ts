import { NextResponse } from 'next/server';

type Payload = {
  email?: string;
  answers?: Record<string, string | null>;
  carePlan?: {
    summary?: string;
    nextSteps?: string[];
    resources?: Array<{ label: string; href: string }>;
    encouragement?: string;
  };
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json({ ok: false, reason: 'INVALID_EMAIL' }, { status: 400 });
    }
    if (!body.carePlan) {
      return NextResponse.json({ ok: false, reason: 'MISSING_CARE_PLAN' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: false, reason: 'EMAIL_NOT_CONFIGURED' });
    }

    const topNeeds = Object.values(body.answers ?? {}).filter(Boolean).join(', ');
    const text = [
      'Common Ground Family Care Plan',
      '',
      'Here is your support guide with helpful starting points for your family.',
      '',
      `Top needs: ${topNeeds || 'Not specified'}`,
      '',
      'Recommended next steps:',
      ...(body.carePlan.nextSteps ?? []).map((s, i) => `${i + 1}. ${s}`),
      '',
      'Suggested sections:',
      ...(body.carePlan.resources ?? []).map((r) => `- ${r.label}: ${r.href}`),
      '',
      `Encouragement: ${body.carePlan.encouragement ?? ''}`,
      '',
      'This care plan is a support guide, not a clinical assessment or treatment recommendation. For clinical questions, please speak with your BCBA, clinical director, or care team.',
    ].join('\n');

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? 'Common Ground <no-reply@commonground.local>',
        to: [body.email],
        subject: 'Your Common Ground Family Care Plan',
        text,
      }),
    });

    if (!resendRes.ok) {
      return NextResponse.json({ ok: false, reason: 'EMAIL_SEND_FAILED' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, reason: 'BAD_REQUEST' }, { status: 400 });
  }
}
