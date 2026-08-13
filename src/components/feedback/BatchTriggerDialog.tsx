import { useState } from "react";
import { X, HelpCircle, Trash2 } from "lucide-react";
import { SingleSelect } from "@/components/feedback/SingleSelect";
import { Field } from "@/components/feedback/FormField";
import { RecentDataDialog } from "@/components/feedback/RecentDataDialog";
import avgLegend from "@/assets/avg-legend.png.asset.json";

const alertLevelOptions = [{ label: "S" }, { label: "A" }, { label: "B" }, { label: "C" }, { label: "D" }];
const warningIndicatorOptions = [{ label: "反馈量" }, { label: "AI聚类标签聚类量" }];
const timeRangeOptionsStat = [
  { label: "10分钟" }, { label: "20分钟" }, { label: "30分钟" },
  { label: "1小时" }, { label: "2小时" }, { label: "3小时" },
  { label: "4小时" }, { label: "5小时" }, { label: "6小时" },
  { label: "当日" }, { label: "本周" }, { label: "昨日" }, { label: "近7日" }, { label: "近30日" },
];
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

interface Sub {
  id: number;
  indicator: string;
  timeRange: string;
  calcMethod: string;
  op: string;
  value: string;
}
interface Cond {
  id: number;
  level: string;
  subs: Sub[];
}

export interface TriggerCondition {
  level: string;
  subs: { indicator: string; timeRange: string; calcMethod: string; op: string; value: string }[];
}

interface Props {
  open: boolean;
  count: number;
  onClose: () => void;
  onApply: (conds: TriggerCondition[]) => void;
}

let uid = 1;
const newSub = (): Sub => ({ id: uid++, indicator: "", timeRange: "", calcMethod: "值", op: "", value: "" });
const newCond = (): Cond => ({ id: uid++, level: "", subs: [newSub()] });

