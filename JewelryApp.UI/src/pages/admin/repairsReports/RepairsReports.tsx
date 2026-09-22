import { useState } from "react";
import { FaTools } from "react-icons/fa";
import {
  getAvgRepairValueHistory,
  getLongestInShop,
  getRepairAlerts,
  getRepairHealthMetrics,
  getRepairsByCustomer,
  getRepairsRevenueChart,
  getRepairsStats,
  getRepeatCustomers,
} from "../../../apis/repairsReports.api";
import ReportStatCard from "../../../components/cards/ReportStatCard/ReportStatCard";
import MiniStatCard from "../../../components/cards/MiniStatCard/MiniStatCard";
import RevenueBarChart from "../../../components/charts/RevenueBarChart/RevenueBarChart";
import ReportListPanel from "../../../components/ReportListPanel/ReportListPanel";
import type { ReportListRow } from "../../../components/ReportListPanel/ReportListPanel.type";
import useLocalApi from "../../../hooks/useLocalApi";
import { getYearsSince } from "../../../utils";
import type {
  AvgValueHistoryRow,
  ChartDataPoint,
  CustomerRevenueRow,
  DateRange,
  LongestInShopRow,
  Period,
  RepairAlert,
  RepairHealthMetrics,
  RepairsStats,
  RepeatCustomerRow,
} from "./RepairsReports.type";
import {
  MONTHS,
  fmtShort,
  getChartGranularity,
  getChartTitle,
  getPeriodLabel,
  getPeriodRange,
  getPreviousPeriodLabel,
  getPreviousPeriodRange,
} from "./RepairsReports.utils";
import "./repairsReports.scss";

const YEARS = getYearsSince(2025);

function changeBadge(cur: number, prev: number | null) {
  if (prev === null) return null;
  if (prev === 0) {
    return cur > 0 ? (
      <span style={{ color: "var(--admin-green)" }}> ▲ new</span>
    ) : null;
  }
  const pct = Math.round(((cur - prev) / prev) * 100);
  if (pct === 0) {
    return <span style={{ color: "var(--admin-t4)" }}> = same</span>;
  }
  return (
    <span style={{ color: pct > 0 ? "var(--admin-green)" : "var(--admin-red)" }}>
      {" "}
      {pct > 0 ? "▲" : "▼"} {Math.abs(pct)}%
    </span>
  );
}

const today = new Date();
const todayStr = today.toISOString().slice(0, 10);

