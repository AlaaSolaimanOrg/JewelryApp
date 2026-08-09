import type {
  AtRiskCustomer,
  CustomerReportRow,
  CustomerTier,
  DateRange,
  Period,
  PeriodData,
} from "./CustomersReports.type";

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

export const fmtCurrency = (value: number): string =>
  `$${Math.round(value).toLocaleString()}`;

export const fmtCurrencyPrecise = (value: number): string =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/* ───────── per-period mock data (mirrors the store's real activity shape) ───────── */

const CUST_TODAY: CustomerReportRow[] = [
  { name: "Hanan Saleh", phone: "780-602-1988", purchases: 3, items: 4, spent: 9840, avgDiscount: 1.2, since: "2024", lastPurchase: "Today" },
  { name: "Ahmad Khalil", phone: "587-555-0274", purchases: 1, items: 2, spent: 5459, avgDiscount: 0, since: "2023", lastPurchase: "Today" },
  { name: "Sara Mansour", phone: "780-555-0341", purchases: 2, items: 2, spent: 4893, avgDiscount: 2.1, since: "2025", lastPurchase: "Today" },
  { name: "Samia Farhat", phone: "780-441-2963", purchases: 2, items: 3, spent: 4200, avgDiscount: 0, since: "2026", lastPurchase: "Today" },
  { name: "Mariam Taha", phone: "587-449-0033", purchases: 1, items: 1, spent: 3293, avgDiscount: 0.5, since: "2024", lastPurchase: "Today" },
];

const CUST_WEEK: CustomerReportRow[] = [
  { name: "Rajaa Annouka", phone: "780-680-2022", purchases: 4, items: 6, spent: 28400, avgDiscount: 1.8, since: "2023", lastPurchase: "2 days ago" },
  { name: "Hanan Saleh", phone: "780-602-1988", purchases: 5, items: 7, spent: 22180, avgDiscount: 1.2, since: "2024", lastPurchase: "Today" },
  { name: "Zainab Al Mutlak", phone: "825-983-3199", purchases: 2, items: 4, spent: 18920, avgDiscount: 2.4, since: "2022", lastPurchase: "3 days ago" },
  { name: "Ahmad Khalil", phone: "587-555-0274", purchases: 3, items: 3, spent: 15630, avgDiscount: 0.4, since: "2023", lastPurchase: "Today" },
  { name: "Fatima Hassan", phone: "780-555-0192", purchases: 4, items: 5, spent: 14210, avgDiscount: 1.0, since: "2025", lastPurchase: "Yesterday" },
];

