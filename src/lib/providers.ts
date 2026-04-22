// ============================================================
// CG2 — Verified Provider & Resource Directory
// Last full audit: April 2026
// Standard: Every entry is a real, verifiable organization.
// Entries with phone/website have been confirmed against 
// official sources. "Call to verify" = unknown at audit time.
// ============================================================

export type ProviderCategory =
  | 'aba-therapy'
  | 'speech-therapy'
  | 'occupational-therapy'
  | 'feeding-therapy'
  | 'diagnostic-testing'
  | 'autism-friendly-pediatrician'
  | 'parent-mental-health'
  | 'support-groups'
  | 'respite-care'
  | 'advocacy-iep'
  | 'financial-legal'
  | 'adaptive-recreation'
  | 'crisis-urgent';

export type RecommendationLevel =
  | 'great-first-call'
  | 'specialized-support'
  | 'community-resource'
  | 'backup-option';

export type ServiceType = 'in-person' | 'virtual' | 'mobile' | 'hybrid';

export interface Provider {
  id: string;
  category: ProviderCategory;
  provider_name: string;
  location: string;
  services: string[];
  age_range: string;
  insurance_notes: string;
  referral_required: boolean | 'unknown';
  waitlist_status: string;
  languages_offered: string[];
  service_type: ServiceType[];
  sensory_accommodations?: string;
  website: string;
  phone: string;
  why_it_may_help: string;
  helpful_to_know: string;
  last_verified_date: string;
  recommendation_level: RecommendationLevel;
}

export const categoryMeta: Record<
  ProviderCategory,
  { label: string; emoji: string; color: string; description: string }
> = {
  'aba-therapy': {
    label: 'ABA Therapy',
    emoji: '🧠',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Texas ABA Centers provides ABA therapy for enrolled families. Use the link below to start the intake process.',
  },
  'speech-therapy': {
    label: 'Speech Therapy',
    emoji: '💬',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Communication, language development, and social speech skills.',
  },
  'occupational-therapy': {
    label: 'Occupational Therapy',
    emoji: '🤲',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'Sensory processing, fine motor skills, and daily living tasks.',
  },
  'feeding-therapy': {
    label: 'Feeding Therapy',
    emoji: '🍽️',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    description: 'Food refusal, texture aversions, and mealtime challenges.',
  },
  'diagnostic-testing': {
    label: 'Diagnosis & Testing',
    emoji: '📋',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Formal autism evaluations and neuropsychological assessments.',
  },
  'autism-friendly-pediatrician': {
    label: 'Autism-Friendly Pediatrician',
    emoji: '👨‍⚕️',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    description: 'Primary care providers who understand and support autistic kids.',
  },
  'parent-mental-health': {
    label: 'Parent Mental Health',
    emoji: '💚',
    color: 'bg-green-50 text-green-700 border-green-200',
    description: 'Therapists and counselors who specialize in caregiver wellbeing.',
  },
  'support-groups': {
    label: 'Support Groups',
    emoji: '🤝',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Parent-to-parent connection, local and virtual.',
  },
  'respite-care': {
    label: 'Respite Care',
    emoji: '🌿',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Short-term care so caregivers can rest and recharge.',
  },
  'advocacy-iep': {
    label: 'IEP & School Advocacy',
    emoji: '📚',
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    description: 'Help navigating school meetings, IEPs, and educational rights.',
  },
  'financial-legal': {
    label: 'Financial & Legal Help',
    emoji: '📄',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Medicaid waivers, SSI, financial grants, and legal guidance.',
  },
  'adaptive-recreation': {
    label: 'Adaptive Recreation',
    emoji: '⚽',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Inclusive sports, swim, and activities designed for autistic kids.',
  },
  'crisis-urgent': {
    label: 'Crisis & Urgent Support',
    emoji: '🆘',
    color: 'bg-red-50 text-red-700 border-red-200',
    description: 'Immediate help for mental health crises, meltdowns, and emergencies.',
  },
};

export const recommendationMeta: Record<
  RecommendationLevel,
  { label: string; color: string; description: string }
> = {
  'great-first-call': {
    label: 'Great First Call',
    color: 'bg-primary/10 text-primary border-primary/20',
    description: 'Start here — these are our highest-confidence starting points.',
  },
  'specialized-support': {
    label: 'Specialized Support',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'For families with a specific, identified need.',
  },
  'community-resource': {
    label: 'Community Resource',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Peer support, local programs, and community connection.',
  },
  'backup-option': {
    label: 'Backup Option',
    color: 'bg-surface-muted text-brand-muted-600 border-surface-border',
    description: 'Worth knowing about, especially if first-tier options have waitlists.',
  },
};

export type StartHereRoute =
  | 'just-diagnosed'
  | 'need-therapy'
  | 'overwhelmed'
  | 'school-iep'
  | 'need-community';

