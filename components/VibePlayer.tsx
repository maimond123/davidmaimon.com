"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type EmbedTrack = { src: string; title?: string; artist?: string; durationSec?: number };

// Paste up to 10 embed src URLs (Spotify or SoundCloud). Example provided.
const EMBEDS: EmbedTrack[] = [
  {
    src:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2132660832&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    title: "Make A Move",
    artist: "geods sorèd",
  },
  {
    src:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2114764728&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    title: "Can't Believe It",
    artist: "geods sorèd",
    durationSec: 195,
  },
  {
    src:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2094781455&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    title: "GBP x A Fresh Energy | DJ Daniel Wolf Remix",
    artist: "Daniel Wolf | DJ",
    durationSec: 240,
  },
  {
    src:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2158157550&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    title: "Loos x Fake ID (A-TUT Mashup)",
    artist: "Austin Tuttle",
    durationSec: 210,
  },
  {
    src:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1816423437&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    title: "geods sorèd - Rouge",
    artist: "55 MUSIC",
    durationSec: 180,
  },
  {
    src:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A655379654&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    title: "Kerri Chandler & Jerome Sydenham - You're In My System (Dennis Quin Remix) BBC Radio 1 Premiere",
    artist: "DENNIS QUIN",
    durationSec: 300,
  },
  {
    src:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A768350119&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    title: "Safaera",
    artist: "Bad-Bunny",
    durationSec: 250,
  },
  {
    src:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A1947131483&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    title: "Marsolo - Sense Of Style",
    artist: "Koltrax",
    durationSec: 210,
  },
];

function ensureAutoplay(src: string, shouldPlay: boolean): string {
  try {
    const url = new URL(src);
    const host = url.host;
    if (host.includes("soundcloud.com")) {
      url.searchParams.set("auto_play", shouldPlay ? "true" : "false");
    } else if (host.includes("spotify.com")) {
      // Not officially supported by Spotify, but keep best-effort param
      url.searchParams.set("autoplay", shouldPlay ? "1" : "0");
    }
    return url.toString();
  } catch {
    // Fallback to raw string; append a simple toggle if possible
    if (src.includes("soundcloud")) {
      const hasAuto = /[?&]auto_play=/.test(src);
      if (hasAuto) return src.replace(/auto_play=(true|false)/, `auto_play=${shouldPlay ? "true" : "false"}`);
      const sep = src.includes("?") ? "&" : "?";
      return `${src}${sep}auto_play=${shouldPlay ? "true" : "false"}`;
    }
    return src;
  }
}

export default function VibePlayer() {
  const [index, setIndex] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(true); // try to autoplay on mount
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const track = EMBEDS[index] ?? EMBEDS[0];

  const iframeSrc = useMemo(() => ensureAutoplay(track.src, playing), [track.src, playing]);

  useEffect(() => {
    // Synthetic progress timer since cross-origin media controls are restricted
    const duration = track.durationSec ?? 200;
    if (!playing) return;
    const id = setInterval(() => {
      setElapsedSec((s) => {
        const next = s + 0.25; // 250ms tick
        if (next >= duration) {
          // Auto-advance to next track
          setIndex((i) => (i + 1) % EMBEDS.length);
          return 0;
        }
        return next;
      });
    }, 250);
    return () => clearInterval(id);
  }, [playing, track.durationSec]);

  const displayTitle = track.title ?? `Track ${index + 1}`;
  const displayArtist = track.artist ?? "Playlist";
  const durationSec = track.durationSec ?? 200;
  useEffect(() => {
    // reset elapsed when track changes
    setElapsedSec(0);
  }, [index]);

  function formatTime(sec: number): string {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, "0")}`;
  }
  const pct = Math.min(100, Math.max(0, (elapsedSec / durationSec) * 100));

  return (
    <div className="inline-flex items-center gap-3 p-2 pr-3 rounded-lg border border-line bg-surface/70 relative w-full md:w-1/2">
      <button
        className="px-2 py-1 rounded-md bg-black/40 border border-line hover:border-lime/70"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause" : "Play"}
      >
        <span className="font-mono text-sm">{playing ? "❚❚" : "▶"}</span>
      </button>
      <button
        className="px-2 py-1 rounded-md bg-black/40 border border-line hover:border-lime/70"
        onClick={() => {
          setIndex((i) => (i - 1 + EMBEDS.length) % EMBEDS.length);
          setPlaying(true);
          setElapsedSec(0);
        }}
        aria-label="Previous"
      >
        <span className="font-mono text-sm">«</span>
      </button>
      <button
        className="px-2 py-1 rounded-md bg-black/40 border border-line hover:border-lime/70"
        onClick={() => {
          setIndex((i) => (i + 1) % EMBEDS.length);
          setPlaying(true);
          setElapsedSec(0);
        }}
        aria-label="Next"
      >
        <span className="font-mono text-sm">»</span>
      </button>
      <div className="text-sm flex-1 min-w-0">
        <span className="font-mono text-ice/80">NOW PLAYING:</span>{" "}
        <span className="font-mono text-lime">{displayTitle}</span>{" "}
        <span className="text-ice/70">— {displayArtist}</span>
        <div className="mt-2">
          <div className="h-1.5 bg-line rounded-full overflow-hidden">
            <div className="h-full bg-lime" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-ice/70 mt-1 font-mono">
            <span>{formatTime(elapsedSec)}</span>
            <span>-{formatTime(Math.max(0, durationSec - elapsedSec))}</span>
          </div>
        </div>
      </div>
      {/* Hidden iframe to keep layout unchanged while audio plays */}
      <iframe
        ref={iframeRef}
        key={`${index}-${playing}`}
        src={iframeSrc}
        title={displayTitle}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        style={{ position: "absolute", width: 0, height: 0, border: 0, left: -9999, top: 0, opacity: 0 }}
      />
    </div>
  );
}

