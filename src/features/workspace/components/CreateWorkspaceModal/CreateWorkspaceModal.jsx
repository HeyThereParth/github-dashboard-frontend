import { useState, useEffect, useRef, useCallback } from 'react';
import { Building2, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useWorkspace } from '../../hooks/useWorkspace';
import styles from './CreateWorkspaceModal.module.css';

/**
 * Accessible modal dialog for creating a new workspace.
 * Reuses `useWorkspace` mutation directly.
 */
export const CreateWorkspaceModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const { createWorkspace, isCreating } = useWorkspace();

  const handleClose = useCallback(() => {
    setName('');
    setError(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // Focus input on mount
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isCreating) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCreating, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setError(null);
    try {
      await createWorkspace({ name: trimmed });
      handleClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          'Failed to create workspace. Please verify connection and try again.'
      );
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isCreating) {
          handleClose();
        }
      }}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-workspace-title"
      >
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.iconWrapper} aria-hidden="true">
              <Building2 size={18} />
            </div>
            <div className={styles.titleGroup}>
              <span className={styles.tag}>Organization • Provisioning</span>
              <h2 id="create-workspace-title" className={styles.title}>
                Create Workspace
              </h2>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close dialog"
            disabled={isCreating}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="modal-workspace-name" className={styles.label}>
              Workspace Name
            </label>
            <Input
              ref={inputRef}
              id="modal-workspace-name"
              type="text"
              placeholder="e.g. Acme Engineering, Platform Core"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
              required
            />
            <span className={styles.hint}>
              Workspaces isolate tracked repositories, analytics, and GitHub installations.
            </span>
          </div>

          <div className={styles.footer}>
            <Button
              variant="ghost"
              size="md"
              type="button"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={!name.trim() || isCreating}
              leftIcon={<Plus size={15} />}
            >
              {isCreating ? 'Creating Workspace...' : 'Create Workspace'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
