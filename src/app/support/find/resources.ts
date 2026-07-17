// ============================================================
// CG2 — Find Local Help directory: unified resource model.
// Maps every entry from `verifiedProviders` and
// `sensoryFriendlyPlaces` into one shape so the directory can
// filter/sort/render them without branching on source type.
// ============================================================

import {
  sensoryFriendlyPlaces,
  type SensoryFriendlyPlace,
  type SensoryPlaceCategory,
} from '@/lib/data';
import { parsePhone } from '@/lib/phone';
import { verifiedProviders, type Provider, type ProviderCategory } from '@/lib/providers';

// Region chips match the actual service footprint, plus one chip for
// statewide phone/online resources (TxP2P, Navigate Life Texas, 988, the
// Harris Center, etc.).
export const CITIES = [
  'Sugar Land',
  'Katy',
  'Pearland',
  'Missouri City / Fort Bend County',
  'Southwest Houston',
  'Austin',
  'Plano',
  'Online / phone — anywhere in Texas',
] as const;
export type City = (typeof CITIES)[number];

export const SERVICES = [
  'ABA',
  'Speech',
  'OT',
  'Feeding',
  'Diagnosis',
  'Pediatrician',
  'Mental Health',
  'Respite',
  'Advocacy',
  'Recreation',
  'Sensory-friendly business',
] as const;
export type Service = (typeof SERVICES)[number];

export const AGE_GROUPS = ['Birth–5', '6–12', '13–17', 'Adult', 'All ages'] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export const DELIVERY = ['In-person', 'In-home/Mobile', 'Virtual'] as const;
export type Delivery = (typeof DELIVERY)[number];

export const INTENTS = [
  'just-diagnosed',
  'therapy',
  'sensory-friendly',
  'respite',
  'financial',
  'crisis',
] as const;
export type Intent = (typeof INTENTS)[number];

export type Urgency = 'crisis' | 'standard' | 'sensory-browse';

/**
 * Insurance info may only appear when explicitly verified. When populated,
 * render as: "Confirmed accepts {plan} as of {verifiedDate} — confirm when
 * you book, or ask our admissions team." No listing is verified yet, so no
 * listing shows an insurance tag right now.
 */
export type VerifiedInsurance = { plan: string; verifiedDate: string };

export interface Resource {
  id: string;
  name: string;
  /** Neutral one-liner describing what the provider offers — shows on the card. */
  blurb: string;
  /** Longer description — shows in right rail. */
  description: string;
  helpfulToKnow?: string;
  cities: City[];
  services: Service[];
  ageGroups: AgeGroup[];
  verifiedInsurance?: VerifiedInsurance;
  delivery: Delivery[];
  goodFirstStep: boolean;
  urgency: Urgency;
  twentyFourSeven?: boolean;
  /** Human-readable phone string — may include visible extension text ("ext. 2"). */
  phone?: string;
  /** Digits-only value for the tel: href — exactly one dialable number. */
  phoneDial?: string;
  website?: string;
  address?: string;
  tags: string[];
  lastReviewed: string;
  intents: Intent[];
}

// ── city extraction ────────────────────────────────────────────

function extractCities(loc: string): City[] {
  const l = loc.toLowerCase();
  const out = new Set<City>();
  if (l.includes('sugar land') || l.includes('stafford') || l.includes('richmond') || l.includes('rosenberg')) out.add('Sugar Land');
  if (l.includes('katy') || l.includes('cinco ranch')) out.add('Katy');
  if (l.includes('pearland')) out.add('Pearland');
  if (l.includes('missouri city') || l.includes('fort bend')) out.add('Missouri City / Fort Bend County');
  if (l.includes('austin')) out.add('Austin');
  if (l.includes('plano')) out.add('Plano');
  if (
    l.includes('statewide') ||
    l.includes('nationwide') ||
    l.includes('multiple, tx') ||
    l.includes('online') ||
    l.includes('virtual')
  ) {
    out.add('Online / phone — anywhere in Texas');
  }
  // Remaining Houston-area listings serve the footprint's Houston side
  // (southwest Houston / Fort Bend corridor).
  if (l.includes('houston') && !out.has('Sugar Land')) out.add('Southwest Houston');
  if (out.size === 0) out.add('Southwest Houston');
  return Array.from(out);
}

