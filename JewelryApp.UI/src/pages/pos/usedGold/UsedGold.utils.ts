import type { Seller } from "./UsedGold.type";

export const DEFAULT_KARATS = [24, 22, 21, 18, 14, 10];

export const DEFAULT_KARAT_PRICES: Record<number, number> = {
  24: 90,
  22: 82,
  21: 75,
  18: 60,
  14: 47,
  10: 33,
};

const KARAT_COLORS: Record<number, { bg: string; text: string }> = {
  24: { bg: "#d4a017", text: "#1a1a1a" },
  22: { bg: "#c9952a", text: "#1a1a1a" },
  21: { bg: "#bf8c30", text: "#1a1a1a" },
  18: { bg: "#b28535", text: "#1a1a1a" },
  14: { bg: "#a07a3b", text: "#1a1a1a" },
  10: { bg: "#8c6d3f", text: "#fff" },
  9: { bg: "#7d6340", text: "#fff" },
};

export const getKaratColor = (karat: number) => {
  if (KARAT_COLORS[karat]) return KARAT_COLORS[karat];
  if (karat >= 20) return { bg: "#c09030", text: "#1a1a1a" };
  if (karat >= 15) return { bg: "#a07a3b", text: "#1a1a1a" };
  return { bg: "#7d6340", text: "#fff" };
};

export const INITIAL_SELLERS: Seller[] = [
  { name: "Ousama Adi", phone: "3688820038" },
  { name: "Fatima Hassan", phone: "7805550192" },
  { name: "Ahmad Khalil", phone: "5875550274" },
  { name: "Sara Mansour", phone: "7805550341" },
  { name: "Hanan Saleh", phone: "7806021988" },
  { name: "Rajaa Annouka", phone: "7806802022" },
  { name: "Zainab Al Mutlak", phone: "8259833199" },
  { name: "Mariam Taha", phone: "5874490033" },
  { name: "Ali Mahmoud", phone: "5874430122" },
];

export const formatCurrency = (n: number) =>
  "$" +
  Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
