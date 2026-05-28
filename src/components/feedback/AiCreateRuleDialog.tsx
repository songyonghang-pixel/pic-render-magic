import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export type AiRuleFilters = {
  alertType?: "实时" | "统计";
  aiTags?: string[];
  marketingNames?: string[];
  countries?: string[];
  feedbackTypes?: string[];
  sentiments?: string[];
  alertLevel?: string;
  triggerConditions?: Array<{
    level?: string;
    subs?: Array<{
      indicator?: string;
      timeRange?: string;
      calcMethod?: string;
      operator?: string;
      value?: number;
    }>;
  }>;
};

export type AiMsg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-alert-rule-builder`;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: AiMsg[];
  setMessages: React.Dispatch<React.SetStateAction<AiMsg[]>>;
  onApply: (filters: AiRuleFilters) => void;
}

const extractJson = (text: string): AiRuleFilters | null => {
  const m = text.match(/```json\s*([\s\S]*?)```/);
  if (!m) return null;
  try { return JSON.parse(m[1].trim()); } catch { return null; }
};

export const AiCreateRuleDialog = ({ open, onOpenChange, messages, setMessages, onApply }: Props) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (open && messages.length === 0 && !initRef.current) {
      initRef.current = true;
      setMessages([{ role: "assistant", content: "请描述你需要监控的规则。例如：监控某机型在中国区的负面反馈，当日反馈量超过 100 条时预警。" }]);
    }
    if (!open) initRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const userMsg: AiMsg = { role: "user", content: text };
    // Only send actual user/assistant exchange (skip our local greeting if it's the only assistant turn)
    const history = messages.filter((m, i) => !(i === 0 && m.role === "assistant" && messages.length === 1));
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...history, userMsg] }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) toast({ title: "请求过于频繁", description: "请稍后再试", variant: "destructive" });
        else if (resp.status === 402) toast({ title: "AI 额度不足", description: "请前往工作区充值", variant: "destructive" });
        else toast({ title: "AI 调用失败", variant: "destructive" });
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let done = false;

      setMessages((p) => [...p, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              acc += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }

      // After streaming complete, try to extract JSON and apply
      const filters = extractJson(acc);
      if (filters) {
        onApply(filters);
        toast({ title: "已应用过滤条件", description: "请关闭对话窗口核查表单内容" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "网络错误", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (!v || loading) return;
    setInput("");
    void send(v);
  };

  const renderContent = (content: string) => {
    // Hide the raw json block in the bubble, show a friendly note instead
    const cleaned = content.replace(/```json[\s\S]*?```/g, "").trim();
    return cleaned;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-gradient-to-r from-[hsl(var(--primary)/0.1)] to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary)/0.15)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-[14px] font-semibold text-[hsl(var(--label-text))]">AI 创建预警规则</DialogTitle>
              <div className="text-[11px] text-[hsl(var(--placeholder))]">通过对话自动配置预警条件</div>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="h-[480px] overflow-y-auto px-5 py-4 space-y-4 bg-[hsl(var(--page-bg))]">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-lg text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border text-[hsl(var(--label-text))] rounded-bl-sm"
                }`}
              >
                {renderContent(m.content) || (loading && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="border-t border-border p-3 bg-card flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="继续描述或补充条件..."
            disabled={loading}
            className="flex-1 h-9 px-3 text-[13px] rounded-md border border-[hsl(var(--field-border))] focus:border-primary focus:outline-none disabled:opacity-60 bg-background"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-[13px] flex items-center gap-1 disabled:opacity-50 hover:bg-primary/90"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            发送
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
