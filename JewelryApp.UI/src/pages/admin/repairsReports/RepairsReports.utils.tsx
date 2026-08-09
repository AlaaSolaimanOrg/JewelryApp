import type {
  AvgValueHistoryRow,
  ChartDataPoint,
  ChartResult,
  CustomerRevenueRow,
  DateRange,
  HealthMetrics,
  LongestInShopRow,
  Period,
  RepairAlert,
  RepairRecord,
  RepairStats,
  RepeatCustomerRow,
} from "./RepairsReports.type";

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const TODAY_DATE = new Date("2026-06-11");

const ACTIVE_STATUSES = ["progress", "ready", "notified"] as const;

function isActiveStatus(status: RepairRecord["status"]): boolean {
  return (ACTIVE_STATUSES as readonly string[]).includes(status);
}

/* ───────── seeded PRNG (deterministic mock data, no backend) ───────── */

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const POOL_NAMES: [string, string][] = [
  ["Hanan Saleh", "7806021988"],
  ["Ahmad Khalil", "5875550274"],
  ["Sara Mansour", "7805550341"],
  ["Ousama Adi", "3688820038"],
  ["Rajaa Annouka", "7806802022"],
  ["Zainab Al Mutlak", "8259833199"],
  ["Mariam Taha", "5874490033"],
  ["Ali Mahmoud", "5874430122"],
  ["Fatima Hassan", "7805550192"],
  ["Nisreen Sleiman", "7802990814"],
  ["Randa Rahal", "7802577602"],
  ["Nour Yamani", "5879388144"],
  ["Heba Amire", "7808818005"],
  ["Samia Farhat", "7804412963"],
  ["Rana Mayta", "5878834471"],
  ["Mohamad Houchaymi", "7809921384"],
];

const POOL_NOTES = [
  "Ring resize (weight {w})",
  "Chain solder repair",
  "Bracelet weld (weight {w})",
  "Necklace clasp replacement",
  "Earring post re-solder",
  "Polish + rhodium plate",
  "Replace spring ring clasp",
  "Pendant bail repair (weight {w})",
  "Watch battery replacement",
  "Chain solder + clean",
  "Bracelet link removal (weight {w})",
  "Stone tightening + polish",
  "Engraving inside band",
  "Earring hook replacement x2",
];

