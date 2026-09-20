import { createBrowserRouter, Navigate } from 'react-router-dom';
import MarketingLayout from '@/layouts/MarketingLayout';
import LandingPage from '@/pages/Landing';
import LoginPage from '@/pages/Login';
import SignupPage from '@/pages/Signup';
import HealthTestPage from '@/pages/HealthTest';
import DesignSystemPage from '@/pages/DesignSystem';
import DashboardLayout from '@/layouts/DashboardLayout';
import OverviewPage from '@/pages/Overview';
import RepositoriesPage from '@/pages/Repositories';
import PullRequestsPage from '@/pages/PullRequests';
import AnalyticsPage from '@/pages/Analytics';
import SettingsPage from '@/pages/Settings';
import GitHubCallbackPage from '@/pages/GitHubCallback';
import { AuthGate } from '@/features/auth';
import { RouteErrorBoundary } from '@/components/ui/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MarketingLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
    ],
  },
  {
    path: '/github/callback',
    element: (
      <AuthGate>
        <GitHubCallbackPage />
      </AuthGate>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/health-test',
    element: <HealthTestPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/design-system',
    element: <DesignSystemPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/overview',
    element: (
      <AuthGate>
        <Navigate to="/app/overview" replace />
      </AuthGate>
    ),
  },
  {
    path: '/app',
    element: (
      <AuthGate>
        <DashboardLayout />
      </AuthGate>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/overview" replace />,
      },
      {
        path: 'overview',
        element: <OverviewPage />,
      },
      {
        path: 'repositories',
        element: <RepositoriesPage />,
      },
      {
        path: 'pull-requests',
        element: <PullRequestsPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      // {
      //   path: 'pipeline',
      //   element: <PipelinePage />,
      // },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/app/overview" replace />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <AuthGate>
        <Navigate to="/app/overview" replace />
      </AuthGate>
    ),
    errorElement: <RouteErrorBoundary />,
  },
]);

export default router;
