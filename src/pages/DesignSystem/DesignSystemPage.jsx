import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  RefreshCw,
  GitPullRequest,
  CheckCircle2,
} from 'lucide-react';
import {
  Button,
  IconButton,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  StatusBadge,
  Input,
  Select,
  Tabs,
  Tooltip,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
  LoadingState,
  EmptyState,
  ErrorState,
} from '@/components/ui';
import {
  PullRequestActivityChart,
  ActiveRepositoriesCard,
  OverviewKpiGrid,
  RecentPullRequestsCard,
} from '@/features/overview';
import { SAMPLE_ACTIVITY_DATA } from '@/features/overview/components/PullRequestActivityChart/sampleData';
import { ThroughputChart, CycleTimeTrendChart } from '@/features/analytics';
import styles from './DesignSystemPage.module.css';

const SAMPLE_THROUGHPUT_DATA = {
  data: [
    { week_start: '2026-07-27T00:00:00', merged_count: 0, is_partial: false },
    { week_start: '2026-08-03T00:00:00', merged_count: 0, is_partial: false },
    { week_start: '2026-08-10T00:00:00', merged_count: 0, is_partial: false },
    { week_start: '2026-08-17T00:00:00', merged_count: 0, is_partial: false },
    { week_start: '2026-08-24T00:00:00', merged_count: 0, is_partial: false },
    { week_start: '2026-08-31T00:00:00', merged_count: 0, is_partial: false },
    { week_start: '2026-09-07T00:00:00', merged_count: 0, is_partial: false },
    { week_start: '2026-09-14T00:00:00', merged_count: 3, is_partial: false },
  ],
};

const SAMPLE_CYCLE_TIME_DATA = {
  data: [
    { week_start: '2026-07-27T00:00:00', p50_hours: 18.2, p90_hours: 42.5, avg_hours: 21.0, is_partial: false },
    { week_start: '2026-08-03T00:00:00', p50_hours: 16.5, p90_hours: 38.0, avg_hours: 19.4, is_partial: false },
    { week_start: '2026-08-10T00:00:00', p50_hours: 22.0, p90_hours: 48.0, avg_hours: 25.1, is_partial: false },
    { week_start: '2026-08-17T00:00:00', p50_hours: null, p90_hours: null, avg_hours: null, is_partial: false },
    { week_start: '2026-08-24T00:00:00', p50_hours: 19.8, p90_hours: 44.0, avg_hours: 23.2, is_partial: false },
    { week_start: '2026-08-31T00:00:00', p50_hours: 15.0, p90_hours: 35.5, avg_hours: 18.0, is_partial: false },
    { week_start: '2026-09-07T00:00:00', p50_hours: 17.4, p90_hours: 41.2, avg_hours: 20.8, is_partial: false },
    { week_start: '2026-09-14T00:00:00', p50_hours: 18.4, p90_hours: 42.8, avg_hours: 21.4, is_partial: true },
  ],
};

const SAMPLE_OVERVIEW_METRICS = {
  total_prs: 1284,
  open_prs: 312,
  merged_prs: 842,
  closed_unmerged_prs: 130,
  merge_rate_percentage: 72.4,
  cycle_time: {
    p50_hours: 18.4,
    p90_hours: 46.2,
    avg_hours: 21.4,
  },
};

const SAMPLE_TRACKED_REPOS = [
  { id: '1', name: 'github-intelligence-core', default_branch: 'main', full_name: 'acme/github-intelligence-core', description: 'Ingestion daemon', private: true, is_tracked: true },
  { id: '2', name: 'engineering-dashboard', default_branch: 'prod', full_name: 'acme/engineering-dashboard', description: 'Client web portal', private: false, is_tracked: true },
  { id: '3', name: 'mobile-app', default_branch: 'main', full_name: 'acme/mobile-app', description: 'React Native shell', private: true, is_tracked: true },
  { id: '4', name: 'infra-terraform', default_branch: 'prod', full_name: 'acme/infra-terraform', description: 'Cloud orchestration', private: true, is_tracked: true },
  { id: '5', name: 'auth-service', default_branch: 'main', full_name: 'acme/auth-service', description: 'Token federation', private: false, is_tracked: true },
];

