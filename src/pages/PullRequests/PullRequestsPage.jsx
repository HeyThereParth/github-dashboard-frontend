import { useSearchParams, Link } from 'react-router-dom';
import { GitPullRequest, FolderGit2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useWorkspace, useTrackedRepositories } from '@/features/repositories';
import {
  usePullRequests,
  RepositoryContextBar,
  PullRequestFilters,
  PullRequestList,
  PullRequestPagination,
} from '@/features/pullRequests';
import styles from './PullRequestsPage.module.css';

export const PullRequestsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Extract URL state
  const paramRepositoryId = searchParams.get('repositoryId') || '';
  const paramRepo = searchParams.get('repo') || '';
  const stateFilter = searchParams.get('state') || 'all';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const perPage = 10;

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

  // 4. Determine currently selected tracked repository
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
  const repositoryName = selectedRepo?.name || selectedRepo?.full_name || '';

  // 5. Query pull requests for selected repository
  const {
    data: prData,
    isLoading: isPRLoading,
    isError: isPRError,
    error: prError,
    refetch: refetchPRs,
  } = usePullRequests({
    workspaceId,
    repositoryId,
    state: stateFilter,
    page,
    perPage,
  });

  const prItems = prData?.items || [];
  const total = prData?.total ?? 0;

  // 6. Navigation and filter handlers
  const handleStateChange = (nextState) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (nextState && nextState !== 'all') {
          next.set('state', nextState);
        } else {
          next.delete('state');
        }
        next.delete('page'); // Reset pagination to page 1
        return next;
      },
      { replace: true },
    );
  };

  const handlePageChange = (newPage) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newPage > 1) {
          next.set('page', String(newPage));
        } else {
          next.delete('page');
        }
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
        next.delete('page'); // Reset pagination to page 1
        return next;
      },
      { replace: true },
    );
  };

  // --- Render Initial / Global States ---

  // 1. Initial workspace / tracked repositories loading
  if (isWorkspaceLoading || isTrackedLoading) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>
              PULL REQUEST INTELLIGENCE • PIPELINE VELOCITY
            </span>
            <h1 className={styles.title}>Pull requests</h1>
            <p className={styles.description}>
              Audit lifecycle stages, review throughput, and track open/closed workflows across your tracked repositories.
            </p>
          </div>
        </header>
        <LoadingState variant="skeleton" rows={5} />
      </div>
    );
  }

  // 2. Global Error state
  if (isWorkspaceError || isTrackedError) {
    const activeError = workspaceError || trackedError;
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>
              PULL REQUEST INTELLIGENCE • PIPELINE VELOCITY
            </span>
            <h1 className={styles.title}>Pull requests</h1>
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

  // 3. No workspace found state
  if (!currentWorkspace) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>
              PULL REQUEST INTELLIGENCE • PIPELINE VELOCITY
            </span>
            <h1 className={styles.title}>Pull requests</h1>
          </div>
        </header>
        <EmptyState
          icon={FolderGit2}
          title="No workspace found"
          description="A workspace is required to view pull requests. Please connect or create a workspace."
        />
      </div>
    );
  }

  // 4. No tracked repositories state
  if (trackedRepos.length === 0) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>
              PULL REQUEST INTELLIGENCE • PIPELINE VELOCITY
            </span>
            <h1 className={styles.title}>Pull requests</h1>
            <p className={styles.description}>
              Audit lifecycle stages, review throughput, and track open/closed workflows across your tracked repositories.
            </p>
          </div>
        </header>
        <EmptyState
          icon={GitPullRequest}
          title="No tracked repositories"
          description="You haven't tracked any repositories yet. Track a repository to inspect its pull requests and telemetry."
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

  // --- Main Content View ---
  return (
    <div className={styles.page}>
      {/* Header section */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.eyebrow}>
            PULL REQUEST INTELLIGENCE • PIPELINE VELOCITY
          </span>
          <h1 className={styles.title}>Pull requests</h1>
          <p className={styles.description}>
            Audit lifecycle stages, review throughput, and track open/closed workflows across your tracked repositories.
          </p>
        </div>
      </header>

      {/* Active repository context bar with switcher */}
      <RepositoryContextBar
        currentRepository={selectedRepo}
        trackedRepositories={trackedRepos}
        onSelectRepository={handleSelectRepository}
      />

      {/* Status filter tabs */}
      <PullRequestFilters
        state={stateFilter}
        onChange={handleStateChange}
        total={isPRLoading ? undefined : total}
      />

      {/* Content state handling */}
      <div className={styles.contentSection}>
        {isPRError ? (
          <ErrorState
            title="Failed to load pull requests"
            message={prError?.message || 'An error occurred while fetching pull requests for this repository.'}
            onRetry={refetchPRs}
          />
        ) : isPRLoading ? (
          <LoadingState variant="skeleton" rows={5} />
        ) : prItems.length === 0 ? (
          <EmptyState
            icon={GitPullRequest}
            title={
              stateFilter !== 'all'
                ? `No ${stateFilter} pull requests found`
                : 'No pull requests found'
            }
            description={
              stateFilter !== 'all'
                ? `There are no ${stateFilter} pull requests matching your filter criteria.`
                : `No pull requests have been recorded for ${repositoryName}. If you just tracked this repository, make sure sync has run.`
            }
            action={
              stateFilter !== 'all' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStateChange('all')}
                >
                  Show all pull requests
                </Button>
              ) : (
                <Link to="/app/repositories">
                  <Button variant="outline" size="sm">
                    Manage repositories
                  </Button>
                </Link>
              )
            }
          />
        ) : (
          <>
            <PullRequestList
              items={prItems}
              repositoryName={repositoryName}
            />

            <PullRequestPagination
              page={page}
              total={total}
              perPage={perPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PullRequestsPage;
