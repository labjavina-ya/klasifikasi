/* ============================================================
   DATA, record monitoring silangan (multi-periode: T1, T2, T3).
   ============================================================ */

export const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export const fmtDate = iso => {
  const [y, m, d] = iso.split('-');
  return `${+d} ${BULAN[+m - 1]} ${y}`;
};

export const lab = { nama: 'Dashboard Klasifikasi', alamat: 'Singosari, Malang', telp: '0812 3456 7890' };

const R = (periode, kode, tanam, hst, rak, kondisi, lanjut, status, foto, mon, qty, nama, kelompok, klasifikasi, umur) =>
  ({
    periode, kode, tanam, hst, rak, kondisi, lanjut, status, foto, mon, qty, nama, kelompok, klasifikasi, umur,
    botol: '', seedling: '', remaja: '', dewasa: '',
  });

export const KLASIFIKASI_OPTS = [
  'AC NON KOLEKTOR umum',
  'AC KOLEKTOR premium',
  'AD SPATULATA premium',
  'AD SPATULATA umum',
  'AD NON SPATULATA premium',
  'AD NON SPATULATA umum',
  'ADB NON KOLEKTOR umum',
  'ADB KOLEKTOR premium',
  'ALL NON KOLEKTOR umum',
  'ALL KOLEKTOR premium',
  'AP NON KOLEKTOR umum',
  'AP KOLEKTOR premium',
  'AV NON KOLEKTOR umum',
  'AV KOLEKTOR premium',
];

