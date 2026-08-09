import type {
  AgingBucket,
  CategoryStockRow,
  Period,
  PeriodMovement,
  PurityMovementByPeriod,
  PurityStockRow,
  StapleItem,
} from "./InventoryReports.type";

export const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
  year: "This year",
  all: "All time",
};

export const fmtCurrency = (value: number): string =>
  `$${Math.round(value).toLocaleString()}`;

export const computeBarPercent = (value: number, max: number): number =>
  max > 0 ? Math.max(1, Math.round((value / max) * 100)) : 1;

export const PURITY_STOCK: PurityStockRow[] = [
  { karat: "21K", grams: 11240, items: 2980, value: 2528000 },
  { karat: "18K", grams: 6820, items: 1640, value: 1366800 },
  { karat: "24K", grams: 512, items: 148, value: 118300 },
  { karat: "22K", grams: 26.4, items: 9, value: 6080 },
];

export const CATEGORY_STOCK: CategoryStockRow[] = [
  { name: "Bracelets", value: 1334000 },
  { name: "Rings", value: 842000 },
  { name: "Necklaces", value: 689000 },
  { name: "Bangles", value: 412000 },
  { name: "Earrings", value: 298000 },
  { name: "Bullion", value: 166557 },
  { name: "Pendants", value: 78000 },
];

export const AGING_BUCKETS: AgingBucket[] = [
  {
    label: "0–30 days",
    count: 1842,
    sub: "$1,461,200 · fresh",
    valueColor: "var(--admin-green)",
  },
  { label: "31–90 days", count: 1651, sub: "$1,288,400" },
  {
    label: "91–180 days",
    count: 948,
    sub: "$742,800 · slowing",
    valueColor: "var(--admin-amber)",
  },
  {
    label: "180+ days",
    count: 396,
    sub: "$327,157 · review these",
    valueColor: "var(--admin-red)",
  },
];

export const STAPLES: StapleItem[] = [
  {
    name: "Lira",
    type: "21K coin · 8g",
    stock: 14,
    lowThreshold: 10,
    soldByPeriod: { today: 3, week: 11, month: 42, year: 228, all: 611 },
  },
  {
    name: "Half Lira",
    type: "21K coin · 4g",
    stock: 22,
    lowThreshold: 10,
    soldByPeriod: { today: 1, week: 8, month: 31, year: 164, all: 447 },
  },
  {
    name: "Quarter Lira",
    type: "21K coin · 2g",
    stock: 6,
    lowThreshold: 10,
    soldByPeriod: { today: 2, week: 14, month: 55, year: 301, all: 818 },
  },
  {
    name: "Jadel Bangle",
    type: "21K bangle",
    stock: 18,
    lowThreshold: 8,
    soldByPeriod: { today: 1, week: 5, month: 19, year: 96, all: 241 },
  },
  {
    name: "1g Bar",
    type: "24K bullion",
    stock: 46,
    lowThreshold: 20,
    soldByPeriod: { today: 2, week: 9, month: 38, year: 204, all: 520 },
  },
  {
    name: "2.5g Bar",
    type: "24K bullion",
    stock: 28,
    lowThreshold: 15,
    soldByPeriod: { today: 0, week: 4, month: 17, year: 88, all: 226 },
  },
  {
    name: "5g Bar",
    type: "24K bullion",
    stock: 19,
    lowThreshold: 10,
    soldByPeriod: { today: 1, week: 3, month: 12, year: 71, all: 188 },
  },
  {
    name: "10g Bar",
    type: "24K bullion",
    stock: 11,
    lowThreshold: 6,
    soldByPeriod: { today: 0, week: 2, month: 8, year: 42, all: 109 },
  },
  {
    name: "Half Ounce",
    type: "24K bullion · 15.55g",
    stock: 7,
    lowThreshold: 4,
    soldByPeriod: { today: 0, week: 1, month: 4, year: 23, all: 58 },
  },
  {
    name: "Ounce",
    type: "24K bullion · 31.1g",
    stock: 4,
    lowThreshold: 3,
    soldByPeriod: { today: 0, week: 1, month: 3, year: 15, all: 36 },
  },
];

