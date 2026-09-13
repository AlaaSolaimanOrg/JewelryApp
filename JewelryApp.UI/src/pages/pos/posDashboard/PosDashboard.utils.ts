export const formatCurrency = (n: number) =>
  "$" +
  (n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatCurrencyShort = (n: number) =>
  (n < 0 ? "-$" : "+$") + Math.round(Math.abs(n ?? 0)).toLocaleString("en-US");
