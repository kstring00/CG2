import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Sparkles,
} from 'lucide-react';
import CrisisPill from '@/components/CrisisPill';
import HomeSupportHub from '@/components/home/HomeSupportHub';
import styles from './page.module.css';

const credibilityChecks = [
  'Ease the mental and emotional load of caregiving',
  'Build confidence with clear tools and guidance',
  'Connect to local ABA providers and parent support',
] as const;

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
            <p className={styles.heroNote}>No sign-up. Built for Texas ABA Centers families.</p>
          </div>
        </div>
        <div className={styles.heroWave} aria-hidden />
      </section>

      <HomeSupportHub />

      <section className={styles.urgentStrip}>
        <Heart aria-hidden />
        <a href="tel:988">For urgent help, call or text 988</a>
      </section>
    </main>
  );
}
