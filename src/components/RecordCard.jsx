import { toast } from 'sonner';
import { FotoBlock, InfoRow, KlaVal, Pi, SpecCells } from './bits';
import { fmtDate, ST } from '../data';

export default function RecordCard({ r, idx, onPhoto }) {
  const S = ST[r.status] || ST['BLM MONITORING'];

  const fotoPill = r.foto ? (
    <a href={`https://drive.google.com/file/d/${r.foto}/view`} target="_blank" rel="noopener" className="pill-mini !py-1.5 !px-3.5 shrink-0" title="Buka foto di Google Drive">
      Foto<Pi n="image" s="xs" />
    </a>
  ) : (
    <button type="button" className="pill-mini !py-1.5 !px-3.5 shrink-0 opacity-70" title="Belum ada foto" onClick={() => toast.info('Belum ada foto untuk record ini.')}>
      Foto<Pi n="image" s="xs" />
    </button>
  );

  return (
    <div className="glass-tile sheen lift-t p-4 w-full">
      <div className="flex gap-3.5">
        <FotoBlock r={r} onOpen={onPhoto} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-mono text-[12px] font-bold tracking-wide">{r.kode}</p>
              <p className="text-[14.5px] font-black leading-snug clamp2 mt-0.5">{r.nama}</p>
            </div>
            <span className="shrink-0 mt-0.5"><span className={`st-badge st-${S.k}`}>{S.t}</span></span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="spec-badge"><Pi n="clock-countdown" s="xs" />PERIODE <b>{r.periode}</b></span>
            <span className="spec-badge"><Pi n="rows" s="xs" />RAK <b>{r.rak}</b></span>
          </div>
        </div>
      </div>

      <div className="mt-2.5">
        <InfoRow icon="calendar-blank" tone="em" label="Tanggal Tanam"><span className="font-mono">{fmtDate(r.tanam)}</span></InfoRow>
        <InfoRow icon="flask" tone="tl" label="Qty Botol"><span className="font-mono text-emerald-700">{r.qty}</span></InfoRow>
        <InfoRow icon="tag" tone="sl" label="Kelompok" title={r.kelompok}>{r.kelompok}</InfoRow>
        <InfoRow icon="clipboard-text" tone="zi" label="Klasifikasi" title={r.klasifikasi || 'Belum Diisi'}><KlaVal v={r.klasifikasi} /></InfoRow>
      </div>

      <SpecCells r={r} idx={idx} />

      <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-line">
        <p className="text-[11px] text-ink-2 clamp2 leading-snug min-w-0 max-w-[62%]">{r.kondisi}</p>
        {fotoPill}
      </div>
    </div>
  );
}