const RepairsReports = () => {
  const [period, setPeriod] = useState<Period>("month");
  const [selMonth, setSelMonth] = useState(today.getMonth());
  const [selYear, setSelYear] = useState(today.getFullYear());
  const [dateFrom, setDateFrom] = useState(todayStr);
  const [dateTo, setDateTo] = useState(todayStr);
  const [appliedRange, setAppliedRange] = useState<DateRange | null>(null);
  const [custSearch, setCustSearch] = useState("");

  const handleSetPeriod = (p: Period) => {
    setPeriod(p);
    setAppliedRange(null);
  };

  const handleApplyRange = () => {
    if (!dateFrom || !dateTo) return;
    const range =
      dateTo < dateFrom
        ? { dateFrom: dateTo, dateTo: dateFrom }
        : { dateFrom, dateTo };
    setAppliedRange(range);
    setPeriod("custom");
  };

  const activeRange: DateRange | null =
    period === "custom" ? appliedRange : getPeriodRange(period, selMonth, selYear);
  const prevRange =
    period === "month" || period === "year" ? getPreviousPeriodRange(period, selMonth, selYear) : null;

  const periodLabel = getPeriodLabel(period, selMonth, selYear, appliedRange);
  const prevLabel = period === "month" || period === "year" ? getPreviousPeriodLabel(period, selMonth, selYear) : "";
  const granularity = getChartGranularity(period, activeRange);
  const chartTitle = getChartTitle(period, selMonth, selYear, appliedRange);

  const { data: stats } = useLocalApi({
    apiToCall: (data) => getRepairsStats(data.payload),
    payload: { dateFrom: activeRange?.dateFrom, dateTo: activeRange?.dateTo },
    dataInitalValue: {},
    effectDependency: [period, selMonth, selYear, appliedRange],
  }) as { data: Partial<RepairsStats> };

  const { data: prevStats } = useLocalApi({
    apiToCall: (data) => getRepairsStats(data.payload),
    payload: { dateFrom: prevRange?.dateFrom, dateTo: prevRange?.dateTo },
    dataInitalValue: {},
    extraEffectCheck: !!prevRange,
    effectDependency: [period, selMonth, selYear],
  }) as { data: Partial<RepairsStats> };

  const { data: health } = useLocalApi({
    apiToCall: (data) => getRepairHealthMetrics(data.payload),
    payload: { dateFrom: activeRange?.dateFrom, dateTo: activeRange?.dateTo },
    dataInitalValue: {},
    effectDependency: [period, selMonth, selYear, appliedRange],
  }) as { data: Partial<RepairHealthMetrics> };

  const { data: alerts } = useLocalApi({
    apiToCall: () => getRepairAlerts(),
  }) as { data: RepairAlert[] };

  const { data: chartData } = useLocalApi({
    apiToCall: (data) => getRepairsRevenueChart(data.payload),
    payload: { dateFrom: activeRange?.dateFrom, dateTo: activeRange?.dateTo, granularity },
    effectDependency: [period, selMonth, selYear, appliedRange],
  }) as { data: ChartDataPoint[] };

  const { data: custRevenue } = useLocalApi({
    apiToCall: (data) => getRepairsByCustomer(data.payload),
    payload: { dateFrom: activeRange?.dateFrom, dateTo: activeRange?.dateTo, search: custSearch },
    effectDependency: [period, selMonth, selYear, appliedRange, custSearch],
  }) as { data: CustomerRevenueRow[] };

  const { data: avgHistory } = useLocalApi({
    apiToCall: () => getAvgRepairValueHistory(),
  }) as { data: AvgValueHistoryRow[] };

  const { data: repeatCustomers } = useLocalApi({
    apiToCall: () => getRepeatCustomers(),
  }) as { data: RepeatCustomerRow[] };

  const { data: longestInShop } = useLocalApi({
    apiToCall: () => getLongestInShop(),
  }) as { data: LongestInShopRow[] };

  const prevRepairCount = prevRange ? (prevStats.repairCount ?? null) : null;
  const prevRevenue = prevRange ? (prevStats.totalRevenue ?? null) : null;

  const custRows: ReportListRow[] = custRevenue.map((c) => ({
    key: c.name,
    primary: c.name,
    secondary: `${c.count} repair${c.count !== 1 ? "s" : ""}`,
    value: fmtShort(c.revenue),
    valueColor: "var(--admin-green)",
  }));

  const avgHistoryRows: ReportListRow[] = avgHistory.map((h) => ({
    key: h.label,
    primary: h.label,
    secondary: `${h.count} repairs · ${fmtShort(h.total)} total`,
    value: fmtShort(h.avg),
    valueColor: "var(--admin-blue)",
  }));

  const repeatRows: ReportListRow[] = repeatCustomers.map((c) => ({
    key: c.name,
    primary: c.name,
    value: `${c.count} repair${c.count !== 1 ? "s" : ""}`,
    valueColor: "var(--admin-blue)",
  }));

  const longestRows: ReportListRow[] = longestInShop.map((r) => ({
    key: r.repairId,
    primary: r.customer,
    secondary: r.repairId,
    value: `${r.days} day${r.days !== 1 ? "s" : ""}`,
    valueColor:
      r.days >= 7 ? "var(--admin-red)" : r.days >= 4 ? "var(--admin-amber)" : "var(--admin-t3)",
  }));

  return (
    <div id="repairs-reports" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaTools className="icon" />
          <span>Repairs reports</span>
        </h1>
      </div>

      <div className="controls">
        <div className="ctrl-group">
          <span className="ctrl-label">View:</span>
          {(["month", "year", "all"] as Period[]).map((p) => (
            <button
              key={p}
              className={`period-btn ${!appliedRange && period === p ? "active" : ""}`}
              onClick={() => handleSetPeriod(p)}
            >
              {p === "month" ? "Month" : p === "year" ? "Year" : "All time"}
            </button>
          ))}
        </div>

        {!appliedRange && period === "month" && (
          <div className="ctrl-group">
            <select
              className="ctrl-select"
              value={selMonth}
              onChange={(e) => setSelMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              className="ctrl-select"
              value={selYear}
              onChange={(e) => setSelYear(Number(e.target.value))}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}

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
          label="Total repairs"
          value={`${stats.repairCount ?? 0}`}
          sub={
            <>
              {periodLabel}
              {changeBadge(stats.repairCount ?? 0, prevRepairCount)}
            </>
          }
        />
        <ReportStatCard
          label="Revenue collected"
          value={fmtShort(stats.totalRevenue ?? 0)}
          valueColor="var(--admin-green)"
          sub={
            <>
              {stats.paidCount ?? 0} paid
              {prevRevenue !== null && (
                <>
                  {changeBadge(stats.totalRevenue ?? 0, prevRevenue)} vs {prevLabel}
                </>
              )}
            </>
          }
        />
        <ReportStatCard
          label="Expected revenue"
          value={fmtShort(stats.totalAll ?? 0)}
          valueColor="var(--admin-blue)"
          sub="collected + unpaid"
        />
        <ReportStatCard
          label="Unpaid"
          value={fmtShort(stats.unpaidTotal ?? 0)}
          valueColor={(stats.unpaidTotal ?? 0) > 0 ? "var(--admin-red)" : undefined}
          sub={`${stats.unpaidCount ?? 0} repair${(stats.unpaidCount ?? 0) !== 1 ? "s" : ""}`}
        />
        <ReportStatCard
          label="Avg repair value"
          value={fmtShort(stats.avgVal ?? 0)}
          sub="per completed"
        />
        <ReportStatCard
          label="Avg turnaround"
          value={(stats.avgTurn ?? 0) > 0 ? `${(stats.avgTurn ?? 0).toFixed(1)}d` : "—"}
          sub="order → pickup"
        />
      </div>

      {alerts.length > 0 && (
        <div className="alert-box">
          <div className="alert-title">⚠ Needs attention</div>
          {alerts.map((a) => (
            <div className="alert-item" key={a.repairId}>
              <span>
                {a.repairId} {a.customer} — {a.message}
              </span>
              <span>{fmtShort(a.cost)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="section">
        <div className="section-title">{chartTitle}</div>
        <div className="chart-container">
          <RevenueBarChart data={chartData} formatValue={fmtShort} />
        </div>
      </div>

      <div className="health-row">
        <MiniStatCard
          label="On-time completion"
          value={`${health.onTimeRate ?? 0}%`}
          valueColor={
            (health.onTimeRate ?? 0) >= 75
              ? "var(--admin-green)"
              : (health.onTimeRate ?? 0) >= 50
                ? "var(--admin-amber)"
                : "var(--admin-red)"
          }
          sub={`${health.onTimeCount ?? 0} of ${health.completedCount ?? 0} on time`}
        />
        <MiniStatCard
          label="Collection rate"
          value={`${health.collectRate ?? 0}%`}
          valueColor={
            (health.collectRate ?? 0) >= 80
              ? "var(--admin-green)"
              : (health.collectRate ?? 0) >= 60
                ? "var(--admin-amber)"
                : "var(--admin-red)"
          }
          sub="paid at completion"
        />
        <MiniStatCard
          label="Cancellation rate"
          value={`${health.cancelRate ?? 0}%`}
          valueColor={(health.cancelRate ?? 0) <= 10 ? "var(--admin-green)" : "var(--admin-red)"}
          sub={`${health.cancelCount ?? 0} of ${health.totalCount ?? 0} cancelled`}
        />
      </div>

      <div className="two-col">
        <ReportListPanel
          title="Revenue by customer"
          rows={custRows}
          emptyMessage="No customers found"
          search={{
            value: custSearch,
            onChange: setCustSearch,
            placeholder: "Search customer...",
          }}
        />
        <ReportListPanel
          title="Avg repair value history"
          rows={avgHistoryRows}
          emptyMessage="No data yet"
        />
      </div>

      <div className="two-col second-row">
        <ReportListPanel
          title="Repeat customers"
          rows={repeatRows}
          emptyMessage="No customers found"
        />
        <ReportListPanel
          title="Longest in shop (active)"
          rows={longestRows}
          emptyMessage="No active repairs"
        />
      </div>
    </div>
  );
};

export default RepairsReports;
