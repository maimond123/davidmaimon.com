import { getCombinedCommitCountLastYear } from "@/lib/github";

export default async function StatsBar() {
  const commits = await getCombinedCommitCountLastYear(365);
  // Compute time elapsed (age) in years with 5 significant figures
  const birthUTC = Date.UTC(2006, 4, 11, 5, 0, 0); // 2006-05-11 05:00:00 UTC
  const msPerYear = 365.2425 * 24 * 60 * 60 * 1000;
  const ageYears = (Date.now() - birthUTC) / msPerYear;
  const timeElapsed = ageYears.toPrecision(5);
  const items = [
    { k: "commits", v: commits.toLocaleString() },
    { k: "time elapsed", v: timeElapsed },
    { k: "hypotheses", v: "19" },
    { k: "now", v: "shipping" },
  ] as const;
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

