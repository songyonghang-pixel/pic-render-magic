import { ChevronRight, Plus } from "lucide-react";
import { SingleSelect } from "@/components/feedback/SingleSelect";

const rows = [
  { id: 214, name: "测试ai预警2006", type: "实时", ct: "2026-04-29 20:08:12", cu: "彭海林(W9074737)", ut: "2026-04-29 20:21:33", uu: "宋永航(80261667)", count: 5, enabled: false },
  { id: 209, name: "16.1设置L3舆情预警", type: "统计", ct: "2026-04-29 15:39:24", cu: "叶春(80200542)", ut: "2026-04-29 15:39:37", uu: "叶春(80200542)", count: 0, enabled: true },
  { id: 204, name: "UI动效_16.1多彩引擎舆情...", type: "统计", ct: "2026-04-29 10:40:58", cu: "游皓翔(80397472)", ut: "2026-04-29 16:03:29", uu: "游皓翔(80397472)", count: 0, enabled: true },
  { id: 203, name: "个性化16.1预警", type: "实时", ct: "2026-04-29 10:29:25", cu: "程丽洁(80264100)", ut: "2026-04-29 16:15:33", uu: "程丽洁(80264100)", count: 5, enabled: true },
  { id: 202, name: "UI动效_16.1无缝动画舆...", type: "实时", ct: "2026-04-29 10:29:24", cu: "游皓翔(80397472)", ut: "2026-04-29 16:04:07", uu: "游皓翔(80397472)", count: 0, enabled: true },
  { id: 199, name: "桌面快稳省严重问题预警", type: "实时", ct: "2026-04-29 00:35:52", cu: "杨柳(80341332)", ut: "2026-04-29 00:49:09", uu: "杨柳(80341332)", count: 2, enabled: true },
  { id: 198, name: "桌面近期任务严重问题预警", type: "实时", ct: "2026-04-29 00:34:15", cu: "杨柳(80341332)", ut: "2026-04-29 00:49:10", uu: "杨柳(80341332)", count: 0, enabled: true },
  { id: 190, name: "桌面布局严重问题预警", type: "实时", ct: "2026-04-28 12:15:45", cu: "杨柳(80341332)", ut: "2026-04-29 15:14:12", uu: "杨柳(80341332)", count: 3, enabled: true },
  { id: 188, name: "桌面S级严重问题预警", type: "实时", ct: "2026-04-28 12:11:00", cu: "杨柳(80341332)", ut: "2026-04-28 16:18:11", uu: "杨柳(80341332)", count: 0, enabled: true },
  { id: 182, name: "桌面舆情预警监控", type: "统计", ct: "2026-04-27 20:52:58", cu: "杨柳(80341332)", ut: "2026-04-29 11:41:46", uu: "杨柳(80341332)", count: 2, enabled: true },
];

export const AlertRules = ({ onCreate }: { onCreate: () => void }) => {
  return (
    <div className="min-h-screen bg-[hsl(var(--page-bg))]">
      <div className="bg-card border-b border-border px-6 py-3 flex items-center text-[13px] text-[hsl(var(--breadcrumb))]">
        <span>预警监控</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
        <span>预警规则</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
        <span className="text-[hsl(var(--breadcrumb-active))]">查看</span>
      </div>

      {/* Filter */}
      <div className="px-6 pt-5">
        <div className="bg-[hsl(var(--primary)/0.05)] rounded-md p-5">
          <div className="text-primary font-medium text-[14px] mb-4">筛选</div>
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <Filter label="规则名称"><Input placeholder="请输入规则名称" /></Filter>
            <Filter label="预警类型"><Select placeholder="请选择预警类型" /></Filter>
            <Filter label="创建时间"><DateRange /></Filter>
            <Filter label="创建人员"><Input placeholder="请输入创建人员" /></Filter>
            <Filter label="状态"><Select placeholder="请选择状态" /></Filter>
          </div>
          <div className="border-t border-border mt-5 pt-4 flex justify-end gap-2">
            <button className="h-8 px-5 rounded-md bg-primary text-primary-foreground text-[13px]">查询</button>
            <button className="h-8 px-5 rounded-md bg-card border border-[hsl(var(--field-border))] text-[13px] text-[hsl(var(--label-text))]">重置</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 mt-4 pb-10">
        <div className="bg-card rounded-md p-5">
          <div className="flex justify-end mb-3">
            <button onClick={onCreate} className="h-8 px-4 rounded-md bg-primary text-primary-foreground text-[13px] inline-flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> 新增预警规则
            </button>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[hsl(var(--accent))] text-[hsl(var(--label-text))]">
                {["规则ID", "规则名称", "预警类型", "创建时间", "创建人员", "规则更新时间", "规则更新人", "预警次数", "启用状态", "操作"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.id}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.name}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.type}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.ct}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.cu}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.ut}</td>
                  <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.uu}</td>
                  <td className={`py-3 px-4 ${r.count > 0 ? "text-primary" : "text-[hsl(var(--label-text))]"}`}>{r.count}</td>
                  <td className="py-3 px-4">
                    <Toggle on={r.enabled} />
                  </td>
                  <td className="py-3 px-4 space-x-3">
                    <a className="text-primary cursor-pointer hover:underline">详情</a>
                    <a className="text-primary cursor-pointer hover:underline">编辑</a>
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
