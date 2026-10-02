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
  repairId: string | null;
  repairCode: string | null;
  createdByName: string | null;
  createdDate: string;
}

const SALE_CORRECTABLE_TYPES = [
  CashTransactionType.SaleCashIn,
  CashTransactionType.SalePaymentCorrectionIn,
  CashTransactionType.SalePaymentCorrectionOut,
];

export const isSaleCorrectable = (row: CashTransactionRow) =>
  !!row.saleId && SALE_CORRECTABLE_TYPES.includes(row.type);

export const getCategoryLabel = (row: CashTransactionRow) => {
  switch (row.type) {
    case CashTransactionType.Expense:
    case CashTransactionType.ManualCashIn:
      return row.category || "Other";
    case CashTransactionType.TransferIncome:
      return "Transfer";
    case CashTransactionType.MoveMoneyOut:
    case CashTransactionType.MoveMoneyIn:
      return "Move";
    case CashTransactionType.SaleCashIn:
      return "Sale";
    case CashTransactionType.SaleChangeOut:
      return "Sale change";
    case CashTransactionType.UsedGoldPurchaseOut:
      return "Used Gold";
    case CashTransactionType.ReturnCashOut:
      return "Refund";
    case CashTransactionType.RepairCashIn:
    case CashTransactionType.RepairCashOut:
      return "Repair";
    case CashTransactionType.SalePaymentCorrectionIn:
    case CashTransactionType.SalePaymentCorrectionOut:
      return "Correction";
    default:
      return "";
  }
};

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
        sub:
          (row.destination ? `Transfer to ${row.destination}` : "Transfer") +
          (row.notes ? ` — ${row.notes}` : ""),
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
    case CashTransactionType.SaleChangeOut:
      return {
        title: `Change paid — Sale #${row.saleSerialNumber}`,
        sub: row.notes || "Trade-in/exchange credit exceeded sale total",
      };
    case CashTransactionType.SalePaymentCorrectionIn:
    case CashTransactionType.SalePaymentCorrectionOut:
      return {
        title: `Payment correction — Sale #${row.saleSerialNumber}`,
        sub: row.notes || "",
      };
    case CashTransactionType.RepairCashIn:
      return {
        title: `Repair #${row.repairCode}`,
        sub: "Cash payment",
      };
    case CashTransactionType.RepairCashOut:
      return {
        title: `Repair #${row.repairCode} — payment reversed`,
        sub: row.notes || "Cash reversal",
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
