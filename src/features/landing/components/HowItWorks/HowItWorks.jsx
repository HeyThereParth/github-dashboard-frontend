import { useInView } from '../../hooks';
import styles from './HowItWorks.module.css';

export const HowItWorks = () => {
  const [containerRef, inView] = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section id="pipeline" className={styles.section} aria-label="Engineering Data Pipeline">
      <div className={styles.header}>
        <div className={styles.eyebrow}>HOW IT WORKS</div>
        <h2 className={styles.title}>From raw GitHub events to clear engineering signals.</h2>
      </div>

      <div
        ref={containerRef}
        className={`${styles.pipelineContainer} ${inView ? styles.pipelineContainerVisible : ''}`}
      >
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
                <span>Reviews, Approvals & Comments</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} />
                <span>Merge & Close Events</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} />
                <span>Repository Commit Metadata</span>
              </div>
            </div>
          </div>

          {/* Connector 1 */}
          <div className={styles.connector} aria-hidden="true">
            <span className={styles.signalPulse1} />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.connectorSvg}>
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Stage 2: GitHub Intelligence Processing */}
          <div className={`${styles.stageBox} ${styles.stageBoxMiddle}`}>
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
                <span>Merge Rate Calculation</span>
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
            <span className={styles.signalPulse2} />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.connectorSvg}>
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Stage 3: Dashboard Output */}
          <div className={styles.stageBox}>
            <div className={styles.stageHeader}>
              <span>03 · INSIGHTS & SIGNALS</span>
            </div>
            <h3 className={styles.stageTitle}>Dashboard</h3>
            <div className={styles.stageItems}>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-mint)' }} />
                <span>Live Pull Request Status</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-mint)' }} />
                <span>Weekly Delivery Comparison</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-mint)' }} />
                <span>Repository Turnaround Times</span>
              </div>
              <div className={styles.stageItem}>
                <span className={styles.stageDot} style={{ backgroundColor: 'var(--palette-mint)' }} />
                <span>Team Workflow Visibility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
