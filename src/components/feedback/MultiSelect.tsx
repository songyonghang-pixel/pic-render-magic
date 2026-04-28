import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface Option {
  label: string;
  value?: string;
}

interface MultiSelectProps {
  placeholder?: string;
  options: Option[];
  className?: string;
  value?: string[];
  onChange?: (vals: string[]) => void;
}

export const MultiSelect = ({ placeholder = "请选择", options, className = "", value, onChange }: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<string[]>(value ?? []);
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ?? internal;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggle = (label: string) => {
    const next = selected.includes(label) ? selected.filter((s) => s !== label) : [...selected, label];
    if (onChange) onChange(next);
    else setInternal(next);
  };

  const remove = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(label);
  };

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <div
        onClick={() => setOpen((o) => !o)}
        className="w-full min-h-8 px-2 py-0.5 text-[13px] bg-card border border-[hsl(var(--field-border))] rounded-sm cursor-pointer flex flex-wrap items-center gap-1 pr-8"
      >
        {selected.length === 0 ? (
          <span className="text-[hsl(var(--placeholder))] px-1">{placeholder}</span>
        ) : (
          selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-1.5 py-0.5 rounded-sm text-[12px]">
              {s}
              <X className="w-3 h-3 cursor-pointer hover:opacity-70" onClick={(e) => remove(s, e)} />
            </span>
          ))
        )}
        <ChevronDown className={`absolute right-2 top-2 w-3.5 h-3.5 text-[hsl(var(--placeholder))] transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-sm shadow-lg max-h-60 overflow-auto">
          {options.map((opt) => {
            const checked = selected.includes(opt.label);
            return (
              <label
                key={opt.label}
                className="flex items-center gap-2 px-3 py-2 text-[13px] hover:bg-[hsl(var(--accent))] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt.label)}
                  className="w-3.5 h-3.5 accent-primary"
                />
                <span className={checked ? "text-primary" : "text-[hsl(var(--label-text))]"}>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};
