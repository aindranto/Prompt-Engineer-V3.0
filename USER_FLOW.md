# User Flow & Journey Diagram

## Alur Pengguna (User Journey) Langkah demi Langkah

```
[Mulai Aplikasi]
       │
       ▼
[Panel Konfigurasi API] ──► (Masukkan API Key & Verifikasi Koneksi)
       │
       ▼
[Halaman Chat Utama]
       │
       ├─► (Pengguna Mengunggah Lampiran Berkas / Gambar jika ada)
       │
       ▼
[Input Tujuan Utama Prompt]
       │
       ▼
[Langkah A: Riset Peran Utama & Jobdesk Otomatis]
       │
       ▼
[Langkah B: Eskalasi Peran Sekunder (Domain Expert)]
       │
       ▼
[Siklus Wawancara Bertahap (Tujuan ➔ Peran ➔ Batasan ➔ Gaya ➔ Format)]
       │
       ├─► [Pengguna Mengklik Kartu 'Option Box' atau Mengetik Jawaban]
       │
       ▼
[Ringkasan Spesifikasi Prompt]
       │
       ▼
[Muncul Banner 'BUAT PROMPT' / Konfirmasi Pengguna]
       │
       ▼
[Pembangkitan Prompt Final Utuh (Markdown 4 Backticks)]
       │
       ├─► [Tombol Aksi: Salin Prompt]
       ├─► [Tombol Aksi: Unduh .txt]
       ├─► [Tombol Aksi: Generate Ulang / Revisi]
       │
       ▼
[Manajemen Sesi: Export / Import JSON & Reset]
```
