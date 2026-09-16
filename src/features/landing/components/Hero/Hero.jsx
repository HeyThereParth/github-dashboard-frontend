import { Link } from 'react-router-dom';
import { ArrowRight, GitPullRequest, Clock, Activity, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './Hero.module.css';

export const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.eyebrow}>
        <span className={styles.eyebrowDot} aria-hidden="true" />
        <span>Engineering Intelligence & Telemetry</span>
      </div>

      <h1 className={styles.title}>
        Operational clarity for engineering teams
      </h1>

      <p className={styles.description}>
        Continuous telemetry across pull requests, merge latency, cycle time distribution, and repository activity. Build operational insight without gamifying developers.
      </p>

      <div className={styles.ctaGroup}>
        <Link to="/signup">
          <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
            Connect Your Repositories
          </Button>
        </Link>
        <Link to="/app/overview">
          <Button variant="secondary" size="lg">
            Explore Live Dashboard
          </Button>
        </Link>
      </div>

      <div className={styles.signalsRow}>
        <div className={styles.signal}>
          <GitPullRequest size={14} className={styles.signalIcon} />
          <span>PR Throughput Tracking</span>
        </div>
        <div className={styles.signal}>
          <Clock size={14} className={styles.signalIcon} />
          <span>P50 & P90 Cycle Time</span>
        </div>
        <div className={styles.signal}>
          <Activity size={14} className={styles.signalIcon} />
          <span>Delivery Velocity</span>
        </div>
        <div className={styles.signal}>
          <ShieldCheck size={14} className={styles.signalIcon} />
          <span>Non-Gamified Observability</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
