import type { Metadata } from 'next';
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
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: "Home",
  description:
    "Real autism support for real families \u2014 free, with no sign-up required.",
};


const credibilityChecks = [
  'Ease the mental and emotional load of caregiving',
  'Build confidence with clear tools and guidance',
  'Connect to local ABA providers and parent support',
] as const;

export default function DesignPreviewPage() {
  return (
    <main id="main" className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" aria-label="Common Ground home" className={styles.logoLink}>
            <Image
              src={SITE.logoSrc}
              alt={SITE.orgName}
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
          src="/portal-hero.png"
          alt="A parent and child doing a puzzle together at the kitchen table"
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
              <Heart aria-hidden /> Free · no sign-up · built with BCBAs
            </span>
            <h1>
              Real autism support for <em>real</em> families
            </h1>
            <p className={styles.heroLead}>
              For parents raising a child on the spectrum — newly diagnosed, waiting on an evaluation, or years into it.
            </p>
            <p className={styles.heroBody}>
              Find local providers, parent tools, and a clear next step. Less time searching, more time present.
            </p>
            <div className={styles.checks} data-reveal data-reveal-delay="1">
              {credibilityChecks.map((item) => (
                <span key={item}>
                  <CheckCircle2 aria-hidden /> {item}
                </span>
              ))}
            </div>
            <div className={styles.heroButtons} data-reveal data-reveal-delay="2">
              <Link href="/support/intake" className={styles.primaryCta}>
                <Sparkles aria-hidden /> Find My Next Step <ArrowRight aria-hidden />
              </Link>
              <Link href="/support" className={styles.secondaryCta}>
                Browse all support
              </Link>
            </div>
            <p className={styles.heroNote} data-reveal data-reveal-delay="3">Free for every family. No account needed.</p>
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
