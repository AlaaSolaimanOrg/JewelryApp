export interface TrendPoint {
  label: string;
  value: number;
}

export interface GoldByKarat {
  karat: number;
  weight: number;
  percentage: number;
}

export type AttentionColor = "red" | "amber" | "blue";

export interface AttentionItem {
  color: AttentionColor;
  text: string;
  tag: string;
}

export interface SalesSummary {
  salesRevenue: {
    amount: number;
    transactions: number;
    changePercentage: number;
    isIncrease: boolean;
  };
  salesTrend: TrendPoint[];
  payments: {
    total: number;
    cash: { amount: number; percentage: number };
    card: { amount: number; percentage: number };
    itemsSold: number;
    itemsSoldWeight: number;
    discounts: number;
    discountedSalesCount: number;
    avgSale: number;
    customers: number;
    customersAddedToday: number;
  };
  goldSoldToday: GoldByKarat[];
  topCategory: { name: string; itemsSold: number };
}

export interface CashGoldSnapshot {
  storeCash: {
    amount: number;
    cashIn: number;
    cashOut: number;
  };
  transfersBox: {
    amount: number;
    todayIn: number;
  };
  usedGoldOnHand: {
    weight: number;
    avgKarat: number;
    investedValue: number;
  };
  usedGoldBought: {
    amount: number;
    weight: number;
    purchases: number;
  };
}

export interface RepairsStats {
  repairsCollected: {
    amount: number;
    payments: number;
    repairsTakenIn: number;
  };
  repairs: {
    inProgress: number;
    awaitingCall: number;
    dueToday: number;
    overdue: number;
    unpaidBalance: number;
    unpaidCount: number;
  };
}

export interface InventorySnapshot {
  stockValue: {
    amount: number;
    items: number;
    weight: number;
  };
  refundsPaidOut: {
    amount: number;
    returns: number;
    toStock: number;
    toMelt: number;
  };
}
