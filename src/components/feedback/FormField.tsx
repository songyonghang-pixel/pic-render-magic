import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface FieldProps {
  label: string;
  required?: boolean;
  children?: ReactNode;
  className?: string;
  labelWidth?: string;
}

export const Field = ({ label, required, children, className = "", labelWidth = "w-20" }: FieldProps) => (
  <div className={`flex items-center ${className}`}>
    <label className={`${labelWidth} shrink-0 text-right pr-3 text-[13px] text-[hsl(var(--label-text))]`}>
      {required && <span className="text-destructive mr-0.5">*</span>}
      {label}
    </label>
    <div className="flex-1 min-w-0">{children}</div>
  </div>
);

interface InputProps {
  placeholder?: string;
  className?: string;
  value?: string;
}

export const TextInput = ({ placeholder, className = "", value }: InputProps) => (
  <input
    type="text"
    placeholder={placeholder}
    defaultValue={value}
    className={`w-full h-8 px-3 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))] ${className}`}
  />
);

export const SelectInput = ({ placeholder, className = "", value }: InputProps) => (
  <div className={`relative w-full ${className}`}>
    <input
      type="text"
      readOnly
      placeholder={placeholder}
      defaultValue={value}
      className="w-full h-8 pl-3 pr-8 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm outline-none focus:border-primary placeholder:text-[hsl(var(--placeholder))] cursor-pointer"
    />
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(var(--placeholder))] pointer-events-none" />
  </div>
);
