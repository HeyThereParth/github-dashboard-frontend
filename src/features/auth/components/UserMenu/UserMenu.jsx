import { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Button } from '@/components/ui/Button';
import styles from './UserMenu.module.css';

/**
 * User menu dropdown displayed in TopBar showing profile details and sign-out action.
 */
export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { data: me } = useCurrentUser();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = me?.name || user?.user_metadata?.full_name || 'Developer';
  const displayEmail = me?.email || user?.email || '';
  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const handleSignOut = async () => {
    setIsOpen(false);
    try {
      await signOut();
    } catch (err) {
      console.error('[UserMenu] Error signing out:', err);
    }
  };

  return (
    <div className={styles.container} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="User profile and account settings"
        aria-expanded={isOpen}
      >
        {initials ? <span>{initials}</span> : <User size={15} />}
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.userInfo}>
            <span className={styles.userName}>{displayName}</span>
            {displayEmail && <span className={styles.userEmail}>{displayEmail}</span>}
          </div>

          <div className={styles.menuAction}>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              leftIcon={<LogOut size={14} />}
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
