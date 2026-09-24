import { useState } from "react";
import { FaExclamationTriangle, FaUsers } from "react-icons/fa";
import {
  getAtRiskCustomers,
  getCustomerActivityStats,
  getCustomerBaseStats,
  getCustomerTiers,
  getNewCustomersChart,
  getTopCustomersReport,
} from "../../../apis/customersReports.api";
import ReportStatCard from "../../../components/cards/ReportStatCard/ReportStatCard";
import RevenueBarChart from "../../../components/charts/RevenueBarChart/RevenueBarChart";
import SplitBarRow from "../../../components/charts/SplitBarRow/SplitBarRow";
import TierBarRow from "../../../components/charts/TierBarRow/TierBarRow";
import ReportListPanel from "../../../components/ReportListPanel/ReportListPanel";
import type { ReportListRow } from "../../../components/ReportListPanel/ReportListPanel.type";
import CustomTable from "../../../components/tables/CustomTable/CustomTable";
import type { TableHeader } from "../../../components/tables/CustomTable/CustomTable";
import useLocalApi from "../../../hooks/useLocalApi";
import TierMembersModal from "./TierMembersModal/TierMembersModal";
import type {
  AtRiskCustomer,
  ChartDataPoint,
  CustomerActivityStats,
  CustomerBaseStats,
  CustomerReportRow,
  CustomerTier,
  DateRange,
  Period,
} from "./CustomersReports.type";
import {
  PERIOD_LABELS,
  TIER_STYLES,
  fmtCurrency,
  formatLastPurchase,
  formatRangeLabel,
  formatSince,
  getChartGranularity,
  getCustomRange,
  getPeriodRange,
} from "./CustomersReports.utils";
import "./customersReports.scss";

const PERIOD_BUTTONS: Period[] = ["today", "week", "month", "year", "all"];

const todayStr = new Date().toISOString().slice(0, 10);

