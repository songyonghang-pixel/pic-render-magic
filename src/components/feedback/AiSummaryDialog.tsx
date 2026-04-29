import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/feedback-summary-chat`;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: string | null;
}

export const AiSummaryDialog = ({ open, onOpenChange, tag }: Props) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (open && !initRef.current) {
      initRef.current = true;
      void send("总结反馈原声");
    }
    if (!open) {
      // reset on close so next open re-summarizes fresh
      initRef.current = false;
      setMessages([]);
      setInput("");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const userMsg: Msg = { role: "user", content: text };
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
        body: JSON.stringify({ messages: next }),
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

      // create empty assistant message
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-gradient-to-r from-[hsl(var(--primary)/0.1)] to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary)/0.15)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-[14px] font-semibold text-[hsl(var(--label-text))]">AI 反馈总结</DialogTitle>
              <div className="text-[11px] text-[hsl(var(--placeholder))]">基于当前反馈数据分析</div>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-[hsl(var(--placeholder))] hover:text-[hsl(var(--label-text))]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div ref={scrollRef} className="h-[480px] overflow-y-auto px-5 py-4 space-y-4 bg-[hsl(var(--page-bg))]">
          {messages.length === 0 && (
            <div className="text-center text-[13px] text-[hsl(var(--placeholder))] mt-12">正在准备总结...</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-lg text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border text-[hsl(var(--label-text))] rounded-bl-sm"
                }`}
              >
                {m.content || (loading && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="border-t border-border p-3 bg-card flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="继续追问，例如：哪类问题最紧急？"
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
