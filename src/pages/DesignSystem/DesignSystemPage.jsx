import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Download,
  Filter,
  RefreshCw,
  GitPullRequest,
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
  MetricCard,
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
} from '../../components/ui';

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <nav style={{ marginBottom: 'var(--space-2)' }}>
            <Link to="/" style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-secondary)' }}>
              ← Back to Home
            </Link>
          </nav>
          <h1>GitHub Intelligence Design System</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)', fontSize: 'var(--font-size-body)' }}>
            Phase 1 reusable UI primitives, tokens, and components adhering strictly to the approved references.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
            Export Specs
          </Button>
          <Button variant="primary" size="sm">
            Phase 1 Ready
          </Button>
        </div>
      </header>

      {/* 1. Color Palette Tokens */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <h2>Color Palette Tokens</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ height: '36px', background: 'var(--palette-gold)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-primary)' }}>Primary (#B7A16A)</div>
            <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-muted)' }}>Gold accent / active borders</div>
          </div>

          <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ height: '36px', background: 'var(--palette-coral)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-primary)' }}>Secondary (#B96858)</div>
            <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-muted)' }}>Coral / Errors / Open PRs</div>
          </div>

          <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ height: '36px', background: 'var(--palette-mint)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-primary)' }}>Tertiary (#35B98A)</div>
            <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-muted)' }}>Mint / Success / Merged PRs</div>
          </div>

          <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ height: '36px', background: 'var(--palette-neutral-900)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)' }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)', color: 'var(--color-text-primary)' }}>Neutral (#08110F)</div>
            <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-muted)' }}>Dark mineral background</div>
          </div>
        </div>
      </section>

      {/* 2. Metric Cards (Matching Screenshot Hierarchy) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <h2>Metric Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
          <MetricCard
            label="PULL REQUESTS"
            value="1,284"
            badge={<Badge variant="neutral">30D WINDOW</Badge>}
            subtext="312 open · 842 merged · 130 closed"
            segments={[
              { value: 312, color: 'coral', label: 'Open' },
              { value: 842, color: 'gold', label: 'Merged' },
              { value: 130, color: 'mint', label: 'Closed' },
            ]}
          />

          <MetricCard
            label="MERGE RATE"
            value="72.4%"
            badge={<span style={{ color: 'var(--palette-mint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)' }}>↑+4.2%</span>}
            subtext="842 merged / 1,164 finalized"
            progress={72.4}
            progressColor="mint"
          />

          <MetricCard
            label="TIME TO MERGE"
            value="18.4"
            suffix="hours"
            badge={<Badge variant="neutral">P50 CAL</Badge>}
            subtext="P90: 46.2h · Avg: 21.4h"
            progress={60}
            progressColor="gold"
          />

          <MetricCard
            label="PR ACTIVITY"
            value="104"
            suffix="merged this wk"
            badge={<span style={{ color: 'var(--palette-gold)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)' }}>+18.4% vel</span>}
            subtext="12 workspaces synchronized"
            progress={85}
            progressColor="gold"
          />
        </div>
      </section>

      {/* 3. Buttons & Form Controls */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <h2>Buttons & Form Controls</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
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

      {/* 4. Badges & Status Badges */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <h2>Badges & Status Badges</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'center' }}>
          <StatusBadge status="open" />
          <StatusBadge status="merged" />
          <StatusBadge status="closed" />
          <StatusBadge status="draft" />
          
          <span style={{ width: '1px', height: '20px', background: 'var(--color-border)' }} />

          <Badge variant="neutral">MAIN</Badge>
          <Badge variant="neutral">PROD</Badge>
          <Badge variant="primary">V2.4.1</Badge>
          <Badge variant="success">OPTIMAL</Badge>
          <Badge variant="warning">SYNC ACTIVE</Badge>
          <Badge variant="error">DEGRADED</Badge>
        </div>
      </section>

      {/* 5. Engineering Table */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Engineering Table</h2>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
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

      {/* 6. States (Loading, Empty, Error) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <h2>State Indicators & Card Layouts</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
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
