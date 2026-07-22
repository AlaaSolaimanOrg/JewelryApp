import { PaymentStatus, RepairPayMethod } from "../../../types/enums";

const MAX_SLOT_SCAN = 50;

export const getNextAvailableSlot = (occupiedSlots: number[]): number => {
  for (let i = 1; i <= MAX_SLOT_SCAN; i++) {
    if (!occupiedSlots.includes(i)) return i;
  }
  return occupiedSlots.length + 1;
};

export const payMethodToPaymentStatus = (
  method: RepairPayMethod,
): PaymentStatus =>
  method === RepairPayMethod.Unpaid ? PaymentStatus.Unpaid : PaymentStatus.Paid;

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
