import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  Heart,
  Home,
  Laptop,
  Lock,
  MapPin,
  MessagesSquare,
  Phone,
  Sparkles,
  Wind,
  Wrench,
} from 'lucide-react';
import CrisisPill from '@/components/CrisisPill';
import BorderGlow from '@/components/effects/BorderGlow';
import styles from './page.module.css';

const credibilityChecks = [
  'Ease the mental and emotional load of caregiving',
  'Build confidence with clear tools and guidance',
  'Connect to local ABA providers and parent support',
] as const;

const needTiles = [
  {
    href: '/support/intake',
    icon: Compass,
    label: 'I need a next step',
    description: 'A short guided path to what matters now.',
    tone: 'sage',
  },
  {
    href: '/support/at-home',
    icon: Home,
    label: 'I need help at home',
    description: 'Routines, transitions, and behavior tools.',
    tone: 'violet',
  },
  {
    href: '/support/hard-days',
    icon: Heart,
    label: 'I feel overwhelmed',
    description: 'Grounding, self-care, and support for hard days.',
    tone: 'coral',
  },
  {
    href: '/support/what-is-aba',
    icon: BookOpen,
    label: 'I want to understand ABA',
    description: 'Plain-English answers without jargon.',
    tone: 'amber',
  },
  {
    href: '/support/connect',
    icon: MessagesSquare,
    label: 'I want to connect',
    description: 'Parents and groups who understand.',
    tone: 'aqua',
  },
  {
    href: '/support/resources',
    icon: Wrench,
    label: 'I need practical resources',
    description: 'Guides and tools matched to your needs.',
    tone: 'mint',
  },
] as const;

const pathSteps = [
  'Understand where you are',
  'Find local providers',
  'Build your next step',
  'Get connected with support',
] as const;

const strategies = [
  ['Visual morning routines', 'Routines'],
  ['First-then language', 'Communication'],
  ['5-minute sensory resets', 'Sensory breaks'],
] as const;

const toolbox = [
  ['/support/hard-days', Wind, 'Grounding tools', 'mint'],
  ['/calm', Heart, 'Overwhelm reset', 'coral'],
  ['/support/caregiver', BookOpen, 'Caregiver reflection', 'violet'],
  ['tel:988', Phone, 'Crisis support', 'aqua'],
  ['/support/check-in', Compass, 'Burnout check', 'sage'],
] as const;

const providers = [
  ['Sensory-friendly dentists', 'Caldwell & Steinbring Dentistry for Children', 'Sugar Land'],
  ['Speech & OT clinics', 'Speech & Motion Therapy', 'Southwest Houston area'],
  ['Respite care', 'Easter Seals Greater Houston - Respite Services', 'Greater Houston area'],
  ['Parent support groups', 'Autism Society of Texas - Connection Groups', 'Statewide'],
] as const;

function ToneIcon({ tone, icon: Icon }: { tone: string; icon: typeof Compass }) {
  return (
    <span className={`${styles.needIcon} ${styles[tone]}`}>
      <Icon aria-hidden />
    </span>
  );
}