const POOL_COSTS = [
  10, 15, 15, 20, 20, 25, 25, 25, 30, 30, 30, 30, 35, 35, 40, 40, 45, 50, 60,
  80,
];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function dstr(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function createMockRepairs(): RepairRecord[] {
  const rnd = mulberry32(20260611);
  const repairs: RepairRecord[] = [];
  let idx = 1;
  let d = new Date(2025, 0, 1);

  while (d <= TODAY_DATE) {
    const r = rnd();
    const count = r < 0.15 ? 0 : r < 0.5 ? 1 : r < 0.82 ? 2 : r < 0.96 ? 3 : 4;

    for (let i = 0; i < count; i++) {
      const who = POOL_NAMES[Math.floor(rnd() * POOL_NAMES.length)];
      const note = POOL_NOTES[Math.floor(rnd() * POOL_NOTES.length)].replace(
        "{w}",
        (2 + rnd() * 20).toFixed(2),
      );
      const cost = POOL_COSTS[Math.floor(rnd() * POOL_COSTS.length)];
      const orderDate = dstr(d);
      const due = new Date(d.getTime() + 3 * 864e5);
      const ageDays = Math.round((TODAY_DATE.getTime() - d.getTime()) / 864e5);

      const rec: RepairRecord = {
        id: `R-${String(100000 + idx++).slice(1)}`,
        customer: who[0],
        phone: who[1],
        notes: note,
        cost,
        paid: true,
        status: "completed",
        orderDate,
        dueDate: dstr(due),
        pickedUpDate: null,
      };

      const roll = rnd();
      if (roll < 0.03) {
        rec.status = "cancelled";
        rec.paid = rnd() < 0.5;
      } else {
        const activeChance =
          ageDays <= 2 ? 0.9 : ageDays <= 5 ? 0.55 : ageDays <= 9 ? 0.25 : 0;
        if (rnd() < activeChance) {
          const s = rnd();
          rec.status = s < 0.5 ? "progress" : s < 0.78 ? "ready" : "notified";
          rec.paid = rnd() < 0.55;
        } else {
          const turn = 1 + Math.floor(rnd() * 4) + (rnd() < 0.15 ? 3 : 0);
          let pu = new Date(d.getTime() + turn * 864e5);
          if (pu > TODAY_DATE) pu = new Date(TODAY_DATE.getTime());
          rec.pickedUpDate = dstr(pu);
          rec.paid = rnd() < 0.95;
        }
      }
      repairs.push(rec);
    }
    d = new Date(d.getTime() + 864e5);
  }

  // Guaranteed live examples for each attention type
  repairs.push({
    id: "R-00901",
    customer: "Mariam Taha",
    phone: "5874490033",
    notes: "Necklace clasp replacement",
    cost: 25,
    paid: true,
    status: "ready",
    orderDate: "2026-06-08",
    dueDate: "2026-06-10",
    pickedUpDate: null,
  });
  repairs.push({
    id: "R-00902",
    customer: "Ahmad Khalil",
    phone: "5875550274",
    notes: "Earring post re-solder",
    cost: 15,
    paid: false,
    status: "notified",
    orderDate: "2026-06-04",
    dueDate: "2026-06-07",
    pickedUpDate: null,
  });

  return repairs;
}

export const MOCK_REPAIRS: RepairRecord[] = createMockRepairs();

/* ───────── formatting & date helpers ───────── */

export const fmtShort = (n: number): string => `$${Math.round(n)}`;

export const parseD = (s: string): Date => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const getM = (s: string): number => Number(s.split("-")[1]) - 1;
export const getY = (s: string): number => Number(s.split("-")[0]);

export const daysBetween = (a: Date, b: Date): number =>
  Math.round((b.getTime() - a.getTime()) / 864e5);

/* ───────── filtering ───────── */

export function filterByPeriod(
  repairs: RepairRecord[],
  period: Period,
  selMonth: number,
  selYear: number,
  range: DateRange | null,
): RepairRecord[] {
  if (period === "month") {
    return repairs.filter(
      (r) => getM(r.orderDate) === selMonth && getY(r.orderDate) === selYear,
    );
  }
  if (period === "year") {
    return repairs.filter((r) => getY(r.orderDate) === selYear);
  }
  if (period === "custom" && range) {
    return repairs.filter(
      (r) => r.orderDate >= range.dateFrom && r.orderDate <= range.dateTo,
    );
  }
  return repairs.slice();
}

/* ───────── stats ───────── */

export function computeStats(
  repairs: RepairRecord[],
  data: RepairRecord[],
  period: Period,
  selMonth: number,
  selYear: number,
  range: DateRange | null,
): RepairStats {
  const completed = data.filter((r) => r.status === "completed");
  const nonCancelled = data.filter((r) => r.status !== "cancelled");
  const paidRepairs = nonCancelled.filter((r) => r.paid);
  const totalRevenue = paidRepairs.reduce((s, r) => s + r.cost, 0);
  const totalAll = nonCancelled.reduce((s, r) => s + r.cost, 0);
  const unpaid = data.filter((r) => !r.paid && r.status !== "cancelled");
  const unpaidTotal = unpaid.reduce((s, r) => s + r.cost, 0);
  const completedRev = completed.reduce((s, r) => s + r.cost, 0);
  const avgVal = completed.length > 0 ? completedRev / completed.length : 0;

  const turnarounds = completed
    .filter((r) => r.pickedUpDate)
    .map((r) => daysBetween(parseD(r.orderDate), parseD(r.pickedUpDate!)));
  const avgTurn =
    turnarounds.length > 0
      ? turnarounds.reduce((a, b) => a + b, 0) / turnarounds.length
      : 0;

  let periodLabel = "All time";
  if (period === "month") periodLabel = `${MONTHS[selMonth]} ${selYear}`;
  else if (period === "year") periodLabel = `${selYear}`;
  else if (period === "custom" && range) {
    const fp = range.dateFrom.split("-");
    const tp = range.dateTo.split("-");
    periodLabel = `${MONTHS[+fp[1] - 1]} ${+fp[2]} – ${MONTHS[+tp[1] - 1]} ${+tp[2]}, ${tp[0]}`;
  }

  let prevData: RepairRecord[] | null = null;
  let prevLabel = "";
  if (period === "month") {
    let pm = selMonth - 1;
    let py = selYear;
    if (pm < 0) {
      pm = 11;
      py--;
    }
    prevData = repairs.filter(
      (r) => getM(r.orderDate) === pm && getY(r.orderDate) === py,
    );
    prevLabel = MONTHS[pm];
  } else if (period === "year") {
    prevData = repairs.filter((r) => getY(r.orderDate) === selYear - 1);
    prevLabel = `${selYear - 1}`;
  }

  let prevRepairCount: number | null = null;
  let prevRevenue: number | null = null;
  if (prevData) {
    const pnc = prevData.filter((r) => r.status !== "cancelled");
    prevRepairCount = pnc.length;
    prevRevenue = pnc.filter((r) => r.paid).reduce((s, r) => s + r.cost, 0);
  }

  return {
    repairCount: nonCancelled.length,
    prevRepairCount,
    totalRevenue,
    prevRevenue,
    paidCount: paidRepairs.length,
    totalAll,
    unpaidTotal,
    unpaidCount: unpaid.length,
    avgVal,
    avgTurn,
    periodLabel,
    prevLabel,
  };
}

/* ───────── alerts (always current, not period-filtered) ───────── */

export function computeAlerts(repairs: RepairRecord[]): RepairAlert[] {
  const allActive = repairs.filter((r) => isActiveStatus(r.status));
  const alerts: RepairAlert[] = [];

  allActive.forEach((r) => {
    const due = parseD(r.dueDate);
    const diff = daysBetween(TODAY_DATE, due);
    if (r.status === "progress" && diff < 0) {
      alerts.push({
        repairId: r.id,
        customer: r.customer,
        message: `Not repaired yet — ${Math.abs(diff)} day${Math.abs(diff) !== 1 ? "s" : ""} past due date`,
        cost: r.cost,
        priority: 100 - diff,
      });
    } else if (r.status === "ready") {
      alerts.push({
        repairId: r.id,
        customer: r.customer,
        message: "Repaired — customer not called yet",
        cost: r.cost,
        priority: 50,
      });
    } else if (r.status === "notified") {
      alerts.push({
        repairId: r.id,
        customer: r.customer,
        message: `Customer notified — not picked up yet${!r.paid ? " (unpaid)" : ""}`,
        cost: r.cost,
        priority: !r.paid ? 40 : 20,
      });
    }
  });

  return alerts.sort((a, b) => b.priority - a.priority);
}

/* ───────── revenue chart ───────── */

export function computeChart(
  completed: RepairRecord[],
  period: Period,
  selMonth: number,
  selYear: number,
  range: DateRange | null,
): ChartResult {
  const dayRevenue = (dayStr: string) =>
    completed
      .filter((r) => r.pickedUpDate === dayStr)
      .reduce((s, r) => s + r.cost, 0);

  const monthRevenue = (m: number, y: number) =>
    completed
      .filter(
        (r) =>
          r.pickedUpDate && getM(r.pickedUpDate) === m && getY(r.pickedUpDate) === y,
      )
      .reduce((s, r) => s + r.cost, 0);

  if (period === "month") {
    const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate();
    const data: ChartDataPoint[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      data.push({
        label: `${d}`,
        value: dayRevenue(`${selYear}-${pad2(selMonth + 1)}-${pad2(d)}`),
      });
    }
    return { title: `Daily revenue — ${MONTHS[selMonth]} ${selYear}`, data };
  }

  if (period === "year") {
    const data: ChartDataPoint[] = [];
    for (let m = 0; m < 12; m++) {
      data.push({ label: MONTHS[m], value: monthRevenue(m, selYear) });
    }
    return { title: `Monthly revenue — ${selYear}`, data };
  }

  if (period === "custom" && range) {
    const fd = parseD(range.dateFrom);
    const td = parseD(range.dateTo);
    const span = daysBetween(fd, td) + 1;
    const fp = range.dateFrom.split("-");
    const tp = range.dateTo.split("-");
    const periodLabel = `${MONTHS[+fp[1] - 1]} ${+fp[2]} – ${MONTHS[+tp[1] - 1]} ${+tp[2]}, ${tp[0]}`;

    if (span <= 31) {
      const data: ChartDataPoint[] = [];
      for (let i = 0; i < span; i++) {
        const dd = new Date(fd.getTime() + i * 864e5);
        const ds = dstr(dd);
        const showLabel = span <= 14 || i % 5 === 0 || i === span - 1;
        data.push({
          label: showLabel ? `${dd.getMonth() + 1}/${dd.getDate()}` : "",
          value: dayRevenue(ds),
        });
      }
      return { title: `Daily revenue — ${periodLabel}`, data };
    }

    const data: ChartDataPoint[] = [];
    let cur = new Date(fd.getFullYear(), fd.getMonth(), 1);
    while (cur <= td) {
      const mm = cur.getMonth();
      const yy = cur.getFullYear();
      data.push({
        label: `${MONTHS[mm]} ${String(yy).slice(2)}`,
        value: monthRevenue(mm, yy),
      });
      cur = new Date(yy, mm + 1, 1);
    }
    return { title: `Monthly revenue — ${periodLabel}`, data };
  }

  const years: Record<number, number> = {};
  completed.forEach((r) => {
    if (r.pickedUpDate) {
      const y = getY(r.pickedUpDate);
      years[y] = (years[y] || 0) + r.cost;
    }
  });
  const data = Object.keys(years)
    .sort()
    .map((y) => ({ label: y, value: years[+y] }));
  return { title: "Yearly revenue — all time", data };
}

/* ───────── health metrics ───────── */

export function computeHealth(
  data: RepairRecord[],
  completed: RepairRecord[],
  cancelled: RepairRecord[],
): HealthMetrics {
  const onTime = completed.filter(
    (r) => r.pickedUpDate && parseD(r.pickedUpDate) <= parseD(r.dueDate),
  ).length;
  const onTimeRate =
    completed.length > 0 ? Math.round((onTime / completed.length) * 100) : 0;
  const prePaid = completed.filter((r) => r.paid).length;
  const collectRate =
    completed.length > 0
      ? Math.round((prePaid / completed.length) * 100)
      : 0;
  const cancelRate =
    data.length > 0 ? Math.round((cancelled.length / data.length) * 100) : 0;

  return {
    onTimeRate,
    onTimeCount: onTime,
    collectRate,
    cancelRate,
    cancelCount: cancelled.length,
    completedCount: completed.length,
    totalCount: data.length,
  };
}

/* ───────── revenue by customer (searchable) ───────── */

export function computeCustomerRevenue(
  data: RepairRecord[],
  search: string,
): CustomerRevenueRow[] {
  const map: Record<string, { revenue: number; count: number }> = {};
  data
    .filter((r) => r.status !== "cancelled")
    .forEach((r) => {
      if (!map[r.customer]) map[r.customer] = { revenue: 0, count: 0 };
      if (r.status === "completed") map[r.customer].revenue += r.cost;
      map[r.customer].count++;
    });

  let list = Object.keys(map).map((name) => ({
    name,
    revenue: map[name].revenue,
    count: map[name].count,
  }));
  list.sort((a, b) => b.revenue - a.revenue);

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(q));
  }
  return list;
}

