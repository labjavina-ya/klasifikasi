import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { KLASIFIKASI_OPTS } from '../data';
import { Pi } from './bits';

export default function KlasSelect({ value, onChange, className = '', id }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [pos, setPos] = useState(null);
  const inputRef = useRef(null);
  const list = KLASIFIKASI_OPTS.filter(v => v.toLowerCase().includes(q.toLowerCase()));

  const openList = () => {
    const r = inputRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const upd = () => {
      const r = inputRef.current?.getBoundingClientRect();
      if (r) setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    };
    window.addEventListener('scroll', upd, true);
    window.addEventListener('resize', upd);
    return () => {
      window.removeEventListener('scroll', upd, true);
      window.removeEventListener('resize', upd);
    };
  }, [open]);

  const pick = v => { onChange(v); setOpen(false); setQ(''); };

  return (
    <>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          autoComplete="off"
          readOnly={!open}
          placeholder="pilih klasifikasi…"
          value={open ? q : value}
          onFocus={openList}
          onChange={e => { setOpen(true); setQ(e.target.value); }}
          onKeyDown={e => {
            if (e.key === 'Escape') setOpen(false);
            if (e.key === 'Enter' && open && list[0]) { e.preventDefault(); pick(list[0]); }
          }}
          onBlur={() => setTimeout(() => { setOpen(false); setQ(''); }, 120)}
          className={`inp pr-9 ${className}`}
        />
        <Pi n="caret-down" s="xs" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
      </div>
      {open && pos && createPortal(
        <ul
          role="listbox"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width }}
          className="z-[60] max-h-52 overflow-y-auto glass-strong rounded-xl p-1 text-sm shadow-lg"
        >
          {list.length ? list.map(v => (
            <li key={v} role="option" aria-selected={v === value}>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); pick(v); }}
                className={`w-full text-left px-3 py-2 rounded-lg truncate transition ${v === value ? 'bg-emerald-500/10 text-emerald-700 font-semibold' : 'hover:bg-white/70 text-ink'}`}
              >
                {v}
              </button>
            </li>
          )) : (
            <li className="px-3 py-2 text-xs text-ink-3">tidak ada klasifikasi "{q}"</li>
          )}
        </ul>,
        document.body
      )}
    </>
  );
}