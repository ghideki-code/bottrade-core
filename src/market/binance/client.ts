import type { Candle, Timeframe } from "../../core/types.js";

const INTERVALS: Record<Timeframe, string> = {
  "4h": "4h",
  "1h": "1h",
  "15m": "15m",
  "5m": "5m",
};

const DEFAULT_BASE_URL = "https://api.binance.com";

export class BinanceMarketClient {
  private readonly baseUrl: string;

  constructor(baseUrl = process.env.BINANCE_BASE_URL ?? DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async getKlines(symbol: string, timeframe: Timeframe, limit = 500): Promise<Candle[]> {
    if (!/^[A-Z0-9]{5,20}$/.test(symbol)) {
      throw new Error(`Invalid Binance symbol: ${symbol}`);
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
      throw new Error("Kline limit must be an integer between 1 and 1000");
    }

    const url = new URL(`${this.baseUrl}/api/v3/klines`);
    url.searchParams.set("symbol", symbol.toUpperCase());
    url.searchParams.set("interval", INTERVALS[timeframe]);
    url.searchParams.set("limit", String(limit));

    const response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Binance klines request failed: ${response.status} ${response.statusText}`);
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error("Binance returned an invalid klines payload");
    }

    return payload.map((row, index) => this.parseKline(row, index));
  }

  private parseKline(row: unknown, index: number): Candle {
    if (!Array.isArray(row) || row.length < 7) {
      throw new Error(`Invalid Binance kline at index ${index}`);
    }

    const values = row.slice(0, 7).map((value) => Number(value));
    if (values.some((value) => !Number.isFinite(value))) {
      throw new Error(`Non-finite Binance kline value at index ${index}`);
    }

    const [openTime, open, high, low, close, volume, closeTime] = values;
    if (openTime === undefined || open === undefined || high === undefined || low === undefined || close === undefined || volume === undefined || closeTime === undefined) {
      throw new Error(`Incomplete Binance kline at index ${index}`);
    }

    return { openTime, closeTime, open, high, low, close, volume };
  }
}
