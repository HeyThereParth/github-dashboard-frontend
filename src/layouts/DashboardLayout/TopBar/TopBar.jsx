import {
  Menu,
  ChevronDown,
  Calendar,
  Search,
} from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { useWorkspace } from '@/features/workspace';
import UserMenu from '@/features/auth/components/UserMenu';
import styles from './TopBar.module.css';

export const TopBar = ({
  onToggleMobileMenu,
  scopeName,
  syncStatusText,
  windowText = 'Window: Last 30 days',
}) => {
  const { currentWorkspace, workspaceDetail } = useWorkspace();

  const displayScope = scopeName || currentWorkspace?.name || 'Workspace';
  const isConnected = Boolean(
    workspaceDetail?.is_github_connected ??
      (currentWorkspace?.is_github_connected ?? (currentWorkspace?.github_installation_id != null))
  );
  const statusDisplay = syncStatusText || (isConnected ? 'Sync active' : 'GitHub not connected');

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
            <span>{displayScope}</span>
            <ChevronDown size={12} color="var(--color-text-muted)" />
          </button>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.syncStatus}>
          <span
            className={styles.syncDot}
            style={{ backgroundColor: isConnected ? 'var(--color-success, #10b981)' : 'var(--color-text-muted, #71717a)' }}
            aria-hidden="true"
          />
          <span className={styles.syncText}>{statusDisplay}</span>
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

        <UserMenu />
      </div>
    </header>
  );
};

export default TopBar;
