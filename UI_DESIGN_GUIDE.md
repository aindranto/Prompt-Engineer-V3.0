# UI Design Guide & System Tokens

## 1. Design Philosophy
- **Aesthetic**: Modern Dark Slate Luxury dengan aksen Sky Blue (`#0ea5e9`) & Emerald Green (`#10b981`).
- **Typography Pairings**: Plus Jakarta Sans / Inter untuk teks antarmuka, JetBrains Mono / Fira Code untuk blok kode.
- **Micro-Interactions**: Smooth entrance transitions via Framer Motion, hover highlight pada Option Cards, active click feedback, dan bouncing dot typing indicators.

## 2. Color Palette Tokens

```css
/* Background & Surface Colors */
--bg-slate-950: #020617; /* Main Canvas Background */
--bg-slate-900: #0f172a; /* Card & Sidebar Surface */
--bg-slate-800: #1e293b; /* Controls & Sub-surfaces */

/* Brand & Accent Gradients */
--gradient-sky-emerald: linear-gradient(135deg, #0284c7 0%, #10b981 100%);
--sky-400: #38bdf8;
--emerald-400: #34d399;
--amber-400: #fbbf24;
--rose-400: #f87171;

/* Border & Dividers */
--border-slate-800: #1e293b;
--border-sky-500-30: rgba(14, 165, 233, 0.3);
--border-emerald-500-30: rgba(16, 185, 129, 0.3);
```

## 3. Custom Component Patterns

### Reason Box
- Latar belakang: `rgba(14, 165, 233, 0.1)`
- Border kiri: `4px solid #0ea5e9`
- Teks: `#e0f2fe`, `font-size: 0.9rem`

### Option Box Cards (Clickable)
- Latar belakang: `rgba(16, 185, 129, 0.08)`
- Border kiri: `4px solid #10b981`
- Item opsi: Card dengan hover scale `translateY(-1px)` & shadow glow.
- Hint badge: `<span class="option-click-hint"><i class="fa-solid fa-hand-pointer"></i> Klik Opsi</span>`

### Code Block Wrapper
- Header bar gelap `#1e293b` dengan label bahasa dan tombol "Salin" & "Unduh .txt".
- Area kode `#090d16` berpadded `1rem`.
