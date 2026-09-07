import type { MarketSnapshot, Timeframe } from "../core/types.js";
import { BinanceMarketClient } from "./binance/client.js";
import { validateCandles } from "./sanity/validate.js";
import { TIMEFRAME_REGISTRY, TIMEFRAMES } from "./timeframes/registry.js";

export interface LoadedMarketData {
  snapshots: Partial<Record<Timeframe, MarketSnapshot>>;
  blocked: boolean;
  reasons: string[];
}

export async function loadMarketData(
  symbol: string,
  client = new BinanceMarketClient(),
): Promise<LoadedMarketData> {
  const results = await Promise.all(
    TIMEFRAMES.map(async (timeframe) => {
      const spec = TIMEFRAME_REGISTRY[timeframe];
      try {
        const candles = await client.getKlines(symbol, timeframe, Math.min(500, spec.minimumCandles + 50));
        const sanity = validateCandles(candles, Date.now(), spec.minimumCandles, spec.maxAgeMs);
        if (!sanity.valid) {
          return { timeframe, snapshot: undefined, reasons: sanity.reasons.map((reason) => `${timeframe}:${reason}`) };
        }
        return {
          timeframe,
          snapshot: { symbol, timeframe, candles, fetchedAt: Date.now(), source: "binance" as const },
          reasons: [] as string[],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown_market_data_error";
        return { timeframe, snapshot: undefined, reasons: [`${timeframe}:${message}`] };
      }
    }),
  );

  const snapshots: Partial<Record<Timeframe, MarketSnapshot>> = {};
  const reasons: string[] = [];
  for (const result of results) {
    if (result.snapshot) snapshots[result.timeframe] = result.snapshot;
    reasons.push(...result.reasons);
  }

  return {
    snapshots,
    blocked: reasons.length > 0 || TIMEFRAMES.some((timeframe) => !snapshots[timeframe]),
    reasons,
  };
}