const SAMPLE_RECENT_PRS = [
  { id: '1', number: 142, title: 'Fix authentication token expiration handling', repository_name: 'auth-service', author_login: 'schen', state: 'open', draft: false, github_created_at: '2026-09-19T20:00:00Z', github_updated_at: '2026-09-19T20:42:00Z', html_url: '#' },
  { id: '2', number: 389, title: 'Optimize PR throughput telemetry ingestion batching', repository_name: 'github-intelligence-core', author_login: 'arivera', state: 'closed', merged_at: '2026-09-19T19:30:00Z', draft: false, github_created_at: '2026-09-19T04:45:00Z', github_updated_at: '2026-09-19T19:30:00Z', html_url: '#' },
  { id: '3', number: 104, title: 'Implement dark mineral architectural design system', repository_name: 'engineering-dashboard', author_login: 'erostova', state: 'closed', merged_at: '2026-09-19T18:00:00Z', draft: false, github_created_at: '2026-09-19T09:48:00Z', github_updated_at: '2026-09-19T18:00:00Z', html_url: '#' },
  { id: '4', number: 58, title: 'Refactor SQLite database migrations for workspace sync', repository_name: 'github-intelligence-core', author_login: 'dkim', state: 'open', draft: false, github_created_at: '2026-09-19T15:30:00Z', github_updated_at: '2026-09-19T16:00:00Z', html_url: '#' },
  { id: '5', number: 211, title: 'Add repository default branch webhook verification', repository_name: 'infra-terraform', author_login: 'mvance', state: 'closed', merged_at: null, closed_at: '2026-09-19T13:00:00Z', draft: false, github_created_at: '2026-09-17T15:00:00Z', github_updated_at: '2026-09-19T13:00:00Z', html_url: '#' },
];

