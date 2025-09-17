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
  if (typeof window !== "undefined") {
    localStorage.setItem("dailySong", JSON.stringify({ date: today, index }));
  }
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

