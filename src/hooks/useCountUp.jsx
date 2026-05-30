import { useState, useEffect, useRef } from 'react';

export const useCountUp = (target, duration = 1800, once = true) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setHasAnimated(true);
          const numTarget = Number(target) || 0;
          if (numTarget === 0) return;

          const startTime = performance.now();

          const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * numTarget));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(numTarget);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration, once, hasAnimated]);

  return { count, ref };
};

export const useProgressBar = (target, duration = 1200, once = true) => {
  const [progress, setProgress] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setHasAnimated(true);
          const startTime = performance.now();

          const tick = (now) => {
            const elapsed = now - startTime;
            const p = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setProgress(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(tick);
            else setProgress(target);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration, once, hasAnimated]);

  return { progress, ref };
};

export const CountUp = ({
  value,
  suffix = '',
  prefix = '',
  duration = 1800,
  isBn = false,
  className = '',
}) => {
  const { count, ref } = useCountUp(Number(value) || 0, duration);

  const toBnNum = (n) => {
    if (!isBn) return n.toLocaleString();
    const d = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n.toString().replace(/\d/g, (c) => d[c]);
  };

  return (
    <span ref={ref} className={className}>
      {prefix}{toBnNum(count)}{suffix}
    </span>
  );
};

export default CountUp;
