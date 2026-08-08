import { GoogleGenAI } from '@google/genai';
import { ChatMessage, HARDCODED_SYSTEM_INSTRUCTION } from '../types.js';

/**
 * Helper function to translate technical API errors to clear, Indonesian-friendly error messages.
 */
export function translateErrorMessage(errMsg: string): string {
  if (!errMsg) return "Terjadi kesalahan yang tidak diketahui saat memproses permintaan API.";

  const lower = errMsg.toLowerCase();

  if (
    lower.includes('high demand') ||
    lower.includes('overloaded') ||
    lower.includes('503') ||
    lower.includes('spikes in demand') ||
    lower.includes('unavailable')
  ) {
    return "Model AI saat ini sedang mengalami lalu lintas penggunaan yang sangat tinggi (High Demand). Beban ini bersifat sementara. Disarankan untuk mencoba mengganti ke pilihan Model Gemini lain pada panel konfigurasi, atau klik 'Coba Lagi'.";
  }
  if (
    lower.includes('quota') ||
    lower.includes('exceeded') ||
    lower.includes('limit') ||
    lower.includes('429') ||
    lower.includes('resource_exhausted')
  ) {
    return "Batas kuota penggunaan API telah terlampaui (Rate Limit Exceeded) untuk model ini. Disarankan untuk mencoba mengganti Model Gemini lain di panel konfigurasi (misal: gemini-3.5-flash-lite), memasukkan API Key lain, atau mencoba kembali beberapa saat lagi.";
  }
  if (
    lower.includes('api key not valid') ||
    lower.includes('invalid') ||
    lower.includes('unauthenticated') ||
    lower.includes('400')
  ) {
    return "API Key yang dimasukkan tidak valid atau tidak diizinkan. Silakan periksa kembali API Key Google Gemini Anda pada panel konfigurasi.";
  }
  if (lower.includes('not found') || lower.includes('404')) {
    return "Model Gemini yang dipilih tidak ditemukan atau belum tersedia untuk versi API Key ini. Silakan coba ganti ke pilihan model lain pada menu Konfigurasi Sistem.";
  }
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('kesalahan jaringan')
  ) {
    return "Koneksi jaringan terputus atau tidak dapat terhubung ke server Google Gemini. Periksa sambungan internet Anda.";
  }

  return "Terjadi kendala teknis saat berkomunikasi dengan server Google Gemini. Silakan coba ganti pilihan model Gemini lain atau periksa konfigurasi Anda.";
}

/**
 * Verifies Gemini API Key and Model status.
 */
export async function verifyGeminiApiKey(apiKey: string, modelName: string = 'gemini-3.6-flash') {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API Key tidak boleh kosong.');
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: 'Ping Test Verification' }] }],
    });

    if (response && response.text) {
      return {
        status: 'ok' as const,
        message: `API Key valid dan terhubung dengan model ${modelName}.`,
        model: modelName,
      };
    } else {
      throw new Error('Respons dari server Gemini kosong.');
    }
  } catch (err: any) {
    const rawMsg = err?.message || String(err);
    const friendlyMsg = translateErrorMessage(rawMsg);
    return {
      status: 'error' as const,
      message: friendlyMsg,
      detail: rawMsg,
      model: modelName,
    };
  }
}

/**
 * Sends chat contents with system instructions to Gemini API.
 */
export async function sendGeminiChat({
  apiKey,
  modelName = 'gemini-3.6-flash',
  temperature = 0.7,
  contents,
  systemInstruction = HARDCODED_SYSTEM_INSTRUCTION,
}: {
  apiKey: string;
  modelName?: string;
  temperature?: number;
  contents: ChatMessage[];
  systemInstruction?: string;
}) {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API Key tidak boleh kosong.');
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

  try {
    const formattedContents = contents.map((msg) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: msg.parts.map((p) => {
        if ('text' in p) {
          return { text: p.text };
        } else if ('inlineData' in p) {
          return {
            inlineData: {
              mimeType: p.inlineData.mimeType,
              data: p.inlineData.data,
            },
          };
        }
        return { text: '' };
      }),
    }));

    const response = await ai.models.generateContent({
      model: modelName,
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: temperature,
        maxOutputTokens: 8192,
      },
    });

    const text = response.text || '';

    return {
      status: 'ok' as const,
      text: text,
    };
  } catch (err: any) {
    const rawMsg = err?.message || String(err);
    const friendlyMsg = translateErrorMessage(rawMsg);
    return {
      status: 'error' as const,
      message: friendlyMsg,
      detail: rawMsg,
    };
  }
}
