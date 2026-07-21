export type CashBox = "store" | "transfer";
export type EntryDirection = "in" | "out";
export type LogEntryKind = "normal" | "correction" | "void-reversal";

export interface LogEntry {
  id: number;
  date: string;
  type: EntryDirection;
  box: CashBox;
  amount: number;
  desc: string;
  notes: string;
  cat: string;
  voided: boolean;
  entryType: LogEntryKind;
  moveGroup?: number;
  // Entries synced in from a real sale can't be corrected/voided here — that
  // would only touch this local log, not the actual sale record
  source?: "sale";
}

export interface ApiSale {
  id: string;
  serialNumber: number;
  createdDate: string;
  cashAmount: number;
}

const dateDaysAgo = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

export const TODAY = dateDaysAgo(0);

export const mapSaleToLogEntry = (sale: ApiSale, index: number): LogEntry => ({
  id: -(index + 1),
  date: new Date(sale.createdDate).toISOString().slice(0, 10),
  type: "in",
  box: "store",
  amount: sale.cashAmount,
  desc: `Sale SALE-${sale.serialNumber}`,
  notes: "Cash portion of sale",
  cat: "Sale",
  voided: false,
  entryType: "normal",
  source: "sale",
});

// Static seed data — there is no cash-management API on the backend yet for
// expenses/transfers/moves; sales come from the real GetSalesList API instead
export const INITIAL_STORE_BALANCE = 15240.5;
export const INITIAL_TRANSFER_BALANCE = 3200.0;

export const INITIAL_LOG: LogEntry[] = [
  {
    id: 1,
    date: dateDaysAgo(0),
    type: "out",
    box: "store",
    amount: 45,
    desc: "Expense: Shipping",
    notes: "FedEx shipment to supplier in Toronto",
    cat: "Shipping",
    voided: false,
    entryType: "normal",
  },
  {
    id: 2,
    date: dateDaysAgo(0),
    type: "in",
    box: "transfer",
    amount: 1500,
    desc: "Transfer: Ahmad Khalil",
    notes: "Transfer to Lebanon",
    cat: "Transfer",
    voided: false,
    entryType: "normal",
  },
  {
    id: 3,
    date: dateDaysAgo(1),
    type: "out",
    box: "store",
    amount: 1029.3,
    desc: "Refund SALE-20260414-0010",
    notes: "Quarter Lira Ring return — cash",
    cat: "Refund",
    voided: false,
    entryType: "normal",
  },
  {
    id: 4,
    date: dateDaysAgo(1),
    type: "in",
    box: "store",
    amount: 30,
    desc: "Repair payment R-000003",
    notes: "Ousama Adi — Ring resize",
    cat: "Repair",
    voided: false,
    entryType: "normal",
  },
  {
    id: 5,
    date: dateDaysAgo(1),
    type: "out",
    box: "store",
    amount: 2500,
    desc: "Expense: Owner Withdrawal",
    notes: "Owner withdrawal",
    cat: "Owner Withdrawal",
    voided: false,
    entryType: "normal",
  },
  {
    id: 6,
    date: dateDaysAgo(1),
    type: "out",
    box: "store",
    amount: 120,
    desc: "Expense: Donations",
    notes: "Mosque donation — monthly",
    cat: "Donations",
    voided: false,
    entryType: "normal",
  },
  {
    id: 7,
    date: dateDaysAgo(2),
    type: "out",
    box: "store",
    amount: 1337.15,
    desc: "Used gold purchase",
    notes: "21K ring 5.69g from Hanan Saleh",
    cat: "Used Gold",
    voided: false,
    entryType: "normal",
  },
  {
    id: 8,
    date: dateDaysAgo(2),
    type: "in",
    box: "transfer",
    amount: 800,
    desc: "Transfer: Sara Mansour",
    notes: "Transfer to Iraq",
    cat: "Transfer",
    voided: false,
    entryType: "normal",
  },
  {
    id: 9,
    date: dateDaysAgo(2),
    type: "out",
    box: "transfer",
    amount: 1100,
    desc: "Transfer sent abroad",
    notes: "Batch transfer — Lebanon",
    cat: "Transfer Out",
    voided: false,
    entryType: "normal",
  },
  {
    id: 10,
    date: dateDaysAgo(3),
    type: "out",
    box: "store",
    amount: 500,
    desc: "Expense: Salaries",
    notes: "Part-time employee — weekly",
    cat: "Salaries",
    voided: false,
    entryType: "normal",
  },
  {
    id: 11,
    date: dateDaysAgo(3),
    type: "in",
    box: "store",
    amount: 20,
    desc: "Repair payment R-000002",
    notes: "Rajaa Annouka — chain solder",
    cat: "Repair",
    voided: false,
    entryType: "normal",
  },
  {
    id: 12,
    date: dateDaysAgo(4),
    type: "out",
    box: "transfer",
    amount: 800,
    desc: "Move to store box",
    notes: "Restock store cash",
    cat: "Move",
    voided: false,
    entryType: "normal",
    moveGroup: 0,
  },
  {
    id: 13,
    date: dateDaysAgo(4),
    type: "in",
    box: "store",
    amount: 800,
    desc: "Move from transfers box",
    notes: "Restock store cash",
    cat: "Move",
    voided: false,
    entryType: "normal",
    moveGroup: 0,
  },
];

export const EXPENSE_CATEGORIES = [
  "Shipping",
  "Salaries",
  "Donations",
  "Supplies",
  "Rent",
  "Owner Withdrawal",
  "Other",
];

export const MANUAL_CASH_IN_SOURCES = [
  "Sale (cash portion)",
  "Repair payment",
  "Other",
];

export const formatCurrency = (n: number) =>
  "$" +
  Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatCurrencyShort = (n: number) =>
  "$" + Math.round(Math.abs(n));

export const formatLogDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const getTodayTotals = (log: LogEntry[]) => {
  let storeIn = 0;
  let storeOut = 0;
  let transferIn = 0;
  let transferOut = 0;

  log.forEach((l) => {
    if (l.date !== TODAY || l.voided) return;
    if (l.box === "store") {
      if (l.type === "in") storeIn += l.amount;
      else storeOut += l.amount;
    } else {
      if (l.type === "in") transferIn += l.amount;
      else transferOut += l.amount;
    }
  });

  return { storeIn, storeOut, transferIn, transferOut };
};