const CUST_MONTH: CustomerReportRow[] = [
  { name: "Zainab Al Mutlak", phone: "825-983-3199", purchases: 8, items: 13, spent: 84200, avgDiscount: 2.6, since: "2022", lastPurchase: "3 days ago" },
  { name: "Rajaa Annouka", phone: "780-680-2022", purchases: 11, items: 15, spent: 71800, avgDiscount: 1.9, since: "2023", lastPurchase: "2 days ago" },
  { name: "Hanan Saleh", phone: "780-602-1988", purchases: 14, items: 18, spent: 65300, avgDiscount: 1.4, since: "2024", lastPurchase: "Today" },
  { name: "Ali Mahmoud", phone: "587-443-0122", purchases: 6, items: 8, spent: 48900, avgDiscount: 0.8, since: "2023", lastPurchase: "1 week ago" },
  { name: "Sara Mansour", phone: "780-555-0341", purchases: 9, items: 11, spent: 44100, avgDiscount: 1.1, since: "2025", lastPurchase: "Today" },
  { name: "Ousama Adi", phone: "368-882-0038", purchases: 5, items: 7, spent: 38200, avgDiscount: 0.3, since: "2023", lastPurchase: "4 days ago" },
  { name: "Nour Yamani", phone: "587-938-8144", purchases: 4, items: 5, spent: 29800, avgDiscount: 1.6, since: "2026", lastPurchase: "1 week ago" },
  { name: "Mariam Taha", phone: "587-449-0033", purchases: 7, items: 9, spent: 26400, avgDiscount: 1.3, since: "2024", lastPurchase: "2 days ago" },
  { name: "Layla Hamdan", phone: "780-228-4471", purchases: 2, items: 3, spent: 24800, avgDiscount: 2.7, since: "2021", lastPurchase: "1 week ago" },
  { name: "Fatima Hassan", phone: "780-555-0192", purchases: 6, items: 8, spent: 23100, avgDiscount: 0.9, since: "2025", lastPurchase: "Yesterday" },
  { name: "Samia Farhat", phone: "780-441-2963", purchases: 5, items: 7, spent: 21600, avgDiscount: 0.6, since: "2026", lastPurchase: "Today" },
  { name: "Ahmad Khalil", phone: "587-555-0274", purchases: 4, items: 5, spent: 19800, avgDiscount: 0.7, since: "2023", lastPurchase: "Today" },
  { name: "Heba Amire", phone: "780-881-8005", purchases: 3, items: 4, spent: 17200, avgDiscount: 1.5, since: "2024", lastPurchase: "5 days ago" },
  { name: "Randa Rahal", phone: "780-257-7602", purchases: 4, items: 4, spent: 15900, avgDiscount: 1.0, since: "2023", lastPurchase: "1 week ago" },
  { name: "Rana Mayta", phone: "587-883-4471", purchases: 3, items: 3, spent: 14100, avgDiscount: 0.4, since: "2025", lastPurchase: "3 days ago" },
  { name: "Nisreen Sleiman", phone: "780-299-0814", purchases: 2, items: 3, spent: 12400, avgDiscount: 0.8, since: "2024", lastPurchase: "1 week ago" },
  { name: "Mohamad Houchaymi", phone: "780-992-1384", purchases: 3, items: 4, spent: 11800, avgDiscount: 1.2, since: "2023", lastPurchase: "4 days ago" },
  { name: "Khaled Nasser", phone: "587-330-1182", purchases: 1, items: 1, spent: 9600, avgDiscount: 2.1, since: "2022", lastPurchase: "2 weeks ago" },
  { name: "Maya Khalifeh", phone: "780-664-2210", purchases: 2, items: 2, spent: 8400, avgDiscount: 0.5, since: "2025", lastPurchase: "1 week ago" },
];

const CUST_YEAR: CustomerReportRow[] = [
  { name: "Zainab Al Mutlak", phone: "825-983-3199", purchases: 34, items: 52, spent: 312400, avgDiscount: 2.5, since: "2022", lastPurchase: "3 days ago" },
  { name: "Rajaa Annouka", phone: "780-680-2022", purchases: 48, items: 61, spent: 288700, avgDiscount: 2.0, since: "2023", lastPurchase: "2 days ago" },
  { name: "Hanan Saleh", phone: "780-602-1988", purchases: 52, items: 64, spent: 241900, avgDiscount: 1.5, since: "2024", lastPurchase: "Today" },
  { name: "Ahmad Khalil", phone: "587-555-0274", purchases: 29, items: 35, spent: 198400, avgDiscount: 0.9, since: "2023", lastPurchase: "Today" },
  { name: "Ali Mahmoud", phone: "587-443-0122", purchases: 22, items: 27, spent: 176200, avgDiscount: 0.7, since: "2023", lastPurchase: "1 week ago" },
  { name: "Layla Hamdan", phone: "780-228-4471", purchases: 9, items: 14, spent: 84200, avgDiscount: 2.9, since: "2021", lastPurchase: "142 days ago" },
  { name: "Khaled Nasser", phone: "587-330-1182", purchases: 7, items: 9, spent: 61800, avgDiscount: 2.2, since: "2022", lastPurchase: "118 days ago" },
  { name: "Sara Mansour", phone: "780-555-0341", purchases: 24, items: 31, spent: 164800, avgDiscount: 1.2, since: "2025", lastPurchase: "Today" },
  { name: "Ousama Adi", phone: "368-882-0038", purchases: 18, items: 22, spent: 148200, avgDiscount: 0.3, since: "2023", lastPurchase: "4 days ago" },
  { name: "Fatima Hassan", phone: "780-555-0192", purchases: 21, items: 26, spent: 131500, avgDiscount: 1.0, since: "2025", lastPurchase: "Yesterday" },
  { name: "Mariam Taha", phone: "587-449-0033", purchases: 19, items: 24, spent: 118900, avgDiscount: 1.4, since: "2024", lastPurchase: "2 days ago" },
  { name: "Samer Khoury", phone: "587-204-9921", purchases: 8, items: 12, spent: 52100, avgDiscount: 1.7, since: "2022", lastPurchase: "104 days ago" },
  { name: "Nadia Chami", phone: "780-573-3308", purchases: 7, items: 10, spent: 48700, avgDiscount: 1.9, since: "2023", lastPurchase: "96 days ago" },
  { name: "Hassan Fakih", phone: "780-415-6620", purchases: 6, items: 8, spent: 34800, avgDiscount: 1.1, since: "2024", lastPurchase: "93 days ago" },
  { name: "Samia Farhat", phone: "780-441-2963", purchases: 12, items: 16, spent: 31200, avgDiscount: 0.6, since: "2026", lastPurchase: "Today" },
];

