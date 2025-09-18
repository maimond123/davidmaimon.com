export default function Ticker({ items }: { items: string[] }) {
  const spaced = ["", ...items]; // leading spacer
  const Content = () => (
    <div className="inline-flex items-center gap-14">
      {spaced.map((it, i) => (
        <span key={i} className="px-4 text-lime font-mono whitespace-nowrap">
          {it}
        </span>
      ))}
    </div>
  );
  return (
    <div className="fixed bottom-0 inset-x-0 border-t border-line bg-bg/95">
      <div className="overflow-hidden">
        <div className="inline-flex py-2 animate-marquee">
          <Content />
          <Content />
        </div>
      </div>
    </div>
  );
}