export const DesignSystemPage = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [selectValue, setSelectValue] = useState('30d');

  const tabs = [
    { value: 'all', label: 'All', count: 1284 },
    { value: 'open', label: 'Open', count: 312, dotColor: 'var(--palette-coral)' },
    { value: 'merged', label: 'Merged', count: 842, dotColor: 'var(--palette-mint)' },
    { value: 'closed', label: 'Closed', count: 130, dotColor: 'var(--color-text-muted)' },
  ];

  const tableSampleRows = [
    {
      id: '#142',
      title: 'Fix authentication token expiration handling',
      repo: 'auth-service',
      author: 'Sarah Chen',
      initials: 'SC',
      state: 'open',
      cycleTime: '2.4h',
      updated: '42m ago',
    },
    {
      id: '#389',
      title: 'Optimize PR throughput telemetry ingestion batching',
      repo: 'github-intelligence-core',
      author: 'Alex Rivera',
      initials: 'AR',
      state: 'merged',
      cycleTime: '14.8h',
      updated: '1.5h ago',
    },
    {
      id: '#104',
      title: 'Implement dark mineral architectural design system',
      repo: 'engineering-dashboard',
      author: 'Elena Rostova',
      initials: 'ER',
      state: 'merged',
      cycleTime: '8.2h',
      updated: '3h ago',
    },
    {
      id: '#58',
      title: 'Refactor SQLite database migrations for workspace sync',
      repo: 'github-intelligence-core',
      author: 'David Kim',
      initials: 'DK',
      state: 'open',
      cycleTime: '19.1h',
      updated: '5h ago',
    },
    {
      id: '#211',
      title: 'Add repository default branch webhook verification',
      repo: 'infra-terraform',
      author: 'Marcus Vance',
      initials: 'MV',
      state: 'closed',
      cycleTime: '46.0h',
      updated: '8h ago',
    },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.pageTitle}>GitHub Intelligence Design System</h1>
          {/* <p className={styles.pageDesc}>
            Approved architectural design language adhering strictly to the visual specifications in <code>DESIGN.md</code> and repository screenshots.
          </p> */}
        </div>
        <div className={styles.headerActions}>
          {/* <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
            Export Specs
          </Button> */}
          <Button variant="primary" size="sm" leftIcon={<CheckCircle2 size={14} />}>
            Approved Reference
          </Button>
        </div>
      </header>

      {/* Flagship Reference Showcase: Engineering Overview (From Screenshot) */}
      <section className={styles.showcaseSection} aria-label="Approved Engineering Overview Showcase">
        <div className={styles.showcaseHeader}>
          <div className={styles.showcaseEyebrow}>
            <span className={styles.pulseDot} aria-hidden="true" />
            <span>Approved Reference Composition — Engineering Overview</span>
          </div>
          <span className={styles.showcaseSource}>
            Source: screenshots/Engineering Overview — GitHub Intelligence.png
          </span>
        </div>

        {/* Top 4 KPI Metric Cards */}
        <OverviewKpiGrid
          overview={SAMPLE_OVERVIEW_METRICS}
          trackedCount={5}
          isGitHubConnected={true}
          days={30}
        />

        {/* Split Grid: Pull Request Activity Chart + Active Repositories */}
        <div className={styles.overviewSplitGrid}>
          <PullRequestActivityChart
            data={SAMPLE_ACTIVITY_DATA}
            days={30}
            repositoryName="github-intelligence-core"
          />
          <ActiveRepositoriesCard
            repositories={SAMPLE_TRACKED_REPOS}
            selectedRepositoryId="1"
          />
        </div>

        {/* Recent Pull Requests Table Stream */}
        <div style={{ marginTop: 'var(--space-4)' }}>
          <RecentPullRequestsCard
            pullRequests={SAMPLE_RECENT_PRS}
            total={1284}
            repositoryName="auth-service"
          />
        </div>
      </section>

      {/* Flagship Reference Showcase: Engineering Analytics (From Screenshot) */}
      <section className={styles.showcaseSection} aria-label="Approved Engineering Analytics Showcase">
        <div className={styles.showcaseHeader}>
          <div className={styles.showcaseEyebrow}>
            <span className={styles.pulseDot} aria-hidden="true" />
            <span>Approved Reference Composition — Engineering Analytics</span>
          </div>
          <span className={styles.showcaseSource}>
            Source: screenshots/Engineering Analytics — GitHub Intelligence.png
          </span>
        </div>

        {/* Weekly PR activity & delivery velocity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <ThroughputChart data={SAMPLE_THROUGHPUT_DATA} weeks={8} />
          <CycleTimeTrendChart data={SAMPLE_CYCLE_TIME_DATA} weeks={8} />
        </div>
      </section>

      {/* 1. Color Palette Tokens */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Color Palette Tokens</h2>
          <Badge variant="neutral">DESIGN TOKENS</Badge>
        </div>
        <div className={styles.tokenGrid}>
          <div className={styles.tokenCard}>
            <div className={styles.tokenSwatch} style={{ backgroundColor: 'var(--palette-gold)' }} />
            <div className={styles.tokenName}>Primary (#B7A16A)</div>
            <div className={styles.tokenRole}>Gold accent / active borders / merged metric</div>
          </div>

          <div className={styles.tokenCard}>
            <div className={styles.tokenSwatch} style={{ backgroundColor: 'var(--palette-coral)' }} />
            <div className={styles.tokenName}>Secondary (#B96858)</div>
            <div className={styles.tokenRole}>Coral / velocity trend / open PR alerts</div>
          </div>

          <div className={styles.tokenCard}>
            <div className={styles.tokenSwatch} style={{ backgroundColor: 'var(--palette-mint)' }} />
            <div className={styles.tokenName}>Tertiary (#35B98A)</div>
            <div className={styles.tokenRole}>Mint / positive efficiency / health indicator</div>
          </div>

          <div className={styles.tokenCard}>
            <div className={styles.tokenSwatch} style={{ backgroundColor: 'var(--palette-neutral-900)', border: '1px solid var(--color-border)' }} />
            <div className={styles.tokenName}>Neutral (#08110F)</div>
            <div className={styles.tokenRole}>Dark mineral backdrop / restrained contrast</div>
          </div>
        </div>
      </section>

      {/* 2. Buttons & Form Controls */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Buttons & Form Controls</h2>
          <Badge variant="neutral">PRIMITIVES</Badge>
        </div>
        <div className={styles.controlsRow}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline" leftIcon={<Filter size={14} />}>Filters</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>

          <Tooltip content="Refresh telemetry data">
            <IconButton variant="outline" aria-label="Refresh telemetry">
              <RefreshCw size={14} />
            </IconButton>
          </Tooltip>
        </div>

        <div className={styles.controlsGrid}>
          <Input
            placeholder="Filter by title, repository, or author..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            leftIcon={<Search size={14} />}
          />

          <Select
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            options={[
              { value: '7d', label: 'Window: Last 7 days' },
              { value: '30d', label: 'Window: Last 30 days' },
              { value: '90d', label: 'Window: Last 90 days' },
            ]}
          />

          <Tabs
            tabs={tabs}
            value={selectedTab}
            onChange={setSelectedTab}
          />
        </div>
      </section>

      {/* 3. Badges & Status Badges */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Badges & Status Badges</h2>
          <Badge variant="neutral">STATUS</Badge>
        </div>
        <div className={styles.badgesRow}>
          <StatusBadge status="open" />
          <StatusBadge status="merged" />
          <StatusBadge status="closed" />
          <StatusBadge status="draft" />
          
          <span className={styles.badgesDivider} />

          <Badge variant="neutral">MAIN</Badge>
          <Badge variant="neutral">PROD</Badge>
          <Badge variant="primary">V2.4.1</Badge>
          <Badge variant="success">OPTIMAL</Badge>
          <Badge variant="warning">SYNC ACTIVE</Badge>
          <Badge variant="error">DEGRADED</Badge>
        </div>
      </section>

      {/* 4. Engineering Table */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Pull Requests Table</h2>
          <Tabs tabs={tabs} value={selectedTab} onChange={setSelectedTab} />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TITLE & PR ID</TableHead>
              <TableHead>REPOSITORY</TableHead>
              <TableHead>AUTHOR</TableHead>
              <TableHead>STATE</TableHead>
              <TableHead align="right">CYCLE TIME</TableHead>
              <TableHead align="right">UPDATED</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableSampleRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)' }}>
                      {row.id}
                    </span>
                    <span style={{ fontWeight: 500 }}>{row.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
                    {row.repo}
                  </span>
                </TableCell>
                <TableCell>
                  <div className={styles.authorCell}>
                    <div className={styles.authorAvatar}>
                      {row.initials}
                    </div>
                    <span>{row.author}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={row.state} />
                </TableCell>
                <TableCell align="right">
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{row.cycleTime}</span>
                </TableCell>
                <TableCell align="right">
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-metadata)' }}>{row.updated}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-secondary)' }}>
                  Showing 5 of 1,284 ingested pull requests
                </span>
              </TableCell>
              <TableCell colSpan={2} align="right">
                <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>

      {/* 5. States (Loading, Empty, Error) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>State Indicators & Card Layouts</h2>
          <Badge variant="neutral">STATES</Badge>
        </div>
        <div className={styles.statesGrid}>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Loading State</CardTitle>
                <CardDescription>Pulse indicators & skeletons</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <LoadingState message="Connecting to telemetry stream..." />
              <div style={{ marginTop: 'var(--space-4)' }}>
                <LoadingState variant="skeleton" rows={3} />
              </div>
            </CardContent>
            <CardFooter>
              <span>Telemetry heartbeat: active</span>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Empty State</CardTitle>
                <CardDescription>When query returns zero results</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={GitPullRequest}
                title="No pull requests found"
                description="No pull requests match the current state filter."
                action={<Button variant="outline" size="sm">Reset Filters</Button>}
              />
            </CardContent>
            <CardFooter>
              <span>Filter applied: all branches</span>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Error State</CardTitle>
                <CardDescription>Resilient error recovery</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ErrorState
                title="Telemetry synchronization halted"
                message="Remote GitHub API rate limit exceeded. Retry scheduled."
                onRetry={() => {}}
              />
            </CardContent>
            <CardFooter>
              <span>Error code: 429_RATE_LIMIT</span>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DesignSystemPage;
