/**
 * Template fallbacks for the mirror paragraph when the AI call is
 * unavailable or fails. 4 templates per tier, keyed by topCategory.
 *
 * If topCategory is 'self', we route to the 'partner' template — both
 * are about feeling unsupported in relationship, and the language carries
 * over more cleanly than from the work/money templates.
 *
 * Voice: lowercase, plainspoken, no "just", no "self-care", no exclamation.
 * Match /support/caregiver and voice.md.
 */

import type { CategoryId, GroundLevelInputs, LoadTier } from './types';
import { categoryLoad } from './loadMath';

type TemplateKey = 'caregiving' | 'work' | 'money' | 'partner';

function supportLanguage(support: number): string {
  if (support <= 3) return 'mostly alone in it';
  if (support <= 6) return 'getting some help but not enough';
  return 'well-supported, which matters more than the number suggests';
}

const TEMPLATES: Record<LoadTier, Record<TemplateKey, (s: string) => string>> = {
  light: {
    caregiving: (s) =>
      `the caregiving load is light right now and you're ${s}. that's worth marking — these stretches don't last forever, and the next harder week is easier to absorb when you've had a softer one. if you have any extra capacity at all, this might be the week to put one small thing in for yourself, instead of using it all to stay ahead of the next thing.`,
    work: (s) =>
      `work isn't the loudest thing this week, and you're ${s} on that front. that's a real thing, even if it doesn't feel like one. the load you're not carrying right now is space your nervous system can use to recover from the loads you've been carrying for a while. don't fill it back up out of habit.`,
    money: (s) =>
      `money pressures are quieter this week, and you're ${s} around them. the kind of relief this brings is rarely visible from the outside, but the body feels it. if you can, let yourself notice that one of the heavier weights of the year isn't sitting on you today. it's allowed to be okay.`,
    partner: (s) =>
      `the marriage / partner part of your life isn't pulling hard right now, and you're ${s} there. relationships in the middle of caregiving rarely feel light, so when they do, it's worth seeing. this is a good week to do one small thing that isn't logistics — a real conversation, a walk together, anything that's about you two and not about who's covering pickup.`,
  },

  moderate: {
    caregiving: (s) =>
      `caregiving is the loudest thing in your week — not crushing, but present in the way it's been present for a while. you're ${s}. this is the kind of load that doesn't show up as 'a hard week' on paper. it shows up as a slightly shorter fuse, sleep that takes longer to find, and the feeling that small decisions are bigger than they should be. none of that means you're failing. it means your body is doing what bodies do when they don't get enough downtime between waves.`,
    work: (s) =>
      `work is leading the pile this week. you're ${s} there, which is making a real difference even if it doesn't feel like one. the load you're carrying at work doesn't end at 5 — it follows you home and shows up in the patience you have left for everything else. if there's a single small thing you can drop or push to next week, this is the moment your body is asking for that.`,
    money: (s) =>
      `money pressures are sitting heavy this week. you're ${s} around them. money load is one of the hardest kinds because it sits in the background of everything — it's there when you sleep, it's there when you grocery shop, it's there when you say no to things that would have helped. the fact that you've kept going while carrying it is not nothing.`,
    partner: (s) =>
      `the marriage / partner part of your life is taking up real space right now, and you're ${s} there. relationship strain in the middle of caregiving is one of the quietest loads — it doesn't make a noise, it just slowly takes the energy you'd use for connection and routes it somewhere else. this isn't a failure of love. it's what happens when two people are both running close to empty.`,
  },

  heavy: {
    caregiving: (s) =>
      `caregiving is the loudest thing in your week, and you're ${s}. that's the kind of load that doesn't show up as 'stress' — it shows up as a shorter fuse than you'd like, sleep that doesn't restore, and the feeling that small things are bigger than they should be. none of that means you're failing. it means your nervous system is carrying more than one person was meant to carry alone.`,
    work: (s) =>
      `work is the heaviest thing on you right now, and you're ${s} there. heavy work without enough support shows up in the body before it shows up in the calendar. tightness somewhere, sleep that doesn't catch up, decisions that feel bigger than they should. this is the kind of load that often makes parents harder on themselves at home, because the nervous system can't tell the difference between work load and family load — it just runs out of room.`,
    money: (s) =>
      `money is sitting the heaviest right now. you're ${s} around it. financial pressure has a particular way of stripping the buffer out of every other part of life — the small grace you'd normally have for your kid's slow morning, the patience you'd have for your partner, the willingness to ask for help. it's not that you're a different person under money stress. it's that there's nothing left to spend on being one.`,
    partner: (s) =>
      `the marriage / partner part of your life is one of the heaviest loads on you right now. you're ${s} there. partnership strain that runs alongside caregiving doesn't usually announce itself — it shows up as fewer real conversations, more silent splits of who covers what, snapping at the person you love most because there's nowhere else for the load to land. this is what happens when two people are both running on too little, not when something is broken.`,
  },

  crushing: {
    caregiving: () =>
      `caregiving is past heavy. your body is carrying more than is reasonable for one person, and you've been doing it without enough support for long enough that it's showing up as pulled-thin everywhere else. this is the load that often makes parents reach a point where reaching out moves the needle more than anything else — not because something is wrong with you, but because no one carries this alone for this long.`,
    work: () =>
      `work has stopped being something that ends at the door. you're carrying it through every other room of your life right now, and the body is showing it. this is a load where the next move is rarely a productivity move. it's a 'tell one person what's actually happening' move — partner, friend, doctor, anyone who can hold a piece of it with you.`,
    money: () =>
      `money is past heavy and you've been holding it mostly alone. the nervous system doesn't separate financial stress from physical danger — it treats them the same way, and the body shows it. this is a moment where reaching out to one person who knows the system, or to a 211 line, or to anyone who can hold a piece of it, often shifts more than another sleepless night of doing it alone.`,
    partner: () =>
      `the relationship part of your life is past heavy. you're not feeling held in it, and that load — running alongside everything else you're carrying — is more than the body is built to absorb without breaking down differently. this isn't a moment for fixing the marriage. it's a moment for naming, out loud, to one trusted person, that you're carrying too much. that's a beginning, not a small thing.`,
  },
};

export function generateMirrorTemplate(
  inputs: GroundLevelInputs,
  tier: LoadTier,
  topCategory: CategoryId,
): string {
  // self routes to partner — closest emotional adjacency.
  const key: TemplateKey = topCategory === 'self' ? 'partner' : topCategory;
  const support =
    topCategory === 'self'
      ? inputs.self.support
      : inputs[key].support;
  const supportPhrase = supportLanguage(support);
  return TEMPLATES[tier][key](supportPhrase);
}

/** Convenience: which category should we frame the mirror around — same as topCategory. */
export function templateTopCategoryLoad(inputs: GroundLevelInputs, topCategoryId: CategoryId): number {
  return categoryLoad(inputs[topCategoryId]);
}
