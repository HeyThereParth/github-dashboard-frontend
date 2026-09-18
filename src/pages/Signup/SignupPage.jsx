import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/features/auth';
import styles from './SignupPage.module.css';

export const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/overview', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const data = await signUp({ email, password });
      if (data.session) {
        // Auto-confirmed or immediate session
        navigate('/app/overview', { replace: true });
      } else {
        // Confirmation email required by Supabase settings
        setSuccessMessage(
          'Account created successfully! Please check your email inbox to confirm your address, then sign in.',
        );
      }
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
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
              <UserPlus size={16} />
            </div>
            <div>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Register for GitHub Intelligence access</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorBanner} role="alert">{error}</div>}
            {successMessage && <div className={styles.successBanner} role="status">{successMessage}</div>}

            <div className={styles.field}>
              <label htmlFor="signup-email" className={styles.label}>
                Email Address
              </label>
              <Input
                id="signup-email"
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
              <label htmlFor="signup-password" className={styles.label}>
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="signup-confirm-password" className={styles.label}>
                Confirm Password
              </label>
              <Input
                id="signup-confirm-password"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              type="submit"
              disabled={isLoading || !email || !password || !confirmPassword}
              rightIcon={<ArrowRight size={15} />}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <div className={styles.footerRow}>
            <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              ← Home
            </Link>
            <span>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--palette-gold)', textDecoration: 'none' }}>
                Sign In
              </Link>
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
