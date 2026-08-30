import { useEffect, useRef, useState } from 'react';

/* hitung naik sekali saat mount, hormati prefers-reduced-motion */
export default function AnimatedNumber({ value }) {
  const [v, setV] = useState(value);
  const raf = useRef(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(value);
      return;
    }
    const t0 = performance.now(), dur = 900;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(value * e));
      if (p < 1) raf.current = requestAnimationFrame(step);
      else setV(value);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);
  return v;
}