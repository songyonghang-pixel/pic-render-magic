import { Section } from "@/components/feedback/Section";
import { Field, TextInput, SelectInput } from "@/components/feedback/FormField";
import { MultiSelect } from "@/components/feedback/MultiSelect";
import { CascadeMultiSelect } from "@/components/feedback/CascadeMultiSelect";
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
import { ChevronRight, Plus, Copy } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [fanOp, setFanOp] = useState<string[]>([]);
  return (
    <div className="min-h-screen bg-[hsl(var(--page-bg))]">
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
                <SelectInput value="实时" className="max-w-[200px]" />
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
                  <CascadeMultiSelect placeholder="请选择" options={aiTagOptions} className="max-w-md" />
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
                    <CascadeMultiSelect placeholder="请选择" options={marketingNameOptions} />
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
                  <MultiSelect placeholder="请选择国家/地区" options={countryOptions} />
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
                    <SelectInput placeholder="请选择反馈类型" />
                  </Field>
                  <Field label="用户情感" labelWidth="w-20">
                    <SelectInput placeholder="请选择用户情感" />
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
          <Field label="预警级别" required>
            <SelectInput placeholder="请选择预警级别" className="max-w-md" />
          </Field>
        </Section>

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
    </div>
  );
};

export default Index;
