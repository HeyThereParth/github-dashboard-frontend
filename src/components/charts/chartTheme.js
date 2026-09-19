/**
 * Shared design tokens and configuration constants for Recharts visualizations.
 * Aligns with the GitHub Intelligence Dark Mineral palette.
 */
export const CHART_COLORS = {
  gold: '#B7A16A',
  goldMuted: '#856D35',
  goldSubtle: 'rgba(183, 161, 106, 0.15)',
  coral: '#B96858',
  coralMuted: '#8F3F33',
  coralSubtle: 'rgba(185, 104, 88, 0.15)',
  mint: '#35B98A',
  mintMuted: '#238260',
  mintSubtle: 'rgba(53, 185, 138, 0.15)',
  neutralDark: '#08110F',
  neutralSurface: '#0D1714',
  neutralElevated: '#121E19',
  gridLine: 'rgba(255, 255, 255, 0.05)',
  axisLine: 'rgba(255, 255, 255, 0.08)',
  axisText: '#63736C',
  crosshair: 'rgba(255, 255, 255, 0.18)',
};

export const CHART_MARGINS = {
  top: 16,
  right: 16,
  left: 0,
  bottom: 4,
};

export const Y_AXIS_WIDTH = 38;

export const COMMON_AXIS_PROPS = {
  stroke: CHART_COLORS.axisLine,
  tickLine: false,
  axisLine: { stroke: CHART_COLORS.axisLine },
  tick: {
    fill: CHART_COLORS.axisText,
    fontSize: 10,
    fontFamily: 'var(--font-mono, monospace)',
    letterSpacing: '0.04em',
  },
};

export const COMMON_GRID_PROPS = {
  stroke: CHART_COLORS.gridLine,
  strokeDasharray: '2 4',
  vertical: false,
};

/**
 * Calculate a sensible integer Y-axis domain and ticks for count metrics (PRs, events).
 * Always preserves a 0 baseline, provides reasonable breathing room, and eliminates
 * decimal ticks and excessive empty headroom.
 *
 * @param {number} maxVal - Maximum count value in the dataset
 * @returns {{ domain: [number, number], ticks: number[] }}
 */
export const calculateCountDomain = (maxVal) => {
  const max = Math.max(0, Math.ceil(Number(maxVal) || 0));

  if (max === 0) {
    return { domain: [0, 4], ticks: [0, 1, 2, 3, 4] };
  }
  if (max === 1) {
    return { domain: [0, 2], ticks: [0, 1, 2] };
  }
  if (max === 2) {
    return { domain: [0, 3], ticks: [0, 1, 2, 3] };
  }
  if (max === 3) {
    return { domain: [0, 4], ticks: [0, 1, 2, 3, 4] };
  }
  if (max === 4) {
    return { domain: [0, 5], ticks: [0, 1, 2, 3, 4, 5] };
  }
  if (max <= 8) {
    const upper = max + 1;
    const ticks = [];
    const step = upper <= 6 ? 1 : 2;
    for (let i = 0; i <= upper; i += step) {
      ticks.push(i);
    }
    if (ticks[ticks.length - 1] !== upper) {
      ticks.push(upper);
    }
    return { domain: [0, upper], ticks };
  }
  if (max <= 20) {
    const step = 4;
    const upper = Math.ceil((max + 1) / step) * step;
    const ticks = [];
    for (let i = 0; i <= upper; i += step) {
      ticks.push(i);
    }
    return { domain: [0, upper], ticks };
  }
  if (max <= 50) {
    const step = 10;
    const upper = Math.ceil((max + 2) / step) * step;
    const ticks = [];
    for (let i = 0; i <= upper; i += step) {
      ticks.push(i);
    }
    return { domain: [0, upper], ticks };
  }

  // Large counts (100+)
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const roughStep = magnitude / 2;
  const step = roughStep < 10 ? 10 : roughStep;
  const upper = Math.ceil((max * 1.1) / step) * step;
  const ticks = [];
  for (let i = 0; i <= upper; i += step) {
    ticks.push(i);
  }
  return { domain: [0, upper], ticks };
};

/**
 * Calculate a sensible Y-axis domain and ticks for duration in hours (e.g. Cycle Time).
 * Preserves 0 baseline and formats ticks in clean intervals.
 *
 * @param {number | null | undefined} maxHours - Maximum hours value in dataset
 * @returns {{ domain: [number, number], ticks: number[] }}
 */
export const calculateHoursDomain = (maxHours) => {
  const max = Math.max(0, Number(maxHours) || 0);

  if (max === 0) {
    return { domain: [0, 24], ticks: [0, 6, 12, 18, 24] };
  }
  if (max <= 12) {
    return { domain: [0, 12], ticks: [0, 3, 6, 9, 12] };
  }
  if (max <= 24) {
    return { domain: [0, 24], ticks: [0, 6, 12, 18, 24] };
  }
  if (max <= 48) {
    return { domain: [0, 48], ticks: [0, 12, 24, 36, 48] };
  }
  if (max <= 72) {
    return { domain: [0, 72], ticks: [0, 18, 36, 54, 72] };
  }

  // Multiples of 24h for larger spans
  const step = 24;
  const upper = Math.ceil((max * 1.15) / step) * step;
  const tickCount = 4;
  const tickStep = upper / tickCount;
  const ticks = [];
  for (let i = 0; i <= upper; i += tickStep) {
    ticks.push(Math.round(i));
  }
  return { domain: [0, upper], ticks };
};

