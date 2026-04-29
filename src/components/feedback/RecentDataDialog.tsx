import { useMemo, useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SingleSelect } from "./SingleSelect";
import { MultiSelect } from "./MultiSelect";
import { CascadeMultiSelect } from "./CascadeMultiSelect";

export interface SeparateFilter {
  key: string;
  label: string;
  type: "multi" | "cascade";
  options: any[];
  values: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  timeRange: string; // selected time range from trigger condition
  indicator: string;
  separateFilters?: SeparateFilter[];
}

const timeDimensionOptions = [
  { label: "10分钟" }, { label: "20分钟" }, { label: "30分钟" },
  { label: "1小时" }, { label: "2小时" }, { label: "3小时" },
  { label: "4小时" }, { label: "5小时" }, { label: "6小时" },
  { label: "日" }, { label: "周" },
];

// Map time range -> default dimension and lookback span
const rangeMap: Record<string, { dim: string; spanLabel: string; points: number; stepMs: number }> = {
  "10分钟": { dim: "10分钟", spanLabel: "前24小时", points: 144, stepMs: 10 * 60 * 1000 },
  "20分钟": { dim: "20分钟", spanLabel: "前24小时", points: 72, stepMs: 20 * 60 * 1000 },
  "30分钟": { dim: "30分钟", spanLabel: "前24小时", points: 48, stepMs: 30 * 60 * 1000 },
  "1小时":  { dim: "1小时",  spanLabel: "前24小时", points: 24, stepMs: 60 * 60 * 1000 },
  "2小时":  { dim: "2小时",  spanLabel: "前24小时", points: 12, stepMs: 2 * 60 * 60 * 1000 },
  "3小时":  { dim: "3小时",  spanLabel: "前3天",   points: 24, stepMs: 3 * 60 * 60 * 1000 },
  "4小时":  { dim: "4小时",  spanLabel: "前3天",   points: 18, stepMs: 4 * 60 * 60 * 1000 },
  "5小时":  { dim: "5小时",  spanLabel: "前3天",   points: 14, stepMs: 5 * 60 * 60 * 1000 },
  "6小时":  { dim: "6小时",  spanLabel: "前3天",   points: 12, stepMs: 6 * 60 * 60 * 1000 },
  "当日":   { dim: "日",      spanLabel: "前10天",  points: 10, stepMs: 24 * 60 * 60 * 1000 },
  "本周":   { dim: "周",      spanLabel: "前10周",  points: 10, stepMs: 7 * 24 * 60 * 60 * 1000 },
};