// ── age range extraction ───────────────────────────────────────

function extractAgeGroups(range: string): AgeGroup[] {
  const r = range.toLowerCase();
  if (r.includes('all ages')) return ['All ages'];
  const out = new Set<AgeGroup>();
  if (/birth|infant|premature|0\s*[-–]\s*[1-5]|under 3|toddler|18 months|2\s*[-–]\s*5/.test(r)) out.add('Birth–5');
  if (/6\s*[-–]\s*12|school[- ]age|child(?!ren and adults)/.test(r)) out.add('6–12');
  if (/13\s*[-–]\s*17|teen|adolescent/.test(r)) out.add('13–17');
  if (r.includes('adult')) out.add('Adult');
  // Fall-through: pediatric / children / 0-18
  if (out.size === 0 && /pediatric|child|kid|18 years|0\s*[-–]\s*18/.test(r)) {
    out.add('Birth–5');
    out.add('6–12');
    out.add('13–17');
  }
  if (out.size === 0) out.add('All ages');
  return Array.from(out);
}

// ── provider category → service mapping ────────────────────────

const providerServiceMap: Record<ProviderCategory, Service[]> = {
  'aba-therapy': ['ABA'],
  'speech-therapy': ['Speech'],
  'occupational-therapy': ['OT'],
  'feeding-therapy': ['Feeding'],
  'diagnostic-testing': ['Diagnosis'],
  'autism-friendly-pediatrician': ['Pediatrician'],
  'parent-mental-health': ['Mental Health'],
  'support-groups': ['Advocacy'],
  'respite-care': ['Respite'],
  'advocacy-iep': ['Advocacy'],
  'financial-legal': ['Advocacy'],
  'adaptive-recreation': ['Recreation'],
  'crisis-urgent': ['Mental Health'],
};

const providerIntentMap: Record<ProviderCategory, Intent[]> = {
  'aba-therapy': ['just-diagnosed', 'therapy'],
  'speech-therapy': ['therapy'],
  'occupational-therapy': ['therapy'],
  'feeding-therapy': ['therapy'],
  'diagnostic-testing': ['just-diagnosed'],
  'autism-friendly-pediatrician': ['just-diagnosed'],
  'parent-mental-health': ['crisis'],
  'support-groups': ['just-diagnosed', 'crisis'],
  'respite-care': ['respite'],
  'advocacy-iep': ['just-diagnosed'],
  'financial-legal': ['financial'],
  'adaptive-recreation': ['sensory-friendly'],
  'crisis-urgent': ['crisis'],
};

const sensoryServiceMap: Record<SensoryPlaceCategory, Service[]> = {
  dentist: ['Sensory-friendly business', 'Pediatrician'],
  haircut: ['Sensory-friendly business'],
  developmental: ['Diagnosis', 'Pediatrician'],
  'speech-ot': ['Speech', 'OT'],
  'mental-health': ['Mental Health'],
  'pediatric-gi': ['Pediatrician'],
  'eye-care': ['Pediatrician'],
  advocacy: ['Advocacy'],
  pediatrician: ['Pediatrician'],
  grocery: ['Sensory-friendly business'],
  restaurant: ['Sensory-friendly business'],
  entertainment: ['Sensory-friendly business'],
  optometrist: ['Pediatrician'],
  photography: ['Sensory-friendly business'],
  other: ['Sensory-friendly business'],
};

// ── delivery extraction ────────────────────────────────────────

