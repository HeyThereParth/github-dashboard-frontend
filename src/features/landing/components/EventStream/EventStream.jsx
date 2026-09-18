import styles from './EventStream.module.css';

const STREAM_EVENTS = [
  { id: 'PR #142', type: 'OPENED', repo: 'auth-service', detail: 'token expiration handling', badgeClass: 'badgeOpened' },
  { id: 'PR #389', type: 'MERGED', repo: 'github-intelligence-core', detail: '14.8h cycle time', badgeClass: 'badgeMerged' },
  { id: 'commit 7a91f2', type: 'COMMIT', repo: 'infra-terraform', detail: 'branch webhook verification', badgeClass: 'badgeCommit' },
  { id: 'review', type: 'APPROVED', repo: 'auth-service', detail: 'sarah.chen approved PR #142', badgeClass: 'badgeApproved' },
  { id: 'PR #104', type: 'MERGED', repo: 'engineering-dashboard', detail: '8.2h cycle time', badgeClass: 'badgeMerged' },
  { id: 'PR #58', type: 'OPENED', repo: 'github-intelligence-core', detail: 'sqlite migration hydration', badgeClass: 'badgeOpened' },
  { id: 'PR #211', type: 'MERGED', repo: 'mobile-app', detail: '31.4h cycle time', badgeClass: 'badgeMerged' },
  { id: 'commit 8fe3b1', type: 'COMMIT', repo: 'customer-dashboard', detail: 'telemetry batching delta', badgeClass: 'badgeCommit' },
];

export const EventStream = () => {
  // Duplicate array once for seamless infinite marquee loop
  const displayEvents = [...STREAM_EVENTS, ...STREAM_EVENTS];

  return (
    <section className={styles.section} aria-label="GitHub Event Stream">
      <div className={styles.contentContainer}>
        <div className={styles.eyebrow}>FROM GITHUB</div>
        <h2 className={styles.title}>Your repositories already contain the signal.</h2>
        <p className={styles.subtitle}>
          Pull requests, reviews, commits, merges, and repository activity create a picture of how engineering work moves. GitHub Intelligence brings those signals together.
        </p>
      </div>

      <div className={styles.streamWrapper}>
        <div className={styles.streamTrack} aria-hidden="true">
          {displayEvents.map((evt, idx) => (
            <div key={`${evt.id}-${idx}`} className={styles.eventItem}>
              <span className={styles.eventIdentifier}>{evt.id}</span>
              <span className={styles[evt.badgeClass]}>{evt.type}</span>
              <span className={styles.eventMeta}>
                {evt.repo} · {evt.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventStream;
