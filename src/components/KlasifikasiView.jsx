import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import KlasCard from './KlasCard';
import KlasSelect from './KlasSelect';
import { FotoMini, Pi } from './bits';
import { Progress } from '@/components/ui/progress';
import { FILL, fmtDate, ST } from '../data';
import useInfinite from '../lib/useInfinite';

const blankDraft = r => ({ klasifikasi: r.klasifikasi, botol: r.botol, seedling: r.seedling, remaja: r.remaja, dewasa: r.dewasa });

const SingleEmpty = () => (
  <div className="glass rounded-[2rem] p-10 text-center">
    <span className="ic-badge xl em mx-auto"><Pi n="check-circle" s="2xl" /></span>
    <p className="font-bold mt-5">Semua record sudah lengkap</p>
    <p className="text-sm text-ink-2 mt-1 max-w-sm mx-auto leading-relaxed">Tidak ada record dengan kolom klasifikasi, botol, seedling, remaja, dan dewasa yang kosong.</p>
  </div>
);

const NoMatch = ({ onClear }) => (
  <div className="glass rounded-[2rem] p-10 text-center">
    <span className="ic-badge xl mx-auto"><Pi n="magnifying-glass" s="2xl" /></span>
    <p className="font-bold mt-5">Tidak ada record yang cocok</p>
    <p className="text-sm text-ink-2 mt-1 max-w-sm mx-auto leading-relaxed">Coba kata kunci lain.</p>
    {onClear && <button type="button" className="pill-mini mt-4" onClick={onClear}><Pi n="x" s="xs" />Hapus pencarian</button>}
  </div>
);

