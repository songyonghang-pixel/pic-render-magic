import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { MultiSelect } from "@/components/feedback/MultiSelect";

const alertListOptions = [
  { label: "通信与互联预警名单" }, { label: "系统安全预警名单" }, { label: "媒体与游戏预警名单" },
];
const peopleOptions = [
  { label: "彭海林(W9074737)" }, { label: "叶春(80200542)" }, { label: "游皓翔(80397472)" },
  { label: "杨柳(80341332)" }, { label: "程丽洁(80264100)" },
];

interface Props {
  open: boolean;
  count: number;
  onClose: () => void;
  onApply: (mode: "add" | "edit") => void;
}

export const BatchNotifyDialog = ({ open, count, onClose, onApply }: Props) => {
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [tt, setTt] = useState(true);
  const [phone, setPhone] = useState(false);
  const [ttGroup, setTtGroup] = useState(false);
  const [lists, setLists] = useState<string[]>([]);
  const [people, setPeople] = useState<string[]>([]);
  const [phonePeople, setPhonePeople] = useState<string[]>([]);
  const [webhook, setWebhook] = useState("");
  const [mentions, setMentions] = useState<string[]>([]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
      <div className="bg-card rounded-md w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="text-[15px] font-medium text-[hsl(var(--label-text))]">批量修改通知设置（已选 {count} 条规则）</div>
          <button onClick={onClose}><X className="w-4 h-4 text-[hsl(var(--placeholder))]" /></button>
        </div>

        <div className="p-5 space-y-4 overflow-auto">
          <div className="flex items-center gap-4 text-[13px]">
            <span className="text-[hsl(var(--label-text))]">编辑方式</span>
            {(["add", "edit"] as const).map((m) => (
              <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" checked={mode === m} onChange={() => setMode(m)} className="accent-primary" />
                <span className={mode === m ? "text-primary" : "text-[hsl(var(--label-text))]"}>{m === "add" ? "新增" : "编辑"}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 text-[12.5px] rounded-sm p-2.5 bg-destructive/10 text-destructive">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>提示：若预警规则开启“按级别分别设置”时，批量修改通知设置将关闭分别设置选项。</span>
          </div>
          <div className="text-[12.5px] bg-[hsl(var(--primary)/0.06)] rounded-sm p-2.5 text-[hsl(var(--label-text))]">
            {mode === "add" ? "备注：新增将在原通知设置中增加选中的推送方式与人员。" : "备注：编辑时会将已选择的预警规则的通知方式都调整为下方选择的方式，请核对后再确认。"}
          </div>


          <div className="flex items-center gap-5 text-[13px]">
            <span className="w-24 text-right text-[hsl(var(--label-text))]">推送方式</span>
            {[["TT", tt, setTt], ["电话通知", phone, setPhone], ["TT群组", ttGroup, setTtGroup]].map(([l, v, s]: any) => (
              <label key={l} className="flex items-center gap-1.5 cursor-pointer text-[hsl(var(--label-text))]">
                <input type="checkbox" checked={v} onChange={(e) => s(e.target.checked)} className="accent-primary" />{l}
              </label>
            ))}
          </div>

          {tt && (
            <>
              <Row label="预警名单"><MultiSelect placeholder="请选择预警名单" options={alertListOptions} value={lists} onChange={setLists} /></Row>
              <Row label="预警人员"><MultiSelect placeholder="请选择预警人员" options={peopleOptions} value={people} onChange={setPeople} /></Row>
            </>
          )}
          {phone && (
            <Row label="电话通知人员">
              <MultiSelect placeholder="电话通知人员将默认为TT预警人员，将按照TT的电话号码进行通知，若无电话号码将无法通知。" options={peopleOptions} value={phonePeople} onChange={setPhonePeople} />
            </Row>
          )}
          {ttGroup && (
            <>
              <Row label="Webhook地址TT群组">
                <input value={webhook} onChange={(e) => setWebhook(e.target.value)} placeholder="请输入Webhook地址"
                  className="w-full h-8 px-3 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))]" />
              </Row>
              <Row label="群组内提及人"><MultiSelect placeholder="请选择群组内提及人" options={peopleOptions} value={mentions} onChange={setMentions} /></Row>
            </>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="h-8 px-5 rounded-md bg-card border border-[hsl(var(--field-border))] text-[13px] text-[hsl(var(--label-text))]">取消</button>
          <button onClick={() => onApply(mode)} className="h-8 px-5 rounded-md bg-primary text-primary-foreground text-[13px]">确认</button>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <label className="w-24 shrink-0 text-right text-[13px] text-[hsl(var(--label-text))]">{label}</label>
    <div className="flex-1 min-w-0">{children}</div>
  </div>
);
