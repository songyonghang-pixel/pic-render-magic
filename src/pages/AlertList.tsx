import { ChevronRight } from "lucide-react";
import { SingleSelect } from "@/components/feedback/SingleSelect";
import { Pagination } from "./AlertRules";

const rows = [
  { id: 44355, ruleId: 101, name: "【外销】【最高...", cu: "宋永航(802616...)", at: "2026-04-29 22...", level: "S", type: "实时", period: "", trigger: "", content: "手机投屏 Minh...", notify: "TT群组", tt: "", group: "宋永航(802616...)" },
  { id: 44348, ruleId: 101, name: "【外销】【最高...", cu: "宋永航(802616...)", at: "2026-04-29 22...", level: "S", type: "实时", period: "", trigger: "", content: "The user, Divya...", notify: "TT群组", tt: "", group: "宋永航(802616...)" },
  { id: 44316, ruleId: 44, name: "【快应用卡片...", cu: "徐跃泽(802470...)", at: "2026-04-29 21...", level: "B", type: "实时", period: "", trigger: "", content: "升级系统后卡...", notify: "TT", tt: "徐跃泽(802470...)", group: "" },
  { id: 44315, ruleId: 101, name: "【外销】【最高...", cu: "宋永航(802616...)", at: "2026-04-29 21...", level: "S", type: "实时", period: "", trigger: "", content: "手机投屏 ม่งเข้...", notify: "TT群组", tt: "", group: "宋永航(802616...)" },
  { id: 44303, ruleId: 101, name: "【外销】【最高...", cu: "宋永航(802616...)", at: "2026-04-29 21...", level: "S", type: "实时", period: "", trigger: "", content: "Opt-in problem...", notify: "TT群组", tt: "", group: "宋永航(802616...)" },
  { id: 44301, ruleId: 63, name: "OTA升级失败...", cu: "王兴会(802570...)", at: "2026-04-29 21...", level: "S", type: "实时", period: "", trigger: "", content: "虽然电池很耐...", notify: "TT", tt: "王兴会(802570...)", group: "" },
  { id: 44300, ruleId: 63, name: "OTA升级失败...", cu: "王兴会(802570...)", at: "2026-04-29 21...", level: "S", type: "实时", period: "", trigger: "", content: "OPPO X8 Ultra...", notify: "TT", tt: "王兴会(802570...)", group: "" },
  { id: 44293, ruleId: 90, name: "高重要度社媒...", cu: "刘承旭(W9088...)", at: "2026-04-29 21...", level: "A", type: "实时", period: "", trigger: "", content: "Oneplus 10...", notify: "TT", tt: "刘承旭(W9088...)", group: "" },
  { id: 44292, ruleId: 90, name: "高重要度社媒...", cu: "刘承旭(W9088...)", at: "2026-04-29 21...", level: "A", type: "实时", period: "", trigger: "", content: "OnePlus is rolli...", notify: "TT", tt: "刘承旭(W9088...)", group: "" },
  { id: 44288, ruleId: 90, name: "高重要度社媒...", cu: "刘承旭(W9088...)", at: "2026-04-29 21...", level: "A", type: "实时", period: "", trigger: "", content: "Đi vào rừng m...", notify: "TT", tt: "刘承旭(W9088...)", group: "" },
];

export const AlertList = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--page-bg))]">
      <div className="bg-card border-b border-border px-6 py-3 flex items-center text-[13px] text-[hsl(var(--breadcrumb))]">
        <span>预警监控</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
        <span>预警列表</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
        <span className="text-[hsl(var(--breadcrumb-active))]">查看</span>
      </div>

      {/* Filter */}
      <div className="px-6 pt-5">
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
            <Filter label="预警类型"><Select placeholder="请选择预警类型" /></Filter>
            <Filter label="预警ID"><Input placeholder="请输入预警ID" /></Filter>
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
            <button className="h-8 px-4 rounded-md bg-primary text-primary-foreground text-[13px]">导出</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] min-w-[1400px]">
              <thead>
                <tr className="bg-[hsl(var(--accent))] text-[hsl(var(--label-text))]">
                  {["预警ID", "规则ID", "规则名称", "创建人员", "预警时间", "预警级别", "预警类型", "统计周期", "触发条件", "预警内容", "通知方式", "TT通知人", "TT群组提及人", "操作"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-border">
                    <td className="py-3 px-4 text-[hsl(var(--label-text))] whitespace-nowrap">{r.id}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.ruleId}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.name}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.cu}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.at}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.level}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.type}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.period}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.trigger}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.content}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.notify}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.tt}</td>
                    <td className="py-3 px-4 text-[hsl(var(--label-text))]">{r.group}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <a className="text-primary cursor-pointer hover:underline">查看反馈</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination total={6575} />
        </div>
      </div>
    </div>
  );
};

const Filter = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-3">
    <label className="text-[13px] text-[hsl(var(--label-text))] w-[90px] text-right shrink-0">{label}</label>
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

export default AlertList;