const CUST_ALL: CustomerReportRow[] = [
  { name: "Zainab Al Mutlak", phone: "825-983-3199", purchases: 96, items: 142, spent: 824100, avgDiscount: 2.4, since: "2022", lastPurchase: "3 days ago" },
  { name: "Rajaa Annouka", phone: "780-680-2022", purchases: 131, items: 168, spent: 761300, avgDiscount: 1.8, since: "2023", lastPurchase: "2 days ago" },
  { name: "Hanan Saleh", phone: "780-602-1988", purchases: 142, items: 177, spent: 638200, avgDiscount: 1.3, since: "2024", lastPurchase: "Today" },
  { name: "Ousama Adi", phone: "368-882-0038", purchases: 88, items: 104, spent: 540800, avgDiscount: 0.4, since: "2023", lastPurchase: "4 days ago" },
  { name: "Ahmad Khalil", phone: "587-555-0274", purchases: 74, items: 89, spent: 498200, avgDiscount: 0.8, since: "2023", lastPurchase: "Today" },
  { name: "Layla Hamdan", phone: "780-228-4471", purchases: 18, items: 26, spent: 84200, avgDiscount: 2.9, since: "2021", lastPurchase: "142 days ago" },
  { name: "Fatima Hassan", phone: "780-555-0192", purchases: 61, items: 72, spent: 402800, avgDiscount: 1.0, since: "2025", lastPurchase: "Yesterday" },
  { name: "Ali Mahmoud", phone: "587-443-0122", purchases: 58, items: 71, spent: 376200, avgDiscount: 0.7, since: "2023", lastPurchase: "1 week ago" },
  { name: "Sara Mansour", phone: "780-555-0341", purchases: 49, items: 62, spent: 341900, avgDiscount: 1.1, since: "2025", lastPurchase: "Today" },
  { name: "Mariam Taha", phone: "587-449-0033", purchases: 64, items: 79, spent: 318400, avgDiscount: 1.3, since: "2024", lastPurchase: "2 days ago" },
  { name: "Walid Karam", phone: "780-118-3349", purchases: 22, items: 31, spent: 134600, avgDiscount: 1.6, since: "2022", lastPurchase: "3 weeks ago" },
  { name: "Ali Saab", phone: "587-728-1190", purchases: 14, items: 17, spent: 76800, avgDiscount: 0.9, since: "2023", lastPurchase: "1 month ago" },
  { name: "Sahar Kassem", phone: "780-339-5128", purchases: 7, items: 11, spent: 48600, avgDiscount: 1.8, since: "2024", lastPurchase: "2 months ago" },
  { name: "Joseph Haddad", phone: "587-661-0237", purchases: 15, items: 19, spent: 47200, avgDiscount: 0.5, since: "2022", lastPurchase: "2 weeks ago" },
];

