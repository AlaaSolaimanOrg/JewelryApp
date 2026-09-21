import { KaratType } from "../../../../../types/enums";
import type { TradeInRow } from "./TradeInSection.type";

export const createDefaultTradeInRows = (): TradeInRow[] =>
  [
    KaratType.Karat24,
    KaratType.Karat22,
    KaratType.Karat21,
    KaratType.Karat18,
  ].map((karat, idx) => ({
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
};

export const getKaratColor = (karat: number) => KARAT_COLORS[karat] ?? "#7D6340";
