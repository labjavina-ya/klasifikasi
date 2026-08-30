import { useState } from 'react';
import { Pi } from './bits';
import { lab } from '../data';

export default function LoginScreen({ onLogin, busy }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');

  const submit = async e => {
    e.preventDefault();
    if (busy) return;
    if (!u.trim() || !p) return;
    const ok = await onLogin(u.trim(), p);
    if (!ok) setP('');
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[90] overflow-y-auto overscroll-contain bg-[#e7e9ec]"
      style={{ height: 'var(--app-height, 100dvh)' }}
    >
      <div className="orb orb-a"></div>
      <div className="orb orb-c"></div>

      <div className="relative z-10 min-h-full grid lg:grid-cols-2" style={{ paddingTop: 'var(--safe-top)' }}>
        {/* Sisi konten */}
        <div className="flex flex-col justify-center p-8 sm:p-14">
          <div className="max-w-md">
            <img
              src="/javina-fix.png" alt="Logo Javina"
              className="h-24 sm:h-28 w-auto object-contain drop-shadow-sm"
            />
            <h1 className="mt-8 text-3xl sm:text-[2.6rem] font-black tracking-tight leading-[1.05]">
              Dashboard <span className="italic font-bold">Klasifikasi</span>
            </h1>
            <p className="text-ink-2 mt-3 leading-relaxed max-w-sm">
              Monitoring & klasifikasi silangan anggrek, dari botol, seedling, remaja, hingga dewasa. Masuk untuk melanjutkan.
            </p>
            <p className="text-xs text-ink-3 mt-10 leading-relaxed">
              {lab.nama}<br />{lab.alamat}<br />{lab.telp}
            </p>
          </div>
        </div>

        {/* Sisi login */}
        <div className="flex flex-col items-center justify-end lg:justify-center px-8 sm:px-14 pb-16 lg:pb-14">
          <form onSubmit={submit} noValidate className="glass-strong rounded-[2rem] w-full max-w-sm p-7 sm:p-9 space-y-5">
            <div>
              <h2 className="text-xl font-black tracking-tight">Masuk</h2>
              <p className="text-xs text-ink-2 mt-1">Gunakan akun breeder/laboratorium Anda.</p>
            </div>

            <div>
              <label htmlFor="lgU" className="block text-sm font-semibold mb-1.5">Username</label>
              <input id="lgU" className="inp" type="text" autoComplete="username" placeholder="contoh: UDIK" value={u} onChange={e => setU(e.target.value)} />
            </div>

            <div>
              <label htmlFor="lgP" className="block text-sm font-semibold mb-1.5">Password</label>
              <input id="lgP" className="inp" type="password" autoComplete="current-password" placeholder="••••••" value={p} onChange={e => setP(e.target.value)} />
            </div>

            <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
              {busy ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />Proses…</> : <><Pi n="arrow-right" s="sm" />Masuk</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}