import { Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useWorkspace, GitHubConnectionCard } from '@/features/workspace';
import { formatRelativeTime } from '@/utils/date';

export const SettingsPage = () => {
  const { currentWorkspace, workspaceId } = useWorkspace();

  const workspaceName = currentWorkspace?.name || 'Workspace';
  const createdAt = currentWorkspace?.created_at ? formatRelativeTime(currentWorkspace.created_at) : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px' }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--font-size-label)',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-spacing-tracked)',
            }}
          >
            CONFIGURATION • WORKSPACE
          </span>
        </div>
        <h1>Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Manage workspace settings, GitHub App installations, synchronization parameters, and telemetry connections.
        </p>
      </header>

      {/* 1. Workspace Information Card */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--palette-gold)',
              }}
              aria-hidden="true"
            >
              <Building2 size={18} />
            </div>
            <div>
              <CardTitle>Workspace Profile</CardTitle>
              <CardDescription>Active workspace identifier and metadata</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--font-size-label)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                Workspace Name
              </span>
              <span style={{ fontSize: 'var(--font-size-body)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {workspaceName}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--font-size-label)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                Workspace UUID
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
                {workspaceId || '—'}
              </span>
            </div>

            {createdAt && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--font-size-label)',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  Created
                </span>
                <span style={{ fontSize: 'var(--font-size-secondary)', color: 'var(--color-text-secondary)' }}>
                  {createdAt}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. Real GitHub App Connection Management */}
      <GitHubConnectionCard />
    </div>
  );
};

export default SettingsPage;