export default function KlasifikasiView({ records, klasMode, setKlasMode, onOpenKlas, onBulkSave, justAdded, onPhoto, curQuery = '', onClearSearch }) {
  const [fPeriode, setFPeriode] = useState('semua');
  const [fStatus, setFStatus] = useState('semua');
  const periodeOpts = [...new Set(records.map(r => r.periode))].sort();
  const statusOpts = [...new Set(records.map(r => r.status))].sort();
  const queue = useMemo(() => records.filter(r => !FILL.every(k => r[k] !== '')), [records]);
  const q = curQuery.trim().toLowerCase();
  const pool = useMemo(() => {
    let f = records;
    if (fPeriode !== 'semua') f = f.filter(r => r.periode === fPeriode);
    if (fStatus !== 'semua') f = f.filter(r => r.status === fStatus);
    return f;
  }, [records, fPeriode, fStatus]);
  const poolIncomplete = useMemo(() => pool.filter(r => !FILL.every(k => r[k] !== '')), [pool]);
  const shown = useMemo(
    () => (q ? poolIncomplete.filter(r => (r.kode + ' ' + r.nama + ' ' + r.kelompok + ' ' + r.klasifikasi + ' ' + r.rak + ' ' + r.status + ' ' + r.periode).toLowerCase().includes(q)) : poolIncomplete),
    [poolIncomplete, q]
  );
  const [visible, sentinel] = useInfinite(shown.length);
  const done = pool.length - poolIncomplete.length;

  const [drafts, setDrafts] = useState(() => Object.fromEntries(queue.map(r => [r.kode, blankDraft(r)])));
  const [errs, setErrs] = useState(() => []);
  const [openKode, setOpenKode] = useState(null);
  const barRef = useRef(null);

  useEffect(() => {
    setDrafts(prev => {
      const next = {};
      queue.forEach(r => { next[r.kode] = prev[r.kode] ?? blankDraft(r); });
      return next;
    });
  }, [records, queue]);

  useEffect(() => {
    if (!justAdded) return;
    const el = document.querySelector(`[data-rid="${justAdded}"]`);
    if (el) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(() => el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }), 80);
    }
  }, [justAdded]);

  const setDraft = (kode, k, v) => {
    setDrafts(d => ({ ...d, [kode]: { ...d[kode], [k]: v } }));
    setErrs(e => e.filter(x => x !== kode));
  };

  const readyCount = queue.filter(r => FILL.every(k => drafts[r.kode]?.[k] !== '')).length;
  const partialCount = queue.filter(r => {
    const d = drafts[r.kode]; if (!d) return false;
    const filled = FILL.filter(k => d[k] !== '').length;
    return filled > 0 && filled < FILL.length;
  }).length;

  const reset = () => {
    setDrafts(Object.fromEntries(queue.map(r => [r.kode, blankDraft(r)])));
    setErrs([]);
    toast.info('Isian massal dikembalikan ke nilai awal.');
  };

  const save = async () => {
    let saved = 0, partial = 0;
    const err = [];
    const toSave = [];
    const newRecords = records.map(r => {
      const d = drafts[r.kode];
      if (!d) return r;
      const filled = FILL.filter(k => d[k] !== '').length;
      if (filled === FILL.length) {
        saved++;
        toSave.push({ kode: r.kode, klasifikasi: d.klasifikasi, botol: d.botol, seedling: d.seedling, remaja: d.remaja, dewasa: d.dewasa });
        return { ...r, ...d };
      }
      if (filled > 0) { partial++; err.push(r.kode); }
      return r;
    });
    setErrs(err);
    if (!saved) {
      toast.warning(partial ? 'Ada baris belum lengkap, isi kelima kolom dulu.' : 'Belum ada baris yang siap disimpan.');
      return;
    }
    const ok = await onBulkSave(newRecords, saved, toSave);
    if (!ok) return;
    toast.success(`${saved} record selesai diklasifikasi sekaligus.`);
    barRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const prog = pool.length ? Math.round(done / pool.length * 100) : 0;

  return (
    <section className="px-4 lg:px-8 pt-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="ic-badge lg em"><Pi n="clipboard-text" s="xl" /></span>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Form klasifikasi</h2>
            <p className="text-sm text-ink-2 mt-1 max-w-2xl leading-relaxed">
              Daftar dari stok aktif yang kolom <b>klasifikasi, botol, seedling, remaja,</b> dan <b>dewasa</b>-nya masih kosong. Pilih mode <b>satu-satu</b> atau <b>massal</b>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs text-ink-3">{poolIncomplete.length} menunggu · {done} lengkap{q ? ` · ${shown.length} cocok` : ''}</p>
        </div>
      </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="f-periode" className="text-xs text-ink-3">Periode:</label>
          <select id="f-periode" className="inp !h-8 !px-2.5 text-xs" value={fPeriode} onChange={e => setFPeriode(e.target.value)}>
            <option value="semua">Semua</option>
            {periodeOpts.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="f-status" className="text-xs text-ink-3">Status:</label>
          <select id="f-status" className="inp !h-8 !px-2.5 text-xs" value={fStatus} onChange={e => setFStatus(e.target.value)}>
            <option value="semua">Semua</option>
            {statusOpts.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <div className="mode-switch" role="group" aria-label="Mode input klasifikasi">
          <button className={`mode-btn ${klasMode === 'single' ? 'active' : ''}`} type="button" onClick={() => setKlasMode('single')}>
            <Pi n="cursor-click" s="sm" />Satu-satu
          </button>
          <button className={`mode-btn ${klasMode === 'bulk' ? 'active' : ''}`} type="button" onClick={() => setKlasMode('bulk')}>
            <Pi n="stack" s="sm" />Massal
          </button>
        </div>
        <p className="text-xs text-ink-3">{klasMode === 'single' ? 'Klik kartu record untuk mengisi lewat form.' : 'Isi langsung pada tiap baris, lalu simpan semuanya sekaligus.'}</p>
      </div>

      <div className="glass rounded-[2rem] mt-5 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          <div className="p-5 lg:p-6 flex items-center gap-4">
            <span className="ic-badge zi shrink-0"><Pi n="warning" s="lg" /></span>
            <div className="min-w-0">
              <p className="text-xs text-ink-3">Menunggu klasifikasi</p>
              <p className="font-mono text-[1.6rem] leading-none mt-1.5 text-slate-600">{poolIncomplete.length}</p>
            </div>
          </div>
          <div className="p-5 lg:p-6 border-t sm:border-t-0 sm:border-l border-line flex items-center gap-4">
            <span className="ic-badge em shrink-0"><Pi n="check-circle" s="lg" /></span>
            <div className="min-w-0">
              <p className="text-xs text-ink-3">Sudah lengkap</p>
              <p className="font-mono text-[1.6rem] leading-none mt-1.5 text-emerald-700">{done}</p>
            </div>
          </div>
          <div className="p-5 lg:p-6 border-t sm:border-l border-line flex items-center gap-4">
            <span className="ic-badge shrink-0"><Pi n="package" s="lg" /></span>
            <div className="min-w-0">
              <p className="text-xs text-ink-3">Total record</p>
              <p className="font-mono text-[1.6rem] leading-none mt-1.5">{pool.length}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-line p-5 lg:px-6">
          <Progress value={prog} className="h-3 bg-white/40 border border-white/60 [&>div]:bg-emerald-500 [&>div]:rounded-full" />
          <p className="text-xs text-ink-2 mt-3 flex items-center gap-2">
            <Pi n="info" s="xs" className="text-ink-3" /><span>{prog}% record sudah lengkap terklasifikasi</span>
          </p>
        </div>
      </div>

      {klasMode === 'single' ? (
        <div className="mt-6">
          {!shown.length ? (q || fPeriode !== 'semua' || fStatus !== 'semua' ? <NoMatch onClear={onClearSearch} /> : <SingleEmpty />) : (<>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {shown.slice(0, visible).map((r, i) => (
                <KlasCard key={r.kode} r={r} idx={i} onOpen={onOpenKlas} onPhoto={onPhoto} highlight={justAdded === r.kode} />
              ))}
            </div>
            {shown.length > visible && <div ref={sentinel} className="h-1" />}
          </>)}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {!shown.length ? (q || fPeriode !== 'semua' || fStatus !== 'semua' ? <NoMatch onClear={onClearSearch} /> : <SingleEmpty />) : (
            <>
              {shown.slice(0, visible).map(r => {
                const d = drafts[r.kode] ?? blankDraft(r);
                const S = ST[r.status] || ST['BLM MONITORING'];
                const bad = errs.includes(r.kode);
                const lift = openKode === r.kode ? ' bulk-open' : '';
                return (
                  <div key={r.kode} className={`bulk-row glass-tile ${bad ? 'bulk-err' : ''}${lift} ${justAdded === r.kode ? 'just-added' : ''}`} data-rid={r.kode}>
                    <FotoMini r={r} onOpen={onPhoto} />
                    <div className="b-info">
                      <p className="font-mono text-[12px] font-bold tracking-wide">{r.kode}</p>
                      <p className="text-[13px] font-bold leading-snug clamp2 mt-0.5">{r.nama}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="spec-badge"><Pi n="clock-countdown" s="xs" />PERIODE <b>{r.periode}</b></span>
                        <span className="spec-badge"><Pi n="calendar-blank" s="xs" />TANAM <b>{fmtDate(r.tanam)}</b></span>
                        <span className="spec-badge"><Pi n="flask" s="xs" />QTY BOTOL <b>{r.qty}</b></span>
                        <span className={`st-badge st-${S.k}`}>{S.t}</span>
                      </div>
                      <p className="text-[11px] text-ink-3 truncate mt-1.5">{r.kelompok}</p>
                    </div>
                    <div className="b-klas">
                      <label className="blk-lbl">klasifikasi</label>
                      <KlasSelect value={d.klasifikasi} onChange={v => setDraft(r.kode, 'klasifikasi', v)} onOpenChange={o => setOpenKode(o ? r.kode : null)} className="!h-10" />
                    </div>
                    <div className="b-nums">
                      {[['botol', 'botol'], ['seedling', 'seedling'], ['remaja', 'remaja'], ['dewasa', 'dewasa']].map(([k, lbl]) => (
                        <div key={k}>
                          <label className="blk-lbl">{lbl}</label>
                          <input className="inp !h-10 !px-2 text-center font-mono" type="number" min="0" step="1" value={d[k]} placeholder="0" onChange={e => setDraft(r.kode, k, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {shown.length > visible && <div ref={sentinel} className="h-1" />}

              <div ref={barRef} className="sticky bottom-32 lg:bottom-6 z-30 mt-4">
                <div className="glass-strong rounded-[1.5rem] p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{readyCount} dari {queue.length} baris siap disimpan</p>
                    {partialCount > 0 && (
                      <p className="text-xs text-slate-700 font-semibold mt-0.5">{partialCount} baris belum lengkap, kelima kolom harus terisi sebelum bisa disimpan.</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button type="button" className="btn-ghost !h-10" onClick={reset}><Pi n="arrow-counter-clockwise" s="sm" />Reset isian</button>
                    <button type="button" className="btn-primary !h-10" onClick={save}><Pi n="check-circle" s="sm" />Simpan semua</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}