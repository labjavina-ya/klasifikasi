const SS = SpreadsheetApp.getActiveSpreadsheet();
const API_KEY = 'ramadikaganteng3006';
const DATA_SHEET = 'STOK T1 T2 T3 UPDATE';
const KLAS_SHEET = 'KLASIFIKASI TANAMAN';
const USERS_SHEET = 'USERS';

function doGet(e)  { return dispatch(e, false); }
function doPost(e) { return dispatch(e, true); }

function dispatch(e, isPost) {
  try {
    if ((e.parameter.api_key || '') !== API_KEY) return json({ success:false, message:'api_key salah' });
    if (!isPost) return json({ success:true, data: readRows(DATA_SHEET) });
    const body = JSON.parse(e.postData.contents || '{}');
    if (body.action === 'login') return json(login(body));
    if (!Array.isArray(body.rows) || !body.rows.length) return json({ success:false, message:'rows kosong' });
    appendRows(body.sheet || KLAS_SHEET, body.rows);
    return json({ success:true, message:`${body.rows.length} baris tersimpan ke ${body.sheet || KLAS_SHEET}` });
  } catch (err) {
    return json({ success:false, message: 'Error: ' + err.message });
  }
}

function login(body) {
  const u = String(body.username || '').trim();
  const p = String(body.password || '').trim();
  const rows = readRows(USERS_SHEET);
  const first = rows[0] || {};
  const missing = ['NAMA', 'JABATAN', 'USERNAME', 'PASSWORD'].filter(k => !(k in first));
  if (!rows.length || missing.length) {
    const keys = rows.length ? Object.keys(first).join(', ') : 'sheet kosong';
    return { success:false, message:`Header USERS tidak cocok (ditemukan: ${keys}). Baris-1 harus: NAMA, JABATAN, USERNAME, PASSWORD.` };
  }
  const hit = rows.find(r => r.USERNAME === u && r.PASSWORD === p);
  if (!hit) return { success:false, message:'Username atau password salah' };
  return { success:true, nama: hit.NAMA, jabatan: hit.JABATAN };
}

function readRows(sheetName) {
  const sheet = SS.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet tidak ditemukan: ' + sheetName);
  const [headers, ...grid] = sheet.getDataRange().getValues();
  return grid.map(row => {
    const o = {};
    headers.forEach((h, i) => { if (h !== '') o[h.replace(/\s+/g, '_')] = row[i]; });
    return o;
  });
}

function appendRows(sheetName, rows) {
  const sheet = SS.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet tidak ditemukan: ' + sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const out = rows.map(r => headers.map(h => (h === '' ? '' : (r[h] === undefined ? '' : r[h]))));
  const last = sheet.getLastRow();
  sheet.getRange(last + 1, 1, out.length, headers.length).setValues(out);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}