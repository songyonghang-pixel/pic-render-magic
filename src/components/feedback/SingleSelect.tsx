import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
}

interface Props {
  placeholder?: string;
  options: Option[];
  className?: string;
  value?: string;
  onChange?: (val: string) => void;
}

export const SingleSelect = ({ placeholder = "请选择", options, className = "", value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<string>(value ?? "");
  const ref = useRef<HTMLDivElement>(null);

  const selected = value !== undefined ? value : internal;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (label: string) => {
    if (onChange) onChange(label);
    else setInternal(label);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <div
        onClick={() => setOpen((o) => !o)}
        className="w-full h-8 px-3 pr-8 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm cursor-pointer flex items-center"
      >
        {selected ? (
          <span className="text-[hsl(var(--label-text))]">{selected}</span>
        ) : (
          <span className="text-[hsl(var(--placeholder))]">{placeholder}</span>
        )}
        <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(var(--placeholder))] transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-sm shadow-lg max-h-60 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.label}
              onClick={() => pick(opt.label)}
              className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-[hsl(var(--accent))] ${
                selected === opt.label ? "text-primary font-medium bg-[hsl(var(--accent))]" : "text-[hsl(var(--label-text))]"
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
