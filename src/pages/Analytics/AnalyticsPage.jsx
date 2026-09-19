import { useSearchParams, Link } from 'react-router-dom';
import { BarChart3, FolderGit2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useWorkspace, useTrackedRepositories } from '@/features/repositories';
import {
  useAnalyticsOverview,
  useAnalyticsThroughput,
  useAnalyticsAuthors,
  useAnalyticsActivity,
  useAnalyticsCycleTimeTrend,
  AnalyticsContextBar,
  AnalyticsKpiGrid,
  ThroughputChart,
  ContributorTable,
  CycleTimeTrendChart,
  PullRequestActivityChart,
} from '@/features/analytics';
import styles from './AnalyticsPage.module.css';

export const AnalyticsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. URL search parameters
  const paramRepositoryId = searchParams.get('repositoryId') || '';
  const paramRepo = searchParams.get('repo') || '';

  const parsedDays = parseInt(searchParams.get('days') || '30', 10);
  const days = [7, 30, 90].includes(parsedDays) ? parsedDays : 30;

  const parsedWeeks = parseInt(searchParams.get('weeks') || '8', 10);
  const weeks = [2, 8, 12].includes(parsedWeeks) ? parsedWeeks : 8;

  // 2. Resolve active workspace
  const {
    currentWorkspace,
    workspaceId,
    isLoading: isWorkspaceLoading,
    isError: isWorkspaceError,
    error: workspaceError,
    refetch: refetchWorkspace,
  } = useWorkspace();

  // 3. Resolve tracked repositories in workspace
  const {
    data: trackedRepos = [],
    isLoading: isTrackedLoading,
    isError: isTrackedError,
    error: trackedError,
    refetch: refetchTracked,
  } = useTrackedRepositories(workspaceId);

  // 4. Select active tracked repository
  let selectedRepo = null;
  if (trackedRepos.length > 0) {
    if (paramRepositoryId) {
      selectedRepo = trackedRepos.find((r) => r.id === paramRepositoryId);
    }
    if (!selectedRepo && paramRepo) {
      const lowerRepo = paramRepo.toLowerCase();
      selectedRepo = trackedRepos.find(
        (r) =>
          r.name?.toLowerCase() === lowerRepo ||
          r.full_name?.toLowerCase() === lowerRepo,
      );
    }
    if (!selectedRepo) {
      selectedRepo = trackedRepos[0];
    }
  }

  const repositoryId = selectedRepo?.id || null;

  // 5. Independent analytics queries
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    error: overviewError,
    refetch: refetchOverview,
  } = useAnalyticsOverview({
    workspaceId,
    repositoryId,
    days,
  });

  const {
    data: throughputData,
    isLoading: isThroughputLoading,
    isError: isThroughputError,
    error: throughputError,
    refetch: refetchThroughput,
  } = useAnalyticsThroughput({
    workspaceId,
    repositoryId,
    weeks,
  });

  const {
    data: authorsData,
    isLoading: isAuthorsLoading,
    isError: isAuthorsError,
    error: authorsError,
    refetch: refetchAuthors,
  } = useAnalyticsAuthors({
    workspaceId,
    repositoryId,
    days,
  });

  const {
    data: activityData,
    isLoading: isActivityLoading,
    isError: isActivityError,
    error: activityError,
    refetch: refetchActivity,
  } = useAnalyticsActivity({
    workspaceId,
    days,
    repositoryId,
  });

  const {
    data: cycleTimeData,
    isLoading: isCycleTimeLoading,
    isError: isCycleTimeError,
    error: cycleTimeError,
    refetch: refetchCycleTime,
  } = useAnalyticsCycleTimeTrend({
    workspaceId,
    weeks,
    repositoryId,
  });

  // 6. Navigation and parameter handlers
  const handleWindowChange = ({ days: nextDays, weeks: nextWeeks }) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('days', String(nextDays));
        next.set('weeks', String(nextWeeks));
        return next;
      },
      { replace: true },
    );
  };

  const handleSelectRepository = (newRepoId) => {
    const nextRepo = trackedRepos.find((r) => r.id === newRepoId);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('repositoryId', newRepoId);
        if (nextRepo) {
          next.set('repo', nextRepo.name || nextRepo.full_name);
        }
        return next;
      },
      { replace: true },
    );
  };

  // --- Initial / Workspace Loading & Error States ---

  if (isWorkspaceLoading || isTrackedLoading) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>
              TELEMETRY • LONGITUDINAL AUDIT
            </span>
            <h1 className={styles.title}>Analytics</h1>
            <p className={styles.description}>
              Longitudinal movement and cycle times across repository clusters.
            </p>
          </div>
        </header>
        <LoadingState variant="skeleton" rows={5} />
      </div>
    );
  }

  if (isWorkspaceError || isTrackedError) {
    const activeError = workspaceError || trackedError;
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>
              TELEMETRY • LONGITUDINAL AUDIT
            </span>
            <h1 className={styles.title}>Analytics</h1>
          </div>
        </header>
        <ErrorState
          title="Failed to load repository workspace"
          message={activeError?.message || 'Could not communicate with the service.'}
          onRetry={() => {
            if (isWorkspaceError) refetchWorkspace();
            if (isTrackedError) refetchTracked();
          }}
        />
      </div>
    );
  }

  if (!currentWorkspace) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>
              TELEMETRY • LONGITUDINAL AUDIT
            </span>
            <h1 className={styles.title}>Analytics</h1>
          </div>
        </header>
        <EmptyState
          icon={FolderGit2}
          title="No workspace found"
          description="A workspace is required to view analytics. Please connect or create a workspace."
        />
      </div>
    );
  }

  if (trackedRepos.length === 0) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>
              TELEMETRY • LONGITUDINAL AUDIT
            </span>
            <h1 className={styles.title}>Analytics</h1>
            <p className={styles.description}>
              Longitudinal movement and cycle times across repository clusters.
            </p>
          </div>
        </header>
        <EmptyState
          icon={BarChart3}
          title="No tracked repositories"
          description="You haven't tracked any repositories yet. Track a repository to collect analytics, velocity charts, and cycle-time distributions."
          action={
            <Link to="/app/repositories">
              <Button variant="primary" size="md">
                Go to Repositories
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  // --- Main Analytics Page View ---

  return (
    <div className={styles.page}>
      {/* Header section */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.eyebrow}>
            TELEMETRY • LONGITUDINAL AUDIT
          </span>
          <h1 className={styles.title}>Analytics</h1>
          <p className={styles.description}>
            Longitudinal movement and cycle times across repository clusters.
          </p>
        </div>
      </header>

      {/* Context bar with repository switcher & date window selector */}
      <AnalyticsContextBar
        currentRepository={selectedRepo}
        trackedRepositories={trackedRepos}
        onSelectRepository={handleSelectRepository}
        days={days}
        onWindowChange={handleWindowChange}
      />

      {/* 1. Overview KPIs Section */}
      <div className={styles.section}>
        {isOverviewError ? (
          <ErrorState
            title="Failed to load overview analytics"
            message={overviewError?.message || 'Could not fetch overview metrics for this repository.'}
            onRetry={refetchOverview}
          />
        ) : isOverviewLoading ? (
          <LoadingState variant="skeleton" rows={3} />
        ) : (
          <AnalyticsKpiGrid overview={overviewData} />
        )}
      </div>

      {/* 2. Pull Request Activity Over Time */}
      <div className={styles.section}>
        {isActivityError ? (
          <ErrorState
            title="Failed to load pull request activity"
            message={activityError?.message || 'Could not fetch activity analytics for this repository.'}
            onRetry={refetchActivity}
          />
        ) : isActivityLoading ? (
          <LoadingState variant="skeleton" rows={5} />
        ) : (
          <PullRequestActivityChart data={activityData} days={days} />
        )}
      </div>

      {/* 3. Cycle Time Trend & Percentiles */}
      <div className={styles.section}>
        {isCycleTimeError ? (
          <ErrorState
            title="Failed to load cycle time trend"
            message={cycleTimeError?.message || 'Could not fetch cycle time trend analytics for this repository.'}
            onRetry={refetchCycleTime}
          />
        ) : isCycleTimeLoading ? (
          <LoadingState variant="skeleton" rows={5} />
        ) : (
          <CycleTimeTrendChart data={cycleTimeData} weeks={weeks} />
        )}
      </div>

      {/* 4. Throughput Delivery Velocity Section */}
      <div className={styles.section}>
        {isThroughputError ? (
          <ErrorState
            title="Failed to load delivery throughput"
            message={throughputError?.message || 'Could not fetch weekly throughput data.'}
            onRetry={refetchThroughput}
          />
        ) : isThroughputLoading ? (
          <LoadingState variant="skeleton" rows={5} />
        ) : (
          <ThroughputChart data={throughputData} weeks={weeks} />
        )}
      </div>

      {/* 3. Contributor Turnaround Table Section */}
      <div className={styles.section}>
        {isAuthorsError ? (
          <ErrorState
            title="Failed to load contributor metrics"
            message={authorsError?.message || 'Could not fetch contributor activity data.'}
            onRetry={refetchAuthors}
          />
        ) : isAuthorsLoading ? (
          <LoadingState variant="skeleton" rows={4} />
        ) : (
          <ContributorTable data={authorsData} />
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
