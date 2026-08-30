import { Pi } from './bits';

export default function BottomNav({ view, setView }) {
  const items = [
    ['dashboard', 'squares-four', 'Dashboard'],
    ['stok', 'package', 'Stok'],
    ['klasifikasi', 'clipboard-text', 'Klasifikasi'],
    ['profile', 'user', 'Profile'],
  ];
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="glass-strong rounded-full px-2 py-1.5 grid grid-cols-4 items-center">
        {items.map(([name, icon, label]) => (
          <button key={name} className={`bnav ${view === name ? 'active' : ''}`} onClick={() => setView(name)}>
            <span className="bn-ico"><Pi n={icon} s="md" /></span>
            <span className="bn-lbl">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}