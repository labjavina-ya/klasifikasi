import { useCallback, useRef } from 'react';

export function useSheetSwipe(onOpenChange) {
  const st = useRef(null);

  const onStart = useCallback(e => {
    if (!window.matchMedia('(max-width: 639px)').matches) return;
    const el = e.currentTarget;
    const t = e.touches?.[0];
    if (!t) return;
    const tg = e.target;
    if (!(tg instanceof Element)) return;
    // header/grip = zona drag permanen (tutup sheet walau konten discroll);
    // di body hanya saat sheet di posisi paling atas
    const inHead = tg.closest('.sheet-head, .sheet-grip');
    if (!inHead && el.scrollTop > 0) return;
    // select/textarea spawn native UI; input & button tetap boleh drag
    if (tg.closest('select, textarea')) return;
    st.current = { y0: t.clientY, x0: t.clientX, started: false, el, inHead: !!inHead };
  }, []);

  const onMove = useCallback(e => {
    const s = st.current;
    if (!s) return;
    const t = e.touches?.[0];
    if (!t) return;
    const dy = t.clientY - s.y0;
    const dx = Math.abs(t.clientX - s.x0);
    if (!s.started) {
      if (Math.abs(dy) < 8 && dx < 8) return;
      if (dx > Math.abs(dy)) { st.current = null; return; }
      if (dy < 0) { st.current = null; return; }
      s.started = true;
      s.el.style.setProperty('animation', 'none', 'important');
    }
    s.el.style.transition = 'none';
    // inline !important menang atas `transform: none !important` di stylesheet
    s.el.style.setProperty('transform', `translateY(${Math.max(0, dy)}px)`, 'important');
    if (e.cancelable) {
      try { e.preventDefault(); } catch { /* noop */ }
    }
  }, []);

  const onEnd = useCallback(e => {
    const s = st.current;
    st.current = null;
    if (!s || !s.started) return;
    const ct = e.changedTouches?.[0];
    if (!ct) return;
    const dy = ct.clientY - s.y0;
    if (dy >= 90 || dy > (s.el?.offsetHeight ?? 0) * 0.25) {
      s.el.style.transition = 'transform 0.3s cubic-bezier(0.5, 0, 0.6, 1)';
      s.el.style.setProperty('transform', `translateY(${s.el.offsetHeight}px)`, 'important');
      setTimeout(() => { if (s.el && document.contains(s.el)) onOpenChange(false); }, 260);
    } else {
      s.el.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
      s.el.style.setProperty('transform', 'translateY(0px)', 'important');
    }
  }, [onOpenChange]);

  const ref = useCallback(node => {
    if (!node) return;
    node.addEventListener('touchstart', onStart, { passive: true });
    node.addEventListener('touchmove', onMove, { passive: false });
    node.addEventListener('touchend', onEnd, { passive: true });
    node.addEventListener('touchcancel', onEnd, { passive: true });
  }, [onStart, onMove, onEnd]);

  return ref;
}