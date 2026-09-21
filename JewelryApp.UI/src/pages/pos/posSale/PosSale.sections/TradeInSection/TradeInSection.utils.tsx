import type { TradeInRow } from "./TradeInSection.type";

const DEFAULT_TRADE_IN_KARATS = [24, 22, 21, 18, 14, 10];

export const createDefaultTradeInRows = (): TradeInRow[] =>
  DEFAULT_TRADE_IN_KARATS.map((karat, idx) => ({
    id: idx + 1,
    karat,
    weight: 0,
    pricePerGram: 0,
  }));

export const getTradeInTotal = (rows: TradeInRow[]) =>
  rows.reduce((sum, r) => sum + r.weight * r.pricePerGram, 0);

export const getActiveTradeInRows = (rows: TradeInRow[]) =>
  rows.filter((r) => r.weight > 0 && r.pricePerGram > 0);

const KARAT_COLORS: Record<number, string> = {
  24: "#D4A017",
  22: "#C9952A",
  21: "#BF8C30",
  18: "#B28535",
  14: "#A6793A",
  10: "#9A6F3E",
};

export const getKaratColor = (karat: number) => KARAT_COLORS[karat] ?? "#7D6340";
