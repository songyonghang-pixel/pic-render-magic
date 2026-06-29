import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { TrendChartCard } from "@/components/feedback/TrendChartCard";

type FeedbackItem = {
  voice: string;
  ch1: string;
  ch2: string;
  model: string;
  opinion: string;
  time: string;
};

const feedbackList: FeedbackItem[] = [
  { voice: "拍照模糊，对焦慢，希望能优化一下", ch1: "应用市场", ch2: "iOS App Store", model: "OPPO Find X7 Ultra", opinion: "相机对焦体验差", time: "2026-06-20 23:58:54" },
  { voice: "充电速度比上一代慢了，电池续航也短", ch1: "社交媒体", ch2: "微博", model: "OnePlus 15", opinion: "充电/续航问题", time: "2026-06-20 21:12:03" },
  { voice: "游戏时机身发热严重，帧率掉得厉害", ch1: "官方社区", ch2: "OPPO社区", model: "OPPO Find X5 Pro 天玑版", opinion: "游戏发热掉帧", time: "2026-06-20 19:42:11" },
  { voice: "希望相机增加增距镜模式，类似vivo", ch1: "社交媒体", ch2: "抖音", model: "OPPO Reno 12 Pro", opinion: "相机功能建议", time: "2026-06-20 17:30:21" },
  { voice: "屏幕显示偏色，希望OTA修复", ch1: "客服反馈", ch2: "在线客服", model: "OnePlus 13", opinion: "屏幕显示问题", time: "2026-06-20 15:08:47" },
  { voice: "系统更新后耗电变快，待机一晚掉电20%", ch1: "应用市场", ch2: "应用宝", model: "OPPO Find N3", opinion: "系统更新耗电异常", time: "2026-06-20 12:55:30" },
  { voice: "外观设计很惊艳，握持手感也不错", ch1: "社交媒体", ch2: "小红书", model: "OnePlus 15", opinion: "外观设计好评", time: "2026-06-20 10:21:18" },
  { voice: "AI智慧体验功能有点鸡肋，希望优化", ch1: "官方社区", ch2: "OPPO社区", model: "OPPO Find X7", opinion: "AI功能体验差", time: "2026-06-20 08:46:05" },
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

const Row = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex items-start justify-between px-4 py-3 border-b border-border last:border-b-0 gap-3">
    <span className="text-[13px] text-[hsl(var(--placeholder))] shrink-0">{label}</span>
    <span className="text-[13px] text-[hsl(var(--label-text))] text-right break-all">
      {value ?? <span className="text-[hsl(var(--placeholder))]">—</span>}
    </span>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 px-4 py-3 bg-card">
    <span className="w-1 h-4 bg-primary rounded-sm" />
    <span className="text-[14px] font-medium text-[hsl(var(--label-text))]">{title}</span>
  </div>
);

export const MobileAlertDetail = () => {
  const [inner, setInner] = useState<"trend" | "detail">("trend");
  const [xAxis, setXAxis] = useState(xAxisOptions[0]);
  const [openItem, setOpenItem] = useState<FeedbackItem | null>(null);

  return (
    <div className="min-h-screen bg-[hsl(var(--page-bg))] flex justify-center py-6">
      {/* Phone frame */}
      <div className="w-[430px] bg-card rounded-[36px] shadow-2xl border-[10px] border-[hsl(var(--label-text))] overflow-hidden flex flex-col relative" style={{ height: "820px" }}>
        {/* Status bar */}
        <div className="h-7 bg-[hsl(var(--page-bg))] flex items-center justify-between px-6 text-[11px] text-[hsl(var(--label-text))] shrink-0">
          <span>9:41</span>
          <span>●●● </span>
        </div>

        {/* Title bar */}
        <div className="h-12 bg-card border-b border-border flex items-center px-3 shrink-0">
          <ChevronLeft
            className="w-5 h-5 text-[hsl(var(--label-text))] cursor-pointer"
            onClick={() => openItem && setOpenItem(null)}
          />
          <span className="flex-1 text-center text-[15px] font-medium text-[hsl(var(--label-text))]">
            {openItem ? "反馈详情" : "FMS预警详情"}
          </span>
          <span className="w-5" />
        </div>

        {!openItem && (
          /* Inner tabs */
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
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto bg-[hsl(var(--page-bg))]">
          {openItem ? (
            <div className="space-y-2 pb-4">
              <SectionHeader title="基础信息" />
              <div className="bg-card">
                <Row label="反馈原声" value={openItem.voice} />
                <Row label="译文" />
                <Row label="反馈时间" value={openItem.time} />
                <Row label="原声ID" value="6a36b900fbfff62d2d4c9bc6" />
                <Row label="机型营销名" value={openItem.model} />
                <Row label="品牌" value={openItem.model.toLowerCase().startsWith("oneplus") ? "OnePlus" : "OPPO"} />
                <Row label="机型" value="PFFM20" />
                <Row label="OS版本" value="16.0.0" />
                <Row label="OTA版本" value="PFFM20_11.J.19_4190_202603251938" />
                <Row label="内外销" value="内销" />
                <Row label="国家/地区" value="中国" />
                <Row label="省份" value="河南" />
                <Row label="用户名称" />
                <Row label="反馈渠道一级" value={openItem.ch1} />
                <Row label="反馈渠道二级" value={openItem.ch2} />
              </div>
              <SectionHeader title="社媒信息" />
              <div className="bg-card">
                <Row label="原文链接" />
                <Row label="发布时间" value={openItem.time} />
                <Row label="作者" />
                <Row label="转发量" value="0" />
                <Row label="点赞量" value="0" />
                <Row label="评论量" value="0" />
              </div>
            </div>
          ) : inner === "trend" ? (
            <div className="p-2 space-y-2">
              <TrendChartCard hideDimension hideActions compact />
              {/* 分布情况 */}
              <div className="bg-card rounded-md px-3 py-3">
                <div className="text-primary text-[13px] font-medium mb-2">分布情况</div>
                <div className="flex items-center gap-1.5 mb-3 overflow-x-auto">
                  <span className="text-[11px] text-[hsl(var(--label-text))] shrink-0">横轴：</span>
                  {xAxisOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setXAxis(opt)}
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] border transition-colors ${
                        xAxis === opt
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-[hsl(var(--label-text))] border-[hsl(var(--field-border))]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  {(() => {
                    const max = Math.max(...distributionData.map((d) => d.value));
                    return distributionData.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-[88px] shrink-0 text-[11px] text-[hsl(var(--label-text))] truncate" title={d.name}>
                          {d.name}
                        </span>
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
                <div
                  key={i}
                  onClick={() => setOpenItem(f)}
                  className="bg-card rounded-md p-3 border border-border cursor-pointer hover:border-primary/40 transition-colors"
                >
                  <div className="text-[13px] text-[hsl(var(--label-text))] leading-relaxed">{f.voice}</div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-primary truncate">{f.model}</span>
                    <span className="text-[hsl(var(--placeholder))] shrink-0">{f.time}</span>
                  </div>
                  <div className="mt-1.5 text-[11px] text-[hsl(var(--label-text))]">
                    <span className="text-[hsl(var(--placeholder))]">观点：</span>
                    {f.opinion}
                  </div>
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
