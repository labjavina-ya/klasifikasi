import {
  ArrowCounterClockwise, ArrowRight, Bell, CalendarBlank, CaretDown, CheckCircle, ClipboardText,
  ClockCountdown, CursorClick, DownloadSimple, Flask, Hourglass, Image, Info, InstagramLogo,
  MagnifyingGlass, Minus, Package, Plant, Plus, Quotes, Rows, SignOut, SquaresFour, Stack, Tag,
  TrendUp, User, Warning, WhatsappLogo, X,
} from '@phosphor-icons/react';

/* Ikon: wrapper mapper biar tree-shaking jalan, ukuran setara kelas .ic-* */
const ICON_SZ = { xs: 13, sm: 17, md: 21, lg: 28, xl: 38, '2xl': 50 };
const MAP = {
  'arrow-counter-clockwise': ArrowCounterClockwise,
  'arrow-right': ArrowRight,
  bell: Bell,
  'calendar-blank': CalendarBlank,
  'caret-down': CaretDown,
  'check-circle': CheckCircle,
  'clipboard-text': ClipboardText,
  'clock-countdown': ClockCountdown,
  'cursor-click': CursorClick,
  'download-simple': DownloadSimple,
  flask: Flask,
  hourglass: Hourglass,
  image: Image,
  info: Info,
  'instagram-logo': InstagramLogo,
  'magnifying-glass': MagnifyingGlass,
  minus: Minus,
  package: Package,
  plant: Plant,
  plus: Plus,
  quotes: Quotes,
  rows: Rows,
  'sign-out': SignOut,
  'squares-four': SquaresFour,
  stack: Stack,
  tag: Tag,
  'trend-up': TrendUp,
  user: User,
  warning: Warning,
  'whatsapp-logo': WhatsappLogo,
  x: X,
};
export const Pi = ({ n, s = 'sm', className = '', weight = 'regular', style }) => {
  const C = MAP[n];
  if (!C) return null;
  return <C size={ICON_SZ[s]} weight={weight} className={`shrink-0 ${className}`} style={style} aria-hidden="true" />;
};

export const stCls = st => `st-badge st-${st.k}`;

/* ===== FOTO ===== */
export const fotoThumb = r => `https://drive.google.com/thumbnail?id=${r.foto}&sz=w480`;
export const fotoLink = r => (r.foto ? `https://drive.google.com/file/d/${r.foto}/view` : '');

export function FotoBlock({ r, onOpen }) {
  if (!r.foto) {
    return (
      <span className="nophoto w-[76px] h-[96px] rounded-[1rem] shrink-0">
        <Pi n="image" s="lg" />
        <span className="np-lbl">tanpa foto</span>
      </span>
    );
  }
  const cls = "relative block shrink-0 w-[76px] h-[96px] rounded-[1rem]";
  if (!onOpen) {
    return (
      <a href={fotoLink(r)} target="_blank" rel="noopener" className={cls} title="Buka foto (Google Drive)">
        <img
          src={fotoThumb(r)} alt={r.nama} loading="lazy"
          className="w-full h-full rounded-[1rem] object-cover border border-white/85 bg-white/40"
          onError={e => {
            e.currentTarget.style.display = 'none';
            const np = e.currentTarget.parentElement?.querySelector('.nophoto');
            if (np) np.style.display = 'flex';
          }}
        />
        <span className="nophoto absolute inset-0 rounded-[1rem]" style={{ display: 'none' }}>
          <Pi n="image" s="lg" />
        </span>
        <span className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white/75 backdrop-blur-sm border border-white/90 flex items-center justify-center text-emerald-700">
          <Pi n="image" s="xs" />
        </span>
      </a>
    );
  }
  return (
    <button type="button" className={cls} title="Lihat & zoom foto" onClick={e => { e.stopPropagation(); onOpen(r); }}>
      <img
        src={fotoThumb(r)} alt={r.nama} loading="lazy"
        className="w-full h-full rounded-[1rem] object-cover border border-white/85 bg-white/40"
        onError={e => {
          e.currentTarget.style.display = 'none';
          const np = e.currentTarget.parentElement?.querySelector('.nophoto');
          if (np) np.style.display = 'flex';
        }}
      />
      <span className="nophoto absolute inset-0 rounded-[1rem]" style={{ display: 'none' }}>
        <Pi n="image" s="lg" />
      </span>
      <span className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white/75 backdrop-blur-sm border border-white/90 flex items-center justify-center text-emerald-700">
        <Pi n="image" s="xs" />
      </span>
    </button>
  );
}

export function FotoMini({ r }) {
  if (!r.foto) {
    return (
      <span className="nophoto" style={{ gridArea: 'img' }}>
        <Pi n="image" s="md" />
      </span>
    );
  }
  return (
    <>
      <img
        src={fotoThumb(r)} alt={r.nama} loading="lazy" className="b-img"
        onError={e => {
          e.currentTarget.style.display = 'none';
          const np = e.currentTarget.parentElement?.querySelector('.nophoto');
          if (np) np.style.display = 'flex';
        }}
      />
      <span className="nophoto" style={{ display: 'none' }}><Pi n="image" s="md" /></span>
    </>
  );
}

/* ===== SEL FASE MINI (4 kolom) ===== */
export const faseVal = v => (v !== '' ? <span className="font-mono">{v}</span> : <span className="val-dash">&ndash;</span>);

export function SpecCells({ r, idx }) {
  const cells = [
    ['botol', r.botol, 0],
    ['seedling', r.seedling, 1],
    ['remaja', r.remaja, 2],
    ['dewasa', r.dewasa, 3],
  ];
  return (
    <div className="grid grid-cols-4 gap-2 mt-2.5">
      {cells.map(([lbl, val, pos]) => (
        <div key={lbl} className={`spec-cell ${accCls(idx, pos)}`}>
          <p className="spec-lbl">{lbl}</p>
          <p className="spec-val">{faseVal(val)}</p>
        </div>
      ))}
    </div>
  );
}

const ACC = ['spec-em', 'spec-sl', 'spec-zi', 'spec-tl'];
const accCls = (idx, pos) => ACC[(idx + pos) % ACC.length];

/* ===== BARIS INFO ===== */
export function InfoRow({ icon, tone, label, children, title }) {
  return (
    <div className="info-row">
      <span className={`ir-ico ir-${tone}`}><Pi n={icon} s="xs" /></span>
      <span className="ir-lbl">{label}</span>
      <span className="ir-lead" />
      <span className="ir-val" title={title}>{children}</span>
    </div>
  );
}

export function KlaVal({ v }) {
  if (v) return <span className="text-emerald-700">{v}</span>;
  return <span className="val-empty">Belum Diisi</span>;
}