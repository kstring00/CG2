export type JourneyStageId =
  | 'pre-diagnosis'
  | 'just-diagnosed'
  | 'starting-therapy'
  | 'school-transition'
  | 'family-sustainability';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  tags: string[];
  ageRanges: string[];
  readTime: string;
  isFeatured: boolean;
  journeyStages: JourneyStageId[];
  whyNow: string;
  whoItsFor: string;
  question: string;
  action: string;
  reviewedBy: string;
  lastUpdated: string;
  isDemo: boolean;
  url?: string;
}

export type ResourceCategory =
  | 'understanding-autism'
  | 'therapy-options'
  | 'daily-life'
  | 'education-iep'
  | 'caregiver-wellness'
  | 'community';

export interface SupportProvider {
  id: string;
  name: string;
  type: 'therapist' | 'support-group' | 'hotline' | 'respite' | 'advocacy';
  specialty: string;
  description: string;
  fit: string;
  payment: string;
  accessNotes: string;
  urgency: string;
  location: string;
  phone?: string;
  website?: string;
  meetingSchedule?: string;
  acceptsInsurance: boolean;
  rating: number;
  verification: string;
  lastReviewed: string;
  journeyStages: JourneyStageId[];
  isDemo: boolean;
}

export interface GuidedStep {
  id: JourneyStageId;
  phase: string;
  timeframe: string;
  milestone: string;
  focus: string;
  title: string;
  description: string;
  reassurance: string;
  whatMattersNow: string[];
  whatCanWait: string[];
  checklist: string[];
  supportEscalation: string[];
  supportAction: string;
  resources: string[];
  reviewedBy: string;
  lastUpdated: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  type: 'local' | 'online' | 'event';
  description: string;
  memberCount: number;
  meetingSchedule: string;
  location: string;
  audience: string;
  moderation: string;
  faithStyle: 'general' | 'faith-friendly' | 'faith-based';
  lastReviewed: string;
  isDemo: boolean;
}

export type DiagnosisStage = 'new' | 'ongoing' | 'advanced';
export type Struggle = 'behavior' | 'communication' | 'school' | 'burnout' | 'isolation' | 'insurance';
export type ConnectionPreference = 'text' | 'call' | 'group';
export type SupportStyle = 'faith-based' | 'general';

export interface ParentProfile {
  id: string;
  displayName: string;
  avatar: string;
  childAgeRange: string;
  diagnosisStage: DiagnosisStage;
  struggles: Struggle[];
  connectionPreference: ConnectionPreference[];
  supportStyle: SupportStyle;
  bio: string;
  matchScore: number;
  matchReasons: string[];
  joinedDate: string;
  sharedInfo: string;
  keptPrivate: string;
  nextStepAfterMatch: string;
  isDemo: boolean;
}

export interface PeerGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  meetingSchedule: string;
  format: 'virtual' | 'in-person' | 'hybrid';
  moderator: string;
  tags: string[];
  level: 'light' | 'guided' | 'group';
  audience: string;
  moderation: string;
  faithStyle: 'general' | 'faith-friendly' | 'faith-based';
  afterJoin: string;
  isDemo: boolean;
}

export interface ConversationPrompt {
  id: string;
  text: string;
  category: 'icebreaker' | 'reflection' | 'encouragement';
}

export const stageMeta: Record<JourneyStageId, { label: string; shortLabel: string }> = {
  'pre-diagnosis': { label: 'Something Feels Off', shortLabel: 'Pre-Diagnosis' },
  'just-diagnosed': { label: 'Just Diagnosed', shortLabel: 'Diagnosis' },
  'starting-therapy': { label: 'Starting Therapy', shortLabel: 'Therapy' },
  'school-transition': { label: 'School Transition', shortLabel: 'School' },
  'family-sustainability': { label: 'Family Sustainability', shortLabel: 'Stability' },
};

export const categoryMeta: Record<
  ResourceCategory,
  { label: string; emoji: string; color: string }
