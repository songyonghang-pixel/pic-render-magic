import { useState } from "react";
import { ChevronDown, ChevronRight, X, Info } from "lucide-react";
import { MultiSelect } from "@/components/feedback/MultiSelect";
import { CascadeMultiSelect } from "@/components/feedback/CascadeMultiSelect";
import {
  aiTagOptions,
  brandOptions,
  marketingNameOptions,
  osVersionOptions,
  domesticExportOptions,
  feedbackSourceOptions,
  countryOptions,
  socialMediaTypeOptions,
} from "@/components/feedback/filterData";

export type RuleFilters = Record<string, string[]>;

export interface BatchRule {
  id: number;
  name: string;
  filters: RuleFilters;
}

const sentimentOptions = [{ label: "正面" }, { label: "负面" }, { label: "无情感" }];
const feedbackTypeOptions = [{ label: "咨询" }, { label: "建议" }, { label: "投诉" }, { label: "故障" }];

export const FILTER_FIELDS: { key: string; label: string; options: any[]; cascade?: boolean }[] = [
  { key: "aiTag", label: "AI标签", options: aiTagOptions, cascade: true },
  { key: "brand", label: "品牌", options: brandOptions },
  { key: "marketing", label: "机型营销名", options: marketingNameOptions, cascade: true },
  { key: "os", label: "OS版本", options: osVersionOptions },
  { key: "sale", label: "内外销", options: domesticExportOptions },
  { key: "source", label: "反馈来源", options: feedbackSourceOptions, cascade: true },
  { key: "country", label: "国家/地区", options: countryOptions },
  { key: "feedbackType", label: "反馈类型", options: feedbackTypeOptions },
  { key: "sentiment", label: "用户情感", options: sentimentOptions },
  { key: "social", label: "社媒类型", options: socialMediaTypeOptions },
];

interface Props {
  open: boolean;
  rules: BatchRule[];
  onClose: () => void;
  onApply: (mode: "add" | "edit", values: RuleFilters) => void;
}

export const BatchFilterDialog = ({ open, rules, onClose, onApply }: Props) => {
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [values, setValues] = useState<RuleFilters>({});
  const [expanded, setExpanded] = useState<number[]>(rules.slice(0, 1).map((r) => r.id));

  if (!open) return null;

  const toggle = (id: number) =>
    setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  const setField = (key: string, vals: string[]) => setValues((v) => ({ ...v, [key]: vals }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
      <div className="bg-card rounded-md w-full max-w-6xl h-[85vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="text-[15px] font-medium text-[hsl(var(--label-text))]">
            批量修改过滤条件（已选 {rules.length} 条规则）
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-[hsl(var(--placeholder))]" /></button>
        </div>

        <div className="flex-1 grid grid-cols-2 min-h-0">
          {/* 左侧：已选规则的过滤条件 */}
          <div className="border-r border-border overflow-auto p-4 space-y-2">
            <div className="text-[13px] font-medium text-[hsl(var(--label-text))] mb-1">已选规则的预警数据过滤条件</div>
            {rules.map((r) => {
              const open = expanded.includes(r.id);
              return (
                <div key={r.id} className="border border-border rounded-sm">
                  <button
                    onClick={() => toggle(r.id)}
                    className="w-full flex items-center gap-1.5 px-3 py-2 text-[13px] text-[hsl(var(--label-text))] hover:bg-[hsl(var(--accent))]"
                  >
                    {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span className="text-[hsl(var(--placeholder))]">{r.id}</span>
                    <span className="truncate">{r.name}</span>
                  </button>
                  {open && (
                    <div className="px-4 pb-3 pt-1 space-y-1.5">
                      {FILTER_FIELDS.map((f) => (
                        <div key={f.key} className="flex text-[12.5px]">
                          <span className="w-24 shrink-0 text-right pr-2 text-[hsl(var(--placeholder))]">{f.label}</span>
                          <span className="flex-1 text-[hsl(var(--label-text))]">
                            {r.filters[f.key]?.length ? r.filters[f.key].join("、") : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 右侧：编辑 */}
          <div className="overflow-auto p-4 space-y-3">
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

            <div className="space-y-3">
              {FILTER_FIELDS.map((f) => (
                <div key={f.key} className="flex items-center">
                  <label className="w-24 shrink-0 text-right pr-3 text-[13px] text-[hsl(var(--label-text))]">{f.label}</label>
                  <div className="flex-1 min-w-0">
                    {f.cascade ? (
                      <CascadeMultiSelect
                        placeholder="请选择"
                        options={f.options}
                        value={values[f.key] ?? []}
                        onChange={(v: string[]) => setField(f.key, v)}
                      />
                    ) : (
                      <MultiSelect
                        placeholder={`请选择${f.label}`}
                        options={f.options}
                        value={values[f.key] ?? []}
                        onChange={(v) => setField(f.key, v)}
                      />
                    )}
                  </div>
                </div>
              ))}
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
