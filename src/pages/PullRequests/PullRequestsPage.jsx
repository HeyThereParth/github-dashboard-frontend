import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';

export const PullRequestsPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px' }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-tracked)' }}>
            REPOSITORY INTELLIGENCE • DELIVERY VELOCITY
          </span>
        </div>
        <h1>Pull requests</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Explore activity, review stages, and merge outcomes across your repositories.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Pull Requests Shell Ready</CardTitle>
            <CardDescription>
              Placeholder container rendered within DashboardLayout. PR explorer tables, filtering, and pagination will connect in Phase 5.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-secondary)' }}>
            Active route: <code>/app/pull-requests</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PullRequestsPage;
