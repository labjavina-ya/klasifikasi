import { FotoBlock, InfoRow, KlaVal, Pi, SpecCells } from './bits';
import { fmtDate, ST } from '../data';

export default function KlasCard({ r, idx, onOpen, highlight, onPhoto }) {
  const S = ST[r.status] || ST['BLM MONITORING'];
  return (
    <div
      role="button"
      tabIndex={0}
      data-rid={r.kode}
      className={`glass-tile sheen lift-t p-4 w-full text-left cursor-pointer ${highlight ? 'just-added feed-new' : ''}`}
      title={`Klasifikasikan ${r.kode}`}
      onClick={() => onOpen(r)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(r); } }}
    >
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
        <span className="text-[11px] text-ink-2 flex items-center gap-1.5"><Pi n="clipboard-text" s="xs" />isi 5 kolom via form</span>
        <span className="pill-mini !py-1.5 !px-3.5 shrink-0">Isi form<Pi n="arrow-right" s="xs" /></span>
      </div>
    </div>
  );
}