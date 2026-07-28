import type { PastTransaction, SelectedExchangeItem } from "./ExchangeSection.type";

export const PAST_TRANSACTIONS: PastTransaction[] = [
  {
    id: "SALE-20260523-0026",
    date: "May 23, 2026",
    customer: "Ousama Adi",
    phone: "3688820038",
    desc: "Star Earrings, Heart Earrings",
    items: [
      { name: "Star Earrings", karat: 21, weight: "1.71g", sku: "ER260346", unitPrice: 401.85, qty: 1 },
      { name: "Heart Earrings", karat: 21, weight: "3.75g", sku: "ER260345", unitPrice: 881.25, qty: 2 },
      { name: "Dangling Earrings", karat: 21, weight: "2.49g", sku: "ER260343", unitPrice: 585.15, qty: 1 },
    ],
  },
  {
    id: "SALE-20260522-0024",
    date: "May 22, 2026",
    customer: "Sara Mansour",
    phone: "7805550341",
    desc: "Quarter Lira Ring, Sonbli Bracelet",
    items: [
      { name: "Quarter Lira Ring", karat: 21, weight: "3.78g", sku: "RG260482", unitPrice: 888.30, qty: 1 },
      { name: "Sonbli Bracelet", karat: 18, weight: "11.29g", sku: "BC260222", unitPrice: 2314.45, qty: 1 },
    ],
  },
  {
    id: "SALE-20260521-0023",
    date: "May 21, 2026",
    customer: "Ahmad Khalil",
    phone: "5875550274",
    desc: "Hexagon Bracelet, Half Lira Ring",
    items: [
      { name: "Hexagon Bracelet", karat: 18, weight: "17.24g", sku: "BC260218", unitPrice: 3534.20, qty: 1 },
      { name: "Half Lira Ring", karat: 21, weight: "5.02g", sku: "RG260483", unitPrice: 1179.70, qty: 1 },
    ],
  },
  {
    id: "SALE-20260518-0008",
    date: "May 18, 2026",
    customer: "Fatima Hassan",
    phone: "7805550192",
    desc: "Flower Earrings, Earrings",
    items: [
      { name: "Flower Earrings", karat: 21, weight: "4.08g", sku: "ER260339", unitPrice: 958.80, qty: 1 },
      { name: "Earrings", karat: 21, weight: "1.56g", sku: "ER260341", unitPrice: 366.60, qty: 1 },
    ],
  },
];

export const searchPastTransactions = (query: string): PastTransaction[] => {
  const q = query.toLowerCase();
  const phone = query.replace(/[^0-9]/g, "");
  return PAST_TRANSACTIONS.filter(
    (t) =>
      t.customer.toLowerCase().includes(q) ||
      (phone.length > 0 && t.phone.includes(phone)) ||
      t.id.toLowerCase().includes(q),
  );
};

export const getTransactionTotal = (t: PastTransaction) =>
  t.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

export const getExchangeTotal = (items: SelectedExchangeItem[]) =>
  items.reduce((sum, i) => sum + i.unitPrice * i.returnQty, 0);
