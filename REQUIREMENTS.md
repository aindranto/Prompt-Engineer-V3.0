# Functional & Non-Functional Requirements

## 1. Persyaratan Fungsional (Functional Requirements)

### FR-01: Manajemen Konfigurasi & API Key
- Pengguna dapat memasukkan Google Gemini API Key secara aman.
- Pilihan penyimpanan kunci: Permanen (`localStorage`) atau Sementara (`sessionStorage`).
- Verifikasi koneksi API real-time melalui server endpoint `/api/gemini/verify`.
- Switcher Model Gemini (Default: `gemini-3.6-flash`, opsional: `gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`, `gemini-3.1-pro-preview`).
- Slider pengaturan Temperature (0.0 - 1.0) dengan presisi 0.1.

### FR-02: Alur Wawancara Bertahap & Multi-Role
- Riset otomatis Peran Utama & Jobdesk berdasarkan input awal pengguna.
- Eskalasi otomatis 1-2 Peran Sekunder (Domain Expert) yang relevan.
- Pengajuan pertanyaan bertahap (satu pertanyaan utama dalam satu waktu) dilengkapi `Reason Box` (Alasan) dan `Option Box` (Kartu Saran Pilihan Interaktif).
- Pilihan pada `Option Box` dapat diklik untuk mengisi/mengirim balasan secara otomatis.

### FR-03: Pembangkitan Prompt Final & Aksi
- Konfirmasi kelengkapan spesifikasi prompt sebelum generasi final.
- Banner aksi dinamis "BUAT PROMPT" muncul saat spesifikasi siap.
- Prompt Final disajikan dalam blok kode 4 backticks (` markdown ... `) utuh tanpa kompresi atau komentar placeholder.
- Tombol aksi cepat: "Salin Seluruh Prompt", "Unduh .txt", dan "Generate Ulang Prompt Final".

### FR-04: Manajemen Sesi & Lampiran
- Lampiran berkas teks/gambar (Gambar base64 / Teks berkas `.txt`, `.md`, `.json`, `.py`, `.js`, dll.) dengan batas maksimal 5MB.
- Fitur Export Percakapan ke `.json` (versi schema 3.0) dan Import Percakapan dari `.json`.
- Fitur Reset Sesi Percakapan dengan perintah "reset" atau tombol reset.
- Modal peninjauan System Instruction V3.0 yang dapat dibuka kapan saja.

## 2. Persyaratan Non-Fungsional (Non-Functional Requirements)

### NFR-01: Performa & Latensi
- Latensi HTTP API verifikasi ketersediaan < 1.5 detik.
- Pengoperasian antarmuka responsif tanpa lag pada scrolling percakapan panjang.

### NFR-02: Keamanan (OWASP Standard)
- Kunci API disembunyikan dan diproses di sisi backend Express server via `@google/genai` SDK.
- Sanitasi input untuk mencegah XSS (*Cross-Site Scripting*).
- Isolasi variabel lingkungan via `.env.example`.

### NFR-03: Ketersediaan & Aksesibilitas
- Tampilan responsif (Mobile, Tablet, Desktop) dengan skema warna Dark Mode Slate premium.
- WCAG AA Compliant untuk kontras teks terhadap latar belakang.
