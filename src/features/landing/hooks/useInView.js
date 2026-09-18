import { useState, useEffect, useRef } from 'react';

/**
 * Hook to track whether an element is within the viewport using IntersectionObserver.
 *
 * @param {Object} options
 * @param {number} [options.threshold=0.15] - Percentage of target visibility to trigger.
 * @param {string} [options.rootMargin='0px'] - Margin around the root element.
 * @param {boolean} [options.triggerOnce=true] - Disconnect after first intersection.
 * @returns {[React.RefObject, boolean]} - Ref to attach to the element and boolean inView state.
 */
export const useInView = (options = {}) => {
  const { threshold = 0.15, rootMargin = '0px', triggerOnce = true } = options;
  const [inView, setInView] = useState(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return true;
    }
    return false;
  });
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.unobserve(target);
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [targetRef, inView];
};

export default useInView;
