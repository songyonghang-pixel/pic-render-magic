import { ChevronRight, Plus, Sparkles, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { SingleSelect } from "@/components/feedback/SingleSelect";
import { MultiSelect } from "@/components/feedback/MultiSelect";
import { BatchFilterDialog, FILTER_FIELDS, RuleFilters } from "@/components/feedback/BatchFilterDialog";
import { BatchNotifyDialog } from "@/components/feedback/BatchNotifyDialog";

const productTeamOptions = [
  { label: "三方专项" }, { label: "通信与互联" }, { label: "小布记忆" },
  { label: "DFX&底软" }, { label: "媒体与游戏" }, { label: "中国区" },
  { label: "短距" }, { label: "系统安全" }, { label: "通信协议" },
  { label: "平台安全" }, { label: "应用安全" },
];

const initialRows = [
  { id: 214, name: "测试ai预警2006", type: "实时", ct: "2026-04-29 20:08:12", cu: "彭海林(W9074737)", ut: "2026-04-29 20:21:33", uu: "宋永航(80261667)", team: "通信与互联", count: 5, enabled: false, filters: { brand: ["OPPO"], sentiment: ["负面"], os: ["16.1"] } as RuleFilters },
  { id: 209, name: "16.1设置L3舆情预警", type: "统计", ct: "2026-04-29 15:39:24", cu: "叶春(80200542)", ut: "2026-04-29 15:39:37", uu: "叶春(80200542)", team: "系统安全", count: 0, enabled: true, filters: { brand: ["OPPO", "OnePlus"], sentiment: ["正面"] } as RuleFilters },
  { id: 204, name: "UI动效_16.1多彩引擎舆情...", type: "统计", ct: "2026-04-29 10:40:58", cu: "游皓翔(80397472)", ut: "2026-04-29 16:03:29", uu: "游皓翔(80397472)", team: "媒体与游戏", count: 0, enabled: true, filters: { brand: ["realme"], sale: ["内销"] } as RuleFilters },
  { id: 203, name: "个性化16.1预警", type: "实时", ct: "2026-04-29 10:29:25", cu: "程丽洁(80264100)", ut: "2026-04-29 16:15:33", uu: "程丽洁(80264100)", team: "中国区", count: 5, enabled: true, filters: { brand: ["OPPO"], feedbackType: ["投诉"] } as RuleFilters },
  { id: 202, name: "UI动效_16.1无缝动画舆...", type: "实时", ct: "2026-04-29 10:29:24", cu: "游皓翔(80397472)", ut: "2026-04-29 16:04:07", uu: "游皓翔(80397472)", team: "媒体与游戏", count: 0, enabled: true, filters: { os: ["17.1"] } as RuleFilters },
  { id: 199, name: "桌面快稳省严重问题预警", type: "实时", ct: "2026-04-29 00:35:52", cu: "杨柳(80341332)", ut: "2026-04-29 00:49:09", uu: "杨柳(80341332)", team: "DFX&底软", count: 2, enabled: true, filters: { brand: ["小米"], sentiment: ["负面"] } as RuleFilters },
  { id: 198, name: "桌面近期任务严重问题预警", type: "实时", ct: "2026-04-29 00:34:15", cu: "杨柳(80341332)", ut: "2026-04-29 00:49:10", uu: "杨柳(80341332)", team: "DFX&底软", count: 0, enabled: true, filters: { sale: ["外销"] } as RuleFilters },
  { id: 190, name: "桌面布局严重问题预警", type: "实时", ct: "2026-04-28 12:15:45", cu: "杨柳(80341332)", ut: "2026-04-29 15:14:12", uu: "杨柳(80341332)", team: "平台安全", count: 3, enabled: true, filters: { brand: ["荣耀"] } as RuleFilters },
  { id: 188, name: "桌面S级严重问题预警", type: "实时", ct: "2026-04-28 12:11:00", cu: "杨柳(80341332)", ut: "2026-04-28 16:18:11", uu: "杨柳(80341332)", team: "应用安全", count: 0, enabled: true, filters: { sentiment: ["无情感"] } as RuleFilters },
  { id: 182, name: "桌面舆情预警监控", type: "统计", ct: "2026-04-27 20:52:58", cu: "杨柳(80341332)", ut: "2026-04-29 11:41:46", uu: "杨柳(80341332)", team: "通信协议", count: 2, enabled: true, filters: { brand: ["华为"], os: ["15.1"] } as RuleFilters },
];

export const AlertRules = ({ onCreate, onAiCreate, onCopy }: { onCreate: (type?: string) => void; onAiCreate?: (type?: string) => void; onCopy?: (name: string, type: string) => void }) => {
  const [subTab, setSubTab] = useState<"实时" | "统计">("实时");
  const [rows, setRows] = useState(initialRows);
  const [selected, setSelected] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterDlg, setFilterDlg] = useState(false);
  const [notifyDlg, setNotifyDlg] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => setSelected([]), [subTab]);

  const filteredRows = rows.filter((r) => r.type === subTab);
  const selectedRows = filteredRows.filter((r) => selected.includes(r.id));
  const allChecked = filteredRows.length > 0 && filteredRows.every((r) => selected.includes(r.id));

  const toggleRow = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () => setSelected(allChecked ? [] : filteredRows.map((r) => r.id));

  const requireSelection = () => {
    if (selected.length === 0) {
      toast("请先选择预警规则");
      return false;
    }
    return true;
  };

  const batchAction = (action: string) => {
    setMenuOpen(false);
    if (!requireSelection()) return;
    if (action === "enable" || action === "disable") {
      setRows((rs) => rs.map((r) => (selected.includes(r.id) ? { ...r, enabled: action === "enable" } : r)));
      toast(`已批量${action === "enable" ? "启用" : "禁用"} ${selected.length} 条规则`);
      setSelected([]);
    } else if (action === "delete") {
      setRows((rs) => rs.filter((r) => !selected.includes(r.id)));
      toast(`已批量删除 ${selected.length} 条规则`);
      setSelected([]);
    } else if (action === "filter") setFilterDlg(true);
    else if (action === "notify") setNotifyDlg(true);
  };

  const applyFilters = (mode: "add" | "edit", values: RuleFilters) => {
    setRows((rs) =>
      rs.map((r) => {
        if (!selected.includes(r.id)) return r;
        const next: RuleFilters = { ...r.filters };
        FILTER_FIELDS.forEach((f) => {
          const picked = values[f.key] ?? [];
          if (picked.length === 0) return;
          next[f.key] = mode === "add" ? Array.from(new Set([...(next[f.key] ?? []), ...picked])) : picked;
        });
        return { ...r, filters: next };
      })
    );
    setFilterDlg(false);
    toast(`已${mode === "add" ? "新增" : "编辑"}更新 ${selected.length} 条规则的过滤条件`);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--page-bg))]">
      <div className="bg-card border-b border-border px-6 py-3 flex items-center text-[13px] text-[hsl(var(--breadcrumb))]">
        <span>预警监控</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
        <span>预警规则</span>
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
            <Filter label="规则名称"><Input placeholder="请输入规则名称" /></Filter>
            <Filter label="创建时间"><DateRange /></Filter>
            <Filter label="创建人员"><Input placeholder="请输入创建人员" /></Filter>
            <Filter label="状态"><Select placeholder="请选择状态" /></Filter>
            <Filter label="产品团队"><MultiSelect placeholder="请选择产品团队" options={productTeamOptions} /></Filter>
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
          <div className="flex justify-end gap-2 mb-3">
            <button onClick={() => onCreate(subTab)} className="h-8 px-4 rounded-md bg-primary text-primary-foreground text-[13px] inline-flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> 新增预警规则
            </button>
            <button onClick={() => onAiCreate?.(subTab)} className="h-8 px-4 rounded-md bg-card border border-primary text-primary text-[13px] inline-flex items-center gap-1 hover:bg-[hsl(var(--primary)/0.08)]">
              <Sparkles className="w-3.5 h-3.5" /> AI创建预警规则
            </button>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[hsl(var(--accent))] text-[hsl(var(--label-text))]">
                {["规则ID", "规则名称", "预警类型", "创建时间", "创建人员", "规则更新时间", "规则更新人", "产品团队", "预警次数", "启用状态", "操作"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.id}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.name}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.type}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.ct}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.cu}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.ut}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.uu}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.team}</td>
                  <td className={`py-3 px-4 ${r.count > 0 ? "text-primary" : "text-[hsl(var(--label-text))]"}`}>{r.count}</td>
                  <td className="py-3 px-4">
                    <Toggle on={r.enabled} />
                  </td>
                  <td className="py-3 px-4 space-x-3">
                    <a className="text-primary cursor-pointer hover:underline">详情</a>
                    <a className="text-primary cursor-pointer hover:underline">编辑</a>
                    <a className="text-primary cursor-pointer hover:underline" onClick={() => onCopy?.(`副本-${r.name}`, r.type)}>复制</a>
                    <a className="text-primary cursor-pointer hover:underline">删除</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination total={76} />
        </div>
      </div>
    </div>
  );
};

