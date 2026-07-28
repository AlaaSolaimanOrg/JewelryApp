import type { CustomerTier } from "./CustomerSection.type";

export const getCustomerTier = (spent: number): CustomerTier => {
  if (spent >= 100000) return { name: "VIP", className: "ps-tb-vip", isVip: true };
  if (spent >= 50000) return { name: "GOLD", className: "ps-tb-gold" };
  if (spent >= 25000) return { name: "SILVER", className: "ps-tb-silver" };
  if (spent >= 8000) return { name: "BRONZE", className: "ps-tb-bronze" };
  return { name: "REGULAR", className: "ps-tb-regular" };
};

export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
