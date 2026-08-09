import { useMemo, useState } from "react";
import { FaTools } from "react-icons/fa";
import ReportStatCard from "../../../components/cards/ReportStatCard/ReportStatCard";
import MiniStatCard from "../../../components/cards/MiniStatCard/MiniStatCard";
import RevenueBarChart from "../../../components/charts/RevenueBarChart/RevenueBarChart";
import ReportListPanel from "../../../components/ReportListPanel/ReportListPanel";
import type { ReportListRow } from "../../../components/ReportListPanel/ReportListPanel.type";
import type { DateRange, Period } from "./RepairsReports.type";
import {
  MOCK_REPAIRS,
  MONTHS,
  computeAlerts,
  computeAvgHistory,
  computeChart,
  computeCustomerRevenue,
  computeHealth,
  computeLongestInShop,
  computeRepeatCustomers,
  computeStats,
  filterByPeriod,
  fmtShort,
} from "./RepairsReports.utils";
import "./repairsReports.scss";

const YEARS = [2026, 2025];

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

const RepairsReports = () => {
  const [period, setPeriod] = useState<Period>("month");
  const [selMonth, setSelMonth] = useState(5);
  const [selYear, setSelYear] = useState(2026);
  const [dateFrom, setDateFrom] = useState("2026-06-01");
  const [dateTo, setDateTo] = useState("2026-06-11");
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

  const data = useMemo(
    () => filterByPeriod(MOCK_REPAIRS, period, selMonth, selYear, appliedRange),
    [period, selMonth, selYear, appliedRange],
  );
  const completed = useMemo(
    () => data.filter((r) => r.status === "completed"),
    [data],
  );
  const cancelled = useMemo(
    () => data.filter((r) => r.status === "cancelled"),
    [data],
  );

  const stats = useMemo(
    () => computeStats(MOCK_REPAIRS, data, period, selMonth, selYear, appliedRange),
    [data, period, selMonth, selYear, appliedRange],
  );
  const alerts = useMemo(() => computeAlerts(MOCK_REPAIRS), []);
  const chart = useMemo(
    () => computeChart(completed, period, selMonth, selYear, appliedRange),
    [completed, period, selMonth, selYear, appliedRange],
  );
  const health = useMemo(
    () => computeHealth(data, completed, cancelled),
    [data, completed, cancelled],
  );

  const custRows: ReportListRow[] = useMemo(
    () =>
      computeCustomerRevenue(data, custSearch).map((c) => ({
        key: c.name,
        primary: c.name,
        secondary: `${c.count} repair${c.count !== 1 ? "s" : ""}`,
        value: fmtShort(c.revenue),
        valueColor: "var(--admin-green)",
      })),
    [data, custSearch],
  );

  const avgHistoryRows: ReportListRow[] = useMemo(
    () =>
      computeAvgHistory(MOCK_REPAIRS).map((h) => ({
        key: h.label,
        primary: h.label,
        secondary: `${h.count} repairs · ${fmtShort(h.total)} total`,
        value: fmtShort(h.avg),
        valueColor: "var(--admin-blue)",
      })),
    [],
  );

  const repeatRows: ReportListRow[] = useMemo(
    () =>
      computeRepeatCustomers(MOCK_REPAIRS).map((c) => ({
        key: c.name,
        primary: c.name,
        value: `${c.count} repair${c.count !== 1 ? "s" : ""}`,
        valueColor: "var(--admin-blue)",
      })),
    [],
  );

  const longestRows: ReportListRow[] = useMemo(
    () =>
      computeLongestInShop(MOCK_REPAIRS).map((r) => ({
        key: r.id,
        primary: r.customer,
        secondary: r.id,
        value: `${r.days} day${r.days !== 1 ? "s" : ""}`,
        valueColor:
          r.days >= 7
            ? "var(--admin-red)"
            : r.days >= 4
              ? "var(--admin-amber)"
              : "var(--admin-t3)",
      })),
    [],
  );

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
          value={`${stats.repairCount}`}
          sub={
            <>
              {stats.periodLabel}
              {changeBadge(stats.repairCount, stats.prevRepairCount)}
            </>
          }
        />
        <ReportStatCard
          label="Revenue collected"
          value={fmtShort(stats.totalRevenue)}
          valueColor="var(--admin-green)"
          sub={
            <>
              {stats.paidCount} paid
              {stats.prevRevenue !== null && (
                <>
                  {changeBadge(stats.totalRevenue, stats.prevRevenue)} vs{" "}
                  {stats.prevLabel}
                </>
              )}
            </>
          }
        />
        <ReportStatCard
          label="Expected revenue"
          value={fmtShort(stats.totalAll)}
          valueColor="var(--admin-blue)"
          sub="collected + unpaid"
        />
        <ReportStatCard
          label="Unpaid"
          value={fmtShort(stats.unpaidTotal)}
          valueColor={stats.unpaidTotal > 0 ? "var(--admin-red)" : undefined}
          sub={`${stats.unpaidCount} repair${stats.unpaidCount !== 1 ? "s" : ""}`}
        />
        <ReportStatCard
          label="Avg repair value"
          value={fmtShort(stats.avgVal)}
          sub="per completed"
        />
        <ReportStatCard
          label="Avg turnaround"
          value={stats.avgTurn > 0 ? `${stats.avgTurn.toFixed(1)}d` : "—"}
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
        <div className="section-title">{chart.title}</div>
        <div className="chart-container">
          <RevenueBarChart data={chart.data} formatValue={fmtShort} />
        </div>
      </div>

      <div className="health-row">
        <MiniStatCard
          label="On-time completion"
          value={`${health.onTimeRate}%`}
          valueColor={
            health.onTimeRate >= 75
              ? "var(--admin-green)"
              : health.onTimeRate >= 50
                ? "var(--admin-amber)"
                : "var(--admin-red)"
          }
          sub={`${health.onTimeCount} of ${health.completedCount} on time`}
        />
        <MiniStatCard
          label="Collection rate"
          value={`${health.collectRate}%`}
          valueColor={
            health.collectRate >= 80
              ? "var(--admin-green)"
              : health.collectRate >= 60
                ? "var(--admin-amber)"
                : "var(--admin-red)"
          }
          sub="paid at completion"
        />
        <MiniStatCard
          label="Cancellation rate"
          value={`${health.cancelRate}%`}
          valueColor={
            health.cancelRate <= 10 ? "var(--admin-green)" : "var(--admin-red)"
          }
          sub={`${health.cancelCount} of ${health.totalCount} cancelled`}
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
