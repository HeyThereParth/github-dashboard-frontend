import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks';
import styles from './SignalNetwork.module.css';

/**
 * SVG icon renderers — simple stroke-based icons for each signal source.
 * All icons drawn within a 32×32 local coordinate space.
 */
const SourceIcon = ({ type, color }) => {
  const strokeClass = color === 'mint' ? styles.iconStrokeMint : styles.iconStrokeGold;

  if (type === 'database') {
    return (
      <g className={strokeClass}>
        <ellipse cx="16" cy="11" rx="7" ry="2.5" />
        <path d="M 9 11 v 8 c 0 2.5 14 2.5 14 0 v -8" />
        <path d="M 9 15.5 c 0 2.5 14 2.5 14 0" />
      </g>
    );
  }

  if (type === 'gitMerge') {
    return (
      <g className={strokeClass}>
        <circle cx="11" cy="10" r="2.2" />
        <circle cx="21" cy="10" r="2.2" />
        <circle cx="16" cy="22" r="2.2" />
        <path d="M 11 12.2 L 16 19.8 M 21 12.2 L 16 19.8" />
      </g>
    );
  }

  // clock
  return (
    <g className={strokeClass}>
      <circle cx="16" cy="16" r="8" />
      <path d="M 16 11 v 5 l 3.5 3.5" strokeLinecap="round" />
    </g>
  );
};

/**
 * Layout constants (SVG viewBox: 0 0 660 340)
 */
const SOURCE_X = 16;
const ICON_SIZE = 32;
const ICON_RADIUS = 6;
const LABEL_X = SOURCE_X + ICON_SIZE + 12;
const PATH_START_X = 230;

const SOURCES = [
  {
    label: 'REPOSITORIES',
    description: ['Code changes, new repos,', 'active contributors'],
    y: 70,
    color: 'mint',
    icon: 'database',
  },
  {
    label: 'PULL REQUESTS',
    description: ['Open, merged, review time,', 'bottlenecks'],
    y: 170,
    color: 'gold',
    icon: 'gitMerge',
  },
  {
    label: 'CYCLE TIME',
    description: ['Build time, time to merge,', 'deployment frequency'],
    y: 270,
    color: 'mint',
    icon: 'clock',
  },
];

const CONVERGENCE = { x: 410, y: 170 };

/**
 * Build a smooth cubic bezier from path start to convergence.
 */
const buildPath = (sy, cx, cy) => {
  const sx = PATH_START_X;
  const midX = sx + (cx - sx) * 0.55;
  return `M ${sx} ${sy} C ${midX} ${sy}, ${cx - 60} ${cy}, ${cx} ${cy}`;
};

const PATHS = SOURCES.map((src) => ({
  d: buildPath(src.y, CONVERGENCE.x, CONVERGENCE.y),
  color: src.color,
}));

/* Continuation line from convergence to right */
const CONTINUATION = `M ${CONVERGENCE.x} ${CONVERGENCE.y} L 560 ${CONVERGENCE.y}`;

/**
 * Pulse configs — staggered delays for source nodes.
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
        viewBox="0 0 660 340"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {/* ── Source groups: icon + label + description ── */}
        {SOURCES.map((src) => (
          <g key={src.label}>
            {/* Icon container box */}
            <rect
              x={SOURCE_X}
              y={src.y - ICON_SIZE / 2}
              width={ICON_SIZE}
              height={ICON_SIZE}
              rx={ICON_RADIUS}
              className={styles.iconBox}
            />

            {/* Icon (drawn in local 32×32 space, translated to position) */}
            <g transform={`translate(${SOURCE_X}, ${src.y - ICON_SIZE / 2})`}>
              <SourceIcon type={src.icon} color={src.color} />
            </g>

            {/* Label */}
            <text
              className={styles.sourceTitle}
              x={LABEL_X}
              y={src.y - 6}
              dominantBaseline="middle"
            >
              {src.label}
            </text>

            {/* Description (multi-line) */}
            <text className={styles.sourceDescription} x={LABEL_X} y={src.y + 10}>
              {src.description.map((line, j) => (
                <tspan key={j} x={LABEL_X} dy={j === 0 ? 0 : 13}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
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
            animate={{ pathLength: 1, opacity: p.color === 'mint' ? 0.25 : 0.22 }}
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

        {/* ── Source nodes (at path start points) ── */}
        {SOURCES.map((src, i) => (
          <motion.circle
            key={src.label}
            cx={PATH_START_X}
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

        {/* ── Flow dots (hidden when prefers-reduced-motion) ── */}
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
          x={580}
          y={CONVERGENCE.y - 10}
          textAnchor="middle"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <tspan x="580" dy="0" className={styles.outputLabelAccent}>
            A CLEARER
          </tspan>
          <tspan x="580" dy="14">
            ENGINEERING SIGNAL
          </tspan>
        </motion.text>
      </svg>
    </div>
  );
};

export default SignalNetwork;
