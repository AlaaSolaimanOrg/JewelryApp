import dateFormat from "dateformat";

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
    return { label: "Split", className: "dash-tag-split" };
  if (sale.cardPayment) return { label: "Card", className: "dash-tag-card" };
  return { label: "Cash", className: "dash-tag-cash" };
};

export const formatCurrency = (value: number) =>
  "$" +
  Math.abs(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const formatDateLabel = (createdDate: string) => {
  const date = new Date(createdDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return dateFormat(date, "mmm d");
};
