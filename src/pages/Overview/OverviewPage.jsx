import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWorkspace } from '@/features/workspace';
import { useTrackedRepositories } from '@/features/repositories';
import {
  useAnalyticsOverview,
  useAnalyticsActivity,
} from '@/features/analytics';
import { usePullRequests } from '@/features/pullRequests';
import {
  OverviewKpiGrid,
  PullRequestActivityChart,
  ActiveRepositoriesCard,
  RecentPullRequestsCard,
} from '@/features/overview';
import { ErrorState } from '@/components/ui/ErrorState';
import styles from './OverviewPage.module.css';

export const OverviewPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [prPage, setPrPage] = useState(1);

  // 1. Resolve active workspace context
  const {
    currentWorkspace,
    workspaceId,
    workspaceDetail,
    isLoading: isWorkspaceLoading,
    isError: isWorkspaceError,
    error: workspaceError,
    refetch: refetchWorkspace,
  } = useWorkspace();

  const isGitHubConnected = Boolean(
    workspaceDetail?.is_github_connected ??
      (currentWorkspace?.is_github_connected ??
        currentWorkspace?.github_installation_id != null),
  );

  // 2. Resolve tracked repositories in workspace
  const {
    data: trackedRepos = [],
    isLoading: isTrackedLoading,
    error: trackedError,
    refetch: refetchTracked,
  } = useTrackedRepositories(workspaceId);

  // 3. Resolve selected repository for repository-scoped analytics & PR stream
  const paramRepoId = searchParams.get('repositoryId') || '';

  const selectedRepo = useMemo(() => {
    if (!trackedRepos || trackedRepos.length === 0) return null;
    if (paramRepoId) {
      const found = trackedRepos.find((r) => r.id === paramRepoId);
      if (found) return found;
    }
    return trackedRepos[0];
  }, [trackedRepos, paramRepoId]);

  const repositoryId = selectedRepo?.id || null;
  const repositoryName = selectedRepo?.name || '';

  const handleSelectRepository = (repo) => {
    if (!repo?.id) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('repositoryId', repo.id);
        return next;
      },
      { replace: true },
    );
    setPrPage(1); // Reset PR page on repo switch
  };

  // 4. Analytics overview query
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
  } = useAnalyticsOverview({
    workspaceId,
    repositoryId,
    days: 30,
  });

  // 5. Activity query
  const {
    data: activityData,
  } = useAnalyticsActivity({
    workspaceId,
    days: 30,
    repositoryId,
  });

  // 6. Recent pull requests query
  const {
    data: prData,
    isLoading: isPRLoading,
  } = usePullRequests({
    workspaceId,
    repositoryId,
    state: 'all',
    page: prPage,
    perPage: 5,
  });

  // Workspace-level error state
  if (isWorkspaceError) {
    return (
      <div className={styles.pageContainer}>
        <ErrorState
          title="Workspace Unavailable"
          description={
            workspaceError?.message ||
            'Unable to load workspace context. Please verify your connection.'
          }
          actionLabel="Retry"
          onAction={refetchWorkspace}
        />
      </div>
    );
  }

  const isInitialLoading = isWorkspaceLoading || isTrackedLoading;
  const workspaceTitle = currentWorkspace?.name || 'Workspace';

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header Section */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.preTitle}>
            <span>TELEMETRY CORE</span>
            <span style={{ color: 'var(--color-text-muted)' }}>•</span>
            <span
              className={styles.liveText}
              style={{
                color: isGitHubConnected
                  ? 'var(--palette-mint)'
                  : 'var(--color-text-muted)',
              }}
            >
              <span
                className={`${styles.liveDot} ${
                  isGitHubConnected
                    ? styles.liveDotConnected
                    : styles.liveDotDisconnected
                }`}
                aria-hidden="true"
              />
              {isGitHubConnected
                ? 'Live Telemetry Active'
                : 'GitHub Disconnected'}
            </span>
          </div>

          <h1 className={styles.title}>Engineering overview</h1>

          <p className={styles.subtitle}>
            Pull request throughput, cycle time, and active repository velocity
            across {workspaceTitle} infrastructure.
          </p>
        </div>

        {trackedRepos.length > 1 && (
          <div className={styles.headerControls}>
            <div className={styles.repoSelectorGroup}>
              <span className={styles.repoSelectorLabel}>ACTIVE REPO:</span>
              <select
                className={styles.repoSelect}
                value={repositoryId || ''}
                onChange={(e) => {
                  const r = trackedRepos.find((item) => item.id === e.target.value);
                  if (r) handleSelectRepository(r);
                }}
                aria-label="Select active repository for telemetry"
              >
                {trackedRepos.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </header>

      {/* 2. Top KPI Cards Grid */}
      <OverviewKpiGrid
        overview={overviewData}
        trackedCount={trackedRepos.length}
        isGitHubConnected={isGitHubConnected}
        days={30}
        isLoading={isInitialLoading || (isOverviewLoading && !overviewData)}
      />

      {/* 3. Middle Split Grid: Activity Chart (65%) + Active Repositories (35%) */}
      <div className={styles.middleGrid}>
        <PullRequestActivityChart
          data={activityData}
          days={30}
          repositoryName={repositoryName}
          title="Pull request activity over time"
          subtitle={
            repositoryName
              ? `Volume of opened versus merged pull requests over the last 30 days for ${repositoryName}.`
              : 'Volume of opened versus merged pull requests over the last 30 days.'
          }
        />

        <ActiveRepositoriesCard
          repositories={trackedRepos}
          isLoading={isTrackedLoading}
          error={trackedError}
          onRetry={refetchTracked}
          selectedRepositoryId={repositoryId}
          onSelectRepository={handleSelectRepository}
        />
      </div>

      {/* 4. Bottom Section: Recent Pull Requests Table */}
      <div className={styles.bottomSection}>
        <RecentPullRequestsCard
          pullRequests={prData?.items || []}
          total={prData?.total || 0}
          repositoryName={repositoryName}
          isLoading={isPRLoading}
          page={prPage}
          perPage={5}
          onPageChange={setPrPage}
        />
      </div>
    </div>
  );
};

export default OverviewPage;
