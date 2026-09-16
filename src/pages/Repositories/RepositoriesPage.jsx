import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';

export const RepositoriesPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px' }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-tracked)' }}>
            WORKSPACE / REPOSITORIES
          </span>
        </div>
        <h1>Your repositories</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Repositories synchronized with GitHub Intelligence for automated telemetry, velocity analysis, and risk scoring.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Repositories Shell Ready</CardTitle>
            <CardDescription>
              Placeholder container rendered within DashboardLayout. Real API repository lists and sync actions will connect in Phase 4.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-secondary)' }}>
            Active route: <code>/app/repositories</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepositoriesPage;
