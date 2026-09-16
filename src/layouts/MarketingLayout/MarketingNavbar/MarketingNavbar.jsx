import { Link } from 'react-router-dom';
import { Boxes } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './MarketingNavbar.module.css';

export const MarketingNavbar = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Branding */}
        <Link to="/" className={styles.brand} aria-label="GitHub Intelligence Home">
          <div className={styles.brandIcon} aria-hidden="true">
            <Boxes size={18} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTag}>INTELLIGENCE</span>
            <span className={styles.brandTitle}>GitHub Intelligence</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className={styles.nav} aria-label="Public Navigation">
          <a href="#features" className={styles.navLink}>
            Features
          </a>
          <a href="#how-it-works" className={styles.navLink}>
            How It Works
          </a>
          <a href="#preview" className={styles.navLink}>
            Platform Preview
          </a>
          <Link to="/app/overview" className={styles.navLink}>
            Live Dashboard
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MarketingNavbar;
