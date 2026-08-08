import React, { useState } from 'react';
import {
  Settings,
  X,
  Key,
  Eye,
  EyeOff,
  Cpu,
  Sliders,
  PlugZap,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (val: string) => void;
  storageType: 'local' | 'session';
  onStorageTypeChange: (type: 'local' | 'session') => void;
  model: string;
  onModelChange: (model: string) => void;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  onVerifyApi: () => Promise<boolean>;
  isVerifying: boolean;
  statusBox: {
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null;
  onOpenDoc?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  apiKey,
  onApiKeyChange,
  storageType,
  onStorageTypeChange,
  model,
  onModelChange,
  temperature,
  onTemperatureChange,
  onVerifyApi,
  isVerifying,
  statusBox,
  onOpenDoc,
}) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <>
      {/* Sidebar Overlay Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-full transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none`}
      >
        <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900 shrink-0">
          <h2 className="font-semibold text-xs text-slate-200 uppercase tracking-wider flex items-center">
            <Settings className="w-3.5 h-3.5 text-sky-400 mr-2" />
            Konfigurasi Sistem
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs">
          {/* Section 1: API Key Management */}
          <div className="space-y-2.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <label className="block font-medium text-slate-300 text-xs flex items-center justify-between">
              <span className="flex items-center">
                <Key className="w-3.5 h-3.5 text-amber-400 mr-1.5" /> Google Gemini API Key
              </span>
            </label>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-lg px-2.5 py-1.5 pr-8 text-xs text-slate-100 placeholder-slate-500 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Storage Strategy */}
            <div className="pt-0.5 space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">Penyimpanan Key:</span>
              <div className="flex items-center space-x-3 text-[11px]">
                <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="storage-type"
                    value="local"
                    checked={storageType === 'local'}
                    onChange={() => onStorageTypeChange('local')}
                    className="text-sky-500 focus:ring-sky-500 bg-slate-900 border-slate-700"
                  />
                  <span>
                    Permanen <span className="text-[9px] text-slate-500">(Local)</span>
                  </span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="storage-type"
                    value="session"
                    checked={storageType === 'session'}
                    onChange={() => onStorageTypeChange('session')}
                    className="text-sky-500 focus:ring-sky-500 bg-slate-900 border-slate-700"
                  />
                  <span>
                    Sementara <span className="text-[9px] text-slate-500">(Session)</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Model Configuration & API Verification */}
          <div className="space-y-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div>
              <label
                htmlFor="model-select"
                className="block font-medium text-slate-300 mb-1 flex items-center text-xs"
              >
                <Cpu className="w-3.5 h-3.5 text-sky-400 mr-1.5" /> Pilih Model Gemini
              </label>
              <select
                id="model-select"
                value={model}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none"
              >
                <option value="gemini-3.6-flash">gemini-3.6-flash (Default)</option>
                <option value="gemini-3.5-flash">gemini-3.5-flash</option>
                <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="temperature-slider"
                  className="font-medium text-slate-300 flex items-center text-xs"
                >
                  <Sliders className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Temperature
                </label>
                <span className="text-[11px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-sky-300 font-bold">
                  {temperature.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                id="temperature-slider"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                <span>Presisi (0.0)</span>
                <span>Kreatif (1.0)</span>
              </div>
            </div>

            {/* Verification Button */}
            <button
              onClick={onVerifyApi}
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-medium py-1.5 px-2.5 rounded-lg text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-sky-600/20 active:scale-95 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <PlugZap className="w-3.5 h-3.5" />
                  <span>Verifikasi / Hubungkan API</span>
                </>
              )}
            </button>

            {/* Status Display Box */}
            {statusBox && statusBox.show && (
              <div
                className={`text-xs p-2 rounded-lg border flex items-start space-x-2 ${
                  statusBox.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300'
                }`}
              >
                {statusBox.type === 'success' ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-bold text-[11px]">{statusBox.title}</p>
                  <p className="text-[10px] leading-tight opacity-90 mt-0.5 break-words">
                    {statusBox.message}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Bantuan & Dokumentasi */}
          {onOpenDoc && (
            <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block font-medium uppercase tracking-wider">
                Panduan Aplikasi
              </span>
              <button
                type="button"
                onClick={onOpenDoc}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-medium py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center space-x-2 border border-slate-700/80 cursor-pointer shadow-sm active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Dokumentasi & Cara Penggunaan</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-2.5 border-t border-slate-800 text-center text-[10px] text-slate-500 shrink-0 bg-slate-900">
          Senior Prompt Engineer Expert V3.0 Engine
        </div>
      </aside>
    </>
  );
};
