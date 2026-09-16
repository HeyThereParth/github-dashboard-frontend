import styles from './HowItWorks.module.css';

const STEPS = [
  {
    step: '01',
    title: 'Install GitHub App',
    description: 'Grant secure, read-only permissions to your organization repositories via our official GitHub App integration.',
  },
  {
    step: '02',
    title: 'Track Repositories',
    description: 'Select the core repositories, microservices, or monorepos you want to monitor within your workspace.',
  },
  {
    step: '03',
    title: 'Synchronize Telemetry',
    description: 'Our FastAPI service asynchronously syncs pull requests, reviews, commits, and webhook events into the operational store.',
  },
  {
    step: '04',
    title: 'Analyze Metrics',
    description: 'Calculate P50/P90 cycle time, throughput trends, and merge hygiene across your team without manual spreadsheets.',
  },
  {
    step: '05',
    title: 'Observe Delivery Health',
    description: 'Gain clear, actionable engineering visibility to optimize delivery cadence and release train stability.',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className={styles.section} aria-label="How It Works">
      <div className={styles.header}>
        <div className={styles.eyebrow}>Workflow</div>
        <h2 className={styles.title}>From GitHub activity to operational clarity</h2>
        <p className={styles.subtitle}>
          A seamless pipeline connecting your GitHub events directly to engineering intelligence.
        </p>
      </div>

      <div className={styles.stepsGrid}>
        {STEPS.map(({ step, title, description }) => (
          <div key={step} className={styles.stepCard}>
            <span className={styles.stepNumber}>{step}</span>
            <h3 className={styles.stepTitle}>{title}</h3>
            <p className={styles.stepDescription}>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
