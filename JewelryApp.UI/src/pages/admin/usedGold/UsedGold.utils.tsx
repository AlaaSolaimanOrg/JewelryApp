import type { GoldPool } from "./UsedGold.type";

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const STANDARD_KARATS = [24, 22, 21, 18, 14, 10];

const KARAT_COLORS: Record<number, string> = {
  24: "#d4a017",
  22: "#c9952a",
  21: "#bf8c30",
  18: "#b28535",
  14: "#a07a3b",
  10: "#8c6d3f",
};

export const getKaratColor = (karat: number): string =>
  KARAT_COLORS[karat] ?? "#7d6340";

export const fmtCurrency = (value: number): string =>
  `$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const fmtCurrencyRounded = (value: number): string =>
  `$${Math.round(Math.abs(value)).toLocaleString()}`;

export const fmtWeight = (grams: number): string => `${grams.toFixed(1)}g`;

export const fmtDate = (date: string): string => {
  const d = new Date(date);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

export const getAllKarats = (pools: Record<number, GoldPool>): number[] =>
  Object.keys(pools)
    .map(Number)
    .sort((a, b) => b - a);

export const getTotalOnHand = (pools: Record<number, GoldPool>): number =>
  getAllKarats(pools).reduce((sum, k) => sum + pools[k].weight, 0);

export const getCurrentValue = (pools: Record<number, GoldPool>): number =>
  getAllKarats(pools).reduce((sum, k) => sum + pools[k].cost, 0);

export const getTotalInvested = (pools: Record<number, GoldPool>): number =>
  getAllKarats(pools).reduce((sum, k) => sum + pools[k].totalInvested, 0);

export const getAvgPurity = (pools: Record<number, GoldPool>): number => {
  const totalWeight = getTotalOnHand(pools);
  if (totalWeight === 0) return 0;
  return (
    getAllKarats(pools).reduce((sum, k) => sum + k * pools[k].weight, 0) /
    totalWeight
  );
};

