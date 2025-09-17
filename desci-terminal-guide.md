
# DeSci Terminal — Personal Website (Builder × Bio × AI × DeSci)

A simple, beautiful, **terminal‑style** one‑pager you can ship in an evening and iterate forever.

This guide gives you **exact steps** for Cursor + Next.js (App Router) + Tailwind + Framer Motion. It includes code for:
- neon terminal UI
- creative social links
- bottom infinite ticker
- **daily-song** player (same random song per day)
- content slots for your DeSci thesis + projects

---

## 0) Tech Stack & Principles

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (utility‑first)
- **Framer Motion** (micro animations)
- **next/font** for Space Grotesk, Inter, JetBrains Mono
- Zero backend. All client features work statically.
- Perf budget: ship <100KB JS before media; gradual enhancement (no‑JS fallback looks fine).

Design language: acid‑lime on charcoal, 1px lines, subtle glow, tiny console widgets.

**Palette**
```
bg:        #0B0E13
surface:   #14181F
line:      #1A1F29
lime:      #B7FF3C
ice:       #BFE9FF
text:      #E8F1EA
```
---

## 1) Create the project

```bash
# in Cursor terminal
npx create-next-app@latest desci-terminal --ts --eslint --app --src-dir false --import-alias "@/*"
cd desci-terminal

# deps
npm i framer-motion clsx
# tailwind
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Project structure (key files used in this guide)**
```
desci-terminal/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── TerminalCard.tsx
│   ├── StatsBar.tsx
│   ├── LinksRail.tsx
│   ├── VibePlayer.tsx
│   └── Ticker.tsx
├── public/
│   └── audio/ (your .mp3 files)
├── tailwind.config.ts
└── package.json
```

---

## 2) Tailwind + Fonts + Theme

### `tailwind.config.ts`
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0E13",
        surface: "#14181F",
        line: "#1A1F29",
        lime: "#B7FF3C",
        ice: "#BFE9FF",
        text: "#E8F1EA",
      },
      boxShadow: {
        glow: "0 0 24px rgba(183,255,60,.25)",
      },
      fontFamily: {
        // will be wired using next/font in layout
        sans: ["var(--font-inter)"],
        display: ["var(--font-space)"],
        mono: ["var(--font-jet)"],
      },
      animation: {
        marquee: "marquee 24s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

### `app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --ring: rgba(183,255,60,.25);
}

html, body {
  background: theme('colors.bg');
  color: theme('colors.text');
}

.border-line { border-color: theme('colors.line'); }
.bg-surface { background: theme('colors.surface'); }

/* subtle grain */
body::before {
  content: "";
  position: fixed; inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='.05'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.06;
}
```

### `app/layout.tsx`
```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jet = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jet" });

export const metadata: Metadata = {
  title: "David Maimon — DeSci Terminal",
  description: "Builder at the edge of AI × Biology × DeSci. Duke CS/Stats/Comp Bio.",
  metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    title: "DeSci Terminal",
    description: "AI × Biology × DeSci",
    url: "https://your-domain.com",
    siteName: "DeSci Terminal",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${jet.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
```

---

## 3) Base UI blocks

### `components/TerminalCard.tsx`
```tsx
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TerminalCard({
  title,
  right,
  children,
  className,
}: {
  title: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      className={cn(
        "bg-surface/70 border border-line rounded-2xl p-4 md:p-6 backdrop-blur",
        "shadow-glow",
        className
      )}
    >
      <div className="flex items-center justify-between pb-3 border-b border-line/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex gap-1">
            <i className="w-2 h-2 rounded-full bg-lime/80 shadow-[0_0_8px_rgba(183,255,60,.6)]" />
            <i className="w-2 h-2 rounded-full bg-ice/80" />
            <i className="w-2 h-2 rounded-full bg-line" />
          </span>
          <h3 className="font-display text-lime tracking-wide">{title}</h3>
        </div>
        <div className="text-xs text-ice/80 font-mono">{right}</div>
      </div>
      <div className="pt-4">{children}</div>
    </motion.section>
  );
}
```

### `components/StatsBar.tsx`
```tsx
export default function StatsBar() {
  const items = [
    { k: "commits", v: "2,041" },
    { k: "experiments", v: "58" },
    { k: "hypotheses", v: "19" },
    { k: "now", v: "shipping" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {items.map((it) => (
        <div key={it.k} className="bg-surface/60 border border-line rounded-lg p-3">
          <p className="text-[11px] uppercase tracking-wider text-ice/80">{it.k}</p>
          <p className="font-mono text-lime">{it.v}</p>
        </div>
      ))}
    </div>
  );
}
```

### `components/LinksRail.tsx` (terminal‑style social links)
```tsx
import { Github, Linkedin, Twitter, Link2, Mail } from "lucide-react";

const links = [
  { name: "GitHub", href: "https://github.com/maimond123", icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/david-maimon-3227ab23a", icon: Linkedin },
  { name: "X / Twitter", href: "https://x.com/ma1mon1des", icon: Twitter },
  { name: "Old Sites", href: "https://startuptechnologies.wixsite.com/davidmaimon", icon: Link2 },
  { name: "Email", href: "mailto:david.maimon@duke.edu", icon: Mail },
];

export default function LinksRail() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {links.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-line bg-surface/60 hover:border-lime/60 hover:shadow-glow transition"
        >
          <Icon className="w-4 h-4 text-ice group-hover:text-lime" />
          <span className="font-mono text-sm">{name}</span>
        </a>
      ))}
    </div>
  );
}
```

> Install lucide icons: `npm i lucide-react`

---

## 4) Daily Song Player (same song per day)

### `components/VibePlayer.tsx`
```tsx
"use client";
import { useEffect, useRef, useState } from "react";

