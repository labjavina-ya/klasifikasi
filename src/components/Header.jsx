import { useEffect, useRef, useState } from 'react';
import { Pi } from './bits';

export default function Header({ curQuery, onSearch, onClear, bellDot, onBell }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mRef = useRef(null);
  const hasQ = curQuery.length > 0;

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 640) setMobileOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    if (mobileOpen) setTimeout(() => mRef.current?.focus(), 80);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-30 px-3 lg:px-6 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-2">
      <div className="glass-strong rounded-full h-14 px-3 lg:px-2.5 flex items-center gap-2.5">
        <img src="/javina-fix.png" alt="Logo Javina" className="h-9 w-9 object-contain hidden sm:block" />
        <button
          id="btnSearchToggle"
          className="btn-icon relative shrink-0 sm:hidden"
          aria-label="Buka pencarian"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(o => !o)}
        >
          <Pi n="magnifying-glass" s="md" />
          {hasQ && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />}
        </button>

        <div className="relative flex-1 max-w-lg min-w-0 hidden sm:block">
          <Pi n="magnifying-glass" s="sm" className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
          <input
            id="searchInput" type="text" className="inp !pl-11 !pr-11 !h-10"
            placeholder="Cari kode, silangan, atau kelompok"
            aria-label="Cari kode, silangan, atau kelompok"
            value={curQuery}
            onChange={e => onSearch(e.target.value)}
          />
          {hasQ && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-ink-3 hover:text-ink bg-white/60 border border-white/80 transition"
              aria-label="Hapus pencarian"
              onClick={() => { onClear(); }}
            >
              <Pi n="x" s="xs" />
            </button>
          )}
        </div>

        <div className="flex-1" />

        <button id="btnBell" className="btn-icon relative shrink-0" aria-label="Notifikasi" onClick={onBell}>
          <Pi n="bell" s="md" />
          {bellDot && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobileSearchWrap" className="sm:hidden mt-2">
          <div className="glass-strong rounded-[1.5rem] p-2.5">
            <div className="relative">
              <Pi n="magnifying-glass" s="sm" className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
              <input
                id="searchInputM" ref={mRef} type="text" className="inp !pl-11 !pr-11"
                placeholder="Cari kode, silangan, atau kelompok"
                aria-label="Cari kode, silangan, atau kelompok"
                value={curQuery}
                onChange={e => onSearch(e.target.value)}
              />
              {hasQ && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-ink-3 hover:text-ink bg-white/60 border border-white/80 transition"
                  aria-label="Hapus pencarian"
                  onClick={onClear}
                >
                  <Pi n="x" s="xs" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}