/* ───────── avg repair value history (monthly, all-time) ───────── */

export function computeAvgHistory(repairs: RepairRecord[]): AvgValueHistoryRow[] {
  const rows: AvgValueHistoryRow[] = [];
  const years = [2025, 2026];
  years.forEach((yr) => {
    for (let m = 0; m < 12; m++) {
      const mc = repairs.filter(
        (r) =>
          r.status === "completed" &&
          r.pickedUpDate &&
          getM(r.pickedUpDate) === m &&
          getY(r.pickedUpDate) === yr,
      );
      if (mc.length > 0) {
        const rev = mc.reduce((s, r) => s + r.cost, 0);
        rows.push({
          label: `${MONTHS[m]} ${yr}`,
          avg: rev / mc.length,
          count: mc.length,
          total: rev,
        });
      }
    }
  });
  return rows.reverse();
}

/* ───────── repeat customers (all-time, always) ───────── */

export function computeRepeatCustomers(repairs: RepairRecord[]): RepeatCustomerRow[] {
  const map: Record<string, number> = {};
  repairs
    .filter((r) => r.status !== "cancelled")
    .forEach((r) => {
      map[r.customer] = (map[r.customer] || 0) + 1;
    });
  return Object.keys(map)
    .map((name) => ({ name, count: map[name] }))
    .sort((a, b) => b.count - a.count);
}

/* ───────── longest in shop (active only, always current) ───────── */

export function computeLongestInShop(repairs: RepairRecord[]): LongestInShopRow[] {
  const active = repairs.filter((r) => isActiveStatus(r.status));
  active.sort(
    (a, b) => parseD(a.orderDate).getTime() - parseD(b.orderDate).getTime(),
  );
  return active.map((r) => ({
    id: r.id,
    customer: r.customer,
    days: daysBetween(parseD(r.orderDate), TODAY_DATE),
  }));
}