export const startHereRoutes: {
  id: StartHereRoute;
  label: string;
  description: string;
  emoji: string;
  categories: ProviderCategory[];
  firstCallId: string;
}[] = [
  {
    id: 'just-diagnosed',
    label: 'Just got a diagnosis',
    description: "Your child was just diagnosed and you don\'t know what to do first.",
    emoji: '🔍',
    categories: ['diagnostic-testing', 'autism-friendly-pediatrician', 'aba-therapy', 'financial-legal'],
    firstCallId: 'txp2p-helpline',
  },
  {
    id: 'need-therapy',
    label: 'Need therapy services',
    description: "You're looking for ABA, speech, OT, or feeding therapy.",
    emoji: '🩺',
    categories: ['aba-therapy', 'speech-therapy', 'occupational-therapy', 'feeding-therapy'],
    firstCallId: 'texas-aba-centers',
  },
  {
    id: 'overwhelmed',
    label: 'Overwhelmed / need support',
    description: "You're stretched thin and need someone to talk to or a break.",
    emoji: '💙',
    categories: ['parent-mental-health', 'support-groups', 'respite-care', 'crisis-urgent'],
    firstCallId: 'autism-society-texas',
  },
  {
    id: 'school-iep',
    label: 'Need help with school / IEP',
    description: "You need advocacy support for your child's education plan.",
    emoji: '🏫',
    categories: ['advocacy-iep'],
    firstCallId: 'txp2p-helpline',
  },
  {
    id: 'need-community',
    label: 'Looking for community',
    description: "You want to connect with other autism families who understand.",
    emoji: '🤝',
    categories: ['support-groups', 'adaptive-recreation'],
    firstCallId: 'autism-society-texas',
  },
];

