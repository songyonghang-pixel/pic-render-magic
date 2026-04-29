import { Section } from "@/components/feedback/Section";
import { Field, TextInput, SelectInput } from "@/components/feedback/FormField";
import { MultiSelect } from "@/components/feedback/MultiSelect";
import { SingleSelect } from "@/components/feedback/SingleSelect";
import { CascadeMultiSelect } from "@/components/feedback/CascadeMultiSelect";
import { SeparateMonitor } from "@/components/feedback/SeparateMonitor";
import { RecentDataDialog } from "@/components/feedback/RecentDataDialog";
import { AiClusterTagDialog } from "@/components/feedback/AiClusterTagDialog";

const aiTagLevels = ["一级标签", "二级标签", "三级标签", "四级标签", "五级标签"];

const alertTypeOptions = [{ label: "实时" }, { label: "统计" }];
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
const compareOperators = [{ label: "大于" }, { label: "大于等于" }, { label: "小于" }, { label: "小于等于" }];
const calcMethodOptions = [
  { label: "值" },
  { label: "环比增长率" },
  { label: "环比增量" },
  { label: "较平均值的增量" },
  { label: "较平均值的增长率" },
];
const percentCalcMethods = ["环比增长率", "较平均值的增长率"];
import {
  aiTagOptions,
  brandOptions,
  marketingNameOptions,
  osVersionOptions,
  feedbackSourceOptions,
  countryOptions,
  defectTypeOptions,
  domesticExportOptions,
  socialMediaTypeOptions,
  warningImportanceOptions,
  fanCountOperators,
} from "@/components/feedback/filterData";
import { ChevronRight, Plus, Copy, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import FeedbackDataAnalysis from "./FeedbackDataAnalysis";
import AlertRules from "./AlertRules";
import AlertList from "./AlertList";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"rules" | "alert" | "list" | "analysis">("rules");
  const [fanOp, setFanOp] = useState<string[]>([]);
  const [alertType, setAlertType] = useState<string>("实时");
  const [ruleName, setRuleName] = useState<string>("");
  const [ruleNameKey, setRuleNameKey] = useState<number>(0);

  const [aiTagVals, setAiTagVals] = useState<string[]>([]);
  const [marketingVals, setMarketingVals] = useState<string[]>([]);
  const [countryVals, setCountryVals] = useState<string[]>([]);

  const [aiTagSep, setAiTagSep] = useState(false);
  const [aiTagLevel, setAiTagLevel] = useState("二级标签");
  const [marketingSep, setMarketingSep] = useState(false);
  const [countrySep, setCountrySep] = useState(false);

  type StatCond = { id: number; indicator: string; timeRange: string; calcMethod: string; level: string };
  const [statConds, setStatConds] = useState<StatCond[]>([{ id: 1, indicator: "", timeRange: "", calcMethod: "", level: "" }]);
  const [chartOpenId, setChartOpenId] = useState<number | null>(null);
  const updateCond = (id: number, patch: Partial<StatCond>) => {
    setStatConds((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const next = { ...c, ...patch };
      const showCalc = next.indicator === "反馈量" && (next.timeRange === "当日" || next.timeRange === "本周");
      if (!showCalc) next.calcMethod = "";
      return next;
    }));
  };
  const addCond = () => {
    if (statConds.length >= 10) return;
    setStatConds((prev) => [...prev, { id: Date.now(), indicator: "", timeRange: "", calcMethod: "", level: "" }]);
  };
  const removeCond = (id: number) => setStatConds((prev) => prev.filter((c) => c.id !== id));
  const activeChartCond = statConds.find((c) => c.id === chartOpenId);

  const aiDisabled = aiTagVals.length < 2;
  const marketingDisabled = marketingVals.length < 2;
  const countryDisabled = countryVals.length < 2;

  useEffect(() => { if (aiDisabled) setAiTagSep(false); }, [aiDisabled]);
  useEffect(() => { if (marketingDisabled) setMarketingSep(false); }, [marketingDisabled]);
  useEffect(() => { if (countryDisabled) setCountrySep(false); }, [countryDisabled]);
  return (
    <div className="min-h-screen bg-[hsl(var(--page-bg))]">
      {/* Top tabs */}
      <div className="bg-card border-b border-border px-6 flex items-center gap-6">
        {([
          { key: "rules", label: "预警规则" },
          { key: "alert", label: "新建预警" },
          { key: "list", label: "预警列表" },
          { key: "analysis", label: "反馈原声分析" },
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
      ) : activeTab === "rules" ? (
        <AlertRules onCreate={() => setActiveTab("alert")} onCopy={(name, type) => { setRuleName(name); setAlertType(type); setRuleNameKey((k) => k + 1); setActiveTab("alert"); }} />
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
        <Section title="预警规则名称">
          <Field label="规则名称" required>
            <TextInput placeholder="请输入规则名称" className="max-w-xl" />
          </Field>
        </Section>

        {/* 预警类型 */}
        <Section title="预警类型">
          <div className="flex items-center">
            <Field label="预警类型" required labelWidth="w-20">
              <div className="flex items-center gap-3">
                <div className="max-w-[200px] w-[200px]">
                  <SingleSelect options={alertTypeOptions} value={alertType} onChange={setAlertType} />
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
                  <div />
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
                    <MultiSelect placeholder="请选择反馈类型" options={feedbackTypeOptions} />
                  </Field>
                  <Field label="用户情感" labelWidth="w-20">
                    <MultiSelect placeholder="请选择用户情感" options={sentimentOptions} />
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
                    <SelectInput value="反馈原声" className="w-32" />
                    <SelectInput value="包含" className="w-24" />
                    <TextInput placeholder='单行关键词为"或"，多行关键词为"且"（按enter键隔开）' className="flex-1" />
                    <button className="w-7 h-7 flex items-center justify-center rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-sm border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
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
                <SingleSelect placeholder="请选择预警级别" options={alertLevelOptions} />
              </div>
            </Field>
          )}
          {alertType === "统计" && (
            <div className="space-y-3">
              {statConds.map((cond, idx) => {
                const showCalcMethod = cond.indicator === "反馈量" && (cond.timeRange === "当日" || cond.timeRange === "本周");
                const isPercent = showCalcMethod && percentCalcMethods.includes(cond.calcMethod);
                const chartDisabled = !cond.indicator || !cond.timeRange;
                return (
                  <div key={cond.id}>
                    {idx > 0 && (
                      <div className="flex items-center gap-3 my-2 pl-20">
                        <span className="text-[12px] px-2 py-0.5 rounded bg-[hsl(var(--primary)/0.1)] text-primary border border-[hsl(var(--primary)/0.3)]">或</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}
                    <Field label="预警级别" required labelWidth="w-20">
                      <div className="max-w-md">
                        <SingleSelect placeholder="请选择预警级别" options={alertLevelOptions} value={cond.level} onChange={(v) => updateCond(cond.id, { level: v })} />
                      </div>
                    </Field>
                    <Field label=" " labelWidth="w-20">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-3 flex-wrap flex-1 min-w-[700px]">
                          <div className="w-[180px]"><SingleSelect placeholder="请选择预警指标" options={warningIndicatorOptions} value={cond.indicator} onChange={(v) => updateCond(cond.id, { indicator: v })} /></div>
                          <div className="w-[180px]"><SingleSelect placeholder="请选择时间范围" options={timeRangeOptions} value={cond.timeRange} onChange={(v) => updateCond(cond.id, { timeRange: v })} /></div>
                          {showCalcMethod && (
                            <>
                              <div className="w-[180px]"><SingleSelect placeholder="请选择计算方式" options={calcMethodOptions} value={cond.calcMethod} onChange={(v) => updateCond(cond.id, { calcMethod: v })} /></div>
                              <div className="relative group flex items-center">
                                <HelpCircle className="w-4 h-4 text-[hsl(var(--placeholder))] cursor-help" />
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block w-[360px] p-3 text-[12px] leading-relaxed bg-popover border border-border rounded-md shadow-lg text-[hsl(var(--label-text))]">
                                  <div className="mb-1">当预警指标为"反馈量"，时间范围为当日、本周时，可按反馈变化来设置预警触发条件，计算公式包含如下内容：</div>
                                  <div className="mt-2"><b>值：</b>符合过滤条件和时间范围的反馈量数值</div>
                                  <div><b>环比增长率：</b>当日较昨日的增长百分比，本周较上周的增长百分比</div>
                                  <div><b>环比增量：</b>当日较昨日的增长数量，本周较上周的增长数量</div>
                                  <div><b>较平均值的增量：</b>当日较前30日的日平均值的增长数量，本周较前7周的周平均值的增长数量</div>
                                  <div><b>较平均值的增长率：</b>当日较前30日的日平均值的增长百分比，本周较前7周的周平均值的增长百分比</div>
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
                          onClick={() => setChartOpenId(cond.id)}
                          className={`h-8 px-3 text-[13px] rounded-sm border transition-colors ${
                            chartDisabled
                              ? "border-[hsl(var(--field-border))] text-[hsl(var(--placeholder))] bg-muted cursor-not-allowed"
                              : "border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                          }`}
                        >
                          查看近期基线
                        </button>
                        {statConds.length > 1 && (
                          <button
                            onClick={() => removeCond(cond.id)}
                            className="h-8 px-3 text-[13px] rounded-sm border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          >
                            删除条件
                          </button>
                        )}
                      </div>
                    </Field>
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
            separateFilters={[
              ...(aiTagSep ? [{ key: "aiTag", label: "AI标签", type: "cascade" as const, options: aiTagOptions, values: aiTagVals }] : []),
              ...(marketingSep ? [{ key: "marketing", label: "机型营销名", type: "cascade" as const, options: marketingNameOptions, values: marketingVals }] : []),
              ...(countrySep ? [{ key: "country", label: "国家/地区", type: "multi" as const, options: countryOptions, values: countryVals }] : []),
            ]}
          />
        )}



        {/* 预警通知设置 */}
        <Section title="预警通知设置">
          <Field label="推送方式" required>
            <div className="flex items-center gap-6 h-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-primary" />
                <span className="text-[13px] text-primary">TT</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-primary" />
                <span className="text-[13px] text-[hsl(var(--label-text))]">TT群组</span>
              </label>
            </div>
          </Field>
          <Field label="通知人员" required>
            <SelectInput placeholder="请选择" />
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
    </div>
  );
};

export default Index;
