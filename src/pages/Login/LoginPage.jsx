import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/features/auth';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/app/overview';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/overview', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      await signIn({ email, password });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div className={styles.iconWrapper} aria-hidden="true">
              <LogIn size={16} />
            </div>
            <div>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access GitHub Intelligence</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorBanner} role="alert">{error}</div>}

            <div className={styles.field}>
              <label htmlFor="login-email" className={styles.label}>
                Email Address
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="developer@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                disabled={isLoading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="login-password" className={styles.label}>
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              type="submit"
              disabled={isLoading || !email || !password}
              rightIcon={<ArrowRight size={15} />}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <div className={styles.footerRow}>
            <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              ← Home
            </Link>
            <span>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--palette-gold)', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
