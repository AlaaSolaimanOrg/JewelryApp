import type { AttentionColor, DashboardData } from "./Dashboard.type";

export const fmtCurrency = (value: number): string =>
  `$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const fmtCurrencyRounded = (value: number): string =>
  `$${Math.round(Math.abs(value)).toLocaleString()}`;

export const fmtNumber = (value: number): string =>
  value.toLocaleString("en-US");

export const fmtWeight = (grams: number): string => `${grams.toFixed(1)}g`;

export const ATTENTION_COLORS: Record<
  AttentionColor,
  { dot: string; bg: string }
> = {
  red: { dot: "var(--admin-red)", bg: "rgba(230, 91, 91, 0.12)" },
  amber: { dot: "var(--admin-amber)", bg: "rgba(230, 162, 60, 0.12)" },
  blue: { dot: "var(--admin-blue)", bg: "rgba(91, 163, 230, 0.12)" },
};

export const MOCK_DASHBOARD: DashboardData = {
  today: {
    salesRevenue: {
      amount: 68425.5,
      transactions: 31,
      changePercentage: 12,
      isIncrease: true,
    },
    repairsCollected: {
      amount: 385,
      payments: 9,
      repairsTakenIn: 4,
    },
    refundsPaidOut: {
      amount: 3205.3,
      returns: 2,
      toStock: 1,
      toMelt: 1,
    },
    usedGoldBought: {
      amount: 4860,
      weight: 27.4,
      purchases: 3,
    },
  },
  now: {
    storeCash: {
      amount: 21447.2,
      cashIn: 5830,
      cashOut: 8065,
    },
    transfersBox: {
      amount: 6700,
      todayIn: 1500,
      pending: 1,
    },
    usedGoldOnHand: {
      weight: 239.9,
      avgKarat: 19.7,
      investedValue: 39468,
    },
    stockValue: {
      amount: 3819557,
      items: 4837,
      weight: 18939,
    },
  },
  salesTrend: [
    { label: "May 29", value: 42180 },
    { label: "30", value: 55320 },
    { label: "31", value: 38940 },
    { label: "Jun 1", value: 61200 },
    { label: "2", value: 47850 },
    { label: "3", value: 52640 },
    { label: "4", value: 71300 },
    { label: "5", value: 44980 },
    { label: "6", value: 58210 },
    { label: "7", value: 49370 },
    { label: "8", value: 63850 },
    { label: "9", value: 39420 },
    { label: "10", value: 57960 },
    { label: "Today", value: 68425 },
  ],
  payments: {
    total: 68810,
    cash: { amount: 46791, percentage: 68 },
    card: { amount: 22019, percentage: 32 },
    itemsSold: 38,
    itemsSoldWeight: 724.6,
    discounts: 1240,
    discountedSalesCount: 6,
    avgSale: 2207,
    customers: 1394,
    customersAddedToday: 7,
  },
  repairs: {
    inProgress: 6,
    awaitingCall: 2,
    dueToday: 3,
    overdue: 2,
    unpaidBalance: 215,
    unpaidCount: 8,
  },
  goldSoldToday: [
    { karat: 21, weight: 412.3, percentage: 78 },
    { karat: 18, weight: 253.8, percentage: 48 },
    { karat: 22, weight: 41.2, percentage: 8 },
    { karat: 24, weight: 17.3, percentage: 4 },
  ],
  topCategory: { name: "Bracelets", itemsSold: 11 },
  attention: [
    {
      color: "red",
      text: (
        <>
          <b>2 repairs overdue</b> — oldest 5 days (Slot 4)
        </>
      ),
      tag: "Repairs",
    },
    {
      color: "amber",
      text: (
        <>
          <b>2 repairs done</b>, customer not called yet
        </>
      ),
      tag: "Call",
    },
    {
      color: "blue",
      text: (
        <>
          <b>4 returned items</b> need tags printed
        </>
      ),
      tag: "Tags",
    },
  ],
};
