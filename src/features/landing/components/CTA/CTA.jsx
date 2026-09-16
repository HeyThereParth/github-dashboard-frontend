import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './CTA.module.css';

export const CTA = () => {
  return (
    <section className={styles.section} aria-label="Call to Action">
      <div className={styles.ctaCard}>
        <span className={styles.eyebrow}>GET STARTED TODAY</span>
        <h2 className={styles.title}>
          Bring operational intelligence to your engineering workflow
        </h2>
        <p className={styles.description}>
          Connect your GitHub repositories in minutes. Gain immediate insight into pull request cycle times, delivery velocity, and synchronization health.
        </p>
        <div className={styles.actions}>
          <Link to="/signup">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
              Create Free Account
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
