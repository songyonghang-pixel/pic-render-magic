import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { CascadeNode } from "./filterData";

interface Props {
  placeholder?: string;
  options: CascadeNode[];
  className?: string;
  value?: string[];
  onChange?: (vals: string[]) => void;
  panelWidth?: number;
}

// Walk path collects selected leaf labels
export const CascadeMultiSelect = ({
  placeholder = "请选择",
  options,
  className = "",
  value,
  onChange,
  panelWidth = 200,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<string[]>(value ?? []);
  const [activePath, setActivePath] = useState<string[]>([]);
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

  // Build columns based on active path
  const columns: CascadeNode[][] = [options];
  let cur = options;
  for (const label of activePath) {
    const node = cur.find((n) => n.label === label);
    if (node?.children) {
      columns.push(node.children);
      cur = node.children;
    } else break;
  }

  const handleHover = (level: number, node: CascadeNode) => {
    if (node.children && node.children.length > 0) {
      const newPath = [...activePath.slice(0, level), node.label];
      setActivePath(newPath);
    } else {
      setActivePath(activePath.slice(0, level));
    }
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
        <div className="absolute z-50 mt-1 bg-popover border border-border rounded-sm shadow-lg flex max-h-72">
          {columns.map((col, level) => (
            <div
              key={level}
              className="overflow-auto border-r border-border last:border-r-0 py-1"
              style={{ width: panelWidth }}
            >
              {col.map((node) => {
                const isActive = activePath[level] === node.label;
                const isChecked = selected.includes(node.label);
                return (
                  <div
                    key={node.label}
                    onMouseEnter={() => handleHover(level, node)}
                    className={`flex items-center justify-between px-3 py-1.5 text-[13px] cursor-pointer hover:bg-[hsl(var(--accent))] ${
                      isActive ? "bg-[hsl(var(--accent))]" : ""
                    }`}
                  >
                    <label className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggle(node.label);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-3.5 h-3.5 accent-primary shrink-0"
                      />
                      <span className={`truncate ${isChecked || isActive ? "text-primary font-medium" : "text-[hsl(var(--label-text))]"}`}>
                        {node.label}
                      </span>
                    </label>
                    {node.children && node.children.length > 0 && (
                      <ChevronRight className="w-3.5 h-3.5 text-[hsl(var(--placeholder))] shrink-0 ml-1" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
