import type { Candle, DataSanityResult } from "../../core/types.js";

export function validateCandles(
  candles: Candle[],
  now = Date.now(),
  minimumCandles = 100,
  maxAgeMs = 60 * 60 * 1000,
): DataSanityResult {
  const reasons: string[] = [];

  if (candles.length < minimumCandles) {
    reasons.push(`insufficient_candles:${candles.length}<${minimumCandles}`);
  }

  for (let i = 0; i < candles.length; i += 1) {
    const candle = candles[i];
    if (!candle) {
      reasons.push(`missing_candle:${i}`);
      continue;
    }

    const values = [candle.openTime, candle.closeTime, candle.open, candle.high, candle.low, candle.close, candle.volume];
    if (values.some((value) => !Number.isFinite(value))) {
      reasons.push(`non_finite_value:${i}`);
      continue;
    }
    if (candle.open <= 0 || candle.high <= 0 || candle.low <= 0 || candle.close <= 0 || candle.volume < 0) {
      reasons.push(`invalid_price_or_volume:${i}`);
    }
    if (candle.high < Math.max(candle.open, candle.close) || candle.low > Math.min(candle.open, candle.close)) {
      reasons.push(`invalid_ohlc:${i}`);
    }
    if (i > 0) {
      const previous = candles[i - 1];
      if (previous && candle.openTime <= previous.openTime) {
        reasons.push(`non_monotonic_time:${i}`);
      }
    }
  }

  const latestCloseTime = candles.at(-1)?.closeTime ?? null;
  const ageMs = latestCloseTime === null ? null : Math.max(0, now - latestCloseTime);

  if (ageMs === null) reasons.push("missing_latest_candle");
  else if (ageMs > maxAgeMs) reasons.push(`stale_data:${ageMs}>${maxAgeMs}`);

  return {
    valid: reasons.length === 0,
    reasons,
    candleCount: candles.length,
    latestCloseTime,
    ageMs,
  };
}
