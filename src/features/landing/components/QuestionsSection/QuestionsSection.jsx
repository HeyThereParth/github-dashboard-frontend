import { useState, useRef, useEffect } from 'react';
import { usePrefersReducedMotion } from '../../hooks';
import styles from './QuestionsSection.module.css';

const QUESTIONS_DATA = [
  {
    idx: '01',
    question: "What's moving?",
    tag: 'ACTIVE PULL REQUESTS',
    value: '312',
    unit: 'open pull requests',
    details: 'Real-time overview across 12 connected repositories showing work actively in review.',
    metrics: [
      { label: 'OPEN', val: '312' },
      { label: 'MERGED (30D)', val: '842' },
      { label: 'CLOSED', val: '130' },
    ],
  },
  {
    idx: '02',
    question: "What's taking longer?",
    tag: 'CYCLE TIME DISTRIBUTION',
    value: '18.4h',
    unit: 'average duration',
    details: 'Compare median turnaround against high-latency branches to spot review and merge delays.',
    metrics: [
      { label: 'P50 MEDIAN', val: '14.2h' },
      { label: 'P90 BOUNDARY', val: '46.2h' },
      { label: 'OVERALL AVG', val: '21.4h' },
    ],
  },
  {
    idx: '03',
    question: "What's being merged?",
    tag: 'DELIVERY CADENCE',
    value: '72.4%',
    unit: 'merge rate',
    details: '104 pull requests merged this week, tracking delivery pace against the 30-day baseline.',
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
    details: 'Continuous activity monitoring across production branches, mainlines, and release tags.',
    metrics: [
      { label: 'FASTEST P50', val: '4.6h' },
      { label: 'MEDIAN P50', val: '14.2h' },
      { label: 'STATUS', val: 'STEADY' },
    ],
  },
];

export const QuestionsSection = () => {
  const [activeIdx, setActiveIdx] = useState(1);
  const [displayIdx, setDisplayIdx] = useState(1);
  const [isExiting, setIsExiting] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const transitionTimerRef = useRef(null);

  const handleSelectQuestion = (newIndex) => {
    if (newIndex === activeIdx) return;
    setActiveIdx(newIndex);

    if (prefersReducedMotion) {
      setDisplayIdx(newIndex);
      return;
    }

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    setIsExiting(true);
    transitionTimerRef.current = setTimeout(() => {
      setDisplayIdx(newIndex);
      setIsExiting(false);
    }, 140);
  };

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const current = QUESTIONS_DATA[displayIdx];

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
                  onClick={() => handleSelectQuestion(index)}
                  onMouseEnter={() => handleSelectQuestion(index)}
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
          <div
            key={current.idx}
            className={`${styles.inspectorContent} ${
              isExiting ? styles.inspectorLeaving : styles.inspectorEntering
            }`}
          >
            <div className={styles.inspectorHeader}>
              <div className={styles.inspectorTagGroup}>
                <span className={styles.inspectorDot} />
                <span className={styles.inspectorTag}>{current.tag}</span>
              </div>
              <span className={styles.inspectorMeta}>30-DAY WINDOW</span>
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
      </div>
    </section>
  );
};

export default QuestionsSection;
