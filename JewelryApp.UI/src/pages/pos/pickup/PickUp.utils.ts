import type { Repair, RepairBoardStatus } from "./PickUp.type";

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

const addDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toIsoDate(d);
};

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

export const matchesSearch = (repair: Repair, query: string) => {
  if (!query.trim()) return true;
  const q = query.toLowerCase().trim();
  const phoneDigits = q.replace(/\D/g, "");
  return (
    repair.customerName.toLowerCase().includes(q) ||
    (phoneDigits.length > 0 && repair.customerPhone.includes(phoneDigits)) ||
    repair.repairCode.toLowerCase().includes(q)
  );
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

export const INITIAL_REPAIRS: Repair[] = [
  {
    id: "R-000008",
    repairCode: "R-000008",
    slotNumber: 8,
    customerName: "Hanan Saleh",
    customerPhone: "7806021988",
    notes: "Ring to size 7 (weight 6.34)\nPolish + rhodium plate",
    cost: 45,
    paid: false,
    payMethod: "",
    status: "progress",
    notified: false,
    dueDate: addDays(0),
    orderDate: addDays(-3),
    notifiedDate: null,
    pickedUpDate: null,
    cancelledDate: null,
  },
  {
    id: "R-000007",
    repairCode: "R-000007",
    slotNumber: 7,
    customerName: "Mariam Taha",
    customerPhone: "5874490033",
    notes: "Necklace clasp replacement",
    cost: 25,
    paid: true,
    payMethod: "Cash",
    status: "progress",
    notified: false,
    dueDate: addDays(1),
    orderDate: addDays(-4),
    notifiedDate: null,
    pickedUpDate: null,
    cancelledDate: null,
  },
  {
    id: "R-000006",
    repairCode: "R-000006",
    slotNumber: 6,
    customerName: "Ahmad Khalil",
    customerPhone: "5875550274",
    notes: "Earring post re-solder\nClean both earrings",
    cost: 15,
    paid: false,
    payMethod: "",
    status: "done",
    notified: true,
    dueDate: addDays(-5),
    orderDate: addDays(-8),
    notifiedDate: addDays(-5),
    pickedUpDate: null,
    cancelledDate: null,
  },
  {
    id: "R-000005",
    repairCode: "R-000005",
    slotNumber: 5,
    customerName: "Sara Mansour",
    customerPhone: "7805550341",
    notes: "Pendant bail repair (weight 8.1)",
    cost: 25,
    paid: true,
    payMethod: "Card",
    status: "done",
    notified: true,
    dueDate: addDays(-4),
    orderDate: addDays(-7),
    notifiedDate: addDays(-2),
    pickedUpDate: null,
    cancelledDate: null,
  },
  {
    id: "R-000004",
    repairCode: "R-000004",
    slotNumber: 4,
    customerName: "Ousama Adi",
    customerPhone: "3688820038",
    notes: "Weld bracelet (weight 14.8)\nReplace spring ring clasp",
    cost: 40,
    paid: false,
    payMethod: "",
    status: "progress",
    notified: false,
    dueDate: addDays(-2),
    orderDate: addDays(-5),
    notifiedDate: null,
    pickedUpDate: null,
    cancelledDate: null,
  },
  {
    id: "R-000003",
    repairCode: "R-000003",
    slotNumber: 3,
    customerName: "Ousama Adi",
    customerPhone: "3688820038",
    notes: "Ring to size 9 (weight 4.12)",
    cost: 30,
    paid: true,
    payMethod: "Cash",
    status: "done",
    notified: false,
    dueDate: addDays(-2),
    orderDate: addDays(-5),
    notifiedDate: null,
    pickedUpDate: null,
    cancelledDate: null,
  },
  {
    id: "R-000002",
    repairCode: "R-000002",
    slotNumber: 2,
    customerName: "Rajaa Annouka",
    customerPhone: "7806802022",
    notes: "Chain solder + replace spring ring",
    cost: 20,
    paid: false,
    payMethod: "",
    status: "progress",
    notified: false,
    dueDate: addDays(-4),
    orderDate: addDays(-6),
    notifiedDate: null,
    pickedUpDate: null,
    cancelledDate: null,
  },
  {
    id: "R-000001",
    repairCode: "R-000001",
    slotNumber: null,
    customerName: "Zainab Al Mutlak",
    customerPhone: "8259833199",
    notes: "Resize engagement ring (weight 3.2)",
    cost: 30,
    paid: true,
    payMethod: "Cash",
    status: "completed",
    notified: true,
    dueDate: addDays(-5),
    orderDate: addDays(-7),
    notifiedDate: addDays(-5),
    pickedUpDate: addDays(-4),
    cancelledDate: null,
  },
  {
    id: "R-000009",
    repairCode: "R-000009",
    slotNumber: null,
    customerName: "Fatima Hassan",
    customerPhone: "7805550192",
    notes: "Bracelet link removal (weight 22.4)",
    cost: 20,
    paid: true,
    payMethod: "Card",
    status: "completed",
    notified: true,
    dueDate: addDays(-8),
    orderDate: addDays(-10),
    notifiedDate: addDays(-8),
    pickedUpDate: addDays(-7),
    cancelledDate: null,
  },
  {
    id: "R-000010",
    repairCode: "R-000010",
    slotNumber: null,
    customerName: "Ali Mahmoud",
    customerPhone: "5874430122",
    notes: "Watch battery replacement",
    cost: 15,
    paid: true,
    payMethod: "Cash",
    status: "completed",
    notified: true,
    dueDate: addDays(-9),
    orderDate: addDays(-9),
    notifiedDate: addDays(-9),
    pickedUpDate: addDays(-9),
    cancelledDate: null,
  },
  {
    id: "R-000011",
    repairCode: "R-000011",
    slotNumber: null,
    customerName: "Hanan Saleh",
    customerPhone: "7806021988",
    notes: "Chain solder repair",
    cost: 20,
    paid: true,
    payMethod: "Cash",
    status: "cancelled",
    notified: false,
    dueDate: addDays(-7),
    orderDate: addDays(-9),
    notifiedDate: null,
    pickedUpDate: null,
    cancelledDate: addDays(-8),
  },
];
