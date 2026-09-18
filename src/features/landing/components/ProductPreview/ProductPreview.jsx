import { useState } from 'react';
import { useInView } from '../../hooks';
import {
  MetricCard,
  Badge,
  StatusBadge,
  Tabs,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';
import { PullRequestActivityChart, ActiveRepositoriesCard } from '@/features/overview';
import styles from './ProductPreview.module.css';

export const ProductPreview = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sectionRef, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const tabs = [
    { value: 'all', label: 'All', count: 1284 },
    { value: 'open', label: 'Open', count: 312, dotColor: 'var(--palette-coral)' },
    { value: 'merged', label: 'Merged', count: 842, dotColor: 'var(--palette-mint)' },
  ];

  const samplePRs = [
    {
      id: '#142',
      title: 'Fix authentication token expiration handling',
      repo: 'auth-service',
      state: 'open',
      cycleTime: '2.4h',
      updated: '42m ago',
    },
    {
      id: '#389',
      title: 'Optimize PR throughput telemetry ingestion batching',
      repo: 'github-intelligence-core',
      state: 'merged',
      cycleTime: '14.8h',
      updated: '1.5h ago',
    },
    {
      id: '#104',
      title: 'Implement dark mineral architectural design system',
      repo: 'engineering-dashboard',
      state: 'merged',
      cycleTime: '8.2h',
      updated: '3h ago',
    },
  ];

  return (
    <section ref={sectionRef} id="preview" className={styles.section} aria-label="Platform Preview">
      <div className={styles.previewHeader}>
        <div className={styles.previewEyebrow}>ONE VIEW</div>
        <h2 className={styles.sectionTitle}>From hundreds of GitHub events to a few useful signals.</h2>
        <p className={styles.sectionSubtitle}>
          See pull requests, merge activity, repository trends, and cycle time without piecing the story together manually.
        </p>
      </div>

      <div className={`${styles.previewCard} ${inView ? styles.previewCardVisible : ''}`}>
        {/* Window Chrome */}
        <div className={styles.windowHeader}>
          <div className={styles.windowDots}>
            <span className={styles.windowDot} />
            <span className={styles.windowDot} />
            <span className={styles.windowDot} />
          </div>
          <span className={styles.windowTitle}>github-intelligence.internal • Engineering Overview</span>
          <Badge variant="neutral" size="sm">SAMPLE WORKSPACE</Badge>
        </div>

        {/* Dashboard Content */}
        <div className={styles.previewContent}>
          {/* Top Metric Cards */}
          <div className={styles.metricsGrid}>
            <MetricCard
              label="PULL REQUESTS"
              value="1,284"
              badge={<Badge variant="neutral">30D WINDOW</Badge>}
              subtext="312 open · 842 merged · 130 closed"
              segments={[
                { value: 312, color: 'coral', label: 'Open' },
                { value: 842, color: 'gold', label: 'Merged' },
                { value: 130, color: 'neutral', label: 'Closed' },
              ]}
            />

            <MetricCard
              label="MERGE RATE"
              value="72.4%"
              badge={
                <span style={{ color: 'var(--palette-mint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)' }}>
                  ↑+4.2%
                </span>
              }
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
              progress={40}
              progressColor="gold"
            />

            <MetricCard
              label="PR ACTIVITY"
              value="104"
              suffix="merged this wk"
              badge={
                <span style={{ color: 'var(--palette-mint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-label)' }}>
                  +18.4% vel
                </span>
              }
              subtext="12 repositories tracked"
              progress={85}
              progressColor="gold"
            />
          </div>

          {/* Middle Split Grid: Pull Request Activity Chart + Active Repositories */}
          <div className={styles.overviewSplitGrid}>
            <PullRequestActivityChart />
            <ActiveRepositoriesCard />
          </div>

          {/* Table Snippet */}
          <div>
            <div className={styles.tableHeaderRow}>
              <h3 className={styles.tableTitle}>Recent pull requests</h3>
              <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TITLE & PR ID</TableHead>
                  <TableHead>REPOSITORY</TableHead>
                  <TableHead>STATE</TableHead>
                  <TableHead align="right">CYCLE TIME</TableHead>
                  <TableHead align="right">UPDATED</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samplePRs.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', marginRight: 'var(--space-2)' }}>
                        {row.id}
                      </span>
                      <span>{row.title}</span>
                    </TableCell>
                    <TableCell>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>
                        {row.repo}
                      </span>
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
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPreview;
