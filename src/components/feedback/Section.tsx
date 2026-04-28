import { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export const Section = ({ title, children }: SectionProps) => (
  <div className="mb-4">
    <h3 className="text-[15px] font-semibold text-[hsl(var(--section-title))] mb-3">{title}</h3>
    <div className="bg-[hsl(var(--section-bg))] rounded-sm px-6 py-5 space-y-4">{children}</div>
  </div>
);
