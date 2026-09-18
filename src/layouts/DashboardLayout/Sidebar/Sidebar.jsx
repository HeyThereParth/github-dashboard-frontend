import { NavLink } from 'react-router-dom';
import {
  Boxes,
  LayoutDashboard,
  FolderGit2,
  GitPullRequest,
  LineChart,
  Activity,
  SlidersHorizontal,
} from 'lucide-react';
import { WorkspaceSelector } from '@/features/workspace';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/app/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/app/repositories', label: 'Repositories', icon: FolderGit2 },
  { to: '/app/pull-requests', label: 'Pull Requests', icon: GitPullRequest },
  { to: '/app/analytics', label: 'Analytics', icon: LineChart },
  { to: '/app/pipeline', label: 'Pipeline Health', icon: Activity },
  { to: '/app/settings', label: 'Settings', icon: SlidersHorizontal },
];

export const Sidebar = ({ onNavigate = null }) => {
  return (
    <aside className={styles.sidebar}>
      {/* Branding */}
      <div className={styles.brand}>
        <div className={styles.brandIcon} aria-hidden="true">
          <Boxes size={18} />
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandTag}>INTELLIGENCE</span>
          <span className={styles.brandTitle}>GitHub Intelligence</span>
        </div>
      </div>

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

      {/* Footer / System Status */}
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
