import type { Timeframe, TimeframeSpec } from "../../core/types.js";

export const TIMEFRAME_REGISTRY: Record<Timeframe, TimeframeSpec> = {
  "4h": { timeframe: "4h", role: "macro", minimumCandles: 250, maxAgeMs: 5 * 60 * 60 * 1000 },
  "1h": { timeframe: "1h", role: "intermediate", minimumCandles: 250, maxAgeMs: 90 * 60 * 1000 },
  "15m": { timeframe: "15m", role: "execution", minimumCandles: 300, maxAgeMs: 30 * 60 * 1000 },
  "5m": { timeframe: "5m", role: "trigger", minimumCandles: 300, maxAgeMs: 15 * 60 * 1000 },
};

export const TIMEFRAMES: Timeframe[] = ["4h", "1h", "15m", "5m"];
