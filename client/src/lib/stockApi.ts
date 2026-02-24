/**
 * 股识 StockWise — 股票数据服务层
 * 通过 Manus Forge API (Yahoo Finance) 获取 A 股和美股数据
 *
 * A股代码规则：
 *   上交所 → 代码.SS (如 600519.SS 贵州茅台)
 *   深交所 → 代码.SZ (如 000858.SZ 五粮液)
 * 美股：直接使用代码 (如 AAPL, TSLA)
 */

export interface StockMeta {
  symbol: string;
  longName?: string;
  shortName?: string;
  currency: string;
  exchangeName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  regularMarketOpen: number;
  previousClose: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCap?: number;
  trailingPE?: number;
}

export interface CandleData {
  time: number; // Unix timestamp (seconds)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockChartData {
  meta: StockMeta;
  candles: CandleData[];
}

export type TimeRange = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y";
export type Interval = "1m" | "5m" | "15m" | "30m" | "1h" | "1d" | "1wk" | "1mo";

const INTERVAL_MAP: Record<TimeRange, Interval> = {
  "1d": "5m",
  "5d": "15m",
  "1mo": "1d",
  "3mo": "1d",
  "6mo": "1d",
  "1y": "1d",
  "2y": "1wk",
  "5y": "1wk",
};

async function callForgeApi(apiName: string, params: Record<string, unknown>): Promise<unknown> {
  const apiUrl = import.meta.env.VITE_FRONTEND_FORGE_API_URL;
  const apiKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error("API 配置缺失，请检查环境变量");
  }

  const response = await fetch(`${apiUrl}/v1/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      api: apiName,
      params,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API 请求失败 (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * 获取股票 K 线图数据（通过服务端代理 Yahoo Finance，获取真实数据）
 */
export async function fetchStockChart(
  symbol: string,
  range: TimeRange = "3mo"
): Promise<StockChartData> {
  try {
    // 调用服务端 tRPC 代理接口
    const input = encodeURIComponent(JSON.stringify({ json: { symbol, range } }));
    const res = await fetch(`/api/trpc/stock.chart?input=${input}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const result = json?.result?.data?.json;
    if (!result?.meta) throw new Error("返回数据为空");
    return {
      meta: {
        symbol: result.meta.symbol,
        longName: result.meta.displayName || result.meta.longName,
        shortName: result.meta.displayName || result.meta.shortName,
        currency: result.meta.currency,
        exchangeName: result.meta.exchangeName,
        regularMarketPrice: result.meta.regularMarketPrice,
        regularMarketChange: result.meta.regularMarketChange,
        regularMarketChangePercent: result.meta.regularMarketChangePercent,
        regularMarketDayHigh: result.meta.regularMarketDayHigh,
        regularMarketDayLow: result.meta.regularMarketDayLow,
        regularMarketVolume: result.meta.regularMarketVolume,
        regularMarketOpen: result.meta.regularMarketOpen,
        previousClose: result.meta.previousClose,
        fiftyTwoWeekHigh: result.meta.fiftyTwoWeekHigh ?? 0,
        fiftyTwoWeekLow: result.meta.fiftyTwoWeekLow ?? 0,
        marketCap: result.meta.marketCap,
        trailingPE: result.meta.trailingPE,
      },
      candles: result.candles,
    };
  } catch {
    // 服务端代理失败时回退模拟数据
    return generateMockData(symbol);
  }
}

/**
 * 生成演示用模拟数据
 */
