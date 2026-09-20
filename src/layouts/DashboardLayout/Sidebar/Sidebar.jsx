import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  GitPullRequest,
  LineChart,
  SlidersHorizontal,
} from 'lucide-react';
import { WorkspaceSelector } from '@/features/workspace';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/app/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/app/repositories', label: 'Repositories', icon: FolderGit2 },
  { to: '/app/pull-requests', label: 'Pull Requests', icon: GitPullRequest },
  { to: '/app/analytics', label: 'Analytics', icon: LineChart },
];

export const Sidebar = ({ onNavigate = null }) => {
  return (
    <aside className={styles.sidebar}>
        {/* Branding */}
        <Link
          to="/app/overview"
          className={styles.brand}
          onClick={onNavigate}
          aria-label="GitHub Intelligence Dashboard"
        >
          <img
            src="/logo.png"
            alt=""
            className={styles.brandLogo}
            aria-hidden="true"
          />
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>GitHub Intelligence</span>
          </div>
        </Link>

        {/* Section Header */}
        <div className={styles.sectionLabel}>TELEMETRY CORE</div>

        {/* Navigation */}
        <nav className={styles.nav} aria-label="Main Navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon} aria-hidden="true">
                <Icon size={15} />
              </span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Lower Utility Section: Create Workspace & Settings */}
        <div className={styles.lowerSection}>
          <NavLink
            to="/app/settings"
            onClick={onNavigate}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon} aria-hidden="true">
              <SlidersHorizontal size={15} />
            </span>
            <span>Settings</span>
          </NavLink>
        </div>

        {/* Footer / System Status & Workspace Selector */}
        <div className={styles.footer}>
          <div className={styles.statusRow}>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>App Connected</span>
            </div>
            <span className={styles.versionTag}>V2.4.1</span>
          </div>

          <WorkspaceSelector />
        </div>
      </aside>
  );
};

export default Sidebar;

