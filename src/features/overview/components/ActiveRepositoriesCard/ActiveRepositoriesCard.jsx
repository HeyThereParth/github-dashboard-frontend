import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './ActiveRepositoriesCard.module.css';

const DEFAULT_REPOSITORIES = [
  {
    name: 'github-intelligence-core',
    env: 'MAIN',
    openPrs: 8,
    description: 'Ingestion daemon',
    p50Merge: '14.2h',
  },
  {
    name: 'engineering-dashboard',
    env: 'PROD',
    openPrs: 12,
    description: 'Client web portal',
    p50Merge: '9.0h',
  },
  {
    name: 'mobile-app',
    env: 'MAIN',
    openPrs: 8,
    description: 'React Native shell',
    p50Merge: '31.4h',
  },
  {
    name: 'infra-terraform',
    env: 'PROD',
    openPrs: 3,
    description: 'Cloud orchestration',
    p50Merge: '4.6h',
  },
  {
    name: 'auth-service',
    env: 'MAIN',
    openPrs: 5,
    description: 'Token federation',
    p50Merge: '16.1h',
  },
];

export const ActiveRepositoriesCard = ({
  repositories = DEFAULT_REPOSITORIES,
  totalWorkspaces = 12,
  className = '',
}) => {
  return (
    <div className={`${styles.card} ${className}`} role="region" aria-label="Active repositories list">
      <div className={styles.header}>
        <h2 className={styles.title}>Active Repositories</h2>
        <span className={styles.orderBadge}>ORDER: VELOCITY</span>
      </div>

      <div className={styles.repoList}>
        {repositories.map((repo) => (
          <div key={repo.name} className={styles.repoItem}>
            <div className={styles.primaryRow}>
              <div className={styles.repoNameGroup}>
                <span className={styles.repoName}>{repo.name}</span>
                <span className={styles.envBadge}>{repo.env}</span>
              </div>
              <div className={styles.latencyGroup}>
                <span className={styles.latencyValue}>{repo.p50Merge}</span>
                <span className={styles.latencyLabel}>P50 MERGE</span>
              </div>
            </div>

            <div className={styles.secondaryRow}>
              <span>{repo.openPrs} open PRs</span>
              <span className={styles.dotDivider} aria-hidden="true">•</span>
              <span className={styles.subsystemDesc}>{repo.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <span className={styles.footerWorkspaces}>{totalWorkspaces} tracked workspaces</span>
        <Link to="/app/repositories" className={styles.viewAllLink}>
          <span>View all repos</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default ActiveRepositoriesCard;
