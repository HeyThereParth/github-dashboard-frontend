import { Link } from 'react-router-dom';
import { useHealth } from '../../hooks/useHealth';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingState } from '../../components/ui/LoadingState';

export const HealthTestPage = () => {
  const { data, isLoading, isError, error, isSuccess, refetch, isFetching } = useHealth();

  return (
    <main style={{ padding: 'var(--space-8)', maxWidth: '640px', margin: '0 auto', fontFamily: 'var(--font-body)' }}>
      <nav style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
          ← Back to Home
        </Link>
      </nav>

      <h1>Health Test</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
        Testing backend connectivity to <code>GET /health</code>
      </p>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <Card>
          <CardContent>
            {isLoading && (
              <div role="status">
                <LoadingState message="Checking backend connection..." />
              </div>
            )}

            {isError && (
              <div role="alert" style={{ color: 'var(--color-error)' }}>
                <p><strong>Backend connection failed</strong></p>
                <pre style={{ background: 'var(--color-surface-sunken)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', overflowX: 'auto', color: 'var(--palette-coral)', marginTop: 'var(--space-2)' }}>
                  {error?.message || 'Unknown error occurred'}
                </pre>
              </div>
            )}

            {isSuccess && (
              <div style={{ color: 'var(--color-success)' }}>
                <p><strong>Backend connected</strong></p>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>Health Response:</p>
                <pre style={{ background: 'var(--color-surface-sunken)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', overflowX: 'auto', color: 'var(--color-text-primary)', marginTop: 'var(--space-2)' }}>
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div style={{ marginTop: 'var(--space-4)' }}>
        <Button
          variant="secondary"
          size="md"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? 'Checking...' : 'Recheck Health'}
        </Button>
      </div>
    </main>
  );
};

export default HealthTestPage;
