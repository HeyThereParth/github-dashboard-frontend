import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './Hero.module.css';

export const Hero = () => {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.eyebrow}>
        <span className={styles.eyebrowDot} aria-hidden="true" />
        <span>GITHUB ENGINEERING INTELLIGENCE</span>
      </div>

      <h1 className={styles.title}>
        See how your engineering work is moving.
      </h1>

      <p className={styles.description}>
        GitHub Intelligence turns the activity already happening in your repositories and pull requests into a clearer view of what is moving, what is taking time, and what is changing.
      </p>

      <div className={styles.ctaGroup}>
        <Link to="/signup" className={styles.primaryCta}>
          <span>Connect GitHub</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <Link to="/app/overview" className={styles.secondaryCta}>
          <span>Explore Dashboard</span>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
