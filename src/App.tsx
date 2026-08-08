import React, { useState, useEffect, useRef } from 'react';
import {
  Header,
} from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { WelcomeCard } from './components/WelcomeCard.js';
import { ChatMessageItem } from './components/ChatMessageItem.js';
import { Toast } from './components/Toast.js';
import { DocumentationModal } from './components/DocumentationModal.js';
import {
  ChatMessage,
  AttachedFile,
  ExportedSession,
  HARDCODED_SYSTEM_INSTRUCTION,
} from './types.js';
import {
  Paperclip,
  Send,
  Loader2,
  Sparkles,
  Rocket,
  RotateCcw,
  X,
  FileCode,
  FileDown,
  FileUp,
  ChevronDown,
} from 'lucide-react';

export default function App() {
  // Application State
  const [apiKey, setApiKey] = useState<string>('');
  const [storageType, setStorageType] = useState<'local' | 'session'>('local');
  const [model, setModel] = useState<string>('gemini-3.6-flash');
  const [temperature, setTemperature] = useState<number>(0.1);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [statusBox, setStatusBox] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInputText, setUserInputText] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showBuildPromptBar, setShowBuildPromptBar] = useState<boolean>(false);
  const [detectedRole, setDetectedRole] = useState<string>('Engineer');
  const [docModalOpen, setDocModalOpen] = useState<boolean>(false);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: '', type: 'info' });

  const [sessionDropdownOpen, setSessionDropdownOpen] = useState<boolean>(false);
  const sessionDropdownRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as text is typed with strict min-height matching buttons
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const isSm = typeof window !== 'undefined' && window.innerWidth >= 640;
      const minH = isSm ? 48 : 44;
      const scrollHeight = textareaRef.current.scrollHeight;
      const targetHeight = Math.max(minH, Math.min(scrollHeight, 180));
      textareaRef.current.style.height = `${targetHeight}px`;
    }
  }, [userInputText]);

  // Click outside to close session dropdown menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sessionDropdownRef.current &&
        !sessionDropdownRef.current.contains(e.target as Node)
      ) {
        setSessionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize API Key from storage on load
  useEffect(() => {
    const localKey = localStorage.getItem('gemini_api_key_v3');
    const sessionKey = sessionStorage.getItem('gemini_api_key_v3');

    if (localKey) {
      setApiKey(localKey);
      setStorageType('local');
      verifyApiKeyOnLoad(localKey, model);
    } else if (sessionKey) {
      setApiKey(sessionKey);
      setStorageType('session');
      verifyApiKeyOnLoad(sessionKey, model);
    }
  }, []);

  // Auto-scroll chat container when history or state updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isGenerating]);

  const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3200);
  };

  const saveKeyToStorage = (keyVal: string, type: 'local' | 'session') => {
    if (type === 'local') {
      localStorage.setItem('gemini_api_key_v3', keyVal);
      sessionStorage.removeItem('gemini_api_key_v3');
    } else {
      sessionStorage.setItem('gemini_api_key_v3', keyVal);
      localStorage.removeItem('gemini_api_key_v3');
    }
  };

  const verifyApiKeyOnLoad = async (keyVal: string, modelName: string) => {
    try {
      const res = await fetch('/api/gemini/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: keyVal, model: modelName }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'ok') {
        setIsConnected(true);
        setStatusBox({
          show: true,
          type: 'success',
          title: 'Berhasil Terhubung',
          message: `API Key valid dan terhubung dengan model ${modelName}.`,
        });
      } else {
        setIsConnected(false);
        setStatusBox({
          show: true,
          type: 'error',
          title: 'Gagal Terhubung',
          message: data.message || 'API Key tidak valid.',
        });
      }
    } catch {
      setIsConnected(false);
    }
  };

  const handleVerifyApi = async (): Promise<boolean> => {
    if (!apiKey.trim()) {
      setStatusBox({
        show: true,
        type: 'error',
        title: 'API Key Kosong',
        message: 'Harap masukkan Google Gemini API Key.',
      });
      setIsConnected(false);
      return false;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/gemini/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim(), model }),
      });
      const data = await res.json();

      if (res.ok && data.status === 'ok') {
        saveKeyToStorage(apiKey.trim(), storageType);
        setIsConnected(true);
        setStatusBox({
          show: true,
          type: 'success',
          title: 'Berhasil Terhubung',
          message: `API Key valid dan siap digunakan dengan model ${model}.`,
        });
        triggerToast('API Key Berhasil Terhubung!', 'success');
        setIsVerifying(false);
        return true;
      } else {
        setIsConnected(false);
        setStatusBox({
          show: true,
          type: 'error',
          title: 'Gagal Terhubung',
          message: data.message || 'API Key tidak valid.',
        });
        triggerToast('API Key Tidak Valid', 'error');
        setIsVerifying(false);
        return false;
      }
    } catch (err: any) {
      setIsConnected(false);
      setStatusBox({
        show: true,
        type: 'error',
        title: 'Kesalahan Koneksi',
        message: err?.message || 'Gagal terhubung ke server backend.',
      });
      triggerToast('Koneksi Gagal', 'error');
      setIsVerifying(false);
      return false;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB per file limit

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        triggerToast(
          `Ukuran berkas "${file.name}" (${sizeMb} MB) melebihi batas 3 MB per file! Harap gunakan berkas yang lebih kecil agar tidak terjadi kesalahan server.`,
          'error'
        );
        return;
      }

      const isImage = file.type.startsWith('image/');
      const reader = new FileReader();

      if (isImage) {
        reader.onload = (event) => {
          const result = event.target?.result as string;
          const base64Data = result.split(',')[1];
          setAttachedFiles((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random().toString(36).substring(2, 7),
              name: file.name,
              type: file.type,
              isImage: true,
              dataUrl: result,
              base64: base64Data,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = (event) => {
          const textContent = event.target?.result as string;
          setAttachedFiles((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random().toString(36).substring(2, 7),
              name: file.name,
              type: file.type || 'text/plain',
              isImage: false,
              textContent: textContent,
            },
          ]);
        };
        reader.readAsText(file);
      }
    });

    e.target.value = '';
  };

  const removeAttachedFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const extractRole = (text: string) => {
    const patterns = [
      /Peran Utama\s*:\s*([A-Za-z0-9\s_\-]+)/i,
      /Primary Role\s*:\s*([A-Za-z0-9\s_\-]+)/i,
      /Peran\s*:\s*([A-Za-z0-9\s_\-]+)/i,
      /Asisten\s+([A-Za-z0-9\s_\-]+)/i,
    ];
    for (const pat of patterns) {
      const match = text.match(pat);
      if (match && match[1]) {
        let extracted = match[1].trim().split('\n')[0].replace(/[^a-zA-Z0-9_\- ]/g, '');
        if (extracted.length > 2 && extracted.length < 40) {
          setDetectedRole(extracted.replace(/\s+/g, '_'));
          break;
        }
      }
    }
  };

  const checkShowBuildButton = (text: string) => {
    const lower = text.toLowerCase();
    const triggers = [
      'ringkasan spesifikasi prompt',
      'apakah semua informasi sudah cukup',
      'pembuatan prompt final',
      'sudah cukup untuk pembuatan prompt',
    ];
    const matches = triggers.some((t) => lower.includes(t));
    setShowBuildPromptBar(matches);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : userInputText.trim();
    if ((!textToSend && attachedFiles.length === 0) || isGenerating) return;

    if (!apiKey.trim()) {
      triggerToast('Harap masukkan & verifikasi API Key terlebih dahulu!', 'error');
      setIsSidebarOpen(true);
      return;
    }

    setShowBuildPromptBar(false);

    // Meta commands
    const lowerText = textToSend.toLowerCase();
    if (
      lowerText === 'reset' ||
      lowerText === 'mulai baru' ||
      lowerText.includes('reset & kembali ke awal') ||
      textToSend.startsWith('1. Reset')
    ) {
      setUserInputText('');
      setAttachedFiles([]);
      handleResetChat();
      return;
    }

    if (
      lowerText.includes('system instruction') ||
      lowerText.includes('system prompt') ||
      lowerText.includes('spill system') ||
      lowerText.includes('instruksi rahasia')
    ) {
      setUserInputText('');
      setAttachedFiles([]);
      const userMsg: ChatMessage = { role: 'user', parts: [{ text: textToSend }] };
      const refusalMsg: ChatMessage = {
        role: 'model',
        parts: [
          {
            text: 'Mohon maaf, System Instruction V3.0 bersifat internal dan dilindungi sehingga tidak dapat ditampilkan demi alasan privasi dan kerahasiaan sistem.',
          },
        ],
      };
      setChatHistory((prev) => [...prev, userMsg, refusalMsg]);
      return;
    }

    // Build message parts
    const parts: any[] = [];
    attachedFiles.forEach((fileObj) => {
      if (fileObj.isImage && fileObj.base64) {
        parts.push({
          inlineData: {
            mimeType: fileObj.type,
            data: fileObj.base64,
          },
        });
      } else if (fileObj.textContent) {
        parts.push({
          text: `[Berkas Terlampir: ${fileObj.name}]\n${fileObj.textContent}`,
        });
      }
    });

    if (textToSend) {
      parts.push({ text: textToSend });
    }

    const newUserMsg: ChatMessage = { role: 'user', parts };
    const updatedHistory = [...chatHistory, newUserMsg];

    // Pre-check request payload size to prevent Vercel 413 Payload Too Large
    const requestPayload = {
      apiKey: apiKey.trim(),
      model: model,
      temperature: temperature,
      contents: updatedHistory,
      systemInstruction: HARDCODED_SYSTEM_INSTRUCTION,
    };
    const bodyString = JSON.stringify(requestPayload);
    const bodySizeBytes = new Blob([bodyString]).size;
    const bodySizeMb = bodySizeBytes / (1024 * 1024);

    if (bodySizeBytes > 4.2 * 1024 * 1024) {
      triggerToast(
        `Ukuran total pesan & lampiran (${bodySizeMb.toFixed(2)} MB) melebihi batas server (4.2 MB). Silakan kurangi ukuran/jumlah berkas atau reset riwayat percakapan.`,
        'error'
      );
      return;
    }

    setChatHistory(updatedHistory);
    setUserInputText('');
    setAttachedFiles([]);
    setIsGenerating(true);

    extractRole(textToSend);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyString,
      });

      if (res.status === 413) {
        const errMsg = 'Ukuran berkas/pesan terlalu besar (Payload Too Large - 413). Silakan unggah gambar lebih kecil (maksimal 3MB) atau reset riwayat percakapan.';
        triggerToast(errMsg, 'error');
        const errAiMsg: ChatMessage = {
          role: 'model',
          parts: [{ text: `⚠️ **[ERROR 413 - Payload Too Large]**\n\n${errMsg}` }],
        };
        setChatHistory((prev) => [...prev, errAiMsg]);
        return;
      }

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        data = { message: `Gagal memproses respon server (${res.status} ${res.statusText}).` };
      }

      if (res.ok && data.status === 'ok' && data.text) {
        const aiResponseText = data.text;
        const newAiMsg: ChatMessage = {
          role: 'model',
          parts: [{ text: aiResponseText }],
        };

        setChatHistory((prev) => [...prev, newAiMsg]);
        extractRole(aiResponseText);
        checkShowBuildButton(aiResponseText);
        setIsConnected(true);
      } else {
        const errMsg = data.message || 'Gagal memperoleh respon dari Gemini API.';
        triggerToast(errMsg, 'error');
      }
    } catch (err: any) {
      triggerToast(`Kesalahan Koneksi: ${err.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetChat = () => {
    setChatHistory([]);
    setAttachedFiles([]);
    setShowBuildPromptBar(false);
    setDetectedRole('Engineer');
    triggerToast('Sesi chat telah di-reset.', 'info');
  };

  const handleExportChat = () => {
    if (chatHistory.length === 0) {
      triggerToast('Belum ada riwayat percakapan untuk diekspor.', 'error');
      return;
    }

    const exportPayload: ExportedSession = {
      version: '3.0',
      exportedAt: new Date().toISOString(),
      detectedRole: detectedRole,
      chatHistory: chatHistory,
    };

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `PromptEngineer_Session_${dateStr}.json`;

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    triggerToast('Sesi percakapan berhasil diekspor (.json)!', 'success');
  };

  const handleImportChat = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (importedData && Array.isArray(importedData.chatHistory)) {
          setChatHistory(importedData.chatHistory);
          if (importedData.detectedRole) {
            setDetectedRole(importedData.detectedRole);
          }
          triggerToast('Sesi percakapan berhasil diimpor!', 'success');
        } else {
          triggerToast('Format file JSON tidak valid.', 'error');
        }
      } catch (err: any) {
        triggerToast('Gagal membaca file impor: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      triggerToast('Kode berhasil disalin ke clipboard!', 'success');
    } catch {
      triggerToast('Gagal menyalin kode.', 'error');
    }
    document.body.removeChild(textarea);
  };

  const downloadPromptFile = (codeContent: string) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Prompt_${detectedRole || 'Prompt_Engineer'}_${dateStr}.txt`;

    const blob = new Blob([codeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    triggerToast(`Berkas ${filename} diunduh!`, 'success');
  };

  return (
    <div className="bg-slate-950 text-slate-100 h-screen w-screen overflow-hidden flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        isConnected={isConnected}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenDoc={() => setDocModalOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Configuration Drawer */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          storageType={storageType}
          onStorageTypeChange={setStorageType}
          model={model}
          onModelChange={setModel}
          temperature={temperature}
          onTemperatureChange={setTemperature}
          onVerifyApi={handleVerifyApi}
          isVerifying={isVerifying}
          statusBox={statusBox}
          onOpenDoc={() => setDocModalOpen(true)}
        />

        {/* Main Workspace Chat Window */}
        <main className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 sm:space-y-6"
          >
            {chatHistory.length === 0 ? (
              <WelcomeCard onOpenDoc={() => setDocModalOpen(true)} />
            ) : (
              chatHistory.map((msg, index) => (
                <ChatMessageItem
                  key={index}
                  message={msg}
                  onSelectOption={(optionText) => handleSendMessage(optionText)}
                  onRegeneratePrompt={() =>
                    handleSendMessage(
                      'Tolong generate ulang Prompt Final ini dengan variasi yang lebih komprehensif, lebih detail, dan lebih terstruktur.'
                    )
                  }
                  onCopyText={copyToClipboard}
                  onDownloadPrompt={downloadPromptFile}
                  onOpenSidebarForKey={() => setIsSidebarOpen(true)}
                  onRetryLastRequest={() => handleSendMessage()}
                  isGenerating={isGenerating}
                />
              ))
            )}
          </div>

          {/* Typing Indicator */}
          {isGenerating && (
            <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800 flex items-center space-x-3 text-xs text-sky-400 shrink-0">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 rounded-full bg-sky-400 animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-sky-400 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-sky-400 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              <span>AI Senior Prompt Engineer sedang berpikir...</span>
            </div>
          )}

          {/* Bottom Chat Input Form Bar */}
          <div className="shrink-0 sticky bottom-0 z-20 p-2.5 sm:p-3.5 bg-slate-900/95 backdrop-blur border-t border-slate-800 shadow-2xl">
            {/* File Preview Chips */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-2 max-h-24 overflow-y-auto">
                {attachedFiles.map((fileObj) => (
                  <div
                    key={fileObj.id}
                    className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs"
                  >
                    {fileObj.isImage ? (
                      <img
                        src={fileObj.dataUrl}
                        alt={fileObj.name}
                        className="w-4 h-4 object-cover rounded"
                      />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-sky-400" />
                    )}
                    <span className="max-w-[120px] truncate font-medium text-[11px]">
                      {fileObj.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachedFile(fileObj.id)}
                      className="text-slate-400 hover:text-rose-400 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md font-mono flex items-center space-x-1">
                  <span>Total Lampiran:</span>
                  <span className="font-semibold text-sky-400">
                    {(
                      attachedFiles.reduce(
                        (acc, f) =>
                          acc +
                          (f.base64
                            ? Math.ceil(f.base64.length * 0.75)
                            : f.textContent
                            ? f.textContent.length
                            : 0),
                        0
                      ) /
                      (1024 * 1024)
                    ).toFixed(2)}{' '}
                    MB
                  </span>
                  <span className="text-slate-500">(Maks 3 MB/file)</span>
                </div>
              </div>
            )}

            {/* Dynamic Action Banner "BUAT PROMPT" */}
            {showBuildPromptBar && (
              <div className="mb-2.5 p-2 bg-gradient-to-r from-emerald-950/80 via-sky-950/80 to-slate-900 border border-emerald-500/40 rounded-xl shadow-lg flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-2 text-xs text-emerald-300 px-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-medium">
                    Spesifikasi prompt telah lengkap! Siap untuk dibuat?
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleSendMessage(
                      'Semua informasi sudah cukup. Buat Prompt Final sekarang secara utuh dan lengkap!'
                    )
                  }
                  className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-md transition-all flex items-center space-x-1.5 active:scale-95"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>BUAT PROMPT</span>
                </button>
              </div>
            )}

            {/* Action Bar with Manajemen Sesi Dropdown Button */}
            <div className="flex items-center justify-between mb-2 px-0.5">
              <div className="relative" ref={sessionDropdownRef}>
                <button
                  type="button"
                  onClick={() => setSessionDropdownOpen((prev) => !prev)}
                  className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-800 hover:border-slate-700 transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer active:scale-95"
                  title="Opsi Sesi Chat"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Manajemen Sesi</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      sessionDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {sessionDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-56 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl z-30 p-1.5 space-y-1 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSessionDropdownOpen(false);
                        handleResetChat();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-300 transition-colors text-left cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Reset Sesi Chat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSessionDropdownOpen(false);
                        handleExportChat();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-emerald-300 transition-colors text-left cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Export Chat (.json)</span>
                    </button>

                    <label className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-sky-300 transition-colors text-left cursor-pointer">
                      <FileUp className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Import Chat (.json)</span>
                      <input
                        type="file"
                        accept=".json,.txt"
                        onChange={(e) => {
                          setSessionDropdownOpen(false);
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImportChat(file);
                            e.target.value = '';
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end space-x-1.5 sm:space-x-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.txt,.md,.json,.js,.py,.html,.css,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-[44px] sm:h-[48px] px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all flex items-center justify-center shrink-0 active:scale-95 cursor-pointer box-border"
                title="Unggah Berkas/Gambar (Maksimal 3MB per file)"
              >
                <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={userInputText}
                  onChange={(e) => setUserInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Ketik instruksi Anda..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 resize-none outline-none max-h-[180px] min-h-[44px] sm:min-h-[48px] leading-relaxed overflow-y-auto block box-border"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || (!userInputText.trim() && attachedFiles.length === 0)}
                className="h-[44px] sm:h-[48px] px-4 sm:px-5 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-medium rounded-xl border border-transparent transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center space-x-1.5 sm:space-x-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 box-border"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span className="text-xs sm:text-sm font-semibold">Kirim</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* Documentation Modal */}
      <DocumentationModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
      />

      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
}
