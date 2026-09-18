import styles from './WhoItsFor.module.css';

export const WhoItsFor = () => {
  return (
    <section className={styles.section} aria-label="Who It's For">
      <div className={styles.header}>
        <div className={styles.eyebrow}>BUILT FOR ENGINEERING TEAMS</div>
        <h2 className={styles.title}>A clearer view for everyone involved in delivery.</h2>
      </div>

      <div className={styles.columnsGrid}>
        {/* Column 1: Engineering Managers */}
        <div className={styles.columnItem}>
          <h3 className={styles.roleHeading}>
            ENGINEERING<br />MANAGERS
          </h3>
          <p className={styles.roleDescription}>
            See delivery activity across repositories without manual updates or spreadsheet reviews.
          </p>
        </div>

        {/* Column 2: Tech Leads */}
        <div className={styles.columnItem}>
          <h3 className={styles.roleHeading}>
            TECH<br />LEADS
          </h3>
          <p className={styles.roleDescription}>
            Understand PR flow and cycle time to spot where reviews and integration work are taking longer.
          </p>
        </div>

        {/* Column 3: Developers */}
        <div className={styles.columnItem}>
          <h3 className={styles.roleHeading}>
            DEVELOPERS
          </h3>
          <p className={styles.roleDescription}>
            See project activity and merge cadence without jumping between dozens of browser tabs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoItsFor;
