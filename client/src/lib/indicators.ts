/**
 * 股识 StockWise — 技术指标计算库
 * 实现常用技术分析指标：MA、EMA、MACD、RSI、布林带、KDJ
 */

import type { CandleData } from "./stockApi";

export interface MAPoint { time: number; value: number }
export interface MACDPoint { time: number; macd: number; signal: number; histogram: number }
export interface RSIPoint { time: number; value: number }
export interface BollingerPoint { time: number; upper: number; middle: number; lower: number }
export interface KDJPoint { time: number; k: number; d: number; j: number }

/**
 * 简单移动平均线 (SMA)
 */
export function calcMA(candles: CandleData[], period: number): MAPoint[] {
  const result: MAPoint[] = [];
  for (let i = period - 1; i < candles.length; i++) {
    const sum = candles.slice(i - period + 1, i + 1).reduce((acc, c) => acc + c.close, 0);
    result.push({ time: candles[i].time, value: sum / period });
  }
  return result;
}

/**
 * 指数移动平均线 (EMA)
 */
export function calcEMA(candles: CandleData[], period: number): MAPoint[] {
  const result: MAPoint[] = [];
  const k = 2 / (period + 1);
  let ema = candles[0].close;

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) continue;
    if (i === period - 1) {
      ema = candles.slice(0, period).reduce((acc, c) => acc + c.close, 0) / period;
    } else {
      ema = candles[i].close * k + ema * (1 - k);
    }
    result.push({ time: candles[i].time, value: ema });
  }
  return result;
}

/**
 * MACD 指标
 * 参数：快线12，慢线26，信号线9
 */
export function calcMACD(candles: CandleData[], fast = 12, slow = 26, signal = 9): MACDPoint[] {
  const closes = candles.map((c) => c.close);
  const times = candles.map((c) => c.time);

  function ema(data: number[], period: number): number[] {
    const k = 2 / (period + 1);
    const result: number[] = new Array(data.length).fill(0);
    let sum = 0;
    for (let i = 0; i < period; i++) sum += data[i];
    result[period - 1] = sum / period;
    for (let i = period; i < data.length; i++) {
      result[i] = data[i] * k + result[i - 1] * (1 - k);
    }
    return result;
  }

  const fastEMA = ema(closes, fast);
  const slowEMA = ema(closes, slow);
  const dif = closes.map((_, i) => fastEMA[i] - slowEMA[i]);
  const dea = ema(dif, signal);

  const result: MACDPoint[] = [];
  for (let i = slow - 1; i < candles.length; i++) {
    result.push({
      time: times[i],
      macd: dif[i],
      signal: dea[i],
      histogram: (dif[i] - dea[i]) * 2,
    });
  }
  return result;
}

/**
 * RSI 相对强弱指标
 */
export function calcRSI(candles: CandleData[], period = 14): RSIPoint[] {
  const result: RSIPoint[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period; i < candles.length; i++) {
    if (i > period) {
      const diff = candles[i].close - candles[i - 1].close;
      avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
    }
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push({ time: candles[i].time, value: 100 - 100 / (1 + rs) });
  }
  return result;
}

/**
 * 布林带 (Bollinger Bands)
 */
export function calcBollinger(candles: CandleData[], period = 20, stdDev = 2): BollingerPoint[] {
  const result: BollingerPoint[] = [];
  for (let i = period - 1; i < candles.length; i++) {
    const slice = candles.slice(i - period + 1, i + 1).map((c) => c.close);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
    const std = Math.sqrt(variance);
    result.push({
      time: candles[i].time,
      upper: mean + stdDev * std,
      middle: mean,
      lower: mean - stdDev * std,
    });
  }
  return result;
}

/**
 * KDJ 随机指标
 */
