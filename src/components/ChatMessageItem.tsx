import React, { useEffect, useRef } from 'react';
import {
  Copy,
  Download,
  RotateCw,
  Sparkles,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';
import { marked } from 'marked';
import { ChatMessage } from '../types.js';

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
});

interface ChatMessageItemProps {
  message: ChatMessage;
  onSelectOption: (text: string) => void;
  onRegeneratePrompt: () => void;
  onCopyText: (text: string) => void;
  onDownloadPrompt: (text: string) => void;
  onOpenSidebarForKey: () => void;
  onRetryLastRequest: () => void;
  isGenerating: boolean;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const extractOptions = (innerText: string): { num: string; text: string }[] => {
  const items: { num: string; text: string }[] = [];

  // 1. Check if innerText contains <li> elements
  if (/<li[^>]*>/i.test(innerText)) {
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let liMatch: RegExpExecArray | null;
    let count = 1;
    while ((liMatch = liRegex.exec(innerText)) !== null) {
      const content = liMatch[1].trim();
      const numMatch = content.match(/^([1-9]\d*[\.\)]|Opsi\s+\d+[:\.]?)\s*(.*)/i);
      if (numMatch) {
        items.push({ num: numMatch[1], text: numMatch[2].trim() });
      } else {
        items.push({ num: `${count}.`, text: content });
      }
      count++;
    }
    if (items.length > 0) return items;
  }

  // Clean out block tags first, preserving inline formatting tags (em, strong, etc.)
  const cleanText = innerText
    .replace(/^:?\s*/, '')
    .replace(/<\/?(?:p|div|ul|ol)[^>]*>/gi, ' ')
    .trim();

  // 2. Strictly match numbered items like "1. ", "2. ", "3. " or "1) ", "2) "
  const numberedItemRegex = /(\b[1-9]\d*[\.\)])\s*([\s\S]+?)(?=(?:\b[1-9]\d*[\.\)]|$))/gi;
  let numMatch: RegExpExecArray | null;

  while ((numMatch = numberedItemRegex.exec(cleanText)) !== null) {
    const num = numMatch[1].trim();
    let text = numMatch[2].trim();
    text = text.replace(/<br\s*\/?>/gi, ' ').trim();

    if (text) {
      items.push({ num, text });
    }
  }

  // 3. Fallback: If no "1. 2. 3." pattern was found, try line-by-line split
  if (items.length === 0) {
    const lines = cleanText
      .split(/\n|<br\s*\/?>/i)
      .map((l) => l.replace(/<[^>]+>/g, '').trim())
      .filter((l) => l.length > 2);

    lines.forEach((line, idx) => {
      const matchNum = line.match(/^([1-9]\d*[\.\)]|Opsi\s+\d+[:\.]?)\s*(.*)/i);
      if (matchNum) {
        items.push({ num: matchNum[1], text: matchNum[2] });
      } else {
        items.push({ num: `${idx + 1}.`, text: line });
      }
    });
  }

  return items;
};

