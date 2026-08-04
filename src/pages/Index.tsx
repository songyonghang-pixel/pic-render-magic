import { Section } from "@/components/feedback/Section";
import { Field, TextInput, SelectInput } from "@/components/feedback/FormField";
import { MultiSelect } from "@/components/feedback/MultiSelect";
import { SingleSelect } from "@/components/feedback/SingleSelect";
import { PhoneTimeWindow } from "@/components/feedback/PhoneTimeWindow";
import { CascadeMultiSelect } from "@/components/feedback/CascadeMultiSelect";
import { SeparateMonitor } from "@/components/feedback/SeparateMonitor";
import { RecentDataDialog } from "@/components/feedback/RecentDataDialog";
import { AiClusterTagDialog } from "@/components/feedback/AiClusterTagDialog";
import { AiCreateRuleDialog, AiMsg, AiRuleFilters } from "@/components/feedback/AiCreateRuleDialog";

import avgLegend from "@/assets/avg-legend.png.asset.json";

const aiTagLevels = ["一级标签", "二级标签", "三级标签", "四级标签", "五级标签"];

const alertTypeOptions = [{ label: "实时" }, { label: "统计" }];
const alertListOptions = [
  { label: "核心体验预警名单" },
  { label: "影像团队名单" },
  { label: "系统性能名单" },
  { label: "海外运营名单" },
  { label: "研发值班名单" },
];
const feedbackTypeOptions = [{ label: "认知" }, { label: "需求" }, { label: "bug" }, { label: "其他" }];
const sentimentOptions = [{ label: "正面" }, { label: "负面" }, { label: "无情感" }];
const alertLevelOptions = [{ label: "S" }, { label: "A" }, { label: "B" }, { label: "C" }, { label: "D" }];
const warningIndicatorOptions = [{ label: "反馈量" }, { label: "AI聚类标签聚类量" }];
const timeRangeOptions = [
  { label: "10分钟" }, { label: "20分钟" }, { label: "30分钟" },
  { label: "1小时" }, { label: "2小时" }, { label: "3小时" },
  { label: "4小时" }, { label: "5小时" }, { label: "6小时" },
  { label: "当日" }, { label: "本周" },
];
const timeRangeOptionsStat = [...timeRangeOptions, { label: "昨日" }, { label: "近7日" }, { label: "近30日" }];
const dailyLikeRanges = ["当日", "近7日", "近30日", "昨日"];
const compareOperators = [{ label: "大于" }, { label: "大于等于" }, { label: "小于" }, { label: "小于等于" }];
const calcMethodOptions = [
  { label: "值" },
  { label: "环比增长率" },
  { label: "环比增量" },
  { label: "较平均值的增量" },
  { label: "较平均值的增长率" },
  { label: "平均值" },
];
const percentCalcMethods = ["环比增长率", "较平均值的增长率"];
const multiPushTimeRanges = ["当日", "本周", "昨日", "近7日", "近30日"];
const monitorFreqOptions = [
  { label: "10分钟" }, { label: "20分钟" }, { label: "30分钟" },
  { label: "1小时" }, { label: "2小时" }, { label: "3小时" },
  { label: "4小时" }, { label: "5小时" }, { label: "6小时" },
];
const productTeamOptions = [
  { label: "三方专项" }, { label: "通信与互联" }, { label: "小布记忆" },
  { label: "DFX&底软" }, { label: "媒体与游戏" }, { label: "中国区" },
  { label: "短距" }, { label: "系统安全" }, { label: "通信协议" },
  { label: "平台安全" }, { label: "应用安全" },
];
import {
  aiTagOptions,
  brandOptions,
  marketingNameOptions,
  osVersionOptions,
  otaVersionOptions,
  feedbackSourceOptions,
  countryOptions,
  defectTypeOptions,
  domesticExportOptions,
  socialMediaTypeOptions,
  warningImportanceOptions,
  fanCountOperators,
} from "@/components/feedback/filterData";
import { ChevronRight, Plus, Copy, HelpCircle, Trash2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FeedbackDataAnalysis from "./FeedbackDataAnalysis";
import AlertRules from "./AlertRules";
import AlertList from "./AlertList";
import MobileAlertDetail from "./MobileAlertDetail";

type TabKey = "rules" | "alert" | "list" | "analysis" | "mobile";
const pathToTab: Record<string, TabKey> = { "/rules": "rules", "/alert": "alert", "/list": "list", "/analysis": "analysis", "/mobile": "mobile" };
const tabToPath: Record<TabKey, string> = { rules: "/rules", alert: "/alert", list: "/list", analysis: "/analysis", mobile: "/mobile" };

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab: TabKey = pathToTab[location.pathname] ?? "rules";
  const [activeTab, setActiveTabState] = useState<TabKey>(initialTab);
  const setActiveTab = (t: TabKey) => { setActiveTabState(t); navigate(tabToPath[t]); };
  useEffect(() => { const t = pathToTab[location.pathname]; if (t && t !== activeTab) setActiveTabState(t); }, [location.pathname]);
  const [fanOp, setFanOp] = useState<string[]>([]);
  const [alertType, setAlertType] = useState<string>("实时");
  const [ruleName, setRuleName] = useState<string>("");
  const [kwField, setKwField] = useState<string>("反馈原声");
  const [kwOp, setKwOp] = useState<string>("包含");
  const [contentDataVals, setContentDataVals] = useState<string[]>([]);
  const [ruleNameKey, setRuleNameKey] = useState<number>(0);

  const [aiTagVals, setAiTagVals] = useState<string[]>([]);
  const [marketingVals, setMarketingVals] = useState<string[]>([]);
  const [countryVals, setCountryVals] = useState<string[]>([]);
  const [osVals, setOsVals] = useState<string[]>([]);

  const [aiTagSep, setAiTagSep] = useState(false);
  const [aiTagLevel, setAiTagLevel] = useState("二级标签");
  const [marketingSep, setMarketingSep] = useState(false);
  const [countrySep, setCountrySep] = useState(false);
  const [osSep, setOsSep] = useState(false);
  const [perLevelNotify, setPerLevelNotify] = useState(false);
  const notifyPersonOptions = [
    { label: "张三" },
    { label: "李四" },
    { label: "王五" },
    { label: "赵六" },
    { label: "钱七" },
  ];
  const [adminUser, setAdminUser] = useState<string>("当前用户（我）");
  const [phoneNotify, setPhoneNotify] = useState(false);
  const [phonePeople, setPhonePeople] = useState<string[]>([]);
  const [ttNotify, setTtNotify] = useState(true);
  const [ttGroupNotify, setTtGroupNotify] = useState(false);
  const [alertLists, setAlertLists] = useState<string[]>([]);
  const [alertPeople, setAlertPeople] = useState<string[]>([]);
  const [groupMentions, setGroupMentions] = useState<string[]>([]);
  const [ttGroups, setTtGroups] = useState<{ id: string; url: string; mentions: string[] }[]>([
    { id: "g1", url: "", mentions: [] },
  ]);
  const [levelTt, setLevelTt] = useState<Record<string, boolean>>({});
  const [levelTtGroup, setLevelTtGroup] = useState<Record<string, boolean>>({});
  const [levelTtGroups, setLevelTtGroups] = useState<Record<string, { id: string; url: string; mentions: string[] }[]>>({});
const [levelPhoneNotify, setLevelPhoneNotify] = useState<Record<string, boolean>>({});
const [levelAlertPeople, setLevelAlertPeople] = useState<Record<string, string[]>>({});
const [collaborators, setCollaborators] = useState<string[]>([]);
  const [monitorFreq, setMonitorFreq] = useState<string>("");
  const [freqPeriod, setFreqPeriod] = useState<string>("间隔");
  const [freqTime, setFreqTime] = useState<string>("09:00");
  const [freqWeekdays, setFreqWeekdays] = useState<string[]>([]);
  const [freqMonthDays, setFreqMonthDays] = useState<string[]>([]);

  // AI-controlled filter fields
  const [feedbackTypeVals, setFeedbackTypeVals] = useState<string[]>([]);
  const [sentimentVals, setSentimentVals] = useState<string[]>([]);
  const [alertLevelVal, setAlertLevelVal] = useState<string>("");

  // AI create rule dialog
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiMsg[]>([]);

  const handleAiApply = (f: AiRuleFilters) => {
    if (f.alertType) setAlertType(f.alertType);
    if (f.aiTags) setAiTagVals(f.aiTags);
    if (f.marketingNames) setMarketingVals(f.marketingNames);
    if (f.countries) setCountryVals(f.countries);
    if (f.feedbackTypes) setFeedbackTypeVals(f.feedbackTypes);
    if (f.sentiments) setSentimentVals(f.sentiments);
    if (f.alertLevel) setAlertLevelVal(f.alertLevel);
    if (f.triggerConditions && f.triggerConditions.length > 0) {
      setStatConds(
        f.triggerConditions.map((c, i) => ({
          id: Date.now() + i,
          level: c.level || "",
          subs: (c.subs && c.subs.length > 0 ? c.subs : [{}]).map((s, j) => ({
            id: Date.now() + i * 100 + j + 1,
            indicator: s.indicator || "",
            timeRange: s.timeRange || "",
            calcMethod: s.calcMethod || "",
          })),
        }))
      );
    }
  };

  type SubCond = { id: number; indicator: string; timeRange: string; calcMethod: string };
  type StatCond = { id: number; level: string; subs: SubCond[] };
  const [statConds, setStatConds] = useState<StatCond[]>([{ id: 1, level: "", subs: [{ id: 1, indicator: "", timeRange: "", calcMethod: "" }] }]);
  const [chartOpenId, setChartOpenId] = useState<{ condId: number; subId: number } | null>(null);
  const updateCondLevel = (id: number, level: string) => {
    setStatConds((prev) => prev.map((c) => c.id === id ? { ...c, level } : c));
  };
  const updateSub = (condId: number, subId: number, patch: Partial<SubCond>) => {
    setStatConds((prev) => prev.map((c) => {
      if (c.id !== condId) return c;
      return {
        ...c,
        subs: c.subs.map((s) => {
          if (s.id !== subId) return s;
          const next = { ...s, ...patch };
          const showCalc = next.indicator === "反馈量" && (dailyLikeRanges.includes(next.timeRange) || next.timeRange === "本周");
          if (!showCalc) {
            next.calcMethod = "";
          } else if (next.calcMethod === "平均值" && !["当日", "本周", "昨日", "近7日", "近30日"].includes(next.timeRange)) {
            next.calcMethod = "";
          }
          return next;
        }),
      };
    }));
  };
  const addCond = () => {
    if (statConds.length >= 10) return;
    setStatConds((prev) => [...prev, { id: Date.now(), level: "", subs: [{ id: Date.now() + 1, indicator: "", timeRange: "", calcMethod: "" }] }]);
  };
  const removeCond = (id: number) => setStatConds((prev) => prev.filter((c) => c.id !== id));
  const addSub = (condId: number) => {
    setStatConds((prev) => prev.map((c) => {
      if (c.id !== condId || c.subs.length >= 10) return c;
      return { ...c, subs: [...c.subs, { id: Date.now(), indicator: "", timeRange: "", calcMethod: "" }] };
    }));
  };
  const removeSub = (condId: number, subId: number) => {
    setStatConds((prev) => prev.map((c) => c.id !== condId ? c : { ...c, subs: c.subs.filter((s) => s.id !== subId) }));
  };
  const activeChartCond = (() => {
    if (!chartOpenId) return undefined;
    const c = statConds.find((x) => x.id === chartOpenId.condId);
    return c?.subs.find((s) => s.id === chartOpenId.subId);
  })();

  const aiDisabled = aiTagVals.length < 2;
  const marketingDisabled = marketingVals.length < 2;
  const countryDisabled = countryVals.length < 2;

  useEffect(() => { if (aiDisabled) setAiTagSep(false); }, [aiDisabled]);
  useEffect(() => { if (marketingDisabled) setMarketingSep(false); }, [marketingDisabled]);
  useEffect(() => { if (countryDisabled) setCountrySep(false); }, [countryDisabled]);
  return (
    <div className="min-h-screen bg-[hsl(var(--page-bg))]">
      {/* Top tabs */}
      <div className="bg-card border-b border-border px-6 flex items-center gap-6 sticky top-0 z-30">
        {([
          { key: "rules", label: "预警规则" },
          { key: "alert", label: "新建预警" },
          { key: "list", label: "预警列表" },
          { key: "analysis", label: "反馈原声分析" },
          { key: "mobile", label: "预警详情手机端" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`relative py-3 text-[14px] transition-colors ${
              activeTab === t.key
                ? "text-primary font-medium after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-px after:h-0.5 after:bg-primary"
                : "text-[hsl(var(--label-text))] hover:text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "analysis" ? (
        <FeedbackDataAnalysis />
      ) : activeTab === "mobile" ? (
        <MobileAlertDetail />
      ) : activeTab === "rules" ? (
        <AlertRules onCreate={(t) => { if (t) setAlertType(t); setActiveTab("alert"); }} onAiCreate={(t) => { if (t) setAlertType(t); setActiveTab("alert"); setAiDialogOpen(true); }} onCopy={(name, type) => { setRuleName(name); setAlertType(type); setRuleNameKey((k) => k + 1); setActiveTab("alert"); }} />
      ) : activeTab === "list" ? (
        <AlertList onShowAnalysis={() => setActiveTab("analysis")} />
      ) : (
        <>
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border px-6 py-3 flex items-center text-[13px] text-[hsl(var(--breadcrumb))]">
        <span>预警监控</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
        <span>预警规则</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
        <span className="text-[hsl(var(--breadcrumb-active))]">新增</span>
      </div>

      {/* Form */}
      <div className="px-6 py-5 pb-24">
        {/* 预警规则名称 */}
        <Section
          title="预警规则名称"
          extra={
            <button
              onClick={() => setAiDialogOpen(true)}
              className="h-7 px-3 text-[12px] rounded-sm border border-primary text-primary bg-gradient-to-r from-[hsl(var(--primary)/0.08)] to-transparent hover:bg-primary hover:text-primary-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI 创建预警规则
            </button>
          }
        >
          <Field label="规则名称" required>
            <TextInput key={ruleNameKey} value={ruleName} placeholder="请输入规则名称" className="max-w-xl" />
          </Field>
          <Field label="产品团队" className="mt-3">
            <div className="flex items-center gap-2 max-w-xl">
              <div className="flex-1">
                <MultiSelect placeholder="请选择产品团队" options={productTeamOptions} />
              </div>
              <span title="该选项近用作预警方便规则归属和后续查询，不过滤任何预警数据" className="cursor-help">
                <HelpCircle className="w-3.5 h-3.5 text-[hsl(var(--placeholder))]" />
              </span>
            </div>
          </Field>
        </Section>

        {/* 预警类型 */}
        <Section title="预警类型">
          <div className="flex items-center">
            <Field label="预警类型" required labelWidth="w-20">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {alertTypeOptions.map((opt) => {
                    const active = alertType === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setAlertType(opt.label)}
                        className={`h-8 px-5 text-[13px] rounded-sm border transition-colors ${
                          active
                            ? "border-primary text-primary bg-[hsl(var(--primary)/0.08)] font-medium"
                            : "border-[hsl(var(--field-border))] text-[hsl(var(--label-text))] bg-card hover:border-primary hover:text-primary"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[12px] text-[hsl(var(--muted-foreground))]">
                  <span className="text-destructive">*</span> 统计为监控一段时间内的反馈数据或变化，因数据采集及处理，预计会延迟10～20分钟
                </span>
              </div>
            </Field>
          </div>
        </Section>

        {/* 预警数据过滤条件 */}
        <Section title="预警数据过滤条件">
          <div className="grid grid-cols-1 gap-4">
            {/* 产品领域 */}
            <div className="flex items-start">
              <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">产品领域</label>
              <div className="flex-1">
                <Field label="AI标签" labelWidth="w-14">
                  <div className="flex items-center max-w-2xl">
                    <CascadeMultiSelect
                      placeholder="请选择"
                      options={aiTagOptions}
                      className="max-w-md"
                      value={aiTagVals}
                      onChange={setAiTagVals}
                    />
                    <SeparateMonitor
                      disabled={aiDisabled}
                      checked={aiTagSep}
                      onCheckedChange={setAiTagSep}
                      tooltip="勾选后将对你选择的AI标签单独进行统计，独立判断是否触发预警条件（相当于一个标签一条独立的预警规则）；不勾选则将选择的所有AI标签汇统计，判断汇总后的数据是否达到触发条件。"
                      levelOptions={aiTagLevels}
                      level={aiTagLevel}
                      onLevelChange={setAiTagLevel}
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* 机型范围 */}
            <div className="flex items-start">
              <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">机型范围</label>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <Field label="品牌" labelWidth="w-14">
                    <MultiSelect placeholder="请选择品牌" options={brandOptions} />
                  </Field>
                  <Field label="机型营销名" labelWidth="w-20">
                    <div className="flex items-center">
                      <CascadeMultiSelect
                        placeholder="请选择"
                        options={marketingNameOptions}
                        value={marketingVals}
                        onChange={setMarketingVals}
                      />
                      <SeparateMonitor
                        disabled={marketingDisabled}
                        checked={marketingSep}
                        onCheckedChange={setMarketingSep}
                        tooltip="勾选后将对你选择的机型单独进行统计，独立判断是否触发预警条件（相当于一个机型一条独立的预警规则）；不勾选则将选择的所有机型汇统计，判断汇总后的数据是否达到触发条件。"
                      />
                    </div>
                  </Field>
                  <Field label="OS版本" labelWidth="w-16">
                    <MultiSelect placeholder="请选择OS版本" options={osVersionOptions} />
                  </Field>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="内外销" labelWidth="w-14">
                    <MultiSelect placeholder="请选择内外销" options={domesticExportOptions} />
                  </Field>
                  <Field label="机型" labelWidth="w-20">
                    <TextInput placeholder="请输入机型,如PHY110,多个机型请用逗号隔开" />
                  </Field>
                  <Field
                    label="OTA版本"
                    labelWidth="w-16"
                    labelExtra={
                      <div className="relative group inline-flex align-middle ml-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[hsl(var(--placeholder))] cursor-help" />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block w-[340px] p-3 text-[12px] leading-relaxed bg-popover border border-border rounded-md shadow-lg text-[hsl(var(--label-text))]">
                          目前仅有帮助与反馈、logkit、NPS等少数渠道有OTA版本，选择OTA版本将过滤没有OTA版本的数据。
                        </div>
                      </div>
                    }
                  >
                    <MultiSelect placeholder="请选择OTA版本号" options={otaVersionOptions} />
                  </Field>
                </div>
              </div>
            </div>

            {/* 反馈来源 */}
            <div className="flex items-start">
              <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">反馈来源</label>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <Field label="反馈来源" labelWidth="w-20">
                  <CascadeMultiSelect placeholder="请选择" options={feedbackSourceOptions} />
                </Field>
                <Field label="国家/地区" labelWidth="w-20">
                  <div className="flex items-center">
                    <MultiSelect
                      placeholder="请选择国家/地区"
                      options={countryOptions}
                      value={countryVals}
                      onChange={setCountryVals}
                    />
                    <SeparateMonitor
                      disabled={countryDisabled}
                      checked={countrySep}
                      onCheckedChange={setCountrySep}
                      tooltip="勾选后将对你选择的国家/地区单独进行统计，独立判断是否触发预警条件（相当于一个国家/地区一条独立的预警规则）；不勾选则将选择的所有国家/地区汇统计，判断汇总后的数据是否达到触发条件。"
                    />
                  </div>
                </Field>
                <div />
              </div>
            </div>

            {/* 反馈内容 */}
            <div className="flex items-start">
              <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">反馈内容</label>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <Field label="反馈类型" labelWidth="w-20">
                    <MultiSelect placeholder="请选择反馈类型" options={feedbackTypeOptions} value={feedbackTypeVals} onChange={setFeedbackTypeVals} />
                  </Field>
                  <Field label="用户情感" labelWidth="w-20">
                    <MultiSelect placeholder="请选择用户情感" options={sentimentOptions} value={sentimentVals} onChange={setSentimentVals} />
                  </Field>
                  <Field label="社媒类型" labelWidth="w-20">
                    <MultiSelect placeholder="请选择社媒类型" options={socialMediaTypeOptions} />
                  </Field>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="粉丝量" labelWidth="w-20">
                    <div className="flex gap-2">
                      <div className="w-28 shrink-0">
                        <MultiSelect placeholder="运算符" options={fanCountOperators} value={fanOp} onChange={(v) => setFanOp(v.slice(-1))} />
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="请输入"
                        onInput={(e) => {
                          const t = e.currentTarget;
                          t.value = t.value.replace(/[^0-9]/g, "");
                        }}
                        className="flex-1 h-8 px-3 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))]"
                      />
                    </div>
                  </Field>
                  <Field label="预警重要度" labelWidth="w-20">
                    <MultiSelect placeholder="请选择预警重要度" options={warningImportanceOptions} />
                  </Field>
                  <Field label="不良类型" labelWidth="w-20">
                    <MultiSelect placeholder="请选择不良类型" options={defectTypeOptions} />
                  </Field>
                </div>
                <div className="flex items-center">
                  <label className="w-20 shrink-0 text-right pr-3 text-[13px] text-[hsl(var(--label-text))]">关键词组合</label>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-28 shrink-0">
                      <SingleSelect
                        value={kwField}
                        onChange={(v) => {
                          setKwField(v);
                          if (v === "用户名" || v === "内容作者") setKwOp("等于");
                          else setKwOp("包含");
                        }}
                        options={[
                          { label: "运营观点" },
                          { label: "反馈原声" },
                          { label: "AI聚类标签" },
                          { label: "译文" },
                          { label: "用户名" },
                          { label: "内容作者" },
                        ]}
                      />
                    </div>
                    <div className="w-24 shrink-0">
                      <SingleSelect
                        value={kwOp}
                        onChange={setKwOp}
                        options={
                          kwField === "用户名" || kwField === "内容作者"
                            ? [{ label: "等于" }, { label: "不等于" }]
                            : [{ label: "包含" }, { label: "不包含" }]
                        }
                      />
                    </div>
                    <TextInput placeholder='单行关键词为"或"，多行关键词为"且"（按enter键隔开）' className="flex-1" />
                    <button className="w-7 h-7 flex items-center justify-center rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-start">
                  <label className="w-20 shrink-0 text-right pr-3 text-[13px] text-[hsl(var(--label-text))] pt-1.5">内容数据</label>
                  <div className="flex-1 space-y-3">
                    <div className="w-1/3 pr-2">
                      <MultiSelect
                        placeholder="请选择"
                        options={[
                          { label: "转发量" },
                          { label: "点赞量" },
                          { label: "评论量" },
                          { label: "互动量" },
                          { label: "收藏量" },
                        ]}
                        value={contentDataVals}
                        onChange={setContentDataVals}
                      />
                    </div>
                    {contentDataVals.length > 0 && (
                      <div className="space-y-2">
                        {contentDataVals.map((m) => (
                          <div key={m} className="flex items-center gap-2">
                            <label className="w-16 shrink-0 text-right pr-3 text-[13px] text-[hsl(var(--label-text))]">{m}</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="输入字数"
                              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ""); }}
                              className="w-40 h-8 px-3 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))]"
                            />
                            <span className="text-[13px] text-[hsl(var(--label-text))]">~</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="输入字数"
                              onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ""); }}
                              className="w-40 h-8 px-3 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))]"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="flex justify-end pt-2">
            <button className="h-8 px-4 text-[13px] border border-primary text-primary rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors">
              预览反馈数据
            </button>
          </div>
        </Section>

        {/* 触发条件设置 */}
        <Section title="触发条件设置">
          {alertType !== "统计" && (
            <Field label="预警级别" required>
              <div className="max-w-md">
                <SingleSelect placeholder="请选择预警级别" options={alertLevelOptions} value={alertLevelVal} onChange={setAlertLevelVal} />
              </div>
            </Field>
          )}
          {alertType === "统计" && (
            <div className="space-y-3">
              {statConds.map((cond, idx) => {
                return (
                  <div key={cond.id}>
                    {idx > 0 && (
                      <div className="flex items-center gap-3 my-2 pl-20">
                        <span className="text-[12px] px-2 py-0.5 rounded bg-[hsl(var(--primary)/0.1)] text-primary border border-[hsl(var(--primary)/0.3)]">或</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <Field label="预警级别" required labelWidth="w-20">
                          <div className="max-w-md">
                            <SingleSelect placeholder="请选择预警级别" options={alertLevelOptions} value={cond.level} onChange={(v) => updateCondLevel(cond.id, v)} />
                          </div>
                        </Field>
                        {cond.subs.map((sub, subIdx) => {
                          const showCalcMethod = sub.indicator === "反馈量" && (dailyLikeRanges.includes(sub.timeRange) || sub.timeRange === "本周");
                          const calcMethodOptionsForSub = ["当日", "本周", "昨日", "近7日", "近30日"].includes(sub.timeRange) ? calcMethodOptions : calcMethodOptions.filter((o) => o.label !== "平均值");
                          const isPercent = showCalcMethod && percentCalcMethods.includes(sub.calcMethod);
                          const chartDisabled = !sub.indicator || !sub.timeRange;
                          return (
                            <Field key={sub.id} label={subIdx === 0 ? " " : "且"} labelWidth="w-20">
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-3 flex-wrap flex-1 min-w-[700px]">
                                  <div className="w-[180px]"><SingleSelect placeholder="请选择预警指标" options={warningIndicatorOptions} value={sub.indicator} onChange={(v) => updateSub(cond.id, sub.id, { indicator: v })} /></div>
                                  <div className="w-[180px]"><SingleSelect placeholder="请选择时间范围" options={timeRangeOptionsStat} value={sub.timeRange} onChange={(v) => updateSub(cond.id, sub.id, { timeRange: v })} /></div>
                                  {showCalcMethod && (
                                    <>
                                      <div className="w-[180px]"><SingleSelect placeholder="请选择计算方式" options={calcMethodOptionsForSub} value={sub.calcMethod} onChange={(v) => updateSub(cond.id, sub.id, { calcMethod: v })} /></div>
                                      <div className="relative group flex items-center">
                                        <HelpCircle className="w-4 h-4 text-[hsl(var(--placeholder))] cursor-help" />
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block w-[560px] max-h-[70vh] overflow-auto p-3 text-[12px] leading-relaxed bg-popover border border-border rounded-md shadow-lg text-[hsl(var(--label-text))]">
                                          <div className="mb-1">当预警指标为"反馈量"，时间范围为当日、本周、昨日、近7日、近30日时，可按反馈变化来设置预警触发条件，计算公式包含如下内容：</div>
                                          <div className="mt-2"><b>值：</b>符合过滤条件和时间范围的反馈量数值</div>
                                          <div className="mt-2"><b>平均值：</b>只有当日、本周、昨日、近7日和近30日才能选择平均值。其中，当日：近30日（含今日）的日平均值；本周：近7周（含本周）的周平均值；昨日：近30日（至昨日）的日平均值；近7日：近70日反馈量/10；近30日：近60日反馈量/2。</div>
                                          <div className="mt-2"><b>环比：</b>当日较昨日、本周较上周、昨日较前日、近7日较前7日、近30日较前30日的增长数量/百分比。</div>
                                          <div className="mt-3"><b>较平均值：</b>当日较前30日的日平均值、本周较前7周的周平均值、昨日较往前30日的日平均值、近7日较往前70日反馈量/10的数据、近30日较往前60日反馈量/2的数据的增长数量/百分比</div>
                                          <img src={avgLegend.url} alt="反馈量预警较平均值口径图例" className="mt-2 w-full rounded border border-border" loading="lazy" />
                                        </div>

                                      </div>
                                    </>
                                  )}
                                  <div className="w-[180px]"><SingleSelect placeholder="请选择运算符" options={compareOperators} /></div>
                                  <div className="relative w-[180px]">
                                    <input
                                      type="text"
                                      inputMode="numeric"
                                      placeholder={isPercent ? "请输入百分比值" : "请输入量值"}
                                      onInput={(e) => {
                                        const t = e.currentTarget;
                                        t.value = t.value.replace(/[^0-9]/g, "");
                                      }}
                                      className={`w-full h-8 pl-3 ${isPercent ? "pr-8" : "pr-3"} text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))]`}
                                    />
                                    {isPercent && (
                                      <span className="absolute right-0 top-0 h-8 w-7 flex items-center justify-center text-[13px] text-[hsl(var(--label-text))] border-l border-[hsl(var(--field-border))] bg-muted">%</span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  disabled={chartDisabled}
                                  onClick={() => setChartOpenId({ condId: cond.id, subId: sub.id })}
                                  className={`h-8 px-3 text-[13px] rounded-sm border transition-colors ${
                                    chartDisabled
                                      ? "border-[hsl(var(--field-border))] text-[hsl(var(--placeholder))] bg-muted cursor-not-allowed"
                                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                                  }`}
                                >
                                  查看近期基线
                                </button>
                                <button
                                  disabled={cond.subs.length >= 10}
                                  onClick={() => addSub(cond.id)}
                                  className={`h-8 px-3 text-[13px] rounded-sm border transition-colors ${
                                    cond.subs.length >= 10
                                      ? "border-[hsl(var(--field-border))] text-[hsl(var(--placeholder))] bg-muted cursor-not-allowed"
                                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                                  }`}
                                  title={cond.subs.length >= 10 ? "一个预警条件最多支持10个且的条件" : ""}
                                >
                                  增加条件（且）
                                </button>
                                {cond.subs.length > 1 && (
                                  <button
                                    onClick={() => removeSub(cond.id, sub.id)}
                                    className="h-8 w-8 flex items-center justify-center rounded-sm border border-[hsl(var(--field-border))] text-[hsl(var(--placeholder))] hover:border-destructive hover:text-destructive transition-colors"
                                    title="删除条件"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </Field>
                          );
                        })}
                      </div>
                      {statConds.length > 1 && (
                        <button
                          onClick={() => removeCond(cond.id)}
                          className="mt-1 h-8 px-3 text-[13px] rounded-sm border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          删除该级别
                        </button>
                      )}
                    </div>
                    {perLevelNotify && statConds.length > 1 && (
                      <div className="mt-3 pl-20 space-y-3 border-t border-dashed border-border pt-3">
                        <Field label="推送方式" required labelWidth="w-20">
                          <div className="flex items-center gap-6 h-8">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={levelTt[cond.id] ?? true}
                                onChange={(e) => setLevelTt((m) => ({ ...m, [cond.id]: e.target.checked }))}
                                className="w-3.5 h-3.5 accent-primary"
                              />
                              <span className={`text-[13px] ${(levelTt[cond.id] ?? true) ? "text-primary" : "text-[hsl(var(--label-text))]"}`}>TT</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!levelPhoneNotify[cond.id]}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setLevelPhoneNotify((m) => ({ ...m, [cond.id]: checked }));
                                  if (checked) setLevelTt((m) => ({ ...m, [cond.id]: true }));
                                }}
                                className="w-3.5 h-3.5 accent-primary"
                              />
                              <span className={`text-[13px] ${levelPhoneNotify[cond.id] ? "text-primary" : "text-[hsl(var(--label-text))]"}`}>电话通知</span>
                              <span
                                title="1. 电话将默认按TT预警人员进行通知顺序拨打，若连续无人接听或被挂断，则拨打下一位。&#10;2. 单人连续最多拨打2次，间隔2分钟，直到有人接听或挂断为止。"
                                className="cursor-help inline-flex"
                              >
                                <HelpCircle className="w-3.5 h-3.5 text-[hsl(var(--placeholder))]" />
                              </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!levelTtGroup[cond.id]}
                                onChange={(e) => setLevelTtGroup((m) => ({ ...m, [cond.id]: e.target.checked }))}
                                className="w-3.5 h-3.5 accent-primary"
                              />
                              <span className={`text-[13px] ${levelTtGroup[cond.id] ? "text-primary" : "text-[hsl(var(--label-text))]"}`}>TT群组</span>
                            </label>
                          </div>
                        </Field>
                        {(levelTt[cond.id] ?? true) && (
                          <>
                            <Field label="预警名单" labelWidth="w-20">
                              <div className="max-w-md">
                                <MultiSelect placeholder="请选择预警名单（可多选，最多 10 个名单）" options={alertListOptions} />
                              </div>
                            </Field>
                            <Field label="预警人员" labelWidth="w-20" required={!!levelPhoneNotify[cond.id]}>
                              <div className="max-w-md">
                                <MultiSelect
                                  placeholder="输入名字检索并选择"
                                  options={notifyPersonOptions}
                                  value={levelAlertPeople[cond.id] ?? []}
                                  onChange={(v) => setLevelAlertPeople((m) => ({ ...m, [cond.id]: v }))}
                                />
                              </div>
                            </Field>
                            {!!levelPhoneNotify[cond.id] && (levelAlertPeople[cond.id] ?? []).length === 0 && (
                              <div className="pl-[104px] -mt-1 text-[12px] text-destructive">选择电话通知后，预警人员必选</div>
                            )}
                          </>
                        )}
                        {(levelPhoneNotify[cond.id] || false) && (
                          <>
                            <div className="pl-[104px] text-[12px] text-[hsl(var(--muted-foreground))]">
                              电话将默认按 TT 预警人员进行通知顺序拨打
                            </div>
                            <PhoneTimeWindow labelWidth="w-20" />
                          </>
                        )}

                        {levelTtGroup[cond.id] && (
                          <Field label="TT群组" required labelWidth="w-20">
                            <div className="space-y-2">
                              {(levelTtGroups[cond.id] ?? [{ id: "g1", url: "", mentions: [] }]).map((g, i, arr) => (
                                <div key={g.id} className="flex items-start gap-2">
                                  <div className="flex-1 min-w-0">
                                    <TextInput placeholder="请输入Webhook地址TT群组" value={g.url} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <MultiSelect
                                      placeholder="群组内提及人"
                                      options={notifyPersonOptions}
                                      value={g.mentions}
                                      onChange={(v) =>
                                        setLevelTtGroups((m) => ({
                                          ...m,
                                          [cond.id]: arr.map((r) => (r.id === g.id ? { ...r, mentions: v } : r)),
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="flex items-center gap-1 h-8 shrink-0">
                                    {i === arr.length - 1 && (
                                      <div className="relative group">
                                        <button
                                          type="button"
                                          disabled={arr.length >= 10}
                                          onClick={() =>
                                            setLevelTtGroups((m) => ({
                                              ...m,
                                              [cond.id]: [...arr, { id: `g${Date.now()}`, url: "", mentions: [] }],
                                            }))
                                          }
                                          className="w-7 h-7 rounded-sm border border-[hsl(var(--field-border))] text-[hsl(var(--label-text))] hover:border-primary hover:text-primary disabled:opacity-40 flex items-center justify-center"
                                        >
                                          +
                                        </button>
                                        {arr.length >= 10 && (
                                          <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block whitespace-nowrap bg-popover border border-border rounded-sm px-2 py-1 text-[12px] shadow-md z-50">
                                            最多可添加10个TT群组地址
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {arr.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setLevelTtGroups((m) => ({ ...m, [cond.id]: arr.filter((r) => r.id !== g.id) }))
                                        }
                                        className="w-7 h-7 rounded-sm border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"
                                      >
                                        −
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Field>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="pl-20">
                <div className="relative group inline-block">
                  <button
                    disabled={statConds.length >= 10}
                    onClick={addCond}
                    className={`h-8 px-3 text-[13px] rounded-sm border transition-colors ${
                      statConds.length >= 10
                        ? "border-[hsl(var(--field-border))] text-[hsl(var(--placeholder))] bg-muted cursor-not-allowed"
                        : "border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    }`}
                  >
                    + 点击添加预警条件（或）
                  </button>
                  {statConds.length >= 10 && (
                    <div className="absolute left-0 top-full mt-1 z-50 hidden group-hover:block px-2 py-1 text-[12px] bg-popover border border-border rounded-md shadow-lg text-[hsl(var(--label-text))] whitespace-nowrap">
                      一个预警规则最多可设置10个触发条件
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Section>
        {activeChartCond?.indicator === "AI聚类标签聚类量" && activeChartCond?.timeRange ? (
          <AiClusterTagDialog
            open={chartOpenId !== null}
            onOpenChange={(v) => { if (!v) setChartOpenId(null); }}
            timeRange={activeChartCond?.timeRange ?? ""}
            indicator={activeChartCond?.indicator ?? ""}
          />
        ) : (
          <RecentDataDialog
            open={chartOpenId !== null}
            onOpenChange={(v) => { if (!v) setChartOpenId(null); }}
            timeRange={activeChartCond?.timeRange ?? ""}
            indicator={activeChartCond?.indicator ?? ""}
            alertType={alertType}
            separateFilters={[
              ...(aiTagSep ? [{ key: "aiTag", label: "AI标签", type: "cascade" as const, options: aiTagOptions, values: aiTagVals }] : []),
              ...(marketingSep ? [{ key: "marketing", label: "机型营销名", type: "cascade" as const, options: marketingNameOptions, values: marketingVals }] : []),
              ...(countrySep ? [{ key: "country", label: "国家/地区", type: "multi" as const, options: countryOptions, values: countryVals }] : []),
            ]}
          />
        )}



        {/* 预警通知设置 */}
        <Section
          title="预警通知设置"
          extra={
            alertType === "统计" && statConds.length > 1 ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={perLevelNotify}
                  onChange={(e) => setPerLevelNotify(e.target.checked)}
                  className="w-3.5 h-3.5 accent-primary"
                />
                <span className="text-[13px] text-[hsl(var(--label-text))]">是否按级别分别设置</span>
              </label>
            ) : null
          }
        >
          {alertType === "统计" && (
            <Field label="监控频次" required>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-[140px]">
                  <SingleSelect
                    placeholder="请选择"
                    options={[{ label: "间隔" }, { label: "每日" }, { label: "每周" }, { label: "每月" }]}
                    value={freqPeriod}
                    onChange={setFreqPeriod}
                  />
                </div>

                {freqPeriod === "间隔" && (
                  <div className="w-[200px]">
                    <SingleSelect placeholder="请选择监控频次" options={monitorFreqOptions} value={monitorFreq} onChange={setMonitorFreq} />
                  </div>
                )}

                {freqPeriod === "每周" && (
                  <div className="w-[240px]">
                    <MultiSelect
                      placeholder="请选择周几"
                      options={["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((l) => ({ label: l }))}
                      value={freqWeekdays}
                      onChange={setFreqWeekdays}
                    />
                  </div>
                )}

                {freqPeriod === "每月" && (
                  <div className="w-[240px]">
                    <MultiSelect
                      placeholder="请选择日期"
                      options={Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}号` }))}
                      value={freqMonthDays}
                      onChange={setFreqMonthDays}
                    />
                  </div>
                )}

                {(freqPeriod === "每日" || freqPeriod === "每周" || freqPeriod === "每月") && (
                  <input
                    type="time"
                    value={freqTime}
                    onChange={(e) => setFreqTime(e.target.value)}
                    className="h-8 px-2 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm w-[140px]"
                  />
                )}

                {freqPeriod === "间隔" && statConds.some((c) => c.subs.some((s) => multiPushTimeRanges.includes(s.timeRange))) && (
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <span className="text-[13px] text-[hsl(var(--label-text))]">多次推送</span>
                    <span title="当日、本周、昨日、近7日、近30日情况下，若达到触发条件将会根据监控频次多次推送" className="cursor-help inline-flex">
                      <HelpCircle className="w-3.5 h-3.5 text-[hsl(var(--placeholder))]" />
                    </span>
                    <input type="checkbox" className="w-3.5 h-3.5 accent-primary ml-1" />
                  </label>
                )}
              </div>
            </Field>
          )}
          {perLevelNotify && alertType === "统计" && statConds.length > 1 ? (
            <div className="text-[13px] text-[hsl(var(--placeholder))]">
              已开启按级别分别设置，请在上方"触发条件设置"中为每个级别分别配置推送方式与通知人员。
            </div>
          ) : (
            <>
              <Field label="推送方式" required>
                <div className="flex items-center gap-6 h-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={ttNotify} onChange={(e) => setTtNotify(e.target.checked)} className="w-3.5 h-3.5 accent-primary" />
                    <span className={`text-[13px] ${ttNotify ? "text-primary" : "text-[hsl(var(--label-text))]"}`}>TT</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={phoneNotify}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setPhoneNotify(checked);
                        if (checked) setTtNotify(true);
                      }}
                      className="w-3.5 h-3.5 accent-primary"
                    />
                    <span className={`text-[13px] ${phoneNotify ? "text-primary" : "text-[hsl(var(--label-text))]"}`}>电话通知</span>
                    <span
                      title="1. 电话将默认按TT预警人员进行通知顺序拨打，若连续无人接听或被挂断，则拨打下一位。&#10;2. 单人连续最多拨打2次，间隔2分钟，直到有人接听或挂断为止。"
                      className="cursor-help inline-flex"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[hsl(var(--placeholder))]" />
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={ttGroupNotify} onChange={(e) => setTtGroupNotify(e.target.checked)} className="w-3.5 h-3.5 accent-primary" />
                    <span className={`text-[13px] ${ttGroupNotify ? "text-primary" : "text-[hsl(var(--label-text))]"}`}>TT群组</span>
                  </label>
                </div>
              </Field>
              {ttNotify && (
                <>
                  <Field label="预警名单">
                    <MultiSelect
                      placeholder="请选择预警名单（可多选，最多 10 个名单）"
                      options={alertListOptions}
                      value={alertLists}
                      onChange={(v) => setAlertLists(v.slice(0, 10))}
                    />
                  </Field>
                  <Field label="预警人员" required={phoneNotify}>
                    <MultiSelect
                      placeholder="输入名字检索并选择"
                      options={notifyPersonOptions}
                      value={alertPeople}
                      onChange={setAlertPeople}
                    />
                  </Field>
                  {alertLists.length === 0 && alertPeople.length === 0 && (
                    <div className="pl-[104px] -mt-2 text-[12px] text-destructive">
                      {phoneNotify ? "选择电话通知后，预警人员必选" : "请选择预警名单或预警人员"}
                    </div>
                  )}
                  {phoneNotify && alertLists.length > 0 && alertPeople.length === 0 && (
                    <div className="pl-[104px] -mt-2 text-[12px] text-destructive">选择电话通知后，预警人员必选</div>
                  )}
                </>
              )}
              {phoneNotify && (
                <>
                  <div className="pl-[104px] text-[12px] text-[hsl(var(--muted-foreground))]">
                    电话将默认按 TT 预警人员进行通知顺序拨打
                  </div>
                  <PhoneTimeWindow />
                </>
              )}
              {ttGroupNotify && (
                <>
                  <Field label="TT群组" required>
                    <div className="space-y-2">
                      {ttGroups.map((g, i) => (
                        <div key={g.id} className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <TextInput
                              placeholder="请输入Webhook地址TT群组"
                              value={g.url}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <MultiSelect
                              placeholder="群组内提及人"
                              options={notifyPersonOptions}
                              value={g.mentions}
                              onChange={(v) =>
                                setTtGroups((rows) => rows.map((r) => (r.id === g.id ? { ...r, mentions: v } : r)))
                              }
                            />
                          </div>
                          <div className="flex items-center gap-1 h-8 shrink-0">
                            {i === ttGroups.length - 1 && (
                              <div className="relative group">
                                <button
                                  type="button"
                                  disabled={ttGroups.length >= 10}
                                  onClick={() =>
                                    setTtGroups((rows) =>
                                      rows.length >= 10
                                        ? rows
                                        : [...rows, { id: `g${Date.now()}`, url: "", mentions: [] }]
                                    )
                                  }
                                  className="w-7 h-7 rounded-sm border border-[hsl(var(--field-border))] text-[hsl(var(--label-text))] hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-[hsl(var(--field-border))] disabled:hover:text-[hsl(var(--label-text))] flex items-center justify-center"
                                >
                                  +
                                </button>
                                {ttGroups.length >= 10 && (
                                  <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block whitespace-nowrap bg-popover border border-border rounded-sm px-2 py-1 text-[12px] shadow-md z-50">
                                    最多可添加10个TT群组地址
                                  </div>
                                )}
                              </div>
                            )}
                            {ttGroups.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setTtGroups((rows) => rows.filter((r) => r.id !== g.id))}
                                className="w-7 h-7 rounded-sm border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"
                              >
                                −
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Field>
                  <div className="pl-[104px] -mt-1 text-[12px] text-primary">
                    如何为告警规则添加TT群机器人推送{" "}
                    <span className="underline cursor-pointer">点击跳转</span>
                  </div>
                </>
              )}
            </>
          )}
        </Section>

        {/* 预警管理人员 */}
        <Section title="预警管理人员">
          <Field label="管理员" required>
            <div className="w-[240px]">
              <SingleSelect
                placeholder="请选择管理员"
                options={[
                  { label: "当前用户（我）" },
                  { label: "张三" },
                  { label: "李四" },
                  { label: "王五" },
                  { label: "赵六" },
                ]}
                value={adminUser}
                onChange={setAdminUser}
              />
            </div>
          </Field>
          <Field label="协作者">
            <MultiSelect
              placeholder="请选择协作者（选填）"
              options={[
                { label: "张三" },
                { label: "李四" },
                { label: "王五" },
                { label: "赵六" },
                { label: "钱七" },
                { label: "孙八" },
              ]}
              value={collaborators}
              onChange={setCollaborators}
            />
          </Field>
        </Section>

      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex justify-end gap-3">
        <button className="h-8 px-5 text-[13px] border border-[hsl(var(--field-border))] text-[hsl(var(--label-text))] rounded-sm hover:border-primary hover:text-primary transition-colors bg-card">
          取消
        </button>
        <button className="h-8 px-5 text-[13px] bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity">
          提交
        </button>
      </div>
        </>
      )}
      <AiCreateRuleDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        messages={aiMessages}
        setMessages={setAiMessages}
        onApply={handleAiApply}
      />
    </div>
  );
};

export default Index;
