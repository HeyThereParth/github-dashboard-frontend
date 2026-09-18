import { Link } from 'react-router-dom';
import styles from './MarketingFooter.module.css';

export const MarketingFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <span className={styles.brandTitle}>GitHub Intelligence</span>
          <span className={styles.brandSubtitle}>
            Engineering intelligence from the work already happening in GitHub.
          </span>
        </div>

        <div className={styles.right}>
          <div className={styles.links}>
            <a href="#features" className={styles.link}>
              Features
            </a>
            <a href="#pipeline" className={styles.link}>
              How It Works
            </a>
            <Link to="/app/overview" className={styles.link}>
              Dashboard
            </Link>
            <Link to="/login" className={styles.link}>
              Log In
            </Link>
            <Link to="/signup" className={styles.link}>
              Get Started
            </Link>
          </div>
          <span className={styles.copyright}>© 2026 GitHub Intelligence</span>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
