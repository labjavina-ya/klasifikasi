import { useEffect, useRef, useState } from 'react';

const PAGE = 18;

export default function useInfinite(total) {
  const [n, setN] = useState(PAGE);
  const ref = useRef(null);

  useEffect(() => setN(PAGE), [total]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) setN(v => Math.min(v + PAGE, total));
    });
    io.observe(el);
    return () => io.disconnect();
  }, [total]);

  return [n, ref];
}