import {
  Menu,
  ChevronDown,
  Calendar,
  Search,
  User,
} from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import styles from './TopBar.module.css';

export const TopBar = ({
  onToggleMobileMenu,
  scopeName = 'org/acme-infrastructure',
  syncStatusText = 'Last PR ingested 42s ago',
  windowText = 'Window: Last 30 days',
}) => {
  return (
    <header className={styles.topBar}>
      {/* Left Area: Scope and Sync Status */}
      <div className={styles.leftSection}>
        {onToggleMobileMenu && (
          <IconButton
            variant="ghost"
            size="sm"
            className={styles.mobileMenuBtn}
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </IconButton>
        )}

        <div className={styles.scopeGroup}>
          <span className={styles.scopeLabel}>SCOPE</span>
          <button
            type="button"
            className={styles.scopeSelector}
            aria-label="Select organization or repository scope"
          >
            <span>{scopeName}</span>
            <ChevronDown size={12} color="var(--color-text-muted)" />
          </button>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.syncStatus}>
          <span className={styles.syncDot} aria-hidden="true" />
          <span className={styles.syncText}>Sync active</span>
          <span>•</span>
          <span>{syncStatusText}</span>
        </div>
      </div>

      {/* Right Area: Controls, Window, Search, Profile */}
      <div className={styles.rightSection}>
        <button
          type="button"
          className={styles.windowButton}
          aria-label="Select telemetry date window"
        >
          <Calendar size={13} color="var(--color-text-muted)" />
          <span>{windowText}</span>
          <ChevronDown size={12} color="var(--color-text-muted)" />
        </button>

        <IconButton
          variant="outline"
          size="sm"
          aria-label="Search dashboard and telemetry"
        >
          <Search size={14} />
        </IconButton>

        <button
          type="button"
          className={styles.avatarButton}
          aria-label="User profile and account settings"
        >
          <User size={15} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
