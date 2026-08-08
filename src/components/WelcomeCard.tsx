import React from 'react';
import {
  UserCog,
  Search,
  MessageSquareCode,
  FileCode,
  Lightbulb,
  BookOpen,
} from 'lucide-react';

interface WelcomeCardProps {
  onOpenDoc?: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ onOpenDoc }) => {
  return (
    <div className="max-w-xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl text-center space-y-3 sm:space-y-4 my-auto">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-emerald-500/20 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400">
        <UserCog className="w-6 h-6 sm:w-8 sm:h-8" />
      </div>

      <div>
        <h2 className="text-base sm:text-xl font-bold text-slate-100">
          Selamat Datang di Senior Prompt Engineer V3.0
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Sistem asisten interaktif bertahap untuk membantu Anda merancang prompt kelas industri yang kokoh dan terstruktur.
        </p>
      </div>

      {/* Alur Kerja Informasi (Tahapan Otomatis - Non Clickable) */}
      <div className="space-y-1.5 pt-1 text-left">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block text-center">
          Alur Kerja Otomatis (3 Tahap)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 flex items-start space-x-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-sky-500/30">
              1
            </span>
            <div>
              <span className="font-semibold text-slate-200 block text-[11px]">
                Riset Peran
              </span>
              <p className="text-[10px] text-slate-400 leading-tight">
                Identifikasi peran & tugas utama
              </p>
            </div>
          </div>

          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 flex items-start space-x-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
              2
            </span>
            <div>
              <span className="font-semibold text-slate-200 block text-[11px]">
                Wawancara
              </span>
              <p className="text-[10px] text-slate-400 leading-tight">
                Tanya jawab dengan opsi
              </p>
            </div>
          </div>

          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 flex items-start space-x-2">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/30">
              3
            </span>
            <div>
              <span className="font-semibold text-slate-200 block text-[11px]">
                Prompt Final
              </span>
              <p className="text-[10px] text-slate-400 leading-tight">
                Hasil prompt terstruktur
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shortcut Dokumentasi & Cara Penggunaan */}
      {onOpenDoc && (
        <div className="pt-0.5">
          <button
            type="button"
            onClick={onOpenDoc}
            className="w-full bg-slate-950/90 hover:bg-slate-800 text-sky-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold border border-sky-500/30 hover:border-sky-400/50 transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Dokumentasi & Cara Penggunaan</span>
          </button>
        </div>
      )}

      <div className="text-[11px] text-slate-400 bg-sky-950/30 border border-sky-800/40 rounded-lg p-2.5 flex items-center justify-center space-x-1.5">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Masukkan API Key di panel konfigurasi, lalu ketikkan tujuan prompt Anda di bawah!</span>
      </div>
    </div>
  );
};