export const MOCK_PERIOD_DATA: Record<Exclude<Period, "custom">, PeriodData> = {
  today: {
    active: 29,
    newCustomers: 7,
    revenue: 68425,
    newRevenue: 9420,
    returningRevenue: 59005,
    avgDiscount: 0.9,
    chart: [
      { label: "9am", value: 1 },
      { label: "10am", value: 2 },
      { label: "11am", value: 1 },
      { label: "12pm", value: 0 },
      { label: "1pm", value: 1 },
      { label: "2pm", value: 0 },
      { label: "3pm", value: 1 },
      { label: "4pm", value: 1 },
      { label: "5pm", value: 0 },
    ],
    customers: CUST_TODAY,
  },
  week: {
    active: 148,
    newCustomers: 31,
    revenue: 412350,
    newRevenue: 64200,
    returningRevenue: 348150,
    avgDiscount: 1.1,
    chart: [
      { label: "Mon", value: 4 },
      { label: "Tue", value: 3 },
      { label: "Wed", value: 6 },
      { label: "Thu", value: 5 },
      { label: "Fri", value: 7 },
      { label: "Sat", value: 5 },
      { label: "Sun", value: 1 },
    ],
    customers: CUST_WEEK,
  },
  month: {
    active: 512,
    newCustomers: 118,
    revenue: 1842300,
    newRevenue: 286400,
    returningRevenue: 1555900,
    avgDiscount: 1.2,
    chart: [
      { label: "Week 1", value: 32 },
      { label: "Week 2", value: 29 },
      { label: "Week 3", value: 31 },
      { label: "Week 4", value: 26 },
    ],
    customers: CUST_MONTH,
  },
  year: {
    active: 1182,
    newCustomers: 118,
    revenue: 9418200,
    newRevenue: 1218400,
    returningRevenue: 8199800,
    avgDiscount: 1.3,
    chart: [
      { label: "Jan", value: 84 },
      { label: "Feb", value: 71 },
      { label: "Mar", value: 96 },
      { label: "Apr", value: 88 },
      { label: "May", value: 92 },
      { label: "Jun", value: 118 },
    ],
    customers: CUST_YEAR,
  },
  all: {
    active: 1394,
    newCustomers: 1394,
    revenue: 24831500,
    newRevenue: 24831500,
    returningRevenue: 0,
    avgDiscount: 1.4,
    chart: [
      { label: "2023", value: 312 },
      { label: "2024", value: 428 },
      { label: "2025", value: 536 },
      { label: "2026", value: 118 },
    ],
    customers: CUST_ALL,
  },
};

/* ───────── custom date range (scaled off the monthly baseline, seeded) ───────── */

function seededDailyValue(i: number): number {
  const x = Math.sin(i * 91.7 + 13.3) * 10000;
  return Math.floor(Math.abs(x - Math.floor(x)) * 6);
}

export function computeCustomRange(
  range: DateRange,
): { data: PeriodData; label: string } {
  const fd = new Date(`${range.dateFrom}T12:00:00`);
  const td = new Date(`${range.dateTo}T12:00:00`);
  const [from, to] = td < fd ? [td, fd] : [fd, td];

  const days = Math.round((to.getTime() - from.getTime()) / 864e5) + 1;
  const ratio = days / 30;
  const m = MOCK_PERIOD_DATA.month;
  const scale = (n: number) => Math.max(0, Math.round(n * ratio));

  const chart: PeriodData["chart"] = [];
  const step = days > 31 ? Math.ceil(days / 31) : 1;
  const fromDayIndex = Math.round(from.getTime() / 864e5);
  for (let i = 0; i < days; i += step) {
    const d = new Date(from.getTime() + i * 864e5);
    let v = 0;
    for (let j = 0; j < step && i + j < days; j++) {
      v += seededDailyValue(fromDayIndex + i + j);
    }
    chart.push({
      label: days <= 14 || i % 5 === 0 ? `${d.getMonth() + 1}/${d.getDate()}` : "",
      value: v,
    });
  }

  const data: PeriodData = {
    active: scale(m.active),
    newCustomers: chart.reduce((sum, c) => sum + c.value, 0),
    revenue: scale(m.revenue),
    newRevenue: scale(m.newRevenue),
    returningRevenue: scale(m.returningRevenue),
    avgDiscount: m.avgDiscount,
    chart,
    customers: m.customers,
  };

  const label = `${MONTHS[from.getMonth()]} ${from.getDate()} – ${MONTHS[to.getMonth()]} ${to.getDate()}, ${to.getFullYear()}`;

  return { data, label };
}

