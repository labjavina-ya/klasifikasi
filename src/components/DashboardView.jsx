import AnimatedNumber from './AnimatedNumber';
import { FeedRow } from './Feed';
import { Pi } from './bits';
import { fmtDate, greeting, minLanjut, nBy, PERIODES } from '../data';

export default function DashboardView({ records, feed, setView, openAdd, onEkspor, user }) {
  const tot = records.length;
  const b = nBy('BERHASIL', records), p = nBy('PENDING', records), g = nBy('GAGAL', records), m = nBy('BLM MONITORING', records);
  const mL = minLanjut(records);
  const pending = records.filter(r => !r.klasifikasi || !r.botol || !r.seedling || !r.remaja || !r.dewasa).length;

  const rail = [
    ['package', 'em', 'Total silangan', tot, '', 'record semua periode'],
    ['check-circle', 'em', 'Berhasil', b, 'text-emerald-700', ''],
    ['clock-countdown', 'sl', 'Pending', p, '', mL ? 'lanjutan terdekat ' + fmtDate(mL) : 'tanpa jadwal lanjutan'],
    ['warning', 'zi', 'Gagal', g, '', 'perlu evaluasi media tanam'],
    ['hourglass', 'blm', 'Blm monitoring', m, 'text-emerald-700', 'menunggu jadwal HST-60'],
  ];

  const ringkasan = [
    ['check-circle', 'em', 'Berhasil', 'embrio tumbuh baik', b],
    ['clock-countdown', 'sl', 'Pending', 'menunggu monitoring lanjutan', p],
    ['warning', 'zi', 'Gagal', 'embrio tidak tumbuh', g],
    ['hourglass', 'blm', 'Blm monitoring', 'belum due HST-60', m],
  ];

  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const perDay = new Array(7).fill(0);
  records.forEach(r => {
    const d = new Date(r.tanam + 'T00:00:00');
    if (!Number.isNaN(d.getTime())) perDay[(d.getDay() + 6) % 7]++;
  });
  const maxDay = Math.max(...perDay);
  const peakIdx = maxDay > 0 ? perDay.indexOf(maxDay) : -1;

  const now = new Date();
  const tgl = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <section className="px-4 lg:px-8 pt-4">
      <div className="glass rounded-[2.5rem] p-6 lg:p-9 grid lg:grid-cols-[1fr_330px] gap-8 lg:gap-0">
        <div className="relative flex flex-col justify-center py-2 lg:pr-9">
          <Pi n="plant" s="lg" className="hidden lg:block absolute right-0 -top-6 pointer-events-none select-none" style={{ width: 180, height: 180, color: 'rgba(4,120,87,.055)' }} />
          <h1 className="text-[2rem] md:text-[2.6rem] font-black tracking-tight leading-[1.05]">
            {greeting()}, <span className="italic font-bold">{user?.nama || 'Andra'}</span>.
          </h1>
          <p className="text-ink-2 mt-3 max-w-md leading-relaxed">
            {tgl} · {tot} record di {PERIODES.length} periode ({PERIODES.join(', ')}), {pending} menunggu klasifikasi.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <button className="btn-primary" onClick={() => setView('klasifikasi')}>
              <Pi n="clipboard-text" s="sm" />Form klasifikasi
              {pending > 0 && <span className="font-mono text-[11px] font-bold bg-[#04281C]/15 rounded-full px-2 py-0.5">{pending}</span>}
            </button>
            <button className="btn-ghost" onClick={() => setView('stok')}>Lihat stok aktif<Pi n="arrow-right" s="sm" /></button>
          </div>
        </div>

        <div className="border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-9">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Ringkasan status</h2>
            <span className="font-mono text-xs text-ink-3">semua periode</span>
          </div>
          <ul className="divide-y divide-line">
            {ringkasan.map(([icon, tone, label, sub, val]) => (
              <li key={label} className="flex items-center justify-between py-3 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`ic-badge sm ${tone}`}><Pi n={icon} s="md" /></span>
                  <div className="min-w-0"><p className="text-sm font-medium truncate">{label}</p><p className="text-xs text-ink-3 mt-0.5">{sub}</p></div>
                </div>
                <span className="font-mono text-sm text-ink-2 w-9 text-right">{val}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-2 mt-3 flex gap-2 leading-relaxed">
            <Pi n="clock-countdown" s="sm" className="text-slate-600 mt-0.5 shrink-0" />
            <span>{mL ? `Monitoring lanjutan terdekat ${fmtDate(mL)}, siapkan penjadwalan ruang kultur.` : 'Tidak ada item dengan jadwal monitoring lanjutan.'}</span>
          </p>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 overflow-hidden mt-4">
        {rail.map(([icon, tone, label, val, cls, sub], i) => (
          <div key={label} className={`p-5 lg:p-6 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-line' : ''}`}>
            <div className="flex items-start gap-4">
              <span className={`ic-badge ${tone} shrink-0`}><Pi n={icon} s="lg" /></span>
              <div className="min-w-0">
                <p className="text-xs text-ink-3">{label}</p>
                <p className={`font-mono text-[1.6rem] leading-none mt-1.5 ${cls}`}>
                  <AnimatedNumber value={val} />
                </p>
              </div>
            </div>
            {i === 1
              ? <div className="h-1.5 bg-line rounded-full mt-4 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: tot ? `${(b / tot * 100).toFixed(1)}%` : '0%' }} /></div>
              : <p className={`text-xs mt-3.5 ${i === 2 ? 'font-medium text-slate-600' : 'text-ink-3'}`}>{sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-4 mt-4">
        <div className="glass rounded-[2rem] p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Aktivitas terbaru</h3>
            <span className="font-mono text-[11px] text-ink-3">{feed[0]?.t ?? 'hari ini'}</span>
          </div>
          <div className="mt-4 space-y-1 max-h-[400px] overflow-y-auto pr-1">
            {feed.map((f, i) => <FeedRow key={i} f={f} highlight={i === 0} />)}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-[2rem] p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2"><Pi n="trend-up" s="sm" className="text-emerald-700" />Aktivitas 7 hari</h3>
              <span className="font-mono text-[11px] text-ink-3">tanam / hari</span>
            </div>
            <div className="flex items-end gap-2 h-28 mt-4">
              {perDay.map((n, i) => (
                <div key={i} className="flex-1 h-full flex flex-col justify-end">
                  <div className={`rounded-full ${i === peakIdx ? 'bg-emerald-500' : 'bg-emerald-500/35'}`} style={{ height: `${maxDay > 0 ? (n / maxDay * 100).toFixed(1) : 0}%` }} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {days.map((d, i) => (
                <span key={d} className={`flex-1 text-center font-mono text-[10px] ${i === peakIdx ? 'text-emerald-700 font-semibold' : 'text-ink-3'}`}>{d}</span>
              ))}
            </div>
            <p className="text-xs text-ink-2 mt-3 leading-relaxed">{peakIdx >= 0 ? `Paling banyak tanam ${days[peakIdx]} (${perDay[peakIdx]} record dari ${records.length} total).` : 'Belum ada data tanggal tanam untuk dihitung.'}</p>
          </div>

          <div className="glass-emerald rounded-[2rem] p-5">
            <Pi n="quotes" s="lg" className="text-emerald-700/70" />
            <p className="italic leading-relaxed mt-3">"Bunga selalu membuat orang lebih baik, lebih bahagia, dan lebih menolong; bunga adalah matahari, makanan, dan obat bagi jiwa."</p>
            <p className="text-xs text-ink-2 mt-3 leading-relaxed">Luther Burbank, pemulia tanaman Amerika yang mengembangkan ratusan kultivar baru melalui persilangan.</p>
          </div>

          <div className="glass rounded-[2rem] p-5">
            <h3 className="font-bold text-sm">Pintasan</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              <button className="pill-mini" onClick={() => setView('stok')}><Pi n="package" s="xs" />Stok aktif</button>
              <button className="pill-mini" onClick={() => setView('klasifikasi')}><Pi n="clipboard-text" s="xs" />Klasifikasi <span className="font-mono">{pending ? `(${pending})` : ''}</span></button>
              <button className="pill-mini" onClick={openAdd}><Pi n="plus" s="xs" />Tambah record</button>
              <button className="pill-mini" onClick={onEkspor}><Pi n="download-simple" s="xs" />Ekspor rekap</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}