# API Specification

All backend endpoints are served under the `/api` namespace by Express.

## 1. POST /api/gemini/verify
Memverifikasi keabsahan API Key Google Gemini dan ketersediaan model.

- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "apiKey": "AIzaSy...",
    "model": "gemini-3.6-flash"
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "status": "ok",
    "message": "API Key valid dan terhubung.",
    "model": "gemini-3.6-flash"
  }
  ```
- **Response Error (400/401/500)**:
  ```json
  {
    "status": "error",
    "message": "API Key tidak valid atau terlampaui kuota."
  }
  ```

## 2. POST /api/gemini/chat
Mengirimkan riwayat percakapan dan instruksi sistem untuk menghasilkan balasan AI.

- **Request Body**:
  ```json
  {
    "apiKey": "AIzaSy...",
    "model": "gemini-3.6-flash",
    "temperature": 0.7,
    "systemInstruction": "...",
    "contents": [
      {
        "role": "user",
        "parts": [{ "text": "..." }]
      }
    ]
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "text": "1. PERAN UTAMA & JOBDESK...",
    "candidates": [...]
  }
  ```

## 3. GET /api/health
Pemeriksaan kesehatan server backend.

- **Response (200 OK)**:
  ```json
  { "status": "ok", "timestamp": "2026-08-07T17:37:00Z" }
  ```
