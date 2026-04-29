import { useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";
import { SingleSelect } from "./SingleSelect";

const timeDimensionOptions = [
  { label: "10分钟" }, { label: "20分钟" }, { label: "30分钟" },
  { label: "1小时" }, { label: "2小时" }, { label: "3小时" },
  { label: "4小时" }, { label: "5小时" }, { label: "6小时" },
  { label: "日" }, { label: "周" }, { label: "月" },
];

const dimMap: Record<string, { spanLabel: string; points: number; stepMs: number }> = {
  "10分钟": { spanLabel: "前24小时", points: 144, stepMs: 10 * 60 * 1000 },
  "20分钟": { spanLabel: "前24小时", points: 72, stepMs: 20 * 60 * 1000 },
  "30分钟": { spanLabel: "前24小时", points: 48, stepMs: 30 * 60 * 1000 },
  "1小时":  { spanLabel: "前24小时", points: 24, stepMs: 60 * 60 * 1000 },
  "2小时":  { spanLabel: "前24小时", points: 12, stepMs: 2 * 60 * 60 * 1000 },
  "3小时":  { spanLabel: "前3天",   points: 24, stepMs: 3 * 60 * 60 * 1000 },
  "4小时":  { spanLabel: "前3天",   points: 18, stepMs: 4 * 60 * 60 * 1000 },
  "5小时":  { spanLabel: "前3天",   points: 14, stepMs: 5 * 60 * 60 * 1000 },
  "6小时":  { spanLabel: "前3天",   points: 12, stepMs: 6 * 60 * 60 * 1000 },
  "日":     { spanLabel: "前30天",  points: 30, stepMs: 24 * 60 * 60 * 1000 },
  "周":     { spanLabel: "前12周",  points: 12, stepMs: 7 * 24 * 60 * 60 * 1000 },
  "月":     { spanLabel: "前12月",  points: 12, stepMs: 30 * 24 * 60 * 60 * 1000 },
};

function fmtTick(d: Date, dim: string) {
  const p = (n: number) => String(n).padStart(2, "0");
  if (dim === "月") return `${d.getFullYear()}-${p(d.getMonth() + 1)}`;
  if (dim === "日" || dim === "周") return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export const TrendChartCard = () => {
  const [dim, setDim] = useState("日");
  const cfg = dimMap[dim];

  const data = useMemo(() => {
    const end = Date.now();
    const arr: { t: Date; v: number }[] = [];
    for (let i = cfg.points - 1; i >= 0; i--) {
      const t = new Date(end - i * cfg.stepMs);
      const seed = Math.sin(t.getTime() / 1e8) * 10000;
      const r = seed - Math.floor(seed);
      const v = Math.floor(r * 200) + (r > 0.85 ? 50 : 20);
      arr.push({ t, v: Math.max(0, v) });
    }
    return arr;
  }, [cfg]);

  const W = 1100, H = 320, PL = 50, PR = 20, PT = 20, PB = 30;
  const innerW = W - PL - PR;
  const innerH = H - PT - PB;
  const maxV = Math.max(15, ...data.map((d) => d.v));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;

  const points = data.map((d, i) => ({
    x: PL + i * stepX,
    y: PT + innerH - (d.v / maxV) * innerH,
    v: d.v,
    t: d.t,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = `${pathD} L${points[points.length - 1]?.x ?? PL},${PT + innerH} L${points[0]?.x ?? PL},${PT + innerH} Z`;

  const avgV = data.length ? data.reduce((s, d) => s + d.v, 0) / data.length : 0;
  const avgY = PT + innerH - (avgV / maxV) * innerH;

  const yTicks = [0, Math.round(maxV / 4), Math.round(maxV / 2), Math.round((maxV * 3) / 4), maxV];
  const xTickIdx = data.length > 8
    ? [0, Math.floor(data.length / 4), Math.floor(data.length / 2), Math.floor((data.length * 3) / 4), data.length - 1]
    : data.map((_, i) => i);

  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let nearest = 0, dist = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - x);
      if (d < dist) { dist = d; nearest = i; }
    });
    setHover(nearest);
  };

  return (
    <div className="bg-card rounded-md px-6 py-5">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-primary text-[14px] font-medium">趋势图</span>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-[13px] text-[hsl(var(--label-text))]">时间维度：</span>
          <div className="w-32">
            <SingleSelect options={timeDimensionOptions} value={dim} onChange={setDim} />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-sm bg-[hsl(var(--primary)/0.08)] border border-[hsl(var(--primary)/0.2)]">
          <span className="text-[12px] text-[hsl(var(--muted-foreground))]">平均值（每{dim}）：</span>
          <span className="text-[13px] font-semibold text-primary">{avgV.toFixed(2)}</span>
        </div>
        <button
          type="button"
          className="text-primary hover:opacity-80"
          aria-label="下载"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded-sm text-[13px] text-primary border border-[hsl(var(--primary)/0.4)] hover:bg-[hsl(var(--primary)/0.08)] transition-colors"
        >
          查看原声
        </button>
      </div>

      <div className="mt-4 border border-border rounded-md p-2 bg-card">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
          <defs>
            <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {yTicks.map((v, i) => {
            const y = PT + innerH - (v / maxV) * innerH;
            return (
              <g key={i}>
                <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="hsl(var(--border))" strokeDasharray="2 3" />
                <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="11" fill="hsl(var(--muted-foreground))">{v}</text>
              </g>
            );
          })}

          <path d={areaD} fill="url(#trendAreaGrad)" />
          <path d={pathD} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />

          <line x1={PL} y1={avgY} x2={W - PR} y2={avgY} stroke="hsl(var(--destructive))" strokeDasharray="5 4" strokeWidth="1.5" opacity="0.8" />
          <text x={W - PR - 4} y={avgY - 4} textAnchor="end" fontSize="11" fill="hsl(var(--destructive))" fontWeight="600">平均值 {avgV.toFixed(2)}</text>

          {xTickIdx.map((i) => (
            <text key={i} x={points[i]?.x} y={H - 8} textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">
              {fmtTick(points[i]?.t, dim)}
            </text>
          ))}

          {hover !== null && points[hover] && (
            <g>
              <line x1={points[hover].x} y1={PT} x2={points[hover].x} y2={PT + innerH} stroke="hsl(var(--primary))" strokeDasharray="3 3" opacity="0.5" />
              <circle cx={points[hover].x} cy={points[hover].y} r="5" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
              <g transform={`translate(${Math.min(points[hover].x + 8, W - 160)}, ${Math.max(points[hover].y - 40, PT)})`}>
                <rect width="155" height="38" rx="4" fill="hsl(var(--popover))" stroke="hsl(var(--border))" />
                <text x="8" y="15" fontSize="11" fill="hsl(var(--muted-foreground))">{fmtTick(points[hover].t, dim)}</text>
                <text x="8" y="30" fontSize="12" fill="hsl(var(--primary))" fontWeight="600">反馈量：{points[hover].v}</text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
