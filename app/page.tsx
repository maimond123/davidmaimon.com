import TerminalCard from "@/components/TerminalCard";
import LinksRail from "@/components/LinksRail";
import Ticker from "@/components/Ticker";
import VibePlayer from "@/components/VibePlayer";
import CommitBreakdown from "@/components/CommitBreakdown";
import Image from "next/image";
import TypewriterTitle from "@/components/TypewriterTitle";

export default function Home() {
  const tickerItems = [
    "**DeSci Thesis:**", 
    "1. Each marginal data point → a unified, decentralized graph",
    "2. Aggregate → inference → better hypotheses & decisions",
    "3. Result: accelerated longevity & human flourishing with AI. "
  ];

  const experiences: { date: string; company: string; href?: string }[] = [
    { date: "Present – Future", company: "De Sci + AI..." },
    { date: "Jul 2024 – Present", company: "Peak Artificial Intelligence", href: "https://peak.watch" },
    { date: "Dec 2025 – Jul 2025", company: "Alumlo", href: "https://alumlo.com" },
    { date: "Aug 2024 – May 2025", company: "Christensen Family Center for Innovation" },
    { date: "May 2024 – Aug 2024", company: "Stealth Startup" },
    { date: "May 2023 – Sep 2023", company: "EduTrack", href: "https://startuptechnologies.wixsite.com/edutrack" },
    { date: "Jun 2022 – Aug 2022", company: "TRC Systems LLC" },
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
          I am interested in <span className="text-lime">AI × Biology × DeSci</span>.
          Every marginal datapoint added to an open network compounds into shared insight,
          training systems that accelerate longevity and human flourishing.
        </p>
      </header>

      

      {/* Vibe + Links */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <VibePlayer />
        <div className="flex-1">
          <LinksRail />
        </div>
      </div>

      {/* Build Log / Projects */}
      <TerminalCard title="build_log" right="ls -l">
        <ul className="space-y-6 font-mono text-sm">
          {experiences.map((e) => (
            <li key={`${e.date}-${e.company}`} className="flex items-baseline gap-6">
              <span className="text-ice/70 w-48 md:w-56">{e.date}</span>
              <span className="text-ice/90 inline-flex items-center gap-2">
                {e.company}
                {e.href && (
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${e.company} external link`}
                    className="text-ice/60 hover:text-lime transition text-base md:text-lg leading-none"
                  >
                    ↗
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      </TerminalCard>

      <div className="h-4" />

      {/* All-time commit breakdown */}
      <CommitBreakdown />

      <Ticker items={tickerItems} />
    </main>
  );
}

