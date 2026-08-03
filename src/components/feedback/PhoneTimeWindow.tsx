import { useState } from "react";
import { Field } from "@/components/feedback/FormField";
import { SingleSelect } from "@/components/feedback/SingleSelect";
import { MultiSelect } from "@/components/feedback/MultiSelect";

const modeOptions = [
  { label: "不限制" },
  { label: "每日" },
  { label: "每周" },
  { label: "每月" },
  { label: "工作日" },
  { label: "非工作日" },
];

const weekOptions = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((label) => ({ label }));
const dayOptions = Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}号` }));

interface Props {
  labelWidth?: string;
}

export const PhoneTimeWindow = ({ labelWidth = "w-20" }: Props) => {
  const [mode, setMode] = useState("不限制");
  const [weekdays, setWeekdays] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("18:00");

  const needTime = mode !== "不限制";

  return (
    <>
      <Field label="电话通知时间段" required labelWidth={labelWidth}>
        <div className="max-w-xs">
          <SingleSelect options={modeOptions} value={mode} onChange={setMode} />
        </div>
      </Field>
      {mode === "每周" && (
        <Field label="通知星期" required labelWidth={labelWidth}>
          <div className="max-w-md">
            <MultiSelect placeholder="请选择周几（可多选）" options={weekOptions} value={weekdays} onChange={setWeekdays} />
          </div>
        </Field>
      )}
      {mode === "每月" && (
        <Field label="通知日期" required labelWidth={labelWidth}>
          <div className="max-w-md">
            <MultiSelect placeholder="请选择几号（可多选）" options={dayOptions} value={days} onChange={setDays} />
          </div>
        </Field>
      )}
      {needTime && (
        <Field label="具体时间" required labelWidth={labelWidth}>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="h-8 px-2 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary"
            />
            <span className="text-[13px] text-[hsl(var(--label-text))]">至</span>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="h-8 px-2 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary"
            />
          </div>
        </Field>
      )}
    </>
  );
};
