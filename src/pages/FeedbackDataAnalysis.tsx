import { useState } from "react";
import { ChevronRight, Download, Table as TableIcon } from "lucide-react";
import { SingleSelect } from "@/components/feedback/SingleSelect";
import { MultiSelect } from "@/components/feedback/MultiSelect";
import { marketingNameOptions } from "@/components/feedback/filterData";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";

const feedbackTypeOptions = [
  { label: "需求" }, { label: "bug" }, { label: "认知" }, { label: "其他" },
];
const sentimentOptions = [{ label: "正面" }, { label: "负面" }, { label: "无情感" }];

const xAxisOptions = ["AI五级标签", "营销机型名", "OS版本", "反馈来源"];

const barData = [
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
  { name: "ai智慧体验", value: 980 },
];

const clusterTags = [
  { rank: 1, name: "其他场景耗电", count: 303 },
  { rank: 2, name: "希望相机增加类似vivo的增距镜模式", count: 223 },
  { rank: 3, name: "其他场景发热", count: 134 },
  { rank: 4, name: "模糊场景卡顿", count: 133 },
  { rank: 5, name: "拍照效果差", count: 92 },
  { rank: 6, name: "游戏发热", count: 48 },
  { rank: 7, name: "相机不对焦/模糊", count: 47 },
  { rank: 8, name: "相机拍照/拍视频效果差", count: 45 },
  { rank: 9, name: "充电慢", count: 33 },
  { rank: 10, name: "希望声音与振动优化音质效果", count: 32 },
];

const versionData = [
  { name: "16.0.0", value: 92.66, color: "hsl(0, 75%, 65%)" },
  { name: "15.0.2", value: 4.59, color: "hsl(28, 90%, 60%)" },
  { name: "16.1", value: 1.37, color: "hsl(35, 90%, 65%)" },
  { name: "15.0", value: 0.92, color: "hsl(45, 90%, 60%)" },
  { name: "13.1.1", value: 0.46, color: "hsl(140, 50%, 55%)" },
];

const trendData = [
  { date: "2026-04-27", value: 157 },
  { date: "2026-04-28", value: 146 },
];

const tableRows = [
  { tag: "其他场景耗电", total: 303, demand: 3, bug: 293, cognition: 0, other: 303 },
  { tag: "希望相机增加类似vivo的增距镜模式", total: 223, demand: 0, bug: 218, cognition: 1, other: 223 },
  { tag: "其他场景发热", total: 134, demand: 2, bug: 124, cognition: 3, other: 134 },
  { tag: "模糊场景卡顿", total: 133, demand: 1, bug: 122, cognition: 4, other: 133 },
  { tag: "拍照效果差", total: 92, demand: 0, bug: 91, cognition: 0, other: 92 },
  { tag: "游戏发热", total: 48, demand: 0, bug: 48, cognition: 0, other: 48 },
  { tag: "相机不对焦/模糊", total: 47, demand: 1, bug: 45, cognition: 0, other: 47 },
  { tag: "相机拍照/拍视频效果差", total: 45, demand: 3, bug: 42, cognition: 0, other: 45 },
  { tag: "充电慢", total: 33, demand: 3, bug: 32, cognition: 1, other: 33 },
  { tag: "希望声音与振动优化音质效果", total: 32, demand: 0, bug: 32, cognition: 0, other: 32 },
];