export const MOVEMENT_BY_PERIOD: Record<Period, PeriodMovement> = {
  today: {
    addedItems: 38,
    addedGrams: 312.4,
    soldItems: 38,
    soldGrams: 724.6,
    returnedItems: 2,
    returnedGrams: 12.1,
    meltedGrams: 0,
  },
  week: {
    addedItems: 212,
    addedGrams: 1840.2,
    soldItems: 241,
    soldGrams: 4385.2,
    returnedItems: 11,
    returnedGrams: 78.4,
    meltedGrams: 215.8,
  },
  month: {
    addedItems: 884,
    addedGrams: 7920.5,
    soldItems: 1067,
    soldGrams: 19483.7,
    returnedItems: 48,
    returnedGrams: 331.2,
    meltedGrams: 892.4,
  },
  year: {
    addedItems: 4720,
    addedGrams: 41280.8,
    soldItems: 5641,
    soldGrams: 99284.5,
    returnedItems: 285,
    returnedGrams: 2316.6,
    meltedGrams: 4821.0,
  },
  all: {
    addedItems: 13240,
    addedGrams: 114805.2,
    soldItems: 15233,
    soldGrams: 266841.0,
    returnedItems: 742,
    returnedGrams: 6105.3,
    meltedGrams: 13208.5,
  },
};

export const MOVEMENT_BY_PURITY: Record<Period, PurityMovementByPeriod> = {
  today: {
    added: [
      { karat: "21K", items: 24, grams: 198.3 },
      { karat: "18K", items: 11, grams: 96.2 },
      { karat: "24K", items: 3, grams: 17.9 },
      { karat: "22K", items: 0, grams: 0 },
    ],
    returned: [
      { karat: "21K", items: 1, grams: 3.8 },
      { karat: "18K", items: 1, grams: 8.3 },
      { karat: "24K", items: 0, grams: 0 },
      { karat: "22K", items: 0, grams: 0 },
    ],
  },
  week: {
    added: [
      { karat: "21K", items: 128, grams: 1102.4 },
      { karat: "18K", items: 64, grams: 582.1 },
      { karat: "24K", items: 18, grams: 148.2 },
      { karat: "22K", items: 2, grams: 7.5 },
    ],
    returned: [
      { karat: "21K", items: 6, grams: 41.2 },
      { karat: "18K", items: 4, grams: 31.0 },
      { karat: "24K", items: 1, grams: 6.2 },
      { karat: "22K", items: 0, grams: 0 },
    ],
  },
  month: {
    added: [
      { karat: "21K", items: 524, grams: 4680.2 },
      { karat: "18K", items: 282, grams: 2541.8 },
      { karat: "24K", items: 72, grams: 668.5 },
      { karat: "22K", items: 6, grams: 30.0 },
    ],
    returned: [
      { karat: "21K", items: 27, grams: 182.4 },
      { karat: "18K", items: 16, grams: 121.8 },
      { karat: "24K", items: 5, grams: 27.0 },
      { karat: "22K", items: 0, grams: 0 },
    ],
  },
  year: {
    added: [
      { karat: "21K", items: 2780, grams: 24302.5 },
      { karat: "18K", items: 1520, grams: 13480.4 },
      { karat: "24K", items: 388, grams: 3290.2 },
      { karat: "22K", items: 32, grams: 207.7 },
    ],
    returned: [
      { karat: "21K", items: 154, grams: 1497.4 },
      { karat: "18K", items: 108, grams: 748.6 },
      { karat: "24K", items: 23, grams: 70.6 },
      { karat: "22K", items: 0, grams: 0 },
    ],
  },
  all: {
    added: [
      { karat: "21K", items: 7820, grams: 68240.8 },
      { karat: "18K", items: 4280, grams: 38120.2 },
      { karat: "24K", items: 1056, grams: 8120.4 },
      { karat: "22K", items: 84, grams: 323.8 },
    ],
    returned: [
      { karat: "21K", items: 412, grams: 3702.1 },
      { karat: "18K", items: 268, grams: 2034.8 },
      { karat: "24K", items: 59, grams: 362.0 },
      { karat: "22K", items: 3, grams: 6.4 },
    ],
  },
};
