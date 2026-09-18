import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useWorkspace } from '../../hooks/useWorkspace';
import styles from './CreateFirstWorkspace.module.css';

/**
 * Onboarding screen displayed when an authenticated user has zero workspaces.
 */
export const CreateFirstWorkspace = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const { createWorkspace, isCreating } = useWorkspace();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    try {
      await createWorkspace({ name: name.trim() });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to create workspace');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div className={styles.iconWrapper} aria-hidden="true">
                <Building2 size={18} />
              </div>
              <div>
                <CardTitle>Create Your First Workspace</CardTitle>
                <CardDescription>
                  Workspaces group tracked repositories, pull request telemetry, and GitHub connections.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.errorBanner}>{error}</div>}

              <div>
                <label
                  htmlFor="first-workspace-name"
                  style={{
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontSize: 'var(--font-size-secondary)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Workspace Name
                </label>
                <Input
                  id="first-workspace-name"
                  type="text"
                  placeholder="e.g. Acme Engineering, Platform Core"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isCreating}
                  required
                  autoFocus
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                fullWidth
                disabled={!name.trim() || isCreating}
                leftIcon={<Plus size={16} />}
              >
                {isCreating ? 'Creating Workspace...' : 'Create Workspace'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateFirstWorkspace;