/* ───────── customer base (not period-filtered) ───────── */

export const BASE_STATS = {
  totalCustomers: 1394,
  newThisYear: 118,
  repeatRate: 41,
  repeatCount: 571,
  avgLifetimeValue: 17815,
  goingQuiet: 23,
};

export function buildCustomerRows(
  customers: CustomerReportRow[],
  search: string,
): CustomerReportRow[] {
  const q = search.trim().toLowerCase();
  if (!q) return customers;
  const qDigits = q.replace(/\D/g, "");
  return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (qDigits.length > 0 && c.phone.replace(/\D/g, "").includes(qDigits)),
  );
}

export const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
  year: "This year",
  all: "All time",
  custom: "Custom range",
};

/* ───────── customer tiers (thresholds match the Customers page tier pills) ───────── */

export const TIERS: CustomerTier[] = [
  {
    name: "VIP",
    minLabel: "$100K+",
    color: "var(--admin-gold)",
    bg: "var(--admin-gold-bg)",
    count: 7,
    total: 2800000,
    members: [
      { name: "Zainab Al Mutlak", spent: 824100, purchases: 96 },
      { name: "Rajaa Annouka", spent: 761300, purchases: 131 },
      { name: "Hanan Saleh", spent: 638200, purchases: 142 },
      { name: "Ousama Adi", spent: 540800, purchases: 88 },
      { name: "Ahmad Khalil", spent: 498200, purchases: 74 },
      { name: "Fatima Hassan", spent: 402800, purchases: 61 },
      { name: "Walid Karam", spent: 134600, purchases: 22 },
    ],
  },
  {
    name: "GOLD",
    minLabel: "$50K+",
    color: "var(--admin-amber)",
    bg: "rgba(230, 162, 60, 0.12)",
    count: 31,
    total: 3900000,
    members: [
      { name: "Layla Hamdan", spent: 84200, purchases: 18 },
      { name: "Ali Mahmoud", spent: 76200, purchases: 22 },
      { name: "Sara Mansour", spent: 71400, purchases: 9 },
      { name: "Khaled Nasser", spent: 61800, purchases: 12 },
      { name: "Mariam Taha", spent: 58900, purchases: 31 },
      { name: "Nadia Chami", spent: 56200, purchases: 14 },
      { name: "Omar Sleiman", spent: 54800, purchases: 11 },
      { name: "Samer Khoury", spent: 52100, purchases: 16 },
      { name: "Hala Jaber", spent: 51400, purchases: 8 },
      { name: "Rim Awada", spent: 50300, purchases: 9 },
    ],
  },
  {
    name: "SILVER",
    minLabel: "$25K+",
    color: "var(--admin-purple)",
    bg: "rgba(155, 141, 230, 0.12)",
    count: 96,
    total: 5800000,
    members: [
      { name: "Hassan Fakih", spent: 34800, purchases: 14 },
      { name: "Nour Yamani", spent: 34200, purchases: 12 },
      { name: "Dana Itani", spent: 33600, purchases: 7 },
      { name: "Samia Farhat", spent: 33100, purchases: 19 },
      { name: "Rana Mayta", spent: 32700, purchases: 8 },
      { name: "Mohamad Houchaymi", spent: 32200, purchases: 15 },
      { name: "Heba Amire", spent: 31800, purchases: 11 },
      { name: "Randa Rahal", spent: 31300, purchases: 9 },
      { name: "Nisreen Sleiman", spent: 30900, purchases: 6 },
      { name: "Bilal Saad", spent: 30400, purchases: 10 },
    ],
  },
  {
    name: "BRONZE",
    minLabel: "$8K+",
    color: "var(--admin-blue)",
    bg: "rgba(91, 163, 230, 0.12)",
    count: 318,
    total: 7400000,
    members: [
      { name: "Maya Khalifeh", spent: 22400, purchases: 7 },
      { name: "Tarek Mansour", spent: 19800, purchases: 5 },
      { name: "Lina Hares", spent: 17200, purchases: 8 },
      { name: "Jad Aoun", spent: 15600, purchases: 4 },
      { name: "Farah Zein", spent: 13900, purchases: 6 },
      { name: "Karim Daher", spent: 12400, purchases: 3 },
      { name: "Yara Salame", spent: 11200, purchases: 5 },
      { name: "Rami Hodroj", spent: 9800, purchases: 4 },
      { name: "Lara Bizri", spent: 8900, purchases: 3 },
      { name: "Ziad Matar", spent: 8200, purchases: 2 },
    ],
  },
  {
    name: "REGULAR",
    minLabel: "under $8K",
    color: "var(--admin-t4)",
    bg: "var(--admin-bg4)",
    count: 942,
    total: 4900000,
    members: [
      { name: "Sami Ghanem", spent: 7400, purchases: 3 },
      { name: "Dina Asmar", spent: 6800, purchases: 2 },
      { name: "Fadi Nasr", spent: 5900, purchases: 3 },
      { name: "Maha Tabet", spent: 5100, purchases: 2 },
      { name: "Hadi Younes", spent: 4600, purchases: 2 },
      { name: "Rita Abou Jaoude", spent: 3900, purchases: 1 },
      { name: "Wassim Hage", spent: 3200, purchases: 2 },
      { name: "Carla Saliba", spent: 2800, purchases: 1 },
      { name: "Marwa Dia", spent: 1900, purchases: 1 },
      { name: "Georges Azar", spent: 950, purchases: 1 },
    ],
  },
];

