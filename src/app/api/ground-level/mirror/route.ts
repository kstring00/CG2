import { NextRequest, NextResponse } from 'next/server';

/**
 * Ground Level — server-side proxy to Anthropic's Messages API.
 *
 * The client calls this route; we add the API key here so it never
 * reaches the browser. If ANTHROPIC_API_KEY is not configured, we return
 * 503 — the client falls through to its template fallback automatically.
 *
 * No PHI is sent. Inputs are 0–10 sliders + a tier label. We never log
 * the request body.
 */

const SYSTEM_PROMPT = `You are writing a single mirror paragraph for a parent of a child on the autism spectrum, on a tool called Ground Level inside a site called Common Ground (built by Texas ABA Centers). You are not a therapist. You are not cheerful. You are not a coach. You write like a friend who has carried something similar and knows the words.

You will receive a JSON object with five categories (caregiving, work, money, partner, self), each with a heaviness score (0-10) and a support score (0-10). You will also receive a tier ('light' | 'moderate' | 'heavy' | 'crushing') and a topCategory.

Write 80-140 words. One paragraph. Lowercase. Plainspoken. Never use:
- "Just" ("just take a moment")
- "Self-care"
- "You've got this"
- Emojis
- Exclamation points
- Generic wellness language
- Numbers or percentages
- The word "score"

Do use:
- The actual category names where relevant (caregiving, work, money, marriage/partner, self)
- Nervous-system-level language (shorter fuse, sleep not restoring, decisions feeling bigger, body holding tension)
- The math insight: a heavy thing with support is bearable; a heavy thing alone is what breaks people
- Validation, not solutions

If tier is 'crushing', the paragraph should be shorter (40-70 words), name the load directly, and end by gently pointing toward reaching out — not as an instruction, just as an option naming itself.

Never diagnose. Never claim to know what the parent is feeling — say what the load patterns often show up as. Use phrases like "this is the kind of load that often..." rather than "you are feeling..."

End with a sentence that is not advice. Something the parent can sit with.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inputs, tier, topCategory } = body ?? {};
    if (!inputs || typeof tier !== 'string' || typeof topCategory !== 'string') {
      return NextResponse.json({ error: 'invalid request' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Soft 503 — client falls through to template.
      return NextResponse.json({ error: 'mirror service not configured' }, { status: 503 });
    }

    const userPayload = JSON.stringify({
      caregiving: inputs.caregiving,
      work: inputs.work,
      money: inputs.money,
      partner: inputs.partner,
      self: inputs.self,
      tier,
      topCategory,
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPayload }],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      // Don't leak the upstream body to the client; log server-side only.
      console.error('Anthropic API error:', response.status, detail.slice(0, 500));
      return NextResponse.json({ error: 'mirror service error' }, { status: 502 });
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text;
    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'empty mirror response' }, { status: 502 });
    }

    return NextResponse.json({ text: text.trim() });
  } catch (err) {
    console.error('Ground Level mirror route error:', err);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
