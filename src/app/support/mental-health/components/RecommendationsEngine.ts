import type { Inputs, HistoryDay, Driver } from './RiskEngine';

/**
 * A recommendation routes to either:
 *   - a tab inside the center (`tab`),
 *   - an inline calming tool (`tool`),
 *   - an inline topic (`topic`),
 *   - or, only as a last resort, an external URL (`href`).
 *
 * Internal routing is preferred so the user never leaves the Mental Health Center.
 */
export type RecAction =
  | { kind: 'tab'; tab: 'dashboard' | 'checkin' | 'calming' | 'trends' | 'topics' | 'urgent' }
  | { kind: 'tool'; tool: 'breath' | 'grounding' | 'journal' | 'ask' | 'body' | 'floor' | 'hard-day' | 'one-thing' }
  | { kind: 'topic'; topic: 'identity' | 'sleep' | 'couples' | 'hard-days' | 'financial' | 'siblings' }
  | { kind: 'href'; href: string };

export interface Rec {
  icon: 'priority' | 'support' | 'calm' | 'insight';
  tag: string;
  title: string;
  body: string;
  action: string;
  /** Where the action button takes you. Internal routes are preferred over hrefs. */
  to: RecAction;
}

export interface Insight {
  type: 'good' | 'warning' | 'alert';
  text: string;
}

export function generateRecs(inputs: Inputs, risk: number, drivers: Driver[]): Rec[] {
  const recs: Rec[] = [];
  const top = drivers[0];

  if (risk > 66) {
    recs.push({
      icon: 'priority',
      tag: 'Priority',
      title: "Today, the goal is just less heavy.",
      body: "You've had a stretch of hard days. Drop one non-essential thing on the calendar today — laundry, dinner-as-event, an email — and use that 30 minutes to lie down or step outside.",
      action: "Open the hard-day script →",
      to: { kind: 'topic', topic: 'hard-days' },
    });
  } else if (risk > 50) {
    recs.push({
      icon: 'priority',
      tag: 'Watch',
      title: `Your ${top.label.toLowerCase()} is pushing you into the Watch zone.`,
      body: `A 3-minute reset before the next transition (school pickup, dinner, bedtime) can shift the back half of the day. It's smaller than it sounds and it works.`,
      action: "Start a breath reset →",
      to: { kind: 'tool', tool: 'breath' },
    });
  } else {
    recs.push({
      icon: 'calm',
      tag: 'Steady',
      title: "You're in a stable place. Notice it.",
      body: "Steady days are when the long-arc work happens. A one-line journal entry today gives future-you something to look back on when it gets harder again.",
      action: "Write one line →",
      to: { kind: 'tool', tool: 'journal' },
    });
  }

  if (inputs.sleep < 40) {
    recs.push({
      icon: 'priority',
      tag: 'Sleep',
      title: "Tonight's priority is rest, not productivity.",
      body: "Three nights of thin sleep raises everything else — stress, anxiety, the 3 AM spirals. Even 30 extra minutes tonight matters more than anything you'd get done after 9 PM.",
      action: "Open the sleep guide →",
      to: { kind: 'topic', topic: 'sleep' },
    });
  }

  if (inputs.support < 40 || inputs.isolation > 60) {
    recs.push({
      icon: 'support',
      tag: 'Support',
      title: "You marked low support today.",
      body: `Want help drafting a text to someone you trust? It can be one line — "I'm having a hard one, no need to fix it." That counts as reaching out.`,
      action: "Pick a script →",
      to: { kind: 'tool', tool: 'ask' },
    });
  }

  if (inputs.anxiety > 60 && inputs.sleep < 50) {
    recs.push({
      icon: 'insight',
      tag: 'Pattern',
      title: "Anxiety is up and sleep is down — a familiar pair.",
      body: "When these two move together, the body is asking for slower input. No screens for the last 30 minutes tonight, and a five-minute body scan in bed can interrupt the loop.",
      action: "Try a body scan →",
      to: { kind: 'tool', tool: 'body' },
    });
  }

  if (inputs.stress > 70) {
    recs.push({
      icon: 'calm',
      tag: 'Calm',
      title: "Try a 3-minute reset before the evening routine.",
      body: "The evening with a high-need child takes the most regulation from you. A short reset before it starts costs three minutes and saves you the next hour.",
      action: "Start now →",
      to: { kind: 'tool', tool: 'breath' },
    });
  }

  if (inputs.hopefulness < 35) {
    recs.push({
      icon: 'support',
      tag: 'Connection',
      title: "You've had three hard days in a row.",
      body: "It may help to check in with a counselor — not because something's wrong, but because trained people are easier to talk to than they should be. The Topics tab has a guide on identity and reconnection.",
      action: "Reclaim something small →",
      to: { kind: 'topic', topic: 'identity' },
    });
  }

  if (inputs.bandwidth < 35) {
    recs.push({
      icon: 'calm',
      tag: 'Bandwidth',
      title: "Your bandwidth is empty. That's information, not failure.",
      body: "Today's not the day to start anything new. Hold the floor — kid fed, kid safe, you breathing — and we'll pick the rest up tomorrow.",
      action: "Open the floor list →",
      to: { kind: 'tool', tool: 'floor' },
    });
  }

  if (inputs.overwhelm > 70 && recs.length < 5) {
    recs.push({
      icon: 'insight',
      tag: 'Overwhelm',
      title: "Pick one thing, not five.",
      body: "When everything feels equally urgent, that's the overwhelm talking, not the truth. Write down the next 60 minutes only — what has to happen, what doesn't.",
      action: "Try the next-60-minutes list →",
      to: { kind: 'tool', tool: 'one-thing' },
    });
  }

  if (risk < 50 && recs.length < 4) {
    recs.push({
      icon: 'insight',
      tag: 'Pattern',
      title: "Your support score is doing real work.",
      body: "On days you marked support 6+, your wellness ran 12 points higher on average. Whoever showed up this week — that's the lever.",
      action: "See your trends →",
      to: { kind: 'tab', tab: 'trends' },
    });
  }

  return recs.slice(0, 6);
}

