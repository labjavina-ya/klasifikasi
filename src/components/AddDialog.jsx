import { useState } from 'react';
import { toast } from 'sonner';
import { Pi } from './bits';
import { useSheetSwipe } from '../lib/useSheetSwipe';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { addDays, PERIODES, todayIso } from '../data';

const blank = () => ({ kode: '', tanam: todayIso(), nama: '', kelompok: '', status: 'BLM MONITORING', rak: '', qty: '' });

export default function AddDialog({ open, onOpenChange, curCat, records, onAdd, addFeed }) {
  const sheetRef = useSheetSwipe(onOpenChange);
  const [f, setF] = useState(blank());
  const [errs, setErrs] = useState({ kode: false, nama: false });
  const set = (k, v) => { setF(x => ({ ...x, [k]: v })); setErrs(e => ({ ...e, [k]: false })); };

  const submit = e => {
    e.preventDefault();
    const kode = f.kode.trim();
    const nama = f.nama.trim();
    const bad = {};
    if (!kode || records.some(r => r.kode === kode)) bad.kode = true;
    if (!nama) bad.nama = true;
    if (Object.keys(bad).length) { setErrs(bad); toast.warning('Periksa kolom yang ditandai.'); return; }

    const periode = (curCat !== 'all' && PERIODES.includes(curCat)) ? curCat : 'T1';
    const tanam = f.tanam || todayIso();
    const umur = Math.max(0, Math.round((Date.now() - new Date(tanam + 'T00:00:00').getTime()) / (30.44 * 864e5)));
    onAdd({
      periode, kode, tanam, hst: addDays(tanam, 60),
      rak: f.rak.trim() || '-',
      status: f.status,
      qty: Math.max(0, +f.qty || 0),
      nama, kelompok: f.kelompok.trim() || 'Tanpa kelompok', umur,
    });
    addFeed(`Record baru masuk stok: ${kode} (${nama}, ${periode}), menunggu klasifikasi.`, 'package', 'info');
    toast.success(`${kode} masuk stok (${periode}) & menunggu klasifikasi.`);
    setF(blank());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent ref={sheetRef} className="dlg-sheet glass-strong sm:max-w-lg rounded-t-[2rem] sm:rounded-[2rem] max-h-[94dvh] overflow-y-auto p-0 gap-0 [&>button]:hidden">
        <div className="sheet-head">
          <span className="sheet-grip" aria-hidden="true" />
          <div className="flex items-center justify-between p-5 pb-4">
            <div>
              <DialogTitle className="text-lg font-black tracking-tight">Tambah record</DialogTitle>
              <p className="text-xs text-ink-2 mt-0.5">Record baru masuk stok & menunggu klasifikasi.</p>
            </div>
            <button className="btn-icon !w-9 !h-9" aria-label="Tutup" onClick={() => onOpenChange(false)}><Pi n="x" s="sm" /></button>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fAddKode" className="block text-sm font-semibold mb-1.5">Kode</label>
              <input id="fAddKode" className={`inp font-mono ${errs.kode ? 'err' : ''}`} type="text" autoComplete="off" placeholder="contoh: 0925010" value={f.kode} onChange={e => set('kode', e.target.value)} />
              {errs.kode && <p className="text-xs text-slate-700 font-semibold mt-1">Kode wajib diisi & belum dipakai.</p>}
            </div>
            <div>
              <label htmlFor="fAddTanam" className="block text-sm font-semibold mb-1.5">Tanggal tanam</label>
              <input id="fAddTanam" className="inp !px-4" type="date" value={f.tanam} onChange={e => set('tanam', e.target.value)} />
            </div>
          </div>

          <div>
            <label htmlFor="fAddNama" className="block text-sm font-semibold mb-1.5">Nama silangan</label>
            <input id="fAddNama" className={`inp ${errs.nama ? 'err' : ''}`} type="text" autoComplete="off" placeholder="contoh: Den. discolor x Selfing" value={f.nama} onChange={e => set('nama', e.target.value)} />
            {errs.nama && <p className="text-xs text-slate-700 font-semibold mt-1">Nama silangan wajib diisi.</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fAddKelompok" className="block text-sm font-semibold mb-1.5">Kelompok</label>
              <input id="fAddKelompok" className="inp" type="text" autoComplete="off" placeholder="opsional" value={f.kelompok} onChange={e => set('kelompok', e.target.value)} />
            </div>
            <div>
              <label htmlFor="fAddStatus" className="block text-sm font-semibold mb-1.5">Status</label>
              <div className="relative">
                <select id="fAddStatus" className="inp pr-10" value={f.status} onChange={e => set('status', e.target.value)}>
                  <option value="BLM MONITORING">Blm monitoring</option>
                  <option value="BERHASIL">Berhasil</option>
                  <option value="PENDING">Pending</option>
                  <option value="GAGAL">Gagal</option>
                </select>
                <Pi n="caret-down" s="sm" className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
              </div>
              <p className="text-xs text-ink-3 mt-1.5">Record baru biasanya belum monitoring HST-60.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fAddRak" className="block text-sm font-semibold mb-1.5">Rak</label>
              <input id="fAddRak" className="inp font-mono" type="text" autoComplete="off" placeholder="contoh: A-3A" value={f.rak} onChange={e => set('rak', e.target.value)} />
            </div>
            <div>
              <label htmlFor="fAddQty" className="block text-sm font-semibold mb-1.5">QTY botol</label>
              <input id="fAddQty" className="inp" type="number" min="0" step="1" placeholder="mis. 2" value={f.qty} onChange={e => set('qty', e.target.value)} />
            </div>
          </div>

          <p className="text-xs text-ink-2 flex gap-2 leading-relaxed">
            <Pi n="info" s="sm" className="text-ink-3 mt-0.5 shrink-0" />
            Tanggal HST-60 dihitung otomatis (+60 hari). Record baru mengikuti periode filter yang sedang dipilih. Kolom klasifikasi, botol, seedling, remaja & dewasa sengaja kosong, record akan muncul di Form klasifikasi.
          </p>

          <button type="submit" className="btn-primary w-full justify-center"><Pi n="plus" s="sm" />Tambahkan ke stok</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}