const Filter = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <label className="text-[13px] text-[hsl(var(--label-text))] w-[78px] text-right shrink-0">{label}</label>
    <div className="flex-1">{children}</div>
  </div>
);

const Input = ({ placeholder }: { placeholder: string }) => (
  <input placeholder={placeholder} className="h-8 w-full px-3 text-[13px] rounded-md border border-[hsl(var(--field-border))] bg-card focus:border-primary focus:outline-none placeholder:text-[hsl(var(--placeholder))]" />
);

const Select = ({ placeholder }: { placeholder: string }) => (
  <div className="h-8"><SingleSelect options={[]} value="" placeholder={placeholder} /></div>
);

const DateRange = () => (
  <div className="flex items-center gap-2">
    <input placeholder="开始日期" className="h-8 flex-1 px-3 text-[13px] rounded-md border border-[hsl(var(--field-border))] bg-card placeholder:text-[hsl(var(--placeholder))]" />
    <span className="text-[hsl(var(--placeholder))] text-[13px]">至</span>
    <input placeholder="结束日期" className="h-8 flex-1 px-3 text-[13px] rounded-md border border-[hsl(var(--field-border))] bg-card placeholder:text-[hsl(var(--placeholder))]" />
  </div>
);

const Toggle = ({ on }: { on: boolean }) => (
  <button className={`relative w-9 h-5 rounded-full transition-colors ${on ? "bg-primary" : "bg-[hsl(var(--field-border))]"}`}>
    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`} />
  </button>
);

export const Pagination = ({ total }: { total: number }) => (
  <div className="flex justify-end items-center gap-3 mt-4 text-[13px] text-[hsl(var(--label-text))]">
    <span>共 {total} 条</span>
    <div className="w-[90px]">
      <SingleSelect options={[{ label: "10条/页" }, { label: "20条/页" }, { label: "50条/页" }]} value="10条/页" />
    </div>
    <div className="flex items-center gap-1">
      <button className="w-7 h-7 rounded border border-[hsl(var(--field-border))] hover:border-primary hover:text-primary">{"<"}</button>
      {[1, 2, 3, 4, 5, 6].map((p) => (
        <button key={p} className={`w-7 h-7 rounded ${p === 1 ? "bg-primary text-primary-foreground" : "border border-[hsl(var(--field-border))] hover:border-primary hover:text-primary"}`}>{p}</button>
      ))}
      <span className="px-1">...</span>
      <button className="w-9 h-7 rounded border border-[hsl(var(--field-border))] hover:border-primary hover:text-primary">{Math.max(8, Math.ceil(total / 10))}</button>
      <button className="w-7 h-7 rounded border border-[hsl(var(--field-border))] hover:border-primary hover:text-primary">{">"}</button>
    </div>
  </div>
);

export default AlertRules;