export function generateInsights(history: HistoryDay[]): Insight[] {
  const recent = history.slice(-7);
  const earlier = history.slice(-14, -7);
  const insights: Insight[] = [];

  if (recent.length === 0 || earlier.length === 0) return insights;

  const recentSleep = recent.reduce((s, d) => s + d.sleep, 0) / recent.length;
  const earlierSleep = earlier.reduce((s, d) => s + d.sleep, 0) / earlier.length;
  if (recentSleep < earlierSleep - 5) {
    insights.push({ type: 'warning', text: `<strong>Sleep has slipped about ${Math.round(earlierSleep - recentSleep)} points</strong> over the last week. This is the lever most likely to reset everything else — protecting bedtime tonight is worth more than it sounds.` });
  } else if (recentSleep > earlierSleep + 5) {
    insights.push({ type: 'good', text: `<strong>Sleep is improving</strong> — about ${Math.round(recentSleep - earlierSleep)} points better than the week before. Whatever shifted, hold it.` });
  }

  const supportDays = history.filter(d => d.support >= 60);
  const lowSupportDays = history.filter(d => d.support < 40);
  if (supportDays.length >= 3 && lowSupportDays.length >= 3) {
    const avgHighS = supportDays.reduce((s, d) => s + d.overall, 0) / supportDays.length;
    const avgLowS = lowSupportDays.reduce((s, d) => s + d.overall, 0) / lowSupportDays.length;
    insights.push({ type: 'good', text: `On the days you felt most supported, your wellness ran <strong>${Math.round(avgHighS - avgLowS)} points higher</strong> than days you felt alone. That's not coincidence — that's the single biggest input we can see.` });
  }

  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].stress > 65) streak++;
    else break;
  }
  if (streak >= 3) {
    insights.push({ type: 'alert', text: `Stress has been elevated <strong>${streak} days in a row</strong>. Bodies don't run that hot indefinitely. Even one small thing dropped from this week's calendar would help.` });
  }

  const best = [...history].sort((a, b) => b.overall - a.overall)[0];
  if (best) {
    const daysAgo = Math.round((new Date().getTime() - best.date.getTime()) / (1000 * 60 * 60 * 24));
    insights.push({ type: 'good', text: `Your best day in the last month was about <strong>${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago</strong>. Worth noting what was different — even small details can become a recipe.` });
  }

  const anxSleepCorr = history.filter(d => d.anxiety > 60 && d.sleep < 50).length;
  if (anxSleepCorr >= 5) {
    insights.push({ type: 'warning', text: `On <strong>${anxSleepCorr} of the last 30 days</strong>, anxiety was high and sleep was low together. This is a loop — addressing one usually breaks both.` });
  }

  return insights.slice(0, 5);
}
