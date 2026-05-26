import { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
  extra?: ReactNode;
}

export const Section = ({ title, children, extra }: SectionProps) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[15px] font-semibold text-[hsl(var(--section-title))]">{title}</h3>
      {extra && <div className="flex items-center">{extra}</div>}
    </div>
    <div className="bg-[hsl(var(--section-bg))] rounded-sm px-6 py-5 space-y-4">{children}</div>
  </div>
);
