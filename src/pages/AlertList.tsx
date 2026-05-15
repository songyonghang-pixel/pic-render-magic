import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SingleSelect } from "@/components/feedback/SingleSelect";
import { Pagination } from "./AlertRules";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type Status = "待处理" | "处理中" | "已关闭";

interface Row {
  id: number; ruleId: number; name: string; cu: string; at: string; level: string;
  type: string; period: string; trigger: string; content: string; notify: string; tt: string; group: string;
  status: Status; priority: string; handler: string; remark: string; closeReason: string; closeReasonOther: string; noahId: string;
  accuracy: "未反馈" | "不准确"; inaccurateReason: string;
}

const rawRows = [
  { id: 44355, ruleId: 101, name: "【外销】【最高...", cu: "宋永航(802616...)", at: "2026-04-29 22...", level: "S", type: "实时", period: "", trigger: "", content: "手机投屏 Minh...", notify: "TT群组", tt: "", group: "宋永航(802616...)", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44348, ruleId: 101, name: "【外销】【最高...", cu: "宋永航(802616...)", at: "2026-04-29 22...", level: "S", type: "实时", period: "", trigger: "", content: "The user, Divya...", notify: "TT群组", tt: "", group: "宋永航(802616...)", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44316, ruleId: 44, name: "【快应用卡片...", cu: "徐跃泽(802470...)", at: "2026-04-29 21...", level: "B", type: "实时", period: "", trigger: "", content: "升级系统后卡...", notify: "TT", tt: "徐跃泽(802470...)", group: "", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44315, ruleId: 101, name: "【外销】【最高...", cu: "宋永航(802616...)", at: "2026-04-29 21...", level: "S", type: "实时", period: "", trigger: "", content: "手机投屏 ม่งเข้...", notify: "TT群组", tt: "", group: "宋永航(802616...)", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44303, ruleId: 101, name: "【外销】【最高...", cu: "宋永航(802616...)", at: "2026-04-29 21...", level: "S", type: "实时", period: "", trigger: "", content: "Opt-in problem...", notify: "TT群组", tt: "", group: "宋永航(802616...)", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44301, ruleId: 63, name: "OTA升级失败...", cu: "王兴会(802570...)", at: "2026-04-29 21...", level: "S", type: "实时", period: "", trigger: "", content: "虽然电池很耐...", notify: "TT", tt: "王兴会(802570...)", group: "", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44300, ruleId: 63, name: "OTA升级失败...", cu: "王兴会(802570...)", at: "2026-04-29 21...", level: "S", type: "实时", period: "", trigger: "", content: "OPPO X8 Ultra...", notify: "TT", tt: "王兴会(802570...)", group: "", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44293, ruleId: 90, name: "高重要度社媒...", cu: "刘承旭(W9088...)", at: "2026-04-29 21...", level: "A", type: "实时", period: "", trigger: "", content: "Oneplus 10...", notify: "TT", tt: "刘承旭(W9088...)", group: "", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44292, ruleId: 90, name: "高重要度社媒...", cu: "刘承旭(W9088...)", at: "2026-04-29 21...", level: "A", type: "实时", period: "", trigger: "", content: "OnePlus is rolli...", notify: "TT", tt: "刘承旭(W9088...)", group: "", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44288, ruleId: 90, name: "高重要度社媒...", cu: "刘承旭(W9088...)", at: "2026-04-29 21...", level: "A", type: "实时", period: "", trigger: "", content: "Đi vào rừng m...", notify: "TT", tt: "刘承旭(W9088...)", group: "", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44280, ruleId: 209, name: "16.1设置L3舆情预警", cu: "叶春(80200542)", at: "2026-04-29 20...", level: "A", type: "统计", period: "1小时", trigger: "反馈量 > 50", content: "1小时内反馈量达 78", notify: "TT群组", tt: "", group: "叶春(80200542)", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44275, ruleId: 204, name: "UI动效_16.1多彩引擎舆情...", cu: "游皓翔(80397472)", at: "2026-04-29 19...", level: "B", type: "统计", period: "30分钟", trigger: "反馈量 > 20", content: "30分钟内反馈量达 25", notify: "TT", tt: "游皓翔(80397472)", group: "", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
  { id: 44260, ruleId: 182, name: "桌面舆情预警监控", cu: "杨柳(80341332)", at: "2026-04-29 18...", level: "S", type: "统计", period: "当日", trigger: "AI聚类标签聚类量 > 100", content: "当日聚类量达 156", notify: "TT群组", tt: "", group: "杨柳(80341332)", status: "待处理", priority: "", handler: "", remark: "", closeReason: "", closeReasonOther: "", noahId: "" },
];
const initialRows: Row[] = rawRows.map((r) => ({ ...r, accuracy: "未反馈", inaccurateReason: "" } as Row));

interface AlertListProps {
  onShowAnalysis?: () => void;
}

const PRIORITY_OPTS = ["P0", "P1", "P2", "P3"];
const HANDLER_OPTS = ["宋永航(80261667)", "叶春(80200542)", "杨柳(80341332)", "游皓翔(80397472)", "王兴会(80257000)"];
const CLOSE_REASON_OPTS = ["非问题", "已建单跟进", "已知问题", "已解决", "其他问题"];

export const AlertList = ({ onShowAnalysis }: AlertListProps) => {
  const [subTab, setSubTab] = useState<"实时" | "统计">("实时");
  const [data, setData] = useState<Row[]>(initialRows);
  const [handleTarget, setHandleTarget] = useState<Row | null>(null);
  const [closeTarget, setCloseTarget] = useState<Row | null>(null);
  const [inaccurateTarget, setInaccurateTarget] = useState<Row | null>(null);

  const filteredRows = data.filter((r) => r.type === subTab);

  const updateRow = (id: number, patch: Partial<Row>) => {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--page-bg))]">
      <div className="bg-card border-b border-border px-6 py-3 flex items-center text-[13px] text-[hsl(var(--breadcrumb))]">
        <span>预警监控</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
        <span>预警列表</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
        <span className="text-[hsl(var(--breadcrumb-active))]">查看</span>
      </div>

      {/* Sub tabs */}
      <div className="px-6 pt-4">
        <div className="flex items-center gap-6 border-b border-border">
          {(["实时", "统计"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setSubTab(k)}
              className={`relative py-2.5 text-[14px] transition-colors ${
                subTab === k
                  ? "text-primary font-medium after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-px after:h-0.5 after:bg-primary"
                  : "text-[hsl(var(--label-text))] hover:text-primary"
              }`}
            >
              {k}预警
            </button>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="px-6 pt-4">
        <div className="bg-[hsl(var(--primary)/0.05)] rounded-md p-5">
          <div className="text-primary font-medium text-[14px] mb-4">筛选</div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <Filter label="创建人员"><Input placeholder="请输入创建人员" /></Filter>
            <Filter label="预警时间"><DateRange /></Filter>
            <Filter label="预警规则名称"><Input placeholder="请输入预警规则名称" /></Filter>
            <Filter label="预警级别"><Select placeholder="请选择预警级别" /></Filter>
            <Filter label="通知方式"><Select placeholder="请选择通知方式" /></Filter>
            <Filter label="TT通知人"><Input placeholder="请输入TT通知人" /></Filter>
            <Filter label="规则ID"><Select placeholder="请选择规则ID" /></Filter>
            <Filter label="预警ID"><Input placeholder="请输入预警ID" /></Filter>
            <Filter label="处理状态"><Select placeholder="请选择处理状态" /></Filter>
            <Filter label="处理优先级"><Select placeholder="请选择处理优先级" /></Filter>
            <Filter label="处理人"><Select placeholder="请选择处理人" /></Filter>
            <Filter label="处理备注"><Input placeholder="请输入处理备注" /></Filter>
            <Filter label="关闭原因"><Select placeholder="请选择关闭原因" /></Filter>
            <Filter label="诺亚ID"><Input placeholder="请输入诺亚ID" /></Filter>
            <Filter label="预警准确性"><Select placeholder="请选择预警准确性" options={["不准确", "未反馈"]} /></Filter>
            <Filter label="预警不准说明"><Input placeholder="请输入预警不准说明" /></Filter>
          </div>
          <div className="border-t border-border mt-5 pt-4 flex justify-end gap-2">
            <button className="h-8 px-5 rounded-md bg-primary text-primary-foreground text-[13px]">查询</button>
            <button className="h-8 px-5 rounded-md bg-card border border-[hsl(var(--field-border))] text-[13px] text-[hsl(var(--label-text))]">重置</button>
            <button onClick={() => toast("已复制该筛选条件的分享链接")} className="h-8 px-5 rounded-md bg-card border border-[hsl(var(--field-border))] text-[13px] text-[hsl(var(--label-text))]">分享链接</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 mt-4 pb-10">
        <div className="bg-card rounded-md p-5">
          <div className="flex justify-end mb-3">
            <button className="h-8 px-4 rounded-md bg-primary text-primary-foreground text-[13px]">导出</button>
          </div>
          <div className="overflow-x-auto">
            {subTab === "实时" ? (
              <table className="w-full text-[13px] min-w-[2200px]">
                <thead>
                  <tr className="bg-[hsl(var(--accent))] text-[hsl(var(--label-text))]">
                    {[
                      { label: "预警ID" },
                      { label: "规则ID" },
                      { label: "规则名称" },
                      { label: "创建人员" },
                      { label: "预警时间" },
                      { label: "预警级别" },
                      { label: "预警内容", w: "w-[400px]" },
                      { label: "通知方式" },
                      { label: "TT通知人" },
                      { label: "TT群组提及人" },
                      { label: "处理状态" },
                      { label: "处理优先级" },
                      { label: "处理人" },
                      { label: "处理备注" },
                      { label: "关闭原因" },
                      { label: "诺亚ID" },
                      { label: "预警准确性" },
                      { label: "预警不准说明" },
                      { label: "操作", sticky: true },
                    ].map((h) => (
                      <th key={h.label} className={`text-left py-3 px-4 font-medium whitespace-nowrap ${h.w ?? ""} ${h.sticky ? "sticky right-0 bg-[hsl(var(--accent))] shadow-[-4px_0_8px_-4px_hsl(var(--border))]" : ""}`}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r) => (
                    <tr key={r.id} className="border-b border-border">
                      <td className="py-3 px-4 text-[hsl(var(--label-text))] whitespace-nowrap">{r.id}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.ruleId}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.name}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.cu}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.at}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.level}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))] w-[400px]">
                        {r.content.includes("手机投屏") ? (
                          <a href="https://www.douyin.com/video/7637124802519709032" target="_blank" rel="noopener noreferrer" className="text-primary cursor-pointer hover:underline">{r.content}</a>
                        ) : r.content}
                      </td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.notify}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.tt}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.group}</td>
                      <StatusCells r={r} />
                      <td className="py-3 px-4 whitespace-nowrap sticky right-0 bg-card shadow-[-4px_0_8px_-4px_hsl(var(--border))]">
                        <div className="flex items-center gap-3">
                          <a className="text-primary cursor-pointer hover:underline">查看反馈</a>
                          <ActionLinks r={r} onHandle={() => setHandleTarget(r)} onClose={() => setCloseTarget(r)} onInaccurate={() => setInaccurateTarget(r)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-[13px] min-w-[2600px]">
                <thead>
                  <tr className="bg-[hsl(var(--accent))] text-[hsl(var(--label-text))]">
                    {[
                      { label: "预警ID" },
                      { label: "规则ID" },
                      { label: "规则名称" },
                      { label: "预警时间" },
                      { label: "触发条件", w: "w-[280px]" },
                      { label: "预警内容", w: "w-[400px]" },
                      { label: "预警级别" },
                      { label: "统计周期" },
                      { label: "创建人员" },
                      { label: "预警类型" },
                      { label: "通知方式" },
                      { label: "TT通知人" },
                      { label: "TT群组提及人" },
                      { label: "处理状态" },
                      { label: "处理优先级" },
                      { label: "处理人" },
                      { label: "处理备注" },
                      { label: "关闭原因" },
                      { label: "诺亚ID" },
                      { label: "预警准确性" },
                      { label: "预警不准说明" },
                      { label: "操作", sticky: true },
                    ].map((h) => (
                      <th key={h.label} className={`text-left py-3 px-4 font-medium whitespace-nowrap ${h.w ?? ""} ${h.sticky ? "sticky right-0 bg-[hsl(var(--accent))] shadow-[-4px_0_8px_-4px_hsl(var(--border))]" : ""}`}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r) => (
                    <tr key={r.id} className="border-b border-border">
                      <td className="py-3 px-4 text-[hsl(var(--label-text))] whitespace-nowrap">{r.id}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.ruleId}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.name}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.at}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))] w-[280px]">{r.trigger}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))] w-[400px]">{r.content}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.level}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.period}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.cu}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.type}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.notify}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.tt}</td>
                      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.group}</td>
                      <StatusCells r={r} />
                      <td className="py-3 px-4 whitespace-nowrap sticky right-0 bg-card shadow-[-4px_0_8px_-4px_hsl(var(--border))]">
                        <div className="flex items-center gap-3">
                          <a className="text-primary cursor-pointer hover:underline">查看反馈</a>
                          <a className="text-primary cursor-pointer hover:underline" onClick={() => onShowAnalysis?.()}>反馈趋势</a>
                          <a className="text-primary cursor-pointer hover:underline" onClick={() => window.open(r.name.includes("16.1设置L3舆情预警") ? "/reports/ai-generating.html" : "/reports/feedback_analysis_report_2026-05-07.html", "_blank")}>AI总结</a>
                          <ActionLinks r={r} onHandle={() => setHandleTarget(r)} onClose={() => setCloseTarget(r)} onInaccurate={() => setInaccurateTarget(r)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <Pagination total={6575} />
        </div>
      </div>

      <HandleDialog
        row={handleTarget}
        onClose={() => setHandleTarget(null)}
        onConfirm={(patch) => {
          if (handleTarget) updateRow(handleTarget.id, { ...patch, status: "处理中" });
          setHandleTarget(null);
        }}
      />
      <CloseDialog
        row={closeTarget}
        onClose={() => setCloseTarget(null)}
        onConfirm={(patch) => {
          if (closeTarget) updateRow(closeTarget.id, { ...patch, status: "已关闭" });
          setCloseTarget(null);
        }}
      />
      <InaccurateDialog
        row={inaccurateTarget}
        onClose={() => setInaccurateTarget(null)}
        onConfirm={(reason) => {
          if (inaccurateTarget) updateRow(inaccurateTarget.id, { accuracy: "不准确", inaccurateReason: reason });
          setInaccurateTarget(null);
        }}
      />
    </div>
  );
};

