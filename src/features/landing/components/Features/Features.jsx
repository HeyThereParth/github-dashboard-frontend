import {
  GitPullRequest,
  Clock,
  TrendingUp,
  Users,
  FolderGit2,
  RefreshCw,
} from 'lucide-react';
import styles from './Features.module.css';

const FEATURES = [
  {
    icon: GitPullRequest,
    title: 'Pull Request Intelligence',
    description:
      'Deep visibility into open, merged, and unmerged pull requests. Inspect review stages, state changes, and merge outcomes across your monorepos and microservices.',
    meta: 'Telemetry • Real-Time States',
  },
  {
    icon: Clock,
    title: 'Cycle Time & Latency',
    description:
      'Compute exact P50, P90, and average time-to-merge metrics. Identify review bottlenecks and distinguish fast PR turnarounds from long-running integration tasks.',
    meta: 'Distribution • P50 / P90 Hours',
  },
  {
    icon: TrendingUp,
    title: 'Delivery Velocity & Throughput',
    description:
      'Track weekly merged volume and delivery cadence across release trains. Compare current activity against 30-day baseline efficiency deltas.',
    meta: 'Cadence • Weekly Volume',
  },
  {
    icon: Users,
    title: 'Non-Gamified Contributor Flow',
    description:
      'Expose team operational load and turnaround metrics without creating developer leaderboards. Focus on team capacity and code review distribution.',
    meta: 'Observability • Team Insights',
  },
  {
    icon: FolderGit2,
    title: 'Repository Telemetry',
    description:
      'Discover available repositories from your GitHub App installation, track critical repositories, and manage indexed PR pipelines with unified controls.',
    meta: 'Management • Track & Ingest',
  },
  {
    icon: RefreshCw,
    title: 'Automated Synchronization',
    description:
      'Trigger asynchronous background synchronization and monitor ingestion jobs with live status reporting, webhook checks, and error diagnostics.',
    meta: 'Pipeline • Async Sync Jobs',
  },
];

export const Features = () => {
  return (
    <section id="features" className={styles.section} aria-label="Product Features">
      <div className={styles.header}>
        <div className={styles.eyebrow}>Capabilities</div>
        <h2 className={styles.title}>Purpose-built for engineering delivery</h2>
        <p className={styles.subtitle}>
          Signals and operational telemetry calibrated specifically for engineering managers, tech leads, and development teams.
        </p>
      </div>

      <div className={styles.grid}>
        {FEATURES.map(({ icon: Icon, title, description, meta }) => (
          <div key={title} className={styles.featureCard}>
            <div className={styles.iconWrapper} aria-hidden="true">
              <Icon size={18} />
            </div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDescription}>{description}</p>
            <span className={styles.featureMeta}>{meta}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
