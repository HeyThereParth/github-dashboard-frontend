import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';

export const OverviewPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px' }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-tracked)' }}>
            TELEMETRY CORE
          </span>
          <span style={{ color: 'var(--color-text-muted)' }}>•</span>
          <span style={{ color: 'var(--palette-mint)', fontSize: 'var(--font-size-metadata)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--palette-mint)' }} />
            Live Telemetry Active
          </span>
        </div>
        <h1>Engineering overview</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Pull request throughput, cycle time, and active repository velocity across infrastructure.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Overview Shell Ready</CardTitle>
            <CardDescription>
              Placeholder container rendered within DashboardLayout. Page features will be integrated in subsequent phases.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-secondary)' }}>
            Active route: <code>/app/overview</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewPage;
