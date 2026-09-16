import { Link } from 'react-router-dom';
import styles from './MarketingFooter.module.css';

export const MarketingFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <span>GitHub Intelligence</span>
          <span className={styles.dot} aria-hidden="true" />
          <span>Engineering Intelligence & Telemetry Platform</span>
        </div>

        <div className={styles.links}>
          <Link to="/app/overview" className={styles.link}>
            Application Shell
          </Link>
          <Link to="/design-system" className={styles.link}>
            Design System
          </Link>
          <Link to="/health-test" className={styles.link}>
            API Health Probe
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