const StatusCells = ({ r }: { r: Row }) => {
  const statusColor = r.status === "待处理" ? "text-[hsl(var(--label-text))]" : r.status === "处理中" ? "text-[#f59e0b]" : "text-[hsl(var(--label-text)/0.6)]";
  const closeReasonText = r.closeReason === "其他问题" && r.closeReasonOther ? `其他问题：${r.closeReasonOther}` : r.closeReason;
  return (
    <>
      <td className={`py-3 px-4 whitespace-nowrap ${statusColor}`}>{r.status}</td>
      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.priority}</td>
      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.handler}</td>
      <td className="py-3 px-4 text-[hsl(var(--label-text))] max-w-[200px] truncate" title={r.remark}>{r.remark}</td>
      <td className="py-3 px-4 text-[hsl(var(--label-text))]">{closeReasonText}</td>
      <td className="py-3 px-4">
        {r.noahId ? (
          <a className="text-primary cursor-pointer hover:underline" onClick={() => toast(`打开诺亚单：${r.noahId}`)}>{r.noahId}</a>
        ) : ""}
      </td>
    </>
  );
};

const ActionLinks = ({ r, onHandle, onClose }: { r: Row; onHandle: () => void; onClose: () => void }) => {
  const canHandle = r.status === "待处理" || r.status === "处理中";
  return (
    <div className="flex items-center gap-3">
      <a
        className={canHandle ? "text-primary cursor-pointer hover:underline" : "text-[hsl(var(--label-text)/0.4)] cursor-not-allowed"}
        onClick={canHandle ? onHandle : undefined}
      >
        处理
      </a>
      <a className="text-primary cursor-pointer hover:underline" onClick={onClose}>关闭</a>
    </div>
  );
};

