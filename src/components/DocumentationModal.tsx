import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Key,
  Layers,
  FileText,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  ListOrdered,
  Lightbulb,
  ShieldCheck,
  RotateCcw,
  FileDown,
  FileUp,
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    'quickstart' | 'features' | 'apikey' | 'prompting'
  >('quickstart');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Dokumentasi & Cara Penggunaan
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                  V3.0
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Navigation - Responsive Segmented Grid */}
        <div className="px-3 sm:px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800/80">
            <button
              type="button"
              onClick={() => setActiveTab('quickstart')}
              className={`px-2.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
                activeTab === 'quickstart'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ListOrdered className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="truncate">Penggunaan Cepat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('features')}
              className={`px-2.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
                activeTab === 'features'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0 text-sky-400" />
              <span className="truncate">Fitur & Keunggulan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('apikey')}
              className={`px-2.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
                activeTab === 'apikey'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Key className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="truncate">Panduan API Key</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('prompting')}
              className={`px-2.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-center ${
                activeTab === 'prompting'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Lightbulb className="w-4 h-4 shrink-0 text-indigo-400" />
              <span className="truncate">Tips Prompting</span>
            </button>
          </div>
        </div>

        {/* Modal Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* TAB 1: CARA PENGGUNAAN CEPAT */}
          {activeTab === 'quickstart' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-sky-950/40 border border-sky-800/60 p-4 rounded-xl flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sky-200 text-sm mb-1">
                    Tentang Prompt Engineer Engine V3.0
                  </h3>
                  <p className="text-slate-300 text-xs">
                    Aplikasi ini adalah asisten pintar interaktif untuk merumuskan <strong>System Instruction / Prompt Final</strong> tingkat enterprise yang terstruktur, aman, dan siap dipakai untuk berbagai LLM (seperti Google Gemini, OpenAI GPT-4, Anthropic Claude, Llama, maupun DeepSeek).
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-100 text-sm flex items-center">
                  <ListOrdered className="w-4 h-4 text-emerald-400 mr-2" />
                  LangkahDemi Langkah Penggunaan:
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-300 border border-sky-500/40 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <h5 className="font-semibold text-slate-100 text-xs sm:text-sm">
                        Masukkan Google Gemini API Key
                      </h5>
                      <p className="text-slate-400 text-xs mt-1">
                        Buka panel sidebar (ikon gerigi di mobile atau samping kiri di desktop), lalu tempelkan API Key Google Gemini Anda dan klik tombol <strong>Verifikasi / Hubungkan API</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-300 border border-sky-500/40 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <h5 className="font-semibold text-slate-100 text-xs sm:text-sm">
                        Pilih Peran Spesialis / Role
                      </h5>
                      <p className="text-slate-400 text-xs mt-1">
                        Pilih salah satu kartu peran yang tersedia (seperti <em>Copywriter, Software Architect, Data Analyst, Educator</em>) atau langsung ketik instruksi khusus sesuai kebutuhan Anda.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-300 border border-sky-500/40 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <h5 className="font-semibold text-slate-100 text-xs sm:text-sm">
                        Jawab Pertanyaan Klasifikasi Interaktif
                      </h5>
                      <p className="text-slate-400 text-xs mt-1">
                        Sistem V3.0 akan menganalisis kebutuhan Anda dan menyajikan kotak opsi pilihan (seperti target audiens, gaya bahasa, format output, dan batasan). Klik tombol pilihan angka untuk memberikan tanggapan cepat.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl flex items-start space-x-3">
                    <span className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-300 border border-sky-500/40 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <div>
                      <h5 className="font-semibold text-slate-100 text-xs sm:text-sm">
                        Dapatkan Prompt Final Siap Pakai
                      </h5>
                      <p className="text-slate-400 text-xs mt-1">
                        Setelah informasi cukup, AI akan memproduksi <strong>Prompt Final V3.0</strong> secara utuh dalam blok khusus. Gunakan tombol <strong>Salin Seluruh Prompt</strong> atau <strong>Unduh .txt</strong> di bawah blok prompt.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FITUR & KEUNGGULAN */}
          {activeTab === 'features' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="font-bold text-slate-100 text-sm flex items-center">
                <Layers className="w-4 h-4 text-sky-400 mr-2" />
                Fitur Unggulan Engine V3.0:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-sky-300 font-semibold text-xs sm:text-sm">
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                    <span>Keamanan Prompt Injection</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Melindungi System Instruction internal agar tidak dapat dibocorkan atau diretas oleh pengguna jahat melalui prompt bujukan.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-emerald-300 font-semibold text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Prinsip Zero-Placeholder</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Seluruh prompt final ditulis 100% konkret, lengkap, dan tanpa potongan seperti <code>// TODO</code> atau <code>[...]</code>.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs sm:text-sm">
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>Reset & Perintah Memori</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Mendukung perintah cepat <code>reset</code> untuk membersihkan riwayat percakapan dan kembali ke awal kapan pun dibutuhkan.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-2 text-indigo-300 font-semibold text-xs sm:text-sm">
                    <FileDown className="w-4 h-4 text-indigo-400" />
                    <span>Export & Import (.json)</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Simpan dan muat kembali seluruh percakapan prompt engineering Anda dalam format file JSON secara aman dan cepat.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
                <h5 className="font-semibold text-slate-200 text-xs flex items-center">
                  <FileText className="w-4 h-4 text-amber-400 mr-2" />
                  Format Prompt Final (Quadruple Backticks):
                </h5>
                <p className="text-slate-400 text-xs">
                  Prompt Final dibungkus menggunakan 4 backticks (<code>````markdown ... ````</code>) agar blok kode bertingkat di dalam prompt tidak terpecah saat disalin.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PANDUAN API KEY */}
          {activeTab === 'apikey' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-xl flex items-start space-x-3">
                <Key className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-200 text-sm mb-1">
                    Cara Mendapatkan Google Gemini API Key Gratis
                  </h4>
                  <p className="text-slate-300 text-xs">
                    Google menyediakan akses API Key gratis untuk model Gemini melalui Google AI Studio.
                  </p>
                </div>
              </div>

              <ol className="space-y-2.5 list-decimal list-inside text-xs sm:text-sm text-slate-300">
                <li className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                  Buka situs resmi{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline font-semibold inline-flex items-center"
                  >
                    Google AI Studio Key Page <ExternalLink className="w-3 h-3 ml-1" />
                  </a>.
                </li>
                <li className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                  Login menggunakan akun Google / Gmail Anda.
                </li>
                <li className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                  Klik tombol <strong>"Create API key"</strong>, lalu pilih project Google Cloud Anda.
                </li>
                <li className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                  Salin string API Key yang diawali dengan <code>AIzaSy...</code>.
                </li>
                <li className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
                  Tempelkan kunci tersebut pada kolom <strong>Google Gemini API Key</strong> di panel sidebar aplikasi ini, lalu klik <strong>Verifikasi / Hubungkan API</strong>.
                </li>
              </ol>

              <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl text-xs space-y-1">
                <p className="font-semibold text-slate-200">Privasi & Keamanan Kunci:</p>
                <p className="text-slate-400">
                  API Key Anda hanya disimpan secara lokal di peramban (Local/Session Storage) dan digunakan langsung untuk memanggil API resmi Google Gemini. Kunci Anda tidak pernah disimpan di server mana pun.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: TIPS PROMPT CRAFTING */}
          {activeTab === 'prompting' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="font-bold text-slate-100 text-sm flex items-center">
                <Lightbulb className="w-4 h-4 text-amber-400 mr-2" />
                Prinsip Utama Pembuatan System Prompt Efektif:
              </h4>

              <div className="space-y-3">
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <h5 className="font-semibold text-sky-300 text-xs sm:text-sm">
                    1. Definisikan Peran (Persona) & Identitas Jelaskan
                  </h5>
                  <p className="text-slate-400 text-xs">
                    Mulai prompt dengan mendefinisikan siapa AI tersebut (misalnya: <em>"Anda adalah Senior Full-Stack Engineer berpengalaman 10 tahun..."</em>).
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <h5 className="font-semibold text-emerald-300 text-xs sm:text-sm">
                    2. Berikan Batasan Operasional (Constraints & Negative Constraints)
                  </h5>
                  <p className="text-slate-400 text-xs">
                    Sebutkan secara eksplisit apa yang <strong>Boleh</strong> dan <strong>DILARANG</strong> dilakukan oleh AI (misalnya: <em>"Dilarang menggunakan kode tidak lengkap atau komentar TODO"</em>).
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <h5 className="font-semibold text-amber-300 text-xs sm:text-sm">
                    3. Format Output yang Presisi
                  </h5>
                  <p className="text-slate-400 text-xs">
                    Tentukan struktur jawaban (misalnya JSON Schema, Markdown, Tabel) agar jawaban konsisten dan siap diproses sistem.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-1">
                  <h5 className="font-semibold text-indigo-300 text-xs sm:text-sm">
                    4. Sertakan Contoh Konkret (Few-Shot Prompting)
                  </h5>
                  <p className="text-slate-400 text-xs">
                    Memberikan contoh input dan output berkualitas meningkatkan akurasi respon AI hingga lebih dari 90%.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Prompt Engineer V3.0 Engine &bull; Senior Prompt Engineering Guide
          </span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
