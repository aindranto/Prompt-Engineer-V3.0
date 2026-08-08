import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { verifyGeminiApiKey, sendGeminiChat } from "./src/server/geminiService.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON with ample capacity for base64 attachments
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // Basic security CORS headers
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // REST API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Senior Prompt Engineer Expert V3.0 Server",
    });
  });

  app.post("/api/gemini/verify", async (req, res) => {
    try {
      const { apiKey, model } = req.body;
      const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

      if (!effectiveKey) {
        res.status(400).json({
          status: "error",
          message: "API Key tidak ditemukan. Harap masukkan Google Gemini API Key Anda.",
        });
        return;
      }

      const result = await verifyGeminiApiKey(effectiveKey, model || "gemini-3.6-flash");
      if (result.status === "ok") {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Gagal memproses verifikasi API Key.",
        detail: error?.message || String(error),
      });
    }
  });

  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { apiKey, model, temperature, contents, systemInstruction } = req.body;
      const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

      if (!effectiveKey) {
        res.status(400).json({
          status: "error",
          message: "API Key tidak ditemukan. Harap masukkan Google Gemini API Key Anda.",
        });
        return;
      }

      if (!contents || !Array.isArray(contents)) {
        res.status(400).json({
          status: "error",
          message: "Daftar percakapan (contents) harus berupa array.",
        });
        return;
      }

      const result = await sendGeminiChat({
        apiKey: effectiveKey,
        modelName: model || "gemini-3.6-flash",
        temperature: typeof temperature === "number" ? temperature : 0.7,
        contents: contents,
        systemInstruction: systemInstruction,
      });

      if (result.status === "ok") {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal saat menghubungkan ke Gemini API.",
        detail: error?.message || String(error),
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Senior Prompt Engineer Expert V3.0 running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