function providerDelivery(p: Provider): Delivery[] {
  const out = new Set<Delivery>();
  if (p.service_type.includes('in-person')) out.add('In-person');
  if (p.service_type.includes('mobile')) out.add('In-home/Mobile');
  if (p.service_type.includes('hybrid')) {
    out.add('In-person');
    out.add('Virtual');
  }
  if (p.service_type.includes('virtual')) out.add('Virtual');
  if (out.size === 0) out.add('In-person');
  return Array.from(out);
}

function sensoryDelivery(): Delivery[] {
  return ['In-person'];
}

// ── builders ───────────────────────────────────────────────────

function buildFromProvider(p: Provider): Resource {
  const services = providerServiceMap[p.category];
  const intents = [...providerIntentMap[p.category]];
  const isCrisis = p.category === 'crisis-urgent';
  const goodFirstStep =
    p.recommendation_level === 'great-first-call' && p.category !== 'crisis-urgent';
  const tags: string[] = [];
  if (goodFirstStep) tags.push('Good first step');
  if (isCrisis) tags.push('24/7');
  if (p.languages_offered.some((l) => l.toLowerCase().includes('spanish'))) tags.push('Spanish');
  if (p.waitlist_status.toLowerCase().includes('no wait')) tags.push('No waitlist');
  if (p.sensory_accommodations) tags.push('Sensory accommodations');

  // Only phone strings that contain one dialable number become tel: links —
  // "Contact via website" / "Varies by therapist" render no phone at all.
  const phone = parsePhone(p.phone);

  return {
    id: `provider-${p.id}`,
    name: p.provider_name,
    blurb: trimToSentence(p.why_it_may_help, 200),
    description: p.why_it_may_help,
    helpfulToKnow: p.helpful_to_know,
    cities: extractCities(p.location),
    services,
    ageGroups: extractAgeGroups(p.age_range),
    verifiedInsurance: p.verifiedInsurance,
    delivery: providerDelivery(p),
    goodFirstStep,
    urgency: isCrisis ? 'crisis' : 'standard',
    twentyFourSeven: /24\/7|anytime/.test(`${p.waitlist_status} ${p.services.join(' ')}`),
    phone: phone?.display,
    phoneDial: phone?.dial,
    website: p.website,
    tags,
    lastReviewed: p.last_verified_date,
    intents,
  };
}

function buildFromSensory(s: SensoryFriendlyPlace): Resource {
  const services = sensoryServiceMap[s.category];
  const isBrowse = ['haircut', 'grocery', 'restaurant', 'entertainment', 'photography', 'other'].includes(s.category);
  const intents: Intent[] = ['sensory-friendly'];
  if (s.category === 'developmental' || s.category === 'pediatrician') intents.push('just-diagnosed');
  if (s.category === 'speech-ot') intents.push('therapy');
  if (s.category === 'mental-health') intents.push('crisis');
  if (s.category === 'advocacy') intents.push('just-diagnosed', 'financial');

  const tags: string[] = ['Sensory-friendly'];
  if (s.verificationSource === 'staff-vouched') tags.push('Staff-vouched');
  if (s.verificationSource === 'parent-submitted') tags.push('Parent-recommended');

  const phone = parsePhone(s.phone);

  return {
    id: `sensory-${s.id}`,
    name: s.name,
    blurb: trimToSentence(s.whatWorks, 200),
    description: `${s.description}\n\n${s.whatWorks}`,
    helpfulToKnow: s.whatToKnow,
    cities: extractCities(`${s.city}, ${s.state} ${s.address ?? ''}`),
    services,
    ageGroups: ['All ages'],
    delivery: sensoryDelivery(),
    goodFirstStep: false,
    urgency: isBrowse ? 'sensory-browse' : 'standard',
    phone: phone?.display,
    phoneDial: phone?.dial,
    website: s.website,
    address: s.address,
    tags,
    lastReviewed: s.lastReviewed,
    intents,
  };
}

function trimToSentence(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastPeriod = slice.lastIndexOf('.');
  if (lastPeriod > 80) return slice.slice(0, lastPeriod + 1);
  return slice.trimEnd() + '…';
}

// ── extra entries that round out the directory ────────────────

