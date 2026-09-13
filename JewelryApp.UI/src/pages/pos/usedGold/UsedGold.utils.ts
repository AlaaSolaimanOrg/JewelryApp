export const DEFAULT_KARATS = [24, 22, 21, 18, 14, 10];

export const DEFAULT_KARAT_PRICES: Record<number, number> = {
  24: 0,
  22: 0,
  21: 0,
  18: 0,
  14: 0,
  10: 0,
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
