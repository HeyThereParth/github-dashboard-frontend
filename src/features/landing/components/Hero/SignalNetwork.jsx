import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';
import styles from './SignalNetwork.module.css';

/**
 * Signal convergence positions (within SVG viewBox 0 0 520 300).
 *
 * Three source labels on the left feed curved paths into a single
 * convergence point, which extends rightward toward an output label.
 */
const SOURCES = [
  { label: 'repositories', x: 20, y: 70, color: 'mint' },
  { label: 'pull requests', x: 20, y: 150, color: 'gold' },
  { label: 'cycle time', x: 20, y: 230, color: 'mint' },
];

const CONVERGENCE = { x: 310, y: 150 };

/**
 * Build a smooth cubic bezier from source to convergence.
 */
const buildPath = (sx, sy, cx, cy) => {
  const midX = sx + (cx - sx) * 0.55;
  return `M ${sx + 90} ${sy} C ${midX} ${sy}, ${cx - 60} ${cy}, ${cx} ${cy}`;
};

const PATHS = SOURCES.map((src) => ({
  d: buildPath(src.x, src.y, CONVERGENCE.x, CONVERGENCE.y),
  color: src.color,
}));

/* Continuation line from convergence to right */
const CONTINUATION = `M ${CONVERGENCE.x} ${CONVERGENCE.y} L 460 ${CONVERGENCE.y}`;

/**
 * Pulse configs — staggered delays for source nodes + convergence.
 */
const NODE_PULSE_CONFIGS = [
  { delay: 0 },
  { delay: 1.3 },
  { delay: 2.6 },
];

/**
 * Flow dot configs — each travels along one of the three paths.
 * Uses SVG `<animateMotion>` for path-following to avoid per-frame JS.
 */
const FLOW_DOTS = [
  { pathIndex: 0, color: 'mint', duration: '6s', delay: '0s' },
  { pathIndex: 1, color: 'gold', duration: '7s', delay: '2s' },
  { pathIndex: 2, color: 'mint', duration: '6.5s', delay: '3.5s' },
];

export const SignalNetwork = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={styles.networkContainer} aria-hidden="true">
      <svg
        className={styles.networkSvg}
        viewBox="0 0 520 300"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {/* ── Source labels ── */}
        {SOURCES.map((src) => (
          <text
            key={src.label}
            className={styles.sourceLabel}
            x={src.x}
            y={src.y + 1}
            dominantBaseline="middle"
          >
            {src.label}
          </text>
        ))}

        {/* ── Signal paths ── */}
        {PATHS.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            className={`${styles.signalPath} ${
              p.color === 'mint' ? styles.pathMint : styles.pathGold
            }`}
            initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: p.color === 'mint' ? 0.2 : 0.18 }}
            transition={{
              pathLength: { duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.15 },
              opacity: { duration: 0.6, delay: 0.3 + i * 0.15 },
            }}
          />
        ))}

        {/* ── Continuation line ── */}
        <motion.path
          d={CONTINUATION}
          className={styles.continuationPath}
          initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.15 }}
          transition={{
            pathLength: { duration: 0.6, ease: 'easeOut', delay: 0.9 },
            opacity: { duration: 0.4, delay: 0.9 },
          }}
        />

        {/* ── Source nodes ── */}
        {SOURCES.map((src, i) => (
          <motion.circle
            key={src.label}
            cx={src.x + 90}
            cy={src.y}
            className={`${styles.signalNode} ${
              src.color === 'mint' ? styles.nodeMint : styles.nodeGold
            }`}
            initial={prefersReducedMotion ? { opacity: 0.5 } : { opacity: 0, scale: 0.6 }}
            animate={
              prefersReducedMotion
                ? { opacity: 0.5 }
                : {
                    opacity: [0.35, 0.75, 0.35],
                    scale: [1, 1.12, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    opacity: {
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5 + NODE_PULSE_CONFIGS[i].delay,
                    },
                    scale: {
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5 + NODE_PULSE_CONFIGS[i].delay,
                    },
                  }
            }
          />
        ))}

        {/* ── Convergence ring ── */}
        <circle
          cx={CONVERGENCE.x}
          cy={CONVERGENCE.y}
          className={styles.convergenceRing}
        />

        {/* ── Convergence node ── */}
        <motion.circle
          cx={CONVERGENCE.x}
          cy={CONVERGENCE.y}
          className={styles.convergenceNode}
          initial={prefersReducedMotion ? { opacity: 0.7 } : { opacity: 0, scale: 0.5 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.7 }
              : {
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.04, 1],
                }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  opacity: {
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1.2,
                  },
                  scale: {
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1.2,
                  },
                }
          }
        />

        {/* ── Flow dots (CSS hides them when prefers-reduced-motion) ── */}
        {!prefersReducedMotion &&
          FLOW_DOTS.map((dot, i) => (
            <circle
              key={i}
              r="1.5"
              className={`${styles.flowDot} ${
                dot.color === 'mint' ? styles.flowDotMint : styles.flowDotGold
              }`}
              opacity="0.6"
            >
              <animateMotion
                dur={dot.duration}
                begin={dot.delay}
                repeatCount="indefinite"
                path={PATHS[dot.pathIndex].d}
              />
            </circle>
          ))}

        {/* ── Output label ── */}
        <motion.text
          className={styles.outputLabel}
          x={470}
          y={CONVERGENCE.y - 10}
          textAnchor="middle"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <tspan x="470" dy="0" className={styles.outputLabelAccent}>
            A CLEARER
          </tspan>
          <tspan x="470" dy="14">
            ENGINEERING SIGNAL
          </tspan>
        </motion.text>
      </svg>
    </div>
  );
};

export default SignalNetwork;
