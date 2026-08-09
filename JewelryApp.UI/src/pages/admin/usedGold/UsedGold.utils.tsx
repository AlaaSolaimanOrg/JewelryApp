import type { GoldPool, Period, UsedGoldHistoryEntry } from "./UsedGold.type";

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
  const [, month, day] = date.split("-");
  return `${MONTHS[Number(month) - 1]} ${parseInt(day, 10)}`;
};

export const getMonth = (date: string): number => Number(date.split("-")[1]) - 1;
export const getYear = (date: string): number => Number(date.split("-")[0]);

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

export const filterHistoryByPeriod = (
  history: UsedGoldHistoryEntry[],
  period: Period,
  month: number,
  year: number
): UsedGoldHistoryEntry[] => {
  if (period === "all") return history;
  return history.filter((h) =>
    period === "month"
      ? getMonth(h.date) === month && getYear(h.date) === year
      : getYear(h.date) === year
  );
};

export const createMockPools = (): Record<number, GoldPool> => ({
  24: { weight: 23.6, cost: 2124.0, totalInvested: 2124.0 },
  22: { weight: 5.17, cost: 423.94, totalInvested: 861.0 },
  21: { weight: 105.29, cost: 18731.65, totalInvested: 22564.65 },
  18: { weight: 65.3, cost: 9762.5, totalInvested: 14367.0 },
  14: { weight: 18.6, cost: 2232.0, totalInvested: 2232.0 },
  10: { weight: 5.8, cost: 551.0, totalInvested: 551.0 },
  9: { weight: 3.2, cost: 96.0, totalInvested: 96.0 },
});

export const createMockHistory = (): UsedGoldHistoryEntry[] => [
  {
    id: 101,
    date: "2026-06-10",
    type: "purchase",
    desc: "Nour Yamani",
    notes: "21K ring",
    karat: 21,
    weight: 4.2,
    cost: 735.0,
  },
  {
    id: 102,
    date: "2026-06-08",
    type: "purchase",
    desc: "Heba Amire",
    notes: "18K bracelet",
    karat: 18,
    weight: 9.6,
    cost: 1392.0,
  },
  {
    id: 103,
    date: "2026-06-05",
    type: "purchase",
    desc: "Mohamad Houchaymi",
    notes: "9K ring — odd purity",
    karat: 9,
    weight: 3.2,
    cost: 96.0,
  },
  {
    id: 104,
    date: "2026-06-02",
    type: "purchase",
    desc: "Zainab Al Mutlak",
    notes: "21K chain",
    karat: 21,
    weight: 11.3,
    cost: 1977.5,
  },
  {
    id: 1,
    date: "2026-05-16",
    type: "purchase",
    desc: "Hanan Saleh",
    notes: "21K ring",
    karat: 21,
    weight: 5.69,
    cost: 1337.15,
  },
  {
    id: 2,
    date: "2026-05-14",
    type: "purchase",
    desc: "Ahmad Khalil",
    notes: "18K chain",
    karat: 18,
    weight: 22.4,
    cost: 3360.0,
  },
  {
    id: 3,
    date: "2026-05-12",
    type: "purchase",
    desc: "Sara Mansour",
    notes: "21K bracelet + ring",
    karat: 21,
    weight: 19.0,
    cost: 3325.0,
  },
  {
    id: 4,
    date: "2026-05-10",
    type: "purchase",
    desc: "Ousama Adi",
    notes: "24K chain broken",
    karat: 24,
    weight: 15.2,
    cost: 1368.0,
  },
  {
    id: 5,
    date: "2026-05-08",
    type: "purchase",
    desc: "Fatima Hassan",
    notes: "18K earrings pair",
    karat: 18,
    weight: 8.3,
    cost: 1245.0,
  },
  {
    id: 6,
    date: "2026-05-06",
    type: "purchase",
    desc: "Rajaa Annouka",
    notes: "21K 3 rings",
    karat: 21,
    weight: 12.4,
    cost: 2170.0,
  },
  {
    id: 7,
    date: "2026-05-04",
    type: "purchase",
    desc: "Ali Mahmoud",
    notes: "14K chain",
    karat: 14,
    weight: 18.6,
    cost: 2232.0,
  },
  {
    id: 8,
    date: "2026-05-02",
    type: "purchase",
    desc: "Mariam Taha",
    notes: "21K pendant",
    karat: 21,
    weight: 4.8,
    cost: 840.0,
  },
  {
    id: 9,
    date: "2026-04-28",
    type: "purchase",
    desc: "Hanan Saleh",
    notes: "18K bracelet",
    karat: 18,
    weight: 14.2,
    cost: 2130.0,
  },
  {
    id: 10,
    date: "2026-04-25",
    type: "purchase",
    desc: "Ousama Adi",
    notes: "22K chain",
    karat: 22,
    weight: 10.5,
    cost: 861.0,
  },
  {
    id: 11,
    date: "2026-04-22",
    type: "purchase",
    desc: "Sara Mansour",
    notes: "21K ring",
    karat: 21,
    weight: 6.3,
    cost: 1102.5,
  },
  {
    id: 12,
    date: "2026-04-20",
    type: "purchase",
    desc: "Ahmad Khalil",
    notes: "24K pendant",
    karat: 24,
    weight: 8.4,
    cost: 756.0,
  },
  {
    id: 13,
    date: "2026-04-18",
    type: "purchase",
    desc: "Fatima Hassan",
    notes: "10K ring",
    karat: 10,
    weight: 5.8,
    cost: 551.0,
  },
  {
    id: 14,
    date: "2026-04-15",
    type: "purchase",
    desc: "Ali Mahmoud",
    notes: "18K mixed 2 items",
    karat: 18,
    weight: 11.6,
    cost: 1740.0,
  },
  {
    id: 15,
    date: "2026-04-10",
    type: "purchase",
    desc: "Rajaa Annouka",
    notes: "21K bracelet",
    karat: 21,
    weight: 16.8,
    cost: 2940.0,
  },
  {
    id: 16,
    date: "2026-04-05",
    type: "purchase",
    desc: "Ousama Adi",
    notes: "21K chain heavy",
    karat: 21,
    weight: 32.5,
    cost: 5687.5,
  },
  {
    id: 17,
    date: "2026-04-08",
    type: "melt",
    desc: "Melt batch",
    notes: "Sent to ABC Gold — mixed bag",
    karat: "mixed",
    weight: 44.0,
    cost: 6950.0,
  },
  {
    id: 18,
    date: "2026-03-28",
    type: "purchase",
    desc: "Hanan Saleh",
    notes: "18K ring + earring",
    karat: 18,
    weight: 9.7,
    cost: 1455.0,
  },
  {
    id: 19,
    date: "2026-03-22",
    type: "purchase",
    desc: "Sara Mansour",
    notes: "21K bracelet",
    karat: 21,
    weight: 14.0,
    cost: 2450.0,
  },
  {
    id: 20,
    date: "2026-03-15",
    type: "purchase",
    desc: "Ahmad Khalil",
    notes: "18K chain",
    karat: 18,
    weight: 20.3,
    cost: 3045.0,
  },
  {
    id: 21,
    date: "2026-03-12",
    type: "stock",
    desc: "Return to stock",
    notes: "21K ring set for display",
    karat: 21,
    weight: 8.5,
    cost: 1487.5,
  },
  {
    id: 22,
    date: "2026-03-06",
    type: "stock",
    desc: "Return to stock",
    notes: "22K pendant display piece",
    karat: 22,
    weight: 5.33,
    cost: 437.06,
  },
];
