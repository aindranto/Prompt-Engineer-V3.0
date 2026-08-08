# Business Rules & Constraints

## 1. Multi-Role System Logic
- **Aturan Riset Peran**: Pada pesan pertama pengguna, backend/system instruction wajib menyajikan ringkasan Peran Utama (Primary Role) beserta jobdesk di dunia nyata.
- **Aturan Eskalasi**: Pada eskalasi konteks berikutnya, sistem mengaktifkan 1-2 Peran Sekunder (Domain Expert) untuk mendampingi Peran Utama.

## 2. Interview & Option Box Rules
- **Aturan Pertanyaan Tunggal**: Hanya 1 pertanyaan utama diajukan pada setiap giliran.
- **Wajib Reason Box**: Setiap pertanyaan harus memiliki elemen penjelasan teknis mengapa informasi tersebut dibutuhkan (`[ALASAN]`).
- **Wajib Option Box**: Setiap opsi disajikan sebagai kalimat/pilihan utuh dalam kartu interaktif tanpa sub-bullet bercabang yang membingungkan.
- **Interaktivitas Kartu**: Pengguna dapat mengklik kartu saran untuk langsung mengirimkan jawaban tersebut.

## 3. Prompt Final Generation Rules
- **Gated Workflow**: Prompt Final baru dibangkitkan jika pengguna mengonfirmasi kelengkapan spesifikasi atau menekan tombol "BUAT PROMPT".
- **Single-Block Fencing**: Prompt Final wajib dibungkus dalam 4 backticks (` markdown ... `).
- **Mandatory Non-Truncation**: Dilarang keras menggunakan simbol kelanjutan seperti `...`, `// todo`, atau potongan teks terputus.

## 4. Keamanan & Penanganan Error
- **Indonesian Friendly Errors**: Kesalahan API (Quota limit, High Demand 503, Invalid Key) diterjemahkan secara otomatis ke dalam bahasa Indonesia yang ramah dan solutif.
- **No Client Key Exposure**: API key dikirim via HTTPS header/payload terenkripsi ke Express backend proxy.