type Song = { title: string; artist: string; src: string };

const SONGS: Song[] = [
  { title: "Glide", artist: "D.", src: "/audio/glide.mp3" },
  { title: "Bloom", artist: "D.", src: "/audio/bloom.mp3" },
  { title: "Neural Drift", artist: "D.", src: "/audio/neural_drift.mp3" },
];

function pickDailyIndex(): number {
  const today = new Date().toISOString().slice(0, 10);
  const saved = typeof window !== "undefined" ? localStorage.getItem("dailySong") : null;
  if (saved) {
    try {
      const obj = JSON.parse(saved);
      if (obj.date === today) return obj.index;
    } catch {}
  }
  const index = Math.floor(Math.random() * SONGS.length);
  localStorage.setItem("dailySong", JSON.stringify({ date: today, index }));
  return index;
}

export default function VibePlayer() {
  const [idx, setIdx] = useState<number>(() => pickDailyIndex());
  const [playing, setPlaying] = useState(false);
  const aRef = useRef<HTMLAudioElement | null>(null);
  const s = SONGS[idx];

  useEffect(() => {
    setIdx(pickDailyIndex());
  }, []);

  return (
    <div className="inline-flex items-center gap-3 p-2 pr-3 rounded-lg border border-line bg-surface/70">
      <button
        className="px-2 py-1 rounded-md bg-black/40 border border-line hover:border-lime/70"
        onClick={() => {
          const a = aRef.current!;
          if (a.paused) { a.play(); setPlaying(true); }
          else { a.pause(); setPlaying(false); }
        }}
        aria-label={playing ? "Pause" : "Play"}
      >
        <span className="font-mono text-sm">{playing ? "❚❚" : "▶"}</span>
      </button>
      <div className="text-sm">
        <span className="font-mono text-ice/80">NOW PLAYING:</span>{" "}
        <span className="font-mono text-lime">{s.title}</span>{" "}
        <span className="text-ice/70">— {s.artist}</span>
      </div>
      <audio ref={aRef} src={s.src} loop preload="none" />
    </div>
  );
}
```

Drop a few `.mp3` files into `public/audio/`. Autoplay requires a click (browser policy).

---

## 5) Infinite bottom ticker

### `components/Ticker.tsx`
```tsx
export default function Ticker({ items }: { items: string[] }) {
  const text = items.join(" · ");
  return (
    <div className="fixed bottom-0 inset-x-0 border-t border-line bg-bg/95">
      <div className="overflow-hidden whitespace-nowrap">
        <div className="inline-block py-2 animate-marquee">
          <span className="px-4 text-lime font-mono">{text} · </span>
          <span className="px-4 text-lime font-mono">{text} · </span>
        </div>
      </div>
    </div>
  );
}
```

Usage will be shown in `page.tsx`.

---

## 6) The page

### `app/page.tsx`
```tsx
import TerminalCard from "@/components/TerminalCard";
import StatsBar from "@/components/StatsBar";
import LinksRail from "@/components/LinksRail";
import Ticker from "@/components/Ticker";
import VibePlayer from "@/components/VibePlayer";