const extraResources: Resource[] = [
  {
    id: 'extra-911',
    name: '911 — Emergency Services',
    blurb: 'For any life-threatening emergency. Tell the dispatcher your child is autistic so first responders can adapt their approach.',
    description:
      'Call 911 only when there is an immediate threat to life. When you call, tell the dispatcher your child is autistic, what behaviors they may show, and what helps them. This gives first responders a chance to adapt their tone and approach before they arrive.',
    cities: ['Online / phone — anywhere in Texas'],
    services: ['Mental Health'],
    ageGroups: ['All ages'],
    delivery: ['Virtual'],
    goodFirstStep: false,
    urgency: 'crisis',
    twentyFourSeven: true,
    phone: '911',
    phoneDial: '911',
    tags: ['24/7', 'Emergency'],
    lastReviewed: 'April 2026',
    intents: ['crisis'],
  },
  {
    id: 'extra-211',
    name: 'Texas 211 — Health & Human Services Navigator',
    blurb: 'A free statewide line that points you to local food, housing, financial, and disability programs you may not know about.',
    description:
      'Texas 211 is a free, confidential statewide service that connects you to local programs for food, housing, utility assistance, Medicaid, and disability services. Call when you need help and don\'t know who to ask. Available 24/7 in English and Spanish.',
    cities: ['Online / phone — anywhere in Texas'],
    services: ['Advocacy'],
    ageGroups: ['All ages'],
    delivery: ['Virtual'],
    goodFirstStep: true,
    urgency: 'standard',
    twentyFourSeven: true,
    phone: '211',
    phoneDial: '211',
    website: 'https://www.211texas.org',
    tags: ['Good first step', 'Spanish', '24/7'],
    lastReviewed: 'April 2026',
    intents: ['financial'],
  },
  {
    id: 'extra-arc-houston',
    name: 'The Arc of Greater Houston',
    blurb: 'Long-running disability advocacy nonprofit with respite events, IEP support, and a navigator phone line.',
    description:
      'The Arc of Greater Houston runs respite events, family days out, and an IEP advocacy program. Their navigator line can match your family with a peer mentor and walk you through Texas waiver lists.',
    cities: ['Southwest Houston'],
    services: ['Advocacy', 'Respite'],
    ageGroups: ['All ages'],
    delivery: ['In-person', 'Virtual'],
    goodFirstStep: true,
    urgency: 'standard',
    phone: '(713) 957-1600',
    phoneDial: '+17139571600',
    website: 'https://www.aogh.org',
    tags: ['Good first step'],
    lastReviewed: 'April 2026',
    intents: ['just-diagnosed', 'respite', 'financial'],
  },
  {
    id: 'extra-eci',
    name: 'Early Childhood Intervention (ECI) — Texas',
    blurb: 'Free developmental services for kids under 3 — no diagnosis or referral required.',
    description:
      'ECI provides developmental evaluations and in-home therapy for children under three regardless of income or diagnosis. If you are seeing delays, you do not need to wait for a referral — call directly.',
    cities: ['Online / phone — anywhere in Texas'],
    services: ['Diagnosis', 'Speech', 'OT'],
    ageGroups: ['Birth–5'],
    delivery: ['In-home/Mobile'],
    goodFirstStep: true,
    urgency: 'standard',
    phone: '(877) 787-8999',
    phoneDial: '+18777878999',
    website: 'https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services',
    tags: ['Good first step', 'Spanish', 'No waitlist'],
    lastReviewed: 'April 2026',
    intents: ['just-diagnosed', 'therapy'],
  },
  {
    id: 'extra-spanish-line',
    name: 'Autism Society of Texas — Línea en Español',
    blurb: 'Information y referidos en español de un equipo familiarizado con el sistema de Texas.',
    description:
      'Para familias hispanohablantes: orientación uno-a-uno en español con personal de Autism Society of Texas. Cubren preguntas de diagnóstico, terapia, escuela y ayuda financiera. Llame y pida la extensión 3.',
    cities: ['Online / phone — anywhere in Texas'],
    services: ['Advocacy'],
    ageGroups: ['All ages'],
    delivery: ['Virtual'],
    goodFirstStep: true,
    urgency: 'standard',
    phone: '(512) 479-4199 ext. 3',
    phoneDial: '+15124794199',
    website: 'https://www.texasautismsociety.org',
    tags: ['Good first step', 'Spanish'],
    lastReviewed: 'April 2026',
    intents: ['just-diagnosed', 'crisis'],
  },
  {
    id: 'extra-crisis-text',
    name: 'Crisis Text Line — Text HOME to 741741',
    blurb: 'Text-only crisis support for parents who can\'t talk on the phone.',
    description:
      'Text HOME to 741741 from anywhere in the US to reach a trained crisis counselor by text. Free, 24/7, confidential. Useful when you cannot speak out loud — for example, when your child is nearby or when speaking would escalate the situation.',
    cities: ['Online / phone — anywhere in Texas'],
    services: ['Mental Health'],
    ageGroups: ['All ages'],
    delivery: ['Virtual'],
    goodFirstStep: false,
    urgency: 'crisis',
    twentyFourSeven: true,
    phone: '741741',
    phoneDial: '741741',
    website: 'https://www.crisistextline.org',
    tags: ['24/7', 'Text-based'],
    lastReviewed: 'April 2026',
    intents: ['crisis'],
  },
  {
    id: 'extra-feed-the-children',
    name: 'Houston Food Bank — Backpack Buddy',
    blurb: 'School-based food assistance for kids — sent home Friday in a backpack so they\'re fed all weekend.',
    description:
      'For families stretched thin: ask your school if they participate in Backpack Buddy. Kids quietly receive a backpack of food on Fridays. No paperwork, no income test through the school. Many Houston-area districts participate.',
    cities: ['Southwest Houston'],
    services: ['Advocacy'],
    ageGroups: ['Birth–5', '6–12', '13–17'],
    delivery: ['In-person'],
    goodFirstStep: false,
    urgency: 'standard',
    phone: '(832) 369-9390',
    phoneDial: '+18323699390',
    website: 'https://www.houstonfoodbank.org',
    tags: ['Free program'],
    lastReviewed: 'March 2026',
    intents: ['financial'],
  },
];

