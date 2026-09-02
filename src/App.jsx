import { useCallback, useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import AddDialog from './components/AddDialog';
import BottomNav from './components/BottomNav';
import DashboardView from './components/DashboardView';
import Footer from './components/Footer';
import Header from './components/Header';
import KlasDialog from './components/KlasDialog';
import KlasifikasiView from './components/KlasifikasiView';
import PhotoViewer from './components/PhotoViewer';
import ProfileView from './components/ProfileView';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import StokView from './components/StokView';
import { records as seed } from './data';
import { apiGet, apiPost, recordFromRow, klasRowFromRecord, apiLogin } from './lib/api';

const timeNow = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const readSession = () => {
  try {
    const s = JSON.parse(localStorage.getItem('dk_session'));
    return s && typeof s === 'object' && typeof s.username === 'string' && typeof s.nama === 'string' && typeof s.jabatan === 'string' ? s : null;
  } catch { return null; }
};

const INIT_FEED = [
  { t: '09.41', ico: 'image', tone: 'info', txt: 'Foto monitoring 0825163 (Den. Pink Lips x Selfing) diperbarui di Google Drive.' },
  { t: '09.05', ico: 'clipboard-text', tone: 'warn', txt: 'Beberapa record menunggu pengisian kolom klasifikasi, botol, seedling, remaja & dewasa.' },
  { t: '08.55', ico: 'clock-countdown', tone: 'warn', txt: 'Sebagian pending & belum monitoring, cek jadwal lanjutan.' },
  { t: '08.30', ico: 'check-circle', tone: 'ok', txt: 'Monitoring HST-60 0825163 selesai, embrio tumbuh baik, 1 botol tercatat.' },
  { t: 'kemarin', ico: 'warning', tone: 'warn', txt: '0425011 dinyatakan gagal setelah 10 kali monitoring, pertimbangkan ulang tanam.' },
];

export default function App() {
  const [view, setViewState] = useState('dashboard');
  const [prevView, setPrevView] = useState(null);
  const [user, setUser] = useState(readSession);
  const [loginBusy, setLoginBusy] = useState(false);

  useEffect(() => {
    if (!prevView) return;
    const id = setTimeout(() => setPrevView(null), 260);
    return () => clearTimeout(id);
  }, [prevView]);

  useEffect(() => {
    const setTrueAppHeight = () => document.documentElement.style.setProperty('--app-height', window.screen.height + 'px');
    setTrueAppHeight();
    window.addEventListener('resize', setTrueAppHeight);
    window.addEventListener('orientationchange', () => setTimeout(setTrueAppHeight, 300));
    return () => {
      window.removeEventListener('resize', setTrueAppHeight);
    };
  }, []);

  const [records, setRecords] = useState(seed);
  const [boot, setBoot] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const j = await apiGet();
        if (!alive) return;
        if (Array.isArray(j.data)) {
          // dedupe KODE duplikat (ada di sheet server, mis. 0425003) — baris pertama menang
          const seen = new Set();
          setRecords(j.data.map(recordFromRow).filter(r => {
            if (seen.has(r.kode)) return false;
            seen.add(r.kode);
            return true;
          }));
        }
      } catch (err) {
        if (alive) toast.error(`Gagal ambil data: ${err.message}`);
      } finally {
        if (alive) setBoot(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  const [curCat, setCurCat] = useState('all');
  const [curQuery, setCurQuery] = useState('');
  const [klasMode, setKlasMode] = useState('single');
  const [klasTarget, setKlasTarget] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [feed, setFeed] = useState(INIT_FEED);
  const [bellDot, setBellDot] = useState(true);
  const [justAdded, setJustAdded] = useState(null);
  const [photo, setPhoto] = useState(null);

  const setView = useCallback(name => {
    if (name === view) return;
    setPrevView(reduceMotion ? null : view);
    setViewState(name);
    window.scrollTo({ top: 0 });
  }, [view]);

  const addFeed = useCallback((txt, ico, tone) => {
    setFeed(f => [{ t: timeNow(), txt, ico, tone }, ...f]);
  }, []);

  const onSearch = useCallback(v => {
    setCurQuery(v);
  }, []);

  const onClearSearch = useCallback(() => setCurQuery(''), []);

  const onLogin = useCallback(async (username, password) => {
    setLoginBusy(true);
    try {
      const j = await apiLogin(username, password);
      const usr = { username, nama: j.nama, jabatan: j.jabatan };
      setUser(usr);
      localStorage.setItem('dk_session', JSON.stringify(usr));
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setLoginBusy(false);
    }
  }, []);

  const onLogout = useCallback(() => {
    localStorage.removeItem('dk_session');
    setUser(null);
    toast.info('Sampai jumpa lagi di lab.');
  }, []);

  // sinkron sesi antar-tab (logout/login di tab lain)
  useEffect(() => {
    const fn = e => { if (e.key === 'dk_session') setUser(readSession()); };
    window.addEventListener('storage', fn);
    return () => window.removeEventListener('storage', fn);
  }, []);

  const resetFilter = useCallback(() => { setCurCat('all'); setCurQuery(''); }, []);

  const onBell = useCallback(() => {
    const mL = records.filter(r => r.lanjut).map(r => r.lanjut).sort()[0];
    const pending = records.filter(r => r.status === 'PENDING').length;
    const blm = records.filter(r => r.status === 'BLM MONITORING').length;
    toast.info(`${pending} pending, ${blm} belum monitoring${mL ? ' · lanjutan terdekat ' + mL : ''}.`);
    setBellDot(false);
  }, [records]);

  const saveKlas = useCallback((kode, vals) => {
    // optimistik: UI update dulu, backend jalan di belakang; gagal → revert + toast
    const oldRec = records.find(r => r.kode === kode);
    setRecords(rs => rs.map(r => (r.kode === kode ? { ...r, ...vals } : r)));
    apiPost([klasRowFromRecord({ kode, ...vals, periode: oldRec?.periode })])
      .catch(err => {
        if (oldRec) setRecords(rs => rs.map(r => (r.kode === kode ? oldRec : r)));
        toast.error(`Gagal menyimpan: ${err.message}`);
      });
    return true;
  }, [records]);

  const saveBulk = useCallback((newRecords, count, toSave) => {
    const oldRecords = records;
    setRecords(newRecords);
    apiPost(toSave.map(klasRowFromRecord))
      .then(() => addFeed(`Klasifikasi massal tersimpan: ${count} record diperbarui sekaligus.`, 'clipboard-text', 'ok'))
      .catch(err => {
        setRecords(oldRecords);
        toast.error(`Gagal simpan massal: ${err.message}`);
      });
    return true;
  }, [records, addFeed]);

  const addRecord = useCallback(data => {
    const rec = { ...data, kondisi: 'BELUM ADA CATATAN KONDISI', lanjut: '', foto: '', mon: 0, botol: '', seedling: '', remaja: '', dewasa: '' };
    setRecords(rs => [rec, ...rs]);
    setCurCat('all');
    setCurQuery('');
    setAddOpen(false);
    setView('klasifikasi');
    setJustAdded(data.kode);
    setTimeout(() => setJustAdded(null), 3200);
  }, [setView]);

  if (!user) {
    return (
      <>
        <LoginScreen onLogin={onLogin} busy={loginBusy} />
        <Toaster position="bottom-right" toastOptions={{ style: { background: 'rgba(255,255,255,.82)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,.95)', borderRadius: '999px', boxShadow: '0 12px 30px -10px rgba(51,65,85,.25)', fontFamily: 'Satoshi, sans-serif' } }} />
      </>
    );
  }

  return (
    <>
      <div className="orb orb-a"></div>
      <div className="orb orb-b"></div>
      <div className="orb orb-c"></div>

      {boot && user && (
        <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 bg-[#e7e9ec]">
          <span className="w-14 h-14 rounded-[1rem] bg-emerald-500 flex items-center justify-center" style={{ boxShadow: '0 10px 22px -8px rgba(5,150,105,.55), inset 0 2px 0 rgba(255,255,255,.45)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2.5 19.5 9 6.8l4.2 7.6 2.4-3.9 5.9 9H2.5Z" fill="#04281C" />
              <circle cx="18.6" cy="5.4" r="1.6" fill="#04281C" />
            </svg>
          </span>
          <p className="text-sm font-semibold text-ink-2">Memuat data…</p>
        </div>
      )}

      <div className="relative z-10 flex min-h-[var(--app-height)]">
        <Sidebar view={view} setView={setView} user={user} onLogout={onLogout} />

        <main className="flex-1 min-w-0 pb-28 lg:pb-8">
          <Header curQuery={curQuery} onSearch={onSearch} onClear={onClearSearch} bellDot={bellDot} onBell={onBell} />

          <div className={view === 'dashboard' ? 'view active' : prevView === 'dashboard' ? 'view leave' : 'view'}>
            <DashboardView records={records} feed={feed} setView={setView} openAdd={() => setAddOpen(true)} onEkspor={() => toast.info('Rekap monitoring diekspor sebagai contoh.')} user={user} />
          </div>
          <div className={view === 'stok' ? 'view active' : prevView === 'stok' ? 'view leave' : 'view'}>
            <StokView records={records} curCat={curCat} setCat={setCurCat} curQuery={curQuery} onClearSearch={onClearSearch} openAdd={() => setAddOpen(true)} resetFilter={resetFilter} onPhoto={setPhoto} />
          </div>
          <div className={view === 'klasifikasi' ? 'view active' : prevView === 'klasifikasi' ? 'view leave' : 'view'}>
            <KlasifikasiView
              records={records} klasMode={klasMode} setKlasMode={setKlasMode}
              onOpenKlas={setKlasTarget} onBulkSave={saveBulk} justAdded={justAdded} onPhoto={setPhoto}
              curQuery={curQuery} onClearSearch={onClearSearch}
            />
          </div>

          <div className={view === 'profile' ? 'view active' : prevView === 'profile' ? 'view leave' : 'view'}>
            <ProfileView user={user} onLogout={onLogout} />
          </div>

          <Footer />
        </main>
      </div>

      <BottomNav view={view} setView={setView} />

      <Toaster position="bottom-right" toastOptions={{ style: { background: 'rgba(255,255,255,.82)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,.95)', borderRadius: '999px', boxShadow: '0 12px 30px -10px rgba(51,65,85,.25)', fontFamily: 'Satoshi, sans-serif' } }} />

      {klasTarget && (
        <KlasDialog key={klasTarget.kode} record={klasTarget} onOpenChange={o => { if (!o) setKlasTarget(null); }} onSave={vals => saveKlas(klasTarget.kode, vals)} addFeed={addFeed} onPhoto={setPhoto} />
      )}

      <PhotoViewer record={photo} onClose={() => setPhoto(null)} />

      <AddDialog
        key={addOpen ? 'open' : 'closed'}
        open={addOpen}
        onOpenChange={setAddOpen}
        curCat={curCat}
        records={records}
        onAdd={addRecord}
        addFeed={addFeed}
      />
    </>
  );
}