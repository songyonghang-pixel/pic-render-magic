const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FEEDBACK_CONTEXT = `以下是当前反馈数据分析页面的反馈数据汇总（共 1929 条反馈）：

【AI聚类标签 TOP 10】
1. 其他场景耗电 - 303 例（需求 3，bug 293，认知 0，其他 303）
2. 希望相机增加类似vivo的增距镜模式 - 223 例（需求 0，bug 218，认知 1，其他 223）
3. 其他场景发热 - 134 例（需求 2，bug 124，认知 3，其他 134）
4. 模糊场景卡顿 - 133 例（需求 1，bug 122，认知 4，其他 133）
5. 拍照效果差 - 92 例（需求 0，bug 91，认知 0，其他 92）
6. 游戏发热 - 48 例（需求 0，bug 48，认知 0，其他 48）
7. 相机不对焦/模糊 - 47 例（需求 1，bug 45，认知 0，其他 47）
8. 相机拍照/拍视频效果差 - 45 例（需求 3，bug 42，认知 0，其他 45）
9. 充电慢 - 33 例（需求 3，bug 32，认知 1，其他 33）
10. 希望声音与振动优化音质效果 - 32 例（需求 0，bug 32，认知 0，其他 32）

【产品体验五级标签反馈量】
- 拍照/拍视频体验：10680
- 硬件配置：9620
- 产品整体体验：9510
- 外观/id设计：8800
- 性能功耗热体验：7020
- 游戏体验：3450
- 系统易用性：2380
- 做工质量/耐用性：2180
- 屏幕：1960
- 价格/性价比：1410
- AI 智慧体验：980

【OS 版本分布】
- 16.0.0：92.66%
- 15.0.2：4.59%
- 16.1：1.37%
- 15.0：0.92%
- 13.1.1：0.46%
`;

const SYSTEM_PROMPT = `你是一个专业的用户反馈数据分析师。基于用户提供的反馈数据，为用户提供清晰、有洞察力的总结与回答。

要求：
- 使用中文回答
- 回答结构清晰，必要时使用列表/小标题
- 总结时聚焦：核心问题、用户主要诉求、潜在改进方向
- 用户追问时基于已知数据合理分析，避免编造数据

当前反馈数据如下：
${FEEDBACK_CONTEXT}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "请求过于频繁，请稍后再试。" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI 额度不足，请前往工作区充值。" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI 网关错误" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "未知错误" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
