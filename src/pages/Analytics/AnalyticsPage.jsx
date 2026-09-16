import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';

export const AnalyticsPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1200px' }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-tracked)' }}>
            TELEMETRY • LONGITUDINAL AUDIT
          </span>
        </div>
        <h1>Analytics</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Longitudinal movement and cycle times across repository clusters.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Analytics Shell Ready</CardTitle>
            <CardDescription>
              Placeholder container rendered within DashboardLayout. Throughput charts, cycle time distributions, and contributor metrics will connect in Phase 6.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-secondary)' }}>
            Active route: <code>/app/analytics</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
