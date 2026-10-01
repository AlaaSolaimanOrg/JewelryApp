import { KaratType } from "../../../types/enums";
import type { KaratCardViewModel, PriceItem } from "./Pricing.type";

export const karatLabels: Record<KaratType, string> = {
  [KaratType.Karat18]: "18K",
  [KaratType.Karat21]: "21K",
  [KaratType.Karat22]: "22K",
  [KaratType.Karat24]: "24K",
};

export const fmtCurrency = (value: number): string =>
  `$${Math.round(value).toLocaleString()}`;

export const fmtWeight = (grams: number): string =>
  `${grams.toLocaleString("en-US", { maximumFractionDigits: 1 })}g`;

export const buildKaratCards = (
  prices: PriceItem[],
  initialPrices: PriceItem[],
  stockByKarat: Record<number, number>
): KaratCardViewModel[] => {
  return prices.map((price) => {
    const initial = initialPrices.find(
      (p) =>
        p.karatType === price.karatType && p.productType === price.productType
    );
    const stockGrams = stockByKarat[price.karatType] ?? 0;
    const initialPrice = initial?.pricePerGram ?? 0;
    const currentPrice = price.pricePerGram ?? 0;
    const diff = currentPrice - initialPrice;
    const changed = price.pricePerGram != null && Math.abs(diff) >= 0.005;
    const valueImpact = diff * stockGrams;
    const pct = initialPrice ? (diff / initialPrice) * 100 : 0;

    let deltaDirection: "up" | "down" | "none" = "none";
    let deltaText = "Current price";
    if (changed) {
      deltaDirection = diff > 0 ? "up" : "down";
      deltaText = `$${initialPrice.toFixed(2)} → $${currentPrice.toFixed(
        2
      )} (${diff > 0 ? "+" : ""}${pct.toFixed(1)}%) · stock value ${
        valueImpact >= 0 ? "+" : "−"
      }${fmtCurrency(Math.abs(valueImpact))}`;
    }

    return {
      karatType: price.karatType,
      karatLabel: karatLabels[price.karatType],
      stockGrams,
      price: price.pricePerGram,
      changed,
      deltaDirection,
      deltaText,
      valueImpact: changed ? valueImpact : 0,
    };
  });
};

export const computeTotalStockValue = (
  prices: PriceItem[],
  stockByKarat: Record<number, number>
): number =>
  prices.reduce(
    (sum, price) =>
      sum + (price.pricePerGram ?? 0) * (stockByKarat[price.karatType] ?? 0),
    0
  );
