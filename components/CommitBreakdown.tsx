import TerminalCard from "@/components/TerminalCard";
import { getAllTimeCommitCountsByGroup } from "@/lib/github";

function toPerc(n: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((n / total) * 100);
}

export default async function CommitBreakdown() {
  const { personal, work, other, total } = await getAllTimeCommitCountsByGroup(2008);
  const personalPct = toPerc(personal, total);
  const workPct = toPerc(work, total);
  const otherPct = Math.max(0, 100 - personalPct - workPct);

  const slices = [
    { label: "Personal", value: personal, pct: personalPct, color: "#B7FF3C" },
    { label: "Work", value: work, pct: workPct, color: "#BFE9FF" },
    { label: "Other", value: other, pct: otherPct, color: "#7A8CA3" },
  ];

  const circumference = 2 * Math.PI * 42; // r=42
  const offsets: number[] = [];
  let acc = 0;
  for (const s of slices) {
    const len = (s.pct / 100) * circumference;
    offsets.push(circumference - acc);
    acc += len;
  }

  return (
    <TerminalCard title="commit_breakdown" right={`all-time: ${total.toLocaleString()}`}>
      <div className="flex items-center gap-6">
        <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-sm">
          <circle cx="60" cy="60" r="42" stroke="#1A1F29" strokeWidth="12" fill="none" />
          {slices.map((s, i) => {
            const len = (s.pct / 100) * circumference;
            const dasharray = `${len} ${circumference - len}`;
            const dashoffset = offsets[i] % circumference;
            return (
              <circle
                key={s.label}
                cx="60"
                cy="60"
                r="42"
                stroke={s.color}
                strokeWidth="12"
                fill="none"
                strokeDasharray={dasharray}
                strokeDashoffset={dashoffset}
                style={{ transformOrigin: "60px 60px", transform: "rotate(-90deg)" }}
              />
            );
          })}
          <circle cx="60" cy="60" r="34" fill="#14181F" />
        </svg>

        <div className="space-y-2">
          {slices.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: s.color }} />
              <span className="font-mono text-ice/90 w-20">{s.label}</span>
              <span className="font-mono text-lime w-20">{s.value.toLocaleString()}</span>
              <span className="font-mono text-ice/70">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </TerminalCard>
  );
}

