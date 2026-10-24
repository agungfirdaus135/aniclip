# ANICLIP — Flowchart v0.1

## Tujuan
ANICLIP adalah prototipe UI untuk merancang alur AI Anime Story Clipper. Versi ini hanya demo interaktif dan belum memproses video sungguhan.

## Flow Utama

1. **Create** — Pengguna membuka halaman pembuatan klip.
2. **Pilih Platform** — YouTube, Facebook, Instagram, TikTok, atau Other.
3. **Masukkan Link** — Pengguna menempelkan URL sumber video.
4. **Validasi URL** — Periksa format URL berdasarkan platform yang dipilih.
   - Jika tidak valid: tampilkan pesan kesalahan dan minta URL diperbaiki.
   - Jika valid: lanjut ke pengaturan klip.
5. **Atur Durasi** — Pilih 15, 20, atau 30 detik.
6. **Buat Demo** — Tampilkan hasil simulasi dan placeholder preview.
7. **Story Result** — Tampilkan ringkasan demo, hook contoh, dan status bahwa video belum dirender.
8. **Kembali ke Create** — Pengguna dapat mengubah sumber atau durasi.

## Halaman
- **Create:** platform, input URL, durasi, dan tombol untuk membuat demo.
- **Story Result:** hasil simulasi, placeholder preview, dan status proses.
- **Settings:** rasio 9:16, 1:1, 16:9, atau 4:5; target resolusi 720p atau 1080p; preferensi subtitle, audio/musik, dan frame.

## Batasan v0.1
- Belum ada integrasi Gemini.
- Belum mengunduh atau menganalisis video.
- Belum ada pemilihan Smart Hook berbasis AI.
- Belum ada render MP4 sungguhan.
- Belum ada auto-publish.
- Preview dan hasil hanya simulasi UI; jangan mengklaim video sudah diproses.

## Alur Fase Berikutnya
Setelah UI dan flow disepakati, rencanakan integrasi AI, analisis sumber yang diizinkan, pemilihan hook, dan render video. Evaluasi hak cipta, akses sumber, biaya hosting, dan keamanan API key sebelum implementasi.
