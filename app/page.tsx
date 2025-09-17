import TerminalCard from "@/components/TerminalCard";
import StatsBar from "@/components/StatsBar";
import LinksRail from "@/components/LinksRail";
import Ticker from "@/components/Ticker";
import VibePlayer from "@/components/VibePlayer";
import CommitBreakdown from "@/components/CommitBreakdown";
import Image from "next/image";
import TypewriterTitle from "@/components/TypewriterTitle";

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
          <TypewriterTitle className="font-display text-2xl md:text-3xl tracking-tight" />
          <div className="inline-flex items-center gap-3">
            <a
              href="https://www.instagram.com/dukeuniversity/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center justify-center text-white"
              aria-label="Duke University Instagram"
            >
              <Image src="/duke_logo_1.png" alt="Duke University" width={25} height={25} className="block" />
              <span className="pointer-events-none absolute left-0 -bottom-1 h-px w-0 bg-white/80 transition-all duration-200 group-hover:w-full" />
            </a>
            <span className="text-xs font-mono text-white">— CS · Stats · Comp Bio</span>
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

      {/* All-time commit breakdown */}
      <CommitBreakdown />

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

