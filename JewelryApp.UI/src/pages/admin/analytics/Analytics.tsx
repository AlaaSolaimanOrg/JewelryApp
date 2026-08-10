import { useEffect, useState } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FaChartBar, FaChartLine, FaSync, FaUser } from "react-icons/fa";

import AnalyticsSummary from "./analyticsSummary/AnalyticsSummary";
import { ReportType } from "../../../types/enums";
import { useTheme } from "../../../context/ThemeContext";
import useLocalApi from "../../../hooks/useLocalApi";
import HorizontalBarRow from "../../../components/charts/HorizontalBarRow/HorizontalBarRow";
import RevenueBarChart from "../../../components/charts/RevenueBarChart/RevenueBarChart";
import SplitBarRow from "../../../components/charts/SplitBarRow/SplitBarRow";
import {
  getCustomerRetention,
  getPriceOverTime,
  getSalesByCategory,
  getSalesOverTime,
  getStaffPerformance,
} from "../../../apis/analytics.api/analytics.api";
import {
  KARAT_LINE_COLORS,
  REPORT_TYPE_OPTIONS,
  RETENTION_COLORS,
  computePercent,
  fmtCurrency,
  fmtNumber,
} from "./Analytics.utils";
import "./analytics.scss";

export interface SalesByCategoryItem {
  categoryName: string;
  revenue: number;
  percentage: number;
}

export interface SalesOverTimeItem {
  dateLabel: string;
  date: string;
  revenue: number;
  unitsSold: number;
}

export interface StaffPerformanceItem {
  staffName: string;
  salesAmount: number;
  commission: number;
}

export interface CustomerRetentionItem {
  label: string;
  count: number;
  percentage: number;
}

export interface PriceOverTimeAnalytic {
  dateLabel: string;
  karat18: number;
  karat21: number;
  karat22: number;
  karat24: number;
}

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const KARAT_TYPES = [18, 21, 22, 24];

