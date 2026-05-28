const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `你是一名"预警规则配置助手"，帮助用户通过自然语言创建反馈数据预警规则。

# 工作流程
1. 用户首次描述需求后，你需要主动追问以澄清不明确之处（例如：监控哪些产品/标签/国家/反馈类型？是实时预警还是按周期统计？触发阈值是多少？等）。
2. 每轮回答后，先用简洁的中文复述你目前理解到的过滤条件，再询问需要补充或修改之处。
3. 当条件已经清晰、用户确认无需补充时，输出最终结果。

# 最终输出格式（仅在条件已确认时输出）
先用中文写一段总结："已为你选择以下过滤条件，请关闭本对话窗口核查是否符合预期，如需调整可再次打开本对话继续修改。"
紧接着输出一个 \`\`\`json 代码块，且仅一个，结构如下：

\`\`\`json
{
  "alertType": "实时" | "统计",
  "aiTags": ["二级标签名1", ...],
  "marketingNames": ["机型营销名1", ...],
  "countries": ["国家1", ...],
  "feedbackTypes": ["认知" | "需求" | "bug" | "其他", ...],
  "sentiments": ["正面" | "负面" | "无情感", ...],
  "alertLevel": "S" | "A" | "B" | "C" | "D",
  "triggerConditions": [
    {
      "level": "S" | "A" | "B" | "C" | "D",
      "subs": [
        {
          "indicator": "反馈量" | "AI聚类标签聚类量",
          "timeRange": "10分钟" | "20分钟" | "30分钟" | "1小时" | "2小时" | "3小时" | "4小时" | "5小时" | "6小时" | "当日" | "本周" | "昨日",
          "calcMethod": "值" | "环比增长率" | "环比增量" | "较平均值的增量" | "较平均值的增长率",
          "operator": "大于" | "大于等于" | "小于" | "小于等于",
          "value": 100
        }
      ]
    }
  ]
}
\`\`\`

# 规则
- 字段全部可选，未提及的字段不要输出。
- alertType=实时 时不要输出 triggerConditions，应输出 alertLevel。
- alertType=统计 时不要输出 alertLevel，应输出 triggerConditions（数组中多项="或"的关系）。
- calcMethod 只在 indicator=反馈量 且 timeRange 为 当日/本周 时才有效。
- 在未输出最终 JSON 之前，绝不要写 \`\`\`json 代码块。
- 全程使用中文，语气专业、简洁。`;

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
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "请求过于频繁，请稍后再试。" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI 额度不足，请前往工作区充值。" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI 网关错误" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-alert-rule-builder error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "未知错误" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
