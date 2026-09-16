import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const SignupPage = () => {
  return (
    <div style={{ maxWidth: '460px', margin: 'var(--space-12) auto', padding: '0 var(--space-4)', width: '100%' }}>
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--palette-mint)' }}>
              <UserPlus size={16} />
            </div>
            <div>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Authentication placeholder (Phase 8)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-body)', lineHeight: 1.6 }}>
            Sign-up and account creation workflows will be implemented in <strong>Phase 8</strong>. In the meantime, you can explore the application shell and telemetry views.
          </p>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Link to="/app/overview">
              <Button variant="primary" fullWidth size="lg">
                Enter Telemetry Dashboard →
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" fullWidth size="md">
                Already have an account? Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-secondary)' }}>
            ← Back to GitHub Intelligence Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