const parseAndTransformOptionAndReasonBoxes = (html: string): string => {
  if (!html) return '';

  let result = html;

  // 1. Transform Reason Box ([ALASAN])
  result = result.replace(
    /(?:<p>)?(?:<div class="reason-box">)?\s*(?:<strong>|<b>)?\s*(?:<i[^>]*><\/i>)?\s*\[ALASAN\]:?\s*(?:<\/strong>|<\/b>)?([\s\S]*?)(?:<\/div>|(?=<\/p>|<p>|<div|$))/gi,
    (_match, content) => {
      const cleanContent = content
        .replace(/^<\/strong>|^<\/b>/i, '')
        .replace(/<\/div>$/, '')
        .trim();

      return `
        <div class="reason-box my-3 p-3.5 bg-sky-950/30 border-l-4 border-sky-500 rounded-xl text-sky-100 shadow-sm leading-relaxed text-xs sm:text-sm">
          <div class="font-bold text-sky-400 mb-1 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info shrink-0 text-sky-400"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>[ALASAN]</span>
          </div>
          <div class="text-slate-200">${cleanContent}</div>
        </div>
      `;
    }
  );

  // 2. Transform Option Boxes (<div class="option-box"> or [SARAN PILIHAN] / [OPSI PILIHAN])
  const optionBlockRegex = /(?:<div class="option-box">|<p>)\s*(?:<strong>|<b>)?\s*(?:<i[^>]*><\/i>)?\s*\[(?:SARAN PILIHAN|OPSI PILIHAN|REKOMENDASI PILIHAN|PILIKAN)\]:?\s*(?:<\/strong>|<\/b>)?([\s\S]*?)(?:<\/div>|<\/p>|(?=<h[1-6]|<div class="reason-box"|$))/gi;

  result = result.replace(optionBlockRegex, (match, innerText) => {
    if (!innerText || !innerText.trim()) return match;

    // If already converted with option-click-hint
    if (innerText.includes('option-click-hint')) {
      return `<div class="option-box my-3.5 p-3.5 sm:p-4 bg-emerald-950/20 border-l-4 border-emerald-500 rounded-2xl shadow-md">${innerText}</div>`;
    }

    const items = extractOptions(innerText);

    if (items.length === 0) {
      return match;
    }

    const itemsHtml = items
      .map(
        (item) => `
      <li class="option-item flex items-start justify-between gap-3 p-3 my-1.5 rounded-xl bg-slate-900/90 hover:bg-emerald-950/50 border border-emerald-500/30 hover:border-emerald-400/70 text-slate-100 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm active:scale-[0.99] group">
        <div class="option-content min-w-0 flex-1 leading-relaxed text-xs sm:text-sm">
          <strong class="text-emerald-400 font-bold mr-1.5">${item.num}</strong>
          <span class="text-slate-200">${item.text}</span>
        </div>
        <span class="option-click-hint bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500/30 group-hover:text-emerald-200 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap shrink-0 flex items-center gap-1 border border-emerald-500/30 transition-colors">
          <span>Klik Pilih</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
        </span>
      </li>
    `
      )
      .join('');

    return `
      <div class="option-box my-3.5 p-3.5 sm:p-4 bg-emerald-950/20 border-l-4 border-emerald-500 rounded-2xl shadow-md">
        <div class="option-box-header mb-2.5 font-bold text-emerald-400 text-xs sm:text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-checks shrink-0 text-emerald-400"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
          <span>[SARAN PILIHAN] — Klik salah satu opsi di bawah untuk memilih:</span>
        </div>
        <ul class="option-list space-y-2 p-0 m-0 list-none">
          ${itemsHtml}
        </ul>
      </div>
    `;
  });

  return result;
};

