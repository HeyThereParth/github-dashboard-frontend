import { useInView } from '../../hooks';
import styles from './FeatureStories.module.css';

export const FeatureStories = () => {
  const [story1Ref, story1InView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [story2Ref, story2InView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [story3Ref, story3InView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="features" className={styles.section} aria-label="Core Capabilities">
      {/* FEATURE 01: PULL REQUESTS */}
      <div
        ref={story1Ref}
        className={`${styles.storyRow} ${story1InView ? styles.story1Visible : ''}`}
      >
        <div className={styles.textContent}>
          <span className={styles.eyebrow}>01 / PULL REQUESTS</span>
          <h2 className={styles.headline}>Know what is moving.</h2>
          <p className={styles.description}>
            See open, merged, and closed pull requests across your repositories without checking each project individually.
          </p>
        </div>

        <div className={styles.miniTableWrapper}>
          <div className={styles.miniTableHeader}>
            <span>ACTIVE TELEMETRY STREAM</span>
            <span>STATUS</span>
          </div>

          <div className={styles.miniTableRow}>
            <div className={styles.prIdTitle}>
              <span className={styles.prId}>#142</span>
              <span className={styles.prTitle}>Fix authentication token expiration</span>
            </div>
            <span className={styles.statusOpen}>OPEN</span>
          </div>

          <div className={styles.miniTableRow}>
            <div className={styles.prIdTitle}>
              <span className={styles.prId}>#389</span>
              <span className={styles.prTitle}>Optimize ingestion batching</span>
            </div>
            <span className={styles.statusMerged}>MERGED</span>
          </div>

          <div className={styles.miniTableRow}>
            <div className={styles.prIdTitle}>
              <span className={styles.prId}>#104</span>
              <span className={styles.prTitle}>Update architecture</span>
            </div>
            <span className={styles.statusMerged}>MERGED</span>
          </div>
        </div>
      </div>

      {/* FEATURE 02: CYCLE TIME */}
      <div
        ref={story2Ref}
        className={`${styles.storyRow} ${story2InView ? styles.story2Visible : ''}`}
      >
        <div className={styles.textContent}>
          <span className={styles.eyebrow}>02 / CYCLE TIME</span>
          <h2 className={styles.headline}>See where time is going.</h2>
          <p className={styles.description}>
            Measure the time from opening a pull request to merge and compare typical and longer-running work.
          </p>
        </div>

        <div className={styles.cycleVisualWrapper}>
          <div className={styles.oversizedMetric}>
            <span className={styles.oversizedNumber}>18.4h</span>
            <span className={styles.oversizedLabel}>average cycle time</span>
          </div>

          <div className={styles.distributionBars}>
            <div className={styles.barRow}>
              <div className={styles.barMeta}>
                <span className={styles.barTitle}>P50 MEDIAN LATENCY</span>
                <span className={styles.barValue}>14.2h</span>
              </div>
              <div className={styles.distTrack}>
                <div className={styles.distFillMint} style={{ width: '40%' }} />
              </div>
            </div>

            <div className={styles.barRow}>
              <div className={styles.barMeta}>
                <span className={styles.barTitle}>P90 BOUNDARY LATENCY</span>
                <span className={styles.barValue}>46.2h</span>
              </div>
              <div className={styles.distTrack}>
                <div className={styles.distFillGold} style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 03: REPOSITORIES */}
      <div
        ref={story3Ref}
        className={`${styles.storyRow} ${story3InView ? styles.story3Visible : ''}`}
      >
        <div className={styles.textContent}>
          <span className={styles.eyebrow}>03 / REPOSITORIES</span>
          <h2 className={styles.headline}>See the bigger picture.</h2>
          <p className={styles.description}>
            Understand activity across the repositories that matter to your team.
          </p>
        </div>

        <div className={styles.repoVisualWrapper}>
          <div className={styles.repoVisualRow}>
            <span className={styles.repoVisualName}>checkout-api</span>
            <div className={styles.repoVisualBarContainer}>
              <div className={styles.repoVisualBarFill} style={{ width: '70%' }} />
            </div>
            <span className={styles.repoVisualLatency}>4.6h</span>
          </div>

          <div className={styles.repoVisualRow}>
            <span className={styles.repoVisualName}>customer-dashboard</span>
            <div className={styles.repoVisualBarContainer}>
              <div className={styles.repoVisualBarFill} style={{ width: '50%' }} />
            </div>
            <span className={styles.repoVisualLatency}>9.0h</span>
          </div>

          <div className={styles.repoVisualRow}>
            <span className={styles.repoVisualName}>mobile-app</span>
            <div className={styles.repoVisualBarContainer}>
              <div className={styles.repoVisualBarFill} style={{ width: '90%' }} />
            </div>
            <span className={styles.repoVisualLatency}>31.4h</span>
          </div>

          <div className={styles.repoVisualRow}>
            <span className={styles.repoVisualName}>auth-service</span>
            <div className={styles.repoVisualBarContainer}>
              <div className={styles.repoVisualBarFill} style={{ width: '40%' }} />
            </div>
            <span className={styles.repoVisualLatency}>16.1h</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureStories;
