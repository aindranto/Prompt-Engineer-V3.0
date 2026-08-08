import React from 'react';
import { Wand2, Sliders, BookOpen } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  onToggleSidebar: () => void;
  onOpenDoc: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  onToggleSidebar,
  onOpenDoc,
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 shrink-0 z-30 px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
          <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h1 className="font-bold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-sky-400 via-emerald-300 to-indigo-300 bg-clip-text text-transparent flex items-center gap-1.5">
            <span>Prompt Engineer</span>
            <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
              V3.0
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Interactive Multi-Role Prompt Engineering Assistant
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Documentation Button */}
        <button
          type="button"
          onClick={onOpenDoc}
          className="bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 hover:text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-medium border border-sky-500/30 transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
          title="Dokumentasi & Cara Penggunaan"
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="hidden xs:inline">Dokumentasi</span>
        </button>

        <div className="flex items-center space-x-1.5 text-[11px] sm:text-xs px-2.5 py-1 sm:py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected
                ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                : 'bg-rose-500'
            }`}
          />
          <span
            className={`font-medium hidden sm:inline ${
              isConnected ? 'text-emerald-300' : 'text-rose-300'
            }`}
          >
            {isConnected ? 'Terhubung' : 'Terputus'}
          </span>
        </div>

        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
          title="Buka Konfigurasi"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

