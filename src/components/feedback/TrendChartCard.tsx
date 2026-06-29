import { useMemo, useRef, useState } from "react";
import { Download, Info } from "lucide-react";
import { SingleSelect } from "./SingleSelect";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const timeDimensionOptions = [
  { label: "10分钟" }, { label: "20分钟" }, { label: "30分钟" },
  { label: "1小时" }, { label: "2小时" }, { label: "3小时" },
  { label: "4小时" }, { label: "5小时" }, { label: "6小时" },
  { label: "日" }, { label: "周" }, { label: "月" },
  { label: "7日" }, { label: "30日" },
];

const dimMap: Record<string, { spanLabel: string; points: number; stepMs: number }> = {
  "10分钟": { spanLabel: "前24小时", points: 144, stepMs: 10 * 60 * 1000 },
  "20分钟": { spanLabel: "前24小时", points: 72, stepMs: 20 * 60 * 1000 },
  "30分钟": { spanLabel: "前24小时", points: 48, stepMs: 30 * 60 * 1000 },
  "1小时":  { spanLabel: "前14天",  points: 336, stepMs: 60 * 60 * 1000 },
  "2小时":  { spanLabel: "前14天",  points: 168, stepMs: 2 * 60 * 60 * 1000 },
  "3小时":  { spanLabel: "前14天",  points: 112, stepMs: 3 * 60 * 60 * 1000 },
  "4小时":  { spanLabel: "前14天",  points: 84,  stepMs: 4 * 60 * 60 * 1000 },
  "5小时":  { spanLabel: "前14天",  points: 67,  stepMs: 5 * 60 * 60 * 1000 },
  "6小时":  { spanLabel: "前14天",  points: 56,  stepMs: 6 * 60 * 60 * 1000 },
  "日":     { spanLabel: "前30天",  points: 30, stepMs: 24 * 60 * 60 * 1000 },
  "周":     { spanLabel: "前12周",  points: 12, stepMs: 7 * 24 * 60 * 60 * 1000 },
  "月":     { spanLabel: "前12月",  points: 12, stepMs: 30 * 24 * 60 * 60 * 1000 },
  "7日":  { spanLabel: "7日(按周期)",  points: 7,  stepMs: 24 * 60 * 60 * 1000 },
  "30日": { spanLabel: "30日(按周期)", points: 30, stepMs: 24 * 60 * 60 * 1000 },
};

const isSubHour = (d: string) => d === "10分钟" || d === "20分钟" || d === "30分钟";
const is1to6Hour = (d: string) =>
  d === "1小时" || d === "2小时" || d === "3小时" || d === "4小时" || d === "5小时" || d === "6小时";

