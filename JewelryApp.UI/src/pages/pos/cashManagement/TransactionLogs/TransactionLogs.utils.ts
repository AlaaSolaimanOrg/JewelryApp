import { CashBoxType, CashTransactionType } from "../../../../types/enums";

export interface CashTransactionRow {
  id: string;
  boxType: CashBoxType;
  type: CashTransactionType;
  amount: number;
  isCredit: boolean;
  category: string | null;
  customerName: string | null;
  destination: string | null;
  notes: string | null;
  saleId: string | null;
  saleSerialNumber: string | null;
  createdByName: string | null;
  createdDate: string;
}

export const getBoxTag = (row: CashTransactionRow) =>
  row.boxType === CashBoxType.Store
    ? { label: "Store", className: "log-tag-cash" }
    : { label: "Transfers", className: "log-tag-card" };

export const getDescription = (row: CashTransactionRow) => {
  switch (row.type) {
    case CashTransactionType.Expense:
      return { title: `Expense — ${row.category}`, sub: row.notes || "" };
    case CashTransactionType.ManualCashIn:
      return { title: `Manual cash in — ${row.category}`, sub: row.notes || "" };
    case CashTransactionType.TransferIncome:
      return {
        title: `Transfer income — ${row.customerName}`,
        sub: row.destination ? `To ${row.destination}` : row.notes || "",
      };
    case CashTransactionType.MoveMoneyOut:
      return {
        title: `Move to ${row.boxType === CashBoxType.Store ? "Transfers" : "Store"}`,
        sub: row.notes || "",
      };
    case CashTransactionType.MoveMoneyIn:
      return {
        title: `Move from ${row.boxType === CashBoxType.Store ? "Transfers" : "Store"}`,
        sub: row.notes || "",
      };
    case CashTransactionType.SaleCashIn:
      return {
        title: `Sale #${row.saleSerialNumber}`,
        sub: "Cash payment",
      };
    case CashTransactionType.ReturnCashOut:
      return {
        title: `Return — Sale #${row.saleSerialNumber}`,
        sub: row.notes || "Cash refund",
      };
    default:
      return { title: row.notes || "", sub: "" };
  }
};

export const formatCurrency = (n: number) =>
  "$" +
  Math.abs(n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatLogDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
