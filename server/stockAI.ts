/**
 * 股识 StockWise — 股票 AI 智能分析接口
 * 接收股票数据和用户问题，流式返回 AI 分析报告
 */
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { Express } from "express";
import { ENV } from "./_core/env";
import { createPatchedFetch } from "./_core/patchedFetch";

function createLLMProvider() {
  const baseURL = ENV.forgeApiUrl.endsWith("/v1")
    ? ENV.forgeApiUrl
    : `${ENV.forgeApiUrl}/v1`;
  return createOpenAI({
    baseURL,
    apiKey: ENV.forgeApiKey,
    fetch: createPatchedFetch(fetch),
  });
}

export function registerStockAIRoutes(app: Express) {
  const openai = createLLMProvider();

  app.post("/api/stock-ai", async (req, res) => {
    try {
      const { symbol, stockName, question, stockContext } = req.body as {
        symbol: string;
        stockName: string;
        question: string;
        stockContext: {
          currentPrice: number;
          currency: string;
          changePercent: number;
          trend: string;
          trendLabel: string;
          rsi: number;
          macdSignal: string;
          bollPosition: string;
          prediction: string;
          confidence: number;
          priceTarget7d: number;
          priceTarget30d: number;
          supportLevel: number;
          resistanceLevel: number;
          riskLevel: string;
          volume: number;
          avgVolume: number;
          pe?: number;
          marketCap?: number;
        };
      };

      if (!symbol || !question) {
        res.status(400).json({ error: "symbol and question are required" });
        return;
      }

      const currencySymbol = stockContext.currency === "CNY" ? "¥" : "$";
      const volumeRatio = stockContext.avgVolume > 0
        ? (stockContext.volume / stockContext.avgVolume).toFixed(2)
        : "N/A";

      const systemPrompt = `你是股识 StockWise 的专业股票分析师 AI，精通技术分析、基本面分析和投资大师理论。
你的分析风格：专业、客观、有据可查，同时通俗易懂，适合普通投资者理解。
你会结合多种分析维度给出综合判断，并始终提醒用户投资有风险，分析仅供参考。

你熟悉以下投资大师的理论，在分析时应主动引用最相关的1-2位大师观点：
- 查尔斯·道（道氏理论）：趋势分析，市场价格反映一切
- 艾略特（波浪理论）：价格以5浪上升3浪下降的波浪形式运动
- 本杰明·格雷厄姆（价值投资）：安全边际，以低于内在价值买入
- 沃伦·巴菲特（护城河理论）：优质企业+合理价格+长期持有
- 彼得·林奇（成长股投资）：PEG比率，从生活中发现十倍股
- 乔治·索罗斯（反身性理论）：市场预期会影响基本面，形成自我强化循环
- 詹姆斯·西蒙斯（量化投资）：数据驱动，统计套利
- 凯恩斯（选美理论）：市场是选美比赛，要预测别人的预期
- 尤金·法玛（有效市场假说）：市场价格已反映所有公开信息
- 瑞·达利欧（全天候组合）：分散风险，平衡配置

当前分析的股票信息：
- 股票代码：${symbol}
- 股票名称：${stockName}
- 当前价格：${currencySymbol}${stockContext.currentPrice}
- 今日涨跌：${stockContext.changePercent > 0 ? "+" : ""}${stockContext.changePercent.toFixed(2)}%
- 整体趋势：${stockContext.trendLabel}（${stockContext.trend}）
- RSI指标：${stockContext.rsi.toFixed(1)}（>70超买，<30超卖）
- MACD信号：${stockContext.macdSignal}
- 布林带位置：${stockContext.bollPosition}
- 明日预测方向：${stockContext.prediction}（置信度 ${stockContext.confidence}%）
- 7日目标价：${currencySymbol}${stockContext.priceTarget7d}
- 30日目标价：${currencySymbol}${stockContext.priceTarget30d}
- 支撑位：${currencySymbol}${stockContext.supportLevel}
- 阻力位：${currencySymbol}${stockContext.resistanceLevel}
- 风险等级：${stockContext.riskLevel}
- 今日成交量/均量比：${volumeRatio}倍
${stockContext.pe ? `- 市盈率(PE)：${stockContext.pe}` : ""}
${stockContext.marketCap ? `- 市值：${currencySymbol}${(stockContext.marketCap / 1e8).toFixed(2)}亿` : ""}

请根据以上数据，用中文回答用户的问题。分析要有深度，结合具体数据，给出明确的操作建议（但要注明风险）。
回答格式：使用 Markdown，适当使用标题、加粗、列表，让内容清晰易读。控制在300-500字以内。`;

      const result = streamText({
        model: openai.chat("gemini-2.5-flash"),
        system: systemPrompt,
        messages: [{ role: "user", content: question }],
        maxOutputTokens: 1024,
      });

      result.pipeTextStreamToResponse(res);
    } catch (error) {
      console.error("[/api/stock-ai] Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "AI 分析服务暂时不可用，请稍后重试" });
      }
    }
  });
}
