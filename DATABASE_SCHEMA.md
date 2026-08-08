# Database & State Schema Specifications

Aplikasi ini menggunakan perpaduan **State In-Memory**, **Client-Side Web Storage** (`localStorage` & `sessionStorage`), dan **Schema Serialisasi File JSON** untuk persistensi sesi yang aman.

## 1. Storage Keys
| Key Name | Storage Type | Content Description |
|---|---|---|
| `gemini_api_key_v3` | `localStorage` / `sessionStorage` | Stored Google Gemini API Key |
| `gemini_model_v3` | `localStorage` | Selected Gemini Model Alias |
| `gemini_temp_v3` | `localStorage` | Temperature level (0.0 - 1.0) |

## 2. Interface State Schema (TypeScript Definitions)

### Chat Message Part
```typescript
export interface TextPart {
  text: string;
}

export interface InlineDataPart {
  inlineData: {
    mimeType: string;
    data: string; // Base64
  };
}

export type ChatPart = TextPart | InlineDataPart;

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatPart[];
}
```

### File Attachment
```typescript
export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  isImage: boolean;
  dataUrl?: string;
  base64?: string;
  textContent?: string;
}
```

### Export / Import Session JSON Schema (V3.0)
```json
{
  "version": "3.0",
  "exportedAt": "2026-08-07T17:37:00Z",
  "detectedRole": "Senior_Software_Architect",
  "chatHistory": [
    {
      "role": "user",
      "parts": [{ "text": "Buatkan prompt untuk..." }]
    },
    {
      "role": "model",
      "parts": [{ "text": "1. PERAN UTAMA & JOBDESK..." }]
    }
  ]
}
```