const CustomersReports = () => {
  const [period, setPeriod] = useState<Period>("month");
  const [dateFrom, setDateFrom] = useState(todayStr);
  const [dateTo, setDateTo] = useState(todayStr);
  const [appliedRange, setAppliedRange] = useState<DateRange | null>(null);
  const [search, setSearch] = useState("");
  const [openTier, setOpenTier] = useState<CustomerTier | null>(null);

  const handleSetPeriod = (p: Period) => {
    setPeriod(p);
    setAppliedRange(null);
  };

  const handleApplyRange = () => {
    if (!dateFrom || !dateTo) return;
    setAppliedRange({ dateFrom, dateTo });
    setPeriod("custom");
  };

  const activeRange: DateRange =
    period === "custom" && appliedRange
      ? getCustomRange(appliedRange.dateFrom, appliedRange.dateTo)
      : getPeriodRange(period as Exclude<Period, "custom">);

  const periodLabel =
    period === "custom" && appliedRange
      ? formatRangeLabel(appliedRange.dateFrom, appliedRange.dateTo)
      : PERIOD_LABELS[period];

  const granularity = getChartGranularity(period, activeRange);

  /* ── Customer base (not period-filtered) ─────────────────────── */

  const { data: baseStats } = useLocalApi({
    apiToCall: () => getCustomerBaseStats(),
    dataInitalValue: {},
  }) as { data: Partial<CustomerBaseStats> };

  const { data: tiers } = useLocalApi({
    apiToCall: () => getCustomerTiers(),
  }) as { data: CustomerTier[] };

  const { data: atRisk } = useLocalApi({
    apiToCall: () => getAtRiskCustomers(),
  }) as { data: AtRiskCustomer[] };

  /* ── Activity (period-filtered) ──────────────────────────────── */

  const { data: activity } = useLocalApi({
    apiToCall: (data) => getCustomerActivityStats(data.payload),
    payload: { dateFrom: activeRange.dateFrom, dateTo: activeRange.dateTo },
    dataInitalValue: {},
    effectDependency: [period, appliedRange],
  }) as { data: Partial<CustomerActivityStats> };

  const { data: chartData } = useLocalApi({
    apiToCall: (data) => getNewCustomersChart(data.payload),
    payload: { dateFrom: activeRange.dateFrom, dateTo: activeRange.dateTo, granularity },
    effectDependency: [period, appliedRange],
  }) as { data: ChartDataPoint[] };

  const { data: topCustomers } = useLocalApi({
    apiToCall: (data) => getTopCustomersReport(data.payload),
    payload: { dateFrom: activeRange.dateFrom, dateTo: activeRange.dateTo, search },
    effectDependency: [period, appliedRange, search],
  }) as { data: CustomerReportRow[] };

  const maxTierTotal = Math.max(...tiers.map((t) => t.total), 1);

  const riskRows: ReportListRow[] = atRisk.map((r) => ({
    key: r.name,
    primary: r.name,
    secondary: `${fmtCurrency(r.lifetime)} lifetime · ${r.purchases} purchases`,
    value: `${r.daysSinceLastPurchase} days`,
    valueColor: r.daysSinceLastPurchase >= 120 ? "var(--admin-red)" : "var(--admin-amber)",
    valueBg: r.daysSinceLastPurchase >= 120 ? "rgba(230, 91, 91, 0.12)" : "rgba(230, 162, 60, 0.12)",
  }));

  const revenue = activity.revenue ?? 0;
  const newRevenue = activity.newRevenue ?? 0;
  const returningRevenue = activity.returningRevenue ?? 0;
  const totalRev = newRevenue + returningRevenue;
  const newPct = totalRev > 0 ? Math.round((newRevenue / totalRev) * 100) : 0;
  const returningPct = 100 - newPct;

  const rows = topCustomers;

  const headers: TableHeader[] = [
    { key: "name", label: "Customer" },
    { key: "phone", label: "Phone" },
    { key: "purchases", label: "Purchases", align: "right" },
    { key: "items", label: "Items", align: "right" },
    { key: "spent", label: "Spent", align: "right" },
    { key: "avgDiscount", label: "Avg discount", align: "right" },
    { key: "since", label: "Customer since" },
    { key: "lastPurchase", label: "Last purchase" },
  ];

  const tableData = rows.map((c) => ({
    name: <span className="cr-name">{c.name}</span>,
    phone: <span className="cr-muted">{c.phone}</span>,
    purchases: <span className="num">{c.purchases}</span>,
    items: <span className="num">{c.items}</span>,
    spent: (
      <span className="num" style={{ color: "var(--admin-green)" }}>
        {fmtCurrency(c.spent)}
      </span>
    ),
    avgDiscount: (
      <span
        className="num"
        style={{
          color:
            c.avgDiscount >= 2.5
              ? "var(--admin-red)"
              : c.avgDiscount >= 1.5
                ? "var(--admin-amber)"
                : "var(--admin-t3)",
        }}
      >
        {c.avgDiscount.toFixed(1)}%
      </span>
    ),
    since: formatSince(c.since),
    lastPurchase: formatLastPurchase(c.lastPurchase),
  }));

  return (
    <div id="customers-reports" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaUsers className="icon" />
          <span>Customers reports</span>
        </h1>
      </div>

      <div className="sec-title">Customer base right now</div>
      <div className="stats">
        <ReportStatCard
          label="Total customers"
          value={(baseStats.totalCustomers ?? 0).toLocaleString()}
          accentColor="var(--admin-blue)"
          sub={`+${baseStats.newThisYear ?? 0} this year`}
        />
        <ReportStatCard
          label="Repeat customers"
          value={`${baseStats.repeatRate ?? 0}%`}
          valueColor="var(--admin-green)"
          accentColor="var(--admin-green)"
          sub={`${baseStats.repeatCount ?? 0} bought more than once`}
        />
        <ReportStatCard
          label="Avg lifetime value"
          value={fmtCurrency(baseStats.avgLifetimeValue ?? 0)}
          accentColor="var(--admin-gold)"
          sub="per customer, all time"
        />
        <ReportStatCard
          label="Going quiet"
          value={`${baseStats.goingQuiet ?? 0}`}
          valueColor="var(--admin-red)"
          accentColor="var(--admin-red)"
          sub="big spenders, 90+ days silent"
        />
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Customer tiers</span>
            <span className="panel-sub">by lifetime spend — tap a tier to see who's in it</span>
          </div>
          {tiers.map((t) => {
            const style = TIER_STYLES[t.name] ?? TIER_STYLES.REGULAR;
            return (
              <TierBarRow
                key={t.name}
                badgeLabel={t.name}
                badgeColor={style.color}
                badgeBg={style.bg}
                percent={Math.round((t.total / maxTierTotal) * 100)}
                amountLabel={`${t.count} customers · ${fmtCurrency(t.total)} · ${t.minLabel}`}
                onClick={() => setOpenTier(t)}
              />
            );
          })}
        </div>

        <ReportListPanel
          title={
            <>
              <FaExclamationTriangle style={{ color: "var(--admin-red)" }} /> Going quiet — worth a call
            </>
          }
          subtitle="high value, no recent purchase"
          rows={riskRows}
          emptyMessage="No customers at risk"
        />
      </div>

      <div className="sec-title" style={{ marginTop: 4 }}>
        Activity — filtered by period
      </div>
      <div className="controls">
        <div className="ctrl-group">
          {PERIOD_BUTTONS.map((p) => (
            <button
              key={p}
              className={`period-btn ${period === p ? "active" : ""}`}
              onClick={() => handleSetPeriod(p)}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
        <div className="ctrl-group range-inputs">
          <input
            type="date"
            className="date-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <span className="ctrl-label">to</span>
          <input
            type="date"
            className="date-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <button className="apply-btn" onClick={handleApplyRange}>
            Apply
          </button>
        </div>
      </div>

      <div className="stats">
        <ReportStatCard
          label="Active customers"
          value={(activity.active ?? 0).toLocaleString()}
          valueColor="var(--admin-blue)"
          accentColor="var(--admin-blue)"
          sub={`bought in ${periodLabel.toLowerCase()}`}
        />
        <ReportStatCard
          label="New customers"
          value={(activity.newCustomers ?? 0).toLocaleString()}
          valueColor="var(--admin-green)"
          accentColor="var(--admin-green)"
          sub="first purchase"
        />
        <ReportStatCard
          label="Avg spend per customer"
          value={fmtCurrency(revenue / Math.max(1, activity.active ?? 0))}
          accentColor="var(--admin-gold)"
          sub="in period"
        />
        <ReportStatCard
          label="Avg discount given"
          value={`${(activity.avgDiscount ?? 0).toFixed(1)}%`}
          valueColor="var(--admin-purple)"
          accentColor="var(--admin-purple)"
          sub="across all sales"
        />
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">New customers over time</span>
            <span className="panel-sub">
              {(activity.newCustomers ?? 0).toLocaleString()} new — {periodLabel.toLowerCase()}
            </span>
          </div>
          <div className="chart-container">
            {chartData.length > 0 ? (
              <RevenueBarChart data={chartData} formatValue={(v) => `${v}`} />
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">New vs returning revenue</span>
            <span className="panel-sub">{fmtCurrency(totalRev)} total</span>
          </div>
          <div className="mix-bars">
            <SplitBarRow
              label="Returning"
              percentage={returningPct}
              amountLabel={fmtCurrency(returningRevenue)}
              color="var(--admin-gold)"
            />
            <SplitBarRow
              label="New"
              percentage={Math.max(3, newPct)}
              amountLabel={fmtCurrency(newRevenue)}
              color="var(--admin-green)"
            />
          </div>
          <div className="mini-divider mix-note">
            {period === "all"
              ? "All-time view counts every customer as new on their first purchase."
              : `Returning customers drive ${returningPct}% of revenue — repeat business is the core of the store.`}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">Top customers</span>
          <div className="tbl-tools">
            <input
              type="text"
              className="search-input"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="panel-sub">{rows.length} shown</span>
          </div>
        </div>
        <div className="tbl-scroll">
          <CustomTable headers={headers} data={tableData} />
        </div>
      </div>

      <TierMembersModal show={!!openTier} tier={openTier} onClose={() => setOpenTier(null)} />
    </div>
  );
};

export default CustomersReports;
