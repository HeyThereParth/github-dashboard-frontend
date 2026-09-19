import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './MarketingNavbar.module.css';

export const MarketingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.container}>
        {/* Left: Minimal Brand */}
        <Link to="/" className={styles.brand} aria-label="GitHub Intelligence Home">
          <img
            src="/logo.png"
            alt=""
            className={styles.brandLogo}
            aria-hidden="true"
          />
          <span className={styles.brandTitle}>GitHub Intelligence</span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className={styles.nav} aria-label="Public Navigation">
          <a href="#features" className={styles.navLink}>
            Features
          </a>
          <a href="#pipeline" className={styles.navLink}>
            How It Works
          </a>
          <Link to="/app/overview" className={styles.navLink}>
            Dashboard
          </Link>
        </nav>

        {/* Right: Quiet Login + Gold CTA */}
        <div className={styles.actions}>
          <Link to="/login" className={styles.loginLink}>
            Log In
          </Link>
          <Link to="/signup" className={styles.ctaButton}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MarketingNavbar;
