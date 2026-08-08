# Product Requirements Document (PRD)

## 1. Visi Produk
**Senior Prompt Engineer Expert V3.0** adalah platform web asisten interaktif multi-peran bertahap berbasis kecerdasan buatan (Gemini 3 Series) yang dirancang untuk membantu pengembang, prompt engineer, dan praktisi AI merancang *system instruction* dan *prompt* kelas industri yang spesifik, kokoh, dan siap pakai.

## 2. Tujuan Bisnis & Nilai Tambah
- **Akurasi Output AI**: Mengeliminasi prompt ambigu dan tidak terstruktur yang sering menghasilkan *AI hallucinations* atau output terpotong.
- **Workflow Bertahap (Gated Workflow)**: Memastikan pengumpulan persyaratan melintasi pilar (Peran, Konteks, Batasan, Gaya Bahasa, Format) sebelum prompt final dibangkitkan.
- **Eskalasi Multi-Peran**: Menggabungkan Peran Utama (Primary Role) dengan Peran Sekunder (Domain Expert) untuk cakupan konteks yang kaya dan relevan.
- **Efisiensi Kerja**: Pengguna dapat menguji, mengubah temperatur, menyalin, mengunduh file `.txt` prompt final, serta melakukan *export/import* sesi percakapan dengan mudah.

## 3. Masalah Utama yang Diselesaikan
1. **Prompt Terpotong / Inkomplit**: AI sering memotong baris kode atau menyembunyikan logika dengan komentar `// TODO`. Aplikasi ini menerapkan aturan *Mandatory Single-Block Non-Truncation*.
2. **Keterbatasan Format Jawaban**: Pengguna awam kesulitan menyusun batasan dan format yang konsisten. Aplikasi ini menyediakan opsi kartu interaktif yang dapat diklik (*Clickable Option Cards*).
3. **Kehilangan Sesi Percakapan**: Riwayat percakapan kini dapat diekspor dan diimpor kembali dalam format `.json` berstandar V3.0.

## 4. Target Pengguna
- AI Engineers & Prompt Engineers
- Full-Stack Software Developers
- Technical Product Managers & Enterprise Architects
- Content Creators & AI Enthusiasts