export const findResources: Resource[] = [
  ...verifiedProviders.map(buildFromProvider),
  ...sensoryFriendlyPlaces.map(buildFromSensory),
  ...extraResources,
];

// ── facet meta for UI ──────────────────────────────────────────

export const intentMeta: Record<
  Intent,
  { label: string; sublabel: string; emoji: string; accent: string }
> = {
  'just-diagnosed': {
    label: 'Just got a diagnosis',
    sublabel: 'A guided starter path of first calls.',
    emoji: '🧭',
    accent: 'from-brand-navy-50 to-brand-warm-100',
  },
  therapy: {
    label: 'I need therapy services',
    sublabel: 'ABA, speech, OT, feeding — what fits.',
    emoji: '🩺',
    accent: 'from-brand-warm-100 to-brand-navy-50',
  },
  'sensory-friendly': {
    label: 'A sensory-friendly place',
    sublabel: 'Dentists, haircuts, grocery, fun.',
    emoji: '🌱',
    accent: 'from-emerald-50 to-brand-warm-100',
  },
  respite: {
    label: 'I need a break',
    sublabel: 'Respite care so you can rest.',
    emoji: '💤',
    accent: 'from-brand-plum-50 to-brand-warm-100',
  },
  financial: {
    label: 'I need financial help',
    sublabel: 'Grants, waivers, low-cost programs.',
    emoji: '💰',
    accent: 'from-brand-warm-100 to-brand-plum-50',
  },
  crisis: {
    label: 'I\'m struggling',
    sublabel: 'Parent mental health & crisis support.',
    emoji: '🆘',
    accent: 'from-red-50 to-orange-50',
  },
};

export function uniqueValues<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
