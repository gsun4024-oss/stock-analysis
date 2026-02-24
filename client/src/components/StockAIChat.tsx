/**
 * 股识 StockWise — 股票 AI 智能问答组件
 * 用户可以直接提问，AI 结合当前股票数据给出分析
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import type { StockChartData } from "@/lib/stockApi";
import type { TrendAnalysis, PredictionResult } from "@/lib/indicators";
import { calcRSI, calcMACD, calcBollinger } from "@/lib/indicators";

interface StockAIChatProps {
  stockData: StockChartData;
  trend: TrendAnalysis;
  prediction: PredictionResult;
}

const PRESET_QUESTIONS = [
  "这只股票现在能买吗？",
  "明天走势会怎样？",
  "当前风险大吗？",
  "支撑位和阻力位在哪里？",
  "结合大师理论分析一下",
];

export default function StockAIChat({ stockData, trend, prediction }: StockAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const [hasAsked, setHasAsked] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (streamContent && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamContent]);

  // 计算技术指标用于 AI 上下文
  const getStockContext = () => {
    const candles = stockData.candles;
    const meta = stockData.meta;

    let rsiValue = 50;
    let macdSignal = "中性";
    let bollPosition = "中轨附近";

    if (candles.length >= 14) {
      const rsiData = calcRSI(candles, 14);
      if (rsiData.length > 0) {
        rsiValue = rsiData[rsiData.length - 1].value;
      }
    }

    if (candles.length >= 26) {
      const macdData = calcMACD(candles);
      if (macdData.length > 0) {
        const last = macdData[macdData.length - 1];
        if (last.macd > 0 && last.histogram > 0) macdSignal = "金叉向上";
        else if (last.macd < 0 && last.histogram < 0) macdSignal = "死叉向下";
        else if (last.histogram > 0) macdSignal = "动能转强";
        else macdSignal = "动能转弱";
      }
    }

    if (candles.length >= 20) {
      const bollData = calcBollinger(candles, 20, 2);
      if (bollData.length > 0) {
        const last = bollData[bollData.length - 1];
        const price = meta.regularMarketPrice;
        if (price > last.upper) bollPosition = "突破上轨（超买）";
        else if (price < last.lower) bollPosition = "跌破下轨（超卖）";
        else if (price > last.middle) bollPosition = "上轨与中轨之间";
        else bollPosition = "中轨与下轨之间";
      }
    }

    return {
      currentPrice: meta.regularMarketPrice,
      currency: meta.currency,
      changePercent: meta.regularMarketChangePercent,
      trend: trend.trend,
      trendLabel: trend.label,
      rsi: rsiValue,
      macdSignal,
      bollPosition,
      prediction: prediction.nextDayPrediction,
      confidence: prediction.nextDayConfidence,
      priceTarget7d: prediction.priceTarget7d,
      priceTarget30d: prediction.priceTarget30d,
      supportLevel: prediction.supportLevel,
      resistanceLevel: prediction.resistanceLevel,
      riskLevel: prediction.riskLevel,
      volume: meta.regularMarketVolume,
      avgVolume: meta.regularMarketVolume,
      pe: meta.trailingPE,
      marketCap: meta.marketCap,
    };
  };

  const askAI = async (q: string) => {
    if (!q.trim() || isLoading) return;
    setIsLoading(true);
    setStreamContent("");
    setHasAsked(true);
    setQuestion("");

    try {
      const response = await fetch("/api/stock-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: stockData.meta.symbol,
          stockName: stockData.meta.longName || stockData.meta.shortName || stockData.meta.symbol,
          question: q,
          stockContext: getStockContext(),
        }),
      });

      if (!response.ok) {
        throw new Error("AI 分析服务暂时不可用");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("无法读取响应流");

      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setStreamContent(accumulated);
      }
    } catch (err) {
      setStreamContent(`**分析失败**\n\n${err instanceof Error ? err.message : "请稍后重试"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askAI(question);
  };

  const stockName = stockData.meta.longName || stockData.meta.shortName || stockData.meta.symbol;

  return (
    <div className="glass-card overflow-hidden">
      {/* 标题栏 */}
      <button
        className="w-full px-5 pt-5 pb-4 flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="font-semibold flex items-center gap-2" style={{ color: "#2D2D3A", fontFamily: "'Noto Serif SC', serif" }}>
          <Sparkles className="w-4 h-4" style={{ color: "#9B7FD4" }} />
          AI 智能分析师
          <span className="text-xs px-2 py-0.5 rounded-full font-normal" style={{ background: "rgba(155,127,212,0.1)", color: "#9B7FD4" }}>
            直接提问
          </span>
        </h2>
        {isOpen ? <ChevronUp className="w-4 h-4" style={{ color: "#9B9BB8" }} /> : <ChevronDown className="w-4 h-4" style={{ color: "#9B9BB8" }} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {/* 预设问题 */}
              {!hasAsked && (
                <div className="mb-4">
                  <p className="text-xs mb-2" style={{ color: "#9B9BB8" }}>快速提问：</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => askAI(q)}
                        disabled={isLoading}
                        className="text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80 disabled:opacity-50"
                        style={{
                          background: "rgba(155,127,212,0.08)",
                          border: "1px solid rgba(155,127,212,0.2)",
                          color: "#7A5AB8",
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI 回答区域 */}
              {(isLoading || streamContent) && (
                <div
                  ref={contentRef}
                  className="mb-4 p-4 rounded-2xl max-h-96 overflow-y-auto"
                  style={{ background: "rgba(155,127,212,0.04)", border: "1px solid rgba(155,127,212,0.12)" }}
                >
                  {isLoading && !streamContent && (
                    <div className="flex items-center gap-2" style={{ color: "#9B7FD4" }}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">正在分析 {stockName}...</span>
                    </div>
                  )}
                  {streamContent && (
                    <div className="text-sm">
                      <Markdown isAnimating={isLoading}>
                        {streamContent}
                      </Markdown>
                    </div>
                  )}
                </div>
              )}

              {/* 继续提问 */}
              {hasAsked && !isLoading && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {PRESET_QUESTIONS.slice(0, 3).map((q) => (
                    <button
                      key={q}
                      onClick={() => askAI(q)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                      style={{
                        background: "rgba(232,114,138,0.06)",
                        border: "1px solid rgba(232,114,138,0.15)",
                        color: "#C85A7A",
                      }}
                    >
                      <MessageCircle className="w-3 h-3 inline mr-1" />
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* 输入框 */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder={`问问 AI：${stockName} 现在值得买吗？`}
                  rows={2}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-2xl text-sm resize-none outline-none transition-all disabled:opacity-50"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1.5px solid rgba(155,127,212,0.2)",
                    color: "#2D2D3A",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onFocus={(e) => { e.target.style.border = "1.5px solid rgba(155,127,212,0.5)"; }}
                  onBlur={(e) => { e.target.style.border = "1.5px solid rgba(155,127,212,0.2)"; }}
                />
                <button
                  type="submit"
                  disabled={!question.trim() || isLoading}
                  className="px-4 py-2.5 rounded-2xl flex items-center gap-1.5 text-sm font-medium transition-all disabled:opacity-40 self-end"
                  style={{
                    background: "linear-gradient(135deg, #9B7FD4, #C85A8A)",
                    color: "white",
                  }}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span className="hidden sm:inline">分析</span>
                </button>
              </form>
              <p className="text-xs mt-2" style={{ color: "#BBBBCC" }}>
                ⚠️ AI 分析仅供参考，不构成投资建议。投资有风险，入市需谨慎。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
