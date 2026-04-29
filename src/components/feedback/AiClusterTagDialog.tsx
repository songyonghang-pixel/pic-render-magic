import { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  timeRange: string;
  indicator: string;
}

// Map time range -> ms span to subtract from end time
const rangeMs: Record<string, number> = {
  "10分钟": 10 * 60 * 1000,
  "20分钟": 20 * 60 * 1000,
  "30分钟": 30 * 60 * 1000,
  "1小时": 60 * 60 * 1000,
  "2小时": 2 * 60 * 60 * 1000,
  "3小时": 3 * 60 * 60 * 1000,
  "4小时": 4 * 60 * 60 * 1000,
  "5小时": 5 * 60 * 60 * 1000,
  "6小时": 6 * 60 * 60 * 1000,
  "当日": 24 * 60 * 60 * 1000,
  "本周": 7 * 24 * 60 * 60 * 1000,
};

function fmtDateTime(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

const mockTags = [
  { tag: "不知如何进行应用更新", count: 1866 },
  { tag: "", count: 1487 },
  { tag: "催更", count: 1198 },
  { tag: "其他场景耗电", count: 828 },
  { tag: "天气预报不准", count: 437 },
  { tag: "其他场景发热", count: 432 },
  { tag: "三方应用其他功能异常", count: 430 },
  { tag: "不知如何找回相册内删除的照片/视频", count: 308 },
  { tag: "模糊场景卡顿", count: 251 },
  { tag: "希望短信提高强扰拦截能力", count: 239 },
];

export const AiClusterTagDialog = ({ open, onOpenChange, timeRange, indicator }: Props) => {
  const span = rangeMs[timeRange] ?? rangeMs["10分钟"];
  const [endTime, setEndTime] = useState<string>(() => fmtDateTime(new Date()));
  const [startTime, setStartTime] = useState<string>(() => fmtDateTime(new Date(Date.now() - span)));

  useEffect(() => {
    if (open) {
      const now = new Date();
      setEndTime(fmtDateTime(now));
      setStartTime(fmtDateTime(new Date(now.getTime() - span)));
    }
  }, [open, span]);

  // When user changes start time, end time auto-shifts to maintain interval
  const onStartChange = (v: string) => {
    setStartTime(v);
    const start = new Date(v);
    if (!isNaN(start.getTime())) {
      setEndTime(fmtDateTime(new Date(start.getTime() + span)));
    }
  };

  const rows = useMemo(() => mockTags, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-[15px]">近期数据图 - {indicator}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-[13px] text-[hsl(var(--label-text))]">反馈时间：</span>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => onStartChange(e.target.value)}
            className="h-8 px-2 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm"
          />
          <span className="text-[13px]">至</span>
          <input
            type="datetime-local"
            value={endTime}
            readOnly
            disabled
            className="h-8 px-2 text-[13px] bg-muted border border-[hsl(var(--field-border))] rounded-sm text-[hsl(var(--muted-foreground))] cursor-not-allowed"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-[hsl(var(--muted-foreground))] cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-[12px]">反馈时间筛选的间隔为该预警触发条件你选择的的时间范围，你可选择开始时间进行切换。</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-[13px] text-[hsl(var(--label-text))]">时间范围：</span>
          <span className="text-[13px] text-[hsl(var(--label-text))]">{timeRange}</span>
        </div>

        <div className="mt-3 border border-border rounded-md overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-[hsl(var(--muted))]">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--label-text))]">AI聚类标签</th>
                <th className="text-left px-4 py-2.5 font-medium text-[hsl(var(--label-text))]">数量</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-[hsl(var(--muted)/0.4)]" : ""}>
                  <td className="px-4 py-2.5 text-[hsl(var(--label-text))]">{r.tag || <span className="text-[hsl(var(--muted-foreground))]">—</span>}</td>
                  <td className="px-4 py-2.5 text-[hsl(var(--label-text))]">{r.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 text-[13px] text-[hsl(var(--muted-foreground))]">
          <span>共 50 条</span>
          <select className="h-7 px-2 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm">
            <option>20条/页</option>
            <option>50条/页</option>
          </select>
          <button className="w-7 h-7 flex items-center justify-center border border-[hsl(var(--field-border))] rounded-sm hover:border-primary hover:text-primary"><ChevronLeft className="w-3.5 h-3.5" /></button>
          <button className="w-7 h-7 flex items-center justify-center bg-primary text-primary-foreground rounded-sm">1</button>
          <button className="w-7 h-7 flex items-center justify-center border border-[hsl(var(--field-border))] rounded-sm hover:border-primary hover:text-primary">2</button>
          <button className="w-7 h-7 flex items-center justify-center border border-[hsl(var(--field-border))] rounded-sm hover:border-primary hover:text-primary">3</button>
          <button className="w-7 h-7 flex items-center justify-center border border-[hsl(var(--field-border))] rounded-sm hover:border-primary hover:text-primary"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