const formatAiMessageHtml = (text: string) => {
  if (!text) return '';

  const codeBlocks: { lang: string; code: string; isPrompt: boolean }[] = [];

  // 1. Extract 4-backtick blocks first (Prompt Final / Markdown Prompt)
  let processed = text.replace(
    /````([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)\r?\n````/g,
    (_match, lang, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push({
        lang: lang || 'markdown',
        code: code.trim(),
        isPrompt: true,
      });
      return `\n\nPHCODEBLOCKTOKENX${idx}XPHCODEBLOCKTOKEN\n\n`;
    }
  );

  // 2. Extract remaining 3-backtick blocks
  processed = processed.replace(
    /```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)\r?\n```/g,
    (_match, lang, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push({
        lang: lang || 'code',
        code: code.trim(),
        isPrompt: false,
      });
      return `\n\nPHCODEBLOCKTOKENX${idx}XPHCODEBLOCKTOKEN\n\n`;
    }
  );

  // 3. Parse with marked
  let html = marked.parse(processed) as string;

  // 4. Transform Option & Reason Boxes
  html = parseAndTransformOptionAndReasonBoxes(html);

  // 5. Replace placeholders with clean, unnested code block wrappers
  codeBlocks.forEach((item, idx) => {
    const placeholderRegex = new RegExp(`(?:<p>)?PHCODEBLOCKTOKENX${idx}XPHCODEBLOCKTOKEN(?:<\/p>)?`, 'g');
    const headerTitle = item.isPrompt ? 'MARKDOWN PROMPT' : (item.lang || 'CODE').toUpperCase();
    const encodedCode = encodeURIComponent(item.code);

    const blockHtml = `
      <div class="code-block-wrapper my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
        <div class="code-header bg-slate-900/90 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
          <span class="flex items-center space-x-1.5 font-semibold text-sky-400">
            <span class="w-2 h-2 rounded-full bg-sky-400 inline-block mr-1"></span>
            ${headerTitle}
          </span>
          <button 
            type="button" 
            class="copy-code-btn bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md text-[11px] font-sans font-medium transition-colors flex items-center space-x-1 border border-slate-700 active:scale-95 cursor-pointer" 
            data-code="${encodedCode}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span>Salin Kode</span>
          </button>
        </div>
        <pre class="p-3.5 m-0 whitespace-pre-wrap break-words overflow-visible bg-[#080d1a] text-slate-100 font-mono text-xs leading-relaxed"><code>${escapeHtml(item.code)}</code></pre>
      </div>
    `;

    html = html.replace(placeholderRegex, blockHtml);
  });

  return html;
};

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onSelectOption,
  onRegeneratePrompt,
  onCopyText,
  onDownloadPrompt,
  isGenerating,
}) => {
  const isUser = message.role === 'user';
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse raw text & attachments
  let rawText = '';
  const attachedImages: string[] = [];

  message.parts.forEach((part) => {
    if ('text' in part && part.text) {
      rawText += part.text;
    } else if ('inlineData' in part && part.inlineData) {
      attachedImages.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
    }
  });

  // Extract footer action pattern if present ("Apa tindakan selanjutnya?...")
  const footerRegex = /(?:---|___)?\s*\**Apa tindakan selanjutnya\?\**[\s\S]*$/i;
  const hasFooterAction = footerRegex.test(rawText);
  const mainContentText = hasFooterAction ? rawText.replace(footerRegex, '').trim() : rawText;

  // Check for 4-backtick or 3-backtick prompt blocks
  const matchBlock =
    rawText.match(/````(?:markdown)?\r?\n([\s\S]*?)\r?\n````/) ||
    rawText.match(/```(?:markdown)?\r?\n([\s\S]*?)\r?\n```/);

  const extractedPromptText = matchBlock ? matchBlock[1].trim() : rawText;
  const isPromptFinal =
    rawText.includes('````') || rawText.includes('```') || rawText.includes('Prompt Final');

  // Effect to attach interactive click handlers to Option Box list items and Copy buttons
  useEffect(() => {
    if (isUser || !containerRef.current) return;

    // 1. Option box click handlers
    const optionBoxes = containerRef.current.querySelectorAll('.option-box');
    optionBoxes.forEach((box) => {
      const listItems = box.querySelectorAll('li, .option-item');
      listItems.forEach((li) => {
        const newLi = li.cloneNode(true) as HTMLElement;
        li.parentNode?.replaceChild(newLi, li);

        newLi.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isGenerating) return;

          const hint = newLi.querySelector('.option-click-hint');
          let text = newLi.innerText;
          if (hint) {
            text = text.replace((hint as HTMLElement).innerText, '').trim();
          }
          text = text.replace(/\[SARAN PILIHAN\][^\n:]*:?/gi, '').trim();
          text = text.trim();
          if (text) {
            onSelectOption(text);
          }
        });
      });
    });

    // 2. Copy code button click handlers
    const copyBtns = containerRef.current.querySelectorAll('.copy-code-btn');
    copyBtns.forEach((btn) => {
      const newBtn = btn.cloneNode(true) as HTMLElement;
      btn.parentNode?.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const encoded = newBtn.getAttribute('data-code');
        if (encoded) {
          const codeText = decodeURIComponent(encoded);
          onCopyText(codeText);
        }
      });
    });
  }, [rawText, isUser, isGenerating, onSelectOption, onCopyText]);

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[88%] sm:max-w-[75%] bg-gradient-to-r from-sky-600 to-sky-700 text-slate-100 rounded-2xl rounded-tr-none px-3.5 sm:px-4 py-2.5 sm:py-3 shadow-lg shadow-sky-600/10 text-xs sm:text-sm leading-relaxed">
          {attachedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachedImages.map((imgSrc, idx) => (
                <img
                  key={idx}
                  src={imgSrc}
                  alt="Attachment"
                  className="max-h-32 rounded-lg border border-sky-400/30 object-cover"
                />
              ))}
            </div>
          )}
          {rawText && <p className="whitespace-pre-wrap">{rawText}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div
        ref={containerRef}
        className="max-w-[92%] sm:max-w-[85%] bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl rounded-tl-none p-3.5 sm:p-5 shadow-xl text-xs sm:text-sm leading-relaxed markdown-body relative"
      >
        {/* If Prompt Final Block is present, display badge header */}
        {isPromptFinal && matchBlock && (
          <div className="mb-3.5 p-2 bg-slate-950/90 border border-sky-500/30 rounded-xl flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center space-x-2 text-xs text-sky-300 font-semibold px-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Prompt Final Siap Gunakan</span>
            </div>
          </div>
        )}

        {/* Formatted Content */}
        <div
          dangerouslySetInnerHTML={{ __html: formatAiMessageHtml(mainContentText) }}
        />

        {/* Action Buttons & Regenerate Prompt Section */}
        {isPromptFinal && matchBlock && (
          <div className="mt-3.5 space-y-3 pt-3 border-t border-slate-800">
            {/* Buttons placed directly under MARKDOWN PROMPT */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onCopyText(extractedPromptText)}
                className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 shadow active:scale-95 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Seluruh Prompt</span>
              </button>
              <button
                type="button"
                onClick={() => onDownloadPrompt(extractedPromptText)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 shadow active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh .txt</span>
              </button>
            </div>

            {/* Regenerate Prompt Section */}
            <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2.5">
              <span className="text-[11px] text-slate-400 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 mr-1.5 shrink-0" />
                Ingin variasi atau penyempurnaan lain dari Prompt ini?
              </span>
              <button
                type="button"
                onClick={onRegeneratePrompt}
                disabled={isGenerating}
                className="bg-gradient-to-r from-amber-600 to-sky-600 hover:from-amber-500 hover:to-sky-500 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center space-x-1.5 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Generate Ulang Prompt Final</span>
              </button>
            </div>
          </div>
        )}

        {/* Clean & Interactive Action Footer ("Apa tindakan selanjutnya?") */}
        {hasFooterAction && (
          <div className="mt-5 pt-3.5 border-t border-slate-800/80 bg-slate-950/60 -mx-3.5 -mb-3.5 sm:-mx-5 sm:-mb-5 p-3.5 sm:p-4 rounded-b-2xl">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200 mb-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Apa tindakan selanjutnya?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => onSelectOption('reset')}
                className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 text-slate-200 transition-all text-left group cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors shrink-0 mt-0.5">
                  <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold block text-slate-100 text-xs group-hover:text-amber-300 transition-colors">
                    1. Reset & Kembali ke Awal
                  </span>
                  <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                    Melupakan request sebelumnya agar tidak tercampur dengan memori lain.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectOption('Diskusikan lagi hasil prompt')}
                className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/40 text-slate-200 transition-all text-left group cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20 transition-colors shrink-0 mt-0.5">
                  <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold block text-slate-100 text-xs group-hover:text-sky-300 transition-colors">
                    2. Diskusikan Lagi Hasil Prompt
                  </span>
                  <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                    Berikan masukan, revisi, atau pertanyaan lanjutan untuk prompt.
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