const HandleDialog = ({ row, onClose, onConfirm }: { row: Row | null; onClose: () => void; onConfirm: (patch: Partial<Row>) => void }) => {
  const [priority, setPriority] = useState("");
  const [handler, setHandler] = useState("");
  const [remark, setRemark] = useState("");
  const [noahId, setNoahId] = useState("");

  const open = !!row;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="max-w-[480px]"
        onOpenAutoFocus={() => {
          if (row) { setPriority(row.priority); setHandler(row.handler); setRemark(row.remark); setNoahId(row.noahId); }
        }}
      >
        <DialogHeader><DialogTitle>处理预警</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <FormRow label="处理优先级">
            <SingleSelect options={PRIORITY_OPTS.map((v) => ({ label: v, value: v }))} value={priority} onChange={setPriority} placeholder="请选择处理优先级" />
          </FormRow>
          <FormRow label="处理人">
            <SingleSelect options={HANDLER_OPTS.map((v) => ({ label: v, value: v }))} value={handler} onChange={setHandler} placeholder="请选择处理人" />
          </FormRow>
          <FormRow label="处理备注">
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="请输入处理备注"
              className="w-full min-h-[80px] px-3 py-2 text-[13px] rounded-md border border-[hsl(var(--field-border))] bg-card placeholder:text-[hsl(var(--placeholder))] focus:border-primary focus:outline-none"
            />
          </FormRow>
          <FormRow label="诺亚ID">
            <input
              value={noahId}
              onChange={(e) => setNoahId(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="请输入诺亚ID（仅数字）"
              className="w-full h-8 px-3 text-[13px] rounded-md border border-[hsl(var(--field-border))] bg-card placeholder:text-[hsl(var(--placeholder))] focus:border-primary focus:outline-none"
            />
          </FormRow>
        </div>
        <DialogFooter>
          <button onClick={onClose} className="h-8 px-5 rounded-md bg-card border border-[hsl(var(--field-border))] text-[13px] text-[hsl(var(--label-text))]">取消</button>
          <button onClick={() => onConfirm({ priority, handler, remark, noahId })} className="h-8 px-5 rounded-md bg-primary text-primary-foreground text-[13px]">确认</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CloseDialog = ({ row, onClose, onConfirm }: { row: Row | null; onClose: () => void; onConfirm: (patch: Partial<Row>) => void }) => {
  const [reason, setReason] = useState("");
  const [reasonOther, setReasonOther] = useState("");
  const [noahId, setNoahId] = useState("");

  const open = !!row;

  const handleConfirm = () => {
    if (!reason) { toast.error("请选择关闭原因"); return; }
    if (reason === "其他问题" && !reasonOther.trim()) { toast.error("请输入其他问题描述"); return; }
    onConfirm({ closeReason: reason, closeReasonOther: reasonOther, noahId });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="max-w-[480px]"
        onOpenAutoFocus={() => {
          if (row) { setReason(row.closeReason); setReasonOther(row.closeReasonOther); setNoahId(row.noahId); }
        }}
      >
        <DialogHeader><DialogTitle>关闭预警</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <FormRow label={<span><span className="text-destructive">*</span> 关闭原因</span>}>
            <SingleSelect options={CLOSE_REASON_OPTS.map((v) => ({ label: v, value: v }))} value={reason} onChange={setReason} placeholder="请选择关闭原因" />
          </FormRow>
          {reason === "其他问题" && (
            <FormRow label="问题描述">
              <input
                value={reasonOther}
                onChange={(e) => setReasonOther(e.target.value)}
                placeholder="请输入问题描述"
                className="w-full h-8 px-3 text-[13px] rounded-md border border-[hsl(var(--field-border))] bg-card placeholder:text-[hsl(var(--placeholder))] focus:border-primary focus:outline-none"
              />
            </FormRow>
          )}
          <FormRow label="诺亚ID">
            <input
              value={noahId}
              onChange={(e) => setNoahId(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              placeholder="请输入诺亚ID（仅数字）"
              className="w-full h-8 px-3 text-[13px] rounded-md border border-[hsl(var(--field-border))] bg-card placeholder:text-[hsl(var(--placeholder))] focus:border-primary focus:outline-none"
            />
          </FormRow>
        </div>
        <DialogFooter>
          <button onClick={onClose} className="h-8 px-5 rounded-md bg-card border border-[hsl(var(--field-border))] text-[13px] text-[hsl(var(--label-text))]">取消</button>
          <button onClick={handleConfirm} className="h-8 px-5 rounded-md bg-primary text-primary-foreground text-[13px]">确认</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FormRow = ({ label, children }: { label: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <label className="text-[13px] text-[hsl(var(--label-text))] w-[90px] text-right shrink-0 pt-1.5">{label}</label>
    <div className="flex-1">{children}</div>
  </div>
);

const Filter = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <label className="text-[13px] text-[hsl(var(--label-text))] w-[90px] text-right shrink-0">{label}</label>
    <div className="flex-1">{children}</div>
  </div>
);

const Input = ({ placeholder }: { placeholder: string }) => (
  <input placeholder={placeholder} className="h-8 w-full px-3 text-[13px] rounded-md border border-[hsl(var(--field-border))] bg-card focus:border-primary focus:outline-none placeholder:text-[hsl(var(--placeholder))]" />
);

const Select = ({ placeholder, options = [] }: { placeholder: string; options?: string[] }) => (
  <div className="h-8"><SingleSelect options={options.map((v) => ({ label: v, value: v }))} value="" placeholder={placeholder} /></div>
);

const DateRange = () => (
  <div className="flex items-center gap-2">
    <input placeholder="开始日期" className="h-8 flex-1 px-3 text-[13px] rounded-md border border-[hsl(var(--field-border))] bg-card placeholder:text-[hsl(var(--placeholder))]" />
    <span className="text-[hsl(var(--placeholder))] text-[13px]">至</span>
    <input placeholder="结束日期" className="h-8 flex-1 px-3 text-[13px] rounded-md border border-[hsl(var(--field-border))] bg-card placeholder:text-[hsl(var(--placeholder))]" />
  </div>
);

export default AlertList;