export const records = [
  /* ===== PERIODE T1 ===== */
  R('T1', '0925012', '2025-12-01', '2026-01-30', 'A-3A', 'BELUM ADA CATATAN KONDISI', '', 'BLM MONITORING', '', 0, 2, 'Den. lasianthera x Selfing', 'AD Spesies Spatulata', '', 0),
  R('T1', '0925013', '2025-12-05', '2026-02-03', 'A-3B', 'BELUM ADA CATATAN KONDISI', '', 'BLM MONITORING', '', 0, 1, 'C. walkeriana x Selfing', 'AC Spesies Cattleya', '', 0),

  R('T1', '0325053', '2025-06-19', '2025-08-14', 'A-2A', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO BANYAK', '', 'BERHASIL', '1pZFokX_Zw9a4SeGaHh8KeXQVX3pQ4LoM', 1, 2, "Den. discolor var. Tanimbar 'Flava' x Selfing", 'AD Spesies Spatulata', 'AD SPATULATA premium', 14),
  R('T1', '0225019', '2025-07-11', '2025-09-05', 'A-5B', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '1p9yAFS5SDX2Yg0Dyoj4ZJVmTgiEaP-d6', 2, 3, "C. bicolor x C. Royal Cognac 'Wilson'", 'AC Hibrid Cattleya', 'AC KOLEKTOR premium', 13),
  R('T1', '0425061', '2025-08-15', '2025-10-10', 'A-4A', 'EMBRIO TUMBUH KURANG BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '1KPV-PwK5eyO4A8WGOKNaji9ZfxIberkL', 2, 2, "Den. Arjuno Kili Sucix Den. Fawn Folly", 'AD Hibrid Intersection', 'AD NON SPATULATA umum', 12),
  R('T1', '0425011', '2025-08-27', '2025-10-22', 'A-7A', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO SEDIKIT', '', 'GAGAL', '1i5eyGZXyk69WCjqkuWdV9mGmCRd2j9uV', 10, 2, "Paph. dodyanum x Paph. Jogjae", 'ALL Hibrid Paphiopedilum', 'ALL KOLEKTOR premium', 12),
  R('T1', '0625127', '2025-08-28', '2025-10-23', 'A-7B', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO SEDIKIT', '', 'GAGAL', '1LeEteLkRvkSaRZ7JyLRtAE6TFYj8ulON', 10, 2, "Ar. graminifolia x Coel. Burfordiense", 'ALL Hibrid Intergeneric', 'ALL KOLEKTOR premium', 12),
  R('T1', '0525156', '2025-09-02', '2025-10-28', 'A-7B', 'EMBRIO TUMBUH KURANG BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '18jwyCdVRsWPBulSGein_PXWI7WRDJG9M', 1, 1, "Den. Balaputradewa Two x Selfing", 'AD Hibrid Spatulata', 'AD SPATULATA premium', 11),
  R('T1', '0725134', '2025-09-04', '2025-10-30', 'A-6B', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO SEDIKIT', '', 'GAGAL', '1t-T2LBSTX8z_sguPqGokPfl7D96wMti3', 10, 2, "Paph. concolor x Paph. Jogjae", 'ALL Hibrid Paphiopedilum', 'ALL KOLEKTOR premium', 11),
  R('T1', '0725106', '2025-09-12', '2025-11-07', 'A-8A', 'EMBRIO TUMBUH KURANG BAIK, JUMLAH EMBRIO SEDIKIT', '', 'GAGAL', '1tKuvj_V3BwqBoNLrQ8fm_eNXLQ4sPZKb', 10, 1, "Paph. fowliei x Paph. Saint Swithin", 'ALL Hibrid Paphiopedilum', 'ALL KOLEKTOR premium', 11),
  R('T1', '0725001', '2025-09-23', '2025-11-18', 'A-5A', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '1MaUgfrcDdU91hhE6qfSmyOvSs0mGTGXj', 1, 1, "Bulb. treschii x Selfing", 'ALL Spesies Bulbophyllum', 'ALL KOLEKTOR premium', 11),
  R('T1', '0625141', '2025-09-26', '2025-11-21', 'A-9A', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '1YbKemXAf2SEcDuHr2A6ixFY9S6BvYkGD', 0, 2, "Den. Husmadi x Den. Wira Pride", 'AD Hibrid Spatulata', 'AD SPATULATA premium', 11),
  R('T1', '0525009', '2025-09-30', '2025-11-25', 'A-5B', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO SEDIKIT', '', 'GAGAL', '1GY8TGrY48UyPlPct-VsOeJYWLdv0np2P', 10, 1, "C. schilleriana x Coel. Burfordiense", 'ALL Hibrid Intergeneric', 'ALL KOLEKTOR premium', 11),
  R('T1', '0725086', '2025-09-30', '2025-11-25', 'A-7B', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '1cCu1oWQ4x60PTrZtzadrb0RIa_5T0g1c', 1, 2, "Den. dedeksantosoi x Den. violaceoflavens 'Mini'", 'AD Hibrid Spatulata', 'AD SPATULATA premium', 11),
  R('T1', '0225029', '2025-10-07', '2025-12-02', 'A-4A', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO SEDIKIT', '', 'GAGAL', '1sJfrbRcntDgO845k1KTr5ouzj2zZ99bP', 10, 2, "Gram. Yuan Nan Tiger x Zns. Murasakikomachi", 'ALL Hibrid Intergeneric', 'ALL KOLEKTOR premium', 10),
  R('T1', '0625111', '2025-10-07', '2025-12-02', 'A-5B', 'EMBRIO TUMBUH KURANG BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '1BXLJHA6aO3QdNJHHGDt6bhaQYEIm2F64', 2, 3, "Den. Soerya Aries x Den. violaceoflavens 'Mini'", 'AD Hibrid Spatulata', 'AD SPATULATA umum', 10),
  R('T1', '0725020', '2025-10-14', '2025-12-09', 'A-3B', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '12qzJc_2_gqECyoQbTKU9UfKISQDlKhA2', 0, 1, "Den. Kim Manjo x Den. sutiknoi", 'AD Hibrid Spatulata', 'AD SPATULATA premium', 10),
  R('T1', '0725025', '2025-10-14', '2025-12-09', 'A-2B', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '1liTaLYkMT4JWCfuGNX5Kt0ax7jIZSf9g', 1, 2, "Den. Kim Manjo x Den. macrophyllum 'Jawa'", 'AD Hibrid Intersection', 'AD NON SPATULATA premium', 10),
  R('T1', '0225131', '2025-10-15', '2025-12-10', 'A-2B', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '1BONWiXzX-GaP8kjeTtQIQxUUNqpcYcWM', 0, 1, "Phal. amboinensis 'white' x Phal. speciosa 'Purple Mountain'", 'AP Hibrid Phalaenopsis', 'AP NON KOLEKTOR umum', 10),
  R('T1', '0725055', '2025-10-15', '2025-12-10', 'A-5B', 'EMBRIO TUMBUH KURANG BAIK, JUMLAH EMBRIO SEDIKIT', '', 'GAGAL', '147OGRW1trOILYIHDHyJHuATp7m0vhykJ', 8, 1, "Den. macrophyllum 'Ambon' x Den. williamsianum", 'AD Hibrid Intersection', 'AD NON SPATULATA premium', 10),
  R('T1', '0725091', '2025-10-18', '2025-12-13', 'A-2A', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '1btrWPnO6G3xVqoBgBSNpuFzrrXBKr2_1', 0, 1, "Den. stockelbuschii x Den. violaceoflavens 'Mini'", 'AD Hibrid Spatulata', 'AD SPATULATA premium', 10),
  R('T1', '0425003', '2025-10-22', '2025-12-17', 'A-6B', 'EMBRIO TUMBUH KURANG BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '1UfoVj7dl1eRhBrxi98YfYlf1GhevkSKD', 0, 3, "C. aclandiae x Rlc. Shinfong Unique", 'AC Hibrid Cattleya', 'AC NON KOLEKTOR umum', 10),
  R('T1', '0425100', '2025-10-22', '2025-12-17', 'A-6A', 'EMBRIO TUMBUH KURANG BAIK, JUMLAH EMBRIO SEDIKIT', '2026-08-26', 'PENDING', '1BCiRKzN-bkECsXdYpiYqrDXjvGoMk_Lc', 9, 1, "Ercn. pusilla x Selfing", 'ALL Spesies Erycina', 'ALL KOLEKTOR premium', 10),
  R('T1', '0325116', '2025-10-23', '2025-12-18', 'A-9A', 'EMBRIO TUMBUH KURANG BAIK, JUMLAH EMBRIO SEDIKIT', '2026-08-27', 'PENDING', '166Jq-8EeIVydgSo07y-y4ldq83m--mEH', 9, 1, "Cym. Chen's Ruby x Gram. speciosum", 'ALL Hibrid Intergeneric', 'ALL NON KOLEKTOR umum', 10),
  R('T1', '0225005', '2025-10-28', '2025-12-23', 'A-10A', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO BANYAK', '2026-09-01', 'PENDING', '1K7cnAYVFrFi1Ty2ACd6pQkJa2FNm_2Ns', 9, 2, "Gbt. Hilo Ablaze x Gram. martae", 'ALL Hibrid Intergeneric', 'ALL KOLEKTOR premium', 10),
  R('T1', '0525162', '2025-10-28', '2025-12-23', 'A-5B', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO SEDIKIT', '2026-09-01', 'PENDING', '1FrmoHAP84jyq-KCgf1xVR75-Pc0bpRVr', 9, 1, "Cym. dayanum 'Flava' x Gram. Yuan Nan Tiger", 'ALL Hibrid Intergeneric', 'ALL KOLEKTOR premium', 10),
  R('T1', '0325081', '2025-10-30', '2025-12-25', 'A-5B', 'EMBRIO TUMBUH KURANG BAIK, JUMLAH EMBRIO SEDIKIT', '2026-09-03', 'PENDING', '1_LiZSVZhXw-nGcuUlAmtm-nkBON_k2Aa', 9, 2, "Paph. concolor x Paph. lowii var. lynniae", 'ALL Hibrid Paphiopedilum', 'ALL KOLEKTOR premium', 10),
  R('T1', '0625157', '2025-11-04', '2025-12-30', 'A-4B', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO SEDIKIT', '2026-09-08', 'PENDING', '1WX6bZp3J39-BWaHNpcTTzpbydx4XWfn1', 9, 2, "Coel. Burfordiense x Phaius amboinensis", 'ALL Hibrid Intergeneric', 'ALL KOLEKTOR premium', 9),
  R('T1', '0625158', '2025-11-04', '2025-12-30', 'A-5A', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO BANYAK', '2026-09-08', 'PENDING', '1mhQX7rw2uuyhn9wT1Rhvdn5BYfrQqiGV', 9, 2, "Phaius amboinensis x Selfing", 'ALL Spesies Phaius', 'ALL KOLEKTOR premium', 9),
  R('T1', '0525080', '2025-11-18', '2026-01-13', 'A-10B', 'EMBRIO TUMBUH KURANG BAIK, JUMLAH EMBRIO SEDIKIT', '', 'GAGAL', '1duGCxApgx3pyTAjTtYmwHW3oiJNj9t-Y', 5, 1, "Den. chrysotoxum x Den. Over the Rainbow", 'AD Hibrid Intersection', 'AD NON SPATULATA premium', 9),
  R('T1', '0725132', '2025-11-18', '2026-01-13', 'A-5B', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO SEDIKIT', '2026-08-25', 'PENDING', '1wVO1ZAbqJC_P3aMqLBnlQiV31RftTL7h', 9, 1, "Paph. concolor x Paph. philippinense", 'ALL Hibrid Paphiopedilum', 'ALL KOLEKTOR premium', 9),
  R('T1', '0725166', '2025-11-18', '2026-01-13', 'A-7B', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO SEDIKIT', '2026-08-25', 'PENDING', '1eZuEp-k3wN0ntKQDyYRPdO1moVt3d1eA', 8, 1, "Paph. dodyanum x Paph. myanmaricum", 'ALL Hibrid Paphiopedilum', 'ALL KOLEKTOR premium', 9),
  R('T1', '0825163', '2025-11-22', '2026-01-17', 'A-9B', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '1j7XL9d8L0isg-m1fe0rdoZB2mqsmtNRP', 0, 1, "Den. Pink Lips x Selfing", 'AD Hibrid Spatulata', 'AD SPATULATA umum', 9),

  /* ===== PERIODE T2 (contoh) ===== */
  R('T2', '0125041', '2025-05-02', '2025-07-01', 'B-1A', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO SEDIKIT', '', 'BERHASIL', '', 1, 2, 'Den. stratiotes x Selfing', 'AD Spesies Spatulata', 'AD SPATULATA premium', 15),
  R('T2', '0125042', '2025-05-10', '2025-07-09', 'B-1B', 'EMBRIO TUMBUH KURANG BAIK, JUMLAH EMBRIO SEDIKIT', '2026-05-10', 'PENDING', '', 9, 1, 'C. maxima x C. walkeriana', 'AC Hibrid Cattleya', 'AC KOLEKTOR premium', 14),
  R('T2', '0125043', '2025-05-20', '2025-07-19', 'B-2A', 'EMBRIO TIDAK TUMBUH, JUMLAH EMBRIO SEDIKIT', '', 'GAGAL', '', 10, 2, 'Phal. venus x Selfing', 'AP Hibrid Phalaenopsis', '', 14),

  /* ===== PERIODE T3 (contoh) ===== */
  R('T3', '0125051', '2025-06-01', '2025-07-31', 'C-1A', 'EMBRIO TUMBUH BAIK, JUMLAH EMBRIO BANYAK', '', 'BERHASIL', '', 1, 3, 'Den. bigibbum x Den. superbiens', 'AD Hibrid Spatulata', 'AD SPATULATA umum', 14),
  R('T3', '0125052', '2025-06-08', '2025-08-07', 'C-1B', 'BELUM ADA CATATAN KONDISI', '', 'BLM MONITORING', '', 0, 2, 'Vanda tricolor x Selfing', 'AV Spesies Vanda', '', 13),
];

export const PERIODES = [...new Set([...records.map(r => r.periode), 'T1', 'T2', 'T3'])].sort();

/* ===== STATE-INDEPENDENT HELPERS ===== */
export const ST = {
  'BERHASIL': { k: 'berhasil', t: 'berhasil' },
  'PENDING': { k: 'pending', t: 'pending' },
  'GAGAL': { k: 'gagal', t: 'gagal' },
  'BLM MONITORING': { k: 'blm', t: 'blm monitoring' },
};

export const nBy = (s, list = records) => list.filter(r => r.status === s).length;

export const FILL = ['klasifikasi', 'botol', 'seedling', 'remaja', 'dewasa'];
export const isComplete = r => FILL.every(k => r[k] !== '');
export const klasQueue = list => list.filter(r => !isComplete(r));

export const minLanjut = list => {
  const L = list.filter(r => r.lanjut).map(r => r.lanjut).sort();
  return L[0] || null;
};

export const fotoThumb = r => `https://drive.google.com/thumbnail?id=${r.foto}&sz=w480`;
export const fotoLink = r => (r.foto ? `https://drive.google.com/file/d/${r.foto}/view` : '');

export const stBadge = r => ST[r.status] || ST['BLM MONITORING'];

/* rotasi warna sel fase */
const ACC = ['spec-em', 'spec-sl', 'spec-zi', 'spec-tl'];
export const accCls = (idx, pos) => ACC[(idx + pos) % ACC.length];

/* ===== TANGGAL ===== */
export const addDays = (iso, n) => {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
export const todayIso = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const greeting = () => {
  const h = new Date().getHours();
  return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 19 ? 'Selamat sore' : 'Selamat malam';
};