/* ───────── going quiet — high value, no recent purchase ───────── */

export const AT_RISK: AtRiskCustomer[] = [
  { name: "Layla Hamdan", lifetime: 84200, purchases: 18, daysSinceLastPurchase: 142 },
  { name: "Khaled Nasser", lifetime: 61800, purchases: 12, daysSinceLastPurchase: 118 },
  { name: "Rim Awada", lifetime: 48300, purchases: 9, daysSinceLastPurchase: 97 },
  { name: "Hassan Fakih", lifetime: 37500, purchases: 14, daysSinceLastPurchase: 93 },
  { name: "Dana Itani", lifetime: 29100, purchases: 7, daysSinceLastPurchase: 91 },
  { name: "Samer Khoury", lifetime: 52100, purchases: 16, daysSinceLastPurchase: 104 },
  { name: "Hala Jaber", lifetime: 51400, purchases: 8, daysSinceLastPurchase: 127 },
  { name: "Nadia Chami", lifetime: 56200, purchases: 14, daysSinceLastPurchase: 96 },
  { name: "Omar Sleiman", lifetime: 54800, purchases: 11, daysSinceLastPurchase: 90 },
  { name: "Maya Khalifeh", lifetime: 22400, purchases: 7, daysSinceLastPurchase: 112 },
  { name: "Tarek Mansour", lifetime: 19800, purchases: 5, daysSinceLastPurchase: 151 },
  { name: "Lina Hares", lifetime: 17200, purchases: 8, daysSinceLastPurchase: 95 },
  { name: "Jad Aoun", lifetime: 15600, purchases: 4, daysSinceLastPurchase: 134 },
  { name: "Farah Zein", lifetime: 13900, purchases: 6, daysSinceLastPurchase: 92 },
  { name: "Karim Daher", lifetime: 12400, purchases: 3, daysSinceLastPurchase: 108 },
].sort((a, b) => b.lifetime - a.lifetime);
