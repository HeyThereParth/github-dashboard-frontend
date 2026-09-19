import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks';
import { SignalNetwork } from './SignalNetwork';
import styles from './Hero.module.css';

/**
 * Stagger delay offsets for the initial content reveal.
 * eyebrow → headline → description → CTA → visualization
 */
const STAGGER = {
  eyebrow: 0,
  headline: 0.1,
  description: 0.2,
  cta: 0.3,
  visual: 0.25,
};

const REVEAL_Y = 12;
const REVEAL_DURATION = 0.45;

export const Hero = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const reveal = (delay) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: REVEAL_Y },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: REVEAL_DURATION,
            ease: 'easeOut',
            delay,
          },
        };

  return (
    <section className={styles.heroSection} aria-label="Introduction">
      <div className={styles.heroContainer}>
        {/* ── Left column: editorial content ── */}
        <div className={styles.heroLeft}>
          <motion.div className={styles.eyebrow} {...reveal(STAGGER.eyebrow)}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span>GITHUB ENGINEERING INTELLIGENCE</span>
          </motion.div>

          <motion.h1 className={styles.title} {...reveal(STAGGER.headline)}>
            Know what&rsquo;s{' '}
            <span className={styles.highlight}>moving</span>
            <br />
            in your engineering team.
          </motion.h1>

          <motion.p className={styles.description} {...reveal(STAGGER.description)}>
            Turn GitHub activity into a clear view of what&rsquo;s moving,
            what&rsquo;s slowing down, and what needs attention.
          </motion.p>

          <motion.div {...reveal(STAGGER.cta)}>
            <Link to="/signup" className={styles.primaryCta}>
              <span>Connect GitHub</span>
              <span className={styles.ctaArrow} aria-hidden="true">
                <ArrowRight size={15} />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* ── Right column: signal visualization ── */}
        <motion.div
          className={styles.heroRight}
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                transition: {
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: STAGGER.visual,
                },
              })}
        >
          <SignalNetwork />
        </motion.div>
      </div>

      {/* ── Metric strip ── */}
      <div className={styles.metricStrip} aria-hidden="true">
        <div className={styles.metricItem}>
          <span className={styles.metricValue}>12</span>
          <span className={styles.metricLabel}>REPOSITORIES</span>
        </div>

        <span className={styles.metricDivider} />

        <div className={styles.metricItem}>
          <span className={styles.metricValue}>14.2h</span>
          <span className={styles.metricLabel}>P50 CYCLE TIME</span>
        </div>

        <span className={styles.metricDivider} />

        <div className={styles.metricItem}>
          <span className={styles.metricValue}>842</span>
          <span className={styles.metricLabel}>PRS MERGED</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
