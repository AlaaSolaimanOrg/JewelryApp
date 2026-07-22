export interface Sale {
  id: string;
  serialNumber: number;
  createdDate: string;
  total: number;
  cardPayment: boolean;
  cashPayment: boolean;
  customerName: string;
}

export const getPaymentTag = (sale: Sale) => {
  if (sale.cardPayment && sale.cashPayment)
    return { label: "Split", className: "log-tag-split" };
  if (sale.cardPayment) return { label: "Card", className: "log-tag-card" };
  return { label: "Cash", className: "log-tag-cash" };
};

export const formatCurrency = (n: number) =>
  "$" +
  Math.abs(n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatLogDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
