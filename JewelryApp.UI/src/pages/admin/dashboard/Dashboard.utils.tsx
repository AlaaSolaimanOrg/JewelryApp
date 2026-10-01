import type {
  AttentionColor,
  CashGoldSnapshot,
  InventorySnapshot,
  RepairsStats,
  SalesSummary,
} from "./Dashboard.type";

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

export const EMPTY_SALES_SUMMARY: SalesSummary = {
  salesRevenue: { amount: 0, transactions: 0, changePercentage: 0, isIncrease: true },
  salesTrend: [],
  payments: {
    total: 0,
    cash: { amount: 0, percentage: 0 },
    card: { amount: 0, percentage: 0 },
    itemsSold: 0,
    itemsSoldWeight: 0,
    discounts: 0,
    discountedSalesCount: 0,
    avgSale: 0,
    customers: 0,
    customersAddedToday: 0,
  },
  goldSoldToday: [],
  topCategory: { name: "—", itemsSold: 0 },
};

export const EMPTY_CASH_GOLD_SNAPSHOT: CashGoldSnapshot = {
  storeCash: { amount: 0, cashIn: 0, cashOut: 0 },
  transfersBox: { amount: 0, todayIn: 0 },
  usedGoldOnHand: { weight: 0, avgKarat: 0, investedValue: 0 },
  usedGoldBought: { amount: 0, weight: 0, purchases: 0 },
};

export const EMPTY_REPAIRS_STATS: RepairsStats = {
  repairsCollected: { amount: 0, payments: 0, repairsTakenIn: 0 },
  repairs: {
    inProgress: 0,
    awaitingCall: 0,
    dueToday: 0,
    overdue: 0,
    unpaidBalance: 0,
    unpaidCount: 0,
  },
};

export const EMPTY_INVENTORY_SNAPSHOT: InventorySnapshot = {
  stockValue: { amount: 0, items: 0, weight: 0 },
  refundsPaidOut: { amount: 0, returns: 0, toStock: 0, toMelt: 0 },
};
