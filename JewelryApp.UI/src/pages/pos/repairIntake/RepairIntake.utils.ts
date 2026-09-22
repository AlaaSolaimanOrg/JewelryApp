import { PaymentStatus, RepairPayMethod } from "../../../types/enums";

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

export const formatAmountInput = (n: number) => String(Math.round(n * 100) / 100);

export const formatPhone =(phone: string) => {
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
