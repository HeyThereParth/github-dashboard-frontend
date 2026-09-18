import { useState, useEffect, useRef } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

/**
 * Counts up a numeric value with smooth cubic ease-out once triggered.
 *
 * @param {Object} options
 * @param {number|string} options.target - Final target value (e.g. 18.4, "72.4%", 104)
 * @param {boolean} [options.enabled=true] - Whether count up is active (e.g. when in view)
 * @param {number} [options.duration=600] - Duration in milliseconds (500–700ms)
 * @param {number} [options.decimals] - Optional decimal places override
 * @returns {string} Formatted animated value with original suffix preserved
 */
export const useCountUp = ({ target, enabled = true, duration = 600, decimals }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasAnimatedRef = useRef(false);

  // Parse numeric target and suffix (e.g. "72.4%", "18.4", "104")
  const rawString = String(target);
  const match = rawString.match(/^([\d.]+)(.*)$/);
  const targetNum = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : '';
  const decimalPlaces =
    decimals !== undefined
      ? decimals
      : match && match[1].includes('.')
      ? match[1].split('.')[1].length
      : 0;

  const [displayValue, setDisplayValue] = useState(() =>
    prefersReducedMotion ? rawString : (0).toFixed(decimalPlaces) + suffix
  );

  useEffect(() => {
    if (!enabled || hasAnimatedRef.current || prefersReducedMotion) return;

    hasAnimatedRef.current = true;
    let startTime = null;
    let rafId = null;

    // Smooth cubic ease-out curve
    const cubicEaseOut = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = cubicEaseOut(progress);
      const current = eased * targetNum;

      setDisplayValue(current.toFixed(decimalPlaces) + suffix);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetNum.toFixed(decimalPlaces) + suffix);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled, targetNum, decimalPlaces, suffix, duration, prefersReducedMotion]);

  // If preference changes to reduced motion at runtime, show target value
  return prefersReducedMotion ? rawString : displayValue;
};

export default useCountUp;
