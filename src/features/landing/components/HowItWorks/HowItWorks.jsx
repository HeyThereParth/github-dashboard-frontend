import styles from './HowItWorks.module.css';

export const HowItWorks = () => {
  return (
    <section id="pipeline" className={styles.section} aria-label="Engineering Data Pipeline">
      <div className={styles.header}>
        <div className={styles.eyebrow}>HOW IT WORKS</div>
        <h2 className={styles.title}>From raw GitHub events to clear engineering signals.</h2>
      </div>

      <div className={styles.pipelineContainer}>
        <div className={styles.pipelineFlow}>
          {/* Stage 1: GitHub Sources */}
          <div className={styles.stageBox}>
            <div className={styles.stageHeader}>
              <span>01 · REPOSITORY SOURCES</span>
            </div>
            <h3 className={styles.stageTitle}>GitHub</h3>
            <div className={styles.stageItems}>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} />
                <span>Pull Request Creations & Updates</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} />
                <span>Code Reviews & Comments</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} />
                <span>Merge & Close Events</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} />
                <span>Repository Metadata</span>
              </div>
            </div>
          </div>

          {/* Connector 1 */}
          <div className={styles.connector} aria-hidden="true">
            →
          </div>

          {/* Stage 2: GitHub Intelligence Processing */}
          <div className={styles.stageBox}>
            <div className={styles.stageHeader}>
              <span>02 · INTELLIGENCE ENGINE</span>
            </div>
            <h3 className={styles.stageTitle}>GitHub Intelligence</h3>
            <div className={styles.stageItems}>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-gold)' }} />
                <span>P50 & P90 Cycle Time Math</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-mint)' }} />
                <span>Merge Rate & Success Hygiene</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-coral)' }} />
                <span>Weekly Delivery Cadence</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-gold)' }} />
                <span>Active Repository Velocity</span>
              </div>
            </div>
          </div>

          {/* Connector 2 */}
          <div className={styles.connector} aria-hidden="true">
            →
          </div>

          {/* Stage 3: Dashboard Output */}
          <div className={styles.stageBox}>
            <div className={styles.stageHeader}>
              <span>03 · OPERATIONAL OUTPUT</span>
            </div>
            <h3 className={styles.stageTitle}>Dashboard</h3>
            <div className={styles.stageItems}>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-mint)' }} />
                <span>Live PR Throughput Status</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-mint)' }} />
                <span>Weekly Velocity Delta Tracking</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-mint)' }} />
                <span>Ranked Repository Latency</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-mint)' }} />
                <span>Non-Gamified Team Flow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
