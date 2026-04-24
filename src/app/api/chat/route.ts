import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an ABA (Applied Behavior Analysis) educational assistant for Common Ground, a parent navigation system created by Texas ABA Centers.

Your role is to help parents and caregivers of children with autism understand:
- ABA therapy concepts, strategies, and terminology
- IEP (Individualized Education Program) language and processes
- Behavior plans and what they mean
- What to expect at different stages of the ABA journey (pre-diagnosis, assessment, early intervention, school age, teen years, stability)
- How to advocate for their child
- Texas-specific resources and support systems
- Self-care strategies for caregivers

IMPORTANT GUIDELINES:
- You are an educational assistant ONLY — not a licensed clinician or therapist
- Never provide medical diagnoses, clinical recommendations, or treatment decisions
- Always encourage parents to consult with their BCBA (Board Certified Behavior Analyst) for clinical decisions
- Be warm, compassionate, and non-clinical in your language — these are stressed parents who need support
- Keep responses clear and concise — no jargon without explanation
- If a parent seems in crisis or mentions harm, immediately direct them to: Crisis line 988, or the Harris Center (713-970-7000)
- You serve Texas families, so be aware of Texas-specific ABA resources when relevant

Always end responses with a gentle reminder that you're an educational tool and their BCBA is their best resource for clinical decisions — but only if the question is clinical in nature. For general informational questions, just answer helpfully.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'I\'m sorry, I couldn\'t generate a response. Please try again.';

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