export function calcKDJ(candles: CandleData[], period = 9): KDJPoint[] {
  const result: KDJPoint[] = [];
  let k = 50;
  let d = 50;

  for (let i = period - 1; i < candles.length; i++) {
    const slice = candles.slice(i - period + 1, i + 1);
    const highMax = Math.max(...slice.map((c) => c.high));
    const lowMin = Math.min(...slice.map((c) => c.low));
    const close = candles[i].close;

    const rsv = highMax === lowMin ? 50 : ((close - lowMin) / (highMax - lowMin)) * 100;
    k = (2 / 3) * k + (1 / 3) * rsv;
    d = (2 / 3) * d + (1 / 3) * k;
    const j = 3 * k - 2 * d;

    result.push({ time: candles[i].time, k, d, j });
  }
  return result;
}

/**
 * 计算成交量均线
 */
export function calcVolumeMA(candles: CandleData[], period: number): MAPoint[] {
  const result: MAPoint[] = [];
  for (let i = period - 1; i < candles.length; i++) {
    const sum = candles.slice(i - period + 1, i + 1).reduce((acc, c) => acc + c.volume, 0);
    result.push({ time: candles[i].time, value: sum / period });
  }
  return result;
}

/**
 * 趋势判断（基于均线系统）
 */
export interface TrendAnalysis {
  trend: "strong_up" | "up" | "sideways" | "down" | "strong_down";
  label: string;
  description: string;
  confidence: number; // 0-100
  signals: string[];
}

export function analyzeTrend(candles: CandleData[]): TrendAnalysis {
  if (candles.length < 60) {
    return {
      trend: "sideways",
      label: "数据不足",
      description: "需要更多历史数据进行分析",
      confidence: 0,
      signals: [],
    };
  }

  const ma5 = calcMA(candles, 5);
  const ma20 = calcMA(candles, 20);
  const ma60 = calcMA(candles, 60);
  const rsi = calcRSI(candles, 14);
  const macd = calcMACD(candles);

  const lastMA5 = ma5[ma5.length - 1].value;
  const lastMA20 = ma20[ma20.length - 1].value;
  const lastMA60 = ma60[ma60.length - 1].value;
  const lastRSI = rsi[rsi.length - 1].value;
  const lastMACD = macd[macd.length - 1];
  const lastClose = candles[candles.length - 1].close;

  const signals: string[] = [];
  let score = 0;

  // 均线多头排列
  if (lastMA5 > lastMA20 && lastMA20 > lastMA60) {
    score += 30;
    signals.push("均线多头排列（MA5 > MA20 > MA60）");
  } else if (lastMA5 < lastMA20 && lastMA20 < lastMA60) {
    score -= 30;
    signals.push("均线空头排列（MA5 < MA20 < MA60）");
  }

  // 价格相对均线位置
  if (lastClose > lastMA20) {
    score += 15;
    signals.push("价格站上20日均线");
  } else {
    score -= 15;
    signals.push("价格跌破20日均线");
  }

  // RSI 信号
  if (lastRSI > 60) {
    score += 15;
    signals.push(`RSI强势区间（${lastRSI.toFixed(1)}）`);
  } else if (lastRSI < 40) {
    score -= 15;
    signals.push(`RSI弱势区间（${lastRSI.toFixed(1)}）`);
  } else {
    signals.push(`RSI中性（${lastRSI.toFixed(1)}）`);
  }

  // MACD 信号
  if (lastMACD.macd > 0 && lastMACD.histogram > 0) {
    score += 20;
    signals.push("MACD金叉，动能向上");
  } else if (lastMACD.macd < 0 && lastMACD.histogram < 0) {
    score -= 20;
    signals.push("MACD死叉，动能向下");
  }

  // 近期涨跌幅
  const recentChange = (lastClose - candles[candles.length - 20].close) / candles[candles.length - 20].close * 100;
  if (recentChange > 10) {
    score += 20;
    signals.push(`近20日涨幅 +${recentChange.toFixed(1)}%`);
  } else if (recentChange < -10) {
    score -= 20;
    signals.push(`近20日跌幅 ${recentChange.toFixed(1)}%`);
  }

  const confidence = Math.min(Math.abs(score), 100);

  if (score >= 60) return { trend: "strong_up", label: "强势上涨", description: "多项指标共振向上，趋势强劲", confidence, signals };
  if (score >= 20) return { trend: "up", label: "温和上涨", description: "整体趋势偏多，但需关注回调风险", confidence, signals };
  if (score >= -20) return { trend: "sideways", label: "震荡整理", description: "多空力量均衡，等待方向选择", confidence, signals };
  if (score >= -60) return { trend: "down", label: "温和下跌", description: "整体趋势偏空，注意控制仓位", confidence, signals };
  return { trend: "strong_down", label: "强势下跌", description: "多项指标共振向下，建议谨慎", confidence, signals };
}

