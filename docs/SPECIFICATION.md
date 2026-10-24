# ANICLIP — Specification v0.1

## 1. Product Overview
ANICLIP adalah prototipe antarmuka AI Anime Story Clipper untuk merancang klip cerita anime pendek bagi audiens internasional.

## 2. Target Pengguna
- Kreator video pendek yang menyasar audiens internasional.
- Pengguna yang ingin merancang alur storytelling anime berdurasi 15–30 detik.

## 3. Platform dan Bahasa
- Aplikasi web responsif.
- Antarmuka dirancang dengan label bahasa Inggris.
- Input sumber: YouTube, Facebook, Instagram, TikTok, dan Other.

## 4. Halaman Utama
### Create
- Pilihan platform sumber.
- Kolom URL video.
- Validasi format URL berdasarkan platform.
- Pilihan durasi 15, 20, atau 30 detik.
- Tombol untuk menjalankan demo.

### Story Result
- Placeholder preview.
- Ringkasan hasil simulasi.
- Contoh hook dan overlay yang diberi label demo.
- Status yang menjelaskan bahwa MP4 belum dirender.

### Settings
- Aspect ratio: 9:16, 1:1, 16:9, 4:5.
- Target resolusi: 720p atau 1080p.
- Preferensi subtitle.
- Preferensi audio atau musik.
- Preferensi frame.

## 5. Desain UI
- Tema dark charcoal dengan aksen lime green.
- Minimal, mudah dipahami, dan responsif.
- Navigasi utama: Create, Story Result, Settings.

## 6. Batasan Versi 0.1
- UI demo interaktif saja.
- Tidak mengunduh video.
- Tidak melakukan analisis AI sungguhan.
- Belum menggunakan Gemini API.
- Tidak menghasilkan MP4 sungguhan.
- Tidak ada fitur auto-publish.
- Tidak mengklaim hasil simulasi sebagai hasil pemrosesan nyata.

## 7. Prinsip Keamanan dan Kepatuhan
- Jangan meminta pengguna menaruh API key di kode frontend atau repository publik.
- Integrasi AI mendatang harus memakai penyimpanan rahasia di backend.
- Sumber video harus diakses dengan cara yang diizinkan; jangan melewati DRM, paywall, atau pembatasan akses.
- Pertimbangkan hak cipta dan izin penggunaan klip sebelum publikasi.

## 8. Prinsip Biaya
- Prioritaskan prototipe gratis.
- Jelaskan batas hosting gratis, kuota, dan kebutuhan komputasi sebelum mengaktifkan fitur berat.
- Jangan menjanjikan hosting gratis permanen atau pendapatan tertentu.

## 9. Tahapan Pengembangan
1. Sepakati flow dan spesifikasi.
2. Bangun UI demo.
3. Uji navigasi dan validasi input.
4. Evaluasi kelayakan integrasi AI dan sumber video.
5. Rencanakan pipeline render MP4 setelah biaya, keamanan, dan hak penggunaan ditinjau.
