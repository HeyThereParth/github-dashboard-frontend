import styles from './SignalsBento.module.css';

export const SignalsBento = () => {
  return (
    <section className={styles.section} aria-label="Signals and Insights">
      <div className={styles.header}>
        <div className={styles.eyebrow}>SIGNALS → INSIGHTS</div>
        <h2 className={styles.title}>Extracted signals from raw repository events.</h2>
      </div>

      <div className={styles.bentoGrid}>
        {/* Top 2x Featured Block: Cycle Time */}
        <div className={styles.cycleTimeBlock}>
          <div className={styles.blockHeader}>
            <span className={styles.blockLabel}>PULL REQUEST CYCLE TIME</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--palette-gold)' }}>
              WINDOW: 30D
            </span>
          </div>

          <div className={styles.heroMetric}>
            <span className={styles.bigValue}>18.4</span>
            <span className={styles.metricSuffix}>hours typical to merge</span>
          </div>

          <div className={styles.distributionRow}>
            <div className={styles.distItem}>
              <span className={styles.distLabel}>P50 MEDIAN</span>
              <span className={styles.distValue}>14.2h</span>
            </div>
            <div className={styles.distItem}>
              <span className={styles.distLabel}>P90 LATENCY</span>
              <span className={styles.distValue}>46.2h</span>
            </div>
            <div className={styles.distItem}>
              <span className={styles.distLabel}>OVERALL AVERAGE</span>
              <span className={styles.distValue}>21.4h</span>
            </div>
          </div>
        </div>

        {/* Right Side: Active Repositories Velocity Strip */}
        <div className={styles.repoPanel}>
          <div className={styles.blockHeader}>
            <span className={styles.blockLabel}>ACTIVE REPOSITORIES</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
              BY VELOCITY
            </span>
          </div>

          <div className={styles.repoList}>
            <div className={styles.repoRow}>
              <div className={styles.repoLeft}>
                <span className={styles.repoName}>github-intelligence-core</span>
                <span className={styles.repoMeta}>8 open PRs · Ingestion daemon</span>
              </div>
              <div className={styles.repoRight}>
                <span className={styles.repoLatency}>14.2h</span>
                <span className={styles.repoBadge}>MAIN</span>
              </div>
            </div>

            <div className={styles.repoRow}>
              <div className={styles.repoLeft}>
                <span className={styles.repoName}>engineering-dashboard</span>
                <span className={styles.repoMeta}>12 open PRs · Client portal</span>
              </div>
              <div className={styles.repoRight}>
                <span className={styles.repoLatency}>9.0h</span>
                <span className={styles.repoBadge}>PROD</span>
              </div>
            </div>

            <div className={styles.repoRow}>
              <div className={styles.repoLeft}>
                <span className={styles.repoName}>mobile-app</span>
                <span className={styles.repoMeta}>8 open PRs · React Native</span>
              </div>
              <div className={styles.repoRight}>
                <span className={styles.repoLatency}>31.4h</span>
                <span className={styles.repoBadge}>MAIN</span>
              </div>
            </div>

            <div className={styles.repoRow}>
              <div className={styles.repoLeft}>
                <span className={styles.repoName}>auth-service</span>
                <span className={styles.repoMeta}>5 open PRs · Token federation</span>
              </div>
              <div className={styles.repoRight}>
                <span className={styles.repoLatency}>16.1h</span>
                <span className={styles.repoBadge}>MAIN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Grid: Merge Rate & PR Activity */}
        <div className={styles.bottomSubGrid}>
          {/* Merge Rate Block */}
          <div className={styles.metricBlock}>
            <div className={styles.blockHeader}>
              <span className={styles.blockLabel}>MERGE RATE</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--palette-mint)' }}>
                ↑+4.2%
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '36px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                72.4%
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                842 / 1,164 finalized
              </span>
            </div>

            <div className={styles.meterTrack} aria-hidden="true">
              <div className={styles.meterMint} style={{ width: '72.4%' }} />
            </div>
          </div>

          {/* PR Activity Block */}
          <div className={styles.metricBlock}>
            <div className={styles.blockHeader}>
              <span className={styles.blockLabel}>WEEKLY ACTIVITY</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--palette-gold)' }}>
                +18.4%
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '36px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                104
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                merged this week
              </span>
            </div>

            <div className={styles.meterTrack} aria-hidden="true">
              <div className={styles.meterGold} style={{ width: '85%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignalsBento;
