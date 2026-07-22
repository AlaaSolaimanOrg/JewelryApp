const dateDaysAgo = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

export const TODAY = dateDaysAgo(0);

// Static mock data — there is no cash-management API on the backend yet
export const INITIAL_STORE_BALANCE = 15240.5;
export const INITIAL_TRANSFER_BALANCE = 3200.0;

export const STATIC_TODAY_TOTALS = {
  storeIn: 1850,
  storeOut: 675,
  transferIn: 2300,
  transferOut: 1100,
};

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