/**
 * AI 预测（基于技术分析的量化预测）
 */
export interface PredictionResult {
  nextDayPrediction: "up" | "down" | "neutral";
  nextDayConfidence: number;
  priceTarget7d: number;
  priceTarget30d: number;
  supportLevel: number;
  resistanceLevel: number;
  riskLevel: "low" | "medium" | "high";
  summary: string;
}

export function generatePrediction(candles: CandleData[]): PredictionResult {
  if (candles.length < 30) {
    const lastClose = candles[candles.length - 1]?.close ?? 100;
    return {
      nextDayPrediction: "neutral",
      nextDayConfidence: 50,
      priceTarget7d: lastClose,
      priceTarget30d: lastClose,
      supportLevel: lastClose * 0.95,
      resistanceLevel: lastClose * 1.05,
      riskLevel: "medium",
      summary: "数据不足，无法生成有效预测",
    };
  }

  const trend = analyzeTrend(candles);
  const rsi = calcRSI(candles, 14);
  const bollinger = calcBollinger(candles, 20);
  const macd = calcMACD(candles);

  const lastClose = candles[candles.length - 1].close;
  const lastBoll = bollinger[bollinger.length - 1];
  const lastRSI = rsi[rsi.length - 1].value;
  const lastMACD = macd[macd.length - 1];

  // 计算支撑位和阻力位
  const recentCandles = candles.slice(-30);
  const supportLevel = Math.min(...recentCandles.map((c) => c.low));
  const resistanceLevel = Math.max(...recentCandles.map((c) => c.high));

  // 预测方向
  let upScore = 0;
  if (trend.trend === "strong_up" || trend.trend === "up") upScore += 40;
  if (trend.trend === "strong_down" || trend.trend === "down") upScore -= 40;
  if (lastRSI < 30) upScore += 20; // 超卖反弹
  if (lastRSI > 70) upScore -= 20; // 超买回调
  if (lastClose < lastBoll.lower) upScore += 15; // 触及下轨
  if (lastClose > lastBoll.upper) upScore -= 15; // 触及上轨
  if (lastMACD.histogram > 0) upScore += 10;
  if (lastMACD.histogram < 0) upScore -= 10;

  // 加入随机扰动（模拟市场不确定性）
  const noise = (Math.random() - 0.5) * 20;
  upScore += noise;

  const nextDayPrediction = upScore > 5 ? "up" : upScore < -5 ? "down" : "neutral";
  const nextDayConfidence = Math.min(Math.abs(upScore) + 40, 85);

  // 价格目标
  const volatility = calcVolatility(candles, 20);
  const trendFactor = trend.trend === "strong_up" ? 1.03 : trend.trend === "up" ? 1.015 : trend.trend === "down" ? 0.985 : trend.trend === "strong_down" ? 0.97 : 1.0;
  const priceTarget7d = lastClose * trendFactor * (1 + (Math.random() - 0.5) * volatility * 0.5);
  const priceTarget30d = lastClose * Math.pow(trendFactor, 4) * (1 + (Math.random() - 0.5) * volatility);

  // 风险评估
  const riskLevel = volatility > 0.04 ? "high" : volatility > 0.02 ? "medium" : "low";

  const summaries = {
    strong_up: `技术面强势，多指标共振向上。RSI处于${lastRSI.toFixed(0)}，MACD金叉信号明确，建议关注回调买入机会。`,
    up: `整体趋势向好，均线系统偏多排列。RSI为${lastRSI.toFixed(0)}，短期有望延续涨势，注意控制仓位。`,
    sideways: `市场处于震荡整理阶段，多空力量相对均衡。建议等待方向明确后再行操作。`,
    down: `技术面偏弱，均线系统呈空头排列。RSI为${lastRSI.toFixed(0)}，建议谨慎操作，控制风险。`,
    strong_down: `技术面明显偏弱，多项指标共振向下。建议以观望为主，等待企稳信号出现。`,
  };

  return {
    nextDayPrediction,
    nextDayConfidence: Math.round(nextDayConfidence),
    priceTarget7d: Math.round(priceTarget7d * 100) / 100,
    priceTarget30d: Math.round(priceTarget30d * 100) / 100,
    supportLevel: Math.round(supportLevel * 100) / 100,
    resistanceLevel: Math.round(resistanceLevel * 100) / 100,
    riskLevel,
    summary: summaries[trend.trend],
  };
}

