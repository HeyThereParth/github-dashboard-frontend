import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';

export const PipelinePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px' }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-tracked)' }}>
            OBSERVABILITY • PIPELINE HEALTH
          </span>
        </div>
        <h1>Pipeline health</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Continuous integration status, failure rates, and delivery pipeline efficiency across active trunks.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Pipeline Health Shell Ready</CardTitle>
            <CardDescription>
              Placeholder container rendered within DashboardLayout. Real pipeline health endpoints will connect in Phase 7.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-secondary)' }}>
            Active route: <code>/app/pipeline</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelinePage;
