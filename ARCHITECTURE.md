# System Architecture Blueprint

## 1. Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React 19 Frontend (SPA)                  │
│  ┌──────────────────┐ ┌────────────────┐ ┌───────────────┐  │
│  │ ChatContainer    │ │ SidebarConfig  │ │ SystemModal   │  │
│  └─────────┬────────┘ └───────┬────────┘ └───────┬───────┘  │
│            │                  │                  │          │
│            └──────────────────┼──────────────────┘          │
│                               │                             │
│                      Fetch API Client Calls                 │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Backend Server                   │
│  ┌──────────────────┐ ┌────────────────┐ ┌───────────────┐  │
│  │ /api/gemini/chat │ │ /api/verify    │ │ /api/health   │  │
│  └─────────┬────────┘ └───────┬────────┘ └───────────────┘  │
│            │                  │                             │
│            └──────────────────┴───────────────┐             │
│                                               │             │
│                                     @google/genai SDK       │
└───────────────────────────────────────────────┬─────────────┘
                                                │
                                                ▼
                               ┌────────────────────────────────┐
                               │ Google Gemini AI Cloud API     │
                               │ (gemini-3.6-flash, etc.)       │
                               └────────────────────────────────┘
```

## 2. Tech Stack Detail
- **Frontend Framework**: React 19 + TypeScript + Vite 6
- **Styling & Animation**: Tailwind CSS v4 + Framer Motion + Lucide React Icons
- **Markdown Parsing**: `react-markdown` / `marked` dengan sintaks penyorotan kode
- **Backend Service**: Express 4 + Node.js
- **AI SDK**: `@google/genai` (Google Gen AI SDK terbaru)
