import { useEffect, useRef, useState } from 'react';
import { Pi } from './bits';

const MIN = 1, MAX = 4, STEP = 0.5;
const drives = id => ({ hi: `https://drive.google.com/thumbnail?id=${id}&sz=w1920`, lo: `https://drive.google.com/thumbnail?id=${id}&sz=w480` });

export default function PhotoViewer({ record, onClose }) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const ptrs = useRef(new Map());
  const pinch = useRef(null);
  const stageRef = useRef(null);
  const movedRef = useRef(false);
  const lastTap = useRef(0);

  const hi = record ? drives(record.foto).hi : '';
  const lo = record ? drives(record.foto).lo : '';

  useEffect(() => {
    if (!record) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => { html.style.overflow = prev; };
  }, [record]);

  useEffect(() => {
    if (!record) return;
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [record, onClose]);

  const reset = () => { setScale(1); setTranslate({ x: 0, y: 0 }); };

  const apply = (s, t) => {
    setScale(s);
    setTranslate(t);
  };

  const onPointerDown = e => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY });
    movedRef.current = false;
    if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()];
      pinch.current = { d0: Math.hypot(a.x - b.x, a.y - b.y), s0: scale, t0: { ...translate } };
    }
  };

  const onPointerMove = e => {
    const p = ptrs.current.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.sx, dy = e.clientY - p.sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;

    if (ptrs.current.size === 2 && pinch.current) {
      const [a, b] = [...ptrs.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const s = Math.min(MAX, Math.max(MIN, pinch.current.s0 * (d / Math.max(1, pinch.current.d0))));
      apply(s, pinch.current.t0);
      p.x = e.clientX; p.y = e.clientY;
      return;
    }
    if (scale > 1 && ptrs.current.size === 1) {
      apply(scale, { x: translate.x + dx, y: translate.y + dy });
    }
    p.x = e.clientX; p.y = e.clientY; p.sx = e.clientX; p.sy = e.clientY;
  };

  const onPointerUp = e => {
    ptrs.current.delete(e.pointerId);
    pinch.current = null;
    if (e.pointerType !== 'touch' || movedRef.current) return;
    const t0 = performance.now();
    if (lastTap.current && t0 - lastTap.current < 320) {
      lastTap.current = 0;
      if (scale > 1.05) reset();
      else { setScale(2.5); setTranslate({ x: 0, y: 0 }); }
      return;
    }
    lastTap.current = t0;
  };

  const onWheel = e => {
    e.preventDefault();
    const s = Math.min(MAX, Math.max(MIN, scale + (e.deltaY < 0 ? STEP : -STEP)));
    apply(s, translate);
  };

  if (!record) return null;
  if (!record.foto) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm flex flex-col" role="dialog" aria-modal="true" aria-label={`Foto ${record.nama}`}>
      <div className="flex items-center justify-between px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-2 z-10">
        <p className="text-white/90 text-sm font-semibold truncate max-w-[70%]">{record.kode}<span className="text-white/50 font-normal truncate"> · {record.nama}</span></p>
        <button type="button" aria-label="Tutup" onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition">
          <Pi n="x" s="md" />
        </button>
      </div>

      <div
        ref={stageRef}
        className="flex-1 relative overflow-hidden select-none"
        style={{ touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <img
          src={hi} alt={record.nama}
          onError={e => { if (e.currentTarget.src !== lo) e.currentTarget.src = lo; }}
          draggable="false"
          className="absolute max-w-[92%] max-h-[88%] w-auto h-auto object-contain rounded-2xl shadow-2xl left-1/2 top-1/2"
          style={{ transform: `translate(calc(-50% + ${translate.x}px), calc(-50% + ${translate.y}px)) scale(${scale})`, transition: 'none' }}
        />
        {scale <= 1.05 && (
          <p className="absolute bottom-4 left-0 right-0 text-center text-white/45 text-xs pointer-events-none">ketuk 2× untuk zoom · geser 2 jari untuk memperbesar</p>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 z-10">
        <button type="button" aria-label="Perkecil" onClick={() => apply(Math.max(MIN, scale - STEP), translate)} className="w-11 h-11 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition disabled:opacity-30" disabled={scale <= MIN}>
          <Pi n="minus" s="md" />
        </button>
        <button type="button" className="min-w-20 h-10 px-3 rounded-full bg-white/10 border border-white/15 text-white text-xs font-mono flex items-center justify-center" onClick={reset}>
          {Math.round(scale * 100)}%
        </button>
        <button type="button" aria-label="Perbesar" onClick={() => apply(Math.min(MAX, scale + STEP), translate)} className="w-11 h-11 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center hover:bg-white/20 transition disabled:opacity-30" disabled={scale >= MAX}>
          <Pi n="plus" s="md" />
        </button>
      </div>
    </div>
  );
}