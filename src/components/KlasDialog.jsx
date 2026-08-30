import { useState } from 'react';
import { toast } from 'sonner';
import { Pi } from './bits';
import KlasSelect from './KlasSelect';
import { useSheetSwipe } from '../lib/useSheetSwipe';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { FILL } from '../data';

export default function KlasDialog({ record, onOpenChange, onSave, addFeed, onPhoto }) {
  const sheetRef = useSheetSwipe(onOpenChange);
  const [vals, setVals] = useState({ klasifikasi: record.klasifikasi, botol: record.botol, seedling: record.seedling, remaja: record.remaja, dewasa: record.dewasa });
  const [errs, setErrs] = useState({ klasifikasi: false, botol: false, seedling: false, remaja: false, dewasa: false });

  const set = (k, v) => { setVals(x => ({ ...x, [k]: v })); setErrs(e => ({ ...e, [k]: false })); };

  const submit = async e => {
    e.preventDefault();
    const bad = {};
    let ok = true;
    FILL.forEach(k => { if (vals[k] === '' || vals[k] === null) { bad[k] = true; ok = false; } });
    if (!ok) { setErrs({ ...errs, ...bad }); return; }
    const done = await onSave(vals);
    if (!done) return;
    addFeed(`Klasifikasi tersimpan: ${record.kode}, ${vals.klasifikasi} · botol ${vals.botol}, seedling ${vals.seedling}, remaja ${vals.remaja}, dewasa ${vals.dewasa}.`, 'clipboard-text', 'ok');
    toast.success(`Record ${record.kode} selesai diklasifikasi.`);
    onOpenChange(false);
  };

  const phases = [
    ['botol', 'botol'],
    ['seedling', 'seedling'],
    ['remaja', 'remaja'],
    ['dewasa', 'dewasa'],
  ];

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent ref={sheetRef} className="dlg-sheet glass-strong sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] max-h-[94dvh] overflow-y-auto p-0 gap-0 [&>button]:hidden">
        <div className="sheet-head">
          <span className="sheet-grip" aria-hidden="true" />
          <div className="flex items-center justify-between p-5 pb-4">
            <div>
              <DialogTitle className="text-lg font-black tracking-tight">Klasifikasi record</DialogTitle>
              <p className="text-xs text-ink-2 mt-0.5">Isi kelima kolom: klasifikasi, botol, seedling, remaja, dewasa.</p>
            </div>
            <button className="btn-icon !w-9 !h-9" aria-label="Tutup" onClick={() => onOpenChange(false)}><Pi n="x" s="sm" /></button>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="p-5 space-y-4">
          <div className="well rounded-[1.25rem] p-3 flex items-center gap-3">
            {record.foto ? (
              <button type="button" className="relative block shrink-0 w-14 h-16 rounded-[0.9rem] overflow-hidden" title="Lihat & zoom foto" onClick={() => onPhoto?.(record)}>
                <img
                  src={`https://drive.google.com/thumbnail?id=${record.foto}&sz=w480`} alt=""
                  className="w-full h-full rounded-[0.9rem] object-cover border border-white/80 bg-white/40"
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                    const np = e.currentTarget.parentElement?.querySelector('.nophoto');
                    if (np) np.style.display = 'flex';
                  }}
                />
              </button>
            ) : (
              <span className="relative block shrink-0 w-14 h-16">
                <span className="nophoto absolute inset-0 rounded-[0.9rem]" style={{ display: 'flex' }}><Pi n="image" s="md" /></span>
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[11px] font-bold tracking-wide text-emerald-700">{record.kode}</p>
              <p className="text-sm font-semibold clamp2 leading-snug mt-0.5">{record.nama}</p>
              <p className="text-xs text-ink-2 mt-1 truncate">{record.kelompok} · rak {record.rak} · {record.periode}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Klasifikasi</label>
            <KlasSelect id="k-klas" value={vals.klasifikasi} onChange={v => set('klasifikasi', v)} className="!h-11 !bg-white/55" />
            <p className="text-xs text-ink-3 mt-1.5">Pilih salah satu klasifikasi dari daftar.</p>
            {errs.klasifikasi && <p className="text-xs text-slate-700 font-semibold mt-1">Pilih klasifikasi dulu.</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Jumlah per fase</label>
            <div className="grid grid-cols-4 gap-2.5">
              {phases.map(([k, lbl]) => (
                <div key={k}>
                  <label htmlFor={`k-${k}`} className="blk-lbl">{lbl}</label>
                  <input
                    id={`k-${k}`} className={`inp !h-11 !px-2 text-center font-mono ${errs[k] ? 'err' : ''}`}
                    type="number" min="0" step="1" placeholder="0"
                    value={vals[k]} onChange={e => set(k, e.target.value)}
                  />
                  {errs[k] && <p className="text-xs text-slate-700 font-semibold mt-1">wajib</p>}
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-3 mt-1.5">Isi angka, boleh 0.</p>
          </div>

          <p className="text-xs text-ink-2 flex gap-2 leading-relaxed">
            <Pi n="info" s="sm" className="text-ink-3 mt-0.5 shrink-0" />
            Record otomatis keluar dari daftar menunggu setelah kelima kolom terisi.
          </p>

          <button type="submit" className="btn-primary w-full justify-center"><Pi n="check-circle" s="sm" />Simpan klasifikasi</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}