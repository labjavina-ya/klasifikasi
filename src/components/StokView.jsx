import AnimatedNumber from './AnimatedNumber';
import RecordCard from './RecordCard';
import { Pi } from './bits';
import { nBy, PERIODES } from '../data';
import useInfinite from '../lib/useInfinite';

export default function StokView({ records, curCat, setCat, curQuery, onClearSearch, openAdd, resetFilter, onPhoto }) {
  const q = curQuery.trim().toLowerCase();
  const list = records.filter(r =>
    (curCat === 'all' || r.periode === curCat) &&
    (!q || (r.kode + ' ' + r.nama + ' ' + r.kelompok + ' ' + r.klasifikasi + ' ' + r.rak + ' ' + r.status + ' ' + r.periode).toLowerCase().includes(q))
  );
  const [visible, sentinel] = useInfinite(list.length);

  const liste = curCat === 'all' ? records : records.filter(r => r.periode === curCat);
  const tot = liste.length;
  const b = nBy('BERHASIL', liste), p = nBy('PENDING', liste), g = nBy('GAGAL', liste), m = nBy('BLM MONITORING', liste);
  const pc = v => (tot ? (v / tot * 100).toFixed(1) + '%' : '0%');

  const sumCards = [
    ['package', '', 'Total record', tot, ''],
    ['check-circle', 'em', 'Berhasil', b, 'text-emerald-700'],
    ['clock-countdown', 'sl', 'Pending', p, ''],
    ['warning', 'zi', 'Gagal', g, 'text-zinc-700'],
    ['hourglass', 'blm', 'Blm mon.', m, 'text-emerald-700'],
  ];
  const legend = [
    ['bg-emerald-500', 'berhasil', b],
    ['bg-slate-500', 'pending', p],
    ['bg-zinc-400', 'gagal', g],
    ['bg-emerald-300', 'blm monitoring', m],
  ];

  return (
    <section className="px-4 lg:px-8 pt-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="ic-badge lg em"><Pi n="package" s="xl" /></span>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Stok aktif</h2>
            <p className="text-sm text-ink-2 mt-1">Data monitoring silangan anggrek, filter berdasarkan periode tanam.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs text-ink-3">{list.length} record · {curCat === 'all' ? 'semua periode' : 'periode ' + curCat}</p>
          <button className="pill-mini" onClick={openAdd}><Pi n="plus" s="xs" />Tambah record</button>
        </div>
      </div>

      {curQuery && (
        <div className="mt-4">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-ink-2 bg-white/60 border border-white/85 rounded-full pl-4 pr-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.9)]">
            <Pi n="magnifying-glass" s="xs" />
            <span>hasil untuk "{curQuery}"</span>
            <button className="w-6 h-6 rounded-full flex items-center justify-center text-ink-3 hover:text-ink bg-white/70 transition" aria-label="Hapus pencarian" onClick={onClearSearch}>
              <Pi n="x" s="xs" />
            </button>
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4" aria-label="Filter periode">
        <button className={`chip ${curCat === 'all' ? 'chip-active' : ''}`} onClick={() => setCat('all')}>Semua periode</button>
        {PERIODES.map(p => (
          <button key={p} className={`chip ${curCat === p ? 'chip-active' : ''}`} onClick={() => setCat(p)}>{p}</button>
        ))}
      </div>

      <div className="glass rounded-[2rem] mt-5 overflow-hidden">
        <div className="px-5 lg:px-6 pt-5 pb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-sm">Ringkasan status</h3>
          <span className="spec-badge"><Pi n="clock-countdown" s="xs" />PERIODE <b>{curCat === 'all' ? 'SEMUA' : curCat}</b></span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {sumCards.map(([icon, tone, label, val, cls], i) => (
            <div key={label} className={`p-5 lg:p-6 flex items-center gap-4 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-line' : ''}`}>
              <span className={`ic-badge ${tone} shrink-0`}><Pi n={icon} s="lg" /></span>
              <div className="min-w-0">
                <p className="text-xs text-ink-3">{label}</p>
                <p className={`font-mono text-[1.6rem] leading-none mt-1.5 ${cls}`}><AnimatedNumber value={val} /></p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-line p-5 lg:px-6">
          <div className="flex h-3 rounded-full overflow-hidden gap-px bg-white/40 border border-white/60">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: pc(b) }} />
            <div className="h-full bg-slate-500 transition-all duration-500" style={{ width: pc(p) }} />
            <div className="h-full bg-zinc-400 transition-all duration-500" style={{ width: pc(g) }} />
            <div className="h-full bg-emerald-300 transition-all duration-500" style={{ width: pc(m) }} />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-xs text-ink-2">
            {legend.map(([cls, lbl, val]) => (
              <span key={lbl} className="flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${cls}`} />{lbl} <span className="font-mono text-ink-3">{val}</span></span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        {!list.length ? (
          <div className="col-span-full glass rounded-[2rem] p-10 text-center">
            <span className="ic-badge xl em mx-auto"><Pi n="magnifying-glass" s="2xl" /></span>
            <p className="font-bold mt-5">Tidak ada record yang cocok</p>
            <p className="text-sm text-ink-2 mt-1 max-w-sm mx-auto leading-relaxed">Coba kata kunci lain, ganti filter periode, atau tambahkan record baru.</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <button className="pill-mini" onClick={resetFilter}><Pi n="x" s="xs" />Reset filter</button>
              <button className="pill-mini" onClick={openAdd}><Pi n="plus" s="xs" />Tambah record</button>
            </div>
          </div>
        ) : (
          list.slice(0, visible).map((r, i) => <RecordCard key={r.kode} r={r} idx={i} onPhoto={onPhoto} />)
        )}
      </div>
      {list.length > visible && <div ref={sentinel} className="h-1" />}
    </section>
  );
}