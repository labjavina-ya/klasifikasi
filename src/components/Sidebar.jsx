import { Pi } from './bits';

export default function Sidebar({ view, setView, user, onLogout }) {
  const items = [
    ['dashboard', 'squares-four', 'Dashboard'],
    ['stok', 'package', 'Stok aktif'],
    ['klasifikasi', 'clipboard-text', 'Form klasifikasi'],
  ];
  return (
    <aside className="hidden lg:sticky lg:flex top-0 left-0 z-40 w-[276px] shrink-0 h-[var(--app-height)] p-3">
      <div className="glass-strong rounded-[2.5rem] h-[calc(var(--app-height)-1.5rem)] w-full p-4 flex flex-col">
        <div className="brand-wrap">
          <span className="brand-logo">
            <img src="/javina-fix.png" alt="Logo Javina" className="w-9 h-9 object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block font-black tracking-tight text-[15px] leading-tight">Dashboard Klasifikasi</span>
            <span className="block text-[11px] text-ink-3 mt-1">monitoring silangan anggrek</span>
          </span>
          <Pi n="plant" s="2xl" className="brand-ghost" />
        </div>

        <nav className="mt-5 flex-1 overflow-y-auto pr-1">
          {items.map(([name, icon, label]) => (
            <button key={name} className={`nav-item ${view === name ? 'active' : ''}`} onClick={() => setView(name)}>
              <Pi n={icon} s="md" className="w-6 text-center" />
              {label}
            </button>
          ))}
        </nav>

        <div className="user-card p-3 mt-3">
          <div className="flex items-center gap-3">
            <img
              src="https://picsum.photos/seed/andra-basecamp-malang/80/80" alt="Foto profil"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shrink-0"
              style={{ boxShadow: '0 3px 8px -3px rgba(51,65,85,.25)' }}
            />
            <div className="flex-1 min-w-0">
              <p className="u-name truncate">{user?.nama}</p>
              <p className="u-role truncate mt-0.5">{user?.jabatan}</p>
            </div>
          </div>
          <button className="logout-btn mt-2.5" title="Keluar dari aplikasi" onClick={onLogout}>
            <Pi n="sign-out" s="sm" />Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}