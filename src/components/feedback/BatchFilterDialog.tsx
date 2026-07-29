import { useState } from "react";
import { ChevronDown, ChevronRight, X, Info, Plus, Copy } from "lucide-react";
import { MultiSelect } from "@/components/feedback/MultiSelect";
import { CascadeMultiSelect } from "@/components/feedback/CascadeMultiSelect";
import { SingleSelect } from "@/components/feedback/SingleSelect";
import { Field, TextInput } from "@/components/feedback/FormField";
import {
  aiTagOptions,
  brandOptions,
  marketingNameOptions,
  osVersionOptions,
  domesticExportOptions,
  feedbackSourceOptions,
  countryOptions,
  socialMediaTypeOptions,
  defectTypeOptions,
  warningImportanceOptions,
  fanCountOperators,
} from "@/components/feedback/filterData";

export type RuleFilters = Record<string, string[]>;

export interface BatchRule {
  id: number;
  name: string;
  filters: RuleFilters;
}

const sentimentOptions = [{ label: "正面" }, { label: "负面" }, { label: "无情感" }];
const feedbackTypeOptions = [{ label: "咨询" }, { label: "建议" }, { label: "投诉" }, { label: "故障" }];
const contentDataOptions = [
  { label: "转发量" },
  { label: "点赞量" },
  { label: "评论量" },
  { label: "互动量" },
  { label: "收藏量" },
];

// 与「新建预警规则」的预警数据过滤条件保持完全一致的过滤项
export const FILTER_FIELDS: { key: string; label: string; options: any[]; cascade?: boolean }[] = [
  { key: "aiTag", label: "AI标签", options: aiTagOptions, cascade: true },
  { key: "brand", label: "品牌", options: brandOptions },
  { key: "marketing", label: "机型营销名", options: marketingNameOptions, cascade: true },
  { key: "os", label: "OS版本", options: osVersionOptions },
  { key: "sale", label: "内外销", options: domesticExportOptions },
  { key: "model", label: "机型", options: [] },
  { key: "source", label: "反馈来源", options: feedbackSourceOptions, cascade: true },
  { key: "country", label: "国家/地区", options: countryOptions },
  { key: "feedbackType", label: "反馈类型", options: feedbackTypeOptions },
  { key: "sentiment", label: "用户情感", options: sentimentOptions },
  { key: "social", label: "社媒类型", options: socialMediaTypeOptions },
  { key: "fans", label: "粉丝量", options: [] },
  { key: "importance", label: "预警重要度", options: warningImportanceOptions },
  { key: "defect", label: "不良类型", options: defectTypeOptions },
  { key: "keyword", label: "关键词组合", options: [] },
  { key: "contentData", label: "内容数据", options: contentDataOptions },
];

interface Props {
  open: boolean;
  rules: BatchRule[];
  onClose: () => void;
  onApply: (mode: "add" | "edit", values: RuleFilters) => void;
}

const numOnly = (e: React.FormEvent<HTMLInputElement>) => {
  e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
};

