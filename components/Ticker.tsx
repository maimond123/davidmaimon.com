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

