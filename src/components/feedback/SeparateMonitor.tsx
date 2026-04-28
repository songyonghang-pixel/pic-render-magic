import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

interface Props {
  disabled?: boolean;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  tooltip: string;
  /** Optional level picker. When provided, after checking the box a dialog opens. */
  levelOptions?: string[];
  level?: string;
  onLevelChange?: (v: string) => void;
}

export const SeparateMonitor = ({
  disabled,
  checked,
  onCheckedChange,
  tooltip,
  levelOptions,
  level,
  onLevelChange,
}: Props) => {
  const [showTip, setShowTip] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [tempLevel, setTempLevel] = useState<string>(level ?? levelOptions?.[0] ?? "");

  useEffect(() => {
    setTempLevel(level ?? levelOptions?.[0] ?? "");
  }, [level, levelOptions]);

  const handleToggle = () => {
    if (disabled) return;
    if (!checked) {
      // turning on
      if (levelOptions && levelOptions.length > 0) {
        setShowDialog(true);
      } else {
        onCheckedChange(true);
      }
    } else {
      onCheckedChange(false);
    }
  };

  const confirmDialog = () => {
    onLevelChange?.(tempLevel);
    onCheckedChange(true);
    setShowDialog(false);
  };

  return (
    <div className="inline-flex items-center gap-1.5 ml-2 shrink-0">
      <label
        className={`inline-flex items-center gap-1.5 text-[13px] select-none ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        onClick={(e) => {
          e.preventDefault();
          handleToggle();
        }}
      >
        <span
          className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-[2px] border transition-colors ${
            checked
              ? "bg-primary border-primary"
              : "bg-card border-[hsl(var(--field-border))]"
          }`}
        >
          {checked && (
            <svg viewBox="0 0 16 16" className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="3,8 7,12 13,4" />
            </svg>
          )}
        </span>
        <span className={checked ? "text-primary" : "text-[hsl(var(--label-text))]"}>分别监控</span>
      </label>

      <div className="relative inline-flex items-center">
        <HelpCircle
          className="w-3.5 h-3.5 text-[hsl(var(--placeholder))] cursor-help"
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
        />
        {showTip && (
          <div className="absolute z-50 left-5 top-1/2 -translate-y-1/2 w-72 p-2 bg-popover border border-border rounded-sm shadow-lg text-[12px] leading-relaxed text-[hsl(var(--label-text))]">
            {tooltip}
          </div>
        )}
      </div>

      {checked && level && levelOptions && (
        <button
          type="button"
          onClick={() => setShowDialog(true)}
          className="text-[13px] text-primary hover:underline ml-1"
        >
          按{level}
        </button>
      )}

      {showDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <div className="bg-card rounded-sm shadow-xl w-[360px] border border-border">
            <div className="px-4 py-3 border-b border-border text-[14px] font-medium text-[hsl(var(--label-text))]">
              选择监控的标签层级
            </div>
            <div className="p-4 space-y-2">
              {levelOptions.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer text-[13px] text-[hsl(var(--label-text))]">
                  <input
                    type="radio"
                    name="level-picker"
                    checked={tempLevel === opt}
                    onChange={() => setTempLevel(opt)}
                    className="w-3.5 h-3.5 accent-primary"
                  />
                  {opt}
                </label>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border flex justify-end gap-2">
              <button
                onClick={() => setShowDialog(false)}
                className="h-7 px-4 text-[13px] border border-[hsl(var(--field-border))] text-[hsl(var(--label-text))] rounded-sm hover:border-primary hover:text-primary"
              >
                取消
              </button>
              <button
                onClick={confirmDialog}
                className="h-7 px-4 text-[13px] bg-primary text-primary-foreground rounded-sm hover:opacity-90"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