> = {
  'understanding-autism': {
    label: 'Understanding Autism',
    emoji: '🧩',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'therapy-options': {
    label: 'Therapy Options',
    emoji: '🩺',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  'daily-life': {
    label: 'Daily Life',
    emoji: '🏠',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  'education-iep': {
    label: 'Education & IEP',
    emoji: '📚',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  'caregiver-wellness': {
    label: 'Caregiver Wellness',
    emoji: '💚',
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  community: {
    label: 'Community',
    emoji: '🤝',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
  },
};

export const resources: Resource[] = [
  // ─── Real External Resources ────────────────────────────────────────────────

  // Understanding Autism
  {
    id: 'r-cdc-milestones',
    title: 'CDC Learn the Signs. Act Early.',
    description:
      'Free developmental milestone tracker and screening information from the CDC. Covers birth through 5 years with a free app, activity guides, and Spanish-language materials. Helps families understand typical development and recognize early signs of autism.',
    category: 'understanding-autism',
    tags: ['early signs', 'milestones', 'screening', 'newborn', 'toddler'],
    ageRanges: ['0-2', '2-5'],
    readTime: '10 min',
    isFeatured: true,
    journeyStages: ['pre-diagnosis', 'just-diagnosed'],
    whyNow: 'Early identification is the single most powerful factor in long-term outcomes. If you have any developmental concerns, this is where to start.',
    whoItsFor: 'Parents of children 0–5 who want to track milestones or understand what developmental screening means.',
    question: 'How do I know if my child\u2019s development is on track?',
    action: 'Download the free CDC Milestone Tracker app or print the milestone checklist for your child\u2019s age.',
    reviewedBy: 'Centers for Disease Control and Prevention (CDC)',
    lastUpdated: 'March 2026',
    isDemo: false,
    url: 'https://www.cdc.gov/autism/about/information-for-families.html',
  },
  {
    id: 'r-autism-speaks-100day',
    title: 'Autism Speaks 100 Day Kit',
    description:
      'A week-by-week guide designed specifically for families in the first 100 days after an autism diagnosis. Covers evaluations, therapy options, school rights, family adjustment, insurance basics, and a full glossary of terms. Available for young children and a separate edition for school-age children.',
    category: 'understanding-autism',
    tags: ['newly diagnosed', '100 days', 'what to do first', 'toolkit'],
    ageRanges: ['0-2', '2-5', '6-12'],
    readTime: '45 min',
    isFeatured: true,
    journeyStages: ['just-diagnosed', 'starting-therapy'],
    whyNow: 'The first 100 days after diagnosis feel overwhelming. This kit gives families a clear, week-by-week structure so nothing important falls through the cracks.',
    whoItsFor: 'Parents who just received a diagnosis and don\u2019t know where to start.',
    question: 'My child was just diagnosed. What do I actually do first?',
    action: 'Download the free kit for your child\u2019s age group and work through it one section at a time.',
    reviewedBy: 'Autism Speaks',
    lastUpdated: 'January 2026',
    isDemo: false,
    url: 'https://www.autismspeaks.org/tool-kit/100-day-kit-young-children',
  },
  {
    id: 'r-autism-speaks-parents-guide',
    title: 'Autism Speaks Parent\u2019s Guide to Autism',
    description:
      'A comprehensive free download from Autism Speaks covering how to respond to an autism diagnosis, building your support network, self-care for parents, navigating the medical system, and planning for the future. Written in plain language for parents, not clinicians.',
    category: 'understanding-autism',
    tags: ['diagnosis', 'parent guide', 'support network', 'self-care', 'planning'],
    ageRanges: ['0-2', '2-5', '6-12', '13-17'],
    readTime: '30 min',
    isFeatured: false,
    journeyStages: ['just-diagnosed', 'starting-therapy', 'family-sustainability'],
    whyNow: 'Many parents feel alone after diagnosis. This guide helps you build the full picture of what support looks like \u2014 for your child and for you.',
    whoItsFor: 'Parents at any stage who want a trusted, comprehensive overview of autism and how to navigate it.',
    question: 'Where can I find a reliable, start-to-finish guide written for parents?',
    action: 'Download the free guide and share it with your co-parent, family members, or anyone who needs to understand your child\u2019s diagnosis.',
    reviewedBy: 'Autism Speaks',
    lastUpdated: 'January 2026',
    isDemo: false,
    url: 'https://www.autismspeaks.org/tool-kit/parents-guide-autism',
  },
  {
    id: 'r-ari-advice-parents',
    title: 'Autism Research Institute \u2014 Advice for Parents',
    description:
      'Evidence-based guidance from the Autism Research Institute covering treatment approaches, communication strategies, and what the research says about interventions. ARI has been publishing peer-reviewed autism research since 1967 and is one of the most trusted independent sources.',
    category: 'understanding-autism',
    tags: ['evidence-based', 'research', 'treatment overview', 'science'],
    ageRanges: ['2-5', '6-12', '13-17'],
    readTime: '15 min',
    isFeatured: false,
    journeyStages: ['just-diagnosed', 'starting-therapy'],
    whyNow: 'There is a lot of conflicting information online about autism. ARI helps you understand what treatments are actually backed by research.',
    whoItsFor: 'Parents who want to evaluate treatment options critically and understand what the science says.',
    question: 'How do I know which treatments are actually supported by research?',
    action: 'Read the evidence overview to understand how ABA, communication supports, and other approaches are evaluated.',
    reviewedBy: 'Autism Research Institute',
    lastUpdated: 'February 2026',
    isDemo: false,
    url: 'https://autism.org/advice-for-parents/',
  },

  // Therapy Education
  {
    id: 'r-afirm-modules',
    title: 'AFIRM Modules \u2014 Understanding Evidence-Based Practices',
    description:
      'Free, university-backed online modules from UNC\u2019s Frank Porter Graham Child Development Institute that explain every evidence-based autism intervention \u2014 including ABA, discrete trial training, naturalistic teaching, and social skills supports. Developed by researchers, written for parents and educators. Covers birth through age 22.',
    category: 'therapy-options',
    tags: ['ABA', 'evidence-based', 'therapy education', 'DTT', 'naturalistic teaching'],
    ageRanges: ['0-2', '2-5', '6-12', '13-17'],
    readTime: '20 min per module',
    isFeatured: true,
    journeyStages: ['starting-therapy', 'school-transition'],
    whyNow: 'When your child starts therapy, understanding what each technique involves helps you reinforce it at home and ask better questions at your next session.',
    whoItsFor: 'Parents whose child has started or is about to start therapy and want to understand what the therapist is actually doing.',
    question: 'What is my child\u2019s therapist actually doing during sessions, and why?',
    action: 'Open the module for the specific strategy your child\u2019s therapy team uses and work through it in 20\u201330 minutes.',
    reviewedBy: 'UNC Frank Porter Graham Child Development Institute',
    lastUpdated: 'March 2026',
    isDemo: false,
    url: 'https://afirm.fpg.unc.edu/afirm-modules/',
  },
  {
    id: 'r-nac-parent-guide',
    title: 'National Autism Center \u2014 Parent Guide to Evidence-Based Practice',
    description:
      'A free PDF from the National Autism Center (part of May Institute) that explains which therapies are research-backed and how to evaluate provider claims. Based on the National Standards Project, a systematic review of hundreds of autism intervention studies. Helps parents ask the right questions when choosing or evaluating any therapy.',
    category: 'therapy-options',
    tags: ['evidence-based', 'therapy evaluation', 'research', 'treatment guide'],
    ageRanges: ['2-5', '6-12', '13-17'],
    readTime: '25 min',
    isFeatured: false,
    journeyStages: ['just-diagnosed', 'starting-therapy'],
    whyNow: 'Not all therapies are created equal. This guide gives parents the tools to evaluate any provider\u2019s approach with confidence.',
    whoItsFor: 'Parents who want to understand what makes a therapy evidence-based and how to advocate for quality services.',
    question: 'How do I evaluate whether the therapy my child receives is actually backed by science?',
    action: 'Download the free PDF and bring your top questions to your next therapy team meeting.',
    reviewedBy: 'National Autism Center / May Institute',
    lastUpdated: 'January 2026',
    isDemo: false,
    url: 'https://nationalautismcenter.org/resource-library/parent-guide/',
  },
  {
    id: 'r-asha-autism-communication',
    title: 'ASHA \u2014 Autism and Communication',
    description:
      'The American Speech-Language-Hearing Association\u2019s plain-language guide to communication supports for autistic children. Covers AAC (augmentative and alternative communication), what speech-language pathologists do, social communication, and how to support communication at home. Written for parents, not clinicians.',
    category: 'therapy-options',
    tags: ['speech therapy', 'AAC', 'communication', 'SLP', 'language'],
    ageRanges: ['0-2', '2-5', '6-12'],
    readTime: '10 min',
    isFeatured: false,
    journeyStages: ['starting-therapy', 'school-transition'],
    whyNow: 'If your child is in speech therapy or you\u2019ve been told they need communication supports, this explains what those supports look like and how to help at home.',
    whoItsFor: 'Parents whose child receives or is being referred for speech-language therapy.',
    question: 'What does my child\u2019s speech therapist mean by AAC, and how can I support communication at home?',
    action: 'Read the parent section and share the AAC overview with your child\u2019s school team if relevant.',
    reviewedBy: 'American Speech-Language-Hearing Association (ASHA)',
    lastUpdated: 'February 2026',
    isDemo: false,
    url: 'https://www.asha.org/public/speech/disorders/autism/',
  },

  // IEP & School Rights
  {
    id: 'r-wrightslaw',
    title: 'Wrightslaw \u2014 Special Education Law & Advocacy',
    description:
      'The most trusted parent-facing resource for special education law. Plain-language explanations of IDEA, your child\u2019s IEP rights, Section 504, prior written notice, and how to advocate effectively at ARD meetings. Includes a free law library, advocacy guides, and state-specific information.',
    category: 'education-iep',
    tags: ['IEP', 'IDEA', 'school rights', 'advocacy', 'special education law', 'ARD'],
    ageRanges: ['2-5', '6-12', '13-17'],
    readTime: '15 min (overview)',
    isFeatured: true,
    journeyStages: ['school-transition', 'starting-therapy', 'family-sustainability'],
    whyNow: 'You have legal rights at every ARD and IEP meeting. Understanding those rights before you walk in the door changes the conversation completely.',
    whoItsFor: 'Any parent whose child is in public school or approaching school age and receiving special education services.',
    question: 'What are my rights at my child\u2019s IEP or ARD meeting, and how do I actually use them?',
    action: 'Start with the "What is an IEP?" overview, then bookmark the state law section for Texas before your next school meeting.',
    reviewedBy: 'Wrightslaw (Peter and Pamela Wright, special education attorneys)',
    lastUpdated: 'March 2026',
    isDemo: false,
    url: 'https://www.wrightslaw.com',
  },
  {
    id: 'r-navigate-life-texas',
    title: 'Navigate Life Texas \u2014 IEP & School Rights',
    description:
      'A Texas-specific, plain-language guide to the IEP and ARD process, special education rights, 504 accommodations, and transition planning. Built specifically for Texas families. Includes step-by-step guides, glossaries, and real examples of how the process works in Texas public schools.',
    category: 'education-iep',
    tags: ['IEP', 'ARD', 'Texas', 'special education', '504', 'school rights'],
    ageRanges: ['2-5', '6-12', '13-17'],
    readTime: '15 min',
    isFeatured: false,
    journeyStages: ['school-transition', 'family-sustainability'],
    whyNow: 'Texas has its own rules and terminology for special education. This guide is built specifically for Texas families navigating the ARD process.',
    whoItsFor: 'Texas families whose child is in or approaching public school special education services.',
    question: 'How does the ARD process work in Texas, and what should I know before my first meeting?',
    action: 'Find your child\u2019s age group and current stage, then read the guide for that transition point.',
    reviewedBy: 'Navigate Life Texas',
    lastUpdated: 'February 2026',
    isDemo: false,
    url: 'https://www.navigatelifetexas.org',
  },

  // Insurance & Financial
  {
    id: 'r-autism-speaks-texas-insurance',
    title: 'Autism Speaks \u2014 Texas Insurance Coverage Guide',
    description:
      'A clear explanation of what Texas law requires health insurers to cover for autism services, including ABA therapy, speech therapy, and occupational therapy. Covers which plan types are included, current benefit caps, and what to do if a claim is denied. Updated regularly as Texas law changes.',
    category: 'community',
    tags: ['insurance', 'Texas', 'ABA coverage', 'benefits', 'claims', 'financial'],
    ageRanges: ['0-2', '2-5', '6-12', '13-17'],
    readTime: '10 min',
    isFeatured: true,
    journeyStages: ['just-diagnosed', 'starting-therapy'],
    whyNow: 'Many families don\u2019t realize their insurance is legally required to cover autism services in Texas. Knowing your rights can dramatically reduce out-of-pocket costs.',
    whoItsFor: 'Any Texas family navigating insurance coverage for autism services.',
    question: 'What is my Texas insurance plan actually required to cover for my child\u2019s autism services?',
    action: 'Read the Texas-specific page and call your insurer\u2019s member services with the specific mandate language if needed.',
    reviewedBy: 'Autism Speaks',
    lastUpdated: 'January 2026',
    isDemo: false,
    url: 'https://www.autismspeaks.org/texas-state-regulated-insurance-coverage',
  },

  // Research & Science
  {
    id: 'r-spark-autism',
    title: 'SPARK for Autism \u2014 Research Community',
    description:
      'SPARK is the largest autism research study in the United States, with over 415,000 participants. Funded by the Simons Foundation, it offers families the opportunity to contribute to research, receive personalized research updates, attend monthly expert webinars, and read plain-language summaries of the latest autism science. Joining is free and fully online.',
    category: 'community',
    tags: ['research', 'science', 'webinars', 'Simons Foundation', 'community'],
    ageRanges: ['0-2', '2-5', '6-12', '13-17'],
    readTime: '10 min to enroll',
    isFeatured: false,
    journeyStages: ['just-diagnosed', 'starting-therapy', 'family-sustainability'],
    whyNow: 'Families who join SPARK stay connected to the latest autism science and receive updates specifically relevant to their child\u2019s profile.',
    whoItsFor: 'Parents who want to stay informed about autism research and contribute to the science that benefits future families.',
    question: 'How do I stay current on autism research without spending hours reading academic journals?',
    action: 'Enroll your family in SPARK for free and sign up for the monthly research digest.',
    reviewedBy: 'Simons Foundation Autism Research Initiative (SFARI)',
    lastUpdated: 'March 2026',
    isDemo: false,
    url: 'https://sparkforautism.org',
  },
  {
    id: 'r-ari-research',
    title: 'Autism Research Institute \u2014 Research & Webinars',
    description:
      'The Autism Research Institute publishes evidence-based treatment summaries, intervention research, and hosts free webinars for parents and professionals. One of the oldest and most respected independent autism research organizations, ARI has been publishing peer-reviewed work since 1967.',
    category: 'community',
    tags: ['research', 'webinars', 'evidence-based', 'interventions', 'science'],
    ageRanges: ['2-5', '6-12', '13-17'],
    readTime: '15 min',
    isFeatured: false,
    journeyStages: ['starting-therapy', 'family-sustainability'],
    whyNow: 'ARI translates complex research into readable summaries so parents can evaluate what the science actually supports.',
    whoItsFor: 'Parents who want to go deeper into the research behind autism interventions and treatments.',
    question: 'Where can I find trustworthy, research-backed information that isn\u2019t trying to sell me something?',
    action: 'Browse the treatment summaries and register for an upcoming free webinar.',
    reviewedBy: 'Autism Research Institute',
    lastUpdated: 'February 2026',
    isDemo: false,
    url: 'https://autism.org',
  },

  // Caregiver Wellness
  {
    id: 'r-oar-guides',
    title: 'Organization for Autism Research \u2014 Parent Guides',
    description:
      'The Organization for Autism Research (OAR) publishes free, research-backed downloadable guides for parents covering daily routines, managing transitions, school strategies, planning for adulthood, and supporting siblings. Each guide is written in clear language, reviewed by researchers and families, and available in print-quality PDF.',
    category: 'caregiver-wellness',
    tags: ['daily life', 'transitions', 'sibling support', 'adulthood planning', 'routines'],
    ageRanges: ['2-5', '6-12', '13-17'],
    readTime: '20 min per guide',
    isFeatured: false,
    journeyStages: ['starting-therapy', 'school-transition', 'family-sustainability'],
    whyNow: 'Managing daily life with an autistic child requires practical strategies, not just clinical advice. OAR\u2019s guides focus on real situations families actually face.',
    whoItsFor: 'Parents looking for practical, research-backed guides on specific challenges \u2014 routines, transitions, school, siblings, and planning for the future.',
    question: 'Where can I find practical guides for the day-to-day challenges \u2014 not just therapy?',
    action: 'Browse the guide library and download the one that matches your family\u2019s current biggest challenge.',
    reviewedBy: 'Organization for Autism Research (OAR)',
    lastUpdated: 'February 2026',
    isDemo: false,
    url: 'https://researchautism.org',
  },
];

export const supportProviders: SupportProvider[] = [
  {
    id: 'sp1',
    name: 'Dr. Sarah Martinez, LPC',
    type: 'therapist',
    specialty: 'Caregiver Counseling & Family Therapy',
    description:
      'Supports parents navigating grief, chronic stress, relationship strain, and the emotional load of coordinating care.',
    fit: 'Best when the parent or couple needs steady therapeutic support, not just a one-time consult.',
    payment: 'Accepts major insurance plans and private pay.',
    accessNotes: 'Evening telehealth openings typically available within 2 weeks.',
    urgency: 'Use when stress is ongoing, conflict is rising, or the family needs more than peer support.',
    location: 'Sugar Land, TX',
    phone: '(832) 555-0142',
    website: 'https://example.com',
    acceptsInsurance: true,
    rating: 4.9,
    verification: 'Demo listing styled as a clinically reviewed referral example',
    lastReviewed: 'March 2026',
    journeyStages: ['family-sustainability', 'just-diagnosed'],
    isDemo: true,
  },
  {
    id: 'sp2',
    name: 'Houston Autism Parent Circle',
    type: 'support-group',
    specialty: 'Peer Support & Connection',
    description:
      'Weekly virtual meetups where parents share what is working, what is hard, and what support feels realistic right now.',
    fit: 'Best for parents who need to feel less alone and hear from others living a similar stage.',
    payment: 'No-cost community support.',
    accessNotes: 'Rolling entry with a short orientation before the first session.',
    urgency: 'Use early if isolation is rising or the parent has no support network yet.',
    location: 'Online (Houston-based)',
    meetingSchedule: 'Wednesdays 7:30 PM',
    acceptsInsurance: false,
    rating: 4.8,
    verification: 'Demo listing styled as a moderated support referral example',
    lastReviewed: 'February 2026',
    journeyStages: ['just-diagnosed', 'family-sustainability'],
    isDemo: true,
  },
  {
    id: 'sp3',
    name: 'Autism Society of Texas Helpline',
    type: 'hotline',
    specialty: 'Information & Referral',
    description:
      'A first-stop helpline for families who need a human being to help sort the next step, not just another website.',
    fit: 'Best when the family is confused about where to start or which support route fits the current problem.',
    payment: 'No-cost helpline.',
    accessNotes: 'Call volume varies; best for referral help rather than crisis response.',
    urgency: 'Use when you need triage, referrals, or decision support quickly.',
    location: 'Statewide',
    phone: '(800) 555-0198',
    acceptsInsurance: false,
    rating: 4.7,
    verification: 'Demo listing styled as a verified referral example',
    lastReviewed: 'March 2026',
    journeyStages: ['just-diagnosed', 'starting-therapy', 'school-transition', 'family-sustainability'],
    isDemo: true,
  },
  {
    id: 'sp4',
    name: 'Peaceful Hands Respite Care',
    type: 'respite',
    specialty: 'In-Home & Center-Based Respite',
    description:
      'Short-term respite support designed to help families rest, reset, and keep the household more stable during high-stress periods.',
    fit: 'Best when a caregiver has no downtime and the family needs breathing room quickly.',
    payment: 'Private pay with some waiver and grant support options.',
    accessNotes: 'Intake required before scheduling recurring care.',
    urgency: 'Use when caregiver exhaustion is affecting safety, patience, or basic functioning.',
    location: 'Fort Bend County, TX',
    phone: '(281) 555-0267',
    acceptsInsurance: true,
    rating: 4.6,
    verification: 'Demo listing styled as a trusted respite example',
    lastReviewed: 'January 2026',
    journeyStages: ['family-sustainability'],
    isDemo: true,
  },
  {
    id: 'sp5',
    name: 'Texas Parent to Parent',
    type: 'advocacy',
    specialty: 'IEP Advocacy & Educational Rights',
    description:
      'Parent advocates who help families prepare for school meetings, understand rights, and keep next steps documented.',
    fit: 'Best when school planning feels confusing, delayed, or difficult to move forward.',
    payment: 'Community and grant-supported; some services no-cost.',
    accessNotes: 'Most families start with a prep call before meeting support.',
    urgency: 'Use when the school process feels stuck or a parent needs backup for a meeting.',
    location: 'Statewide',
    phone: '(866) 555-0311',
    website: 'https://example.com',
    acceptsInsurance: false,
    rating: 4.9,
    verification: 'Demo listing styled as an advocacy referral example',
    lastReviewed: 'March 2026',
    journeyStages: ['school-transition'],
    isDemo: true,
  },
];

export const guidedSteps: GuidedStep[] = [
  {
    id: 'pre-diagnosis',
    phase: 'Something Feels Off',
    timeframe: 'Before any diagnosis',
    milestone: 'Trust what you are seeing and take the first calm step',
    focus: 'Figure out whether what you are noticing warrants an evaluation, and find the free or low-cost paths to one.',
    title: 'You are noticing something and you are not sure what to do',
    description:
      'Maybe daycare mentioned something. Maybe a milestone keeps getting pushed. Maybe it is a quiet worry you have had for a while. You do not need a diagnosis to start getting support, and you do not need to be an expert to ask the right questions.',
    reassurance:
      'Trusting your instincts is not an overreaction. The people who know your child best are usually the first to notice, and early attention protects your child whether or not this turns out to be autism.',
    whatMattersNow: [
      'Writing down, in plain language, what you have actually been noticing and how often',
      'Finding out which free evaluation paths you qualify for based on your child\'s age',
      'Talking with your pediatrician with specific examples, not just general worry',
    ],
    whatCanWait: [
      'Reading every possible explanation on the internet before you make one phone call',
      'Deciding whether this "is" autism before anyone has evaluated your child',
      'Signing up for private services before you have explored the free ones',
    ],
    checklist: [
      'Keep a simple log for two weeks: what you notice, when it happens, and how your child responds.',
      'If your child is under 3, call Early Childhood Intervention (ECI) in Texas for a free evaluation — no referral needed.',
      'If your child is 3 or older, request a free evaluation in writing from your local school district.',
      'Schedule a well-check with your pediatrician and bring your notes — ask for an M-CHAT or developmental screening.',
      'Write down 3 specific questions you want answered at the next appointment.',
      'Tell one trusted person what you are doing so you are not carrying this alone.',
    ],
    supportEscalation: [
      'If you are being told to "wait and see" but your gut says otherwise, you can request an evaluation directly — you do not need a pediatrician to refer you to ECI or your school district.',
      'If waitlists feel impossible, ECI and school district evaluations have legal timelines and are required to respond — document the date you requested in writing.',
      'If this process is triggering panic or grief, those feelings are valid even before a diagnosis. Parent support can start now.',
    ],
    supportAction: 'Make one phone call this week — ECI, your pediatrician, or your school district.',
    resources: ['r1', 'r2', 'r8'],
    reviewedBy: 'Parent navigation team',
    lastUpdated: 'April 2026',
  },
  {
    id: 'just-diagnosed',
    phase: 'Just Diagnosed',
    timeframe: 'First 30 days',
    milestone: 'Leave diagnosis with a plan, not just paperwork',
    focus: 'Stabilize, understand the report, and choose the next 2-3 moves that matter most.',
    title: 'Your child just received a diagnosis',
    description:
      'The goal is not to solve everything this month. The goal is to get oriented, protect your bandwidth, and leave the early stage with a realistic plan.',
    reassurance:
      'You do not need to become an expert overnight. It is enough to understand what matters now and let the rest wait.',
    whatMattersNow: [
      'Understanding the evaluation and writing down the questions you still have',
      'Choosing one provider search path and one support path for yourself',
      'Documenting insurance, referrals, and next calls before the details blur together',
    ],
    whatCanWait: [
      'Reading every article or joining every group immediately',
      'Making long-range schooling decisions this week',
      'Trying to solve every future therapy choice before the first intake',
    ],
    checklist: [
      'Process your emotions. Relief, grief, confusion, and urgency can all be true at once.',
      'Request and organize the full evaluation report and referrals.',
      'Write down the top 3 questions you need answered this week.',
      'Call insurance and document coverage, referrals, and requirements.',
      'Identify one provider option and one parent support option.',
      'Choose a single place to track appointments, names, and next steps.',
    ],
    supportEscalation: [
      'If you cannot tell what is urgent, use the helpline or a provider intake coordinator for triage.',
      'If the diagnosis has triggered panic, shutdown, or significant conflict at home, move support for the parent up the list.',
      'If you feel completely flooded, pause new research and return to one concrete action only.',
    ],
    supportAction: 'Book one intake call and reach out to one support option before the week ends.',
    resources: ['r1', 'r2', 'r3', 'r8'],
    reviewedBy: 'Clinically informed navigation review',
    lastUpdated: 'March 2026',
  },
  {
    id: 'starting-therapy',
    phase: 'Starting Therapy',
    timeframe: 'Days 30-90',
    milestone: 'Set expectations, routines, and measurable goals',
    focus: 'Build a stable start instead of chasing perfect outcomes too early.',
    title: 'Beginning your therapy journey',
    description:
      'Therapy startup is a transition for the whole family. Use this phase to align goals, establish routines, and make sure the plan works in real life.',
    reassurance:
      'A strong start is not about doing everything. It is about choosing a plan your family can actually sustain.',
    whatMattersNow: [
      'Clarifying the top 2-3 goals that matter most for home and daily life',
      'Understanding how progress will be tracked and when to reassess',
      'Creating routines that reduce friction around appointments and transitions',
    ],
    whatCanWait: [
      'Trying to solve every skill area in the first month',
      'Comparing your child to another family’s timeline',
      'Adding extra supports before you understand what this first plan can do',
    ],
    checklist: [
      'Tour the therapy setting and help your child know what to expect.',
      'Prepare a short “getting to know my child” summary for the care team.',
      'Agree on 2-3 functional goals and how they will be measured.',
      'Set a consistent drop-off, pickup, or in-home routine.',
      'Document questions or concerns as they come up instead of holding them until crisis level.',
      'Choose one home routine that supports therapy without overloading the family.',
      'Schedule one support touchpoint for the parent so the plan stays sustainable.',
    ],
    supportEscalation: [
      'If therapy language feels confusing, ask for the goals and measures to be restated in plain language.',
      'If the schedule is destabilizing the household, simplify before adding more.',
      'If your child’s distress or your own stress is rising sharply, bring it up early rather than waiting for the next review.',
    ],
    supportAction: 'Ask the care team to confirm the top 3 goals and what progress should look like in 30 days.',
    resources: ['r2', 'r3', 'r4', 'r5'],
    reviewedBy: 'Expert-informed therapy navigation review',
    lastUpdated: 'March 2026',
  },
  {
    id: 'school-transition',
    phase: 'School Transition',
    timeframe: 'Quarter planning',
    milestone: 'Turn school meetings into clear milestones and owners',
    focus: 'Translate evaluations and therapy insight into goals the school team can act on.',
    title: 'Navigating the school system',
    description:
      'Whether this is your first evaluation, a new IEP, or a school change, the objective is clarity: what support is needed, who owns it, and when you will review progress.',
    reassurance:
      'You do not need to know every rule before showing up. You do need a clear picture of your child’s needs and the outcomes you want discussed.',
    whatMattersNow: [
      'Bringing evaluations, concerns, and examples into one organized place',
      'Knowing what support you are asking for and why it matters in daily school life',
      'Leaving each meeting with owners, timelines, and follow-up dates',
    ],
    whatCanWait: [
      'Trying to master every policy before the first meeting',
      'Arguing every point in one sitting instead of documenting next steps',
      'Assuming the team heard you if nothing was written down',
    ],
    checklist: [
      'Request an evaluation or meeting in writing and save the message.',
      'Gather reports, recommendations, and your own examples of what is hard right now.',
      'Draft a parent concerns letter with 2-3 concrete goals.',
      'Clarify the difference between an IEP, 504 plan, and service recommendation.',
      'List the accommodations, supports, or communication routines you want discussed.',
      'Ask how progress will be reviewed and when the next checkpoint happens.',
      'Consider bringing an advocate if the process feels stalled, adversarial, or unclear.',
    ],
    supportEscalation: [
      'If the school process feels confusing, ask for decisions and timelines in writing.',
      'If the meeting leaves you uncertain about what was agreed, follow up the same day with a written summary.',
      'If you feel dismissed or stuck, move advocacy support up sooner rather than later.',
    ],
    supportAction: 'Prepare your parent concerns letter before the next school conversation.',
    resources: ['r6', 'r7', 'r8'],
    reviewedBy: 'Educational advocacy review',
    lastUpdated: 'March 2026',
  },
  {
    id: 'family-sustainability',
    phase: 'Family Sustainability',
    timeframe: 'Any time you are overloaded',
    milestone: 'Reduce burnout before it becomes disengagement',
    focus: 'Use support early so frustration does not turn into shutdown, conflict, or dropout from care.',
    title: 'What to do when you are frustrated or at your breaking point',
    description:
      'You do not need to wait until a crisis to ask for help. This phase is about stabilizing the family system so you can keep moving toward long-term goals.',
    reassurance:
      'Feeling stretched does not mean you are failing. It means your family needs a steadier support plan right now.',
    whatMattersNow: [
      'Reducing the pressure load enough to think clearly again',
      'Identifying which part of the plan is creating the most strain',
      'Getting one real layer of support involved before the next hard week hits',
    ],
    whatCanWait: [
      'Perfecting the long-term plan while you are already overloaded',
      'Trying to carry every appointment, school task, and home routine alone',
      'Assuming support should wait until things are worse',
    ],
    checklist: [
      'Name the top 3 warning signs that you are nearing burnout.',
      'Make a “what can wait” list and remove one nonessential demand this week.',
      'Choose one person or service to contact before the day ends.',
      'Create a short backup list for meals, transportation, or child care support.',
      'Tell one trusted person exactly what kind of help would lighten the load.',
      'Use one stabilizing family routine instead of trying to fix everything at once.',
      'Revisit the bigger plan once you are regulated and able to prioritize again.',
    ],
    supportEscalation: [
      'If you feel numb, panicked, highly reactive, or unable to follow through, move parent support to the top of the list.',
      'If the household feels unsafe, unstable, or one step from breaking down, use the fastest support path available.',
      'If peer support is not enough, step up to counseling, respite, or a higher-touch support option.',
    ],
    supportAction: 'Choose one stabilizing action and one support handoff today.',
    resources: ['r9', 'r10', 'r11', 'r12'],
    reviewedBy: 'Caregiver support review',
    lastUpdated: 'March 2026',
  },
];

export const communityGroups: CommunityGroup[] = [
  {
    id: 'cg1',
    name: 'Fort Bend Parent Navigation Circle',
    type: 'local',
    description:
      'A local meetup for families who want practical support, calmer conversations, and a place to swap what is actually helping.',
    memberCount: 127,
    meetingSchedule: '2nd Saturday of each month',
    location: 'Sugar Land, TX',
    audience: 'Parents and caregivers across diagnosis, therapy, and school stages',
    moderation: 'Moderated by a community facilitator with parent-ground-rule reminders',
    faithStyle: 'general',
    lastReviewed: 'March 2026',
    isDemo: true,
  },
  {
    id: 'cg2',
    name: 'Autism Dads Social Club',
    type: 'local',
    description:
      'A space specifically for dads and father figures. Low-pressure meetups, honest conversation, and practical support.',
    memberCount: 43,
    meetingSchedule: '1st Thursday, 7 PM',
    location: 'Houston, TX',
    audience: 'Dads and father figures looking for peer support',
    moderation: 'Facilitated by a volunteer host with community guidelines',
    faithStyle: 'general',
    lastReviewed: 'February 2026',
    isDemo: true,
  },
  {
    id: 'cg3',
    name: 'Texas Parent Support Online',
    type: 'online',
    description:
      'An online parent space for service questions, school stress, and the everyday realities of supporting a child on the spectrum.',
    memberCount: 892,
    meetingSchedule: 'Always open with weekly discussion prompts',
    location: 'Online',
    audience: 'Parents across Texas who need flexible support',
    moderation: 'Moderated discussion threads with clear posting boundaries and escalation guidance',
    faithStyle: 'faith-friendly',
    lastReviewed: 'March 2026',
    isDemo: true,
  },
  {
    id: 'cg4',
    name: 'Sensory-Friendly Family Fun Day',
    type: 'event',
    description:
      'A quarterly event with sensory-aware activities, low-pressure family connection, and practical local resources.',
    memberCount: 200,
    meetingSchedule: 'Next: June 14, 2026',
    location: 'Pearland, TX',
    audience: 'Families who want community without a high-stimulation event format',
    moderation: 'Hosted by trained volunteers and community partners',
    faithStyle: 'general',
    lastReviewed: 'January 2026',
    isDemo: true,
  },
];

export const diagnosisStageLabels: Record<DiagnosisStage, { label: string; color: string }> = {
  new: { label: 'Newly Diagnosed', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  ongoing: { label: 'Ongoing Journey', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  advanced: { label: 'Experienced Parent', color: 'bg-green-50 text-green-700 border-green-200' },
};

export const struggleLabels: Record<Struggle, string> = {
  behavior: 'Behavior Challenges',
  communication: 'Communication',
  school: 'School / IEP',
  burnout: 'Caregiver Burnout',
  isolation: 'Feeling Isolated',
  insurance: 'Insurance / Access',
};

export const conversationPrompts: ConversationPrompt[] = [
  { id: 'cp1', text: 'What helped you most in the early days?', category: 'icebreaker' },
  { id: 'cp2', text: 'What do you wish someone had told you?', category: 'reflection' },
  { id: 'cp3', text: 'What is one win your family had this week?', category: 'encouragement' },
  { id: 'cp4', text: 'How do you handle hard days without shutting down?', category: 'reflection' },
  { id: 'cp5', text: 'What surprised you most about this stage?', category: 'icebreaker' },
  { id: 'cp6', text: 'What gives you hope right now?', category: 'encouragement' },
];

export const mockParentMatches: ParentProfile[] = [
  {
    id: 'pm1',
    displayName: 'Maria T.',
    avatar: 'MT',
    childAgeRange: '2-5',
    diagnosisStage: 'ongoing',
    struggles: ['behavior', 'burnout'],
    connectionPreference: ['text', 'call'],
    supportStyle: 'faith-based',
    bio: 'Mom of a 4-year-old boy, two years into therapy. I like practical check-ins, not pressure.',
    matchScore: 94,
    matchReasons: ['Similar diagnosis stage', 'Shared faith-based preference', 'Both navigating burnout and behavior stress'],
    joinedDate: '2026-01-15',
    sharedInfo: 'First name initial, child age range, journey stage, and support preferences.',
    keptPrivate: 'Last name, exact child diagnosis details, address, and documents.',
    nextStepAfterMatch: 'Common Ground prompts a low-pressure first message and optional moderator check-in.',
    isDemo: true,
  },
  {
    id: 'pm2',
    displayName: 'James R.',
    avatar: 'JR',
    childAgeRange: '6-12',
    diagnosisStage: 'ongoing',
    struggles: ['school', 'isolation'],
    connectionPreference: ['call', 'group'],
    supportStyle: 'general',
    bio: 'Dad of twin boys, one on the spectrum. School meetings are my main stress point right now.',
    matchScore: 87,
    matchReasons: ['Shared school-transition concerns', 'Open to calls and groups', 'Parent perspective matches your current stage'],
    joinedDate: '2026-02-03',
    sharedInfo: 'First name initial, broad stage, struggle themes, and connection preferences.',
    keptPrivate: 'Child records, exact school, and personal contact details until the parent opts in.',
    nextStepAfterMatch: 'Parents can message first, schedule a call later, or ask to move to a guided small group.',
    isDemo: true,
  },
  {
    id: 'pm3',
    displayName: 'Aisha K.',
    avatar: 'AK',
    childAgeRange: '0-2',
    diagnosisStage: 'new',
    struggles: ['communication', 'isolation', 'insurance'],
    connectionPreference: ['text'],
    supportStyle: 'general',
    bio: 'Recently diagnosed and looking for someone calm who can help me sort what matters first.',
    matchScore: 82,
    matchReasons: ['Prefers text-based connection', 'Looking for early-stage guidance', 'Insurance questions are a shared concern'],
    joinedDate: '2026-03-20',
    sharedInfo: 'Support needs, broad age range, and whether the parent wants text, calls, or group support.',
    keptPrivate: 'Child identifying details, home address, and insurance account information.',
    nextStepAfterMatch: 'A guided message prompt appears first so nobody has to start from a blank screen.',
    isDemo: true,
  },
  {
    id: 'pm4',
    displayName: 'Rachel S.',
    avatar: 'RS',
    childAgeRange: '6-12',
    diagnosisStage: 'advanced',
    struggles: ['burnout', 'school'],
    connectionPreference: ['group', 'call'],
    supportStyle: 'faith-based',
    bio: 'Several years into this journey and happy to listen without trying to fix everything at once.',
    matchScore: 91,
    matchReasons: ['Experienced mentor fit', 'Faith-based preference match', 'Open to 1:1 or guided small-group support'],
    joinedDate: '2025-11-08',
    sharedInfo: 'Journey stage, support style, and what the parent feels able to offer.',
    keptPrivate: 'Exact family details and child information unless voluntarily shared later.',
    nextStepAfterMatch: 'Parents can request a moderator-supported introduction before a direct call.',
    isDemo: true,
  },
  {
    id: 'pm5',
    displayName: 'Carlos M.',
    avatar: 'CM',
    childAgeRange: '2-5',
    diagnosisStage: 'new',
    struggles: ['behavior', 'communication', 'burnout'],
    connectionPreference: ['text', 'group'],
    supportStyle: 'general',
    bio: 'Single dad trying to make early therapy and everyday life fit in the same week.',
    matchScore: 79,
    matchReasons: ['New diagnosis stress is a shared theme', 'Open to low-pressure group support', 'Behavior and communication both show up in your intake'],
    joinedDate: '2026-03-01',
    sharedInfo: 'Broad stage, struggle themes, and support preferences.',
    keptPrivate: 'Family documents, address, and exact provider history.',
    nextStepAfterMatch: 'Common Ground recommends either a text introduction or a small-group route based on preferences.',
    isDemo: true,
  },
];

export const peerGroups: PeerGroup[] = [
  {
    id: 'pg1',
    name: 'New Diagnosis Circle',
    description: 'A guided small group for parents in the first year after diagnosis.',
    memberCount: 6,
    maxMembers: 8,
    meetingSchedule: 'Tuesdays 7:00 PM',
    format: 'virtual',
    moderator: 'Rachel S.',
    tags: ['new diagnosis', 'guided', 'low-pressure'],
    level: 'group',
    audience: 'Parents who need realistic expectations and a softer place to start.',
    moderation: 'Moderated opening, community agreements, and escalation guidance if peer support is not enough.',
    faithStyle: 'general',
    afterJoin: 'New members receive a short orientation and one suggested first conversation prompt.',
    isDemo: true,
  },
  {
    id: 'pg2',
    name: 'Working Moms Group',
    description: 'A weekly space for mothers balancing caregiving, work, and decision fatigue.',
    memberCount: 7,
    maxMembers: 8,
    meetingSchedule: 'Thursdays 8:00 PM',
    format: 'virtual',
    moderator: 'Maria T.',
    tags: ['working parents', 'moms', 'balance'],
    level: 'group',
    audience: 'Mothers looking for practical support and flexible connection.',
    moderation: 'Facilitated by a parent host with moderator follow-up available.',
    faithStyle: 'faith-friendly',
    afterJoin: 'Members receive meeting expectations, privacy reminders, and optional check-in prompts.',
    isDemo: true,
  },
  {
    id: 'pg3',
    name: 'Dads Connect',
    description: 'No-pressure meetups for dads and father figures who want honest conversation and practical help.',
    memberCount: 4,
    maxMembers: 6,
    meetingSchedule: 'Biweekly Saturdays 10:00 AM',
    format: 'hybrid',
    moderator: 'James R.',
    tags: ['dads', 'peer support', 'casual'],
    level: 'group',
    audience: 'Dads and father figures who prefer a lower-pressure support style.',
    moderation: 'Community host plus moderator escalation if a family needs higher-touch support.',
    faithStyle: 'general',
    afterJoin: 'Parents can join one session before deciding whether to stay in the group.',
    isDemo: true,
  },
  {
    id: 'pg4',
    name: 'High Stress Week Support Group',
    description: 'A guided group for parents navigating significant behavior stress, overload, or family sustainability concerns.',
    memberCount: 5,
    maxMembers: 8,
    meetingSchedule: 'Wednesdays 7:30 PM',
    format: 'virtual',
    moderator: 'Staff Facilitator',
    tags: ['behavior', 'burnout', 'guided support'],
    level: 'group',
    audience: 'Parents who need more structure than a casual peer thread can provide.',
    moderation: 'Facilitated with clear boundaries and handoff reminders when counseling or respite is needed.',
    faithStyle: 'general',
    afterJoin: 'Parents get a short guide on what is appropriate for peer support versus professional support.',
    isDemo: true,
  },
];

// ---------------------------------------------------------------------------
// Sensory-friendly local guide
// ---------------------------------------------------------------------------
// Vetted local businesses that have a track record of serving kids on the
// spectrum well. Parents should not have to piece this together from forum
// threads and word of mouth.

export type SensoryPlaceCategory =
  | 'haircut'
  | 'dentist'
  | 'pediatrician'
  | 'grocery'
  | 'restaurant'
  | 'entertainment'
  | 'optometrist'
  | 'photography'
  | 'developmental'
  | 'speech-ot'
  | 'mental-health'
  | 'pediatric-gi'
  | 'eye-care'
  | 'advocacy'
  | 'other';

export interface SensoryFriendlyPlace {
  id: string;
  name: string;
  category: SensoryPlaceCategory;
  city: string;
  state: string;
  description: string;
  whatWorks: string;
  whatToKnow: string;
  verificationSource: 'staff-vouched' | 'parent-submitted' | 'business-self-reported';
  phone?: string;
  website?: string;
  address?: string;
  lastReviewed: string;
  isDemo: boolean;
}

export const sensoryCategoryMeta: Record<
  SensoryPlaceCategory,
  { label: string; emoji: string }
> = {
  dentist: { label: 'Dentists', emoji: '🦷' },
  haircut: { label: 'Haircuts & Barbers', emoji: '✂️' },
  developmental: { label: 'Developmental Pediatrics & Neurology', emoji: '🧠' },
  'speech-ot': { label: 'Speech, OT & Therapy', emoji: '💬' },
  'mental-health': { label: 'Mental Health & Counseling', emoji: '💚' },
  'pediatric-gi': { label: 'Pediatric GI', emoji: '🏥' },
  'eye-care': { label: 'Eye Care', emoji: '👓' },
  advocacy: { label: 'Advocacy & Support Orgs', emoji: '🤝' },
  pediatrician: { label: 'Pediatricians', emoji: '🩺' },
  grocery: { label: 'Grocery & Shopping', emoji: '🛒' },
  restaurant: { label: 'Restaurants', emoji: '🍽️' },
  entertainment: { label: 'Entertainment', emoji: '🎬' },
  optometrist: { label: 'Eye Exams', emoji: '👁️' },
  photography: { label: 'Photographers', emoji: '📷' },
  other: { label: 'Other', emoji: '✨' },
};

export const sensoryFriendlyPlaces: SensoryFriendlyPlace[] = [
  // ── DENTISTRY ──────────────────────────────────────────────────────────
  {
    id: 'sf-d1',
    name: 'Caldwell & Steinbring Dentistry For Children',
    category: 'dentist',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Treating special needs patients since 1979. Comprehensive training in special needs pediatric dentistry including autism, sensory issues, and developmental disorders.',
    whatWorks:
      'Entire staff trained in care techniques for children with special needs. Board-certified pediatric dentists with decades of experience.',
    whatToKnow:
      'One of the longest-running special needs dental practices in Fort Bend County. Call to confirm insurance acceptance.',
    verificationSource: 'staff-vouched',
    phone: '(281) 491-4500',
    website: 'https://www.cskidsdds.com',
    address: '16645 Southwest Fwy, Sugar Land, TX 77479',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-d2',
    name: 'Sweetpea Smiles',
    category: 'dentist',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Dedicated special needs dentistry program using tell-show-do approach, dimmed lights, hidden instruments, and minimized sounds.',
    whatWorks:
      'Reduces sensory input during visits — keeps light from child\'s eyes, dental instruments out of sight, and reduces smells and sounds. Offers sedation for longer procedures.',
    whatToKnow:
      'Consistently strong parent reviews specifically from autism families. Accepts most major insurance plans.',
    verificationSource: 'parent-submitted',
    phone: '(281) 242-4242',
    website: 'https://www.sweetpeasmiles.com',
    address: '16525 Lexington Blvd Ste 195, Sugar Land, TX 77479',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-d3',
    name: 'Pearland Pediatric Dentistry',
    category: 'dentist',
    city: 'Pearland',
    state: 'TX',
    description:
      'Team specifically trained for children with anxiety, sensory issues, autism spectrum disorder, Down syndrome, cerebral palsy, and developmental delays.',
    whatWorks:
      'Focus on preventive care adapted to each child\'s needs. Staff understands how to work with children who have different sensory processing.',
    whatToKnow:
      'Explicitly lists autism and sensory issues as specialties on their website. Call to confirm your insurance plan.',
    verificationSource: 'staff-vouched',
    phone: '(281) 412-7737',
    website: 'https://www.pearlandkidsteeth.com',
    address: '2950 Cullen Pkwy Ste 101, Pearland, TX 77584',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-d4',
    name: 'Modern Dentistry — Dr. Jacob Dent, DDS',
    category: 'dentist',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Dr. Dent specializes specifically in treating children and adolescents with autism. Recommended by the Katy Autism Support Group as a vetted medical resource.',
    whatWorks:
      'Specifically trained for autism populations — not just "kid-friendly" but genuinely adapted for sensory needs.',
    whatToKnow:
      'Recommended by local autism advocacy organizations. Call to verify insurance acceptance.',
    verificationSource: 'staff-vouched',
    phone: '(832) 595-2100',
    website: 'https://www.sugarlandmoderndentistry.com',
    address: '19984 Southwest Fwy, Sugar Land, TX 77479',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-d5',
    name: 'Henry Delclos, DDS — Pediatric Dentistry',
    category: 'dentist',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Practice acknowledges children with physical, developmental, mental, sensory, behavioral, cognitive, or emotional conditions. Follows AAPD guidelines.',
    whatWorks:
      'Smaller practice that may offer more personalized attention. Follows American Academy of Pediatric Dentistry special healthcare needs guidelines.',
    whatToKnow:
      'Good option if larger practices feel overwhelming. Call ahead to discuss your child\'s specific needs.',
    verificationSource: 'parent-submitted',
    phone: '(281) 494-4220',
    website: 'http://www.delclosdds.com',
    address: '15911 Southwest Fwy Ste 300, Sugar Land, TX 77479',
    lastReviewed: 'April 2026',
    isDemo: false,
  },

  // ── HAIRCUTS ───────────────────────────────────────────────────────────
  {
    id: 'sf-h1',
    name: 'Snip-Its Sugar Land',
    category: 'haircut',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Stylists receive special training in partnership with Autism Speaks. One of the first national chains to provide autism-specific stylist training.',
    whatWorks:
      'Pre-visits to familiarize children with the salon. Haircut Guide with tips for parents. Kid-friendly environment designed to reduce anxiety.',
    whatToKnow:
      'Contact your local Snip-Its to schedule a pre-visit. Ask about their sensory-friendly experience when booking.',
    verificationSource: 'staff-vouched',
    phone: '(281) 277-0093',
    website: 'https://local.snipits.com/sugar-land-tx',
    address: '16535 Southwest Fwy Ste 440, Sugar Land, TX 77479',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-h2',
    name: 'Sweet & Sassy — Katy',
    category: 'haircut',
    city: 'Katy',
    state: 'TX',
    description:
      'Reviews from autism families specifically praise accommodations. Described as a safe space for neurodiverse kids with zero judgment.',
    whatWorks:
      'Many accommodations made during appointments. Kids can enjoy the experience at their own pace. Staff is flexible and patient.',
    whatToKnow:
      'Parent reviews specifically mention autism-friendly experience. Also offers spa packages for sensory-seeking kids who enjoy pampering.',
    verificationSource: 'parent-submitted',
    phone: '(281) 394-9880',
    website: 'https://www.sweetandsassy.com/katy/salon',
    address: '23501 Cinco Ranch Blvd Ste H140, Katy, TX 77494',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-h3',
    name: 'Kidz Kutz N More — Katy / Cinco Ranch',
    category: 'haircut',
    city: 'Katy',
    state: 'TX',
    description:
      'Owner took specific classes for working with special needs children with autism. Offers video games, movies, bubbles as sensory distraction.',
    whatWorks:
      'Safety-belted child-sized chairs, distraction tools (movies, games, bubbles), patient and flexible approach. Bilingual staff (English/Spanish).',
    whatToKnow:
      'Family-owned. Bilingual staff is a plus for Spanish-speaking families. Serves Katy, Sugar Land, Cinco Ranch areas.',
    verificationSource: 'parent-submitted',
    phone: '(832) 437-5899',
    website: 'https://www.kidzkutznmore.com',
    address: '23255 Cinco Ranch Blvd, Katy, TX 77494',
    lastReviewed: 'April 2026',
    isDemo: false,
  },

  // ── DEVELOPMENTAL PEDIATRICS & NEUROLOGY ──────────────────────────────
  {
    id: 'sf-dev1',
    name: 'Texas Children\'s — Meyer Center (Sugar Land)',
    category: 'developmental',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Nation\'s largest pediatric hospital. Road Map Model provides workshops and community resources from first contact. Expert psychologists and developmental pediatricians.',
    whatWorks:
      'Family-centered approach with individualized care plans. Workshops start before your first appointment so families are not left waiting without support.',
    whatToKnow:
      'Wait times can be long — worth the wait for comprehensive evaluation. Interpreter services available. Also has main campus in Medical Center.',
    verificationSource: 'staff-vouched',
    phone: '(832) 824-2009',
    website: 'https://www.texaschildrens.org/departments/developmental-pediatrics-and-autism',
    address: '15400 Southwest Fwy Ste 100, Sugar Land, TX 77478',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-dev2',
    name: 'THINK Neurology for Kids',
    category: 'developmental',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Leading pediatric neurology practice in greater Houston. Board-certified child neurologists with locations in Sugar Land, Katy, and The Woodlands.',
    whatWorks:
      'Comprehensive diagnostic approach including genetic and chromosomal testing. Personal connections with patients and families maintained despite growth.',
    whatToKnow:
      'Multiple locations convenient to all three clinic areas. Also has a Katy location. Accepts most major insurance plans.',
    verificationSource: 'staff-vouched',
    phone: '(281) 809-4076',
    website: 'https://www.thinkkids.com',
    address: '17510 W Grand Pkwy S Ste 440, Sugar Land, TX 77479',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-dev3',
    name: 'Pediatrics of Sugar Land — Dr. Burgos',
    category: 'developmental',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Follows AAP guidelines for autism screening at 18 and 24 months. Two-step screening process with comprehensive diagnostic evaluation when indicated.',
    whatWorks:
      'Good first step for families who suspect autism but have not started the diagnostic process. 30+ years serving the community.',
    whatToKnow:
      'Serves Sugar Land, Katy, Pearland areas. Spanish-speaking staff available. Board-certified pediatricians.',
    verificationSource: 'staff-vouched',
    phone: '(281) 265-8800',
    website: 'https://pediatricsofsugarland.com',
    address: '2343 Town Center Dr #2, Sugar Land, TX 77478',
    lastReviewed: 'April 2026',
    isDemo: false,
  },

  // ── SPEECH, OT & THERAPY ──────────────────────────────────────────────
  {
    id: 'sf-st1',
    name: 'Essential Speech and ABA Therapy — Sugar Land',
    category: 'speech-ot',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'True team approach: every child has a BCBA, Speech-Language Pathologist, and Occupational Therapist who collaborate daily. Ages 18 months to 6 years.',
    whatWorks:
      'All three disciplines under one roof collaborating on each child\'s plan. Individualized treatment plans. Strong parent reviews.',
    whatToKnow:
      'Focuses on early intervention (18 months to 6 years). Accepts most insurance plans including Medicaid.',
    verificationSource: 'staff-vouched',
    phone: '(281) 974-0588',
    website: 'https://www.speechandaba.com/sugarland',
    address: 'Sugar Land, TX',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-st2',
    name: 'Essential Speech and ABA Therapy — Pearland',
    category: 'speech-ot',
    city: 'Pearland',
    state: 'TX',
    description:
      'Same team model as Sugar Land — BCBA, SLP, and OT on every child. Independently owned for personalized attention. Early intervention focus.',
    whatWorks:
      'Collaborative model ensures consistent care across all three disciplines. Each facility uniquely equipped for its community.',
    whatToKnow:
      'Pearland families: same quality program, closer to home. Accepts most insurance plans including Medicaid.',
    verificationSource: 'staff-vouched',
    phone: '(281) 974-0588',
    website: 'https://www.speechandaba.com/pearland',
    address: 'Pearland, TX',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-st3',
    name: 'Therapy and Beyond — Sugar Land',
    category: 'speech-ot',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Family-focused ABA, speech, and occupational therapy. Founded by someone with a personal connection to autism through their adopted brother.',
    whatWorks:
      'Mission-driven practice with strong family involvement philosophy. Combination of ABA, speech, and OT focused on building strengths.',
    whatToKnow:
      'Personal mission drives the practice. They accept your child for who they are while working on areas of challenge.',
    verificationSource: 'parent-submitted',
    phone: '(832) 930-7803',
    website: 'https://www.therapyandbeyond.com/aba-therapy-sugarland-tx',
    address: 'Sugar Land, TX',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-st4',
    name: 'Pine Cone Therapies — Pearland / Missouri City',
    category: 'speech-ot',
    city: 'Pearland',
    state: 'TX',
    description:
      'ABA, speech, and OT serving Pearland, Sugar Land, Missouri City, and Richmond. SLP specializes in Autism Spectrum Disorders and Sensory Processing.',
    whatWorks:
      'Experienced SLP with 9 years pediatric experience. BCBA with specialty in early intervention. Convenient Riverstone Shopping Center location.',
    whatToKnow:
      'Serves families across Sugar Land, Pearland, Missouri City, Richmond, and Rosenberg areas.',
    verificationSource: 'parent-submitted',
    website: 'https://www.pineconetherapies.com/location/pearland-tx-aba-therapy',
    address: 'Riverstone Shopping Center, Riverstone Blvd, Missouri City, TX',
    lastReviewed: 'April 2026',
    isDemo: false,
  },

  // ── MENTAL HEALTH & COUNSELING ────────────────────────────────────────
  {
    id: 'sf-mh1',
    name: 'Sugar Bend Center',
    category: 'mental-health',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Multidisciplinary team with psychiatrist, neuropsychologist, and psychologists under one roof. Comprehensive neuropsych testing including autism assessments.',
    whatWorks:
      'One-stop for evaluation, therapy, AND medication management — rare to find all three in one practice. Specifically lists ASD as an area of focus.',
    whatToKnow:
      'Good for families who need both a diagnosis evaluation and ongoing therapy or medication support in one place.',
    verificationSource: 'staff-vouched',
    phone: '(281) 313-3050',
    website: 'https://sugarbendcenter.com',
    address: 'Sugar Land, TX',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-mh2',
    name: 'Dr. Rafael Guerrero, MD — Child Psychiatrist',
    category: 'mental-health',
    city: 'Katy',
    state: 'TX',
    description:
      'Board-certified psychiatrist specializing in autism spectrum disorders, ADHD, intellectual disabilities, and developmental conditions.',
    whatWorks:
      'One of the few child psychiatrists in the area who specifically specializes in autism. Member of Harris County Medical Society and Texas Medical Association.',
    whatToKnow:
      'Child psychiatrists who specialize in autism are extremely difficult to find. Worth the effort to get on his schedule.',
    verificationSource: 'staff-vouched',
    phone: '(281) 712-8823',
    website: 'https://www.drrafaelguerrero.com',
    address: 'Katy, TX',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-mh3',
    name: 'District Counseling — Multiple Locations',
    category: 'mental-health',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Locations in Sugar Land, Katy, Pearland, and Missouri City. Large team of therapists with bilingual options available. Good for caregiver mental health.',
    whatWorks:
      'Multiple locations makes this accessible to families at all three clinics. Advanced counseling approaches. Bilingual therapists available.',
    whatToKnow:
      'Good option specifically for parent/caregiver mental health support. Accepts most insurance plans.',
    verificationSource: 'parent-submitted',
    website: 'https://districtcounseling.center',
    address: 'Multiple locations — Sugar Land, Katy, Pearland, Missouri City',
    lastReviewed: 'April 2026',
    isDemo: false,
  },

  // ── PEDIATRIC GI ──────────────────────────────────────────────────────
  {
    id: 'sf-gi1',
    name: 'Texas Children\'s — GI, Hepatology & Nutrition (Sugar Land)',
    category: 'pediatric-gi',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'One of the largest pediatric GI programs in the US. Important for autism families because GI issues are extremely common in children with ASD.',
    whatWorks:
      'State-of-the-art treatment for the full spectrum of gastrointestinal, pancreatic, hepatic, and nutritional disorders. Sugar Land location available.',
    whatToKnow:
      'GI issues affect a large percentage of children with autism. Do not overlook this — digestive problems can drive behavior changes.',
    verificationSource: 'staff-vouched',
    phone: '(832) 824-3800',
    website: 'https://www.texaschildrens.org/departments/gastroenterology-hepatology-and-nutrition',
    address: '15400 Southwest Fwy, Sugar Land, TX 77478',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-gi2',
    name: 'Dr. Kalpesh Thakkar, MD — Memorial Hermann Sugar Land',
    category: 'pediatric-gi',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Fellowship trained at Texas Children\'s/Baylor. Provides highly personalized care. Active listening approach with tailored treatment plans for newborns to age 18.',
    whatWorks:
      'Sits down with patients and parents, listens to concerns, and together determines a solution. Patient-care approach based on education and partnership.',
    whatToKnow:
      'Excellent patient communication approach — important for families navigating complex medical needs alongside autism.',
    verificationSource: 'parent-submitted',
    website: 'https://memorialhermann.org',
    address: 'Memorial Hermann Medical Group, Sugar Land, TX',
    lastReviewed: 'April 2026',
    isDemo: false,
  },

  // ── EYE CARE ──────────────────────────────────────────────────────────
  {
    id: 'sf-eye1',
    name: 'Dr. Glenn Bulan — Texas Eye Institute',
    category: 'eye-care',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Board-certified pediatric ophthalmologist available at Katy, Sugar Land, Southwest, and Angleton offices. Handles routine eye exams to complex surgical cases.',
    whatWorks:
      'Pediatric ophthalmologists are a specialty — few in the area. Visual issues are common in ASD. Experienced with the full range of pediatric eye conditions.',
    whatToKnow:
      'Multiple locations available. Accepts most major insurance plans.',
    verificationSource: 'parent-submitted',
    phone: '(713) 668-6828',
    website: 'https://txeye.com/our-team/glenn-e-bulan-md',
    address: 'Multiple locations — Sugar Land & Katy',
    lastReviewed: 'April 2026',
    isDemo: false,
  },

  // ── ADVOCACY & COMMUNITY ORGANIZATIONS ────────────────────────────────
  {
    id: 'sf-adv1',
    name: 'Hope For Three — Autism Advocacy',
    category: 'advocacy',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Fort Bend County\'s premier autism nonprofit. Provides financial assistance for autism-related services including swim safety, respite, legal guardianship, and therapies.',
    whatWorks:
      'Can help cover costs that insurance will not. Caregiver Empowerment Sessions. Financial assistance through FARS program.',
    whatToKnow:
      'Must apply. Requires proof of Fort Bend County residency. Mandatory attendance at empowerment sessions within 60 days of award.',
    verificationSource: 'staff-vouched',
    phone: '(281) 245-0640',
    website: 'https://hopeforthree.org',
    address: 'Fort Bend County, TX',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-adv2',
    name: 'The Arc of Fort Bend County',
    category: 'advocacy',
    city: 'Sugar Land',
    state: 'TX',
    description:
      'Long-standing disability advocacy organization. Online resource directory for local school districts, autism support groups, legal resources, and community programs.',
    whatWorks:
      'Good starting point for understanding rights and navigating systems. Comprehensive online resource directory.',
    whatToKnow:
      'Serves all of Fort Bend County. Resources include school district contacts, support groups, and advocacy tools.',
    verificationSource: 'staff-vouched',
    phone: '(281) 494-5959',
    website: 'https://arcoffortbend.org',
    address: 'Fort Bend County, TX',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-adv3',
    name: 'The Arc of Katy',
    category: 'advocacy',
    city: 'Katy',
    state: 'TX',
    description:
      'Focused on inclusion and community participation. Programs for youth, teens, and adults with IDD. Empowerment Through Knowledge sessions for parents and caregivers.',
    whatWorks:
      'Social enrichment, recreation, life-long learning, and community service. Virtual and in-person programming. Serves Fort Bend, Harris, and Waller counties.',
    whatToKnow:
      'Great for social enrichment and community connection beyond therapy.',
    verificationSource: 'parent-submitted',
    website: 'https://www.thearcofkaty.org',
    address: 'Katy, TX',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-adv4',
    name: 'Katy Autism Support Group',
    category: 'advocacy',
    city: 'Katy',
    state: 'TX',
    description:
      'Local parent-run support group that meets monthly. Maintains a vetted list of medical resources. Peer support from families who understand.',
    whatWorks:
      'Monthly meetings for parent-to-parent support. Their medical resource page is one of the best vetted local lists available.',
    whatToKnow:
      'Meets at St. Peter\'s United Methodist Church in Katy. Free to attend.',
    verificationSource: 'parent-submitted',
    website: 'https://katyautismsupport.org',
    address: 'St. Peter\'s United Methodist, Katy, TX',
    lastReviewed: 'April 2026',
    isDemo: false,
  },

  // ── GROCERY & ENTERTAINMENT (kept from working examples) ──────────────
  {
    id: 'sf-g1',
    name: 'H-E-B Sensory-Friendly Hours',
    category: 'grocery',
    city: 'Multiple',
    state: 'TX',
    description:
      'Select H-E-B locations in Texas host sensory-friendly shopping hours with dimmed lights, reduced music, and quieter announcements.',
    whatWorks:
      'Lights dimmed about 50%, music and PA announcements paused, fewer active registers — significantly lower overall stimulation.',
    whatToKnow:
      'Hours vary by store. Check with your local H-E-B or their community page for the current schedule in your area.',
    verificationSource: 'business-self-reported',
    website: 'https://www.heb.com',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
  {
    id: 'sf-e1',
    name: 'AMC Sensory Friendly Films',
    category: 'entertainment',
    city: 'Multiple',
    state: 'TX',
    description:
      'Regular screenings with lights up, sound down, and an understanding that kids may need to move, talk, or step out.',
    whatWorks:
      'No preview ads, lower sound, house lights left partially on. Families know nobody will be upset by noise or movement.',
    whatToKnow:
      'Usually runs the second and fourth Saturday of the month. Check individual theater schedules.',
    verificationSource: 'business-self-reported',
    website: 'https://www.amctheatres.com/programs/sensory-friendly-films',
    lastReviewed: 'April 2026',
    isDemo: false,
  },
];

export const sensoryVerificationLabels: Record<
  SensoryFriendlyPlace['verificationSource'],
  { label: string; color: string }
> = {
  'staff-vouched': {
    label: 'Verified by Texas ABA Centers',
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  'parent-submitted': {
    label: 'Recommended by a parent',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'business-self-reported': {
    label: 'Program offered by business',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};