const Analytics = () => {
  const { theme } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [reportType, setReportType] = useState<ReportType>(ReportType.AllTime);
  const [appliedFilters, setAppliedFilters] = useState<{
    dateFrom: string;
    dateTo: string;
    reportType: ReportType;
  }>({
    dateFrom: "",
    dateTo: "",
    reportType: ReportType.AllTime,
  });

  const { data: salesByCategory } = useLocalApi({
    apiToCall: (data) => getSalesByCategory(data.payload),
    payload: {
      dateFrom: appliedFilters.dateFrom,
      dateTo: appliedFilters.dateTo,
      reportType:
        appliedFilters.reportType == ReportType.AllTime
          ? null
          : appliedFilters.reportType,
    },
    effectDependency: [appliedFilters, refreshKey],
  }) as { data: SalesByCategoryItem[] };

  const { data: salesOverTime } = useLocalApi({
    apiToCall: (data) => getSalesOverTime(data.payload),
    payload: {
      dateFrom: appliedFilters.dateFrom,
      dateTo: appliedFilters.dateTo,
      reportType:
        appliedFilters.reportType == ReportType.AllTime
          ? null
          : appliedFilters.reportType,
    },
    effectDependency: [appliedFilters, refreshKey],
  }) as { data: SalesOverTimeItem[] };

  const { data: staffPerformance } = useLocalApi({
    apiToCall: (data) => getStaffPerformance(data.payload),
    payload: {
      dateFrom: appliedFilters.dateFrom,
      dateTo: appliedFilters.dateTo,
      reportType:
        appliedFilters.reportType == ReportType.AllTime
          ? null
          : appliedFilters.reportType,
    },
    effectDependency: [appliedFilters, refreshKey],
  }) as { data: StaffPerformanceItem[] };

  const { data: priceOverTimeAnalytics } = useLocalApi({
    apiToCall: (data) => getPriceOverTime(data.payload),
    payload: {
      dateFrom: appliedFilters.dateFrom,
      dateTo: appliedFilters.dateTo,
      reportType:
        appliedFilters.reportType == ReportType.AllTime
          ? null
          : appliedFilters.reportType,
    },
    effectDependency: [appliedFilters, refreshKey],
  }) as { data: PriceOverTimeAnalytic[] };

  const { data: customerRetention } = useLocalApi({
    apiToCall: (data) => getCustomerRetention(data.payload),
    payload: {
      dateFrom: appliedFilters.dateFrom,
      dateTo: appliedFilters.dateTo,
      reportType:
        appliedFilters.reportType == ReportType.AllTime
          ? null
          : appliedFilters.reportType,
    },
    effectDependency: [appliedFilters, refreshKey],
  }) as { data: CustomerRetentionItem[] };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const applyFilters = () =>
    setAppliedFilters({ dateFrom, dateTo, reportType });

  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setReportType(ReportType.AllTime);
    setAppliedFilters({
      dateFrom: "",
      dateTo: "",
      reportType: ReportType.AllTime,
    });
  };

  const maxCategoryRevenue = Math.max(
    ...salesByCategory.map((c) => c.revenue),
    1,
  );
  const maxStaffSales = Math.max(
    ...staffPerformance.map((s) => s.salesAmount),
    1,
  );

  const isDark = theme !== "light";
  const gridColor = isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";
  const tickColor = isDark ? "#888" : "#6b6b70";

  const priceOverTimeData = {
    labels: priceOverTimeAnalytics.map((d) => d.dateLabel),
    datasets: KARAT_TYPES.map((karat) => ({
      label: `${karat}K`,
      data: priceOverTimeAnalytics.map((d) => d[`karat${karat}`]),
      borderColor: KARAT_LINE_COLORS[karat],
      backgroundColor: `${KARAT_LINE_COLORS[karat]}33`,
      tension: 0.4,
      fill: false,
      pointRadius: 3,
      borderWidth: 2,
    })),
  };

  const priceOverTimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: tickColor, boxWidth: 12, padding: 14 },
      },
    },
    scales: {
      y: { beginAtZero: false, grid: { color: gridColor }, ticks: { color: tickColor } },
      x: { grid: { display: false }, ticks: { color: tickColor } },
    },
  };

  return (
    <div id="analytics" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaChartBar className="icon" />
          <span>Analytics &amp; Graphs</span>
        </h1>
        <div className="page-actions">
          <button className="refresh-btn" onClick={() => setRefreshKey((k) => k + 1)}>
            <FaSync size={12} /> Refresh
          </button>
        </div>
      </div>

      <div className="period-bar">
        {REPORT_TYPE_OPTIONS.map((rt) => (
          <button
            key={rt.value}
            className={`pbtn ${reportType === rt.value ? "active" : ""}`}
            onClick={() => setReportType(rt.value)}
          >
            {rt.label}
          </button>
        ))}
        <div className="range-inputs">
          <input
            type="date"
            className="date-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <span className="range-sep">to</span>
          <input
            type="date"
            className="date-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <button className="apply-btn" onClick={applyFilters}>
            Apply
          </button>
          <button className="reset-btn" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      <AnalyticsSummary appliedFilters={appliedFilters} refreshKey={refreshKey} />

      <div className="grid2">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Revenue over time</span>
            <span className="panel-sub">{salesOverTime.length} data points</span>
          </div>
          <div className="chart-container">
            {salesOverTime.length > 0 ? (
              <RevenueBarChart
                data={salesOverTime.map((d) => ({ label: d.dateLabel, value: d.revenue }))}
                formatValue={fmtCurrency}
              />
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Units sold over time</span>
          </div>
          <div className="chart-container">
            {salesOverTime.length > 0 ? (
              <RevenueBarChart
                data={salesOverTime.map((d) => ({ label: d.dateLabel, value: d.unitsSold }))}
                formatValue={fmtNumber}
              />
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Sales by category</span>
            <span className="panel-sub">share of revenue</span>
          </div>
          {salesByCategory.length > 0 ? (
            salesByCategory.map((c) => (
              <HorizontalBarRow
                key={c.categoryName}
                label={c.categoryName}
                percent={computePercent(c.revenue, maxCategoryRevenue)}
                color="var(--admin-gold)"
                amountLabel={`${fmtCurrency(c.revenue)} · ${Math.round(c.percentage)}%`}
              />
            ))
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Customer retention</span>
            <span className="panel-sub">new vs returning</span>
          </div>
          {customerRetention?.length > 0 ? (
            <div className="mix-bars">
              {customerRetention.map((c, i) => (
                <SplitBarRow
                  key={c.label}
                  label={`${c.label} (${c.count})`}
                  percentage={c.percentage}
                  amountLabel={`${Math.round(c.percentage)}%`}
                  color={RETENTION_COLORS[i % RETENTION_COLORS.length]}
                />
              ))}
            </div>
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">
            <FaUser className="icon" /> Staff performance
          </span>
          <span className="panel-sub">sales · commission</span>
        </div>
        {staffPerformance.length > 0 ? (
          staffPerformance.map((s) => (
            <HorizontalBarRow
              key={s.staffName}
              label={s.staffName}
              percent={computePercent(s.salesAmount, maxStaffSales)}
              color="var(--admin-gold)"
              amountLabel={`${fmtCurrency(s.salesAmount)} sales · ${fmtCurrency(s.commission)} commission`}
            />
          ))
        ) : (
          <div className="no-data">No data available</div>
        )}
      </div>

      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">
            <FaChartLine className="icon" /> Gold price over time
          </span>
          <span className="panel-sub">by karat</span>
        </div>
        <div className="chart-container tall">
          {priceOverTimeAnalytics.length > 0 ? (
            <Line data={priceOverTimeData} options={priceOverTimeOptions} />
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
