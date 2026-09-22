import { PaymentStatus, RepairStatus } from "../../../types/enums";
import type { Repair, RepairBoardStatus } from "./RepairOrders.type";

const STATUS_MAP: Record<RepairStatus, RepairBoardStatus> = {
  [RepairStatus.InProgress]: "progress",
  [RepairStatus.Completed]: "done",
  [RepairStatus.PickedUp]: "completed",
  [RepairStatus.Cancelled]: "cancelled",
};

export const mapRepairDtoToRepair = (dto: any): Repair => ({
  id: dto.id,
  repairCode: dto.repairCode,
  slotNumber: dto.slotNumber ?? null,
  customerId: dto.customerId,
  customerName: dto.customerName,
  customerPhone: dto.customerPhone,
  notes: dto.notes ?? "",
  cost: dto.cost ?? 0,
  paid: dto.paymentStatus === PaymentStatus.Paid,
  payMethod: dto.payMethod ?? "",
  status: STATUS_MAP[dto.status as RepairStatus] ?? "progress",
  notified: !!dto.notified,
  dueDate: dto.dueDate ?? "",
  orderDate: dto.orderDate ?? "",
  notifiedDate: dto.notifiedDate ?? null,
  pickedUpDate: dto.pickedUpDate ?? null,
  cancelledDate: dto.cancelledDate ?? null,
});

export const formatCurrency = (n: number) =>
  "$" +
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const startOfDay = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export const daysBetween = (a: Date, b: Date) =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000);

const toIsoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const todayIso = () => toIsoDate(new Date());

export const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export interface DueBadgeInfo {
  label: string;
  className: "overdue" | "today" | "upcoming";
}

export const getDueBadge = (dueDate: string): DueBadgeInfo => {
  const diff = daysBetween(new Date(), new Date(dueDate));
  if (diff < 0) {
    const days = Math.abs(diff);
    return { label: `Overdue ${days} day${days !== 1 ? "s" : ""}`, className: "overdue" };
  }
  if (diff === 0) return { label: "Due today", className: "today" };
  if (diff === 1) return { label: "Due tomorrow", className: "upcoming" };
  return { label: `Due ${formatDate(dueDate)}`, className: "upcoming" };
};

export const getStatusLabel = (status: RepairBoardStatus, notified: boolean) => {
  switch (status) {
    case "progress":
      return "In progress";
    case "done":
      return notified ? "Done — customer notified" : "Done — awaiting call";
    case "completed":
      return "Picked up";
    case "cancelled":
      return "Cancelled";
  }
};

export const getStatusColor = (status: RepairBoardStatus) => {
  switch (status) {
    case "progress":
      return "var(--pos-amber)";
    case "done":
    case "completed":
      return "var(--pos-green)";
    case "cancelled":
      return "var(--pos-red)";
  }
};