/**
 * 计算历史波动率
 */
function calcVolatility(candles: CandleData[], period: number): number {
  const returns = [];
  for (let i = 1; i < Math.min(candles.length, period + 1); i++) {
    returns.push(Math.log(candles[i].close / candles[i - 1].close));
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
  return Math.sqrt(variance);
}

/**
 * 买卖信号点
 */
export interface SignalPoint {
  time: number;
  price: number;
  type: "buy" | "sell";
  reason: string;
}

/**
 * 计算买入/卖出信号点（基于 MACD 金叉死叉 + RSI 超买超卖）
 */
export function calcSignalPoints(candles: CandleData[]): SignalPoint[] {
  if (candles.length < 30) return [];
  const signals: SignalPoint[] = [];
  const rsi = calcRSI(candles, 14);
  const macd = calcMACD(candles);
  const boll = calcBollinger(candles, 20);

  // 建立时间索引映射
  const rsiMap = new Map(rsi.map((d) => [d.time, d.value]));
  const bollMap = new Map(boll.map((d) => [d.time, d]));
  const candleMap = new Map(candles.map((c) => [c.time, c]));

  for (let i = 1; i < macd.length; i++) {
    const prev = macd[i - 1];
    const curr = macd[i];
    const candle = candleMap.get(curr.time);
    if (!candle) continue;

    const rsiVal = rsiMap.get(curr.time) ?? 50;
    const bollData = bollMap.get(curr.time);

    // MACD 金叉（买入信号）
    if (prev.histogram < 0 && curr.histogram > 0) {
      const reasons: string[] = ["MACD金叉"];
      if (rsiVal < 50) reasons.push(`RSI${rsiVal.toFixed(0)}`);
      if (bollData && candle.close < bollData.middle) reasons.push("布林下轨");
      signals.push({
        time: curr.time,
        price: candle.low * 0.998,
        type: "buy",
        reason: reasons.join("·"),
      });
    }

    // MACD 死叉（卖出信号）
    if (prev.histogram > 0 && curr.histogram < 0) {
      const reasons: string[] = ["MACD死叉"];
      if (rsiVal > 50) reasons.push(`RSI${rsiVal.toFixed(0)}`);
      if (bollData && candle.close > bollData.middle) reasons.push("布林上轨");
      signals.push({
        time: curr.time,
        price: candle.high * 1.002,
        type: "sell",
        reason: reasons.join("·"),
      });
    }
  }

  // RSI 超卖买入（RSI < 30）
  for (let i = 1; i < rsi.length; i++) {
    if (rsi[i - 1].value >= 30 && rsi[i].value < 30) {
      const candle = candleMap.get(rsi[i].time);
      if (candle && !signals.find((s) => s.time === rsi[i].time)) {
        signals.push({
          time: rsi[i].time,
          price: candle.low * 0.998,
          type: "buy",
          reason: `RSI超卖(${rsi[i].value.toFixed(0)})`,
        });
      }
    }
    // RSI 超买卖出（RSI > 70）
    if (rsi[i - 1].value <= 70 && rsi[i].value > 70) {
      const candle = candleMap.get(rsi[i].time);
      if (candle && !signals.find((s) => s.time === rsi[i].time)) {
        signals.push({
          time: rsi[i].time,
          price: candle.high * 1.002,
          type: "sell",
          reason: `RSI超买(${rsi[i].value.toFixed(0)})`,
        });
      }
    }
  }

  // 按时间排序
  return signals.sort((a, b) => a.time - b.time);
}
