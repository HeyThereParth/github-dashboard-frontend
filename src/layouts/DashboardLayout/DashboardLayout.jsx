import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import styles from './DashboardLayout.module.css';

export const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={styles.layout}>
      {/* Mobile backdrop */}
      <div
        className={`${styles.backdrop} ${mobileMenuOpen ? styles.mobileOpen : ''}`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className={`${styles.sidebarContainer} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
        <Sidebar onNavigate={closeMobileMenu} />
      </div>

      {/* Main Area */}
      <div className={styles.mainWrapper}>
        <TopBar onToggleMobileMenu={toggleMobileMenu} />
        <main className={styles.contentArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
