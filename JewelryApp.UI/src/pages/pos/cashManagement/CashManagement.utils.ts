export const TODAY = new Date().toISOString().slice(0, 10);

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
  Math.abs(n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatCurrencyShort = (n: number) =>
  "$" + Math.round(Math.abs(n ?? 0));
