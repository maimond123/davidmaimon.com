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

