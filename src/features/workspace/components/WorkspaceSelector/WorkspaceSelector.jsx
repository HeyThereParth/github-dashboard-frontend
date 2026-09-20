import { useState, useRef, useEffect } from 'react';
import { Building2, ChevronsUpDown, Check, Plus } from 'lucide-react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Button } from '@/components/ui/Button';
import { CreateWorkspaceModal } from '../CreateWorkspaceModal';
import styles from './WorkspaceSelector.module.css';

/**
 * Workspace switcher dropdown embedded in the sidebar footer.
 * Supports switching active workspace and creating a new workspace.
 */
export const WorkspaceSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    workspaces,
    selectedWorkspaceId,
    currentWorkspace,
    setSelectedWorkspaceId,
  } = useWorkspace();

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    setSelectedWorkspaceId(id);
    setIsOpen(false);
  };

  const displayName = currentWorkspace?.name || (workspaces.length > 0 ? workspaces[0].name : 'Select Workspace');

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Workspace selector"
        aria-expanded={isOpen}
      >
        <div className={styles.triggerLeft}>
          <Building2 size={14} color="var(--color-text-muted)" />
          <span className={styles.workspaceName}>{displayName}</span>
        </div>
        <ChevronsUpDown size={14} color="var(--color-text-muted)" />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownTitle}>Workspaces</div>

          <ul className={styles.list}>
            {workspaces.map((ws) => {
              const isActive = ws.id === selectedWorkspaceId;
              return (
                <li key={ws.id}>
                  <button
                    type="button"
                    className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                    onClick={() => handleSelect(ws.id)}
                  >
                    <span>{ws.name}</span>
                    {isActive && <Check size={14} className={styles.checkIcon} />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className={styles.divider} aria-hidden="true" />

          <Button
            variant="ghost"
            size="sm"
            fullWidth
            leftIcon={<Plus size={14} />}
            onClick={() => {
              setIsOpen(false);
              setIsCreateModalOpen(true);
            }}
          >
            Create Workspace
          </Button>
        </div>
      )}

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default WorkspaceSelector;