export const BatchFilterDialog = ({ open, rules, onClose, onApply }: Props) => {
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [values, setValues] = useState<RuleFilters>({});
  const [expanded, setExpanded] = useState<number[]>(rules.slice(0, 1).map((r) => r.id));
  const [fanOp, setFanOp] = useState<string[]>([]);
  const [kwField, setKwField] = useState("反馈原声");
  const [kwOp, setKwOp] = useState("包含");

  if (!open) return null;

  const toggle = (id: number) =>
    setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  const setField = (key: string, vals: string[]) => setValues((v) => ({ ...v, [key]: vals }));
  const val = (key: string) => values[key] ?? [];

  const contentDataVals = val("contentData");

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
      <div className="bg-card rounded-md w-full max-w-6xl h-[85vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="text-[15px] font-medium text-[hsl(var(--label-text))]">
            批量修改过滤条件（已选 {rules.length} 条规则）
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-[hsl(var(--placeholder))]" /></button>
        </div>

        <div className="flex-1 grid grid-cols-[340px_1fr] min-h-0">
          {/* 左侧：已选规则的过滤条件 */}
          <div className="border-r border-border overflow-auto p-4 space-y-2">
            <div className="text-[13px] font-medium text-[hsl(var(--label-text))] mb-1">已选规则的预警数据过滤条件</div>
            {rules.map((r) => {
              const isOpen = expanded.includes(r.id);
              return (
                <div key={r.id} className="border border-border rounded-sm">
                  <button
                    onClick={() => toggle(r.id)}
                    className="w-full flex items-center gap-1.5 px-3 py-2 text-[13px] text-[hsl(var(--label-text))] hover:bg-[hsl(var(--accent))]"
                  >
                    {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span className="text-[hsl(var(--placeholder))]">{r.id}</span>
                    <span className="truncate">{r.name}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 pt-1 space-y-1.5">
                      {FILTER_FIELDS.filter((f) => (r.filters[f.key] ?? []).length > 0).length === 0 ? (
                        <div className="text-[12.5px] text-[hsl(var(--placeholder))]">未设置任何过滤条件</div>
                      ) : (
                        FILTER_FIELDS.filter((f) => (r.filters[f.key] ?? []).length > 0).map((f) => (
                          <div key={f.key} className="flex text-[12.5px]">
                            <span className="w-24 shrink-0 text-right pr-2 text-[hsl(var(--placeholder))]">{f.label}</span>
                            <span className="flex-1 text-[hsl(var(--label-text))]">
                              {r.filters[f.key].join("、")}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 右侧：编辑（与新建预警规则的过滤条件一致） */}
          <div className="overflow-auto p-4 space-y-4">
            <div className="flex items-center gap-4 text-[13px]">
              <span className="text-[hsl(var(--label-text))]">编辑方式</span>
              {(["add", "edit"] as const).map((m) => (
                <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" checked={mode === m} onChange={() => setMode(m)} className="accent-primary" />
                  <span className={mode === m ? "text-primary" : "text-[hsl(var(--label-text))]"}>{m === "add" ? "新增" : "编辑"}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 text-[12.5px] text-[hsl(var(--label-text))] bg-[hsl(var(--primary)/0.06)] rounded-sm p-2.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
              {mode === "add"
                ? "备注：新增将在原过滤条件中增加选中的字段值（如原本选了品牌OPPO，新增选择了品牌realme，则新增确认后的品牌为OPPO、realme）。"
                : "备注：编辑时将各规则中过滤项按下方有选择字段的过滤项中的字段进行替换，未选择的字段不调整（如原本选了品牌OPPO、情感选择正面；编辑选择品牌realme，则规则的品牌变更为realme，情感不变）。"}
            </div>

            {/* 产品领域 */}
            <div className="flex items-start">
              <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">产品领域</label>
              <div className="flex-1">
                <Field label="AI标签" labelWidth="w-20">
                  <CascadeMultiSelect
                    placeholder="请选择"
                    options={aiTagOptions}
                    value={val("aiTag")}
                    onChange={(v: string[]) => setField("aiTag", v)}
                  />
                </Field>
              </div>
            </div>

            {/* 机型范围 */}
            <div className="flex items-start">
              <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">机型范围</label>
              <div className="flex-1 space-y-3">
                <Field label="品牌" labelWidth="w-20">
                  <MultiSelect placeholder="请选择品牌" options={brandOptions} value={val("brand")} onChange={(v) => setField("brand", v)} />
                </Field>
                <Field label="机型营销名" labelWidth="w-20">
                  <CascadeMultiSelect
                    placeholder="请选择"
                    options={marketingNameOptions}
                    value={val("marketing")}
                    onChange={(v: string[]) => setField("marketing", v)}
                  />
                </Field>
                <Field label="OS版本" labelWidth="w-20">
                  <MultiSelect placeholder="请选择OS版本" options={osVersionOptions} value={val("os")} onChange={(v) => setField("os", v)} />
                </Field>
                <Field label="内外销" labelWidth="w-20">
                  <MultiSelect placeholder="请选择内外销" options={domesticExportOptions} value={val("sale")} onChange={(v) => setField("sale", v)} />
                </Field>
                <Field label="机型" labelWidth="w-20">
                  <TextInput
                    placeholder="请输入机型,如PHY110,多个机型请用逗号隔开"
                    value={val("model")[0] ?? ""}
                    onChange={(v: string) => setField("model", v ? [v] : [])}
                  />
                </Field>
              </div>
            </div>

            {/* 反馈来源 */}
            <div className="flex items-start">
              <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">反馈来源</label>
              <div className="flex-1 space-y-3">
                <Field label="反馈来源" labelWidth="w-20">
                  <CascadeMultiSelect
                    placeholder="请选择"
                    options={feedbackSourceOptions}
                    value={val("source")}
                    onChange={(v: string[]) => setField("source", v)}
                  />
                </Field>
                <Field label="国家/地区" labelWidth="w-20">
                  <MultiSelect placeholder="请选择国家/地区" options={countryOptions} value={val("country")} onChange={(v) => setField("country", v)} />
                </Field>
              </div>
            </div>

            {/* 反馈内容 */}
            <div className="flex items-start">
              <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">反馈内容</label>
              <div className="flex-1 space-y-3">
                <Field label="反馈类型" labelWidth="w-20">
                  <MultiSelect placeholder="请选择反馈类型" options={feedbackTypeOptions} value={val("feedbackType")} onChange={(v) => setField("feedbackType", v)} />
                </Field>
                <Field label="用户情感" labelWidth="w-20">
                  <MultiSelect placeholder="请选择用户情感" options={sentimentOptions} value={val("sentiment")} onChange={(v) => setField("sentiment", v)} />
                </Field>
                <Field label="社媒类型" labelWidth="w-20">
                  <MultiSelect placeholder="请选择社媒类型" options={socialMediaTypeOptions} value={val("social")} onChange={(v) => setField("social", v)} />
                </Field>
                <Field label="粉丝量" labelWidth="w-20">
                  <div className="flex gap-2">
                    <div className="w-28 shrink-0">
                      <MultiSelect placeholder="运算符" options={fanCountOperators} value={fanOp} onChange={(v) => setFanOp(v.slice(-1))} />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="请输入"
                      onInput={numOnly}
                      onChange={(e) => setField("fans", e.currentTarget.value ? [`${fanOp[0] ?? ""}${e.currentTarget.value}`] : [])}
                      className="flex-1 h-8 px-3 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))]"
                    />
                  </div>
                </Field>
                <Field label="预警重要度" labelWidth="w-20">
                  <MultiSelect placeholder="请选择预警重要度" options={warningImportanceOptions} value={val("importance")} onChange={(v) => setField("importance", v)} />
                </Field>
                <Field label="不良类型" labelWidth="w-20">
                  <MultiSelect placeholder="请选择不良类型" options={defectTypeOptions} value={val("defect")} onChange={(v) => setField("defect", v)} />
                </Field>

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
                    <TextInput
                      placeholder='单行关键词为"或"，多行关键词为"且"（按enter键隔开）'
                      className="flex-1"
                      value={val("keyword")[0]?.split(" ").slice(2).join(" ") ?? ""}
                      onChange={(v: string) => setField("keyword", v ? [`${kwField} ${kwOp} ${v}`] : [])}
                    />
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
                    <MultiSelect
                      placeholder="请选择"
                      options={contentDataOptions}
                      value={contentDataVals}
                      onChange={(v) => setField("contentData", v)}
                    />
                    {contentDataVals.length > 0 && (
                      <div className="space-y-2">
                        {contentDataVals.map((m) => (
                          <div key={m} className="flex items-center gap-2">
                            <label className="w-16 shrink-0 text-right pr-3 text-[13px] text-[hsl(var(--label-text))]">{m}</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="输入数值"
                              onInput={numOnly}
                              className="w-32 h-8 px-3 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))]"
                            />
                            <span className="text-[13px] text-[hsl(var(--label-text))]">~</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="输入数值"
                              onInput={numOnly}
                              className="w-32 h-8 px-3 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))]"
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
        </div>

        <div className="px-5 py-3 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="h-8 px-5 rounded-md bg-card border border-[hsl(var(--field-border))] text-[13px] text-[hsl(var(--label-text))]">取消</button>
          <button onClick={() => onApply(mode, values)} className="h-8 px-5 rounded-md bg-primary text-primary-foreground text-[13px]">确认</button>
        </div>
      </div>
    </div>
  );
};