export default function Home() {
  const tickerItems = [
    "DeSci note: marginal data → collective benefit → longevity",
    "Shipping: terminal UI v1",
    "Email: david.maimon@duke.edu",
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 pb-24 pt-10 md:pt-16">
      {/* Header / Hero */}
      <header className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl md:text-3xl tracking-tight">
            <span className="text-ice/80">/</span> <span className="text-lime">DeSci</span> Terminal
          </h1>
          <div className="text-xs font-mono text-ice/70">
            Duke — CS · Stats · Comp Bio
          </div>
        </div>
        <p className="text-base md:text-lg text-ice/90 leading-relaxed max-w-3xl">
          I build at the edge of <span className="text-lime">AI × Biology × DeSci</span>.
          I believe every marginal datapoint added to an open network compounds into shared insight—
          training systems that accelerate longevity and human flourishing.
        </p>
      </header>

      {/* Stats */}
      <div className="mb-8">
        <StatsBar />
      </div>

      {/* Vibe + Links */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <VibePlayer />
        <LinksRail />
      </div>

      {/* Build Log / Projects */}
      <TerminalCard title="build_log" right="tail -n 3">
        <ul className="space-y-3 font-mono text-sm">
          <li>2025‑09‑17 — launched terminal v1</li>
          <li>2025‑09‑12 — added daily-song player</li>
          <li>2025‑09‑08 — molecule links → rail</li>
        </ul>
      </TerminalCard>

      <div className="h-4" />

      <TerminalCard title="desci_thesis" right="cat thesis.md">
        <ol className="list-decimal pl-5 space-y-2 text-ice/90">
          <li>Each marginal data point → a unified, decentralized graph.</li>
          <li>Aggregate → inference → better hypotheses & decisions.</li>
          <li>Result: accelerated longevity & human flourishing with AI.</li>
        </ol>
      </TerminalCard>

      <Ticker items={tickerItems} />
    </main>
  );
}
```

---

## 7) Small utilities (optional)

Create `lib/utils.ts`:
```ts
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
```

---

## 8) Content to fill later

- **About paragraph** (80–120 words) — put in hero `<p>`.
- **Projects** — replace the `build_log` section with 3–6 project cards (each a `TerminalCard` with a metric).
- **Resume** — add `/resume.pdf` to `public` and link in `LinksRail`.
- **Email** — update everywhere (ticker, links).

---

## 9) Accessibility & polish

- Buttons have `aria-label`s.
- Ensure 4.5:1 contrast (lime on bg meets it).
- Focus states: Tailwind `focus-visible:ring-[--ring]` if you add forms/inputs.
- Reduce motion: respect `prefers-reduced-motion` by disabling long marquee if necessary (optional).

Example (optional in `globals.css`):
```css
@media (prefers-reduced-motion: reduce) {
  .animate-marquee { animation: none; transform: none; }
}
```

---

## 10) Performance checklist

- Optimize audio: keep mp3s short/loopable.
- Avoid heavy libs (no Three.js here).
- Images: use Next/Image for OG if added.
- Lighthouse aim: 95+ Performance/Best Practices.

---

## 11) Run & iterate

```bash
npm run dev
# open http://localhost:3000
```

Suggested Cursor tasks:
- “Extract TerminalCard to accept `variant=‘warning’|‘ok’`”
- “Convert build_log list to ProjectCard grid.”
- “Add command‑K palette (simple client component).”

---

## 12) Deploy (Vercel)

```bash
# commit
git init
git add -A
git commit -m "feat: DeSci Terminal v1"

# create a repo then
git remote add origin git@github.com:yourname/desci-terminal.git
git push -u origin main

# deploy
npm i -g vercel
vercel
# follow prompts; subsequent deploys: vercel --prod
```

Set your custom domain in Vercel → Domains.

---

## 13) Optional enhancements (later)

- **Command‑K** palette (cmd/ctrl+k) to jump to Resume/Projects/Email.
- **Live “metrics”** sourced from GitHub API (stars, commits) — client fetch with lightweight cache.
- **Theme toggle**: dark only by default; could add “lab white” variant.
- **Analytics**: privacy‑first (Plausible).

---

## 14) TODO — your next actions

- [ ] Replace social links and email in `LinksRail.tsx` + `page.tsx` ticker
- [ ] Drop 3–5 `.mp3` files into `public/audio/`
- [ ] Write About paragraph (hero)
- [ ] Replace build log with 3–6 project cards
- [ ] Add resume to `/public/resume.pdf`
- [ ] Deploy to Vercel + set domain

---

### That’s it
You now have a clean **DeSci Terminal** scaffold: terminal cards, neon stats, creative links, daily‑song player, and a bottom ticker. Iterate the content; keep the UI calm and fast.
