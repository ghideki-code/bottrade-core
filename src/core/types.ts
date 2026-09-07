export type Timeframe = "4h" | "1h" | "15m" | "5m";

export interface Candle {
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketSnapshot {
  symbol: string;
  timeframe: Timeframe;
  candles: Candle[];
  fetchedAt: number;
  source: "binance";
}

export interface DataSanityResult {
  valid: boolean;
  reasons: string[];
  candleCount: number;
  latestCloseTime: number | null;
  ageMs: number | null;
}

export interface TimeframeSpec {
  timeframe: Timeframe;
  role: "macro" | "intermediate" | "execution" | "trigger";
  minimumCandles: number;
  maxAgeMs: number;
}