export const providers: Provider[] = [
  // ─── ABA THERAPY ──────────────────────────────────────────────────────────────

  {
    id: 'texas-aba-centers',
    category: 'aba-therapy',
    provider_name: 'Texas ABA Centers',
    location: 'Greater Houston area (multiple locations)',
    services: [
      'One-on-one ABA therapy',
      'BCBA-supervised treatment plans',
      'Parent training and caregiver coaching',
      'Behavior intervention planning',
      'Progress tracking and goal updates',
      'Insurance authorization support',
    ],
    age_range: 'Contact intake team to confirm',
    insurance_notes: 'Accepts most major insurance plans. Insurance verification handled during intake.',
    referral_required: false,
    waitlist_status: 'Contact intake team for current availability',
    languages_offered: ['English', 'Spanish — contact to verify'],
    service_type: ['in-person', 'mobile'],
    sensory_accommodations: 'Therapy environments adapted to each child\'s sensory needs',
    website: 'https://texasabacenters.com',
    phone: 'Contact via website',
    why_it_may_help: 'Texas ABA Centers is the organization behind Common Ground. If your child needs ABA therapy, starting here means your therapy team and your care navigator are already connected — no hand-offs, no gaps.',
    helpful_to_know: 'As a current or prospective Texas ABA Centers family, you have access to everything in Common Ground as part of your care relationship. Reach out to your care team or use the client portal to get started.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },

  // ─── SPEECH THERAPY ──────────────────────────────────────────────────────────

  {
    id: 'speech-motion-therapy',
    category: 'speech-therapy',
    provider_name: 'Speech & Motion Therapy',
    location: 'Southwest Houston area (Sugar Land, Stafford, Missouri City, Richmond, Rosenberg)',
    services: [
      'Speech-language therapy',
      'Occupational therapy',
      'Evaluations and ongoing therapy',
      'In-office, school-based, daycare, and home sessions available',
    ],
    age_range: 'Pediatric (contact to confirm)',
    insurance_notes: 'Call to verify insurance. Privately owned clinic.',
    referral_required: 'unknown',
    waitlist_status: 'Call to verify',
    languages_offered: ['English'],
    service_type: ['in-person', 'mobile'],
    website: 'https://speechandmotiontherapy.com',
    phone: 'See website for current contact',
    why_it_may_help: 'A privately-owned clinic convenient to Fort Bend County families. Offers both speech and OT under one roof, and is willing to provide therapy in schools, daycares, and homes — reducing transportation barriers for busy families.',
    helpful_to_know: 'Privately owned and smaller in size, which often means more consistent therapist relationships. Good option for Fort Bend County and southwest Houston families.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },
  {
    id: 'texas-childrens-speech',
    category: 'speech-therapy',
    provider_name: 'Texas Children\'s Hospital – Speech-Language Pathology',
    location: 'Houston, TX (multiple campuses)',
    services: [
      'Comprehensive speech-language evaluations',
      'Communication therapy for autism',
      'Augmentative and Alternative Communication (AAC)',
      'Language development',
      'Social communication skills',
    ],
    age_range: 'Birth – 18 years',
    insurance_notes: 'Accepts most major insurance including Texas Medicaid / CHIP. Verify your plan before scheduling.',
    referral_required: true,
    waitlist_status: 'Waitlist common — call early and ask about cancellation lists',
    languages_offered: ['English', 'Spanish', 'others — call to verify'],
    service_type: ['in-person'],
    sensory_accommodations: 'Yes — hospital-wide sensory-friendly practices and quiet rooms available',
    website: 'https://www.texaschildrens.org',
    phone: '(832) 822-1000',
    why_it_may_help: 'The largest and most comprehensive pediatric hospital system in the region. Speech therapy here is integrated with developmental pediatrics and other specialists — important if your child has complex needs alongside communication challenges.',
    helpful_to_know: 'Pediatrician referral is typically required. Waitlists can be long — call early. Ask specifically for the Developmental Pediatrics & Autism department for the most coordinated care.',
    last_verified_date: 'April 2026',
    recommendation_level: 'specialized-support',
  },

  // ─── OCCUPATIONAL THERAPY ────────────────────────────────────────────────────

  {
    id: 'daisy-kids-care-ot',
    category: 'occupational-therapy',
    provider_name: 'Daisy Kids Care – Occupational & Speech Therapy',
    location: 'Houston, TX (in-home services across the area)',
    services: [
      'In-home occupational therapy',
      'In-clinic OT and speech therapy',
      'Sensory processing treatment',
      'Fine motor skills',
      'Feeding therapy',
      'Autism-specific pediatric therapy',
      'Same-week evaluations (no waitlist stated)',
    ],
    age_range: 'Pediatric — contact to confirm',
    insurance_notes: 'Call to verify insurance. Same-week evaluations for self-pay and eligible plans.',
    referral_required: false,
    waitlist_status: 'No waitlist stated — call to verify',
    languages_offered: ['English'],
    service_type: ['in-person', 'mobile'],
    sensory_accommodations: 'Sensory-focused treatment is a core service offering',
    website: 'https://www.daisykidscare.com',
    phone: 'See website for current contact',
    why_it_may_help: 'One of very few Houston providers offering in-home OT and speech therapy with no stated waitlist and same-week evaluations. For families who cannot wait weeks or whose child does better in a familiar environment, this is a meaningful option.',
    helpful_to_know: 'Call to confirm insurance before scheduling. In-home coverage area may vary by zip code. They list autism as a primary specialty.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },
  {
    id: 'carruth-center-ot',
    category: 'occupational-therapy',
    provider_name: 'The Carruth Center – Occupational Therapy',
    location: 'Houston, TX',
    services: [
      'Sensory integration therapy',
      'Fine and gross motor skills',
      'DIR/Floortime (certified practitioner)',
      'Feeding therapy techniques',
      'Handwriting Without Tears',
      'Play-based intervention',
      'Self-regulation support',
    ],
    age_range: 'Pediatric — contact to confirm',
    insurance_notes: 'Call to verify. Privately-run clinic.',
    referral_required: 'unknown',
    waitlist_status: 'Call to verify',
    languages_offered: ['English'],
    service_type: ['in-person'],
    sensory_accommodations: 'Sensory integration is a core treatment model at this clinic',
    website: 'https://carruthcenter.org',
    phone: 'See website for current contact',
    why_it_may_help: 'A specialized OT clinic with certified DIR/Floortime practitioners — an approach that works especially well for autistic kids who are more play-responsive than instruction-responsive. Staff with deep autism-specific OT experience.',
    helpful_to_know: 'DIR/Floortime is a relationship-based model that many families find gentler than more directive approaches. Good fit if your child responds better to following their lead.',
    last_verified_date: 'April 2026',
    recommendation_level: 'specialized-support',
  },

  // ─── FEEDING THERAPY ─────────────────────────────────────────────────────────

  {
    id: 'daisy-kids-feeding',
    category: 'feeding-therapy',
    provider_name: 'Daisy Kids Care – Feeding Therapy',
    location: 'Houston, TX (clinic and in-home)',
    services: [
      'Feeding evaluations',
      'Food refusal and texture aversion treatment',
      'Mealtime anxiety reduction',
      'Gradual food introduction',
      'In-home feeding therapy',
    ],
    age_range: 'Pediatric — contact to confirm',
    insurance_notes: 'Call to verify insurance. Same-week evaluation stated.',
    referral_required: false,
    waitlist_status: 'No waitlist stated — call to verify current availability',
    languages_offered: ['English'],
    service_type: ['in-person', 'mobile'],
    website: 'https://www.daisykidscare.com/therapy-clinic/feeding-therapy/',
    phone: 'See website for current contact',
    why_it_may_help: 'If mealtimes have become a major source of stress or your child has a very restricted diet, feeding therapy may be the highest-leverage support you can add right now. Daisy Kids Care specializes in autism-related feeding challenges and offers in-home treatment — which can be more effective for many kids.',
    helpful_to_know: 'Feeding therapy is often underutilized because parents assume picky eating is just behavioral. For autistic kids, it is often sensory-driven and highly treatable with the right approach.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },
  {
    id: 'texas-childrens-feeding',
    category: 'feeding-therapy',
    provider_name: 'Texas Children\'s Hospital – Feeding Clinic (West Campus)',
    location: 'West Houston, TX',
    services: [
      'Comprehensive feeding and swallowing evaluations',
      'Feeding disorder treatment (premature infants to adolescents)',
      'Collaboration with gastroenterology',
      'Video fluoroscopic swallow studies',
      'Autism-related feeding challenges',
    ],
    age_range: 'Premature infants – adolescents',
    insurance_notes: 'Accepts major insurance including Medicaid/CHIP. Verify your plan.',
    referral_required: true,
    waitlist_status: 'Waitlist likely — call early',
    languages_offered: ['English', 'Spanish — verify'],
    service_type: ['in-person'],
    sensory_accommodations: 'Sensory-informed approach; call to discuss specific accommodations',
    website: 'https://www.feedingmatters.org/providers/texas-childrens-hospital-west-campus/',
    phone: '(832) 822-1000',
    why_it_may_help: 'Best for complex or medically-involved feeding issues — especially if your child has both autism and a medical diagnosis affecting swallowing or growth. The collaboration with gastroenterology is especially important for these cases.',
    helpful_to_know: 'Referral from pediatrician usually required. Multidisciplinary team approach is the biggest advantage here for complex cases.',
    last_verified_date: 'April 2026',
    recommendation_level: 'specialized-support',
  },

  // ─── DIAGNOSTIC TESTING ──────────────────────────────────────────────────────

  {
    id: 'uhcl-psychological-services',
    category: 'diagnostic-testing',
    provider_name: 'UHCL Psychological Services Clinic – Autism Assessment',
    location: 'University of Houston – Clear Lake, Houston, TX',
    services: [
      'Comprehensive autism evaluations (children, teens, adults)',
      'Formal diagnosis and functioning levels across multiple domains',
      'Evidence-based autism assessment',
      'Intervention recommendations',
    ],
    age_range: 'Children, teens, and adults',
    insurance_notes: 'University-run clinic — fees typically on a reduced/sliding-scale basis. Call to confirm current cost structure.',
    referral_required: false,
    waitlist_status: 'Call to verify — university clinics often have semester-based scheduling',
    languages_offered: ['English — call to ask about bilingual evaluators'],
    service_type: ['in-person'],
    website: 'https://www.uhcl.edu/autism-center/autism-assessment-services',
    phone: '(281) 283-3330',
    why_it_may_help: 'For families who cannot afford a private neuropsychological evaluation (which can cost $1,500–$4,000+), UHCL\'s clinic provides comprehensive autism assessments at a reduced cost under licensed faculty supervision. This is one of the most accessible formal evaluation options in the Houston area.',
    helpful_to_know: 'Evaluations are conducted by graduate students under licensed faculty supervision — the same model used at most university clinics. The result is a clinically valid, formally recognized diagnosis. Contact email: uhclpsc@uhcl.edu.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },
  {
    id: 'west-houston-psychology',
    category: 'diagnostic-testing',
    provider_name: 'West Houston Psychology – Autism Evaluation',
    location: 'West Houston, TX',
    services: [
      'Autism and ADHD evaluations',
      'Neurodivergence-focused assessments',
      'Feedback session with diagnosis and recommendations',
      'Strengths-based evaluation approach',
    ],
    age_range: 'Children and adults',
    insurance_notes: 'Call to verify insurance or self-pay options.',
    referral_required: false,
    waitlist_status: 'Call to verify',
    languages_offered: ['English'],
    service_type: ['in-person'],
    website: 'https://www.westhoustonpsychology.com/autism-evaluation',
    phone: 'See website for current contact',
    why_it_may_help: 'A practice that specifically focuses on neurodivergence — not a general psychology office doing occasional evaluations. Their strengths-based approach means the report is actionable, not just a list of deficits.',
    helpful_to_know: 'Parents are involved throughout the process. Feedback session is included to walk through results and next steps — something not every evaluator offers.',
    last_verified_date: 'April 2026',
    recommendation_level: 'specialized-support',
  },

  // ─── AUTISM-FRIENDLY PEDIATRICIAN ────────────────────────────────────────────

  {
    id: 'hummingbird-pediatrics',
    category: 'autism-friendly-pediatrician',
    provider_name: 'Hummingbird Pediatrics',
    location: 'Houston (Greenspoint area) & Baytown, TX',
    services: [
      'Autism screening and early evaluation',
      'Ongoing medical care for autistic children',
      'Co-occurring condition management',
      'Referral coordination (speech, OT, ABA, behavioral services)',
      'Parent guidance and treatment planning support',
    ],
    age_range: 'Children (birth – 18 years)',
    insurance_notes: 'Call to verify insurance acceptance',
    referral_required: false,
    waitlist_status: 'Call to verify as a new patient',
    languages_offered: ['English', 'Spanish — verify'],
    service_type: ['in-person'],
    sensory_accommodations: 'Stated as providing compassionate, neurodevelopmentally-aware care — call to discuss specific accommodations',
    website: 'https://www.hummingbirdpediatrics.com',
    phone: 'See website for current contact',
    why_it_may_help: 'Finding a pediatrician who understands autism is often harder than finding a therapist. Hummingbird Pediatrics specifically lists autism screening and ongoing autism care as a core service — not a referral-out. They coordinate with the rest of your child\'s team, which reduces the burden on parents.',
    helpful_to_know: 'Serves Greater Greenspoint (north Houston area) and Baytown. Two locations are an advantage for families on the east side of the metro. Call ahead about wait times for new patients.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },
  {
    id: 'texas-childrens-developmental-pediatrics',
    category: 'autism-friendly-pediatrician',
    provider_name: 'Texas Children\'s Hospital – Developmental Pediatrics & Autism',
    location: 'Houston, TX (multiple campuses)',
    services: [
      'Developmental evaluations',
      'Autism diagnosis and management',
      'Behavioral health coordination',
      'Respite care referrals',
      'Multidisciplinary team care',
    ],
    age_range: 'Birth – 18 years',
    insurance_notes: 'Accepts most major insurance including Texas Medicaid/CHIP',
    referral_required: true,
    waitlist_status: 'Waitlist for developmental pediatrics can be 6–12 months — get on it early',
    languages_offered: ['English', 'Spanish', 'others — call to verify'],
    service_type: ['in-person'],
    sensory_accommodations: 'Yes — hospital-wide sensory-informed practices',
    website: 'https://www.texaschildrens.org/departments/developmental-pediatrics-and-autism',
    phone: '(832) 822-1000',
    why_it_may_help: 'The gold standard for complex developmental cases in Houston. If your child has multiple diagnoses or needs a team of specialists coordinating care, Texas Children\'s Developmental Pediatrics is the right place.',
    helpful_to_know: 'The waitlist for developmental pediatrics is notoriously long in Texas. Call now even if your child is doing well — you may need this specialist later, and the clock starts when you call.',
    last_verified_date: 'April 2026',
    recommendation_level: 'specialized-support',
  },

  // ─── PARENT MENTAL HEALTH ────────────────────────────────────────────────────

  {
    id: 'psychology-today-houston-caregiver',
    category: 'parent-mental-health',
    provider_name: 'Psychology Today Therapist Directory – Houston',
    location: 'Houston metro (in-person and virtual)',
    services: [
      'Individual therapy for parents and caregivers',
      'Caregiver mental health and burnout support',
      'Virtual and in-person options',
    ],
    age_range: 'Adults',
    insurance_notes: 'Varies by therapist — filter by insurance on the directory',
    referral_required: false,
    waitlist_status: 'Varies by therapist — many have current openings',
    languages_offered: ['English', 'Spanish', 'others — filter in directory'],
    service_type: ['in-person', 'virtual'],
    website: 'https://www.psychologytoday.com/us/groups/tx/houston?category=autism',
    phone: 'Varies by therapist',
    why_it_may_help: 'Caring for an autistic child is one of the most emotionally demanding jobs there is, and parents deserve their own support. Use Psychology Today\'s directory to find Houston-area therapists who specialize in supporting autism caregivers — filtered by your insurance and location.',
    helpful_to_know: 'Filter by "insurance accepted," "telehealth available," and "autism" to narrow results quickly. Many therapists have weekend and evening availability. This is for your mental health as a caregiver — separate from your child\'s therapy services.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },

  // ─── SUPPORT GROUPS ──────────────────────────────────────────────────────────

  {
    id: 'autism-society-texas',
    category: 'support-groups',
    provider_name: 'Autism Society of Texas – Connection Groups',
    location: 'Statewide (virtual and in-person across Houston)',
    services: [
      'Southeast Houston Autism Community Group (in-person)',
      'Houston Autism Girls Group (in-person)',
      'Houston Parent/Caregiver Online Connection Group (virtual)',
      'Navigating Autism program (free, personalized guidance)',
      'Spanish-language parent support',
      'Level 3 support group (high-support needs)',
      'Adult autism groups',
    ],
    age_range: 'All ages (groups organized by need)',
    insurance_notes: 'All groups are free',
    referral_required: false,
    waitlist_status: 'Open — check calendar for meeting times',
    languages_offered: ['English', 'Spanish'],
    service_type: ['in-person', 'virtual'],
    website: 'https://www.texasautismsociety.org/support/',
    phone: '(512) 479-4199 ext. 2 (English) / ext. 3 (Spanish)',
    why_it_may_help: 'The most comprehensive statewide autism support network in Texas. Whether you want an in-person group in Houston, a virtual meeting, a Spanish-language group, or personalized one-on-one navigation help, this is the right first call for connection and community.',
    helpful_to_know: 'The free "Navigating Autism" program is a standout — you call and get individualized guidance, not just a website link. Houston has both in-person and online groups. Email support@texasautismsociety.org to be connected to the right group.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },
  {
    id: 'feat-houston',
    category: 'support-groups',
    provider_name: 'FEAT Houston – Families for Effective Autism Treatment',
    location: 'Houston, TX (Clear Lake / Bay Area)',
    services: [
      'Autism provider directory (Houston-specific)',
      'Parent community and networking',
      'School and day program resource listings',
      'Adaptive recreation provider listings',
      'Regular family events',
    ],
    age_range: 'All ages',
    insurance_notes: 'Free resource',
    referral_required: false,
    waitlist_status: 'N/A — open resource directory and community',
    languages_offered: ['English'],
    service_type: ['in-person', 'virtual'],
    website: 'https://www.feathouston.org',
    phone: 'See website for current contact',
    why_it_may_help: 'FEAT Houston is a parent-led community organization in the Clear Lake / Bay Area that connects autism families to events, day programs, schools, and recreational resources. A good place to find local families and community programs.',
    helpful_to_know: 'Based in the Clear Lake / Bay Area — especially relevant for southeast Houston, Webster, League City, and Pearland families. Great for community events and connecting with other parents. For therapy services, contact your Texas ABA Centers care team.',
    last_verified_date: 'April 2026',
    recommendation_level: 'community-resource',
  },

  // ─── RESPITE CARE ─────────────────────────────────────────────────────────────

  {
    id: 'easter-seals-houston-respite',
    category: 'respite-care',
    provider_name: 'Easter Seals Greater Houston – Respite Services',
    location: 'Greater Houston area',
    services: [
      'In-Home Voucher program (parents choose their own trusted provider)',
      'Caregiver relief and breaks',
      'Lifespan Respite support',
    ],
    age_range: 'Children with disabilities (contact for full eligibility)',
    insurance_notes: 'Funded through The George Foundation and United Way — call to confirm costs and eligibility',
    referral_required: 'unknown',
    waitlist_status: 'Call to verify',
    languages_offered: ['English'],
    service_type: ['mobile'],
    website: 'https://eastersealshouston.org/respite-services/',
    phone: '(713) 838-9050 ext. 307',
    why_it_may_help: 'Gives parents the ability to choose a trusted person from their own network — not a stranger assigned by an agency. This model dramatically reduces the anxiety many autism parents feel about leaving their child with someone new.',
    helpful_to_know: 'Email respite@eastersealshouston.org if you prefer written communication. Funding availability fluctuates — call sooner rather than later. Easter Seals is a nationally recognized nonprofit with a long-standing reputation.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },
  {
    id: 'texas-childrens-respite',
    category: 'respite-care',
    provider_name: 'Texas Children\'s Hospital – Respite Care Referrals',
    location: 'Houston, TX',
    services: [
      'Respite referrals to Houston-area providers',
      'Arc of Greater Houston connection',
      'Family day out events',
      'Parents\' night out events',
    ],
    age_range: 'Children with disabilities',
    insurance_notes: 'Varies by referred provider',
    referral_required: false,
    waitlist_status: 'Varies by opportunity — call to ask',
    languages_offered: ['English', 'Spanish — verify'],
    service_type: ['in-person'],
    website: 'https://www.texaschildrens.org/departments/developmental-pediatrics-and-autism/respite-care',
    phone: '(713) 957-1600 ext. 119 (Arc of Greater Houston, via Texas Children\'s referral)',
    why_it_may_help: 'Texas Children\'s doesn\'t just see patients — they actively connect families to respite opportunities in Houston including family nights out and day events. For families already in the Texas Children\'s system, this is an easy next step.',
    helpful_to_know: 'Arc of Greater Houston is one of the main respite partners listed on this page. Opportunities vary based on your child\'s diagnosis, age, and abilities. Call to ask what is currently available.',
    last_verified_date: 'April 2026',
    recommendation_level: 'community-resource',
  },
  {
    id: 'angels-around-homecare-respite',
    category: 'respite-care',
    provider_name: 'Angels Around Home Care – Pediatric Respite',
    location: 'Houston, TX (9601 Jones Road, Suite 150)',
    services: [
      'Respite care for children with disabilities',
      'Autism-specific respite care',
      'In-home support',
    ],
    age_range: 'Children with disabilities',
    insurance_notes: 'Call to verify',
    referral_required: 'unknown',
    waitlist_status: 'Call to verify',
    languages_offered: ['English'],
    service_type: ['mobile'],
    website: 'https://www.angelsaroundhomecare.com/respite-care/',
    phone: '(832) 869-4110',
    why_it_may_help: 'A Houston-based home care agency that specifically lists autistic children as a population they serve for respite. If other respite providers have long waits, this is a direct private option.',
    helpful_to_know: 'Located in northwest Houston near Jones Road. Call to confirm current availability and pricing before assuming anything.',
    last_verified_date: 'April 2026',
    recommendation_level: 'backup-option',
  },

  // ─── ADVOCACY / IEP ───────────────────────────────────────────────────────────

  {
    id: 'txp2p-helpline',
    category: 'advocacy-iep',
    provider_name: 'Texas Parent to Parent (TxP2P)',
    location: 'Statewide (helpline available everywhere in Texas)',
    services: [
      'Parent-to-parent peer support and matching',
      'IEP preparation and educational advocacy',
      'Care coordination support',
      'Family-to-family information sharing',
      'Care Notebook (medical/educational organizer)',
      'Medical Home Toolkit',
      'Disability resource navigation',
    ],
    age_range: 'Children and adults with disabilities',
    insurance_notes: 'Free service — no insurance required',
    referral_required: false,
    waitlist_status: 'No waitlist — call directly',
    languages_offered: ['English', 'Spanish — call ext. or ask on first call'],
    service_type: ['virtual', 'in-person'],
    website: 'https://www.txp2p.org',
    phone: '(866) 896-6001 or (512) 458-8600',
    why_it_may_help: 'When you don\'t know where to start — call here. Every staff member is a parent of a child with a disability or special health care need. They understand what it actually feels like to navigate this system, and they know Texas resources better than almost anyone else.',
    helpful_to_know: 'This is one of the most trusted, parent-run organizations in Texas disability services. The peer matching program connects you to a parent who has already been through a similar situation — often the most valuable conversation you can have.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },
  {
    id: 'navigate-life-texas',
    category: 'advocacy-iep',
    provider_name: 'Navigate Life Texas',
    location: 'Statewide (online resource)',
    services: [
      'Special education rights information (plain language)',
      'IEP and ARD process guides',
      '504 accommodation explanations',
      'Referrals to Partners Resource Network (free advocacy help)',
      'Texas disability service navigation',
    ],
    age_range: 'Children and adults with disabilities',
    insurance_notes: 'Free online resource',
    referral_required: false,
    waitlist_status: 'N/A — available immediately online',
    languages_offered: ['English', 'Spanish'],
    service_type: ['virtual'],
    website: 'https://www.navigatelifetexas.org',
    phone: 'See website for current contact',
    why_it_may_help: 'Before any IEP or ARD meeting, spend 20 minutes on this website. It explains your legal rights in plain language — not legalese — and tells you exactly what you are entitled to ask for. Knowledge is your best advocacy tool.',
    helpful_to_know: 'Recommends Partners Resource Network for free one-on-one IEP help. Partners Resource Network provides in-person and online training and can attend meetings with you at no cost. Always a good idea to bring a support person to your first IEP.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },

  // ─── FINANCIAL & LEGAL ────────────────────────────────────────────────────────

  {
    id: 'hope-for-three-financial',
    category: 'financial-legal',
    provider_name: 'Hope For Three – Family Assistance Program',
    location: 'Fort Bend County, TX (Sugar Land)',
    services: [
      'Financial assistance up to $3,000/year for autism-related services',
      'Quick Assist: one-time $500 emergency grant (3–5 business day turnaround)',
      'Swim safety lesson funding',
      'Therapy, medical, and service funding',
      'Legal guardianship fee assistance',
      'Caregiver Empowerment Sessions',
      'Community resource referrals',
    ],
    age_range: 'All ages — Fort Bend County residents',
    insurance_notes: 'No insurance required — grant-based assistance',
    referral_required: false,
    waitlist_status: 'Application reviewed within two weeks',
    languages_offered: ['English'],
    service_type: ['in-person', 'virtual'],
    website: 'https://hopeforthree.org',
    phone: '(281) 245-0640',
    why_it_may_help: 'If money is the barrier between your child and services they need, Hope For Three exists to help close that gap. The Quick Assist program can get $500 to your provider within 3–5 business days — faster than most other grant programs.',
    helpful_to_know: 'Requires Fort Bend County residency (Sugar Land, Missouri City, Pearland, Richmond, Rosenberg, Stafford, and surrounding areas). You must attend at least two Caregiver Empowerment Sessions within 60 days of receiving an award. Proof of diagnosis and residency required. Business hours: Mon–Fri 9 AM–5 PM.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },
  {
    id: 'texas-medicaid-waiver',
    category: 'financial-legal',
    provider_name: 'Texas Medicaid Waiver Interest Lists – HHSC',
    location: 'Statewide (Texas Health and Human Services Commission)',
    services: [
      'HCS Waiver (Home and Community-based Services)',
      'CLASS Waiver (developmental disabilities)',
      'MDCP Waiver (medically fragile children under 20)',
      'TxHmL Waiver (Texas Home Living)',
      'STAR Kids managed care for children with disabilities',
      'Services including: respite, OT/PT/speech therapy, personal assistance, adaptive aids, home modifications',
    ],
    age_range: 'Children and adults with disabilities (varies by waiver)',
    insurance_notes: 'Medicaid-based — parent income generally not counted for child eligibility. Apply even if you think you don\'t qualify.',
    referral_required: false,
    waitlist_status: 'Waitlists are years long — add your child NOW regardless of current needs',
    languages_offered: ['English', 'Spanish'],
    service_type: ['in-person', 'virtual'],
    website: 'https://www.navigatelifetexas.org/en/insurance-financial-help/texas-medicaid-waiver-programs-for-children-with-disabilities',
    phone: '(877) 438-5658 (Texas Interest List)',
    why_it_may_help: 'Texas Medicaid waivers cover services that private insurance almost never pays for — including respite care, adaptive equipment, personal assistance, and home modifications. The catch: waitlists are years long. The only way to get services eventually is to get on the list today.',
    helpful_to_know: 'Call 1-877-438-5658 to add your child to interest lists. Apply to every list your child may qualify for — you can decline services later if you don\'t need them. Your LIDDA (Local Intellectual and Developmental Disability Authority) can help you apply. Arc of Texas also offers free guidance: thearcoftexas.org.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },

  // ─── ADAPTIVE RECREATION ─────────────────────────────────────────────────────

  {
    id: 'ymca-adaptive-houston',
    category: 'adaptive-recreation',
    provider_name: 'YMCA of Greater Houston – Adaptive Sports Programs',
    location: 'Multiple Houston locations (Humble, northwest Houston, Kingwood)',
    services: [
      'Miracle League Baseball',
      'Adaptive Basketball',
      'Adaptive Swimming',
      'Adaptive Soccer',
      'Buddy system during games',
    ],
    age_range: 'Ages 4+ (Recreational Minors: 4–9, Majors: 10+, Competitive: 12+)',
    insurance_notes: 'Membership-based — sliding scale available. Call for fee assistance.',
    referral_required: false,
    waitlist_status: 'Varies by season and location — call to register',
    languages_offered: ['English', 'Spanish — verify by location'],
    service_type: ['in-person'],
    sensory_accommodations: 'Programs designed for accessibility — call to discuss specific sensory needs',
    website: 'https://ymcahouston.org/programs/community/adaptive-programs',
    phone: 'See website for location-specific contact',
    why_it_may_help: 'Sports participation has a proven impact on social skills, regulation, and confidence in autistic kids — and it gives them joy. YMCA\'s adaptive programs pair each athlete with a buddy and use a no-barrier environment designed for all ability levels.',
    helpful_to_know: 'Three main adaptive facilities: Insperity Complex in Humble, Mabee Complex in northwest Houston (77095), and Lake Houston Family YMCA in Kingwood. Seasons vary — contact early to register before spots fill.',
    last_verified_date: 'April 2026',
    recommendation_level: 'community-resource',
  },
  {
    id: 'texas-swim-academy-adaptive',
    category: 'adaptive-recreation',
    provider_name: 'Texas Swim Academy – Adaptive Aquatics',
    location: 'Greater Houston area',
    services: [
      'Autism-specific swim instruction',
      'Life-saving water safety skills',
      'Instructors trained in autism swim communication',
      'Calm, patient, sensory-aware environment',
      'Hope For Three scholarship funding available',
    ],
    age_range: 'All ages',
    insurance_notes: 'Private pay — Hope For Three financial assistance available for Fort Bend County families',
    referral_required: false,
    waitlist_status: 'Call to verify current openings',
    languages_offered: ['English'],
    service_type: ['in-person'],
    sensory_accommodations: 'Environment designed for sensory sensitivity — calm, patient, individualized instruction',
    website: 'https://texasswimacademy.com/the-need-for-adaptive-aquatics/',
    phone: 'See website for current contact',
    why_it_may_help: 'Drowning is the leading cause of death for autistic children. Water safety is not just recreation — it\'s safety. Texas Swim Academy trains instructors specifically to work with autistic swimmers, using communication approaches that match how autistic kids learn best.',
    helpful_to_know: 'Hope For Three can fund swim lessons for eligible Fort Bend County families — combine these two resources if cost is a barrier. Nearly 48% of autistic children attempt to wander, and accidental drowning accounts for 91% of elopement-related deaths under 14.',
    last_verified_date: 'April 2026',
    recommendation_level: 'specialized-support',
  },

  // ─── CRISIS & URGENT ─────────────────────────────────────────────────────────

  {
    id: '988-crisis-lifeline',
    category: 'crisis-urgent',
    provider_name: '988 Suicide & Crisis Lifeline',
    location: 'Nationwide — available 24/7 in Texas',
    services: [
      '24/7 crisis support by phone, text, or chat',
      'Deaf and hard-of-hearing access',
      'Spanish language support',
      'Autism-informed crisis support (trained staff)',
      'Safety planning assistance',
    ],
    age_range: 'All ages',
    insurance_notes: 'Free — no insurance required',
    referral_required: false,
    waitlist_status: 'No wait — call or text 988 anytime',
    languages_offered: ['English', 'Spanish', 'ASL/Video relay available'],
    service_type: ['virtual'],
    website: 'https://988lifeline.org',
    phone: '988 (call or text)',
    why_it_may_help: 'If you or your child is in emotional crisis — not just stressed, but genuinely unsafe — call or text 988. Caregivers experiencing crisis (breakdown, suicidal thoughts, violent ideation) should call immediately. There is no shame in calling. This line exists for exactly these moments.',
    helpful_to_know: 'Autism-specific crisis guidance is published for 988 staff. If your child is having a severe meltdown that you cannot safely manage, and 911 does not feel appropriate, 988 can help you find de-escalation strategies and local resources. You can also call just for yourself.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },
  {
    id: 'harris-center-crisis',
    category: 'crisis-urgent',
    provider_name: 'The Harris Center for Mental Health – Crisis Services',
    location: 'Harris County, TX (Houston)',
    services: [
      '24/7 crisis hotline',
      'Mobile crisis outreach teams',
      'Crisis stabilization services',
      'Mental health emergency support',
    ],
    age_range: 'All ages',
    insurance_notes: 'Services available regardless of ability to pay',
    referral_required: false,
    waitlist_status: 'No wait — 24/7 crisis line',
    languages_offered: ['English', 'Spanish'],
    service_type: ['in-person', 'mobile', 'virtual'],
    website: 'https://www.theharriscenter.org',
    phone: '(713) 970-7000',
    why_it_may_help: 'The primary mental health crisis authority for Harris County. If you are in Houston and facing a psychiatric emergency that is not life-threatening (so not a 911 situation), the Harris Center can dispatch a mobile crisis team — which is safer and more appropriate for autistic individuals than a police response.',
    helpful_to_know: 'Mobile crisis teams are specifically trained for mental health situations. If your autistic child is in a severe crisis and you are concerned about how first responders would interact with them, calling the Harris Center first can result in a more appropriate response.',
    last_verified_date: 'April 2026',
    recommendation_level: 'great-first-call',
  },
];

export const verifiedProviders = providers;
