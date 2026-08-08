# Implementation Roadmap

## FASE 1: System Architecture & Technical Documentation (SELESAI)
- [x] Analisis kebutuhan produk & ekstraksi artefak HTML "Senior Prompt Engineer Expert V3.0".
- [x] Pembuatan 9 Dokumen Teknis Standar Enterprise (`PRD.md` hingga `ROADMAP.md`).
- [x] Persetujuan arsitektur & teknologi stack dari pengguna.

## FASE 2: Backend & Database Engineering (Selanjutnya)
- [ ] Pengaturan Express Server (`server.ts`) dengan integrasi `@google/genai` SDK.
- [ ] Endpoint `/api/gemini/verify` untuk verifikasi ketersediaan API key & model.
- [ ] Endpoint `/api/gemini/chat` untuk pengiriman riwayat percakapan & System Instruction.
- [ ] Penanganan error terjemahan otomatis ke Bahasa Indonesia (Quota, High demand, Invalid key).

## FASE 3: Frontend UI, Integration & Automated Testing (Fase Akhir)
- [ ] Modularisasi komponen React (`Header`, `Sidebar`, `ChatContainer`, `OptionBox`, `ReasonBox`, `CodeBlock`, `SystemModal`, `ToastNotification`).
- [ ] Implementasi interaktivitas klik kartu opsi, unggah lampiran gambar/teks, export/import JSON, dan salin/unduh prompt.
- [ ] Pengujian otomatis & pengujian linting/kompilasi build.
- [ ] Panduan deployment dan petunjuk penggunaan.
