import { useState, useRef, useEffect } from 'react';
import { Building2, ChevronsUpDown, Check, Plus } from 'lucide-react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Button } from '@/components/ui/Button';
import styles from './WorkspaceSelector.module.css';

/**
 * Workspace switcher dropdown embedded in the sidebar footer.
 * Supports switching active workspace and creating a new workspace.
 */
export const WorkspaceSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [createError, setCreateError] = useState(null);

  const {
    workspaces,
    selectedWorkspaceId,
    currentWorkspace,
    setSelectedWorkspaceId,
    createWorkspace,
    isCreating: isSubmittingCreate,
  } = useWorkspace();

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsCreating(false);
        setNewWorkspaceName('');
        setCreateError(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    setSelectedWorkspaceId(id);
    setIsOpen(false);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    setCreateError(null);
    try {
      await createWorkspace({ name: newWorkspaceName.trim() });
      setNewWorkspaceName('');
      setIsCreating(false);
      setIsOpen(false);
    } catch (err) {
      setCreateError(err.response?.data?.detail || err.message || 'Failed to create workspace');
    }
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

          {isCreating ? (
            <form onSubmit={handleCreateSubmit} className={styles.createForm}>
              <input
                type="text"
                placeholder="Workspace name..."
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className={styles.createInput}
                autoFocus
                disabled={isSubmittingCreate}
              />
              {createError && (
                <span style={{ color: 'var(--color-error)', fontSize: '11px' }}>
                  {createError}
                </span>
              )}
              <div className={styles.createActions}>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={!newWorkspaceName.trim() || isSubmittingCreate}
                >
                  {isSubmittingCreate ? 'Creating...' : 'Create'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setCreateError(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              leftIcon={<Plus size={14} />}
              onClick={() => setIsCreating(true)}
            >
              Create Workspace
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkspaceSelector;
