import { useRef, useState } from 'react';
import { KLASIFIKASI_OPTS } from '../data';
import { Pi } from './bits';

export default function KlasSelect({ value, onChange, className = '', id, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  const list = KLASIFIKASI_OPTS.filter(v => v.toLowerCase().includes(q.toLowerCase()));

  const setOpenSt = o => { setOpen(o); onOpenChange?.(o); };

  const pick = v => { onChange(v); setOpenSt(false); setQ(''); };

  return (
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
        onMouseDown={() => setOpenSt(true)}
        onChange={e => { setOpenSt(true); setQ(e.target.value); }}
        onKeyDown={e => {
          if (e.key === 'Escape') setOpenSt(false);
          if (e.key === 'Enter' && open && list[0]) { e.preventDefault(); pick(list[0]); }
        }}
        onBlur={() => setTimeout(() => { setOpenSt(false); setQ(''); }, 120)}
        className={`inp pr-9 ${className}`}
      />
      <Pi n="caret-down" s="xs" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
      {open && (
        <ul
          role="listbox"
          className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 max-h-64 overflow-y-auto bg-white/95 backdrop-blur-2xl rounded-xl p-1 text-sm shadow-lg border border-white/95"
          style={{ overscrollBehavior: 'contain', touchAction: 'pan-y' }}
          onWheel={e => { if (e.currentTarget.scrollHeight > e.currentTarget.clientHeight) e.stopPropagation(); }}
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
        </ul>
      )}
    </div>
  );
}