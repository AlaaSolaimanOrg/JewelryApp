import type { ReactNode } from "react";

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
  text: ReactNode;
  tag: string;
}

export interface DashboardData {
  today: {
    salesRevenue: {
      amount: number;
      transactions: number;
      changePercentage: number;
      isIncrease: boolean;
    };
    repairsCollected: {
      amount: number;
      payments: number;
      repairsTakenIn: number;
    };
    refundsPaidOut: {
      amount: number;
      returns: number;
      toStock: number;
      toMelt: number;
    };
    usedGoldBought: {
      amount: number;
      weight: number;
      purchases: number;
    };
  };
  now: {
    storeCash: {
      amount: number;
      cashIn: number;
      cashOut: number;
    };
    transfersBox: {
      amount: number;
      todayIn: number;
      pending: number;
    };
    usedGoldOnHand: {
      weight: number;
      avgKarat: number;
      investedValue: number;
    };
    stockValue: {
      amount: number;
      items: number;
      weight: number;
    };
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
  repairs: {
    inProgress: number;
    awaitingCall: number;
    dueToday: number;
    overdue: number;
    unpaidBalance: number;
    unpaidCount: number;
  };
  goldSoldToday: GoldByKarat[];
  topCategory: { name: string; itemsSold: number };
  attention: AttentionItem[];
}
