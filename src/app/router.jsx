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
import PipelinePage from '@/pages/Pipeline';
import SettingsPage from '@/pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MarketingLayout />,
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
    path: '/health-test',
    element: <HealthTestPage />,
  },
  {
    path: '/design-system',
    element: <DesignSystemPage />,
  },
  {
    path: '/app',
    element: <DashboardLayout />,
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
      {
        path: 'pipeline',
        element: <PipelinePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;
