---
name: log-skill
description: Wajib baca PROGRESS.TXT sebelum eksekusi dan append setiap aksi Created/Refactor/Fix/Install/Build dengan timestamp WIB, files, dan deskripsi. Append-only, tidak pernah overwrite.
---

# log-skill — Append-Only Progress Logging

Skill ini memaksa disiplin logging untuk semua aksi di project DASHBOARD-KLASIFIKASI.

## Aturan Wajib

1. **Sebelum eksekusi apapun** (write, edit, bash install, refactor, fix, build):
   - `Read PROGRESS.TXT` di root project `D:\RAMA BELAJAR CODING\DASHBOARD-KLASIFIKASI\PROGRESS.TXT`
   - Pahami entry terakhir, jangan duplikasi, lanjutkan urutan.

2. **Setelah eksekusi selesai** (termasuk created, refactor, fix, install, build):
   - Append ke `PROGRESS.TXT` dengan format:
     ```
     [YYYY-MM-DD HH:MM:SS WIB] TYPE: Created|Refactor|Install|Fix|Build | Files: path:line,... | Desc: ... | By: opencode/muse-spark
     ---
     ```
   - Gunakan append (`>>` atau `Add-Content`), **JANGAN** overwrite (`>` atau `Set-Content` tanpa append).
   - Timestamp WIB (UTC+7).

3. **Verifikasi**: `Read PROGRESS.TXT` lagi untuk pastikan append sukses dan tidak ada BOM (ef bb bf) di awal file.

## Kapan dipakai

- Setiap kali agent melakukan `write`, `edit`, `bash npm install`, `bash npx`, `refactor`, atau `build`.
- Bahkan jika skill lain yang dipakai (taste, caveman), tetap log.
- Jika `PROGRESS.TXT` belum ada, buat dengan header:
  ```
  # PROGRESS LOG — DASHBOARD-KLASIFIKASI
  # Aturan: APPEND-ONLY, jangan overwrite...
  ```

## Contoh Entry

```
[2026-08-21 10:15 WIB] TYPE: Fix | Files: src/App.jsx:175, src/index.css | Desc: Fix toast stuck — refactor showToast double-rAF + clear timers, auto-hide 3200ms | By: opencode/muse-spark
---
```

## Larangan

- Tidak pernah `Set-Content` overwrite tanpa membaca dulu.
- Tidak pernah menghapus `---` separator.
- Tidak pernah membiarkan BOM di file (strip ef bb bf jika ada).
