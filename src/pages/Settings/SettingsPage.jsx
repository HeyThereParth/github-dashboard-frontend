import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';

export const SettingsPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px' }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-tracked)' }}>
            CONFIGURATION • WORKSPACE
          </span>
        </div>
        <h1>Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Manage workspace settings, GitHub App installations, synchronization parameters, and team access.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Settings Shell Ready</CardTitle>
            <CardDescription>
              Placeholder container rendered within DashboardLayout. Real workspace settings and GitHub connections will connect in Phase 8.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-secondary)' }}>
            Active route: <code>/app/settings</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