function fmtTick(d: Date, dim: string) {
  const p = (n: number) => String(n).padStart(2, "0");
  if (dim === "月") return `${d.getFullYear()}-${p(d.getMonth() + 1)}`;
  if (dim === "日" || dim === "周")
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

const isPeriodBucket = (d: string) => d === "7日" || d === "30日";

function fmtYMD(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

interface TrendChartCardProps {
  endDate?: Date;
  startDate?: Date;
}

export const TrendChartCard = ({ endDate, startDate }: TrendChartCardProps = {}) => {
  const [dim, setDim] = useState("日");
  const cfg = dimMap[dim];

  const data = useMemo(() => {
    const arr: { t: Date; v: number; rangeStart?: Date; rangeEnd?: Date; label?: string }[] = [];
    const baseEnd = endDate ?? new Date();
    if (isPeriodBucket(dim)) {
      // Latest period = [endDay - (N-1) at 00:00, baseEnd] labeled "近N日"
      // Prior periods = full N-day windows, labeled "周期1, 周期2..." (1 = oldest)
      const periodDays = dim === "7日" ? 7 : 30;
      const latestLabel = dim === "7日" ? "近7日" : "近30日";
      const endDayStart = new Date(baseEnd);
      endDayStart.setHours(0, 0, 0, 0);
      // Determine total periods to show based on selected date range
      let periodsCount = 1;
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        const spanDays = Math.floor((endDayStart.getTime() - s.getTime()) / (24 * 60 * 60 * 1000)) + 1;
        periodsCount = Math.max(1, Math.floor(spanDays / periodDays));
      }
      // i = 0 is latest (rightmost)
      for (let i = periodsCount - 1; i >= 0; i--) {
        const startDay = new Date(endDayStart);
        startDay.setDate(endDayStart.getDate() - (i + 1) * periodDays + 1);
        const endOfPeriod = i === 0 ? new Date(baseEnd) : (() => {
          const e = new Date(startDay);
          e.setDate(startDay.getDate() + periodDays - 1);
          e.setHours(23, 59, 59, 999);
          return e;
        })();
        const seed = Math.sin(startDay.getTime() / 1e8) * 10000;
        const r = seed - Math.floor(seed);
        const v = Math.floor(r * 1500) + (r > 0.85 ? 300 : 100);
        const label = i === 0 ? latestLabel : `周期${periodsCount - 1 - i + 1}`;
        // periodsCount-1-i+1: when i = periodsCount-1 (oldest) => 1
        arr.push({ t: startDay, v: Math.max(0, v), rangeStart: startDay, rangeEnd: endOfPeriod, label });
      }
    } else {
      const end = baseEnd.getTime();
      for (let i = cfg.points - 1; i >= 0; i--) {
        const t = new Date(end - i * cfg.stepMs);
        const seed = Math.sin(t.getTime() / 1e8) * 10000;
        const r = seed - Math.floor(seed);
        const v = Math.floor(r * 200) + (r > 0.85 ? 50 : 20);
        arr.push({ t, v: Math.max(0, v) });
      }
    }
    return arr;
  }, [cfg, dim, endDate, startDate]);

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
    rangeStart: d.rangeStart,
    rangeEnd: d.rangeEnd,
    label: d.label,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = `${pathD} L${points[points.length - 1]?.x ?? PL},${PT + innerH} L${points[0]?.x ?? PL},${PT + innerH} Z`;

  const avgV = data.length ? data.reduce((s, d) => s + d.v, 0) / data.length : 0;
  const avgY = PT + innerH - (avgV / maxV) * innerH;

  const yTicks = [0, Math.round(maxV / 4), Math.round(maxV / 2), Math.round((maxV * 3) / 4), maxV];
  const isPeriod = isPeriodBucket(dim);
  const xTickIdx = isPeriod
    ? data.map((_, i) => i)
    : data.length > 8
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
          {isSubHour(dim) && (
            <HoverCard openDelay={100}>
              <HoverCardTrigger asChild>
                <Info className="w-4 h-4 text-[hsl(var(--muted-foreground))] cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent side="top" className="w-auto max-w-xs text-[12px]">
                时间维度为30分钟内时，最长可展示反馈时间的结束时间点往前24小时的数据
              </HoverCardContent>
            </HoverCard>
          )}
          {is1to6Hour(dim) && (
            <HoverCard openDelay={100}>
              <HoverCardTrigger asChild>
                <Info className="w-4 h-4 text-[hsl(var(--muted-foreground))] cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent side="top" className="w-auto max-w-xs text-[12px]">
                时间维度为1～6小时，最长可展示反馈时间的结束时间点往前14天的数据
              </HoverCardContent>
            </HoverCard>
          )}
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
              {points[i]?.label ?? fmtTick(points[i]?.t, dim)}
            </text>
          ))}

          {hover !== null && points[hover] && (() => {
            const p = points[hover];
            const isPeriod = isPeriodBucket(dim);

          {hover !== null && points[hover] && (() => {
            const p = points[hover];
            const isPeriod = isPeriodBucket(dim);
            const tipLabel = isPeriod && p.rangeStart && p.rangeEnd
              ? `${fmtYMD(p.rangeStart)} ~ ${fmtYMD(p.rangeEnd)}`
              : fmtTick(p.t, dim);
            const tipW = isPeriod ? 220 : 155;
            return (
              <g>
                <line x1={p.x} y1={PT} x2={p.x} y2={PT + innerH} stroke="hsl(var(--primary))" strokeDasharray="3 3" opacity="0.5" />
                <circle cx={p.x} cy={p.y} r="5" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
                <g transform={`translate(${Math.min(p.x + 8, W - tipW - 5)}, ${Math.max(p.y - 40, PT)})`}>
                  <rect width={tipW} height="38" rx="4" fill="hsl(var(--popover))" stroke="hsl(var(--border))" />
                  <text x="8" y="15" fontSize="11" fill="hsl(var(--muted-foreground))">{tipLabel}</text>
                  <text x="8" y="30" fontSize="12" fill="hsl(var(--primary))" fontWeight="600">反馈量：{p.v}</text>
                </g>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
};
