import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { TrendChartCard } from "@/components/feedback/TrendChartCard";

const feedbackList = [
  { voice: "拍照模糊，对焦慢，希望能优化一下", ch1: "应用市场", ch2: "iOS App Store" },
  { voice: "充电速度比上一代慢了，电池续航也短", ch1: "社交媒体", ch2: "微博" },
  { voice: "游戏时机身发热严重，帧率掉得厉害", ch1: "官方社区", ch2: "OPPO社区" },
  { voice: "希望相机增加增距镜模式，类似vivo", ch1: "社交媒体", ch2: "抖音" },
  { voice: "屏幕显示偏色，希望OTA修复", ch1: "客服反馈", ch2: "在线客服" },
  { voice: "系统更新后耗电变快，待机一晚掉电20%", ch1: "应用市场", ch2: "应用宝" },
  { voice: "外观设计很惊艳，握持手感也不错", ch1: "社交媒体", ch2: "小红书" },
  { voice: "AI智慧体验功能有点鸡肋，希望优化", ch1: "官方社区", ch2: "OPPO社区" },
];

const distributionData = [
  { name: "拍照/拍视频体验", value: 10680 },
  { name: "硬件配置", value: 9620 },
  { name: "产品整体体验", value: 9510 },
  { name: "外观/id设计", value: 8800 },
  { name: "性能功耗热体验", value: 7020 },
  { name: "游戏体验", value: 3450 },
  { name: "系统易用性", value: 2380 },
  { name: "做工质量/耐用性", value: 2180 },
  { name: "屏幕", value: 1960 },
  { name: "价格/性价比", value: 1410 },
];

const xAxisOptions = ["AI五级标签", "营销机型名", "OS版本", "反馈来源"];


export const MobileAlertDetail = () => {
  const [inner, setInner] = useState<"trend" | "detail">("trend");
  const [xAxis, setXAxis] = useState(xAxisOptions[0]);


  return (
    <div className="min-h-screen bg-[hsl(var(--page-bg))] flex justify-center py-6">
      {/* Phone frame */}
      <div className="w-[430px] bg-card rounded-[36px] shadow-2xl border-[10px] border-[hsl(var(--label-text))] overflow-hidden flex flex-col" style={{ height: "820px" }}>
        {/* Status bar */}
        <div className="h-7 bg-[hsl(var(--page-bg))] flex items-center justify-between px-6 text-[11px] text-[hsl(var(--label-text))] shrink-0">
          <span>9:41</span>

          <span>●●● </span>
        </div>

        {/* Title bar */}
        <div className="h-12 bg-card border-b border-border flex items-center px-3 shrink-0">
          <ChevronLeft className="w-5 h-5 text-[hsl(var(--label-text))]" />
          <span className="flex-1 text-center text-[15px] font-medium text-[hsl(var(--label-text))]">FMS预警详情</span>
          <span className="w-5" />
        </div>

        {/* Inner tabs */}
        <div className="flex border-b border-border shrink-0 bg-card">
          {([
            { key: "trend", label: "反馈趋势" },
            { key: "detail", label: "反馈详情" },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setInner(t.key)}
              className={`flex-1 py-3 text-[13px] relative transition-colors ${
                inner === t.key
                  ? "text-primary font-medium after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-10 after:h-0.5 after:bg-primary"
                  : "text-[hsl(var(--label-text))]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-[hsl(var(--page-bg))]">
          {inner === "trend" ? (
            <div className="p-2 space-y-2">
              <TrendChartCard hideDimension hideActions compact />
              {/* 分布情况 */}
              <div className="bg-card rounded-md px-3 py-3">
                <div className="text-primary text-[13px] font-medium mb-2">分布情况</div>
                <div className="text-[11px] text-[hsl(var(--placeholder))] mb-2">横轴：AI五级标签 · 产品体验</div>
                <div className="space-y-1.5">
                  {(() => {
                    const max = Math.max(...distributionData.map(d => d.value));
                    return distributionData.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-[88px] shrink-0 text-[11px] text-[hsl(var(--label-text))] truncate" title={d.name}>{d.name}</span>
                        <div className="flex-1 h-4 bg-[hsl(var(--accent))] rounded-sm overflow-hidden">
                          <div
                            className="h-full bg-[hsl(38,95%,65%)] rounded-sm"
                            style={{ width: `${(d.value / max) * 100}%` }}
                          />
                        </div>
                        <span className="w-[48px] text-right text-[11px] text-primary tabular-nums">{d.value.toLocaleString()}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

          ) : (
            <div className="p-3 space-y-2">
              {feedbackList.map((f, i) => (
                <div key={i} className="bg-card rounded-md p-3 border border-border">
                  <div className="text-[13px] text-[hsl(var(--label-text))] leading-relaxed">{f.voice}</div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 text-[11px] rounded-sm bg-[hsl(var(--primary)/0.08)] text-primary border border-[hsl(var(--primary)/0.2)]">
                      {f.ch1}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] rounded-sm bg-[hsl(var(--accent))] text-[hsl(var(--label-text))] border border-border">
                      {f.ch2}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileAlertDetail;
