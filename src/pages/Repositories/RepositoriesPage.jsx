import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, FolderGit2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  RepositoryMetrics,
  RepositoryFilters,
  TrackedRepositoriesList,
  AvailableRepositoriesList,
  useWorkspace,
  useTrackedRepositories,
  useAvailableRepositories,
  useRepositoryMutations,
} from '@/features/repositories';
import styles from './RepositoriesPage.module.css';

const filterRepositories = (list, visibilityFilter, searchQuery) => {
  const trimmedQuery = searchQuery.trim().toLowerCase();
  return list.filter((repo) => {
    // Visibility filter
    if (visibilityFilter === 'private' && !repo.private) return false;
    if (visibilityFilter === 'public' && repo.private) return false;

    // Search filter
    if (trimmedQuery) {
      const matchesName = repo.name?.toLowerCase().includes(trimmedQuery);
      const matchesFullName = repo.full_name?.toLowerCase().includes(trimmedQuery);
      const matchesDesc = repo.description?.toLowerCase().includes(trimmedQuery);
      if (!matchesName && !matchesFullName && !matchesDesc) {
        return false;
      }
    }
    return true;
  });
};

export const RepositoriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const visibilityFilter = searchParams.get('visibility') || 'all';

  // 1. Resolve active workspace
  const {
    currentWorkspace,
    workspaceId,
    isLoading: isWorkspaceLoading,
    isError: isWorkspaceError,
    error: workspaceError,
    refetch: refetchWorkspace,
  } = useWorkspace();

  // 2. Fetch tracked repositories
  const {
    data: trackedRepos = [],
    isLoading: isTrackedLoading,
    isError: isTrackedError,
    error: trackedError,
    refetch: refetchTracked,
  } = useTrackedRepositories(workspaceId);

  // 3. Fetch available GitHub installation repositories
  const {
    data: rawAvailableRepos = [],
    isLoading: isAvailableLoading,
    isError: isAvailableError,
    error: availableError,
    refetch: refetchAvailable,
  } = useAvailableRepositories(workspaceId);

  // 4. Mutation handlers
  const { trackMutation, untrackMutation, syncMutation } =
    useRepositoryMutations(workspaceId);

  // Local tracking of in-flight item IDs
  const [trackingRepoName, setTrackingRepoName] = useState(null);
  const [untrackingId, setUntrackingId] = useState(null);
  const [syncingId, setSyncingId] = useState(null);

  // Repositories available to track = installation repos not yet in tracked list
  const availableToTrack = useMemo(() => {
    const trackedNames = new Set(
      trackedRepos.map((r) => r.full_name || r.name),
    );
    return rawAvailableRepos.filter(
      (r) => !trackedNames.has(r.full_name) && !trackedNames.has(r.name),
    );
  }, [trackedRepos, rawAvailableRepos]);

  const filteredTracked = useMemo(
    () => filterRepositories(trackedRepos, visibilityFilter, searchQuery),
    [trackedRepos, visibilityFilter, searchQuery],
  );

  const filteredAvailable = useMemo(
    () => filterRepositories(availableToTrack, visibilityFilter, searchQuery),
    [availableToTrack, visibilityFilter, searchQuery],
  );

  // Aggregate counts strictly derived from API data
  const counts = useMemo(() => {
    const allRepos = [...trackedRepos, ...availableToTrack];
    return {
      all: allRepos.length,
      private: allRepos.filter((r) => r.private).length,
      public: allRepos.filter((r) => !r.private).length,
      tracked: trackedRepos.length,
      available: availableToTrack.length,
    };
  }, [trackedRepos, availableToTrack]);

  // Filter change handlers updating URL search parameters
  const handleSearchChange = (query) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (query) {
          next.set('q', query);
        } else {
          next.delete('q');
        }
        return next;
      },
      { replace: true },
    );
  };

  const handleVisibilityChange = (visibility) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (visibility && visibility !== 'all') {
          next.set('visibility', visibility);
        } else {
          next.delete('visibility');
        }
        return next;
      },
      { replace: true },
    );
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Mutation actions
  const handleTrack = async ({ owner, repo }) => {
    setTrackingRepoName(repo);
    try {
      await trackMutation.mutateAsync({ owner, repo });
    } catch {
      // Error handled by TanStack Query / Error UI
    } finally {
      setTrackingRepoName(null);
    }
  };

  const handleUntrack = async (repositoryId) => {
    setUntrackingId(repositoryId);
    try {
      await untrackMutation.mutateAsync(repositoryId);
    } catch {
      // Error handled by TanStack Query / Error UI
    } finally {
      setUntrackingId(null);
    }
  };

  const handleSync = async (repositoryId) => {
    setSyncingId(repositoryId);
    try {
      return await syncMutation.mutateAsync(repositoryId);
    } finally {
      setSyncingId(null);
    }
  };

  const handleScrollToAvailable = () => {
    const el = document.getElementById('available-repositories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Render States ---

  // 1. Initial loading state
  const isLoading = isWorkspaceLoading || isTrackedLoading || isAvailableLoading;
  if (isLoading) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>WORKSPACE / REPOSITORIES</span>
            <h1 className={styles.title}>Your repositories</h1>
            <p className={styles.description}>
              Repositories synchronized with GitHub Intelligence for automated telemetry, velocity analysis, and risk scoring.
            </p>
          </div>
        </header>
        <LoadingState variant="skeleton" rows={5} />
      </div>
    );
  }

  // 2. Error state
  const hasError = isWorkspaceError || isTrackedError || isAvailableError;
  if (hasError) {
    const activeError = workspaceError || trackedError || availableError;
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>WORKSPACE / REPOSITORIES</span>
            <h1 className={styles.title}>Your repositories</h1>
          </div>
        </header>
        <ErrorState
          title="Failed to load repository telemetry"
          message={activeError?.message || 'Could not communicate with the workspace service.'}
          onRetry={() => {
            if (isWorkspaceError) refetchWorkspace();
            if (isTrackedError) refetchTracked();
            if (isAvailableError) refetchAvailable();
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
            <span className={styles.eyebrow}>WORKSPACE / REPOSITORIES</span>
            <h1 className={styles.title}>Your repositories</h1>
          </div>
        </header>
        <EmptyState
          icon={FolderGit2}
          title="No workspace found"
          description="A workspace is required to inspect and track repositories. Please connect or create a workspace."
        />
      </div>
    );
  }

  const isFiltering = Boolean(searchQuery.trim() || visibilityFilter !== 'all');
  const hasZeroFilterMatches =
    isFiltering &&
    filteredTracked.length === 0 &&
    filteredAvailable.length === 0;

  return (
    <div className={styles.page}>
      {/* Header matching approved screenshot */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.eyebrow}>WORKSPACE / REPOSITORIES</span>
          <h1 className={styles.title}>Your repositories</h1>
          <p className={styles.description}>
            Repositories synchronized with GitHub Intelligence for automated telemetry, velocity analysis, and risk scoring.
          </p>
        </div>

        {availableToTrack.length > 0 && (
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus size={15} />}
            onClick={handleScrollToAvailable}
          >
            Find repositories
          </Button>
        )}
      </header>

      {/* Top metrics derived purely from actual API data */}
      <RepositoryMetrics
        trackedCount={counts.tracked}
        availableCount={counts.available}
      />

      {/* Filter and search controls */}
      <RepositoryFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        visibilityFilter={visibilityFilter}
        onVisibilityChange={handleVisibilityChange}
        counts={counts}
      />

      {/* Content areas */}
      {hasZeroFilterMatches ? (
        <EmptyState
          icon={FolderGit2}
          title="No repositories match your filter"
          description={`No repositories found matching "${searchQuery}" with visibility "${visibilityFilter}".`}
          action={
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          }
        />
      ) : (
        <>
          <TrackedRepositoriesList
            repositories={filteredTracked}
            workspaceId={workspaceId}
            onUntrack={handleUntrack}
            onSync={handleSync}
            untrackingId={untrackingId}
            syncingId={syncingId}
          />

          <div id="available-repositories">
            <AvailableRepositoriesList
              repositories={filteredAvailable}
              workspaceId={workspaceId}
              onTrack={handleTrack}
              trackingRepoName={trackingRepoName}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default RepositoriesPage;
