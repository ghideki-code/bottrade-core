export * from "./core/types.js";
export * from "./market/binance/client.js";
export * from "./market/load-market.js";
export * from "./market/sanity/validate.js";
export * from "./market/timeframes/registry.js";

if (import.meta.url === `file://${process.argv[1]}`) {
  const symbol = process.env.BOTTRADE_SYMBOL ?? "BTCUSDT";
  console.log(`BotTrade Core ${symbol}: market-data foundation ready.`);
  console.log("Mode: ANALYSIS / PAPER TRADING only. Real execution is disabled.");
}
