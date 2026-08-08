import { sendGeminiChat } from "../src/server/geminiService";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method tidak diizinkan.",
    });
  }

  try {
    const {
      apiKey,
      model,
      temperature,
      contents,
      systemInstruction,
    } = req.body || {};

    if (!apiKey) {
      return res.status(400).json({
        status: "error",
        message: "API Key tidak ditemukan. Harap masukkan Google Gemini API Key Anda.",
      });
    }

    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({
        status: "error",
        message: "Daftar percakapan (contents) harus berupa array.",
      });
    }

    const result = await sendGeminiChat({
      apiKey,
      modelName: model || "gemini-3.6-flash",
      temperature:
        typeof temperature === "number" ? temperature : 0.7,
      contents,
      systemInstruction,
    });

    if (result.status === "ok") {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan internal saat menghubungkan ke Gemini API.",
      detail: error?.message || String(error),
    });
  }
}