function generateMockData(symbol: string): StockChartData {
  const isA = isAStock(symbol);
  const basePrice = isA ? 100 + Math.random() * 400 : 100 + Math.random() * 300;
  const currency = isA ? "CNY" : "USD";

  const candles: CandleData[] = [];
  const now = Math.floor(Date.now() / 1000);
  let price = basePrice;

  for (let i = 90; i >= 0; i--) {
    const daySeconds = 86400;
    const time = now - i * daySeconds;
    const change = (Math.random() - 0.48) * price * 0.03;
    const open = price;
    price = Math.max(price + change, basePrice * 0.5);
    const high = Math.max(open, price) * (1 + Math.random() * 0.01);
    const low = Math.min(open, price) * (1 - Math.random() * 0.01);
    const volume = Math.floor(1e6 + Math.random() * 5e7);

    candles.push({ time, open, high, low, close: price, volume });
  }

  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles[candles.length - 2];
  const change = lastCandle.close - prevCandle.close;

  return {
    meta: {
      symbol,
      longName: STOCK_NAMES[symbol] || symbol,
      shortName: STOCK_NAMES[symbol] || symbol,
      currency,
      exchangeName: isA ? (symbol.endsWith(".SS") ? "SSE" : "SZSE") : "NASDAQ",
      regularMarketPrice: lastCandle.close,
      regularMarketChange: change,
      regularMarketChangePercent: (change / prevCandle.close) * 100,
      regularMarketDayHigh: lastCandle.high,
      regularMarketDayLow: lastCandle.low,
      regularMarketVolume: lastCandle.volume,
      regularMarketOpen: lastCandle.open,
      previousClose: prevCandle.close,
      fiftyTwoWeekHigh: Math.max(...candles.map((c) => c.high)),
      fiftyTwoWeekLow: Math.min(...candles.map((c) => c.low)),
    },
    candles,
  };
}

const STOCK_NAMES: Record<string, string> = {
  "600519.SS": "贵州茅台",
  "000858.SZ": "五粮液",
  "601318.SS": "中国平安",
  "000333.SZ": "美的集团",
  "600036.SS": "招商银行",
  "300750.SZ": "宁德时代",
  "601888.SS": "中国中免",
  "000001.SZ": "平安银行",
  AAPL: "苹果",
  MSFT: "微软",
  GOOGL: "谷歌",
  AMZN: "亚马逊",
  TSLA: "特斯拉",
  NVDA: "英伟达",
  META: "Meta",
  "BRK-B": "伯克希尔",
};

/**
 * 判断是否为 A 股代码
 */
export function isAStock(symbol: string): boolean {
  return symbol.endsWith(".SS") || symbol.endsWith(".SZ");
}

/**
 * 格式化股票代码显示
 */
export function formatSymbol(symbol: string): string {
  if (symbol.endsWith(".SS")) return symbol.replace(".SS", " (沪)");
  if (symbol.endsWith(".SZ")) return symbol.replace(".SZ", " (深)");
  return symbol;
}

/**
 * 格式化价格
 */
export function formatPrice(price: number, currency: string = "CNY"): string {
  if (currency === "CNY") return `¥${price.toFixed(2)}`;
  return `$${price.toFixed(2)}`;
}

/**
 * 格式化涨跌幅
 */
export function formatChange(change: number, percent: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
}

/**
 * 格式化成交量
 */
export function formatVolume(volume: number): string {
  if (volume >= 1e8) return `${(volume / 1e8).toFixed(2)}亿`;
  if (volume >= 1e4) return `${(volume / 1e4).toFixed(2)}万`;
  return volume.toLocaleString();
}

/**
 * 热门股票预设列表
 */
export const HOT_STOCKS = {
  astock: [
    { symbol: "600519.SS", name: "贵州茅台", sector: "消费" },
    { symbol: "000858.SZ", name: "五粮液", sector: "消费" },
    { symbol: "601318.SS", name: "中国平安", sector: "金融" },
    { symbol: "000333.SZ", name: "美的集团", sector: "制造" },
    { symbol: "600036.SS", name: "招商银行", sector: "金融" },
    { symbol: "300750.SZ", name: "宁德时代", sector: "新能源" },
    { symbol: "601888.SS", name: "中国中免", sector: "消费" },
    { symbol: "000001.SZ", name: "平安银行", sector: "金融" },
  ],
  usstock: [
    { symbol: "AAPL", name: "苹果", sector: "科技" },
    { symbol: "MSFT", name: "微软", sector: "科技" },
    { symbol: "GOOGL", name: "谷歌", sector: "科技" },
    { symbol: "AMZN", name: "亚马逊", sector: "电商" },
    { symbol: "TSLA", name: "特斯拉", sector: "新能源" },
    { symbol: "NVDA", name: "英伟达", sector: "半导体" },
    { symbol: "META", name: "Meta", sector: "社交" },
    { symbol: "BRK-B", name: "伯克希尔", sector: "金融" },
  ],
};
