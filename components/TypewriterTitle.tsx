"use client";
import React from "react";

export default function TypewriterTitle({ className }: { className?: string }) {
  const fullText = "David Maimon's Terminal";
  const greenSegmentLength = "David Maimon's".length;

  const [index, setIndex] = React.useState(0);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setIndex(fullText.length);
      setDone(true);
      return;
    }

    if (index >= fullText.length) {
      setDone(true);
      return;
    }

    const id = window.setTimeout(() => setIndex((v) => v + 1), 40);
    return () => window.clearTimeout(id);
  }, [index, fullText.length]);

  const greenText = fullText.slice(0, Math.min(index, greenSegmentLength));
  const restTyped = fullText
    .slice(greenSegmentLength)
    .slice(0, Math.max(0, index - greenSegmentLength));

  return (
    <h1 className={className}>
      <span className="text-ice/80">/</span>{" "}
      <span>
        <span className="text-lime">{greenText}</span>
        {restTyped}
        {done ? <span className="blink-underscore">_</span> : null}
      </span>
    </h1>
  );
}




