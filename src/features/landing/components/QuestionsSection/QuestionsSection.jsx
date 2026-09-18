import { useState } from 'react';
import styles from './QuestionsSection.module.css';

const QUESTIONS_DATA = [
  {
    idx: '01',
    question: "What's moving?",
    tag: 'ACTIVE PR THROUGHPUT',
    value: '312',
    unit: 'open pull requests',
    details: 'Real-time telemetry showing pull requests actively in review across 12 tracked repositories.',
    metrics: [
      { label: 'OPEN', val: '312' },
      { label: 'MERGED (30D)', val: '842' },
      { label: 'CLOSED', val: '130' },
    ],
  },
  {
    idx: '02',
    question: "What's taking longer?",
    tag: 'PULL REQUEST CYCLE TIME',
    value: '18.4h',
    unit: 'average duration',
    details: 'Compare median turnaround with high-latency integration branches to eliminate review friction.',
    metrics: [
      { label: 'P50 MEDIAN', val: '14.2h' },
      { label: 'P90 BOUNDARY', val: '46.2h' },
      { label: 'OVERALL AVG', val: '21.4h' },
    ],
  },
  {
    idx: '03',
    question: "What's being merged?",
    tag: 'DELIVERY ACTIVITY & RATE',
    value: '72.4%',
    unit: 'merge success rate',
    details: '104 pull requests merged this week with +18.4% efficiency delta against the 30-day baseline.',
    metrics: [
      { label: 'THIS WEEK', val: '104' },
      { label: 'MERGED TOTAL', val: '842' },
      { label: 'FINALIZED', val: '1,164' },
    ],
  },
  {
    idx: '04',
    question: "What's changing?",
    tag: 'REPOSITORY VELOCITY',
    value: '12',
    unit: 'active repositories',
    details: 'Continuous background synchronization tracking production trunks, mainlines, and release candidates.',
    metrics: [
      { label: 'FASTEST P50', val: '4.6h' },
      { label: 'MEDIAN P50', val: '14.2h' },
      { label: 'STATUS', val: 'OPTIMAL' },
    ],
  },
];

export const QuestionsSection = () => {
  const [activeIdx, setActiveIdx] = useState(1); // Default to "What's taking longer?" as requested in spec

  const current = QUESTIONS_DATA[activeIdx];

  return (
    <section className={styles.section} aria-label="Key Engineering Questions">
      <div className={styles.splitGrid}>
        {/* Left: Question Navigation */}
        <div className={styles.leftColumn}>
          <span className={styles.eyebrow}>QUESTIONS</span>
          <h2 className={styles.headline}>What do you want to know?</h2>

          <div className={styles.questionsList} role="tablist">
            {QUESTIONS_DATA.map((item, index) => {
              const isActive = activeIdx === index;
              return (
                <button
                  key={item.idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.questionButton} ${isActive ? styles.questionButtonActive : ''}`}
                  onClick={() => setActiveIdx(index)}
                  onMouseEnter={() => setActiveIdx(index)}
                >
                  <span className={styles.questionIndex}>{item.idx}</span>
                  <span className={styles.questionText}>{item.question}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Dynamic Inspector Visual */}
        <div className={styles.inspectorBox} role="tabpanel" aria-live="polite">
          <div className={styles.inspectorHeader}>
            <span className={styles.inspectorTag}>{current.tag}</span>
            <span className={styles.inspectorMeta}>CALIBRATED 30D</span>
          </div>

          <div className={styles.inspectorValueRow}>
            <span className={styles.inspectorValue}>{current.value}</span>
            <span className={styles.inspectorUnit}>{current.unit}</span>
          </div>

          <p className={styles.inspectorDetails}>{current.details}</p>

          <div className={styles.inspectorSubGrid}>
            {current.metrics.map((m) => (
              <div key={m.label} className={styles.subItem}>
                <span className={styles.subLabel}>{m.label}</span>
                <span className={styles.subVal}>{m.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionsSection;