export const FeedbackDataAnalysis = () => {
  const [xAxis, setXAxis] = useState("AI五级标签");
  const [trendDim, setTrendDim] = useState<"日维度" | "周维度" | "月维度">("日维度");
  const [distView, setDistView] = useState<"版本分布" | "机型分布">("版本分布");
  const [selectedTag, setSelectedTag] = useState(clusterTags[0].name);

  return (
    <div className="min-h-screen bg-[hsl(var(--page-bg))]">
      {/* breadcrumb */}
      <div className="bg-card border-b border-border px-6 py-3 flex items-center text-[13px] text-[hsl(var(--breadcrumb))]">
        <span>反馈查询</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
        <span>原声查询</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
        <span className="text-[hsl(var(--breadcrumb-active))]">数据分析</span>
      </div>

      {/* Header info card */}
      <div className="px-6 pt-5">
        <div className="bg-[hsl(var(--accent))] rounded-md px-6 py-5 relative">
          <div className="space-y-3 text-[13px]">
            <div className="flex">
              <span className="w-28 text-[hsl(var(--label-text))]">反馈原声数据：</span>
              <a className="text-primary cursor-pointer hover:underline">点击查看</a>
            </div>
            <div className="flex">
              <span className="w-28 text-[hsl(var(--label-text))]">分析人：</span>
              <span className="text-[hsl(var(--label-text))]">宋永航(80261667)</span>
            </div>
            <div className="flex">
              <span className="w-28 text-[hsl(var(--label-text))]">包含反馈数量：</span>
              <span className="text-[hsl(var(--label-text))]">45892条(按标签可被拆分为45892条,其中AI聚类标签反馈数30072条)</span>
            </div>
          </div>
          <div className="absolute right-6 bottom-5 flex gap-2">
            <button className="h-8 px-5 text-[13px] rounded-full border border-[hsl(var(--field-border))] text-[hsl(var(--label-text))] bg-card hover:border-primary hover:text-primary transition-colors">
              保存
            </button>
            <button className="h-8 px-5 text-[13px] rounded-full border border-[hsl(var(--field-border))] text-[hsl(var(--placeholder))] bg-muted cursor-not-allowed">
              分享链接
            </button>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="px-6 mt-4">
        <div className="bg-card rounded-md px-6 py-5">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-[13px] font-medium text-[hsl(var(--label-text))] shrink-0">过滤条件</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[hsl(var(--label-text))]">反馈类型</span>
              <div className="w-[200px]">
                <MultiSelect placeholder="请选择反馈类型" options={feedbackTypeOptions} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[hsl(var(--label-text))]">情感</span>
              <div className="w-[200px]">
                <MultiSelect placeholder="请选择类型" options={sentimentOptions} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[hsl(var(--label-text))]">机型营销名</span>
              <div className="w-[220px]">
                <MultiSelect placeholder="请选择机型营销名" options={marketingNameOptions} />
              </div>
            </div>
            <div className="ml-auto">
              <button className="h-8 px-6 text-[13px] bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
                查询
              </button>
            </div>
          </div>

          {/* X-axis selector */}
          <div className="flex items-center gap-6 mt-5">
            <span className="text-[13px] font-medium text-[hsl(var(--label-text))] shrink-0">横轴</span>
            <div className="flex items-center gap-6">
              {xAxisOptions.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="xaxis"
                    checked={xAxis === opt}
                    onChange={() => setXAxis(opt)}
                    className="w-3.5 h-3.5 accent-primary"
                  />
                  <span className={`text-[13px] ${xAxis === opt ? "text-primary" : "text-[hsl(var(--label-text))]"}`}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3 text-primary">
              <button className="hover:opacity-80"><TableIcon className="w-5 h-5" /></button>
              <button className="hover:opacity-80"><Download className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Bar chart */}
          <div className="mt-5">
            <div className="text-primary text-[14px] font-medium mb-2">产品体验</div>
            <div className="h-[420px] w-full">
              <ResponsiveContainer>
                <BarChart data={barData} margin={{ top: 30, right: 20, left: 10, bottom: 80 }}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "hsl(var(--label-text))", fontSize: 12 }}
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={80}
                  />
                  <YAxis tick={{ fill: "hsl(var(--label-text))", fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "hsl(var(--accent))" }} />
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
                  <Bar dataKey="value" name="反馈量" fill="hsl(38, 95%, 70%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Cluster + distribution + trend */}
      <div className="px-6 mt-4">
        <div className="bg-card rounded-md flex">
          {/* Left: cluster list */}
          <div className="w-[340px] border-r border-border p-5 shrink-0">
            <div className="text-primary text-[14px] font-medium">AI聚类标签TOP 10</div>
            <div className="text-[12px] text-[hsl(var(--placeholder))] mt-1 mb-3">选中后可展开该标签分析详情</div>
            <div className="space-y-1">
              {clusterTags.map((t) => {
                const active = t.name === selectedTag;
                const rankColor =
                  t.rank === 1 ? "bg-[hsl(214,90%,55%)]" :
                  t.rank === 2 ? "bg-[hsl(28,90%,55%)]" :
                  t.rank === 3 ? "bg-[hsl(38,90%,55%)]" :
                  "bg-[hsl(var(--placeholder))]";
                return (
                  <div
                    key={t.rank}
                    onClick={() => setSelectedTag(t.name)}
                    className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer text-[13px] ${
                      active ? "bg-[hsl(var(--accent))]" : "hover:bg-[hsl(var(--accent)/0.5)]"
                    }`}
                  >
                    {t.rank <= 3 ? (
                      <span className={`w-5 h-5 rounded-full text-white text-[11px] flex items-center justify-center ${rankColor}`}>
                        {t.rank}
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-[hsl(var(--field-border))] text-[11px] flex items-center justify-center text-[hsl(var(--placeholder))]">
                        {t.rank}
                      </span>
                    )}
                    <span className="flex-1 text-[hsl(var(--label-text))] truncate">{t.name}</span>
                    <span className="text-primary">{t.count} 例</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: detail */}
          <div className="flex-1 p-5 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[16px] font-medium text-[hsl(var(--label-text))]">{selectedTag}</span>
                <a className="text-[13px] text-primary cursor-pointer hover:underline">查看原声</a>
              </div>
              <button className="text-primary"><Download className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Pie */}
              <div className="border border-border rounded-md p-4">
                <div className="flex justify-end mb-2">
                  <div className="inline-flex bg-muted rounded-full p-0.5 text-[12px]">
                    {(["版本分布", "机型分布"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setDistView(v)}
                        className={`px-3 py-1 rounded-full transition-colors ${
                          distView === v ? "bg-primary text-primary-foreground" : "text-[hsl(var(--label-text))]"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={versionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        label={(p) => `${p.name}\n${p.value}%`}
                        labelLine
                      >
                        {versionData.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trend */}
              <div className="border border-border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-medium text-[hsl(var(--label-text))]">反馈量趋势</span>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex bg-muted rounded-full p-0.5 text-[12px]">
                      {(["日维度", "周维度", "月维度"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setTrendDim(v)}
                          className={`px-3 py-1 rounded-full transition-colors ${
                            trendDim === v ? "bg-primary text-primary-foreground" : "text-[hsl(var(--label-text))]"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <button className="text-primary"><TableIcon className="w-4 h-4" /></button>
                    <button className="text-primary"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer>
                    <AreaChart data={trendData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(214, 90%, 60%)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(214, 90%, 60%)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: "hsl(var(--label-text))", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(var(--label-text))", fontSize: 12 }} />
                      <Tooltip />
                      <Legend verticalAlign="top" />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="反馈量"
                        stroke="hsl(214, 90%, 60%)"
                        fill="url(#trendFill)"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "hsl(var(--card))", stroke: "hsl(214, 90%, 60%)", strokeWidth: 2 }}
                        label={{ position: "top", fill: "hsl(var(--label-text))", fontSize: 12 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 mt-4 pb-10">
        <div className="bg-card rounded-md p-5">
          <div className="flex justify-end mb-3">
            <a className="text-primary text-[13px] cursor-pointer hover:underline flex items-center gap-1">
              <Download className="w-4 h-4" /> 导出
            </a>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[hsl(var(--accent))] text-[hsl(var(--label-text))]">
                <th className="text-left py-3 px-4 font-medium">AI聚类标签</th>
                <th className="text-left py-3 px-4 font-medium">总反馈量</th>
                <th className="text-left py-3 px-4 font-medium">需求</th>
                <th className="text-left py-3 px-4 font-medium">bug</th>
                <th className="text-left py-3 px-4 font-medium">认知</th>
                <th className="text-left py-3 px-4 font-medium">其他</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.tag}</td>
                  <td className="py-3 px-4 text-primary">{r.total}</td>
                  <td className={`py-3 px-4 ${r.demand ? "text-primary" : "text-[hsl(var(--label-text))]"}`}>{r.demand}</td>
                  <td className="py-3 px-4 text-primary">{r.bug}</td>
                  <td className={`py-3 px-4 ${r.cognition ? "text-primary" : "text-[hsl(var(--label-text))]"}`}>{r.cognition}</td>
                  <td className="py-3 px-4 text-primary">{r.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-center gap-3 mt-4 text-[13px] text-[hsl(var(--label-text))]">
            <span>共 1929 条</span>
            <div className="w-[90px]">
              <SingleSelect options={[{ label: "10条/页" }, { label: "20条/页" }, { label: "50条/页" }]} value="10条/页" />
            </div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded border border-[hsl(var(--field-border))] hover:border-primary hover:text-primary">{"<"}</button>
              {[1, 2, 3, 4, 5, 6].map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 rounded ${p === 1 ? "bg-primary text-primary-foreground" : "border border-[hsl(var(--field-border))] hover:border-primary hover:text-primary"}`}
                >
                  {p}
                </button>
              ))}
              <span className="px-1">...</span>
              <button className="w-9 h-7 rounded border border-[hsl(var(--field-border))] hover:border-primary hover:text-primary">193</button>
              <button className="w-7 h-7 rounded border border-[hsl(var(--field-border))] hover:border-primary hover:text-primary">{">"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDataAnalysis;