export default function DesignPreviewPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" aria-label="Common Ground home" className={styles.logoLink}>
            <Image
              src="/logos/cg2-lockup-final.png"
              alt="Texas ABA Centers | Common Ground"
              width={320}
              height={48}
              priority
            />
          </Link>
          <div className={styles.navActions}>
            <CrisisPill />
            <Link href="/client" className={styles.clientLink}>
              <Lock aria-hidden /> Client sign in
            </Link>
            <Link href="/support/intake" className={styles.navCta}>
              Find My Next Step <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </nav>

      <section className={styles.hero}>
        <Image
          src="/hero-selected.jpg"
          alt="Father and daughter doing a puzzle with a Texas ABA Centers therapy kit"
          fill
          priority
          quality={100}
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroAurora} aria-hidden />
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.heroPill}>
              <Heart aria-hidden /> Texas ABA Centers · Common Ground
            </span>
            <h1>
              Real autism support for real <em>Texas</em> families
            </h1>
            <p className={styles.heroLead}>
              A free support hub that helps you find local providers, parent tools, and clear next steps for your family—whether you are newly diagnosed, already receiving services, or just exploring options.
            </p>
            <p className={styles.heroBody}>
              Common Ground meets you where you are with practical resources, trusted guidance, and support built for the whole family, so you can spend less energy searching and more energy being present.
            </p>
            <div className={styles.checks}>
              {credibilityChecks.map((item) => (
                <span key={item}>
                  <CheckCircle2 aria-hidden /> {item}
                </span>
              ))}
            </div>
            <div className={styles.heroButtons}>
              <Link href="/support/intake" className={styles.primaryCta}>
                <Sparkles aria-hidden /> Find My Next Step <ArrowRight aria-hidden />
              </Link>
              <Link href="/support" className={styles.secondaryCta}>
                Browse all support
              </Link>
            </div>
            <p className={styles.heroNote}>No sign-up. Free for every family in Texas.</p>
          </div>
        </div>
        <div className={styles.heroWave} aria-hidden />
      </section>

      <section className={styles.needsSection} aria-labelledby="needs-heading">
        <div className={styles.sectionInner}>
          <header className={styles.centerHeading}>
            <h2 id="needs-heading">What do you need today?</h2>
            <span className={styles.headingMark} aria-hidden>
              <i />
              <Heart />
              <i />
            </span>
            <p>Start wherever you are. Every path below is free and built for parents.</p>
          </header>
          <div className={styles.needGrid}>
            {needTiles.map(({ href, icon: Icon, label, description, tone }) => (
              <BorderGlow
                key={label}
                className={styles.glowTile}
                edgeSensitivity={24}
                glowColor="174 64 47"
                backgroundColor="#ffffff"
                borderRadius={22}
                glowRadius={24}
                glowIntensity={0.5}
                coneSpread={22}
                colors={['#0f9f91', '#8b5cf6', '#fb7185']}
                fillOpacity={0.14}
              >
                <Link href={href} className={styles.needTile} aria-label={`${label}: ${description}`}>
                  <ToneIcon tone={tone} icon={Icon} />
                  <span className={styles.needCopy}>
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </span>
                  <ArrowRight className={styles.tileArrow} aria-hidden />
                </Link>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featuresSection} aria-label="Main support features">
        <div className={styles.featureGlowOne} aria-hidden />
        <div className={styles.featureGlowTwo} aria-hidden />
        <div className={`${styles.sectionInner} ${styles.featureGrid}`}>
          <article className={`${styles.featureCard} ${styles.feature_teal}`}>
            <div className={styles.featureTopline} />
            <p className={styles.featureEyebrow}>A guided path</p>
            <h3>Find My Next Step</h3>
            <p className={styles.featureDescription}>A guided roadmap that meets you exactly where you are.</p>
            <div className={styles.featureBody}>
              <div className={styles.chips}>
                <span>Newly diagnosed</span>
                <span>In services</span>
                <span>Exploring options</span>
              </div>
              <ol className={styles.pathList}>
                {pathSteps.map((step, index) => (
                  <li key={step}>
                    <b>{index + 1}</b>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className={styles.progressBox}>
                <span>Your pathway</span>
                <small>Step 1 of 4</small>
                <i><b /></i>
              </div>
            </div>
            <Link href="/support/intake" className={styles.featureButton}>
              Start My Next Step <ArrowRight aria-hidden />
            </Link>
          </article>

          <article className={`${styles.featureCard} ${styles.feature_purple}`}>
            <div className={styles.featureTopline} />
            <p className={styles.featureEyebrow}>Practical parent tools</p>
            <h3>At Home Strategies</h3>
            <p className={styles.featureDescription}>A calm parent toolbox of practical, real-life tools.</p>
            <div className={styles.featureBody}>
              <div className={`${styles.chips} ${styles.purpleChips}`}>
                <span>Routines</span><span>Communication</span><span>Transitions</span><span>Sensory breaks</span>
              </div>
              <ul className={styles.strategyList}>
                {strategies.map(([label, tag]) => (
                  <li key={label}>
                    <span className={styles.strategyIcon}><Home /></span>
                    <strong>{label}</strong>
                    <small>{tag}</small>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/support/at-home" className={styles.featureButton}>
              Browse Strategies <ArrowRight aria-hidden />
            </Link>
          </article>

          <article className={`${styles.featureCard} ${styles.feature_blue}`}>
            <div className={styles.featureTopline} />
            <p className={styles.featureEyebrow}>Care for the caregiver</p>
            <h3>Mental Health Toolbox</h3>
            <p className={styles.featureDescription}>Calm, practical support for you—the caregiver.</p>
            <div className={styles.featureBody}>
              <ul className={styles.toolboxList}>
                {toolbox.map(([href, Icon, label, tone]) => (
                  <li key={label}>
                    {href.startsWith('tel:') ? (
                      <a href={href}>
                        <span className={`${styles.toolboxIcon} ${styles[tone]}`}><Icon /></span>
                        <strong>{label}</strong>
                        <ArrowRight />
                      </a>
                    ) : (
                      <Link href={href}>
                        <span className={`${styles.toolboxIcon} ${styles[tone]}`}><Icon /></span>
                        <strong>{label}</strong>
                        <ArrowRight />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/support/caregiver" className={styles.featureButton}>
              Open Toolbox <ArrowRight aria-hidden />
            </Link>
          </article>
        </div>
      </section>

      <section className={styles.localSection} aria-labelledby="local-heading">
        <div className={`${styles.sectionInner} ${styles.localGrid}`}>
          <div className={styles.localCopy}>
            <p className={styles.kicker}>Support near home</p>
            <h2 id="local-heading">Find Local Help</h2>
            <p>Local support you can trust, right where you are.</p>
            <p>Browse local providers and support resources in the greater Houston area.</p>
            <Link href="/support/find">See all local providers <ArrowRight /></Link>
          </div>

          <Link href="/support/find" className={styles.mapCard} aria-label="Explore the local support directory">
            <svg viewBox="0 0 500 340" aria-hidden>
              <rect width="500" height="340" fill="#fbfaf5" />
              <path d="M-20 202 C 70 150, 145 240, 250 190 S 430 116, 520 160" fill="none" stroke="#c5dfeb" strokeWidth="13" strokeLinecap="round" opacity=".9" />
              <path d="M55 -15 C 150 90, 260 165, 306 365" fill="none" stroke="#18345e" strokeWidth="4" opacity=".11" />
              <path d="M-20 282 C 130 245, 325 270, 520 208" fill="none" stroke="#18345e" strokeWidth="4" opacity=".1" />
              <path d="M382 -15 C 332 92, 360 218, 300 365" fill="none" stroke="#18345e" strokeWidth="4" opacity=".1" />
              <ellipse cx="278" cy="135" rx="118" ry="91" fill="none" stroke="#18345e" strokeWidth="3" strokeDasharray="9 9" opacity=".19" />
              <circle cx="278" cy="135" r="48" fill="#f5b942" opacity=".15" />
            </svg>
            <span className={`${styles.pin} ${styles.pinKaty}`}><MapPin />Katy</span>
            <span className={`${styles.pin} ${styles.pinHouston}`}><MapPin />Houston</span>
            <span className={`${styles.pin} ${styles.pinSugarLand}`}><MapPin />Sugar Land</span>
            <span className={`${styles.pin} ${styles.pinPearland}`}><MapPin />Pearland</span>
            <span className={styles.mapAction}>Explore the directory <ArrowRight /></span>
          </Link>

          <div className={styles.providerList}>
            {providers.map(([category, name, location]) => (
              <article key={name} className={styles.providerCard}>
                <p>{category}</p>
                <h3>{name}</h3>
                <div>
                  <span><MapPin />{location}</span>
                  <Link href="/support/find">Website <ExternalLink /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.portalSection} aria-labelledby="portal-heading">
        <div className={styles.sectionInner}>
          <div className={styles.portalBanner}>
            <div className={styles.portalOrnamentLeft} aria-hidden />
            <div className={styles.portalOrnamentRight} aria-hidden />
            <div className={styles.portalCopy}>
              <p>For enrolled families</p>
              <h2 id="portal-heading">Already a Texas ABA family?</h2>
              <span>Sign in for session notes, goals, and messaging with your BCBA and RBT.</span>
              <Link href="/client">Go to Client Portal <ArrowRight /></Link>
            </div>
            <div className={styles.portalVisual} aria-hidden>
              <Laptop />
              <Lock />
              <i /><i />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.urgentStrip}>
        <Heart aria-hidden />
        <a href="tel:988">For urgent help, call or text 988</a>
      </section>
    </main>
  );
}
