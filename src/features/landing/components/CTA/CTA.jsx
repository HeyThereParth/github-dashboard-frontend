import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './CTA.module.css';

export const CTA = () => {
  return (
    <section className={styles.section} aria-label="Closing Call to Action">
      <span className={styles.eyebrow}>START WITH GITHUB</span>
      <h2 className={styles.title}>
        See the work behind the code.
      </h2>
      <p className={styles.description}>
        Connect your repositories and get a clearer view of how engineering work is moving.
      </p>

      <Link to="/signup" className={styles.ctaButton}>
        <span>Get Started</span>
        <ArrowRight size={15} aria-hidden="true" />
      </Link>

      {/* Visual continuation of the event stream */}
      <div className={styles.eventContinuation} aria-hidden="true">
        <span className={styles.eventTag}>
          PR #142 → <span className={styles.mintText}>MERGED</span>
        </span>
        <span className={styles.eventTag}>
          PR #389 → <span className={styles.coralText}>OPEN</span>
        </span>
        <span className={styles.eventTag}>
          PR #401 → <span className={styles.goldText}>REVIEW</span>
        </span>
        <span className={styles.eventTag}>
          PR #422 → <span className={styles.mintText}>MERGED</span>
        </span>
      </div>
    </section>
  );
};

export default CTA;
