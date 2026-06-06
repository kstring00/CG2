import { NextResponse } from 'next/server';

/**
 * Monday nudge email — sends a parent the "your weekly intake is open" prompt.
 *
 * This route is intentionally manual: the demo has no persisted user accounts
 * or scheduled-job runner, so there is no way to enumerate parents server-side
 * and trigger them on Monday morning. Two pieces are still required to make
 * this fully automatic and they are NOT in scope of this PR:
 *
 *   1. A persistent record of (parentEmail, weekStart, lastNudgedAt) — today
 *      the parent's email lives only in their own browser localStorage.
 *   2. A scheduled trigger (Vercel Cron, an external scheduler, etc.) that
 *      hits this endpoint every Monday at ~6am local time per parent.
 *
 * Until those are in place, the weekly reset is driven entirely in the browser
 * by `lib/weeklyProgress.ts` — the meter empties on Monday because its
 * localStorage key is keyed by the week-of-Monday ISO date. The in-app rail
 * meter is the parent's reminder. A manual POST to this endpoint will still
 * send a Resend email when configured.
 */

type Payload = {
  email?: string;
  weekStartISO?: string;
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json({ ok: false, reason: 'INVALID_EMAIL' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      // Same shape EmailPlanDialog uses — frontend can render the in-app
      // fallback instead of failing loudly.
      return NextResponse.json({ ok: false, reason: 'EMAIL_NOT_CONFIGURED' });
    }

    const text = [
      'Common Ground — your week is open',
      '',
      'Hi friend,',
      '',
      "It's a new week. Your Common Ground progress meter has reset — the easiest place to start is the short weekly check-in. It tells your plan what's heaviest this week and unlocks the next step.",
      '',
      'Start this week’s check-in:',
      'https://commonground.local/support/intake',
      '',
      'No pressure. Come back when you can.',
      '',
      'Common Ground is a support guide, not clinical care.',
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
        subject: 'Your Common Ground week is open',
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
