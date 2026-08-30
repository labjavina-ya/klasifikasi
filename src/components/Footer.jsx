import { toast } from 'sonner';
import { Pi } from './bits';
import { lab } from '../data';

export default function Footer() {
  return (
    <footer className="px-4 lg:px-8 pt-6">
      <div className="glass rounded-[2rem] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-500"
            style={{ boxShadow: '0 6px 14px -6px rgba(5,150,105,.5), inset 0 1.5px 0 rgba(255,255,255,.4)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2.5 19.5 9 6.8l4.2 7.6 2.4-3.9 5.9 9H2.5Z" fill="#04281C" />
              <circle cx="18.6" cy="5.4" r="1.6" fill="#04281C" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold">{lab.nama}</p>
            <p className="text-xs text-ink-3 mt-0.5">{lab.alamat}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-icon" aria-label="WhatsApp" onClick={() => toast.info('Chat WhatsApp lab: ' + lab.telp)}>
            <Pi n="whatsapp-logo" s="md" />
          </button>
          <button className="btn-icon" aria-label="Instagram" onClick={() => toast.info('Instagram: @argapura.lab')}>
            <Pi n="instagram-logo" s="md" />
          </button>
        </div>
      </div>
      <p className="text-xs text-ink-3 mt-5 px-2">© 2025 Dashboard Klasifikasi. Data pada halaman ini adalah data contoh monitoring.</p>
    </footer>
  );
}