function fmtDate(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function fmtTick(d: Date, dim: string) {
  const p = (n: number) => String(n).padStart(2, "0");
  if (dim === "日" || dim === "周") return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export const RecentDataDialog = ({ open, onOpenChange, timeRange, indicator, separateFilters = [] }: Props) => {
  const [filterVals, setFilterVals] = useState<Record<string, string[]>>({});
  useEffect(() => {
    if (open) {
      const init: Record<string, string[]> = {};
      separateFilters.forEach((f) => { init[f.key] = f.values; });
      setFilterVals(init);
    }
  }, [open, separateFilters]);
  const cfg = rangeMap[timeRange] ?? rangeMap["10分钟"];
  const [dim, setDim] = useState(cfg.dim);
  const [endTime, setEndTime] = useState(() => {
    const d = new Date();
    return fmtDate(d);
  });
  const startTime = useMemo(() => {
    const d = new Date(endTime.replace(" ", "T"));
    d.setDate(d.getDate() - 1);
    return fmtDate(d);
  }, [endTime]);

  // Generate mock data based on dim
  const dimCfg = useMemo(() => {
    const found = Object.values(rangeMap).find((c) => c.dim === dim);
    return found ?? cfg;
  }, [dim, cfg]);

  const data = useMemo(() => {
    const end = new Date(endTime.replace(" ", "T")).getTime();
    const arr: { t: Date; v: number }[] = [];
    for (let i = dimCfg.points - 1; i >= 0; i--) {
      const t = new Date(end - i * dimCfg.stepMs);
      // pseudo-random but stable
      const seed = Math.sin(t.getTime() / 1e8) * 10000;
      const r = seed - Math.floor(seed);
      const v = Math.floor(r * 14) + (r > 0.85 ? 5 : 0);
      arr.push({ t, v: Math.max(0, v) });
    }
    return arr;
  }, [dimCfg, endTime]);

  const W = 900, H = 320, PL = 40, PR = 20, PT = 20, PB = 30;
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
  const xTickIdx = data.length > 8 ? [0, Math.floor(data.length / 4), Math.floor(data.length / 2), Math.floor((data.length * 3) / 4), data.length - 1] : data.map((_, i) => i);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-[15px]">近期数据图 - {indicator}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 flex-wrap pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[hsl(var(--label-text))]">反馈时间：</span>
            <input
              type="datetime-local"
              value={startTime.replace(" ", "T")}
              readOnly
              className="h-8 px-2 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm"
            />
            <span className="text-[13px]">至</span>
            <input
              type="datetime-local"
              value={endTime.replace(" ", "T")}
              onChange={(e) => setEndTime(e.target.value.replace("T", " "))}
              className="h-8 px-2 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[hsl(var(--label-text))]">时间维度：</span>
            <div className="w-32">
              <SingleSelect options={timeDimensionOptions} value={dim} onChange={setDim} />
            </div>
          </div>
          <span className="text-[12px] text-[hsl(var(--muted-foreground))]">展示{dimCfg.spanLabel}内每{dim}的数据趋势</span>
        </div>

        {separateFilters.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 border-t border-border pt-3">
            {separateFilters.map((f) => (
              <div key={f.key} className="flex items-center gap-2" style={{ minWidth: 300 }}>
                <span className="text-[13px] text-[hsl(var(--label-text))] shrink-0">{f.label}：</span>
                <div style={{ width: 220 }}>
                  {f.type === "cascade" ? (
                    <CascadeMultiSelect
                      placeholder="请选择"
                      options={f.options}
                      value={filterVals[f.key] ?? []}
                      onChange={(v) => setFilterVals((prev) => ({ ...prev, [f.key]: v }))}
                    />
                  ) : (
                    <MultiSelect
                      placeholder="请选择"
                      options={f.options}
                      value={filterVals[f.key] ?? []}
                      onChange={(v) => setFilterVals((prev) => ({ ...prev, [f.key]: v }))}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 border border-border rounded-md p-2 bg-card">
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
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

            <path d={areaD} fill="url(#areaGrad)" />
            <path d={pathD} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />

            {xTickIdx.map((i) => (
              <text key={i} x={points[i]?.x} y={H - 8} textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">
                {fmtTick(points[i]?.t, dim)}
              </text>
            ))}

            {hover !== null && points[hover] && (
              <g>
                <line x1={points[hover].x} y1={PT} x2={points[hover].x} y2={PT + innerH} stroke="hsl(var(--primary))" strokeDasharray="3 3" opacity="0.5" />
                <circle cx={points[hover].x} cy={points[hover].y} r="5" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
                <g transform={`translate(${Math.min(points[hover].x + 8, W - 140)}, ${Math.max(points[hover].y - 40, PT)})`}>
                  <rect width="135" height="38" rx="4" fill="hsl(var(--popover))" stroke="hsl(var(--border))" />
                  <text x="8" y="15" fontSize="11" fill="hsl(var(--muted-foreground))">{fmtTick(points[hover].t, dim)}</text>
                  <text x="8" y="30" fontSize="12" fill="hsl(var(--primary))" fontWeight="600">{indicator}：{points[hover].v}</text>
                </g>
              </g>
            )}
          </svg>
        </div>
      </DialogContent>
    </Dialog>
  );
};
