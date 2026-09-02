import { todayIso } from '../data';

const URL = import.meta.env.VITE_APPSCRIPT_URL;
const KEY = import.meta.env.VITE_APPSCRIPT_KEY;

async function apiGet(params = {}) {
  if (!URL) throw new Error('VITE_APPSCRIPT_URL belum di-set di .env');
  const qs = new URLSearchParams({ api_key: KEY, ...params }).toString();
  const res = await fetch(`${URL}?${qs}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} dari Apps Script`);
  const j = await res.json();
  if (!j.success) throw new Error(j.message || 'Apps Script error');
  return j;
}

async function post(body) {
  if (!URL) throw new Error('VITE_APPSCRIPT_URL belum di-set di .env');
  const qs = new URLSearchParams({ api_key: KEY }).toString();
  const res = await fetch(`${URL}?${qs}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} dari Apps Script`);
  const j = await res.json();
  if (!j.success) throw new Error(j.message || 'Apps Script error');
  return j;
}

async function apiPost(rows) {
  return post({ sheet: 'KLASIFIKASI TANAMAN', rows });
}

async function apiLogin(username, password) {
  return post({ action: 'login', username, password });
}

/* ===== Mapping API -> model app ===== */
const MAP = {
  KODE: 'kode', PERIODE: 'periode', TANGGAL_TANAM: 'tanam',
  TANGGAL_MONITORING_HST_60: 'hst', RAK: 'rak', KETERANGAN_KONDISI: 'kondisi',
  TANGGAL_MONITORING_LANJUTAN: 'lanjut', STATUS: 'status', FOTO: 'foto',
  JUMLAH_MONITORING: 'mon', QTY_BOTOL: 'qty', NAMA_SILANGAN: 'nama',
  KELOMPOK: 'kelompok', KLASIFIKASI: 'klasifikasi', UMUR: 'umur',
  BOTOL: 'botol', SEEDLING: 'seedling', REMAJA: 'remaja', DEWASA: 'dewasa',
};

export function recordFromRow(row) {
  const r = {};
  for (const [api, app] of Object.entries(MAP)) {
    let v = row[api] ?? '';
    // sel Date dari server jadi "yyyy-mm-ddT00:00:00.000Z" — potong ke yyyy-mm-dd
    if (api === 'TANGGAL_TANAM' || api === 'TANGGAL_MONITORING_HST_60' || api === 'TANGGAL_MONITORING_LANJUTAN') {
      const s = String(v);
      v = /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : v;
    }
    // server simpan FOTO sebagai URL lengkap; model app butuh ID saja
    if (api === 'FOTO' && v) {
      const m = String(v).match(/(?:file\/d\/|id=)([A-Za-z0-9_-]+)/);
      v = m ? m[1] : '';
    }
    r[app] = v;
  }
  // angka: kosong -> '', bukan 0 (biar logika "belum diisi" jalan)
  ['mon', 'qty', 'umur', 'botol', 'seedling', 'remaja', 'dewasa'].forEach(k => {
    const v = r[k];
    r[k] = v === '' || v === null || v === undefined ? '' : Number(v);
  });
  return r;
}

export function klasRowFromRecord(r) {
  return {
    TANGGAL: todayIso(),
    'KODE PROJECT': r.kode,
    KLASIFIKASI: r.klasifikasi,
    BOTOL: r.botol === '' ? 0 : r.botol,
    SEEDLING: r.seedling === '' ? 0 : r.seedling,
    REMAJA: r.remaja === '' ? 0 : r.remaja,
    DEWASA: r.dewasa === '' ? 0 : r.dewasa,
    PERIODE: r.periode || '',
  };
}

export { apiGet, apiPost, apiLogin };