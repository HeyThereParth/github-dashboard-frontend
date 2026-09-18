import styles from './EventStream.module.css';

const STREAM_EVENTS = [
  { id: 'PR #142', type: 'OPENED', repo: 'auth-service', detail: 'token expiration handling', time: '8m ago', badgeClass: 'badgeOpened' },
  { id: 'PR #389', type: 'MERGED', repo: 'github-intelligence-core', detail: '14.8h cycle time', time: '22m ago', badgeClass: 'badgeMerged' },
  { id: 'commit 7a91f2', type: 'COMMIT', repo: 'infra-terraform', detail: 'branch webhook verification', time: '35m ago', badgeClass: 'badgeCommit' },
  { id: 'review', type: 'APPROVED', repo: 'auth-service', detail: 'sarah.chen approved PR #142', time: '41m ago', badgeClass: 'badgeApproved' },
  { id: 'PR #104', type: 'MERGED', repo: 'engineering-dashboard', detail: '8.2h cycle time', time: '1.2h ago', badgeClass: 'badgeMerged' },
  { id: 'PR #58', type: 'OPENED', repo: 'github-intelligence-core', detail: 'sqlite migration hydration', time: '1.8h ago', badgeClass: 'badgeOpened' },
  { id: 'PR #211', type: 'MERGED', repo: 'mobile-app', detail: '31.4h cycle time', time: '2.5h ago', badgeClass: 'badgeMerged' },
  { id: 'commit 8fe3b1', type: 'COMMIT', repo: 'customer-dashboard', detail: 'batching delta ingestion', time: '3.1h ago', badgeClass: 'badgeCommit' },
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
              <span className={styles.eventDot} />
              <span className={styles.eventIdentifier}>{evt.id}</span>
              <span className={styles[evt.badgeClass]}>{evt.type}</span>
              <span className={styles.eventRepo}>{evt.repo}</span>
              <span className={styles.eventSeparator}>·</span>
              <span className={styles.eventDetail}>{evt.detail}</span>
              <span className={styles.eventTime}>{evt.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventStream;
