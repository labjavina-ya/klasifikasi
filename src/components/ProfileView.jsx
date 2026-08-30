import { Pi } from './bits';
import { lab } from '../data';

export default function ProfileView({ user, onLogout }) {
  return (
    <section className="px-4 lg:px-8 pt-4 max-w-xl">
      <div className="glass rounded-[2rem] p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <img src="/javina-fix.png" alt="Logo Javina" className="w-16 h-16 object-contain rounded-xl bg-white/70 p-1.5 border border-white/90" />
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight truncate">{user?.nama}</h2>
            <p className="text-sm text-ink-2 mt-0.5">{user?.jabatan}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[['user', 'Username', user?.username], ['tag', 'Jabatan', user?.jabatan]].map(([ico, lbl, val]) => (
            <div key={lbl} className="flex items-center justify-between gap-3 rounded-2xl bg-white/55 border border-white/85 px-4 py-3">
              <span className="flex items-center gap-2.5 text-sm font-semibold text-ink-2"><Pi n={ico} s="sm" className="text-ink-3" />{lbl}</span>
              <span className="text-sm font-mono font-bold truncate">{val}</span>
            </div>
          ))}
        </div>

        <button type="button" onClick={onLogout} className="btn-primary w-full justify-center mt-6">
          <Pi n="sign-out" s="sm" />Log out
        </button>

        <p className="text-xs text-ink-3 mt-6 leading-relaxed">
          {lab.nama}<br />{lab.alamat}<br />{lab.telp}
        </p>
      </div>
    </section>
  );
}