export const BatchTriggerDialog = ({ open, count, onClose, onApply }: Props) => {
  const [conds, setConds] = useState<Cond[]>([newCond()]);
  const [chart, setChart] = useState<Sub | null>(null);

  if (!open) return null;

  const updateSub = (cid: number, sid: number, patch: Partial<Sub>) =>
    setConds((cs) =>
      cs.map((c) =>
        c.id !== cid
          ? c
          : {
              ...c,
              subs: c.subs.map((s) => {
                if (s.id !== sid) return s;
                const next = { ...s, ...patch };
                if (patch.timeRange !== undefined && !["当日", "本周", "昨日", "近7日", "近30日"].includes(patch.timeRange) && next.calcMethod === "平均值") {
                  next.calcMethod = "值";
                }
                return next;
              }),
            }
      )
    );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
      <div className="bg-card rounded-md w-full max-w-6xl max-h-[85vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="text-[15px] font-medium text-[hsl(var(--label-text))]">
            批量修改触发条件（已选 {count} 条规则）
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-[hsl(var(--placeholder))]" /></button>
        </div>

        <div className="px-5 py-2 text-[12px] text-[hsl(var(--placeholder))] bg-[hsl(var(--primary)/0.05)]">
          备注：将各规则中触发条件按下方设置的内容进行替换。
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-3">
          {conds.map((cond, idx) => (
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
                      <SingleSelect
                        placeholder="请选择预警级别"
                        options={alertLevelOptions}
                        value={cond.level}
                        onChange={(v) => setConds((cs) => cs.map((c) => (c.id === cond.id ? { ...c, level: v } : c)))}
                      />
                    </div>
                  </Field>
                  {cond.subs.map((sub, subIdx) => {
                    const showCalcMethod = sub.indicator === "反馈量" && (dailyLikeRanges.includes(sub.timeRange) || sub.timeRange === "本周");
                    const calcOpts = ["当日", "本周", "昨日", "近7日", "近30日"].includes(sub.timeRange)
                      ? calcMethodOptions
                      : calcMethodOptions.filter((o) => o.label !== "平均值");
                    const isPercent = showCalcMethod && percentCalcMethods.includes(sub.calcMethod);
                    const chartDisabled = !sub.indicator || !sub.timeRange;
                    return (
                      <Field key={sub.id} label={subIdx === 0 ? " " : "且"} labelWidth="w-20">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-3 flex-wrap flex-1 min-w-[700px]">
                            <div className="w-[180px]">
                              <SingleSelect placeholder="请选择预警指标" options={warningIndicatorOptions} value={sub.indicator} onChange={(v) => updateSub(cond.id, sub.id, { indicator: v })} />
                            </div>
                            <div className="w-[180px]">
                              <SingleSelect placeholder="请选择时间范围" options={timeRangeOptionsStat} value={sub.timeRange} onChange={(v) => updateSub(cond.id, sub.id, { timeRange: v })} />
                            </div>
                            {showCalcMethod && (
                              <>
                                <div className="w-[180px]">
                                  <SingleSelect placeholder="请选择计算方式" options={calcOpts} value={sub.calcMethod} onChange={(v) => updateSub(cond.id, sub.id, { calcMethod: v })} />
                                </div>
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
                            <div className="w-[180px]">
                              <SingleSelect placeholder="请选择运算符" options={compareOperators} value={sub.op} onChange={(v) => updateSub(cond.id, sub.id, { op: v })} />
                            </div>
                            <div className="relative w-[180px]">
                              <input
                                type="text"
                                inputMode="numeric"
                                value={sub.value}
                                placeholder={isPercent ? "请输入百分比值" : "请输入量值"}
                                onChange={(e) => updateSub(cond.id, sub.id, { value: e.target.value.replace(/[^0-9]/g, "") })}
                                className={`w-full h-8 pl-3 ${isPercent ? "pr-8" : "pr-3"} text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))]`}
                              />
                              {isPercent && (
                                <span className="absolute right-0 top-0 h-8 w-7 flex items-center justify-center text-[13px] text-[hsl(var(--label-text))] border-l border-[hsl(var(--field-border))] bg-muted">%</span>
                              )}
                            </div>
                          </div>
                          <button
                            disabled={chartDisabled}
                            onClick={() => setChart(sub)}
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
                            onClick={() => setConds((cs) => cs.map((c) => (c.id === cond.id ? { ...c, subs: [...c.subs, newSub()] } : c)))}
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
                              onClick={() => setConds((cs) => cs.map((c) => (c.id === cond.id ? { ...c, subs: c.subs.filter((s) => s.id !== sub.id) } : c)))}
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
                {conds.length > 1 && (
                  <button
                    onClick={() => setConds((cs) => cs.filter((c) => c.id !== cond.id))}
                    className="mt-1 h-8 px-3 text-[13px] rounded-sm border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    删除该级别
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="pl-20">
            <div className="relative group inline-block">
              <button
                disabled={conds.length >= 10}
                onClick={() => setConds((cs) => [...cs, newCond()])}
                className={`h-8 px-3 text-[13px] rounded-sm border transition-colors ${
                  conds.length >= 10
                    ? "border-[hsl(var(--field-border))] text-[hsl(var(--placeholder))] bg-muted cursor-not-allowed"
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                }`}
              >
                + 点击添加预警条件（或）
              </button>
              {conds.length >= 10 && (
                <div className="absolute left-0 top-full mt-1 z-50 hidden group-hover:block px-2 py-1 text-[12px] bg-popover border border-border rounded-md shadow-lg text-[hsl(var(--label-text))] whitespace-nowrap">
                  一个预警规则最多可设置10个触发条件
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="h-8 px-5 rounded-md bg-card border border-[hsl(var(--field-border))] text-[13px] text-[hsl(var(--label-text))]">取消</button>
          <button
            onClick={() =>
              onApply(
                conds.map((c) => ({
                  level: c.level,
                  subs: c.subs.map(({ indicator, timeRange, calcMethod, op, value }) => ({ indicator, timeRange, calcMethod, op, value })),
                }))
              )
            }
            className="h-8 px-5 rounded-md bg-primary text-primary-foreground text-[13px]"
          >
            确定
          </button>
        </div>
      </div>

      <RecentDataDialog
        open={chart !== null}
        onOpenChange={(v) => { if (!v) setChart(null); }}
        timeRange={chart?.timeRange ?? ""}
        indicator={chart?.indicator ?? ""}
        alertType="统计"
      />
    </div>
  );
};
