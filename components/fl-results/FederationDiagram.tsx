const CLIENTS = 16;
const CENTER = { x: 150, y: 78 };
const RADIUS = { x: 62, y: 62 };

const nodes = Array.from({ length: CLIENTS }, (_, i) => {
  const a = (i / CLIENTS) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTER.x + RADIUS.x * Math.cos(a), y: CENTER.y + RADIUS.y * Math.sin(a) };
});

/** Sixteen clients around one aggregation server: only model updates travel. */
export function FederationDiagram() {
  return (
    <svg viewBox="0 0 300 156" className="h-auto w-full" role="img" aria-label="Sixteen client projects around one aggregation server; only model updates travel">
      {nodes.map((n, i) => (
        <line key={`l${i}`} x1={CENTER.x} y1={CENTER.y} x2={n.x} y2={n.y} className="stroke-chip" strokeWidth="1.2" strokeDasharray="2 4" />
      ))}
      {nodes.map((n, i) => (
        <circle key={`c${i}`} cx={n.x} cy={n.y} r="7" className="fill-paper-2 stroke-ink-3" strokeWidth="1.5" />
      ))}
      <circle cx={CENTER.x} cy={CENTER.y} r="22" className="fill-accent" />
      <text x={CENTER.x} y={CENTER.y + 4} textAnchor="middle" className="fill-white font-mono text-[11px]">
        server
      </text>
    </svg>
  );
}
