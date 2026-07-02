import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Copy, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Field, TextInput, SelectInput } from "./FormField";
import { MultiSelect } from "./MultiSelect";
import { SingleSelect } from "./SingleSelect";
import { CascadeMultiSelect } from "./CascadeMultiSelect";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
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
} from "./filterData";

const feedbackTypeOptions = [{ label: "认知" }, { label: "需求" }, { label: "bug" }, { label: "其他" }];
const sentimentOptions = [{ label: "正面" }, { label: "负面" }, { label: "无情感" }];
const repeatOptions = [{ label: "是" }, { label: "否" }];
const manualOptions = [{ label: "是" }, { label: "否" }];
const upperBrandOptions = brandOptions;
const npsDurationOptions = [
  { label: "1月内" }, { label: "3月内" }, { label: "6月内" }, { label: "12月内" },
];
const logkitSourceOptions = [{ label: "用户主动" }, { label: "自动上报" }];

interface Props {
  onQuery?: (range: DateRange | undefined) => void;
}

export const AnalysisFilterPanel = ({ onQuery }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [fanOp, setFanOp] = useState<string[]>([]);
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const ruleName = params.get("ruleName");
  const ruleId = params.get("ruleId");
  const useLast7 = params.get("range") === "last7";
  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - (useLast7 ? 6 : 2));
  const [range, setRange] = useState<DateRange | undefined>({ from: defaultStart, to: today });

  const fmtRange = (r?: DateRange) => {
    if (!r?.from) return "";
    const f = format(r.from, "yyyy-MM-dd");
    const t = r.to ? format(r.to, "yyyy-MM-dd") : f;
    return `${f} 至 ${t}`;
  };

  return (
    <div className="bg-[hsl(var(--accent)/0.4)] rounded-md px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-primary text-[14px] font-medium">筛选</div>
        {ruleName && (
          <div className="text-[12px] text-[hsl(var(--label-text))] flex items-center gap-2">
            <span className="text-[hsl(var(--placeholder))]">来源预警规则：</span>
            <span className="px-2 py-0.5 rounded border border-primary/40 text-primary bg-primary/5">
              {ruleName}{ruleId ? `（规则ID：${ruleId}）` : ""}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* 机型范围 */}
        <div className="flex items-start">
          <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">机型范围</label>
          <div className="flex-1 grid grid-cols-3 gap-4">
            <Field label="品牌" labelWidth="w-20">
              <MultiSelect placeholder="请选择" options={brandOptions} value={["OPPO", "OnePlus"]} />
            </Field>
            <Field label="机型营销名" labelWidth="w-20">
              <CascadeMultiSelect placeholder="请选择" options={marketingNameOptions} />
            </Field>
            <Field label="os版本" labelWidth="w-20">
              <MultiSelect placeholder="请选择os版本" options={osVersionOptions} />
            </Field>
          </div>
        </div>

        {/* 反馈信息 */}
        <div className="flex items-start">
          <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">反馈信息</label>
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <Field label="反馈时间" labelWidth="w-20">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "h-8 w-full px-3 text-left text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm flex items-center gap-2 hover:border-primary",
                        !range?.from && "text-[hsl(var(--placeholder))]"
                      )}
                    >
                      <CalendarIcon className="w-3.5 h-3.5 shrink-0 text-[hsl(var(--placeholder))]" />
                      <span className="truncate">{range?.from ? fmtRange(range) : "请选择反馈时间"}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      numberOfMonths={2}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field label="反馈来源" labelWidth="w-20">
                <CascadeMultiSelect placeholder="请选择" options={feedbackSourceOptions} />
              </Field>
              <Field label="反馈类型" labelWidth="w-20">
                <MultiSelect placeholder="请选择类型" options={feedbackTypeOptions} />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="反馈情感" labelWidth="w-20">
                <MultiSelect placeholder="请选择类型" options={sentimentOptions} />
              </Field>
              <Field label="AI五级标签" labelWidth="w-20">
                <CascadeMultiSelect placeholder="请选择" options={aiTagOptions} />
              </Field>
              <Field label="国家/地区" labelWidth="w-20">
                <MultiSelect placeholder="请选择国家/地区" options={countryOptions} />
              </Field>
            </div>
            <div className="flex items-center">
              <label className="w-20 shrink-0 text-right pr-3 text-[13px] text-[hsl(var(--label-text))]">关键词组合</label>
              <div className="flex-1 flex items-center gap-2">
                <div className="w-32"><SelectInput value="反馈原声" /></div>
                <div className="w-24"><SelectInput value="包含" /></div>
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

        {/* 更多条件 (展开后) */}
        {expanded && (
          <div className="flex items-start pt-4 border-t border-border">
            <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">更多条件</label>
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <Field label="原声ID" labelWidth="w-24">
                  <TextInput placeholder="请输入原声ID" />
                </Field>
                <Field label="原始ID" labelWidth="w-24">
                  <TextInput placeholder="请输入原始ID" />
                </Field>
                <Field label="共创活动ID" labelWidth="w-24">
                  <TextInput placeholder="请输入共创活动ID" />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="OTA版本" labelWidth="w-24">
                  <SelectInput placeholder="请选择OTA版本号" />
                </Field>
                <Field label="应用版本号" labelWidth="w-24">
                  <TextInput placeholder="请输入应用版本号,多个版本号请用英文逗号" />
                </Field>
                <Field label="机型" labelWidth="w-24">
                  <TextInput placeholder="请输入机型,如:PHY110,多个机型请用英文逗号" />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="是否重复" labelWidth="w-24">
                  <SingleSelect placeholder="请选择" options={repeatOptions} />
                </Field>
                <Field label="是否人工导入" labelWidth="w-24">
                  <SingleSelect placeholder="请选择" options={manualOptions} />
                </Field>
                <Field label="关联原帖id" labelWidth="w-24">
                  <TextInput placeholder="请输入关联原帖id" />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="上部手机品牌" labelWidth="w-24">
                  <MultiSelect placeholder="请选择" options={upperBrandOptions} />
                </Field>
                <Field label="NPS使用时长（月）" labelWidth="w-24">
                  <SingleSelect placeholder="请选择" options={npsDurationOptions} />
                </Field>
                <Field label="外部日志ID" labelWidth="w-24">
                  <TextInput placeholder="请输入外部日志ID" />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="bugID" labelWidth="w-24">
                  <TextInput placeholder="请输入bugID" />
                </Field>
                <Field label="logkit来源类型" labelWidth="w-24">
                  <SingleSelect placeholder="请选择" options={logkitSourceOptions} />
                </Field>
                <Field label="社媒类型" labelWidth="w-24">
                  <MultiSelect placeholder="请选择" options={socialMediaTypeOptions} />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="内外销" labelWidth="w-24">
                  <MultiSelect placeholder="请选择" options={domesticExportOptions} />
                </Field>
                <Field label="粉丝量" labelWidth="w-24">
                  <div className="flex gap-2">
                    <div className="w-24 shrink-0">
                      <MultiSelect placeholder="运算符" options={fanCountOperators} value={fanOp} onChange={(v) => setFanOp(v.slice(-1))} />
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="请输入"
                      onInput={(e) => {
                        const t = e.currentTarget;
                        t.value = t.value.replace(/[^0-9]/g, "");
                      }}
                      className="flex-1 h-8 px-3 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))]"
                    />
                  </div>
                </Field>
                <Field label="预警重要度" labelWidth="w-24">
                  <MultiSelect placeholder="请选择预警重要度" options={warningImportanceOptions} />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="不良类型" labelWidth="w-24">
                  <MultiSelect placeholder="请选择不良类型" options={defectTypeOptions} />
                </Field>
                <div />
                <div />
              </div>
            </div>
          </div>
        )}

        {/* 筛选组合 */}
        <div className="flex items-start pt-4 border-t border-border">
          <label className="w-20 shrink-0 text-right pr-3 text-[13px] font-medium text-[hsl(var(--label-text))] pt-1.5">筛选组合</label>
          <div className="flex-1 flex flex-wrap gap-2">
            {["帮助与反馈与logkit数据", "动态照片", "国内华为拍照讨论", "爆炸", "系统升级失败", "全搜"].map((t) => (
              <span key={t} className="px-3 py-1 text-[12px] rounded border border-[hsl(var(--field-border))] text-[hsl(var(--placeholder))] bg-card">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-[13px] text-primary hover:underline flex items-center gap-1"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? "收起筛选条件" : "更多筛选条件"}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuery?.(range)}
            className="h-8 px-6 text-[13px] bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
          >
            查询
          </button>
          <button className="h-8 px-6 text-[13px] rounded-full border border-[hsl(var(--field-border))] text-[hsl(var(--label-text))] bg-card hover:border-primary hover:text-primary transition-colors">
            重置
          </button>
          <button className="h-8 px-6 text-[13px] rounded-full border border-[hsl(var(--field-border))] text-[hsl(var(--label-text))] bg-card hover:border-primary hover:text-primary transition-colors">
            保存筛选组合
          </button>
          <button className="h-8 px-6 text-[13px] rounded-full border border-[hsl(var(--field-border))] text-[hsl(var(--label-text))] bg-card hover:border-primary hover:text-primary transition-colors">
            分享链接
          </button>
        </div>
      </div>
    </div>
  );
};
